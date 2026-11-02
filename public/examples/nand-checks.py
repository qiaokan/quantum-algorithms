#!/usr/bin/env python3
"""Ideal finite span-program formula evaluation; Python 3 standard library only.

Run: python3 nand-checks.py
No quantum device or SDK is used. Fraction arithmetic certifies zero-bin
probabilities on all 16 inputs. Complex arithmetic computes the full QPE
measurement distribution. The fixed matrix is constructed before input bits.
"""
from fractions import Fraction as F
from itertools import product
from math import comb, hypot, pi
import cmath
import unittest


def transpose(a):
    return [list(row) for row in zip(*a)]


def multiply(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(len(b)))
             for j in range(len(b[0]))] for i in range(len(a))]


def apply(a, v):
    return [sum(x * y for x, y in zip(row, v)) for row in a]


def identity(n):
    return [[F(i == j) for j in range(n)] for i in range(n)]


def rank(a):
    """Exact row reduction, used independently to check the span predicate."""
    a = [[F(x) for x in row] for row in a]
    if not a or not a[0]:
        return 0
    pivot = 0
    for j in range(len(a[0])):
        row = next((i for i in range(pivot, len(a)) if a[i][j]), None)
        if row is None:
            continue
        a[pivot], a[row] = a[row], a[pivot]
        q = a[pivot][j]
        a[pivot] = [x / q for x in a[pivot]]
        for i in range(len(a)):
            if i != pivot:
                q = a[i][j]
                a[i] = [x - q * y for x, y in zip(a[i], a[pivot])]
        pivot += 1
        if pivot == len(a):
            break
    return pivot


TARGET = [F(1), F(0), F(0)]
VECTORS = [[F(x) for x in v] for v in
           [(1, 1, 0), (0, 1, 0), (1, 0, 1), (0, 0, 1)]]
A = transpose([[x / 2 for x in TARGET]] + VECTORS)
Q = transpose([[F(x) for x in q] for q in
               [(2, -1, 1, 0, 0), (2, 0, 0, -1, 1)]])
GRAM_INVERSE = [[F(3, 10), F(-1, 5)], [F(-1, 5), F(3, 10)]]
PROJECTOR = multiply(multiply(Q, GRAM_INVERSE), transpose(Q))
R = [[2 * PROJECTOR[i][j] - F(i == j) for j in range(5)]
     for i in range(5)]


def formula(bits):
    # Literal evaluation is used only as a verification reference.
    left_nand = 1 - bits[0] * bits[1]
    right_nand = 1 - bits[2] * bits[3]
    return 1 - left_nand * right_nand


def span_accepts(bits):
    cols = [v for bit, v in zip(bits, VECTORS) if bit]
    available = transpose(cols) if cols else [[] for _ in range(3)]
    with_target = [row + [t] for row, t in zip(available, TARGET)]
    return rank(available) == rank(with_target)


def walk(bits):
    signs = [1] + [2 * bit - 1 for bit in bits]
    return [[entry * signs[j] for j, entry in enumerate(row)] for row in R]


def powers(bits, m=8):
    u = walk(bits)
    v = [F(1)] + [F(0)] * 4
    history = []
    for _ in range(m):
        history.append(v)
        v = apply(u, v)
    return history


def zero_probability(bits, m=8):
    history = powers(bits, m)
    b0 = [sum(v[j] for v in history) / m for j in range(5)]
    return sum(x * x for x in b0)


def qpe_distribution(bits, m=8):
    history = powers(bits, m)
    vectors = [[sum(cmath.exp(-2j * pi * k * y / m) * float(history[k][j])
                    for k in range(m)) / m for j in range(5)]
               for y in range(m)]
    return [sum(abs(z) ** 2 for z in v) for v in vectors]


def direct_controlled_circuit_distribution(bits):
    """Apply the three controlled powers to the joint phase/work state.

    This independently checks big-endian control ordering against the
    closed finite-Fourier formula above; all seven base steps are applied.
    """
    u = [[float(x) for x in row] for row in walk(bits)]
    joint = [[1 / 8 ** 0.5] + [0.0] * 4 for _ in range(8)]
    calls = 0
    for power in (4, 2, 1):
        for _ in range(power):
            calls += 1
            joint = [apply(u, v) if label & power else v
                     for label, v in enumerate(joint)]
    after_fourier = [
        [sum(cmath.exp(-2j * pi * k * y / 8) * joint[k][j]
             for k in range(8)) / 8 ** 0.5 for j in range(5)]
        for y in range(8)
    ]
    return [sum(abs(z) ** 2 for z in v) for v in after_fourier], calls


