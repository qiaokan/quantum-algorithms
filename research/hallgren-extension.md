# Hallgren/Pell chapter completion audit

Verification date: 2026-11-02. Authoring owner: search/Fourier research worker. Applications worker explicitly yielded chapter58 and corresponding metadata/source row; no other application chapter was changed.

## Scope and actual work

Replaced the explicitly partial integer-period analogy with a 4,800-word end-to-end regulator/Pell lesson. The worked input is d=3, D=12, order Z[sqrt3]. The chapter constructs the two reduced ideal pairs (1,2) and (2,2), checks reduction arithmetic and logarithmic distances, derives a compact ideal-composition example, defines an actual evaluable ideal/residual oracle, discretizes it, derives a real irregular preimage packet, evaluates QFT amplitudes/probabilities, reconstructs the period from two possible frequency outcomes, locally refines it, and obtains Pell solution(2,1).

The full worked algorithm is the regulator/Pell branch. Principal ideal and class-group algorithms are described as separately sourced extensions, not separately implemented full algorithms. Class-group GRH dependence is explicit.

The tiny example is classically trivial. No practical or hardware advantage is claimed. The example is not compiled with R hidden in its oracle: both the sequential oracle and the composition/reduction evaluator take only the discriminant and query position. The sequential finite-domain simulator is explicitly not polynomial-time classical simulation of the quantum algorithm.

## Sources actually read

1. Sean Hallgren, Polynomial-Time Quantum Algorithms for Pell's Equation and the Principal Ideal Problem, author-hosted May9,2006 manuscript, https://www.cse.psu.edu/~sjh26/pell.pdf. Downloaded the actual PDF to a temporary read-only research file and extracted sections; also read the same manuscript via https://public.csusm.edu/ssharif/crypto/Hallgren-Pell.pdf. Sections1–3 technical text read, including Definition2.1, Claim2.1, Theorem1, Algorithm3.1, Lemma3.1, Lemma3.2 and Theorem2. Section4 algorithm and definitions read for extension scope; class-group GRH statement checked in abstract/introduction. Source app-hallgren-source updated from abstract-only to relevant-full-text verification with this exact scope.
2. Richard Jozsa, Notes on Hallgren's efficient quantum algorithm for solving Pell's equation, 2003, https://arxiv.org/html/quant-ph/0302134. Read sections2–10, including canonical pair representation, rho/rho-inverse, principal cycle, the distance convention, product formula, repeated-squaring evaluation and approximate-period reconstruction. Added source ID hallgren-jozsa.
3. Childs/vanDam, Quantum algorithms for algebraic problems, https://arxiv.org/html/0812.0380, sectionsV1–V3 consulted as a cross-check. Not used to claim construction details: survey explicitly omits the full reduced-ideal mechanics. Not added as a lesson citation because the two directly used sources suffice.

## Source pitfalls handled

- Fundamental unit and least norm+1 Pell unit differ when the fundamental unit has norm−1. The previous d2 wording could conflate them. New lesson explicitly computes 1+sqrt2(norm−1), then squares to3+2sqrt2(norm+1); main example d3 avoids the ambiguity.
- Different papers use different ideal-distance conventions. Chapter/code consistently use J=O/alpha, distance ln(alpha), following Jozsa's section6.3/section7 formal definitions. It does not mix Hallgren's later half-log conjugate-ratio distances with those increments.
- Jozsa's section8 summary has an inconsistent generator sign relative to its formal section7 definition. The explicit alpha recurrence and formal definition are used, not that sentence.
- Jozsa's simplified oracle-precision discussion is insufficient by itself to rule out grid points arbitrarily near ideal boundaries. Hallgren2006 identifies and addresses this. The chapter supplies a finite random-offset union bound: for K offsets and B relevant boundaries, bad fraction <= B(2N eta+2/K); eta=beta/(4BN), K>=4B/beta gives <=beta.
- Jozsa's printed specialized squaring expression appears to omit a b factor compared with its general product formula. The chapter uses the general formula, checks it algebraically on d3, and tests the implemented formula against sequential reduction across7 discriminants.
- Jozsa marks its Proposition33 geometric proof as not reconstructed in that exposition. The lesson treats polynomial reduction/correction bounds as cited infrastructure results, not as a new fully proved theorem; the later Hallgren paper also uses the established arithmetic infrastructure. A complete independent proof of every algebraic-number-theory lemma is outside the pedagogical scope. The worked transformations, evaluator, precision argument and reconstruction are explicit.
- Some formulas in the HTML/paper contain typographical slips (e.g. omitted index factors in Fourier phases). The chapter derives the phase expansion independently with the necessary ell factor.
- arXiv quant-ph/0206019 is NOT Hallgren's paper. It is unrelated and is not cited.

