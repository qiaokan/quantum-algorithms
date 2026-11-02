## Problem and access model

Given a finite, irreducible, reversible classical Markov chain and a predicate marking some states, find a marked state or report that none exists with bounded error. Irreducible means every state can reach every other through positive-probability transitions; it guarantees a unique stationary distribution. We use the lazy version of the chain below, which also removes periodicity. A *Markov chain* is a table $P_{xy}$ of transition probabilities from $x$ to $y$, with each row summing to one. A stationary distribution $\pi$ satisfies $\sum_x\pi_xP_{xy}=\pi_y$. Reversibility means $\pi_xP_{xy}=\pi_yP_{yx}$. This is an equality of probability flows, not the reversibility of a quantum gate.

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

## Derive the walk eigenphases instead of assuming them

Write $A|x\rangle=|x\rangle|p_x\rangle$ and $B|x\rangle=S A|x\rangle$. These $A,B$ are isometries from the two-dimensional label space into the four-dimensional walk space; they are not the reflections $R_A,R_B$. For this symmetric chain, $A^\dagger B=P$. If $P|v\rangle=\lambda|v\rangle$, let $a=A|v\rangle$ and $b=B|v\rangle$. Then $\langle a|b\rangle=\lambda$. A pair of lines with overlap $\lambda=\cos\theta$ meets at angle $\theta$. We can derive the resulting rotation without relying on a diagram:

$$R_Aa=a,\quad R_Ab=2\lambda a-b,\quad R_Bb=b,\quad R_Ba=2\lambda b-a.$$

Consequently $Wa=2\lambda b-a$ and $Wb=-2\lambda a+(4\lambda^2-1)b$. In the (generally nonorthogonal) basis $(a,b)$, the coefficient matrix is

$$\begin{pmatrix}-1&-2\lambda\\2\lambda&4\lambda^2-1\end{pmatrix}.$$

Its determinant is one and trace $4\lambda^2-2=2\cos(2\theta)$. Its eigenvalues therefore are $e^{\pm2i\theta}$. This coefficient basis is valid for $|\lambda|<1$; at $\lambda=1$ the vectors coincide and give the stationary direction instead.

For our chain, $v_+=(1,1)^T/\sqrt2$ has $\lambda=1$ and $a_+=b_+=|\Pi\rangle=(\sqrt3,1,1,\sqrt3)^T/(2\sqrt2)$. The other label eigenvector is $v_-=(1,-1)^T/\sqrt2$, with $\lambda=1/2$. Its lifted vectors are

$$a_-=(\sqrt3,1,-1,-\sqrt3)^T/(2\sqrt2),\qquad b_-=(\sqrt3,-1,1,-\sqrt3)^T/(2\sqrt2).$$

Their overlap is $1/2$. Substitution gives coefficient matrix $\begin{pmatrix}-1&-1\\1&0\end{pmatrix}$, with characteristic polynomial $z^2+z+1$. Thus the nontrivial phases are $\pm2\pi/3$, or $1/3$ and $2/3$ turns. The fourth direction $c=(1,-\sqrt3,-\sqrt3,1)^T/(2\sqrt2)$ is orthogonal to both image spaces. Both reflections negate it, so $Wc=c$. **There are two zero-phase vectors in the full space.** The ideal search states lie in $\operatorname{im}A$, inside $\mathcal K=\operatorname{span}(\operatorname{im}A,\operatorname{im}B)$, where only $|\Pi\rangle$ has phase zero. A mark reflection on the first label preserves $\operatorname{im}A$. The filter is analyzed on this supported ideal input, not arbitrary four-dimensional states. Approximation can leave residual components outside that ideal search space; the accumulated vector-error bound below accounts for them instead of assuming they vanish.

## Run a phase filter and account for its error

Apply two-control-qubit phase estimation to an eigenvector with $W$ eigenvalue $z$. Hadamards create four control labels, controlled $W$ and $W^2$ attach phases $1,z,z^2,z^3$, and the inverse four-point QFT makes the zero-label amplitude

$$g(z)=\frac{1+z+z^2+z^3}{4}.$$

For the stationary state $z=1$, $g=1$: the control is exactly 00. For either nontrivial cube root, $1+z+z^2=0$ and $z^3=1$, hence $g=1/4$. The probability of incorrectly reporting phase zero is $1/16$. This is a coherent filter, not an exact measurement of a one-third binary phase. It costs three controlled base-$W$ uses, not two.

