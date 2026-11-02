## Problem and access model

Given a Boolean checker $f$ over $N$ indices, estimate the number $M$ for which $f(x)=1$. The count is hidden; we can evaluate the checker coherently. Specify whether the desired output is an exact integer, an additive estimate, or a relative estimate—these demands have different costs.

Classical exhaustive counting uses $N$ checks. Randomly sampling indices estimates the marked fraction $a=M/N$ with additive error $\epsilon$ using order $1/\epsilon^2$ independent samples at constant confidence. That estimate gives count error $\epsilon N$, not necessarily an exact integer. [Brassard and collaborators](https://arxiv.org/html/quant-ph/0005055) connect counting to estimating the eigenphases of the Grover iterate.

## Count two marked items among four

Let indices 1 and 3 be marked. Define normalized vectors

$$|B\rangle={|00\rangle+|10\rangle\over\sqrt2},\qquad
|G\rangle={|01\rangle+|11\rangle\over\sqrt2}.$$

The uniform input is $|s\rangle=(|B\rangle+|G\rangle)/\sqrt2$. In coordinates $(|B\rangle,|G\rangle)$, the checker is $S_f=\operatorname{diag}(1,-1)$ and reflection about $|s\rangle$ is

$$R_s=\begin{pmatrix}0&1\\1&0\end{pmatrix}.$$

Their product, with the right-hand operation applied first, is

$$Q=R_sS_f=\begin{pmatrix}0&-1\\1&0\end{pmatrix}.$$

It rotates the two coordinates by a quarter turn. Direct measurement after any integer number of Grover iterations still has success $1/2$, so merely watching success frequencies at a few iterations does not expose an exact count in one shot.

## Find the eigenphases explicitly

Try the vector $|v_+\rangle=(|B\rangle-i|G\rangle)/\sqrt2$. Multiplication gives

$$Q{1\over\sqrt2}\begin{pmatrix}1\\-i\end{pmatrix}
={1\over\sqrt2}\begin{pmatrix}i\\1\end{pmatrix}
=i{1\over\sqrt2}\begin{pmatrix}1\\-i\end{pmatrix}.$$

Its eigenvalue is $i=e^{2\pi i/4}$. The other normalized eigenvector $|v_-\rangle=(|B\rangle+i|G\rangle)/\sqrt2$ has eigenvalue $-i=e^{2\pi i3/4}$. Expanding $|s\rangle$ in these two eigenvectors gives coefficients $(1+i)/2$ and $(1-i)/2$. Each coefficient has squared magnitude $1/2$.

We needed eigenvectors to know what phase estimation will measure. We can now apply [QPE](/lessons/phase-estimation/) to $Q$, using two counting bits. Controlled $Q^2$ and $Q$ create phase ramps for phases $1/4$ and $3/4$, and inverse $F_4$ maps those ramps to labels 1 and 3. The final joint state is

$$\frac{1+i}{2}|01\rangle|v_+\rangle+\frac{1-i}{2}|11\rangle|v_-\rangle.$$

Thus labels 1 and 3 occur with probability $1/2$ each. They correspond to opposite signs of the same rotation angle.

## Convert the measurement into a count

For a general marked fraction $a$, define $\theta$ by $\sin^2\theta=a$, with $0\leq\theta\leq\pi/2$. The Grover eigenvalues are $e^{\pm2i\theta}$, so QPE phases are $\theta/\pi$ and $1-\theta/\pi$. If the counting grid has size $K$, convert a sample $y$ using

$$\widehat M=N\sin^2(\pi y/K).$$

The hat means an estimate. In our example, $N=4,K=4$. Both $y=1$ and $y=3$ give $4(1/2)=2$. The measurement is random but the final count is exact for this special grid-aligned instance.

**Predict:** why not interpret the label 3 as “three marked items”?

<details><summary>Show the answer</summary>

The counting register contains a phase label. It must be divided by the grid size, mapped through the sine-square relation, and multiplied by $N$. The two labels 1 and 3 encode conjugate eigenphases, not different counts.

</details>

## Precision, failure and resource accounting

For general $M$, the eigenphases do not fall exactly on a grid. Canonical amplitude-estimation analysis gives, with constant success probability, a count error bounded by

$${2\pi\sqrt{M(N-M)}\over K}+{\pi^2N\over K^2}.$$

Here $K$ measures the Fourier resolution and is proportional to the total number of Grover uses, not their logarithm. A $\log_2K$-bit counting register invokes powers whose base costs sum to $K-1$. Confidence can be increased by independent repetitions with suitable aggregation.

To guarantee the exact integer by rounding, error must be below $1/2$. A fixed additive fraction error is insufficient. Relative error is also demanding when $M$ is tiny. If $M=0$ or $M=N$, treat the endpoints explicitly; some intermediate angle formulas divide by terms that vanish there.

A controlled Grover iterate needs controlled checker logic, controlled state reflection and clean workspace. A phase oracle supplied only as an unknown black box does not automatically supply its controlled version; the access model must include a construction or such access. Synthesis and fault tolerance add costs beyond ideal queries.

## Connections

Counting is amplitude estimation for uniform state preparation and a Boolean success flag. [General amplitude estimation](/lessons/amplitude-estimation/) keeps the same angle machinery but replaces the fraction of marked indices with the success probability of an arbitrary reversible preparation. It is the bridge from finding a witness to estimating numerical quantities.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Gilles Brassard, Peter Høyer, Michele Mosca and Alain Tapp, [Quantum Amplitude Amplification and Estimation](https://arxiv.org/html/quant-ph/0005055), amplitude-estimation theorem and counting applications: phase-to-count relation and error guarantee.
- Michel Boyer et al., [Tight bounds on quantum searching](https://arxiv.org/abs/quant-ph/9605034): search-angle and approximate-counting connection.
