A density matrix represents both pure states and classical uncertainty about prepared states. For a pure state $|\psi\rangle$, it is the [outer product](/definitions/outer-products/) $\rho=|\psi\rangle\langle\psi|$. For a mixture that chooses state $\psi_j$ with probability $p_j$, it is $\rho=\sum_j p_j|\psi_j\rangle\langle\psi_j|$.

$$|+\rangle\langle+|=\frac12\begin{pmatrix}1&1\\1&1\end{pmatrix},\qquad \tfrac12|0\rangle\langle0|+\tfrac12|1\rangle\langle1|=\frac12\begin{pmatrix}1&0\\0&1\end{pmatrix}.$$

Both have the same diagonal probabilities. But the off-diagonal entries encode coherence: after $H\rho H^\dagger$, the first has probability 1 for 0; the second stays 50/50. Averaging state vectors would incorrectly turn classical uncertainty into a coherent superposition.

The trace $\operatorname{Tr}(A)$ is the sum of a matrix's diagonal entries; a density matrix has trace one and nonnegative measurement probabilities. To ignore a register, the partial trace sums entries with matching ignored labels: $(\rho_A)_{x,x'}=\sum_y\rho_{xy,x'y}$. Return with the density matrix when the input is mixed or a subsystem is discarded.

## Work the matrix operations

Let $H=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$. For the coherent state above,

$$H\rho_+=\frac1{\sqrt2}\begin{pmatrix}1&1\\0&0\end{pmatrix},\qquad
H\rho_+H^\dagger=\frac12\begin{pmatrix}2&0\\0&0\end{pmatrix}=\begin{pmatrix}1&0\\0&0\end{pmatrix}.$$

For the equal classical mixture, $H(I/2)H^\dagger=HH^\dagger/2=I/2$. This calculation locates the difference in the off-diagonal coherence, not in the initial measurement frequencies.

Now discard the second qubit of the Bell state $|\Phi\rangle=(|00\rangle+|11\rangle)/\sqrt2$. In basis order $00,01,10,11$,

$$\rho_{AB}=|\Phi\rangle\langle\Phi|=\frac12\begin{pmatrix}1&0&0&1\\0&0&0&0\\0&0&0&0\\1&0&0&1\end{pmatrix}.$$

Apply the partial-trace rule entry by entry:

$$\begin{aligned}
(\rho_A)_{0,0}&=\rho_{00,00}+\rho_{01,01}=1/2+0,\\
(\rho_A)_{0,1}&=\rho_{00,10}+\rho_{01,11}=0+0,\\
(\rho_A)_{1,0}&=\rho_{10,00}+\rho_{11,01}=0+0,\\
(\rho_A)_{1,1}&=\rho_{10,10}+\rho_{11,11}=0+1/2.
\end{aligned}$$

Thus $\rho_A=I/2$, not $|+\rangle\langle+|$. The full state's coherence connects different second-qubit labels (00 with 11); those entries do not survive the matching-label sum. A subsystem of a pure entangled state can be mixed. Discarding a register is not adding its amplitudes together.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
