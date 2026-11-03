## Problem and access model

You are asked whether a quantum computer will be useful for some workload, and roughly when. A one-number answer, such as "we need N qubits", hides every assumption that matters. This page runs the whole chain once, from application to timeline, using the model and calculator of [FT-11](/lessons/ft-11-resource-estimation/). At each stage it marks what has to be true and who has to deliver it.

The inputs are an application's logical requirements and a set of hardware assumptions. The output is not a forecast. It is a list of conditions, each of which can be checked against published results as they appear.

## Classical baseline: the decision without the chain

Without the chain, decisions get made from headline qubit counts and vendor roadmaps. Both are hard to compare. A "1,000-qubit" processor and a "100-logical-qubit" roadmap describe different things, and neither says whether a particular algorithm finishes in a useful time. The chain turns each claim into the input it actually changes.

## Walkthrough: FeMoco from application to timeline

**1. Application to logical requirements.** Estimating the ground-state energy of the FeMoco molecule is a standard chemistry benchmark. [Lee et al. (2021)](https://arxiv.org/abs/2011.03494) need 2,142 logical qubits and 6.7 billion Toffolis in their surface-code compilation. The algorithm is phase estimation on a qubitized walk, which the decision path covered in lessons 25, 27 and 30. Ask: is this precision enough to change a decision in chemistry? That question belongs to the application expert, not to the quantum engineer.

**2. Logical requirements to error-correction overhead.** With the paper's assumptions (0.1% physical error, 1 µs cycle) and Λ = 10, the model picks distance 31. That means $2\times31^2=1{,}922$ physical qubits per patch, and about 3.7 million physical qubits on the paper's own layout of 1,908 patches including factories (3.9 million with the paper's $2(d+1)^2$ per patch). The paper reports about 4 million. What has to be true: Λ near 10 at that scale, and no correlated error bursts above the per-cycle budget ([FT-04](/lessons/ft-04-noise-thresholds/)).

**3. Overhead to infrastructure.** Every patch measures $d^2-1=960$ checks each cycle. For $1{,}908$ patches at 1 µs per cycle, that is

$$1{,}908\times960=1{,}831{,}680\ \text{bits per}\ \mu\text{s}\approx1.8\ \text{Tbit/s}$$

of syndrome data to decode continuously, for about 3.3 days. The RSA estimate's board of $14{,}232$ patches at $d=27$ produces $14{,}232\times728\approx10.4$ Tbit/s. What has to be true:

- **throughput:** the decoders keep up everywhere, with margin, or the backlog compounds ([FT-07](/lessons/ft-07-real-time-decoding/));
- **latency:** the reaction time stays near the assumed 10 µs, since each factor of 2 there is a factor of 2 in runtime for a reaction-limited computation;
- **control:** control and calibration scale to millions of qubits ([FT-10](/lessons/ft-10-control-calibration/)).

**4. Infrastructure to hardware.** Use the calculator's third preset on the RSA workload: Google's 2024 measured noise (Λ = 2.14) and its 63 µs decoder latency used as the reaction time. The model then needs distance 89, about 225 million qubits and about 47 hours. That compares with 20 million qubits and 7.5 hours under the published assumptions. Different modalities change different inputs: cycle time, connectivity (which changes the code and the routing overhead), and error rates ([FT-12](/lessons/ft-12-hardware-roadmaps/)).

**5. Hardware to timeline.** A timeline follows only when each "what has to be true" above has a dated, checkable status. Today, on superconducting qubits, Λ ≈ 2 has been demonstrated at distance 7 on about 100 qubits. A trapped-ion preprint from October 2026, not yet peer reviewed, reports Λ ≈ 12 with color codes up to distance 7, on a small system with a much slower cycle ([FT-12](/lessons/ft-12-hardware-roadmaps/)). The estimates assume Λ ≈ 10 on millions. Every step between those is a claim to watch for, not a date to assume.

Use the calculator below. Load the FeMoco preset, then change one input at a time to today's measured value and see which change costs the most.

<details><summary>Predict: for the FeMoco preset, which hurts more, doubling the reaction time or doubling the physical error rate?</summary>

That preset is factory-limited, at about 42.6 µs per Toffoli against a 10 µs reaction time. Doubling the reaction time to 20 µs therefore changes nothing. Doubling the physical error rate to 0.2% halves Λ to 5. The model then needs $d=45$ instead of 31, about 7.7 million qubits instead of 3.7 million, and 4.8 days instead of 3.3, because the factories take $5.5\,d$ cycles each. In a reaction-limited preset the answer would be different. Checking which regime you are in comes first.

</details>

## Where each stage is bottlenecked

*Revision note, 2 November 2026.* An earlier version of this section marked four of eight stages as infrastructure-bound, without separating the present from the future. Run the site's own calculator one input at a time and the answer splits. Today the binding constraint is device physics. Infrastructure becomes binding once Λ improves. The section below replaces that earlier framing.

**Which change costs the most today?** Start from the RSA preset (Gidney–Ekerå's assumptions) and move one input to Google's 2024 measured value:

| Change from the paper's assumptions | Distance | Physical qubits | Runtime |
|---|---|---|---|
| None (paper: Λ = 10, 1 µs cycle, 10 µs reaction) | 27 | 20.8 M | 7.5 h |
| Only Λ → 2.14 (device physics) | 85 | 205.7 M | 12.5 h |
| Only reaction time → 63 µs (decoding and control) | 29 | 23.9 M | 47.3 h |
| Only cycle time → 1.1 µs | 27 | 20.8 M | 7.5 h |
| All three (today's measured values) | 89 | 225.5 M | 47.3 h |

Λ alone multiplies the qubit count by about 10. In that row the runtime also rises, to 12.5 h, because the 28 factories, now running at $d=85$ (16.7 µs per state), become the limit. Two caveats: the model matches Google's Λ but not its absolute error (anchoring on it gives $d=87$ and about 215 million), and the factory settings are carried over from $p=0.1\%$. That is the difference between a machine that is very hard to build and one that is out of reach. The slower reaction time stretches runtime by 6.3×, but 47 hours is still a usable run, and it adds only about 15% to the qubit count. Within this model, then, the present gap is mostly physics.

That changes once Λ improves. At Λ = 10, the reaction time is the largest remaining lever on runtime. Decoder throughput has to keep up across tens of millions of qubits, or the computation stalls ([FT-07](/lessons/ft-07-real-time-decoding/)).

| Stage | Binding today? (superconducting) | Binding once Λ ≈ 10? | Who delivers it |
|---|---|---|---|
| Application and logical requirements | Partly: algorithm improvements still move estimates by large factors | Partly | Domain experts, algorithm and compiler researchers |
| Error correction (Λ at scale, correlated errors, leakage) | **Yes**: the dominant term in qubit count | Less, if Λ ≈ 10 holds at scale | Device physics, fabrication |
| Decoding (throughput, reaction latency) | Secondary in this model, which holds the 63 µs distance-5 latency fixed; throughput at distance ≈ 89 is undemonstrated and could itself bind | **Yes**: the main runtime lever; a stall risk if throughput lags | Classical hardware and systems engineers |
| Control (lines or multiplexing per qubit, heat) | Open at scale; not in the calculator | **Yes**, at millions of qubits | Electronics and cryogenic engineers |
| Calibration (a dependency graph run continuously against drift) | Open at scale; not in the calculator | **Yes**, at millions of qubits | Software and automation engineers |
| Orchestration (surgery scheduling, factories, feedforward) | Secondary | **Yes** | Systems and runtime engineers |

Two cautions. First, the calculator models Λ, cycle time, reaction time and factories. It does not model wiring or calibration. Those rows are marked "open at scale" because [FT-10](/lessons/ft-10-control-calibration/) shows they are unsolved at millions of qubits, not because the model shows them binding. Second, newer architectures, such as yoked codes, cultivation and qLDPC codes, reduce qubit counts in ways this model does not capture ([FT-11](/lessons/ft-11-resource-estimation/)).

**What this means for a decision.** An infrastructure role, in decoding, control or calibration, is a bet that the physics will reach Λ near 10 at scale, so that systems problems become the hard part. That bet is reasonable, and a growing share of the remaining work is classical engineering. But it is a bet on a condition no peer-reviewed experiment has shown at scale. On superconducting hardware, Λ is about 2. A 2026 trapped-ion preprint claims about 12, but on a small, slow system, where cycle and reaction time would then become the binding inputs. Make it knowingly, and watch the Λ trend as the leading indicator.

## Meanwhile

Some decisions do not wait for the chain to finish. NIST published its first post-quantum cryptography standards on 13 August 2024: [FIPS 203](https://csrc.nist.gov/pubs/fips/203/final), [FIPS 204](https://csrc.nist.gov/pubs/fips/204/final) and [FIPS 205](https://csrc.nist.gov/pubs/fips/205/final). Planning a migration depends on how long data must stay confidential and how long migration takes, not on the exact year a machine arrives. That is a dated fact, not a prediction about when RSA-2048 falls.

## Implementation and honest cost

- **A sketch, not a forecast.** The walkthrough uses a teaching model whose agreement with published estimates is partly fitted. Its value is in showing which input moves which output.
- **Stale numbers.** Every hardware number here is dated. Re-run the calculator when a new result is published, and change only the inputs that result actually measured.
- **Left out.** Algorithm improvements, alternative codes with better encoding rates, and classical progress on the same problems can all move the conclusion. None of them is modelled.

## Misunderstandings and prediction checks

<details><summary>"The decision is about when we reach N physical qubits." Is that right?</summary>

No. The same qubit count can be enough or hopeless depending on Λ, reaction time and the workload's Toffoli count. In this model, changing only Λ, from 10 to 2.14, moves the RSA estimate from about 21 million to about 206 million qubits.

</details>

<details><summary>Predict: if a vendor announces a 2× faster cycle time but no change in Λ or reaction time, what happens to a reaction-limited workload's runtime?</summary>

The runtime does not change: reaction-limited runtime is set by the reaction time. The qubit count can even go up. The same wall-clock time now contains twice as many cycles, each a chance for a logical error, so the model's RSA preset moves from $d=27$ to $d=29$ (20.8 million to 23.9 million qubits) at the same 7.5 hours. A faster cycle helps only factory-limited workloads, whose factories take a fixed number of cycles per state.

</details>

## Your open questions

Before leaving the decision path, write down your own open questions about this chain. Make them questions whose answer would change a decision you or your organisation has to make. For each one, note which stage of the table it belongs to and which published result would answer it. Keep the list, and revisit it when the next roadmap claim or experiment appears.

## References

- Joonho Lee et al., [Even more efficient quantum computations of chemistry through tensor hypercontraction](https://arxiv.org/abs/2011.03494), PRX Quantum 2, 030305 (2021).
- Craig Gidney, Martin Ekerå, [How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits](https://arxiv.org/abs/1905.09749), Quantum 5, 433 (2021).
- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025).
- National Institute of Standards and Technology, [FIPS 203](https://csrc.nist.gov/pubs/fips/203/final), [FIPS 204](https://csrc.nist.gov/pubs/fips/204/final), [FIPS 205](https://csrc.nist.gov/pubs/fips/205/final), published 13 August 2024.
- Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428), Rev. Mod. Phys. 87, 307 (2015). The decoding-backlog argument.
