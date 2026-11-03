## Problem and access model

A fault-tolerant computer produces syndrome bits at a fixed rate, set by its cycle time, for as long as it runs. A classical decoder must consume that stream. Some of its outputs are needed before the computation can continue.

The inputs are the cycle time, the [code distance](/definitions/code-distance/), the number of [logical qubits](/definitions/logical-qubits/), and the decoder's processing rate and latency. The outputs are two answers. Does the decoder keep up? And how long does the computation wait each time it needs a decoded result? This lesson works both, using the backlog argument of [Terhal (2015)](https://arxiv.org/abs/1302.3428).

## Classical baseline: a stream consumer

If you have run a message queue, you know this problem. A producer writes at rate $r_{\rm gen}$ and a consumer reads at rate $r_{\rm proc}$.

- If $r_{\rm proc}<r_{\rm gen}$, consumer lag grows linearly and without bound.
- If $r_{\rm proc}\ge r_{\rm gen}$, lag stays bounded, and end-to-end latency is what remains.

The quantum case adds one twist, and it changes linear growth into exponential growth: the computation sometimes **stops and waits** for the consumer's answer, while the producer keeps writing. That twist is the T gate.

## The syndrome generation rate, worked

A distance-$d$ rotated surface code measures $d^2-1$ checks per cycle ([FT-03](/lessons/ft-03-surface-code/)), one bit each.

- **Per cycle:** at $d=25$, $25^2-1=624$ bits per logical qubit.
- **Per second:** at a 1 µs cycle, $624\times10^6$ bit/s $=624$ Mbit/s per logical qubit.
- **Per machine:** for 1,000 logical qubits, $624\times10^9$ bit/s, about 624 Gbit/s.

