A matrix is a rectangular table of numbers. A square matrix acts on a column vector: each output entry is a weighted sum of input entries. For quantum gates, columns describe where each input basis state goes.

$$M=\begin{pmatrix}0&1\\1&0\end{pmatrix},\qquad M\begin{pmatrix}a\\b\end{pmatrix}=\begin{pmatrix}0a+1b\\1a+0b\end{pmatrix}=\begin{pmatrix}b\\a\end{pmatrix}.$$

This matrix is the bit-flip gate $X$. The identity $I=\left(\begin{smallmatrix}1&0\\0&1\end{smallmatrix}\right)$ leaves both entries unchanged. A matrix called $\operatorname{diag}(2,3)$ has 2 and 3 on the diagonal and zeros elsewhere. It multiplies entries separately; it is not a valid deterministic quantum gate because it changes vector length.

A **linear** operation respects sums and scaling: $M(av+bw)=aMv+bMw$. This follows by distributing each row sum. It is how a gate defined on basis states determines its action on every state. See [matrix multiplication](/definitions/matrix-multiplication/). Return to the algorithm with the concrete input column; do not treat an algebraic rewrite as another gate.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
