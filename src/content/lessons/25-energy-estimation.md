## Problem and access model

Given a Hamiltonian $H$, estimate an energy associated with an input state. An **energy eigenstate** $|E_j\rangle$ satisfies $H|E_j\rangle=E_j|E_j\rangle$: applying the matrix changes only the scalar coefficient, not the direction of the vector. The real number $E_j$ is its energy. The smallest energy is the ground energy; a state attaining it is a ground state. The index $j$ labels eigenstates and does not necessarily label computational-basis bit strings.

We assume a circuit preparing $|\psi\rangle=\sum_jc_j|E_j\rangle$ and controlled Hamiltonian evolution. We do **not** assume the ground state is already available. [Phase estimation](/lessons/phase-estimation/) reads an eigenphase of a unitary; choosing a simulated time-evolution unitary converts that phase into an energy. The input's squared overlap $|c_j|^2$ controls which eigenvalue is sampled. The original [HHL paper](https://arxiv.org/html/0811.3171) uses this same coherent energy-labeling primitive, and [Lin and Tong](https://arxiv.org/abs/1910.14596) give more advanced filtering alternatives.

## Classical baseline and an honest promise

For a small explicitly stored matrix, diagonalize it classically. For large structured Hamiltonians, compare against classical chemistry, tensor-network, Monte Carlo, or other specialized methods with the same observable and accuracy. Finding arbitrary ground states efficiently is not promised by phase estimation. If preparing useful ground overlap is as hard as the original problem, adding a phase-estimation circuit does not solve that difficulty.

Our fixed example is

$$H=\begin{pmatrix}1&0\\0&3\end{pmatrix},\qquad
|\psi\rangle=\frac{\sqrt3}{2}|0\rangle+\frac12|1\rangle.$$

The ground state is $|0\rangle$ with energy one. Its probability weight is $3/4$; the excited state has energy three and weight $1/4$. This easy diagonal matrix is chosen so every intermediate operation is visible, not because it needs a quantum computer.

## Choosing a phase scale without aliasing

Use $U=e^{i\pi H/2}=\operatorname{diag}(i,-i)$. The **plus** sign is deliberate: ordinary physical time evolution has a minus sign; its inverse implements this convention. Since $i=e^{2\pi i(1/4)}$ and $-i=e^{2\pi i(3/4)}$, the phases are $1/4$ and $3/4$. Both fit exactly in two binary digits.

A phase is known modulo one: adding an integer gives the same complex exponential. Thus energy ranges and time scaling must be known so different candidate energies do not wrap onto the same phase. In a general bounded interval, first shift and scale $H$ so energies map into a known phase interval. The shift is classically tracked when translating the answer back.

## Preparing and labeling the two branches

Take a two-qubit phase register, leftmost bit most significant, and one system qubit. Apply a Hadamard to each phase qubit. The phase register is $(|00\rangle+|01\rangle+|10\rangle+|11\rangle)/2$. If its value is $k$, apply $U^k$ to the system, using controlled $U^2$ for its left bit and controlled $U$ for its right bit.

On system state $|0\rangle$, the phase-register amplitudes become $(1,i,-1,-i)/2$. On system state $|1\rangle$, they become $(1,-i,-1,i)/2$. The combined state is

$$\frac{\sqrt3}{2}\left(\frac{|00\rangle+i|01\rangle-|10\rangle-i|11\rangle}{2}\right)|0\rangle
+\frac12\left(\frac{|00\rangle-i|01\rangle-|10\rangle+i|11\rangle}{2}\right)|1\rangle.$$

Each bracket is normalized. This is an algebraic grouping of one state, not a measurement or a physical transfer of a scalar between registers.

## Fourier cancellation and the measured result

The inverse QFT maps a phase vector into its frequency label. Its output amplitude at integer $y$ on an eigenphase $\phi$ is

$$\frac14\sum_{k=0}^{3}e^{2\pi i k(\phi-y/4)}.$$

