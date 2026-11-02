An oracle specifies how the input problem can be accessed. A classical oracle accepts a classical $x$ and returns $f(x)$. A coherent reversible oracle is the unitary $U_f|x,y\rangle=|x,y\oplus f(x)\rangle$, including its action on superpositions. Coherent access is a different interface, not a classical API called on a Python list.

For $f(0)=0,f(1)=1$, $U_f$ fixes $00,01$ and swaps $10,11$. That is CNOT. With target $|-\rangle$, it acts as $|x\rangle|-\rangle\mapsto(-1)^{f(x)}|x\rangle|-\rangle$, called a phase oracle. The function-dependent sign comes from the same single coherent circuit call.

A simulator evaluates a truth table classically to construct or apply the permutation. This classical simulation work is not a physical quantum speedup. For a real application one must implement the predicate reversibly; arbitrary tables may require substantial loading circuitry.

Return to the parent complexity comparison with access assumptions fixed. Never hide $f(0)$ and $f(1)$ inside a classical wrapper and call the wrapper one elementary evaluation.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
