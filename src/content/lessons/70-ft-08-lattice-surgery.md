## Problem and access model

The earlier lessons in this module protect a stored qubit. A computation must also *act* on logical qubits: apply gates, entangle them, measure them. This lesson answers what each kind of logical gate costs on a surface-code machine, in physical qubits, cycles and waiting time.

The access model: each [logical qubit](/definitions/logical-qubits/) is a surface-code patch ([FT-03](/lessons/ft-03-surface-code/)). Physical gates are only nearest-neighbour. Every operation is protected by repeated check rounds, and a decoder ([FT-05](/lessons/ft-05-decoding-matching/)) interprets the results. The answer comes in three tiers:

| Operation | Cost |
|---|---|
| Logical Pauli ($\bar X$, $\bar Z$) | Free: a classical record update |
| Clifford ($H$, $S$, CNOT) | About $d$ cycles of lattice surgery, no waiting on outcomes |
| $T$ gate | A distilled magic state, plus a wait for the decoder |

## Classical baseline

On a CPU, an XOR and an add cost about the same, and the scheduler mostly worries about data dependencies. Here gates differ in cost by orders of magnitude, and the most expensive gate also creates a data dependency on a measurement result. A fair comparison is a pipeline in which some instructions cannot issue until an earlier result has been read back. Resource estimates therefore count $T$ (or Toffoli) gates and largely ignore Clifford gates.

## Logical Paulis are free: the Pauli frame

Suppose the decoder decides that a logical $\bar X$ is needed. Applying it physically means $d$ single-qubit gates along a column, each of which could fail. Instead, the control system writes "this qubit owes an $\bar X$" in memory. When the qubit is later measured in the $Z$ basis, it flips the reported bit.

