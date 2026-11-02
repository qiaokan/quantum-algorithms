## The problem this chapter solves

You now have many named algorithms. The useful result is not a list of names; it is the ability to identify what an algorithm encodes, what transformation exposes that information, what measurement returns, and what resources the full process consumes. This synthesis connects calculations already made in the book. It is a **synthesis chapter**, not a new algorithm or an independent speedup theorem.

Our fixed comparison set uses four tiny objects: a two-entry sign pattern, a four-entry search vector, a one-qubit phase, and a two-by-two linear system. They are small enough to recalculate. Their common mathematics does not make their input or output models interchangeable.

## Signs become readable through a chosen operation

Deutsch's balanced instance produced input amplitudes $(1,-1)^T/\sqrt2$. Applying $H=(1/\sqrt2)\left(\begin{smallmatrix}1&1\\1&-1\end{smallmatrix}\right)$ gave

$$\frac12(1-1,1+1)^T=(0,1)^T.$$

The observation was a single parity bit. Grover's four-item instance produced $(1,1,-1,1)^T/2$. Its diffusion matrix gave $(0,0,1,0)^T$, identifying a label. In both cases an oracle changed signs while leaving immediate probabilities unchanged, and a fixed operation then mixed amplitudes. But the fixed operations answered different questions. A final Hadamard is not a generic substitute for Grover's diffusion.

The reversible oracle input model matters in both. If preparing the sign pattern requires reading an entire classical truth table first, that work belongs in the end-to-end cost. The [query lessons](/lessons/deutsch/) and [search lessons](/lessons/grover/) made this distinction concrete.

## A reflection can be studied as a phase problem

Grover over four labels with one mark has initial marked probability $a=1/4$. Write $a=\sin^2\theta$, so $\theta=\pi/6$. One Grover iterate rotates the good/bad two-dimensional state by $2\theta=\pi/3$. Its complex eigenvalues are $e^{\pm i\pi/3}=e^{2\pi i(\pm1/6)}$.

This turns a search operation into something [phase estimation](/lessons/phase-estimation/) can measure. A measured eigenphase near $1/6$ or $5/6$ lets us reconstruct $\sin^2(\pi/6)=1/4$, and [quantum counting](/lessons/quantum-counting/) multiplies it by four to infer one marked label. Ordinary search chooses an iteration count then measures a candidate. Counting estimates the rotation's angle. The underlying reflection product is the same, but the surrounding circuit and requested output differ.

A controlled power of that iterate is not free. If the counting circuit uses powers 1,2,4, its three blocks can require seven search iterates, each with its own oracle cost. The number of counting qubits is not the number of base-oracle calls.

## Fourier cancellation reads different kinds of structure

Simon's pair state $(|000\rangle+|011\rangle)/\sqrt2$ produced only labels satisfying $y_1\oplus y_2=0$. The equal-output pair creates two contributions to each Fourier outcome. When their signs disagree, they cancel. Each surviving sample is a classical equation; enough independent equations reveal a mask.

Period finding uses integer arithmetic instead of XOR. A length-eight periodic state $(|0\rangle+|2\rangle+|4\rangle+|6\rangle)/2$ has period 2. Its positive-exponent QFT amplitude at output $k$ is

$$\frac1{2\sqrt8}\left(1+e^{2\pi i(2k)/8}+e^{2\pi i(4k)/8}+e^{2\pi i(6k)/8}\right).$$

At $k=0$ all four terms are 1, giving $1/\sqrt2$. At $k=4$ they are also all 1. At other $k$, the four unit-circle contributions cancel. Measurements are therefore 0 or 4, equally likely. The nonzero sample gives $4/8=1/2$, revealing the period denominator 2 in this exact divisible example. Zero gives no period information.

The QFT did not print eight Fourier coefficients. It transformed amplitudes so a measured label carried useful structure. Shor combines this pattern with an efficiently implementable modular function and classical arithmetic, including rejection of unhelpful trials. That explicit arithmetic is why it is more than an abstract oracle puzzle. See [order finding](/lessons/order-finding/), [Shor](/lessons/shor/), and the [abelian framework](/lessons/abelian-hidden-subgroup/).

## Simulation creates the unitary that phase estimation needs

Take a Hamiltonian $H=\operatorname{diag}(0,2)$. Its eigenstates are $|0\rangle,|1\rangle$ with energies 0 and 2. Evolution for time $t$ is $U=e^{-iHt}=\operatorname{diag}(1,e^{-2it})$. At $t=\pi/4$, the excited eigenvalue is $-i=e^{2\pi i(3/4)}$.

