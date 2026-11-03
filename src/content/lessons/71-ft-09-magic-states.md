## Problem and access model

[FT-08](/lessons/ft-08-lattice-surgery/) showed that every $T$ gate consumes one magic state $|T\rangle=(|0\rangle+e^{i\pi/4}|1\rangle)/\sqrt2$ and then waits for a decoded measurement. This lesson answers three questions a resource estimate needs:

1. How are magic states made good enough?
2. What does a "factory" cost in qubits and cycles?
3. Given factories and a reaction time, how many $T$ gates per second can the machine run?

The inputs are a physical error rate, a code distance, a factory design and a reaction time. The output is a **logical clock**: the sustainable rate of non-Clifford gates, and therefore the wall-clock time of an algorithm whose $T$ or Toffoli count is known.

## Classical baseline: throughput versus latency

Any distributed-systems engineer knows the two limits on a job made of dependent steps:

- **Throughput.** Work per second is capped by the producers. Add producers to raise it.
- **Latency.** A chain of $k$ dependent steps takes at least $k$ round trips, however many producers you add.

A fault-tolerant computer has exactly this shape. Factories produce magic states, which is throughput. Each dependent $T$ gate waits one reaction time, which is latency. The runtime is set by whichever limit binds.

## Why injected states need purification

A magic state can be **injected**: prepared on a few physical qubits and then grown into a full patch. The growing is protected by the code, but the initial preparation is not, so the injected state carries an error comparable to, or a few times, the physical error rate. For example, the cultivation preprint below lists an earlier injection scheme (Li, 2015) with error $5\times10^{-3}$ at $10^{-3}$ circuit noise. One bad magic state applies the wrong gate. An algorithm with $10^9$ $T$ gates needs per-state error well below $10^{-9}$. Something must turn many poor states into a few good ones, using only Clifford operations, which are cheap and well protected.

## 15-to-1 distillation

