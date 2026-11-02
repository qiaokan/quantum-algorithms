# Self-review and independent Claude review

Date: 2026-11-02. Reviewer: authenticated Claude Code CLI 2.1.287, read-only isolated source snapshots. Only Read/Glob/Grep were enabled. No `.git`, deploy key, account tokens, node_modules, or unrelated files were shared. The review did not execute code; the author ran validation separately.

## Round 1 disposition

The unedited reviewer response is in `claude-review-round-1.md`. Its verdict was no P1 blocker in inspected material, four P2 findings about walk pedagogy/status, and eleven P3 groups. All were accepted as actionable; the response did not substitute for test evidence.

| Finding | Resolution |
|---|---|
| P2-1, Szegedy phase-gap mechanism | Added the two-dimensional lifted eigenproblem, actual ±2π/3 phases, the extra zero-phase vector, two-bit QPE amplitudes, coherent-reflection error, repetition cost, and the general square-root gap. Explicitly distinguish the elementary filter's logarithm from the stronger MNRS theorem. Independent NumPy checks added. |
| P2-2, subset search lacks advantage | Explicit Θ(N) query derivation for the implemented reload variant and comparison with r + N/√r. |
| P2-3, continuous walk has no algorithm | Added exact complete-graph search, N=4 states/probabilities, fixed-strength continuous oracle model, classical baseline, scaling and implementation caveats. Glued-trees separation cited with its separate oracle promise. |
| P2-4, completeness labels | Element distinctness is partial with the precise missing optimized walk implementation disclosed. Lessons 39–40 now teach the missing mechanisms. Lesson 42 explicitly names/scopes Grover triangle finding; Le Gall is a cited extension. Counts and validation no longer claim zero gaps. |
| P3-1, prose spacing | Fixed exercise/revisit prose-number collisions and two page labels. Added an audit outside math delimiters with a narrow function-name allowlist. |
| P3-2, exercise/revisit rendering | Same Markdown/KaTeX pipeline as lessons; ket, radical and selected equation notation migrated to math markup; rendering audited and browser-tested. |
| P3-3, retrieval answers exposed | Only explicitly marked optional derivations are expanded by full-detail preference. Prediction/practice answers remain closed after reload. Print still reveals them. Toolbar omitted when no optional derivations exist. |
| P3-4, Simon query cost | Per-run oracle count explicitly labelled; sampling states 256 independent simulated runs and total base-oracle use. Final-frame equation restriction retained. |
| P3-5, character shortcut | Removed the single-character navigation shortcut and its advertised key. Search remains an ordinary accessible link. |
| P3-6, incomplete search | Index now includes summaries, purpose, exercises/answers and module revisits, with destination sections. |
| P3-7, density matrices | Added explicit HρH† multiplication and all four Bell partial-trace entries; NumPy check added. |
| P3-8, demo after bibliography | Interactive example, revisit and practice precede the bibliography; table of contents matches. |
| P3-9, triangle count ambiguity | Distinguish total candidate count M from unknown triangle count K, with √M bounded-error budget. |
| P3-10, duplicate numerical script | Removed scripts/check-matrix-examples.py; lessons link the one downloadable CI-tested public/examples/matrix-checks.py; fixed download run instruction. Historical research note records the move. |
| P3-11, labels | Circuit control group has an accessible group role; nonlesson explanation dialogs return to the page. |
| Reproducible link crawl | Committed scripts/audit-links.py; wired into validate and GitHub CI. |

## Additional self-review fixes

Malformed/blocked progress storage no longer disables reading controls. Overlapping definition requests keep the latest selected explanation and preserve focus. Search failures retain actionable status. Circuit steps keep keyboard focus. Simon intermediate states never become hidden-mask equations. Search text strips duplicate accessible math representation and decodes entities. Numeric helpers reject invalid/nonfinite inputs and zero-success HHL postselection. Dark-theme printing uses legible print colors. All KaTeX consumers resolve to patched 0.19.1, matching the CSS; audit reports zero vulnerabilities.

Expanded tests exposed mobile overflow and pointer interception in Grover. Two long inline formulas (Grover and backtracking) are now broken into separate inline terms or a scrollable display. The toolbar also wraps explicitly. Overflow checks use document client width, since mobile innerWidth can expand to mask overflow. Every authored chapter is now checked with all answers open.

## Remaining scope

Element distinctness is intentionally labelled partial: the optimal coherent data-retaining walk is not implemented step by step. This is a disclosed teaching limitation, not a claim that the Θ(N) teaching variant achieves the optimal theorem. Numerical examples and software tests do not prove general asymptotic results. Round 1 inspected a substantial sample and explicitly listed unread material; no full-book independent-review badge is inferred.

## Review status

Round 2 accepted every round-1 disposition, reported no P1/P2 blocker in the inspected scope, and independently recomputed the new walk material plus several advanced chapters. The unedited response is in `claude-review-round-2.md`.

