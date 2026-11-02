In binary linear algebra, addition is XOR and multiplication is ordinary multiplication of bits. Everything is reduced modulo 2. An equation $s_0\oplus s_2=0$ says the two bits agree.

Simon's measurements may give $y=100$ and $y=011$. Each requires $y\cdot s=0$, where $y\cdot s$ is the parity of pairwise bit products. They imply $s_0=0$ and $s_1\oplus s_2=0$. Solutions are 000 and 011; under the promise that $s\ne000$, the answer is 011.

Rows are eliminated by XOR rather than subtracting real numbers. For rows 110 and 101, XOR gives 011. That operation preserves all solutions because any solution satisfying the first two has parity zero on their XOR. The zero row provides no information; repeated rows are dependent. Rank counts independent constraints.

For $n$ bits and a nonzero hidden mask, seek $n-1$ independent rows. Sampling does not guarantee a new independent row each time. Return to Simon with an explicit row-reduction or candidate check, not merely a collection of random bit strings.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
