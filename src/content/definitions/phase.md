For real amplitudes, a phase is simply a sign: $+1$ or $-1$. In general it is a unit-magnitude complex factor, $e^{i\theta}$; $\theta=0$ gives $+1$ and $\theta=\pi$ gives $-1$. A global phase multiplies every amplitude by the same factor; it changes no measurement predictions. A relative phase changes some amplitudes relative to others and can alter later interference.

The states $(1,1)^T/\sqrt2$ and $(-1,-1)^T/\sqrt2$ differ globally by −1. The states $(1,1)^T/\sqrt2$ and $(1,-1)^T/\sqrt2$ differ relatively. All four have immediate probabilities $1/2,1/2$. Applying $H$ to the first pair yields $|0\rangle$ and $-|0\rangle$, with identical outcomes. Applying $H$ to $(1,-1)^T/\sqrt2$ gives $|1\rangle$.

In phase kickback, $X|-\rangle=-|-\rangle$. A controlled target flip therefore negates only the corresponding input branch. Factoring this joint expression is algebra, not a gate that physically transfers a sign.

We needed the distinction because probability is calculated after contributions are combined. Return to the parent state; identify whether the phase multiplies the entire joint vector or just one branch.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
