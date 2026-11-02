# Validation record

Verification date: **2026-11-02**. The results below are from executed commands on this Mac. This record distinguishes application checks, example calculations, and editorial review.

## Delivered coverage

- **62 authored chapters:** the 61 requested numbered topics and the synthesis chapter.
- **5 independently reviewed, 56 complete authored, 1 partial, 0 planned.** These are mutually exclusive editorial states; all 62 have worked content. The review of lessons 01–05 is documented in `research/review-first-five.md`. Later focused reviews do not imply a full-book review.
- **42 prerequisite explanations, 124 separately stored explained exercises, 83 source records.** Chapters also contain inline prediction/reveal questions.
- **7 interactive demonstrations:** Deutsch, Grover, Bernstein–Vazirani, Deutsch–Jozsa, Simon, QFT, and phase estimation. They compute ideal state transitions and sample the resulting distributions.
- The current machine-readable counts, dependency validation, and exact gaps are in `docs/content-audit.json`; `/coverage/` exposes the editorial distinctions to readers.

## Commands and actual outcomes

| Executed command | Outcome |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 0 hints |
| `npm test` | **67 tests passed** across simulator/algorithms, storage, search, and Markdown/math rendering |
| `npm run audit:content` | Passed: no errors or warnings; one explicitly disclosed teaching gap in the optimal element-distinctness walk |
| `npm run build` | Passed; **114 static pages** plus JSON and local assets generated |
| `npm run test:browser` | **38 tests passed**, nineteen scenarios each on desktop and mobile Chromium |
| `python3 public/examples/search-fourier-checks.py` | **20 tests passed** |
| `python3 public/examples/matrix-checks.py` | **16 tests passed** |
| `python3 public/examples/nand-checks.py` | **11 tests passed** |
| `python3 public/examples/hallgren-checks.py` | **12 tests passed** |
| `python3 public/examples/applications.py` with the NumPy environment below | **24 tests passed** |
| `bash -n start.command`, then `./start.command` | Launcher started the local server; `/lessons/deutsch/` returned HTTP 200 with the expected lesson |

The Python suites total **83 tests**. They exercise arithmetic and finite worked transformations; they are not proofs of every asymptotic theorem. The Node checks used Node **24.19.0**, Astro **7.4.4**, Vitest **5.0.5**, and Playwright **1.64.1**, with versions resolved by `package-lock.json`. Four Python suites use the standard library. The applications suite was executed with the bundled Python runtime and **NumPy 2.3.5**. The default system Python initially lacked NumPy; the suite passed in the declared NumPy environment. `requirements-examples.txt` and the README document a reproducible virtual-environment installation.

The launcher was tested using an existing compatible runtime without modifying the global shell configuration. The task-owned servers used for the initial delivery were stopped after validation. The project was subsequently published at https://quantum-algorithms-rho.vercel.app/ on Vercel Hobby; the public source is https://github.com/qiaokan/quantum-algorithms. Production tracks `codex/initial-setup` and uses Node 24.

## What the checks cover

The mathematical unit tests cover normalization, complex arithmetic, small-unitary reversibility, all four Deutsch functions, all marked positions in four-item Grover and its oscillations, Bernstein–Vazirani outputs, Simon constraints, QFT/inverse-QFT ordering, exact and inexact phase estimation, powered-oracle costs, Shor's successful and rejected classical trials, HHL postselection and classical solutions, product-formula convergence, and variational energies. Probabilities and amplitudes are checked separately, with global-phase equivalence used only where appropriate. The simulator does not repair invalid results by silently renormalizing them.

The browser scenarios cover lesson links and section anchors, numbered sidebar order, search, nested definition return/scroll/focus, every demonstration's controls, sampled results, explicit persistent learning states, keyboard navigation, theme persistence, mobile menus, equation rendering, full-detail mode, print layout, and representative mobile overflow. Every authored chapter is checked at desktop and mobile widths with all worked answers expanded; narrow 320-pixel checks additionally sample demanding pages. Axe found no violations of the selected WCAG A/AA rules on the tested lesson page; that is a sampled accessibility check, not a site-wide certification.

Desktop and mobile reading layouts were inspected from the actual rendered screenshots in `docs/screenshots/`. A built-in-browser inspection of the first lesson also caught a Markdown table/ket-bar rendering defect, now covered by a regression test. The review repaired keyboard access to overflowing equations and offscreen mobile navigation focus. All browser acceptance tests were rerun after those fixes.

The advanced suites cover worked transformations across search/Fourier, matrix methods, walks, estimation, variational and sampling chapters. In particular, the NAND suite checks all 16 inputs with exact rational certificates and an independent controlled-power simulation; Hallgren checks the evaluable ideal/residual oracle, rounded preimage packet, Fourier probabilities, and reconstruction; backtracking and Metropolis checks include finite detection or rejection-recovery probabilities. The precise scientific scope is documented in each script and its corresponding research notes.

A focused independent Hallgren review checked the distance convention, finite precision argument, oracle evaluation, and candidate reconstruction. It found an overbroad input claim; the detailed derivation now explicitly assumes square-free input congruent to 2 or 3 modulo 4, while the broader theorem is separately attributed. The reviewer reported no remaining blocker in that scope. The final content audit and static build were rerun after this prose correction. This focused check does not promote the chapter to a full editorial review.

