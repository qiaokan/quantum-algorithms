## Problem and access model

A function $f$ takes an $n$-bit input and returns one bit. It is **promised** to be either constant (all answers agree) or balanced (exactly half are zero). Determine which. For two input bits, the table 0000 is constant and 0110 is balanced; the table 0001 satisfies neither case. The promise restricts which inputs the algorithm must solve. It is not something the one-query circuit verifies.

Assume coherent access $U_f|x,y\rangle=|x,y\oplus f(x)\rangle$. The auxiliary target is initialized to $|-\rangle=(|0\rangle-|1\rangle)/\sqrt2$, converting the oracle to a sign $(-1)^{f(x)}$ on each input amplitude. The specified problem and deterministic quantum decision rule are documented in [IBM's Deutsch–Jozsa lesson](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm).

## A fair classical comparison

An exact deterministic classical algorithm may see $2^{n-1}$ identical answers and still be unable to distinguish constant from balanced. One further query settles it, so its worst-case requirement is $2^{n-1}+1$. This explains the well-known exact query separation from one quantum call.

It does **not** establish an exponential separation against bounded-error randomized classical algorithms. Query $k$ independent uniformly random inputs. Declare balanced if any answers differ; otherwise guess constant. A constant function is always classified correctly. On a balanced function, the chance that all answers are zero is $2^{-k}$ and that all are one is another $2^{-k}$, giving error $2^{1-k}$. Eleven queries give error $1/1024$, regardless of $n$. The quantum guarantee is exact in the ideal model; the classical randomized baseline has a small stated error.

## Fixed instance and preparation

Take two input bits, label order 00,01,10,11, and $f(x_0x_1)=x_0\oplus x_1$. The table is $(0,1,1,0)$, balanced. Initialize $|00\rangle|1\rangle$ and apply Hadamard $H$ to each of the three qubits. $H$ maps $(a,b)^T$ to $((a+b)/\sqrt2,(a-b)/\sqrt2)^T$. Thus the input becomes the uniform state, written $|u\rangle$, and the target becomes $|-\rangle$:

$$|u\rangle|-\rangle=\frac12(1,1,1,1)^T\otimes\frac1{\sqrt2}(1,-1)^T.$$

The tensor product multiplies each input entry by each target entry, giving eight amplitudes of magnitude $1/(2\sqrt2)$. Their probabilities add to $8(1/8)=1$. Input-first register ordering is used throughout.

After the oracle, the input factors from the unchanged target as

$$|v\rangle=\frac12(1,-1,-1,1)^T.$$

This follows because target flip $X$ maps $(1,-1)^T$ to its negative. The function values 1 on 01 and 10 negate those two input amplitudes; every input probability remains $1/4$.

## Readout with all intermediate terms

Apply $H$ to the left input bit. Pair amplitudes 00 with 10, and 01 with 11:

$$a'_{00}=(1/2-1/2)/\sqrt2=0,\quad
 a'_{01}=(-1/2+1/2)/\sqrt2=0,$$

$$a'_{10}=(1/2+1/2)/\sqrt2=1/\sqrt2,\quad
 a'_{11}=(-1/2-1/2)/\sqrt2=-1/\sqrt2.$$

Here the prime denotes the value after this gate. Apply $H$ to the right input bit. Its only nonzero input pair is $(1,-1)^T/\sqrt2$, which gives $(0,1)^T$. The final input state is $|11\rangle$. Measure: 11 occurs with probability 1; since at least one bit is 1, output **balanced**.

Why is the final label 11 rather than the output bit 1? The circuit returns an $n$-bit string. A **classical** postprocessing step checks whether any bit is 1. In this example the oracle happens also to satisfy the Bernstein–Vazirani promise with hidden string 11, so the same circuit recovers that string. Other balanced functions need not give a single deterministic nonzero label.

For the constant-zero table, the oracle changes nothing. After the first readout $H$, the input becomes $(1,1,0,0)^T/\sqrt2$; after the second it is $(1,0,0,0)^T=|00\rangle$. Constant one only adds a global minus sign. Both are classified as constant.

## Why zero distinguishes the promised cases

Write $N=2^n$ for the number of labels. After the oracle, input $x$ has amplitude $(-1)^{f(x)}/\sqrt N$. A Hadamard on all $n$ bits contributes $+1/\sqrt N$ from **every** input label to output $0^n$ (the all-zero string). Therefore

$$a_{0^n}=\frac1N\sum_x(-1)^{f(x)}.$$

The sum symbol $\sum_x$ means add one term for each input. For constant zero, there are $N$ positive ones: amplitude 1. For constant one, $N$ negative ones: amplitude −1. Both yield all-zero probability 1. For balanced functions there are $N/2$ of each sign: amplitude $(N/2-N/2)/N=0$. The other outputs together have total probability 1 by normalization, so the result cannot be all-zero.

That is the entire decision argument. It relies on one specific output's complete cancellation, not on recovering all $N$ values. The full amplitude of a general output $y$ is $N^{-1}\sum_x(-1)^{f(x)+x\cdot y}$, where $x\cdot y$ is binary parity of matching 1s. For nonzero $y$ we do not need to know its exact value to classify a balanced function.

## Break the promise deliberately

Use the table $(0,0,0,1)$, which is neither constant nor balanced. After the oracle the input is $(1,1,1,-1)^T/2$. After the left Hadamard it is $(1/\sqrt2,0,0,1/\sqrt2)^T$; after the right Hadamard it is $(1,1,1,-1)^T/2$. Each label has probability $1/4$. In particular, the circuit reports constant with probability $1/4$ although the function is nonconstant.

The formula predicts it: $a_{00}=(1+1+1-1)/4=1/2$, so $P(00)=1/4$. This is not a bug in the promise algorithm. It is a counterexample to applying its guarantee without checking the promise is part of the problem specification. The demonstration includes this instance explicitly.

<details>
<summary>Predict: what changes if every function answer is complemented?</summary>

Every oracle sign is negated, so the entire post-query input vector gains global phase −1. All final probabilities are unchanged. Balanced remains balanced; constant zero and constant one swap. This experiment is designed to distinguish the classes, not functions within a class.

</details>

## Implementation and end-to-end cost

Preparation uses $n+1$ Hadamards plus initialization; readout uses $n$ more, followed by $n$ measured bits and a classical OR. The coherent oracle is called once. For the two-bit parity example, two [CNOTs](/definitions/controlled-gates/) into the target implement it. For the broken-promise AND example, one Toffoli (a NOT controlled by two bits) implements it. Those are different function-dependent circuits; the outer algorithm is the same.

An arbitrary promised truth table can still have an expensive reversible implementation. One coherent call to a large circuit is not constant gate cost, nor is storing $2^n$ table entries free. The theoretical ideal exactness assumes exact operations and no noise; it is distinct from a measured hardware success rate. The classical simulator enumerates amplitudes, so its exponential memory is not an implementation of a quantum advantage on a classical CPU.

Compared with [Deutsch](/lessons/deutsch/), the equality question became a promise about the entire table. Compared with [Bernstein–Vazirani](/lessons/bernstein-vazirani/), the same physical circuit uses a different promise and interprets its output differently. [Simon](/lessons/simon/) will encode pairwise equal outputs in entanglement instead of using a one-bit $|-\rangle$ target, and needs repeated samples plus classical equations.

## References

- John Watrous / IBM, [The Deutsch–Jozsa algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm): promise, circuit, Fourier-amplitude analysis, related Bernstein–Vazirani problem.
- John Watrous / IBM, [Deutsch's algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-algorithm): one-bit sign mechanism reused here.
- The randomized classical calculation above is derived explicitly for independent uniform input samples; it is not an empirical performance claim.
- Runnable example: `makeDemo('deutsch-jozsa', 'balanced')`, with additional `zero`, `one`, and `broken` settings. Tests check the promised cases and the broken-promise distribution separately.
