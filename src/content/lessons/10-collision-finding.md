## Problem and access model

We are given a function $F$ on $N$ inputs, promised to be exactly two-to-one: every output that appears has exactly two preimages. Find distinct inputs $x,y$ with $F(x)=F(y)$. The input is a coherent function oracle, not an explicit table whose reading cost can be ignored. The two-to-one promise is crucial to the following count of marked items.

A classical randomized birthday search stores about $\sqrt N$ evaluated inputs before seeing a collision with constant probability. This is a stronger comparison than an exhaustive $N$-query scan. [Brassard, Høyer and Tapp](https://arxiv.org/html/quant-ph/9705002) combine a smaller stored sample with quantum search, obtaining $O(N^{1/3})$ function queries and $O(N^{1/3})$ stored entries in the standard model.

## A concrete two-to-one function

Take eight inputs, encoded as three bits, and the table

| $x$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| $F(x)$ | 0 | 1 | 2 | 3 | 0 | 1 | 2 | 3 |

The learner can see the table to check the calculation. The algorithm obtains its entries only through queries. It first queries inputs 0 and 1 and stores pairs $(0,0)$ and $(1,1)$. There is no collision inside this two-entry sample.

Define a new checker $h(x)$: it is 1 if $x$ is outside the sample and its output matches an output in the sample. Here $h(4)=h(5)=1$; all other inputs have $h=0$. Excluding sampled inputs is essential: otherwise the algorithm could return $(0,0)$ as a fake collision.

## The complete quantum search stage

Prepare $|s\rangle=(1,1,1,1,1,1,1,1)^T/\sqrt8$. The checker phase marks positions 4 and 5:

$$S_h|s\rangle={1\over\sqrt8}(1,1,1,1,-1,-1,1,1)^T.$$

The mean amplitude is $4/(8\sqrt8)=1/(2\sqrt8)$. Diffusion maps an unmarked amplitude to $2/(2\sqrt8)-1/\sqrt8=0$ and a marked amplitude to $1/\sqrt8+1/\sqrt8=1/\sqrt2$. Thus

$$Q|s\rangle={|100\rangle+|101\rangle\over\sqrt2}.$$

Measurement gives input 4 or 5 with probability $1/2$ each. If it gives 4, calculate or verify $F(4)=0$, look up stored output 0, and return $(0,4)$. If it gives 5, return $(1,5)$. Both are valid collisions. Probability sums to $1/2+1/2=1$; the measured outcome is one input, not both entries of every collision.

**Predict:** why does choosing two sample inputs help compared with choosing only one?

<details><summary>Show the answer</summary>

Each distinct sampled output has one partner outside the sample. Two distinct outputs therefore create two marked partners. Search needs fewer iterations, at the cost of an extra stored query and a more expensive membership check.

</details>

## The time–space tradeoff

Let $k$ be the number of sample inputs. First detect any internal collision and return it if found. Otherwise their $k$ outputs are distinct; the promise gives exactly $k$ partners outside. A search over all $N$ inputs has marked fraction $k/N$, so it requires order $\sqrt{N/k}$ checker calls. The total function-query expression is

$$k+O(\sqrt{N/k}).$$

Balance the two contributions: $k=\sqrt{N/k}$ implies $k^2=N/k$, then $k^3=N$, hence $k=N^{1/3}$. This algebra chooses a memory–query tradeoff; it is not a gate sequence. For $N=10^6$, the balancing scale is 100 stored entries and roughly 100 search iterations, with constants and verification still to count. It is not “100 physical gates.”

Our $N=8,k=2$ example is unusually clean: the good fraction is exactly $1/4$, so one iteration succeeds. The asymptotic theorem handles arbitrary sizes and success amplification.

## Implementing membership honestly

To phase $h(x)$, compute $F(x)$ into a clean workspace, compare it reversibly against the stored outputs, exclude sample indices, phase the resulting flag, and undo the comparisons and function evaluation. A direct implementation may use two value-oracle calls per clean phase query. Do not hide compute and uncompute inside the phrase “one elementary evaluation.” Constant oracle conventions do not change the exponent, but they matter in an implementation.

The stored sample is classical, yet the comparisons must act coherently on an output register in superposition. A linear scan costs $O(k)$ comparisons per checker call; a coherent memory architecture or specialized circuit can change this gate overhead. The original query advantage therefore does not automatically survive an arbitrary RAM or gate model. Account for value bit width, storage, sorting, reversible lookup and error correction.

If the function is injective, no collision exists and the two-to-one promise fails. If multiplicities vary, the number of outside partners need not be $k$, and unknown-count search plus a changed analysis is needed. Cryptographic hash collision claims require their own domain/range model and resource accounting.

## Module return: what search really supplied

In [Grover](/lessons/grover/), the marked predicate was the original problem. In [minimum finding](/lessons/minimum-finding/), it changed after every classical threshold update. Here it is built from a classical sample. All three use the same amplitude update; their usefulness differs because they construct different sets of marked states and pay different oracle costs.

This is distinct from element distinctness, which must detect even one duplicate in an otherwise arbitrary list and has a different promise and quantum-walk complexity. [Fourier methods](/lessons/qft/) next exploit global periodic structure rather than merely amplifying a marked set.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Gilles Brassard, Peter Høyer and Alain Tapp, [Quantum Algorithm for the Collision Problem](https://arxiv.org/html/quant-ph/9705002), section 2, Theorem 1: sample-plus-search construction and its query/storage tradeoff; section 3: implementation-model issues.
