## Problem and access model

State tomography reconstructs a classical description of an unknown quantum state from many independently prepared copies. The output is an estimated density matrix, not a measurement of all amplitudes from one specimen. The state source must provide fresh copies drawn from the same preparation procedure. For an arbitrary $n$-qubit mixed state, the matrix has dimension $d=2^n$ and $d^2-1$ real parameters. [Haah and collaborators](https://arxiv.org/abs/1508.01797) analyze sample-optimal tomography and show why rank, accuracy metric, and collective versus independent measurements matter.

## Classical baseline and what is unknown

If a classical simulator already supplies the state vector, tomography is unnecessary: compute its density matrix. When the state is an unknown physical preparation, classical computation cannot replace the missing measurements. A fair comparison is between measurement/reconstruction protocols, including physical costs, rather than claiming that tomography beats reading a classical vector.

For one qubit write

$$\rho=\tfrac12(I+xX+yY+zZ)=\frac12\begin{pmatrix}1+z&x-iy\\x+iy&1-z\end{pmatrix}.$$

The three unknown real numbers $x,y,z$ are the expectations of the Pauli observables X,Y,Z. The [density matrix](/definitions/density-matrices/) represents probabilities and coherence together. A valid state has trace one, nonnegative eigenvalues, and $x^2+y^2+z^2\le1$.

## Work an unknown-state reconstruction

For the worked instance, imagine the preparation is $|\psi\rangle=(\sqrt3/2,i/2)^T$, but the experimenter does not know that vector. We use it only to calculate ideal probabilities for checking the reconstruction. Its outer product is

$$\rho=\binom{\sqrt3/2}{i/2}(\sqrt3/2,-i/2)
=\begin{pmatrix}3/4&-i\sqrt3/4\\i\sqrt3/4&1/4\end{pmatrix}.$$

A Z measurement gives +1 with probability 3/4 and −1 with probability 1/4, so $z=3/4-1/4=1/2$. For X, apply H first. The amplitudes become $(\sqrt3+i)/(2\sqrt2)$ and $(\sqrt3-i)/(2\sqrt2)$; both squared magnitudes are $(3+1)/8=1/2$. Thus $x=0$.

For Y, first apply $S^\dagger=\operatorname{diag}(1,-i)$, then H. The first operation gives $(\sqrt3/2,1/2)^T$; H gives $(\sqrt3+1,\sqrt3-1)^T/(2\sqrt2)$. Their squared magnitudes are $(2+\sqrt3)/4$ and $(2-\sqrt3)/4$, so $y=\sqrt3/2$.

Substitute $x=0,y=\sqrt3/2,z=1/2$ into the matrix formula. It reproduces every entry above. This completes reconstruction from the three ideal expectation values. In a real experiment each probability is estimated from repeated independent trials; none of these exact numbers is asserted to be measured hardware data.

## Distinguish a mixture from an unknown pure superposition

A preparation that makes |0〉 half the time and |1〉 half the time has matrix $\rho=(|0\rangle\langle0|+|1\rangle\langle1|)/2=I/2$. It gives equal ±1 probabilities in each of X,Y,Z. The pure state |+〉 also gives equal Z probabilities, but its matrix is $\tfrac12\begin{pmatrix}1&1\\1&1\end{pmatrix}$ and its X measurement is always +1. The off-diagonal entries distinguish coherent relative phase from classical uncertainty.

Averaging the two state vectors and renormalizing would incorrectly turn the mixture into |+〉. Density matrices instead average outer products, which preserve the actual measurement statistics. We needed this distinction because tomography does not promise that the unknown source is pure. The reconstruction formula works for both cases; an extra purity assumption must be justified from the preparation model or tested with suitable evidence, not inferred from a visually clean histogram in one basis.

## Statistical and physical constraints

With $m$ independent shots for one Pauli, the mean of ±1 scores has variance $(1-\langle P\rangle^2)/m\le1/m$. Smaller errors require more copies. Combining three noisy means can give a point outside the unit Bloch sphere, producing a matrix with a negative eigenvalue. For example $(x,y,z)=(1,1,1)$ has length √3 and is not a valid state. Constrained estimation or projection can restore physicality, while introducing estimator bias that should be reported.

An exact state is not identified by finitely many generic noisy observations. A reconstruction must state an error metric, confidence, and preparation/measurement assumptions. Calibration errors are not reduced simply by collecting more shots. For many qubits, full arbitrary-state output already requires exponentially many numbers; low-rank or structured-state assumptions change the task and must be explicit.

## Prediction, implementation, and connections

**Predict:** Can Z measurements distinguish |+〉 from |−〉?

<details><summary>Show the answer</summary>

No. Both give 0 and 1 equally often. X measurements distinguish them deterministically because H|+〉=|0〉 and H|−〉=|1〉. The missing information is relative phase, represented by off-diagonal density-matrix entries.

</details>

A runnable one-qubit implementation needs only state preparation, basis-change gates, sampled bit counts, and the reconstruction formula. For many qubits, enumerate measured Pauli settings or use a structured protocol; do not extrapolate the three-setting one-qubit example to a constant-cost general algorithm. [Classical shadows](/lessons/classical-shadows/) change the desired output from full reconstruction to selected observable estimates. That narrower goal is how they can avoid some tomography costs.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Jeongwan Haah, Aram W. Harrow, Zhengfeng Ji, Xiaodi Wu, Nengkun Yu, [Sample-optimal tomography of quantum states](https://arxiv.org/abs/1508.01797): sample complexity depends on dimension, rank, accuracy, and allowed measurement model. The Pauli reconstruction is independently calculated.
