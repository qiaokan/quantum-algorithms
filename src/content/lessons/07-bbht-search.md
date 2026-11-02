## Problem and access model

There are $N$ candidates and $M$ marked candidates, where a coherent checker $f(x)$ returns 1 exactly for marked $x$. We want one marked index. We may know $M$, know only that $M>0$, or need to handle $M=0$ as well. These are different contracts.

A classical randomized search needs order $N/M$ checks when $M>0$. Exhaustive inspection establishes absence with $N$ checks. [Boyer, Brassard, Høyer and Tapp](https://arxiv.org/abs/quant-ph/9605034) show how randomized iteration lengths retain a quantum query advantage without first knowing $M$.

## Start with two marked items among eight

Let the marked indices be 1 and 6. Three Hadamard gates prepare the uniform vector in order $000,001,\ldots,111$:

$$|s\rangle={1\over\sqrt8}(1,1,1,1,1,1,1,1)^T.$$

The oracle flips entries 1 and 6. The new vector is $(1,-1,1,1,1,1,-1,1)^T/\sqrt8$. Every probability remains $1/8$ at this point. The mean amplitude is

$$\mu={1-1+1+1+1+1-1+1\over8\sqrt8}={1\over2\sqrt8}.$$

The diffusion operation replaces each amplitude $v$ by $2\mu-v$. For an unmarked entry that is $1/\sqrt8-1/\sqrt8=0$. For a marked entry it is $1/\sqrt8+1/\sqrt8=2/\sqrt8=1/\sqrt2$. We obtain

$${1\over\sqrt2}(|001\rangle+|110\rangle).$$

Measurement returns each marked candidate with probability $1/2$. A classical verification of the measured candidate confirms success. There are two answers, but one quantum iteration suffices because the *fraction* $M/N=1/4$ matches four-item Grover.

## Why an unknown count changes the algorithm

Write $\sin^2\theta=M/N$. The [amplification calculation](/lessons/amplitude-amplification/) gives success $p_j=\sin^2((2j+1)\theta)$ after $j$ iterations. The subscript $j$ records how many iterations we chose. If instead six of eight candidates are marked, $\theta=\pi/3$ and one iteration gives $\sin^2\pi=0$. A strategy designed for rare solutions can destroy a good initial success probability.

**Predict:** would measuring after every Grover iteration fix this?

<details><summary>Show the answer</summary>

It destroys the coherent rotation used to analyze successive iterations. Restarting and measuring independent trials is useful, but it is a different procedure with a different cost. BBHT explicitly restarts each trial.

</details>

## Randomizing the iteration count

Choose an integer $j$ uniformly from $0,1,\ldots,m-1$, prepare a fresh uniform state, apply $j$ Grover iterations, measure, and verify. Here $m$ is a classical bound on the range of iteration counts, not a number of qubits. The success probability averaged over this random choice is

$$P_m={1\over m}\sum_{j=0}^{m-1}\sin^2((2j+1)\theta).$$

For $M/N=1/4$ and $m=2$, the two possibilities have probabilities $1/4$ and 1, so $P_2=5/8$. For $M/N=3/4$ and $m=2$, they have probabilities $3/4$ and 0, so $P_2=3/8$. Randomization removes the complete failure of the fixed choice $j=1$.

For $0<\theta<\pi/2$, summing the cosine progression gives

$$P_m={1\over2}-{\sin(4m\theta)\over4m\sin(2\theta)}.$$

The useful feature is that the correction shrinks when $m\sin(2\theta)$ grows. We do not need to know the exact maximizing iteration. The endpoints $M=0,N$ should be handled directly rather than dividing by zero in this expression.

## The BBHT schedule and a complete trial trace

Begin with $m=1$. On failure, increase $m$ geometrically, for example multiplying by $6/5$, capped at $\sqrt N$, with integer rounding used when drawing $j$. A small probability of a direct uniform sample also handles abundant solutions cleanly. The rigorous BBHT schedule formalizes this balance.

For our eight-item instance, a possible run is:

1. With $m=1$, $j=0$; a direct measurement gives index 3. Its checker value is 0, so restart.
2. Once the range includes 0 and 1, draw $j=1$.
3. The explicit calculation above produces indices 1 and 6 with probabilities $1/2$ each.
4. Suppose 6 is observed. Evaluate $f(6)=1$ and return 6.

The randomness in steps 1 and 2 is classical. The amplitudes inside step 3 are coherent. The trace is one possible run, not a deterministic claimed result.

## Complexity, implementation and stopping

For $M>0$, the expected query count is $O(\sqrt{N/M})$, including the geometrically growing failed trials. $O(g(N))$ means bounded by a constant times $g(N)$ for sufficiently large inputs; it is not an elapsed-time forecast. Each iteration costs a checker phase plus uniform-state reflection. A checker built by compute–phase–uncompute often contains two calls to its underlying value computation.

When $M=0$, repeating until success never terminates. A finite query budget of order $\sqrt N$ per search attempt, repeated as required by the chosen failure bound, gives a bounded-error “none found” report. That report is not a deterministic certificate of absence. Returned candidates can be verified exactly; an unsuccessful search has one-sided uncertainty.

The capped schedule, timeout and confidence bookkeeping matter when this is called from [minimum finding](/lessons/minimum-finding/). Do not convert expected query cost into a worst-case latency guarantee. The state-vector calculations here are ideal mathematical predictions; no hardware observation is being claimed.

## Connections and counterexamples

This lesson replaces Grover's “one marked item” promise with an explicit solution-count model. [Quantum counting](/lessons/quantum-counting/) estimates $M$ but is unnecessary if the only goal is to find one witness. [Fixed-point amplification](/lessons/fixed-point-amplification/) instead uses a lower bound on the initial good fraction and designs a coherent sequence with a failure guarantee.

A structured sorted list is a counterexample to treating $\sqrt N$ as automatically impressive: classical binary search may use $O(\log N)$ comparisons. BBHT's comparison is unstructured oracle search.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Michel Boyer, Gilles Brassard, Peter Høyer and Alain Tapp, [Tight bounds on quantum searching](https://arxiv.org/abs/quant-ph/9605034), sections on multiple solutions, unknown solution counts and termination: success formula and randomized search schedule.
- Gilles Brassard et al., [Quantum Amplitude Amplification and Estimation](https://arxiv.org/html/quant-ph/0005055), unknown-success amplification: extension beyond uniform preparation.
