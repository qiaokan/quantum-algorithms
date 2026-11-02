A basis is a set of independent reference vectors in which every vector has unique coordinates. For one qubit the computational basis is $|0\rangle=(1,0)^T, |1\rangle=(0,1)^T$. Another orthonormal basis is $|+\rangle=(1,1)^T/\sqrt2, |-\rangle=(1,-1)^T/\sqrt2$; “orthonormal” means unit length and zero [inner product](/definitions/inner-products/) between distinct members.

The same vector can have different coordinates: $|0\rangle=(|+\rangle+|-\rangle)/\sqrt2$. The right side expands to $((1,1)+(1,-1))/2=(1,0)$.

There are two different acts: rewriting coordinates on paper changes no state; applying $H$ physically rotates a state so a subsequent computational-basis measurement measures in the $+,-$ basis. If the initial state is $|+\rangle$, direct measurement is 50/50; apply $H$ first and measurement yields 0 with certainty.

**Predict:** Does merely writing $|0\rangle$ in a different basis randomize it? No. Only an actual change in the experiment changes outcome probabilities. Return to the algorithm and identify whether a displayed step is a gate or a rewrite.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
