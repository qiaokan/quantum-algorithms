## Problem and access model

A periodic function repeats: $f(x+r)=f(x)$ for a positive integer $r$. We want its smallest positive period. Period-finding algorithms require a promise about repeated values, such as distinct values within one period, plus efficient coherent evaluation. Arbitrary functions that merely have some period need not satisfy the standard analysis.

The important arithmetic instance is **modular order finding**. Given integers $a,N$ with greatest common divisor $\gcd(a,N)=1$, find the smallest $r>0$ with $a^r\equiv1\pmod N$. The congruence means that dividing $a^r$ by $N$ leaves remainder 1. A classical method repeatedly multiplies by $a$ until 1 returns; it may take $r$ steps. The quantum algorithm extracts a denominator from Fourier samples. [Shor](https://arxiv.org/html/quant-ph/9508027) proves polynomial complexity in the bit length of $N$, including arithmetic and classical postprocessing.

## Fix the function before examining the quantum state

Take $a=2,N=15$. Its values are

$$2^x\bmod15=1,2,4,8,1,2,4,8,\ldots.$$

The period is 4, but the algorithm is not given that answer. We display it to check the worked instance. Use a four-bit exponent register $x=0,\ldots,15$ and a four-bit value register. This deliberately small Fourier grid makes the arithmetic visible; the general algorithm uses more precision.

Hadamards prepare

$$\frac14\sum_{x=0}^{15}|x\rangle|0\rangle.$$

A reversible modular-exponentiation circuit computes the values:

$$\frac14\sum_{x=0}^{15}|x\rangle|2^x\bmod15\rangle.$$

This operation does not ask a classical server sixteen questions. It executes one reversible arithmetic circuit whose gates act coherently. Its gate cost must still be counted.

## A value measurement creates a periodic packet

For explanation, measure the value register. Each value 1,2,4,8 occurs four times and hence has probability $4(1/16)=1/4$. Suppose the result is 2. Conditional on it, the exponent register is

$$|\psi\rangle=\frac12(|1\rangle+|5\rangle+|9\rangle+|13\rangle).$$

Why $1/2$ rather than the earlier $1/4$? We conditioned on an event of probability $1/4$, so each retained amplitude is divided by $\sqrt{1/4}=1/2$. The four surviving probabilities must add to 1. See [conditional probability](/definitions/conditional-probability/) and [measurement](/definitions/measurement/).

It is not necessary physically to measure this register: ignoring it gives the same exponent measurement statistics after the QFT. Measuring here makes a branch easy to calculate; it does not reveal $r$ by itself.

## Transform the packet and reach an output

Apply the positive-exponent QFT $F_{16}$. The amplitude at output $y$ is

$$
 b_y=\frac18\sum_{j=0}^3e^{2\pi i(1+4j)y/16}
 =\frac{e^{2\pi iy/16}}8\left(1+e^{2\pi iy/4}+e^{4\pi iy/4}+e^{6\pi iy/4}\right).
$$

Here $j$ labels the four repeated positions. At $y=4$, all four terms in parentheses equal 1, while the leading phase is $i$, giving $b_4=i/2$. At $y=1$, the parentheses are $1+i-1-i=0$. In general only $y=0,4,8,12$ survive, with amplitudes $1/2,i/2,-1/2,-i/2$. Each has probability $1/4$.

Suppose measurement gives $y=4$. Divide by grid size 16: $y/16=1/4$. Its denominator suggests $r=4$. Verify $2^4\bmod15=1$; indeed the smaller positive powers are 2,4,8, so 4 is the order. If the result were 12, $12/16=3/4$ gives the same denominator. If it were 8, reduction gives $1/2$ and candidate 2 fails verification. Outcome 0 is uninformative. Repeat or combine compatible candidate denominators; do not declare every sample successful.

## When the period does not divide the grid

For general $N$, choose a power-of-two grid size $Q$ with $N^2\leq Q<2N^2$. Packets near the boundary need not have exactly the same length. Their Fourier peaks lie near $y/Q=s/r$ for integers $s$. Since $r<N$, sufficient approximation precision lets a classical continued-fraction calculation recover the reduced fraction.

For example, $85/512\approx1/6$. Euclidean division gives $512=6\cdot85+2$ and $85=42\cdot2+1$, so the continued fraction starts $[0;6,42,2]$. Its early convergent $1/6$ supplies candidate denominator 6. A **convergent** is what results when the nested fraction is stopped early; see [continued fractions](/definitions/continued-fractions/). The next lesson verifies this candidate for $2\bmod21$.

If $s$ shares a factor with $r$, the reduced denominator is only a divisor of the order. Bad Fourier samples and insufficient precision can produce wrong candidates. Verification, small-multiple tests or combining samples, and retries are part of the algorithm.

## Arithmetic implementation and powered operations

Write $x=\sum_k2^kx_k$. Then

$$a^x\bmod N=\prod_k(a^{2^k}\bmod N)^{x_k}\bmod N.$$

Compute each constant $a^{2^k}\bmod N$ classically by repeated squaring, then apply a controlled reversible modular multiplication for each exponent bit. For $a=2,N=15$, constants begin 2,4,1,1. These are derived from the input, not from a supplied order. An implementation that replaces modular exponentiation with a circuit designed from the known period is a compiled demonstration and cannot substantiate general factoring.

A known arithmetic description permits efficient large powers. An opaque black-box permutation with only one-step access does not automatically permit this shortcut. General period finding, modular order finding and generic powered-oracle access must therefore not be conflated.

## Connections and limits

The toy grid $Q=16$ works cleanly because 4 divides it. It is too small for the generic rational-reconstruction guarantee at $N=15$; $Q=256$ would meet that condition. The example illustrates interference, not a proposed optimized cryptanalytic circuit.

[Shor factoring](/lessons/shor/) converts a successful order into factors using classical arithmetic. [Phase estimation](/lessons/phase-estimation/) provides another presentation: modular multiplication has eigenphases $s/r$. The two presentations expose the same periodic structure.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Peter W. Shor, [Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer](https://arxiv.org/html/quant-ph/9508027), sections 3–5: reversible modular exponentiation, Fourier sampling, rational reconstruction and retries.
- IBM Quantum Learning, [Shor's algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm): modular multiplication and the phase-estimation presentation.
