Review date: 2026-11-02. Actual Claude Code CLI; read-only isolated snapshot. Response preserved verbatim. Some cumulative unread-scope claims conflict with round 1; see the disposition record instead of treating that list as a verified union.

# Independent review, round 2

## Verdict

**I found no actionable blocker (P1 or P2) in what I inspected.** All four round-1 P2 findings are resolved by the current source, and so are all eleven P3 groups and the crawler issue. I found two small new P3 issues. Neither blocks release. Both are one-sentence fixes to a logical step.

My agreement covers only what I inspected. Material listed below was not reviewed, and this is not full-book peer review. I ran nothing; the test results are the author's reported runs. External papers were not available offline, so I checked statements against the source text and standard results, not against the papers.

## 1. Remaining defects

### P3-A — Lesson 27: unitarity is inferred from U² = I alone
- **Where:** `src/content/lessons/27-block-encoding.md:42`
- **Problem:** "Thus U² has diagonal blocks I and zero off-diagonal blocks; U is unitary." U² = I only shows U is its own inverse. A matrix can satisfy that without being unitary; for example [[1,1],[0,−1]] squares to I but is not unitary.
- **Why the conclusion still holds:** B and C are real symmetric, so U is symmetric, so U†U = U² = I. The sentence leaves that step out.
- **Fix:** add "B and C are real symmetric, so U† = U and U†U = U² = I."

### P3-B — Lesson 40: the general-chain step should name which eigenvector to use
- **Where:** `40-szegedy-mnrs.md:26` and `:56`
- **Problem:** The derivation lifts an eigenvector of P (`P|v⟩=λ|v⟩`) and uses A†B = P. That is valid for the worked symmetric chain. Line 56 then says that for a general reversible chain A†B is the discriminant D, with the same spectrum as P. It does not say that v must now be an eigenvector of D. A lifted eigenvector of P does not satisfy the reflection relations at `:28` when P ≠ D.
- **Fix:** add one clause at `:56`: "repeat the derivation with v an eigenvector of D; D is symmetric, so B†A = D as well."

Neither changes any number or the gap bound.

## 2. Verdict on each round-1 issue group

### P2-1 — Szegedy mechanism: resolved
I recomputed every step of the new material in `40:24–62`:
- **The two-dimensional eigenproblem:**
  - R_A b = 2λa − b, and the matching relations.
  - The coefficient matrix [[−1,−2λ],[2λ,4λ²−1]] has determinant 1 and trace 2cos 2θ, so its eigenvalues are e^{±2iθ}.
  - For λ = ½ this gives z² + z + 1, so the phases are ±2π/3.
- **The lifted vectors:** a±, b±, and |Π⟩ are correct, and the overlap of a₋ and b₋ is ½.
- **The extra zero-phase vector:** c is orthogonal to a±, b+ and b₋, has unit norm, and both reflections negate it, so Wc = c.
- **The two-bit filter:**
  - Zero-bin amplitude g = (1+z+z²+z³)/4 = ¼, so the false-positive probability is 1/16.
  - It uses 3 controlled W calls.
- **Error norm versus probability:** this is handled correctly. F†(2|00⟩⟨00|−I)F leaves an error vector of norm 2|g| = ½. The text explicitly warns not to equate that with 1/16. With k filters the error is 2·4⁻ᵏ at a cost of 6k uses; k = 5 gives 1/512 for 30 uses. That bound is valid on a superposition because the error vectors for different eigenvectors are orthogonal.
- **Relevant subspace:**
  - The mark reflection preserves im A, and so does the ideal reflection about |Π⟩.
  - The text says the filter is analyzed only on that supported input.
  - It says approximation leakage outside that space is covered by the accumulated error bound.
  - The c-direction is therefore handled correctly.
- **The gap relation:** Δ = 2·arccos(1−δ) ≥ 2√(2δ). This follows from 1 − cos θ ≤ θ²/2, and laziness keeps every phase in [Δ, π]. The zero-bin bound |1−z^M|/(M|1−z|) ≤ 1/(M|sin(φ/2)|) is correct, as is M−1 uses for M = O(1/Δ).
- **The logarithm:** the text says the elementary construction costs O(U·δ^{−1/2}·log(1/η)) with η = O(1/T), so it keeps a log T factor. It attributes the log-free bound to MNRS's own theorem. I cannot check MNRS's internal argument offline, but the text does not claim to have derived that bound, which is the honest position.
- **Tests:** `applications.py:95–116` now checks the phases, the extra vector, A†B = P, the zero bin on both eigenvectors, the reflection error ½, and the 1/16 probability.

