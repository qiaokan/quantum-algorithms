## Problem and access model

Given $N$ items $a_0,\ldots,a_{N-1}$, find two distinct indices with the same value, or report none. The value oracle reversibly writes $a_i$ into a clean register while preserving index $i$. There is no promise that the function is two-to-one. This difference matters: the [collision problem](/lessons/collision-finding/) has a stronger promise and a different complexity. [Ambainis](https://arxiv.org/abs/quant-ph/0311001) gives an $O(N^{2/3})$ bounded-error quantum query algorithm for element distinctness.

## Classical baseline and why subsets help

Reading all items and hashing finds a duplicate in expected linear time under ordinary hashing assumptions; sorting needs $O(N\log N)$ comparisons. In the worst-case oracle problem, even randomized classical algorithms need order $N$ queries for constant success. Grover search over all pairs would examine order $N^2$ candidates and need order $N$ queries, losing the desired improvement.

Instead retain a subset of $r$ queried items. A subset is marked if it already contains an equal pair. Moving to a neighboring subset replaces only one item, so it can cost one new value query while retaining previous work. The workspace is a coherent data structure, not a free classical cache shared among all branches.

## A six-subset worked search

Take $a=(3,8,3,5)$ and $r=2$. The subset basis order is $01,02,03,12,13,23$; these labels mean pairs of indices. Their stored value pairs are $(3,8),(3,3),(3,5),(8,3),(8,5),(3,5)$. Only subset 02 is marked. Preparing an equal superposition yields six amplitudes $1/\sqrt6$. The actual value loading uses two value-oracle calls per branch coherently, not twelve classical evaluations counted as one quantum query.

Compute equality on the stored values, flip the phase of equal branches, and uncompute the equality bit. The amplitudes become $(1,-1,1,1,1,1)/\sqrt6$. Their mean is $4/(6\sqrt6)=2/(3\sqrt6)$. An **exact stationary reflection for this toy subset space** gives $a'_j=2\bar a-a_j$. Thus the marked amplitude is $4/(3\sqrt6)+1/\sqrt6=7/(3\sqrt6)$; each other amplitude is $1/(3\sqrt6)$. The marked probability is $49/54$, and five wrong subsets together have probability $5/54$.

Measure the subset and verify the claimed duplicate classically. A wrong subset is a failed trial, not a false proof of distinctness. If 02 is measured, query or retain $a_0=a_2=3$ and return indices $(0,2)$. This completes the small search. It uses the amplification picture from [MNRS](/lessons/szegedy-mnrs/), but does not implement the full optimized Ambainis walk circuit.

## Implement the small reflection honestly

Label the six subsets by three-qubit integers 0 through 5. Prepare a uniform label by rotating the first qubit to $\sqrt{2/3}|0\rangle+\sqrt{1/3}|1\rangle$, applying H to the second qubit only when the first is zero, then H to the third. Labels 000–011 have amplitudes $\sqrt{2/3}/2=1/\sqrt6$; labels 100–101 have amplitudes $\sqrt{1/3}/\sqrt2=1/\sqrt6$; 110–111 have zero amplitude. A reversible six-entry lookup computes the two indices from the label, and two oracle calls load their values. Call this entire preparation A.

The correct reflection on the **joint label-and-data state** is $A(2|0\cdots0\rangle\langle0\cdots0|-I)A^\dagger$. Its implementation reverses the two value queries and lookup, flips phase on every state except the all-zero state, and re-runs A. This uses four value-oracle calls, not a free diffusion on labels while pretending the stored data is absent. Preparation plus one such reflection uses six value queries. The equality phase check uses the already loaded values. The toy success probability 49/54 remains exactly the calculation above.

This elementary subset-amplification algorithm is complete but does not achieve the optimal asymptotic query bound. Its reflection reloads the data. The optimized walk construction below is precisely what removes that expensive repeated setup.

## Where the exponent comes from

For one duplicate pair, a uniformly random $r$-subset contains both indices with probability $\epsilon=r(r-1)/(N(N-1))$, approximately $r^2/N^2$ when $1\ll r\ll N$. For $N=4,r=2$, it is exactly $2/12=1/6$, matching the example. The subset replacement walk has gap of order $1/r$ in the relevant regime. Setup uses $r$ queries; an update uses order one; checking stored values adds no value queries, although it adds gates. Substituting into the walk bound yields query order

$$r+(N/r)\sqrt r=r+N/\sqrt r.$$

Balance the terms by $r=N/\sqrt r$, giving $r^{3/2}=N$ and $r=N^{2/3}$. This is the mechanism behind the query saving. It is not a claim that loading, sorting, coherent memory access, and physical error correction disappear.

## Predictions, limits, and the next question

**Predict:** If one duplicate is known to be among the first two items, should we run the quantum algorithm?

<details><summary>Show the answer</summary>

No. Two ordinary reads solve that promised instance. The worst-case oracle advantage concerns hidden locations with no such structure. Our small array is chosen to expose the mechanism, not to demonstrate wall-clock advantage.

</details>

More duplicates increase marked mass, but do not justify using a fixed amplification count that may overshoot. Unknown marked mass needs the search variants already studied. The theoretical query bound assumes a coherent implementation of the required subset walk and reflection, including sufficiently small accumulated error.

The worked implementation is the elementary subset-amplification variant, with its true reload cost stated. The stronger Ambainis query theorem is separately attributed; its optimized data-structure circuit is not represented as implemented by the toy. The next chapter asks how much additional structure helps when the certificate is three graph edges rather than an equal pair.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Andris Ambainis, [Quantum walk algorithm for element distinctness](https://arxiv.org/abs/quant-ph/0311001): $O(N^{2/3})$ query theorem and subset-walk construction.
- Magniez, Nayak, Roland, Santha, [Search via Quantum Walk](https://arxiv.org/html/quant-ph/0608026): setup/update/check framework used for the cost explanation.
