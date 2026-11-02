## Problem and access model

A quantum simulation algorithm implements the evolution of a specified quantum system. The input is a [Hamiltonian](/definitions/hamiltonians/) $H$, an initial state $|\psi\rangle$, a duration $t$, and a permitted approximation error $\epsilon$. The desired output is the state $e^{-iHt}|\psi\rangle$, or measurements on that state. It is not a printed list of all amplitudes. Here $i^2=-1$, and units are chosen so that the physical constant $\hbar$ equals one.

A Hamiltonian is a matrix equal to its [conjugate transpose](/definitions/conjugate-transpose/). We assume a decomposition $H=H_1+\cdots+H_L$ for which the individual evolutions $e^{-iH_j\tau}$ have efficient circuits. $L$ counts the terms; $\tau$ is a short time. Knowing matrix entries does not automatically provide those circuits. Product formulas turn this term access into approximate evolution under the sum. The role of noncommuting terms in their error is formalized by [Childs, Su, Tran, Wiebe and Zhu](https://arxiv.org/abs/1912.08854).

## Classical baseline and the smallest useful instance

For a $2\times2$ matrix, classical matrix arithmetic is preferable. For $n$ qubits, a generic state has $2^n$ complex entries; storing and updating it can be expensive, although product states, stabilizer states, tensor networks, and other structure can make many instances classically tractable. A quantum simulation advantage requires a family that resists the relevant classical methods and a useful measurement task.

We will simulate one qubit with

$$
H=X+Z=\begin{pmatrix}0&1\\1&0\end{pmatrix}+\begin{pmatrix}1&0\\0&-1\end{pmatrix}
=\begin{pmatrix}1&1\\1&-1\end{pmatrix},\qquad |\psi\rangle=|0\rangle=\begin{pmatrix}1\\0\end{pmatrix}.
$$

The $X$ term exchanges amplitudes; the $Z$ term changes their relative phase. The difficulty is that doing one and then the other is not the same as letting both act simultaneously.

## Detour: what does an exponential of a matrix mean?

For a number $z$, $e^z=1+z+z^2/2!+z^3/3!+\cdots$. A factorial is the product of positive integers up to its argument: $3!=3\cdot2\cdot1=6$. For a matrix, use the same series, with the identity matrix $I$ replacing the number one. Thus $e^{-iX\tau}=I-iX\tau-X^2\tau^2/2!+\cdots$.

Since $X^2=I$, even powers contribute multiples of $I$ and odd powers contribute multiples of $X$. Grouping the series gives

$$e^{-iX\tau}=\cos\tau\,I-i\sin\tau\,X
=\begin{pmatrix}\cos\tau&-i\sin\tau\\-i\sin\tau&\cos\tau\end{pmatrix}.$$

The real numbers $\cos\tau$ and $\sin\tau$ are the horizontal and vertical coordinates of a unit-circle point at angle $\tau$, measured in radians. They obey $\cos^2\tau+\sin^2\tau=1$. See [trigonometry](/definitions/trigonometry/) for a numerical construction, and [matrix functions](/definitions/matrix-functions/) for the series. Likewise $e^{-iZ\tau}=\operatorname{diag}(e^{-i\tau},e^{i\tau})$; “diag” places its entries on the diagonal and zeros elsewhere. We needed this to compute the actual gates. We can now return to evolution under $X+Z$.

## One product-formula step, completely calculated

Choose $t=\pi/4$, one eighth of a full turn. Apply $e^{-iXt}$ first, then $e^{-iZt}$; matrix products act right-to-left. Because $\cos(\pi/4)=\sin(\pi/4)=1/\sqrt2$,

$$
|0\rangle\ \longmapsto\ \frac1{\sqrt2}\begin{pmatrix}1\\-i\end{pmatrix}
\ \longmapsto\ \frac1{\sqrt2}\begin{pmatrix}e^{-i\pi/4}\\-i e^{i\pi/4}\end{pmatrix}
=\begin{pmatrix}(1-i)/2\\(1-i)/2\end{pmatrix}.
$$

For the lower entry, $-i(1+i)/2=(1-i)/2$ because $i^2=-1$. Both measurement probabilities are $|1-i|^2/4=(1^2+(-1)^2)/4=1/2$. The phase gate changed the amplitudes, but not these immediate computational-basis probabilities.

**Predict:** if the two gates are exchanged, do the output probabilities distinguish their order on $|0\rangle$?

<details><summary>Show the answer and the algebra</summary>

Applying $Z$ evolution first gives $e^{-it}|0\rangle$, then $X$ evolution gives $((1-i)/2,(-1-i)/2)^T$. Both probabilities are still $1/2$, but the relative phase differs. The superscript $T$ means that the listed entries form a column. Different states can have identical probabilities in one measurement basis. A subsequent $H$ gate, with matrix $\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$, can distinguish them: the first ordering gives outcome zero certainly, the reversed ordering gives outcomes zero and one equally often.

</details>

## The exact target and a visible error

Calculate $H^2$ row by column:

$$\begin{pmatrix}1&1\\1&-1\end{pmatrix}^2
=\begin{pmatrix}1+1&1-1\\1-1&1+1\end{pmatrix}=2I.$$

Consequently $e^{-iHt}=\cos(\sqrt2t)I-i\sin(\sqrt2t)H/\sqrt2$. Acting on $|0\rangle$ gives

$$\begin{pmatrix}\cos(\sqrt2t)-i\sin(\sqrt2t)/\sqrt2\\-i\sin(\sqrt2t)/\sqrt2\end{pmatrix}.$$

At $t=\pi/4$, the probability of one is $\sin^2(\pi/(2\sqrt2))/2\approx0.401425$, not $0.5$. The total probability is $\cos^2(\sqrt2t)+\sin^2(\sqrt2t)=1$. The approximation error is caused by replacing simultaneous evolution with a large ordered step; it is not a normalization failure.

## Smaller steps and Suzuki's symmetric correction

Divide $t$ into $r$ equal pieces, $\tau=t/r$, and implement

$$U_r=\left(e^{-iZ\tau}e^{-iX\tau}\right)^r.$$

There are $2r$ term evolutions. The first-order expansions of both target and approximation contain $I-i(X+Z)\tau$. At second order the product contains $-ZX\tau^2$, while the exact exponential contains $-(XZ+ZX)\tau^2/2$. Their difference is proportional to $ZX-XZ$. This difference is called a **commutator**. In this example $ZX=\begin{pmatrix}0&1\\-1&0\end{pmatrix}$ and $XZ=-ZX$, so the error does not vanish.

A symmetric step is $e^{-iX\tau/2}e^{-iZ\tau}e^{-iX\tau/2}$. It cancels the leading asymmetric error. Repeating it $r$ times gives second-order Suzuki–Trotter simulation. For fixed bounded terms, first-order total error is generally $O(t^2/r)$ and second-order total error $O(t^3/r^2)$, with constants determined by commutators. Higher-order formulas recursively cancel more terms; they may require negative time intervals. These are asymptotic bounds, not predictions of wall-clock performance. The source paper's sharper bounds depend on Hamiltonian structure.

## Implementation, generalization, and limits

For Pauli terms such as $X$ or $Z$, each exponential is a one-qubit rotation. A many-qubit Pauli product can be diagonalized with local basis changes, its parity computed with controlled-NOT gates, rotated, and uncomputed. A length-$k$ Pauli string therefore needs order $k$ elementary operations, plus rotation-synthesis cost. Arbitrary dense terms are not comparably cheap.

For $L$ terms the first-order formula uses $rL$ exponentials. Choose $r$ from an error bound or independently validated estimate, then budget approximation error, gate synthesis, and physical noise separately. Error correction increases physical resources beyond the logical circuit. Initial-state preparation and repeated measurements remain necessary. The toy has an analytic exact solution; that special feature removes any reason to use quantum hardware here.

## Misunderstandings, practice, and connections

“More qubits” does not by itself make a simulation useful or classically hard. Also, algebraically expanding an exponential is not an extra physical gate: the actual operations are the ordered term evolutions. If two terms commute, first-order splitting is exact. For example $Z$ and $2Z$ give $e^{-iZt}e^{-i2Zt}=e^{-i3Zt}$.

A useful exercise is to replace $X+Z$ by $X+2Z$: multiply the matrix by itself to get $5I$, then derive $P(1)=\sin^2(\sqrt5t)/5$ on $|0\rangle$. The coefficient of $X$ is still one; that is why the numerator is one. This calculation checks both normalization and physical interpretation.

[Phase estimation](/lessons/phase-estimation/) can use the simulated unitary to read energies; [energy estimation](/lessons/energy-estimation/) makes that connection explicit. [qDRIFT](/lessons/qdrift/) changes the way terms are selected. Later [qubitization](/lessons/qubitization/) replaces short-time splitting with a different matrix representation.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Andrew M. Childs, Yuan Su, Minh C. Tran, Nathan Wiebe, Shuchen Zhu, [A Theory of Trotter Error](https://arxiv.org/abs/1912.08854), especially product-formula definitions and first-/second-order commutator bounds. Supports the error discussion, not a claimed hardware speedup.
- The one-qubit example and its numerical values are calculations developed for this lesson. A reproducible calculation is included in `scripts/check-matrix-examples.py`.
