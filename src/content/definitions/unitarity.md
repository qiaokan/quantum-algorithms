A matrix $U$ is unitary when $U^\dagger U=I$. This guarantees preserved lengths and inner products, hence preserved total probability. The dagger is the [conjugate transpose](/definitions/conjugate-transpose/).

For $H=(1/\sqrt2)\left(\begin{smallmatrix}1&1\\1&-1\end{smallmatrix}\right)$, $H^\dagger H=\frac12\left(\begin{smallmatrix}2&0\\0&2\end{smallmatrix}\right)=I$. Thus it is a legal ideal gate and is its own inverse. Other gates are not their own inverses: the phase gate $\operatorname{diag}(1,i)$ must be undone with $\operatorname{diag}(1,-i)$.

A map that sends both $|0\rangle$ and $|1\rangle$ to $|0\rangle$ is not unitary. It changes their inner product from zero to one and erases which input occurred. Reversible oracle constructions keep an input register for this reason.

**Predict:** Can $\operatorname{diag}(1,2)$ be applied deterministically to an unknown state then normalized for free? No. An embedded measurement branch may implement a scaled version with a success probability. Return to the parent algorithm and account for that probability.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
