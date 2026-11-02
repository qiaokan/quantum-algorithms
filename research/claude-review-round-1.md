Review date: 2026-11-02. Actual Claude Code CLI, read-only snapshot; no repository credentials or Git metadata included. This is a sampled review, not full-book peer review.

I've finished. Below is the review. I made no edits and used only Read, Glob and Grep.

# Independent review, round 1: Quantum Algorithms, Step by Step

## Verdict

**No P1 blocker remains in what I inspected.** The arithmetic in every worked example I recomputed is correct. The simulator, demos and self-review fixes behave as claimed. There are **four P2 issues**, all in one area: the quantum-walk chapters (Module 7). Several of those chapters claim more than they teach, and they are labelled `complete` with no gaps listed, which breaks the project's own authoring contract. There are also eleven P3 issues.

## 1. Findings by severity

### P2-1 — Lesson 40 (Szegedy/MNRS): the step that produces the √δ speedup is asserted, never worked
- **Where:** `src/content/lessons/40-szegedy-mnrs.md:26`, `:28`, `:32–36`.
- **The exact missing step:** Szegedy's spectral relation. Each classical eigenvalue λ = cos θ becomes walk eigenphases e^{±2iθ}, so the walk's phase gap is at least about 2√δ. That relation is the only source of the U/√δ term in the cost formula.
  - The lesson computes W|00⟩ but never W's eigenvalues.
  - It never runs phase estimation on W.
  - It never shows how well the resulting reflection approximates 2|Π⟩⟨Π|−I.
- **The "completely explicit small search" doesn't use the walk** (line 28). With the uniform chain the stationary reflection is exact and identical to Grover's diffusion.
- **Checkable from the lesson's own matrix:** for P = [[3/4,1/4],[1/4,3/4]], λ = 1/2 gives θ = π/3. The walk eigenphases are therefore ±2π/3, plus an extra +1 eigenvector outside span(A,B) — the "other zero-phase vector" that line 36 warns about.
  - `test_szegedy_reflections` (`public/examples/applications.py:76–82`) checks only unitarity, W|00⟩ and W|Π⟩ = |Π⟩.
- **Impact:**
  - Lesson 41's exponent derivation (`41:29–31`) and lesson 42's cost discussion rest on a formula the book never derives.
  - The synthesis walk section (`62:57`) is the only connection there with no calculation.
- **Remedy:** for the two-state chain, compute W's eigenphases and show a 1–2-bit phase-estimation filter acting on |Π⟩ versus the ±1/3-turn components. Then state the gap relation. Otherwise mark the chapter partial with this gap.

### P2-2 — Lesson 41: the algorithm actually worked through gives no query advantage, and the lesson doesn't say so
- **Where:** `41-element-distinctness.md:23–25`.
- **Mechanism:**
  - Setup costs S = r loads.
  - Each reflection reverses and re-runs the setup, so about 2r queries per iteration.
  - About 1/√ε ≈ N/r iterations are needed.
  - Total ≈ Θ(N) queries for any r. That is the same order as the classical bound on line 7.
- The lesson only says the variant "does not achieve the optimal asymptotic query bound."
- **Remedy:** state Θ(N) explicitly, and contrast its terms with r + N/√r.

### P2-3 — Lesson 39 (continuous-time walks) contains no algorithm and no complexity statement
- **Where:** `39-continuous-walks.md`, the whole file.
- **What it contains:** the only example is a two-vertex oscillation that line 11 itself calls "not a speedup claim."
- **What's missing:**
  - There is no problem, fair classical baseline, or complexity statement — spec §5 items B, I and J.
  - Grep finds no mention of glued/welded trees, spatial search, or Childs.
  - The family's main results are therefore absent: the glued-trees exponential oracle separation and continuous-time spatial search. My recollection is that these are Childs et al. 2003 (arXiv quant-ph/0209131) and Childs–Goldstone 2004 (quant-ph/0306054); please verify those IDs before citing them.
- The catalog's advantage field ("Model-dependent theoretical applications") refers to applications the chapter never presents.
- **Remedy:** add a small exact spatial search, e.g. the complete graph K₄ with H = −|s⟩⟨s| − |w⟩⟨w|, which transfers exactly at t = π√N/2. Attribute the glued-trees separation. Otherwise mark partial.

