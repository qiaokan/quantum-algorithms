## Problem and access model

We want $e^{-iHt}|\psi\rangle$ when the Hamiltonian is a linear combination of implementable unitaries. Product formulas approximate evolution by a product of simple evolutions. The **truncated-Taylor algorithm** instead approximates the exponential by a polynomial, implements that polynomial using LCU, and repairs its success amplitude coherently. The algorithm is due to [Berry, Childs, Cleve, Kothari and Somma](https://arxiv.org/abs/1412.4687).

Write $H=\sum_jh_jU_j$, with nonnegative $h_j$ after phases are absorbed, and $\lambda=\sum_jh_j$. The access costs are the PREPARE and SELECT circuits from [block encoding](/lessons/block-encoding/). The output remains a quantum state or its measurements, not the full exponential matrix.

## Classical baseline and a tiny polynomial

Classical numerical libraries also use polynomial or rational approximations for matrix exponentials, with sparse matrix-vector products where appropriate. The quantum construction is useful only if the coherent access and desired output preserve an advantage at scale. Our one-qubit example is classically trivial.

Take $H=X$, time $t=1/2$, and input $|0\rangle$. The exact answer is

$$e^{-iX/2}|0\rangle=\cos(1/2)|0\rangle-i\sin(1/2)|1\rangle.$$

Truncate after degree two. A [polynomial](/definitions/polynomials/) here is a finite weighted sum of powers of a matrix:

$$T_2=I-iHt-H^2t^2/2.$$

More simply, substituting $H=X$ directly gives

$$T_2=I-\frac{i}{2}X-\frac18I=\frac78I-\frac{i}{2}X.$$

The subtraction of $I/8$ comes from $(-i)^2=-1$, $X^2=I$, and $2!=2$. No physical gate was applied when those algebraic terms were combined.

## Implementing this polynomial with LCU

Use two unitaries $V_0=I$ and $V_1=-iX$, positive weights $7/8$ and $1/2$, and coefficient sum $s=11/8$. PREPARE creates

$$\sqrt{7/11}|0\rangle+\sqrt{4/11}|1\rangle.$$

SELECT applies $I$ or $-iX$. Unpreparing the label makes the ancilla-zero block $T_2/s$. On our input it is

$$\frac{T_2|0\rangle}{s}=\frac7{11}|0\rangle-\frac{4i}{11}|1\rangle.$$

Its squared norm, and therefore postselection success, is $(49+16)/121=65/121\approx0.537190$. The normalized successful state is

$$\frac{7|0\rangle-4i|1\rangle}{\sqrt{65}}.$$

Measuring it gives $P(1)=16/65\approx0.246154$, while the exact evolution gives $\sin^2(1/2)\approx0.229849$. This difference is the truncation error; repetition cannot remove it.

The unscaled vector $T_2|0\rangle$ has norm squared $49/64+1/4=65/64>1$. Thus $T_2$ is **not** itself a unitary. The block-encoding construction remains legal because it divides by $s$ and retains failure amplitudes. Quietly renormalizing $T_2$ and calling it exact evolution would hide the approximation.

## Why more Taylor terms help

The exact matrix exponential is the series $\sum_{k=0}^{\infty}(-iHt)^k/k!$. A finite truncation keeps $k\leq K$. If $\|H\|t\leq a$, the norm of the omitted tail is at most

$$\sum_{k=K+1}^{\infty}\frac{a^k}{k!}.$$

Every omitted term is bounded using $\|H^k\|\leq\|H\|^k$. For a small fixed $a$, factorial growth makes the tail decay rapidly. For large total time, divide the evolution into $r$ short segments. Choose a per-segment error small enough that accumulated error is at most the requested $\epsilon$; for unitary targets, a telescoping product bound makes the sum of segment errors a safe budget.

**Predict:** does increasing the number of measurement shots correct the $16/65$ versus $\sin^2(1/2)$ difference?

<details><summary>Show the answer</summary>

No. More shots estimate the implemented circuit's probability more accurately. To approach the target probability, increase truncation order, shorten segments, or use another approximation. Sampling error and approximation error are separate resources.

</details>

## Expanding powers without a giant matrix

If $H=h_0U_0+h_1U_1$, then

$$H^2=h_0^2U_0U_0+h_0h_1U_0U_1+h_1h_0U_1U_0+h_1^2U_1U_1.$$

The order matters: $U_0U_1$ need not equal $U_1U_0$. A Taylor term can be labeled by its degree $k$ and a string of selected unitary indices. SELECT performs that string of unitaries in the required order. PREPARE weights each label using the coefficient product and $t^k/k!$. This structure implements the polynomial without writing all entries of $H^k$.

Generic storage of every expanded term would be wasteful; the paper's structured preparation uses the degree and individual labels. In our $H=X$ example, powers collapse to $I$ or $X$, a simplification not available for arbitrary noncommuting sums.

## From postselection to a coherent simulation algorithm

The short-segment LCU coefficient sum approaches $e^{\lambda t/r}$. Choosing a segment near $\lambda t/r=\log2$ makes that sum near two. The log is the inverse of the exponential: $e^{\log2}=2$. This allows [oblivious amplitude amplification](/lessons/oblivious-amplification/) to promote the approximate unitary block to near-certain success. Its robust form is essential because a truncated polynomial is only approximately unitary.

Our explicit two-term demonstration used $s=11/8$, so blindly applying the scale-two amplification sequence would **not** produce the advertised exact segment. It is an honest LCU demonstration of a Taylor approximation. A full simulation must choose/pad normalization and segment length according to the amplification construction and propagate its errors.

For bounded segment size, the required degree scales roughly as $\log(r/\epsilon)/\log\log(r/\epsilon)$ in the asymptotic regime. The number of selected elementary unitaries is proportional to degree times segment count, before PREPARE, SELECT, control, synthesis, and physical error-correction overhead. The logarithmic precision behavior is a property of this approximation/access model, not a constant-time route to arbitrary accuracy.

## A significant extension: interaction-picture simulation

When $H=A+B$ and evolution under a large $A$ is cheap, [Low and Wiebe's interaction-picture algorithm](https://arxiv.org/abs/1805.00675) avoids treating its magnitude as if all of $H$ were expensive. It transforms the remaining term to $B_I(t)=e^{iAt}Be^{-iAt}$ and simulates this time-dependent interaction. For $A=\omega Z$ and $B=gX$, direct multiplication gives $B_I(t)=g\begin{pmatrix}0&e^{2i\omega t}\\e^{-2i\omega t}&0\end{pmatrix}$. Its entries oscillate, but its norm remains $|g|$. Reconstruct physical evolution by multiplying by $e^{-iAt}$ afterward. This is a substantial access-sensitive extension, not a promise that time dependence is free.

## Practice and connections

At degree zero, the approximation is $I$: $P(1)=0$, so all motion is missed. At degree one, it is $I-iX/2$, whose normalized output has $P(1)=1/5$. Degree two produces $16/65$; approximations need not approach every individual probability monotonically.

The lesson combines [LCU](/lessons/block-encoding/) and [oblivious amplification](/lessons/oblivious-amplification/). [Qubitization](/lessons/qubitization/) next organizes Hamiltonian access into a reusable two-dimensional rotation, preparing for more general polynomial design.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Dominic W. Berry, Andrew M. Childs, Richard Cleve, Robin Kothari, Rolando D. Somma, [Simulating Hamiltonian dynamics with a truncated Taylor series](https://arxiv.org/abs/1412.4687): segmented Taylor/LCU construction and robust amplification.
- Guang Hao Low, Nathan Wiebe, [Hamiltonian Simulation in the Interaction Picture](https://arxiv.org/abs/1805.00675): exploiting a cheaply simulable dominant part and time-dependent interaction.
- The explicit degree-two example is checked in `scripts/check-matrix-examples.py`; it is not labeled a full general Taylor-simulation implementation.
