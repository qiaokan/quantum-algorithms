## Problem and classical preprocessing

Input a composite integer $N$ and output a nontrivial factor: an integer $d$ with $1<d<N$ and $d\mid N$. The vertical bar means “divides without remainder.” Full factorization repeats this process on remaining composite factors. Shor's quantum work solves **order finding**; much of the algorithm is classical.

Before using a quantum computer, test whether $N$ is even, a prime, or a perfect power. If $N$ is even, return 2. If $N=b^k$ for integers $b>1,k>1$, factor $b$ or report the power structure. Efficient classical primality and integer-root routines make these checks. Choose a random $a$ with $1<a<N$ and compute $\gcd(a,N)$. If this is neither 1 nor $N$, we already have a factor.

Trial division is a simple classical baseline, but not the strongest one. General-number-field-sieve methods are subexponential in the bit length under their usual heuristic analysis. [Shor's theorem](https://arxiv.org/html/quant-ph/9508027) gives a polynomial quantum algorithm; it does **not** prove that every classical factoring algorithm takes exponential time, nor that factoring is NP-complete.

## The classical trick, before the quantum machinery

Suppose order finding returns an even $r$ satisfying $a^r\equiv1\pmod N$. Set $t=a^{r/2}\bmod N$. Then $t^2\equiv1\pmod N$, so $N$ divides

$$(t-1)(t+1).$$

If $t$ is neither 1 nor $-1\bmod N$, the factors of $N$ are split nontrivially across these two neighboring numbers. Computing $\gcd(t-1,N)$ and $\gcd(t+1,N)$ exposes that split. The excluded case $-1\bmod N$ is the remainder $N-1$.

This is the exact reason we want the order. Periodicity is useful because it manufactures a nontrivial square root of 1 modulo $N$.

## End-to-end worked instance: twenty-one

Take $N=21$ and choose $a=2$. The classical gcd is 1. We now invoke general modular order finding, without giving it the period. The successive powers, shown only for verification, are

$$1,2,4,8,16,11,1,\ldots,$$

so the true order is 6. Use $Q=512$, a power of two exceeding $21^2=441$. Prepare the exponent superposition, compute $2^x\bmod21$ reversibly, and Fourier-transform the exponent register as in [order finding](/lessons/order-finding/).

For the value-register branch 1, the exponents are $0,6,12,\ldots,510$, a total of 86 terms. Its normalized state is $\sum_{j=0}^{85}|6j\rangle/\sqrt{86}$. The amplitude at Fourier output $y=85$ is

$$b_{85}={1\over\sqrt{512\cdot86}}\sum_{j=0}^{85}e^{2\pi i(6j)(85)/512}
={1\over\sqrt{44032}}\sum_{j=0}^{85}e^{-2\pi ij/256}.$$

Adjacent terms turn by only $-2\pi/256$, so they mostly reinforce. Its conditional probability is approximately 0.114172. Other value branches give slightly different packet lengths but similarly located peaks. This is one possible measurement outcome, not a deterministic result of the experiment.

Suppose 85 is observed. Classical continued fractions of $85/512$ have prefix $[0;6,42,2]$, yielding candidate denominator 6. Verify $2^6=64\equiv1\pmod{21}$. The order is even. Compute $t=2^3\bmod21=8$.

Now run Euclid's gcd algorithm explicitly:

- $\gcd(8-1,21)=\gcd(7,21)=7$, because $21=3\cdot7$.
- $\gcd(8+1,21)=\gcd(9,21)=\gcd(9,3)=3$, because $21=2\cdot9+3$ and $9=3\cdot3$.

The output factors are 3 and 7. Verify their product is 21. The quantum sample produced a useful rational approximation; the factors themselves came from classical postprocessing.

## Rejected and lucky trials are part of the algorithm

For the same $N=21$:

| Trial | What happens | Correct action |
|---|---|---|
| $a=3$ | $\gcd(3,21)=3$ | Return a factor before quantum work. |
| $a=4$ | Order is 3: $4,16,1$ | Reject odd order and choose another base. |
| $a=20$ | Order is 2, but $20^{1}\equiv-1$ | Reject: gcds are 1 and 21. |
| $a=2$, denominator 3 | $2^3\bmod21=8\ne1$ | This denominator is not an order; gather more evidence or try justified multiples. |
| $a=2$, order 6 | Nontrivial square root 8 | Return 3 and 7. |

**Predict:** if a program accepts every even denominator, what goes wrong?

<details><summary>Show the answer</summary>

A Fourier denominator need not satisfy $a^r\equiv1$. Even a genuine even order can yield $t=-1$ and only trivial gcds. The modular-power check and nontrivial-factor checks are mandatory.

</details>

A multiple of the true order can also satisfy the modular-power check but produce $t=1$. That attempt fails to split $N$; it must not be reported as successful factorization. More sophisticated postprocessing may reduce candidate orders or combine samples. A basic implementation can simply reject unsuccessful splits and retry with a documented confidence budget.

## What a genuine implementation must pay for

For an $n$-bit input, exponent and work registers have sizes polynomial in $n$. Repeated squaring produces the constants for controlled modular multiplications. Reversible addition, multiplication, modular reduction and cleanup dominate many implementations; the QFT is not the whole bill. Elementary arithmetic constructions give polynomial logical-gate cost, while improved multiplication and arithmetic change the precise exponent and constants.

Fault-tolerant physical resources depend on error rates, code, layout, gate synthesis and desired total failure probability. This chapter gives no hardware runtime or physical-qubit forecast. A circuit that factors 15 after hardcoding a known period validates a small interference mechanism, not scalable general modular arithmetic.

## A significant later development

[Regev's factoring algorithm](https://arxiv.org/abs/2308.06572) uses a multidimensional number-theoretic construction and repeated shorter quantum circuits with classical lattice postprocessing. Its stated guarantee relies on a number-theoretic assumption. Per-run gate savings must be multiplied by the number of independent runs, and memory and classical costs must remain visible. This is an important development within factoring, but it is not an unconditional demonstration that a physical machine will factor sooner. A full lattice derivation is an advanced extension beyond this Shor lesson.

## Connections and boundaries

The complete chain is: reversible arithmetic creates a periodic state; Fourier sampling yields a rational hint; classical verification identifies a useful order; gcds extract factors. None of these steps reads an exponentially long truth table. [Discrete logarithms](/lessons/discrete-logarithms/) use a related two-dimensional periodic structure. The [abelian hidden-subgroup framework](/lessons/abelian-hidden-subgroup/) will identify their shared mechanism.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Peter W. Shor, [Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer](https://arxiv.org/html/quant-ph/9508027), sections 3–5: complete factoring construction and correctness.
- IBM Quantum Learning, [Shor's algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm): classical reduction and modular order finding.
- Oded Regev, [An Efficient Quantum Factoring Algorithm](https://arxiv.org/abs/2308.06572): conditional later development; abstract verified, full implementation analysis not audited here.
