## Problem and access model

ADAPT-VQE grows a variational circuit using measured information about the current state. Given a Hamiltonian, an initial state, and a pool of candidate generators, repeatedly select an operator, append its parameterized gate, and re-optimize all parameters. The output is a constructed ansatz and its energy estimate. [Grimsley and collaborators](https://arxiv.org/html/1812.11173) describe the gradient-based selection and the tradeoff between circuit depth and measurement effort. The original chemistry pool uses fermionic operators; our one-qubit Pauli pool demonstrates the same selection principle without claiming to be a molecular simulation.

## Classical baseline and the pool

Reuse $H=Z+X$ from [VQE](/lessons/vqe/) and start in $|0\rangle$. The exact classical ground energy is $-\sqrt2$. Let the available gates be $e^{-i\theta X/2}$ and $e^{-i\theta Y/2}$, with

$$Y=\begin{pmatrix}0&-i\\i&0\end{pmatrix}.$$

A *gradient* here means the derivative of energy with respect to a new gate angle at angle zero: how energy changes for a tiny positive angle. The derivative does not directly give the best finite rotation; it selects a useful direction for the subsequent optimization.

## Derive the operator-selection rule

For candidate generator $P$, append $U(\theta)=e^{-i\theta P/2}$ to the current state. For small $\theta$, $U\approx I-i\theta P/2$ and $U^\dagger\approx I+i\theta P/2$. Therefore

$$U^\dagger HU\approx H+\tfrac{i\theta}{2}(PH-HP).$$

The bracket $[P,H]=PH-HP$ is a *commutator*: it measures how exchanging the multiplication order changes the result. Consequently the energy derivative is $(i/2)\langle[P,H]\rangle$. This is a measurable Hermitian observable even though the commutator alone is anti-Hermitian.

For $P=Y$, direct Pauli multiplication gives $YZ=iX$, $ZY=-iX$, $YX=-iZ$, $XY=iZ$. Thus

$$\frac i2[Y,Z+X]=\frac i2(2iX-2iZ)=Z-X.$$

At $|0\rangle$, $\langle Z\rangle=1$ and $\langle X\rangle=0$, so the derivative is +1. For $P=X$, $(i/2)[X,Z+X]=Y$ and $\langle0|Y|0\rangle=0$. The gradient vector is therefore $(0,1)$ for pool order $(X,Y)$. ADAPT selects Y because its derivative has the larger magnitude. A negative small Y angle lowers the energy.

## Re-optimize and reach the output

The selected ansatz is $R_y(\theta)|0\rangle=(\cos(\theta/2),\sin(\theta/2))^T$. As derived in the preceding lesson, its energy is $\cos\theta+\sin\theta$. An optimum is $\theta=-3\pi/4$, giving the state

$$|\psi_*\rangle=\binom{\sqrt{2-\sqrt2}/2}{-\sqrt{2+\sqrt2}/2}.$$

Its probabilities are approximately $(0.146447,0.853553)$; $\langle X\rangle=2cs=-1/\sqrt2$, $\langle Z\rangle=c^2-s^2=-1/\sqrt2$. Hence $E=-\sqrt2$. The new Y derivative is $\langle Z-X\rangle=0$, and the X derivative is $\langle Y\rangle=0$, so the pool-gradient norm is zero. In this instance, comparison with the exact eigenvalue verifies success.

## Why a zero gradient is not a universal certificate

**Predict:** Start instead from $|0\rangle$ with Hamiltonian $-Z$ and pool containing only Z. Can the rule distinguish an inadequate pool from success?

<details><summary>Show the answer</summary>

Here |0〉 happens to be the ground state, so stopping is fine. But for Hamiltonian +Z with the same state and pool, the commutator is still zero even though |0〉 has maximum energy +1 and the ground energy is −1. No Z rotation changes its populations. A zero pool gradient alone certifies neither ground-state energy nor completeness of the pool.

</details>

Noise can also make a nonzero gradient appear zero, or reverse which operator has largest magnitude. A stopping threshold must be compared with gradient-estimation uncertainty. Repeated selection can reuse an operator; selecting it does not remove it from the pool.

## Costs, implementation, and limitations

If the pool has $K$ operators, each growth step needs enough measurements to estimate $K$ gradient quantities, often sums of many Pauli terms, plus a full VQE re-optimization. Commuting measurement grouping and shared data can reduce costs, but measuring the entire pool is not a single circuit call. Each appended gate must be compiled into available operations. In molecular problems, fermion-to-qubit encoding and symmetry preservation also matter.

Adaptivity can produce a more economical ansatz for a particular system. It is not a proof of polynomial-time ground-state preparation or general advantage over classical chemistry. Our one-operator optimum is special because a real one-qubit rotation spans the exact ground state. A larger pool can improve expressivity while increasing shot and optimization costs.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Harper R. Grimsley, Sophia E. Economou, Edwin Barnes, Nicholas J. Mayhall, [An adaptive variational algorithm for exact molecular simulations on a quantum computer](https://arxiv.org/html/1812.11173), algorithm steps 5–8: commutator gradients, pool selection, re-optimization, and measurement tradeoff. The Pauli-pool example and its failure case are original calculations.
