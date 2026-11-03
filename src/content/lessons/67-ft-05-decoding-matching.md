## Problem and access model

Checks are measured every cycle, and some of the measurements themselves are wrong. From this stream of syndrome bits, choose a correction that most likely returns the logical state to where it started. The decoder sees only check outcomes. It never sees the data qubits or the errors themselves.

The input is the outcomes of every check in every round. The output is a set of Pauli corrections, or equivalently a decision about whether the logical observable has been flipped. This lesson builds the standard method, **minimum-weight perfect matching** on a decoding graph, and works it through by hand.

## Classical baseline

Majority voting on the repetition code ([FT-01](/lessons/ft-01-pauli-errors-repetition-code/)) only works when every check is read perfectly in one round. Real decoders face two complications.

1. **Measurement errors.** A check can report a flip that did not happen.
2. **Many qubits at once.** A surface code has many checks, and no single vote decides anything.

Trying every possible error and keeping the most likely one would be exact but exponential: $2^9$ $X$ errors for the 9 data qubits at distance 3, and $2^{625}$ at distance 25. The decoding graph reduces the search to a problem with polynomial-time algorithms.

## Detection events

A **detection event** marks a change: a check whose outcome differs from its outcome in the previous round, or from its known starting value in the first round. (Google's paper uses "detection events" without a formal definition; this lesson follows the usual meaning.)

Take a distance-3 repetition code with data qubits $q_0,q_1,q_2$ and checks $c_0=q_0\oplus q_1$ and $c_1=q_1\oplus q_2$, measured for three rounds.

**Case A: a data error.** $q_1$ flips between rounds 1 and 2.

| Round | $c_0$ | $c_1$ | Detection events |
|---|---|---|---|
| 1 | 0 | 0 | none |
| 2 | 1 | 1 | $(c_0,2)$ and $(c_1,2)$ |
| 3 | 1 | 1 | none (unchanged) |

**Case B: a measurement error.** $c_0$ is misread in round 2 only.

| Round | $c_0$ | $c_1$ | Detection events |
|---|---|---|---|
| 1 | 0 | 0 | none |
| 2 | 1 | 0 | $(c_0,2)$ |
| 3 | 0 | 0 | $(c_0,3)$ |

A data error produces two detection events in the same round, at neighbouring checks. A measurement error produces two detection events at the same check, in consecutive rounds. Every single fault creates exactly two detection events, unless one of them would fall outside the code, at a boundary.

## The decoding graph

Make each possible detection event a **node**, indexed by (check, round). Make each possible single fault an **edge** joining the two nodes it would light up.

- **Space-like edges** are data errors. They join neighbouring checks in the same round. A data error on an end qubit lights up only one check, so its edge runs to a **boundary node**.
- **Time-like edges** are measurement errors. They join the same check in consecutive rounds.

Any set of faults lights up the nodes touched by an odd number of its edges. Decoding then becomes: given the lit nodes, find a likely set of edges whose endpoints are exactly those nodes, where the boundary may absorb any number of endpoints.

## Edge weights are log-likelihoods

If data errors happen with probability $p$ each, a particular set of $k$ errors among $N$ locations has probability $p^k(1-p)^{N-k}=(1-p)^N\left(\frac p{1-p}\right)^k$. The most likely explanation therefore minimizes the sum of the edge weights

$$w=\ln\frac{1-p}{p}.$$

For data errors with $p=0.01$, $w=\ln 99\approx4.595$. For measurement errors with $q=0.02$, $w=\ln49\approx3.892$.

**Decide Case B by weight.** The nodes $(c_0,2)$ and $(c_0,3)$ have two possible explanations.

1. **One measurement error:** the time-like edge between them, weight $3.892$.
2. **Two data errors on $q_0$**, one in each round, each matched to the boundary: weight $2\times4.595=9.19$.

The decoder picks the measurement error and applies no correction to the data.

<details><summary>Predict: with the same weights, how is Case A explained?</summary>

The two nodes $(c_0,2)$ and $(c_1,2)$ are joined by the single space-like edge for $q_1$, weight $4.595$. Any other explanation needs at least two faults. The decoder applies $X_1$.

</details>

## Minimum-weight perfect matching

Pair up all the lit nodes, allowing any node to pair with the boundary instead, so that the total weight of the shortest paths between pairs is as small as possible. That is **minimum-weight perfect matching**. The correction is the set of edges along the chosen paths.

Strictly, matching finds the most likely *single error* consistent with the lit nodes. The best possible decoder would instead pick the most likely *equivalence class* of errors, summing over all errors that differ by checks (degeneracy, [FT-03](/lessons/ft-03-surface-code/)). It would also account for $Y$ errors lighting both $X$ and $Z$ checks. Matching is therefore an approximation to optimal decoding, and a very good one in practice for the surface code.

[Edmonds (1965)](https://www.cambridge.org/core/journals/canadian-journal-of-mathematics/article/paths-trees-and-flowers/08B492B72322C4130AE800C0610E0E21) gave an efficient algorithm for maximum matching in general graphs. Matching decoders build on that line of algorithms. [Fowler et al. (2012)](https://arxiv.org/abs/1208.0928) decode with "Edmonds' minimum-weight perfect-matching algorithm". [PyMatching](https://arxiv.org/abs/2105.13082) and its [Sparse Blossom](https://arxiv.org/abs/2303.15933) successor are widely used open-source implementations.

The repository's [`decoders.ts`](https://github.com/qiaokan/quantum-algorithms/blob/codex/initial-setup/src/lib/decoders.ts) instead finds the exact optimum by dynamic programming over subsets of lit nodes. That is exponential in the number of lit nodes, which is fine for teaching examples. Its tests confirm that it returns a minimum-weight correction for all 16 syndromes of the distance-3 surface code.

**Worked: distance-5 repetition code, two adjacent errors.** Checks $c_0,\ldots,c_3$ sit between qubits $q_0,\ldots,q_4$, and all weights are equal. Errors hit $q_1$ and $q_2$.

- $q_1$ lights $c_0$ and $c_1$; $q_2$ lights $c_1$ and $c_2$.
- $c_1$ is lit twice, which cancels, so the lit nodes are $c_0$ and $c_2$.

Two matchings are possible.

1. **Pair $c_0$ with $c_2$:** the path runs through $q_1$ and $q_2$, weight 2.
2. **Send both to the boundary:** $c_0$ through $q_0$ (weight 1), and $c_2$ through $q_3,q_4$ (weight 2), for a total of 3.

Matching chooses the pair, corrects $X_1X_2$, and is right. Majority voting would also succeed here, but matching gets the answer from local structure alone, which is what scales to the surface code.

**Worked: where distance 3 runs out.** In [FT-03](/lessons/ft-03-surface-code/), the errors $X_0X_3$ produced a single lit $Z$ check, $Z_3Z_4Z_6Z_7$. Matching connects it to the boundary by the cheapest path, one edge through $q_6$ or $q_7$, and applies $X_6$, say. The result is $X_0X_3X_6=\bar X$, a logical error. That is the correct behaviour for a decoder seeking the most likely error: one fault is more likely than two. The failure is the code's distance, not the decoder.

## Implementation and honest cost

- **Graph size.** A distance-$d$ surface code has $(d^2-1)/2$ checks of each type per round. Decoding $r$ rounds uses a graph with about $r(d^2-1)/2$ nodes for each type: at $d=25$ that is 312 nodes per round, and the graph keeps growing for as long as the computation runs.
- **Ignored correlations.** Decoding $X$ and $Z$ errors separately ignores the fact that a $Y$ error causes both. Google's experiment used a neural-network decoder and an ensemble of correlated matching decoders offline, and a separate real-time decoder at distance 5. At distance 7, the neural network gave $1.43\times10^{-3}$ per cycle and the matching ensemble $1.71\times10^{-3}$. Better decoding is worth real error rate.
- **Weights need calibration.** Weights come from estimated error rates. If those are wrong, the decoder is no longer choosing the most likely explanation.
- **Speed is the hard part.** A decoder that is accurate but slow is useless on hardware, because syndrome data keeps arriving every cycle. Union-find decoding, the next lesson, trades a little accuracy for near-linear time.

## Misunderstandings and prediction checks

<details><summary>"The decoder corrects the qubits every round." Is that right?</summary>

Not necessarily. Many systems keep the correction as a record, the Pauli frame, and adjust later measurement results instead of applying gates. What must happen promptly is the *decision*, whenever a later operation depends on it.

</details>

<details><summary>Predict: in Case B, what if measurement errors were 30 times more likely than data errors?</summary>

The time-like edge would be even cheaper, so the decoder would still blame the measurement. Equal weights do not change the answer either: one edge always beats two.

</details>

<details><summary>Why not wait and decode everything at the end?</summary>

For a pure memory you could. But a computation uses measurement results to choose later operations, especially for non-Clifford gates. The decoder has to keep up with the data as it arrives, which later lessons quantify.

</details>

## References

- Jack Edmonds, [Paths, trees, and flowers](https://www.cambridge.org/core/journals/canadian-journal-of-mathematics/article/paths-trees-and-flowers/08B492B72322C4130AE800C0610E0E21), Canadian Journal of Mathematics 17, 449–467 (1965). Matching in general graphs (verified against the publisher abstract).
- Austin G. Fowler, Matteo Mariantoni, John M. Martinis, Andrew N. Cleland, [Surface codes: Towards practical large-scale quantum computation](https://arxiv.org/abs/1208.0928), Phys. Rev. A 86, 032324 (2012).
- Oscar Higgott, [PyMatching: A Python package for decoding quantum codes with minimum-weight perfect matching](https://arxiv.org/abs/2105.13082), ACM Transactions on Quantum Computing 3(3) (2022).
- Oscar Higgott, Craig Gidney, [Sparse Blossom: correcting a million errors per core second with minimum-weight matching](https://arxiv.org/abs/2303.15933), Quantum 9, 1600 (2025).
- Google Quantum AI and Collaborators, [Quantum error correction below the surface code threshold](https://arxiv.org/abs/2408.13687), Nature 638, 920 (2025). Decoders used and their distance-7 results.
- Worked numbers: `public/examples/ft-checks.py`.
