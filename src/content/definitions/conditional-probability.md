Conditioning means retaining only trials satisfying an event. If $A$ and $B$ are events and $P(B)>0$, then $P(A\mid B)=P(A\text{ and }B)/P(B)$. The vertical bar means “given.”

Suppose joint probabilities for $00,01,10,11$ are $1/8,3/8,1/4,1/4$. Retain trials where the right bit is 0: total retained probability is $1/8+1/4=3/8$. Within these trials the left bit is 0 with probability $(1/8)/(3/8)=1/3$ and 1 with probability $2/3$.

In a quantum calculation, keep amplitudes for the retained labels and divide by the square root of the retained probability. This is [normalization](/definitions/normalization/) after measurement. The discarded trials still cost time: success probability $p$ gives expected $1/p$ independent trials before a success. Amplitude amplification can change that cost only if the preparation and needed reflections are available coherently.

We needed conditioning to interpret a successful branch, not to declare it certain. Return with both the conditional answer and the success probability.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
