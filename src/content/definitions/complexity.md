A query is one use of a specified oracle. Gate complexity counts elementary logical operations, including the oracle's implementation if it is not treated as a free box. Runtime also includes scheduling, state preparation, repetitions, readout, classical work, and error correction.

$O(g(n))$ means an upper bound within a constant multiple of $g(n)$ for sufficiently large input size $n$. $\Omega$ is a lower bound; $\Theta$ means both. $\widetilde O$ suppresses stated logarithmic factors, not arbitrary loading or precision costs. An accuracy parameter $\epsilon$ is a permitted error; a failure parameter $\delta$ bounds the chance of exceeding it.

For Grover over $N$ candidates, $O(\sqrt N)$ oracle queries can cost $O(\sqrt N C_f)$ gates if one reversible predicate evaluation costs $C_f$. For phase estimation with powers $U,U^2,U^4$, three controlled blocks can require $1+2+4=7$ base-$U$ uses. Three blocks are not three elementary queries.

Logical qubits/gates are ideal error-corrected units. Physical implementations may use many noisy devices and repeated syndrome measurements per logical operation. This site does not infer wall-clock superiority from asymptotic query bounds.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
