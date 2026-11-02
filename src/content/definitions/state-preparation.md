An algorithm needs a circuit that creates its input state. Writing a normalized vector is not enough. Uniform amplitudes over $2^n$ labels are easy: apply $H$ to each of $n$ zero qubits.

For the state $(\sqrt3|0\rangle+|1\rangle)/2$, use a rotation

$$R_y(\theta)=\begin{pmatrix}\cos(\theta/2)&-\sin(\theta/2)\\\sin(\theta/2)&\cos(\theta/2)\end{pmatrix}.$$

At $\theta=\pi/3$, its first column is $(\sqrt3/2,1/2)^T$, so it prepares the state from $|0\rangle$. Trigonometric functions are explained [here](/definitions/trigonometry/).

An arbitrary $N$-entry classical vector contains $N$ independent pieces of data; a general preparation circuit cannot be presumed to cost only $O(\log N)$ just because the state uses $\log_2 N$ qubits. Structured inputs or a specified data-access device may help, but have construction costs. A QRAM assumption means coherent memory access, not ordinary RAM.

Return to the algorithm with a named preparation circuit $A$ and its inverse $A^\dagger$ if amplification needs it.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
