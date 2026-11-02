## Problem and access model

A reversible circuit $A$ prepares a state whose good probability $a$ is unknown, but we have a valid lower bound $a\geq a_{\min}>0$. We want a coherent output with failure probability at most a chosen number $\eta$. The checker must support selective phases, and $A^\dagger$ must be available. An underestimated cost for implementing those phases invalidates an end-to-end speedup claim.

Classically, independent repetition takes order $\log(1/\eta)/a_{\min}$ trials. Ordinary [amplitude amplification](/lessons/amplitude-amplification/) has a quadratic query advantage but can overshoot. Fixed-point methods redesign the phase schedule. “Fixed point” does **not** mean every intermediate gate monotonically raises success.

## From sign flips to adjustable phases

A sign flip multiplies an amplitude by $-1=e^{i\pi}$. A general phase uses a unit-length complex number $z=e^{i\phi}=\cos\phi+i\sin\phi$, where $i^2=-1$. It changes no immediate probability because $|z|^2=1$. See [complex numbers](/definitions/complex-numbers/) and [phase](/definitions/phase/).

For a normalized state $|v\rangle$, the matrix

$$S_v(z)=I+(z-1)|v\rangle\langle v|$$

multiplies the component along $|v\rangle$ by $z$ and leaves perpendicular components unchanged. To check this, substitute $|v\rangle$: the output is $|v\rangle+(z-1)|v\rangle=z|v\rangle$. For a perpendicular vector $|w\rangle$, the inner product $\langle v|w\rangle$ is zero, so the added term vanishes. We needed this definition to replace Grover's rigid reflections with adjustable phase rotations.

## An exact two-dimensional fixed-point example

Use coordinates $(|B\rangle,|G\rangle)$ for normalized bad and good components. Let $a=1/2$, so

$$|s\rangle={1\over\sqrt2}\begin{pmatrix}1\\1\end{pmatrix},\qquad
z={1+15i\sqrt3\over26}.$$

This is a valid phase: $(1+675)/26^2=1$. First phase the good component, then phase the component along $|s\rangle$:

$$S_G(z)|s\rangle={1\over\sqrt2}\begin{pmatrix}1\\z\end{pmatrix}.$$

The inner product with $|s\rangle$ is $(1+z)/2$. Therefore

$$
S_s(z)S_G(z)|s\rangle
={1\over\sqrt2}\begin{pmatrix}1\\z\end{pmatrix}
+{(z-1)(1+z)\over2\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}
={1\over2\sqrt2}\begin{pmatrix}1+z^2\\z^2+2z-1\end{pmatrix}.
$$

The equality is algebra, not an extra gate. Since $z$ lies on the unit circle and its real part is $1/26$, $|1+z^2|^2=4(1/26)^2$. Thus failure probability is

$$p_B={|1+z^2|^2\over8}={1\over1352},\qquad p_G={1351\over1352}\approx0.999260.$$

Ordinary Grover leaves $a=1/2$ at success $1/2$ after every integer number of iterations. The adjustable phases genuinely changed the outcome.

**Predict:** is this sequence guaranteed to work equally well if the initial good probability is $10^{-6}$?

<details><summary>Show the answer</summary>

No. The guarantee covers a specified interval of initial probabilities. This length-three construction covers $a\geq0.36$ at failure at most about 0.0606. A much smaller lower bound requires a longer sequence.

</details>

## Where those phases came from

The [Yoder–Low–Chuang construction](https://arxiv.org/html/1409.3305) designs a bounded polynomial in the initial bad amplitude $x=\sqrt{1-a}$. A polynomial is a sum of powers with numerical coefficients. The relevant Chebyshev polynomials start $T_0(x)=1$, $T_1(x)=x$, and obey $T_{k+1}(x)=2xT_k(x)-T_{k-1}(x)$; hence $T_2=2x^2-1$ and $T_3=4x^3-3x$.

For our choice $\gamma=4/5$, define $\delta=1/T_3(1/\gamma)=16/65$. The failure curve is

$$1-P(a)=\delta^2 T_3\!\left({\sqrt{1-a}\over\gamma}\right)^2.$$

On $[-1,1]$, $|T_3|\leq1$ because $T_3(\cos t)=\cos(3t)$. If $a\geq1-\gamma^2=9/25$, then the input to $T_3$ is at most 1, giving failure at most $\delta^2=256/4225\approx0.06059$. At $a=1/2$, substituting into this polynomial reproduces $1/1352$. This is a uniform interval guarantee, not a guarantee of zero error everywhere.

For general odd $L=2\ell+1$, choose $\gamma$ and $\delta$ satisfying $T_L(1/\gamma)=1/\delta$. The length-$L$ construction uses $\ell$ generalized Grover pairs with phases

$$\alpha_j=2\operatorname{arccot}\!\left(\tan(2\pi j/L)\sqrt{1-\gamma^2}\right),\quad
\beta_j=-\alpha_{\ell-j+1}.$$

Here $j=1,\ldots,\ell$, and $\operatorname{arccot}$ chooses an angle whose cotangent is its argument. One pair is $-S_s(e^{-i\alpha_j})S_G(e^{i\beta_j})$. For $L=3$, the two phases are equal to our $z$; the minus sign changes only the global phase. The formula's order matters; arbitrary phase lists do not inherit the guarantee.

## Implementation, limits and the earlier fixed-point method

Implement $S_s(z)$ as $A S_0(z) A^\dagger$. Implement $S_G(z)$ by computing the good flag, phasing it, and uncomputing it. With the paper's bit-oracle convention there are $L-1$ oracle uses, plus state preparations and phase synthesis. Choosing $L=O(a_{\min}^{-1/2}\log(1/\eta))$ gives failure at most $\eta$, up to constant conventions. The phase rotations must be synthesized accurately enough for accumulated error to remain within budget.

The earlier $\pi/3$ recursive scheme reduces failure $\epsilon$ to $\epsilon^3$ at one recursion level, but triples the preparation work. Near tiny initial success it loses the quadratic search scaling. It is therefore incorrect to equate every “fixed-point” algorithm with the optimal construction. Conversely, the optimal bounded-error curve may ripple inside its allowed band; it does not promise monotonic success after each gate or after every separately redesigned sequence.

This is a first concrete example of *polynomial design of amplitudes*. Later quantum signal processing makes that principle systematic. It also contrasts with [BBHT](/lessons/bbht-search/), which uses classical randomization and restarts rather than a single coherent robust sequence.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Theodore J. Yoder, Guang Hao Low and Isaac L. Chuang, [Fixed-point quantum search with an optimal number of queries](https://arxiv.org/html/1409.3305), equations 1, 13–14 and discussion of the $\pi/3$ limit: phase schedule, failure polynomial and query model.
