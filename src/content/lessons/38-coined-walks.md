## Problem and access model

A coined walk is a **primitive**, not automatically a search algorithm. Given a graph, a rule for mixing directions, an initial state, and a step count, produce a sample of the walk's final position. The graph must be supplied as an explicit circuit or a reversible neighbor oracle. We will use a line and three steps, so positions from −3 to 3 suffice. Position labels are integers, not amplitudes. The extra two-state *coin* records whether to move left or right. [Kempe's introductory treatment](https://arxiv.org/abs/quant-ph/0303081) develops this model and its distinction from a classical random walk.

## Classical baseline

A classical walker flips a fresh fair coin each step. After three steps its position probabilities at −3, −1, 1, 3 are respectively 1/8, 3/8, 3/8, 1/8. Different paths add **probabilities**. In a coherent walk, paths ending at the same position **and coin value** add amplitudes before squaring. Positions alone are not enough to decide which paths interfere.

## The operation and its meaning

Write $|x,c\rangle$ for position $x$ and coin bit $c$. For example $|0,1\rangle$ means position zero, coin one. The [Hadamard matrix](/definitions/matrix-multiplication/) mixes the coin:

$$H=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\quad H|0\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},\quad H|1\rangle=\frac{|0\rangle-|1\rangle}{\sqrt2}.$$

The shift $S$ maps $|x,0\rangle$ to $|x-1,0\rangle$ and $|x,1\rangle$ to $|x+1,1\rangle$. A step is $W=S(I\otimes H)$; the rightmost operation happens first. $I$ leaves position unchanged. Both operations are reversible: $H^2=I$, and shifting backward with the same coin undoes $S$. The [tensor product](/definitions/tensor-products/) says apply the coin rule separately at every position.

## Three steps, with every contribution retained

Start at $|0,0\rangle$. Step one gives

$$|\psi_1\rangle=(|-1,0\rangle+|1,1\rangle)/\sqrt2.$$

At step two, the first branch produces $(|-2,0\rangle+|0,1\rangle)/2$; the second produces $(|0,0\rangle-|2,1\rangle)/2$. Therefore

$$|\psi_2\rangle=\tfrac12|-2,0\rangle+\tfrac12|0,1\rangle+\tfrac12|0,0\rangle-\tfrac12|2,1\rangle.$$

The four branches at step three contribute, in that order,

$$\begin{aligned}
&(|-3,0\rangle+|-1,1\rangle)/(2\sqrt2),\\
&(|-1,0\rangle-|1,1\rangle)/(2\sqrt2),\\
&(|-1,0\rangle+|1,1\rangle)/(2\sqrt2),\\
&(-|1,0\rangle+|3,1\rangle)/(2\sqrt2).
\end{aligned}$$

The two contributions to $|1,1\rangle$ cancel: $-1/(2\sqrt2)+1/(2\sqrt2)=0$. Those to $|-1,0\rangle$ reinforce to $1/\sqrt2$. This is addition of numbers, not an additional physical gate. The final nonzero amplitudes are $1/(2\sqrt2)$ at $|-3,0\rangle,|-1,1\rangle,|3,1\rangle$, $1/\sqrt2$ at $|-1,0\rangle$, and $-1/(2\sqrt2)$ at $|1,0\rangle$.

## Measurement and prediction

Square each amplitude and add probabilities over the unobserved coin. Positions −3, −1, 1, 3 have probabilities $1/8,5/8,1/8,1/8$. They sum to one. The negative amplitude at position 1 is not a negative probability. The distribution is asymmetric because the chosen initial coin and Hadamard rule are asymmetric together.

**Predict:** If we measure position and coin after every step, will the cancellation survive?

<details><summary>Show the answer</summary>

No. Recording which branch occurred destroys coherence between those branches. A fresh Hadamard of a measured coin gives two equal probabilities. With the outcomes forgotten, the resulting position distribution is the ordinary three-step random-walk distribution, not the coherent result above.

</details>

## Why the shift needs a retained direction

For a four-position cycle, order the basis as $|0,0\rangle,|0,1\rangle,|1,0\rangle,|1,1\rangle,\ldots,|3,1\rangle$. A shift is a permutation of these eight labels: for example |0,0〉 maps to |3,0〉, while |0,1〉 maps to |1,1〉. Distinct inputs never map to the same complete position-coin label. Therefore the operation is reversible. If we tried to erase the coin and map both “came from left” and “came from right” into the same position label, information would be lost and the map would not be unitary.

For a general vector $\sum_{x,c}a_{x,c}|x,c\rangle$, the shift moves each coefficient to its destination unchanged. It does not create fresh random choices. The Hadamard supplies the two contributions; the shift makes later contributions meet. We needed a coin register precisely to define a reversible movement rule while allowing position probabilities to spread. Return now to the three-step result: cancellation required identical values of both position and coin, so retaining direction explains why some paths interfered and others did not.

## Implementation, generalization, and limits

On a finite cycle of $M$ positions, a binary position register needs $\lceil\log_2 M\rceil$ qubits and modular increment/decrement circuits; invalid encodings require a reversible extension. On a line, allocate enough positions to avoid unintended wraparound. The demonstrated three steps need three coin gates and three conditional shifts. A large explicit state-vector simulation requires storage proportional to the number of position-coin basis states. Quantum hardware does not expose that vector.

Coherent spreading is not a universal guarantee of a computational advantage. A search algorithm must specify marking, starting overlap, stopping time, and a measurement that finds the desired vertex. Measuring too early or choosing a graph with unsuitable spectral structure can lose the benefit. The next lesson implements motion using a Hamiltonian; [MNRS](/lessons/szegedy-mnrs/) adds an actual search objective and an explicit cost accounting.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Julia Kempe, [Quantum random walks — an introductory overview](https://arxiv.org/abs/quant-ph/0303081). Supports the coined-walk model, classical comparison, and distinction between walk dynamics and applications. The numerical three-step example above is derived locally.
