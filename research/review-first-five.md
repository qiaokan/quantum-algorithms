# Independent content review: lessons01–05

Date: **2026-11-02**. Reviewer: textbook_search_fourier (not the author of lessons01–05). Reviewed files:01-deutsch.md,02-grover.md,03-bernstein-vazirani.md,04-deutsch-jozsa.md,05-simon.md; associated `exercises/root.json`; inspected `src/lib/demos.ts` for ordering/interface agreement. This is an internal independent-agent content review, not external scientific peer review.

## Verdict

No mathematical or teaching-blocking defect found in the first five lesson bodies. Their explicit vectors and oracle conventions are consistent, they reach final outputs, and they provide the missing elementary definitions at first use. They correctly distinguish amplitudes/probabilities, global/relative phase, algebraic rewrites/gates, oracle construction/query count, deterministic/randomized comparisons, and simulator state inspection/hardware measurements.

These five chapters meet the local authored-and-reviewed criterion after the independent checks below. The parent should update their editorial metadata; this reviewer did not edit their files or metadata.

## Checks by lesson

- **Deutsch:** all four function tables, the full joint permutation, target-minus phase kickback and last-H amplitudes agree. The classical one-query worst-case probability limit is correctly stated. The function10 oracle is explicitly two elementary gates inside one coherent query.
- **Grover:** each marked position gives unit success after one four-item iteration. Second/third iteration success falls to1/4, fourth returns to1. Diffusion's fixed matrix, zero reflection, global-sign circuit convention and N=8 amplitudes all agree. The exactly-one classical inference after N−1 failures is handled correctly.
- **Bernstein–Vazirani:** the101 sign pattern, each readout-H intermediate vector and the nonlinear AND counterexample are correct. The affine constant is a global phase. The one-query result is not described as one elementary gate or an exponential gain.
- **Deutsch–Jozsa:** balanced0110, both constants and broken0001 examples agree. Classical independent random-query failure2^(1−k) is correct. The proof uses only the all-zero amplitude and does not incorrectly promise deterministic nonzero labels for every balanced function.
- **Simon:** the explicit min(x,x XOR011) table satisfies the promise; pair conditioning and both intermediate Hadamard vectors agree. The joint-state marginal is treated correctly, repeated samples are equations rather than copies of the answer, and the classical Gaussian-elimination example reaches011. The n−1-rank and insufficient-rank handling are explicit. The larger one-to-one promise variant is not silently claimed covered by the nonzero-mask example.

Each lesson has two separately stored exercises with explained answers. Inline prediction controls contain genuine derivations/counterexamples. The first two are independently readable. Appropriate prerequisite links exist in the prose; route/focus/scroll behavior itself is a separate browser-test concern.

## Executed independent arithmetic checks

Ran `python3 public/examples/search-fourier-checks.py`: **20 tests passed**, of which five named cases independently review01–05:

- `test_deutsch_all_truth_tables_independent`
- `test_grover_all_marks_iterations_independent`
- `test_bv_all_masks_independent`
- `test_dj_all_two_bit_promises_independent`
- `test_simon_all_masks_independent`

These implementations do not import the site's simulator. They enumerate all four Deutsch functions, all four Grover marks/iteration cycles, all eight three-bit BV masks, all sixteen two-bit Boolean tables for the DJ promise/violation check, and all seven nonzero three-bit Simon masks. They independently verify the authored conclusions and probability sums; they do not prove general complexity theorems or test the website UI.

## Separate implementation finding communicated to parent

In `src/lib/demos.ts`, `const theta=Number(instance)||0.25` treats valid phase0 as the fallback0.25. This is outside lessons01–05, but is a real phase-estimation demo edge-case defect. Sent to parent for correction using explicit finite-number/default handling. It does not block review of the first five lesson bodies. Browser behavior and source test status remain the parent's integration responsibility.

No source prose changes were made to01–05, since no substantive bug was found. This review did not manufacture stylistic objections to justify edits.
