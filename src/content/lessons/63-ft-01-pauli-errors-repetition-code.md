## Problem and access model

Keep one qubit's state $\alpha|0\rangle+\beta|1\rangle$ intact while the hardware underneath it keeps making mistakes. We are not allowed to look at $\alpha$ and $\beta$: measuring the qubit would replace them with a random bit. We also cannot copy the state into spares, because an unknown quantum state cannot be cloned. What we can do is spread the state over several physical qubits and measure only **parities** of those qubits through extra helper qubits. Each parity says whether two qubits agree, never what either one holds. Those parity outcomes are the **syndrome**, and they decide which correction to apply.

This lesson uses the simplest error model, called *code capacity*. Between rounds of checking, each physical qubit independently suffers a bit flip with probability $p$. The checking circuit itself is assumed perfect. [FT-04](/lessons/ft-04-noise-thresholds/) removes that assumption.

## Errors as Pauli operators

The four [Pauli operators](/definitions/pauli-operators/) are

$$I=\begin{pmatrix}1&0\\0&1\end{pmatrix},\quad X=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad Z=\begin{pmatrix}1&0\\0&-1\end{pmatrix},\quad Y=iXZ=\begin{pmatrix}0&-i\\i&0\end{pmatrix}.$$

$X$ is a **bit flip**: it swaps the amplitudes of $|0\rangle$ and $|1\rangle$. $Z$ is a **phase flip**: it leaves $|0\rangle$ alone and negates the amplitude of $|1\rangle$, so $Z(\alpha|0\rangle+\beta|1\rangle)=\alpha|0\rangle-\beta|1\rangle$. $Y$ does both, up to a factor $i$. Every $2\times2$ matrix is a combination $e_0I+e_1X+e_2Y+e_3Z$, so a code that can undo $X$ and $Z$ on a qubit can undo any error on that qubit. The last section of this lesson works through why.

## Classical baseline

Classical repetition stores a bit three times and takes a majority vote. It fails only if two or three copies flip:

$$P_{\rm fail}=3p^2(1-p)+p^3=3p^2-2p^3.$$

For $p=0.01$ this is $3(0.0001)-2(0.000001)=0.000298$, about 34 times better than an unprotected bit. The quantum version must achieve the same thing without reading the copies, because reading them would destroy $\alpha$ and $\beta$.

## Encoding: one logical qubit in three physical qubits

Start from $(\alpha|0\rangle+\beta|1\rangle)|00\rangle$ and apply two [CNOTs](/definitions/controlled-gates/) from qubit 0 to qubits 1 and 2. Each CNOT copies the *basis label*, not the state:

$$\alpha|000\rangle+\beta|111\rangle.$$

Take the worked instance $\alpha=0.6$, $\beta=0.8$, so the encoded state is $0.6|000\rangle+0.8|111\rangle$. This is not three copies of the qubit. Three copies would be $(0.6|0\rangle+0.8|1\rangle)^{\otimes 3}$, with eight nonzero amplitudes. The encoded state has only two. The two-dimensional space spanned by $|000\rangle$ and $|111\rangle$ is the **code space**, and the state inside it is a [logical qubit](/definitions/logical-qubits/).

<details><summary>Predict: would measuring qubit 0 in the computational basis tell us whether an error happened?</summary>

No. It would return 0 with probability 0.36 and 1 with probability 0.64, and collapse all three qubits to $|000\rangle$ or $|111\rangle$. The logical state would be gone. Error correction has to measure something that every code state agrees on.

</details>

## Syndrome extraction, fully worked

Suppose a bit flip hits the middle qubit. The state becomes

$$X_1(0.6|000\rangle+0.8|111\rangle)=0.6|010\rangle+0.8|101\rangle.$$

We measure two parities, $Z_0Z_1$ (do qubits 0 and 1 agree?) and $Z_1Z_2$ (do qubits 1 and 2 agree?). Each uses a helper qubit, an **ancilla**, that starts in $|0\rangle$. For the first parity, apply CNOTs from qubit 0 and from qubit 1 into the ancilla. The ancilla then holds $q_0\oplus q_1$ in each branch.

