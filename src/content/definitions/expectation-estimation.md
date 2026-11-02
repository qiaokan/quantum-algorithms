Suppose measuring an observable returns values +1 or −1. Averaging $m$ independent prepared-and-measured shots estimates its expectation. If 75 of 100 shots return +1, the estimate is $(75-25)/100=0.5$.

A mean is not a guaranteed result. For outcomes in $[-1,1]$, Hoeffding's bound gives failure probability at most $2e^{-m\epsilon^2/2}$ for absolute error at least $\epsilon$. Thus $m\ge 2\ln(2/\delta)/\epsilon^2$ suffices for confidence $1-\delta$. This is a conservative bound, not a minimal budget.

If $H=c_1P_1+c_2P_2$, estimate each measurable component and combine $c_1\widehat{\langle P_1\rangle}+c_2\widehat{\langle P_2\rangle}$. Noncommuting terms generally need separate copies. Quantum amplitude estimation can improve oracle dependence only when one can coherently prepare the sampling experiment and reverse it; it does not improve an arbitrary stream of already-measured classical bits.

Return to VQE or a linear-system observable with a measurement plan and precision target, not only a formula for an exact simulator expectation.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
