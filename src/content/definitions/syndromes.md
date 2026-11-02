A syndrome is the list of measured stabilizer outcomes, written as bits: 0 for $+1$ and 1 for $-1$. An error that anticommutes with a stabilizer flips that stabilizer's bit, so the syndrome locates errors without revealing the encoded state.

Worked: in the three-qubit repetition code with checks $Z_0Z_1$ and $Z_1Z_2$, a bit flip on qubit 1 anticommutes with both, giving syndrome $(1,1)$. A flip on qubit 0 gives $(1,0)$. Different errors can share a syndrome: flips on qubits 0 and 1 together give $(0,1)$, the same as a single flip on qubit 2. That shared syndrome is why two errors defeat a distance-3 code.

Under repeated measurement, decoders use changes in the syndrome between rounds, called detection events. Return to the parent lesson and compute which checks the error anticommutes with.

## Reference

Error-correction notation follows Daniel Gottesman, [Stabilizer Codes and Quantum Error Correction](https://arxiv.org/abs/quant-ph/9705052) (1997), and Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428) (2015). Numerical examples here are derived locally.
