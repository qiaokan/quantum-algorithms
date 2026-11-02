Sometimes a matrix acts on a vector only by scaling it. If $Av=\lambda v$ with nonzero $v$, then $v$ is an eigenvector and $\lambda$ its eigenvalue. The collection of eigenvalues is the spectrum. We need this to identify what phase estimation estimates.

For $A=\left(\begin{smallmatrix}2&1\\1&2\end{smallmatrix}\right)$, multiplying $(1,1)^T$ gives $(3,3)^T$, so its eigenvalue is 3. Multiplying $(1,-1)^T$ gives $(1,-1)^T$, so that eigenvalue is 1. Divide these vectors by $\sqrt2$ to use them as states.

A unitary's eigenvalues have magnitude one: write $e^{2\pi i\theta}$. For $U=\operatorname{diag}(1,i)$, $|1\rangle$ has eigenvalue $i=e^{2\pi i/4}$, giving phase fraction $\theta=1/4$. An uncontrolled application changes only a global phase on this eigenstate; a controlled application makes that phase relative between control branches.

Return to phase estimation with both the eigenstate and its eigenvalue. An arbitrary input may combine several eigenstates; then measurements sample their phases with weights given by squared overlaps.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
