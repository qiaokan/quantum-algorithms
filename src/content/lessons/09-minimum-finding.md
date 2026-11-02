## Problem and access model

Given an unsorted table $T$ of $N$ values, output an index $y$ with minimum value. Access is a coherent value oracle $|x\rangle|z\rangle\mapsto|x\rangle|z\oplus T[x]\rangle$, where $\oplus$ means bitwise exclusive-or of encoded values. Comparisons must be reversible as well. For ties, a fixed index tie-break makes the order strict, or we may accept any minimizing index.

A classical scan examines all $N$ entries in the worst case; a random unseen position could contain a smaller value. [Dürr and Høyer](https://arxiv.org/abs/quant-ph/9607014) achieve bounded-error minimum finding with $O(\sqrt N)$ value-oracle queries. This is a query result for an unstructured table, not a claim that a quantum computer beats a database's maintained minimum index.

## The idea: search below a moving threshold

Maintain a classical candidate $y$. Search for an $x$ with $T[x]<T[y]$. When a verified better index appears, replace $y$ and repeat. A candidate with rank $r$ has $r-1$ smaller entries, so improvements are cheap when the candidate is bad and become expensive near the optimum. The final no-improvement search must have a finite timeout.

The predicate depends on the current threshold, which is known classical information. It does not require knowing the true minimum in advance.

## Worked table and first threshold

Use $T=(7,2,9,4)$, with basis order $00,01,10,11$. Suppose the random starting index is $y=2$, whose value is 9. The marked positions are 0, 1 and 3. A direct uniform sample has success probability $3/4$; [BBHT](/lessons/bbht-search/) includes this zero-iteration possibility.

Prepare $|s\rangle=(1,1,1,1)^T/2$. With no Grover iteration, measuring yields each index with probability $1/4$. Suppose the result is index 3; compare $T[3]=4<9$, so update the threshold to 4. Had we observed index 2, verification would reject it and the search would restart. These outcomes are possible branches, not guaranteed observations.

## The next threshold, with all amplitudes

Now only index 1, value 2, is better. Start a fresh $|s\rangle$. The threshold oracle flips just that index:

$$S_f|s\rangle={1\over2}(1,-1,1,1)^T.$$

Mean amplitude is $(1-1+1+1)/8=1/4$. Diffusion maps each amplitude $v$ to $2(1/4)-v$. Therefore the three unmarked coordinates become $1/2-1/2=0$, and the marked coordinate becomes $1/2-(-1/2)=1$. The state is $|01\rangle=(0,1,0,0)^T$.

Measurement returns index 1 with certainty in this special four-item step. Classical verification checks $2<4$, and the threshold becomes 2. Another search marks no entries. Its oracle is the identity; diffusion leaves the uniform state unchanged. Every measured candidate fails the comparison. The algorithm returns the current threshold only after its bounded search budget expires.

**Predict:** does observing ten failed comparisons prove that 2 is the minimum for an arbitrary large table?

<details><summary>Show the answer</summary>

No. A single better item might simply not have been found. The algorithm needs a budget justified by its bounded-error analysis. The returned value is a candidate minimum, unlike a search witness whose predicate can directly certify its validity.

</details>

## Why the total cost is a square root

If the threshold has rank $r$ among $1,\ldots,N$, a successful improvement search costs expected order $\sqrt{N/(r-1)}$. By symmetry, the next threshold is uniform among the $r-1$ better items. In the idealized successful-improvement process, rank $r$ is visited with probability $1/r$. The cost contributions have the shape

$$\sum_{r=2}^{N}{1\over r}\sqrt{N\over r-1}.
$$

For large $r$, each term is approximately $\sqrt N/r^{3/2}$. The series $\sum_{r\geq2}r^{-3/2}$ stays bounded: grouping ranks between $2^k$ and $2^{k+1}$ bounds that group's sum by a constant times $2^{-k/2}$. Summing those geometrically shrinking groups gives total $O(\sqrt N)$, not $O(\sqrt N\log N)$ just because several improvements occur.

This argument explains the mechanism; the original paper supplies the explicit stopping budget and constant success guarantee. Repeating independent bounded-budget runs and retaining their best verified value reduces failure probability geometrically. For failure at most $\delta$, the resulting bound is $O(\sqrt N\log(1/\delta))$ queries.

## Building the threshold oracle

Reversibly load $T[x]$ into a value register; compare it against the stored threshold; phase the comparison flag; undo the comparator; unload the value register. The table load and unload are both function-dependent work. The temporary registers return to zero before diffusion. If table access is implemented by a circuit scanning all entries, the query advantage does not imply a runtime advantage. The number of bits in each value also affects comparison cost.

In a classical RAM input model there is no automatic free coherent RAM. In a formula-defined table, compute the formula reversibly instead. Approximate real-valued inputs additionally require enough precision to resolve relevant gaps. If two values are closer than the error tolerance, exact ranking may be ill-defined under that access model.

## Generalization and connections

The four-item step landed exactly on the minimum because its last improving threshold had one marked item among four. Large instances use unknown-count search and probabilistic stopping. This construction powers some optimization subroutines, but it does not exploit structure the way a good classical optimizer might. When branch-and-bound prunes most of a search tree, a square root of the entire naive space is an unfair baseline.

[Collision finding](/lessons/collision-finding/) reuses search with a different predicate: membership in a stored table rather than being below a threshold. Both illustrate that constructing a useful checker is as important as the amplification loop.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Christoph Dürr and Peter Høyer, [A Quantum Algorithm for Finding the Minimum](https://arxiv.org/abs/quant-ph/9607014), algorithm and rank analysis: threshold updates, stopping rule and success amplification. [Author-hosted full text](https://cs.au.dk/~ivan/findmin.pdf).
- Michel Boyer et al., [Tight bounds on quantum searching](https://arxiv.org/abs/quant-ph/9605034): unknown-number search subroutine.
