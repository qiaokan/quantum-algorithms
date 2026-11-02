## Problem and oracle convention

Forrelation asks whether two sign functions $f,g:\{0,1\}^n\to\{-1,+1\}$ have substantial Fourier correlation. Define $N=2^n$ and

$$\Phi=\frac1{N^{3/2}}\sum_{x,y}f(x)(-1)^{x\cdot y}g(y).$$

Here $x\cdot y$ is the sum of bitwise products modulo two; for x=10,y=11 it is 1. The sum ranges over every n-bit x and y. A standard promise separates $|\Phi|\le0.01$ from $\Phi\ge0.6$. [Aaronson and Ambainis](https://arxiv.org/html/1411.5729) prove a strong separation against randomized classical query algorithms. This is an oracle problem, not a theorem that arbitrary exponential-time problems become easy.

## Two-query circuit with every intermediate state

First use the transparent circuit $H^{\otimes n}O_gH^{\otimes n}O_fH^{\otimes n}|0^n\rangle$, where $O_f|x\rangle=f(x)|x\rangle$ and likewise for g. This makes **one query to f and one query to g**. Its final amplitude at 0 is Φ, so the probability of 0 is $\Phi^2$.

Take n=2 and ordered inputs 00,01,10,11. Let $f=(1,1,1,-1)$. After the first H layer and f phase query, the vector is f/2. Multiplying by the four-dimensional Hadamard gives

$$\frac14\begin{pmatrix}1+1+1-1\\1-1+1+1\\1+1-1+1\\1-1-1-1\end{pmatrix}
=\frac12\begin{pmatrix}1\\1\\1\\-1\end{pmatrix}.$$

For the high-correlation instance g=f, the g phase query turns this into $(1,1,1,1)^T/2$. The final Hadamard yields |00〉 with probability one, hence Φ=1. For the low instance $g=(1,-1,-1,-1)$, the g query instead yields $(1,-1,-1,1)^T/2$. The final Hadamard yields |11〉, hence Φ=0. We reached the answer through addition and cancellation, not by reading both truth tables.

## A genuinely one-query experiment

Use an **indexed oracle** $h(b,x)$ that returns f(x) when b=0 and g(x) when b=1. Both classical and quantum algorithms receive the same indexed access. Prepare the selector b in |+〉 and x uniformly. One phase query creates

$$\frac1{\sqrt2}(|0\rangle|f\rangle+|1\rangle|g\rangle),\qquad |f\rangle=\sum_xf(x)|x\rangle/\sqrt N.$$

Apply H on every x qubit only when selector b=1. Then the two branches contain |f〉 and $H^{\otimes n}|g\rangle$. Apply H to the selector and measure it. Its zero probability is $(1+\operatorname{Re}\langle f|H^{\otimes n}|g\rangle)/2=(1+\Phi)/2$. Each computational basis input to the oracle addresses **one** of the functions. No wrapper computes both values and falsely calls that one elementary evaluation.

For the two concrete instances above, the selector-zero probabilities are 1 and 1/2. A single sample is not deterministic evidence of the low case. Constantly many repeated one-query experiments distinguish the promised separated means with bounded error. The one-query complexity formulation in the paper uses an appropriate bounded-success decision procedure; success parameters and oracle indexing belong to the statement.

## Classical comparison and scaling

A straightforward classical algorithm can compute every truth-table value and a fast Walsh–Hadamard transform, using N function queries and order $N\log N$ arithmetic. The theorem gives a randomized classical lower bound $\Omega(\sqrt N/\log N)$ for the promise problem, versus constant quantum queries. Unlike Deutsch–Jozsa's exact deterministic comparison, this separation survives a bounded-error randomized baseline. It remains a query statement: constructing a coherent h oracle, preparing the registers, and applying Hadamards cost gates.

For the two-query probability experiment, the high case has zero probability at least 0.36 and the low case at most 0.0001. Accepting “high” if any of ten independent runs yields zero has false-negative probability at most $0.64^{10}\approx0.01153$, and false-positive probability at most $10\cdot0.0001=0.001$ by the union bound. Ten runs use twenty separate phase queries. This elementary calculation makes the success accounting explicit.

## Prediction and synthesis

**Predict:** If the promise instead allows Φ≤−0.6 as a high case, is the selector-zero test unchanged?

<details><summary>Show the answer</summary>

No. Its probability becomes at most 0.2 for a strongly negative correlation, rather than at least 0.8. The two-query amplitude-squared circuit detects magnitude, while the selector experiment retains sign. Promise details change the decision rule.

</details>

This final example revisits the entire first-module lesson: identify the exact oracle, encode information as phase, mix contributions to a target amplitude, and distinguish the distributions with an explicit error bound. Large state spaces alone provide none of those steps. The specialized extensions also show different boundaries: Kuperberg needs coherent sample processing, Hallgren needs real-period arithmetic and compact output, Jones estimation needs a normalized trace, and Gibbs sampling needs convergence as well as correct local updates.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Scott Aaronson and Andris Ambainis, [Forrelation: A Problem that Optimally Separates Quantum from Classical Computing](https://arxiv.org/html/1411.5729), Sections 1 and 3: promise, indexed query convention, one-query experiment, and randomized classical lower bound. The four-value examples and repetition arithmetic are locally derived.
