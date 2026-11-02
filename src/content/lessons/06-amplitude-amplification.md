## Problem and access model

A program prepares a candidate, but only some candidates pass a checker. We want a passing candidate. Unlike ordinary repetition, assume we can run the preparation **coherently**, meaning without measuring or discarding its intermediate information, and can run its inverse. Call that reversible circuit $A$. Let $f(x)$ be 1 for a good candidate $x$, and 0 otherwise. The checker must also be available as a coherent circuit. Its internal work is part of the cost.

The initial success probability is $a$: measuring $A|0\rangle$ would give a good candidate with probability $a$. This chapter first assumes $a$ is known. [Brassard, Høyer, Mosca and Tapp](https://arxiv.org/html/quant-ph/0005055) give the general amplification construction. [Unknown success probabilities](/lessons/bbht-search/) require a stopping strategy.

## Classical baseline and intuition

Ordinary repetition prepares, measures, and checks. After $k$ independent attempts, failure probability is $(1-a)^k$; expected attempts until success are $1/a$. For $a=1/4$, that expectation is 4.

Quantum amplification preserves the different attempts as amplitudes in one state. It alternates a sign change on good states with a reflection about the original prepared state. These operations rotate amplitude toward the good part. The geometric language describes two real coordinates; it does not mean a particle travels toward a solution in physical space.

## A complete one-qubit instance

We use basis order $(|0\rangle,|1\rangle)$, with 1 good. A [column vector](/definitions/vectors/) lists amplitudes, whose squared magnitudes are measurement probabilities. Prepare

$$
A=\begin{pmatrix}\sqrt3/2&-1/2\\1/2&\sqrt3/2\end{pmatrix},\qquad
|s\rangle=A\begin{pmatrix}1\\0\end{pmatrix}
=\begin{pmatrix}\sqrt3/2\\1/2\end{pmatrix}.
$$

For example, the first output entry is $(\sqrt3/2)1+(-1/2)0=\sqrt3/2$. The total probability is $3/4+1/4=1$. A square root is necessary because the good probability is $1/4$, while its amplitude is $1/2$.

**Predict:** does changing the good amplitude from $1/2$ to $-1/2$ improve the immediate probability?

<details><summary>Show the answer</summary>

No. Both square to $1/4$. A relative sign changes what a later operation can do, not the immediate computational-basis probabilities.

</details>

The checker implements $S_f=\operatorname{diag}(1,-1)$. The notation $\operatorname{diag}$ puts its arguments on a matrix diagonal and zeros elsewhere. It maps $|s\rangle$ to $(\sqrt3/2,-1/2)^T$. The superscript $T$ says “write these entries as a column.”

We now need a reflection about $|s\rangle$. The [outer product](/definitions/outer-products/) $|s\rangle\langle s|$ multiplies a column by its conjugated row:

$$
|s\rangle\langle s|=
\begin{pmatrix}3/4&\sqrt3/4\\\sqrt3/4&1/4\end{pmatrix}.
$$

Each entry is a product: top-right is $(\sqrt3/2)(1/2)$. Let $I$ be the matrix that leaves every vector unchanged. The reflection is

$$
R_s=2|s\rangle\langle s|-I
=\begin{pmatrix}1/2&\sqrt3/2\\\sqrt3/2&-1/2\end{pmatrix}.
$$

We needed the outer product to construct this reflection. We can now return to the algorithm: apply $R_s$ to the marked state.

$$
R_sS_f|s\rangle=
\begin{pmatrix}
(1/2)(\sqrt3/2)+(\sqrt3/2)(-1/2)\\
(\sqrt3/2)(\sqrt3/2)+(-1/2)(-1/2)
\end{pmatrix}
=\begin{pmatrix}0\\1\end{pmatrix}.
$$

Two contributions to output 0 cancel; the contributions $3/4$ and $1/4$ to output 1 reinforce. Measurement returns the good candidate with probability 1. The checker did not reveal its answer as a classical bit before the reflection.

## Why the same calculation generalizes

Group all good amplitudes into a normalized vector $|G\rangle$, and all bad amplitudes into $|B\rangle$. “Normalized” means their squared magnitudes add to 1. These two vectors have disjoint support, so they are perpendicular. The prepared state is

$$|s\rangle=\sqrt{1-a}|B\rangle+\sqrt a|G\rangle.$$

The two coordinates therefore behave exactly like the one-qubit example, even when each coordinate represents millions of basis states. Within either group, relative amplitudes are preserved.

Define an angle $\theta$ by $\sin\theta=\sqrt a$, with $0\leq\theta\leq\pi/2$. Sine and cosine are the vertical and horizontal coordinates on a unit circle; see [the angle bridge](/definitions/trigonometry/). Initially those coordinates are $(\cos\theta,\sin\theta)$. Multiplying the two reflection matrices gives

$$
Q=R_sS_f=\begin{pmatrix}1-2a&-2\sqrt{a(1-a)}\\2\sqrt{a(1-a)}&1-2a\end{pmatrix}.
$$

This is the rotation by $2\theta$. After $j$ iterations, success probability is $\sin^2((2j+1)\theta)$. Our example has $\theta=\pi/6$, so one iteration reaches $3\theta=\pi/2$. Two iterations reach $5\pi/6$ and reduce success back to $1/4$: more coherent work can be worse.

## Implementation and cost

We do not materialize the enormous matrix $R_s$. Instead,

$$R_s=A(2|0\rangle\langle0|-I)A^\dagger.$$

The dagger means [conjugate transpose](/definitions/conjugate-transpose/), which is the inverse of a unitary circuit. Read the product right-to-left: undo preparation, apply a phase reflection about all-zero, and prepare again. A multiply-controlled phase can implement the all-zero reflection, with decomposition and [ancilla](/definitions/ancillas/) costs. The checker can compute $f(x)$ into a flag, phase the flag, and [uncompute](/definitions/uncomputation/) its workspace. Count both computation and uncomputation, not only the phase gate.

For small nonzero $a$, order $1/\sqrt a$ iterations suffice for constant success probability; each uses $A$, $A^\dagger$, and checking. A classical randomized program does not automatically provide a cheap coherent $A$: retain random seeds and garbage reversibly, then account for cleanup. No success is possible when $a=0$. The toy's exact success uses the special value $a=1/4$; arbitrary $a$ generally misses probability 1 with integer iteration counts.

## Misunderstandings and connections

Amplification does not read all candidates, amplify an unknown state for free, or permit measuring between every iteration. Its reusable resource is the reversible preparation circuit. [Grover](/lessons/grover/) is the uniform-preparation special case. [Fixed-point amplification](/lessons/fixed-point-amplification/) changes phase choices to tolerate uncertainty; [amplitude estimation](/lessons/amplitude-estimation/) measures the rotation angle instead of seeking a candidate.

A later extension, variable-time amplification, exploits branches that finish at different known stages. For example, a computation that takes 1 step on probability $0.99$ and 100 steps on probability $0.01$ has root-mean-square stopping time $\sqrt{0.99+100}=\sqrt{100.99}\approx10.05$, versus worst-case 100. This number is a useful resource parameter, **not by itself a complete runtime bound**: success probability, maximum time, coherent stopping flags and logarithmic factors remain. [Ambainis's construction](https://arxiv.org/html/1010.4458) is relevant to modern linear-system solvers.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Gilles Brassard, Peter Høyer, Michele Mosca and Alain Tapp, [Quantum Amplitude Amplification and Estimation](https://arxiv.org/html/quant-ph/0005055), sections 2–3: reflection construction, success angle and query advantage.
- Andris Ambainis, [Variable time amplitude amplification and a faster quantum algorithm for solving systems of linear equations](https://arxiv.org/html/1010.4458), section 2.1: stopping-time model and the distinction from uniform-cost amplification.
