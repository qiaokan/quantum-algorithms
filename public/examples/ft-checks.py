"""Independent numerical checks for the error-correction lessons FT-01 to FT-05.

Run with the standard library only:  python3 public/examples/ft-checks.py
Every number quoted in those lessons is recomputed here, independently of the TypeScript
simulator and decoders. Hardware figures come from the cited Google Quantum AI paper; values
derived from them are labelled as derived.
"""
from itertools import combinations
from math import comb, log, ceil, isclose, sin, cos

checks = 0
def check(condition, message):
    global checks
    if not condition:
        raise AssertionError(message)
    checks += 1

# FT-01: repetition code, independent bit flips, majority decoding.
def repetition_failure(d, p):
    return sum(comb(d, k) * p**k * (1 - p)**(d - k) for k in range(d // 2 + 1, d + 1))

check(isclose(repetition_failure(3, 0.01), 3 * 0.01**2 - 2 * 0.01**3), "d=3 closed form")
check(isclose(repetition_failure(3, 0.01), 2.98e-4, rel_tol=1e-9), "d=3, p=0.01")
check(isclose(repetition_failure(5, 0.01), 9.8506e-6, rel_tol=1e-4), "d=5, p=0.01")
check(isclose(repetition_failure(3, 0.05), 0.00725, rel_tol=1e-9), "d=3, p=0.05 exercise")
check(isclose(repetition_failure(3, 0.5), 0.5), "break-even at p=1/2")
check(isclose(repetition_failure(3, 0.6), 0.648), "worse than unencoded above 1/2")
check(isclose(sin(0.1)**2, 0.009967, rel_tol=1e-3) and isclose(cos(0.1)**2 + sin(0.1)**2, 1), "rotation discretization")
check(isclose(0.6**2, 0.36) and isclose(0.8**2, 0.64), "logical readout probabilities")

# Syndrome table of the 3-qubit bit-flip code: checks q0^q1 and q1^q2.
def syndrome3(error):
    e = [1 if q in error else 0 for q in range(3)]
    return (e[0] ^ e[1], e[1] ^ e[2])
check([syndrome3(s) for s in [(), (0,), (1,), (2,)]] == [(0, 0), (1, 0), (1, 1), (0, 1)], "syndrome table")
check(syndrome3((0, 1)) == syndrome3((2,)), "two errors mimic one")

# FT-02: memory for state vectors versus tableaus.
check(2**17 * 16 == 2_097_152, "17-qubit state vector bytes")
check(2**50 * 16 == 18_014_398_509_481_984, "50-qubit state vector bytes (about 18 PB)")
check(2 * 50 * (2 * 50 + 1) == 10_100, "50-qubit tableau bits")

# FT-03: distance-3 rotated surface code (same layout rule as src/lib/surface-code.ts).
def rotated(d):
    stabs = []
    for i in range(d + 1):
        for j in range(d + 1):
            t = 'X' if (i + j) % 2 == 0 else 'Z'
            qs = [r * d + c for r, c in [(i-1, j-1), (i-1, j), (i, j-1), (i, j)] if 0 <= r < d and 0 <= c < d]
            interior = 0 < i < d and 0 < j < d
            if interior or ((i in (0, d)) and 0 < j < d and t == 'X') or ((j in (0, d)) and 0 < i < d and t == 'Z'):
                stabs.append((t, tuple(qs)))
    return stabs

s3 = rotated(3)
X3 = sorted(q for t, q in s3 if t == 'X'); Z3 = [q for t, q in s3 if t == 'Z']
check(len(s3) == 8 and 9 + len(s3) == 17, "17 qubits at distance 3")
check(sorted(X3) == sorted([(0, 1, 3, 4), (4, 5, 7, 8), (1, 2), (6, 7)]), "X stabilizers")
check(Z3 == [(0, 3), (1, 2, 4, 5), (3, 4, 6, 7), (5, 8)], "Z stabilizers in plaquette order")
def zsyndrome(error):
    return tuple(sum(q in error for q in s) % 2 for s in Z3)
check(zsyndrome({4}) == (0, 1, 1, 0), "X on centre")
check(zsyndrome({0}) == (1, 0, 0, 0) and zsyndrome({1}) == zsyndrome({2}) == (0, 1, 0, 0), "degenerate single errors")
check(zsyndrome({0, 3}) == zsyndrome({6}) == zsyndrome({7}) == (0, 0, 1, 0), "weight-2 error mimics weight-1")
logical_x, logical_z = {0, 3, 6}, {0, 1, 2}
# Smallest X error that commutes with every Z check but flips logical Z: the code distance.
best = min(len(e) for k in range(1, 10) for e in map(set, combinations(range(9), k))
           if zsyndrome(e) == (0, 0, 0, 0) and len(e & logical_z) % 2 == 1)
check(best == 3, "distance 3 for X errors")
check(all(2 * d * d - 1 == n for d, n in [(3, 17), (5, 49), (7, 97), (27, 1457)]), "2d^2-1 counts")

# FT-04: repetition-code suppression and the Google below-threshold data.
r = {d: repetition_failure(d, 0.1) for d in (3, 5, 7)}
check(isclose(r[3], 0.028) and isclose(r[5], 0.00856, rel_tol=1e-9) and isclose(r[7], 0.0027280, rel_tol=1e-4), "p=0.1 failures")
check(isclose(r[3] / r[5], 3.271, rel_tol=1e-3) and isclose(r[5] / r[7], 3.138, rel_tol=1e-3), "p=0.1 suppression ratios")
check(isclose(repetition_failure(9, 0.1), 0.000891, rel_tol=1e-2), "d=9 prediction check")
check(2 * 101 * 101 - 1 == 20401 and round(20401 / 17) == 1200, "d=101 versus d=3")
q = {d: repetition_failure(d, 0.4) for d in (3, 5)}
check(isclose(q[3], 0.352) and isclose(q[5], 0.31744) and isclose(q[3] / q[5], 1.109, rel_tol=1e-3), "p=0.4 ratio")

LAMBDA, EPS7 = 2.14, 1.43e-3  # Google Quantum AI, Nature 638, 920 (2025): Λ and distance-7 error per cycle
eps = lambda d, lam=LAMBDA: EPS7 / lam ** ((d - 7) / 2)
check(isclose(eps(5), 3.06e-3, rel_tol=1e-2) and isclose(eps(3), 6.55e-3, rel_tol=1e-2), "implied d=5, d=3 (derived)")
MEASURED = {3: 6.50e-3, 5: 3.03e-3, 7: 1.43e-3}  # same paper, Table S1, neural-network decoder
check(isclose(MEASURED[3] / MEASURED[5], 2.145, rel_tol=1e-3) and isclose(MEASURED[5] / MEASURED[7], 2.119, rel_tol=1e-3), "measured step ratios")
check(abs(eps(5) - MEASURED[5]) / MEASURED[5] < 0.02 and abs(eps(3) - MEASURED[3]) / MEASURED[3] < 0.02, "Λ reproduces measured points within 2%")
def distance_for(target, lam=LAMBDA):
    steps = ceil(log(EPS7 / target) / log(lam))
    return 7 + 2 * steps
check(distance_for(1e-6) == 27 and eps(27) < 1e-6 < eps(25), "d=27 for 1e-6 per cycle")
check(isclose(eps(27), 7.10e-7, rel_tol=1e-2) and isclose(eps(25), 1.52e-6, rel_tol=1e-2), "eps at 25 and 27")
check(distance_for(1e-6, 4.0) == 19 and 2 * 19 * 19 - 1 == 721, "hypothetical Λ=4")
check(distance_for(1e-13) == 69 and 2 * 69 * 69 - 1 == 9521, "budget for 1e12 qubit-cycles")
check(isclose(1e9 * 1.1e-6, 1100), "1e9 cycles at 1.1 µs")
check(distance_for(1e-13, 10.0) == 29 and 2 * 29 * 29 - 1 == 1681, "same budget if Λ were 10")
check(isclose(1000 * 9521, 9.521e6) and isclose(1000 * 1681, 1.681e6), "1000 logical qubits, data patches only")
# Fowler et al. (2012) Eq. (11): P_L ≈ 0.03 (p/p_th)^((d+1)/2), p_th = 0.57%.
fowler = lambda d, p: 0.03 * (p / 0.0057) ** ((d + 1) / 2)
check(isclose(fowler(5, 0.001) / fowler(7, 0.001), 5.7, rel_tol=1e-9), "Λ = p_th/p in the empirical formula")

# FT-05: log-likelihood weights and the worked matching choices.
w = lambda p: log((1 - p) / p)
check(isclose(w(0.01), 4.595, rel_tol=1e-3) and isclose(w(0.02), 3.892, rel_tol=1e-3), "edge weights")
check(2 * w(0.01) > w(0.02), "one measurement error beats two data errors")
# Repetition d=5 (checks c0..c3), errors on qubits 1 and 2: defects c0 and c2.
def rep_defects(d, err):
    e = [1 if k in err else 0 for k in range(d)]
    return [k for k in range(d - 1) if e[k] ^ e[k + 1]]
check(rep_defects(5, {1, 2}) == [0, 2], "defects c0, c2")
check(2 < 1 + 2, "pairing (weight 2) beats two boundary matches (weight 3)")

# Practice answers.
check(isclose(0.05 / repetition_failure(3, 0.05), 6.9, rel_tol=1e-2), "exercise: 6.9x better at p=0.05")
check(zsyndrome({8}) == (0, 0, 0, 1) and zsyndrome({5}) == (0, 1, 0, 1), "exercise: X8 syndrome")
check(2 * 11 * 11 - 1 == 241, "exercise: d=11 patch")
check(distance_for(1e-4) == 15 and isclose(eps(15), 6.82e-5, rel_tol=1e-2) and isclose(eps(13), 1.46e-4, rel_tol=1e-2), "exercise: d=15 for 1e-4")
check(isclose(0.57 / 0.2, 2.85) and isclose(0.57 / 2.14, 0.266, rel_tol=1e-2), "exercise: Λ comparison")
check(isclose(w(0.01), 4.595, rel_tol=1e-3) and isclose(2 * log(999), 13.81, rel_tol=1e-3), "exercise: weights")

print(f"{checks} FT checks passed")
