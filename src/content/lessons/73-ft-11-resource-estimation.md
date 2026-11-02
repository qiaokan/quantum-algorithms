## Problem and access model

An algorithm paper states its needs in **logical** terms: how many logical qubits, how many non-Clifford operations (T, Toffoli or CCZ gates), and how reliable the run must be. A hardware team states its machine in **physical** terms: error rate per operation, cycle time, and how fast the decoder and control system can react. Resource estimation joins the two and answers three questions. What code distance is needed? How many physical qubits? How long does one run take?

This lesson builds a small, explicit model, reproduces two published estimates with it, and shows which inputs dominate. The model is a teaching tool, not a compiler: it is simple enough to check by hand, and its assumptions are stated so you can see where real estimates differ. The calculator at the end of the page runs the same model.

## Classical baseline: counting only logical qubits

The naive reading of an algorithm paper is "this needs about 6,000 qubits". For RSA-2048, the Gidney–Ekerå construction uses $3n+0.002\,n\lg n$ logical qubits in the abstract circuit model. At $n=2048$, with $\lg n=11$, that is $6144+45=6189$. Their full estimate is about 20 million physical qubits, over 3,000 times more. The difference is error-correction overhead, routing space and magic-state factories. Every one of those is set by the hardware assumptions, which is why two estimates for the "same" algorithm can differ by orders of magnitude.

## The model in four lines

