## The transformation we want

Many useful matrices are not quantum gates: they shrink some vectors, expand others, or are not square. A **block encoding** stores a scaled version of such a matrix in a specified corner of a larger unitary. This is a primitive, not a complete problem-solving algorithm. It makes a matrix available for later amplification and polynomial transformations. The framework is developed systematically by [Gilyén, Su, Low and Wiebe](https://arxiv.org/abs/1806.01838).

For a square matrix $A$, a unitary $U$ block-encodes $A$ with scale $\alpha$ if

$$U|0\rangle|\psi\rangle=|0\rangle(A|\psi\rangle/\alpha)+|1\rangle|\mathrm{other}\rangle.$$

The first register is an ancilla. With several ancillas, “zero” means all of them are zero. The second branch supplies whatever amplitudes unitarity requires. The compact notation $(\langle0|\otimes I)U(|0\rangle\otimes I)=A/\alpha$ means prepare the ancilla at zero, apply $U$, then select its zero component. It does **not** promise that selection succeeds. Usually $\alpha\geq\|A\|$, where the [operator norm](/definitions/norms/) is the largest factor by which $A$ stretches a unit vector.

## Classical baseline and access models

Classically, matrix-vector multiplication is direct arithmetic when the entries are stored. Quantum block encoding can make sense when $A$ has a succinct circuit, sparse-entry oracles, a useful decomposition, or a quantum-data preparation procedure. Those input models are different. An arbitrary classical table of $D^2$ entries cannot be assumed available as an efficient coherent circuit for free.

We will use **linear combination of unitaries**, abbreviated LCU. Its input is a list of implementable unitaries $U_j$ and coefficients $a_j$ such that $A=\sum_ja_jU_j$. Initially take nonnegative real coefficients; complex phases can be absorbed into the corresponding unitaries. Define $\alpha=\sum_ja_j$. Two required operations are PREPARE, which creates $\sum_j\sqrt{a_j/\alpha}|j\rangle$, and SELECT, which applies $U_j$ conditional on label $j$.

## A fully worked two-term encoding

Let $A=Z+X=\begin{pmatrix}1&1\\1&-1\end{pmatrix}$ and $\alpha=2$. Choose PREPARE to be the Hadamard gate $H_{\rm gate}=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$. The subscript avoids confusing this gate with a Hamiltonian. SELECT applies $Z$ when the ancilla is zero and $X$ when it is one. With ancilla first and input $|\psi\rangle=|0\rangle$, the operations are:

$$|0\rangle|0\rangle
\xrightarrow{\mathrm{PREPARE}}
\frac{|0\rangle|0\rangle+|1\rangle|0\rangle}{\sqrt2}
\xrightarrow{\mathrm{SELECT}}
\frac{|0\rangle|0\rangle+|1\rangle|1\rangle}{\sqrt2}.$$

Apply PREPARE inverse, which here is another Hadamard, to the ancilla. Using $H_{\rm gate}|0\rangle=(|0\rangle+|1\rangle)/\sqrt2$ and $H_{\rm gate}|1\rangle=(|0\rangle-|1\rangle)/\sqrt2$ gives

$$\frac12\left(|00\rangle+|10\rangle+|01\rangle-|11\rangle\right)
=\frac12|0\rangle(|0\rangle+|1\rangle)+\frac12|1\rangle(|0\rangle-|1\rangle).$$

The ordering of the middle two terms was algebraically rearranged; no SWAP gate occurred. The successful ancilla-zero vector is $(1,1)^T/2=A|0\rangle/2$. Its probability is $1/4+1/4=1/2$. Conditional on success, the system is $|+\rangle$. Failure also has probability $1/2$ and leaves $|-\rangle$.

## Show the whole matrix, not just its good corner

In basis order $00,01,10,11$, the resulting block unitary is

$$U=\begin{pmatrix}B&C\\C&B\end{pmatrix},\quad
B=\frac{Z+X}{2}=\frac12\begin{pmatrix}1&1\\1&-1\end{pmatrix},\quad
C=\frac{Z-X}{2}=\frac12\begin{pmatrix}1&-1\\-1&-1\end{pmatrix}.$$

For example, the first column is $(1,1,1,-1)^T/2$, matching the state just calculated. Compute $B^2=I/2$, $C^2=I/2$, and $BC+CB=0$. Thus $U^2$ has diagonal blocks $I$ and zero off-diagonal blocks. Since $B$ and $C$ are real symmetric, $U^\dagger=U$, so $U^\dagger U=U^2=I$: $U$ is unitary. Squaring to identity alone would not establish unitarity. The “discarded” corner is essential to this check.

## Why PREPARE and its inverse produce coefficients

Before SELECT, label $j$ has amplitude $\sqrt{a_j/\alpha}$. The amplitude for PREPARE inverse to return that label to zero is also $\sqrt{a_j/\alpha}$, since the coefficients here are real. The contribution to the same ancilla-zero output is therefore $(a_j/\alpha)U_j|\psi\rangle$. Adding those indistinguishable contributions yields $A|\psi\rangle/\alpha$.

This addition is coherent. In [qDRIFT](/lessons/qdrift/) we selected a term classically and averaged probabilities. Here we preserve and erase the label coherently, so amplitudes add before probabilities are calculated. Replacing this circuit by randomly choosing $X$ or $Z$ would yield a mixture, not $(X+Z)|\psi\rangle$.

**Predict:** if SELECT is omitted, what is the net circuit?

<details><summary>Show the answer</summary>

PREPARE inverse cancels PREPARE, leaving the identity. No matrix data entered. The function-dependent operation is SELECT; PREPARE also depends on coefficient data. Treating both as free would hide the input-access cost.

</details>

## Generalization, precision, and limitations

For $L$ terms, the label needs at least $\lceil\log_2L\rceil$ qubits, with unused labels handled explicitly. A straightforward SELECT can cost order $L$ controlled operations, though structure can improve it. Generic PREPARE also has nontrivial loading cost. One query to a block encoding means one call to the **whole** constructed unitary, including PREPARE, SELECT, and unpreparation.

If the block differs from $A/\alpha$ by error, later repeated uses can magnify that error. The scale $\alpha$ matters: larger scale shrinks the good amplitudes and can worsen query complexity or success. The LCU coefficient sum is not always the optimal scale. Here $\|A\|=\sqrt2$, while the simple LCU uses two.

The output after successful selection is $A|\psi\rangle/\|A|\psi\rangle\|$, not $A|\psi\rangle$ with its original norm attached. If $A|\psi\rangle=0$, success probability is zero and no normalized output exists. This is expected behavior, not a simulator bug.

## Practice and connections

Replace $A$ by $I+Z$. On $|0\rangle$, the successful block $(I+Z)/2$ acts as identity, so success is certain. On $|1\rangle$, the block is zero, so success never occurs. This counterexample prevents interpreting block encoding as deterministic matrix application.

For $A=3I+X$, use coefficients $3$ and $1$, scale four, and ancilla amplitudes $\sqrt3/2$ and $1/2$. On $|0\rangle$, the good vector is $(3,1)^T/4$, probability $10/16$, normalized output $(3,1)^T/\sqrt{10}$. This is the same coefficient-multiplication rule with unequal weights.

[HHL](/lessons/hhl/) already hid a nonunitary inverse behind a success flag. [Oblivious amplification](/lessons/oblivious-amplification/) will show when that flag can be amplified without knowing the input state. [QSVT](/lessons/singular-value-transformation/) will transform the block rather than merely apply it once.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- András Gilyén, Yuan Su, Guang Hao Low, Nathan Wiebe, [Quantum singular value transformation and beyond](https://arxiv.org/abs/1806.01838): block-encoding framework, composition, access assumptions.
- Dominic W. Berry et al., [Simulating Hamiltonian dynamics with a truncated Taylor series](https://arxiv.org/abs/1412.4687), Section I: PREPARE/SELECT linear combination construction.
- John M. Martyn, Zane M. Rossi, Andrew K. Tan, Isaac L. Chuang, [A Grand Unification of Quantum Algorithms](https://arxiv.org/abs/2105.02859), Section II.5: block encodings and interpretations.
