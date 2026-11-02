## Problem and access model

There are four candidate labels: 00, 01, 10, 11. Exactly one is marked as the answer. You can test a candidate with a predicate $f$: marked means $f(x)=1$, unmarked means $f(x)=0$. The goal is to output the marked label. The label is hidden from the algorithm; the worked instance and demonstration controls reveal it to the reader so we can check the mechanism.

For the quantum algorithm, assume a coherent **phase [oracle](/definitions/oracles/)** $O_f$. Here $|x\rangle$ (“ket x”) names the basis state for label $x$; a state attaches an amplitude to every label, as set out in [State and gate conventions](#state-and-gate-conventions) below:

$$O_f|x\rangle=(-1)^{f(x)}|x\rangle.$$

It negates the amplitude of each marked label and leaves the others unchanged. This is not a bit flip. If instead we are supplied the reversible value oracle $|x,y\rangle\mapsto|x,y\oplus f(x)\rangle$, an auxiliary target in $(|0\rangle-|1\rangle)/\sqrt2$ implements this phase action, as in [Deutsch](/lessons/deutsch/). That auxiliary register is unchanged and omitted from our four-entry calculation. The search algorithm originates in [Grover's 1996 paper](https://arxiv.org/abs/quant-ph/9605043).

## Classical baseline

Test candidates one at a time until one is marked. Under the exactly-one promise, after three failures among four labels, the fourth can be inferred without another query. For $N$ unstructured labels, exact worst-case search uses $N-1$ queries with this promise; bounded-error search still requires order $N$ queries for a constant success probability. Structured alternatives matter: if the labels belong to a sorted array, classical binary search is a different, stronger baseline than a linear scan.

Grover gives order $\sqrt N$ coherent predicate queries for constant success probability in unstructured search. It does not build the predicate, load an arbitrary database, or make every search problem quadratic faster in elapsed time. The four-item example below is unusually clean: one iteration finds the answer with **certainty**. General sizes need a stopping rule and usually have residual failure probability. [IBM's Grover course](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/grover-algorithm/introduction) places the query gain in that context.

## State and gate conventions

This lesson can be read independently. A state is a column of amplitudes, one per possible label; probabilities are their squared magnitudes. For our real amplitudes, $P(x)=a_x^2$. Basis order is 00, 01, 10, 11, with left bit most significant. For example $|10\rangle=(0,0,1,0)^T$. The vertical ket brackets name a basis vector; they do not denote absolute values.

The Hadamard gate is

$$H=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\qquad
H(a,b)^T=((a+b)/\sqrt2,(a-b)/\sqrt2)^T.$$

Each output is one row times the input column. $H|0\rangle=(1,1)^T/\sqrt2$. To combine independently prepared bits, multiply amplitude pairs: $(a,b)^T\otimes(c,d)^T=(ac,ad,bc,bd)^T$. Therefore applying $H$ to both zero bits prepares

$$|s\rangle=H\otimes H|00\rangle
=\frac12(1,1,1,1)^T.$$

The symbol $\otimes$ is a [tensor product](/definitions/tensor-products/), and $s$ is just the name for this uniform state. All four probabilities are $1/4$; total probability is $4(1/4)=1$. We needed the small state model to track where information can enter. Preparation is independent of the unknown marked label.

## Mark 10 and calculate every operation

Fix the hidden marked label to 10. Its oracle is

$$O_f=\operatorname{diag}(1,1,-1,1).$$

“diag” means a matrix with those diagonal entries and zeros elsewhere. It multiplies entries individually. Its action on our prepared state is

$$\frac12(1,1,1,1)^T\ \xrightarrow{O_f}\ \frac12(1,1,-1,1)^T.$$

Probabilities are still $(1/4,1/4,1/4,1/4)$. Measuring now would gain nothing. We need an operation that makes this sign change affect a probability.

Let $a_x$ be the amplitude of label $x$, and let $\bar a$ denote the **arithmetic mean**, not a complex conjugate in this lesson:

$$\bar a=\frac{a_{00}+a_{01}+a_{10}+a_{11}}4
=\frac{1/2+1/2-1/2+1/2}{4}=\frac14.$$

The fixed **diffusion** operation maps each amplitude to $2\bar a-a_x$. Compute every entry:

$$\begin{array}{c|c|c}
 x & a_x\text{ after oracle} & 2\bar a-a_x\\\hline
00&1/2&1/2-1/2=0\\
01&1/2&1/2-1/2=0\\
10&-1/2&1/2-(-1/2)=1\\
11&1/2&1/2-1/2=0
\end{array}$$

The output is $(0,0,1,0)^T=|10\rangle$. Measurement yields 10 with probability $1^2=1$. We have completed the algorithm: uniform preparation, one sign oracle, one diffusion, one measurement.

The marked label determined **which amplitude became negative**. Diffusion did not know the answer. It applied the same formula to every entry, using cancellation to eliminate the three unmarked contributions. This is why the initial probabilities being unchanged was not a contradiction: the sign mattered to the next operation's sums.

## Diffusion is a fixed quantum gate

The mean rule may sound like a program reading the amplitudes. Quantum hardware cannot read those amplitudes for free. We must show a single fixed matrix produces the rule without inspecting the state.

Each new amplitude is half the sum of all four old amplitudes, minus its own old value. Thus

$$D=\frac12\begin{pmatrix}
-1&1&1&1\\
1&-1&1&1\\
1&1&-1&1\\
1&1&1&-1
\end{pmatrix}.$$

For example the 10 output is

$$\frac12(a_{00}+a_{01}-a_{10}+a_{11})
=\frac12(1/2+1/2+1/2+1/2)=1.$$

The 00 output is $\frac12(-1/2+1/2-1/2+1/2)=0$. Each cancellation is a sum of contributions **to one output amplitude**, not subtraction of probabilities.

A valid deterministic gate preserves vector length. Here rows have squared length $4(1/4)=1$; distinct rows have [inner product](/definitions/inner-products/) zero, since their four products contain two $+1/4$ and two $-1/4$. Therefore $D^TD=I$: it is [unitary](/definitions/unitarity/). Superscript $T$ transposes a real matrix. For complex matrices the corresponding condition uses conjugate transpose $\dagger$.

<details data-derivation>
<summary>Show algebra: why “reflection about the uniform state” means this matrix</summary>

The [outer product](/definitions/outer-products/) $|s\rangle\langle s|$ is the column $s$ multiplied by its transposed row. Every entry is $(1/2)(1/2)=1/4$. Therefore $2|s\rangle\langle s|-I$ has off-diagonal entries $1/2$ and diagonal entries $1/2-1=-1/2$, precisely $D$.

It preserves the uniform direction: $D|s\rangle=|s\rangle$. A vector whose entries sum to zero has mean zero, so $Dv=-v$. Preserving one direction and negating the perpendicular directions is a reflection. This geometric name follows from the arithmetic; it is not an additional assumption.

</details>

Return to the actual algorithm: $D$ is a fixed gate that transforms the sign written by the oracle into a concentrated output probability.

## A circuit for diffusion

Define $S_0=\operatorname{diag}(1,-1,-1,-1)$: it preserves 00 and negates every other label. Then

$$D=(H\otimes H)S_0(H\otimes H).$$

Operations act right-to-left: two Hadamards, then $S_0$, then two more Hadamards. Since $(H\otimes H)|00\rangle=|s\rangle$, this is the zero-state reflection expressed around the uniform direction. We can also verify it without assuming the reflection formula: $H\otimes H$ has rows $(1,1,1,1)$, $(1,-1,1,-1)$, $(1,1,-1,-1)$, and $(1,-1,-1,1)$, each divided by 2. Multiplication with the sign diagonal gives the displayed $D$.

A [controlled](/definitions/controlled-gates/)-$Z$ gate negates only 11. Surround it by $X$ on both qubits to negate only 00: this realizes $\operatorname{diag}(-1,1,1,1)=-S_0$. The resulting diffusion is $-D$, physically equivalent here because it differs by a global minus sign. For larger search registers, the zero-state phase flip uses a multi-controlled operation decomposed into elementary gates and workspace. These gates are fixed; the marked predicate is the function-dependent component.

For the toy oracle marking 10, conjugate a controlled-$Z$ by $X$ on the right bit. This flips label 10 to 11 before the controlled phase, then restores it. Teaching a specific oracle implementation does not mean the algorithm knows the marked label: an external problem provider supplies that circuit.

## More iterations can destroy success

One **Grover iteration** is oracle then diffusion. The first produced $|10\rangle$. What if we run another?

The second oracle negates that amplitude, giving $(0,0,-1,0)^T$. The mean is $-1/4$. Diffusion gives

$$(-1/2,-1/2,1/2,-1/2)^T.$$

All outcomes now have probability $1/4$ again. A third oracle gives $(-1/2,-1/2,-1/2,-1/2)^T=-|s\rangle$. Its mean is $-1/2$, so diffusion leaves it unchanged: success remains $1/4$. A fourth iteration gives $-|10\rangle$, restoring certain success.

This oscillation is a direct counterexample to “more amplification always helps.” The simulator includes three iterations so you can see it. It computes each transition; it does not select a different prewritten answer for each button.

## General size and stopping rule

Now let $N$ be the total number of labels and assume one is marked. With $n$ qubits and $N=2^n$, Hadamards prepare amplitude $1/\sqrt N$ everywhere. After one oracle call, the mean is $(N-2)/(N\sqrt N)$. Diffusion gives

$$a_{\rm marked}=\frac{3N-4}{N\sqrt N},\qquad
a_{\rm unmarked}=\frac{N-4}{N\sqrt N}.$$

For $N=4$ this is 1 and 0, explaining why our tiny case is exact. For $N=8$ the marked amplitude is $5/(4\sqrt2)$ and success probability $25/32$, while each unmarked amplitude is $1/(4\sqrt2)$ with probability $1/32$. Their probabilities sum to $(25+7)/32=1$. One query is no longer enough for certainty.

The whole evolution stays in two directions: the equal superposition of marked labels and the equal superposition of unmarked labels. If there are $M$ marked labels, define an angle $\theta$ by $\sin\theta=\sqrt{M/N}$. Sine gives the vertical coordinate of a point on the unit circle; the local [trigonometry explanation](/definitions/trigonometry/) derives this and the angle-addition identities. Two reflections rotate the state by $2\theta$ per iteration. After $r$ iterations,

$$P(\text{success})=\sin^2((2r+1)\theta).$$

Here $r$ is the number of oracle-plus-diffusion pairs, not the number of individual gates. A suitable integer is near $\pi/(4\theta)-1/2$, giving $O(\sqrt{N/M})$ queries when the marked fraction is small. For our $M=1,N=4$, $\theta=\pi/6$, so $r=0,1,2,3$ gives probabilities $1/4,1,1/4,1/4$, matching the explicit calculations.

[General amplitude amplification](/lessons/amplitude-amplification/) derives the two-dimensional rotation. [BBHT search](/lessons/bbht-search/) handles unknown solution counts; [fixed-point amplification](/lessons/fixed-point-amplification/) changes the reflections to avoid this overshoot under an explicit lower-bound assumption. These are needed extensions, not details that can be silently assumed away.

## End-to-end limitations and predictions

A reversible predicate may be expensive. Searching all $n$-bit strings still needs about $2^{n/2}$ oracle calls: this is exponential in $n$, despite being quadratic faster than $2^n$. A million times fewer queries can still lose to classical hardware once oracle construction and fault tolerance are counted. If no item is marked, repeated iterations leave the uniform state unchanged; a measured candidate must be classically verified rather than declared a solution.

If a candidate has additional exploitable structure, compare against the best appropriate classical algorithm. Grover's oracle lower-bound comparison does not prove optimality for SAT, routing, database indexing, or every optimization task. Noise and finite precision are absent from the ideal derivation and simulator. The exact four-label case should not be presented as evidence of physical performance.

<details>
<summary>Predict: move the mark from 10 to 01. What must change?</summary>

Only the oracle sign location changes. Preparation and $D$ are identical. The mean after the first oracle is still $1/4$, so the marked 01 amplitude becomes 1 and all others 0. If the diffusion circuit had to be rebuilt for each mark, we would have smuggled the answer into a supposedly fixed operation.

</details>

<details>
<summary>Predict: mark two of the four labels. Does one standard iteration guarantee a marked output?</summary>

No. After the sign flip the mean is zero, so diffusion negates all four amplitudes. Their magnitudes remain $1/2$, and the marked-set probability remains $1/2$. Here $\theta=\pi/4$ and $\sin^2(3\pi/4)=1/2$. Other phase schedules can change this behavior; the one-mark exact argument cannot be reused unchanged.

</details>

**Where Grover continues.** Lessons 03–05 return to Deutsch's sign trick with more input bits. Grover's rotation picture is generalized in lesson 06, [amplitude amplification](/lessons/amplitude-amplification/).

## References

- Lov K. Grover, [A fast quantum mechanical algorithm for database search](https://arxiv.org/abs/quant-ph/9605043): original search construction and inversion about the average.
- John Watrous / IBM, [Grover's algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/grover-algorithm/introduction): query advantage and practical-comparison caveats.
- John Watrous / IBM, [Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information): state-vector and gate conventions. This chapter supplies its own entry-by-entry example.
- Runnable implementation: `markedOracle`, `diffusion`, and `makeDemo` in the local TypeScript sources. Tests enumerate every marked position and check probabilities after each iteration, separately from global-phase-equivalent state comparisons.
