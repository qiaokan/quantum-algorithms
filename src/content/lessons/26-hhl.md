## Problem and access model

A linear system $Ax=b$ asks for a vector $x$ whose matrix product with $A$ equals a given vector $b$. In **HHL**, the output is instead a quantum state proportional to $A^{-1}b$, or measurements made on that state. It does not print every coordinate. The original algorithm of [Harrow, Hassidim and Lloyd](https://arxiv.org/abs/0811.3171) requires suitable access to a sparse Hermitian matrix, efficient preparation of the input state, controlled simulation, and a bound on conditioning.

A matrix is **sparse** if each row has few nonzero entries relative to its dimension. An oracle returning those entries must be implemented, not merely named. The **condition number** $\kappa$ is the ratio of largest to smallest singular value; for our positive diagonal matrix it is simply the ratio of diagonal entries. Small eigenvalues must be treated cautiously because their reciprocals are large.

## Classical baseline: solve the actual numbers first

Choose

$$A=\begin{pmatrix}1&0\\0&2\end{pmatrix},\qquad b=\frac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}.$$

The equations are $x_0=1/\sqrt2$ and $2x_1=1/\sqrt2$, hence

$$x=\begin{pmatrix}1/\sqrt2\\1/(2\sqrt2)\end{pmatrix},\qquad
\|x\|^2=\frac12+\frac18=\frac58.$$

The quantum target is the normalized vector

$$|x\rangle=\frac{x}{\sqrt{5/8}}=\frac1{\sqrt5}\begin{pmatrix}2\\1\end{pmatrix}.$$

For these two equations, classical division is plainly the right method. For large systems, compare against algorithms appropriate to sparsity, conditioning, available preconditioners, and the same output task—not against a dense solver printing a full vector when the quantum algorithm outputs one statistic.

## The mechanism: label, rescale, erase the label

Matrix inversion multiplies an eigenvector of eigenvalue $\lambda$ by $1/\lambda$. A quantum gate cannot arbitrarily enlarge an amplitude while remaining unitary. HHL embeds the desired rescaling in a larger unitary and conditions on a successful ancilla measurement. The lost norm appears as a failure probability.

We use three registers: a two-qubit energy register $E$, one system qubit $S$, and a one-qubit success flag $F$. Register order is $E,S,F$, with leftmost bits most significant. Initially $E=00$, $F=0$, and $S=|b\rangle=|+\rangle$; a Hadamard prepares $|b\rangle$.

## Step 1: coherent eigenvalue estimation

Use $U=e^{2\pi iA/4}=\operatorname{diag}(i,-1)$. The eigenphases are $1/4$ and $1/2$, exactly representable with two bits. Phase estimation produces

$$\frac1{\sqrt2}\left(|01\rangle_E|0\rangle_S+|10\rangle_E|1\rangle_S\right)|0\rangle_F.$$

Here is the intermediate arithmetic rather than a black-box assertion. For system zero, controlled powers prepare phase amplitudes $(1,i,-1,-i)/2$; the inverse QFT sends them to $01$. For system one, they prepare $(1,-1,1,-1)/2$; the inverse QFT sends them to $10$. Each Fourier output amplitude is one quarter of a sum of four roots of unity. At the matching label all terms equal one; elsewhere they cancel.

We deliberately have **not** measured $E$. Measurement would generally destroy the coherence needed to combine the two scaled components into the solution state.

## Step 2: a controlled reciprocal rotation

Choose scale $C=1$, no larger than either eigenvalue. Conditional on encoded eigenvalue $\lambda$, rotate the flag as

$$|0\rangle_F\longmapsto\sqrt{1-(C/\lambda)^2}|0\rangle_F+(C/\lambda)|1\rangle_F.$$

This is a normalized pair because the squared entries sum to one. A full gate can be written $R_y(\theta)=\begin{pmatrix}\cos(\theta/2)&-\sin(\theta/2)\\\sin(\theta/2)&\cos(\theta/2)\end{pmatrix}$, choosing $\theta=2\arcsin(C/\lambda)$. The inverse sine gives the angle with the requested sine.

For $\lambda=1$, the flag becomes $|1\rangle$. For $\lambda=2$, it becomes $(\sqrt3/2)|0\rangle+(1/2)|1\rangle$. Substitution gives

$$\frac1{\sqrt2}|01\rangle|0\rangle|1\rangle
+\frac{\sqrt3}{2\sqrt2}|10\rangle|1\rangle|0\rangle
+\frac1{2\sqrt2}|10\rangle|1\rangle|1\rangle.$$

The three squared amplitudes are $1/2$, $3/8$, and $1/8$, totaling one. The successful components have been rescaled; the norm has been conserved by the failure component.