## Method

- Compile-time TypeScript/Astro checks.
- Unit tests against independently calculated distributions and algebraic formulas; norm preservation, reversibility, global phase, and probability equality checked separately.
- A content audit that detects missing IDs, prerequisite cycles, broken internal anchors, malformed math, empty sections, absent exercise explanations, and status/gap contradictions. Minimum prose size is a diagnostic guard only, never proof that a lesson is pedagogically complete.
- Primary-source verification records with explicit abstract/full-text/official-doc distinctions.
- Independent review of root-authored lessons 01–05 recorded in `research/review-first-five.md`; later reviews identify their precise sampled scope.
- Isolated Chromium browser acceptance tests on desktop and mobile-sized layouts, including accessibility analysis. No personal browser profile, account, external service, or hardware quantum execution.

## Known implementation and test limitations

- Dense interactive state-vector simulation is capped at 8 qubits. It is not a hardware emulator. Larger standalone examples are classical numerical calculations with their own explicit cost and scope.
- Accessibility automation supplements manual reading-layout inspection; it does not certify every assistive-technology/browser combination.
- Browser tests run Chromium on this macOS environment; Safari and Firefox have not been tested.
- The site is served at the origin root. Deployment under a URL subpath needs base-aware links.
- No network is needed for explanations after a local/static server is available. External bibliography links naturally require connectivity.
- Learner progress uses localStorage without account synchronization; unavailable storage degrades gracefully.
- Complete authored chapters are not all independently peer-reviewed. Exact editorial counts and remaining gaps are generated by `docs/content-audit.json` and `/coverage/`.

## Standalone Git repository validation

On 2026-11-02 the project was moved out of its original parent workspace and initialized as an independent repository. `npm ci` installed dependencies from the lockfile in the new location. `npm run validate` then passed: type checking, 57 unit tests, content audit, 114-page production build, and 18 browser tests. All five Python suites were rerun there, with 80 tests passing in total.

The optional launcher's shell syntax passed `bash -n`. The GitHub Actions YAML parsed successfully and contains the setup/validation steps documented in the README. The workflow subsequently passed on GitHub-hosted runners, including [run 41403419157](https://github.com/qiaokan/quantum-algorithms/actions/runs/41403419157) for deployment commit `f76c961`. Machine-specific absolute paths and the attachment dependency were replaced with portable instructions and the checked-in `docs/SPECIFICATION.md`.

## Post-deployment self-review

The original suite passed before review. Targeted regressions then reproduced malformed-progress initialization failure, incorrect Simon equation inference before the final readout, lost circuit-button keyboard focus, a search failure presented as perpetual loading, and duplicated/encoded math text in search snippets. The fixes pass the expanded suite above. Additional checks cover blocked storage, rapid overlapping definition requests, nonfinite probability inputs, invalid qubit indices/register sizes, and zero-success HHL postselection. An initial one-off crawl checked all 114 built HTML pages and 11,004 local links/assets, including fragments and duplicate IDs, with no errors. The reproducible crawler is now committed as `scripts/audit-links.py`, run by `npm run audit:links`, `npm run validate`, and CI. This is a software and sampled scientific review, not a proof of all textbook claims.

A clean `npm ci` followed by the full validation suite also passed after aligning all math plugins on KaTeX 0.19.1 and correcting dark-theme print colors. The previous nested KaTeX 0.16.47 dependencies were affected by [GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7); the project renders trusted repository content at build time, so this is dependency hardening rather than evidence of a live exploit. `npm audit --audit-level=low` now reports zero known vulnerabilities. All five standalone Python suites were rerun during this review: 80 tests passed.

## Independent review revisions

Claude round 1 identified four substantive walk-teaching/status findings and eleven smaller issue groups. Their dispositions and the unedited review are in `research/review-disposition.md` and `research/claude-review-round-1.md`. New independent NumPy calculations check complete-graph continuous search, Szegedy eigenphases and the actual two-bit coherent filter, and Bell-state partial trace. All 24 applications checks passed; the four unchanged numerical suites previously passed 59 checks. The full current software validation passed (67 unit, 38 browser); the committed link crawler checked 114 HTML pages and 11,021 local links/assets with zero errors.

The new browser cases also cover formatted practice, search indexing of supporting content, bibliography order, nonlesson dialog labels, removal of the single-key shortcut, and independent-run query accounting. Full-detail mode preserves retrieval answers. Mobile overflow was reproduced and fixed; the test compares scroll width against document client width, since mobile innerWidth can itself expand to fit overflow.

Three rounds of actual Claude review are now complete. Round 2 accepted all first-round dispositions and found two additional logical omissions; both were fixed. Round 3 independently verified those fixes and the explicit chain assumptions, reported no new actionable issue in its focused scope, and agreed the release is ready with the disclosed limitations. The author agrees. The final prose corrections passed content/math rendering, the 114-page build, and the 11,021-reference link crawl. See `research/review-disposition.md` and the three unedited reviewer reports. This agreement is not a full-book mathematical peer review; the optimal element-distinctness walk remains an explicit partial-chapter gap.