## Numerical checks actually run

Command: `python3 public/examples/hallgren-checks.py`

Result: 12 tests passed, standard library only.

Checks cover:
1. Actual reduction cycle and logarithmic return distance.
2. Compact ideal composition J1²=(1/2)O and corrected tracked distance.
3. Norm−1 vs norm+1 distinction for d2.
4. Actual oracle preimage packet and failure of exact integer period42.
5. Packet indices equal4+round(ell NR), independently of oracle construction.
6. Oracle labels agree at35/60 decimal digits, and actual finite-domain boundary margin exceeds0.000015.
7. Full positive-exponent QFT normalization and selected amplitudes against direct complex sums.
8. Stated measurement probabilities.
9. Continued fractions, candidate generation and actual unit-ideal verification.
10. Classical refinement to R and Pell solution.
11. Repeated-squaring/composition evaluator vs sequential reference for discriminants8,12,24,28,40,44,52; independent check at position10^9+1/64.
12. Marginal probabilities correctly sum probabilities over function-register labels.

Key checked values: N32, q16384, shift1/64, packet label(1,2,4), packet size389. First indices4,46,88,130,173,215,257,299. R=ln(2+sqrt3)=1.3169578969248167; S=42.1426527015941. Conditional P(1166)=0.0163293712388; P(1944)=0.0214935544225. CF(1166/1944) gives numerators0,1,1,3,583; nonzero candidate periods14,42,8192; only42 passes the worked local test. Refinement gives(2,1).

The code's Decimal precision agreement and observed margins are numerical checks, not certified interval arithmetic. It contains no hardware experiment and no synthesized reversible circuit. The complete pedagogical algorithm uses explicit sources for general infrastructure/complexity theorems; it does not claim all those theorems were reproved or a production fault-tolerant implementation was built.

## Editorial status

The two previously recorded pedagogical gaps (evaluable reduced-ideal real-period oracle; actual discretization/Fourier/precision/reconstruction) are now addressed substantively. Change58 to complete, not independently reviewed. An independent review is still needed before the reviewed label is appropriate. No new definition IDs are required: essential new definitions are inline and existing prerequisite links remain valid.

## Independent review correction

Matrix-methods reviewer identified a source-scope mismatch: Jozsa's detailed infrastructure derivation uses a square-free field/maximal order, whereas an opening statement permitted arbitrary nonsquare d with D4d. Fixed by explicitly promising square-free d congruent2 or3 modulo4 for the detailed derivation. Hallgren's broader arbitrary-order theorem remains cited with its scope distinguished. The D52 code case is explicitly an extra numerical cross-check outside the teaching promise, not a proof of nonmaximal-order generalization. This does not affect d3 arithmetic or the taught algorithm under its now-explicit promise.

Matrix reviewer subsequently found no further correctness blocker. They checked the random-offset union bound for both ideal and residual-floor boundaries and independently reconstructed all three candidates using `fast_ideal_left_of` plus local reduction, without cached boundaries or a supplied regulator. Root also ran all12 checks and inspected chapter58. Per root's editorial decision, the metadata remains complete/authored rather than reviewed.
