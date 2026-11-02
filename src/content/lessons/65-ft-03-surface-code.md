## Problem and access model

We need a code that catches both bit flips and phase flips. Every parity check should touch at most four qubits, and those qubits should be neighbours on a flat chip. And the distance should grow simply by making the grid bigger. The **surface code** does all three, which is why current superconducting experiments and most resource estimates use it.

The access model is the one from [FT-01](/lessons/ft-01-pauli-errors-repetition-code/). Data qubits hold the encoded state, measure qubits extract parities, and a decoder turns syndromes into corrections. [FT-02](/lessons/ft-02-stabilizers-gottesman-knill/) supplies the language: each parity check is a [stabilizer](/definitions/stabilizers/).

## Classical baseline and earlier codes

The repetition code needs only $d$ qubits for distance $d$, but it protects against one kind of error only. Nesting a bit-flip code inside a phase-flip code protects against both, but its phase checks act on six qubits at once. Large, long-range checks are hard to measure accurately. The surface code gives up some qubit efficiency in exchange for small, local checks: about $2d^2$ physical qubits per logical qubit.

## The distance-3 layout

Lay 9 data qubits on a $3\times3$ grid, numbered row by row:

$$\begin{array}{ccc}0&1&2\\3&4&5\\6&7&8\end{array}$$

Each check sits on a square face between data qubits, or on a half-face at the edge. Faces alternate between $X$-type and $Z$-type like a checkerboard. The top and bottom edges carry weight-2 $X$ checks; the left and right edges carry weight-2 $Z$ checks.

| Type | Interior (weight 4) | Edge (weight 2) |
|---|---|---|
| $X$ | $X_0X_1X_3X_4$, $X_4X_5X_7X_8$ | $X_1X_2$ (top), $X_6X_7$ (bottom) |
| $Z$ | $Z_1Z_2Z_4Z_5$, $Z_3Z_4Z_6Z_7$ | $Z_0Z_3$ (left), $Z_5Z_8$ (right) |

