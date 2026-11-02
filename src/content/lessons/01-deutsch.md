## Problem and access model

You are given access to a function $f$ that accepts one bit and returns one bit. The notation $f(0)$ means its answer on input 0. You do **not** know its two answers. Determine whether they are equal. Output 0 for equal (a **constant** function), 1 for different (a **balanced** function). This example introduces one precise way a quantum query can answer a question about two inputs without returning both answers. The oracle problem and circuit are established in [IBM's Deutsch lesson](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-algorithm).

| Function answers $f(0),f(1)$ | Class | Required output |
|---|---|---|
| 0, 0 | constant | 0 |
| 0, 1 | balanced | 1 |
| 1, 0 | balanced | 1 |
| 1, 1 | constant | 0 |

Our quantum access is a coherent, reversible operation called $U_f$, pronounced “U sub f.” It acts on two bits' worth of quantum state:

$$U_f|x,y\rangle=|x,y\oplus f(x)\rangle.$$

Here $x$ is the input bit, $y$ an auxiliary target, and $\oplus$ means XOR: equal bits give 0, different bits give 1. The input remains intact; the answer is XORed into the target. “Coherent” means the same circuit acts on amplitudes without first measuring $x$. This is a stronger interface than calling a conventional classical API. We will construct its four tiny possibilities explicitly below, rather than hiding two classical calls inside a wrapper.

## Classical baseline

A classical algorithm evaluates $f(0)$ and $f(1)$ and compares them: two queries. One answer cannot determine their equality. After observing $f(0)=0$, the unknown second answer could still be 0 or 1. For worst-case success strictly greater than $1/2$, one classical query is also insufficient: a uniformly random pair of truth-table entries leaves the parity completely unbiased after either entry is revealed.

Deutsch uses **one coherent oracle call**, plus fixed gates and one measured bit. This is a 2-to-1 exact query separation. It is not an exponential speedup, not a claim about elapsed hardware time, and not a procedure for recovering both function values. The rest of this lesson explains exactly where that one bit of information comes from.

## The few numbers we need

A qubit's state is a two-entry column of **amplitudes**. The labels $|0\rangle$ and $|1\rangle$ (“ket zero” and “ket one”) abbreviate the columns $(1,0)^T$ and $(0,1)^T$. The superscript $T$ means that the displayed row is written vertically. A general state $a|0\rangle+b|1\rangle$ means the column $(a,b)^T$. In this lesson every amplitude is real, so probabilities are simply $a^2$ and $b^2$; their sum must be 1. Later [complex amplitudes](/definitions/complex-numbers/) use squared magnitudes.

The minus sign in $-1/\sqrt2$ is allowed: squaring gives positive probability $1/2$. Here $\sqrt2$ is the positive number whose square is 2. We use this scale so two equal-magnitude amplitudes have total probability one.

Our main fixed gate is the **Hadamard**, named $H$:

$$H=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\qquad
H\begin{pmatrix}a\\b\end{pmatrix}=\begin{pmatrix}(a+b)/\sqrt2\\(a-b)/\sqrt2\end{pmatrix}.$$

A [matrix](/definitions/matrices/) is an array defining an operation. Each row multiplies the input column and adds: top output is $(1a+1b)/\sqrt2$, bottom is $(1a-1b)/\sqrt2$. This is the entire multiplication rule needed here. In particular,

$$H|0\rangle=\frac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}=|+\rangle,
\qquad H|1\rangle=\frac1{\sqrt2}\begin{pmatrix}1\\-1\end{pmatrix}=|-\rangle.$$

The symbols $+$ and $-$ inside these kets are names for these two states, not measured bit values. Apply $H$ again:

$$H|+\rangle=\frac12\begin{pmatrix}1+1\\1-1\end{pmatrix}=|0\rangle,
\qquad H|-\rangle=\frac12\begin{pmatrix}1-1\\1+1\end{pmatrix}=|1\rangle.$$

We needed this gate to turn a relative sign into a readable bit. We can now return to the algorithm: arrange for the hidden function to select which of those two sign patterns we have.

<details>
<summary>Predict before continuing: measure |+⟩ or |−⟩ immediately?</summary>

Both give 0 and 1 with probability $1/2$. The relative sign affects contributions in a **later operation**, not immediate probabilities. A final Hadamard is essential. Thinking that a minus sign is already the answer bit confuses an amplitude with an outcome.

</details>

## Fixed instance and preparation

