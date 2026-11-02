A logical qubit is one qubit of information stored across many physical qubits by a code. Its logical operators $\bar X$ and $\bar Z$ commute with every stabilizer and anticommute with each other, just as $X$ and $Z$ do on a single qubit.

Worked: in the three-qubit repetition code, $|\bar0\rangle=|000\rangle$ and $|\bar1\rangle=|111\rangle$, with $\bar X=XXX$ and $\bar Z=Z_0$. The encoded state $0.6|000\rangle+0.8|111\rangle$ represents the logical state $0.6|\bar0\rangle+0.8|\bar1\rangle$. In the distance-3 surface code, $\bar X=X_0X_3X_6$ and $\bar Z=Z_0Z_1Z_2$ on 9 data qubits.

Resource estimates count logical qubits first, then multiply by the physical qubits per logical qubit, $2d^2-1$ for one surface-code patch. Return to the parent lesson and identify which operators act on the logical qubit.

## Reference

Error-correction notation follows Daniel Gottesman, [Stabilizer Codes and Quantum Error Correction](https://arxiv.org/abs/quant-ph/9705052) (1997), and Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428) (2015). Numerical examples here are derived locally.
