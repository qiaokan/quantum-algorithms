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
- **Google's own roadmap.** As of November 2026, Google Quantum AI's [roadmap](https://quantumai.google/roadmap) lists six milestones. Milestone 1 (beyond-classical, 54 qubits, 2019) and milestone 2 (an error-correction prototype, about $10^2$ physical qubits and $10^{-2}$ logical error, 2023) are marked reached. Milestone 3, a long-lived logical qubit at about $10^3$ physical qubits and $10^{-6}$ logical error, is undated. So are the milestones up to milestone 6, about $10^6$ physical qubits at $10^{-13}$ logical error. In October 2025 Google [wrote](https://blog.google/innovation-and-ai/technology/research/quantum-echoes-willow-verifiable-quantum-advantage/) that it is "focused on achieving Milestone 3". Its only dated target found here is from May 2021: a useful, error-corrected computer [within the decade](https://blog.google/innovation-and-ai/products/unveiling-our-new-quantum-ai-campus/).
- **IBM's route.** As of June 2025, IBM [states](https://newsroom.ibm.com/2025-06-10-IBM-Sets-the-Course-to-Build-Worlds-First-Large-Scale,-Fault-Tolerant-Quantum-Computer-at-New-IBM-Quantum-Data-Center) that it will deliver Starling by 2029 at a new data centre in Poughkeepsie, New York, running 100 million quantum operations on 200 logical qubits, and later Blue Jay with 1 billion operations on 2,000 logical qubits. The same roadmap lists intermediate processors, Kookaburra in 2026 and Cockatoo in 2027; their status was not checked for this lesson. Its [technical blog](https://www.ibm.com/quantum/blog/large-scale-ftqc) of the same date bases this on qLDPC codes such as the "gross" code $[[144,12,12]]$: 144 data and 144 check qubits, 288 in all, for 12 logical qubits. For comparison, 12 distance-12 surface-code patches need $12\times(2\cdot12^2-1)=3{,}444$, about 12 times as many. The price is connectivity: the blog says the code needs long-range links that IBM's chips did not have.
- **IBM's progress claims.** As of November 2025, IBM [states](https://newsroom.ibm.com/2025-11-12-ibm-delivers-new-quantum-processors,-software,-and-algorithm-breakthroughs-on-path-to-advantage-and-fault-tolerance) that its experimental Loon processor demonstrates the key components for fault tolerance, including longer on-chip couplers, and that it decodes qLDPC codes in real time in under 480 ns on classical hardware. These are announcements; this lesson has not checked them against peer-reviewed papers.

**Chain effect:** a fast cycle gives a tight decoder budget and a fast logical clock. qLDPC codes trade fewer qubits for new wiring on the chip.

## Trapped ions

- **Measured, 2023.** Quantinuum's race-track processor, reported in [Moses et al. (2023)](https://arxiv.org/abs/2305.03828), Phys. Rev. X 13, 041052, has 32 qubits and an average two-qubit gate infidelity of $1.84(5)\times10^{-3}$. Any pair of qubits can interact, because ions are physically moved next to each other; transport takes 60% of circuit time on average.
- **Measured, 2021, timing.** In [Ryan-Anderson et al. (2021)](https://arxiv.org/abs/2107.07505), Phys. Rev. X 11, 041058, a 10-qubit Honeywell machine ran real-time error correction on one color-code logical qubit. Each correction cycle took under 200 ms, and one round of gates between random qubit pairs took 10.5 ms. These are 2021 numbers for an early system, not current specifications.
- **Roadmap.** As of September 2024, Quantinuum's [roadmap release](https://www.quantinuum.com/press-releases/quantinuum-unveils-accelerated-roadmap-to-achieve-universal-fault-tolerant-quantum-computing-by-2030) put a universal, fully fault-tolerant system, Apollo, at 2030 in its headline. As of 19 October 2026, a Quantinuum [press release](https://kyodonewsprwire.jp/release/202610198245) says Apollo is expected by 2029, and claims 99.9995% logical fidelity with a color code on its Helios system, with errors falling by a factor of 12 per step in code distance. The release links to a preprint, [Lavasani et al. (arXiv 2610.24077, October 2026)](https://arxiv.org/abs/2610.24077), not yet peer reviewed. It reports color codes at distances 3, 5 and 7 with logical error as low as about $5\times10^{-6}$ per round and $\Lambda=12^{+3}_{-2}$. The 99.9995% figure is memory fidelity per syndrome round, not the success rate of a computation.

- **IonQ.** IonQ's [roadmap page](https://www.ionq.com/roadmap), as viewed in November 2026, targets 12 logical qubits at under $10^{-7}$ logical error in 2026, 800 logical qubits on 10,000 physical in 2027, 8,000 logical on 200,000 physical in 2029, and 80,000 logical on 2,000,000 physical at under $10^{-12}$ in 2030. It completed its [acquisition of Oxford Ionics](https://www.ionq.com/news/ionq-completes-acquisition-of-oxford-ionics-rapidly-accelerating-its-quantum) on 17 September 2025. A preprint, [Hughes, Srinivas et al. (arXiv 2510.17286, October 2025)](https://arxiv.org/abs/2510.17286), reports a two-qubit gate error of $8.4(7)\times10^{-5}$; it is not yet peer reviewed. IonQ [opened](https://investors.ionq.com/news/news-details/2024/IonQ-Opens-Doors-to-First-Dedicated-Quantum-Computing-Manufacturing-Facility-in-the-U.S/default.aspx) a manufacturing facility in Bothell, Washington, in February 2024. All of these are vendor plans or unreviewed results, and whether the 2026 target was met was not checked.

**Chain effect:** connectivity between any pair makes dense codes easy to lay out, and lower gate errors, where achieved, allow a smaller distance. But every operation is much slower, so the decoder budget is generous and the logical clock is slow.

## Neutral atoms

- **Measured.** [Bluvstein et al. (2024)](https://arxiv.org/abs/2312.03982), Nature 626, 58, built a logical processor from up to 280 atoms held in optical tweezers. Atoms are moved between zones, which gives arbitrary connectivity. They improved a logical two-qubit gate by raising surface-code distance from 3 to 7 and ran circuits on up to 48 logical qubits in small error-detecting codes. From the paper: two-qubit gate fidelity 99.3–99.5%, entangling gates of 270 ns, movements between gates of roughly 200 µs, and a full mid-circuit readout-and-feedforward cycle of slightly under 1 ms.
- **Roadmap.** As of January 2024, QuEra's [roadmap](https://www.quera.com/press-releases/quera-computing-releases-a-groundbreaking-roadmap-for-advanced-error-corrected-quantum-computers-pioneering-the-next-frontier-in-quantum-innovation-0) promised 100 logical qubits in 2026. As of June 2026, QuEra [announces](https://www.quera.com/press-releases/quera-announces-2028-fault-tolerant-quantum-computer-and-expanded-multi-year-strategic-collaboration-with-aws) Libra for 2028 on Amazon Braket, projected at over 256 logical qubits and a $10^{-6}$ logical error rate. As of November 2026 this book found no announcement that the 2026 target was met.

- **Atom Computing with Microsoft.** A preprint by Microsoft and Atom Computing, [Reichardt et al. (arXiv 2411.11822)](https://arxiv.org/abs/2411.11822), first posted in November 2024 and retitled "Fault-tolerant quantum computation with a neutral atom processor" in June 2025, reports 256 ytterbium atoms, 24 entangled logical qubits encoded in 48 atoms, and Bernstein–Vazirani on up to 28 logical qubits. It has no journal reference yet. On 17 July 2025 the Novo Nordisk Foundation and EIFO [announced](https://novonordiskfonden.dk/en/news/eifo-and-the-novo-nordisk-foundation-acquire-the-worlds-most-powerful-quantum-computer/) "Magne", a "Level 2" machine of 50 logical qubits on more than 1,200 physical qubits. Atom Computing builds the hardware and Microsoft supplies the software. First tasks are expected around the turn of 2026/27.

**Chain effect:** gates are fast but movement and readout are slow, so the readout-and-feedforward time, not the gate time, sets the reaction time.

## Cat qubits and biased noise

Every lesson so far assumed that bit flips and phase flips are about equally likely, so the code must protect against both. A **cat qubit** stores its 0 and 1 as two coherent states of a microwave resonator. Increasing the photon number suppresses bit flips exponentially, while phase flips get only mildly worse. [Guillaud and Mirrahimi (2019)](https://arxiv.org/abs/1904.09474), PRX 9, 041053, show that with errors this biased, a one-dimensional repetition code against phase flips can do the job of the two-dimensional surface code, using bias-preserving gates. The caveat is that this works only if the residual bit flips stay suppressed for the entire computation.

- **Measured, AWS.** [Putterman et al. (2025)](https://arxiv.org/abs/2409.13025), Nature 638, 927–934, describe the Ocelot chip: 5 cat data qubits and 4 transmon ancillas forming a distance-5 repetition code. At a mean photon number of 2, bit-flip times exceed 1 ms, while phase-flip times are 27–33 µs. The logical error per cycle is 1.65% at distance 5, against 1.75% averaged over distance-3 sections. That is only a slight gain with distance so far. AWS's [announcement](https://www.amazon.science/blog/amazon-announces-ocelot-quantum-chip) of 27 February 2025 projects "up to 90%" less overhead for scaled machines; that is a projection, not a measurement.
- **Roadmap, Alice & Bob.** As of December 2024, Alice & Bob's [roadmap](https://alice-bob.com/newsroom/alice-bob-quantum-computing-roadmap/) targets "100 high-fidelity logical qubits" by 2030 in its Graphene machine, which its [long-form roadmap](https://alice-bob.com/wp-content/uploads/2024/12/Alice-Bob-Roadmap-Long-Version.pdf) puts at about 2,000 cat qubits and $10^{-6}$ logical error.
- **Biased noise also helps surface codes.** [Bonilla Ataides et al. (2021)](https://arxiv.org/abs/2009.07851), Nature Communications 12, 2172, show that the XZZX variant of the surface code has a high threshold under biased noise and needs far fewer qubits at high bias.

**Chain effect:** strong bias changes the code itself, and with it the qubits per logical qubit and possibly the cost of magic states. That is a different overhead equation from FT-03 and FT-11, and this book's calculator does not model it.

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
| Trapped ion | <200 ms QEC cycle (2021) | any pair, via transport | 2Q infidelity $1.84\times10^{-3}$ (2023); Λ ≈ 12 with color codes to $d=7$ (preprint, 2026) | Ryan-Anderson 2021; Moses 2023; Lavasani 2026 |
| Neutral atom | 270 ns gate; ~1 ms readout and feedforward | any pair, via moves | 2Q fidelity 99.3–99.5% | Bluvstein 2024 |
| Cat (bosonic) | — | nearest neighbour (repetition chain) | 1.65% per cycle at $d=5$; bit-flip time >1 ms | Putterman 2025 |
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
