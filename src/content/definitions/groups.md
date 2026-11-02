A group is a set with an associative combining rule, an identity, and an inverse for each element. Integers modulo 4 with addition form a group: identity 0, inverse of 1 is 3. It is abelian because order of addition does not matter.

A subgroup is a subset closed under the same rules. In this example $K=\{0,2\}$ is a subgroup. Its cosets are shifts: $0+K=\{0,2\}$ and $1+K=\{1,3\}$. A function constant on each coset and different on different cosets hides $K$.

A character is a complex phase function respecting combination: $\chi(a+b)=\chi(a)\chi(b)$. On integers modulo 4, $\chi_k(x)=e^{2\pi i kx/4}$. For the coset $\{0,2\}$, its Fourier sum is $1+e^{\pi i k}$: it is 2 for even $k$ and 0 for odd $k$. The measured frequencies constrain the hidden subgroup.

Return to Fourier sampling with this explicit cancellation. For nonabelian groups, Fourier outcomes and representation structure are more complicated; the abelian result does not solve arbitrary hidden-subgroup problems.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