For the worked example take $f(0)=0,f(1)=1$. We as readers know this setting to check the arithmetic; the algorithm only accesses it through $U_f$. Its desired answer is 1. Order the two registers as **input, target**, with basis labels $00,01,10,11$. The leftmost bit is most significant. Matrices act on columns; in a product $ABv$, operation $B$ acts first.

Prepare $|0\rangle|1\rangle=|01\rangle=(0,1,0,0)^T$. Starting from physical zero initialization, an $X$ gate on the target prepares 1. The bit-flip matrix is $X=\left(\begin{smallmatrix}0&1\\1&0\end{smallmatrix}\right)$: it exchanges the two entries.

Apply $H$ to the input, then to the target. The first step gives $(|01\rangle+|11\rangle)/\sqrt2$. The second gives $|+\rangle|-\rangle$. To combine independently prepared registers, form the [tensor product](/definitions/tensor-products/), meaning multiply each pair of amplitudes:

$$\begin{pmatrix}a\\b\end{pmatrix}\otimes\begin{pmatrix}c\\d\end{pmatrix}
=\begin{pmatrix}ac\\ad\\bc\\bd\end{pmatrix}.$$

Substituting $a=b=c=1/\sqrt2$, $d=-1/\sqrt2$ produces every entry:

$$|+\rangle|-\rangle
=\frac12\begin{pmatrix}1\cdot1\\1\cdot(-1)\\1\cdot1\\1\cdot(-1)\end{pmatrix}
=\frac12\begin{pmatrix}1\\-1\\1\\-1\end{pmatrix}
=\frac{|00\rangle-|01\rangle+|10\rangle-|11\rangle}{2}.$$

The four probabilities are each $1/4$. The notation is changing between columns and kets, but those equalities are not additional physical operations. We needed the tensor product to know the joint amplitudes entering the oracle. Return to that oracle now with this four-entry vector.

## The single function-dependent operation

For $f(0)=0,f(1)=1$, the oracle leaves target $y$ alone when input $x=0$, and flips it when $x=1$:

$$00\to00,\quad01\to01,\quad10\to11,\quad11\to10.$$

The corresponding matrix and full multiplication are

$$U_f=\begin{pmatrix}1&0&0&0\\0&1&0&0\\0&0&0&1\\0&0&1&0\end{pmatrix},\qquad
U_f\frac12\begin{pmatrix}1\\-1\\1\\-1\end{pmatrix}
=\frac12\begin{pmatrix}1\\-1\\-1\\1\end{pmatrix}.$$

For example, the third output row selects the old fourth entry: $0(1)+0(-1)+0(1)+1(-1)=-1$. Nothing was measured. Every probability remains $1/4$. Only signs changed.

Why did this encode anything useful? Flipping the target $|-\rangle$ gives

$$X\frac{|0\rangle-|1\rangle}{\sqrt2}
=\frac{|1\rangle-|0\rangle}{\sqrt2}
=-|-\rangle.$$

The input-1 branch consequently has the opposite sign from the input-0 branch. Factoring the joint output makes that visible:

$$\frac{|00\rangle-|01\rangle-|10\rangle+|11\rangle}{2}
=\frac{|0\rangle-|1\rangle}{\sqrt2}\otimes\frac{|0\rangle-|1\rangle}{\sqrt2}
=|-\rangle|-\rangle.$$

This factoring is the same state written compactly. No scalar physically moves between qubits. The name **phase kickback** describes this effect of a controlled operation on an eigenstate target; it does not add an unlisted gate. A relative minus sign is a relative [phase](/definitions/phase/).

## Interference and final output

Apply $H$ to the input only. In the full four-entry vector, it combines entries with the same target: $00$ with $10$, and $01$ with $11$. Those pairs are different routes to the **same** final basis label. Compute all four outputs:

$$\begin{aligned}
a'_{00}&=(a_{00}+a_{10})/\sqrt2=(1/2-1/2)/\sqrt2=0,\\
a'_{01}&=(a_{01}+a_{11})/\sqrt2=(-1/2+1/2)/\sqrt2=0,\\
a'_{10}&=(a_{00}-a_{10})/\sqrt2=(1/2+1/2)/\sqrt2=1/\sqrt2,\\
a'_{11}&=(a_{01}-a_{11})/\sqrt2=(-1/2-1/2)/\sqrt2=-1/\sqrt2.
\end{aligned}$$

Here $a_{xy}$ denotes the amplitude of label $xy$ before this gate, and the prime $'$ denotes its value after it. The final state is $(0,0,1,-1)^T/\sqrt2=|1\rangle|-\rangle$. Measuring only the input yields

$$P(\text{input}=0)=0^2+0^2=0,\qquad
P(\text{input}=1)=(1/\sqrt2)^2+(-1/\sqrt2)^2=1.$$

