We need this rule to calculate what a gate actually does. Multiply each row of the matrix by the input column, pair corresponding entries, then add:

$$\begin{pmatrix}1&2\\3&4\end{pmatrix}\begin{pmatrix}5\\6\end{pmatrix}=\begin{pmatrix}1(5)+2(6)\\3(5)+4(6)\end{pmatrix}=\begin{pmatrix}17\\39\end{pmatrix}.$$

To multiply matrices, repeat that rule for each column of the right matrix. With $H=\frac1{\sqrt2}\left(\begin{smallmatrix}1&1\\1&-1\end{smallmatrix}\right)$,

$$H^2=\frac12\begin{pmatrix}1+1&1-1\\1-1&1+1\end{pmatrix}=I.$$

So two consecutive Hadamards undo each other. In $ABv$, $B$ acts first, then $A$. Generally $AB\ne BA$: doing a swap then a sign change can differ from doing the sign change first. No matrices in this example require guessing; each coefficient is a row–column calculation.

**Predict:** $H(1,-1)^T/\sqrt2$? First entry $(1-1)/2=0$; second $(1+1)/2=1$. The answer is $|1\rangle$. We needed this arithmetic to turn relative signs into a measured bit; now return to the parent gate.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
