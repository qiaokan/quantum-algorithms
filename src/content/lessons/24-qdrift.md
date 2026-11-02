## Problem and access model

We again want to approximate $e^{-iHt}$, but suppose $H$ has very many terms, some much smaller than others. **qDRIFT** selects terms randomly in proportion to their strength, rather than visiting every term in each time slice. The algorithm's guarantee concerns a randomized quantum operation, or **channel**, averaged over the classical choice of circuits. It is not a guarantee that every chosen circuit closely approximates the target unitary. This distinction is explicit in [Campbell's original paper](https://arxiv.org/abs/1811.08017).

Write $H=\sum_{j=1}^{L}h_jP_j$, with $h_j>0$ and each $P_j$ Hermitian of [operator norm](/definitions/norms/) one. A negative coefficient can be absorbed into $P_j$. We must be able to sample an index $j$ according to prescribed probabilities and implement $e^{-iP_j\tau}$. The data structure used for that sampling and the gate cost of the selected term count toward runtime.

## Classical baseline and why randomness can help

A classical simulator can sample the same random term sequence and multiply its matrices; the number of amplitudes remains the obstacle for generic many-qubit states. Within quantum simulation, compare qDRIFT against deterministic product formulas, randomized term orderings, and modern block-encoding methods. qDRIFT's advantage is instance-dependent. Its analysis does not establish a universal improvement over all those alternatives.

The intuition is an unbiased local update: large terms are selected more often, and the chosen term is evolved for a common enlarged duration. “Unbiased” applies to the leading short-time change, not to the complete exponential at finite step size.

## A fixed one-step experiment

Let $H=2X+Z$, $t=0.3$, and begin in $|0\rangle=(1,0)^T$. The coefficient sum is $\lambda=2+1=3$. With $N=1$ random step, select $X$ with probability $2/3$ or $Z$ with probability $1/3$, and use angle $\tau=\lambda t/N=0.9$.

If $X$ is selected, the [matrix exponential](/definitions/matrix-functions/) identity from the preceding lesson gives

$$|\psi_X\rangle=e^{-i0.9X}|0\rangle=\begin{pmatrix}\cos0.9\\-i\sin0.9\end{pmatrix}.$$

If $Z$ is selected,

$$|\psi_Z\rangle=e^{-i0.9Z}|0\rangle=\begin{pmatrix}e^{-i0.9}\\0\end{pmatrix}.$$

The first branch yields outcome one with probability $\sin^2(0.9)\approx0.613601$; the second yields zero certainly. Averaging the **probabilities**, the randomized procedure gives

$$P(1)=\tfrac23\sin^2(0.9)+\tfrac13\cdot0\approx0.409067.$$

This is an intentionally coarse approximation. Since $(2X+Z)^2=5I$, the exact evolution gives $P(1)=\frac45\sin^2(\sqrt5\,0.3)\approx0.309138$.

## Why we do not average state vectors

A [density matrix](/definitions/density-matrices/) records both quantum coherence and ordinary uncertainty. For a pure vector $v$, it is the outer product $vv^\dagger$; the dagger conjugates and transposes. For $|\psi_X\rangle$ this is

$$\rho_X=\begin{pmatrix}\cos^2\tau&i\cos\tau\sin\tau\\-i\cos\tau\sin\tau&\sin^2\tau\end{pmatrix}.$$

For the $Z$ branch it is $\rho_Z=\begin{pmatrix}1&0\\0&0\end{pmatrix}$; its global phase cancels. The randomized output is

$$\rho=\tfrac23\rho_X+\tfrac13\rho_Z.$$

Its lower-right entry is the outcome-one probability calculated above. In contrast, adding $(2/3)|\psi_X\rangle+(1/3)|\psi_Z\rangle$ would invent coherence between mutually exclusive classical choices. Its norm need not be one. We needed the density matrix to combine the random branches correctly; we can now return to the qDRIFT update.

**Predict:** could a one-step run select $Z$ and fail to move any probability out of $|0\rangle$ even though the target evolution does?

<details><summary>Show the answer</summary>

Yes, with probability $1/3$. The approximation guarantee is about the mixture of random choices, not a promise that this individual circuit is representative. More samples of one fixed bad circuit cannot remove its approximation bias.

</details>

## The general update and its first-order agreement

For $N$ steps, independently choose each term with $p_j=h_j/\lambda$, where $\lambda=\sum_jh_j$, and apply its evolution for $\tau=\lambda t/N$. In the small-angle expansion,

$$e^{-iP_j\tau}\rho e^{iP_j\tau}=\rho-i\tau(P_j\rho-\rho P_j)+O(\tau^2).$$

To see where the middle terms come from, multiply $(I-iP_j\tau)\rho(I+iP_j\tau)$ and keep terms containing at most one $\tau$. Averaging replaces $\sum_jp_jP_j$ by $H/\lambda$. The average update is therefore

$$\rho-i(t/N)(H\rho-\rho H)+O((\lambda t/N)^2),$$

which agrees to first order with true evolution for time $t/N$. After $N$ steps the leading error scales like $\lambda^2t^2/N$. The paper supplies a channel-distance bound that makes this statement uniform over input states, including entanglement with an untouched system.

## Costs, variants, and counterexamples

For fixed target channel error $\epsilon$, the basic qDRIFT bound uses $N=O(\lambda^2t^2/\epsilon)$ sampled exponentials. Although $L$ does not appear explicitly in this count, $\lambda$ may grow with $L$, and selecting and implementing a term still has a cost. This is not dimension-independent full runtime.

Randomly permuting a complete Trotter slice is a different algorithm: each term still appears, but its order varies. Hybrid methods can simulate large terms deterministically and small terms randomly. The coefficient distribution and commutation structure decide whether that helps. A Hamiltonian with all terms commuting may already admit exact deterministic splitting, leaving no approximation benefit for randomization.

Sampling error is also different from simulation error. The former shrinks when more independently generated circuits and measurements are averaged; the latter is controlled by $N$ and the approximation scheme. [Energy estimation](/lessons/energy-estimation/) needs controlled evolution over several durations, with an error budget for each duration. Reusing an uncontrolled gate does not automatically give a controlled version at the same cost.

## Practice and connections

If $H=7Z$ consists of one term, qDRIFT selects it with probability one and $N$ steps multiply to $e^{-i7Zt}$ exactly. If $H=2X+Z$ and the coefficients are incorrectly sampled uniformly while retaining $\lambda=3$, the leading effective Hamiltonian becomes $1.5X+1.5Z$; increasing $N$ converges to the wrong problem. These two examples distinguish harmless randomness from biased access.

The preceding [product-formula lesson](/lessons/product-formulas/) kept pure states because the circuit was fixed. This lesson introduced density matrices only when we needed to average random circuits. Later [LCU](/lessons/block-encoding/) will combine alternatives **coherently**. That is a different operation from the classical mixture here.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Earl Campbell, [A random compiler for fast Hamiltonian simulation](https://arxiv.org/abs/1811.08017), main construction and appendices on channel error and controlled evolution. Supports qDRIFT probabilities, scaling, and the ensemble-versus-single-circuit distinction.
- Andrew M. Childs et al., [A Theory of Trotter Error](https://arxiv.org/abs/1912.08854), for the deterministic comparison and importance of commutation structure.
- The one-step instance is original to this lesson; numerical verification is in [the downloadable matrix checks](/examples/matrix-checks.py).
