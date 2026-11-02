## Problem and access model

IQP means *instantaneous quantum polynomial-time*, a circuit-family name rather than a claim of zero elapsed time. In a common convention, prepare |0…0〉, apply Hadamards, apply commuting gates diagonal in the computational basis, apply Hadamards again, and sample. Equivalently the central operations commute in an X-based presentation. The input is a classical description of the gates; the output is a random bit string from their distribution. [Bremner, Jozsa, and Shepherd](https://arxiv.org/abs/1005.1407) give conditional complexity evidence against efficient classical simulation for their specified approximation model.

## A two-qubit circuit

Use $U=H^{\otimes2}e^{i\theta Z\otimes Z}H^{\otimes2}$ and start at |00〉. The first Hadamards give $(1,1,1,1)^T/2$. Since $Z\otimes Z=\operatorname{diag}(1,-1,-1,1)$, the central gate gives

$$|\psi\rangle=\tfrac12(e^{i\theta},e^{-i\theta},e^{-i\theta},e^{i\theta})^T.$$

A Hadamard row has ±1/2 entries. The amplitude at 00 after the final Hadamards is

$$a_{00}=\tfrac14(e^{i\theta}+e^{-i\theta}+e^{-i\theta}+e^{i\theta})=\cos\theta.$$

At 01 it is $(e^{i\theta}-e^{-i\theta}+e^{-i\theta}-e^{i\theta})/4=0$; at 10 the same cancellation gives zero. At 11 it is $(e^{i\theta}-e^{-i\theta}-e^{-i\theta}+e^{i\theta})/4=i\sin\theta$. Thus the full vector is $(\cos\theta,0,0,i\sin\theta)^T$.

At θ=π/6 the probabilities are $3/4,0,0,1/4$. At θ=π/4 they are $1/2,0,0,1/2$. Sampling 00 or 11 is the completed computational task. The simulator can list these exact probabilities, but hardware supplies samples and not the whole probability table.

## Implement the central two-qubit phase

The gate $e^{i\theta Z\otimes Z}$ can be built from CNOT, a one-qubit Z rotation, and CNOT again. Use first qubit as control and second as target. The first CNOT replaces the target bit b by the parity $a\oplus b$. Apply $R_z(-2\theta)=\operatorname{diag}(e^{i\theta},e^{-i\theta})$ to that target. Equal original bits have parity 0 and receive phase $e^{i\theta}$; unequal bits have parity 1 and receive $e^{-i\theta}$. The second CNOT restores b. Thus the basis labels return to their original values while retaining the desired phase.

For input 01, the parity is 1, so the intermediate and final phase is $e^{-i\theta}$. For input 11, the first CNOT produces 10, the target parity is 0, and after the second CNOT the state is $e^{i\theta}|11\rangle$. These checks rule out mistaking the central operation for a bit flip. It requires two entangling gates plus a parameterized rotation in this decomposition. A hardware gate set may synthesize or route those operations differently; their physical duration is not zero merely because all logical phase terms commute.

## Why commuting is not the same as classical

The diagonal gates only change phases, and their order does not matter. But the final basis change makes contributions from many basis states reach the same output and interfere. Commutativity alone therefore does not imply the measured distribution is easy to sample. Conversely, this particular two-qubit circuit is plainly easy classically, and many larger special cases are also easy. Hardness claims concern circuit families under precise assumptions, not every member.

## Baseline, costs, and approximation models

A direct classical state-vector algorithm computes all amplitudes using exponential space in qubit count; structured tensor-network or specialized samplers can do much better for particular circuits. Building the central phase gates costs one circuit operation per specified interaction, plus routing and synthesis; “instantaneous” does not mean all overlapping physical gates execute in one time unit.

The original paper's conditional obstruction concerns multiplicative-error simulation of output probabilities and a consequence for the polynomial hierarchy, a hierarchy of classical complexity classes. Additive total-variation approximation is a different requirement and needs further assumptions/results. A highly noisy distribution may become easy to approximate. Neither theorem establishes a commercially useful application or validates an experimental sample set automatically.

## Prediction and module connection

**Predict:** Omit the final Hadamards. What is the Z-basis distribution?

<details><summary>Show the answer</summary>

Uniform over all four strings, for every θ. Each phased amplitude still has magnitude 1/2. The correlated distribution is created only when the final mixing combines the phase contributions.

</details>

This is structurally the same calculation as Deutsch–Jozsa, but the task is now sampling an entire distribution rather than deciding a promised Boolean property. [Boson sampling](/lessons/boson-sampling/) changes the physical computational model, while [random-circuit sampling](/lessons/random-circuit-sampling/) changes the circuit ensemble. Keep their hardness assumptions separate.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Michael J. Bremner, Richard Jozsa, Dan J. Shepherd, [Classical simulation of commuting quantum computations implies collapse of the polynomial hierarchy](https://arxiv.org/abs/1005.1407): IQP model and multiplicative-error conditional simulation result. The two-qubit calculation is original and is not a hardness witness.
