Singular values describe the stretching of a matrix even when its input and output directions differ. A decomposition $A=U\Sigma V^\dagger$ uses unitary matrices $U,V$ and a diagonal matrix $\Sigma$ of nonnegative numbers $\sigma_j$. In matching directions, $A|v_j\rangle=\sigma_j|u_j\rangle$.

For $A=\operatorname{diag}(2,-1)$, choose $V=I$, $\Sigma=\operatorname{diag}(2,1)$, $U=\operatorname{diag}(1,-1)$. Multiplying them gives the original matrix. Singular values are 2 and 1, although eigenvalues are 2 and −1. Equivalently they are square roots of the eigenvalues of $A^\dagger A=\operatorname{diag}(4,1)$.

The condition number of an invertible matrix is $\kappa=\sigma_{\max}/\sigma_{\min}$, here 2. Small singular values become large when inverted; they control precision and success costs in quantum linear solvers. A zero singular value means some input direction is lost; an ordinary inverse does not exist.

Return to QSVT with the specific input/output singular directions. A polynomial on singular values is not automatically the same as that polynomial evaluated on matrix entries.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
