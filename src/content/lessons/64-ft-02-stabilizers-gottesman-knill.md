## Problem and access model

Error-correction circuits are large. A distance-3 surface code already needs 17 qubits, and the codes in resource estimates use thousands. A state vector stores $2^n$ complex amplitudes. That is fine for 17 qubits and impossible for 50. Yet engineers routinely simulate error-correction circuits with thousands of qubits. This lesson shows how: for one important family of circuits, the state can be described by $n$ [Pauli](/definitions/pauli-operators/) strings instead of $2^n$ numbers.

The input is a circuit built from Hadamard $H$, phase $S=\mathrm{diag}(1,i)$, CNOT and Pauli gates, applied to $|0\cdots0\rangle$, plus measurements in the computational basis. The output is samples of the measurement outcomes with the correct probabilities. These are exactly the operations a syndrome-extraction round uses.

## Classical baseline

A state vector of $n$ qubits holds $2^n$ complex numbers, about 16 bytes each in double precision. At $n=17$ that is $2^{17}\times16=2{,}097{,}152$ bytes, about 2 MB. At $n=50$ it is $2^{50}\times16\approx1.8\times10^{16}$ bytes, about 18 petabytes. This book's own state-vector simulator stops at 8 qubits on purpose.

The method below stores $2n$ Pauli strings of $n$ letters each, plus signs. At $n=50$ that is $2\cdot50\cdot(2\cdot50+1)=10{,}100$ bits, about 1.3 KB.

## Stabilizers: describe a state by what leaves it unchanged

An operator $P$ **[stabilizes](/definitions/stabilizers/)** a state $|\psi\rangle$ if $P|\psi\rangle=|\psi\rangle$. Some examples:

- $Z|0\rangle=|0\rangle$, so $Z$ stabilizes $|0\rangle$, while $-Z$ stabilizes $|1\rangle$.
- $X|+\rangle=|+\rangle$, so $X$ stabilizes $|+\rangle=(|0\rangle+|1\rangle)/\sqrt2$.
- For the Bell state $|\Phi\rangle=(|00\rangle+|11\rangle)/\sqrt2$, check $XX$: it maps $|00\rangle\to|11\rangle$ and $|11\rangle\to|00\rangle$, so it maps $|\Phi\rangle$ to itself. Check $ZZ$: it multiplies $|00\rangle$ by $(+1)(+1)$ and $|11\rangle$ by $(-1)(-1)$, so it also leaves $|\Phi\rangle$ unchanged.

The products of stabilizers are stabilizers too. Here $XX\cdot ZZ=(XZ)\otimes(XZ)=(-iY)\otimes(-iY)=-YY$, so $-YY$ stabilizes $|\Phi\rangle$.

For $n$ qubits, $n$ independent, commuting Pauli strings (none equal to $-I$) pin down exactly one state. So the Bell state is fully described by the two strings $\{+XX,+ZZ\}$. Measured differently: four amplitudes became two short strings.

Fewer constraints leave room for encoded information. The repetition code of [FT-01](/lessons/ft-01-pauli-errors-repetition-code/) is described by the two strings $Z_0Z_1$ and $Z_1Z_2$ on three qubits. Two constraints on three qubits leave a two-dimensional space, which is one logical qubit. The syndrome bits were just the measured eigenvalues of these stabilizers: 0 for $+1$, 1 for $-1$. On that code space, $XXX$ acts as the logical $X$ and $Z_0$ as the logical $Z$.

## Clifford gates move Paulis to Paulis

If a gate $U$ acts on a state stabilized by $P$, the new state is stabilized by $UPU^\dagger$, because $UPU^\dagger(U|\psi\rangle)=UP|\psi\rangle=U|\psi\rangle$. For the gates $H$, $S$ and CNOT, $UPU^\dagger$ is always another Pauli string, possibly with a sign. Gates with this property are the [Clifford gates](/definitions/clifford-gates/). Their action on single-qubit Paulis is

