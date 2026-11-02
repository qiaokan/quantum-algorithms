# Task: a "decision path" and an error-correction module (revised spec)

Revised 2 November 2026 from the original task text. Repo facts were checked against commit `8449417`, and every source below was checked against its arXiv, publisher or official page that day. The [validation notes](#appendix-validation-of-the-original-spec) at the end list what changed and why.

## Context

The reader has a theory-CS PhD and a background in large-scale distributed and low-latency infrastructure. They are studying quantum to make business and career decisions, not to do algorithms research. They need the full chain:

  what a useful application needs (logical qubits, T/Toffoli count, runtime)
  → error-correction overhead (code distance, physical qubits per logical qubit, magic-state supply)
  → what the infrastructure must deliver (decoder throughput and latency, control channels, calibration)
  → hardware modalities and roadmaps
  → realistic timeline to usefulness, including what classical computing does in the meantime

The site covers the first link only. The coverage page currently files error correction and fault tolerance under "supporting protocols/engineering topics; they are not counted as missing algorithms" (`src/pages/coverage.astro`). This task brings them into scope and changes the default reading path.

## Hard constraints

1. Do not delete or shorten any existing lesson, section, definition, demo, test, reference or page. Do not change any existing URL or slug.
2. Only these edits to existing pages are allowed: labels, callouts, cross-links, navigation grouping, time estimates, and dated revision notes. Where existing text is superseded, append a dated note and keep the original.
   - Put new per-lesson text (callouts, tier labels) in data files rendered by the lesson template, the way `src/content/lesson-ideas.json` works. Lesson Markdown stays untouched.
3. Match the existing style and the repo's authoring contract (`docs/AUTHORING-CONTRACT.md`) in every new lesson:
   - Problem and access model first. Predict before calculating.
   - Fully worked small examples, followed through to measurement or decoder output.
   - An "honest cost" section, plus misunderstandings and prediction checks.
   - At least two practice questions with worked answers (the content audit enforces this).
   - A catalog record with `prerequisites`, `concepts` and `sourceIds`, plus a `module-revisits.json` entry.
   - Primary-source references.
4. Never fabricate a citation, number or result. Record every source in `src/content/sources/*.json` with the existing `verification` field (`full-text`, `abstract`, `official-doc`, `unverified`) and the actual check date.
   - Cite arXiv-only work as a preprint.
   - Write hardware roadmaps and vendor statements as dated claims ("As of <date>, <company> states…"), never as facts.
5. All existing tests must keep passing unmodified. Add tests for new code. Run the build (it includes the content audit) and the built-site link check before finishing.

## Decisions to confirm before Phase 1

The original spec left these open, and they interact with existing code and tests. Defaults are given; confirm or change them.

1. **Where the paths live.** `/path/` becomes the decision path. The current main path moves to a new URL, `/path/complete/`. Both are linked from the homepage.
2. **What Next does.** The Next button currently follows `path === 'main'` (the complete path). Default: on decision-path lessons, Next follows the decision path, and a secondary link shows the complete-path neighbour. Everywhere else, Next is unchanged.
3. **How FT lessons are numbered.** The catalog needs a unique numeric `sequence`, and the audit requires 1–61 to be present. Default: give FT-01…FT-12 sequences 63–74 and the synthesis page 75, add module 12 "FT: Error correction and fault tolerance", and have `label()` print "FT-01" for module 12.
4. **How the sidebar is grouped.** An existing browser test requires sidebar items in ascending `data-sequence` order, so items can't be regrouped by tier. Default: keep module order, add a "Decision path" list at the top of the sidebar (its links carry no `data-sequence`), put a tier badge on every item, and hide deferred-branch items behind a "Show deferred branches" toggle that defaults to off. The toggle keeps DOM order.
5. **How time is estimated** (see Part 1, item 5).

## Part 1: Restructure

1. Create the default path, "Decision path: from useful application to hardware". Feature it first on the homepage and at `/path/`. Keep the current main path, renamed "Complete algorithms path", one click away at `/path/complete/`.
2. The algorithm part of the decision path, in order:
   - 01 Deutsch, 02 Grover, 11 QFT, 12 Phase estimation, 14 Order finding, 15 Shor
   - 23 Product formulas, **25 Energy estimation**, **26 HHL**, 27 Block encoding/LCU, 30 Qubitization

   The two added lessons are bold. Why:
   - The catalog lists `27 block-encoding → 26 hhl → 25 energy-estimation`. HHL appears in lesson 27 only as a backward cross-reference (line 72), so it could be bridged instead of added.
   - But 25 is the lesson FT-11's chemistry estimate depends on: the phase estimation of a qubitized walk.
   - And 26 is where the site explains that a linear solver returns a quantum state, not a printed vector, which is a business-relevant caveat.
   - Together they add about 21 minutes at the current estimator.

   If you prefer the original nine lessons, add a dated note to lesson 27's callout confirming that it is self-contained.
3. In each decision-path algorithm lesson, add a callout at the top: "Why this matters for the decision path". Two to four sentences tying the lesson to resource costs: T or Toffoli count, logical qubits, or runtime. Store the callouts in `src/content/decision-callouts.json`.
4. Give every lesson exactly one tier: "Decision path", "Complete path", or "Deferred branch (read after the decision path)".
   - Today there are 30 branch lessons (deferred tier) and 32 main lessons. Of the main lessons, 11 move to the decision tier (or 9, if you keep the original nine) and the rest stay in the complete tier.
   - Store tiers in metadata, not in lesson text. Render them per decision 4.
5. Show an estimated reading-plus-calculation time on each lesson and a total for each path. **Report the totals honestly.**
   - The current estimator is rendered words / 150. It gives the original nine lessons **104 minutes**, those nine plus lessons 25 and 26 **125 minutes**, the 32-lesson main path **333 minutes**, and the whole 62-lesson book **678 minutes (11.3 hours)**.
   - The original 25–35 hour target for the decision path is therefore 3–4 times the site's own estimate for the entire book.
   - Either recalibrate the estimator, or keep it and report that the decision path is far below target. The estimator must count worked calculations and exercises, e.g. prose at 150 wpm, plus a fixed allowance per display equation that must be computed, plus 4 minutes per practice question. Calibrate it against a measured reading of Deutsch and QFT.
   - Do not cut or pad content to hit a number.
6. Make the progress page show decision-path progress separately, computed from the existing `qa-progress` store. Don't add a second store; existing tests use this key.
7. On the coverage page, append a dated revision note: error correction and fault tolerance are now an in-scope module, reached through the decision path. Keep the original scope sentence quoted above. Also update the generated counts. README and audit text that says "61 required numbered topics" gets a dated addendum, not a rewrite.

## Part 2: New module "FT: Error correction and fault tolerance"

Use new slugs such as `/lessons/ft-01-pauli-errors-repetition-code/` and display labels FT-01…FT-12. Do not renumber existing lessons. Add the definitions the module needs to the definition library, each with a worked number and a return-to-parent paragraph: Pauli operators, Clifford group, stabilizer, syndrome, code distance, logical qubit, T gate, magic state.

- **FT-01: Pauli errors and the repetition code.** Errors as Pauli operators; bit-flip and phase-flip; the 3-qubit repetition code with syndrome extraction, fully worked.
- **FT-02: Stabilizers and Gottesman–Knill.** The stabilizer formalism; why Clifford circuits simulate efficiently; what a stabilizer tableau is. Cite Aaronson–Gottesman (2004) for the tableau algorithm the simulator implements.
- **FT-03: The surface code.** Data and measure qubits, X/Z stabilizers, logical operators, code distance. Work through the distance-3 rotated surface code: 9 data + 8 measure = 17 qubits.
- **FT-04: Noise models and thresholds.** Circuit-level noise; how logical error rate scales with distance; the suppression factor Λ. Use the Google Quantum AI below-threshold result as worked data (verified figures):
  - Λ = 2.14 ± 0.02.
  - Distance-7 logical error 0.143% ± 0.003% per cycle.
  - 101-qubit distance-7 code on a 105-qubit processor.
  - 1.1 µs cycle.
  - Cite it as arXiv 2408.13687 (Aug 2024), Nature 638, 920–926 (2025), published online 9 Dec 2024.
- **FT-05: Decoding I.** Detection events, the decoding graph including boundary nodes, minimum-weight perfect matching. Fully worked small example.
- **FT-06: Decoding II.** Union-find (Delfosse–Nickerson, worst case O(n α(n))); Sparse Blossom matching; the accuracy-versus-speed trade-off.
- **FT-07: Real-time decoding.**
  - Syndrome generation rate, latency budgets, FPGA vs ASIC vs GPU, windowed and parallel decoding.
  - **The backlog argument, stated as Terhal does** (RMP 87, 307, Sec. II.G.3). If the ratio of generation to processing rate is f > 1, the record awaiting decoding at the k-th T gate is D_k = f^k·D_1. The slowdown is exponential in the number of T gates that need feedforward, not merely a queue growing linearly.
  - Work both cases: linear queue growth with no feedforward, and compounding with T-gate feedforward.
  - Use Google's measured 63 µs average decoder latency at distance 5, against a 1.1 µs cycle, as data.
- **FT-08: Logical operations.** Lattice surgery (Litinski 2019); why Clifford operations are cheap and non-Clifford operations need magic states.
- **FT-09: Magic states.** Distillation and cultivation; factory footprint; how reaction time and feedforward latency set the logical clock speed.
  - Cultivation is an arXiv preprint (Gidney, Shutty, Jones 2024). It claims roughly the gate count of a lattice-surgery CNOT.
  - Mention later experimental work only after verifying its primary source.
- **FT-10: The control and calibration stack.** Per-qubit control channels, wiring and cryogenic limits, calibration as a dependency graph of experiments (Kelly et al. 2018, arXiv preprint), drift and recalibration. Engineering-focused, same honest style. Every vendor number is a dated claim.
- **FT-11: End-to-end resource estimation.** From an algorithm's logical requirements to code distance, physical qubits and wall-clock runtime.
  - (a) Reproduce the **Gidney–Ekerå (2021)** cost model end to end. It is peer-reviewed and its assumptions are explicit: 10⁻³ gate error, 1 µs cycle, 10 µs reaction time, giving 20 million qubits and 8 hours.
  - Then explain, factor by factor, how **Gidney (2025, arXiv preprint)** reaches "less than a million noisy qubits" and "less than a week" under the same hardware assumptions: approximate residue arithmetic, yoked surface codes and magic-state cultivation. Do not claim to reproduce the 2025 number with a simplified model.
  - (b) Reproduce the Lee et al. (2021) FeMoco THC estimate. **The paper gives two Toffoli counts.** Table III lists 5.3×10⁹ Toffolis and 2,142 logical qubits for Reiher FeMoco, while the surface-code compilation text uses 6.7×10⁹, distance 31, about 4 million physical qubits and about 3.5 days. Assumptions: 1 µs cycle, 0.1% error, Λ = 10. State which figure you use and why.
  - (c) Add a short "quadratic speedups" reality check from Babbush et al. (2021). Under their cost model (about 170 µs per Toffoli, single factory), Grover-type quadratic speedups do not give advantage on early fault-tolerant machines.
  - Build an interactive calculator. Inputs: physical error rate, cycle time, decoder reaction time, target logical error, T or Toffoli count, logical qubits, **number of magic-state factories**, and **routing overhead**. Show a range and its sensitivity to each input, not one precise number, and label results as model outputs.
- **FT-12: Hardware modalities and roadmaps.** Superconducting, trapped ion, neutral atom, photonic, topological. Cover cycle time, connectivity and error rates, and how each changes the chain. Every roadmap item is a dated claim.
  - The topological entry must say this: Microsoft announced Majorana 1 on 19 Feb 2025. The accompanying Nature paper (Nature 638, 651–655) carries an editorial statement that its results "do not represent evidence for the presence of Majorana zero modes". A Comment by Legg and a Microsoft reply followed in Nature 654 (24 Jun 2026).

Then add one synthesis page, **"The full chain"**:
- One walkthrough from application to timeline, using the FT-11 calculator.
- A section "Where each stage is bottlenecked" that explicitly marks where infrastructure is the binding constraint: decoders, control, calibration, orchestration.
- A dated "meanwhile" note on the parts of the chain that don't wait for hardware. For example, NIST published the post-quantum standards FIPS 203, 204 and 205 on 13 Aug 2024.
- End with a reflection prompt for the reader to write their own open questions. Do not pre-write the questions.

## Part 3: Simulation and code

1. **Stabilizer simulator.** Add a stabilizer-tableau simulator in `src/lib/` (Aaronson–Gottesman). It must:
   - handle Clifford circuits with Pauli-noise sampling for at least 50 qubits;
   - pass tests that check it against the existing state-vector simulator on random Clifford circuits of up to 8 qubits, that simulator's cap.
2. **Decoders.** Implement two small decoders in TypeScript, each with tests:
   - exact minimum-weight perfect matching for small graphs, **including boundary nodes**;
   - union-find with peeling.
   - Test both on the distance-3 surface code against brute-force minimum-weight correction.
3. **Optional notebooks.** Companion Python notebooks using Stim and PyMatching for larger distances.
   - A latency benchmark measures this laptop's software decoder. It is not hardware decoder latency; label it as such.
   - Keep the notebooks out of the CI Python suites unless their dependencies are pinned in `requirements-examples.txt`.

## Verified sources

All checked on 2 November 2026. Years are publication years, with the arXiv year in brackets where it differs.

| Source | Citation | Note |
|---|---|---|
| Dennis, Kitaev, Landahl, Preskill | "Topological quantum memory", J. Math. Phys. 43, 4452 (2002) [arXiv quant-ph/0110143, 2001] | Threshold via mapping to random-bond Ising model; it does not introduce the surface code |
| Fowler, Mariantoni, Martinis, Cleland | "Surface codes: Towards practical large-scale quantum computation", PRA 86, 032324 (2012), arXiv 1208.0928 | |
| Terhal | "Quantum error correction for quantum memories", RMP 87, 307 (2015) [arXiv 1302.3428, 2013] | Backlog argument in Sec. II.G.3 |
| Litinski | "A Game of Surface Codes", Quantum 3, 128 (2019) [arXiv 1808.02892, 2018] | |
| Delfosse, Nickerson | "Almost-linear time decoding algorithm for topological codes", Quantum 5, 595 (2021) [arXiv 1709.06218, 2017] | |
| Higgott | "PyMatching…", ACM TQC 3(3) (2022) [arXiv 2105.13082, 2021] | |
| Higgott, Gidney | "Sparse Blossom…", Quantum 9, 1600 (2025) [arXiv 2303.15933, 2023] | |
| Gidney | "Stim: a fast stabilizer circuit simulator", Quantum 5, 497 (2021), arXiv 2103.02202 | |
| Kelly, O'Malley, Neeley, Neven, Martinis | "Physical qubit calibration on a directed acyclic graph", arXiv 1803.03226 (2018) | **Preprint only**; not npj QI |
| Google Quantum AI and Collaborators | "Quantum error correction below the surface code threshold", Nature 638, 920 (2025) [arXiv 2408.13687, 2024; online 9 Dec 2024] | |
| Gidney, Ekerå | "How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits", Quantum 5, 433 (2021) [arXiv 1905.09749, 2019] | |
| Gidney | "How to factor 2048 bit RSA integers with less than a million noisy qubits", arXiv 2505.15917 (2025) | **Preprint** |
| Lee et al. | "Even more efficient quantum computations of chemistry through tensor hypercontraction", PRX Quantum 2, 030305 (2021) [arXiv 2011.03494, 2020] | Two Toffoli counts; see FT-11 |
| Gidney, Shutty, Jones | "Magic state cultivation: growing T states as cheap as CNOT gates", arXiv 2409.17595 (2024) | **Preprint** |
| Battistel et al. | "Real-time decoding for fault-tolerant quantum computing: progress, challenges and outlook", Nano Futures 7, 032003 (2023) | The real-time decoding review |
| Babbush et al. | "Focus beyond quadratic speedups for error-corrected quantum advantage", PRX Quantum 2, 010103 (2021) [arXiv 2011.04149, 2020] | Added |
| Microsoft Azure Quantum | "Interferometric single-shot parity measurement in InAs–Al hybrid devices", Nature 638, 651 (2025); Comment by Legg and Microsoft reply, Nature 654 (2026) | Dated claims only |
| NIST | FIPS 203, 204, 205 (13 Aug 2024), csrc.nist.gov/pubs/fips/203/final (also /204/, /205/) | Added |
| Aaronson, Gottesman | "Improved simulation of stabilizer circuits" (2004) | **Not yet verified.** Check before citing |

## Delivery: three phases, each a separate PR

1. Phase 1: Part 1 restructure, tiers, time estimates and the coverage note, after the five decisions above are confirmed.
2. Phase 2: FT-01 to FT-05, the stabilizer simulator and the decoders.
3. Phase 3: FT-06 to FT-12, plus the synthesis page.

Each report lists:
- pages added;
- pages edited (labels and links only);
- data files added;
- tests added;
- build, content-audit and link-check status;
- every claim marked unverified or preprint;
- the path time totals;
- anything not finished.

---

## Appendix: validation of the original spec

**Accurate claims**
- The simulator caps at 8 qubits, and the distance-3 rotated surface code needs 17.
- All nine lesson numbers and titles match the catalog.
- The site covers the algorithm link only: lesson 15 states that it "gives no hardware runtime or physical-qubit forecast".
- Every listed source exists and says roughly what the spec implies.
- The Google figures and the Gidney–Ekerå and Gidney 2025 assumptions are as stated.

**Inaccurate or imprecise claims**
- **"The coverage page explicitly excludes error correction."** Close, but not exact. It calls them "supporting protocols/engineering topics" that are "not counted as missing algorithms".
- **"The backlog problem means unbounded queue growth."** Incomplete. Terhal's argument is an exponential slowdown, f^k, in the number of feedforward T gates.
- **"Google Quantum AI (2024) … Nature."** The Nature volume is 638 (2025). 2024 is the arXiv and online date.
- **"Gidney (2025)" and "magic state cultivation (2024)"** are arXiv preprints, as is Kelly et al. 2018. The spec didn't say so.
- **"Lee et al. 2021 FeMoco"** has two different Toffoli counts in the same paper.

**Conflicts with the repo and between requirements**
- **Sidebar grouped by tier vs. existing tests:** this breaks the existing sidebar-order test, and tests may not be changed. Resolved in decision 4.
- **New numbering vs. the catalog:** the catalog and audit require numeric sequences. Resolved in decision 3.
- **The 9-lesson path vs. its prerequisites:** lesson 27 depends on 26 and 25. Resolved in Part 1, item 2.
- **The 25–35 hour target vs. the site's own estimator:** 104 minutes for the original nine lessons, 11.3 hours for the whole book. Resolved in Part 1, item 5.
- **Callouts in lessons vs. "labels only, do not edit lesson content":** resolved by rendering callouts from a data file.
- **A second default path vs. the Next button:** the Next button follows the main path. Resolved in decision 2.

**Gaps filled**
- Babbush et al. quadratic-speedup analysis.
- Sparse Blossom.
- Aaronson–Gottesman, to be verified.
- New definitions the module needs.
- Calculator inputs for factories and routing overhead.
- A dated post-quantum cryptography note.
- The topological-qubit dispute as dated claims.
- Boundary nodes in matching.
- Notebook latency labelled as software, not hardware.
