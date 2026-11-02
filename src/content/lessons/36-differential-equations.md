## Problem and access model

A differential equation specifies how a vector changes with time. For a linear ordinary differential equation,

$$\frac{dx(t)}{dt}=Ax(t)+b(t),$$

$x(t)$ is the vector at time $t$, $A$ is a matrix, and $b(t)$ is an externally supplied drive. The derivative on the left means the limit of $(x(t+h)-x(t))/h$ as the small time increment $h$ tends to zero. A quantum algorithm may aim to prepare a state proportional to $x(T)$ at a final time $T$, or estimate a selected functional. It generally does not print a classical time series or every coordinate.

Assume efficient matrix access, initial-state preparation, access to the drive when present, and promises controlling stability, conditioning, and solution norms. [Berry, Childs, Ostrander and Wang](https://arxiv.org/abs/1701.03684) encode a high-order Taylor discretization into a linear system. [An, Liu and Lin](https://arxiv.org/abs/2303.01029) offer a different nonunitary-dynamics route using linear combinations of Hamiltonian simulations.

## Classical baseline and a visible discretization

Classical ODE solvers adapt step sizes, exploit sparsity and stiffness, and can directly produce classical outputs. A quantum comparison must use the same error target and account for final-state extraction. A large dimension alone is not enough.

Take two independent decays:

$$A=\operatorname{diag}(-1,-2),\qquad b(t)=0,\qquad x(0)=\frac1{\sqrt2}(1,1)^T.$$

The exact solution is $x(t)=(e^{-t},e^{-2t})^T/\sqrt2$. It is not unitary evolution: its norm shrinks. To expose the history-to-linear-system mechanism, use two **Euler** steps of size $h=1/4$. This deliberately low-order illustration is not the high-order algorithm or its precision guarantee.

Euler replaces the derivative by a finite difference: $x_{k+1}=x_k+hAx_k=(I+hA)x_k$, where subscript $k$ labels a time step. Here $B=I+hA=\operatorname{diag}(3/4,1/2)$. Thus

$$x_0=\frac1{\sqrt2}(1,1)^T,\quad x_1=\frac1{\sqrt2}(3/4,1/2)^T,\quad x_2=\frac1{\sqrt2}(9/16,1/4)^T.$$

We have calculated all coordinates through the final approximate time $T=1/2$.

## Encode the recurrence as one linear system

Stack the three vectors into a six-component history $y=(x_0,x_1,x_2)^T$. The recurrence is equivalent to

$$
\begin{pmatrix}I&0&0\\-B&I&0\\0&-B&I\end{pmatrix}
\begin{pmatrix}x_0\\x_1\\x_2\end{pmatrix}
=\begin{pmatrix}x(0)\\0\\0\end{pmatrix}.
$$

The first block row enforces the initial condition; the second says $-Bx_0+x_1=0$; the third says $-Bx_1+x_2=0$. These are ordinary matrix equations, now suitable for a quantum linear-system primitive if their matrix can be accessed efficiently and its condition number is acceptable.

A quantum solver prepares a normalized history state proportional to

$$|0\rangle_{\rm time}x_0+|1\rangle_{\rm time}x_1+|2\rangle_{\rm time}x_2.$$

The time register needs two qubits; label three is unused and receives zero amplitude. The vector symbols denote system amplitudes, not three independent copies of an arbitrary unknown state. The entire history is one quantum state prepared by solving the enlarged system.

## Normalize, extract the final time, and read an output

Calculate the squared norms:

$$\|x_0\|^2=1,\quad\|x_1\|^2=(9/16+1/4)/2=13/32,\quad
\|x_2\|^2=(81/256+1/16)/2=97/512.$$

Their sum is $(512+208+97)/512=817/512$. Measuring time label two succeeds with probability

$$P(\mathrm{final})=\frac{97/512}{817/512}=\frac{97}{817}\approx0.118727.$$

Conditional on that event, the system state is $(9,4)^T/\sqrt{97}$, with probabilities $81/97$ and $16/97$. The final norm $\sqrt{97/512}$ is not present as a directly readable coordinate; it must be tracked or estimated separately if the application needs physical magnitudes.

The exact normalized solution at $T=1/2$ has coordinate ratio $e^{-1/2}/e^{-1}=e^{1/2}\approx1.64872$. The Euler ratio is $9/4=2.25$. This substantial discretization error is intentional and visible. A perfectly executed quantum linear solver cannot repair a poor discretization.

**Predict:** if both components decay very rapidly, does preparing the whole history guarantee a likely final-time measurement?

<details><summary>Show the answer</summary>

No. Early-time amplitudes can dominate the history norm while the final vector is tiny. Then final-time postselection is rare. Padding the history with repeated final states or amplification can improve extraction, but increases other costs and does not make the norm-ratio issue disappear.

</details>

## Higher-order approximation and actual implementation

For our diagonal $A$, a second-order Taylor step is $I+hA+(hA)^2/2$. Its two diagonal factors are $1-1/4+1/32=25/32$ and $1-1/2+1/8=5/8$. Two such steps produce factors $625/1024\approx0.610352$ and $25/64=0.390625$, closer to exact $e^{-1/2}\approx0.606531$ and $e^{-1}\approx0.367879$. The comparison shows what increasing approximation order changes before any quantum machinery is invoked.

The Berry et al. construction embeds Taylor terms and time steps into a sparse enlarged linear system, rather than literally using the Euler matrix above. Reversible index arithmetic provides access to its entries when access to the original $A$ is available. A linear-system solver prepares its solution; final-time selection and observable measurements complete the algorithm. Complexity depends on time, matrix norm, sparsity/access, conditioning, approximation degree, input preparation, and the ratio between intermediate and final solution norms. Their logarithmic precision improvement applies under their stated stability/diagonalizability conditions, not to every nonlinear or unstable equation.

Nonlinearity is a separate problem: replacing $Ax$ by $f(x)$ cannot generally be implemented by a linear quantum gate on amplitude-encoded $x$. Linearization or embeddings introduce dimension, convergence, and norm costs that must be analyzed. “Solve all differential equations exponentially faster” is unsupported.

## Another route: linear combinations of Hamiltonian simulation

Write a nonunitary generator as $A=-L-iK$, with $L$ and $K$ Hermitian and $L$ positive semidefinite for the dissipative setting. **LCHS** represents suitable nonunitary evolution as a weighted combination of unitary evolutions, avoiding a history linear-system reduction in its supported cases. Access to the Hermitian pieces and coefficient preparation is still required.

Our example has $L=\operatorname{diag}(1,2)$ and $K=0$. A concrete two-unitary representation of the exact final contraction is easy here. Let $D=\operatorname{diag}(e^{-1/2},e^{-1})$ and $S=\sqrt{I-D^2}$. Both $V_\pm=D\pm iS$ are unitary because each diagonal entry has squared magnitude $d^2+(1-d^2)=1$. Their average is $D$.

Prepare a selector in $|+\rangle$, SELECT $V_+$ or $V_-$, and unprepare. The successful block is $D$, producing exactly $x(1/2)$ on our initial state. Success probability is $(e^{-1}+e^{-2})/2\approx0.251607$. This elementary dilation illustrates coherent nonunitary evolution; constructing $D$ this way from a generic unknown large matrix would already solve the original problem, so it is not a scalable LCHS implementation. The general LCHS paper supplies the useful representation from accessible generator pieces.

## Practice and connections

If $A=0$ and there is no drive, all three history vectors are identical, so each of the three time labels has probability $1/3$. If the application asks only for a normalized direction in a one-dimensional decay, the quantum state contains almost no useful information: the entire interesting answer is the decaying scalar norm. These examples expose why output specification matters.

[HHL](/lessons/hhl/) and [modern solvers](/lessons/modern-linear-solvers/) provide the history-solve primitive. [LCU](/lessons/block-encoding/) provides the alternative contraction mechanism. Both must finally pay for preparation, success, and measurement; neither is a direct classical trajectory printer.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Dominic W. Berry, Andrew M. Childs, Aaron Ostrander, Guoming Wang, [Quantum algorithm for linear differential equations with exponentially improved dependence on precision](https://arxiv.org/abs/1701.03684), Sections 2–7: Taylor history system, conditioning, preparation, and final-time selection.
- Dong An, Jin-Peng Liu, Lin Lin, [Linear combination of Hamiltonian simulation for nonunitary dynamics with optimal state preparation cost](https://arxiv.org/abs/2303.01029): LCHS alternative and supported nonunitary setting; abstract verified.
- The Euler, second-order Taylor, and exact two-dimensional contractions are tested in `scripts/check-matrix-examples.py`; none is represented as a general quantum ODE implementation.
