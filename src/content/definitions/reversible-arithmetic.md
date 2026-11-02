Arithmetic inside a quantum algorithm must be a reversible circuit. Addition can retain its input and act modulo a fixed power of two: on a two-bit target, add 1 via the permutation $0\to1\to2\to3\to0$. Its inverse subtracts 1.

For modular multiplication in order finding, multiplication by $a$ modulo $N$ is reversible on $0,\ldots,N-1$ when $\gcd(a,N)=1$. With $a=2,N=5$, the mapping is $0\to0,1\to2,2\to4,3\to1,4\to3$. For unused binary labels 5,6,7, define a reversible extension, such as leaving them fixed. Without that extension it is not a complete three-qubit gate.

A powered multiplier $M_a^{2^j}$ can be built by first computing $a^{2^j}\bmod N$ classically and implementing one multiplier by that constant. This special arithmetic shortcut does not grant cheap powers of an arbitrary unknown unitary. Carry bits and comparisons require workspace and uncomputation. Return to Shor with both the reversible map and its bit-length-dependent circuit cost.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
