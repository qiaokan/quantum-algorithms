# Independent content review, round 1: FT-01 to FT-13

Date: **2026-11-03**.

Three reviewer agents each read the lesson files, exercises, definitions, source records and the relevant code. None of them wrote the lessons, and none was given the author's conclusions. Each recomputed the worked numbers and checked claims against primary sources. This is an internal independent-agent content review, as in `review-first-five.md`. It is not external scientific peer review, and it does not replace review by a human expert.

## Verdicts

| Lessons | Reviewer verdict before fixes | Status after fixes |
|---|---|---|
| FT-01 to FT-05 | No wrong number or worked example. Two P2 wording issues; conditional pass. | Both P2 and all P3 items fixed |
| FT-06 to FT-09 | FT-09 failed: two P1 errors in factory throughput. FT-06 to FT-08 pass apart from wording. | P1 and P2 items fixed |
| FT-10 to FT-13 | No P1. Five P2 framing issues; conditional pass. | All P2 and P3 items fixed |

## Findings and dispositions

**P1, fixed**
- **FT-09, the Litinski 20-to-4 factory.** Its Table 1 qubits and cycles are per protocol run, and each run makes 4 states. Litinski: "the space-time cost and output error are per magic state". The lesson had one state per 130 µs; it is one per 32.5 µs, about 30,800 per second. Confirmed against the paper's text and table arithmetic: 43,300 × 130 / 4 ≈ 1.41M qubit-cycles per state.
- **FT-09, T states counted as Toffolis.** The reaction-limited factory count now converts Toffolis to T states: 4 T per Toffoli with the cheaper construction (Litinski 2019a, Sec. 6), 7 with the plain one. The answer is 13 factories, or about 23 at 7 T. The exercise's bad-state estimate becomes 1.46 expected bad states, about a 77% chance of at least one failure (it was 30%).

**P2, fixed**
- **FT-11, FeMoco agreement.** The FeMoco qubit total matched only because two errors offset each other: factories too small and data too large. The preset now follows Lee et al.'s layout: 1,908 patches, 15d×8d factories of about 120 patches each, and fewer than 700 data qubits. The model gives 3.7M qubits with 2d², or 3.9M with the paper's 2(d+1)², against "about 4 million".
- **FT-11, RSA agreement.** Gidney–Ekerå count 2(d+1)² = 1,568 qubits per patch (their own hand count is about 23M), and derive the runtime from lookup additions, not Toffolis × reaction time. Both points are now stated.
- **FT-13, scope of "binding today".** It is now labelled superconducting. The October 2026 trapped-ion preprint (Λ ≈ 12 with color codes up to d = 7; small, slow and unreviewed) is cited. "Decoding: secondary" now says the model holds the 63 µs distance-5 latency fixed and that throughput at d ≈ 89 is undemonstrated.
- **FT-11 and FT-13, the Λ = 2.14 scenario.** Three hedges added:
  - the model matches Λ but not Google's absolute error (anchoring on it gives d = 87 and about 215M);
  - the factory settings are carried over from p = 0.1%;
  - the "only Λ" runtime rise to 12.5 h comes from factory limitation.
- **FT-12, summary table.** It now includes the trapped-ion Λ ≈ 12 preprint.
- **FT-04, a mixed-model figure.** The "Λ = 10, d = 29" figure mixed Google's starting error with Lee's Λ. It is now labelled as not Lee et al.'s figure.
- **FT-05, what matching optimizes.** It now says matching finds the most likely single error, not the most likely equivalence class.
- **FT-06, weighted disagreements.** "No disagreement at distance 5 with weights 1–3" was false. It now reads: 103 of 3,645 weighted cases disagree, all at equal weight. The author reproduced this count with the repository code.
- **FT-09, a hidden assumption.** Litinski's 10-second example depends on 10⁸ T gates in 10⁶ layers of 100, which is now stated.

**P3, fixed**
- **FT-02:** Gottesman–Knill input-state wording; "at least one" anticommuting stabilizer; the 2n rows explained; "on a surface-code processor".
- **FT-03:** the 101 qubits are now explained as 49 data + 48 measure + 4 leakage-removal, verified by the reviewer in the paper; the round-1 eigenstate wording.
- **FT-04:** Λ described as a weighted fit; the statistics wording; a dated scope on "not demonstrated".
- **FT-05:** "detection events" is used but not defined in Google's paper.
- **FT-10:** the DAG descendant count.
- **FT-11:** Babbush's t_C = 33 ns behind the 2.4 h figure.
- **FT-12:** IBM's Kookaburra (2026) and Cockatoo (2027) noted as unchecked; QuEra's and IonQ's 2026 targets marked "no announcement found / not checked"; the Alice & Bob long-form roadmap cited.
- **Exercises:** the FT-05 end-check wording; the FT-10 rounding (289); Gidney–Ekerå's 8 h corrected to 14 factories per thread (about 8–9 h) or 28 in parallel (about 7.4 h).
- **Source metadata:**
  - Gidney–Ekerå marked full-text;
  - the Quantinuum wire-copy note;
  - per-run and layer notes added to the Litinski records.

## Scope verified by the reviewers

- **Recomputed:** every worked number and exercise answer in FT-01 to FT-13; all three calculator presets and ten variants; the FT-13 decomposition table.
- **Run against the repository code:** the FT-06 union-find cases; the decoder disagreement counts; the surface-code layout; the 8-branch measurement CNOT and T teleportation.
- **Primary texts read in full or in the relevant sections:**
  - Google Quantum AI 2024/25, Lee et al. 2021, Gidney–Ekerå 2021, Babbush et al. 2021 and Krinner et al. 2019;
  - Delfosse–Nickerson, Terhal Sec. II.G.3, Skoric et al., Barber et al., Horsman et al., both Litinski papers, Bravyi–Kitaev and Gidney–Shutty–Jones;
  - Tomita–Svore and Gottesman 1998.
- **Abstract level only:** Boykin et al., Tan et al. and Shor 1995.
- **Vendor and dated items checked online:** the Quantinuum preprint and release, QuEra's Libra announcement, IonQ's roadmap, IBM's blog, AWS Ocelot, Alice & Bob, and Gidney 2025's preprint status.
- **Not verified by any reviewer:** Fowler's Eq. 11 wording (verified in an earlier round), Klimov, Kelly, Moses, Ryan-Anderson, Bluvstein, PsiQuantum, the Google roadmap page, Microsoft's reply, and the Battistel data-rate figure.

## Label decision

The repository's `reviewed` status has previously been granted on an internal independent-agent review (lessons 01–05). These FT lessons meet the reviewers' stated standard after fixes.

**Decision, 2026-11-03:** the owner decided that this agent review counts. FT-01 to FT-13 are now labelled `reviewed`, on the same basis as lessons 01–05. The label means an internal independent-agent review with its findings fixed. It does not mean human expert or external scientific review. An external reader has explicitly said that recomputation is not review. The items listed above as "not verified by any reviewer" remain unverified.