The target is still $|-\rangle$; its random measurement is irrelevant. The useful change was conversion of the function-dependent relative sign into an input label. The equal-but-opposite contributions canceled for both input-0 labels, and reinforced for input-1 labels. That is the complete interference calculation, not an appeal to “trying both values in parallel.”

## Why all four functions work

If $f(x)=0$, the target branch is unchanged; if $f(x)=1$, it is negated. After the single query, the joint state therefore factors as

$$\frac{(-1)^{f(0)}|0\rangle+(-1)^{f(1)}|1\rangle}{\sqrt2}\otimes|-\rangle.$$

The exponent is either 0 or 1: $(-1)^0=1$, $(-1)^1=-1$. After the last input Hadamard, the two input amplitudes are the half-sum and half-difference of those signs:

$$\alpha_0=\frac{(-1)^{f(0)}+(-1)^{f(1)}}2,\qquad
\alpha_1=\frac{(-1)^{f(0)}-(-1)^{f(1)}}2.$$

| Answers | Input after query | Input after final $H$ | Measured answer |
|---|---|---|---|
| 00 | $|+\rangle$ | $|0\rangle$ | 0 |
| 01 | $|-\rangle$ | $|1\rangle$ | 1 |
| 10 | $-|-\rangle$ | $-|1\rangle$ | 1 |
| 11 | $-|+\rangle$ | $-|0\rangle$ | 0 |

A minus sign on the **entire state** is global phase; squaring amplitudes erases it, and any later fixed linear operation preserves its global character. Thus 01 and 10 cannot be distinguished by this experiment. It computes their common parity and intentionally does not learn which balanced function you have.

## Implementation and honest cost

For these tiny functions, the oracle constructions are: identity for 00; $X$ on target for 11; CNOT from input to target for 01; CNOT plus $X$ on target for 10. The last case has **two function-dependent elementary gates**, despite being one call to the specified oracle. The fixed part uses initial target $X$, two preparation Hadamards, one readout Hadamard, and input measurement. A device compiler may decompose CNOT differently on a particular native gate set.

If the oracle is given as a classical truth table, someone must read that table to build the quantum circuit. The algorithm's query comparison assumes the required coherent interface is already supplied; it does not hide construction costs. The browser simulator uses classical loops to apply the oracle permutation and is not itself a quantum computer. Every demonstrated run is ideal, with no device noise or error-correction overhead. In that ideal model success is exactly 1; hardware errors would invalidate that guarantee.

The underlying pattern generalizes, but the two-entry exact cancellation is special. [Bernstein–Vazirani](/lessons/bernstein-vazirani/) uses a structured sign pattern to recover several hidden bits. [Deutsch–Jozsa](/lessons/deutsch-jozsa/) asks whether a longer truth table is constant or balanced, under a promise. [Grover](/lessons/grover/) uses a sign change plus a different mixing operation to amplify a marked label.

## Misunderstandings and prediction checks

<details>
<summary>What if the target is prepared in |+⟩ instead of |−⟩?</summary>

$X|+\rangle=|+\rangle$, so every function acts identically on it. The input stays $|+\rangle$ and the final $H$ always yields 0, incorrectly reporting constant for balanced functions. A superposition alone does not supply useful information; the chosen target eigenvalue is essential.

</details>

<details>
<summary>What if we measure the input immediately after the oracle?</summary>

Its amplitudes have equal magnitude, so every function gives a uniform input bit. The measurement destroys the relative-phase information needed for the last Hadamard. Reapplying $H$ to a measured basis state gives random outcomes, not a recovery of the lost sign.

</details>

<details>
<summary>Why not inspect the full four-entry state to read the answer earlier?</summary>

The simulator can display it because it stores all amplitudes in classical memory. Quantum hardware does not expose a state-vector read API. Reconstructing a state requires many preparations and measurements in different bases. The one-query guarantee is about this specific final measurement.

</details>

## References

- John Watrous / IBM, [Deutsch's algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-algorithm): problem, coherent circuit, and exact query distinction. This book uses input-first register ordering; the linked lesson uses Qiskit's displayed ordering.
- John Watrous / IBM, [Single-system quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information): amplitude, normalization, unitary and measurement conventions.
- John Watrous / IBM, [Multiple-system quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information): joint states and tensor products.
- Runnable implementation: `src/lib/quantum.ts` and `src/lib/demos.ts`; the site's test suite checks all four functions and intermediate normalization. The example above was derived entry by entry, independently of simulator output.