### P2-4 — Editorial status overstates completeness for chapters that admit their core mechanism isn't taught
- **The rule:** `docs/AUTHORING-CONTRACT.md:17` says a worked primitive with open derivation gaps must be marked partial.
- **The conflict:** these chapters are `complete` with `gaps: []` (`catalog-applications.json:99/108`, `132/139`, `166/173`, and lesson 39), despite stating:
  - 40: "This theorem is not proved by the two-state arithmetic."
  - 41: "does not implement the full optimized Ambainis walk."
  - 42: Le Gall's construction is "not the implementation just calculated."
  - 39: no algorithm at all.
- **Knock-on overstatements:**
  - Every coverage-table row prints "Worked example, cost model, explained exercises, and references authored" (`src/pages/coverage.astro:7`).
  - `docs/VALIDATION.md:19` says "no unresolved editorial gaps."
- **What's acceptable by contrast:** lesson 57 (Kuperberg) demonstrates the label-combination operation end to end and defers only the sieve's asymptotic proof. That is a legitimate deferral.
- **Remedy:** mark 39–41 partial with these exact gaps. Either do the same for 42 or explicitly scope it as elementary Grover triangle finding with Le Gall as a cited extension.

### P3 — smaller concrete issues
1. **Systematic missing spaces before numbers in authored text.** Examples:
   - `exercises/root.json:15` ("mean1/4", "label11"), `:20`, `:35`, `:39` ("at most1/128"), `:40` ("Error is2^(1−k)"), `:45` ("s0 XORs2=0 … are000 and101"), `:50`, `:55`, `:59` ("on20qubits").
   - `exercises/applications.json:130,140,145,180,185,195,200`.
   - Every entry in `module-revisits.json` ("mask011", "Labels0 and2", "is(2,1)/√5").
   - `coverage.astro:6` ("November2026"); `prerequisites.astro:4` ("Module00").
   - The lesson Markdown is clean. Fix the text and add an audit regex such as `/[a-z][0-9]/` with an allowlist.
2. **Exercises and module revisits render as plain text** (`lessons/[id].astro:29–30`), with no Markdown or KaTeX. Answers fall back to ASCII ("|0>", "A-dagger", "sqrt(5)"), unlike the lessons. Pass them through `render()`.
3. **"Show all derivations" pre-reveals all retrieval practice and stays on.** It opens every `#main details`, including prediction answers and "Reveal worked answer" (`reader.ts:16–18`), and stores `qa-full-detail`, so every later lesson opens with answers showing. This works against spec §10. Exclude answer `details` from the toggle or don't persist it; print can still include them.
4. **Simon demo hides query cost.** "Sample 256 measurements" at the final step turns 256 separate runs into equations and reports "The samples determine one mask" (`Demo.astro:64`). Meanwhile the panel still reads "Function-dependent base-oracle calls so far: 1" (`:45`). Each row costs one oracle call, and roughly n runs are needed, not 256. Label the samples as independent runs with their query cost, or add a one-run button that shows rank growing.
5. **"/" single-key shortcut** (`reader.ts:14`).
   - It can't be turned off or remapped, which conflicts with WCAG 2.1.4 (Character Key Shortcuts, Level A).
   - It also fires while the definition dialog is open, navigating away and discarding the return stack.
   - Require a modifier or skip it when the dialog is open, and offer a way to disable it.
6. **Search doesn't index exercises, module revisits or lesson summaries** (`search-index.json.ts:3`). Spec §8 asks for full-text search.
7. **Density-matrix definition lacks a worked example** (`definitions/density-matrices.md:5–7`). It asserts the HρH† result and gives the partial-trace index formula, but works neither numerically. Lessons 05, 24 and 26 rely on discarding registers. Work a Bell-state partial trace (it gives I/2).
8. **Demo placed after the bibliography.** The demo section is appended after each lesson's `## References` (`[id].astro:28`), so the table of contents lists the interactive example after References.
9. **Contradiction in lesson 42.** Line 35 says a bounded-error "no triangle" report needs "a known candidate count," but line 17 correctly says BBHT handles unknown counts. Presumably the intended meaning is the known total M = C(n,3), with a √M query budget.
10. **Duplicated script with a stale run instruction.**
    - `public/examples/matrix-checks.py:4` tells the reader to run `scripts/check-matrix-examples.py`, a path a downloader won't have.
    - Lessons 23, 24, 26, 29, 30, 32, 36 and 37 cite the `scripts/` copy as the verification, but CI runs only the `public/` copy.
    - Keep a single file.