That is 8 checks. Each has its own measure qubit, so the code uses $9+8=17$ physical qubits. In general a distance-$d$ code uses $d^2$ data and $d^2-1$ measure qubits, $2d^2-1$ in total. This rotated arrangement is the 17-qubit "Surface-17" layout analysed by [Tomita and Svore (2014)](https://arxiv.org/abs/1404.3747). It descends from the qubit-saving layouts of [Bombin and Martin-Delgado (2007)](https://arxiv.org/abs/quant-ph/0703272).

**The checks are compatible.** An $X$ check and a $Z$ check commute when they share an even number of qubits. For example, $X_0X_1X_3X_4$ and $Z_1Z_2Z_4Z_5$ share $\{1,4\}$, and $X_1X_2$ and $Z_1Z_2Z_4Z_5$ share $\{1,2\}$. Checking all 16 pairs finds an even overlap every time, so all 8 checks can be measured without disturbing one another. The repository's tests verify this for distances 3, 5 and 7.

**One logical qubit.** There are 9 qubits and 8 independent constraints, which leaves $9-8=1$ encoded qubit. Its operators are

$$\bar X=X_0X_3X_6\ (\text{left column}),\qquad \bar Z=Z_0Z_1Z_2\ (\text{top row}).$$

$\bar X$ overlaps $Z_0Z_3$ in $\{0,3\}$, $Z_3Z_4Z_6Z_7$ in $\{3,6\}$, and the other two $Z$ checks not at all. So it commutes with every check, and the checks cannot see it. $\bar X$ and $\bar Z$ share only qubit 0, so they anticommute, as a logical $X$ and $Z$ must. Any other column of $X$s, or row of $Z$s, is an equally valid logical operator: it differs from these by a product of checks.

## Syndromes, fully worked

A bit flip ($X$ error) changes the outcome of each $Z$ check it touches. Write the $Z$ syndrome in the order $(Z_0Z_3,\allowbreak\ Z_1Z_2Z_4Z_5,\allowbreak\ Z_3Z_4Z_6Z_7,\allowbreak\ Z_5Z_8)$.

- **$X_4$ (centre)** touches the two interior $Z$ checks: syndrome $(0,1,1,0)$. The decoder applies $X_4$.
- **$X_0$** touches only $Z_0Z_3$: syndrome $(1,0,0,0)$.
- **$X_1$ and $X_2$** each touch only $Z_1Z_2Z_4Z_5$, so both give syndrome $(0,1,0,0)$.

The last case is not a flaw. $X_1$ and $X_2$ differ by $X_1X_2$, which is a check, so correcting with either one restores the code state. Codes where different errors are equivalent like this are called *degenerate*. A decoder only has to find the right *equivalence class*, not the exact error.

Phase flips are handled the same way by the $X$ checks. A $Z_4$ error flips $X_0X_1X_3X_4$ and $X_4X_5X_7X_8$.

<details><summary>Predict: the errors $X_0$ and $X_3$ both happen. What does the syndrome look like, and what goes wrong?</summary>

$X_0$ gives $(1,0,0,0)$ and $X_3$ gives $(1,0,1,0)$. Together they give $(0,0,1,0)$, the same syndrome as a single $X_6$ or $X_7$. A decoder that assumes the fewest errors applies $X_6$. The total is $X_0X_3X_6=\bar X$: every check passes and the logical qubit has flipped. Two errors can impersonate one, which is what distance 3 means.

</details>

## Code distance

The [distance](/definitions/code-distance/) is the weight of the smallest error that no check detects but that still changes the logical state. To flip $\bar Z$ without tripping a $Z$ check, an $X$ error must form an unbroken chain from the top edge to the bottom edge. That needs at least one qubit per row. A brute-force search over all $2^9$ $X$ errors confirms that the smallest such error has weight 3. The search is in [ft-checks.py](/examples/ft-checks.py). For distance $d$, both kinds of chain need $d$ qubits, so the code corrects any $(d-1)/2$ errors of each kind.

## Measuring the checks with circuits

Each check uses one measure qubit, reset to $|0\rangle$ before each round.

- **$Z$ check:** a CNOT from each of its data qubits into the measure qubit, then a measurement. As in FT-01, the measure qubit ends up holding the parity.
- **$X$ check:** $H$ on the measure qubit, CNOTs from the measure qubit into each data qubit, $H$ again, then a measurement. The Hadamards turn the $Z$-parity circuit into an $X$-parity circuit.

The repository runs this on its stabilizer simulator with all 17 qubits:

1. **Round 1 from $|0\cdots0\rangle$.** Every $Z$ check reads 0, since the data qubits are all 0. The $X$ checks read random bits: that first measurement projects the data into one eigenstate of each $X$ check.
2. **Round 2 repeats round 1 exactly.** The state is now an eigenstate of all 8 checks.
3. **Inject $X_4$, then measure a third round.** Exactly the two interior $Z$ checks change.

What the decoder uses is that *change* between rounds, a **detection event**, not the raw outcome. [FT-05](/lessons/ft-05-decoding-matching/) builds on this.

## Implementation and honest cost

- **Qubits.** $2d^2-1$ physical qubits per logical qubit: 17 at $d=3$, 49 at $d=5$, 97 at $d=7$. [Google Quantum AI's 2024 experiment](https://arxiv.org/abs/2408.13687) reports a "101-qubit distance-7 code" on a 105-qubit processor. The basic count gives 97, and this lesson does not account for the remaining qubits in their layout.
- **Rounds.** One round of checks is one **cycle**. Google reports 1.1 µs per cycle. A memory runs cycles continuously, and a computation runs them for its entire length.
- **Circuit faults.** Faults inside the check circuits matter. A fault on a measure qubit mid-circuit can spread to two data qubits, so practical layouts choose the CNOT order carefully. This lesson does not cover that ordering.
- **Simple, not efficient.** Only nearest-neighbour coupling is needed, which suits fixed superconducting grids. The price is efficiency: other codes encode more logical qubits per physical qubit when longer-range connections are available, and a later lesson in this module compares hardware on this point.
- **Runnable layout.** The rule used here is in [`surface-code.ts`](https://github.com/qiaokan/quantum-algorithms/blob/codex/initial-setup/src/lib/surface-code.ts), with tests for distances 3, 5 and 7.

## Misunderstandings and prediction checks

<details><summary>"The 8 measure qubits store copies of the data." Is that right?</summary>

No. Each measure qubit is reset every round and reports one parity. The logical information lives in correlations across all 9 data qubits. No single qubit, data or measure, holds it.

</details>

<details><summary>Predict: is $X_2X_5X_8$ (the right column) a valid logical $X$?</summary>

Yes. It overlaps $Z_1Z_2Z_4Z_5$ in $\{2,5\}$, $Z_5Z_8$ in $\{5,8\}$, and the other $Z$ checks not at all, so every check misses it. It overlaps $\bar Z=Z_0Z_1Z_2$ in one qubit. It equals $\bar X$ times the product of the $X$ checks $X_0X_1X_3X_4$, $X_4X_5X_7X_8$, $X_1X_2$ and $X_6X_7$.

</details>

<details><summary>Does a bigger code mean fewer errors happen?</summary>

No. More qubits means *more* physical errors per round. A bigger code helps only when the physical error rate is low enough that adding distance removes more failures than the extra qubits add. That condition is the threshold, the subject of [FT-04](/lessons/ft-04-noise-thresholds/).

</details>

## References

- Eric Dennis, Alexei Kitaev, Andrew Landahl, John Preskill, [Topological quantum memory](https://arxiv.org/abs/quant-ph/0110143), J. Math. Phys. 43, 4452 (2002). Surface-code memory and its threshold analysis.
- Austin G. Fowler, Matteo Mariantoni, John M. Martinis, Andrew N. Cleland, [Surface codes: Towards practical large-scale quantum computation](https://arxiv.org/abs/1208.0928), Phys. Rev. A 86, 032324 (2012).
- Yu Tomita, Krysta M. Svore, [Low-distance surface codes under realistic quantum noise](https://arxiv.org/abs/1404.3747), Phys. Rev. A 90, 062320 (2014). The 17-qubit layout.
- H. Bombin, M. A. Martin-Delgado, [Optimal resources for topological two-dimensional stabilizer codes: Comparative study](https://arxiv.org/abs/quant-ph/0703272), Phys. Rev. A 76, 012305 (2007).
- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025).