| Gate | $X\mapsto$ | $Z\mapsto$ | $Y\mapsto$ |
|---|---|---|---|
| $H$ | $Z$ | $X$ | $-Y$ |
| $S$ | $Y$ | $Z$ | $-X$ |

For a CNOT with control $a$ and target $b$: $X_a\mapsto X_aX_b$, $Z_a\mapsto Z_a$, $X_b\mapsto X_b$, and $Z_b\mapsto Z_aZ_b$.

Check one entry: $SXS^\dagger=\begin{pmatrix}1&0\\0&i\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix}\begin{pmatrix}1&0\\0&-i\end{pmatrix}=\begin{pmatrix}0&-i\\i&0\end{pmatrix}=Y.$

**Worked circuit: preparing a Bell state.**

1. $|00\rangle$ is stabilized by $\{ZI,IZ\}$.
2. Apply $H$ to qubit 0. Using the table, $ZI\mapsto XI$, and $IZ$ is unchanged. The stabilizers are $\{XI,IZ\}$, which describe $|{+}0\rangle$.
3. Apply a CNOT from qubit 0 to qubit 1. Then $XI\mapsto XX$ and $IZ\mapsto ZZ$, giving $\{XX,ZZ\}$.

That is the Bell state, reached without writing a single amplitude.

## Measurement on stabilizers

<details><summary>Predict: measuring qubit 0 of the Bell state in the computational basis gives what, and what happens to qubit 1?</summary>

Outcome 0 or 1 with probability 1/2 each. Qubit 1 then gives the same bit with certainty. The rules below derive this.

</details>

To measure $Z$ on qubit $a$, ask whether $Z_a$ commutes with every stabilizer.

- **If one stabilizer anticommutes with $Z_a$**, the outcome is a fair coin. Replace that stabilizer by $\pm Z_a$, with the sign set by the outcome. Before that, multiply it into any other anticommuting stabilizer to make them commute.
- **If every stabilizer commutes with $Z_a$**, the outcome is determined: $\pm Z_a$ is a product of stabilizers, and its sign is the answer.

For the Bell state, $Z_0$ anticommutes with $XX$ and commutes with $ZZ$. So the first measurement is random. Suppose it reads 0: replace $XX$ by $+ZI$, giving $\{ZI,ZZ\}$, which describes $|00\rangle$. Now measure qubit 1: $IZ=ZI\cdot ZZ$ is a product of stabilizers with sign $+$, so the outcome is 0 with certainty. The repository's simulator test does exactly this, then repeats it for a 60-qubit GHZ state.

## The tableau: Paulis as bits

A computer stores each Pauli string as two bit vectors plus a sign bit. For qubit $j$:

- $x_j=1$ if the letter is $X$ or $Y$;
- $z_j=1$ if the letter is $Z$ or $Y$.

So $XX$ is $x=11$, $z=00$, and $ZZ$ is $x=00$, $z=11$. Gates become bit operations on every row:

- $H$ on qubit $a$ swaps $x_a$ and $z_a$, flipping the sign when both are 1.
- CNOT$_{a\to b}$ sets $x_b\mathrel{\oplus}=x_a$ and $z_a\mathrel{\oplus}=z_b$, with a sign rule.

Redo the Bell circuit in bits. $ZI$ is $(x=00,z=10)$. $H_0$ swaps $x_0$ and $z_0$, giving $(x=10,z=00)=XI$. The CNOT sets $x_1\mathrel{\oplus}=x_0$, giving $(x=11,z=00)=XX$. The other row, $IZ=(x=00,z=01)$, becomes $(x=00,z=11)=ZZ$ under $z_0\mathrel{\oplus}=z_1$.

