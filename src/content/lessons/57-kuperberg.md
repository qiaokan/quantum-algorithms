## Problem and access model

In a cyclic hidden-shift problem, two injective functions satisfy $f_0(x)=f_1(x+s)$, with addition modulo a known N and unknown shift s. We receive coherent access to the indexed function $(b,x)\mapsto f_b(x)$ and must recover s. The dihedral hidden-subgroup formulation expresses the same hidden reflection structure through rotations and reflections of a polygon. [Kuperberg](https://arxiv.org/html/quant-ph/0302112) gives a subexponential-time sieve. It is not the polynomial-time abelian hidden-subgroup algorithm applied unchanged.

The straightforward classical method stores function values and seeks matching outputs; collision-style searches require many queries in the black-box model. If the functions have an exploitable explicit formula, this oracle baseline can be inappropriate. Kuperberg's bound is a theorem about a specified access model, not a claim that every hidden-shift application has a practical advantage.

## Create a phase-bearing qubit

Take N=8 and s=3. Prepare a uniform superposition over b∈{0,1} and x∈{0,…,7}, then compute f_b(x). Measuring a function value leaves a pair $(|0,x\rangle+|1,x+3\rangle)/\sqrt2$ for a uniformly selected x. No answer was used to prepare this pair: equality of the oracle outputs selected it.

Apply the positive-exponent QFT to the x register. Its term at frequency k has common factor $e^{2\pi ikx/8}$ and relative factor $e^{2\pi i3k/8}$. Measuring k gives a uniform random label and leaves

$$|\psi_k\rangle=(|0\rangle+e^{2\pi iks/N}|1\rangle)/\sqrt2.$$

The unknown x contributes only global phase. The label k is known; s is not. A single phase qubit does not reveal arbitrary s exactly.

## Combine two labels with actual gates

Write $a=e^{2\pi iks/N}$ and $b=e^{2\pi i\ell s/N}$. The tensor product is $(|00\rangle+b|01\rangle+a|10\rangle+ab|11\rangle)/2$. Apply CNOT from the first qubit to the second; it swaps the last two basis labels. The state is

$$\tfrac12(|00\rangle+b|01\rangle+ab|10\rangle+a|11\rangle).$$

Measure the second qubit. Outcome 0 occurs with probability 1/2 and leaves $(|0\rangle+ab|1\rangle)/\sqrt2=|\psi_{k+\ell}\rangle$. Outcome 1 also has probability 1/2 and leaves, after dropping global factor b, $(|0\rangle+(a/b)|1\rangle)/\sqrt2=|\psi_{k-\ell}\rangle$. Thus one operation combines known frequency labels while preserving a useful unknown phase.

## Recover the complete three-bit shift

For a concrete favorable run, collect labels k=1 and ℓ=3. The sum branch yields label 4, whose phase is $e^{2\pi i4s/8}=(-1)^s$. Since s=3, the qubit is |−〉. A Hadamard followed by measurement returns 1, proving the shift is odd. The sum branch is probabilistic; if the branch or labels are unsuitable, use further samples, not an uncounted success assumption.

Let the recovered parity be p=1. Restrict the functions to $g_0(x)=f_0(2x)$ and $g_1(x)=f_1(2x+p)$ on residues modulo 4. Their hidden shift is $s'=(s-p)/2=1$. This follows by substitution: $g_1(x+s')=f_1(2x+2s'+p)=f_1(2x+s)=f_0(2x)$.

For this reduced problem, two label-1 qubits can combine on the sum branch to label 2, giving parity 1 again. Restrict once more to modulus 2; the new shift is (1−1)/2=0. A label-1 phase qubit is now |+〉, so H measures 0. Reconstruct from the recovered low-to-high bits: $s=1+2\cdot1+4\cdot0=3$. This finishes the small algorithm, including classical recursion.

## Why a sieve and what it costs

Waiting for one prescribed label can be inefficient. The sieve keeps many phase qubits, pairs labels with suitable matching low bits, and uses their sum/difference branches to increase divisibility by powers of two. Repeating produces a high-frequency parity qubit without enumerating all shifts. Kuperberg proves time and query complexity $\exp(O(\sqrt{\log N}))$ for the original construction, with substantial storage. The proof of the collection/sieving bound is in the source; the explicit run above explains the operations, not the asymptotic combinatorics. Later variants alter time-space tradeoffs.

**Predict:** Can an unfavorable difference branch simply be discarded at no cost?

<details><summary>Show the answer</summary>

It may be discarded operationally, but its preparation and oracle calls still count. A resource estimate must include how many states survive each sieve stage. Postselection is not a free primitive.

</details>

The method reuses Fourier phase encoding, CNOT interference, and recursive classical postprocessing. Its advance beyond abelian Fourier sampling is coherent combination of samples before final measurement. No polynomial-time general solution to nonabelian hidden-subgroup problems follows.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Greg Kuperberg, [A subexponential-time quantum algorithm for the dihedral hidden subgroup problem](https://arxiv.org/html/quant-ph/0302112), Section III: phase qubits, label combination, parity recursion, and sieve bound. The explicit modulus-8 run is independently worked.
