A dagger $\dagger$ means transpose and complex-conjugate. Transpose exchanges rows and columns; conjugation changes $i$ to $-i$.

$$A=\begin{pmatrix}1&i\\2&3-i\end{pmatrix},\quad A^\dagger=\begin{pmatrix}1&2\\-i&3+i\end{pmatrix}.$$

For a column $(1,i)^T/\sqrt2$, its dagger is the row $(1,-i)/\sqrt2$. Their product is $(1+(-i)i)/2=1$. Forgetting the conjugate would give zero, falsely declaring a nonzero state to have zero length.

For a valid unitary gate, the inverse equals its dagger. It need not equal the original gate: $S=\operatorname{diag}(1,i)$ has inverse $S^\dagger=\operatorname{diag}(1,-i)$. Applying $S$ twice gives $Z$, not identity. We needed this operation to undo a circuit or calculate an overlap; return to the parent expression with the entries transposed and their imaginary signs reversed.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