This counts only the [syndromes](/definitions/syndromes/) of the data patches, raw and uncompressed. Factories and routing space add more. [Battistel et al. (2023)](https://doi.org/10.1088/2399-1984/aceba6) quote a lower figure, a few tens of Mbit/s per logical qubit, citing another source whose assumptions this lesson did not check. Either way, the decoder is a high-rate stream processor.

## Throughput versus latency

- **Throughput** is how many syndrome bits per second the decoder finishes. It must be at least the generation rate, or the backlog grows.
- **Latency**, or reaction time, is the delay from the last needed measurement to a usable decoded result.

Latency matters only when something waits on the answer. In a pure memory nothing does: corrections are tracked in software as the Pauli frame and applied at readout ([FT-05](/lessons/ft-05-decoding-matching/)). In a computation, a T gate implemented by magic-state injection needs a classically controlled correction afterwards, and which correction depends on the current logical Pauli frame. That is **feedforward**, and it is where latency becomes runtime.

Battistel et al. define the two words differently: for them "latency" is the transport time to the decoder and "throughput" is the decode time. This lesson uses the queueing meanings above.

## The backlog argument

Terhal's Section II.G.3 runs as follows. Let $f=r_{\rm gen}/r_{\rm proc}$.

1. Suppose $f>1$. At some time the unprocessed syndrome lag is long enough that a logical Pauli may have occurred in it. The next T gate must wait.
2. The unprocessed record holds $D_1$ bits. Processing it takes $D_1/r_{\rm proc}$. (The paper writes this wait as $r_{\rm proc}D_k$; dividing bits by bits per second gives the time.)
3. During that wait the machine keeps generating syndromes: $D_2=r_{\rm gen}\cdot D_1/r_{\rm proc}=fD_1$ bits.
4. The next T gate that depends on the frame must wait for $D_2$, during which $D_3=fD_2$ accumulates, and so on.

So the record awaiting decoding at the $k$-th such T gate is

$$D_k=f^k D_1,$$

and the wait grows by the same factor. Terhal calls the result "an exponential slow down during the computation". She contrasts it with a memory, where slow decoding only finishes the job in time $fT$ instead of $T$: a constant factor.

## A worked queueing calculation

<details><summary>Predict: a decoder 10% too slow ($f=1.1$). Is that a 10% problem or a fatal one?</summary>

It depends on feedforward. Without it, the job takes 10% longer. With feedforward at every T gate, the computation stalls within a few hundred gates.

</details>

**(a) No feedforward.** Take $r_{\rm gen}=624$ Mbit/s and $f=1.1$.

- $r_{\rm proc}=624/1.1=567.27$ Mbit/s.
- The queue grows at $r_{\rm gen}-r_{\rm proc}=56.73$ Mbit/s, linearly: $Q(t)=(r_{\rm gen}-r_{\rm proc})\,t$.
- After 1 s: 56.73 Mbit, which is $56.73/8=7.09$ MB of buffer per logical qubit.
- After 1 hour: $56.73\times3600=204{,}218$ Mbit, about 25.5 GB per logical qubit, or about 25.5 TB for 1,000 logical qubits.

That is costly but feasible. The real cost is time: the backlog takes $(f-1)T=0.1T$ extra to drain at the end. A memory, or a purely Clifford computation, survives a slow decoder.

**(b) Feedforward at every T gate.** The wait before the $k$-th gate is $f^k$ times the first.

| $f$ | $k$ | Slowdown $f^k$ |
|---|---|---|
| 1.1 | 10 | 2.59 |
| 1.1 | 100 | 13,781 |
| 1.1 | 1,000 | $2.47\times10^{41}$ |
| 1.01 | 1,000 | 20,959 |

Give the first wait an illustrative 10 µs.

- With $f=1.1$, the 100th T gate waits $13{,}781\times10$ µs $\approx0.14$ s.
- The 1,000th waits $2.47\times10^{36}$ s, about $7.8\times10^{28}$ years.
- With $f=1.01$, the 1,000th gate waits only 0.21 s. But $1.01^k$ doubles every $\ln2/\ln1.01\approx70$ gates: by $k=10{,}000$ the factor is $1.6\times10^{43}$.

Algorithms of interest need far more: Lee et al.'s FeMoco estimate lists $5.3\times10^9$ Toffolis (their Table III), and [FT-11](/lessons/ft-11-resource-estimation/) works through it. Any $f>1$ stalls them.

**The remedy.** Make $f<1$: the decoder must process faster than the machine generates, so each wait is drained before the next arrives and the lag stays bounded. The margin must cover the worst case, not the average. Matching and union-find take longer when there are more defects, and a burst of errors is exactly when you cannot fall behind. This is why [FT-06](/lessons/ft-06-decoding-union-find/) emphasized worst-case time.

## Latency budget

Throughput keeps the queue bounded. Latency sets the price of each T gate.

- **Measured.** [Google Quantum AI (2025)](https://arxiv.org/abs/2408.13687) report an average real-time decoder latency of 63 µs at distance 5, over runs of up to a million cycles, with a 1.1 µs cycle. That is $63/1.1\approx57$ cycles behind. A latency that stays bounded over a million cycles implies that throughput kept pace, even though each answer arrived late. The two quantities really are separate.
- **Assumed.** [Gidney and Ekerå (2021)](https://arxiv.org/abs/1905.09749) assume a 10 µs reaction time for their RSA-2048 estimate, and [Gidney (2025, preprint)](https://arxiv.org/abs/2505.15917) keeps the same hardware assumptions.

**Illustrative comparison.** Consider a computation limited purely by reaction time, with $10^9$ sequential reaction steps.

- At 10 µs: $10^9\times10^{-5}$ s $=10^4$ s, about 2.8 hours.
- At 63 µs: $6.3\times10^4$ s, about 17.5 hours, a factor of $63/10=6.3$.

This comparison is illustrative, not a prediction. Google's figure is an average, for a distance-5 memory experiment. Published estimates are not purely reaction-limited. And the two numbers may not measure the same span of the loop.

## Windowed and parallel decoding

The decoding graph grows forever, so a decoder works on **windows** of rounds.

- **Sliding window.** Decode $n_{\rm com}+n_{\rm buf}$ rounds, but commit only the older $n_{\rm com}$. The newer buffer rounds may be explained by errors not seen yet, so they are re-decoded with the next window. [Skoric et al. (2023)](https://doi.org/10.1038/s41467-023-42482-1) note that this is inherently sequential. To avoid backlog, the window decode time $\tau_W$ must be less than $n_{\rm com}\tau_{\rm rd}$, where $\tau_{\rm rd}$ is the round time. With $n_{\rm buf}=n_{\rm com}=d$, they find no noticeable loss of accuracy.
- **Parallel window.** Decode non-overlapping "A" windows of $3w$ rounds concurrently, each with buffers on both sides, and commit only their middle $w$ rounds, with $w=d$. Then decode the "B" windows that fill the gaps; they need no buffers, because both neighbours are already committed.

Ignoring overheads, throughput then scales linearly with the number of parallel workers $N_{\rm par}$, and Skoric et al. show the backlog is avoided when $N_{\rm par}\ge2\tau_W/((n_{\rm com}+n_W)\tau_{\rm rd})$. Their speed tests were Python simulations, sublinear at small distances because of software overhead. The response time per T-gate layer is about $2\tau_W$: linear in the window time, not exponential. [Tan et al. (2023)](https://doi.org/10.1103/PRXQuantum.4.040344) give a similar scheme. In their simulations it loses almost no threshold: 0.68% versus 0.70% for batch matching, and 0.55% for union-find either way.

**Worked.** At $d=25$ and $\tau_{\rm rd}=1$ µs:

- $n_{\rm com}=25$ and $n_W=75$, so one A window and one B window commit 100 rounds, or 100 µs of data.
- Suppose, hypothetically, a window takes $\tau_W=1$ ms. A sliding window would need $\tau_W<25$ µs, and fails by a factor of 40.
- In parallel, $N_{\rm par}\ge2\times1000/100=20$ workers suffice. The response time is $20\times100$ µs $=2$ ms $\approx2\tau_W$.

Parallelism buys throughput, but it does not buy latency.

## Hardware: FPGA, ASIC, GPU

From Battistel et al., except where marked:

| Platform | Strengths | Weaknesses |
|---|---|---|
| CPU | Software flexibility | Hard to bound worst-case execution time under an OS and caches; power too high for cryogenic stages |
| FPGA | Integrates with FPGA-based control systems that already see readout; reconfigurable; short development cycles; clocks in the 100s of MHz | High-end parts are expensive at millions of qubits |
| ASIC | Low per-part cost and power; 1–2 GHz; tight integration | Premature until algorithms and interfaces settle; costly to develop |
| GPU | Not assessed in the review; no verified source here | Author's inference: high batch throughput, but host transfers and scheduling add latency and jitter |

**A hardware demonstration.** [Barber et al. (2025)](https://arxiv.org/abs/2309.05558), from Riverlane, implement Collision Clustering, an implementation of union-find, in hardware. The syndrome data are simulated, from logical-memory circuits with circuit-level noise.

- On an FPGA, a distance-21 code (881 qubits) decodes in 810 ns per round, using about 4.5% of the logic.
- An ASIC design for a 12 nm process, signed off for tape-out but reported from design tools rather than a fabricated chip, decodes distance 23 (1,057 qubits) in 240 ns per round, in 0.06 mm² at about 8 mW.
- The authors note it does not yet support the sliding-window decoding needed to run indefinitely.

## Implementation and honest cost

- **It scales with logical qubits.** At about 624 Mbit/s per logical qubit, decoding is a per-qubit cost, like control electronics, not a fixed overhead.
- **Data movement.** Decoding at room temperature means about 624 Gbit/s leaving the cryostat for 1,000 logical qubits. Battistel et al. identify cabling across temperature stages as a scaling bottleneck. Two-stage designs, with a simple cryogenic first stage, aim to cut that bandwidth.
- **Power at the cold stage.** Battistel et al. give cooling power of order 1 mW below 100 mK and several watts at 1–4 K. Barber et al. cite a budget of order 1 W at 4 K. Illustratively, 1,000 decoders at 8 mW each would be 8 W, beyond that budget.
- **Measure software decoding yourself.** The companion notebook [ft-decoder-latency.ipynb](/examples/notebooks/ft-decoder-latency.ipynb) times PyMatching on simulated distance-$d$ memories at 0.1% noise. On the laptop CPU it records, the average falls from about 0.02 µs per round at $d=3$ to about 1.2 µs at $d=17$. These are software averages on blocks of $d$ rounds, not hardware latency, not streaming, and not worst case.
- **Hard real time.** Battistel et al. argue that a fault-tolerant stack will likely need every piece to run within a fixed timing budget, so worst-case execution time matters more than average speed.

This is where infrastructure engineering is the binding constraint. The physics fixes the generation rate. Whether the machine runs at its intended speed, or at all, depends on throughput margin, latency, bandwidth and power in the classical system around it.

## Misunderstandings and prediction checks

<details><summary>"A decoder that is 10% too slow makes the computation 10% slower." When is that true?</summary>

Only without feedforward, as in a memory or a Clifford-only circuit: then the slowdown is the constant factor $f$. With T-gate feedforward the wait compounds as $f^k$ and the computation stalls.

</details>

<details><summary>Predict: does parallel window decoding fix a 63 µs latency?</summary>

No. It raises throughput, so the queue stays bounded however slow each window is. Each answer still arrives about $2\tau_W$ after its data. Latency needs a faster decoder per window, less communication, or circuits that tolerate delay.

</details>

<details><summary>Why is $f$ slightly below 1 not enough?</summary>

Decode time varies with the number of defects. A decoder that keeps up on average can fall behind during a burst, which is exactly when errors are dense. The margin must cover the worst case.

</details>

## References

- Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428), Rev. Mod. Phys. 87, 307 (2015). Backlog argument, Sec. II.G.3.
- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025). 63 µs average decoder latency at distance 5; 1.1 µs cycle.
- Craig Gidney, Martin Ekerå, [How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits](https://arxiv.org/abs/1905.09749), Quantum 5, 433 (2021). 10 µs reaction time.
- Craig Gidney, [How to factor 2048 bit RSA integers with less than a million noisy qubits](https://arxiv.org/abs/2505.15917), arXiv 2505.15917 (2025). Preprint; same hardware assumptions.
- Francesco Battistel et al., [Real-time decoding for fault-tolerant quantum computing: progress, challenges and outlook](https://doi.org/10.1088/2399-1984/aceba6), Nano Futures 7, 032003 (2023); arXiv 2303.00054. Platform comparison, data rates, cryogenic power, hard real time.
- Luka Skoric, Dan E. Browne, Kenton M. Barnes, Neil I. Gillespie, Earl T. Campbell, [Parallel window decoding enables scalable fault tolerant quantum computation](https://doi.org/10.1038/s41467-023-42482-1), Nature Communications 14, 7040 (2023). Sliding and parallel windows; condition on $N_{\rm par}$; response time.
- Xinyu Tan, Fang Zhang, Rui Chao, Yaoyun Shi, Jianxin Chen, [Scalable surface-code decoders with parallelization in time](https://doi.org/10.1103/PRXQuantum.4.040344), PRX Quantum 4, 040344 (2023). Simulated thresholds with windowed decoding.
- Ben Barber et al., [A real-time, scalable, fast and highly resource efficient decoder for a quantum computer](https://arxiv.org/abs/2309.05558), arXiv 2309.05558 (2023, revised 2024); published in Nature Electronics (2025), DOI 10.1038/s41928-024-01319-5. FPGA and ASIC Collision Clustering decoder; figures from the arXiv version.
- Joonho Lee et al., [Even more efficient quantum computations of chemistry through tensor hypercontraction](https://arxiv.org/abs/2011.03494), PRX Quantum 2, 030305 (2021). $5.3\times10^9$ Toffolis (Table III).
