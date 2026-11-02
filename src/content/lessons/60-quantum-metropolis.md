## Problem and access model

Given Hamiltonian H and inverse temperature β, prepare or sample from the Gibbs state $\rho_\beta=e^{-\beta H}/\operatorname{Tr}(e^{-\beta H})$. β controls preference for low energy. The output may be a quantum thermal state or samples of energy eigenstates; it is not a list of every eigenvector. [Temme and collaborators](https://arxiv.org/abs/0911.3635) propose quantum Metropolis sampling using energy estimation and accept/reject logic. Efficient individual updates do not guarantee rapid convergence to equilibrium.

Classically, a diagonal Hamiltonian with accessible energies allows ordinary Metropolis updates without storing every Gibbs weight. For a general n-qubit Hamiltonian, explicitly diagonalizing its $2^n$-dimensional matrix is a possible but costly baseline; tensor-network, Monte Carlo, and problem-specific methods can be better on structured instances. Quantum sampling must be compared with the relevant such method and the same requested observable, rather than with unnecessary full diagonalization. Our two-level examples need only constant-size classical arithmetic.

## A complete commuting example

Use $H=\operatorname{diag}(0,\ln2)$ and β=1. Gibbs weights are 1 and 1/2, giving target probabilities $(2/3,1/3)$. Propose flipping the bit. The classical Metropolis acceptance rule is $\min(1,e^{-\beta(E_{\mathrm{new}}-E_{\mathrm{old}})})$. Thus 0→1 is accepted with probability 1/2, and 1→0 is accepted with probability one.

The row-stochastic transition matrix is $P=\begin{pmatrix}1/2&1/2\\1&0\end{pmatrix}$. Starting in 0, one update gives probabilities $(1/2,1/2)$; two give $(3/4,1/4)$; three give $(5/8,3/8)$. The fixed distribution is verified directly:

$$(2/3,1/3)P=(1/3+1/3,1/3)=(2/3,1/3).$$

The nontrivial eigenvalue is −1/2, so the deviation alternates sign and halves each step. This completely specifies convergence for this small chain.

## Coherent accept/reject building block

On an energy eigenstate |j〉, attach an energy label using an exact lookup for this diagonal example. Retain the old label, apply X to propose the other eigenstate, and rotate an acceptance ancilla. For an uphill proposal, its state becomes $(|0\rangle+|1\rangle)/\sqrt2$, interpreting 1 as accept. For a downhill proposal, set it to |1〉. Measure acceptance. Accepting preserves the proposed eigenstate; rejecting the uphill move restores |0〉 by reversing X. The resulting transition probabilities are exactly P.

The lookup is legal because H is already diagonal in a known computational basis. This toy is also trivially classically simulable. For a general Hamiltonian, energy estimation must be synthesized from controlled Hamiltonian evolution with adequate precision. The eigenvectors are not known computational labels, and rejecting a proposal cannot be implemented by simply cloning and restoring the old unknown state. Quantum rejection/rewinding is a substantive part of the original construction.

## A noncommuting system and a proposal that creates superposition

Now use a physical Hamiltonian containing noncommuting X and Z terms:

$$H_{\mathrm{phys}}=\frac{\ln2}{2}\left(I-\frac{X+Z}{\sqrt2}\right).$$

Its eigenstates are $|g\rangle=V|0\rangle$ and $|e\rangle=V|1\rangle$, with $V=R_y(\pi/4)$ and energies 0,ln 2. We know this diagonalization for the toy, so an exact energy-label operation is implemented by $V^\dagger$, CNOT from the system to an energy ancilla, then V. This is an actual circuit, not an oracle hiding a difficult diagonalization. A larger unknown Hamiltonian instead needs phase estimation and its full cost.

Choose the self-inverse proposal $C=VHV^\dagger$, where the H inside this expression is the **Hadamard gate**, not the Hamiltonian. In energy coordinates C maps $|g\rangle$ to $(|g\rangle+|e\rangle)/\sqrt2$, so it does not commute with the physical Hamiltonian. For clarity, order the three work registers as system energy basis, new-energy label, accept flag. The old energy 0 is retained as classical information after the incoming eigenstate preparation; it is not a cloned unknown state.

Starting from $|g,0,0\rangle$, apply C and the energy-label circuit, producing $(|g,0,0\rangle+|e,1,0\rangle)/\sqrt2$. Conditional on a new ground energy, use X on the acceptance flag (acceptance 1). Conditional on a new excited energy, use Hadamard (acceptance 1/2). Calling this whole unitary U, the output is

$$U|g,0,0\rangle=\frac1{\sqrt2}|g,0,1\rangle+\frac12|e,1,0\rangle+\frac12|e,1,1\rangle.$$

Acceptance occurs with probability 3/4. Measuring the new energy on this accepted branch yields g with conditional probability 2/3 and e with conditional probability 1/3. Rejection occurs with probability 1/4 and leaves $|e,1,0\rangle$. Simply reversing U does **not** restore the original state deterministically.

## Calculate the rejected branch and its recovery

Apply $U^\dagger$ to the rejected state. Reversing the conditional Hadamard, energy-copy circuit, and proposal gives

$$U^\dagger|e,1,0\rangle=\tfrac12(|g,0,0\rangle+|g,0,1\rangle-|e,0,0\rangle-|e,0,1\rangle).$$

Measure only whether the system energy equals the old energy 0. This binary measurement has projector $P_1=|g\rangle\langle g|\otimes I\otimes I$, with complement $P_0=I-P_1$. Outcome $P_1$ occurs with probability 1/2 and restores |g〉; the ancillas can be discarded. Outcome $P_0$ leaves, up to global phase, $|e,0\rangle|+\rangle$. This failed recovery is why a single inverse circuit is insufficient.

Define a second binary measurement by $Q_s=U^\dagger(I\otimes I\otimes|s\rangle\langle s|)U$ for s=0,1. To implement it, apply U, measure only the flag, and apply $U^\dagger$. After a failed P check, alternate a Q measurement with another P check. Stop only when $P_1$ returns. During recovery, a later $Q_1$ is **not** a fresh accepted Metropolis proposal; it is one branch of the repair procedure.

To see an entire recovery round, start from $|\chi\rangle=-|e,0\rangle|+\rangle$ (choosing its irrelevant global sign). In basis $g00,g01,g10,g11,e00,e01,e10,e11$, the unnormalized Q branches are

$$Q_0\chi=\frac1{2\sqrt2}(1,0,0,0,-1,-2,0,0)^T,\qquad
Q_1\chi=\frac1{2\sqrt2}(-1,0,0,0,-1,0,0,0)^T.$$

Their probabilities are 3/4 and 1/4. In each branch, the squared norm of the g component is 1/8, so the **combined** probability of successful restoration in this round is 1/4. Retain the e components on failure and repeat. Multiplying these explicit projectors on the resulting unnormalized density matrices gives a remaining probability $(3/4)^k$ after k additional rounds, conditional on the first failed P check. Thus the unresolved probability per original proposal is

$$\frac14\cdot\frac12\left(\frac34\right)^k=\frac18\left(\frac34\right)^k.$$

The geometric tail can be checked without assuming independence of retry branches. On the remaining excited-state flag subspace, the two failed-round matrices are

$$B_0=\begin{pmatrix}1/4&1/4\\1/4&3/4\end{pmatrix},\qquad B_1=\begin{pmatrix}3/4&-1/4\\-1/4&1/4\end{pmatrix}.$$

They satisfy $B_0^\dagger B_0+B_1^\dagger B_1=(3/4)I$. Therefore the trace of **any** unnormalized remaining density matrix is multiplied by 3/4 in this subspace each round, even though the state itself changes. This proves the tail used above.

After 40 rounds it is below 0.0000013. A finite implementation reports an unresolved sample and restarts or includes that failure in its error budget; it must not silently treat an exhausted retry as a valid thermal sample. This geometric number is special to the toy. General rejection-time bounds depend on the relevant projector overlaps and need the paper's analysis.

## The completed transition and its thermal output

With successful recovery, a ground-state input transitions to excited with probability $(1/2)(1/2)=1/4$; the remaining probability 3/4 returns ground. From an excited input, both proposed energies are downhill or equal, so acceptance is one and the Hadamard proposal chooses ground/excited equally. The transition matrix in energy labels is

$$P_{\mathrm{mix}}=\begin{pmatrix}3/4&1/4\\1/2&1/2\end{pmatrix}.$$

Its stationary weights are still 2/3,1/3: the upward flow is $(2/3)(1/4)=1/6$, matching $(1/3)(1/2)$. Its second eigenvalue is 1/4, giving a different mixing rate from the earlier deterministic-flip proposal. In the physical computational basis the thermal matrix is

$$\rho_\beta=\tfrac23|g\rangle\langle g|+\tfrac13|e\rangle\langle e|=\frac I2+\frac{X+Z}{6\sqrt2}.$$

A Z measurement gives 0 with probability $1/2+1/(6\sqrt2)\approx0.617851$, while an **energy** measurement gives the ground outcome with probability 2/3. These are different bases and different outcomes. The expected physical energy is $(\ln2)/3$. This completes a noncommuting-Hamiltonian example with a coherent proposal, real reject recovery, convergence, and explicit observables.

## Why detailed balance is not fast mixing

Detailed balance is equality of equilibrium flows: for the original deterministic-flip proposal, $(2/3)(1/2)=(1/3)(1)=1/3$; for the coherent Hadamard proposal the equal flows were 1/6. It shows the desired stationary distribution is respected. A bottleneck can still make convergence slow. Replacing both off-diagonal transition probabilities by a small common factor times their old values preserves detailed balance while making progress arbitrarily slower.

A continuous-time counterpart chooses upward rate 1/2 and downward rate 1. If $p_1(t)$ is excited-state probability, then $dp_1/dt=(1/2)(1-p_1)-p_1=1/2-3p_1/2$. The solution is $p_1(t)=1/3+(p_1(0)-1/3)e^{-3t/2}$. This derives equilibrium and mixing time separately. It is a classical diagonal special case, not the full noncommuting sampler.

## Modern Gibbs-sampling developments

[Chen, Kastoryano, and Gilyén](https://arxiv.org/abs/2311.09207) construct an efficiently implementable quantum thermal generator with exact detailed balance; its cost still depends on mixing time and inverse temperature. [Gilyén and collaborators](https://arxiv.org/abs/2405.20322), revised January 2026, develop discrete-time counterparts and improved Metropolis-style constructions. Their guarantees are meaningful advances over treating an approximate energy measurement as automatically preserving the exact thermal state. They do not prove fast mixing at every temperature for every Hamiltonian.

**Predict:** If β tends to infinity and the initial state has no route to the ground sector under the proposal rules, will the correct Boltzmann acceptance rule solve that problem?

<details><summary>Show the answer</summary>

No. The transition process may fail to connect the state space. Stationarity alone does not imply a unique stationary state or convergence from every initial state. Proposal connectivity and mixing assumptions must be checked.

</details>

The original ideal quantum Metropolis mechanism is now worked through a noncommuting two-level example, including rejection repair and a finite retry budget. General finite-resolution phase estimation can perturb detailed balance; an application must bound that error rather than importing this toy's exact-label guarantee. The modern generator papers are explicitly research extensions, not implemented by the three-register example. [Polynomial filtering](/lessons/polynomial-filtering/) offers another thermal-state route with different overlap and normalization costs.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Kristan Temme, Tobias J. Osborne, Karl Gerd H. Vollbrecht, David Poulin, Frank Verstraete, [Quantum Metropolis Sampling](https://arxiv.org/abs/0911.3635): energy-eigenstate thermal sampling framework. Sections 3 and 7 were checked for binary acceptance, alternating-projector recovery, and retry-cost caveats.
- Chi-Fang Chen, Michael J. Kastoryano, András Gilyén, [An efficient and exact noncommutative quantum Gibbs sampler](https://arxiv.org/abs/2311.09207): exact detailed balance with mixing-time/temperature costs.
- András Gilyén, Chi-Fang Chen, Joao F. Doriguello, Michael J. Kastoryano, [Quantum generalizations of Glauber and Metropolis dynamics](https://arxiv.org/abs/2405.20322): discrete counterparts and Metropolis-style improvements. Modern-paper abstracts were checked for the extension statements. The three-register numerical example and its geometric retry tail are independently calculated.
