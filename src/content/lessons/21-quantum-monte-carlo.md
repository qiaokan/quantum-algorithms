## Problem and fair classical target

A random variable $X$ is a value drawn according to a probability distribution. A payoff $g(X)$ assigns a number to each outcome. We want its expectation, the probability-weighted mean $\mu=\mathbb E[g(X)]$. The notation $\mathbb E$ means average over the specified distribution, not a new physical operation.

Ordinary Monte Carlo independently samples $X$, evaluates $g(X)$, and averages. For bounded payoffs, additive error $\epsilon$ at fixed confidence generally requires order $1/\epsilon^2$ samples. But a fair application baseline also includes analytic formulas, deterministic quadrature, variance reduction, quasi-Monte Carlo and model-specific algorithms. [Montanaro](https://arxiv.org/abs/1504.06987) establishes quantum improvements under explicit coherent-subroutine and variance assumptions; it is not a blanket acceleration of every numerical integration problem.

## Convert a mean into one flag probability

Assume $0\leq g(x)\leq1$ and a reversible circuit prepares $\sum_x\sqrt{p_x}|x\rangle$, where $p_x$ is the probability of outcome $x$. Compute the payoff reversibly, then rotate a clean flag so that

$$|x\rangle|0\rangle\longmapsto|x\rangle\left(\sqrt{1-g(x)}|0\rangle+\sqrt{g(x)}|1\rangle\right).$$

Uncompute the payoff workspace while retaining the flag. Measuring the flag gives 1 with probability $\sum_xp_xg(x)=\mu$. The square roots appear because measurement squares amplitudes. Preparing this rotation to finite precision has a real arithmetic and synthesis cost.

## A full four-outcome example

Let $X$ be uniform on $0,1,2,3$, and let $g=(0,1/4,1/4,1)$. The classical mean is $(0+1/4+1/4+1)/4=3/8$. We use that result only as a check.

Hadamards prepare the two-bit index register uniformly. Add the flag as the rightmost bit. After the payoff-dependent rotations, the complete state is

$$
|\psi\rangle=\frac12|000\rangle+\frac{\sqrt3}{4}|010\rangle+\frac14|011\rangle
+\frac{\sqrt3}{4}|100\rangle+\frac14|101\rangle+\frac12|111\rangle.
$$

Check normalization: the squared amplitudes are $1/4,3/16,1/16,3/16,1/16,1/4$, summing to 1. The flag-1 terms are $011,101,111$, so

$$P(\text{flag}=1)=1/16+1/16+1/4=3/8.$$

Notice that probabilities from different indices add; their amplitudes do not interfere when the index remains distinguishable. We have encoded the desired expectation into a probability that [amplitude estimation](/lessons/amplitude-estimation/) can estimate.

## From the preparation to a numerical output

Call the full index-and-flag preparation $A$. Reflect about its initial state using $A$, an all-zero phase and $A^\dagger$; combine that with a phase on flag 1 to form $Q$. In the normalized bad/good coordinates, $a=3/8$ and

$$Q=\begin{pmatrix}1/4&-\sqrt{15}/4\\\sqrt{15}/4&1/4\end{pmatrix}.$$

Its eigenphases are $\theta/\pi$ and $1-\theta/\pi$, where $\theta=\arcsin\sqrt{3/8}$. Use a counting grid $K=16$. Controlled powers $Q^8,Q^4,Q^2,Q$ followed by inverse QFT produce a phase label $y$. Each label's ideal probability is computed by averaging the squared geometric sums for those two phases.

For example, label $y=3$ is a possible outcome. Convert it to

$$\widehat\mu=\sin^2(3\pi/16)\approx0.308658.$$

Its absolute error is about 0.066342 from the true 0.375. This deliberately coarse example reaches an actual output but does not meet a tighter accuracy requirement. More coherent work and repetitions are needed for a stated tolerance and confidence. An iterative estimator may replace QPE, with its own shot and depth accounting.

## Precision, scaling and total work

For payoff range $[L,U]$, first normalize $h(x)=(g(x)-L)/(U-L)$, estimate $a=\mathbb E[h(X)]$, then output $L+(U-L)\widehat a$. To attain payoff error $\epsilon$, the probability error must be at most $\epsilon/(U-L)$. A wide range therefore increases the query budget. Unbounded or heavy-tailed distributions require variance/tail assumptions and truncation analysis; the simple bounded rotation does not cover them automatically.

If one coherent model-and-payoff preparation costs $C$ logical gates, an ideal amplitude-estimation scaling roughly proportional to $1/\epsilon$ must be multiplied by $C$, plus inverse preparation, checking, synthesis, repetitions and error correction. Classical sampling may evaluate the same model much more cheaply because it can erase temporary values and branch irreversibly.

**Predict:** if the only input is a file of a million precomputed samples, can we claim quadratic speedup just by placing them in amplitudes?

<details><summary>Show the answer</summary>

No. Loading or coherently querying that file has a cost and an access model. If one must scan the file to construct the state, an ordinary classical average may already solve the problem in the same pass. A sampling API also does not provide $A^\dagger$.

</details>

## Module return and application boundaries

[Grover](/lessons/grover/) moved probability toward a good flag. [Counting](/lessons/quantum-counting/) inferred how much uniform mass was good. This lesson builds a flag whose probability *is* a numerical expectation. The useful abstraction is reusable, but its commercial significance depends on the preparation circuit and the strongest classical method for the same accuracy.

For a two-asset payoff, a multidimensional state may be needed to model correlations; preparing independent marginals is not equivalent. For rare-event risk, additive precision may be insufficient relative to a tiny probability. For optimization, estimating an objective many times compounds costs and errors. These are application-specific failure modes, not reasons to discard the query theorem.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Ashley Montanaro, [Quantum speedup of Monte Carlo methods](https://arxiv.org/abs/1504.06987), bounded-output and bounded-variance estimation; [author-maintained full text](https://people.maths.bris.ac.uk/~csxam/papers/montecarlo.pdf), introduction and bounded-output construction.
- Gilles Brassard et al., [Quantum Amplitude Amplification and Estimation](https://arxiv.org/html/quant-ph/0005055): probability-estimation primitive used after payoff encoding.
