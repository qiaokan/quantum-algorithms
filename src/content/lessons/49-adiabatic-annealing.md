## Problem and models

An adiabatic algorithm starts in an easy ground state and changes the Hamiltonian slowly toward one whose ground state encodes the answer. The ideal model is closed-system coherent evolution. Quantum annealing hardware additionally has finite temperature, coupling to its environment, restricted controls, and implementation errors. Neither label alone establishes an algorithmic speedup. [Farhi and collaborators](https://arxiv.org/abs/quant-ph/0001106) explicitly identify the minimum spectral gap as a central runtime obstacle; [Albash and Lidar](https://arxiv.org/abs/1611.04471) review the ideal framework and its variants.

## A one-bit optimization problem

Minimize the classical cost $c(z)=z$ for $z=0,1$. Obviously the answer is 0. Choose a path

$$H(s)=-(1-s)X-sZ=\begin{pmatrix}-s&-(1-s)\\-(1-s)&s\end{pmatrix},\qquad 0\le s\le1.$$

The parameter $s$ controls progress along the path; physical time $t$ determines $s(t)$. At $s=0$, the ground state is $|+\rangle$ with energy −1; prepare it by H|0〉. At $s=1$, the ground state is |0〉 with energy −1, encoding the cost minimum. A constant energy shift and positive rescaling convert −Z to the cost matrix diag(0,1); neither changes which state minimizes energy.

## Calculate the spectrum and intermediate state

Squaring the matrix cancels its off-diagonal terms:

$$H(s)^2=[s^2+(1-s)^2]I.$$

Hence eigenvalues are $\pm r(s)$, with $r(s)=\sqrt{s^2+(1-s)^2}$. The gap, excited energy minus ground energy, is $2r(s)$. Since $s^2+(1-s)^2=2(s-1/2)^2+1/2$, its minimum is at $s=1/2$ and the minimum gap is $\sqrt2$.

At halfway, $H=-(X+Z)/2$. A normalized ground vector is $(c,d)^T$ with $c=\sqrt{2+\sqrt2}/2$ and $d=\sqrt{2-\sqrt2}/2$. Its coordinate ratio is $d/c=\sqrt2-1$. Multiplying the first row gives $-(c+d)/2=-c/\sqrt2$; the second gives $(-c+d)/2=-d/\sqrt2$. Thus the energy is −1/√2. A measurement now gives 0 with probability $(2+\sqrt2)/4\approx0.853553$, before the path even reaches its endpoint.

## Slow evolution versus a sudden switch

In the ideal slow limit, the state follows the ground direction from |+〉 to |0〉, so the final answer is 0 with probability tending to one. The gap remains nonzero here, making this uncomplicated example well behaved. A finite-time guarantee needs a specific schedule and an adiabatic error theorem; “the gap is nonzero” does not itself assign a sufficient runtime.

For a fully calculable failure case, switch instantly from −X to −Z. The state cannot change instantaneously, so it remains |+〉. Holding the final Hamiltonian for time $t$ gives

$$e^{itZ}|+\rangle=(e^{it}|0\rangle+e^{-it}|1\rangle)/\sqrt2.$$

Measurement probabilities remain 1/2,1/2. Waiting under the final Hamiltonian alone does not relax a closed system into its ground state. This distinguishes coherent adiabatic following from thermal cooling.

## A finite-time run with an explicit success bound

To avoid leaving the example at an infinitely slow limit, use the same endpoints with a constant-gap path $\widetilde H(t)=-\cos(\omega t)X-\sin(\omega t)Z$, for $0\le t\le T$ and $\omega=\pi/(2T)$. Its eigenvalues remain ±1. This changes the path from the linear interpolation above; it is a valid alternative schedule, not an algebraic rewrite of that path.

Write the evolving state as $|\psi(t)\rangle=R_y(-\omega t)|\phi(t)\rangle$. In this rotating coordinate system, the effective Hamiltonian is constant: $H_{\mathrm{rot}}=-X+(\omega/2)Y$. Squaring it gives $H_{\mathrm{rot}}^2=r^2 I$, with $r=\sqrt{1+\omega^2/4}$. The exponential calculation from continuous walks therefore applies. Starting from |+〉, and using $Y|+\rangle=-i|-\rangle$, it gives

$$|\phi(T)\rangle=\left(\cos(rT)+\frac{i\sin(rT)}r\right)|+\rangle-\frac{\omega\sin(rT)}{2r}|-\rangle.$$

At the endpoint, $R_y(-\pi/2)$ maps the ground direction |+〉 to |0〉 and the orthogonal direction |−〉 to a phase times |1〉. Thus the probability of the wrong answer is

$$p_{\mathrm{fail}}=\frac{\omega^2}{4r^2}\sin^2(rT)\le\frac{\pi^2}{16T^2+\pi^2}.$$

For T=10 in units where the Hamiltonian coefficients above have unit frequency, failure is at most 0.006131, so the final measurement returns 0 with probability at least 0.993869. This is a finite ideal-evolution guarantee. A gate implementation must additionally budget simulation error; the bound does not incorporate physical noise.

## Implementation and resource accounting

A digital implementation approximates the time-dependent evolution by short segments and simulates each segment, for example using product formulas. Its cost includes total physical evolution time, discretization accuracy, Hamiltonian simulation, and preparation/readout. An analog implementation realizes couplings directly, but control calibration, embedding a logical graph into hardware connectivity, and noise still enter the comparison.

A common heuristic estimate involves the rate of change divided by a power of the gap. Rigorous adiabatic theorems specify smoothness, endpoint conditions, matrix norms, and tolerated error; there is no universal single “runtime = inverse gap squared” identity. Optimization paths can have exponentially small gaps. Finite-temperature hardware may also populate excited states or use environment-assisted transitions; this is not the same guarantee as the ideal theorem.

## Prediction and module connection

**Predict:** If a two-level system has energies −1 and +1 and exactly equilibrates at inverse temperature β, what is the ground probability?

<details><summary>Show the answer</summary>

Gibbs weights are e^β and e^(−β), so the ground probability is 1/(1+e^(−2β)). It is 1/2 at β=0 and approaches one as β grows. This equilibrium calculation assumes equilibration; it does not say an annealer reaches equilibrium during its schedule.

</details>

VQE directly chooses a state family and optimizes measured energies. QAOA alternates cost and mixer pulses and optimizes their angles. Adiabatic computation specifies a continuously changing Hamiltonian and must control transition error. Imaginary-time methods suppress energy components through filtering or state-dependent approximation. For our one-qubit examples all four can target the same low-energy direction, but their actual operations and resource bottlenecks differ.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Edward Farhi, Jeffrey Goldstone, Sam Gutmann, Michael Sipser, [Quantum Computation by Adiabatic Evolution](https://arxiv.org/abs/quant-ph/0001106): optimization interpolation and gap dependence.
- Tameem Albash and Daniel A. Lidar, [Adiabatic Quantum Computing](https://arxiv.org/abs/1611.04471): theorem variants, universal model, and limitations. The two-level path and sudden-switch comparison are locally derived.
