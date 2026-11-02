## Problem and three distinct methods

Imaginary-time evolution suppresses high-energy components: $|\psi(\tau)\rangle=e^{-\tau H}|\psi(0)\rangle/\|e^{-\tau H}|\psi(0)\rangle\|$, for real nonnegative time $\tau$. Unlike real-time $e^{-itH}$, this generally changes the norm before division and is not a unitary gate. We want a circuit producing a low-energy state or estimating its properties. [Motta and collaborators' QITE](https://arxiv.org/abs/1901.07653) approximates local imaginary-time steps by state-dependent local unitaries inferred from measurements. [McArdle and collaborators' variational method](https://arxiv.org/abs/1804.03023) evolves parameters in a chosen ansatz. Ancilla-based probabilistic filtering is a third route. These must not be treated as identical algorithms.

## Classical baseline and the target transformation

Take $H=\operatorname{diag}(0,1)$ and $|\psi(0)\rangle=|+\rangle=(1,1)^T/\sqrt2$. Classically exponentiating this diagonal matrix is immediate:

$$e^{-\tau H}|+\rangle=\frac1{\sqrt2}\binom1{e^{-\tau}},\qquad
\|e^{-\tau H}|+\rangle\|^2=\frac{1+e^{-2\tau}}2.$$

At $\tau=\ln2$, meaning the number whose exponential is 2, $e^{-\tau}=1/2$. The unnormalized vector is $(1,1/2)^T/\sqrt2$, squared norm $5/8$. Divide by $\sqrt{5/8}$ to get $(2,1)^T/\sqrt5$. Measuring energy gives zero with probability $4/5$ and one with probability $1/5$; the expected energy is $1/5$, below its initial value $1/2$.

The relative magnitude changed; normalization restored total probability one. Applying this operation blindly to arbitrary inputs as a deterministic linear gate is impossible: normalization depends on the input state.

## An exact one-qubit unitary realization for this known state

Represent the state with $R_y(\theta)|0\rangle$, where amplitudes are $\cos(\theta/2),\sin(\theta/2)$. Initially $\theta_0=\pi/2$. The target satisfies $\tan(\theta_1/2)=1/2$, so $\theta_1=2\arctan(1/2)\approx0.927295$. Apply $R_y(\theta_1-\theta_0)$ to the initial state. Multiplying rotations adds their angles, leaving $R_y(\theta_1)|0\rangle=(2,1)^T/\sqrt5$. Here $\arctan(1/2)$ is the angle of a right triangle with vertical/horizontal ratio 1/2.

This unitary exactly matches the desired transformation **on the selected initial state**. It does not equal $e^{-\tau H}$ as a matrix. Applied to another input, it need not perform normalized imaginary-time evolution. That state dependence is central to local QITE, which estimates the needed generator rather than assuming its coefficients are known.

## Variational evolution, derived in this ansatz

The exact normalized trajectory obeys $\tan(\theta(\tau)/2)=e^{-\tau}$. Differentiating gives $d\theta/d\tau=-\sin\theta$. For readers avoiding calculus initially: a small step $\Delta\tau$ updates $\theta$ by approximately $-\Delta\tau\sin\theta$; repeatedly shrinking the step approaches the exact curve. At the start, $\sin\theta=1$, so angle decreases. As it approaches zero, progress slows.

The variational linear-system form is $A\dot\theta=-C$, where $A=\operatorname{Re}\langle\partial_\theta\psi|\partial_\theta\psi\rangle=1/4$ and $C=\operatorname{Re}\langle\partial_\theta\psi|H|\psi\rangle=\sin\theta/4$ for this real normalized ansatz. Indeed, $\partial_\theta\psi=(-\sin(\theta/2),\cos(\theta/2))^T/2$; its squared length is $1/4$, and multiplying by $H\psi=(0,\sin(\theta/2))^T$ gives $\sin\theta/4$. Thus $\dot\theta=-\sin\theta$. These are measurements and classical parameter updates, not a nonlinear quantum gate.

## A short bridge for the parameter derivative

A [derivative](/definitions/derivatives/) records the limiting change in one quantity per small change in another. In $\dot\theta=-\sin\theta$, the dot means change per unit imaginary time, not a new quantum observable. At θ=π/2, the right side is −1. An Euler update with step 0.1 therefore proposes θ≈π/2−0.1≈1.470796. The exact update is $2\arctan(e^{-0.1})\approx1.470963$, close but not identical. Repeating finite steps accumulates approximation error, so the step size is part of the algorithm.

The metric A above is not the Hamiltonian: it measures how rapidly the chosen state changes when its parameter changes. If an ansatz parameter only changes a global phase, or two parameters describe the same physical direction, the corresponding metric can be singular or redundant. Regularizing a noisy linear solve then changes the proposed evolution. This is an extra classical numerical task, with its own error budget, rather than a consequence of merely naming the variational principle.

## Probabilistic filtering and its success cost

A filter with successful block $\operatorname{diag}(1,1/2)$ can be embedded in a larger unitary using an ancilla. On basis 0 keep the success ancilla unchanged; on basis 1 rotate it so the successful amplitude is 1/2 and failure amplitude $\sqrt3/2$. From |+〉, the successful branch has norm squared $5/8$, exactly the number computed above. Conditioning on success yields the target. Failure must be counted and the input prepared again. This connects directly to [block encoding](/lessons/block-encoding/) and [polynomial filtering](/lessons/polynomial-filtering/).

## Limits and predictions

**Predict:** Start in the excited state |1〉 alone. Does longer imaginary time create ground-state overlap?

<details><summary>Show the answer</summary>

No. The unnormalized vector becomes e^(−τ)|1〉, which normalizes back to |1〉. Suppression cannot create a component that was absent. Initial overlap remains a necessary resource.

</details>

Local QITE assumes manageable correlation structure so that a reasonably small domain approximates a step; domain growth and measured Pauli terms may be expensive. Variational evolution can fail through ansatz restriction, ill-conditioned metric matrices, or measurement error. Small steps cause discretization overhead; low temperatures and tiny energy gaps can make convergence slow. General many-body ground-state preparation is not rendered easy by replacing real time with imaginary time.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Mario Motta et al., [Determining eigenstates and thermal states on a quantum computer using quantum imaginary time evolution](https://arxiv.org/abs/1901.07653): local state-dependent QITE framework.
- Sam McArdle, Tyson Jones, Suguru Endo, Ying Li, Simon Benjamin, Xiao Yuan, [Variational ansatz-based quantum simulation of imaginary time evolution](https://arxiv.org/abs/1804.03023): parameter-space approach. The one-qubit trajectory, metric, and postselection example are independently derived.
