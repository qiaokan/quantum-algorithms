## Problem and what changes

Estimate the good probability $a$ of a reversible preparation $A$, with $A^\dagger$ and a good-state checker available. Canonical amplitude estimation uses a coherent phase-estimation register. Two alternatives instead measure circuits of the form $Q^kA|0\rangle$, where $Q$ is the amplification operator and $k$ is a selected nonnegative integer.

Their shared observation is

$$p_k=\sin^2((2k+1)\theta),\qquad a=\sin^2\theta,\quad0\leq\theta\leq\pi/2.$$

Here $p_k$ is the chance of observing the good flag after $k$ amplification iterations. **Maximum-likelihood amplitude estimation (MLAE)** fits one angle to results at several predetermined depths. **Iterative QAE (IQAE)** adaptively chooses depths while maintaining a confidence interval and resolving the multiple possible angles. They are not merely different names for one estimator. [Suzuki et al.](https://arxiv.org/html/1904.10246) develop MLAE; [Grinko et al.](https://arxiv.org/html/1912.05559) give a rigorous adaptive IQAE construction.

## Why one depth can be ambiguous

For $a=1/4$, $\theta=\pi/6$. Depths $k=0,1,2$ yield probabilities $1/4,1,1/4$. For $a=1$, every depth yields probability 1. If we measure only $k=1$ and always observe success, both $a=1/4$ and $a=1$ are compatible. Long coherent evolution magnifies the angle but wraps it around the sine curve.

Classical plain sampling is the special case $k=0$ only. It avoids this wrapping but needs order $1/\epsilon^2$ samples for additive accuracy $\epsilon$. Deeper circuits can improve the information per shot, but the shot's cost grows too.

## A complete maximum-likelihood example

Use the two-qubit preparation from [amplitude estimation](/lessons/amplitude-estimation/), with true $a=1/4$. In $(B,G)$ coordinates, its state after the three chosen depths is

$$
Q^0|s\rangle=(\sqrt3/2,1/2)^T,\quad
Q^1|s\rangle=(0,1)^T,\quad
Q^2|s\rangle=(-\sqrt3/2,1/2)^T.
$$

The sign on the last bad amplitude affects future interference but not this measurement. Consider a **synthetic illustrative data set**, not claimed executed samples: 12 shots at each depth, with good counts 3,12,3 respectively.

For a candidate angle $t$, define $q_k(t)=\sin^2((2k+1)t)$. The likelihood, apart from combinatorial factors independent of $t$, is

$$L(t)=q_0(t)^3(1-q_0(t))^9\,q_1(t)^{12}\,q_2(t)^3(1-q_2(t))^9.$$

A likelihood is the probability of the observed data viewed as a function of the unknown parameter. At $t=\pi/6$, the predicted probabilities are exactly $1/4,1,1/4$. Each of the three factors is maximized at its observed success fraction, so this angle is a global maximizer. The fitted estimate is $\widehat a=1/4$.

At candidate $a=3/4$, the middle probability is $\sin^2\pi=0$, making the likelihood zero because 12 successes were observed. At $a=1$, the first and last factors are zero because failures were observed. Combining depths resolves ambiguities present at a single depth.

The ideal prepared probability is known only to verify the teaching example. For a real unknown circuit, noisy data need not land on these exact fractions; numerical optimization must search all relevant likelihood peaks, not start from one favorable guess.

## An adaptive interval step

Suppose earlier IQAE measurements have established $a\in[0.10,0.15]$ with a stated confidence budget. Convert this into $\theta\in[\arcsin\sqrt{0.10},\arcsin\sqrt{0.15}]\approx[0.32175,0.39770]$ radians. “Arcsine” reverses sine on $[-\pi/2,\pi/2]$; the square root converts probability to amplitude.

Choose $k=1$. Then $3\theta\in[0.96525,1.19310]$, entirely below $\pi/2$, where sine-square is increasing. Assume the new shot data support a valid confidence interval $p_1\in[0.75,0.8125]$. Invert on this known branch:

$$\theta\in\left[{\arcsin\sqrt{0.75}\over3},{\arcsin\sqrt{0.8125}\over3}\right].$$

Squaring the sine of the endpoints gives

$$a\in[0.116978,0.133693].$$

Intersect with the earlier interval, which does not change it here. Its midpoint is about 0.125335 and half-width about 0.008358. If the requested additive tolerance were 0.01, this would meet the width criterion, subject to the accumulated confidence accounting. The interval contains the illustrative true value $a=1/8$, whose amplified probability is $(3\sqrt{1/8}-4(\sqrt{1/8})^3)^2=25/32=0.78125$.

**Predict:** would the same inversion be valid from initial $a\in[0.20,0.30]$?

<details><summary>Show the answer</summary>

No. The interval for $3\theta$ crosses $\pi/2$, where sine-square changes direction. One probability can correspond to two angles within the allowed region. IQAE must choose a safe multiplier or gather more information before inverting.

</details>

## Statistical and computational costs

A run with $n_k$ shots at depth $k$ uses $n_k$ preparations and $kn_k$ Grover iterates. Sum these across depths. For the synthetic MLAE example, there are 36 preparations and $12(0+1+2)=36$ Grover iterates, each containing its own preparation/inverse work. Calling it “36 queries” without defining a query would be misleading.

The original MLAE paper provides numerical and asymptotic statistical evidence; it is not a universal finite-sample coverage guarantee for every schedule. IQAE's theorem provides near-quadratic ideal query scaling with additional logarithmic confidence factors. Adaptive stopping requires intervals whose total failure budget remains controlled. A point estimate alone is not a confidence interval. Hardware noise changes $p_k$, potentially causing biased inference even with many shots.

## Connections and limits

These methods save a coherent QPE register and avoid controlled Grover powers, but still require potentially long circuits. Depth-capped variants trade quantum depth for more samples. A fast classical expectation formula, cheap variance reduction, or expensive coherent data preparation can defeat the practical comparison. [Quantum Monte Carlo](/lessons/quantum-monte-carlo/) makes those application costs explicit.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Yohichi Suzuki, Shumpei Uno, Rudy Raymond, Tomoki Tanaka, Tamiya Onodera and Naoki Yamamoto, [Amplitude Estimation without Phase Estimation](https://arxiv.org/html/1904.10246), section 3: likelihood construction and predetermined amplification depths.
- Dmitry Grinko, Julien Gacon, Christa Zoufal and Stefan Woerner, [Iterative Quantum Amplitude Estimation](https://arxiv.org/html/1912.05559), section III and theorem: adaptive angle intervals, confidence accounting and complexity.
