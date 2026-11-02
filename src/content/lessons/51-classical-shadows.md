## Problem and access model

We want estimates of many specified properties of repeatedly prepared quantum states, without reconstructing every density-matrix entry. A classical shadow records randomized measurements and applies a known classical inverse map. It is a measurement-and-estimation protocol. [Huang, Kueng, and Preskill](https://arxiv.org/html/2002.08953) show bounds involving the number of observables, their shadow norms, precision, and failure probability. “Logarithmically many measurements” without the observable-dependent factor is misleading.

## One-qubit measurement rule

Choose X, Y, or Z uniformly, measure it, and record eigenvalue $b\in\{+1,-1\}$. Let $|v\rangle$ be the measured eigenvector. Define a classical estimator

$$\widehat\rho=3|v\rangle\langle v|-I.$$

The hat means an estimate, not another quantum state. Its eigenvalues are 2 and −1, so an individual snapshot is not a physical density matrix. The negative eigenvalue is part of classical statistical inversion, not negative measurement probability. Local Pauli measurements on many qubits use the tensor product of these one-qubit estimators.

## Derive the inverse map on a fixed state

Take $\rho=|0\rangle\langle0|=\operatorname{diag}(1,0)$. If Z is selected, outcome +1 occurs certainly, producing $\widehat\rho_Z=\operatorname{diag}(2,-1)$, with total probability 1/3. X gives either eigenvector |+〉 or |−〉, each with overall probability 1/6. Since their projectors sum to I,

$$\tfrac16[(3|+\rangle\langle+|-I)+(3|-\rangle\langle-|-I)]=I/6.$$

The two Y outcomes also contribute I/6. Adding every possible snapshot weighted by its true probability gives

$$\mathbb E[\widehat\rho]=\tfrac13\begin{pmatrix}2&0\\0&-1\end{pmatrix}+\tfrac13I=\begin{pmatrix}1&0\\0&0\end{pmatrix}=\rho.$$

Here $\mathbb E$ means an average over repeated randomized trials. This is why the inverse estimator works: its errors cancel statistically, not shot by shot.

## Estimate an observable and calculate its variance

For Z, compute $\widehat z=\operatorname{Tr}(Z\widehat\rho)$, where trace is the sum of diagonal entries. The Z snapshot gives $2-(-1)=3$; either X or Y snapshot gives 0. Thus $\widehat z$ is 3 with probability 1/3 and 0 with probability 2/3. Its mean is 1, its second moment is $9/3=3$, and variance is $3-1^2=2$. Averaging $m$ independent snapshots yields variance $2/m$.

The estimator can exceed the physical expectation range [−1,1] on a single trial. That is not an error: unbiasedness concerns its average. If Z were the **only** desired observable, directly measuring Z is better on |0〉, with zero ideal variance. Shadows offer reuse across many properties, not universal superiority for each one.

## Many-qubit extension and costs

For a Pauli string acting nontrivially on $k$ qubits, a locally randomized measurement matches all its required bases with probability $3^{-k}$. A matching snapshot contributes $3^k$ times the product of its ±1 outcomes; otherwise it contributes zero. Its second moment is at most $3^k$. This gives the exponential-in-locality cost explicitly. Estimating $M$ fixed Pauli strings to additive error $\epsilon$ with overall failure probability $\delta$ can use robust aggregation with sample scaling proportional to $3^k\log(M/\delta)/\epsilon^2$, up to constants. General observables have different norms and bounds; do not replace them all by this Pauli-string formula.

Each snapshot requires a fresh preparation and one choice of basis on each measured qubit. Storing the basis choices and outcomes costs order $n$ bits per snapshot, while classical evaluation of all requested observables also takes work. You need not materialize the entire $2^n\times2^n$ estimator matrix.

## Prediction and connection

**Predict:** For Z⊗Z under independent random local Pauli choices, how often is a snapshot useful and what value can it contribute?

<details><summary>Show the answer</summary>

Both choices must be Z, which happens with probability 1/9. Then the estimator is 9 times the product of the two outcomes; otherwise it is zero. Its second moment is 81/9=9. Nonlocal strings quickly become expensive despite the logarithmic dependence on how many observables are requested.

</details>

Compared with [tomography](/lessons/tomography/), this protocol keeps a compact measurement record suited to a family of queries. Compared with [VQE](/lessons/vqe/), it offers a different measurement-allocation strategy for many Hamiltonian terms, but cannot eliminate preparation, statistical error, or optimization costs. If observables are chosen adaptively to overfit the same record, additional generalization analysis is needed.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Hsin-Yuan Huang, Richard Kueng, John Preskill, [Predicting Many Properties of a Quantum System from Very Few Measurements](https://arxiv.org/html/2002.08953), random Pauli measurement construction, theorem statements, and nonlocal-observable limitations. The one-qubit estimator arithmetic is independent.
