This circuit estimates the real part of $\langle\psi|U|\psi\rangle$ using controlled-$U$. Prepare control 0 and target $\psi$, apply $H$ to control, then controlled-$U$, then $H$ again. The joint state becomes

$$\frac12|0\rangle(|\psi\rangle+U|\psi\rangle)+\frac12|1\rangle(|\psi\rangle-U|\psi\rangle).$$

The probability of control 0 is $\|\psi+U\psi\|^2/4=(1+\operatorname{Re}\langle\psi|U|\psi\rangle)/2$. For target $|1\rangle$ and $U=\operatorname{diag}(1,i)$, the overlap is $i$, real part zero, so the control is 50/50. The target stays $|1\rangle$; the control acquired a relative phase $i$ before the final $H$.

Inserting $S^\dagger=\operatorname{diag}(1,-i)$ on the control before the final $H$ instead gives $(1+\operatorname{Im}\langle\psi|U|\psi\rangle)/2$. Here it becomes 1. Repeating measurements estimates the overlap; no one shot prints a continuous value. Return to the parent estimator and count the controlled operation and repeated preparations.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
