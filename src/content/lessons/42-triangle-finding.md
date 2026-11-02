## Problem and access model

Given an undirected unweighted graph on $n$ vertices, return three distinct vertices whose three edges all exist, or report that none do. The adjacency oracle returns a bit $a_{uv}$ for an unordered pair $(u,v)$. A coherent oracle preserves $u,v$ and reversibly writes the bit. Reading an entire adjacency matrix is not one query. [Le Gall's algorithm](https://arxiv.org/abs/1407.0085) exploits graph structure to achieve a $\widetilde O(n^{5/4})$ query upper bound; the tilde suppresses logarithmic factors. This chapter derives the elementary search baseline and identifies the missing ingredients of that stronger construction honestly.

## A complete four-vertex search

Take vertices $0,1,2,3$ and edge set $\{01,02,12,23\}$. The candidate triples in order are $012,013,023,123$. Their edge triples are respectively $(1,1,1),(1,0,0),(1,0,1),(1,0,1)$, so only 012 is a triangle. A classical exhaustive algorithm tests candidates, reusing edges already learned; this tiny graph may be solved in a handful of reads.

Encode the four candidate triples in two qubits and prepare $(1,1,1,1)^T/2$. To phase-mark a triangle, make **three separate adjacency-oracle calls** to store its three edge bits in ancillas. A reversible AND computes whether all three are 1, a phase flip acts when that answer is 1, and reverse the AND and the three edge queries to clear garbage. This elementary implementation costs six adjacency calls, with the inverse calls counted. The marked state is $(-1,1,1,1)^T/2$.

The mean amplitude is $1/4$. Grover diffusion replaces $a$ by $1/2-a$, yielding $(1,0,0,0)^T$. Measuring returns the candidate label 00, which decodes to triangle 012 with certainty. Verify its three edges before reporting it. This is a genuine toy search calculation; it is not an implementation of the $n^{5/4}$ algorithm.

## Build the AND and handle unknown triangle counts

Let the loaded edge bits be $e_1,e_2,e_3$ and clean scratch bits be $r,s$. A Toffoli gate flips its target only when both control bits are one. Apply Toffoli($e_1,e_2;r$), making $r=e_1e_2$. Then apply Toffoli($r,e_3;s$), making $s=e_1e_2e_3$. A Z gate on s multiplies precisely the all-three-edges branch by −1. Reverse the two Toffolis to return r and s to zero, then erase the edge registers by the three inverse queries. The fixed scratch logic is independent of the hidden graph; the adjacency queries are where graph information enters.

For larger n, the number of triangles is usually unknown. If K among M candidate triples are marked, the success after j Grover iterations is $\sin^2((2j+1)\theta)$ with $\sin^2\theta=K/M$. An iteration count tuned to one triangle can overshoot when there are many. The [BBHT search schedule](/lessons/bbht-search/) randomizes the count and verifies candidate outputs, making the unknown-count case an actual algorithm rather than an unspoken promise. This also separates “no candidate found in one run” from a bounded-error report of no triangle.

## Comparison and the nontrivial research mechanism

There are $\binom n3=n(n-1)(n-2)/6$ triples. Applying ordinary unstructured search gives order $n^{3/2}$ adjacency queries, up to constant oracle work per candidate and bounded-error handling. Classical algorithms can use graph structure and fast matrix multiplication; compare their time and data-access model fairly. A quantum query upper bound is not automatically a smaller elapsed runtime than an explicit-input classical algorithm.

The improved quantum method shares work across subsets of vertices, retains queried edges, and uses combinatorial information to restrict candidate witnesses. It is not merely Grover search over triples with a relabeled exponent. Weighted variants can have different lower bounds; do not transfer an unweighted theorem to a weighted triangle objective.

## Predictions and boundary cases

**Predict:** If the graph is complete, is this four-item Grover iteration still appropriate?

<details><summary>Show the answer</summary>

Every candidate is marked, so the phase oracle adds only a global minus sign. Every measured triple is already valid. Search is unnecessary. A routine designed for one marked candidate must not silently reuse its success analysis when the promise changes.

</details>

If no triple is marked, the diffusion preserves the uniform state. A measurement still returns a triple; verification rejects it. Repeated unsuccessful samples alone do not establish an exact impossibility certificate. The bounded-error decision procedure needs a calibrated search schedule and a known candidate count.

## Variant boundary and connections

The completed algorithm here is Grover search over triples, with $O(n^{3/2})$ query scaling. Le Gall's stronger sampled-set construction, nested walks, and parameter choices are a separately identified research extension, not the implementation just calculated. The numerical oracle, uncomputation, and four-vertex output describe the elementary variant fully. [Element distinctness](/lessons/element-distinctness/) demonstrated why retaining data matters; triangle finding makes clear that the retained data and checking routine depend strongly on the combinatorial certificate.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- François Le Gall, [Improved Quantum Algorithm for Triangle Finding via Combinatorial Arguments](https://arxiv.org/abs/1407.0085): unweighted query theorem and distinction from weighted/nonadaptive models. Abstract verified; the full optimized construction is not claimed taught here.
