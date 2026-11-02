The Pauli operators are the four single-qubit matrices
$$I=\begin{pmatrix}1&0\\0&1\end{pmatrix},\ X=\begin{pmatrix}0&1\\1&0\end{pmatrix},\ Y=\begin{pmatrix}0&-i\\i&0\end{pmatrix},\ Z=\begin{pmatrix}1&0\\0&-1\end{pmatrix}.$$
$X$ is a bit flip, $Z$ a phase flip, and $Y=iXZ$ does both. On several qubits, a Pauli string such as $X\otimes I\otimes Z$, written $XIZ$, applies one letter per qubit.

Check $Z$ on a state: $Z(0.6|0\rangle+0.8|1\rangle)=0.6|0\rangle-0.8|1\rangle$. Probabilities stay 0.36 and 0.64, but a later Hadamard would see the changed sign. Two Pauli strings either commute or anticommute. They anticommute exactly when they hold different non-identity letters on an odd number of qubits. For example, $XX$ and $ZZ$ differ on two qubits, so they commute.

Every $2\times2$ matrix is a combination of $I,X,Y,Z$, so errors are described as Pauli errors with probabilities. Return to the parent calculation and identify which letter each error applies and which checks it anticommutes with.

## Reference

Error-correction notation follows Daniel Gottesman, [Stabilizer Codes and Quantum Error Correction](https://arxiv.org/abs/quant-ph/9705052) (1997), and Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428) (2015). Numerical examples here are derived locally.