[Aaronson and Gottesman (2004)](https://arxiv.org/abs/quant-ph/0406196) added $n$ "destabilizer" rows to the $n$ stabilizer rows. Their paper reports that this lets measurements run in $O(n^2)$ steps instead of $O(n^3)$. Each gate costs $O(n)$ bit operations, since it touches one or two columns of $2n$ rows. The repository's [`stabilizer.ts`](https://github.com/qiaokan/quantum-algorithms/blob/codex/initial-setup/src/lib/stabilizer.ts) implements this tableau, and its tests check it against the state-vector simulator on random circuits of up to 6 qubits.

## The Gottesman–Knill theorem

The result is usually called the Gottesman–Knill theorem. [Gottesman (1998)](https://arxiv.org/abs/quant-ph/9807006) states it as "Knill's theorem", crediting Knill. Circuits of Clifford gates, Pauli measurements and Clifford gates controlled by earlier classical outcomes can be simulated in polynomial time on a probabilistic classical computer. In that paper the circuits start from a stabilizer state such as $|0\cdots0\rangle$.

This does not make quantum computing easy. Add the gate $T=\mathrm{diag}(1,e^{i\pi/4})$:

$$TXT^\dagger=\frac{X+Y}{\sqrt2}.$$

That is not a single Pauli string, so the tableau cannot track it. Adding one such non-Clifford gate to the Clifford gates gives a universal gate set. (This is a standard result, but no source for it has been verified in this edition yet.) Two consequences run through the rest of this module:

1. **Error-correction circuits are Clifford circuits with Pauli noise**, so they can be simulated and benchmarked at full scale. [Stim](https://arxiv.org/abs/2103.02202) is a widely used simulator built on this idea.
2. **The non-Clifford gates are the expensive part** of a fault-tolerant computation. They cannot be done as cheaply as Clifford gates on an error-corrected processor, which is why resource estimates count T or Toffoli gates.

## Implementation and honest cost

- **Speed.** Simulating a Clifford circuit costs $O(n)$ per gate and $O(n^2)$ per random measurement in this implementation. Production simulators pack bits into machine words and process many samples at once.
- **Noise model.** Only Pauli noise fits the tableau. Amplitude damping and coherent over-rotations are not Pauli channels. Studies model them with Pauli approximations, and that approximation is a modelling choice to state, not a fact about the hardware.
- **Scope.** The tableau answers "what is the outcome distribution", not "what are the amplitudes". It cannot produce the full state vector without exponential work.
- **Size in this repository.** The simulator accepts up to 512 qubits, and its tests run 50 and 60. That is enough for the distance-3 surface code (17 qubits) and the distance-5 code (49 qubits) in [FT-03](/lessons/ft-03-surface-code/).

## Misunderstandings and prediction checks

<details><summary>"Clifford circuits create no entanglement, which is why they are easy." Is that right?</summary>

No. The Bell and GHZ states are maximally entangled and are prepared by Clifford circuits. Clifford circuits are easy to simulate because Pauli strings stay Pauli strings, not because entanglement is absent.

</details>

<details><summary>Predict: start from $|0\rangle$, apply $H$ then $S$. What single Pauli stabilizes the result?</summary>

$Z\mapsto X$ under $H$, then $X\mapsto Y$ under $S$. So the state is stabilized by $Y$: it is $(|0\rangle+i|1\rangle)/\sqrt2$.

</details>

<details><summary>If error-correction circuits are classically simulable, why build quantum error correction at all?</summary>

The simulation reproduces the error-correction layer only. The computation it protects contains non-Clifford gates, and simulating that computation remains exponentially hard in general.

</details>

## References

- Scott Aaronson, Daniel Gottesman, [Improved simulation of stabilizer circuits](https://arxiv.org/abs/quant-ph/0406196), Phys. Rev. A 70, 052328 (2004). Destabilizer tableau; $O(n^2)$ measurement.
- Daniel Gottesman, [The Heisenberg representation of quantum computers](https://arxiv.org/abs/quant-ph/9807006), arXiv quant-ph/9807006 (1998), in Group22 proceedings (1999). "Knill's theorem" on efficient simulation.
- Daniel Gottesman, [Stabilizer Codes and Quantum Error Correction](https://arxiv.org/abs/quant-ph/9705052), Caltech PhD thesis (1997). The stabilizer formalism.
- Craig Gidney, [Stim: a fast stabilizer circuit simulator](https://arxiv.org/abs/2103.02202), Quantum 5, 497 (2021).
- Worked numbers: checked in `public/examples/ft-checks.py`.
