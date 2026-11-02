A Clifford gate $U$ maps every Pauli string $P$ to another Pauli string under conjugation: $UPU^\dagger$ is again a Pauli string, possibly with a sign. Hadamard $H$, phase $S=\mathrm{diag}(1,i)$ and CNOT generate all Clifford gates.

Worked: $HXH=Z$ and $HZH=X$. For $S$: $SXS^\dagger=\begin{pmatrix}0&-i\\i&0\end{pmatrix}=Y$. A CNOT from qubit $a$ to qubit $b$ maps $X_a\mapsto X_aX_b$ and $Z_b\mapsto Z_aZ_b$. The gate $T=\mathrm{diag}(1,e^{i\pi/4})$ is not Clifford: $TXT^\dagger=(X+Y)/\sqrt2$ is a sum of two Pauli strings, not one.

Clifford circuits can be simulated efficiently with a stabilizer tableau, and on a surface-code processor they are the cheap operations. Return to the parent lesson and check whether each gate in the circuit is Clifford.

## Reference

Error-correction notation follows Daniel Gottesman, [Stabilizer Codes and Quantum Error Correction](https://arxiv.org/abs/quant-ph/9705052) (1997), and Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428) (2015). Numerical examples here are derived locally.