### P2-2 — Element-distinctness cost: resolved
`41:25` gives setup r, 2r per reflection, and about N/r iterations, so Θ(N) total. It says plainly that this variant has no asymptotic advantage. Lines 29–33 contrast this with r + N/√r. The "four value-oracle calls" count for the reflection (`:23`) is correct.

### P2-3 — Continuous-time walks: resolved
I recomputed `39:51–69`:
- H = −I − B, B² = I/N, and B|s⟩ = |w⟩/√N.
- The closed form, and marked probability sin² + cos²/N, which reaches 1 at t = π√N/2.
- The N = 4 amplitudes at t = π/2: i/(2√2) on unmarked labels and −1/√2 + i/(2√2) on the marked one, giving probabilities 1/8, 1/8, 5/8, 1/8. At t = π the state is −i|2⟩.
- The complete-graph identity −A/N − |w⟩⟨w| = H + I/N.

Continuous oracle access is handled correctly:
- Oracle strength is fixed, so cost is strength times time.
- The text says "not a single query", and that digital synthesis cost is separate.
- It notes that the search time depends on the graph.

The glued-trees result is attributed with its different promise and is not claimed as taught. The test at `applications.py:83–94` covers N = 4, 9 and 16.

### P2-4 — Status labels: resolved
**Lesson 41:** marking it `partial` with the exact gap (`catalog-applications.json:142–144`) is the correct remedy under `AUTHORING-CONTRACT.md:17`. It does not relabel the Θ(N) example as optimal, and the worked mechanism plus the cost derivation are substantive. I do not consider a full Ambainis data-structure implementation a precondition for release. The disclosure is enough.

**Lessons 39 and 40:** now teach their mechanisms, so `complete` is defensible. Lesson 40 is in the same position as Kuperberg's lesson: a fully worked mechanism with a cited sharper theorem.

**Lesson 42:** now scoped explicitly as Grover triangle finding, in the title, the advantage text and `42:39`, with Le Gall as a cited extension. That makes `complete` accurate.

**Downstream text:** the coverage page prints gaps from the catalog, `VALIDATION.md:8,19` matches, and the audit rejects a `complete` lesson that lists gaps (`audit-content.ts:19`). Lesson 42 now distinguishes M from K (`:17`, `:35`), which also resolves P3-9.

### P3 groups

| # | Status | Evidence |
|---|---|---|
| 1 Spacing | Resolved | Regex audit at `audit-content.ts:41–44`, run on text outside math. My grep of exercises and revisits finds only `\sqrt5` and similar inside `$…$`. The audit doesn't scan lesson Markdown or `.astro` pages, but round 1 found those clean apart from the two page labels, which are fixed. |
| 2 Rendering | Resolved | Exercises and revisits go through `render()` (`[id].astro:11,20`). |
| 3 Answers exposed | Resolved | The toggle targets only `details[data-derivation]` (`reader.ts:16`), and the button is removed when a page has none (`:17`). Practice answers stay closed. Print still opens everything. |
| 4 Simon query cost | Resolved | Per-run counter (`Demo.astro:45`), and the sampling text names independent runs. |
| 5 "/" shortcut | Resolved | Removed; no global single-key handler remains. |
| 6 Search scope | Resolved per the disposition | I did not re-read `search-index.json.ts`. |
| 7 Density matrix | Resolved | The Bell partial-trace test is at `applications.py:117–124`. I did not re-read the definition prose. |
| 8 Demo order | Resolved | `[id].astro:31–35` and the table-of-contents order at `:21`. |
| 9 Lesson 42 count | Resolved | See P2-4 above. |
| 10 Duplicate script | Resolved | Only `public/examples/matrix-checks.py` is referenced. |
| 11 Labels | Resolved | The dialog uses "Page" / "← Return to page" when no lesson is open (`reader.ts:49`). I did not re-check the circuit control's group role. |
| Crawler | Resolved | `scripts/audit-links.py` checks local links, assets, fragments and duplicate IDs. External links are out of its scope by design. |

### Other changes since round 1
- **KaTeX:** the override (`package.json:9–10`) leaves the lockfile with a single `katex` 0.19.1. It matches the imported CSS.
- **Dark-theme print:** `book.css:6` resets every palette variable for `:root[data-theme=dark]`. Answers print because practice is `.prose` and the print handler opens all `details`.
- **Toolbar:** wraps below 1200px (`:10`).
- **Empty derivation control:** removed when a page has no optional derivations.
- **Mobile formulas:** I did not visually inspect the two reworked formulas (Grover and backtracking). I rely on the reported browser runs.

## 3. Additional lessons inspected this round

