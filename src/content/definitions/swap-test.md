The SWAP test estimates squared overlap of two pure states. Prepare control $|0\rangle$ and target registers $|u\rangle|v\rangle$. Apply $H$, controlled exchange of the two targets, then $H$. The control-0 branch is $(|u\rangle|v\rangle+|v\rangle|u\rangle)/2$.

Its squared norm is

$$P(0)=\frac{2+2|\langle u|v\rangle|^2}{4}=\frac{1+|\langle u|v\rangle|^2}{2}.$$

Take $u=|0\rangle$, $v=|+\rangle$. Their overlap is $1/\sqrt2$ and squared overlap $1/2$, so $P(0)=3/4$. Identical states give 1; orthogonal states give 1/2, not zero. The test needs both state preparations on every shot and coherent exchange across matching qubits.

For mixed inputs, the same probability involves $\operatorname{Tr}(\rho\sigma)$; it is not generally the usual mixed-state fidelity. Return to the kernel or estimation application with that distinction and shot cost. A destructive overlap test can use different circuitry but has the same need for prepared inputs.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
