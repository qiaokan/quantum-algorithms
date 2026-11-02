## Problem and access model

QAOA alternates a problem-dependent phase operation and a mixing operation, then measures candidate solutions. For Max-Cut, a bit $z_j$ assigns vertex $j$ to one of two sides. An edge contributes one when its endpoint bits differ. The desired classical output is a high-scoring bit string, not just an energy estimate. Inputs include the graph, an executable cost circuit, a chosen depth $p$, and a method for selecting $2p$ angles. [Farhi, Goldstone, and Gutmann](https://arxiv.org/html/1411.4028) introduced this alternating construction. Increasing the ansatz's optimal achievable score with depth does not imply a practical optimizer finds those optimal angles.

## Classical baseline and one edge

Use two vertices and one edge. The four strings $00,01,10,11$ have cut values $0,1,1,0$. Enumerating them solves the problem immediately. Random independent bits cut the edge with probability 1/2. Define the cost matrix $C=\operatorname{diag}(0,1,1,0)=(I-Z\otimes Z)/2$ and mixer $B=X\otimes I+I\otimes X$. We maximize cut value; this sign convention matters when choosing angles.

## Prepare and add the problem phase

For $p=1$ prepare $|++\rangle=(1,1,1,1)^T/2$ and apply $e^{-i\gamma C}$. Since C is diagonal, each entry acquires $e^{-i\gamma c_z}$, where $c_z$ is that string's cut value:

$$|\psi_1\rangle=\tfrac12(1,e^{-i\gamma},e^{-i\gamma},1)^T.$$

Choose $\gamma=\pi/2$, so $e^{-i\gamma}=-i$. The vector is $(1,-i,-i,1)^T/2$. Immediate measurement is still uniform: all four amplitudes have magnitude 1/2. Encoding the objective as a phase alone has not improved the cut distribution.

## Mix and calculate all outputs

Because the two X terms act on separate qubits, $e^{-i\beta B}=R\otimes R$, with $R=e^{-i\beta X}=\begin{pmatrix}c&-is\\-is&c\end{pmatrix}$, $c=\cos\beta$, and $s=\sin\beta$. Row 00 of $R\otimes R$ is $(c^2,-ics,-ics,-s^2)$. Multiplying by the phased input yields

$$a_{00}=\tfrac12[c^2+(-ics)(-i)+(-ics)(-i)-s^2]
=\tfrac12(c^2-s^2-2cs).$$

Row 01 is $(-ics,c^2,-s^2,-ics)$, giving

$$a_{01}=\tfrac12[-ics-ic^2+is^2-ics]
=-\tfrac i2(c^2-s^2+2cs).$$

By symmetry $a_{11}=a_{00}$ and $a_{10}=a_{01}$. At $\beta=\pi/8$, $c^2-s^2=\cos(\pi/4)=1/\sqrt2$ and $2cs=\sin(\pi/4)=1/\sqrt2$. Thus the final state is $(0,-i/\sqrt2,-i/\sqrt2,0)^T$. Outcomes 01 and 10 each occur with probability 1/2; both cut the edge. Expected score and success probability are both one. Unlike the phase operation, the mixer made paths with different phases contribute to the same output amplitude.

## Why the cost matrix represents a cut

A computational-basis bit z is an eigenstate of Z with eigenvalue $(-1)^z$: +1 for zero and −1 for one. Therefore $Z\otimes Z$ has eigenvalue +1 on 00 and 11, and −1 on 01 and 10. The expression $(I-Z\otimes Z)/2$ gives $(1-1)/2=0$ for equal bits and $(1-(-1))/2=1$ for different bits. It is exactly the classical edge score written as a diagonal matrix.

For a graph with edge set E, the full cost is $C=\sum_{(j,k)\in E}(I-Z_jZ_k)/2$, where $Z_j$ means apply Z to qubit j and identity to the others. A sampled bit string is scored by the ordinary graph routine. Estimating its mean over shots is distinct from selecting the best observed sample. In the one-edge example every final sample is optimal; on a larger graph a good average does not imply every sample is good.

## What is implemented and what is learned?

The edge phase is a two-qubit ZZ rotation up to global phase; each mixer is a one-qubit X rotation. For a graph, all diagonal edge phases commute, but hardware connectivity and shared qubits still affect scheduling and routing. The depth-$p$ circuit alternates these layers $p$ times. Its sampled cut values provide a noisy objective for a classical optimizer. The exact angle choice above is analytically derived for one edge, not supplied by a simulated optimizer.

**Predict:** Set $\beta=0$ while retaining the cost phase. What happens?

<details><summary>Show the answer</summary>

The mixer is identity, so measurement remains uniform and the edge is cut with probability 1/2. A phase oracle does not directly rank outputs by probability. Setting γ=0 also leaves the initial |++〉 state unchanged up to global phase under the X mixer.

</details>

## Generalization and fair comparisons

For many edges, no single angle pair necessarily makes every edge optimal: their requirements interact. On an odd triangle the maximum cut is two, not three, because three pairwise inequalities cannot hold for two bit values. More layers enlarge the circuit family but raise coherence, training, and sampling costs. Accuracy of an estimated expected cut does not automatically imply a near-optimal sample; use the actual distribution or a justified bound.

The strongest practical baseline includes classical approximation algorithms, local search, branch-and-bound, and problem structure. QAOA is a family with specific provable results and heuristic applications, not a general efficient algorithm for NP-hard optimization. No general practical speedup is established by this example. Its concrete mechanism reuses Grover's lesson: phases become useful only after a mixing operation combines contributions. [Adiabatic algorithms](/lessons/adiabatic-annealing/) provide another route between mixer and objective Hamiltonians, with different runtime assumptions.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Edward Farhi, Jeffrey Goldstone, Sam Gutmann, [A Quantum Approximate Optimization Algorithm](https://arxiv.org/html/1411.4028), definitions of cost/mixer layers and fixed-depth analysis. The one-edge state-vector derivation above is exact and independently calculated.