For $\phi=1/4,y=1$, all four terms are one, giving amplitude one. For $y=0$, the sum is $1+i-1-i=0$. For $y=2$, it is $1-i-1+i=0$; for $y=3$, $1-1+1-1=0$. Thus the first bracket becomes $|01\rangle$. The same calculation at $\phi=3/4$ yields $|11\rangle$.

The final state is

$$\frac{\sqrt3}{2}|01\rangle|0\rangle+\frac12|11\rangle|1\rangle.$$

Measuring the phase register yields one, translated to energy one, with probability $3/4$; it yields three, translated to energy three, with probability $1/4$. Conditional on outcome one, the system is the ground state $|0\rangle$. The **conditional** normalization divides its surviving amplitude $\sqrt3/2$ by the square root of the event probability $3/4$; the result is one. See [conditional probability](/definitions/conditional-probability/).

## Ground-state preparation is a success-probability problem

If trials are independent, the chance of failing to see the ground state in $r$ preparations is $(1-3/4)^r=4^{-r}$. Four trials reduce this to $1/256$. With unknown general overlap $p_0$, the analogous failure probability is $(1-p_0)^r$. If $p_0=0$, every trial fails forever.

**Predict:** does increasing the phase-register size improve the ground-state overlap?

<details><summary>Show the answer</summary>

No. It can improve energy resolution, but the ideal sampling weights remain the input weights $|c_j|^2$. Resolving an energy more sharply is different from preparing a state with greater ground overlap. Filtering and amplitude amplification can alter those weights, but add access requirements and cost.

</details>

## Implementation, precision, and failure cases

With $m$ phase bits, ordinary phase estimation calls controlled powers $U,U^2,\ldots,U^{2^{m-1}}$. If implemented by repeated base-$U$ calls, the count is $2^m-1$. For Hamiltonian evolution, those powers correspond to longer simulation times; they are not unit-cost gates. Energy resolution $\delta$ generally requires total coherent evolution on the order of $1/\delta$, before failure reduction and simulation overhead.

Nonbinary phases yield a distribution with tails. Approximate simulation adds further error. Simply taking the smallest noisy reported energy can mistake a tail or implementation fault for the ground energy. Use a validated precision/failure budget and a decision or confidence procedure suitable for the task. Distinguish a verified ground-energy certificate from “lowest sample seen.”

Ground-state degeneracy means the outcome can project into a multi-dimensional ground space, not one unique vector. Distinguishing the ground band from excitations requires resolution relative to the **spectral gap**, the separation between relevant energies. A very small gap or exponentially small overlap can dominate the algorithm.

## Practice, module connection, and next step

Change the input to $(|0\rangle+\sqrt3|1\rangle)/2$. The same circuit gives ground success $1/4$, and four trials fail with probability $(3/4)^4=81/256$. The unitary and its eigenvalues did not change; preparation did. Change the scale instead to $U=e^{i\pi H}$: both eigenvalues become $-1$, so the circuit cannot distinguish energies one and three at all. That is aliasing, not insufficient shots.

The useful connection is now concrete: the interference mechanism of [Deutsch](/lessons/deutsch/) turned signs into a bit; the inverse QFT here turns accumulated phases into an energy label. [HHL](/lessons/hhl/) will keep that label coherent, use it to change amplitudes, and erase it before measuring a success flag.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Aram W. Harrow, Avinatan Hassidim, Seth Lloyd, [Quantum algorithm for linear systems of equations](https://arxiv.org/abs/0811.3171), algorithm section: coherent eigenvalue labeling and uncomputation.
- Lin Lin, Yu Tong, [Optimal polynomial based quantum eigenstate filtering with application to solving quantum linear systems](https://arxiv.org/abs/1910.14596): overlap and gap assumptions in filtering.
- Earl Campbell, [A random compiler for fast Hamiltonian simulation](https://arxiv.org/abs/1811.08017), phase-estimation appendix: separate simulation error, phase-estimation error, and ground-overlap costs.
