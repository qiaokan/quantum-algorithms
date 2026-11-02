The inner product measures how much one vector aligns with another. Conjugate the first vector's entries, multiply corresponding pairs, and add. A bra $\langle u|$ is the [conjugate transpose](/definitions/conjugate-transpose/) of a ket $|u\rangle$:

$$\langle u|v\rangle=\sum_j\overline{u_j}v_j.$$

For $u=(1,i)^T/\sqrt2$ and $v=(1,1)^T/\sqrt2$, the result is $(1-i)/2$ and its squared magnitude is $1/2$. For $|+\rangle$ and $|-\rangle$, the result is $(1-1)/2=0$. Zero inner product is called orthogonality; these states can be perfectly distinguished with a suitable measurement.

For normalized vectors, $|\langle u|v\rangle|^2$ is the probability of the projection onto $u$. Inner product 1 for a vector with itself is exactly normalization. We needed this to calculate overlap or a projection probability; now return to the parent expression and substitute the scalar value.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
