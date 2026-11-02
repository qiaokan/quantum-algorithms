For independently prepared registers, the joint amplitude of a pair is the product of its two amplitudes. The tensor product records those products in a fixed order:

$$\begin{pmatrix}a\\b\end{pmatrix}\otimes\begin{pmatrix}c\\d\end{pmatrix}=\begin{pmatrix}ac\\ad\\bc\\bd\end{pmatrix}.$$

Entries correspond to $00,01,10,11$; left bit is most significant. For $|+\rangle=(1,1)^T/\sqrt2$ and $|-\rangle=(1,-1)^T/\sqrt2$,

$$|+\rangle\otimes|-\rangle=\frac12\begin{pmatrix}1(1)\\1(-1)\\1(1)\\1(-1)\end{pmatrix}=\frac12(1,-1,1,-1)^T.$$

Every joint probability is $1/4$. A tensor product of matrices uses the same rule in blocks: $A\otimes B=\left(\begin{smallmatrix}A_{00}B&A_{01}B\\A_{10}B&A_{11}B\end{smallmatrix}\right)$. Thus $H\otimes I$ mixes $(00,10)$ and $(01,11)$ while leaving the second bit unchanged.

Not every joint state factors this way. In $(|00\rangle+|11\rangle)/\sqrt2$, having nonzero $ac,bd$ but zero $ad,bc$ is impossible. This is entanglement. Return to the parent state and expand every product before applying its gate.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
