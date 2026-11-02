A polynomial is a finite sum of powers with coefficients, such as $p(x)=3x-4x^3$. Its degree is the highest nonzero power, here 3. At $x=1/2$, $p(1/2)=3/2-4/8=1$.

For a square matrix, $p(A)=3A-4AAA$. If $A=\operatorname{diag}(1/2,1/4)$, powers act entrywise on this diagonal and give $p(A)=\operatorname{diag}(1,11/16)$. For a nondiagonal matrix, do not apply $p$ independently to every entry; matrix multiplication mixes them.

QSP and QSVT synthesize constrained polynomials through unitary operations. A bounded target on the relevant interval and degree/parity conditions matter. A function like $1/x$ is unbounded at zero, so inversion must exclude a neighborhood of zero or rescale the target and accept postselection costs.

Return to the parent method with a concrete interval, approximation error, and polynomial degree. Degree often measures how many times an expensive block encoding is queried.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
