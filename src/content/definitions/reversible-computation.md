A reversible function maps distinct inputs to distinct outputs. Ordinary AND loses information: 00, 01, 10 all produce 0. Retain the inputs and write the answer by XOR into a target to make it reversible:

$$(a,b,y)\longmapsto(a,b,y\mathbin\oplus(ab)).$$

Here XOR, $\oplus$, is addition modulo 2: $0\oplus0=1\oplus1=0$ and $0\oplus1=1\oplus0=1$. This three-bit map is the Toffoli gate. For $(1,1,0)$ it produces $(1,1,1)$; a second application restores $(1,1,0)$.

A whole classical program can be embedded in a reversible circuit using auxiliary workspace, retaining enough history to undo operations. That workspace must be cleaned before it unintentionally records which branch was taken and blocks interference. See [uncomputation](/definitions/uncomputation/).

The oracle $|x,y\rangle\mapsto|x,y\oplus f(x)\rangle$ is reversible even when $f$ itself is many-to-one, because $x$ remains. Return to the algorithm with this full operation, not an irreversible replacement of $x$ by $f(x)$.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
