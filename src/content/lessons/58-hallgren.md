## Problem and access model

The input is a positive nonsquare integer $d$, written in binary. Pell's equation asks for positive integers $x,y$ satisfying

$$x^2-dy^2=1.$$

For our fixed instance, $d=3$, the answer is $x=2,y=1$: $4-3=1$. The interesting problem is to find the *least* positive solution for a large input. Trying $y=1,2,3,\ldots$ is not an efficient general algorithm.

There is an output-size obstruction before there is a quantum algorithm. Some inputs with a short binary representation have a least solution requiring exponentially many output bits. A polynomial-time algorithm cannot print those bits. Hallgren computes a compact description: essentially the logarithm of a fundamental unit, called the **regulator**. For our example it will be

$$R=\ln(2+\sqrt3)\approx1.3169578969248167.$$

Here $\ln u$ is the natural logarithm: the real number $r$ for which $e^r=u$. Its useful property is $\ln(uv)=\ln u+\ln v$. Thus powers of a unit become equally spaced positions on a real number line.

The input supplies ordinary integers, not a magical oracle containing the unknown regulator. We must construct a reversible computation from $d$. That construction is the main content of this lesson. The quantum part then estimates an **irrational period** from a finite, rounded sampling of that computation. The result is a bounded-error compact-output algorithm; it does not imply a proven classical lower bound. [Hallgren, §§1–3](https://www.cse.psu.edu/~sjh26/pell.pdf)

For the detailed construction proved in the sources we follow below, assume additionally that $d$ is **square-free**—no square of an integer greater than $1$ divides it—and that its remainder modulo $4$ is $2$ or $3$. This is an input promise, not an uncharged preprocessing step. Our example $d=3$ satisfies it. Hallgren's full theorem handles arbitrary nonsquare $d$ through the appropriate quadratic order; we distinguish that broader result from the detailed infrastructure derivation taught here.

Use $\mathcal O=\mathbb Z[\sqrt d]=\{a+b\sqrt d:a,b\text{ integers}\}$ and its discriminant $D=4d$. “Ring” here only means that addition, subtraction, and multiplication keep us inside the set. For the promised inputs, this is exactly the ring used in Jozsa's detailed derivation, so its reduction and distance bounds apply directly. Our worked case has $D=12$. The promise avoids quietly importing those bounds into other orders whose details have not been derived here.

## Classical baseline

A much better classical method than exhaustive search uses the continued fraction of $\sqrt d$. Its rational approximations supply candidates $x/y$; test $x^2-dy^2$ directly. For $\sqrt3=[1;1,2,1,2,\ldots]$, the first two approximations are $1$ and $1+1/1=2$. The latter gives $2/1$, and $2^2-3\cdot1^2=1$.

This tiny instance is easy classically. Its purpose is to expose the quantum algorithm's objects, not to establish practical speedup. In general the continued-fraction cycle can be very long relative to $\log d$. More sophisticated classical regulator algorithms are the fair comparison. Hallgren's paper distinguishes unconditional methods from faster methods whose analysis uses the generalized Riemann hypothesis. Its quantum regulator theorem does not require that hypothesis. Neither this historical comparison nor the example is a proof that classical polynomial-time regulator computation is impossible. [Hallgren, introduction and Theorem 2](https://www.cse.psu.edu/~sjh26/pell.pdf)

## Why multiplication creates a hidden period

Write a quadratic number as $u=a+b\sqrt3$. Its **conjugate**, denoted $\bar u$, changes the sign of the square root: $\bar u=a-b\sqrt3$. Multiplying gives its **norm**:

$$u\bar u=(a+b\sqrt3)(a-b\sqrt3)=a^2-3b^2.$$

The cross terms cancel. For $\varepsilon=2+\sqrt3$, the norm is $1$, so its inverse is $2-\sqrt3$, also in $\mathcal O$. An element with its inverse in the ring is a **unit**. Multiplication by a unit permutes the ring: $\varepsilon\mathcal O=\mathcal O$.

Calculate the next power:

$$(2+\sqrt3)^2=4+4\sqrt3+3=7+4\sqrt3,$$

and $7^2-3\cdot4^2=49-48=1$. Repeating multiplication produces further solutions, while taking logarithms produces $R,2R,3R,\ldots$.

The least unit greater than $1$ is called the **fundamental unit**. Its norm can be $-1$. For example, $1+\sqrt2$ has norm $1-2=-1$ and is the fundamental unit of $\mathbb Z[\sqrt2]$. The first positive Pell solution is its square, $3+2\sqrt2$, so the Pell-solution logarithm is twice that ring's regulator. For $d=3$ this complication disappears: $a^2-3b^2=-1$ would imply $a^2\equiv2\pmod3$, impossible since square remainders are $0$ and $1$. Our first unit has norm $+1$.

Why not simply evaluate a function involving $e^t$ and wait for it to repeat? Its exact real values and the enormous unit coefficients would defeat efficient finite computation. We need small integer labels that remember where we are along the multiplicative cycle. Those labels are reduced ideals. [Jozsa, §§2–6](https://arxiv.org/html/quant-ph/0302134)

## The small labels: ideals, with actual arithmetic

An **ideal** in this lesson is a set of quadratic numbers closed under addition, subtraction, and multiplication by any member of $\mathcal O$. We permit fractions in its generators; these are fractional ideals. The notation

$$I=\mathbb Z+\gamma\mathbb Z$$

means all numbers $m+n\gamma$ with integer $m,n$. We store the generators, not every member. A **principal** ideal has the form $\alpha\mathcal O$ for one quadratic number $\alpha$.

Our two labels will be

$$J_0=\mathcal O=\mathbb Z+(1+\sqrt3)\mathbb Z,$$

$$J_1=\mathbb Z+\frac{1+\sqrt3}{2}\mathbb Z.$$

The first equality is just a change of generators: $m+n(1+\sqrt3)=(m+n)+n\sqrt3$. For $J_1$, closure under $\sqrt3$ is visible. If $\gamma=(1+\sqrt3)/2$, then

$$\sqrt3=2\gamma-1,\qquad \sqrt3\gamma=\gamma+1.$$

Thus multiplying either generator $1,\gamma$ by $\sqrt3$ yields an integer combination of the same generators. Addition and integer multiplication then prove closure for every element.

A positive element $\alpha$ of an ideal is a **minimum** if there is no nonzero element $\beta$ of that ideal with both $|\beta|<|\alpha|$ and $|\bar\beta|<|\bar\alpha|$. An ideal is **reduced** when $1$ belongs to it and is such a minimum. This definition prevents the stored generators from drifting to arbitrarily large descriptions. We will use an arithmetic test rather than search all elements.

A reduced ideal in the principal cycle has the compact representation

$$J(a,b)=\mathbb Z+\frac{b+\sqrt D}{2a}\mathbb Z.$$

Here $a$ is a positive integer, $b$ is an integer, $4a$ divides $D-b^2$, and the representative $b$ is chosen in a specified interval. The reduced pairs have $a<\sqrt D$, $0<b<\sqrt D$, and $b+\sqrt D>2a$. For $D=12$ our pairs are $(1,2)$ and $(2,2)$; check $4a\mid8$ and $2+\sqrt{12}>2a$ in each case. Only $O(\log D)$ bits are needed to store such a pair. [Jozsa, §§5–6](https://arxiv.org/html/quant-ph/0302134)

We needed these definitions to replace huge quadratic numbers with small labels. We can now calculate the cycle using only the two integers in a label and logarithms tracked to finite accuracy.

## Reduction: calculate the complete two-ideal cycle

Define $\tau(b,a)$ as the integer congruent to $b$ modulo $2a$ in the interval

$$\sqrt D-2a<\tau(b,a)<\sqrt D\quad(a<\sqrt D).$$

There is exactly one: moving by $2a$ moves through an interval of length $2a$, whose irrational endpoints cannot equal an integer. For intermediate non-reduced ideals with $a>\sqrt D$, use $-a<\tau(b,a)\le a$ instead.

One **reduction step**, denoted $\rho$, is

$$c=\frac{|D-b^2|}{4a},\qquad
\rho(J(a,b))=J(c,\tau(-b,c)).$$

For a reduced input, put $\gamma=(b+\sqrt D)/(2a)$. The step divides the ideal by $\gamma$. We keep a separate, unreduced distance $t$ and update $t\leftarrow t+\ln\gamma$.

This lesson uses the convention $J=\mathcal O/\alpha$ with distance $t=\ln\alpha$. The repeated labels have distances differing by $R$. This is Jozsa's convention. Hallgren's later paper uses a different ideal-distance convention involving a conjugate ratio; individual intermediate distances from the two conventions must not be mixed.

Start at $J_0=J(1,2)$, $t_0=0$. The first step gives

$$\gamma_0=\frac{2+\sqrt{12}}2=1+\sqrt3,$$

$$c=\frac{12-4}{4}=2,\qquad \tau(-2,2)=2.$$

The last equality holds because $2\equiv-2\pmod4$ and $-0.5359<2<3.4641$. Therefore the next label is $J_1=J(2,2)$, at

$$t_1=\ln(1+\sqrt3)\approx1.005052538742381.$$

Check the division itself:

$$\frac1{1+\sqrt3}=\frac{\sqrt3-1}{2}
=\frac{1+\sqrt3}{2}-1.$$

Thus $\mathcal O/(1+\sqrt3)$ has the generators $1$ and $(1+\sqrt3)/2$, as claimed.

The second step gives

$$\gamma_1=\frac{2+\sqrt{12}}4=\frac{1+\sqrt3}{2},$$

$$c=\frac{12-4}{8}=1,\qquad \tau(-2,1)=2.$$

We return to the pair $(1,2)$. The accumulated multiplier is

$$\gamma_0\gamma_1=\frac{(1+\sqrt3)^2}{2}=2+\sqrt3,$$

so the return distance is

$$t_2=t_1+\ln\gamma_1=\ln(2+\sqrt3)=R.$$

The two gaps are approximately $1.00505254$ and $0.31190536$. They are unequal. Consequently the *number of reduction steps* is not the real period. Treating this as an ordinary integer-period problem on the ideal labels would lose the distance information we need.

<details><summary>Predict: when the label returns to $(1,2)$, should the stored distance reset to zero?</summary>

No. The ideal label repeats, but the computation must retain the accumulated distance $R$. Resetting to zero would require knowing the very period being sought. The algorithm can follow the same small labels many times while its unreduced distance continues growing.

</details>

## Constructing the function without already knowing its period

For a real position $x\ge0$, let $I_x$ be the last reduced ideal at or before $x$ on the unreduced distance line, and let $t_x$ be that occurrence's distance. Define

$$h(x)=(I_x,x-t_x).$$

The second output is the remaining gap from the ideal to $x$. For example,

$$h(0.140625)=(J_0,0.140625),$$

$$h(1.453125)=(J_0,1.453125-R)
\approx(J_0,0.136167103075183).$$

Those values are close, not identical. They will become identical after the specified rounding below. The exact function obeys $h(x+R)=h(x)$ because both the label and the remaining gap repeat. It is injective within one period: the ideal identifies an interval, and the gap identifies a point inside that interval.

A slow but honest evaluator starts at $J_0$, applies the pair update, accumulates the logarithms, and stops before passing $x$. It does not require $R$. Our runnable example uses this procedure over its small finite domain. For large inputs that traversal is too slow. Efficient evaluation uses **composition plus reduction**, which makes large jumps while keeping the labels small. This is where the number theory earns its place in the algorithm.

### A worked large-jump operation

Multiplying ideals means taking all integer sums of products of their elements. For our second ideal, $J_1=\mathcal O/(1+\sqrt3)$, squaring gives

$$J_1^2=\frac{\mathcal O}{(1+\sqrt3)^2}
=\frac{\mathcal O}{2(2+\sqrt3)}=\frac12\mathcal O,$$

because $2+\sqrt3$ is a unit. Normalize the rational factor by multiplying the ideal by $2$, and the small label is $J_0$ again. Its tracked distance is

$$2t_1-\ln2=2.010105077484762-0.693147180559945=R.$$

We have computed a jump by multiplying compact descriptions; no enormous power was written out.

Here is the general arithmetic behind that operation. For two reduced pairs $(a_1,b_1)$ and $(a_2,b_2)$, compute

$$k=\gcd\left(a_1,a_2,\frac{b_1+b_2}{2}\right).$$

The extended Euclidean algorithm supplies integers $u,v,w$ such that

$$ua_1+va_2+w(b_1+b_2)/2=k.$$

Then set

$$a_3=\frac{a_1a_2}{k^2},$$

$$b_3=\tau\!\left(
\frac{ua_1b_2+va_2b_1+w(b_1b_2+D)/2}{k},a_3\right).$$

The product is $(1/k)J(a_3,b_3)$. Thus the normalized pair initially has distance $t_1+t_2-\ln k$. Apply reduction to get a reduced pair, updating the distance at every step. The Euclidean coefficients are computational work, not a promise of access to the hidden unit.

For the square above, choose $u=v=0,w=1$. Then $k=2$, $a_3=1$, and the argument to $\tau$ is $(4+12)/4=4$. Since $\tau(4,1)=2$, the normalized label is exactly $(1,2)$.

The general construction adjusts the reduced product by a short sequence of forward or backward reduction steps until it reaches the first cycle ideal at or beyond the desired summed distance. Reduced products may overshoot; the distance correction is tracked, not discarded. Reduced-pair sizes, the correction distance, and the number of local reduction steps are polynomially bounded in $\log D$. Successive squarings make jumps whose distances grow at least geometrically. Build this table until a jump exceeds $x$, combine smaller jumps to approach $x$, then finish with local reduction. The operation count is polynomial in $\log D$, $\log x$, and requested precision. [Jozsa, §7.1 and Theorem 5](https://arxiv.org/html/quant-ph/0302134)

<details><summary>Show the backward step and the evaluator's control flow</summary>

The forward formula alone does not explain “step backward.” For a reduced pair $(a,b)$, compute

$$b_*=\tau(-b,a),\quad a_-=\frac{D-b_*^2}{4a},\quad b_-=\tau(b_*,a_-).$$

The preceding pair is $(a_-,b_-)$. To update its distance, compute that pair's forward multiplier and subtract its logarithm. For $(a,b)=(1,2)$ at distance $R$, $b_*=2$, $a_-=2$, $b_-=2$: the previous label is $J_1$, and subtracting $\ln((1+\sqrt3)/2)$ returns distance $t_1$. The star in $b_*$ is only part of the variable name, not multiplication. [Jozsa, §6.4](https://arxiv.org/html/quant-ph/0302134)

The numerical evaluator follows this control flow; every object in the table stores both an ideal pair and its unreduced distance.

```text
start = unit ideal at distance 0
jump = two forward reductions from start
while jump.distance <= x:
    save jump
    jump = compose, reduce, and adjust(jump, jump)
current = start
for jump in saved jumps from largest to smallest:
    repeatedly try compose, reduce, and adjust(current, jump)
    accept a trial only if its distance stays <= x
finish with forward reductions until the next one would exceed x
return current pair and x - current.distance
```

The largest jumps give reach; the final local steps give the exact interval label. No line takes a remainder modulo the unknown $R$. The supplied Python implementation checks this evaluator against sequential reduction for seven discriminants, and also checks a position near $10^9$ that lies far beyond the enumerated Fourier example.

</details>

The useful distance bounds in this convention are a minimum one-step gap $3/(32D)$, maximum one-step gap $(\ln D)/2$, and a two-step gap greater than $\ln2$. The last bound ensures that correcting a remaining $O(\log D)$ distance takes only $O(\log D)$ steps. A large *distance* need not mean a large stored integer pair.

We now have the needed access model: a specified arithmetic algorithm for evaluating the periodic function. To run it coherently, make its integer arithmetic reversible, copy its finite output, and uncompute intermediate values. Keeping unreversed work registers would reveal which computational path produced a label and destroy the intended interference. [Reversible computation](/definitions/reversible-computation/) and [uncomputation](/definitions/uncomputation/) explain that conversion.

## Sampling a real period with finite registers

A qubit register stores integers, not arbitrary reals. Choose a grid spacing $1/N$, an offset $s$, and a finite input range $0\le m<q$. Evaluate at

$$x=m/N+s,$$

and store the integer label

$$f_{N,s}(m)=\left(a_x,b_x,\left\lfloor N(x-t_x)\right\rfloor\right).$$

The brackets $\lfloor z\rfloor$ mean round down to the greatest integer at most $z$. The final integer records which width-$1/N$ gap interval contains $x$. It is not an approximation of an amplitude.

For the worked run use

$$N=32,\quad s=1/64,\quad q=16384=2^{14}.$$

The true scaled period is $S=NR\approx42.1426527015941$, but the evaluator is not given that value. We know an upper bound $R<2$ because an explicit unit $2+\sqrt3<e^2$ exists. Thus $S<64=M$, and the choice $q=16384$ satisfies $q\ge3M^2$. An upper bound is enough; it does not determine which unit is fundamental.

Our instance's smaller ideal gap is greater than $0.31$, comfortably more than $2/N=0.0625$. For a general input, choose $N$ from the proved lower bound on ideal separation instead; for example $N\ge64D/3$ ensures at least two cells per gap in the distance convention used here. Such an $N$ is large numerically but takes only $O(\log D)$ bits.

Look at output $(a,b,r)=(1,2,4)$. The first preimages and their unrounded scaled residuals are:

| Input $m$ | Position $m/32+1/64$ | $32(x-t_x)$ | Stored label |
|---:|---:|---:|---|
| 4 | 0.140625 | 4.500000000 | $(1,2,4)$ |
| 46 | 1.453125 | 4.357347298 | $(1,2,4)$ |
| 88 | 2.765625 | 4.214694597 | $(1,2,4)$ |
| 130 | 4.078125 | 4.072041895 | $(1,2,4)$ |
| 173 | 5.421875 | 4.929389194 | $(1,2,4)$ |
| 215 | 6.734375 | 4.786736492 | $(1,2,4)$ |
| 257 | 8.046875 | 4.644083790 | $(1,2,4)$ |
| 299 | 9.359375 | 4.501431089 | $(1,2,4)$ |

The gaps are $42,42,42,43,42,42,42,\ldots$. There is no exact integer period $42$. For instance $f(130)=(1,2,4)$ but $f(172)=(1,2,3)$.

Why does a useful regularity survive? A real shift of $R$ becomes a shift of $S$ grid indices. Since $S$ is not an integer, either rounding down or rounding up reaches the cell with the same label. For an offset away from the final cell of an ideal interval,

$$f(m+\lfloor jS\rfloor)=f(m)
\quad\text{or}\quad
f(m+\lceil jS\rceil)=f(m).$$

The choice can change with $j$. This is called **pseudo-periodicity**, also called weak periodicity. The last cell of an interval can disappear when rounding crosses into the next ideal; it is an excluded boundary case, not a proof that every offset works. With at least two cells per ideal interval, a constant fraction of offsets remain usable. [Hallgren, Definitions 3.1–3.2 and §3.2](https://www.cse.psu.edu/~sjh26/pell.pdf)

### Finite precision is part of the oracle specification

Simply asking for enough decimal places to distinguish consecutive ideals is insufficient. A grid point could be arbitrarily close to an ideal boundary or a residual-rounding boundary. Two coherent branches must compute the *same deterministic label* whenever mathematics says their outputs agree. Uncontrolled floating-point rounding can break that property.

The fix is to shift the grid before building the oracle. Choose $s$ randomly in a fine rational grid inside $[0,1/N)$. Here is an explicit finite version. Let $K$ be the number of possible offsets and choose $s=j/(NK)$ uniformly for $j=0,\ldots,K-1$. For one ideal boundary, at most $2N\eta K+2$ choices put a grid point within $\eta$ of it. If there are at most $B$ boundary occurrences in the entire domain, the fraction of bad shifts is at most $B(2N\eta+2/K)$. The added $2$ accounts for rounding the forbidden interval endpoints to discrete offset choices. The same alignment controls the residual rounding: adding an integer number of grid spacings does not change an ideal distance's fractional position relative to the grid.

The two-step distance bound gives $B=O(q/N+1)$. For an allocated bad-shift probability $\beta>0$, choose $\eta=\beta/(4BN)$ and $K\ge4B/\beta$. Then the displayed bound is at most $\beta/2+\beta/2=\beta$. The number of precision bits is then $O(\log q+\log N+\log(1/\text{failure probability}))$, plus arithmetic guard bits. It is polynomial in the input and accuracy lengths. Compute with total error below that margin. A bad offset is a bounded-probability event handled by retries; it is not silently assumed away. This is the role of the random shift in Hallgren's later formulation. [Hallgren, Claim 2.1 and Theorem 1](https://www.cse.psu.edu/~sjh26/pell.pdf)

For our fixed illustrative offset $s=1/64$, the reference calculation checks every boundary occurrence in the finite domain. The smallest distance from such a boundary to the input grid is about $0.0000152329114$. This provides substantial margin for the displayed calculation. The script also recomputes all labels at two decimal precisions. That agreement is a numerical check, not a replacement for the general error argument or an interval-arithmetic proof of a scalable implementation.

## Quantum preparation and the actual Fourier packet

Prepare 14 input qubits in the uniform state, so every $m\in\{0,\ldots,16383\}$ has amplitude $1/128$. Evaluate the finite oracle into a separate register:

$$\frac1{128}\sum_{m=0}^{16383}|m\rangle|0\rangle
\longmapsto
\frac1{128}\sum_{m=0}^{16383}|m\rangle|f_{32,1/64}(m)\rangle.$$

The function-dependent operations are the ideal arithmetic and residual computation. The uniform preparation does not depend on $d$.

Condition on measuring the second register as $(1,2,4)$. There are exactly $p=389$ inputs with that label in this domain. Their indices start as in the table and end at $16229,16271,16313,16355$. Thus the first register becomes

$$|\psi\rangle=\frac1{\sqrt{389}}
\bigl(|4\rangle+|46\rangle+|88\rangle+|130\rangle+|173\rangle+\cdots+|16355\rangle\bigr).$$

This particular function measurement has probability $389/16384\approx0.02374268$. We use it to show one branch transparently; the algorithm accepts other suitable labels too. Measuring the input now would just give an index from this set. The interference has not happened yet.

Apply the positive-exponent [QFT](/lessons/qft/) over $q=16384$. At output index $j$, the amplitude is exactly

$$A(j)=\frac1{\sqrt{389\cdot16384}}
\sum_{m\in P}e^{2\pi i jm/16384},$$

where $P$ is the 389-element preimage set. Each member of $P$ contributes to the *same* output amplitude; then we square the magnitude to get $\Pr(j)=|A(j)|^2$.

For $j=0$, every contribution is $1$, giving

$$A(0)=\sqrt{389/16384},\quad \Pr(0)=389/16384.$$

A zero output carries no useful nonzero frequency. A large probability is not automatically useful information.

For $j=1166$, factor out the common phase from the initial shift $4$. The phase turns of the first eight remaining terms, reduced by integer turns, are

$$0,-0.0109863,-0.0219727,-0.0329590,
0.0272217,0.0162354,0.0052490,-0.0057373.$$

For example $1166\cdot(46-4)/16384=2.989013671875$: almost three whole turns, leaving $-0.010986328125$. These contributions initially point almost the same way. The rounding-induced $43$ gap moves the next term slightly forward instead of destroying the pattern.

Summing **all** 389 terms gives

$$A(1166)\approx0.0904109094+0.0903063602i,$$

$$\Pr(1166)\approx0.0163293712.$$

Some other probabilities, all conditional on the same function label, are:

| $j$ | Probability |
|---:|---:|
| 1 | $0.00000000805$ |
| 388 | $0.0016937740$ |
| 389 | $0.0199891800$ |
| 390 | $0.0006910394$ |
| 1166 | $0.0163293712$ |
| 1167 | $0.0037100493$ |
| 1943 | $0.0004820934$ |
| 1944 | $0.0214935544$ |
| 1945 | $0.0003107814$ |

The peaks occur near integer multiples of

$$q/S\approx388.77476736.$$

The entire probability vector, not just these selected entries, is normalized in the runnable check. These are ideal classical simulation probabilities, not hardware observations.

## Why approximate peaks survive rounding

Write the packet indices as $m_\ell=m_0+\ell S+\delta_\ell$, where $|\delta_\ell|<1$. For our chosen label, $m_\ell=4+\operatorname{round}(\ell S)$, so the error is even bounded by $1/2$.

For an output near a reciprocal-period harmonic, write

$$j=kq/S+\epsilon,\qquad |\epsilon|\le1/2.$$

After removing the global phase from $m_0$, a summand's phase in turns is

$$\frac{j(\ell S+\delta_\ell)}q
=k\ell+\frac{\epsilon\ell S}q
+\frac{k\delta_\ell}S+\frac{\epsilon\delta_\ell}q.$$

The integer $k\ell$ contributes a whole number of turns and therefore disappears from the complex exponential. The first remaining term sweeps an arc of at most about half a turn across the packet. The last two are small when $k/S$, equivalently $j/q$, is small. We therefore retain a substantial coherent sum in a low-frequency range. Arbitrarily high harmonics need not have the same guarantee: rounding errors are multiplied by frequency.

This calculation identifies the mechanism and its failure mode. Hallgren bounds the resulting probability and the chance of obtaining a useful pair of harmonics. With the function's usable-offset fraction bounded below by a constant, the pair succeeds with inverse-polynomial probability in $\log M$; repetition amplifies success. The small example's probabilities are evaluated directly, rather than asserted from an asymptotic bound whose constants need not be useful at this size. [Hallgren, Algorithm 3.1 and Lemma 3.1](https://www.cse.psu.edu/~sjh26/pell.pdf)

## Two measured frequencies reconstruct the regulator

Suppose two independent Fourier runs give $c=1166$ and $d'=1944$. The prime on $d'$ distinguishes this measurement from the Pell input $d=3$. These are possible measured outcomes, not predetermined outputs. Their probabilities before conditioning on a particular function label are approximately $0.01631334$ and $0.02137794$, computed by summing over all labels.

They are near the third and fifth harmonics:

$$1166\approx3q/S,\qquad1944\approx5q/S.$$

The algorithm does not know the integers $3$ and $5$. It discovers them by taking the ratio:

$$\frac c{d'}=\frac{1166}{1944}\approx\frac35.$$

The [continued-fraction algorithm](/definitions/continued-fractions/) uses successive integer divisions. Here

$$1944=1\cdot1166+778,$$
$$1166=1\cdot778+388,$$
$$778=2\cdot388+2,$$
$$388=194\cdot2.$$

Hence $c/d'=[0;1,1,2,194]$, with convergents

$$0/1,\quad1/1,\quad1/2,\quad3/5,\quad583/972.$$

The word “convergent” means one of the rational numbers obtained by stopping that nested fraction early. We test candidates; we do not simply pick the attractive-looking $3/5$ using knowledge of the answer.

For each nonzero convergent numerator $a$, calculate

$$T=\operatorname{round}(aq/c).$$

The distinct candidates here are $14,42,8192$. Test whether $T/N$ lies within $1/N$ of an occurrence of the unit ideal $J_0$. This is an efficient local test: evaluate the nearest ideal at $T/N$, examine a bounded number of neighboring ideals, and compare their tracked distances. It does not call a known $R$.

| Candidate $T$ | Position $T/32$ | Test |
|---:|---:|---|
| 14 | $0.4375$ | No unit ideal within $1/32$ |
| 42 | $1.3125$ | Next unit ideal is about $0.004457897$ away: accept |
| 8192 | $256$ | Nearest unit ideal is about $0.510167997$ away: reject |

The accepted result $T=42$ gives

$$\widehat R=T/N=1.3125,\qquad |\widehat R-R|<1/32.$$

Why do continued fractions find the correct harmonic ratio? If $c=kq/S+\epsilon_k$ and $d'=\ell q/S+\epsilon_\ell$ with both rounding errors at most $1/2$, then

$$\left|\frac c{d'}-\frac k\ell\right|
=\left|\frac{S(\ell\epsilon_k-k\epsilon_\ell)}{\ell^2q+\ell S\epsilon_\ell}\right|.$$

For $k\le\ell\le S$ and $q\ge3S^2$, bounding the numerator and denominator gives an error below $1/(2\ell^2)$. A reduced fraction this close must occur among the continued-fraction convergents. If $k,\ell$ are coprime, their reduced numerator is the actual $k$, so $\operatorname{round}(kq/c)$ is within one of $S$.

There are real failure cases. Zero frequencies cannot form the needed ratio. Outcomes away from peaks can yield rejected candidates. Harmonics with a common divisor can give a wrong candidate. A unit-ideal test can also accept an approximation of a *multiple* of $R$; acceptance alone does not certify the fundamental period. Repeat the procedure and retain the smallest positive verified candidate. The theorem bounds the chance that no genuinely useful run has occurred. For this tiny instance, the minimality of $2+\sqrt3$ can additionally be checked directly. [Hallgren, Algorithm 3.1](https://www.cse.psu.edu/~sjh26/pell.pdf)

## Refine the compact answer and recover the tiny Pell solution

The quantum computation has located the first return closely. High numerical precision can now be obtained classically. Evaluate the ideal just before $1.3125$: it is $J_1$, at distance $t_1\approx1.005052538742381$. Apply one reduction step and retain its logarithmic distance:

$$t_1+\ln\frac{1+\sqrt3}{2}
=\ln(2+\sqrt3)
\approx1.3169578969248167086250463473.$$

The label is $J_0$ again. We can repeat this *same short arithmetic computation* at more precision. We do not need another giant quantum Fourier register for every requested decimal digit.

For our small output, exponentiate and use the norm-one relation. If $\varepsilon=e^R=x+y\sqrt3$, then $\varepsilon^{-1}=x-y\sqrt3$. Add and subtract:

$$x=\frac{\varepsilon+\varepsilon^{-1}}2
=\frac{(2+\sqrt3)+(2-\sqrt3)}2=2,$$

$$y=\frac{\varepsilon-\varepsilon^{-1}}{2\sqrt3}=1.$$

Finally verify $x^2-3y^2=1$. We have reached the Pell output through an actual real-period oracle and its Fourier samples.

For large inputs, printing $x,y$ can again be exponentially expensive. The efficient output is the regulator or a compact representation, with precision and norm handled by classical postprocessing. If the fundamental unit has norm $-1$, square it—or double its logarithm—to reach the norm-one Pell generator. The $d=2$ example above shows why that check matters. [Hallgren, §2.2](https://www.cse.psu.edu/~sjh26/pell.pdf)

## Implementation, scaling, and scope

Let $n$ be the input bit length, approximately $\log_2 d$, and let $b$ be the number of requested precision bits. Reduced pairs occupy $O(n)$ bits. The bound $R\le\sqrt D\ln D$ supplies a general upper bound on the real period. Choosing $N=O(D)$ and then a power-of-two $q\ge3(N\sqrt D\ln D)^2$ makes $\log q$ polynomial in $n$; a register of $\log_2q$ qubits holds an exponentially large input range without storing a classical list of its entries. QFT cost is polynomial in $\log q$ and desired gate accuracy. The ideal oracle uses polynomially many arithmetic operations on polynomially many bits, with random-grid shifting and precision control. Repeated Fourier sampling plus classical reconstruction gives polynomial runtime in $n$ and $b$ for compact output. Logical reversible arithmetic and controlled rotations still need fault-tolerant implementation; this is not a near-term hardware claim.

The included script deliberately enumerates the small oracle domain and simulates its amplitudes classically. That costs space and time proportional to the represented domain and is **not** a scalable implementation of Hallgren's quantum algorithm. It also implements the composition/reduction evaluator for individual positions and cross-checks it against sequential reduction. It verifies the small instance's arithmetic, actual labels, Fourier distribution, and output reconstruction without supplying the period to either oracle evaluator. The arithmetic implementation is numerical reference code, not certified interval arithmetic or a fault-tolerant circuit.

The **principal ideal problem** is the related task of deciding whether an input ideal is generated by a single quadratic number and, if so, returning a compact generator description. Its quantum reduction uses two-dimensional Fourier information to infer an unknown ideal distance, much as [discrete logarithms](/lessons/discrete-logarithms/) recover a hidden exponent. Hallgren supplies that separate algorithm. Computing class groups is another extension, and the paper's class-group result uses the generalized Riemann hypothesis. The complete worked algorithm here is the regulator/Pell branch; those extensions are identified rather than presented as additional worked implementations. [Hallgren, §§4–5](https://www.cse.psu.edu/~sjh26/pell.pdf)

## Misunderstandings, predictions, and connections

**“The ideal cycle has two labels, so its period is two.”** Two is a count of reduction steps. The two step lengths are unequal, and the unknown regulator is their total real distance. Fourier sampling needs the ideal-plus-residual labels.

**“Round $NR$ once, then use ordinary Shor.”** There is no single integer period. The packet contains both 42 and 43 gaps. Replacing all of them with 42 would change the oracle and its Fourier distribution.

**“Knowing a good approximate period proves it is fundamental.”** It can be a multiple. Repetition and the theorem's success analysis are part of the algorithm, not an optional confidence decoration.

**“A small function register means its oracle is free.”** Its construction contains the hard algebraic-number-theory work. Omitting composition, reduction, or precision changes an end-to-end algorithm into an unsupported oracle assumption.

<details><summary>Exercise: omit the residual integer and store only $(a,b)$. What changes?</summary>

An entire real interval gets the same output label. In our example, the unit-ideal interval has length about $1.00505$, containing roughly 32 input grid points per traversal. The measured state becomes a union of broad blocks instead of one index per traversal. Its Fourier distribution has an extra envelope and no longer satisfies the injectivity condition used in the reconstruction proof. A different analysis might exploit it, but the argument just given no longer applies.

</details>

<details><summary>Exercise: why does the $d=2$ cycle return after a unit of norm $-1$, and what must the final Pell answer do?</summary>

For $D=8$, pair $(1,2)$ has multiplier $\gamma=(2+\sqrt8)/2=1+\sqrt2$. Reduction gives $c=(8-4)/4=1$ and the same pair $(1,2)$, so the unit regulator is $\ln(1+\sqrt2)$. Its norm is $-1$, so it does not solve $x^2-2y^2=1$. Squaring gives $(1+\sqrt2)^2=3+2\sqrt2$, and $3^2-2\cdot2^2=1$. The Pell logarithm is twice the unit regulator.

</details>

<details><summary>Exercise: use convergent $1/2$ from $1166/1944$. Does it produce a second accepted answer?</summary>

Its numerator is $1$, so $T=\operatorname{round}(16384/1166)=14$, the same candidate as $1/1$. The position $14/32=0.4375$ is farther than $1/32$ from either adjacent unit ideal. Verification rejects it. Merely being a continued-fraction convergent is insufficient.

</details>

This extends [order finding](/lessons/order-finding/) in a concrete way. Both algorithms prepare equal-output packets and measure reciprocal-period frequencies. Here those packets have rounded real spacing, oracle evaluation needs an infrastructure of reduced ideals, and two approximate frequencies identify an unknown harmonic ratio. In the [abelian hidden-subgroup framework](/lessons/abelian-hidden-subgroup/), it is the passage from integer periods to real periods that requires new work; writing “hidden subgroup over the reals” is a description of the target structure, not an implementation.

## Runnable verification

Download [the standalone Python checks](/examples/hallgren-checks.py) and run `python3 hallgren-checks.py`. It uses Python's standard library. The code constructs labels by reduction from the input, checks the ideal composition arithmetic and the norm-$-1$ case, compares oracle outputs at two precisions, computes the complete conditioned Fourier distribution, verifies its probability sum, and reconstructs and refines the worked regulator. Its checked probabilities are deterministic ideal calculations. It does not claim a physical experiment, a general-purpose fault-tolerant circuit, or a polynomial-time classical simulator.

## References

- Sean Hallgren, [Polynomial-Time Quantum Algorithms for Pell's Equation and the Principal Ideal Problem](https://www.cse.psu.edu/~sjh26/pell.pdf), author-hosted May 2006 manuscript. Full text read for oracle boundary shifting, pseudo-periodicity, reciprocal-frequency reconstruction, compact outputs, success guarantees, and the separate principal-ideal/class-group results. The [university-hosted copy](https://public.csusm.edu/ssharif/crypto/Hallgren-Pell.pdf) provides the same manuscript when the author server is unavailable.
- Richard Jozsa, [Notes on Hallgren's efficient quantum algorithm for solving Pell's equation](https://arxiv.org/html/quant-ph/0302134), 2003. Full text read for the detailed ideal definitions, pair reduction, ideal composition, logarithmic-distance convention, and efficient evaluation construction. The worked $d=3$ grid, explicit finite Fourier distribution, and reconstruction arithmetic above were calculated independently. The later Hallgren paper supplies the boundary-precision safeguard, which must not be replaced by the simpler exposition's claim that separation between ideals alone resolves every rounding decision.
