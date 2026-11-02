## Problem and access model

A function $f$ maps $n$ input bits to $n$ output bits. There is an unknown **nonzero** mask $s$ such that two inputs have the same output exactly when they are equal or differ by XOR with $s$:

$$f(x)=f(x')\quad\Longleftrightarrow\quad x'=x\ \text{or}\ x'=x\oplus s.$$

The prime on $x'$ marks another input, not a derivative. $\Longleftrightarrow$ means both directions of the assertion must hold. Each distinct output therefore labels one pair. Find $s$. This lesson treats the nonzero two-to-one promise; the broader formulation also allows the one-to-one case $s=0$, which requires a different stopping/verification decision. [IBM's Simon lesson](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm) gives both formulations.

Assume coherent access $U_f|x,y\rangle=|x,y\oplus f(x)\rangle$, where $y$ now has $n$ bits. The output is XORed bit by bit. Keeping the input makes this reversible despite $f$ being two-to-one. Unlike Deutsch, the output register begins in **zero**, not a minus state. We will use correlations between inputs sharing an output.

## Classical baseline and the different separation

A classical method samples inputs until it observes a repeated function value from two distinct inputs, then XORs their labels to get $s$. With $2^{n-1}$ pairs hidden in an unstructured oracle, finding such a collision takes order $2^{n/2}$ samples for constant success probability. This birthday-style scaling is the relevant randomized oracle baseline. Quantum Fourier samples need order $n$ oracle calls, plus polynomial classical linear algebra.

This is an exponential separation in the specified oracle model, including a bounded-error randomized comparison. It does not imply that every explicit implementation of $f$ is classically hard: the representation may reveal $s$. Our small simulator function is deliberately easy to inspect. The point is the sampling mechanism, not a commercial application or an unqualified exponential runtime claim.

## Fixed three-bit instance

Take $s=011$ and define $f(x)=\min(x,x\oplus011)$ using the ordinary integer ordering of the binary labels. This gives a concrete oracle that satisfies the promise:

| Input $x$ | Output $f(x)$ | Paired input |
|---|---|---|
| 000 | 000 | 011 |
| 001 | 001 | 010 |
| 010 | 001 | 001 |
| 011 | 000 | 000 |
| 100 | 100 | 111 |
| 101 | 101 | 110 |
| 110 | 101 | 101 |
| 111 | 100 | 100 |

For example $101\oplus011=110$, and both map to 101. No other inputs map to 101. This construction is used only to generate a small illustrative promise oracle; the hidden mask in its source code is not access given to the algorithm.

Prepare $|000\rangle|000\rangle$, first input then output. Basis order is binary ascending, with the input bits more significant. Apply one Hadamard $H=(1/\sqrt2)\left(\begin{smallmatrix}1&1\\1&-1\end{smallmatrix}\right)$ to each input bit. This creates eight input amplitudes $1/\sqrt8$, with output still 000. Apply the oracle once:

$$\frac1{\sqrt8}\bigl(
|000,000\rangle+|001,001\rangle+|010,001\rangle+|011,000\rangle+
|100,100\rangle+|101,101\rangle+|110,101\rangle+|111,100\rangle\bigr).$$

A comma separates registers, not tensor factors inside a number. Each displayed term has probability $1/8$. The state is entangled: output labels record which pair the input belongs to. We cannot simply drop them and add all eight input amplitudes into a pure state.

## Condition on one output to see the mechanism

For the derivation, measure the output and suppose it is 000. Only two terms remain. Their total probability is $2/8=1/4$. Divide their amplitudes by $\sqrt{1/4}=1/2$ to normalize the retained branch:

$$|\phi\rangle=\frac{|000\rangle+|011\rangle}{\sqrt2}.$$

This is [conditional probability](/definitions/conditional-probability/) applied to amplitudes. We did not make this output certain; it was one of four equally likely pair labels. The input state has two equal amplitudes separated by the unknown XOR mask.

Now apply $H$ to the left input bit. Since both terms start with 0, each splits into two positive terms:

$$\frac12(|000\rangle+|100\rangle+|011\rangle+|111\rangle).$$

Apply $H$ to the middle bit. The terms with middle 0 split with signs $+,+$; those with middle 1 split with signs $+,-$. In binary order, the resulting amplitudes are

$$\frac1{2\sqrt2}(1,1,1,-1,1,1,1,-1)^T.$$

For example $|011\rangle/2$ becomes $(|001\rangle-|011\rangle)/(2\sqrt2)$. Apply $H$ to the right bit. Each adjacent pair is $(1,1)/(2\sqrt2)$ or $(1,-1)/(2\sqrt2)$. The outputs are respectively $(1/2,0)$ or $(0,1/2)$:

$$\frac12(1,0,0,1,1,0,0,1)^T
=\frac{|000\rangle+|011\rangle+|100\rangle+|111\rangle}{2}.$$

Measurement returns one of these four labels, each with probability $1/4$. The allowed labels $y$ all satisfy $y\cdot s=0$, where the dot product is the parity of matching bit products. Here $s=011$, so it requires the last two bits of $y$ to agree.

## Why every output pair gives the same constraint

For a pair $x,x\oplus s$, the Hadamards give output $y$ an amplitude

