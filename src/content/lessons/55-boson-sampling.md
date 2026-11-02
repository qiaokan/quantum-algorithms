## Problem and physical model

Boson sampling sends identical photons through a linear-optical interferometer and samples the detected photon counts in each output mode. A *mode* is a distinguishable optical channel; the photons themselves are indistinguishable. The input describes an interferometer and initial photon occupations. This is a sampling task, not a general-purpose optimization algorithm. [Aaronson and Arkhipov](https://arxiv.org/abs/1011.3245) analyze its complexity. Gaussian boson sampling (GBS) instead uses squeezed-state inputs; [Hamilton and collaborators](https://arxiv.org/abs/1612.01199) connect its probabilities to hafnians.

## Two photons and a beam splitter

Write $|n_0,n_1\rangle$ for occupation numbers, not two qubit bits. A creation symbol $a_j^\dagger$ adds a photon to mode j; for vacuum |0,0〉, $a_j^\dagger|0\rangle=|1_j\rangle$ and $(a_j^\dagger)^2|0\rangle=\sqrt2|2_j\rangle$. The √2 normalization accounts for identical-particle counting.

Choose a lossless beam splitter with transformations

$$a_0^\dagger\mapsto(b_0^\dagger+b_1^\dagger)/\sqrt2,\qquad
a_1^\dagger\mapsto(b_0^\dagger-b_1^\dagger)/\sqrt2.$$

Start with one photon in each input: $a_0^\dagger a_1^\dagger|\mathrm{vac}\rangle$. Multiplying gives

$$\tfrac12[(b_0^\dagger)^2-b_0^\dagger b_1^\dagger+b_1^\dagger b_0^\dagger-(b_1^\dagger)^2]|\mathrm{vac}\rangle.$$

Bosonic creation operators for different modes commute, so the middle terms cancel. Applying the normalization rule gives $(|2,0\rangle-|0,2\rangle)/\sqrt2$. The output probabilities are 1/2 for two photons in mode 0, 1/2 for two in mode 1, and zero for one in each. These are ideal theoretical values, not reported detector counts.

Distinguishable independent particles would yield probabilities 1/4,1/2,1/4. The absence of the split event is two-path destructive interference, not an attractive force between photons.

## The permanent in this example

For a two-by-two matrix $M$, its permanent is $M_{11}M_{22}+M_{12}M_{21}$: unlike a determinant, both permutation terms have positive signs. Our beam-splitter matrix is $M=\begin{pmatrix}1&1\\1&-1\end{pmatrix}/\sqrt2$, so its permanent is $-1/2+1/2=0$, matching the one-in-each amplitude. Repeated occupations require repeated rows/columns and factorial normalization. For many photons, the number of such path assignments grows rapidly; that structure underlies the complexity analysis, subject to its assumptions.

## Gaussian input: an explicit solvable case

A two-mode squeezed vacuum has state

$$|\Psi_\lambda\rangle=\sqrt{1-\lambda^2}\sum_{k=0}^{\infty}\lambda^k|k,k\rangle,\qquad0\le\lambda<1.$$

Here k counts photon pairs, and λ sets squeezing strength. With no subsequent interferometer and λ=1/2, the probabilities of 0,1,2 pairs are $3/4,3/16,3/64$; in general $P(k)=(3/4)(1/4)^k$. Their infinite sum is $(3/4)/(1-1/4)=1$. Sampling is classically trivial for this special GBS input. The photon number is random, unlike fixed-input boson sampling.

For a symmetric four-by-four pair-amplitude matrix B, its hafnian is $B_{12}B_{34}+B_{13}B_{24}+B_{14}B_{23}$, summing the three ways to pair four labels. If those entries are $(1/2,1/2,0,0,0,0)$ in that term order, the hafnian is 1/4. A physical GBS probability also requires covariance normalization and occupation factors; a hafnian value by itself is not a probability.

## Mix the Gaussian input and calculate nontrivial outputs

Now send the two-mode squeezed state through the same beam splitter. Its vacuum sector remains |0,0〉 with probability 3/4. Its one-pair sector, initially $\sqrt{3/4}(1/2)|1,1\rangle$, becomes $\sqrt{3/4}(1/2)(|2,0\rangle-|0,2\rangle)/\sqrt2$. Thus P(2,0)=P(0,2)=3/32 and P(1,1)=0. The total two-photon probability is 3/16, unchanged by the lossless interferometer.

The two-pair input is $\sqrt{3/4}(1/4)|2,2\rangle$. Since $|2,2\rangle=(a_0^\dagger)^2(a_1^\dagger)^2|\mathrm{vac}\rangle/2$, substitution gives

$$|2,2\rangle\longmapsto\frac{(b_0^\dagger)^4-2(b_0^\dagger)^2(b_1^\dagger)^2+(b_1^\dagger)^4}{8}|\mathrm{vac}\rangle
=\frac{\sqrt6}{4}|4,0\rangle-\frac12|2,2\rangle+\frac{\sqrt6}{4}|0,4\rangle.$$

The conditional probabilities 3/8,1/4,3/8 sum to one. Multiplying by the input two-pair probability 3/64 yields P(4,0)=P(0,4)=9/512 and P(2,2)=3/256. Their sum is 3/64. Higher sectors follow the same expansion, and each sector preserves its total probability. This is a genuine small Gaussian-input interferometer, including both its variable photon count and within-sector interference.

A direct classical sampler can first sample the geometric pair number and then the calculated conditional distribution for that sector. A numerical implementation must either retain an infinite analytic representation or truncate photon number and report discarded probability: keeping pair counts 0,1,2 discards $(1/4)^3=1/64$. A finite qubit-state simulator cannot silently represent unbounded photon occupations. For arbitrary many-mode pure Gaussian states, the covariance/pair-amplitude matrix and hafnian formula replace this hand expansion; gate loss and detection model change it further.

## Limitations and prediction

**Predict:** If the two incoming photons become distinguishable, does the exact zero split probability survive?

<details><summary>Show the answer</summary>

No. The two assignments can now be distinguished, so their probabilities add instead of their amplitudes canceling. In the fully distinguishable balanced case, the split probability is 1/2. Partial distinguishability interpolates and must be modeled experimentally.

</details>

Loss, distinguishability, detector limits, and approximate-sampling accuracy all affect the comparison. Complexity of a matrix function does not automatically prove hardness of sampling a noisy distribution. The approximate boson-sampling arguments rely on explicit conjectures; an experiment needs independent validation and comparison with contemporary classical methods. Finding useful applications is a separate question.

The completed examples are a fixed-photon beam splitter and a Gaussian-input two-mode interferometer with an explicit photon-truncation error. They are easy classical cases, not quantum-advantage demonstrations. The general hafnian formulation is an extension, not a claim that every covariance model was simulated here.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Scott Aaronson and Alex Arkhipov, [The Computational Complexity of Linear Optics](https://arxiv.org/abs/1011.3245): boson-sampling model, permanents, and conditional approximate-sampling hardness.
- Craig S. Hamilton, Regina Kruse, Linda Sansoni, Sonja Barkhofen, Christine Silberhorn, Igor Jex, [Gaussian Boson Sampling](https://arxiv.org/abs/1612.01199): squeezed inputs and hafnian probabilities.