**Lesson 43, formula evaluation.** It genuinely teaches the span-program reflection mechanism. I recomputed:
- the kernel, Gram inverse, Λ₀₀ = 4/5, and several entries of R;
- ψ₁, ψ₂ (including the row-0 sum of 17) and ψ₂'s norm of 625/625;
- b₀ = 54146/78125 from the table's column sums;
- p₀ = 52854/78125 exactly;
- the decision bounds: 13/729, 5/192 and 187/192;
- the 1101 false-negative probability, ≈0.01552;
- the synthesis-budget argument: 48 blocks, with the hybrid bound applied across the six independent trials.

The NAND exponent log₂((1+√33)/4) ≈ 0.754 is correct. The zero-phase argument for false inputs is sound: vectors negated by both reflections are orthogonal to |0⟩.

**Lesson 58, Hallgren.** It genuinely teaches the oracle construction, pseudo-periodicity, and two-frequency reconstruction. I recomputed:
- R, t₁, the two gaps, S, and q/S;
- the preimage table entries, including f(172) = (1,2,3);
- the continued fraction [0;1,1,2,194] and its convergents;
- the candidates T = 14, 42 and 8192, and the distances 0.004458 and 0.510168;
- q ≥ 3M², and that N ≥ 64D/3 gives 2/N ≤ 3/(32D);
- the bad-shift parameters, which sum to β.

Pell recovery from ε gives x = 2, y = 1.

**Lesson 27, block encoding.** U, B, C, the anticommutation BC + CB = 0, and both practice examples are correct, apart from P3-A.

**Lesson 28, oblivious amplification.** I re-derived the good block 3B − 4BB†B from R = I − 2P. The worked sequence ending at (−1, 0) is correct, as are 11/16 and −0.216.

**Lesson 06, amplitude amplification.** Correct, including the variable-time RMS example: √100.99 ≈ 10.05.

**Lesson 54, IQP sampling.** The amplitudes (cos θ, 0, 0, i sin θ) and the R_z convention are correct.

**Lesson 56, random-circuit sampling.** Correct: p = (2∓√3)/8, Σp² = 7/16, E[XEB] = 3/4, a constant-01 sampler scores √3/2, and its total-variation distance is (6−√3)/8.

**Linear solvers:** I did not re-read lessons 26, 33 or 36 this round. Round 1 had recomputed them. Lessons 35 and 37 remain unread.

## 4. Scope

**Inspected this round:**
- Both research records.
- Lessons 06, 27, 28, 39, 40, 41, 42, 43, 54, 56, 58, plus a grep of lesson 62.
- Lesson-41/42 catalog entries and statuses for all applications lessons.
- Authoring contract.
- `audit-content.ts` and `audit-links.py`.
- `reader.ts`, `lessons/[id].astro`, `coverage.astro`.
- Print and toolbar CSS.
- Relevant `Demo.astro` lines.
- KaTeX entries in `package.json` and the lockfile.
- `applications.py` lines 1–160.
- Exercise and revisit spacing via grep.
- `VALIDATION.md` lines 8, 19 and 60–80.

**Still not inspected by any round:**
- Lessons 09, 11, 16–19, 21, 25, 34, 35, 37, 45, 46, 48–53.
- About 38 definitions.
- `sources/*.json` contents, apart from URL grep.
- The NAND, Hallgren and search-fourier Python scripts.
- `tests/browser/book.spec.ts` and the unit tests.
- `search-index.json.ts` and `content.ts`.
- Remaining pages and configs.
- Any external paper or URL. Many links use `arxiv.org/html/...` for old papers. I can't check offline that those render; the author reports checking them in a browser.

Those unread lessons could have scope or status problems like the ones round 1 found in Module 7. The arithmetic quality across the roughly 40 lessons now read suggests any remaining problems are more likely about scope than calculation, but that is an expectation, not a verified result.

## 5. Disagreement with the author

None of substance. I accept the disposition of every round-1 finding, including downgrading lesson 41 to partial rather than fully implementing the optimal walk. The two items above are additions, not objections. One small note: `VALIDATION.md:66,74` still gives historical counts (57 unit tests, 18 browser tests, 80 Python tests). Those sections are clearly dated, so this doesn't need a change.

## 6. Release verdict

**Releasable for the inspected scope.** The current dispositions hold up, and I found no P1 or P2 issue. P3-A and P3-B are recommended one-line fixes but not release conditions. These limitations remain and should stay disclosed:
- lesson 41 is partial;
- lesson 40's log-free bound is cited, not derived;
- several lessons and most definitions have not been independently reviewed.

This round does not justify a "reviewed" label for any chapter beyond those already labelled, or any claim of full-book review.