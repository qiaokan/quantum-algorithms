## The primitive and its input model

**Quantum singular value transformation**, or QSVT, uses a block encoding of a matrix and a sequence of phases to apply a polynomial transformation to its singular values. It generalizes the small rotations in [QSP](/lessons/signal-processing/) to matrices that need not be Hermitian. It is a framework/primitive; search, filtering, and linear solving are applications with additional assumptions. The construction and theorem are due to [Gilyén, Su, Low and Wiebe](https://arxiv.org/abs/1806.01838).

We assume a unitary block encoding of a normalized matrix $A$, its inverse, and reflections/phases selecting the input and output blocks. These are coherent circuit resources. Supplying a classical matrix file is not the same access model. The output is a transformed block or a state after conditioning, not a list of singular values.

## Singular values through one non-Hermitian example

Take

$$A=\begin{pmatrix}0&1/2\\1&0\end{pmatrix}.$$

It maps input basis vector $|0\rangle$ to output $|1\rangle$ with length one, and input $|1\rangle$ to output $|0\rangle$ with length $1/2$. Those stretch factors are the **singular values**. Their associated input directions are right singular vectors; their output directions are left singular vectors. In symbols,

$$A=U\Sigma V^\dagger,\qquad U=X,\quad\Sigma=\operatorname{diag}(1,1/2),\quad V=I.$$

Multiplying $X\Sigma$ gives the displayed $A$. The dagger means conjugate transpose. Unlike eigenvalues, singular values are nonnegative even when a matrix is non-Hermitian. Indeed $A^\dagger A=\operatorname{diag}(1,1/4)$, whose nonnegative square-root eigenvalues are one and $1/2$. See the reusable [singular-value definition](/definitions/singular-values/).

For an odd polynomial $p$, the singular-value transformation is $p^{\rm SV}(A)=U p(\Sigma)V^\dagger$. The superscript “SV” warns that this is generally **not** the ordinary matrix polynomial $p(A)$. Even-degree transformations act within an input or output singular-vector space, rather than mapping between the two in the same way.

## A complete cubic transformation

We will implement $p(s)=3s-4s^3$, where $s$ denotes a singular value. This is the cubic from [oblivious amplification](/lessons/oblivious-amplification/). At our two singular values,

$$p(1)=3-4=-1,\qquad p(1/2)=3/2-4/8=1.$$

Therefore

$$p^{\rm SV}(A)=X\operatorname{diag}(-1,1)=\begin{pmatrix}0&1\\-1&0\end{pmatrix}.$$

Start with $|+\rangle=(1,1)^T/\sqrt2$. The desired transformed output is $(1,-1)^T/\sqrt2=|-\rangle$. Its computational-basis probabilities are both $1/2$, but a Hadamard followed by measurement yields one certainly. This example makes the sign change operationally testable.

## Constructing and applying the actual larger unitary

Let $c=\sqrt3/2$ and use ancilla-first basis $00,01,10,11$. A unitary block encoding is

$$W=\begin{pmatrix}
0&1/2&c&0\\
1&0&0&0\\
0&0&0&-1\\
0&c&-1/2&0
\end{pmatrix}.$$

Every column has norm one. The only nontrivial overlap is between columns two and three: $c/2-c/2=0$. Thus $W^\dagger W=I$, and its upper-left block is $A$.

Let $R=\operatorname{diag}(-1,-1,1,1)$ flip the ancilla-zero block. Apply $-WRW^\dagger RW$ to $(1,1,0,0)^T/\sqrt2$. Keeping the common factor $1/\sqrt2$ outside, the intermediate columns are:

$$
\begin{aligned}
(1,1,0,0)^T&\xrightarrow{W}(1/2,1,0,c)^T\\
&\xrightarrow{R}(-1/2,-1,0,c)^T\\
&\xrightarrow{W^\dagger}(-1,1/2,-c,0)^T\\
&\xrightarrow{R}(1,-1/2,-c,0)^T\\
&\xrightarrow{W}(-1,1,0,0)^T.
\end{aligned}
$$

The final displayed minus in the sequence produces $(1,-1,0,0)^T/\sqrt2$. The success ancilla is zero with probability one. No result was renormalized during these operations. This special matrix has singular values at points where $|p(s)|=1$; generic inputs do not enjoy deterministic postselection.

## Why alternating a matrix and its inverse is essential

The good block of this sequence is $3A-4AA^\dagger A$. Calculate it directly:

$$AA^\dagger=\operatorname{diag}(1/4,1),\qquad
AA^\dagger A=\begin{pmatrix}0&1/8\\1&0\end{pmatrix},$$

so $3A-4AA^\dagger A=\begin{pmatrix}0&1\\-1&0\end{pmatrix}$. The product $AA^\dagger A=U\Sigma^3V^\dagger$ preserves the right-to-left singular-vector mapping. In contrast, $A^2=I/2$, hence $A^3=A/2$ and the ordinary polynomial $3A-4A^3=A$. These are different answers.

**Predict:** could we replace every occurrence of $W^\dagger$ by $W$ just because both are unitary?

<details><summary>Show the answer</summary>

No. Unitarity means the inverse exists; it does not mean a gate equals its inverse. The adjoint connects the output singular directions back to the input directions. Replacing it breaks the polynomial identity for a general non-Hermitian block.

</details>

## General theorem, implementation, and limits

For admissible bounded polynomials with the appropriate parity, QSVT constructs a circuit with a number of block-encoding calls proportional to polynomial degree. Different formulations use real/imaginary parts, extra ancillas, or specific scaling constants; these details cannot be replaced by “any polynomial works.” The [pedagogical synthesis](https://arxiv.org/abs/2105.02859) carefully distinguishes signal-processing conventions and admissibility conditions.

To approximate inversion, a polynomial must resemble a scaled reciprocal on singular values at least $1/\kappa$. Near zero, inversion is unbounded, whereas amplitudes remain bounded by one. A lower singular-value bound and normalization are therefore unavoidable. Filtering needs a transition interval; a discontinuous exact step over an arbitrarily narrow gap cannot be implemented at fixed degree.

The total cost is phase computation plus degree times block-access cost, along with preparation, success amplification, and readout. Degree-dependent numerical and block-encoding errors must be bounded. Classical polynomial matrix methods remain strong baselines when entries are available and classical output is required. QSVT's generality does not prove a practical speedup for every application.

## Practice and connections

For $A=\operatorname{diag}(1/2,1/4)$, the same cubic gives $\operatorname{diag}(1,11/16)$. On $|+\rangle$, the success probability is $(1+(11/16)^2)/2=377/512$, and the normalized output is $(16,11)^T/\sqrt{377}$. This recovers the distortion warning from oblivious amplification as an intentional singular-value transformation.

In [HHL](/lessons/hhl/), we explicitly labeled eigenvalues and performed reciprocal rotations. QSVT can approximate the reciprocal without retaining a binary eigenvalue estimate. [Modern linear solvers](/lessons/modern-linear-solvers/) explain both the benefit and the remaining conditioning/readout costs. The cubic just computed also shows why search amplification belongs in the same mathematical family.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- András Gilyén, Yuan Su, Guang Hao Low, Nathan Wiebe, [Quantum singular value transformation and beyond](https://arxiv.org/abs/1806.01838): singular-value polynomial transformations, parity, block access, and applications.
- John M. Martyn, Zane M. Rossi, Andrew K. Tan, Isaac L. Chuang, [A Grand Unification of Quantum Algorithms](https://arxiv.org/abs/2105.02859), Sections II.4–II.5: singular-vector subspaces and conventions.
- Dominic W. Berry et al., [Simulating Hamiltonian dynamics with a truncated Taylor series](https://arxiv.org/abs/1412.4687), good-block identity used for the concrete cubic.
- Full $4\times4$ circuit and its distinction from ordinary matrix powers are checked in `scripts/check-matrix-examples.py`.
