# Matrix and simulation curriculum research audit

Verification date: **2026-11-02**. Scope: numbered lessons 23–37, modules 5–6. This audit supports the curriculum; it does not claim to have read every proof in the cited papers or surveyed every 2026 preprint.

## Authored artifacts

- 15 substantive Markdown chapters, all marked `complete` after adding a complete normalized SDP feasibility mechanism; none is marked independently reviewed.
- 30 exercises with worked answers in `src/content/exercises/matrix.json`, in addition to inline predictions and numerical practice.
- Four reusable prerequisite explanations: trigonometry, matrix functions, norms/conditioning, trace/partial trace.
- Source library: `src/content/sources/matrix.json`, 15 entries with title, authors, URL, supported claim, actual verification date, and verification level. Shared source IDs `hhl`, `qsvt`, and `qsvt-tutorial` are owned by the site root.
- Catalog: `src/content/catalog-matrix.json`. IDs and numerical sequence preserved. No reordering of the user's requested chapters.

## Source verification

The following arXiv HTML texts were opened and relevant algorithm/input-model sections inspected:

- Childs, Su, Tran, Wiebe, Zhu, *A Theory of Trotter Error*, arXiv:1912.08854: product formula definitions and error/commutator structure.
- Campbell, *A random compiler for fast Hamiltonian simulation*, arXiv:1811.08017: sampled term rule, channel versus individual-circuit guarantee, and phase-estimation appendix.
- Harrow, Hassidim, Lloyd, *Quantum algorithm for linear systems of equations*, arXiv:0811.3171: coherent eigenvalue rotation, uncomputation, condition number, original state-output cost and access.
- Berry, Childs, Cleve, Kothari, Somma, *Simulating Hamiltonian dynamics with a truncated Taylor series*, arXiv:1412.4687: PREPARE/SELECT, segment normalization, and the explicit `3B−4BB†B` robust-amplification identity.
- Low, Chuang, *Hamiltonian Simulation by Qubitization*, arXiv:1610.06546: block-access conditions, invariant planes, and phase processing.
- Gilyén, Su, Low, Wiebe, *Quantum singular value transformation and beyond*, arXiv:1806.01838: overall transformation framework and singular-vector convention.
- Martyn, Rossi, Tan, Chuang, *A Grand Unification of Quantum Algorithms*, arXiv:2105.02859v5: QSP signal convention, degree/parity/completion conditions, concrete zero-phase Chebyshev sequences, QSVT and matrix functions. The unversioned HTML timed out on two focused calls; the versioned HTML succeeded. No source failure was represented as verification.
- Childs, Kothari, Somma, arXiv:1511.02306: input/output model and polynomial/Fourier precision improvement.
- Lin, Tong, arXiv:1910.14596: overlap/gap assumptions, block-encoding definition, polynomial eigenvalue-transform conditions.
- Lloyd, Mohseni, Rebentrost, arXiv:1307.0401: copy access and partial-SWAP density-matrix exponentiation.
- Berry, Childs, Ostrander, Wang, arXiv:1701.03684: Taylor history matrix, state output, final-time selection and conditions.
- Brandão, Svore, arXiv:1609.05537: sparse input model, compact output, Gibbs/multiplicative-weights mechanism, parameter dependence. The chapter now derives a conservative density-matrix feasibility loop and stopping proof from the matrix multiplicative-weights framework. It explicitly does not attribute the optimized Brandão–Svore oracle complexity to its simple constraint scan.

`full-text` in the source metadata means the relevant full-text sections were consulted, not that every theorem has been independently re-proved. Several arXiv HTML conversions print an automatically generated August 2026 date despite older paper versions; metadata uses the actual submission/publication identity, not that conversion artifact.

Abstracts were checked for bounded contextual claims only:

- Low and Wiebe, arXiv:1805.00675 (interaction-picture simulation).
- Costa et al., arXiv:2111.08152 (discrete-adiabatic linear solving); additionally checked the published PRX Quantum theorem statement at https://doi.org/10.1103/PRXQuantum.3.040303 .
- Dong, Lin, Tong, arXiv:2204.05955 (QET-U).
- An, Liu, Lin, arXiv:2303.01029 (LCHS).
- Kerenidis and Prakash, arXiv:1603.08675 (recommendation/SVE access model).
- Tang, arXiv:1807.04271 (classical sample/query comparison).

A guessed arXiv ID 2303.16447 resolved to an unrelated computer-vision paper. It was discarded and is not a source. Searching the actual LCHS title verified the correct ID 2303.01029. No guessed citation was propagated.

## Coverage additions and scope choices

Significant developments are substantive sections inside relevant lessons rather than new lesson numbers:

1. **Interaction-picture simulation** in 29: explicit `A=ωZ, B=gX` transformed interaction, distinction between cheap dominant evolution and costly interaction.
2. **Discrete-adiabatic linear-system solvers** in 33: current foundational improvement over naive inversion-plus-amplification; query conditions and readout limits retained. No assertion that this is the newest or universally best implementation in November 2026.
3. **QET-U** in 34: controlled-evolution input versus Hamiltonian block access, a material design choice for early fault-tolerant circuits.
4. **LCHS** in 36: nonunitary dynamics without a history-system reduction; a tested exact two-dimensional contraction illustrates LCU without pretending to implement the general method.
5. **Classical sample/query dequantization** in 33 and 35: required baseline correction, not a separate quantum algorithm lesson.

