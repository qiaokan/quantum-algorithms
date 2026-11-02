# Walks, variational methods, learning, sampling, and advanced applications

Research and numerical verification date: **2026-11-02**.

This note covers the original authoring work for lessons 38–61. The source registry is `src/content/sources/applications.json`; it records 30 primary or author-written sources, with the precise level of verification for each. “Full text” means the relevant algorithm or theorem sections were read, not that every proof in the paper was independently audited. “Abstract” means the metadata and stated result were verified, not that the implementation was extracted from an unread paper. Original small examples and derivations provide the explanatory steps in the lessons.

## What the chapters actually teach

| Lessons | Mechanism reached in the worked examples | Boundary of the claim |
| --- | --- | --- |
| 38–40 | Coin-and-shift interference; continuous-time transfer; two reversible-chain reflections and a search reflection | The toy walk is not a proof of a general computational advantage. MNRS complexity separately charges setup, update, checking, marked weight, and spectral gap. |
| 41–42 | Joint label-and-data amplification for duplicate detection; reversible triangle predicate and full Grover output | The toy implementations are elementary algorithms. Ambainis's optimized walk and Le Gall's stronger triangle bound are cited and distinguished from the implementation shown. |
| 43 | NAND/formula evaluation | A separate follow-up reviewer owns the final walk/scattering derivation and corresponding status. Consult current chapter metadata. |
| 44 | Weighted five-vertex reflections, six-bit phase estimation, detection probabilities, and a verified witness | General tree bounds are cited separately; the five-node example explicitly pays 63 base-walk calls per phase-estimation experiment. |
| 45–49 | Measured VQE objective; adaptive pool gradient; exact one-edge QAOA; filtering versus state-dependent and variational imaginary time; finite-time adiabatic evolution | No generic practical optimization advantage is claimed. The adiabatic example has a solvable schedule, and its bound is not asserted for arbitrary Hamiltonian paths. |
| 50–53 | Full one-qubit tomography; an unbiased Pauli shadow and its variance; a kernel training/prediction calculation; parameter-shift training | Measurement, training, input, and readout costs remain explicit. The one-qubit learning examples are classically easy. |
| 54–56 | IQP parity-phase circuit; ordinary and Gaussian optical output probabilities; random-circuit probabilities and a misleading XEB score | Conditional sampling-hardness arguments are separate from toy simulations, hardware experiments, and useful application speedup. |
| 57 | Oracle-generated phase qubits, sum/difference combination, and recovery of all three bits of a cyclic hidden shift | Favorable labels and branches are charged as probabilistic events. The optimized subexponential sieve theorem is not inferred from a lucky eight-element example. |
| 58 | Hallgren/Pell/regulator algorithms | A separate follow-up reviewer owns the reduced-ideal oracle, real-period sampling, reconstruction, and status. Consult current chapter metadata. |
| 59 | Path-representation unitary, weighted trace measurements, and the Jones writhe correction | Trace versus plat closure and normalized additive versus relative error are separated. The source's crossing convention is used consistently. |
| 60 | Noncommuting thermal proposal, actual rejected state, alternating-projector recovery, retry tail, and Gibbs stationary state | The small example has exact energy labeling. General phase-estimation precision, mixing, temperature, and rejection costs are not assumed free. |
| 61 | Two-query probability experiment and genuinely one-indexed-query interference experiment | Promise and oracle model are explicit. The one-query success convention is distinguished from conventional one-third error; constant repetitions are charged. |

“Complete” in the catalog means a complete educational mechanism and output for the explicitly identified variant. It does not mean every optimized asymptotic theorem has been re-proved, every published variant is included, or a quantum processor has run the example. “Reviewed” is reserved for an independent substantive review. Chapters 43 and 58 were handed to separate reviewers to close specific derivation gaps; this note does not override their live metadata.

## Source checks that changed the content

- **MNRS, sections 2–4:** distinguishes the stationary-state reflection from an arbitrary local diffusion and exposes setup/update/check costs.
- **Montanaro, sections 2–2.1:** supplies the depth-weighted root direction and the marked-vertex identity rule. The chapter now calculates the actual five-by-five matrices rather than treating a local reflection as the entire backtracking algorithm.
- **ADAPT-VQE, algorithm steps 5–8:** distinguishes measuring operator-pool derivatives, selecting an operator, and re-optimizing the accumulated ansatz.
- **Original QAOA layer definitions:** fixes signs and order before multiplying the one-edge circuit.
- **Classical shadows, random Pauli construction:** checks the inverse measurement map, locality dependence, and why one cannot recover all observables cheaply.
- **Kuperberg, section III:** checks the phase-qubit combination and parity recursion, rather than conflating Fourier sampling alone with the sieve.
- **Aharonov–Jones–Landau, sections 2.6–2.12 and 3.3:** fixes the crossing representation to `A E + A^{-1} I` and the positive-writhe correction to the source's convention. The one-crossing trace closure evaluates to one, as required for the unknot.
- **Temme et al., sections 3 and 7:** checks the alternating energy and acceptance projectors used after a rejection. The chapter gives a coherent noncommuting example and derives its finite retry tail.
- **Forrelation, sections 1 and 3:** checks the promise, single indexed oracle, and the paper's one-query error convention. The text does not package two independent function calls into a fictitious single elementary query.