Phase estimation can now distinguish energy eigencomponents by estimating phases 0 and $3/4$. Recovering energy from the phase requires remembering the minus sign, the chosen time, and the energy range to avoid modulo ambiguities. If the input is $(\sqrt3|0\rangle+|1\rangle)/2$, ground-energy outcome probability is $3/4$, excited-energy outcome probability $1/4$. Precise phase estimation cannot create missing ground-state overlap.

[Trotter formulas](/lessons/product-formulas/), [Taylor/LCU methods](/lessons/taylor-simulation/), and [qubitization](/lessons/qubitization/) are different ways to implement or use a Hamiltonian-derived transformation. They have different access assumptions and precision costs. Solving the simulation primitive does not automatically solve ground-state preparation or an industrial chemistry calculation.

## Matrix transformations expose the input and output bottlenecks

For $A=\operatorname{diag}(1,2)$ and $|b\rangle=(1,1)^T/\sqrt2$, the unnormalized classical solution is $A^{-1}b=(1,1/2)^T/\sqrt2$. Its squared length is $5/8$. Normalizing gives the solution state

$$|x\rangle=(2,1)^T/\sqrt5.$$

An HHL-style reciprocal rotation with scale 1 produces that state conditioned on a success flag, with probability $5/8$ in this tiny exact instance. It does not print both numerical solution coordinates. If the requested output is instead $\langle x|Z|x\rangle$, the value is $4/5-1/5=3/5$, estimable by repeated measurement. If the user needs every entry of a huge classical vector, readout can remove the hoped-for benefit.

QSVT replaces singular values with bounded polynomial approximations to functions such as an inverse. For this diagonal example, the difference between transforming the two singular values and transforming all four matrix entries happens to be easy to miss; on nondiagonal matrices they are different operations. The [block-encoding](/lessons/block-encoding/) and [QSVT](/lessons/singular-value-transformation/) chapters show the actual embedded matrices and successful branches. Their abstraction unifies implementations, not their preparation or readout costs.

## Walks, variational methods, and sampling are different contracts

A quantum walk preserves amplitudes, allowing paths through a graph to cancel or reinforce. A classical random walk propagates probabilities. The coined and continuous examples calculated those differences explicitly. Search via walks adds a marked-set condition and spectral assumptions; it is not just “walk randomly faster.”

VQE estimates an energy of a prepared trial state and delegates parameter selection to a classical optimizer. For $|\psi(\theta)\rangle=\cos(\theta/2)|0\rangle+\sin(\theta/2)|1\rangle$ and observable $Z$, energy is $\cos\theta$. Reaching its minimum in this one-dimensional example says nothing about training a large entangling ansatz. Measurement noise, expressive power, and optimization difficulty remain separate costs. QAOA's small Max-Cut circuit is a calculable heuristic instance, not a general theorem of practical superiority.

Sampling families ask for draws from distributions. Complexity evidence about reproducing those distributions does not prove usefulness for a downstream application. Tomography and classical shadows instead use measurements to learn specified properties; their sample complexity depends on which properties and error guarantees are requested. A state-vector simulator exposes much more than any one of those experimental access models.

## A reusable end-to-end audit

For any proposed quantum algorithm, write one concrete instance of each item:

1. **Input contract:** a formula, classical table, quantum state, sparse-access oracle, block encoding, or physical preparation?
2. **Useful transformation:** signs, Fourier structure, eigenphases, a walk, a polynomial, or a variational family?
3. **Output contract:** one label, many samples, a scalar expectation, a quantum state, or an explicit classical vector?
4. **Cost at target accuracy:** prepare, invoke or synthesize the expensive primitive, repeat, measure, verify, and process classically.
5. **Comparison:** best appropriate classical method, with the same promise, access, output, precision, and failure budget.

The [end-to-end survey](https://arxiv.org/abs/2310.03011) motivates this accounting approach. It does not certify a new application simply because one of its subroutines appears here. The calculations in this book let you inspect where a proposed advantage enters and where it can disappear.

## References

- John Watrous / IBM, [Fundamentals of Quantum Algorithms](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms): established query, search, and Fourier mechanisms connected here.
- Alexander M. Dalzell and coauthors, [Quantum algorithms: A survey of applications and end-to-end complexities](https://arxiv.org/abs/2310.03011): full input/output/cost accounting as an evaluation framework.
- John M. Martyn, Zane M. Rossi, Andrew K. Tan, Isaac L. Chuang, [A Grand Unification of Quantum Algorithms](https://arxiv.org/abs/2105.02859): connections through polynomial transformations; the book develops the actual small transformations before this synthesis.
