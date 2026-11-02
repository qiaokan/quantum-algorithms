## Two related tasks with different inputs

**Singular-value estimation** coherently attaches an approximate stretch factor to a matrix's singular-vector components. **Quantum principal-component analysis** seeks large-eigenvalue components of a density matrix or covariance-like object. They share spectral ideas, but their input models are not interchangeable. A block encoding, row-state preparation data structure, and supply of independent copies of an unknown density matrix are three distinct resources.

The original [quantum PCA proposal by Lloyd, Mohseni and Rebentrost](https://arxiv.org/abs/1307.0401) uses copies of a density matrix to implement approximate evolution under it. [Kerenidis and Prakash](https://arxiv.org/abs/1603.08675) use a structured data-access model for singular-value estimation in recommendation systems. [Tang's classical result](https://arxiv.org/abs/1807.04271) shows why compatible classical sampling access changes the comparison.

## Classical baseline and the singular-value calculation

For an explicit small matrix, compute an ordinary singular-value decomposition. For a large low-rank matrix with sample/query access, randomized classical methods may avoid reading all entries. For a genuinely quantum input state, classical reconstruction may itself require many measurements. State which problem and access model is being compared before claiming an exponential gain.

Take $A=\begin{pmatrix}0&1/2\\1&0\end{pmatrix}$ from the previous chapter. Because $A^\dagger A=\operatorname{diag}(1,1/4)$, the right singular vectors are $|0\rangle,|1\rangle$, with singular values one and $1/2$. A singular-value-estimation primitive on $(|0\rangle+|1\rangle)/\sqrt2$ ideally produces

$$\frac{|1\rangle_{\rm value}|0\rangle_{\rm vector}+|1/2\rangle_{\rm value}|1\rangle_{\rm vector}}{\sqrt2}.$$

The value labels stand for a chosen fixed-point binary representation, not amplitudes. Measuring them returns each singular value with probability $1/2$ for this input. It does not reveal both vector components in one shot.

One route constructs a walk with eigenphase related to singular value, estimates that phase, then converts it reversibly. The [qubitization](/lessons/qubitization/) example showed the relation $s=\cos\theta$ explicitly. Alternating input/output reflections handles the two singular-vector spaces. Phase precision and the cost of powered walks determine the query count; higher precision requires longer coherent evolution or more elaborate estimation.

## A density-matrix example: what does “principal” mean?

Let

$$\rho=\begin{pmatrix}3/4&0\\0&1/4\end{pmatrix}.$$

A [density matrix](/definitions/density-matrices/) is a positive semidefinite matrix with trace one. Its eigenvalues are nonnegative weights summing to one. Here the leading component is $|0\rangle$ with weight $3/4$; the other is $|1\rangle$ with weight $1/4$. “Principal” means associated with a large eigenvalue, not a universally useful semantic feature of data.

If ideal controlled $e^{2\pi i\rho}$ were available, two-bit phase estimation would attach label $11$ to $|0\rangle$ and $01$ to $|1\rangle$. Applied to a fresh system in state $\rho$, it samples those outcomes with probabilities $3/4$ and $1/4$. Conditional on the first outcome, the remaining system is the leading eigenstate. The result is a quantum state; describing its entries classically is a separate tomography problem.

## How copies can implement a small evolution step

Let $S$ be SWAP: $S|a\rangle|b\rangle=|b\rangle|a\rangle$. Since $S^2=I$, $e^{-i\delta S}=\cos\delta\,I-i\sin\delta\,S$. Supply a fresh copy of $\rho$ and a target state $\sigma$, apply this partial SWAP, then discard the first register. The target becomes

$$\mathcal E_\delta(\sigma)=\cos^2\delta\,\sigma+\sin^2\delta\,\rho-i\sin\delta\cos\delta(\rho\sigma-\sigma\rho).$$

The difference $\rho\sigma-\sigma\rho$ is the commutator. For small $\delta$, this equals $\sigma-i\delta(\rho\sigma-\sigma\rho)+O(\delta^2)$, the first-order change under $e^{-i\rho\delta}$. The disposable copy supplies the unknown matrix's action without first printing its entries.

## Calculate one partial-SWAP step

Choose target $\sigma=|+\rangle\langle+|=\frac12\begin{pmatrix}1&1\\1&1\end{pmatrix}$ and $\delta=\pi/6$. Then $\cos\delta=\sqrt3/2$, $\sin\delta=1/2$, and

$$\rho\sigma-\sigma\rho=\begin{pmatrix}0&1/4\\-1/4&0\end{pmatrix}.$$

Substitution gives

$$\mathcal E_{\pi/6}(\sigma)=\begin{pmatrix}9/16&3/8-i\sqrt3/16\\3/8+i\sqrt3/16&7/16\end{pmatrix}.$$

Its trace is $9/16+7/16=1$. Computational-basis measurement gives zero with probability $9/16$. By contrast, exact evolution under this diagonal $\rho$ preserves both populations at $1/2$ and changes only the off-diagonal phase: the upper-right entry becomes $e^{-i\pi/12}/2$. The one-step approximation is visibly imperfect.

Using many fresh copies with smaller $\delta=t/N$ reduces the accumulated simulation error. The original density-matrix-exponentiation construction has copy cost scaling like $t^2/\epsilon$ for simulation error $\epsilon$ in the relevant small-step analysis. Those copies are consumed. Controlled and long-time versions needed for phase estimation require their own accounted constructions and error budget.

**Predict:** can we reuse one unknown copy indefinitely because the procedure is called “exponentiation”?

<details><summary>Show the answer</summary>

No. The copy interacts with the target and is discarded; it is a resource, not a reusable classical description. Repeated use of a disturbed copy no longer implements the same channel. Quantum no-cloning does not provide the missing supply.

</details>

## Generalization and limitations

Eigenvalue precision must be sufficient to separate the leading component from nearby components. If eigenvalues are equal, there is no unique principal direction inside that eigenspace. Small eigenvalue weights are unlikely to be sampled unless the input or filtering procedure emphasizes them. A claim of efficient leading-eigenvector preparation therefore needs overlap, gap, copy preparation, and accuracy assumptions.

For classical data, preparing row states or a covariance density matrix can be expensive. If the preprocessing also gives a classical algorithm powerful sample/query access, include it in the baseline. Conversely, a quantum state produced by a physical experiment is not automatically a cheap classical dataset. There is no single “quantum PCA complexity” independent of these distinctions.

## Practice and connections

If $\rho=I/2$, every orthonormal basis is an eigenbasis and all eigenvalues are $1/2$. Phase estimation cannot identify a distinguished principal vector because none exists. If the target $\sigma$ commutes with $\rho$, the commutator term vanishes; a finite partial-SWAP step still mixes $\sigma$ toward $\rho$, demonstrating why the approximation needs small steps even when the exact unitary action is trivial.

This chapter reuses phase estimation, mixed states, and spectral filtering. Unlike [QSVT](/lessons/singular-value-transformation/), which can transform singular values without outputting their labels, estimation explicitly stores approximate labels for later use. Neither primitive makes classical vector readout free.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Seth Lloyd, Masoud Mohseni, Patrick Rebentrost, [Quantum principal component analysis](https://arxiv.org/abs/1307.0401): density-matrix exponentiation and copy-based PCA.
- Iordanis Kerenidis, Anupam Prakash, [Quantum Recommendation Systems](https://arxiv.org/abs/1603.08675): structured row-state access and singular-value methods; abstract verified.
- Ewin Tang, [A quantum-inspired classical algorithm for recommendation systems](https://arxiv.org/abs/1807.04271): compatible classical sample/query comparison; abstract verified.
- András Gilyén et al., [Quantum singular value transformation and beyond](https://arxiv.org/abs/1806.01838): block-encoding-based alternatives.