def six_trial_error(bits):
    p = zero_probability(bits)
    zero_or_one = (1 - p) ** 6 + 6 * p * (1 - p) ** 5
    return zero_or_one if formula(bits) else 1 - zero_or_one


def clean_controlled_leaf_phase(bits, label, control):
    """Follow address compute, bit query, controlled phase, unquery, cleanup.

    All basis branches are tested; linearity then establishes operation on
    arbitrary superpositions. Oracle addresses are zero-indexed here.
    """
    valid = 1 <= label <= 4
    address = label - 1 if valid else 0
    auxiliary = 0
    auxiliary ^= bits[address]                 # first O_x
    amplitude = -1 if control and valid and auxiliary == 0 else 1
    auxiliary ^= bits[address]                 # second O_x
    address ^= label - 1 if valid else 0       # uncompute known address
    return amplitude, address, auxiliary


def rotation_compilation(matrix):
    """QR elimination into <=10 two-coordinate real rotations and signs.

    A rotation (j,i,c,s) left-multiplies rows j,i by [[c,s],[-s,c]].
    If rotations are G1,...,Gm, then Gm...G1 R = diagonal.
    Thus implement diagonal first, followed by Gm^T,...,G1^T.
    """
    a = [[float(x) for x in row] for row in matrix]
    rotations = []
    n = len(a)
    for j in range(n - 1):
        for i in range(j + 1, n):
            x, y = a[j][j], a[i][j]
            if abs(y) < 1e-14:
                continue
            norm = hypot(x, y)
            c, s = x / norm, y / norm
            row_j, row_i = a[j][:], a[i][:]
            a[j] = [c * u + s * v for u, v in zip(row_j, row_i)]
            a[i] = [-s * u + c * v for u, v in zip(row_j, row_i)]
            rotations.append((j, i, c, s))
    return a, rotations


def reconstruct(diagonal, rotations):
    a = [row[:] for row in diagonal]
    for j, i, c, s in reversed(rotations):
        row_j, row_i = a[j][:], a[i][:]
        a[j] = [c * u - s * v for u, v in zip(row_j, row_i)]
        a[i] = [s * u + c * v for u, v in zip(row_j, row_i)]
    return a


ALL_INPUTS = list(product((0, 1), repeat=4))
EXPECTED_ZERO = [F(n, 78125) for n in
                 [1764, 406, 406, 52436, 406, 3136, 3136, 52854,
                  406, 3136, 3136, 52854, 52436, 52854, 52854, 62500]]
WORKED_NUMERATORS = [
    [1, 0, 0, 0, 0],
    [3, -2, 2, -2, 2],
    [17, -8, 8, -8, -12],
    [43, -82, 82, 18, 2],
    [497, -128, 128, 272, -192],
    [2163, -962, 962, 638, 1682],
    [14977, -648, 648, -4248, -972],
    [37083, -41042, 41042, -32942, 16562],
]


