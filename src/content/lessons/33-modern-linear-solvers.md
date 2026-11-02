## The problem survives the improvement

The quantum linear-systems problem is to prepare $|x\rangle=A^{-1}|b\rangle/\|A^{-1}|b\rangle\|$, or estimate specified observables of it. Modern solvers improve the way inversion is implemented; they do not change this output into a classical vector for free. Assume a block encoding or a specified sparse-entry model for $A$, preparation of $|b\rangle$, and a promise that relevant singular values are bounded away from zero.

[Childs, Kothari and Somma](https://arxiv.org/abs/1511.02306) improved precision dependence using Fourier/Chebyshev representations instead of the original eigenvalue-estimation route. [QSVT](https://arxiv.org/abs/1806.01838) provides a general polynomial language. [Costa and collaborators](https://arxiv.org/abs/2111.08152) give a discrete-adiabatic approach with optimal combined query scaling in conditioning and precision in its block-access model. These are related but distinct algorithms; “modern solver” is a family label.

## Classical baseline and our exact target

Use normalized positive matrix $A=\operatorname{diag}(1/2,1)$ and $|b\rangle=(1,1)^T/\sqrt2$. Classical inversion gives $A^{-1}|b\rangle=(2,1)^T/\sqrt2$, whose normalized direction is $(2,1)^T/\sqrt5$. The condition number is two. Compare a large quantum instance with classical iterative solvers, preconditioning, and any available sampling access, using the same accuracy and output statistic.

The mechanism we will demonstrate is **polynomial inversion on a promised spectrum**. We deliberately avoid an eigenvalue register. A polynomial acts on all eigencomponents coherently through block-encoding circuits.

## Find a polynomial for the two known eigenvalues

From [QSP](/lessons/signal-processing/), $T_1(x)=x$ and $T_3(x)=4x^3-3x$ arise from one and three zero-phase signal calls. Choose

$$p(x)=\frac{2T_1(x)-T_3(x)}3=\frac{5x-4x^3}{3}.$$

At $x=1/2$, $T_3=-1$, so $p(1/2)=(1+1)/3=2/3$. At $x=1$, $T_3=1$, so $p(1)=(2-1)/3=1/3$. On these two eigenvalues, $p(x)=1/(3x)$. Hence $p(A)=A^{-1}/3$ exactly for this instance.

This interpolation is not a general reciprocal approximation. At $x=1/4$, $p(x)=(5/4-1/16)/3=19/48$, whereas $1/(3x)=4/3$, which cannot be a quantum amplitude. The spectrum promise is doing real work.

## Build the polynomial from actual unitary blocks

For each eigenvalue $x$ of $A$, use the signal block $W(x)=\begin{pmatrix}x&i\sqrt{1-x^2}\\i\sqrt{1-x^2}&x\end{pmatrix}$. On the full system this is the block unitary with $A$ on both diagonal blocks and $i\sqrt{I-A^2}$ on both off-diagonal blocks. It is explicit here because $A$ is diagonal. In a scalable algorithm the block encoding must come from the input model.

One signal call has good block $T_1(A)$; three calls have good block $T_3(A)$. Add a selector ancilla prepared as $\sqrt{2/3}|0\rangle+\sqrt{1/3}|1\rangle$. SELECT applies $W$ on label zero and $-W^3$ on label one. The minus sign is a label-conditioned phase, not a negative sampling probability. Unprepare the selector. Its zero branch is $(2W-W^3)/3$; selecting also signal-ancilla zero gives the block $p(A)$.

For the input $|b\rangle$, the successful system vector is

$$p(A)|b\rangle=\frac1{3\sqrt2}\begin{pmatrix}2\\1\end{pmatrix}.$$

The joint success probability of both ancillas being zero is $4/18+1/18=5/18$. Dividing by $\sqrt{5/18}$ gives $(2,1)^T/\sqrt5$. The output probabilities are $4/5$ and $1/5$, agreeing with classical inversion and the earlier HHL example after rescaling the input matrix.

## What costs did the construction actually use?

The controlled branch containing $W^3$ uses three signal operations, not one unit-cost powered oracle. The selector preparation, conditional phase, and unpreparation are additional gates. A direct controlled implementation can share operations because both branches contain $W$ and the second contains two extra calls, but every call remains counted. Selecting success requires measuring or coherently checking both ancillary registers.

The unitary circuit preserves total norm. Only the selected block has norm below one; no numerical normalization is performed until we describe the **conditional** output. General amplitude amplification can improve successful preparation if the whole circuit and its inverse are available. It does not remove the need for a lower spectral bound.

**Predict:** is this solver more accurate if we measure the successful system many more times?

<details><summary>Show the answer</summary>

The state is already exact for this two-point spectrum in ideal arithmetic. More measurements improve an estimated output probability. If the matrix had an eigenvalue outside the promised pair, the same circuit would apply the wrong polynomial there; additional shots would not fix that approximation error.

</details>

## General reciprocal approximations and conditioning

For a general normalized Hermitian $A$ with eigenvalues in $[-1,-1/\kappa]\cup[1/\kappa,1]$, approximate a scaled reciprocal $C/x$ on those intervals. The scale $C$ must keep amplitudes bounded. Polynomial degree grows as the excluded interval near zero shrinks and as the permitted approximation error decreases. QSVT implements the resulting polynomial with order-degree block calls.

A naive “approximate inverse, then amplify worst-case success” design can pay an unnecessary extra factor of $\kappa$. Better methods organize amplification, filtering, or a path of intermediate problems to improve this. The discrete-adiabatic solver of Costa et al. achieves $O(\kappa\log(1/\epsilon))$ block-oracle calls under its normalized access assumptions, with state error $\epsilon$. This does not include converting an arbitrary input file into that oracle, nor estimating a classical observable to additional error $\delta$.

Preconditioning changes the spectrum and may reduce $\kappa$, but a useful classical preconditioner is not automatically an efficient quantum operation. It must preserve efficient access and preparation; otherwise its construction cost can consume the apparent gain.

## Output, precision, and practical limitations

Observable estimation, full-vector reconstruction, state preparation, and oracle synthesis can dominate. Classical algorithms can also exploit low rank and sampling/query data structures; [Tang's result](https://arxiv.org/abs/1807.04271) is a concrete warning against comparing quantum data access with a weaker classical model. It does not eliminate every sparse or block-encoded linear-system advantage.

For the example, $\langle Z\rangle=4/5-1/5=3/5$ on the successful state. Independent $Z$ measurements estimate this number, each giving $+1$ or $-1$. They do not reveal the norm of the original unnormalized solution, which must be tracked or estimated separately if needed.

## Practice and connections

If the input is $|0\rangle$, joint success is $(2/3)^2=4/9$ and the answer state is still $|0\rangle$. For input $|1\rangle$, success is $1/9$ and the answer state is $|1\rangle$. The different success probabilities encode norm information even when the normalized direction does not change.

The concrete connection is now visible: HHL used an eigenvalue label to implement a reciprocal; this lesson used an LCU of Chebyshev blocks to obtain the same direction without that label. [Polynomial filtering](/lessons/polynomial-filtering/) uses a different desired scalar function in essentially the same matrix-access architecture.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Andrew M. Childs, Robin Kothari, Rolando D. Somma, [Quantum algorithm for systems of linear equations with exponentially improved dependence on precision](https://arxiv.org/abs/1511.02306): Fourier/Chebyshev approach and input model.
- Pedro C. S. Costa, Dong An, Yuval R. Sanders, Yuan Su, Ryan Babbush, Dominic W. Berry, [Optimal scaling quantum linear systems solver via discrete adiabatic theorem](https://arxiv.org/abs/2111.08152): improved query scaling and its access assumptions; abstract and publication theorem statement verified.
- András Gilyén et al., [Quantum singular value transformation and beyond](https://arxiv.org/abs/1806.01838): reciprocal polynomial transformations.
- Ewin Tang, [A quantum-inspired classical algorithm for recommendation systems](https://arxiv.org/abs/1807.04271): why compatible classical sampling access matters.
