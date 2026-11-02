## Problem and the meaning of one query

For a smooth real-valued function $F$ of $d$ real inputs, estimate its gradient at a point. The gradient is the list of local slopes: how much the output changes per small change in each input, holding the others fixed. In two dimensions, $F(u,v)=u+2v$ has gradient $(1,2)$ everywhere.

Jordan's algorithm assumes a coherent, finite-precision value oracle on a grid, with a suitable local smoothness and precision promise. It creates a phase ramp whose frequencies encode those slopes. [Jordan's paper](https://arxiv.org/html/quant-ph/0405146) gives the query construction. A claim of “one query” counts one call to this powerful coherent arithmetic oracle; it does not mean one elementary gate or one classical function evaluation.

Classical finite differences use values at a center and displaced points, typically $d+1$ values for forward differences or $2d$ for centered differences. If source code permits automatic differentiation, that is a different and often stronger baseline: the black-box separation does not automatically beat backpropagation.

## Start with an exact linear grid

Let each input grid have four labels, $x,y\in\{0,1,2,3\}$. Use the integer function $f(x,y)=x+2y\pmod4$ and a two-bit output register $z$. The coherent value oracle is modular addition:

$$U_f|x,y,z\rangle=|x,y,z+f(x,y)\bmod4\rangle.$$

The output operation is addition, not XOR. The distinction matters for its phase eigenstate. Prepare the output in

$$|\chi\rangle={1\over2}(|0\rangle-i|1\rangle-|2\rangle+i|3\rangle)=F_4^\dagger|1\rangle.$$

Adding an integer $k$ to its label multiplies this entire state by $i^k$. To check $k=1$, shift the coefficients forward cyclically: $(i,1,-i,-1)^T/2=i(1,-i,-1,i)^T/2$. The output returns to the same normalized state up to a phase.

We needed that calculation to implement phase kickback with a multibit arithmetic oracle. We can now return to the two input registers.

## Preparation, oracle and factorization

Four Hadamards prepare the inputs in $\sum_{x,y}|x,y\rangle/4$. One call to $U_f$ gives

$$\frac14\sum_{x,y=0}^3 i^{x+2y}|x,y\rangle|\chi\rangle.$$

Because $i^{x+2y}=i^x(-1)^y$, the input state factors as

$$\left[{1\over2}(1,i,-1,-i)^T\right]\otimes
\left[{1\over2}(1,-1,1,-1)^T\right].$$

The symbol $\otimes$ is a [tensor product](/definitions/tensor-products/): multiply every entry of the first vector by the entire second vector. For example, input $(x,y)=(1,2)$ has amplitude $(i/2)(1/2)=i/4$. All sixteen input probabilities are still $1/16$. The slopes are encoded in phases, not directly in those probabilities.

Apply inverse QFT to each input register. The first bracket is $F_4|1\rangle$, so it becomes $|1\rangle$; the second is $F_4|2\rangle$, so it becomes $|2\rangle$. Explicitly, the amplitude at an output $(r,s)$ is

$$\frac1{16}\left(\sum_{x=0}^3i^{(1-r)x}\right)
\left(\sum_{y=0}^3i^{(2-s)y}\right).$$

Both sums equal 4 when $r=1,s=2$, giving amplitude 1. Otherwise at least one is zero. Measure and return $(1,2)$ with certainty in this exact toy instance. The untouched output eigenstate can be discarded after the input measurement.

## Connect grid frequencies to real derivatives

The preceding calculation is exact for a linear function. To relate it to a local derivative, center a grid of width $\ell$ around the target point. In two dimensions let

$$u=\ell(x/4-1/2),\qquad v=\ell(y/4-1/2).$$

For $F(u,v)=u+2v$, multiplying the function by phase scale $2\pi/\ell$ gives

$$e^{2\pi iF(u,v)/\ell}=e^{2\pi i[(x+2y)/4-3/2]}=-i^{x+2y}.$$

The minus sign is common to all inputs, so it is an unobservable global phase. The same Fourier calculation recovers the slopes, with known scale conversion. In a general function, a local approximation is

$$F(\mathbf u)=F(\mathbf0)+\sum_j g_j u_j+R(\mathbf u).$$

Here $\mathbf u$ is the list of input displacements, $g_j$ is the slope in coordinate $j$, and $R$ is the nonlinear remainder. The constant becomes global phase. The linear part becomes separable phase ramps. The remainder causes unwanted phase errors and Fourier leakage.

## Precision and failure cases

A smaller grid makes the linear approximation better but may require more bits of function precision to distinguish tiny value differences. Increasing the phase scale magnifies both the useful slope and numerical error. If a bound $|R(\mathbf u)|\leq R_{\max}$ is known, the induced phase error is at most the chosen phase scale times $R_{\max}$. Choose grid width, function precision and register sizes together; “smooth” alone is not a numerical error budget.

Fourier labels are modular frequencies. In our size-four grid, label 3 could encode a signed slope $-1$ under the chosen range convention. Slopes separated by multiples of 4 alias. A known derivative bound and suitable scale prevent this ambiguity. Non-grid-aligned slopes produce a distribution around nearby frequencies rather than a deterministic list.

**Predict:** does one coherent query output a million derivatives at zero extra cost?

<details><summary>Show the answer</summary>

No. There are $d$ input registers, $d$ Fourier transforms and $d$ measured numbers to read. Function precision, grid width and joint success probability can depend on dimension. The advantage concerns oracle query count under specific promises, not dimension-independent total runtime.

</details>

## A nonlinear example with a numerical error budget

Now use $F(u)=u/2+u^2/2$ near $u=0$. Its slope there is $1/2$: the quotient $(F(h)-F(0))/h=1/2+h/2$ approaches $1/2$ as the displacement $h$ approaches zero. The quadratic term is a genuine curvature error, so the output need no longer be deterministic.

Choose eight grid points, $N=8$, across width $\ell=0.01$: $u_x=\ell(x/8-1/2)$ for $x=0,\ldots,7$. Choose a slope scale $s=4$. The phase we want is $e^{2\pi i sF(u_x)/\ell}$. Its linear part has frequency $s(1/2)=2$, so inverse QFT should favor label 2, which we decode as slope $2/s=1/2$. Frequency labels are interpreted in the signed range $[-4,4)$; after dividing by $s$, slopes must be in $[-1,1)$ to avoid aliasing. The slope grid spacing is $1/s=0.25$. Increasing $s$ improves that spacing but magnifies curvature and rounding errors.

Represent the scaled function with a twelve-bit output register, $K=2^{12}=4096$ levels. The oracle computes the integer

$$q_x=\operatorname{round}\!\left(KsF(u_x)/\ell\right)\pmod K.$$

Rounding means choose the nearest integer. A phase-gradient output state $F_K^\dagger|1\rangle$ converts modular addition of $q_x$ into phase $e^{2\pi iq_x/K}$, exactly as the four-level calculation above did. The full arithmetic oracle is being counted as one coherent query; its reversible evaluation, twelve-bit output preparation and workspace are not free.

| $x$ | $u_x$ | $F(u_x)$ | Rounded integer before reduction | Stored $q_x$ modulo 4096 |
|---|---:|---:|---:|---:|
| 0 | −0.00500 | −0.002487500 | −4076 | 20 |
| 1 | −0.00375 | −0.001867969 | −3060 | 1036 |
| 2 | −0.00250 | −0.001246875 | −2043 | 2053 |
| 3 | −0.00125 | −0.000624219 | −1023 | 3073 |
| 4 | 0 | 0 | 0 | 0 |
| 5 | 0.00125 | 0.000625781 | 1025 | 1025 |
| 6 | 0.00250 | 0.001253125 | 2053 | 2053 |
| 7 | 0.00375 | 0.001882031 | 3084 | 3084 |

The input after the query is $\sum_x e^{2\pi iq_x/4096}|x\rangle/\sqrt8$. Applying inverse $F_8$ gives amplitude

$$b_y={1\over8}\sum_{x=0}^7e^{2\pi i(q_x/4096-xy/8)}.$$

For $y=2$, subtracting $x/4$ from the table's phases, modulo whole turns, leaves offsets $20,12,5,1,0,1,5,12$ divided by 4096. Consequently,

$$b_2={e^{2\pi i20/4096}+2e^{2\pi i12/4096}+2e^{2\pi i5/4096}+2e^{2\pi i/4096}+1\over8}.$$

Their directions are almost aligned. Squaring the magnitude gives $P(y=2)\approx0.999897645$. Evaluating the same eight-term sum for all labels yields probabilities, in order,

$$(0.0000036771,\ 0.0000464801,\ 0.9998976449,\ 0.0000464801,\ 0.0000036771,\ 0.0000007261,\ 0.0000005883,\ 0.0000007261).$$

The unrounded probabilities sum to 1. These are computed ideal probabilities, not experimental observations. Outcome 2 returns the correct local slope $1/2$; the other outcomes are failures for an exact-output request in this chosen grid-aligned example.

We can also bound failure *before* evaluating that sum. The largest quadratic remainder is $u_x^2/2\leq\ell^2/8$. Scaling to phase gives curvature error at most $\pi s\ell/4=\pi/100$. Rounding changes the phase by at most $\pi/K$. Thus every input amplitude differs from its ideal linear phase by an angle no greater than

$$\Delta=\frac{\pi}{100}+\frac{\pi}{4096}\approx0.032183.$$

On the unit circle, a chord is no longer than its subtended angle, so $|e^{i\delta}-1|\leq|\delta|$. The squared vector difference from the ideal normalized phase ramp is therefore at most the average of eight numbers bounded by $\Delta^2$, hence at most $\Delta^2$. A unitary Fourier transform preserves that difference. Since the ideal output is $|2\rangle$, the total probability outside label 2 is at most $\Delta^2\approx0.001035741$. This conservative bound guarantees success at least 0.998964259; the explicit calculation is better.

We needed the remainder bound to select a grid and an oracle precision. We can now return to the algorithm with actual parameters: three input qubits, twelve phase-gradient qubits, one specified rounded-function oracle, an inverse three-qubit QFT, and a classical division by four. Temporary arithmetic qubits add to those register counts.

In a higher-dimensional problem, a promised remainder bound such as $|R(\mathbf u)|\leq Cd\ell^2/8$ gives curvature phase error at most $\pi sCd\ell/4$. Here $C$ is a known curvature bound and $d$ the number of coordinates. A chosen phase-error budget then forces a smaller $\ell$ as $s$, $C$, or $d$ grows, and sufficiently large $K$ controls rounding. The exact-output guarantee above additionally used a grid-aligned slope. Off-grid slopes require finite-Fourier-resolution analysis and repetitions, just as in inexact phase estimation; the linear phase ramp itself then has more than one possible measurement outcome.

## Implementation, scope and connections

The oracle must evaluate $F$ reversibly to enough bits and add its result into a phase-gradient register. All arithmetic and workspace cleanup count. A classical function API does not supply such a coherent oracle. For a function defined by a neural network, compare reversible evaluation plus precision demands against automatic differentiation, not only naive finite differences.

This lesson is a concrete multidimensional relative of [Bernstein–Vazirani](/lessons/bernstein-vazirani/): a linear function becomes a phase pattern, then a Fourier transform returns its coefficients. Its limiting factor is whether the function is locally linear at a usable scale and whether its oracle is affordable. The nonlinear worked case above supplies one explicit curvature and precision budget. The paper treats broader smooth-function classes; its theorem must be matched to the chosen oracle and derivative bounds rather than extrapolated from a favorable small example. Later work by [Gilyén, Arunachalam and Wiebe](https://arxiv.org/abs/1711.00465) improves precision dependence for important smooth-function classes and analyzes probability-to-phase oracle conversion. That development is included here as an audited extension; its general proof is outside this introductory worked construction.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Stephen P. Jordan, [Fast Quantum Algorithm for Numerical Gradient Estimation](https://arxiv.org/html/quant-ph/0405146): coherent modular-addition oracle, phase kickback, grid scaling and smoothness/precision analysis.
- Andrew M. Childs and Wim van Dam, [Quantum algorithms for algebraic problems](https://arxiv.org/html/0812.0380), Fourier-transform background: phase patterns and finite-grid reconstruction.


- András Gilyén, Srinivasan Arunachalam and Nathan Wiebe, [Optimizing quantum optimization algorithms via faster quantum gradient computation](https://arxiv.org/abs/1711.00465): later precision and oracle-model improvements; abstract verified, full theorem proof not audited here.
