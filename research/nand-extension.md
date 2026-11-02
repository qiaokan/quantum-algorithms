# Lesson 43: finite discrete span-program extension

Verification date: 2026-11-02. Original Hamiltonian recurrence-only draft replaced by an explicitly labelled discrete product-of-reflections algorithm. This closes the missing leaf encoding, finite running length, measured distribution, and soundness budget through an alternative standard mechanism; it does not claim to have completed Farhi–Goldstone–Gutmann wavepacket scattering.

## Primary-source inspection

- Ben W. Reichardt and Robert Špalek, *Span-program-based quantum algorithm for evaluating formulas*, arXiv:0710.2630, https://arxiv.org/html/0710.2630. Inspected introduction, definition 2.1, Sections 2.1–2.4 and associated target/eigenvector correspondence. Definition, formula composition and balanced-tree query comparisons support the lesson. Full-text relevant-section verification, not a claim to independently prove every theorem in the source.
- Ben W. Reichardt, *Reflections for quantum query algorithms*, arXiv:1005.1601, https://arxiv.org/html/1005.1601. Inspected Section 2's fixed and input-dependent reflections and phase-estimation algorithm; inspected relevant Section 3 zero-phase and near-zero-phase analysis. The paper explicitly distinguishes query bounds from the unknown cost of compiling the fixed reflection. Our product order is reversed, hence the unitary is inverted relative to the source convention; zero-phase detection is unchanged.

## Original construction and certificate

Function is NAND(NAND(x1,x2), NAND(x3,x4)), equivalently (x1 AND x2) OR (x3 AND x4). Target t=(1,0,0), input vectors (1,1,0), (0,1,0), (1,0,1), (0,0,1), available iff their bit is one. A=[t/2,v1,v2,v3,v4]. Fixed reflection R is twice its kernel projector minus identity; input D fixes label0 and true leaves, negates false leaves. Five work labels embed into three qubits with padding fixed. Construction is fixed before observing input bits.

An eight-bin QPE circuit uses 4+2+1=7 base U=RD steps, not three oracle calls. Controlled input reflection uses two clean bit queries, with only the phase operation conditioned on QPE control; there is no assumption of free controlled access to an unknown oracle. Six trials use 84 bit queries.

All 16 zero-bin probabilities are calculated as exact fractions from ||sum(k=0..7) U^k |0>/8||². True minimum is 52436/78125 > 2/3; false maximum is 3136/78125 < 1/24. Accepting iff at least two of six trials have zero phase gives false-negative bound 13/729 and false-positive bound 5/192. Actual maximum over 16 inputs is about 0.0216964789. The source's asymptotic theorem is not used to manufacture these constants.

For worked input1101, the lesson lists all eight intermediate work vectors, both zero- and four-bin amplitude vectors, full eight-outcome distribution, and the six-trial final answer error0.0155202735. It also provides constructive fixed-matrix compilation by ten two-coordinate rotations, rather than treating the dense reflection as a free arbitrary oracle. Synthesis error at most1e-4 per42 controlled R blocks and six inverse-QFT blocks adds at most0.0048 total variation, under exact remaining gates/oracle. No physical-noise or hardware claim.

## Executed verification

`python3 public/examples/nand-checks.py` executed successfully, 11 tests passed:

1. Exact rank-based span predicate equals the Boolean reference for all inputs.
2. Kernel basis, Gram inverse, projector, explicit R entries, and R²=I.
3. U†U=I and normalization of every intermediate state, all16 inputs.
4. Compute-phase-uncompute leaf oracle, all16 inputs, all8 work labels, both controls.
5. Every published intermediate vector and b0/b4 for1101.
6. All16 exact zero-bin probabilities and separation bounds.
7. Full Fourier output distribution, normalization, and exact/floating zero-bin agreement.
8. Independent direct controlled-power circuit (4,2,1 repetitions) versus finite-Fourier calculation, all16 inputs.
9. Six-trial binomial error and synthesis budget.
10. Positive witnesses and exactly2/3 prepared overlap.
11. Rotation elimination and reconstruction of fixedR.

Only the Fourier transform and rotation compilation use complex/real floating point; the finite zero-bin certificate uses Python Fraction. The direct controlled circuit is an ideal classical state simulation, not a quantum hardware run.

## Scope and editorial decision

Lesson43 is now marked complete for its explicit finite discrete algorithm. It includes a constructive series/parallel incidence-vector generalization, costs, predictions, two exercises with answers, and source provenance. It explicitly does not assert that84-query toy circuitry has a query advantage. Optimal asymptotic weight choices, witness bounds and gate-efficient large-formula constructions remain cited theory beyond the worked mechanism, not purportedly derived inside the chapter. No unresolved step remains between this chapter's defined input oracle and its promised finite output/error.

Historical source app-nand remains in the wider reference library, but lesson43 now references the two verified discrete-construction sources. Only the formula-evaluation entry and its two exercises were updated in shared application metadata; other chapters are unchanged.
