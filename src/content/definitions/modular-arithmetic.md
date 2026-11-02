$a\bmod N$ is the remainder after division by positive integer $N$. For example $17\bmod5=2$. Congruence $a\equiv b\pmod N$ means the two remainders agree. You may reduce after each multiplication: $3^4\bmod7=(2^2)\bmod7=4$ because $3^2\bmod7=2$.

The greatest common divisor $\gcd(a,N)$ is the largest positive integer dividing both. Euclid's method repeatedly replaces $(a,N)$ by $(N,a\bmod N)$ until the remainder is zero: $\gcd(21,15)=\gcd(15,6)=\gcd(6,3)=3$. Numbers are coprime when their gcd is 1.

The order of $a$ modulo $N$ is the smallest positive $r$ such that $a^r\bmod N=1$, assuming coprimality. For $a=2,N=15$, remainders $1,2,4,8,1$ give $r=4$. Finding this period is Shor's quantum task; the gcd calculations after it are classical. Return to the parent example and distinguish ordinary equality from equality of remainders.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
