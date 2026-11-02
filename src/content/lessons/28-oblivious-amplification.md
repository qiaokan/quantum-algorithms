## A primitive with a precise promise

Ordinary amplitude amplification reflects about a known prepared state and a successful subspace. **Oblivious amplitude amplification** can amplify a block-encoded unitary while using reflections that inspect only the ancillas. “Oblivious” means it need not know the system input $|\psi\rangle$. It does not mean arbitrary nonunitary maps can be amplified without distortion. [Berry and collaborators](https://arxiv.org/abs/1412.4687) make the near-unitarity condition explicit in their robust version.

Suppose a unitary $W$ has good block $B=V/2$, where $V$ itself is unitary. For every normalized input, $W|0\rangle|\psi\rangle$ has success amplitude $1/2$ and success probability $1/4$. Let $P=|0\rangle\langle0|\otimes I$ select the good ancilla subspace, and $R=I-2P$ flip its sign. The sequence

$$\mathcal A=-WRW^\dagger RW$$

turns the good block into $V$. Products act from the right. The leading minus is an irrelevant global phase, included to make the final displayed block exactly $V$.

## Classical baseline and why the promise matters

For a known tiny $V$, apply or simulate it directly; no amplification is needed. The primitive matters when $V$ is available indirectly as the successful block of an LCU construction. Repeatedly measuring an ancilla with success probability $1/4$ would need four attempts on average, and failed attempts may destroy an unknown input. Coherent amplification avoids those intermediate measurements when the structural promise holds.

This is not a blanket advantage over classical matrix arithmetic. It is an internal subroutine cost comparison: direct postselection versus a reversible coherent sequence.

## A concrete dilation and every operation

Take $V=X$, so the desired system operation flips $|0\rangle$ to $|1\rangle$. Define $s=1/2$, $c=\sqrt3/2$, and

$$W=\begin{pmatrix}s&-c\\c&s\end{pmatrix}\otimes X.$$

The ancilla rotation is unitary because $s^2+c^2=1$; its inverse is its transpose. The input is $|0\rangle|\psi\rangle$, with $|\psi\rangle$ left arbitrary to show input independence. After the rightmost $W$, the ancilla components are

$$\begin{pmatrix}sX|\psi\rangle\\cX|\psi\rangle\end{pmatrix}.$$

After the first $R$, they are $(-sX|\psi\rangle,cX|\psi\rangle)^T$. Applying $W^\dagger$ first cancels $X$ by $X^\dagger=X$ and then multiplies the ancilla column by $\begin{pmatrix}s&c\\-c&s\end{pmatrix}$:

$$\begin{pmatrix}-s^2+c^2\\cs+sc\end{pmatrix}|\psi\rangle
=\begin{pmatrix}1/2\\\sqrt3/2\end{pmatrix}|\psi\rangle.$$

The next $R$ changes only the first component's sign. The final $W$ gives

$$\begin{pmatrix}s(-1/2)-c(\sqrt3/2)\\c(-1/2)+s(\sqrt3/2)\end{pmatrix}X|\psi\rangle
=\begin{pmatrix}-1/4-3/4\\-\sqrt3/4+\sqrt3/4\end{pmatrix}X|\psi\rangle
=\begin{pmatrix}-1\\0\end{pmatrix}X|\psi\rangle.$$

Restoring the displayed global minus yields $|0\rangle X|\psi\rangle$. The ancilla succeeds certainly, and the correct system transformation applies to every input, including a superposition or a system entangled with another register. For input $|0\rangle$, the measured system output is one with probability one.

## What actually changed?

No intermediate measurement occurred. The two reflections and three uses of $W$ or its inverse coherently canceled the failure amplitude. The system's information was carried reversibly through $X$, $X^\dagger$, and $X$. Rewriting the state into two ancilla components did not physically separate or copy the input.

The underlying two-dimensional rotation is related to [Grover](/lessons/grover/): initial good amplitude $s=\sin\theta$ becomes $\sin3\theta=3s-4s^3$. Here $s=1/2$, so $3/2-4/8=1$. This identity explains the particular scale two and why one amplification step is enough.

## The general block identity and a counterexample

For a general good block $B$, the same sequence has good block

$$3B-4BB^\dagger B.$$

If $B=V/2$ and $V$ is unitary, $BB^\dagger B=V/8$, so the result is $3V/2-V/2=V$. If the desired operation is only approximately unitary, the difference between $BB^\dagger B$ and a scalar multiple of $B$ introduces error. Robust oblivious amplification bounds that error when the approximation is controlled.

Now let $B=\operatorname{diag}(1/2,1/4)$. Its two diagonal components become one and $3/4-4/64=11/16$. Those are not a common rescaling of the originals: the ratio changes from two to $16/11$. On $|+\rangle$, the output direction is therefore distorted. The sequence is still unitary on the enlarged space; what fails is the intended interpretation as uniform amplification of $B$.

**Predict:** could the procedure decrease a good amplitude?

<details><summary>Show the answer</summary>

Yes. At $s=0.9$, $3s-4s^3=2.7-2.916=-0.216$. Both the probability and sign have changed. Repeating Grover-like rotations without knowing the relevant amplitude can overshoot. Fixed-point methods address a different promised range and require a different phase sequence.

</details>

## Implementation and generalization

$R$ is a phase flip conditioned on all success ancillas being zero; for multiple ancillas it needs a multi-controlled phase construction. $W^\dagger$ reverses the gates of $W$ and inverts them. One invocation of $\mathcal A$ uses two forward $W$ calls and one inverse call, plus reflections. If $W$ includes data loading or SELECT, those costs occur each time.

The toy uses a directly known $X$ and is deliberately inefficient compared with applying $X$. In [Taylor simulation](/lessons/taylor-simulation/), $W$ instead block-encodes an approximate time-evolution segment. Segment duration and coefficient normalization are chosen so the good block is close to a unitary divided by two. That is where this primitive earns its place.

The result concerns an ideal logical circuit. Imperfect inverses, ancilla reset errors, and synthesized rotations consume an additional error budget. Amplifying a success probability does not remove errors in the successful state's direction.

## Practice and connections

If the starting scale were one, $B=V$, a success measurement would already be certain. The three-call polynomial gives $3V-4V=-V$, the same operation up to global phase; spending the extra calls is pointless. If the starting amplitude is zero, the polynomial remains zero: no overlap means no success to amplify.

The lesson connects the two-dimensional geometry of [amplitude amplification](/lessons/amplitude-amplification/) to a transformation of matrix singular values. [QSVT](/lessons/singular-value-transformation/) will make the latter viewpoint systematic and allow carefully designed transformations instead of this one cubic.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Dominic W. Berry, Andrew M. Childs, Richard Cleve, Robin Kothari, Rolando D. Somma, [Simulating Hamiltonian dynamics with a truncated Taylor series](https://arxiv.org/abs/1412.4687), Sections I–II, especially the good-block polynomial and near-unitarity condition.
- András Gilyén et al., [Quantum singular value transformation and beyond](https://arxiv.org/abs/1806.01838): robust oblivious amplification as a singular-value transformation.
