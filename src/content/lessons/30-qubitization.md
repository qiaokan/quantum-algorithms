## The transformation, not yet a simulation

**Qubitization** constructs a unitary walk whose small invariant subspaces encode the eigenvalues of a Hermitian matrix. An invariant subspace is a collection of vectors that the operation maps back into the same collection. Here each relevant subspace has two basis vectors, so its evolution can be calculated with a $2\times2$ matrix even when the full system is large. [Low and Chuang](https://arxiv.org/abs/1610.06546) use this structure to implement Hamiltonian functions efficiently.

The input is a block encoding of $H/\alpha$, with $H$ Hermitian and $\alpha\geq\|H\|$. The output primitive is a walk operation. It is not already $e^{-iHt}$, and measuring its ancilla is not an energy estimate. Later signal processing or phase estimation turns the walk into a useful computation.

## Classical baseline and a construction we can see

Classical diagonalization also reveals eigenvalues, and a two-dimensional example offers no speed advantage. The scalable promise is that a succinct block-encoding circuit can implement the walk without calculating or storing all eigenvectors. The following dilation is especially transparent but is not itself a recipe for efficiently loading an arbitrary dense matrix.

Let the normalized Hermitian matrix be

$$A=H/\alpha=\operatorname{diag}(1/2,-1/2).$$

Define $S=\sqrt{I-A^2}=\operatorname{diag}(\sqrt3/2,\sqrt3/2)$. The square root of this diagonal matrix is found by taking the nonnegative square root of each diagonal entry. Then

$$W=\begin{pmatrix}A&S\\S&-A\end{pmatrix},\qquad
R=\begin{pmatrix}I&0\\0&-I\end{pmatrix},\qquad Q=RW=\begin{pmatrix}A&S\\-S&A\end{pmatrix}.$$

The blocks act on the system; the block row/column labels are the ancilla. $W^2=I$ because $A^2+S^2=I$ and $AS=SA$. Therefore $W$ and $Q$ are unitary. $R$ only flips the ancilla-one branch.

## One eigenvalue becomes one rotation

Start with system $|0\rangle$, the eigenvector of $A$ with eigenvalue $a=1/2$. The two vectors $|0\rangle_{\rm anc}|0\rangle_{\rm sys}$ and $|1\rangle_{\rm anc}|0\rangle_{\rm sys}$ span an invariant plane. On their coefficients, $Q$ acts as

$$Q_a=\begin{pmatrix}a&\sqrt{1-a^2}\\-\sqrt{1-a^2}&a\end{pmatrix}
=\begin{pmatrix}1/2&\sqrt3/2\\-\sqrt3/2&1/2\end{pmatrix}.$$

Apply it to ancilla zero, vector $(1,0)^T$:

$$\begin{pmatrix}1\\0\end{pmatrix}
\longmapsto\begin{pmatrix}1/2\\-\sqrt3/2\end{pmatrix}
\longmapsto\begin{pmatrix}1/4-3/4\\-\sqrt3/4-\sqrt3/4\end{pmatrix}
=\begin{pmatrix}-1/2\\-\sqrt3/2\end{pmatrix}
\longmapsto\begin{pmatrix}-1\\0\end{pmatrix}.$$

The probabilities of ancilla zero after one, two, and three steps are $1/4,1/4,1$. The negative amplitude in the third step is a global phase for this one input, not a negative probability.

The same construction applies to system $|1\rangle$ with $a=-1/2$. Its first-step column is $(-1/2,-\sqrt3/2)^T$. No classical branch asks which eigenstate was supplied: the same matrix acts coherently on both components of a superposition.

## Why this is an eigenvalue-to-angle conversion

The rotation has eigenvalues $a\pm i\sqrt{1-a^2}$. Define $\theta=\arccos a$, the angle in $[0,\pi]$ whose cosine is $a$. The [unit-circle identity](/definitions/trigonometry/) gives $a\pm i\sqrt{1-a^2}=e^{\pm i\theta}$. For $a=1/2$, $\theta=\pi/3$; for $a=-1/2$, $\theta=2\pi/3$.

We needed this relation to translate a measured walk phase back into a matrix eigenvalue. Phase estimation on $Q$ can estimate $\pm\theta$, and classical cosine then estimates $a$. Input ancilla zero is generally a superposition of the two walk eigenvectors, so both signs may occur. Their cosines agree.

After $d$ walk steps, the upper-left entry is $\cos(d\theta)=T_d(a)$, where $T_d$ is the degree-$d$ Chebyshev polynomial. For the first few degrees,

$$T_0(a)=1,\quad T_1(a)=a,\quad T_2(a)=2a^2-1,\quad T_3(a)=4a^3-3a.$$

At $a=1/2$, these produce $1,1/2,-1/2,-1$, exactly our matrix multiplication. Thus repeated walking computes a specific polynomial of the encoded eigenvalue.

## Actual implementation and its assumptions

The displayed $W$ explicitly uses $\sqrt{I-A^2}$, which would be expensive to construct from an arbitrary classical dense matrix. In applications, an LCU or other block encoding supplies a larger unitary directly; qubitization arranges reflections and, when necessary, additional ancillas so the invariant-plane property holds. Merely multiplying any arbitrary block encoding by a reflection and assuming this exact plane is valid would be an error. The construction's Hermitian/self-inverse conditions must be checked or enforced.

For an LCU Hamiltonian, PREPARE produces the coefficient state and SELECT applies the selected unitary term. The walk uses these oracles and reflections; their gate costs remain part of runtime. $d$ walk steps mean order $d$ uses of the underlying access circuits, not one unit-cost matrix transformation.

[Quantum signal processing](/lessons/signal-processing/) inserts phases to choose polynomials beyond $T_d$. Applied to simulation, the polynomial approximates $e^{-i\alpha at}$ over $a\in[-1,1]$. Known constructions obtain query dependence near-linear in $\alpha t$ and logarithmic-type dependence on inverse error, with precise regimes and factors given in the source. Logical query counts exclude input preparation, measurement repetitions, and fault-tolerant synthesis overhead.

## Predictions and limitations

**Predict:** does $Q^3$ necessarily simulate the Hamiltonian for time three?

<details><summary>Show the answer</summary>

No. It rotates by three times $\arccos a$, whereas physical evolution multiplies an energy eigenstate by $e^{-i\alpha a t}$. The functions $3\arccos a$ and $3\alpha a$ are different. In our example the third walk step returns the ancilla to zero, but that coincidence is not a general time-evolution rule.

</details>

If $a=1$, then $\sqrt{1-a^2}=0$ and the plane degenerates: ancilla zero stays zero. If $a=0$, the first step moves it entirely into ancilla one and the second returns it with a minus sign. Both boundary cases follow directly from the displayed matrix. No implicit renormalization is needed.

## Practice and connections

Compute $Q_a^2$ for $a=3/5$, where $\sqrt{1-a^2}=4/5$. Its first column is $(-7/25,-24/25)^T$; squared entries sum to $(49+576)/625=1$. The good amplitude $-7/25$ equals $2(3/5)^2-1$. This is a rational example of the same Chebyshev mechanism.

[Grover](/lessons/grover/) also reduced a large computation to a two-dimensional rotation. There the plane was “good versus bad solutions.” Here it is an ancilla plane for each eigenvalue. [QSP](/lessons/signal-processing/) makes these rotations programmable, and [QSVT](/lessons/singular-value-transformation/) extends the idea beyond Hermitian matrices.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Guang Hao Low, Isaac L. Chuang, [Hamiltonian Simulation by Qubitization](https://arxiv.org/abs/1610.06546), Sections 3–5: encoding conditions, invariant subspaces, and signal processing.
- John M. Martyn et al., [A Grand Unification of Quantum Algorithms](https://arxiv.org/abs/2105.02859), Sections II.1–II.3: polynomial interpretation and conventions.
- Explicit dilation and powers are verified in `scripts/check-matrix-examples.py`.