Let $F$ denote this whole phase-estimation circuit. Reflect the control about 00, then uncompute: $\widetilde R=F^\dagger(2|00\rangle\langle00|-I)F$. On the stationary state with clean control this is exactly $+1$. On a nonzero-phase eigenvector it should be $-1$, but the leftover zero-bin amplitude causes vector-norm error $2|g|=1/2$. Do not confuse false-positive probability $1/16$ with reflection error $1/16$.

Repeat the filter coherently into $k$ separate two-qubit controls, reflect about **all** controls zero, and uncompute all filters. The erroneous amplitude becomes $4^{-k}$ and reflection error is at most $2\,4^{-k}$ on the nonstationary part of $\mathcal K$. The cost is $6k$ base-$W$ uses including inverses; controls must remain coherent until uncomputed. For $k=5$, this is error at most $1/512$ with 30 walk uses. The bound includes leftover ancilla amplitude, rather than silently projecting it away.

## The square root in the cost

For a general reversible chain, $A^\dagger B$ is the symmetric discriminant with entries $\sqrt{P_{xy}P_{yx}}$ and the same spectrum as $P$. Repeat the lifted-vector derivation with $v$ an eigenvector of this discriminant $D$, not of the generally nonsymmetric $P$; $D$ is symmetric, so $B^\dagger A=D$ as well. Make the chain lazy, $P=(I+Q)/2$, to keep eigenvalues nonnegative. If the next eigenvalue is $1-\delta$, the closest nonzero walk phase is $\Delta=2\arccos(1-\delta)$. Since $1-\cos\theta\le\theta^2/2$, we get $\Delta\ge2\sqrt{2\delta}$. That is the square-root mechanism: the product of reflections converts a classical eigenvalue gap into a larger angular gap.

With a power-of-two phase register of size $M$, the zero-bin amplitude obeys

$$\left|\frac{1-z^M}{M(1-z)}\right|\le\frac1{M|\sin(\phi/2)|},\qquad z=e^{i\phi}.$$

Taking $M=O(1/\Delta)$ makes this a constant below one for every nonzero relevant phase, at $M-1$ controlled walk uses. Repeating the filter $O(\log(1/\eta))$ times gives a reflection of error at most $\eta$ at cost $O(U\delta^{-1/2}\log(1/\eta))$, where $U$ charges a coherent update and a walk step costs $O(U)$. This explicit construction explains the gap dependence. If there are $T$ search rotations, a simple safe error allocation is $\eta=O(1/T)$: by the triangle inequality, their total state-vector error is at most $T\eta$. This straightforward proof retains a logarithm in $T$. The sharper MNRS theorem below uses its full approximate-reflection search analysis to obtain the quoted bound; we do not erase that distinction.

## From a walk to search

The stationary encoding $|\Pi\rangle=\sum_x\sqrt{\pi_x}|x\rangle|p_x\rangle$ is unchanged by both reflections. Phase estimation on $W$ can distinguish this eigenphase-zero direction from other relevant directions. Negating the nonzero-phase components and undoing phase estimation approximates $2|\Pi\rangle\langle\Pi|-I$ on the relevant subspace. A mark oracle supplies the second reflection. Repeating their product rotates toward marked states as in Grover.

For a completely explicit small search, take four equally likely states, with independently uniform transitions, and mark state 2. Ignoring the unchanged uniform companion register, preparation gives $(1,1,1,1)^T/2$. Marking yields $(1,1,-1,1)^T/2$. Its mean amplitude is $1/4$. Reflection about uniform replaces each amplitude $a$ by $2(1/4)-a$, giving $(0,0,1,0)^T$. Measurement finds 2 with probability one. The uniform chain makes the stationary reflection exact and elementary. This convenience does not generalize to every chain.

## Cost and classical comparison

Let $S$ be stationary-state setup cost, $U$ coherent update cost, $C$ mark-check cost, $\epsilon$ a lower bound on stationary marked mass, and $\delta$ the classical spectral gap. The latter measures how far the next relevant eigenvalue lies from 1; for our two-state lazy chain its eigenvalues are 1 and 1/2, so $\delta=1/2$. Under the reversible-chain assumptions, MNRS obtains a search cost of order

$$S+\frac1{\sqrt\epsilon}\left(\frac U{\sqrt\delta}+C\right).$$

The derivation above proves the phase-gap mechanism and an explicit reflection-error bound. Its simple repeated-filter implementation gives an extra logarithmic accuracy cost; the bound displayed here is the sharper MNRS theorem, including its improved approximate-reflection search analysis. A classical mixing-and-checking strategy has different dependence on marked mass and mixing. Compare actual setup/update/check costs, not just powers of $\epsilon$. Preparing $|\Pi\rangle$ can already be expensive. The walk's other invariant subspaces must be treated correctly; an arbitrary zero-phase vector is not necessarily the stationary state.

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