1. **Logical error.** Each logical patch fails with probability $\varepsilon_d=0.1\,(p/0.01)^{(d+1)/2}$ per cycle. At $p=10^{-3}$ and odd $d$, this equals $10^{-((d+1)/2+1)}$. That is the rule [Gidney and Ekerå (2021)](https://arxiv.org/abs/1905.09749) adopt in their Sec. 2.13, "approximately $10^{-\lceil d/2+1\rceil}$". It means $\Lambda=10$ at $p=10^{-3}$, and $\Lambda=0.01/p$ in general ([FT-04](/lessons/ft-04-noise-thresholds/)).
2. **Time per non-Clifford operation.** Each operation waits for the slower of two things:
   - the **reaction time**: decode, then feed the result forward ([FT-07](/lessons/ft-07-real-time-decoding/));
   - the **factory supply interval**: $c\,d$ cycles per magic state, shared across $F$ factories ([FT-09](/lessons/ft-09-magic-states/)).

   Operations run one after another. The model has no parallel threads.
3. **Distance.** Choose the smallest odd $d$ for which (algorithm patches) × (cycles in the run) × $\varepsilon_d$ is within the failure budget.
4. **Qubits.** Count (logical qubits × routing overhead + factories × patches per factory) patches, at $2d^2$ physical qubits each.

<details><summary>Predict: which of the inputs above can change the runtime but not the distance, and which change the distance but barely change the runtime?</summary>

The reaction time sets the runtime directly. It changes the distance only weakly, because a longer run needs a slightly lower error per cycle. The physical error rate sets the distance and the qubit count. It changes the runtime only when the computation is factory-limited, because factory time grows with $d$.

</details>

## Worked estimate (a): RSA-2048, Gidney–Ekerå (2021)

**Inputs from the paper** (Quantum 5, 433, 2021):

- physical gate error $10^{-3}$, cycle time 1 µs, reaction time 10 µs;
- 2.7 billion Toffoli+T/2 operations at $n=2048$, from its cost table (the abstract's formula $0.3n^3+0.0005n^3\lg n$ gives 2.62 billion);
- 28 CCZ factories in the parallel variant;
- a board of $226\times63$ logical patches, about 25% used for distillation.

**Inputs fitted for this model:**

- routing overhead 1.725, so that $6189\times1.725\approx10{,}676$ algorithm patches fill 75% of the board;
- 127 patches per factory, so that 28 factories fill the other 25%;
- factory speed $c=5.5$, borrowed from [Babbush et al. (2021)](https://arxiv.org/abs/2011.04149).

**Runtime.** The factory supply interval at $d=27$ is $5.5\times27\times1\ \mu s/28=5.3\ \mu s$. That is shorter than the 10 µs reaction time, so the run is **reaction-limited**:

$$2.7\times10^9\times10\ \mu s=2.7\times10^4\ s=7.5\ \text{hours}.$$

The paper reports 0.31 days, about 7.4 hours, for this variant.

**Distance.** The run lasts $2.7\times10^{10}$ cycles.

- At $d=25$: $10{,}676\times2.7\times10^{10}\times10^{-14}\approx2.9$. That is not a probability; it means failure is certain.
- At $d=27$: $10^{-15}$ per cycle gives $0.29$.

The paper's own count is about 27%, and it notes the run would need repeating "roughly 1.4 times, on average". Choosing $d=29$ instead brings the failure to about 3% at the cost of roughly 15% more qubits, a trade-off the paper also discusses.

**Qubits.** $14{,}232$ patches $\times\,2\times27^2=20.8$ million physical qubits. The paper reports 20 million.

**One factory instead of 28.** The model becomes **factory-limited** at about 170 µs per operation and needs $d=31$, giving roughly 5.3 days. The paper's single-factory variant reports 6 days. The model is close but not exact, because its factory speed is borrowed from another paper, not taken from Gidney–Ekerå's factory design.

### What changed in 2025

As of May 2025, [Gidney's preprint](https://arxiv.org/abs/2505.15917) reports fewer than a million noisy qubits and under a week for RSA-2048. It uses the same hardware assumptions: 0.1% gate error, 1 µs cycle, 10 µs reaction time. It credits three techniques: approximate residue arithmetic, yoked surface codes, and magic-state cultivation. In this model's terms, those attack the logical-qubit count, the physical qubits per logical qubit, and the factory footprint respectively. That mapping is this book's reading, not a reproduction. The simple model here cannot reproduce the 2025 figure, and it does not try to. The preprint was not peer reviewed as of November 2026.

## Worked estimate (b): FeMoco, Lee et al. (2021)

[Lee et al.](https://arxiv.org/abs/2011.03494) (PRX Quantum 2, 030305) estimate the energy of the FeMoco molecule, Reiher model, with tensor hypercontraction.

**Inputs from the paper:**

- 2,142 logical qubits;
- 6.7 billion Toffolis in its surface-code compilation (its Table III lists 5.3 billion for the algorithm alone);
- physical error 0.1% and a 1 µs cycle.

**Published result:** distance 31, about 4 million physical qubits, about 3.5 days.

**Illustrative choices for this model** (not the paper's factory design): 4 factories of 10 patches each, routing overhead 1, and a 1% failure budget.

**Result.**

- The supply interval is $5.5\times31/4=42.6$ µs, longer than the reaction time, so the run is factory-limited.
- Runtime: $6.7\times10^9\times42.6\ \mu s\approx2.9\times10^5$ s, about 3.3 days.
- Distance: $d=29$ fails the budget (about 6%), and $d=31$ meets it (about 0.6%).
- Qubits: $2{,}182\times2\times31^2\approx4.2$ million.

All three land near the published figures. The factory count was chosen to match the runtime; that is the honest way to read the agreement.

## Worked estimate (c): the same RSA workload on today's measured noise

Google's 2024 experiment measured $\Lambda=2.14$ with a 1.1 µs cycle and a 63 µs average real-time decoder latency at distance 5 ([FT-04](/lessons/ft-04-noise-thresholds/)). In this model, $\Lambda=0.01/p$, so $p=0.01/2.14\approx0.47\%$ reproduces that $\Lambda$. Treat the 63 µs as the reaction time; that is an assumption, since a decoder's average latency is not the same thing as a full reaction time.

Keep everything else from estimate (a).

- **Runtime:** $2.7\times10^9\times63\ \mu s$, about **47 hours**.
- **Distance:** the error per cycle falls only by 2.14 per step, so the model needs **$d=89$**.
- **Qubits:** about **225 million**.

Compare 20 million qubits and 7.5 hours. The gap between today's demonstrated hardware and the published estimate is mostly two inputs: $\Lambda$, a factor of 4.7 between 2.14 and 10, and reaction time, a factor of 6.3 between 63 µs and 10 µs.

## A quadratic-speedup reality check

[Babbush et al. (2021)](https://arxiv.org/abs/2011.04149) model a Toffoli as about $5.5\,d$ surface-code cycles at about 1 µs per cycle, with $d\approx30$ and a single factory. That is about 170 µs per Toffoli. Their conclusion is that "quadratic speedups will not enable quantum advantage on early generations of such fault-tolerant devices". For example, they report 2.4 hours to break even for a primitive costing 100 Toffolis.

The arithmetic behind that is simple. Grover with an oracle of $C$ Toffolis takes about $(\pi/4)\sqrt N\cdot C\cdot170\ \mu s$. A classical scan takes $N\cdot t$, where $t$ is the classical time per check. The quantum side wins only when $N$ is large enough for $\sqrt N$ to beat a slowdown factor of $C\cdot170\ \mu s/t$. With $C=100$ and an illustrative $t=1$ ns, the factor is $100\times170\ \mu s/1\ \text{ns}=1.7\times10^7$, and the two sides are equal when $\sqrt N=(\pi/4)\times1.7\times10^7\approx1.3\times10^7$, that is $N\approx1.8\times10^{14}$. A single classical core needs $1.8\times10^{14}$ ns, about 50 hours, to reach that point. That pushes the crossover to runtimes measured in hours or days, before even counting classical parallelism.

## Implementation and honest cost

- **Factories.** The model ignores factory errors (Gidney–Ekerå budget a 6.4% distillation error separately) and how a factory is designed. [FT-09](/lessons/ft-09-magic-states/) covers factories.
- **Parallelism.** Operations are sequential. Real compilations overlap work, and "reaction-limited" then refers to the critical path, not the total count.
- **The error rule.** $0.1\,(p/0.01)^{(d+1)/2}$ is a rule of thumb that matches one paper's assumption. Measured hardware may not follow it, especially once correlated error bursts are included ([FT-04](/lessons/ft-04-noise-thresholds/)).
- **Fitted values.** The routing overhead and factory footprint were fitted to the published board, so agreement with the paper is partly by construction. The informative part is the sensitivity: halve or double one input and watch what moves.
- **Use the ranges.** Published estimates are best read as ranges driven by assumptions. The calculator's sensitivity table makes that explicit.

## Misunderstandings and prediction checks

<details><summary>"20 million qubits" means a machine with 20 million qubits could break RSA-2048 tomorrow. Is that right?</summary>

No. The estimate assumes 0.1% error rates on every operation, $\Lambda$ near 10, a 10 µs reaction time, and decoders keeping up across the whole chip. Each of these is an engineering target, not a demonstrated fact at that scale.

</details>

<details><summary>Predict: with the RSA inputs, does halving the reaction time halve the runtime?</summary>

Yes, while the run stays reaction-limited. At 5 µs the factory supply interval (5.3 µs at $d=27$) becomes the limit instead, so the gain stops near 5.3 µs per operation unless more factories are added. The calculator shows this.

</details>

<details><summary>Why did $d=27$ come out the same as the paper even though the model is simple?</summary>

Because the model adopts the paper's error rule, its operation count and its board size. With those fixed, the distance follows almost directly from patches × cycles × $\varepsilon_d$. Change the rule, for example to Fowler et al.'s $0.03\,(p/0.0057)^{(d+1)/2}$, and the distance changes.

</details>

## References

- Craig Gidney, Martin Ekerå, [How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits](https://arxiv.org/abs/1905.09749), Quantum 5, 433 (2021). Abstract formulas; cost table; Sec. 2.10–2.13 (factories, runtime, distillation and topological error). Verified against the full text.
- Craig Gidney, [How to factor 2048 bit RSA integers with less than a million noisy qubits](https://arxiv.org/abs/2505.15917), arXiv 2505.15917 (2025). Preprint.
- Joonho Lee et al., [Even more efficient quantum computations of chemistry through tensor hypercontraction](https://arxiv.org/abs/2011.03494), PRX Quantum 2, 030305 (2021).
- Ryan Babbush et al., [Focus beyond quadratic speedups for error-corrected quantum advantage](https://arxiv.org/abs/2011.04149), PRX Quantum 2, 010103 (2021).
- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025).
- The model and presets: [`resource-estimate.ts`](https://github.com/qiaokan/quantum-algorithms/blob/codex/initial-setup/src/lib/resource-estimate.ts), with tests; independent checks in `public/examples/ft-checks.py`.
