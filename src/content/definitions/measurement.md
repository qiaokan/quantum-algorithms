A computational-basis measurement returns one basis label, with probability equal to the squared magnitude of that label's amplitude. For $(3|0\rangle+4|1\rangle)/5$, it returns 0 with $9/25$ or 1 with $16/25$. It does not print the amplitudes 3/5 and 4/5.

If only part of a register is measured, add the probabilities of all compatible labels. For $(|00\rangle+|11\rangle)/\sqrt2$, measuring the first bit returns 0 or 1 equally; conditioned on the result 0, the joint state is $|00\rangle$. See [conditional probability](/definitions/conditional-probability/).

Repeating the experiment estimates a distribution only if the initial state is prepared anew. Measuring the same state twice in the same basis does not provide two independent samples: after the first readout it is already in the observed subspace.

**Predict:** Does measuring $(|0\rangle-|1\rangle)/\sqrt2$ directly distinguish it from $(|0\rangle+|1\rangle)/\sqrt2$? No. Apply $H$ before measurement: the outputs become 1 and 0. Return to the algorithm and specify the measurement basis.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
