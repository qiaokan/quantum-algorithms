## Problem and access model

Given a reversible classical Markov chain and a predicate marking some states, find a marked state. A *Markov chain* is a table $P_{xy}$ of transition probabilities from $x$ to $y$, with each row summing to one. A stationary distribution $\pi$ satisfies $\sum_x\pi_xP_{xy}=\pi_y$. Reversibility means $\pi_xP_{xy}=\pi_yP_{yx}$. This is an equality of probability flows, not the reversibility of a quantum gate.

The [MNRS framework](https://arxiv.org/html/quant-ph/0608026) turns a Szegedy walk into an approximate reflection, then uses amplitude amplification. Its inputs include circuits that prepare the stationary distribution, update a data structure coherently, and check marks. Without those access operations there is no generic efficient algorithm.

## A concrete pair of reflections

Use $P=\begin{pmatrix}3/4&1/4\\1/4&3/4\end{pmatrix}$. It has stationary distribution $(1/2,1/2)$. Encode one transition as $|p_x\rangle=\sum_y\sqrt{P_{xy}}|y\rangle$. Square roots are needed because amplitude squares give probabilities: $|p_0\rangle=(\sqrt3/2,1/2)^T$ and $|p_1\rangle=(1/2,\sqrt3/2)^T$.

For a normalized column $v$, reflection about its direction is $2vv^\dagger-I$; the [outer product](/definitions/outer-products/) $vv^\dagger$ projects onto that direction. For $v=(\sqrt3/2,1/2)^T$ the arithmetic is

$$2\begin{pmatrix}3/4&\sqrt3/4\\\sqrt3/4&1/4\end{pmatrix}-I
=\begin{pmatrix}1/2&\sqrt3/2\\\sqrt3/2&-1/2\end{pmatrix}.$$

Define $R_A$ to apply this reflection to the second register when the first is 0, and the corresponding reflection for $p_1$ when it is 1. Define $R_B=SR_AS$, where $S$ swaps the registers. One Szegedy step is $W=R_BR_A$.

Starting at $|00\rangle$, $R_A$ gives $|00\rangle/2+\sqrt3|01\rangle/2$. Now $R_B|00\rangle=|00\rangle/2+\sqrt3|10\rangle/2$ and $R_B|01\rangle=-|01\rangle/2+\sqrt3|11\rangle/2$. Substitute:

$$W|00\rangle=\tfrac14|00\rangle-\tfrac{\sqrt3}4|01\rangle+\tfrac{\sqrt3}4|10\rangle+\tfrac34|11\rangle.$$

Probabilities are $1/16,3/16,3/16,9/16$, summing to one. This is a unitary step, not two applications of the classical probability matrix.

## From a walk to search

The stationary encoding $|\Pi\rangle=\sum_x\sqrt{\pi_x}|x\rangle|p_x\rangle$ is unchanged by both reflections. Phase estimation on $W$ can distinguish this eigenphase-zero direction from other relevant directions. Negating the nonzero-phase components and undoing phase estimation approximates $2|\Pi\rangle\langle\Pi|-I$ on the relevant subspace. A mark oracle supplies the second reflection. Repeating their product rotates toward marked states as in Grover.

For a completely explicit small search, take four equally likely states, with independently uniform transitions, and mark state 2. Ignoring the unchanged uniform companion register, preparation gives $(1,1,1,1)^T/2$. Marking yields $(1,1,-1,1)^T/2$. Its mean amplitude is $1/4$. Reflection about uniform replaces each amplitude $a$ by $2(1/4)-a$, giving $(0,0,1,0)^T$. Measurement finds 2 with probability one. The uniform chain makes the stationary reflection exact and elementary. This convenience does not generalize to every chain.

## Cost and classical comparison

Let $S$ be stationary-state setup cost, $U$ coherent update cost, $C$ mark-check cost, $\epsilon$ a lower bound on stationary marked mass, and $\delta$ the classical spectral gap. The latter measures how far the next relevant eigenvalue lies from 1; for our two-state lazy chain its eigenvalues are 1 and 1/2, so $\delta=1/2$. Under the reversible-chain assumptions, MNRS obtains a search cost of order

$$S+\frac1{\sqrt\epsilon}\left(\frac U{\sqrt\delta}+C\right).$$

This theorem is not proved by the two-state arithmetic; it comes from the phase-gap and approximate-reflection analysis in the paper. A classical mixing-and-checking strategy has different dependence on marked mass and mixing. Compare actual setup/update/check costs, not just powers of $\epsilon$. Preparing $|\Pi\rangle$ can already be expensive. The walk's other invariant subspaces must be treated correctly; an arbitrary zero-phase vector is not necessarily the stationary state.

## Prediction and a meaningful extension

**Predict:** If every update loads the entire data structure again, is a favorable walk-step count sufficient?

<details><summary>Show the answer</summary>

No. $U$ then includes that loading cost. Element distinctness gains by retaining queried items and replacing one item per move. Rebuilding the subset defeats that mechanism.

</details>

Quantum fast-forwarding extends the family beyond finding stationary or marked states. For the symmetric two-state matrix above, $P^t|0\rangle=((1+2^{-t})/2,(1-2^{-t})/2)^T$. At $t=2$ this is $(5/8,3/8)^T$. Its normalized amplitude encoding is $(5,3)^T/\sqrt{34}$, with measurement probabilities $(25/34,9/34)$, **not** the classical distribution $(5/8,3/8)$. [Apers and Sarlette](https://arxiv.org/abs/1804.02321) approximate this normalized matrix-powered state with a roughly square-root dependence on $t$, plus inverse-output-norm and accuracy costs. This distinction prevents misreading fast-forwarding as free classical sampling after $t$ steps.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Frédéric Magniez, Ashwin Nayak, Jérémie Roland, Miklos Santha, [Search via Quantum Walk](https://arxiv.org/html/quant-ph/0608026), Sections 2–4: Szegedy reflections, stationary-phase filtering, and cost theorem.
- Simon Apers and Alain Sarlette, [Quantum Fast-Forwarding: Markov Chains and Graph Property Testing](https://arxiv.org/abs/1804.02321): normalized discriminant-matrix powering, including norm and precision dependence.
