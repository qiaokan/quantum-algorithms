A density matrix represents both pure states and classical uncertainty about prepared states. For a pure state $|\psi\rangle$, it is the [outer product](/definitions/outer-products/) $\rho=|\psi\rangle\langle\psi|$. For a mixture that chooses state $\psi_j$ with probability $p_j$, it is $\rho=\sum_j p_j|\psi_j\rangle\langle\psi_j|$.

$$|+\rangle\langle+|=\frac12\begin{pmatrix}1&1\\1&1\end{pmatrix},\qquad \tfrac12|0\rangle\langle0|+\tfrac12|1\rangle\langle1|=\frac12\begin{pmatrix}1&0\\0&1\end{pmatrix}.$$

Both have the same diagonal probabilities. But the off-diagonal entries encode coherence: after $H\rho H^\dagger$, the first has probability 1 for 0; the second stays 50/50. Averaging state vectors would incorrectly turn classical uncertainty into a coherent superposition.

The trace $\operatorname{Tr}(A)$ is the sum of a matrix's diagonal entries; a density matrix has trace one and nonnegative measurement probabilities. To ignore a register, the partial trace sums entries with matching ignored labels: $(\rho_A)_{x,x'}=\sum_y\rho_{xy,x'y}$. Return with the density matrix when the input is mixed or a subsystem is discarded.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
