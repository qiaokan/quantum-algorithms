An ancilla is an auxiliary qubit or register used to implement a computation. Its role must be specified: scratch space, an oracle target, a success flag, or a phase-estimation register. It is not free memory.

Deutsch's target starts in $|1\rangle$, becomes $|-\rangle=(|0\rangle-|1\rangle)/\sqrt2$, and ends in the same state while the input acquires relative signs. In HHL a flag begins in $|0\rangle$ and is measured; retaining flag 1 has a specific success probability.

A workspace bit that stores the input value can obstruct interference. Compare $(|00\rangle+|11\rangle)/\sqrt2$ with $(|00\rangle+|10\rangle)/\sqrt2$: applying $H$ to the left bit gives random left outcomes for the first state and deterministic 0 for the second. Erasing the workspace by simply ignoring it does not restore coherence. Use [uncomputation](/definitions/uncomputation/) when the circuit permits it.

Return to the parent circuit and identify each register's initial and required final states; leaving those unspecified can invalidate the algorithm.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