The registry identifies abstract-only checks for results used as context, including improved triangle bounds, tomography sample bounds, conditional sampling complexity, and newer Gibbs samplers. The prose does not attribute independently derived numerical arithmetic to those abstracts.

## Scope audit and significant extensions

The requested families are all represented, with status determined by their actual teaching depth. Two additions were judged more useful than inflating the numbered chapter count:

1. **Quantum fast-forwarding**, within lesson 40. Apers and Sarlette's Markov-chain powering framework is a significant bridge from walks to polynomial transformations. The two-state example computes both the classical probability vector and the normalized quantum amplitude vector, showing why measuring the latter is not the original classical distribution. General complexity retains output-norm and precision dependencies.
2. **Modern noncommutative Gibbs samplers**, within lesson 60. The 2025 version of Chen–Kastoryano–Gilyén and the 2026 version of Gilyén–Chen–Doriguello–Kastoryano were checked at abstract level. They provide current extensions to the original Metropolis framework; their complete constructions are explicitly further reading, not falsely presented as implemented here.

Gaussian boson sampling is treated as a substantive part of lesson 55: squeezed input, multiple photon sectors, output probabilities, and a truncation tail are calculated. Local QITE, variational imaginary time, and postselected filters are distinguished in lesson 48. Continuous-time, coined, and reversible-chain walks have separate chapters because their states, operations, and cost models differ.

The application range does not independently teach every learning-graph triangle variant, every quantum singular-value or Gibbs preparation scheme, bosonic covariance machinery for arbitrary Gaussian states, full molecular electronic-structure encodings, every kernel/classifier architecture, or every hardware sampling experiment. These are additional implementations or deeper applications of the included families. Quantum signal processing, qubitization, matrix methods, Fourier algorithms, and foundational primitives are covered by the other assigned modules. No exhaustive “all published algorithms” claim is made.

## Numerical verification

The public artifact `public/examples/applications.py` is an executable Python `unittest` suite with **21 substantive numerical checks**. It was run successfully with Python and NumPy 2.3.5. The actual output is preserved in `research/applications-test-output.txt`. Install the example dependency with `python3 -m pip install -r public/examples/requirements-applications.txt`, then run `python3 public/examples/applications.py` from the project root.

The checks include walk normalization, stationary-state preservation, derivative finite differences, eigenvalue comparisons, conditional state probabilities, measurement estimator moments, photon-sector normalization, and oracle interference. More demanding checks include:

- backtracking phase-zero probabilities 0.5003304993 with a marked leaf and 0.0018190816 without it, plus verified-witness probability 0.1258996164;
- a finite-time adiabatic solution checked against an independent 10,000-step midpoint integration;
- Jones weighted trace and writhe correction producing the unknot value one;
- explicit noncommuting Metropolis proposal and rejection projectors, including the recovery identity that gives survival probability `(3/4)^k` after `k` failed recovery rounds;
- a random-circuit counterexample where an incorrect deterministic sampler scores higher on XEB than the ideal sampler.

These are ideal classical numerical calculations, not hardware observations or performance benchmarks. Conditional normalization happens only after the corresponding success probability is calculated. Unitary states are not silently renormalized. The suite is intended to catch sign, ordering, probability, and normalization mistakes in the authored examples, not to certify every cited asymptotic theorem.

## Files and integration

- `catalog-applications.json`: 24 lesson records, including dependencies, main path/branch designation, advantage type, and honest editorial status.
- `exercises/applications.json`: 48 questions with explained answers.
- `sources/applications.json`: 30 source records, dated and labeled by verification depth.
- `definitions-applications.json` plus two definition pages: `derivatives` and `positive-semidefinite`. These support actual detours used in the variational and learning chapters.

Temporary Python authoring/patch scripts were removed after integration because their old text predated correctness fixes and independent chapter revisions. The Markdown and JSON content files are the maintained source of truth. Runnable numerical examples remain in `public/examples/`.
