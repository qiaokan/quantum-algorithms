# Search, Fourier and estimation authoring audit

Verification date: **2026-11-02**. Authoring/research agent: textbook_search_fourier. This is a source and calculation audit, not independent peer review of these chapters.

## Delivered scope

Authored lessons 06–22 in the user's requested order, together with `src/content/catalog-search-fourier.json`, `src/content/sources/search-fourier.json`, and `src/content/exercises/search-fourier.json`. Every chapter reaches a concrete example output, includes inline citations and an explicit bibliography, and has two separately stored worked exercises. Definitions link to the shared local library; essential notation is also introduced inline. All use natural big-endian labels, column states, positive QFT and negative inverse QFT.

The initial Jordan draft was marked partial because it only completed the linear case. This gap was subsequently closed with a nonlinear quadratic instance, explicit grid width and scale, twelve-bit output quantization, all eight rounded oracle values, calculated Fourier probabilities and a conservative analytical leakage bound. It is now authored-complete, not independently reviewed. The lesson states that exact-grid slopes are special and off-grid recovery needs finite-resolution analysis/repetitions.

Current editorial count for this batch: **17 complete, 0 reviewed, 0 partial, 0 planned**. “Complete” describes authored teaching coverage, not proof of universal correctness, a third-party expert review or a physical demonstration.

## Source verification

Sources were checked before chapter authoring using public primary papers, author-maintained material and official IBM Quantum Learning. The source JSON records title/authors/URL/support and distinguishes full-text/official documentation from abstract-only verification.

Full-text sections read included BHMT amplification/estimation (especially Theorem 12), Yoder–Low–Chuang equations 1 and 13–14 with the pi/3 discussion, BHT collision Theorem 1, Shor sections 3–6, Griffiths–Niu terminal Fourier measurement, Dobšíček et al. iterative-QPE distinctions, Childs–van Dam abelian Fourier/HSP sections, Suzuki MLAE construction, Grinko IQAE confidence/interval construction, Jordan's modular-addition oracle and scaling, Ambainis's stopping-time theorem. Minimum-finding and Montanaro full text were available at author/university URLs and the relevant algorithm/introduction was inspected. BBHT's abstract/indexed primary-paper text was checked; the full proof was not independently audited. Regev and the improved-gradient paper were checked at abstract level only and are explicitly labeled that way.

No source was copied into chapter prose wholesale. Worked numbers, tiny examples and finite-state calculations were authored for this book. No hardware performance or experimental observation is asserted.

Some arXiv HTML rendering injects a 2026 date in old papers' rendered text; this was not treated as a new research publication date. The arXiv submission/version metadata is the appropriate historical source.

## Dependencies and intentional teaching choices

- 06 builds on Grover; 07–10 branch into unknown counts, robust amplification and checker construction.
- QFT follows Deutsch's phase cancellation. Phase estimation introduces eigenvectors locally and uses an explicit three-eighths instance plus an inexact one-third case.
- Iterative QPE comes after ordinary QPE. It is carefully separated from both terminal semiclassical Fourier measurement and Kitaev's statistical procedure.
- Order finding first uses a small exact-divisibility packet; it explicitly states the small grid is below the generic Shor precision prescription. Shor then uses N=21 and Q=512, including unsuccessful bases and sample denominators.
- Discrete log uses an order-eight subgroup modulo 17 so the finite-group transform is exact. It explains the different treatment of non-power-of-two orders.
- HSP is introduced after concrete Simon and discrete-log mechanisms, with a candidate-versus-certified-subgroup distinction. One Fourier sample is never called a universal certificate.
- Counting links search angles to QPE; generic amplitude estimation then replaces uniform preparation with a nonuniform coherent preparation.
- MLAE and IQAE get separate worked inference examples and distinct statistical claims.
- Quantum Monte Carlo accounts for payoff encoding/range, coherent model cost and readout; Jordan contrasts its coherent oracle with automatic differentiation.

No dependency reordering was needed. Definition `trigonometry` is provided by the matrix research task, not duplicated here.

## Significant omissions and developments assessed

1. **Variable-time amplitude amplification** is significant for modern linear solvers. Added an explicit stopping-time bridge in lesson06, with a numerical root-mean-square example and a warning that this parameter alone is not the complete runtime theorem. The parent/matrix chapters can deepen it as part of modern solvers. It is not represented as a separate completed full algorithm lesson.
2. **Regev factoring** is an important later development in an established family. Lesson15 names its number-theoretic assumption, repeated shorter circuits and classical lattice stage. Per-run savings are not misrepresented as total runtime or an unconditional physical improvement. A full lattice-based worked derivation is outside this batch, and the source is abstract-verified only.
3. **Improved quantum gradient computation (Gilyén–Arunachalam–Wiebe)** warrants inclusion in the coverage audit because it improves precision dependence and confronts probability-to-phase access. Added to lesson22's extensions and bibliography. Full proof and implementation are not presented as completed here.
4. **Depth/shot tradeoffs and amplitude-estimation variants** are included in20 rather than inflating the count with every estimator. No universal finite-sample coverage is attributed to the original MLAE numerical/statistical analysis.
5. **Multivariate mean estimation** is a useful further specialist topic, but this batch does not present or validate a full modern vector-output estimator. The Monte Carlo chapter's scalar-output scope is explicit. Do not claim all contemporary estimation variants are covered.

## Executed numerical checks

Command, run successfully from the project directory:

```
python3 public/examples/search-fourier-checks.py
```

Result: **20 unittest cases passed**. The file is also downloadable in every chapter06–22. The cases include independent root-chapter review fixtures for01–05, plus:

- the exact a=1/4 general amplification and overshoot;
- two-of-eight BBHT and collision search;
- fixed-point complex phase, unit norm, and its bounded-error curve over 640 sampled initial probabilities;
- QFT/inverse consistency on every basis input for sizes2,4,8,16 and a separate two-qubit gate decomposition;
- exact3/8 and inexact1/3 QPE;
- iterative phase feedback;
- period packet, Shor21 candidate/rejections and its Q=512 Fourier value;
- all 64 two-register discrete-log Fourier labels;
- abelian coset constraints;
- complete counting and eight-label amplitude-estimation probability tables;
- IQAE interval inversion and Monte Carlo state preparation;
- Jordan's linear modular-addition phase kickback and the nonlinear finite-precision instance.

The checks test ideal arithmetic and return normalization errors rather than renormalizing. They are not a general quantum algorithm implementation or exhaustive proof of asymptotic results.

## Corrections made during self-audit

- Recomputed Shor21 conditional sample probability as **0.1141718203**, replacing a rough initial0.1145.
- Corrected HSP prose to call a one-sample subgroup a candidate, with tiny-table direct verification distinguished from a scalable repeated-sampling confidence guarantee.
- Added the complete nonlinear Jordan example to close the originally recorded teaching gap.
