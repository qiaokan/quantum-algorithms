Uncomputation reverses a computation to remove its temporary records. Suppose a reversible circuit computes $|x,0\rangle\mapsto|x,g(x)\rangle$. After using $g(x)$ to change a phase or another output, apply the inverse circuit to restore the workspace to zero.

For $g(x)=x$, start from $(|0\rangle+|1\rangle)|0\rangle/\sqrt2$. CNOT gives $(|00\rangle+|11\rangle)/\sqrt2$. Apply $Z$ to the workspace: $(|00\rangle-|11\rangle)/\sqrt2$. Undo CNOT: $(|00\rangle-|10\rangle)/\sqrt2=|-\rangle|0\rangle$. Now $H$ on the input yields $|10\rangle$ deterministically.

If we omit the final CNOT, $H$ produces four amplitudes $1/2, -1/2,1/2,1/2$ in order $00,01,10,11$, so the left bit is random. The workspace still distinguishes the two contributions. This is why “discard the junk” is insufficient.

We needed uncomputation to make interference possible again. Return to the original operation, counting both the forward and reverse circuit costs.

## Reference

Foundational notation follows [IBM Quantum Learning — Basics of quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information), John Watrous / IBM. Numerical examples here are derived locally. Algorithm-specific uses and costs are sourced in their parent lessons.