[Bravyi and Kitaev (2005)](https://arxiv.org/abs/quant-ph/0403025) showed that Clifford operations plus noisy copies of a magic state suffice for universal computation, and they gave purification protocols. Their 15-to-1 protocol, based on a 15-qubit code, takes 15 noisy copies and outputs one copy of $|A_0\rangle=(|0\rangle+e^{i\pi/4}|1\rangle)/\sqrt2$, which is $|T\rangle$. The protocol checks the inputs against each other and discards the output if any check fails.

For input error $\epsilon$, they give the success probability and the output error (their Eqs. 35 and 38):

$$p_s=\frac{1+15(1-2\epsilon)^8}{16},\qquad \epsilon_{\rm out}\approx35\epsilon^3 .$$

Their threshold is $\epsilon_0\approx0.141$: below that, repeated distillation converges to a pure state.

**Where 35 comes from.** [Litinski (2019b)](https://arxiv.org/abs/1905.06903) explains it as follows. Write the protocol as 15 $\pi/8$ rotations on 5 qubits, four of which are checked at the end. Any single faulty rotation flips a check, and no pair of faults goes undetected. But 35 combinations of three faults leave every check clean while corrupting the output, so the undetected error is $35p^3$ to leading order. His exact simulation at $p=10^{-4}$ gives $3.501\times10^{-11}$, against the approximation $3.5\times10^{-11}$.

<details><summary>Predict: one level turns $10^{-3}$ into about $3.5\times10^{-8}$. What does a second level give?</summary>

Feed $3.5\times10^{-8}$ back in: $35(3.5\times10^{-8})^3$, about $1.5\times10^{-21}$. Each level cubes the error, so the number of good digits roughly triples.

</details>

**Worked, $\epsilon=10^{-3}$.**

- **One level:** $35\epsilon^3=35\times10^{-9}=3.5\times10^{-8}$. The exact formula (Eq. 36) gives $3.51\times10^{-8}$.
- **Success probability:** $(1-2\epsilon)^8=0.998^8=0.98411$, so $p_s=(1+15\times0.98411)/16=0.9851$. About 1.5% of attempts are discarded: roughly $15\epsilon$, the chance that any of the 15 inputs is bad.
- **Two levels:** 15 level-one outputs at $3.5\times10^{-8}$ go into a second round. $(3.5\times10^{-8})^3=4.2875\times10^{-23}$, times 35, gives $1.50\times10^{-21}$. This matches Bravyi and Kitaev's recursion $\tfrac1{\sqrt{35}}(\sqrt{35}\,\epsilon)^{3^k}$ at $k=2$.
- **Inputs consumed:** $15\times15=225$ raw states per output, or about $15/0.9851\times15/0.9999995\approx228$ once discards are counted.

**Worked, $\epsilon=10^{-2}$** (a noisier injection): one level gives $3.5\times10^{-5}$ (exact $3.61\times10^{-5}$) with $p_s=0.860$; two levels give $35(3.5\times10^{-5})^3=1.5\times10^{-12}$.

**The idealization.** These formulas assume perfect Clifford operations. In a real factory, the Cliffords are lattice-surgery operations on patches of finite distance, and they fail too. Litinski's circuit-level simulations include those failures. That is why his results below are not simply $35p^3$.

## Factory footprint and time

[Litinski (2019b)](https://arxiv.org/abs/1905.06903) designs factories in which the qubits that can catch errors use small code distances, and only the output path uses a large one. Selected rows of his Table 1 give the space cost including ancillas, and the time in code cycles **per protocol run**. The 20-to-4 row yields 4 states per run; Litinski notes that for such protocols the space-time cost and output error are per magic state:

| Protocol | $p_{\rm phys}$ | Output error | Qubits | Cycles |
|---|---|---|---|---|
| $(15\text{-to-}1)_{17,7,7}$ | $10^{-3}$ | $4.5\times10^{-8}$ | 4,620 | 42.6 |
| $(15\text{-to-}1)^6_{13,5,5}\times(20\text{-to-}4)_{23,11,13}$ | $10^{-3}$ | $1.4\times10^{-10}$ | 43,300 | 130 |
| $(15\text{-to-}1)^6_{17,7,7}\times(15\text{-to-}1)_{41,17,17}$ | $10^{-3}$ | $4.5\times10^{-20}$ | 73,400 | 128 |

The subscripts are the code distances used inside the factory.

At 1 µs per cycle, the first factory makes a state every 42.6 µs, about 23,500 per second. Its output, $4.5\times10^{-8}$, is good for only about $1/(4.5\times10^{-8})\approx2.2\times10^7$ gates. The second makes 4 states every 130 µs, one every 32.5 µs or about 30,800 per second, each at $1.4\times10^{-10}$: for $10^9$ states, that is $0.14$ expected bad states. (Check: $43{,}300\times130/4\approx1.41\times10^6$ qubit-cycles per state, as his table lists.)

[Babbush et al. (2021)](https://arxiv.org/abs/2011.04149) use a coarser model for Toffoli gates. A factory distils one CCZ state, used for one Toffoli, in about $5.5d$ cycles. With $d\approx30$ and 1 µs per cycle, that is $30\times5.5\times1$ µs $=165$ µs, which they round to about 170 µs. They quote a footprint of around 130,000 physical qubits, and assume one factory running in series.

## Magic state cultivation (preprint)

[Gidney, Shutty and Jones (2024)](https://arxiv.org/abs/2409.17595), an arXiv preprint, prepare one $|T\rangle$ state inside a single surface-code patch, gradually growing its size and reliability, instead of combining many noisy states. They report that cultivation uses roughly the same number of physical gates as a lattice-surgery CNOT of equivalent reliability, and an order of magnitude fewer qubit-rounds than prior work.

From their simulations (not hardware data) under uniform depolarizing circuit noise:

- **At $10^{-3}$ noise:** logical error about $2\times10^{-9}$.
- **At $5\times10^{-4}$:** about $4\times10^{-11}$.

The price is post-selection. Their Figure 2 lists an end-to-end discard rate of 99% for the $2\times10^{-9}$ case, so on average about 100 attempts are needed per accepted state. The attempts are cheap, but this is a yield figure that any factory plan must budget for. The authors suggest further distillation may never be needed in practice; that is their projection, not a demonstrated result.

## The logical clock

Two limits apply.

$$\text{T-rate limit:}\quad R_T=\frac{\text{number of factories}}{\text{time per state}}.\qquad \text{Reaction limit:}\quad R_{\rm react}=\frac1{t_r}\ \text{dependent gates per second}.$$

The machine runs at the smaller of the two, for the dependent part of the computation. [Litinski (2019a)](https://arxiv.org/abs/1808.02892) makes the reaction limit concrete: in the time-optimal scheme he describes, a circuit of $n_L$ layers of $T$ gates takes $n_L\cdot t_m$, where $t_m$ is the measurement and classical-processing time, independent of code distance. At $t_m=10$ µs, his example of $10^8$ $T$ gates arranged in $10^6$ layers of 100 takes 10 seconds.

**Worked: reaction limit.** At $t_r=10$ µs, $R_{\rm react}=1/(10^{-5}\,\text{s})=10^5$ dependent gates per second. [Gidney and Ekerå (2021)](https://arxiv.org/abs/1905.09749) count $0.3n^3+0.0005n^3\lg n$ Toffolis for $n$-bit RSA. At $n=2048$ that is $2.6\times10^9$. If all of them ran one after another, one per reaction time, that would take $2.6\times10^9\times10^{-5}\,\text{s}=2.6\times10^4$ s, or 7.2 hours.

Their reported runtime is 8 hours, under the same 0.1% gate error, 1 µs cycle and 10 µs reaction time. The agreement in order of magnitude is the point, not a reproduction. Their measurement depth, $500n^2+n^2\lg n=2.1\times10^9$, gives about 6 hours (5.95) at one reaction time per layer. Their layout also has phases limited by code depth rather than reaction time: each lookup addition takes about 37 ms, of which about 22 ms is reaction-limited.

**Worked: one factory.** At 170 µs per Toffoli, $2.6\times10^9\times1.7\times10^{-4}\,\text{s}=4.42\times10^5$ s, which is 123 hours or 5.1 days. Gidney and Ekerå's own single-factory row reports 6 days, with 16 million physical qubits.

**Worked: how many factories reach the reaction limit?** We need $R_T\ge R_{\rm react}$, so the number of factories must be at least $170\ \mu\text{s}/10\ \mu\text{s}=17$. At Babbush et al.'s roughly 130,000 qubits per factory, that is about $17\times130{,}000=2.2$ million physical qubits for factories alone. Gidney and Ekerå, with their own factory design at distance 27, report needing 14 CCZ factories to run at the reaction-limited rate. Litinski's factories make $T$ states, not CCZ states, so first convert. A Toffoli costs 4 $T$ states with the cheaper construction in Litinski (2019a), or 7 with the plain one. The reaction limit of $10^5$ Toffolis per second then needs $4\times10^5$ $T$ states per second. His $1.4\times10^{-10}$ factory makes about 30,800 per second, so $4\times10^5/30{,}800\approx13$ factories, or $13\times43{,}300=562{,}900$ qubits. With 7 $T$ per Toffoli it is about 23 factories.

Beyond that point, more factories buy nothing. Only a faster reaction time, or fewer dependent layers, makes the computation faster.

## Implementation and honest cost

- **Factories can dominate, or not.** In Babbush et al.'s model, 17 factories at 130,000 qubits each rival the data qubits of many algorithms. Litinski argues the opposite for his optimized designs: in a 100-qubit example at $p=10^{-3}$ and output error near $10^{-10}$, only about 10% of physical qubits are used for distillation. His Table 1 also lists older designs using up to 800,000 qubits. The share depends on the design and the target error, so check which design an estimate assumes.
- **Decoder latency is on the critical path.** Gidney and Ekerå's reaction time includes collecting and error-correcting the measurement result. A decoder that adds 50 µs of latency would turn the 7.2-hour illustration into $2.6\times10^9\times60$ µs, about 43 hours.
- **Yield.** Every distillation round discards on a failed check: about 1.5% per 15-to-1 round at $\epsilon=10^{-3}$, 14% at $10^{-2}$, and 99% for cultivation's best case at $10^{-3}$ noise. Factory throughput figures must be read as averages over discards.
- **Routing.** Babbush et al. note that multiple factories need routing, and that parallel factories reduce Toffoli time only by a factor of about ten to one hundred, because Clifford operations and routing then dominate.
- **Simulated, not measured.** All factory and cultivation numbers here come from simulations under assumed noise models.

## Misunderstandings and prediction checks

<details><summary>"With enough factories, a fault-tolerant computer can run any algorithm arbitrarily fast." Is that right?</summary>

No. Factories raise throughput only. A chain of $10^9$ dependent $T$ gates at a 10 µs reaction time takes at least $10^4$ seconds, whatever the factory count.

</details>

<details><summary>Predict: if the reaction time fell from 10 µs to 1 µs, how many 170 µs factories would the reaction limit then need?</summary>

$170/1=170$ factories, ten times as many. The reaction-limited runtime would fall to $2.6\times10^9\times1$ µs $=2{,}600$ s, about 43 minutes, but only with roughly 22 million qubits of factories at 130,000 each. Faster decoders raise the demand for magic states.

</details>

<details><summary>Does a 99% discard rate make cultivation useless?</summary>

No. Each attempt is small: it fits inside one surface-code patch. The preprint's claim is about total cost per accepted state, which it reports as an order of magnitude lower in qubit-rounds than prior constructions. The discard rate does mean throughput planning must use accepted states per second, not attempts.

</details>

## References

- Sergey Bravyi, Alexei Kitaev, [Universal quantum computation with ideal Clifford gates and noisy ancillas](https://arxiv.org/abs/quant-ph/0403025), Phys. Rev. A 71, 022316 (2005). 15-to-1 distillation: success probability (Eq. 35), exact output error (Eq. 36), threshold 0.141 (Eq. 37), $\epsilon_{\rm out}\approx35\epsilon^3$ (Eq. 38), recursion.
- Daniel Litinski, [Magic State Distillation: Not as Costly as You Think](https://arxiv.org/abs/1905.06903), Quantum 3, 205 (2019). Table 1 factory qubits, cycles and output errors; origin of the 35; about 10% of qubits for distillation in his example.
- Daniel Litinski, [A Game of Surface Codes](https://arxiv.org/abs/1808.02892), Quantum 3, 128 (2019). Time-optimal scheme: $n_L$ $T$ layers in $n_L t_m$; $10^8$ gates in 10 s at 10 µs.
- Ryan Babbush et al., [Focus beyond quadratic speedups for error-corrected quantum advantage](https://arxiv.org/abs/2011.04149), PRX Quantum 2, 010103 (2021). $5.5d$ cycles per Toffoli; about 170 µs at $d\approx30$; about 130,000 qubits per factory; limited gains from parallel factories.
- Craig Gidney, Martin Ekerå, [How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits](https://arxiv.org/abs/1905.09749), Quantum 5, 433 (2021). Toffoli count and measurement depth formulas; 14 factories for the reaction-limited rate; single-factory row of 6 days; definition of reaction time.
- Craig Gidney, Noah Shutty, Cody Jones, [Magic state cultivation: growing T states as cheap as CNOT gates](https://arxiv.org/abs/2409.17595), arXiv 2409.17595 (2024), preprint. Gate count comparable to a lattice-surgery CNOT; order of magnitude fewer qubit-rounds; $2\times10^{-9}$ and $4\times10^{-11}$ logical error; 99% discard rate (simulation).
