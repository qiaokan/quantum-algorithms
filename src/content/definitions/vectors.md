A column vector is an ordered list of numbers. In a quantum state its entries are amplitudes, indexed by the possible measurement labels. The notation $|\psi\rangle$ (“ket psi”) names the whole column; it is not an extra operation.

$$|0\rangle=\begin{pmatrix}1\\0\end{pmatrix},\quad |1\rangle=\begin{pmatrix}0\\1\end{pmatrix},\quad |\psi\rangle=\frac35|0\rangle-\frac45|1\rangle=\begin{pmatrix}3/5\\-4/5\end{pmatrix}.$$

Here the probabilities of labels 0 and 1 are $9/25$ and $16/25$. The minus sign is an amplitude sign, not a negative probability. Addition is entry by entry; multiplying a vector by a number multiplies every entry. $(1,2)^T+(3,-1)^T=(4,1)^T$; the superscript $T$ means transpose, turning the written row into a column.

For two bits the ordering is $00,01,10,11$. A four-entry vector is a joint state, not a list of four qubits. [Normalization](/definitions/normalization/) checks that a state has total probability one. We needed the vector to make each amplitude explicit; substitute its entries into the next operation in the lesson.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