$$\frac{(-1)^{x\cdot y}+(-1)^{(x\oplus s)\cdot y}}{\sqrt{2\cdot2^n}}
=\frac{(-1)^{x\cdot y}\left(1+(-1)^{s\cdot y}\right)}{\sqrt{2^{n+1}}}.$$

The factor $(-1)^{x\cdot y}$ is ±1 and does not affect probability. If $s\cdot y=1$, the bracket is $1-1=0$: the two paths to the same output cancel. If $s\cdot y=0$, it is 2, giving squared amplitude $4/2^{n+1}=1/2^{n-1}$. Exactly $2^{n-1}$ labels satisfy this constraint for nonzero $s$.

For a second concrete pair, $x=001,x\oplus s=010$, the allowed outputs remain 000,011,100,111; their amplitudes are $(+,-,+,-)/2$. Those different relative signs do not change the measured distribution. Consequently, the algorithm need not record or even measure the output register. Ignoring it gives a mixture over pairs with the **same** input-outcome probabilities. The simulator retains the full joint state and sums output-register probabilities to compute this marginal; it does not pretend the input is an isolated pure state.

## Complete the classical linear-equation step

One sample is generally not enough. Suppose three independent circuit runs yield $y=000$, then 100, then 011. Each row supplies an equation $y\cdot s=0$. Write the unknown bits as $s_0,s_1,s_2$:

$$\begin{array}{c|c}
y&\text{equation}\\\hline
000&0=0\quad\text{(no information)}\\
100&s_0=0\\
011&s_1\oplus s_2=0
\end{array}$$

The last equation requires $s_1=s_2$. Thus the candidates are 000 and 011. The promise says nonzero, so $s=011$. This is the final answer, reached by classical postprocessing after quantum sampling.

If the samples were instead 111 and 011, XOR the rows: $111\oplus011=100$. Their equations become the same independent pair above. This is Gaussian elimination over bits: adding equations means XORing their rows, and $1+1=0$ modulo 2. [Binary linear algebra](/definitions/binary-linear-algebra/) works another elimination example.

The sample order is random; no circuit guarantees those rows appear in that order. For three bits, after a first nonzero row there is probability $1/2$ that a new row lies outside its two-element span. More generally, after $k$ independent rows, their span has $2^k$ elements inside a space of size $2^{n-1}$, so the probability of gaining rank is $1-2^{k-(n-1)}$. Expected runs to reach rank $n-1$ are order $n$. A fixed budget of $n+O(\log(1/\delta))$ makes failure at most a chosen small $\delta$; insufficient rank should be reported and more samples taken, not guessed away.

## Implementation, cost, and limitations

Each run uses $n$ input Hadamards before and after the oracle, $2n$ qubits for equal input/output widths, and one oracle call. Straightforward binary elimination uses polynomial classical work, for example $O(n^3)$ elementary bit operations without bit-parallel optimization. A full application also pays for the reversible oracle circuit and workspace cleanup. The output register need not be uncomputed before final input measurement; its correlations are the point of this algorithm.

With a nonzero-mask promise, rank $n-1$ leaves a unique nonzero solution. Without that promise, finite samples alone cannot certify $s=0$ with certainty; use the full variant's failure analysis and verification. A function with larger collision sets or accidental collisions need not yield this one-dimensional hidden-mask structure. If the oracle uses noise, forbidden outcomes can occur, and ordinary exact XOR elimination may become inconsistent. The ideal theorem does not include a robust noisy solver.

<details>
<summary>Predict: would preparing the output in a product of |−⟩ states improve the algorithm?</summary>

That changes the oracle into a phase based on the parity of the entire output string, losing the distinct pair labels used above. Different output encodings can alter that parity arbitrarily while keeping the Simon promise. The pair-state cancellation argument no longer applies. Reusing Deutsch's target blindly changes the problem information retained.

</details>

<details>
<summary>Predict: is a sample y = 011 already the hidden answer?</summary>

It happens to equal our chosen mask, but that coincidence is irrelevant. It supplies only $s_1=s_2$, also satisfied by 100 and 111. Other valid masks can have odd parity and cannot themselves be a sample because $s\cdot s=1$. The sample is a constraint, not the mask.

</details>

## Module connection: signs versus equal-output pairs

Deutsch recovered a single parity by arranging two signs; Bernstein–Vazirani made a whole separable sign pattern; Deutsch–Jozsa tested cancellation at the all-zero label. Simon uses equal-output **pairs**, giving random labels constrained by a hidden mask. In the worked instance, 000 is a valid uninformative sample, whereas Deutsch's final measured bit was always the answer. The common device is adding contributions to one outcome, but the information obtained and classical postprocessing are different.

Later [order finding](/lessons/order-finding/) replaces XOR-separated pairs with integer-periodic sequences. [The abelian hidden-subgroup framework](/lessons/abelian-hidden-subgroup/) will name the structure after both mechanisms have been calculated explicitly.

## References

- John Watrous / IBM, [Simon's algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm): promise variants, circuit, exponential randomized oracle separation, and measurement constraints.
- John Watrous / IBM, [Multiple-system quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information): joint-state and subsystem conventions.
- Runnable example: `makeDemo('simon', '3')`, where 3 is binary 011. The implementation keeps six qubits; tests verify all nonzero three-bit masks, every allowed constraint, and classical recovery after enough independent samples.
