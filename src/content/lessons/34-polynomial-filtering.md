## The transformation and the missing-state problem

A spectral filter keeps some eigencomponents and suppresses others. If $H|E_j\rangle=E_j|E_j\rangle$, applying a function $f(H)$ changes coefficient $c_j$ to $f(E_j)c_j$. The function is not generally unitary, so a quantum circuit embeds it in a block and conditions on success. Polynomial approximation plus QSP/QSVT makes many such filters implementable under suitable matrix access. [Lin and Tong](https://arxiv.org/abs/1910.14596) analyze eigenstate filtering with explicit overlap and gap assumptions.

Inputs include the matrix access, an initial preparation, a spectral interval or threshold, and an accuracy. Outputs may be a ground-state approximation, a selected spectral subspace, or a thermal state. Those outputs are different. In particular, filtering one pure superposition does not usually produce a mixed thermal state.

## Classical baseline and the smallest ground-state filter

Classical eigensolvers, inverse iteration, polynomial filtering, and thermal Monte Carlo also exploit spectral structure. A fair quantum advantage depends on matrix access, dimension, overlap, the spectral gap, and requested output. Generic hard ground-state problems are not made easy by naming a filter.

Let $H=\operatorname{diag}(0,1)$ and input

$$|\psi\rangle=\frac1{\sqrt5}|0\rangle+\frac2{\sqrt5}|1\rangle.$$

The zero-energy component has probability $1/5$. Choose $f(E)=1-E$, so $f(H)=\operatorname{diag}(1,0)=(I+Z)/2$. It is an exact projector for this two-point spectrum. A projector keeps one subspace and removes its orthogonal complement; applying it twice has the same effect as once.

## A gate-by-gate filter and its output

Implement $(I+Z)/2$ using one selector ancilla: prepare $|+\rangle$, apply controlled $Z$ with the ancilla as control, then apply a Hadamard to the ancilla. For the system-zero branch, controlled $Z$ does nothing and $H|+\rangle=|0\rangle$. For the system-one branch it changes $|+\rangle$ to $|-\rangle$, and $H|-\rangle=|1\rangle$. Therefore the full state becomes

$$\frac1{\sqrt5}|0\rangle_{\rm anc}|0\rangle_{\rm sys}
+\frac2{\sqrt5}|1\rangle_{\rm anc}|1\rangle_{\rm sys}.$$

Accept ancilla zero. Success is $1/5$, and the conditional system state is the ground state $|0\rangle$. Failure is $4/5$ and leaves $|1\rangle$. Repeating after fresh preparation gives average trial count five. No operation created ground overlap from nothing.

**Predict:** if the input were exactly $|1\rangle$, could an arbitrarily accurate version of this filter produce the ground state?

<details><summary>Show the answer</summary>

No. The ground coefficient starts at zero and remains zero under any function of $H$. The success probability of the ideal ground projector is zero. A preparation strategy that introduces useful overlap is an independent part of the algorithm.

</details>

## An approximate filter and a quantitative error tradeoff

Suppose the desired ground value is exactly $f(E_0)=1$, while all unwanted values have magnitude at most $\eta$. Let $p$ be the initial ground probability. The accepted state's ground probability is at least

$$\frac{p}{p+(1-p)\eta^2}.$$

To derive it, the good component has squared norm $p$; the total unwanted squared norm is at most $(1-p)\eta^2$. Conditional probability divides good weight by total accepted weight. For $p=1/5$ and $\eta=1/10$, the bound is $0.2/(0.2+0.008)=25/26\approx0.961538$.

A polynomial must transition from near one to near zero between the desired and unwanted spectral intervals. The **gap** is the known separation that leaves room for this transition. Small gaps require greater degree. Unknown ground energy additionally requires a search or estimation procedure to position the filter; it cannot be treated as a pre-known input when that was the original problem.

## Thermal preparation is a different target

At inverse temperature $\beta$, a Gibbs state is

$$\rho_\beta=\frac{e^{-\beta H}}{Z_\beta},\qquad Z_\beta=\operatorname{Tr}(e^{-\beta H}).$$

The [trace](/definitions/trace/) adds diagonal entries; $Z_\beta$ normalizes the probabilities and is called the partition function. For $H=\operatorname{diag}(0,1)$ and $\beta=\log4$, $e^{-\beta H}=\operatorname{diag}(1,1/4)$, so the Gibbs state is $\operatorname{diag}(4/5,1/5)$.

Begin instead with two registers in the maximally entangled state $(|00\rangle+|11\rangle)/\sqrt2$. The first is the system and the second is a reference. Apply the successful block $G=e^{-\beta H/2}=\operatorname{diag}(1,1/2)$ on the system. This can be implemented in the toy by a flag that accepts system zero with amplitude one and system one with amplitude $1/2$, exactly the reciprocal-rotation pattern from HHL. The accepted joint vector before normalization is

$$\frac1{\sqrt2}|00\rangle+\frac1{2\sqrt2}|11\rangle.$$

Success is $5/8$; the normalized joint state is $(2|00\rangle+|11\rangle)/\sqrt5$. Ignore the reference register. Its orthogonal labels remove cross terms, leaving $\rho_\beta=\operatorname{diag}(4/5,1/5)$ on the system. This is a **purification** of the thermal state: a pure state on a larger space whose subsystem is mixed.

Applying $G$ only to $|+\rangle$ would yield $(2|0\rangle+|1\rangle)/\sqrt5$, a pure coherent state. It has the same computational-basis probabilities but different off-diagonal entries and different outcomes in other bases. Calling that pure state a Gibbs state would be wrong.

## Implementation choices and an important extension

A general construction approximates $e^{-\beta E/2}$ or a threshold filter with a bounded polynomial and implements it using matrix access. Thermal success can depend on the partition function and normalization; low temperatures may sharply increase cost. Amplitude amplification can help only when the required coherent preparation and reflections are available. Preparing arbitrary Gibbs states efficiently is not guaranteed.

[Dong, Lin and Tong's QET-U](https://arxiv.org/abs/2204.05955) uses controlled time evolution as its input model, instead of assuming an inexpensive Hamiltonian block encoding. This is a significant practical design distinction. On our diagonal Hamiltonian, controlled $e^{-itH}$ provides phases one and $e^{-it}$; a signal-processing sequence filters those phases into energy-dependent amplitudes. The relevant polynomial variable and spectral interval change, so a block-encoding phase list cannot be copied blindly. This chapter includes the access-model distinction; it does not claim an executed hardware demonstration of QET-U.

## Practice and connections

At $\beta=0$, $G=I$ and thermal preparation from the entangled pair succeeds certainly, leaving the maximally mixed state $I/2$. As $\beta$ becomes large, the excited weight tends to zero and success tends to $1/2$ for this example. In a large space with a tiny ground sector, the corresponding success can instead be extremely small.

[Energy estimation](/lessons/energy-estimation/) selected an energy by measuring a phase register. This lesson selected it through a designed filter. [Modern linear solvers](/lessons/modern-linear-solvers/) use a reciprocal rather than a threshold. The common operation is explicit: rescale known spectral components, then account for the success norm. [Quantum Metropolis](/lessons/quantum-metropolis/) approaches thermal preparation from a sampling perspective.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Lin Lin, Yu Tong, [Optimal polynomial based quantum eigenstate filtering with application to solving quantum linear systems](https://arxiv.org/abs/1910.14596): overlap/gap promises and polynomial filters.
- John M. Martyn et al., [A Grand Unification of Quantum Algorithms](https://arxiv.org/abs/2105.02859), eigenvalue-threshold discussion and filtering/Gibbs polynomial examples.
- Yulong Dong, Lin Lin, Yu Tong, [Ground state preparation and energy estimation on early fault-tolerant quantum computers via quantum eigenvalue transformation of unitary matrices](https://arxiv.org/abs/2204.05955): QET-U input-model extension; abstract verified.
