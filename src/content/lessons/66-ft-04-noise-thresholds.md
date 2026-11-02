## Problem and access model

Given a physical error rate and a code distance, predict the logical error rate per round. Then decide whether making the code bigger helps, and how big it must be to reach a target. This is the first number a resource estimate needs: it fixes the distance, and the distance fixes the qubit count.

The inputs are a noise model, which says what can fail and how often, a code family, and a decoder. The output is the logical error per cycle, $\varepsilon_d$, as a function of distance $d$. Its behaviour is summarized by the **suppression factor**

$$\Lambda=\frac{\varepsilon_d}{\varepsilon_{d+2}},$$

the factor by which the error falls each time the distance grows by two.

## Three noise models

1. **Code capacity.** Only data qubits fail, and every check is measured perfectly. This is the model of [FT-01](/lessons/ft-01-pauli-errors-repetition-code/).
2. **Phenomenological.** Data qubits fail and check outcomes are sometimes misreported, but the faults inside the check circuit are not modelled one by one.
3. **Circuit-level.** Every operation can fail: each gate, idle step, reset and measurement. This is the honest model for hardware. It has the lowest threshold, because each round contains many more places for a fault.

A **threshold** $p_{\rm th}$ is the physical error rate below which increasing the distance lowers the logical error rate. Each noise model and decoder has its own threshold. For circuit-level noise decoded by minimum-weight matching, [Fowler et al. (2012)](https://arxiv.org/abs/1208.0928) report $p_{\rm th}=0.57\%$ per step.

## Classical baseline: watch a threshold appear

The repetition code under code-capacity bit flips can be solved exactly. With majority decoding,

$$P_L(d,p)=\sum_{k>d/2}\binom dk p^k(1-p)^{d-k}.$$

**At $p=0.1$:**

- $d=3$: $3(0.01)(0.9)+0.001=0.028$.
- $d=5$: $10(0.001)(0.81)+5(0.0001)(0.9)+0.00001=0.00856$.
- $d=7$: about $0.00273$.

Each step of two in distance divides the error by $0.028/0.00856\approx3.27$, then $0.00856/0.00273\approx3.14$. So $\Lambda\approx3$.

**At $p=0.4$:** $d=3$ gives $0.352$ and $d=5$ gives $0.317$, so $\Lambda\approx1.11$. Adding distance barely helps.

**At $p=0.5$:** every distance gives exactly $0.5$, so $\Lambda=1$.

**Above $p=0.5$:** $\Lambda<1$, and a bigger code is worse.

For this toy model the threshold is $p_{\rm th}=1/2$. Real thresholds are far lower, but the shape is the same: $\Lambda$ is greater than 1 only below threshold, and it grows as $p$ falls further below.

<details><summary>Predict: at $p=0.1$, roughly what is $P_L$ for $d=9$?</summary>

About $0.00273/3.1\approx0.0009$. The exact sum gives $0.00089$. Below threshold, each step of two in distance multiplies the error by roughly the same factor.

</details>

## The scaling law behind resource estimates

Well below threshold, failures are dominated by the most likely ones: just over half the distance's worth of faults lining up. Fowler et al. give the empirical formula (their Eq. 11)

$$P_L\approx0.03\left(\frac{p}{p_{\rm th}}\right)^{d_e},\qquad d_e=\frac{d+1}2 .$$

Dividing consecutive odd distances gives $\Lambda\approx p_{\rm th}/p$. At $p=0.1\%$ with $p_{\rm th}=0.57\%$, that predicts $\Lambda\approx5.7$. The formula is a fit to simulations, not a law. Measured hardware is the real test.

## Worked data: Google's 2024 below-threshold experiment

[Google Quantum AI and Collaborators](https://arxiv.org/abs/2408.13687) ran surface-code memories on a 105-qubit superconducting processor. The paper appeared on arXiv in August 2024 and in Nature 638, 920 (2025). Its measured logical error per cycle, using its neural-network decoder (Table S1), is

| Distance | Logical error per cycle |
|---|---|
| 3 | $(6.50\pm0.06)\times10^{-3}$ |
| 5 | $(3.03\pm0.03)\times10^{-3}$ |
| 7 | $(1.43\pm0.03)\times10^{-3}$, i.e. 0.143% |

The paper reports $\Lambda=2.14\pm0.02$, with a 1.1 µs cycle. Check it against the table: $6.50/3.03\approx2.15$ and $3.03/1.43\approx2.12$. The distance-3 and distance-5 values are averages over several sub-grids of the chip, which is why the two ratios differ slightly from the fitted $\Lambda$.

**How large must $d$ be for $10^{-6}$ per cycle?** Assume $\Lambda$ stays at 2.14 as distance grows; the next section examines that assumption. Then

$$\varepsilon_d=\varepsilon_7\,\Lambda^{-(d-7)/2}\le10^{-6}\iff\frac{d-7}2\ge\frac{\ln(1.43\times10^{-3}/10^{-6})}{\ln2.14}=\frac{\ln1430}{0.761}\approx9.55 .$$

Round up to 10 steps, so $d=27$. Check both sides of the boundary: $\varepsilon_{27}\approx7.1\times10^{-7}$ meets the target, and $\varepsilon_{25}\approx1.5\times10^{-6}$ does not. A distance-27 patch uses $2(27)^2-1=1457$ physical qubits for one logical qubit.

$\Lambda$ is the lever. With the same starting point but $\Lambda=4$, the same target needs only $d=19$, or 721 qubits.

## From error per cycle to a computation

A computation fails if any logical qubit fails in any cycle. Take an illustrative machine with 1,000 logical qubits running for $10^9$ cycles, which is 1,100 seconds at 1.1 µs per cycle. That is $10^{12}$ logical-qubit-cycles. Keeping the total failure probability near $0.1$ needs $\varepsilon\approx10^{-13}$ per qubit per cycle.

- **At $\Lambda=2.14$:** $d=69$, which is 9,521 physical qubits per logical qubit and about 9.5 million for the 1,000 data patches alone.
- **At $\Lambda=10$,** the value [Lee et al. (2021)](https://arxiv.org/abs/2011.03494) assume: $d=29$, which is 1,681 per logical qubit and about 1.7 million.

Both counts leave out routing space and magic-state factories, which later lessons add. They show why published estimates assume physical error rates well below today's: the qubit count depends steeply on $\Lambda$.

## Implementation and honest cost

- **Λ need not stay constant.** The extrapolation assumes errors stay independent and local as the code grows. Google also ran repetition codes up to distance 29 on a 72-qubit processor. They report "an apparent logical error floor of $10^{-10}$", caused by rare correlated error bursts "approximately once every hour, or $3\times10^9$ cycles". A burst that hits many qubits at once is not suppressed by distance. Extrapolating to $10^{-13}$ per cycle therefore assumes that such bursts are themselves fixed, which no published experiment has demonstrated.
- **Memory is not computation.** These are memory experiments: they store a logical state. Logical gates add their own failure modes, which later lessons in this module cover.
- **The decoder changes the result.** With Google's matching-based decoder, the same data give $1.71\times10^{-3}$ at $d=7$ rather than $1.43\times10^{-3}$. Decoder quality is part of $\Lambda$.
- **Time adds up.** Every cycle has to be decoded. A run of $10^9$ cycles produces $10^9$ rounds of syndrome data per logical qubit, a central infrastructure problem later in this module.

## Misunderstandings and prediction checks

<details><summary>"Below threshold" means errors are rare. Is that right?</summary>

No. It means adding distance helps. Google's chip is below threshold, yet its $\Lambda$ is only about 2: each step of two in distance buys a factor of 2, not a factor of 10.

</details>

<details><summary>Predict: if $\Lambda$ were exactly 1, what would a distance-101 code achieve?</summary>

Nothing. The logical error would be the same as at distance 3, with about 1,200 times as many qubits ($2\cdot101^2-1=20{,}401$ versus 17).

</details>

<details><summary>Why can't we just measure $\varepsilon$ at $d=27$ instead of extrapolating?</summary>

A $d=27$ patch needs 1,457 qubits at hardware quality, far more than the 101 qubits of Google's distance-7 experiment. Measuring $10^{-6}$ per cycle would also take millions of cycles to see even a few failures. Extrapolation is all that is available, and it should be presented as extrapolation.

</details>

## References

- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025); arXiv 2408.13687 (2024). Table S1 values, Λ, cycle time, repetition-code error floor.
- Austin G. Fowler, Matteo Mariantoni, John M. Martinis, Andrew N. Cleland, [Surface codes: Towards practical large-scale quantum computation](https://arxiv.org/abs/1208.0928), Phys. Rev. A 86, 032324 (2012). Eqs. (10)–(11); threshold 0.57%.
- Eric Dennis, Alexei Kitaev, Andrew Landahl, John Preskill, [Topological quantum memory](https://arxiv.org/abs/quant-ph/0110143), J. Math. Phys. 43, 4452 (2002). Threshold analysis via a statistical-mechanics mapping.
- Joonho Lee et al., [Even more efficient quantum computations of chemistry through tensor hypercontraction](https://arxiv.org/abs/2011.03494), PRX Quantum 2, 030305 (2021). Assumes Λ = 10 in its compilation.
- All derived numbers: `public/examples/ft-checks.py`.