This record is the **Pauli frame**. It works because Clifford gates map [Pauli operators](/definitions/pauli-operators/) to Pauli operators ([FT-02](/lessons/ft-02-stabilizers-gottesman-knill/)): an owed $X$ before a CNOT becomes an owed Pauli after it, and the frame is updated by a table lookup. A logical Pauli therefore costs zero quantum operations and zero cycles. [Horsman et al. (2012)](https://arxiv.org/abs/1111.4022) handle merge outcomes this way, "by changing the interpretation of subsequent measurement outcomes, rather than by physical state operations".

## Lattice surgery: measuring $\bar Z\otimes\bar Z$

Two patches sit side by side with a strip of unused physical qubits between them. **Lattice surgery** ([Horsman et al., 2012](https://arxiv.org/abs/1111.4022)) joins them:

1. **Merge.** Prepare the strip qubits and start measuring checks that span the seam, so the two patches become one larger patch. The product of the new seam checks equals a joint logical operator. In Horsman et al.'s terms, a *smooth merge* prepares the strip in $|+\rangle$ and its new $Z$ checks multiply to $\bar Z_1\bar Z_2$; a *rough merge* prepares the strip in $|0\rangle$ and its new $X$ checks multiply to $\bar X_1\bar X_2$.
2. **Repeat for about $d$ rounds.** A single misread seam check would flip the logical outcome. Repeating lets the decoder catch measurement errors with the same distance-$d$ protection as everything else. [Litinski (2019)](https://arxiv.org/abs/1808.02892) states that two-patch and multi-patch measurements both need $d$ code cycles to account for measurement errors.
3. **Split.** Measure the strip qubits individually, which returns two separate patches.

The result is a projective measurement of $\bar Z_1\bar Z_2$ with outcome $\pm1$. It reveals only the parity, never the individual values, so it entangles the patches without destroying their information. At $d=25$ and 1 µs per cycle, one merge takes about 25 µs.

## Worked: a CNOT from two joint measurements

Use three logical qubits, written in the order (control C, ancilla A, target T), leftmost first. Record each outcome as a bit $m$: 0 for $+1$, 1 for $-1$. The sequence:

1. Prepare A in $|+\rangle=(|0\rangle+|1\rangle)/\sqrt2$.
2. Measure $Z_CZ_A$, outcome $m_1$.
3. Measure $X_AX_T$, outcome $m_2$.
4. Measure A alone in the $Z$ basis, outcome $m_3$.
5. Record the corrections $X_T$ if $m_1\oplus m_3=1$, and $Z_C$ if $m_2=1$.

Both corrections are Paulis, so they go into the frame. [Litinski (2019)](https://arxiv.org/abs/1808.02892) writes the general version, a controlled-Pauli gate built from a $|+\rangle$ ancilla and Pauli product measurements (his Fig. 33b). Horsman et al. give a lattice-surgery CNOT with an intermediate patch in $|+\rangle$, using one $\bar Z\bar Z$ merge and one $\bar X\bar X$ merge.

**Input:** control $0.6|0\rangle+0.8|1\rangle$, target $|0\rangle$. A correct CNOT must output $0.6|00\rangle+0.8|11\rangle$ on (C, T).

<details><summary>Predict: before any measurement, what is the probability of each outcome of $Z_CZ_A$?</summary>

One half each. A is in $|+\rangle$, so it is equally likely to agree or disagree with C, whatever C's amplitudes are. Every outcome in this protocol has probability 1/2, which is why no outcome reveals $0.6$ or $0.8$.

</details>

**Start.** $(0.6|0\rangle+0.8|1\rangle)|+\rangle|0\rangle=0.4243(|000\rangle+|010\rangle)+0.5657(|100\rangle+|110\rangle)$, using $0.6/\sqrt2=0.4243$ and $0.8/\sqrt2=0.5657$.

Follow one branch, $m_1=1$, $m_2=1$, $m_3=0$.

**Step 2, $Z_CZ_A=-1$.** Keep the terms where C and A differ, $|010\rangle$ and $|100\rangle$, with probability $0.4243^2+0.5657^2=0.18+0.32=0.5$. Renormalized: $0.6|010\rangle+0.8|100\rangle$.

**Step 3, $X_AX_T=-1$.** Apply the projector $(1-X_AX_T)/2$. $X_AX_T$ sends $|010\rangle\to|001\rangle$ and $|100\rangle\to|111\rangle$. Renormalized, again with probability 0.5:
$$0.4243|010\rangle-0.4243|001\rangle+0.5657|100\rangle-0.5657|111\rangle .$$

**Step 4, $Z_A=+1$.** Keep A $=0$: $|001\rangle$ and $|100\rangle$, probability 0.5. Renormalized: $-0.6|001\rangle+0.8|100\rangle$. Dropping A leaves $-0.6|01\rangle+0.8|10\rangle$ on (C, T).

**Step 5, corrections.** $m_1\oplus m_3=1$, so apply $X_T$: $-0.6|00\rangle+0.8|11\rangle$. $m_2=1$, so apply $Z_C$, which negates the $|11\rangle$ term: $-0.6|00\rangle-0.8|11\rangle=-(0.6|00\rangle+0.8|11\rangle)$. That is the CNOT output up to a global sign, which has no physical effect.

A short script checked all eight outcome branches: each has probability $1/8$, and each gives the CNOT output after its corrections. With patches, this costs two merges of about $d$ cycles each. Horsman et al. show that preparing the control as a $d\times2d$ patch and overlapping the split with the second merge brings the CNOT down to $d$ rounds. Their smallest lattice-surgery CNOT, at distance 3, uses 53 physical qubits.

## Why Clifford gates are cheap and $T$ is not

[Clifford gates](/definitions/clifford-gates/) come from Pauli product measurements like the ones above, plus frame updates. [Litinski (2019)](https://arxiv.org/abs/1808.02892) pushes this further: every Clifford gate can be commuted to the end of the circuit and absorbed into the final measurements, leaving only $\pi/8$ rotations ($T$-type gates) and Pauli product measurements. On his accounting, each Pauli product measurement takes one time step of about $d$ cycles.

Cliffords alone are not enough. [Boykin, Mor, Pulver, Roychowdhury and Vatan (1999)](https://arxiv.org/abs/quant-ph/9906054) prove that Hadamard, CNOT and $\sigma_z^{1/4}$ form a universal basis, and note that CNOT and Hadamard alone are not universal. $\sigma_z^{1/4}$ is the $T$ gate up to a global phase, and $S=T^2$, so $\{H,S,\text{CNOT},T\}$ is universal as well.

Why not implement $T$ directly on the patch?

- [Eastin and Knill (2009)](https://arxiv.org/abs/0811.4262): a code that detects an arbitrary error on any single physical subsystem cannot have a universal set of **transversal** gates, meaning gates applied qubit by qubit.
- [Bravyi and König (2013)](https://arxiv.org/abs/1206.1609): for two-dimensional topological stabilizer codes, which include the surface code, constant-depth local circuits can implement only Clifford logical gates.

So a non-Clifford gate needs an extra ingredient: a **magic state**, $|T\rangle=(|0\rangle+e^{i\pi/4}|1\rangle)/\sqrt2$, which is consumed to apply $T$.

## Worked: $T$-gate teleportation

Write $\omega=e^{i\pi/4}=0.7071+0.7071i$, so $T=\mathrm{diag}(1,\omega)$ and $S=\mathrm{diag}(1,i)$. Order the qubits as (data, magic). The circuit:

1. CNOT with the **data qubit as control** and the magic qubit as target.
2. Measure the **magic qubit** in the $Z$ basis.
3. If the outcome is 1, apply $S$ to the data qubit.

**Input:** data $0.6|0\rangle+0.8|1\rangle$. The target output is $T|\psi\rangle=0.6|0\rangle+0.8\omega|1\rangle=0.6|0\rangle+(0.5657+0.5657i)|1\rangle$.

**Before the CNOT:** $(0.6|0\rangle+0.8|1\rangle)(|0\rangle+\omega|1\rangle)/\sqrt2$.

**After the CNOT,** which flips the magic qubit when the data is 1:
$$\tfrac1{\sqrt2}\big(0.6|00\rangle+0.6\omega|01\rangle+0.8\omega|10\rangle+0.8|11\rangle\big)=0.4243|00\rangle+(0.3+0.3i)|01\rangle+(0.4+0.4i)|10\rangle+0.5657|11\rangle .$$

**Outcome 0** has probability $0.18+0.32=0.5$. The data qubit is left in $0.6|0\rangle+0.8\omega|1\rangle=T|\psi\rangle$. Done.

**Outcome 1** also has probability $0.18+0.32=0.5$. The data qubit is left in $0.6\omega|0\rangle+0.8|1\rangle=(0.4243+0.4243i)|0\rangle+0.8|1\rangle$. Factor out $\omega$: this is $\omega(0.6|0\rangle+0.8\bar\omega|1\rangle)=\omega\,T^\dagger|\psi\rangle$, the rotation in the wrong direction. Apply $S$, using $ST^\dagger=T$: $(0.4243+0.4243i)|0\rangle+0.8i|1\rangle=\omega\big(0.6|0\rangle+0.8\omega|1\rangle\big)$, since $\omega\cdot\omega=i$. That is $T|\psi\rangle$ up to the global phase $\omega$.

The convention matters. If the CNOT runs the other way, with the magic qubit as control and the data measured, outcome 1 needs $SX$ instead of $S$; a numerical check of both conventions confirms this. [Litinski (2019)](https://arxiv.org/abs/1808.02892) uses the measurement form: measure $P\otimes Z$ between the data and the magic state, apply a $P_{\pi/4}$ (that is, $S$-type) correction on outcome $-1$, then measure the magic state in $X$, whose $-1$ outcome needs only a Pauli correction.

## Feedforward sets the reaction time

The $S$ correction is a Clifford, not a Pauli, so it cannot simply be folded into the Pauli frame. Litinski commutes it forward instead, which changes the axis of the *next* $\pi/8$ rotation. Either way, the next non-Clifford operation depends on this outcome.

The same holds for a frame entry that is still pending when the $T$ arrives: $TXT^\dagger=e^{-i\pi/4}SX$, so an owed $X$ becomes an owed $SX$.

The outcome is a logical measurement result, so it is known only after the decoder has processed it. [Gidney and Ekerå (2021)](https://arxiv.org/abs/1905.09749) define the **reaction time** as the time for the control system to trigger a logical measurement, collect and error-correct the result, and decide the basis of the next measurements. They assume 10 µs. A chain of $k$ dependent $T$ gates cannot finish in less than about $k$ reaction times, however many qubits are available. The real-time decoding lesson in this module and the next lesson, [Magic states](/lessons/ft-09-magic-states/), turn this into a clock speed.

## Implementation and honest cost

- **Space for surgery.** Merges need free strips between patches. Litinski's compact data block stores $n$ logical qubits in $1.5n+3$ tiles, and his faster designs use more. Routing space is a real fraction of the machine.
- **Time per Clifford.** About $d$ cycles per Pauli product measurement: roughly 25 µs at $d=25$ and 1 µs per cycle. Cliffords are cheap relative to $T$ gates, not free.
- **Decoding during surgery.** A merged patch is a larger, temporary code, so the decoder's graph changes shape mid-computation.
- **$T$ needs a supply chain.** Each $T$ consumes one magic state of very high fidelity. Making them is the subject of the next lesson.
- **Frame correctness.** The frame is classical state on the critical path. A software bug in frame tracking is a logical error that no code distance can fix.

## Misunderstandings and prediction checks

<details><summary>"Lattice surgery is a CNOT between physical qubits of neighbouring patches." Is that right?</summary>

No. That is a transversal CNOT, which Horsman et al. contrast with lattice surgery. Surgery measures a joint logical operator by temporarily fusing two patches into one code. The CNOT emerges from two such measurements plus Pauli corrections.

</details>

<details><summary>Predict: in the $T$ teleportation, does the outcome probability depend on $\alpha$ and $\beta$?</summary>

No. It is $(|\alpha|^2+|\beta|^2)/2=1/2$ for every input. For $0.6,0.8$ that is $0.18+0.32=0.5$. If it depended on the input, the measurement would leak information and disturb the state.

</details>

<details><summary>Why does a $T$ gate stall the machine when a CNOT does not?</summary>

The CNOT's corrections are Paulis, which the frame absorbs, so the next gate can start at once. The $T$ gate's correction is an $S$, which changes what the next non-Clifford operation must do. That decision has to wait for the decoder.

</details>

## References

- Dominic Horsman, Austin G. Fowler, Simon Devitt, Rodney Van Meter, [Surface code quantum computing by lattice surgery](https://arxiv.org/abs/1111.4022), New J. Phys. 14, 123011 (2012). Merge and split; $\bar Z\bar Z$ and $\bar X\bar X$ merges; CNOT with an intermediate $|+\rangle$ patch in $d$ rounds; 53-qubit distance-3 CNOT; corrections by reinterpretation.
- Daniel Litinski, [A Game of Surface Codes: Large-Scale Quantum Computing with Lattice Surgery](https://arxiv.org/abs/1808.02892), Quantum 3, 128 (2019). Pauli product measurements in about $d$ cycles; Cliffords commuted away; magic-state consumption via $P\otimes Z$ with a $P_{\pi/4}$ correction; compact block of $1.5n+3$ tiles.
- P. Oscar Boykin, Tal Mor, Matthew Pulver, Vwani Roychowdhury, Farrokh Vatan, [On universal and fault-tolerant quantum computing](https://arxiv.org/abs/quant-ph/9906054), arXiv quant-ph/9906054 (1999). Hadamard, $\sigma_z^{1/4}$ and CNOT form a universal basis.
- Bryan Eastin, Emanuel Knill, [Restrictions on transversal encoded quantum gate sets](https://arxiv.org/abs/0811.4262), Phys. Rev. Lett. 102, 110502 (2009). No universal transversal gate set for codes that detect single-subsystem errors.
- Sergey Bravyi, Robert König, [Classification of topologically protected gates for local stabilizer codes](https://arxiv.org/abs/1206.1609), Phys. Rev. Lett. 110, 170503 (2013). Constant-depth logical gates of 2D topological stabilizer codes are Clifford.
- Craig Gidney, Martin Ekerå, [How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits](https://arxiv.org/abs/1905.09749), Quantum 5, 433 (2021). Definition of reaction time; 10 µs assumption.
