#!/usr/bin/env python3
"""Lesson 58 numerical checks: actual reduced-ideal oracle and real-period packet.

Standard library only. This deliberately enumerates a small domain and simulates
one conditioned quantum state. It is NOT a scalable Hallgren implementation.
The oracle never receives a regulator or a precomputed cycle as an argument.
The oracle uses the Jozsa ln(generator) distance convention, not Hallgren's later
conjugate-ratio convention. Precision comparison is numerical, not certified
interval arithmetic. Run: python3 hallgren-checks.py
"""
import cmath
import math
import unittest
from collections import defaultdict
from decimal import Decimal, localcontext
from fractions import Fraction

D, N, Q = 12, 32, 16384
SHIFT = Fraction(1, 64)


def tau(b, a, discriminant):
    """Canonical integer b modulo 2a; exact, because sqrt(D) is irrational."""
    root_floor = math.isqrt(discriminant)
    if a <= root_floor:
        return b + 2 * a * ((root_floor - b) // (2 * a))
    return (b + a - 1) % (2 * a) - a + 1


def reduction(pair, discriminant):
    """Return the next pair and the logarithmic distance increment."""
    a, b = pair
    numerator = abs(discriminant - b * b)
    assert numerator % (4 * a) == 0
    c = numerator // (4 * a)
    gamma = (Decimal(b) + Decimal(discriminant).sqrt()) / (2 * a)
    return (c, tau(-b, c, discriminant)), abs(gamma).ln()


def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, u, v = extended_gcd(b, a % b)
    return g, v, u - (a // b) * v


def compose_pairs(first, second, discriminant):
    """The exact product is (1/k) J(result); result need not be reduced."""
    a1, b1 = first
    a2, b2 = second
    g, u0, v0 = extended_gcd(a1, a2)
    k, t, w = extended_gcd(g, (b1 + b2) // 2)
    u, v = t * u0, t * v0
    a3 = a1 * a2 // (k * k)
    numerator = u * a1 * b2 + v * a2 * b1 + w * (b1 * b2 + discriminant) // 2
    assert numerator % k == 0
    b3 = tau(numerator // k, a3, discriminant)
    return (a3, b3), k


def is_reduced(pair, discriminant):
    a, b = pair
    root = Decimal(discriminant).sqrt()
    return 0 < a < root and b >= 0 and b + root > 2 * a


def inverse_reduction(pair, discriminant):
    a, b = pair
    b_star = tau(-b, a, discriminant)
    previous_a = (discriminant - b_star * b_star) // (4 * a)
    previous = (previous_a, tau(b_star, previous_a, discriminant))
    # The previous forward step provides the positive distance to subtract.
    forward, gap = reduction(previous, discriminant)
    assert forward == pair
    return previous, gap


def add_and_reduce(left, right, discriminant):
    """First cycle ideal at/after the sum of the two tracked distances.

    Inputs and output are (pair, unreduced logarithmic distance). Finite-precision
    branch decisions require separation from boundaries; the lesson explains the
    random-shift guarantee. This is numerical reference arithmetic, not a
    certified interval implementation.
    """
    target = left[1] + right[1]
    pair, k = compose_pairs(left[0], right[0], discriminant)
    distance = target - Decimal(k).ln()
    while not is_reduced(pair, discriminant):
        pair, gap = reduction(pair, discriminant)
        distance += gap
    while distance < target:
        pair, gap = reduction(pair, discriminant)
        distance += gap
    while True:
        previous, gap = inverse_reduction(pair, discriminant)
        if distance - gap < target:
            return pair, distance
        pair, distance = previous, distance - gap


def fast_ideal_left_of(x, discriminant):
    """Composition/reduction and repeated squaring; does not receive R."""
    unit = (1, tau(discriminant, 1, discriminant))
    pair, gap1 = reduction(unit, discriminant)
    pair, gap2 = reduction(pair, discriminant)
    jump = (pair, gap1 + gap2)
    table = []
    while jump[1] <= x:
        table.append(jump)
        jump = add_and_reduce(jump, jump, discriminant)
    current = (unit, Decimal(0))
    for jump in reversed(table):
        while True:
            candidate = add_and_reduce(current, jump, discriminant)
            if candidate[1] > x:
                break
            current = candidate
    while True:
        pair, gap = reduction(current[0], discriminant)
        if current[1] + gap > x:
            return current
        current = (pair, current[1] + gap)


def oracle_domain(discriminant, n, q, shift, precision=60):
    """Enumerate labels by walking reduction forward, without knowing R.

    This monotone-domain enumeration is a small classical reference evaluator.
    It replaces neither the general composition-based fast evaluator nor its
    reversible implementation. No period is used to construct the labels.
    """
    with localcontext() as ctx:
        ctx.prec = precision
        s = Decimal(shift.numerator) / shift.denominator
        pair = (1, tau(discriminant, 1, discriminant))
        distance = Decimal(0)
        boundaries = [(distance, pair)]
        following, increment = reduction(pair, discriminant)
        next_distance = distance + increment
        labels = []
        for m in range(q):
            x = Decimal(m) / n + s
            while next_distance <= x:
                pair, distance = following, next_distance
                boundaries.append((distance, pair))
                following, increment = reduction(pair, discriminant)
                next_distance = distance + increment
            residual = int(n * (x - distance))
            labels.append((*pair, residual))
        # Include one boundary after the last point for margin/nearby tests.
        boundaries.append((next_distance, following))
        return labels, boundaries


def forward_qft(state):
    """Positive-exponent unitary QFT, computed by an ordinary classical FFT."""
    out = list(state)
    size = len(out)
    assert size and size & (size - 1) == 0
    j = 0
    for i in range(1, size):
        bit = size >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            out[i], out[j] = out[j], out[i]
    width = 2
    while width <= size:
        step = cmath.exp(2j * math.pi / width)
        for start in range(0, size, width):
            phase = 1 + 0j
            for k in range(width // 2):
                even = out[start + k]
                odd = phase * out[start + k + width // 2]
                out[start + k] = even + odd
                out[start + k + width // 2] = even - odd
                phase *= step
        width *= 2
    return [z / math.sqrt(size) for z in out]


def convergents(numerator, denominator):
    p0, p1, q0, q1 = 0, 1, 1, 0
    result = []
    while denominator:
        a, remainder = divmod(numerator, denominator)
        p0, p1 = p1, a * p1 + p0
        q0, q1 = q1, a * q1 + q0
        result.append(Fraction(p1, q1))
        numerator, denominator = denominator, remainder
    return result


def nearest_unit(x, boundaries, unit_pair=(1, 2)):
    """Finite reference test; scalable algorithm evaluates near x then steps locally."""
    return min((abs(t - x), t) for t, pair in boundaries if pair == unit_pair)


def marginal_probability(j, labels):
    """Trace over the function register: add probabilities, not amplitudes."""
    sums = defaultdict(complex)
    q = len(labels)
    for m, label in enumerate(labels):
        sums[label] += cmath.exp(2j * math.pi * j * m / q)
    return sum(abs(z) ** 2 for z in sums.values()) / (q * q)


class HallgrenChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.labels, cls.boundaries = oracle_domain(D, N, Q, SHIFT)
        cls.packet = [m for m, label in enumerate(cls.labels) if label == (1, 2, 4)]
        initial = [0j] * Q
        for m in cls.packet:
            initial[m] = 1 / math.sqrt(len(cls.packet))
        cls.spectrum = forward_qft(initial)
        with localcontext() as ctx:
            ctx.prec = 60
            cls.regulator = (Decimal(2) + Decimal(3).sqrt()).ln()
            cls.scaled_period = N * cls.regulator

    def test_01_reduction_cycle_and_distance(self):
        with localcontext() as ctx:
            ctx.prec = 60
            next_pair, first = reduction((1, 2), D)
            last_pair, second = reduction(next_pair, D)
            self.assertEqual(next_pair, (2, 2))
            self.assertEqual(last_pair, (1, 2))
            self.assertLess(abs(first + second - self.regulator), Decimal('1e-57'))
            self.assertGreater(first, second)

    def test_02_compact_composition(self):
        pair, k = compose_pairs((2, 2), (2, 2), D)
        self.assertEqual((pair, k), ((1, 2), 2))
        with localcontext() as ctx:
            ctx.prec = 60
            t = (1 + Decimal(3).sqrt()).ln()
            self.assertLess(abs(2 * t - Decimal(2).ln() - self.regulator), Decimal('1e-57'))

    def test_03_norm_minus_one_is_not_pell_solution(self):
        with localcontext() as ctx:
            ctx.prec = 60
            pair, t = reduction((1, 2), 8)
            self.assertEqual(pair, (1, 2))
            self.assertEqual(1 * 1 - 2 * 1 * 1, -1)
            self.assertEqual(3 * 3 - 2 * 2 * 2, 1)
            self.assertLess(abs(2 * t - (3 + 2 * Decimal(2).sqrt()).ln()), Decimal('1e-57'))

    def test_04_actual_packet(self):
        self.assertEqual(len(self.packet), 389)
        self.assertEqual(self.packet[:8], [4, 46, 88, 130, 173, 215, 257, 299])
        self.assertEqual(self.packet[-4:], [16229, 16271, 16313, 16355])
        self.assertEqual({b - a for a, b in zip(self.packet, self.packet[1:])}, {42, 43})
        self.assertEqual(self.labels[130], (1, 2, 4))
        self.assertEqual(self.labels[172], (1, 2, 3))

    def test_05_packet_tracks_irrational_period(self):
        with localcontext() as ctx:
            ctx.prec = 60
            expected = [4 + round(j * self.scaled_period) for j in range(389)]
        self.assertEqual(self.packet, expected)
        self.assertGreater(Q, 3 * 64 * 64)

    def test_06_precision_and_margin(self):
        lower_precision, _ = oracle_domain(D, N, Q, SHIFT, precision=35)
        self.assertEqual(self.labels, lower_precision)
        with localcontext() as ctx:
            ctx.prec = 60
            s = Decimal(SHIFT.numerator) / SHIFT.denominator
            margin = min(abs(N * (t - s) - round(N * (t - s))) / N
                         for t, _ in self.boundaries)
        self.assertGreater(margin, Decimal('0.000015'))
        self.assertLess(margin, Decimal('0.000016'))

    def test_07_qft_normalization_and_direct_amplitudes(self):
        self.assertAlmostEqual(sum(abs(z) ** 2 for z in self.spectrum), 1, places=11)
        for j in [0, 1, 389, 1166, 1944]:
            direct = sum(cmath.exp(2j * math.pi * j * m / Q) for m in self.packet)
            direct /= math.sqrt(len(self.packet) * Q)
            self.assertLess(abs(direct - self.spectrum[j]), 3e-12)

    def test_08_specific_probabilities(self):
        self.assertAlmostEqual(abs(self.spectrum[0]) ** 2, 389 / Q, places=12)
        self.assertAlmostEqual(abs(self.spectrum[1166]) ** 2, 0.016329371238835818, places=11)
        self.assertAlmostEqual(abs(self.spectrum[1944]) ** 2, 0.021493554422454278, places=11)
        self.assertLess(abs(self.spectrum[1]) ** 2, 1e-8)

    def test_09_continued_fractions_and_candidate_verification(self):
        fractions = convergents(1166, 1944)
        self.assertEqual(fractions, [Fraction(0), Fraction(1), Fraction(1, 2),
                                     Fraction(3, 5), Fraction(583, 972)])
        candidates = sorted({round(Fraction(f.numerator * Q, 1166))
                             for f in fractions if f.numerator})
        self.assertEqual(candidates, [14, 42, 8192])
        accepted = [t for t in candidates
                    if nearest_unit(Decimal(t) / N, self.boundaries)[0] < Decimal(1) / N]
        self.assertEqual(accepted, [42])
        self.assertLess(abs(Decimal(42) / N - self.regulator), Decimal(1) / N)

    def test_10_refinement_to_pell(self):
        gap, refined = nearest_unit(Decimal(42) / N, self.boundaries)
        self.assertLess(gap, Decimal('0.00446'))
        with localcontext() as ctx:
            ctx.prec = 60
            self.assertLess(abs(refined - self.regulator), Decimal('1e-57'))
            unit = refined.exp()
            x = (unit + 1 / unit) / 2
            y = (unit - 1 / unit) / (2 * Decimal(3).sqrt())
            self.assertLess(abs(x - 2), Decimal('1e-56'))
            self.assertLess(abs(y - 1), Decimal('1e-56'))
        self.assertEqual(2 * 2 - 3 * 1 * 1, 1)

    def test_11_fast_oracle_matches_sequential_reference(self):
        with localcontext() as ctx:
            ctx.prec = 60
            shift = Decimal(1) / 64
            for discriminant in [8, 12, 24, 28, 40, 44, 52]:
                labels, _ = oracle_domain(discriminant, 32, 2048, SHIFT)
                for m in range(0, 2048, 37):
                    x = Decimal(m) / 32 + shift
                    pair, distance = fast_ideal_left_of(x, discriminant)
                    actual = (*pair, int(32 * (x - distance)))
                    self.assertEqual(actual, labels[m], (discriminant, m))
            # A point far beyond the enumerated domain is evaluated by jumps.
            x = Decimal(1000000000) + shift
            pair, distance = fast_ideal_left_of(x, D)
            remainder = x % self.regulator
            a = (1 + Decimal(3).sqrt()).ln()
            expected_pair = (1, 2) if remainder < a else (2, 2)
            expected_residual = remainder if remainder < a else remainder - a
            self.assertEqual(pair, expected_pair)
            self.assertLess(abs(x - distance - expected_residual), Decimal('1e-46'))


    def test_12_marginals_sum_probabilities_over_function_labels(self):
        self.assertAlmostEqual(marginal_probability(1166, self.labels), 0.016313340466917972, places=11)
        self.assertAlmostEqual(marginal_probability(1944, self.labels), 0.021377943784052614, places=11)


if __name__ == '__main__':
    unittest.main(verbosity=2)