## Step 3: uncompute and measure

Apply the inverse of the entire eigenvalue-estimation circuit to $E,S$. It returns the correctly labeled eigenbranches to $E=00$ without undoing the flag rotation. The state becomes

$$|00\rangle_E\left[
\left(\frac1{\sqrt2}|0\rangle_S+\frac1{2\sqrt2}|1\rangle_S\right)|1\rangle_F
+\frac{\sqrt3}{2\sqrt2}|1\rangle_S|0\rangle_F
\right].$$

The probability of flag one is $1/2+1/8=5/8$. Conditional on that success, divide the system vector by $\sqrt{5/8}$ to obtain $(2,1)^T/\sqrt5$, exactly the normalized classical solution. Measuring the successful system gives zero with probability $4/5$ and one with probability $1/5$. The failure probability is $3/8$; failure leaves $|1\rangle$, which is not the solution and must not be silently accepted.

**Predict:** does omitting uncomputation preserve the solution if we just ignore the energy register?

<details><summary>Show the answer</summary>

No. After conditioning on success but before uncomputation, the state is $(2|01\rangle|0\rangle+|10\rangle|1\rangle)/\sqrt5$. Ignoring the orthogonal energy labels gives the mixture $\operatorname{diag}(4/5,1/5)$, not the pure state with density matrix $\frac15\begin{pmatrix}4&2\\2&1\end{pmatrix}$. Both have the same computational-basis probabilities, so that measurement alone misses the error. A Hadamard followed by measurement gives $P(0)=9/10$ for the correct state but $1/2$ for the mixture.

</details>

## How the operations scale

General HHL first estimates eigenvalues, computes an approximation of $C/\lambda$ with reversible arithmetic, applies a controlled rotation, and uncomputes arithmetic and eigenvalue registers. A toy circuit that selects two pre-known rotations illustrates the mechanism; it is not an implementation of general reciprocal arithmetic. Our matrix is known and diagonal, so this example has no asymptotic advantage.

If normalized eigenvalues have magnitude between $1/\kappa$ and one, a safe scale is order $1/\kappa$. Success can be as small as order $1/\kappa^2$; amplitude amplification can improve the repetition dependence but needs coherent access to the whole preparation and its inverse. Negative eigenvalues require retaining the sign in the rotation. Zero eigenvalues require a support promise, a cutoff/pseudoinverse task, or rejection; ordinary inversion is undefined there.

For the original sparse-matrix access model, the standard HHL state-preparation bound has roughly $\widetilde O(s^2\kappa^2\log D/\epsilon)$ dependence, where $D$ is dimension, $s$ bounds nonzero entries per row, $\epsilon$ is state error, and the tilde hides logarithmic factors. Input preparation and oracle costs must be added. Later algorithms improve precision and condition-number dependences. Estimating an observable to additive error $\delta$ from independent bounded measurements still normally needs order $1/\delta^2$ successful preparations; coherent amplitude estimation changes that tradeoff and its access demands.

## Output limitations and practice

The state does not retain the classical solution's norm as readable metadata: normalization removed it. If a downstream calculation needs $\|x\|$, estimate or otherwise recover it separately. Reading all $D$ coordinates costs at least the output size and generally many copies; the logarithmic dimension dependence of state preparation does not survive arbitrary full-vector readout.

For a variation, take $C=1/2$. Both successful amplitudes are halved, so success becomes $5/32$ while the normalized successful state stays $(2,1)^T/\sqrt5$. A smaller safe scale changes success, not the answer. If $b=|1\rangle$, the solution state is $|1\rangle$ even though the classical solution vector is $|1\rangle/2$: this exposes the missing norm directly.

## Connections and module checkpoint

In [Grover](/lessons/grover/), relative signs were changed and then recombined to concentrate probability. Here a flag allows **unequal magnitudes** to be changed without violating unitarity. In [energy estimation](/lessons/energy-estimation/), measuring the eigenvalue was the goal; here measuring it prematurely would be harmful. The next [block-encoding lesson](/lessons/block-encoding/) gives a reusable language for this “desired nonunitary map inside a larger unitary” pattern.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Aram W. Harrow, Avinatan Hassidim, Seth Lloyd, [Quantum algorithm for linear systems of equations](https://arxiv.org/abs/0811.3171), algorithm and appendix on access, conditioning, success, and readout.
- Andrew M. Childs, Robin Kothari, Rolando D. Somma, [Quantum algorithm for systems of linear equations with exponentially improved dependence on precision](https://arxiv.org/abs/1511.02306), for the distinction between original HHL and improved solvers.
- Numerical state, flag probability, and classical-solution cross-check: [the downloadable matrix checks](/examples/matrix-checks.py).