11. **Small accessibility/labelling items.**
    - The circuit-step container is a plain `<div>` with `aria-label` (`Demo.astro:19`), so the label isn't announced; use `role="group"`.
    - On the glossary, prerequisite and definition pages, the dialog says "Lesson → …" and "← Return to lesson" (`reader.ts:48`) even though no lesson is open.

## 2. Notes on the self-review fixes

- **Simon intermediate inference:** correct. Only the final frame now produces equations, and the browser test covers it. What remains is the query-accounting problem (P3-4).
- **Malformed progress:** correct. `parseProgress` uses a prototype-free object with a whitelist; the blocked-storage path is tested.
- **Duplicate KaTeX text / entity decoding:** correct. The non-greedy `katex-mathml` regex is safe because KaTeX's MathML contains no `<span>`, but that dependency isn't documented.
- **Circuit-step focus:** fixed (only `aria-current` is updated in place). The accessible-label issue (P3-11) is separate.
- **Search failure, overlapping definition loads, invalid numeric inputs:** correct as implemented.
- **Unverifiable claim:** `VALIDATION.md:72` reports a crawl of "all 114 built HTML pages and 11,004 local links/assets." No crawler exists in `scripts/` or `tests/`, so this can't be reproduced from the repository. Commit the crawler or describe the check as a one-off.

## 3. Scope and remaining uncertainty

**Read in full:**
- Docs: SPECIFICATION, AUTHORING-CONTRACT, VALIDATION, README, SELF_REVIEW_DIFF.patch.
- Code: `quantum.ts`, `demos.ts`, `Demo.astro`, `reader.ts`, `storage.ts`, `content.ts`, `search.ts`, `search-index.json.ts`, `Book.astro`, `lessons/[id].astro`, `definitions/[id].astro`, coverage and prerequisites pages, `book.css`.
- Build and tests: `audit-content.ts`, `ci.yml`, `package.json`, the storage and browser test specs, and `quantum.test.ts` from line 30 onward plus its patched hunk.
- Content: `catalog-root.json`, `module-revisits.json`, and the root, matrix and search-fourier exercise files.
- Lessons: **01–05, 07, 08, 10, 12, 13, 14, 15, 20, 22, 23, 24, 26, 30, 31, 32, 33, 36, 39, 40, 41, 42, 47, 55, 57, 59, 60, 61, 62.**
- Definitions: density-matrices, eigenvalues, tensor-products, complexity.

**Recomputed by hand and found correct:**
- Every numerical step in the lessons above, including:
  - Shor's 0.114172 packet probability and the [0;6,42,2] continued fraction;
  - the inexact phase-estimation table;
  - Jordan's 12-bit rounding table and error bound;
  - the IQAE interval endpoints;
  - the fixed-point phase z and the 1/1352 failure probability;
  - the QSVT 4×4 sequence;
  - Jones trace closure giving V = 1;
  - Kuperberg's recursion;
  - the Metropolis rejection-recovery operators (B₀ᵀB₀ + B₁ᵀB₁ = ¾I);
  - the Gaussian boson-sampling sectors;
  - the forrelation error bounds.
- All exercise answers I checked (root, matrix, search-fourier, and the applications entries I opened).

**Partially inspected:** `catalog-applications.json`, the applications exercises, lessons 29, 38 and 44, `applications.py`, and `check-matrix-examples.py`.

**Not inspected:**
- Lessons 06, 09, 11, 16–19, 21, 25, 27, 28, 34, 35, 37, 43, 45, 46, 48–54, 56, 58.
- The remaining ~38 definitions, all `sources/*.json`, and the `research/` notes.
- The NAND, Hallgren and search-fourier Python scripts.
- The search-fourier and matrix catalogs.
- The index, path, glossary, references, progress and 404 pages (beyond the patch).
- `vercel.json`, `start.command`, the configs, the lockfile and the screenshots.

**Uncertainty:** I couldn't execute anything, so I take the reported test runs as given. The uninspected lessons may have issues similar to P2-3 or P2-4. Given how accurate the 33 lessons I read were, I'd expect any remaining problems to be about scope and status rather than arithmetic.