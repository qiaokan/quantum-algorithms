Fourier measurement often gives a fraction close to $s/r$, with unknown period $r$. A continued fraction writes a real number as an integer plus the reciprocal of another such expression. Truncating it gives especially accurate rational approximations, called convergents.

For $3/8$, Euclidean division gives $8=2(3)+2$, $3=1(2)+1$, $2=2(1)$, hence $3/8=[0;2,1,2]=1/(2+1/(1+1/2))$. Truncations give $0,1/2,1/3,3/8$. These are candidates, not automatically true orders.

If a measured fraction is within $1/(2r^2)$ of a reduced fraction $s/r$, that fraction is a convergent. “Reduced” means numerator and denominator have gcd 1. If a phase is $2/4=1/2$, reconstruction returns denominator 2 although the underlying order might be 4. Verify candidate orders with modular exponentiation; combine further samples or test justified multiples. Zero phase gives no useful denominator.

Return to order finding with the measured numerator, register size, and a verification step. Continued fractions are classical postprocessing, not quantum gates.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
