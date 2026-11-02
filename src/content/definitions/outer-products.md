An outer product multiplies a column by a row, producing a matrix. It is not the scalar inner product. For normalized $u=(1,1)^T/\sqrt2$,

$$P=|u\rangle\langle u|=\frac12\begin{pmatrix}1(1)&1(1)\\1(1)&1(1)\end{pmatrix}.$$

Applied to $(a,b)^T$, $P$ gives $((a+b)/2,(a+b)/2)^T$. The result keeps only the component along $u$. Such a matrix is a projector: $P^2=P$. It is not generally a deterministic quantum gate because it can reduce norm.

A reflection built from it, $2P-I=\left(\begin{smallmatrix}0&1\\1&0\end{smallmatrix}\right)$, is unitary: it preserves the $u$ direction and negates the perpendicular direction. Grover uses exactly this construction in a larger space. Return to the parent reflection and compute each output entry from the matrix, not from a geometric slogan.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