- Branch $|010\rangle$: $q_0\oplus q_1=0\oplus1=1$.
- Branch $|101\rangle$: $q_0\oplus q_1=1\oplus0=1$.

Both branches give 1, so the joint state factors:

$$\bigl(0.6|010\rangle+0.8|101\rangle\bigr)\otimes|1\rangle_{\rm anc}.$$

Measuring the ancilla returns 1 with certainty and leaves $0.6$ and $0.8$ untouched. That is the whole trick: the parity is the same in every branch of the code state, so measuring it gains no information about $\alpha$ or $\beta$. The second ancilla computes $q_1\oplus q_2$, which is $1\oplus0=1$ for $|010\rangle$ and $0\oplus1=1$ for $|101\rangle$, so it also reads 1.

The syndrome is $(1,1)$. The table of single-flip syndromes is

| Error | $Z_0Z_1$ | $Z_1Z_2$ | Correction |
|---|---|---|---|
| none | 0 | 0 | none |
| $X_0$ | 1 | 0 | $X_0$ |
| $X_1$ | 1 | 1 | $X_1$ |
| $X_2$ | 0 | 1 | $X_2$ |

Apply $X_1$, and the state returns to $0.6|000\rangle+0.8|111\rangle$. To finish the example, undo the encoding with the same two CNOTs, giving $(0.6|0\rangle+0.8|1\rangle)|00\rangle$, and measure qubit 0. It reads 0 with probability $0.6^2=0.36$ and 1 with probability $0.8^2=0.64$, exactly as if no error had happened.

## Two flips defeat the code

Now flip qubits 0 and 1: the state is $0.6|110\rangle+0.8|001\rangle$. The parities are $q_0\oplus q_1=0$ and $q_1\oplus q_2=1$, which is syndrome $(0,1)$, the signature of a flip on qubit 2. The decoder applies $X_2$, and the total operation is $X_0X_1X_2$:

$$0.6|111\rangle+0.8|000\rangle.$$

Every check now passes, but the amplitudes 0.6 and 0.8 have swapped places. This is a **logical error**: a wrong state that looks valid. The code fails exactly when two or three qubits flip, so its logical failure probability is the classical $3p^2-2p^3$. Encoding helps when that is smaller than $p$. Setting $3p^2-2p^3=p$ gives $p=1/2$. At $p=0.6$ the encoded failure is $3(0.36)-2(0.216)=0.648$, worse than leaving the qubit alone.

With $d$ qubits and majority decoding, the code survives any $(d-1)/2$ flips:

$$P_L(d,p)=\sum_{k>d/2}\binom{d}{k}p^k(1-p)^{d-k}.$$

At $p=0.01$, $d=3$ gives $2.98\times10^{-4}$ and $d=5$ gives $9.85\times10^{-6}$. The number $d$ is the code's [distance](/definitions/code-distance/): the fewest physical errors that cause an undetected logical error.

## Phase flips need a different code

Apply $Z$ to qubit 0 of the encoded state:

$$Z_0(0.6|000\rangle+0.8|111\rangle)=0.6|000\rangle-0.8|111\rangle.$$

Both parity checks still read 0, because $Z$ never changes a bit value. Yet the logical state has changed from $0.6|0\rangle+0.8|1\rangle$ to $0.6|0\rangle-0.8|1\rangle$. Against phase flips this code has distance 1: a single error is already a logical error.

The fix for phase flips is the same code rotated by Hadamards. Encode into $|{+}{+}{+}\rangle$ and $|{-}{-}{-}\rangle$, and check $X_0X_1$ and $X_1X_2$. A $Z$ error swaps $|+\rangle$ and $|-\rangle$, exactly as $X$ swaps $|0\rangle$ and $|1\rangle$. Nesting the two codes, so that each qubit of a phase-flip code is itself a three-qubit bit-flip code, uses nine qubits and handles one error of either kind. This nesting is the idea behind [Shor's 1995 scheme](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.52.R2493). (Unverified here: the nine-qubit details were not checked against Shor's full text; the abstract describes "a quantum analog of error-correcting codes".) The [surface code](/lessons/ft-03-surface-code/) is the scalable answer used by current hardware. It measures both $X$-type and $Z$-type parities on a two-dimensional grid.

