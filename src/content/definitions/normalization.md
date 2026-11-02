Measurement probabilities must add to one. If amplitudes are $a_j$, normalization means $\sum_j|a_j|^2=1$, where $\sum_j$ says “add over all labels $j$.” The norm is $\|a\|=\sqrt{\sum_j|a_j|^2}$.

The raw vector $(1,2)^T$ has squared length $1+4=5$. Dividing by $\sqrt5$ gives $(1,2)^T/\sqrt5$ with probabilities $1/5,4/5$. This is a mathematical description of a desired state, not a physical procedure for preparing it for free.

After conditioning on a measurement outcome, dividing the remaining branch by its norm gives the conditional state. The branch's former squared norm is its probability and must not be discarded. For example the unnormalized successful branch $(1/2,1/4)^T$ has probability $1/4+1/16=5/16$ and normalized state $(2,1)^T/\sqrt5$.

**Predict:** Is $(1,-1)^T/2$ normalized? No, its total probability is $1/2$. A deterministic unitary gate may not silently rescale it. Return to the parent calculation with both the branch probability and normalized conditional state.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
