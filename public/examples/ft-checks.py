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

# FT-11 and FT-13: independent re-implementation of the teaching resource model.
def model(p, cycle, react, budget, ops, q, factories, routing, fpatches, c=5.5):
    data, fac = q * routing, factories * fpatches
    for d in range(3, 103, 2):
        supply = c * d * cycle / factories
        op = max(react, supply)
        runtime = ops * op * 1e-6
        eps_d = 0.1 * (p / 0.01) ** ((d + 1) / 2)
        fail = min(1.0, data * (runtime * 1e6 / cycle) * eps_d)
        if fail <= budget:
            return dict(d=d, op=op, runtime=runtime, qubits=(data + fac) * 2 * d * d, fail=fail, lim='factories' if supply > react else 'reaction')
    raise ValueError('no distance')
check(isclose(3 * 2048 + 0.002 * 2048 * 11, 6189.056) and isclose(0.3 * 2048**3 + 0.0005 * 2048**3 * 11, 2.624e9, rel_tol=1e-3), "Gidney–Ekerå abstract formulas at n=2048")
check(all(isclose(0.1 * (1e-3 / 0.01) ** ((d + 1) / 2), 10 ** -((d + 1) / 2 + 1)) for d in (3, 9, 27)), "model reproduces 10^-ceil(d/2+1) at p=1e-3")
GE = (1e-3, 1, 10, 0.3, 2.7e9, 6189, 28, 1.725, 127)
ge = model(*GE)
check(ge['d'] == 27 and ge['lim'] == 'reaction' and isclose(ge['runtime'] / 3600, 7.5) and isclose(ge['qubits'] / 1e6, 20.75, rel_tol=1e-3) and isclose(ge['fail'], 0.288, rel_tol=1e-2), "RSA preset")
check(isclose(6189 * 1.725 + 28 * 127, 226 * 63, rel_tol=1e-3), "board 226 x 63 patches")
check(isclose(10676 * 2.7e10 * 1e-14, 2.88, rel_tol=1e-2), "d=25 fails the RSA budget")
check(isclose(5.5 * 27 / 28, 5.30, rel_tol=1e-2), "RSA factory supply interval")
one = model(*GE[:6], 1, 1.725, 127)
check(one['d'] == 31 and one['lim'] == 'factories' and isclose(one['runtime'] / 86400, 5.33, rel_tol=1e-2), "RSA with one factory")
tight = model(1e-3, 1, 10, 0.05, 2.7e9, 6189, 28, 1.725, 127)
check(tight['d'] == 29 and isclose(tight['qubits'] / ge['qubits'], 1.154, rel_tol=1e-2) and isclose(tight['fail'], 0.0288, rel_tol=1e-2), "RSA at 5% budget")
lee = model(1e-3, 1, 10, 0.01, 6.7e9, 2142, 4, 1, 10)
check(lee['d'] == 31 and lee['lim'] == 'factories' and isclose(lee['op'], 42.625) and isclose(lee['runtime'] / 86400, 3.31, rel_tol=1e-2) and isclose(lee['qubits'] / 1e6, 4.19, rel_tol=1e-2), "FeMoco preset")
check(model(1e-3, 1, 20, 0.01, 6.7e9, 2142, 4, 1, 10)['runtime'] == lee['runtime'], "FeMoco: doubling reaction time changes nothing")
lee2 = model(2e-3, 1, 10, 0.01, 6.7e9, 2142, 4, 1, 10)
check(lee2['d'] == 45 and isclose(lee2['qubits'] / 1e6, 8.84, rel_tol=1e-2) and isclose(lee2['runtime'] / 86400, 4.80, rel_tol=1e-2), "FeMoco: doubling p")
goog = model(0.01 / 2.14, 1.1, 63, 0.3, 2.7e9, 6189, 28, 1.725, 127)
check(goog['d'] == 89 and isclose(goog['runtime'] / 3600, 47.25) and isclose(goog['qubits'] / 1e6, 225.5, rel_tol=1e-2), "RSA at Google 2024 noise")
check(isclose(model(0.01 / 2.14, *GE[1:])['qubits'] / 1e6, 205.6, rel_tol=1e-2), "Λ alone: about 206 million")
fast = model(1e-3, 0.5, 10, 0.3, 2.7e9, 6189, 28, 1.725, 127)
check(fast['d'] == 29 and fast['runtime'] == ge['runtime'] and isclose(fast['qubits'] / 1e6, 23.94, rel_tol=1e-2), "faster cycle: same runtime, larger distance")
check(isclose(2182 * 960, 2_094_720) and isclose(14232 * 728 / 1e6, 10.36, rel_tol=1e-3), "syndrome data rates")
check(isclose((3.141592653589793 / 4) * 1.7e7, 1.335e7, rel_tol=1e-3) and isclose(1.335e7**2, 1.78e14, rel_tol=1e-2) and isclose(1.78e14 * 1e-9 / 3600, 49.4, rel_tol=1e-2), "Grover crossover illustration")
check(isclose(5.5 * 25 / 2, 68.75) and isclose(1e9 * 68.75e-6 / 3600, 19.1, rel_tol=1e-2) and 1000 * (21 * 21 - 1) == 440000, "FT-11/13 practice answers")

# FT-06: union-find versus matching on the distance-3 surface code (defects A, B, C).
# Errors consistent with that syndrome split into matching's class and union-find's class.
def lightest(cls):
    return min(len(e) for e in cls), sum(1 for e in cls if len(e) == min(len(x) for x in cls))
