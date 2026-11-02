A controlled gate applies an operation only in the branch where a control bit equals 1. It must preserve coherent superpositions, not measure the control first. With left control and right target, CNOT swaps $10$ and $11$ and leaves $00,01$ unchanged:

$$\operatorname{CNOT}=\begin{pmatrix}1&0&0&0\\0&1&0&0\\0&0&0&1\\0&0&1&0\end{pmatrix}.$$

Thus it changes $(|00\rangle+|10\rangle)/\sqrt2$ into $(|00\rangle+|11\rangle)/\sqrt2$. The latter is entangled; the target is no longer independently in $|0\rangle$.

If a target is an eigenstate $U|u\rangle=e^{i\phi}|u\rangle$, controlled $U$ sends $(|0\rangle+|1\rangle)|u\rangle/\sqrt2$ to $(|0\rangle+e^{i\phi}|1\rangle)|u\rangle/\sqrt2$. The phase is now relative on the control. This algebraic factoring does not physically move a scalar between qubits.

Access to an arbitrary unknown $U$ does not automatically include controlled-$U$. Phase estimation explicitly assumes it can be implemented. Return with that access cost counted.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
