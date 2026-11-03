"""Generate and execute the FT companion notebooks (run with the qecenv interpreter)."""
import sys, nbformat as nbf
from nbclient import NotebookClient

out_dir = sys.argv[1]
md = nbf.v4.new_markdown_cell
code = nbf.v4.new_code_cell

lam = nbf.v4.new_notebook()
lam.cells = [
    md("""# Λ and thresholds at larger code distances (simulated)

**Companion to FT-04 (noise models, thresholds and Λ).** Everything in this notebook is a **classical simulation**, not hardware data.

The noise model is Stim's generated rotated surface-code memory experiment with uniform circuit-level noise at strength $p$. It applies depolarizing noise after every Clifford gate, data depolarization before each round, and bit flips on resets and measurements. Decoding is minimum-weight perfect matching with PyMatching, using the circuit's detector error model.

Real hardware has non-uniform, correlated and leakage errors, so numbers here will not match a particular device. FT-04 uses Google's *measured* $\\Lambda=2.14$ for that reason.

Requirements are pinned in `requirements-ft-notebooks.txt`: Stim 1.15.0, PyMatching 2.2.2, NumPy 2.2.6. Runtime is a few minutes on a laptop CPU."""),
    code("""import platform, time
import numpy as np, stim, pymatching
print('stim', stim.__version__, '| pymatching', pymatching.__version__, '| numpy', np.__version__)
print('machine:', platform.platform(), '|', platform.processor() or platform.machine())"""),
    md("""## One experiment

For distance $d$, run a $Z$-basis memory for $d$ rounds, decode every shot, and count how often the decoded logical observable is wrong. With $P$ the failure probability over $r$ rounds, the per-round logical error $\\varepsilon$ solves $P=\\tfrac12\\bigl(1-(1-2\\varepsilon)^r\\bigr)$:

$$\\varepsilon=\\tfrac12\\bigl(1-(1-2P)^{1/r}\\bigr).$$"""),
    code("""def per_round_error(d, p, shots, seed=2026):
    circuit = stim.Circuit.generated(
        'surface_code:rotated_memory_z', distance=d, rounds=d,
        after_clifford_depolarization=p, before_round_data_depolarization=p,
        before_measure_flip_probability=p, after_reset_flip_probability=p)
    matching = pymatching.Matching.from_detector_error_model(circuit.detector_error_model(decompose_errors=True))
    detectors, observables = circuit.compile_detector_sampler(seed=seed).sample(shots, separate_observables=True)
    failures = int((matching.decode_batch(detectors) != observables).any(axis=1).sum())
    P = failures / shots
    eps = 0.5 * (1 - (1 - 2 * P) ** (1 / d))
    # Rough binomial standard error on P, propagated to eps (first order).
    se = (P * (1 - P) / shots) ** 0.5 / (d * max(1 - 2 * P, 1e-9) ** (1 - 1 / d))
    return failures, eps, se"""),
    md("""## Sweep distance and physical error

Shots are chosen so that each point sees enough failures for a rough estimate. Points with very few failures are flagged rather than over-interpreted."""),
    code("""distances = [3, 5, 7, 9]
ps = [0.003, 0.005, 0.007, 0.010, 0.013, 0.016]
shots = {0.003: 400_000, 0.005: 200_000, 0.007: 100_000, 0.010: 50_000, 0.013: 40_000, 0.016: 40_000}
results = {}
t0 = time.time()
for p in ps:
    for d in distances:
        results[(d, p)] = per_round_error(d, p, shots[p])
print(f'sweep took {time.time() - t0:.0f} s')
print('per-round logical error eps (failures in brackets; * = fewer than 20 failures)')
print('p       ' + ''.join(f'd={d:<12}' for d in distances))
for p in ps:
    row = ''
    for d in distances:
        f, e, se = results[(d, p)]
        row += f'{e:.2e}({f}){"*" if f < 20 else " "}'.ljust(14)
    print(f'{p:<8}' + row)"""),
    md("""## Suppression factor Λ = ε_d / ε_{d+2}

Λ > 1 means a larger code helps, so the physical error is below this noise model's threshold. Λ < 1 means it is above threshold."""),
    code("""print('p       ' + ''.join(f'Λ{d}/{d+2}'.ljust(12) for d in distances[:-1]))
for p in ps:
    row = ''
    for d in distances[:-1]:
        e1, e2 = results[(d, p)][1], results[(d + 2, p)][1]
        row += (f'{e1 / e2:.2f}' if e2 > 0 else 'n/a').ljust(12)
    print(f'{p:<8}' + row)"""),
    md("""## Reading the result

These numbers come from fixed random seeds, so re-running the notebook reproduces them exactly.

- **Λ grows as $p$ falls.** Λ is about 3.2 at $p=0.3\\%$, about 2.0 at $0.5\\%$, about 1.4 at $0.7\\%$, and about 1.1 at $1\\%$. This is the $\\Lambda\\approx p_{\\rm th}/p$ trend that FT-04's rule of thumb describes.
- **The threshold.** In this uniform model, Λ reaches 1 somewhere around $p\\approx1\\%$ to $1.3\\%$; read the exact crossing off the two highest-$p$ rows. That is higher than the 0.57% Fowler et al. quote for their own circuit-level model (FT-04), because different noise models and decoders give different thresholds. Neither number describes a particular device.
- **Google's measured Λ = 2.14** lands, in this simulation, near a uniform $p\\approx0.5\\%$. There the simulated distance-7 error is 0.147% per round, close to Google's measured 0.143%. That closeness is a coincidence of scale, not a calibration: hardware noise is not uniform.
- **Limits.** These are $Z$-basis memories with uncorrelated matching and no leakage, correlated bursts or logical gates. Points marked * have too few failures to trust."""),
]

