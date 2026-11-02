## Problem and access model

Given a circuit drawn from a specified random ensemble, sample bit strings from its output distribution when applied to |0…0〉. The random choice of **circuit** is separate from the random **measurement** outcomes for that fixed circuit. A valid benchmark states the gate ensemble, layout, depth, noise assumptions, sample count, and approximation criterion. [Bouland and collaborators](https://arxiv.org/abs/1803.04402) study the complexity evidence and verification problem. We derive a tiny circuit exactly; it is not a hard instance or a hardware benchmark.

## A fixed circuit from start to output

Use two qubits with basis order 00,01,10,11. Apply H to the first qubit, CNOT from first to second, $R_y(\pi/3)$ to the second, and H to the first. The first two gates create $(|00\rangle+|11\rangle)/\sqrt2$.

Set $c=\cos(\pi/6)=\sqrt3/2$ and $s=\sin(\pi/6)=1/2$. The rotation maps $|0\rangle\mapsto c|0\rangle+s|1\rangle$ and $|1\rangle\mapsto-s|0\rangle+c|1\rangle$. The state becomes

$$\tfrac1{\sqrt2}(c|00\rangle+s|01\rangle-s|10\rangle+c|11\rangle).$$

The final H on the first qubit combines amplitudes with the same second bit. Thus

$$a_{00}=(c-s)/2,\quad a_{01}=(s+c)/2,\quad a_{10}=(c+s)/2,\quad a_{11}=(s-c)/2.$$

Their squared magnitudes are

$$p=( (2-\sqrt3)/8,\ (2+\sqrt3)/8,\ (2+\sqrt3)/8,\ (2-\sqrt3)/8).$$

Numerically these are

$$(0.033494,0.466506,0.466506,0.033494),$$

which sum to one. A sampler draws an outcome using these probabilities; it does not necessarily return the most likely bit string.

## Classical baseline and verification

For this circuit, exact state-vector simulation is trivial. Large circuits must be compared with optimized state-vector, tensor-network, stabilizer-decomposition, or other applicable methods. Circuit width alone does not determine classical difficulty; depth, connectivity, gate set, and noise matter. For example Clifford-only circuits admit efficient classical stabilizer simulation despite entanglement.

A common diagnostic is linear cross-entropy benchmarking. For ideal probabilities p and measured samples $z_1,\ldots,z_m$ on n qubits, define

$$F_{\mathrm{XEB}}=\frac1m\sum_{j=1}^m2^n p(z_j)-1.$$

It requires evaluating ideal probabilities for the observed strings, which can itself be expensive. For uniform samples its expectation is zero. For ideal samples from our two-qubit circuit, $\mathbb E[F]=4\sum_zp(z)^2-1$. The squared-probability sum is

$$2[(2-\sqrt3)^2+(2+\sqrt3)^2]/64=7/16,$$

so the expectation is 3/4. It is not one: statements about an ideal score near one depend on an appropriate large random-circuit distribution, not every circuit.

## Measure distributional error directly in the tiny example

For two classical distributions p and q on the same outcomes, their total-variation distance is $\tfrac12\sum_z|p(z)-q(z)|$. It measures the largest difference they can assign to any event. This is a property of full distributions, not one scalar score based on selected samples.

Let q always output 01. The difference at 01 is $1-p(01)$ and the sum of differences elsewhere is also $1-p(01)$. Therefore the distance is

$$1-p(01)=(6-\sqrt3)/8\approx0.533494.$$

That is a large mismatch despite the favorable XEB value calculated below. If we can compute all four probabilities, we can inspect the mismatch directly. On large instances, estimating every probability is itself difficult, so benchmark diagnostics need a theorem or stated model linking them to the property being claimed.

To draw an ideal simulated sample here, form cumulative probabilities $p_{00}$, $p_{00}+p_{01}$, $p_{00}+p_{01}+p_{10}$,1 and locate an independent uniform random number in these intervals. This samples the authored distribution; it is not a quantum hardware observation or evidence that the distribution was hard to compute.

## What the score does not prove

**Predict:** A sampler always outputs 01, one of the most likely outcomes. Does it get a poor XEB score?

<details><summary>Show the answer</summary>

No. Its score is 4p(01)−1=√3/2≈0.866025, higher than the ideal expected 0.75 for this circuit. Yet it never returns 10 and is clearly the wrong distribution. A high diagnostic score alone is not a general certificate of closeness to the target distribution.

</details>

This is why certification, sampling hardness, and useful application value are separate claims. An exact-probability hardness result does not by itself settle noisy approximate sampling. Device results also require an explicit noise model and statistical validation; none are fabricated here.

## Costs and module synthesis

Each shot repeats preparation and the full circuit. More shots improve statistical estimation but do not correct systematic circuit bias. In ideal simulation the internal vector is visible; on hardware, estimating its entire probability table would generally require exponentially many outcomes. The task's output is deliberately only samples.

Tomography sought a complete classical state description. Shadows sought selected expectation values. Kernels and classifiers sought learning predictions. IQP, optical, and random-circuit sampling instead ask for draws from specified distributions. These output contracts explain why one cannot interchange their complexity claims. The same four probabilities above can support a demonstration, but they establish no large-scale speedup.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Adam Bouland, Bill Fefferman, Chinmay Nirkhe, Umesh Vazirani, [Quantum Supremacy and the Complexity of Random Circuit Sampling](https://arxiv.org/abs/1803.04402): average-case complexity evidence and verification challenges. The four-gate circuit and XEB counterexample are independently derived.