## Why correcting Pauli errors is enough

Real errors are not neat flips. Suppose qubit 0 is over-rotated slightly about the $X$ axis:

$$e^{-i\theta X}=\cos\theta\,I-i\sin\theta\,X.$$

Applied to the encoded state $|\psi_L\rangle$, this gives $\cos\theta|\psi_L\rangle-i\sin\theta\,X_0|\psi_L\rangle$. The two pieces have different syndromes, $(0,0)$ and $(1,0)$. Measuring the syndrome therefore picks one of them: no error with probability $\cos^2\theta$, or exactly $X_0$ with probability $\sin^2\theta$. Either way the decoder knows what to do. For $\theta=0.1$, $\sin^2\theta\approx0.00997$. Syndrome measurement turns a continuous error into a discrete Pauli error, with probability $\sin^2\theta$. This is why every later lesson describes noise as Pauli errors with probabilities.

## Implementation and honest cost

- **Qubits and gates.** One round uses 3 data qubits, 2 ancillas, 4 CNOTs and 2 ancilla measurements. A $d$-qubit repetition code needs $d$ data qubits and $d-1$ ancillas.
- **Partial protection only.** The code handles bit flips only. Real devices have both kinds of error, so this code is a teaching device and a benchmark, not a memory.
- **The checking circuit fails too.** On hardware, CNOTs, resets and ancilla measurements all fail occasionally. A wrong ancilla reading reports a syndrome that is not there, and the decoder then *introduces* an error. Repeating the measurement rounds and decoding the history, as [FT-05](/lessons/ft-05-decoding-matching/) does, handles that.
- **Rounds are periodic.** Errors keep arriving, so a round of checks runs over and over. Each round's syndrome has to be decoded quickly enough to keep up. A later lesson in this module, on real-time decoding, works out that time budget.
- **Runnable versions.** The repository's [stabilizer simulator](https://github.com/qiaokan/quantum-algorithms/blob/codex/initial-setup/src/lib/stabilizer.ts) and the `repetitionGraph` decoders reproduce these cases. The numbers in this lesson are recomputed in [ft-checks.py](/examples/ft-checks.py).

## Misunderstandings and prediction checks

<details><summary>"The code keeps three copies of the qubit." Is that right?</summary>

No. $\alpha|000\rangle+\beta|111\rangle$ has two nonzero amplitudes; three copies would have eight. Encoding copies basis labels inside each branch, which a CNOT can do. It does not copy the unknown amplitudes, which nothing can do.

</details>

<details><summary>Predict: what syndrome does a flip on qubit 2 produce, and what does the decoder do?</summary>

$q_0\oplus q_1=0$ and $q_1\oplus q_2=1$, so the syndrome is $(0,1)$. The decoder applies $X_2$ and the state is restored.

</details>

<details><summary>Does measuring the syndrome partially measure the logical qubit?</summary>

No. Every branch of a code state has the same parities, so the ancilla outcome is the same in every branch and carries no information about $\alpha$ or $\beta$. A measurement that varied between branches, such as reading one data qubit, would disturb the state.

</details>

## References

- Peter W. Shor, [Scheme for reducing decoherence in quantum computer memory](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.52.R2493), Phys. Rev. A 52, R2493 (1995). The original quantum error-correction scheme. Verified against the abstract only.
- Daniel Gottesman, [Stabilizer Codes and Quantum Error Correction](https://arxiv.org/abs/quant-ph/9705052), Caltech PhD thesis (1997). Overview of codes built from Pauli parity checks.
- Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428), Rev. Mod. Phys. 87, 307 (2015). Review of codes and decoding for memories.
- Austin G. Fowler, Matteo Mariantoni, John M. Martinis, Andrew N. Cleland, [Surface codes: Towards practical large-scale quantum computation](https://arxiv.org/abs/1208.0928), Phys. Rev. A 86, 032324 (2012). Syndrome extraction with measure qubits.
- Worked numbers: derived locally and checked in `public/examples/ft-checks.py`.