Two additional P3 findings were accepted and fixed: lesson 27 now establishes U† = U before concluding unitarity from U² = I; lesson 40 explicitly lifts eigenvectors of the discriminant D for general reversible chains. The author also made the finite/irreducible/lazy chain assumptions explicit. Round 3 independently re-derived both corrected arguments and accepted the chain assumptions. It reported no new P1, P2 or P3 issue in its explicitly limited scope and agreed the release is ready with the stated limitations. The author agrees. The unedited response is in `claude-review-round-3.md`.

Scope correction: round 2's “not inspected by any round” list is not an accurate cumulative list. Round 1 explicitly read, among other items, content.ts, search-index.json.ts, browser tests, lesson 11, 50 and 51. Keep each round's positive inspected list as its own evidence. Neither reviewer report establishes complete-book review.

## Executed release checks

The author ran type checking (0 errors/warnings/hints), 67 unit tests, 38 browser tests, and 83 numerical checks across five Python suites. The final two prose corrections also passed the content/math build and built-link crawl: 114 HTML pages, 11,021 local references, zero errors. These are executed checks, not reviewer-executed tests. The content audit reports 5 reviewed, 56 complete, 1 partial, 0 planned chapters, 42 definitions, 124 exercises, and 83 source records.

## Hosted CI follow-up and round 4

[Hosted run 41409922696](https://github.com/qiaokan/quantum-algorithms/actions/runs/41409922696) passed the build, unit, numerical and link checks but found a 9-pixel mobile overflow in random-circuit-sampling (37 of 38 browser tests passed). Three long inline expressions are now scrollable display equations without changing the mathematics. The all-chapters test preserves its strict width bound, reports the problematic math, and collects all affected chapters with soft assertions that still fail CI.

Local full validation passed again: 67 unit and 38 browser tests, plus build/audits. Claude round 4 verified the mathematical equivalence, display-renderer accessibility and unchanged test pass criterion, found no regressions, and agreed with the narrow fix. Its unedited report is `claude-review-round-4.md`. The author agrees. Hosted CI must pass on the follow-up commit; the definitive hosted result is attached to that commit in GitHub Actions.

## Learning-flow edits after review (not independently re-reviewed)

A read-only review of the entry experience and lessons 01–06 recomputed every amplitude, probability and exercise there and found no arithmetic errors. Its learning-speed findings were then applied. Edits to the reviewed lessons 01–05 add text and change no derivation:
- They define ket notation before the first oracle in Deutsch and Grover, and define "superposition" in Deutsch.
- They link existing definitions at first use (oracle, Hadamard, controlled gates, eigenstate, inner product, entangled, mixture, span, ancilla, uncompute).
- In Deutsch–Jozsa, the uniform state is renamed from $|s\rangle$ to $|u\rangle$, so `s` is no longer reused within lessons 02–06 for unrelated objects.
- They add signposts between Grover, Bernstein–Vazirani and amplitude amplification.

Other changes:
- New `hadamard` definition.
- "The idea in 30 seconds" boxes for lessons 01–06 (`src/content/lesson-ideas.json`).
- Next/previous links follow the main path, with optional branches offered rather than forced.
- Two wording corrections: the Simon check 1 answer and the module 1 revisit.

These edits passed the build, the content audit, unit tests, browser tests and the four standard-library numerical suites. No independent reviewer has re-read the changed prose, so the `reviewed` labels rest on the earlier review of the unchanged derivations.

## External review of the decision path and FT module, 2 November 2026

An external review recomputed the numbers in FT-04, FT-07, FT-11 and FT-13 and found them consistent. It raised these issues, all addressed:

- **FT-13 overstated infrastructure as today's bottleneck.** A one-input-at-a-time decomposition shows that Λ (device physics) dominates today's qubit count: about 10× from 20.8M to 205.7M qubits. The reaction time mainly stretches runtime: 7.5 h to 47 h, and only +15% qubits. The section now separates "binding today" from "binding once Λ ≈ 10", with a dated revision note.
- **FT-12 omitted relevant hardware.** It now covers Google's roadmap, IonQ, Atom Computing with Microsoft, and cat qubits (AWS Ocelot, Alice & Bob, biased noise), each as dated, sourced claims.
- **The calculator's scope versus the 2025 estimate.** This is now stated in the calculator and at the top of FT-11.
- **Flagged facts, re-verified against primary sources:**
  - Lee et al.'s runtime is "3 days" in Sec. III.C ("under four days" in the abstract; a later paragraph says 3.5 days). The site previously said 3.5 days. Its four factories and 1% budget are now credited to the paper.
  - Gidney 2025 remains an arXiv preprint.
  - Babbush's 5.5·d cycles, about 170 µs per Toffoli, is confirmed.
  - The 2026 Quantinuum, QuEra and Nature items are confirmed. Quantinuum's underlying preprint is arXiv 2610.24077, and its 99.9995% is per-round memory fidelity.
- **Stale text.** The coverage note's "being added in phases" now has a dated completion update.

The review is not independent peer review of the lessons; the `complete` labels are unchanged.