target = (1, 1, 1, 0)
errs = [set(e) for k in range(10) for e in combinations(range(9), k) if zsyndrome(set(e)) == target]
match_cls = [e for e in errs if len(e ^ {0, 4}) % 2 == 0 and len((e ^ {0, 4}) & logical_z) % 2 == 0]
uf_cls = [e for e in errs if len((e ^ {0, 1, 6}) & logical_z) % 2 == 0]
check(lightest(match_cls) == (2, 3) and lightest(uf_cls) == (3, 7), "FT-06 lightest errors per class")
odds = sum(0.01**len(e) * 0.99**(9 - len(e)) for e in match_cls) / sum(0.01**len(e) * 0.99**(9 - len(e)) for e in uf_cls)
check(isclose(odds, 42.4, rel_tol=1e-2) and isclose(3 / (7 * 0.01), 42.86, rel_tol=1e-3), "FT-06 odds about 42:1")
check(isclose(1.71 / 1.43, 1.196, rel_tol=1e-3) and (25 * 25 - 1) // 2 == 312, "FT-06 decoder ratio, nodes per round")

# FT-07: syndrome rates and backlog.
check(25 * 25 - 1 == 624 and isclose(624 / 1.1, 567.27, rel_tol=1e-4), "FT-07 rates")
check(isclose((624 - 624 / 1.1) * 3600 / 8 / 1000, 25.53, rel_tol=1e-3), "FT-07 queue after 1 hour, GB")
check(isclose(1.1**10, 2.594, rel_tol=1e-3) and isclose(1.1**100, 13781, rel_tol=1e-3) and isclose(1.1**1000, 2.47e41, rel_tol=1e-2) and isclose(1.01**1000, 20959, rel_tol=1e-3), "FT-07 slowdown table")
check(isclose(1.1**1000 * 1e-5 / 3.156e7, 7.8e28, rel_tol=2e-2) and isclose(log(2) / log(1.01), 69.7, rel_tol=1e-3), "FT-07 stall time and doubling")
check(isclose(1e9 * 63e-6 / 3600, 17.5) and 2 * 1000 / 100 == 20, "FT-07 latency comparison, parallel workers")

# FT-08: measurement-based CNOT and T teleportation, computed directly.
import cmath
w = cmath.exp(1j * cmath.pi / 4)
after = {(0, 0): 0.6 / 2**0.5, (0, 1): 0.6 * w / 2**0.5, (1, 0): 0.8 * w / 2**0.5, (1, 1): 0.8 / 2**0.5}
for m in (0, 1):
    d0, d1 = after[(0, m)], after[(1, m)]
    n = (abs(d0)**2 + abs(d1)**2) ** 0.5
    d0, d1 = d0 / n, (d1 / n) * (1j if m else 1)
    check(isclose(n * n, 0.5) and abs(d1 - (d0 / 0.6) * 0.8 * w) < 1e-12, f"FT-08 T teleportation outcome {m}")

# FT-09: distillation and the logical clock.
ps = lambda e: (1 + 15 * (1 - 2 * e) ** 8) / 16
check(isclose(35e-9, 3.5e-8) and isclose(ps(1e-3), 0.9851, rel_tol=1e-4) and isclose(ps(1e-2), 0.860, rel_tol=1e-3), "FT-09 success probabilities")
check(isclose(35 * (3.5e-8) ** 3, 1.50e-21, rel_tol=1e-2) and isclose(35 * (3.5e-5) ** 3, 1.5e-12, rel_tol=1e-2), "FT-09 two levels")
check(isclose(2.6e9 * 1e-5 / 3600, 7.22, rel_tol=1e-2) and isclose(2.6e9 * 1.7e-4 / 86400, 5.12, rel_tol=1e-2), "FT-09 runtimes")
check(170 / 10 == 17 and 13 * 43300 == 562900 and isclose(2.6e9 * 60e-6 / 3600, 43.3, rel_tol=1e-2), "FT-09 factories and extra latency")

# FT-10: heat budget (Krinner et al. Tables 1 and 2) and calibration counts.
check([int(30 / 0.101), int(1.5 / 0.0022), int(200 / 0.69), round(19 / 0.038)] == [297, 681, 289, 500], "FT-10 qubits per stage")
check(round(19 / 0.088) == 216 and round(19 / (0.038 / 4 + 0.2)) == 91 and int(150 / 2.48) == 60, "FT-10 flux load, thin cables, ports")
check(6 * 100 + 2 * 10 * 9 == 780 and 6 * 10**6 + 2 * 1000 * 999 == 7998000 and 780 * 30 == 23400, "FT-10 calibration graph")
check(isclose(728 / 1.1e-6, 6.6e8, rel_tol=1e-2), "FT-10 data rate")

# FT-12: gross code comparison and reaction-limited clocks.
check(12 * (2 * 12 * 12 - 1) == 3444 and round(3444 / 288) == 12, "FT-12 gross code versus surface code")
check(isclose(1e9 * 1e-3 / 86400, 11.57, rel_tol=1e-3) and isclose(1e9 * 0.2 / 3.156e7, 6.34, rel_tol=1e-2) and isclose(604800 / 1e9 * 1e6, 604.8), "FT-12 clocks")

print(f"{checks} FT checks passed")
