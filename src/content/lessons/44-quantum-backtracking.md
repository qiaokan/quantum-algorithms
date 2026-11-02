## Problem and access model

Backtracking incrementally assigns variables, rejects impossible partial assignments, and explores the remaining children. The input to a quantum backtracking algorithm includes reversible implementations of the predicate deciding *reject/accept/undecided* and the rule choosing the next variable. A tree with $T$ vertices and maximum depth $n$ is the reference object. [Montanaro](https://arxiv.org/abs/1509.02374) proves a bounded-error speedup with $O(\sqrt T\,n^{3/2}\log n)$ predicate tests for finding a solution under the paper's model. This is a speedup of a specified backtracking tree, not a theorem that practical SAT solvers become quadratically faster.

## A tiny classical tree

Find two bits satisfying $x_0\lor x_1=1$ and $x_0=0$. Starting at the empty assignment, branch on $x_0$. The $x_0=1$ node is immediately rejected. The $x_0=0$ node branches on $x_1$; 00 is rejected and 01 accepted. The explored tree contains the root, two depth-one nodes, and two depth-two nodes: five vertices. The answer is 01. A conventional program solves this tiny instance more cheaply than a quantum circuit.

## A local reflection that can be checked numerically

Quantum tree search uses reflections on small neighborhoods, coherently controlled by node descriptions. To see a building block, take a parent $p$ with two children $a,b$. Let $|s\rangle=(|p\rangle+|a\rangle+|b\rangle)/\sqrt3$. The reflection $R=2|s\rangle\langle s|-I$ has matrix

$$R=\frac13\begin{pmatrix}-1&2&2\\2&-1&2\\2&2&-1\end{pmatrix}.$$

It maps $|p\rangle=(1,0,0)^T$ to $(-1,2,2)^T/3$. The position probabilities are $1/9,4/9,4/9$. Apply it again: the first amplitude is $(1+4+4)/9=1$; the second and third are $(-2-2+4)/9=0$. Thus $R^2|p\rangle=|p\rangle$, verifying reversibility on this input. A full check multiplies $R^TR=I$.

Why retain the sign? Replacing the first amplitude by $+1/3$ would preserve immediate probabilities but change the second reflection. The sign carries information for later interference. This is the same distinction first encountered in Deutsch and Grover.

## From local updates to a search algorithm

Separate tree neighborhoods by even and odd depth so their local reflections can be assembled into two larger reflections. Accepted vertices have a special rule. Phase estimation on the resulting walk distinguishes whether an accepting vertex is present, with precision tied to tree size and depth. Finding a witness requires additional controlled searches down the tree; a detection bit is not already a satisfying assignment. The exact root weighting and marked-vertex reflection differ from the simplified local reflection above.

A branch-and-bound optimizer adds an incumbent objective value and a lower-bound test to prune nodes. Applying a backtracking theorem requires specifying the fixed threshold/tree or analyzing adaptive changes; one cannot substitute “branch-and-bound” into a theorem while ignoring how the incumbent modifies the tree. Reversible evaluation of the bounding function may dominate all walk overhead.

## Construct the actual weighted walk on the five-node tree

Order vertices as $r,a,b,c,d$, corresponding to the root, partial assignments $x_0=0$, $x_0=1$, and leaves 00,01. Only d is marked. The preceding equal-weight reflection was a warm-up; the algorithm uses the opposite reflection sign and a weighted root. With depth bound n=2, define

$$|\psi_r\rangle=(|r\rangle+\sqrt2|a\rangle+\sqrt2|b\rangle)/\sqrt5,\qquad |\psi_a\rangle=(|a\rangle+|c\rangle+|d\rangle)/\sqrt3.$$

For an unmarked vertex x, apply $D_x=I-2|\psi_x\rangle\langle\psi_x|$ on x and its children. For a rejected leaf, this is multiplication by −1 on that label. For a marked leaf, use identity. Group even-depth neighborhoods into $R_A$ and odd-depth neighborhoods into $R_B$, with $R_B$ leaving the root unchanged. On our basis,

$$R_A=\begin{pmatrix}
3/5&-2\sqrt2/5&-2\sqrt2/5&0&0\\
-2\sqrt2/5&1/5&-4/5&0&0\\
-2\sqrt2/5&-4/5&1/5&0&0\\
0&0&0&-1&0\\
0&0&0&0&1
\end{pmatrix},\qquad
R_B=\begin{pmatrix}
1&0&0&0&0\\
0&1/3&0&-2/3&-2/3\\
0&0&-1&0&0\\
0&-2/3&0&1/3&-2/3\\
0&-2/3&0&-2/3&1/3
\end{pmatrix}.$$

Both square to identity. One walk step $W=R_BR_A$ sends the initial root to

$$W|r\rangle=\frac35|r\rangle-\frac{2\sqrt2}{15}|a\rangle+\frac{2\sqrt2}{5}|b\rangle+\frac{4\sqrt2}{15}|c\rangle+\frac{4\sqrt2}{15}|d\rangle.$$

For example the d amplitude is the a amplitude from $R_A$, $-2\sqrt2/5$, multiplied by the $R_B$ entry $-2/3$, yielding $4\sqrt2/15$. The probabilities sum to $9/25+8/225+8/25+32/225+32/225=1$. This is a real unitary walk with the acceptance predicate entering only the appropriate local rule.

Each neighborhood reflection is implementable as preparation of its normalized direction, a phase flip on the original local basis state, and inverse preparation. For the root, first rotate from r toward a with amplitudes $1/\sqrt5,2/\sqrt5$, then split a equally between a and b with a two-level 45° rotation. For the a-neighborhood, use amplitudes $1/\sqrt3,\sqrt{2/3}$ then an equal split between c,d. Reversible predicate and child-navigation circuits select the correct neighborhood. Three logical register qubits can hold five labels; extend both matrices by identity on unused labels 5,6,7. Invalid labels are never populated from the valid initial state. An error-corrected implementation would need additional physical qubits; the three-qubit count describes the ideal vertex register alone.

## Why phase zero contains the accepting path

The normalized vector

$$|\phi\rangle=(\sqrt2|r\rangle-|a\rangle+|d\rangle)/2$$

is fixed by both reflections. At the root its inner product with $\psi_r$ is $(\sqrt2-\sqrt2)/(2\sqrt5)=0$; in the a-neighborhood the amplitudes sum to −1/2+0+1/2=0. The rejected leaves outside this path have zero amplitude, and the accepted leaf is not flipped. Consequently $W|\phi\rangle=|\phi\rangle$. Its squared overlap with the starting root is 1/2.

Perform phase estimation on W with six control qubits. Controlled powers $W^1,W^2,\ldots,W^{32}$ require a total of 63 base-W calls if implemented by repetition. Inverse QFT then measurement of the six controls selects phase bin zero with system branch

$$|v_0\rangle=\frac1{64}\sum_{j=0}^{63}W^j|r\rangle.$$

This formula is not a classical shortcut assumed available on hardware; it is the zero-bin amplitude produced by the stated QPE circuit. It preserves the exactly stationary component and suppresses other phases by cancellation. The first four powers in basis $(r,a,b,c,d)$ are

| j | r | a | b | c | d |
|---|---:|---:|---:|---:|---:|
|0|1|0|0|0|0|
|1|0.600000|−0.188562|0.565685|0.377124|0.377124|
|2|0.146667|−0.276557|0.075425|0.175991|0.930238|
|3|0.201778|−0.569038|−0.153364|−0.546410|0.559819|

Continuing the same matrix recurrence gives $v_0\approx(0.506456,-0.343153,0.012197,0.005502,0.354823)^T$. Its squared norm is 0.5003304993, the probability of the zero phase bin. If d is instead unmarked, change only $R_A[d,d]$ from +1 to −1; the corresponding zero-bin probability is 0.0018190816. [The runnable check](/examples/applications.py) constructs both matrices and computes all 64 terms without renormalizing them.

## Finish detection and witness extraction

For this specific five-node comparison, run 300 independent six-bit QPE experiments and report “marked vertex exists” if at least 113 return phase zero. A Hoeffding bound with threshold 3/8 gives false-negative probability at most $e^{-2\cdot300(1/2-3/8)^2}=e^{-9.375}<0.000085$; the no-marked false-positive bound is smaller. These constants were chosen from the explicit toy probabilities, not asserted universal for every tree. The paper supplies precision and repetition rules for the general case.

To obtain the actual answer on this instance, after phase bin zero measure the system label and evaluate the acceptance predicate. The joint probability of obtaining d is $|v_0[d]|^2=0.1258996164$. If a different vertex or a nonzero phase bin occurs, repeat from the root. Sixty-four such attempts fail to find the verified answer with probability below $(7/8)^{64}<0.000195$. Every reported answer is checked, so phase-estimation leakage cannot create a false satisfying assignment. The output d decodes to 01, completing the search.

This simple restart extraction is adequate for the tiny instance, not the strongest general search bound. General witness finding uses subtree searches or path-state methods; very small accepting-vertex weight can make direct restart expensive. Detection and finding therefore remain distinct tasks even though both are now executed in the worked instance.

## Prediction and resource audit

**Predict:** If a better classical branching heuristic reduces $T$ from one million to one hundred, can the quantum analysis keep using the older million-node baseline?

<details><summary>Show the answer</summary>

No. The comparison is against the best relevant classical method, including its pruning and learning. A square-root dependence on an unnecessarily large reference tree does not establish an advantage. Memory, reversible predicate cost, and solution extraction must be compared too.

</details>

The complete five-node construction above includes weighted reflections, finite-precision detection, and verified witness extraction. It is intentionally an exact small-matrix study with explicit calls; no speedup is claimed for five vertices. The general resource theorem has additional size/depth analysis beyond these numerical constants.

## Module connection: search is a reflection design problem

In Grover's four-item search, reflection about the uniform state uses a Hadamard layer, a fixed phase operation, and another Hadamard layer. In a subset walk, that reflection is reconstructed from eigenphases of a transition operator. In tree search, local neighborhoods make graph navigation implementable even when listing the entire tree would already solve the problem. The reusable idea is concrete: find a starting direction, implement a mark-dependent reflection and a useful second reflection, then choose enough coherent steps to make measurement informative. The cost and error of the second reflection change the algorithm.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Ashley Montanaro, [Quantum walk speedup of backtracking algorithms](https://arxiv.org/abs/1509.02374): model, predicate-test bound, and finding-versus-detection scope. Sections 2 and 2.1 verified for the weighted reflections, phase detection, and finding-versus-detection distinction. The five-node arithmetic and explicit finite-precision bounds are independently calculated.
