## Problem and access model

A quantum feature map is a circuit $U(x)$ preparing $|\phi(x)\rangle=U(x)|0\rangle$ from a classical input $x$. A kernel estimator measures the similarity $K(x,y)=|\langle\phi(x)|\phi(y)\rangle|^2$. A classical learning algorithm then uses the kernel values. The quantum output is an estimate of a scalar similarity; classification is a larger hybrid workflow. [Havlíček and collaborators](https://arxiv.org/abs/1804.11326) describe kernel estimation and a related variational classifier. Their proposal does not establish a general practical advantage for arbitrary datasets.

## A feature map that can be solved exactly

Take one real-valued feature $x$ interpreted as an angle and $U(x)=R_y(x)$. Then $|\phi(x)\rangle=(\cos(x/2),\sin(x/2))^T$. The inner product is

$$\langle\phi(x)|\phi(y)\rangle=\cos(x/2)\cos(y/2)+\sin(x/2)\sin(y/2)=\cos((x-y)/2).$$

Thus $K(x,y)=\cos^2((x-y)/2)$. This is an elementary classical kernel, so this toy offers no computational advantage. It makes the input/output contract and measurement operation explicit.

## Compute the kernel by a circuit

Prepare $U(y)|0\rangle$, apply $U(x)^\dagger=R_y(-x)$, and measure. Matrix multiplication combines the rotations to $R_y(y-x)$. Its output vector is $(\cos((y-x)/2),\sin((y-x)/2))^T$, so the probability of zero is exactly $K(x,y)$. The inverse circuit matters: the overlap is not obtained just by comparing bit strings from independently measured feature states.

For inputs $0,\pi/2,\pi$, the ideal kernel matrix is

$$K=\begin{pmatrix}1&1/2&0\\1/2&1&1/2\\0&1/2&1\end{pmatrix}.$$

For example $K(0,\pi)=\cos^2(\pi/2)=0$, while $K(0,\pi/2)=\cos^2(\pi/4)=1/2$. Diagonal entries equal one because a state overlaps perfectly with itself.

## Complete a small classification workflow

Train on inputs 0 and π with labels +1 and −1. Their two-by-two kernel matrix is identity. For kernel interpolation with no regularization, solve $K\alpha=y$, giving coefficients $\alpha=(1,-1)^T$. The score at a new input z is

$$f(z)=K(z,0)-K(z,\pi).$$

At $z=\pi/3$, $K(z,0)=3/4$ and $K(z,\pi)=1/4$, giving $f=1/2$ and predicted positive label. At $z=\pi/2$, both equal 1/2, yielding score zero: the chosen classifier is undecided unless a tie rule is specified. This classical postprocessing is essential to the output and is not a quantum operation. Regularization would change the coefficients and numerical conditioning.

## Why this is a valid kernel and what regularization changes

A real symmetric matrix K is [positive semidefinite](/definitions/positive-semidefinite/) when $v^TKv\ge0$ for every real coefficient vector v. For the overlap-squared kernel, let $\rho_x=|\phi(x)\rangle\langle\phi(x)|$. Then $K(x,y)=\operatorname{Tr}(\rho_x\rho_y)$. For real coefficients $v_j$, the quadratic form becomes $\operatorname{Tr}[(\sum_jv_j\rho_{x_j})^2]$, a sum of squared eigenvalues and therefore nonnegative. This property supports classical kernel optimization; it does not establish that computing K requires quantum resources.

For the two training examples, adding a ridge parameter λ>0 means solving $(K+\lambda I)\alpha=y$. Since K=I, the solution is $\alpha=(1,-1)/(1+\lambda)$. With λ=1, the score at π/3 changes from 1/2 to 1/4. The sign is unchanged, but the margin shrinks. On a nearly singular noisy kernel, regularization can stabilize the solve at the cost of changing the fitted function. Its choice belongs in validation, not in a hidden postprocessing step.

## Sampling, baseline, and scale

Each kernel circuit gives a Bernoulli outcome. After $m$ shots, the estimated overlap has variance $K(1-K)/m\le1/(4m)$. Estimating $D(D-1)/2$ off-diagonal entries for D training points requires many circuit executions, plus classical matrix storage and model fitting. Input encoding, circuit inverse, noise, and confidence requirements contribute to cost. An ideal kernel is positive semidefinite; independent noisy estimates need not be, and a correction changes the estimator.

A high-dimensional feature space alone is not an advantage: classical kernels also correspond to huge or infinite-dimensional spaces. A useful quantum feature map must provide a similarity that is hard to approximate classically **and** aligned with the learning task, robustly measurable, and worth its execution cost. A kernel may be hard to compute yet classify badly; a highly concentrated kernel may require prohibitive precision.

## Prediction and connections

**Predict:** Can two distinct inputs have K=1?

<details><summary>Show the answer</summary>

Yes. Here x=0 and y=2π prepare |0〉 and −|0〉, which differ only by global phase. Their kernel is one. Feature-map collisions can erase distinctions relevant to labels; more qubits do not automatically prevent them.

</details>

The overlap circuit is an application of uncomputation. A [SWAP test](/definitions/swap-test/) estimates a related overlap when the preparation inverses are unavailable, but has different resource and input assumptions. [Variational classifiers](/lessons/variational-classifiers/) instead train circuit parameters and measure a selected output; the two workflows should not be conflated.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Vojtěch Havlíček, Antonio D. Córcoles, Kristan Temme, Aram W. Harrow, Abhinav Kandala, Jerry M. Chow, Jay M. Gambetta, [Supervised learning with quantum enhanced feature spaces](https://arxiv.org/abs/1804.11326): feature-map kernel estimation and distinction from a trainable variational classifier. The one-dimensional learning example is original.