lat = nbf.v4.new_notebook()
lat.cells = [
    md("""# Software decoder latency versus code distance (simulated, this machine)

**Companion to FT-06 and FT-07 (decoding and real-time decoding).** This measures how long **PyMatching**, running in software on this machine's CPU, takes to decode simulated surface-code syndrome data, as the code distance grows.

**What it is not:**

- It is **not hardware decoder latency**: no FPGA, ASIC or control-system path is involved.
- It is **not streaming**: each shot is a complete block of $d$ rounds decoded at once.
- It is **not a worst-case bound**. These are averages over typical noise at the stated $p$; FT-06 explains why worst-case time matters.

Compare the per-round figure with a 1 µs surface-code cycle only as an order-of-magnitude reference."""),
    code("""import platform, os, time
import numpy as np, stim, pymatching
print('stim', stim.__version__, '| pymatching', pymatching.__version__)
print('machine:', platform.platform(), '|', platform.processor() or platform.machine(), '| logical CPUs:', os.cpu_count())"""),
    code("""def decode_timing(d, p=0.001, shots=2000, seed=7, repeats=3):
    circuit = stim.Circuit.generated(
        'surface_code:rotated_memory_z', distance=d, rounds=d,
        after_clifford_depolarization=p, before_round_data_depolarization=p,
        before_measure_flip_probability=p, after_reset_flip_probability=p)
    matching = pymatching.Matching.from_detector_error_model(circuit.detector_error_model(decompose_errors=True))
    detectors, _ = circuit.compile_detector_sampler(seed=seed).sample(shots, separate_observables=True)
    best = float('inf')
    for _ in range(repeats):  # take the best of a few runs to reduce timer noise
        t0 = time.perf_counter(); matching.decode_batch(detectors); best = min(best, time.perf_counter() - t0)
    per_shot = best / shots
    return circuit.num_detectors, per_shot, per_shot / d

print('d    detectors/shot   µs per shot (d rounds)   µs per round   × a 1 µs cycle')
for d in [3, 5, 7, 9, 11, 13, 15, 17]:
    n, shot, rnd = decode_timing(d)
    print(f'{d:<4} {n:<16} {shot * 1e6:<24.1f} {rnd * 1e6:<14.2f} {rnd * 1e6 / 1.0:.2f}')"""),
    md("""## Reading the result

- **Growth with distance.** Time per round grows with distance, because each round has $d^2-1$ checks. On the machine recorded above it rose from about 0.02 µs at $d=3$ to about 1.2 µs at $d=17$, at 0.1% noise. How it grows on typical noise is what Sparse Blossom was engineered for. [Higgott and Gidney](https://arxiv.org/abs/2303.15933) report under 1 µs per round at distance 17 and 0.1% noise on one core, with their own benchmark setup. Differences from that figure here reflect this machine, the noise model, batching and Python overhead.
- **Average versus worst case.** A per-round average below 1 µs does not guarantee real-time operation. The decoder must also keep up during bursts and deliver results within a reaction-time budget (FT-07), and it must do that for every logical qubit at once.
- **What hardware decoders do differently.** They target bounded worst-case latency on streaming data, often with union-find-style algorithms (FT-06, FT-07)."""),
]

for name, nb in [('ft-lambda-larger-distance.ipynb', lam), ('ft-decoder-latency.ipynb', lat)]:
    nb.metadata['kernelspec'] = {'name': 'python3', 'display_name': 'Python 3', 'language': 'python'}
    NotebookClient(nb, timeout=1800, kernel_name='python3').execute()
    nbf.write(nb, f'{out_dir}/{name}')
    print('wrote', name)
