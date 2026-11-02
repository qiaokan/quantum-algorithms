## Problem and access model

A hidden bit string $s$ has $n$ bits. An oracle accepts another $n$-bit string $x$ and returns $f_s(x)=s\cdot x$, where the **binary dot product** means multiply matching bits, add, and keep the parity (the remainder modulo 2). For $s=101$ and $x=110$, it is $1(1)\oplus0(1)\oplus1(0)=1$. The goal is to return the entire string $s$, not merely classify the function. This is the Bernstein–Vazirani promise problem; [IBM develops it alongside Deutsch–Jozsa](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm#the-bernstein-vazirani-problem).

Assume a coherent reversible oracle $U_f|x,y\rangle=|x,y\oplus f_s(x)\rangle$. $y$ is one auxiliary bit. The promise that $f$ is linear over XOR is essential; a generic Boolean function is not described by a hidden $n$-bit string. The problem provider supplies this oracle. Our access does not include permission to inspect its circuit for the answer.

## Classical baseline

Query inputs with one bit set. For three bits, $f(100)=s_0$, $f(010)=s_1$, $f(001)=s_2$, using left-to-right indices $0,1,2$. This determines $s$ in three queries, and $n$ queries suffice generally. An exact classical deterministic algorithm needs $n$: $q$ binary answers provide at most $2^q$ transcripts to distinguish $2^n$ possible strings. Against a uniformly random hidden string, fewer than $n$ independent equations leave at least two equally possible answers. Thus constant-error worst-case classical recovery also needs order $n$ queries.

The quantum algorithm uses one coherent query plus order $n$ fixed gates. This is a linear-versus-constant query separation, not an exponential runtime improvement. We still have to output $n$ bits and implement the oracle.

## Fixed instance and preparation

Choose $n=3$, hidden $s=101$. Our input labels are ordered $000,001,010,011,100,101,110,111$. Their function answers are

$$\begin{array}{c|rrrrrrrr}x&000&001&010&011&100&101&110&111\\\hline
f_s(x)&0&1&0&1&1&0&1&0\end{array}.$$

A state vector has one amplitude per label; probabilities are squared magnitudes. Prepare input $|000\rangle$, target $|1\rangle$. Apply the [Hadamard](/definitions/matrix-multiplication/) $H=(1/\sqrt2)\left(\begin{smallmatrix}1&1\\1&-1\end{smallmatrix}\right)$ to every bit. Each input bit becomes $|+\rangle=(1,1)^T/\sqrt2$; target becomes $|-\rangle=(1,-1)^T/\sqrt2$.

The input tensor product therefore has eight entries, each $(1/\sqrt2)^3=1/\sqrt8$. It is

$$\frac1{\sqrt8}(1,1,1,1,1,1,1,1)^T\otimes|-\rangle.$$

The [tensor rule](/definitions/tensor-products/) multiplies one amplitude from each bit; it does not concatenate the vectors. The complete four-qubit state has 16 entries, paired $+1/4,-1/4$ for each input label. Total probability is $16(1/16)=1$.

## One query writes the pattern

An oracle flip on the target changes $|-\rangle$ to $-|-\rangle$; no flip leaves it unchanged. Thus the input after the single oracle is

$$|v\rangle=\frac1{\sqrt8}(1,-1,1,-1,-1,1,-1,1)^T.$$

The target still factors as $|-\rangle$. This reduction follows from $X(1,-1)^T=(-1,1)^T=-(1,-1)^T$, so it invokes no hidden measurement or extra gate. Probabilities on the input remain uniform, $1/8$ per label.

Unlike an arbitrary pattern of eight signs, these signs factor into three independent single-bit patterns:

$$|v\rangle=|-\rangle\otimes|+\rangle\otimes|-\rangle.$$

Expand to verify: multiplying $(1,-1)$ for the left bit by $(1,1)$ for the middle bit gives $(1,1,-1,-1)/2$. Multiplying each entry by $(1,-1)/\sqrt2$ gives exactly the eight-entry vector above. The two minus states occur exactly where $s$ has a 1.

This explains the mechanism: the promised parity oracle writes a separable relative-sign pattern that one Hadamard per input bit can read.

## Actual readout operations to the output

Apply $H$ to the left input bit. On an eight-entry vector it pairs indices differing in that bit: $(0,4),(1,5),(2,6),(3,7)$. Each pair $(a,b)$ becomes $((a+b)/\sqrt2,(a-b)/\sqrt2)$. Here the first pair is $(1,-1)/\sqrt8$, so its outputs are $(0,2/4)=(0,1/2)$. The four pairs give

$$\frac12(0,0,0,0,1,-1,1,-1)^T.$$

The left bit is now certainly 1. Apply $H$ to the middle input bit, pairing $(4,6)$ and $(5,7)$ in the nonzero part. Their entries are equal, so the differences vanish:

$$\frac1{\sqrt2}(0,0,0,0,1,-1,0,0)^T.$$

Finally apply $H$ to the right input bit. The remaining pair $(1,-1)/\sqrt2$ becomes $(0,1)$:

$$(0,0,0,0,0,1,0,0)^T=|101\rangle.$$

Measuring the three input bits returns 101 with probability 1. The target has not changed, and measuring it would add no information. Each displayed vector is the output of an actual gate; factoring into three kets earlier was only an algebraic rewrite.

<details>
<summary>Predict: omit the middle Hadamard in the readout.</summary>

The left and right bits are still 1, but the middle remains $|+\rangle$. The output is equally likely 101 or 111. Omitting a gate corresponding to a hidden zero does not leave a deterministic zero: the bit was prepared in a superposition.

</details>

## Why the promise makes the general algorithm work

For hidden bits $s_0,\ldots,s_{n-1}$, the sign on input $x$ obeys

$$(-1)^{s\cdot x}=\prod_{j=0}^{n-1}(-1)^{s_jx_j}.$$

Here $\prod$ means multiply one factor per bit, and a subscript selects a bit. Parity determines the sign because even powers of −1 are +1 and odd powers are −1. Thus after the oracle the input is a tensor product of $|+\rangle$ where $s_j=0$ and $|-\rangle$ where $s_j=1$. The rule $H|+\rangle=|0\rangle$, $H|-\rangle=|1\rangle$ then gives $|s\rangle$ exactly.

An equivalent cancellation calculation gives the amplitude of output $y$ as $2^{-n}\sum_x(-1)^{(s\oplus y)\cdot x}$. If $y=s$, every term is +1, giving amplitude 1. If $y\ne s$, pick a position where they differ. Pair each input $x$ with the same input with that bit flipped. The two terms have opposite signs and cancel, giving amplitude zero. This identifies the contributions to each output rather than claiming that all answers can be read simultaneously.

## Implementation, cost, and counterexamples

For the example, two CNOTs from input bits 0 and 2 into the target implement the oracle. For an $n$-bit string this construction uses one CNOT per hidden 1, up to $n$. The outer algorithm calls the full provided oracle once and uses $2n+1$ Hadamards plus target initialization and readout. One query is therefore not one elementary gate. The classical simulator scans amplitudes; this is an exponentially large representation in general, not a fast classical implementation of the oracle separation.

If the function is affine, $f(x)=s\cdot x\oplus b$ for one constant bit $b$, the extra factor $(-1)^b$ is global. The experiment still returns $s$ but does not return $b$. If $f(x)=x_0x_1$ for two inputs, the signs $(1,1,1,-1)/2$ do not factor into independent $+,-$ patterns. Applying two Hadamards yields $(1,1,1,-1)/2$ again: all four outputs occur. There is no promised hidden linear string to recover.

This exact algorithm shares the circuit of [Deutsch–Jozsa](/lessons/deutsch-jozsa/) but asks a different question. Deutsch–Jozsa only checks whether the readout is all-zero. [Simon](/lessons/simon/) must collect multiple samples of linear constraints; its output register is initialized differently and remains correlated with the input. Those distinctions prevent transferring the one-query recovery claim to every oracle problem.

## References

- John Watrous / IBM, [The Bernstein–Vazirani problem and its circuit analysis](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm#the-bernstein-vazirani-problem): promise, parity function, coherent-query recovery.
- John Watrous / IBM, [Multiple-system quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information): tensor notation. The 101 calculation uses this book's input-first ordering.
- Runnable example: `makeDemo('bernstein-vazirani', '5')` in `src/lib/demos.ts` (5 is binary 101); tests enumerate all eight hidden strings.
