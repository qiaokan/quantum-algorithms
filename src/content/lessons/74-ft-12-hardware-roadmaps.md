## Problem and access model

Earlier lessons assumed one machine: superconducting qubits on a square grid, a 1.1 µs cycle and a surface code. Other qubit technologies, or **modalities**, change those numbers, and each change moves through the chain:

- **Cycle and gate time** set the clock, the decoder's time budget, and how fast magic-state factories produce output.
- **Connectivity** decides which codes are practical. A surface code needs only nearest neighbours; denser codes need long-range links.
- **Error rates** set the [code distance](/definitions/code-distance/) through $\Lambda$ ([FT-04](/lessons/ft-04-noise-thresholds/)).
- **Control and cooling** set how far one module can grow ([FT-10](/lessons/ft-10-control-calibration/)).

The input to this lesson is a set of published results and vendor roadmaps. The output is a way to compare them on the same scale, and to read a roadmap as a list of claims to check. Every vendor statement below is dated and linked to the page it came from. A roadmap is a plan, not a result.

## Comparison baseline: what the earlier lessons assumed

[Google Quantum AI (2024)](https://arxiv.org/abs/2408.13687) ran a distance-7 surface code on a 105-qubit superconducting processor with a 1.1 µs cycle and measured $\Lambda=2.14\pm0.02$. The [Gidney–Ekerå (2021)](https://arxiv.org/abs/1905.09749) RSA-2048 estimate assumes 0.1% gate error, a 1 µs cycle and a 10 µs **reaction time**: the delay from a measurement to the moment a later operation can depend on its decoded result. Those two sources are the yardstick for everything else here.

## Superconducting qubits

- **Measured:** 1.1 µs cycle, $\Lambda=2.14$, distance-7 logical error 0.143% per cycle (Google, above). Qubits are fixed on a chip and couple to nearest neighbours.
- **IBM's route.** As of June 2025, IBM [states](https://newsroom.ibm.com/2025-06-10-IBM-Sets-the-Course-to-Build-Worlds-First-Large-Scale,-Fault-Tolerant-Quantum-Computer-at-New-IBM-Quantum-Data-Center) that it will deliver Starling by 2029 at a new data centre in Poughkeepsie, New York, running 100 million quantum operations on 200 logical qubits, and later Blue Jay with 1 billion operations on 2,000 logical qubits. Its [technical blog](https://www.ibm.com/quantum/blog/large-scale-ftqc) of the same date bases this on qLDPC codes such as the "gross" code $[[144,12,12]]$: 144 data and 144 check qubits, 288 in all, for 12 logical qubits. For comparison, 12 distance-12 surface-code patches need $12\times(2\cdot12^2-1)=3{,}444$, about 12 times as many. The price is connectivity: the blog says the code needs long-range links that IBM's chips did not have.
- **IBM's progress claims.** As of November 2025, IBM [states](https://newsroom.ibm.com/2025-11-12-ibm-delivers-new-quantum-processors,-software,-and-algorithm-breakthroughs-on-path-to-advantage-and-fault-tolerance) that its experimental Loon processor demonstrates the key components for fault tolerance, including longer on-chip couplers, and that it decodes qLDPC codes in real time in under 480 ns on classical hardware. These are announcements; this lesson has not checked them against peer-reviewed papers.

**Chain effect:** a fast cycle gives a tight decoder budget and a fast logical clock. qLDPC codes trade fewer qubits for new wiring on the chip.

## Trapped ions

- **Measured, 2023.** Quantinuum's race-track processor, reported in [Moses et al. (2023)](https://arxiv.org/abs/2305.03828), Phys. Rev. X 13, 041052, has 32 qubits and an average two-qubit gate infidelity of $1.84(5)\times10^{-3}$. Any pair of qubits can interact, because ions are physically moved next to each other; transport takes 60% of circuit time on average.
- **Measured, 2021, timing.** In [Ryan-Anderson et al. (2021)](https://arxiv.org/abs/2107.07505), Phys. Rev. X 11, 041058, a 10-qubit Honeywell machine ran real-time error correction on one color-code logical qubit. Each correction cycle took under 200 ms, and one round of gates between random qubit pairs took 10.5 ms. These are 2021 numbers for an early system, not current specifications.
- **Roadmap.** As of September 2024, Quantinuum's [roadmap release](https://www.quantinuum.com/press-releases/quantinuum-unveils-accelerated-roadmap-to-achieve-universal-fault-tolerant-quantum-computing-by-2030) put a universal, fully fault-tolerant system, Apollo, at 2030 in its headline. As of 19 October 2026, a Quantinuum [press release](https://kyodonewsprwire.jp/release/202610198245) says Apollo is expected by 2029, and claims 99.9995% logical fidelity with a color code on its Helios system, with errors falling by a factor of 12 per step in code distance. The underlying preprint was not checked for this lesson; treat these as vendor claims.

**Chain effect:** connectivity between any pair makes dense codes easy to lay out, and lower gate errors, where achieved, allow a smaller distance. But every operation is much slower, so the decoder budget is generous and the logical clock is slow.

## Neutral atoms

- **Measured.** [Bluvstein et al. (2024)](https://arxiv.org/abs/2312.03982), Nature 626, 58, built a logical processor from up to 280 atoms held in optical tweezers. Atoms are moved between zones, which gives arbitrary connectivity. They improved a logical two-qubit gate by raising surface-code distance from 3 to 7 and ran circuits on up to 48 logical qubits in small error-detecting codes. From the paper: two-qubit gate fidelity 99.3–99.5%, entangling gates of 270 ns, movements between gates of roughly 200 µs, and a full mid-circuit readout-and-feedforward cycle of slightly under 1 ms.
- **Roadmap.** As of January 2024, QuEra's [roadmap](https://www.quera.com/press-releases/quera-computing-releases-a-groundbreaking-roadmap-for-advanced-error-corrected-quantum-computers-pioneering-the-next-frontier-in-quantum-innovation-0) promised 100 logical qubits in 2026. As of June 2026, QuEra [announces](https://www.quera.com/press-releases/quera-announces-2028-fault-tolerant-quantum-computer-and-expanded-multi-year-strategic-collaboration-with-aws) Libra for 2028 on Amazon Braket, projected at over 256 logical qubits and a $10^{-6}$ logical error rate. Whether the 2026 target was met is not verified here.

**Chain effect:** gates are fast but movement and readout are slow, so the readout-and-feedforward time, not the gate time, sets the reaction time.

## Photonic qubits

- **Measured.** PsiQuantum's paper [A manufacturable platform for photonic quantum computing](https://arxiv.org/abs/2404.17570), Nature 641, 876 (2025), reports chips made in a commercial foundry with 99.98% state preparation and measurement fidelity, 99.50% interference visibility between independent photon sources, 99.22% two-qubit fusion fidelity, and 99.72% chip-to-chip interconnect fidelity, the last not counting loss. These are component results, not a logical qubit.
- **Plans.** As of February 2025, PsiQuantum [states](https://www.psiquantum.com/news-import/omega) that it will build utility-scale sites in Brisbane and Chicago, and that its systems use rack-style cooling rather than dilution refrigerators. As of 30 September 2025, it [announces](https://www.psiquantum.com/news-import/psiquantum-breaks-ground-chicago) breaking ground in Chicago for a million-qubit-scale fault-tolerant machine. Neither page gives an operational date.

**Chain effect:** photons travel, so connectivity across chips is natural, and cooling avoids the millikelvin limits of FT-10. Loss is a central error source (the interconnect figure above explicitly excludes it), and the reported two-qubit operation is a fusion measurement rather than a gate on a fixed grid. No logical cycle time has been published, so the decoder and clock entries stay blank.

## Topological qubits

- **19 February 2025.** Microsoft [announces](https://news.microsoft.com/source/features/innovation/microsofts-majorana-1-chip-carves-new-path-for-quantum-computing/) Majorana 1, which it says holds eight topological qubits on a chip designed to scale to a million.
- **Same day.** The accompanying paper, [Interferometric single-shot parity measurement in InAs–Al hybrid devices](https://www.nature.com/articles/s41586-024-08445-2), Nature 638, 651–655 (2025), reports a parity measurement with 1% assignment error. Nature's editorial note in the peer-review file states that the results "do not represent evidence for the presence of Majorana zero modes".
- **24 June 2026.** A Matters Arising by [H. F. Legg](https://doi.org/10.1038/s41586-026-10567-8), Nature 654, E22–E26, analyses transport data and argues that the readout occurred where the device appears gapless, which would point to trivial origins. Microsoft's [reply](https://www.nature.com/articles/s41586-026-10568-7), Nature 654, E27–E28, maintains that the measurements indicate a topological origin.

**Chain effect, if it works:** protection in the hardware itself could shrink the code overhead. No logical qubit or error-correction cycle has been published, so none of the chain numbers can be filled in yet.

## Summary table

| Modality | Cycle or gate time | Connectivity | Errors | Source |
|---|---|---|---|---|
| Superconducting | 1.1 µs QEC cycle | nearest neighbour | $\Lambda=2.14$; 0.143%/cycle at $d=7$ | Google 2024 |
| Trapped ion | <200 ms QEC cycle (2021) | any pair, via transport | 2Q infidelity $1.84\times10^{-3}$ (2023) | Ryan-Anderson 2021; Moses 2023 |
| Neutral atom | 270 ns gate; ~1 ms readout and feedforward | any pair, via moves | 2Q fidelity 99.3–99.5% | Bluvstein 2024 |
| Photonic | — | across chips | fusion fidelity 99.22% | PsiQuantum 2025 |
| Topological | — | — | parity assignment error 1% | Microsoft 2025 |

## Worked comparison: a reaction-limited clock

Take a workload of $10^9$ non-Clifford operations, each depending on the decoded result of the previous one. In a **reaction-limited** model, each takes one reaction time $t_r$, and the wall-clock time is

$$T=10^9\,t_r .$$

<details><summary>Predict: if $t_r$ goes from 10 µs to 1 ms, how much longer does the run take?</summary>

A hundred times longer, because $T$ is linear in $t_r$: $1\text{ ms}/10\,\mu\text{s}=100$.

</details>

- **$t_r=10$ µs**, the Gidney–Ekerå superconducting assumption: $T=10^9\times10^{-5}=10^4$ s, about 2.8 hours.
- **$t_r=1$ ms**, from Bluvstein et al.'s measured readout-and-feedforward cycle of slightly under 1 ms: $T=10^9\times10^{-3}=10^6$ s, about 11.6 days.

The 1 ms figure is a 2024 laboratory value for one step; a future machine could be faster. If the reaction time were instead one 2021 trapped-ion correction cycle of 200 ms, the same workload would take $2\times10^8$ s, about 6.3 years. That figure says more about 2021 than about current ion systems, and it shows why a dated number must be read with its date.

**What a slower clock changes elsewhere.**

- **Decoder budget.** A 200 ms cycle gives a decoder about $0.2/1.1\times10^{-6}\approx180{,}000$ times as long per round as a 1.1 µs cycle. Real-time decoding ([FT-07](/lessons/ft-07-real-time-decoding/)) is much easier.
- **Factory throughput.** If a factory needs $k$ cycles per magic state, its output rate is $1/(k\,t_{\rm cycle})$, so it slows in proportion. More factories in parallel cost more qubits.
- **Code choice.** Connectivity can cut qubit counts, as the gross-code comparison above shows, and lower error rates allow smaller distances.

**What can offset a slower cycle, and what cannot.** Better connectivity and stronger codes reduce qubit counts and routing overhead. They do not shorten a chain of operations that each wait for the previous result. To recover a factor of 100 in this model, the algorithm needs about 100 times fewer dependent steps, which means restructuring it to do more in parallel, usually at a cost in qubits. A full comparison needs the resource model of [FT-11](/lessons/ft-11-resource-estimation/), with each modality's own cycle, code and factory figures. No published end-to-end estimate covers every modality on equal terms, so a single winner cannot be named from these numbers.

## Implementation and honest cost

- **Roadmaps are vendor claims.** Every date above comes from a company with an interest in it. Treat each one as a forecast with an author.
- **Announcements are not results.** A press release, a preprint and a peer-reviewed paper carry different weight, and the topological case shows that even peer review can come with an editorial caveat and a published dispute.
- **Targets move.** Quantinuum's headline year went from 2030 (September 2024) to 2029 (October 2026). QuEra's January 2024 roadmap promised 100 logical qubits in 2026; its June 2026 plan names 2028 for over 256. Track the changes, not just the latest slide.
- **Logical qubit counts are not comparable as stated.** Ask which code, which distance, which logical error rate, and how many operations it sustains. IBM states operations as well as qubits, which helps; error-detecting codes can report many logical qubits that do not correct errors.
- **How to read a roadmap as a decision-maker.** Write down the cycle time, reaction time, physical error rate, connectivity and code. Find the measured value of each. Run the workload you care about through a resource model. Then ask which assumption, if it slips by a factor of 10, changes your decision.

## Misunderstandings and prediction checks

<details><summary>"Ions have better error rates, so they will run algorithms faster." Is that right?</summary>

Not by itself. Lower error means a smaller code distance and fewer qubits. Wall-clock time in a reaction-limited model is set by the reaction time, where ions and atoms have so far been much slower than superconducting circuits. Which effect wins depends on the workload and on future speed-ups.

</details>

<details><summary>Predict: what reaction time would bring the $10^9$-operation workload to one week?</summary>

One week is $604{,}800$ s, so $t_r=604{,}800/10^9\approx605$ µs. That is a little faster than the ~1 ms readout-and-feedforward cycle of Bluvstein et al., and 60 times slower than the 10 µs Gidney–Ekerå assumption.

</details>

<details><summary>Does Microsoft's 2025 Nature paper demonstrate a topological qubit?</summary>

No. Nature's editorial note says its results do not represent evidence for Majorana zero modes, and the paper is framed around a device architecture for future experiments. Microsoft's announcement describes the chip as topological; a 2026 Matters Arising disputes the interpretation and Microsoft's reply defends it. As of November 2026 these remain claims and counter-claims.

</details>

## References

- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025). Cycle time, $\Lambda$, distance-7 error.
- Craig Gidney, Martin Ekerå, [How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits](https://arxiv.org/abs/1905.09749), Quantum 5, 433 (2021). The 10 µs reaction time.
- IBM, [IBM sets the course to build world's first large-scale, fault-tolerant quantum computer](https://newsroom.ibm.com/2025-06-10-IBM-Sets-the-Course-to-Build-Worlds-First-Large-Scale,-Fault-Tolerant-Quantum-Computer-at-New-IBM-Quantum-Data-Center), press release, 10 June 2025; [How IBM will build the world's first large-scale, fault-tolerant quantum computer](https://www.ibm.com/quantum/blog/large-scale-ftqc), blog, 10 June 2025; [IBM delivers new quantum processors…](https://newsroom.ibm.com/2025-11-12-ibm-delivers-new-quantum-processors,-software,-and-algorithm-breakthroughs-on-path-to-advantage-and-fault-tolerance), press release, 12 November 2025. Vendor claims.
- S. A. Moses et al., [A race track trapped-ion quantum processor](https://arxiv.org/abs/2305.03828), Phys. Rev. X 13, 041052 (2023). Gate infidelity, connectivity via transport.
- C. Ryan-Anderson et al., [Realization of real-time fault-tolerant quantum error correction](https://arxiv.org/abs/2107.07505), Phys. Rev. X 11, 041058 (2021). Cycle timing.
- Quantinuum, [roadmap press release](https://www.quantinuum.com/press-releases/quantinuum-unveils-accelerated-roadmap-to-achieve-universal-fault-tolerant-quantum-computing-by-2030), 10 September 2024; [error-correction press release](https://kyodonewsprwire.jp/release/202610198245), 19 October 2026. Vendor claims.
- Dolev Bluvstein et al., [Logical quantum processor based on reconfigurable atom arrays](https://arxiv.org/abs/2312.03982), Nature 626, 58–65 (2024). Gate, movement and readout timings; logical results.
- QuEra, [roadmap press release](https://www.quera.com/press-releases/quera-computing-releases-a-groundbreaking-roadmap-for-advanced-error-corrected-quantum-computers-pioneering-the-next-frontier-in-quantum-innovation-0), 9 January 2024; [Libra announcement](https://www.quera.com/press-releases/quera-announces-2028-fault-tolerant-quantum-computer-and-expanded-multi-year-strategic-collaboration-with-aws), 15 June 2026. Vendor claims.
- PsiQuantum team (K. Alexander et al.), [A manufacturable platform for photonic quantum computing](https://arxiv.org/abs/2404.17570), Nature 641, 876–883 (2025). Component fidelities. PsiQuantum, [Omega announcement](https://www.psiquantum.com/news-import/omega), 26 February 2025, and [Chicago groundbreaking](https://www.psiquantum.com/news-import/psiquantum-breaks-ground-chicago), 30 September 2025. Vendor claims.
- Microsoft, [Majorana 1 announcement](https://news.microsoft.com/source/features/innovation/microsofts-majorana-1-chip-carves-new-path-for-quantum-computing/), 19 February 2025. Microsoft Azure Quantum, [Interferometric single-shot parity measurement in InAs–Al hybrid devices](https://www.nature.com/articles/s41586-024-08445-2), Nature 638, 651–655 (2025), with editorial note in the peer-review file. H. F. Legg, [On the robustness of topological gap detection via transport](https://doi.org/10.1038/s41586-026-10567-8), Nature 654, E22–E26 (2026); Microsoft Quantum, [Reply](https://www.nature.com/articles/s41586-026-10568-7), Nature 654, E27–E28 (2026).
