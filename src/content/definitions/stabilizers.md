An operator $P$ stabilizes a state $|\psi\rangle$ when $P|\psi\rangle=|\psi\rangle$. In error correction, the stabilizers are commuting Pauli strings whose shared $+1$ eigenspace is the code space. Measuring a stabilizer gives $+1$ (syndrome bit 0) on every code state, so the measurement does not disturb the encoded information.

Worked: the Bell state $(|00\rangle+|11\rangle)/\sqrt2$ is stabilized by $XX$ and $ZZ$. Check $ZZ$: it multiplies $|00\rangle$ by $(+1)(+1)$ and $|11\rangle$ by $(-1)(-1)$, leaving the state unchanged. The three-qubit repetition code is stabilized by $Z_0Z_1$ and $Z_1Z_2$. Two independent stabilizers on three qubits leave a two-dimensional space: one logical qubit.

With $n$ qubits and $k$ independent stabilizers, $n-k$ logical qubits remain. Return to the parent lesson and count stabilizers against qubits.

## Reference

Error-correction notation follows Daniel Gottesman, [Stabilizer Codes and Quantum Error Correction](https://arxiv.org/abs/quant-ph/9705052) (1997), and Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428) (2015). Numerical examples here are derived locally.
