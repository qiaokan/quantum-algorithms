## Problem and access model

A surface code is a schedule. In every cycle, each measure qubit is reset, takes part in up to four two-qubit gates with its data-qubit neighbours, gets a few single-qubit rotations, and is read out ([FT-03](/lessons/ft-03-surface-code/)). The readout bits then go to a decoder, and the decoder's answer has to come back in time to steer later operations ([FT-05](/lessons/ft-05-decoding-matching/)). Google's 105-qubit processor repeats this every 1.1 µs ([Google Quantum AI 2024](https://arxiv.org/abs/2408.13687)).

This lesson asks what physically has to exist to run that schedule on superconducting transmon qubits. The inputs are a qubit count $N$ and a cycle. The outputs are:

- the analog signals each qubit needs: drive pulses, two-qubit gate pulses, readout tones and reset;
- the wires that carry those signals into a refrigerator, and the heat they bring with them;
- the calibration experiments that set every pulse parameter, and how often drift forces them to be repeated;
- the classical data and software that tie all of this together.

None of this is quantum algorithms. It is infrastructure.

## Classical baseline: how a classical chip avoids the problem

A CPU has billions of transistors but only a few thousand pins, because its control signals are generated on the chip. Today's superconducting qubits are wired the other way: each qubit's microwave pulses are generated at room temperature and sent down coaxial cables into a dilution refrigerator whose coldest stage sits at millikelvin temperatures. The wire count grows linearly with the qubit count, and every wire conducts heat into a stage whose cooling power is measured in microwatts. Every scaling route below tries to move toward the CPU picture.

## Control channels per transmon

[Krinner et al. (2019)](https://arxiv.org/abs/1806.07862), EPJ Quantum Technology 6, 2, describe the lines a flux-tunable transmon processor uses and measure their heat loads:

- **Drive lines** carry microwave pulses for single-qubit gates and drive the readout resonators, covering 4–8 GHz in their design. About 60 dB of attenuation, spread over the colder stages, cuts room-temperature thermal noise to about $10^{-3}$ photons at the coldest plate.
- **Flux lines** tune a qubit's frequency through a SQUID loop, mainly for two-qubit gates. They are filtered to about 1 GHz and carry 10–20 dB of attenuation.
- **Output lines** carry readout signals out through isolators, circulators and amplifiers.

**Frequency multiplexing** shares lines. Each qubit's readout resonator has its own frequency, so one line can read several qubits at once. The paper says one readout line can serve up to 10 qubits, given a near-quantum-limited amplifier with at least 1 GHz of bandwidth; its 50-qubit budget assumes 6–7 qubits per line.

For that 50-qubit processor, with one drive and one flux line per qubit, the paper counts 124 RF lines: 50 drive, 50 flux, 8 output, 8 read-in and 8 amplifier-pump lines. That is $c=124/50=2.48$ lines per qubit.

## Worked: wiring and heat budget

Each stage $i$ of the refrigerator has a cooling power $P_i$. Each line deposits heat $q_i$ there: **passive** heat conducted down the cable, plus **active** heat dissipated by the signals in attenuators and cables. If each qubit brings lines with total load $q_i$ per qubit, the stage supports at most

$$N_{\max,i}=\frac{P_i}{q_i},$$

and the machine is limited by the smallest $N_{\max,i}$.

**Sourced inputs.** Cooling powers come from Krinner et al.'s Table 1, for a Bluefors XLD400 refrigerator, each at the stated temperature. Passive loads per line are the measured values in their Table 2, for 0.085-inch stainless-steel coax.

| Stage | Cooling power $P_i$ | Drive line | Flux line | Per qubit (drive + flux) | $N_{\max,i}$ |
|---|---|---|---|---|---|
| 50 K | 30 W (at 45 K) | 45 mW | 56 mW | 101 mW | 297 |
| 4 K | 1.5 W (at 4.2 K) | 1.0 mW | 1.2 mW | 2.2 mW | 681 |
| Still | 40 mW (at 1.2 K) | 4 µW | 2 µW | 6 µW | 6,666 |
| Cold plate | 200 µW (at 140 mK) | 0.4 µW | 0.29 µW | 0.69 µW | 289 |
| Mixing chamber | 19 µW (at 20 mK) | 0.013 µW | 0.025 µW | 0.038 µW | 500 |

Check one row. At the mixing chamber, $19/0.038=500$ qubits.

**Add one active load.** A DC current holds each tunable qubit at its operating frequency. Under the paper's worst-case assumption about stray flux offsets, it dissipates on average $0.050$ µW per flux line at the mixing chamber. The mixing-chamber load per qubit becomes $0.038+0.050=0.088$ µW, and

$$N_{\max,\rm MXC}=\frac{19}{0.088}\approx216 .$$

**What this table leaves out.** It ignores the readout lines (0.48 per qubit), the active load of the drive pulses, and the error bars: the 50 K drive-line figure is $45\pm23$ mW. Krinner et al.'s own full budget for 50 qubits, which includes all of these, puts the largest relative loads at about 30% on the cold plate and the mixing chamber. Scaling that, $50/0.30\approx167$ qubits, and the paper concludes the thermal budget would allow about 150 qubits.

**The first wall is space, not heat.** The fridge has six line-of-sight ports with 25 lines each, 150 lines in all. At 2.48 lines per qubit that is $150/2.48\approx60$ qubits, and the paper describes its 124-line, 50-qubit configuration as full capacity. Tripling the line density would be needed to reach the thermal limit.

<details><summary>Predict: thinner 0.047-inch cables cut the passive load by almost a factor of four, but the paper says their higher DC resistance raises the flux-bias load four-fold. What happens at the mixing chamber?</summary>

Passive load per qubit falls to about $0.038/4\approx0.0095$ µW, but the flux-bias load rises to $4\times0.050=0.20$ µW. The total is about $0.21$ µW and $19/0.21\approx91$ qubits, worse than before. Krinner et al. make the same point: thinner cables help only if flux offsets are shielded away, in which case they estimate about 400 qubits.

</details>

**An illustrative extrapolation.** At 2.48 lines per qubit, a million physical qubits would need about 2.5 million coaxial lines. With this 2019 design that is $10^6/50=20{,}000$ refrigerators of 50 qubits each. Nobody proposes building that; the number shows why the wiring model has to change.

## Cryo-CMOS and other scaling routes

- **Cryogenic CMOS.** Put control electronics inside the refrigerator, at about 4 K, so that a few digital lines replace many analog ones. [Patra et al. (2018)](https://doi.org/10.1109/JSSC.2017.2737549), IEEE J. Solid-State Circuits 53, 309, argue that million-qubit machines need this and demonstrate building blocks, including a low-noise amplifier for spin-qubit readout and a qubit-control oscillator. [Bardin et al. (2019)](https://doi.org/10.1109/JSSC.2019.2937234), IEEE JSSC 54, 3043, report a 28-nm CMOS controller for transmon single-qubit gates, operating at 3 K, that dissipates under 2 mW and needs a digital stream under 500 Mb/s. If one such controller served one qubit (an illustrative assumption; the abstract does not give the count), the 4 K stage above would support about $1.5\text{ W}/2\text{ mW}=750$ of them.
- **More multiplexing.** Share drive and readout lines in frequency or time, as readout already does.
- **Bigger refrigerators and better components.** Krinner et al. expect future refrigerators to have several dilution units, and sketch a path to about a thousand qubits using superconducting flux lines and warmer operating points.

Each route moves cost rather than removing it: heat moves to the 4 K stage, design effort moves into custom chips, and links between refrigerators become a networking problem.

## Calibration as a dependency graph

Every pulse has parameters: frequency, amplitude, duration, shape and phase. They differ from qubit to qubit, and they drift. [Kelly, O'Malley, Neeley, Neven and Martinis (2018)](https://arxiv.org/abs/1803.03226), a preprint, model calibration as a **directed acyclic graph**. Each node is a calibration with a target parameter, a scan, an analysis, a tolerance and a timeout. An edge means one calibration depends on parameters found by another. Their framework gives each node three operations, in increasing cost:

1. **check state:** no experiment, just bookkeeping. It passes only if the node passed recently, within its timeout, and no dependency has been recalibrated since.
2. **check data:** a few data points, to decide in spec, out of spec, or bad data.
3. **calibrate:** a full scan that updates the parameter.

A traversal called *maintain* starts measuring at the node closest to the root that fails check state; bad data triggers *diagnose*, which inspects the nodes it depends on. Cycles are unrolled into coarse, medium and fine layers.

**A toy DAG for one qubit.** Seven calibrations, with their dependencies:

| Node | Sets | Depends on |
|---|---|---|
| RS: resonator spectroscopy | readout frequency | (root) |
| QS: qubit spectroscopy | rough qubit frequency | RS |
| Rabi | π-pulse amplitude | QS |
| Ramsey | fine qubit frequency | Rabi |
| DRAG | pulse-shape correction | Ramsey |
| RO: readout optimization | readout power and threshold | RS, Rabi |
| CZ: two-qubit gate (per pair) | flux-pulse parameters | DRAG and RO of both qubits |

**A topological order** lists every node after its dependencies: RS, QS, Rabi, Ramsey, DRAG, RO, CZ. RO is only constrained to come after Rabi and before CZ, so it may sit in any of three places. There are exactly 3 valid orders.

**Drift invalidates descendants.** Suppose the qubit frequency drifts, so Ramsey goes out of spec. Its descendants are DRAG and CZ, and Kelly et al.'s rule marks them unverified until they are rechecked. If instead the drift is large enough that QS fails, the descendants are Rabi, Ramsey, DRAG, RO and CZ, which is everything except the root.

<details><summary>Predict: how many calibration nodes does a 10 × 10 grid of qubits have in this toy model?</summary>

Six single-qubit nodes per qubit gives 600. A $10\times10$ grid has $2\cdot10\cdot9=180$ nearest-neighbour pairs, each with one CZ node. Total: 780.

</details>

**Counting for $N$ qubits.** Assume a $\sqrt N\times\sqrt N$ grid, six single-qubit nodes per qubit and one CZ node per neighbouring pair. The count is $6N+2\sqrt N(\sqrt N-1)$. At $N=10^6$ that is $6{,}000{,}000+1{,}998{,}000=7{,}998{,}000$ nodes.

**Time, with illustrative numbers.** Say each full calibration takes 30 s (an assumption, not a sourced figure). Run serially, the 780 nodes of the $10\times10$ grid take $23{,}400$ s, about 6.5 hours. Run in parallel layers, with the six single-qubit stages applied to all qubits at once and the CZ pairs split into four non-overlapping groups, it is $10\times30=300$ s. Parallelism is limited by crosstalk: neighbours often cannot be calibrated at the same time. This is DAG scheduling with a conflict graph, a problem familiar from build systems and job schedulers.

## Drift and recalibration

The sourced facts are few, so state them with their scope. [Klimov et al. (2018)](https://arxiv.org/abs/1809.01043), Phys. Rev. Lett. 121, 090502, tracked energy-relaxation times on a Google processor over about 20 hours. They found that $T_1$ could change by up to an order of magnitude, with jumps visible between their 15-minute measurements and across 5 MHz of frequency, and traced the largest fluctuations to two-level-system defects. In the same setup, qubit-frequency calibration stayed within about ±1 MHz over roughly 25 hours. These are 2018 results for one device, not a statement about current machines.

A recalibration budget follows from the graph. If $n$ nodes each need a check every $\tau$ seconds and a check takes $t$ seconds, the system needs parallelism of at least $nt/\tau$. With illustrative values $n=8\times10^6$, $t=1$ s and $\tau=900$ s (15 minutes), that is about 8,900 checks running at once, all the time, while the machine also computes.

## Implementation and honest cost

- **Classical electronics.** Each qubit today needs signal generation, digitization and timing at room temperature, or a cryogenic replacement. Bardin et al.'s figure of under 500 Mb/s per controller would be $5\times10^{14}$ b/s across a million controllers, if each needed that rate.
- **Data rates.** A distance-27 surface-code patch has $27^2-1=728$ measure qubits. At 1.1 µs per cycle, that is $728/1.1\,\mu\text{s}\approx6.6\times10^8$ [syndrome](/definitions/syndromes/) bits per second per logical qubit, and about 660 Gb/s for 1,000 logical qubits. All of it must reach a decoder with bounded latency.
- **Software orchestration.** Calibration graphs, schedulers, drift monitors and rolling recalibration during computation form a distributed control plane. Kelly et al. describe the framework, not a million-qubit implementation.
- **Where your skills apply.** Line and heat budgets, data paths and DAG scheduling under conflicts are capacity-planning and orchestration problems. They are open, they can bind before the physics does, and they reward the discipline of running low-latency infrastructure.

## Misunderstandings and prediction checks

<details><summary>"Heat is what limits the number of qubits per refrigerator." Is that right?</summary>

Not in Krinner et al.'s 2019 setup. At 50 qubits the largest stage loads were about 30%, but all 150 line positions were already planned for. Space for connectors bound first, then heat at the coldest two stages. Which limit binds depends on the design.

</details>

<details><summary>Once a processor is calibrated, can it run indefinitely?</summary>

No. Parameters drift, and some, like $T_1$ in Klimov et al.'s device, can change by large factors within minutes to hours. The calibration graph exists precisely to decide which nodes to recheck, and in what order, without starting over.

</details>

<details><summary>Predict: in the toy DAG, readout optimization (RO) goes out of spec. Which nodes must be revisited?</summary>

RO itself and its only descendant, CZ, for every pair that includes this qubit. On a grid interior qubit that is RO plus 4 CZ nodes. Rabi, Ramsey and DRAG stay valid, because they do not depend on RO in this model.

</details>

## References

- Sebastian Krinner, Simon Storz, Philipp Kurpiers, Paul Magnard, Johannes Heinsoo, Raphael Keller, Janis Luetolf, Christopher Eichler, Andreas Wallraff, [Engineering cryogenic setups for 100-qubit scale superconducting circuit systems](https://arxiv.org/abs/1806.07862), EPJ Quantum Technology 6, 2 (2019). Line types, attenuation, multiplexing, Table 1 cooling powers, Table 2 passive loads, flux-bias load, 124-line budget, 150-qubit thermal estimate.
- Bishnu Patra et al., [Cryo-CMOS circuits and systems for quantum computing applications](https://doi.org/10.1109/JSSC.2017.2737549), IEEE J. Solid-State Circuits 53, 309–321 (2018). Case for cryogenic control and demonstrated blocks.
- Joseph C. Bardin et al., [Design and characterization of a 28-nm bulk-CMOS cryogenic quantum controller dissipating less than 2 mW at 3 K](https://doi.org/10.1109/JSSC.2019.2937234), IEEE J. Solid-State Circuits 54, 3043–3060 (2019). Power and data-rate figures.
- Julian Kelly, Peter O'Malley, Matthew Neeley, Hartmut Neven, John M. Martinis, [Physical qubit calibration on a directed acyclic graph](https://arxiv.org/abs/1803.03226), arXiv 1803.03226 (2018), preprint. Calibration DAG, check state / check data / calibrate, maintain and diagnose.
- P. V. Klimov et al., [Fluctuations of energy-relaxation times in superconducting qubits](https://arxiv.org/abs/1809.01043), Phys. Rev. Lett. 121, 090502 (2018). $T_1$ fluctuations and frequency stability.
- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025). The 1.1 µs cycle.