Open-system/Lindblad simulation, quantum chemistry mappings/resource-estimation case studies, and PDE-specific boundary/discretization analyses are substantial further applications. They are not independently taught by these chapters and must remain listed as scope exclusions or future additions rather than silently counted as covered. The basic ODE lesson does not constitute a general nonlinear differential-equation solver. Thermal filtering does not substitute for the separate quantum-Metropolis lesson.

## Prerequisite rationale

- Product formulas introduce matrix exponentials in place, with no prerequisite calculus course.
- qDRIFT introduces density matrices exactly when classical circuit randomness makes a mixture necessary.
- Energy estimation combines already-taught QPE with simulation and explicitly treats overlap and aliasing.
- HHL precedes block encoding as an accessible concrete instance of a nonunitary map inside a unitary.
- LCU plus oblivious amplification precedes Taylor simulation.
- Qubitization provides the rotation; QSP makes it programmable; QSVT changes singular components; modern solvers and filtering apply it.
- PCA distinguishes copy access from row-state/block access; ODEs then expose history extraction; SDP reuses Gibbs preparation and expectation estimation.

## Numerical verification actually executed

Command: `python3 scripts/check-matrix-examples.py`

Result: **16 tests passed**, using only Python standard-library arithmetic and `unittest`. These are ideal classical calculations, not hardware experiments. Tests include:

- product-formula normalized states, exact X+Z evolution, shrinking splitting error;
- qDRIFT mixture probability versus an invalid state-vector average;
- energy-estimation Fourier cancellation;
- HHL conditional solution, norm, failure probability, and coherence-sensitive measurement;
- full LCU unitary;
- oblivious amplification and cubic response;
- Taylor block scaling and postselection;
- qubitization rotations;
- QSP phase insertion;
- a non-Hermitian 4×4 QSVT circuit and distinction from ordinary powers;
- polynomial inverse state;
- ground/thermal filters;
- partial-SWAP density-matrix step;
- ODE history norms/extraction and contraction;
- SDP Gibbs state/optimum and the finite-tolerance feasibility loop, including a feasible instance that stops after 30 updates and a contradictory instance that reaches the rejection cap.

Representative checked numbers: exact `H=2X+Z,t=.3` probability 0.30913791187621303; one-step qDRIFT 0.4090673648976957; ODE final-time selection 97/817 = 0.11872705018359853. No renormalization is hidden inside gates; conditional normalization is explicit only after a success event.

## Editorial limits

These chapters are authored and their chosen numerical instances checked. They are not marked `reviewed` because a separate full technical/pedagogical review has not yet occurred. Chapter 37 now includes a complete conservative feasibility framework, an explicit stopping proof, a finite-accuracy diagonal run, and simultaneous measurement confidence accounting. Its optimized dual-sampling implementation remains a clearly labeled cited extension, not an implemented or derived claim. General-purpose phase synthesis, sparse oracle construction, and fault-tolerant compilation are described as implementation requirements, not delivered software. The runnable examples are small mathematical checks rather than fake full-algorithm simulators.


## Independent review of search/Fourier chapters

Reviewed the actual authored prose of lessons 08, 10, 13, 14, 16, 17, 19, 20, 21 and 22 for consequential sign, normalization, access-model and postprocessing errors. No substantive correctness defect was found in that sample. In particular:

- 08's complex phase and cubic failure polynomial agree at the worked probability; its interval guarantee is correctly separated from monotonic intermediate behavior.
- 13's measured-bit order and feed-forward signs for phase 3/8 are consistent. The lesson properly distinguishes coherent QFT from terminal measurement statistics.
- 14 does not overstate the tiny Q=16 grid as satisfying the general Shor precision condition, and rejects reduced denominators that fail verification.
- 16 correctly refuses modular division by a noninvertible sampled coefficient.
- 17 warns that one Fourier sample need not certify the candidate subgroup; tiny-table checking is explicitly charged.
- 19 distinguishes phase eigenbranches and adds their probabilities, not amplitudes.
- 20 separates synthetic data, likelihood fitting and confidence intervals; its inverse branch is monotonic for the stated interval.
- 21 computes the payoff flag's probability by adding distinct-index probabilities, and counts coherent model costs.
- 22 distinguishes modular addition from XOR, computes the nonlinear finite-grid example to an output, and allocates curvature versus rounding errors.

Independent Python calculations were executed (separate from the author's own checks) for: lesson 08 failure 1/1352; every row of lesson 19's K=8 amplitude-estimation distribution; lesson 20 interval endpoints 0.11697777844051097 and 0.13369328129526076; lesson 22 rounded oracle integers and success 0.999897644906525. All agreed with the authored values within their displayed rounding. This is a sampled technical review, not an audit of every prerequisite explanation or every theorem in 06–22, so it does not by itself justify marking all those chapters reviewed.
