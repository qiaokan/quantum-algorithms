## Problem and access model

The variational quantum eigensolver (VQE) tries to find a low-energy state of a given Hamiltonian $H$, a Hermitian matrix encoding the energy observable. Its output is a set of circuit parameters, an estimated energy, and a circuit preparing the corresponding state. It does not generally certify the exact ground state. The [original VQE paper](https://arxiv.org/abs/1304.3061) introduced a hybrid quantum measurement/classical optimization approach. Its small physical experiment is separate from the ideal arithmetic below; no new hardware result is claimed here.

An *ansatz* is a chosen parameterized family of states. The quantum device prepares a candidate, measures terms of the energy, and the classical optimizer proposes another parameter. Inputs include an efficiently executable circuit family and a usable decomposition of $H$ into measurable operators. Converting a chemistry instance into that representation is part of the full application cost.

## Classical baseline and exact target

For one qubit choose

$$H=Z+X=\begin{pmatrix}1&1\\1&-1\end{pmatrix},\quad Z=\begin{pmatrix}1&0\\0&-1\end{pmatrix},\quad X=\begin{pmatrix}0&1\\1&0\end{pmatrix}.$$

Classically solve $H^2=2I$, so the two eigenvalues are $\pm\sqrt2$. The lowest energy is $-\sqrt2\approx-1.414214$. This is an exact baseline, vastly cheaper than using quantum hardware for this example. Larger quantum systems need comparisons with sparse methods, tensor networks, and chemistry-specific approaches, not merely dense diagonalization.

## Prepare a candidate and calculate its energy

Use $|\psi(\theta)\rangle=R_y(\theta)|0\rangle$, with

$$R_y(\theta)=\begin{pmatrix}\cos(\theta/2)&-\sin(\theta/2)\\\sin(\theta/2)&\cos(\theta/2)\end{pmatrix}.$$

Define $c=\cos(\theta/2)$ and $s=\sin(\theta/2)$. The state is $(c,s)^T$, normalized because $c^2+s^2=1$. Multiplication gives $H(c,s)^T=(c+s,c-s)^T$. Its [expectation value](/definitions/observables/) is the row-column product

$$E(\theta)=(c,s)\binom{c+s}{c-s}=c^2+2cs-s^2=\cos\theta+\sin\theta.$$

The final trigonometric rewrite is algebra, not another gate. At $\theta=0$, $E=1$. At $\theta=\pi$, $E=-1$. At $\theta=5\pi/4$, both sine and cosine are $-1/\sqrt2$, so $E=-\sqrt2$. One possible optimizer could compare these candidates and retain the last one. A general optimizer cannot assume the optimal angle is already known; we use the exact solution to audit the learning example.

## What is actually measured?

To estimate $\langle Z\rangle$, measure in the computational basis and score outcome 0 as +1, 1 as −1. At the optimal angle, probabilities are $(1-1/\sqrt2)/2\approx0.146447$ and $(1+1/\sqrt2)/2\approx0.853553$. The expected score is −0.707107.

To estimate $\langle X\rangle$, prepare a **fresh copy**, apply Hadamard, and measure Z. Because $HXH=Z$, equivalently $HZH=X$, the new measurement scores estimate X. Explicitly, $H(c,s)^T=((c+s)/\sqrt2,(c-s)/\sqrt2)^T$. Squaring these entries yields a difference $2cs=\sin\theta=-1/\sqrt2$. Add the two sample means to estimate $E$. One measurement cannot reveal both expectations exactly.

## Why the energy is an upper bound

Expand any normalized candidate as $\alpha|g\rangle+\beta|e\rangle$ in the ground and excited eigenvectors. Here $|\alpha|^2+|\beta|^2=1$. Orthogonality makes cross terms vanish, so

$$E=-\sqrt2|\alpha|^2+\sqrt2|\beta|^2=-\sqrt2+2\sqrt2|\beta|^2\ge-\sqrt2.$$

The state changes with parameters; the Hamiltonian does not. The argument extends to any Hermitian Hamiltonian. However, a noisy finite-sample estimate may lie below the true ground energy even when the exact expectation cannot. Such an estimate is statistical error, not a violation of the variational principle.

## Implementation and generalization

For a sum $H=\sum_jh_jP_j$, each $P_j$ is a tensor product of single-qubit Pauli operators. The coefficients $h_j$ are known real numbers. Estimate each expectation and combine them. If two independently measured means each use $m$ shots, each variance is at most $1/m$, so the variance of their sum in this toy is at most $2/m$. Achieving standard error at most $\eta$ therefore needs at least the conservative allocation $m\ge2/\eta^2$ per term. A confidence guarantee needs a specified concentration bound, not merely a standard error.

Each optimizer step consumes state preparations and measurements. Ansatz expressivity, optimization difficulty, noise, and measurement allocation all matter. The method has no general established practical speedup. A very expressive circuit can be expensive to train; a short circuit can miss the ground state entirely.

## Prediction and connections

**Predict:** What if the ansatz is only $R_z(\theta)|0\rangle$?

<details><summary>Show the answer</summary>

It changes only a global phase: $R_z(\theta)|0\rangle=e^{-i\theta/2}|0\rangle$. Every energy is 1, so no optimizer can reach −√2. A flat optimization landscape can mean an inadequate ansatz, not a bad optimizer.

</details>

[Energy estimation](/lessons/energy-estimation/) measures spectral information coherently; VQE spends repeated measurements and classical optimization to avoid that particular deep coherent circuit. [ADAPT-VQE](/lessons/adapt-vqe/) changes how the ansatz is selected, not the meaning of energy measurement.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Alberto Peruzzo, Jarrod McClean, Peter Shadbolt, Man-Hong Yung, Xiao-Qi Zhou, Peter J. Love, Alán Aspuru-Guzik, Jeremy L. O'Brien, [A variational eigenvalue solver on a quantum processor](https://arxiv.org/abs/1304.3061): hybrid variational framework and original experimental context. All one-qubit values above are independently derived ideal calculations.
