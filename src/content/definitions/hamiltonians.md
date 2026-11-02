A Hamiltonian $H$ is a Hermitian matrix describing energy and generating time evolution. In units where the constant $\hbar=1$, evolution for time $t$ is $e^{-iHt}$. Unlike a measured energy, this is an operation on amplitudes.

If $H=\operatorname{diag}(0,2)$, then $e^{-iHt}=\operatorname{diag}(1,e^{-2it})$. Starting in $|+\rangle$, at $t=\pi/2$ the state becomes $(|0\rangle-|1\rangle)/\sqrt2$: the probabilities in the computational basis remain 1/2, but a final $H$ gate yields 1. Here the letter $H$ names both a Hamiltonian and the Hadamard in common notation; the context and full matrix must disambiguate them.

For a general Hamiltonian use its [eigenvectors](/definitions/eigenvalues/): each energy eigenvalue $E_j$ becomes phase $e^{-iE_jt}$. [Matrix functions](/definitions/matrix-functions/) explains the exponential. Simulating time evolution does not automatically prepare a ground state. Return to simulation or energy estimation with a given input state, time, and accuracy.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