class NandChecks(unittest.TestCase):
    def test_span_encodes_formula_all_inputs(self):
        for bits in ALL_INPUTS:
            self.assertEqual(span_accepts(bits), bool(formula(bits)))

    def test_kernel_and_reflection(self):
        self.assertEqual(multiply(A, Q), [[0, 0]] * 3)
        self.assertEqual(multiply(multiply(transpose(Q), Q), GRAM_INVERSE), identity(2))
        self.assertEqual(multiply(PROJECTOR, PROJECTOR), PROJECTOR)
        self.assertEqual(multiply(R, R), identity(5))
        self.assertEqual(transpose(R), R)
        expected = [[3, -2, 2, -2, 2], [-2, -2, -3, -2, 2],
                    [2, -3, -2, 2, -2], [-2, -2, 2, -2, -3],
                    [2, 2, -2, -3, -2]]
        self.assertEqual(R, [[F(x, 5) for x in row] for row in expected])

    def test_walk_unitarity_and_state_normalization(self):
        for bits in ALL_INPUTS:
            u = walk(bits)
            self.assertEqual(multiply(transpose(u), u), identity(5))
            for v in powers(bits):
                self.assertEqual(sum(x * x for x in v), 1)

    def test_clean_leaf_oracle_on_all_basis_inputs(self):
        for bits in ALL_INPUTS:
            for label in range(8):
                for control in range(2):
                    phase, address, auxiliary = clean_controlled_leaf_phase(bits, label, control)
                    expected = (2 * bits[label - 1] - 1) if control and 1 <= label <= 4 else 1
                    self.assertEqual((phase, address, auxiliary), (expected, 0, 0))

    def test_worked_intermediate_states(self):
        states = powers((1, 1, 0, 1))
        for k, (state, nums) in enumerate(zip(states, WORKED_NUMERATORS)):
            self.assertEqual(state, [F(n, 5 ** k) for n in nums])
        b0 = [sum(v[j] for v in states) / 8 for j in range(5)]
        b4 = [sum((-1) ** k * v[j] for k, v in enumerate(states)) / 8 for j in range(5)]
        self.assertEqual(b0, [F(n, 78125) for n in [54146, -23979, 23979, -6154, 3094]])
        self.assertEqual(b4, [F(n, 78125) for n in [12919, 12919, -12919, 3094, -19684]])

    def test_all_sixteen_exact_zero_probabilities(self):
        for bits, expected in zip(ALL_INPUTS, EXPECTED_ZERO):
            p = zero_probability(bits)
            self.assertEqual(p, expected)
            if formula(bits):
                self.assertGreaterEqual(p, F(2, 3))
            else:
                self.assertLess(p, F(1, 24))

    def test_full_fourier_distribution(self):
        expected = [0.6765312, 0.0450052728174587, 0.036992,
                    0.0061947271825413, 0.1470848, 0.0061947271825413,
                    0.036992, 0.0450052728174587]
        for actual, want in zip(qpe_distribution((1, 1, 0, 1)), expected):
            self.assertAlmostEqual(actual, want, places=12)
        for bits in ALL_INPUTS:
            probs = qpe_distribution(bits)
            self.assertAlmostEqual(sum(probs), 1.0, places=12)
            self.assertAlmostEqual(probs[0], float(zero_probability(bits)), places=12)
            self.assertTrue(all(p >= 0 for p in probs))

    def test_direct_controlled_powers_and_fourier(self):
        for bits in ALL_INPUTS:
            direct, calls = direct_controlled_circuit_distribution(bits)
            self.assertEqual(calls, 7)
            for actual, expected in zip(direct, qpe_distribution(bits)):
                self.assertAlmostEqual(actual, expected, places=12)

    def test_six_trial_decision_error(self):
        self.assertEqual((F(1, 3)) ** 6 + 6 * F(2, 3) * F(1, 3) ** 5, F(13, 729))
        self.assertEqual(comb(6, 2) * F(1, 24) ** 2, F(5, 192))
        for bits in ALL_INPUTS:
            self.assertLess(six_trial_error(bits), F(5, 192))
        self.assertLess(F(5, 192) + F(48, 10000), F(31, 1000))
        self.assertAlmostEqual(float(six_trial_error((1, 1, 0, 1))), 0.015520273517722253)

    def test_true_witnesses_have_two_thirds_overlap(self):
        for bits in ALL_INPUTS:
            if not formula(bits):
                continue
            q = [row[0 if bits[0] and bits[1] else 1] for row in Q]
            self.assertEqual(apply(walk(bits), q), q)
            self.assertEqual(q[0] ** 2 / sum(x * x for x in q), F(2, 3))

    def test_fixed_rotation_compilation(self):
        diagonal, rotations = rotation_compilation(R)
        self.assertLessEqual(len(rotations), 10)
        for i in range(5):
            for j in range(5):
                if i == j:
                    self.assertAlmostEqual(abs(diagonal[i][j]), 1.0, places=12)
                else:
                    self.assertAlmostEqual(diagonal[i][j], 0.0, places=12)
        recovered = reconstruct(diagonal, rotations)
        for i in range(5):
            for j in range(5):
                self.assertAlmostEqual(recovered[i][j], float(R[i][j]), places=12)


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(NandChecks)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    if not result.wasSuccessful():
        raise SystemExit(1)
    print('\nExact finite-resolution certificate:')
    for bits in ALL_INPUTS:
        p = zero_probability(bits)
        print(''.join(map(str, bits)), 'f=', formula(bits), 'p0=', p,
              'six-trial error=', f'{float(six_trial_error(bits)):.10f}')
    print('\n1101 full QPE probabilities:', qpe_distribution((1, 1, 0, 1)))
    print('Fixed two-coordinate rotations:', len(rotation_compilation(R)[1]))
    print('Ideal oracle calls: 6 trials * 7 base steps * 2 bit queries = 84')
