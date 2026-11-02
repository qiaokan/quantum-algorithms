The Hadamard gate $H$ is the one-qubit operation

$$H=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\qquad
H\begin{pmatrix}a\\b\end{pmatrix}=\begin{pmatrix}(a+b)/\sqrt2\\(a-b)/\sqrt2\end{pmatrix}.$$

It replaces a pair of amplitudes by their scaled sum and scaled difference. Each output is one row of the [matrix](/definitions/matrix-multiplication/) times the input column.

Four values are used constantly. Starting from a basis state:

$$H|0\rangle=\frac{(1,1)^T}{\sqrt2}=|+\rangle,\qquad H|1\rangle=\frac{(1,-1)^T}{\sqrt2}=|-\rangle.$$

Applying it again undoes it, because $H$ times $H$ is the identity:

$$H|+\rangle=\frac12\begin{pmatrix}1+1\\1-1\end{pmatrix}=|0\rangle,\qquad H|-\rangle=\frac12\begin{pmatrix}1-1\\1+1\end{pmatrix}=|1\rangle.$$

So $H$ is the gate that turns a relative sign into a readable bit. $|+\rangle$ and $|-\rangle$ give 0 and 1 with probability $1/2$ each if measured directly. After one more $H$ they give 0 and 1 with certainty.

On $n$ qubits, applying $H$ to every qubit of $|0\cdots0\rangle$ gives every $n$-bit label the same amplitude $1/\sqrt{2^n}$. The amplitude from input label $x$ to output label $y$ is $(-1)^{x\cdot y}/\sqrt{2^n}$, where $x\cdot y$ is the parity of the bitwise AND. For $n=2$, $x=10$ and $y=11$: $x\cdot y=1$, so that contribution is $-1/2$.

We needed this gate because measurement only reports labels, never signs. Return to the parent calculation and check which pairs of amplitudes the next $H$ adds and subtracts.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally.
