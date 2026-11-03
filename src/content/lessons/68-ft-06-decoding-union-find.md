## Problem and access model

The problem is the same as in [FT-05](/lessons/ft-05-decoding-matching/). The input is a decoding graph and its lit nodes (defects). The output is a set of edges whose endpoints are exactly the defects, with the boundary absorbing any number of endpoints. Each chosen edge is one Pauli correction.

What changes is the requirement. On hardware a new round of [syndromes](/definitions/syndromes/) arrives every microsecond or so, so a decoder is judged on two numbers at once:

- **accuracy:** how often its correction leaves a logical error behind;
- **worst-case running time:** the slowest syndrome sets the pace of the machine.

This lesson builds the **union-find decoder**, which gives up a little accuracy for almost-linear worst-case time, works two examples by hand, and ends with a trade-off table.

## Classical baseline: what matching costs

Minimum-weight perfect matching is the accuracy baseline. Its cost is the problem.

- **Worst case.** [Delfosse and Nickerson (2021)](https://arxiv.org/abs/1709.06218) put the worst-case cost of matching decoders between $O(n^3)$ and $O(n^7)$, depending on the implementation, where $n$ is the number of physical qubits.
- **Typical case.** Modern implementations are far faster on typical inputs. [Sparse Blossom](https://arxiv.org/abs/2303.15933) reports under 1 µs per syndrome round for distance-17 surface-code circuits at 0.1% circuit-level noise, on a single CPU core. That is a measured software throughput on typical noise, not a worst-case bound.
- **Why worst case matters.** Delfosse and Nickerson focus on the worst case because the maximum running time determines the clock of the quantum computer. A decoder that is occasionally slow must be provisioned for the slow case, or it falls behind. The next lesson quantifies falling behind.

A [complexity](/definitions/complexity/) class does not settle the question, but it says where the risk lies: a distance-25 code adds 312 nodes of each type to the graph every round.

## The union-find decoder

Delfosse and Nickerson start from erasures: errors at known locations. If every error lies inside a known region, a linear-time **peeling decoder** finds a valid correction inside it. Union-find grows a region around the defects until a correction inside it must exist, then peels.

The key fact is their Lemma 1: a connected cluster of edges contains a correction for the defects inside it if and only if it holds an **even** number of defects. The paper simulates codes without boundaries, and notes that on a code with boundaries a cluster also becomes valid when it reaches the boundary, which can absorb one defect.

**The algorithm.**

1. **Start.** Each defect is its own cluster. A cluster is **odd**, and active, if it holds an odd number of defects and does not touch the boundary.
2. **Grow.** Every active cluster grows by half an edge in every direction. An edge grown from both ends, or twice from one end, is fully grown.
3. **Merge.** Clusters joined by a fully grown edge become one; their defect counts add.
4. **Stop** when no odd cluster remains.
5. **Peel.** Take a spanning forest of the fully grown edges, rooted at the boundary where present. Working from the leaves inward, when a node is a defect, take the edge to its parent and toggle the parent's defect status.

**Why it is fast.** Merging clusters is the job of the classic union-find data structure. With union by size and path compression, plus a list of each cluster's boundary vertices so that growth never rescans the graph, the decoder's worst case is $O(n\,\alpha(n))$. Here $\alpha$ is the inverse Ackermann function; the authors note $\alpha(n)\le3$ for any $n$ smaller than the number of atoms in the universe.

**What it costs in accuracy.** In the authors' toric-code simulations, union-find reaches thresholds of 9.9% with perfect measurements and 2.6% with faulty ones; they cite 10.3% and 2.9% for matching. Those figures use their **weighted-growth** variant, which grows the cluster with the smallest boundary first. Uniform growth gives 9.2% and 2.4%. They also prove that union-find corrects every error of weight up to $(d-1)/2$, like matching.

## Worked example 1: the distance-5 repetition code

Use the setting from [FT-05](/lessons/ft-05-decoding-matching/). Data qubits $q_0,\ldots,q_4$ sit in a row. Check $c_k$ compares $q_k$ and $q_{k+1}$. The end qubits $q_0$ and $q_4$ also meet the boundary. Every edge has weight 1:

| Edge (qubit) | $q_0$ | $q_1$ | $q_2$ | $q_3$ | $q_4$ |
|---|---|---|---|---|---|
| Joins | $c_0$–B | $c_0$–$c_1$ | $c_1$–$c_2$ | $c_2$–$c_3$ | $c_3$–B |

Errors hit $q_1$ and $q_2$. As before, $c_1$ is lit twice and cancels, so the defects are $c_0$ and $c_2$.

<details><summary>Predict: how many growth rounds does union-find need, and does it return the same correction as matching?</summary>

Two rounds, and yes: $X_1X_2$, the same as matching. The trace follows.

</details>

**Round 1.** Clusters $\{c_0\}$ and $\{c_2\}$ are both odd and grow by half an edge. From $c_0$, edges $q_0$ and $q_1$ reach 0.5; from $c_2$, edges $q_2$ and $q_3$ reach 0.5. Edge $q_4$ stays at 0. Nothing is fully grown, so nothing merges.

**Round 2.** Both clusters are still odd and grow again. Edges $q_0,q_1,q_2,q_3$ reach 1.0 and fuse, giving one cluster $\{B,c_0,c_1,c_2,c_3\}$. It holds 2 defects and touches the boundary, so growth stops.

**Peeling.** The grown edges form a path B –$q_0$– $c_0$ –$q_1$– $c_1$ –$q_2$– $c_2$ –$q_3$– $c_3$, rooted at the boundary. Peel from the far end:

1. $c_3$ is not a defect: skip.
2. $c_2$ is a defect: take $q_2$, clear $c_2$, toggle $c_1$ (now a defect).
3. $c_1$ is a defect: take $q_1$, clear $c_1$, toggle $c_0$ (now clear).
4. $c_0$ is clear: skip, so $q_0$ is never taken.

The correction is $X_1X_2$, weight 2, exactly the matching answer. The grown region also held $q_0$ and $q_3$, but peeling left them out.

## Worked example 2: where union-find and matching differ

On the unweighted repetition code the two decoders agree: a brute-force run of the repository's code found no disagreement on any syndrome at distances 5, 7 or 9. With unequal weights they can differ. At distance 5, over every assignment of weights 1, 2 or 3 and every syndrome (3,645 cases), they pick corrections with opposite logical effect in 103 cases. In every one of those, the two corrections have equal weight, so union-find never returns a heavier correction there. A weight tie means the evidence cannot separate the two classes. To see union-find lose on weight, you need a graph where cluster growth meets defects in the wrong order.

Take the distance-3 surface code of [FT-03](/lessons/ft-03-surface-code/), decoding $X$ errors. Its four $Z$ checks are $A=Z_0Z_3$, $B=Z_1Z_2Z_4Z_5$, $C=Z_3Z_4Z_6Z_7$ and $D=Z_5Z_8$. Qubits $q_0,q_1,q_2,q_6,q_7,q_8$ each meet one check and the boundary. $q_3$ joins $A$–$C$, $q_4$ joins $B$–$C$, and $q_5$ joins $B$–$D$. Let the defects be $A$, $B$ and $C$.

**Matching.** Pair $A$ with the boundary through $q_0$ (weight 1) and $B$ with $C$ through $q_4$ (weight 1). The correction is $X_0X_4$, weight 2.

**Union-find, round 1.** All three defects are odd. Edges $q_3$ ($A$–$C$) and $q_4$ ($B$–$C$) are grown from both ends, $0.5+0.5=1$, and fuse. Edges $q_0,q_1,q_2,q_5,q_6,q_7$ reach 0.5. The merged cluster $\{A,B,C\}$ holds 3 defects: still odd.

**Round 2.** Edges $q_0,q_1,q_2,q_6,q_7$ reach 1 and connect the cluster to the boundary; $q_5$ adds $D$. Growth stops.

**Peeling.** The repository's breadth-first search from the boundary reaches $A$ through $q_0$, $B$ through $q_1$, $C$ through $q_6$, and $D$ through $q_5$. Peeling takes $q_6$ for $C$, $q_1$ for $B$ and $q_0$ for $A$. The correction is $X_0X_1X_6$, weight 3.

**Who is right?** The two corrections differ by $X_1X_4X_6=\bar X\cdot X_0X_1X_3X_4$, a logical $X$ times a check. The errors that produce this syndrome split into two classes, one containing each correction, and exactly one decoder is right for any given error.

- The lightest errors in matching's class are three of weight 2: $X_1X_3$, $X_2X_3$ and $X_0X_4$.
- The lightest in union-find's class are seven of weight 3: $X_0X_1X_6$, $X_0X_2X_6$, $X_3X_4X_6$, $X_0X_1X_7$, $X_0X_2X_7$, $X_3X_4X_7$ and $X_3X_5X_8$.
- At $p=0.01$ per qubit the odds are roughly $3p^2/(7p^3)=3/(7p)\approx43$ to 1. Exact enumeration of all 512 errors gives 42.4.

So matching's choice is about 42 times as likely to be correct. Union-find missed because peeling picks *some* correction inside the grown region, not the lightest one. The syndrome needs at least two errors, beyond what distance 3 guarantees, so both decoders keep their promise. Of the 15 nonzero syndromes of this graph, the decoders disagree on exactly two: $\{A,B,C\}$ and its mirror image $\{B,C,D\}$.

## The repository's implementation

[`unionFindDecoder`](https://github.com/qiaokan/quantum-algorithms/blob/codex/initial-setup/src/lib/decoders.ts) follows the algorithm above, written for clarity rather than speed.

- **Weights and growth.** Edges have integer weights (the repository's graphs use 1). Each round, every active cluster at either end of an edge adds half a unit, so an edge of weight $w$ fuses after $2w$ rounds from one side, or $w$ from both.
- **Uniform growth.** Every odd cluster grows every round, not the weighted-growth variant behind the 9.9% threshold.
- **Data structures and cost.** `find` uses path halving; `union` has no union by size and keeps the boundary as a root. Each round rescans every node and edge, so it does not reach $O(n\,\alpha(n))$.
- **Peeling.** The forest is built by breadth-first search from the boundary first, and nodes are peeled in reverse search order.

[`tests/decoders.test.ts`](https://github.com/qiaokan/quantum-algorithms/blob/codex/initial-setup/tests/decoders.test.ts) checks that both decoders correct every error up to weight 2 on the distance-5 repetition code, 3 at distance 7, 1 on the distance-3 surface code and 2 at distance 5. It also checks that adjacent defects on the distance-7 repetition code fuse in one round.

## Other approaches

- **Sparse Blossom** ([Higgott and Gidney, 2025](https://arxiv.org/abs/2303.15933)) adapts matching to the sparse decoding graph, avoiding all-to-all shortest-path searches. It ships as PyMatching version 2.
- **Correlated matching.** Plain matching decodes $X$ and $Z$ separately, ignoring that a $Y$ error causes both. Google's experiment ([Google Quantum AI, 2025](https://arxiv.org/abs/2408.13687)) decoded offline with an ensemble of correlated matching decoders, reaching $1.71\times10^{-3}$ per cycle at distance 7.
- **Neural networks.** The same experiment's offline neural-network decoder reached $1.43\times10^{-3}$, about $1.71/1.43\approx1.20$ times lower. A review by [Battistel et al. (2023)](https://doi.org/10.1088/2399-1984/aceba6) lists their appeal: constant inference time and the ability to learn the device's actual error model. [Bausch et al. (2024)](https://doi.org/10.1038/s41586-024-08148-8) describe AlphaQubit, a recurrent transformer decoder that beat other leading decoders on Google's Sycamore distance-3 and 5 data and kept its advantage in simulation to distance 11. Its authors state that its throughput is still slower than the 1 µs per round superconducting qubits need.

## The trade-off

Qualitative except where a number is cited above.

| Decoder | Accuracy | Worst-case time | Hardware suitability |
|---|---|---|---|
| Exact matching by subsets (this repository) | Optimal minimum weight | Exponential in defects | Teaching only |
| Matching (blossom family, Sparse Blossom) | Baseline; 10.3% toric-code threshold | Polynomial; $O(n^3)$ to $O(n^7)$ cited | Fast CPU software on typical noise |
| Union-find | Slightly lower; 9.9% | $O(n\,\alpha(n))$ | Simple operations; suits FPGA and ASIC (next lesson) |
| Correlated matching | Better than plain matching | Higher than plain matching (qualitative) | Offline in Google's experiment |
| Neural network | Best reported on Google data | Constant inference time | AlphaQubit slower than 1 µs per round (2024) |

## Implementation and honest cost

- **Small gaps compound.** A lower threshold means operating less far below it, so $\Lambda$ is smaller ([FT-04](/lessons/ft-04-noise-thresholds/)). A weaker decoder can force a larger [code distance](/definitions/code-distance/), and more qubits, for the same target.
- **These thresholds are simulated.** They come from toric codes under simplified noise, not hardware data.
- **Fast enough is a system property.** Data must also get in and results out within the budget, the subject of the next lesson.
- **Weights still matter.** Union-find grows edges in proportion to their weights, so it too needs weights calibrated from measured error rates.

## Misunderstandings and prediction checks

<details><summary>"Union-find is an approximation, so it fails on small errors." Is that right?</summary>

No. Delfosse and Nickerson prove it corrects every error of weight up to $(d-1)/2$, the same guarantee as matching. It loses only on heavier errors, like the weight-2 example on the distance-3 code.

</details>

<details><summary>Predict: in example 1, what if the defects were $c_1$ and $c_2$?</summary>

Edge $q_2$ joins them and is grown from both ends in round 1, so it fuses immediately: one round. The merged cluster is even, growth stops, and peeling takes $q_2$. The correction is $X_2$, the single most likely error.

</details>

<details><summary>Does $O(n\,\alpha(n))$ mean union-find is always faster than matching in practice?</summary>

Not necessarily. Bounds hide constants, and Sparse Blossom is very fast on typical noise. Union-find's case is predictable worst-case time and simple operations that suit dedicated hardware.

</details>

## References

- Nicolas Delfosse, Naomi H. Nickerson, [Almost-linear time decoding algorithm for topological codes](https://arxiv.org/abs/1709.06218), Quantum 5, 595 (2021); arXiv 1709.06218 (2017). Algorithm, Lemma 1, worst-case bounds, thresholds (Table 1), weighted growth.
- Oscar Higgott, Craig Gidney, [Sparse Blossom: correcting a million errors per core second with minimum-weight matching](https://arxiv.org/abs/2303.15933), Quantum 9, 1600 (2025). Under 1 µs per round at distance 17 and 0.1% noise, single core.
- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025). Distance-7 results for neural-network and correlated-matching decoders.
- Francesco Battistel et al., [Real-time decoding for fault-tolerant quantum computing: progress, challenges and outlook](https://doi.org/10.1088/2399-1984/aceba6), Nano Futures 7, 032003 (2023); arXiv 2303.00054. Neural-network decoders: constant inference time, learnable error models.
- Johannes Bausch, Andrew W. Senior, Francisco J. H. Heras et al., [Learning high-accuracy error decoding for quantum processors](https://doi.org/10.1038/s41586-024-08148-8), Nature 635, 834–840 (2024). AlphaQubit: Sycamore distance-3 and 5 data, simulation to distance 11, throughput above the 1 µs target.
- Repository: [`decoders.ts`](https://github.com/qiaokan/quantum-algorithms/blob/codex/initial-setup/src/lib/decoders.ts). The examples are `repetitionGraph(5)` with defects `[0, 2]` and `xErrorGraph(surfaceCode(3))` with defects `[0, 1, 2]`.
