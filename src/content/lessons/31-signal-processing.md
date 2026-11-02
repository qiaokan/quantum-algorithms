## A programmable one-qubit transformation

**Quantum signal processing**, or QSP, interleaves a signal-dependent unitary with chosen phase rotations. The resulting matrix entries are polynomials of the signal. This is a primitive for designing transformations, not a standalone promise of solving an application. The input is a callable signal unitary and a classically computed list of phases; the output is a unitary whose selected amplitude has a controlled dependence on that signal. The exact polynomial constraints and convention used below follow [Martyn, Rossi, Tan and Chuang](https://arxiv.org/html/2105.02859v5).

We use the signal convention

$$W(x)=\begin{pmatrix}x&i\sqrt{1-x^2}\\i\sqrt{1-x^2}&x\end{pmatrix},\qquad -1\leq x\leq1,$$

and phase rotation $R(\phi)=e^{i\phi Z}=\operatorname{diag}(e^{i\phi},e^{-i\phi})$. The symbol $x$ is a real signal, not a qubit or an input-bit label. A phase $\phi$ is an angle in radians. $W(x)$ is unitary: a column has squared norm $x^2+(1-x^2)=1$, and the two columns have inner product $ix\sqrt{1-x^2}-ix\sqrt{1-x^2}=0$.

## Classical baseline and why this is useful

If $x$ is a known classical number and we only want a polynomial value, calculate it classically. QSP matters when the same circuit must act coherently on many unknown eigenvalue or singular-value components encoded by an oracle. It does not provide a cheap way to load an arbitrary matrix or print every transformed value. The phase list is designed classically; its computation and numerical precision are part of the implementation.

The core intuition is controlled interference. Repeated signal rotations create several contributions to the same amplitude. Phase gates change their relative phases, enabling reinforcement or cancellation with a chosen dependence on $x$.

## Two signal calls with zero phases

Take $x=1/2$, so the off-diagonal entry is $i\sqrt3/2$, and start at $|0\rangle$. One signal call gives $(1/2,i\sqrt3/2)^T$. A second gives

$$W(1/2)^2|0\rangle
=\begin{pmatrix}(1/2)(1/2)+(i\sqrt3/2)(i\sqrt3/2)\\(i\sqrt3/2)(1/2)+(1/2)(i\sqrt3/2)\end{pmatrix}
=\begin{pmatrix}-1/2\\i\sqrt3/2\end{pmatrix}.$$

The two contributions to output zero are $1/4$ and $-3/4$; they cancel partly. The probability of zero is $1/4$, while the amplitude has changed sign. No measurement has happened between the calls.

For symbolic $x$, the same row-by-column calculation gives

$$W(x)^2=\begin{pmatrix}2x^2-1&2ix\sqrt{1-x^2}\\2ix\sqrt{1-x^2}&2x^2-1\end{pmatrix}.$$

The selected amplitude is the polynomial $P(x)=2x^2-1$. Both $x$ and $-x$ give the same value: it is an **even** polynomial. This matches the even number of signal calls.

## Insert one phase and calculate what changes

Now use the sequence $U=R(0)W(x)R(\phi)W(x)R(0)=W(x)R(\phi)W(x)$. The rightmost signal acts first. The middle phase gate multiplies its zero component by $e^{i\phi}$ and its one component by $e^{-i\phi}$. The final zero amplitude is

$$P_\phi(x)=x^2e^{i\phi}-(1-x^2)e^{-i\phi}.$$

At $\phi=0$, this reduces to $2x^2-1$. At $\phi=\pi/2$, $e^{i\phi}=i$ and $e^{-i\phi}=-i$, so

$$P_{\pi/2}(x)=ix^2+i(1-x^2)=i.$$

The output-one amplitude is $ix\sqrt{1-x^2}(i-i)=0$. Thus $W(x)R(\pi/2)W(x)=iZ$ for every $x$. On $|0\rangle$ it returns $i|0\rangle$, outcome zero certainly. The inserted phase has changed a quadratic response into a constant response using the same two signal calls.

**Predict:** can the middle phase gate change the immediate probabilities before the second signal call?

<details><summary>Show the answer</summary>

No. Multiplication by $e^{\pm i\phi}$ has magnitude one. The probabilities change only when the next signal mixes the phase-shifted contributions. This is the same distinction between phase marking and interference that appeared in Deutsch and Grover.

</details>

## What general phase sequences can and cannot do

A degree-$d$ sequence has the form $R(\phi_0)W(x)R(\phi_1)\cdots W(x)R(\phi_d)$, with $d$ signal uses and $d+1$ phase rotations. The product acts right-to-left. Its upper-left entry $P(x)$ has degree at most $d$ and parity matching $d$: only even powers for even $d$, only odd powers for odd $d$. The off-diagonal entry has the form $iQ(x)\sqrt{1-x^2}$.

Unitarity requires

$$|P(x)|^2+(1-x^2)|Q(x)|^2=1.$$

This identity, plus degree and parity constraints, is stronger than merely requesting $|P(x)|\leq1$. In this exact matrix-entry convention, not every bounded polynomial can be inserted arbitrarily. Other readout constructions, extra ancillas, or real-part transformations relax the design problem, but must be specified. The source's QSP theorem states the compatible polynomial conditions and existence of phases.

Zero phases yield $P(x)=T_d(x)$, the Chebyshev polynomial from [qubitization](/lessons/qubitization/). At degree three, $P(x)=4x^3-3x$. More useful filters approximate a reciprocal, a sign, a threshold, or a trigonometric function over a promised domain. Approximation near a singularity such as $1/x$ at zero requires a spectral exclusion interval, not wishful polynomial fitting.

## Implementation and error accounting

Each phase rotation is an ordinary one-qubit diagonal gate. Implementing $W(x)$ comes from the physical signal or from a block-encoded matrix construction; its cost can dominate. A degree-$d$ response requires $d$ signal calls. If each call has operator error at most $\eta$, a simple product bound contributes at most order $d\eta$, in addition to phase-synthesis and polynomial-approximation errors. Allocate tolerances before claiming a final accuracy.

The exact two-call examples above require no numerical phase solver. General high-degree designs require stable phase finding and verification of the achieved polynomial. This lesson does not claim a production phase-synthesis implementation. Its runnable numerical check multiplies the stated matrices and checks the resulting amplitudes and normalization.

## Practice and connections

At $x=0$, one signal call is $iX$, so two calls give $-I$: $P(0)=-1$. At $x=1$, the signal is $I$, so two zero-phase calls give $I$: $P(1)=1$. These boundary cases check $2x^2-1$ without expanding any matrix.

Choose $x=3/5$ and zero phases. The output is $(-7/25,24i/25)^T$; its norm is one. Compare with the real rotation in [qubitization](/lessons/qubitization/): the imaginary off-diagonal entry is a convention change, not a different complexity advantage. [QSVT](/lessons/singular-value-transformation/) applies the same small-plane design to each singular-value component of a matrix.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- John M. Martyn, Zane M. Rossi, Andrew K. Tan, Isaac L. Chuang, [A Grand Unification of Quantum Algorithms](https://arxiv.org/abs/2105.02859), Section II.1 and Appendix A: signal convention, polynomial constraints, and phase sequences.
- Guang Hao Low, Isaac L. Chuang, [Hamiltonian Simulation by Qubitization](https://arxiv.org/abs/1610.06546), signal-processing construction for Hamiltonian functions.
- András Gilyén et al., [Quantum singular value transformation and beyond](https://arxiv.org/abs/1806.01838), generalization to matrix blocks.
