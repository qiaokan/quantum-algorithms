## Problem and access model

A reversible circuit $A$ prepares

$$A|0\rangle=\sqrt{1-a}|B\rangle+\sqrt a|G\rangle,$$

where a known checker distinguishes normalized bad and good components. Estimate the unknown **probability** $a$, to additive error $\epsilon$ and stated confidence. The amplitudes are square roots; the output is not an arbitrary complex amplitude. Assume access to $A$, $A^\dagger$ and controlled forms needed by the chosen construction.

Classically, run $A$, measure the flag, and average the observed zeros and ones. The typical sampling error decreases as the inverse square root of the sample count. Canonical quantum amplitude estimation uses phase estimation on the amplification operator, improving the ideal coherent-query dependence on additive precision from order $1/\epsilon^2$ to order $1/\epsilon$ at constant confidence. [Brassard et al.](https://arxiv.org/html/quant-ph/0005055) prove the canonical guarantee.

## A nonuniform preparation you can build

Use two qubits, left bit first. Apply $H$ to the first qubit, then apply $H$ to the second only when the first is 1. Starting at $|00\rangle$:

$$|00\rangle\longmapsto{\,|00\rangle+|10\rangle\over\sqrt2}
\longmapsto {|00\rangle\over\sqrt2}+{|10\rangle\over2}+{|11\rangle\over2}.$$

Let “good” mean that the second bit is 1. Then $a=1/4$. Unlike counting, the input is not a uniform distribution over all four basis labels. Define

$$|G\rangle=|11\rangle,\qquad
|B\rangle={\sqrt2|00\rangle+|10\rangle\over\sqrt3}.$$

The bad vector is normalized because $2/3+1/3=1$. The full state is $(\sqrt3/2)|B\rangle+(1/2)|G\rangle$, matching $\sin\theta=1/2$ and $\theta=\pi/6$.

## Build the operator whose phase is the answer

Use $Q=R_sS_G$, with $R_s=2|s\rangle\langle s|-I$ and a sign flip $S_G$ on good states. In $(B,G)$ coordinates,

$$Q=\begin{pmatrix}1/2&-\sqrt3/2\\\sqrt3/2&1/2\end{pmatrix}.$$

It has eigenvectors $(1,-i)^T/\sqrt2$ and $(1,i)^T/\sqrt2$, with eigenvalues $1/2\pm i\sqrt3/2=e^{\pm i\pi/3}$. These are phases $1/6$ and $5/6$ in full-turn units. The real initial vector has equal squared overlap $1/2$ with the two eigenvectors.

For example, the first eigenvector is verified by multiplying the top row: $(1+i\sqrt3)/(2\sqrt2)$, which is $(1/2+i\sqrt3/2)$ times its first coordinate $1/\sqrt2$. The bottom row gives the same scalar times $-i/\sqrt2$.

## A finite-resolution run, not an exact answer

Use three counting bits, so $K=8$. Prepare their uniform superposition, apply controlled $Q^4,Q^2,Q$, then inverse $F_8$. On the $1/6$ eigenbranch, output amplitude at label $y$ is

$$b_y={1\over8}\sum_{x=0}^7e^{2\pi ix(1/6-y/8)}.$$

On the $5/6$ eigenbranch, replace $1/6$ by $5/6$. Since the eigenvectors are perpendicular, probabilities from these branches add with weight $1/2$; amplitudes from different eigenvectors must not be combined as if they were the same state.

| Label $y$ | Ideal probability | Estimate $\widehat a=\sin^2(\pi y/8)$ |
|---|---:|---:|
| 0 | 0.046875 | 0 |
| 1 | 0.353228 | 0.146447 |
| 2 | 0.093750 | 0.5 |
| 3 | 0.021772 | 0.853553 |
| 4 | 0.015625 | 1 |
| 5 | 0.021772 | 0.853553 |
| 6 | 0.093750 | 0.5 |
| 7 | 0.353228 | 0.146447 |

These are calculated ideal probabilities, rounded for readability, not measured hardware data. Suppose $y=1$ occurs. Return $\widehat a=\sin^2(\pi/8)=(2-\sqrt2)/4\approx0.146447$. Its error from $1/4$ is about 0.103553. This coarse run illustrates the full procedure; it is not a high-precision result. Increase $K$ for finer estimates and repeat to control failure.

## Why the error improves with coherent work

The phase grid spacing is $1/K$. Changing $\theta$ slightly changes $a=\sin^2\theta$ smoothly, which transfers phase resolution to probability resolution. The canonical theorem gives

$$|\widehat a-a|\leq{2\pi\sqrt{a(1-a)}\over K}+{\pi^2\over K^2}$$

with probability at least $8/\pi^2$ under its ideal access assumptions. The second term handles behavior near endpoints where a purely linear approximation would be inadequate. This is an additive guarantee, not uniform small relative error on extremely rare events.

**Predict:** do three counting qubits mean this example uses only three calls to $Q$?

<details><summary>Show the answer</summary>

No. It uses three controlled-power blocks, but they contain $4+2+1=7$ base-$Q$ applications when powers are built by repetition. Every $Q$ contains preparation, inverse preparation and checking work. The precision advantage is in total coherent queries, not register size alone.

</details>

## Implementation, assumptions and counterexamples

In this example, $A^\dagger$ reverses the controlled-H and H sequence. A general preparation might include expensive arithmetic, data lookup and cleanup. A stochastic classical simulator must be made coherent, retaining randomness and intermediate data; a classical sampling API alone is insufficient. Circuit noise can bias long amplified experiments, so the ideal theorem does not guarantee near-term performance.

Amplitude estimation may be useless if a cheap classical formula already gives $a$, as it does for our teaching circuit. The toy establishes the mechanism, not a speedup benchmark. Useful applications need a hard expectation, efficient coherent preparation, acceptable readout and a strong classical baseline.

[Iterative variants](/lessons/iterative-amplitude-estimation/) remove the QPE register and controlled powers but retain Grover-depth and statistical costs. [Monte Carlo applications](/lessons/quantum-monte-carlo/) encode an expected payoff into the success flag.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Gilles Brassard, Peter Høyer, Michele Mosca and Alain Tapp, [Quantum Amplitude Amplification and Estimation](https://arxiv.org/html/quant-ph/0005055), section 4 and Theorem 12: canonical procedure and accuracy/confidence bound.
- Dmitry Grinko et al., [Iterative Quantum Amplitude Estimation](https://arxiv.org/html/1912.05559), section II: comparison with alternatives and explicit access costs.
