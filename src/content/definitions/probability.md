A probability is a number from zero to one assigning a chance to an outcome. Disjoint outcomes add: if labels 00 and 01 have probabilities $1/8$ and $3/8$, the chance that the left bit is 0 is $4/8=1/2$. This sum is called a marginal probability.

For quantum amplitudes, first add all contributions to the same output amplitude, then take its squared magnitude. Contributions $1/2$ and $-1/2$ yield amplitude 0 and probability 0, not probability $1/2$. For a [complex number](/definitions/complex-numbers/) $a+bi$, the probability is $a^2+b^2$.

A shot is one repeated preparation and measurement. In 100 fair-coin shots, 50 zeroes is the expected count, not a guarantee. With independent 0/1 observations of probability $p$, the average has variance $p(1-p)/m$ after $m$ shots. Variance means the average squared deviation from the mean. Thus ordinary sampling accuracy scales like $1/\sqrt m$ at fixed confidence. The site distinguishes these random counts from exact simulator probabilities.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
