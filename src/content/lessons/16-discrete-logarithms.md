## Problem and access model

A **cyclic group** consists of repeated powers of an element $g$, with an operation that can be reversed. Its order $r$ is the number of distinct powers before $g^r=1$. Given $g$ and $h=g^s$, recover the unknown exponent $s$ modulo $r$. In modular arithmetic this is called a discrete logarithm. See [groups](/definitions/groups/) for the elementary definitions.

Assume group elements have efficient encodings, coherent multiplication and inversion are available, and the order $r$ is known or can be found. These assumptions determine the cost. For a generic group, classical baby-step–giant-step or random-walk methods take roughly $\sqrt r$ group operations; some particular groups have faster structure-specific classical algorithms. [Shor's algorithm](https://arxiv.org/html/quant-ph/9508027) solves the problem in polynomial time in the encoding length for suitable efficiently computable groups.

## A fixed eight-element group

Work modulo 17 with $g=2$. Its powers are

$$2^0,2^1,\ldots,2^7\pmod{17}=1,2,4,8,16,15,13,9.$$

The next power is 1, so $r=8$. Given $h=8$, we want the hidden $s$ with $2^s\equiv8\pmod{17}$. We can see $s=3$ for checking, but the circuit is built from the public values $g,h,r$, not that answer.

Use two three-bit registers $x,y\in\{0,\ldots,7\}$. Define

$$f(x,y)=g^x h^{-y}\pmod{17}.$$

The negative exponent means use the multiplicative inverse: $8^{-1}=15\pmod{17}$ because $8\cdot15=120=7\cdot17+1$. Repeated squaring implements the powers. Algebraically, $f(x,y)=2^{x-3y}\pmod{17}$, but the algorithm need not know 3 to evaluate it.

## Preparation and the hidden line

Hadamards on six input bits create $\sum_{x,y}|x,y\rangle/8$. Compute $f$ into a value register. For explanation, suppose measuring that register gives 1. There are eight matching input pairs, each initially of probability $1/64$, so this branch has probability $1/8$.

After conditioning, the two input registers hold

$$\frac1{\sqrt8}(|0,0\rangle+|3,1\rangle+|6,2\rangle+|1,3\rangle+|4,4\rangle+|7,5\rangle+|2,6\rangle+|5,7\rangle).$$

These pairs satisfy $x=3y\pmod8$. This is a “line” on a wrapping grid; it is not an ordinary line of points in the plane. Other measured values give parallel offset lines and will yield the same measurement constraint below.

## Fourier-transform both coordinates

Apply $F_8$ to each input register. Each pair contributes a factor $e^{2\pi i(ux+vy)/8}/8$ to output $(u,v)$, where $u,v$ are the Fourier labels. Since $x=3y\pmod8$, the total amplitude is

$$b_{u,v}={1\over8\sqrt8}\sum_{y=0}^7e^{2\pi i(3u+v)y/8}.$$

If $3u+v\equiv0\pmod8$, all eight terms are 1, so $b_{u,v}=1/\sqrt8$. Otherwise the geometric sum cancels. The output pairs are therefore

$$(0,0),(1,5),(2,2),(3,7),(4,4),(5,1),(6,6),(7,3),$$

each with probability $1/8$. We transformed an unknown line's slope into linear constraints on measured labels.

Suppose $(u,v)=(1,5)$ is observed. The constraint for unknown $s$ is $us+v\equiv0\pmod8$, so $s+5\equiv0$, yielding $s=3$. Verify $2^3\bmod17=8$ and return 3.

For $(u,v)=(3,7)$, solve $3s\equiv1\pmod8$. The inverse of 3 modulo 8 is 3, since $3\cdot3=9\equiv1$. Multiply to get $s\equiv3$ again.

## Samples that do not determine the answer

If $(u,v)=(2,2)$, then $2s\equiv6\pmod8$. Dividing by 2 leaves $s\equiv3\pmod4$, so $s$ could be 3 or 7 modulo 8. Verification or another independent sample resolves the ambiguity. The sample $(0,0)$ says nothing.

**Predict:** may we always divide by the measured $u$ modulo $r$?

<details><summary>Show the answer</summary>

Only when $\gcd(u,r)=1$. For $u=2,r=8$, there is no multiplicative inverse. Treating ordinary real division as modular division would lose valid candidates. Solve the congruence or combine samples instead.

</details>

For our power-of-two order, half the $u$ values are odd and invertible, so a single sample has probability $1/2$ of directly determining $s$. Arbitrary group orders require the corresponding number-theoretic postprocessing.

## Implementation and generalization

The function evaluation uses controlled group multiplications by precomputed powers of $g$ and $h^{-1}$, with temporary arithmetic uncomputed. QFTs over a power-of-two order use the circuit already derived. General cyclic orders need suitable approximate transforms or the original power-of-two-grid analysis; silently padding a group of order 6 to size 8 changes the equations and is not an exact substitute.

The algorithm can apply to elliptic-curve groups when their addition law is implemented reversibly. There, “powers” become repeated addition of a point. The finite-field and elliptic-curve classical baselines differ, so one complexity slogan should not replace separate comparisons. Gate synthesis, group-operation circuits, repetitions and physical error correction are not included in an ideal oracle count.

## Connections

[Simon's algorithm](/lessons/simon/) turns hidden XOR shifts into binary linear equations. This example turns a hidden modular slope into equations modulo 8. [Shor factoring](/lessons/shor/) extracts a one-dimensional period. The [abelian hidden-subgroup framework](/lessons/abelian-hidden-subgroup/) captures all these cancellation patterns while keeping their classical reconstruction steps distinct.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Peter W. Shor, [Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer](https://arxiv.org/html/quant-ph/9508027), section 6: discrete-logarithm construction and group-operation assumptions.
- Andrew M. Childs and Wim van Dam, [Quantum algorithms for algebraic problems](https://arxiv.org/html/0812.0380), section IV: group Fourier sampling and finite-group formulations.
