## Problem, output, and access model

A **semidefinite program**, or SDP, optimizes a linear function of a matrix subject to linear constraints and a positivity condition. One common form is

$$\max_X\operatorname{Tr}(CX)\quad\text{subject to}\quad\operatorname{Tr}(A_jX)\leq b_j\ (j=1,\ldots,m),\quad X\succeq0.$$

$X$ is the unknown Hermitian matrix; $C$ is the objective matrix; $A_j,b_j$ specify constraints; and $m$ counts them. The [trace](/definitions/trace/) sums diagonal entries. $X\succeq0$ means **positive semidefinite**: $v^\dagger Xv\geq0$ for every vector $v$, or equivalently all eigenvalues are nonnegative. This is a condition on a quadratic form, not on every individual matrix entry.

[Brandão and Svore](https://arxiv.org/abs/1609.05537) combine a matrix multiplicative-weights framework with quantum Gibbs preparation and estimation under sparse matrix oracles. The fast output is an objective estimate and suitable state/sampling representations, not all entries of the optimal matrix. Input norms, trace/dual bounds, accuracy, and sparsity are integral parameters.

## Classical baseline and a solvable instance

Classical interior-point methods, first-order methods, and problem-specific solvers are important baselines. Quantum oracle bounds do not establish superiority over all of them on practical workloads. Even reading an explicitly stored dense input or printing a dense solution can dominate the advertised dimension dependence.

Consider a single qubit. Maximize $\operatorname{Tr}(CX)$ with $C=|1\rangle\langle1|=\operatorname{diag}(0,1)$, subject to $X\succeq0$, $\operatorname{Tr}(X)=1$, and $\operatorname{Tr}(CX)\leq1/4$. Equality of the trace can be represented by two inequalities in the general form.

Write $X=\begin{pmatrix}a&z\\z^*&d\end{pmatrix}$, where the star means complex conjugate. Trace one gives $a+d=1$. Positivity requires $a,d\geq0$ and $|z|^2\leq ad$. The objective is $d$, and the extra constraint says $d\leq1/4$. Therefore the optimum is $1/4$, attained by $X_* =\operatorname{diag}(3/4,1/4)$. The constraint itself certifies that no larger objective is feasible.

This problem is deliberately elementary. It lets us inspect the Gibbs-state and expectation-value mechanisms used inside larger SDP algorithms without pretending a toy run establishes an industrial optimization advantage.

## Why density matrices appear

A density matrix already satisfies positivity and trace one. If the unknown SDP variable has bounded trace $R$, it can often be represented as $X=r\rho$, where $\rho$ is a density matrix and $0\leq r\leq R$ is tracked separately. Then each linear constraint becomes an expectation value $\operatorname{Tr}(A_jX)=r\operatorname{Tr}(A_j\rho)$.

The **matrix multiplicative-weights** idea maintains a candidate density matrix that increasingly penalizes directions implicated by violated constraints. Its updates involve exponentials of accumulated constraint matrices. The quantum ingredient is to prepare those Gibbs states and estimate their constraint expectations, rather than explicitly store every entry. This explanation identifies the mechanism; the exact update schedule, stopping rule, and error propagation of a general SDP solver require the source algorithm's promises.

## One complete diagonal update

Start from $\rho_0=I/2=\operatorname{diag}(1/2,1/2)$. The constraint expectation is $\operatorname{Tr}(C\rho_0)=1/2$, violating the upper bound $1/4$. Penalize the system-one direction using the Gibbs family

$$\rho(\eta)=\frac{e^{-\eta C}}{\operatorname{Tr}(e^{-\eta C})}
=\frac{\operatorname{diag}(1,e^{-\eta})}{1+e^{-\eta}}.$$

Here $\eta$ controls the strength of the penalty. Choose $\eta=\log3$, so $e^{-\eta}=1/3$. Then

$$\rho(\log3)=\operatorname{diag}(3/4,1/4)=X_*.$$

The objective and constraint expectation are both $1/4$. Positivity is explicit from the two nonnegative diagonal entries, trace is one, and the earlier constraint bound proves optimality. For this commuting instance one update suffices because we analytically selected its strength. That is not the general multiplicative-weights iteration count or a prescription to solve arbitrary SDPs in one step.

## Prepare and measure the update with actual operations

Prepare two registers in $(|00\rangle+|11\rangle)/\sqrt2$. To obtain the Gibbs state on the first register, implement the successful block $G=e^{-\eta C/2}=\operatorname{diag}(1,1/\sqrt3)$ using a flag. On system zero, set the success flag with amplitude one; on system one, rotate it to $\sqrt{2/3}|0\rangle+(1/\sqrt3)|1\rangle$, with one labeled as success. These are controlled real rotations whose squared amplitudes sum to one.

The success branch before normalization is

$$\frac1{\sqrt2}|00\rangle+\frac1{\sqrt6}|11\rangle,$$

with probability $1/2+1/6=2/3$. Its normalized state is $(\sqrt3|00\rangle+|11\rangle)/2$. Ignoring the second register leaves exactly $\operatorname{diag}(3/4,1/4)$ on the first. Measuring that system in the computational basis produces one with probability $1/4$, an unbiased single-shot sample of the objective/constraint expectation.

After $N$ independent successful preparations, the fraction of ones estimates $1/4$. Its standard deviation is $\sqrt{p(1-p)/N}=\sqrt{3/(16N)}$ at $p=1/4$. Finite samples do not certify exact feasibility at a boundary: practical decision procedures need an allowed tolerance and a confidence/error budget.

## A general feasibility loop with a stopping rule

The analytic one-step choice above is special. Here is a complete, conservative version of the **matrix multiplicative-weights feasibility framework** that does not choose a step size from a known optimum. It is not a reproduction of the optimized Brandão–Svore implementation, and its simple constraint scan does not inherit that paper's square-root dependence on the number of constraints.

First reduce to a density-matrix feasibility problem: find $\rho\succeq0$ with $\operatorname{Tr}\rho=1$ and $\operatorname{Tr}(A_j\rho)\leq b_j$. Assume $\|A_j\|\leq1$; rescaling larger matrices also rescales the required error. Let $D$ be matrix dimension, $\epsilon\in(0,1)$ the permitted additive constraint violation, and $\delta$ the total failure probability. A proposed objective lower bound $\gamma$ can be included as an extra constraint $\operatorname{Tr}(-C\rho)\leq-\gamma$. Binary search over a known objective interval then reduces optimization to feasibility, with tolerance propagated through the interval updates.

Set the step size $\eta=\epsilon/4$ and iteration cap

$$T=\left\lceil\frac{16\log D}{\epsilon^2}\right\rceil+1.$$

Here $\log$ is the natural logarithm, the inverse of $e^x$; the ceiling rounds up to the next integer. Start with accumulated penalty $K_0=0$. At iteration $t=1,\ldots,T$:

1. Prepare the Gibbs state $\rho_t=e^{-\eta K_{t-1}}/\operatorname{Tr}(e^{-\eta K_{t-1}})$, to enough accuracy that every norm-one observable's expectation differs from the ideal by at most $\epsilon/8$.
2. Estimate every $\operatorname{Tr}(A_j\rho_t)$ to measurement error at most $\epsilon/8$. Write the estimates as $\widehat a_j$. The combined preparation-plus-estimation error is at most $\epsilon/4$.
3. If all estimates satisfy $\widehat a_j\leq b_j+3\epsilon/4$, return the preparation circuit for this state and its measured constraint intervals. Its true ideal constraint values are at most $b_j+\epsilon$; the actually prepared state's own guarantee can instead be stated directly using its measurement intervals.
4. Otherwise choose one violating index $j_t$, and set $K_t=K_{t-1}+A_{j_t}$. Repeat with the new Gibbs penalty.

If all $T$ iterations find a violation, report that **no exactly feasible density matrix exists**, conditional on the stated estimation-error event. The output is a gap decision: an approximately feasible state or a certificate of exact infeasibility. Instances close to the boundary can allow either response; the guarantee does not distinguish zero violation from an arbitrarily tiny violation at finite cost.

## Why the loop cannot reject a feasible instance

A matrix multiplicative-weights inequality, the central tool in [Brandão–Svore's Section 3.1](https://arxiv.org/html/1609.05537), bounds the cumulative penalty suffered by the Gibbs candidates. In the normalized convention just used, a convenient bound is

$$\sum_{t=1}^T\operatorname{Tr}(A_{j_t}\rho_t)
\leq\lambda_{\min}\left(\sum_{t=1}^TA_{j_t}\right)+\eta T+\frac{\log D}{\eta}.$$

The symbol $\lambda_{\min}$ means smallest eigenvalue. It is no larger than the expectation in any normalized state. Thus, if a feasible state $\sigma$ exists, the first term is at most $\sum_t\operatorname{Tr}(A_{j_t}\sigma)\leq\sum_tb_{j_t}$.

Every chosen violation, on the successful estimation event, has true value greater than $b_{j_t}+\epsilon/2$: its estimated excess was greater than $3\epsilon/4$, and its total error is at most $\epsilon/4$. Summing would imply

$$\frac{\epsilon T}{2}<\eta T+\frac{\log D}{\eta}.$$

With $\eta=\epsilon/4$ and $T>16\log D/\epsilon^2$, the right-hand side is strictly less than $\epsilon T/2$, a contradiction. Therefore an exactly feasible instance must terminate by returning an approximately feasible candidate. This is the reason for the iteration cap, not a heuristic convergence hope.

<details data-derivation><summary>Show the potential-function derivation</summary>

Let $Z_t=\operatorname{Tr}(e^{-\eta K_{t-1}})$, initially $Z_1=D$. For a Hermitian matrix with eigenvalues in $[-1,1]$, the scalar inequality $e^{-\eta a}\leq1-\eta a+\eta^2$ for $0<\eta\leq1/2$ extends to the matrix in its eigenbasis. The Golden–Thompson trace inequality, $\operatorname{Tr}(e^{B+C})\leq\operatorname{Tr}(e^Be^C)$ for Hermitian $B,C$, then gives

$$Z_{t+1}/Z_t\leq1-\eta\operatorname{Tr}(A_{j_t}\rho_t)+\eta^2.$$

Using $\log(1+u)\leq u$ and summing logarithms yields $\log Z_{T+1}\leq\log D-\eta\sum_t\operatorname{Tr}(A_{j_t}\rho_t)+\eta^2T$. At least the minimum-eigenvalue term appears in the trace, so $\log Z_{T+1}\geq-\eta\lambda_{\min}(K_T)$. Combine these two inequalities and divide by $\eta$ to obtain the displayed regret bound. Golden–Thompson is the noncommuting matrix theorem used here; scalar entrywise exponentiation would not justify this step.

</details>

## Oracle response and a finite-accuracy run on the toy

For our original candidate family $\rho=\operatorname{diag}(1-p,p)$, a constraint checker returns the upper-bound violation whenever $p>1/4+3\epsilon/4$. If we also ask for objective at least $1/4$, the lower-bound constraint is $-p\leq-1/4$. Starting at $p=1/2$, only the upper constraint is violated. After $k$ updates with $A_{j_t}=C$, the penalty is $K_k=kC$ and the Gibbs population is

$$p_k=\frac1{1+e^{\eta k}}.$$

For an illustrative **exact-expectation** run with $\epsilon=0.1$, $\eta=0.025$. The accepted interval is $0.175\leq p\leq0.325$. At $k=29$, $p_{29}\approx0.326293$ still violates the upper threshold. At $k=30$, $p_{30}\approx0.320821$ passes both checks. Return that preparation and its tolerance, rather than claiming an exactly feasible optimum: its upper constraint violation is approximately $0.070821<0.1$. The earlier analytic update reaches exact $p=1/4$ and supplies the exact optimum for comparison. Both runs terminate with a stated meaning for their outputs.

A quantum implementation estimates $p$ from measurements, so the exact-expectation values above are a classical verification of the update arithmetic, not an experimental trajectory. To make all $mT$ bounded-observable estimates simultaneously accurate to measurement error $\tau=\epsilon/8$ with probability at least $1-\delta$, independent measurements in $[-1,1]$ can use

$$N\geq\frac{2}{\tau^2}\log\left(\frac{2mT}{\delta}\right)$$

shots per estimate by a bounded-sample concentration bound and a union bound. Approximate observable measurement and Gibbs preparation require additional allocated errors. This intentionally conservative scan uses $m$ estimates per iteration. Quantum search over constraint indices requires a coherently implementable checker and careful error control; it cannot be inserted merely by replacing $m$ with $\sqrt m$ in this calculation.

We needed the framework to connect the Gibbs update to an actual stopping guarantee. Return now to the full cost: each state preparation and each oracle evaluation must be built from the matrix-access model.

## General operations and the hidden costs

In a larger instance, the update Hamiltonian is a weighted sum of constraint matrices selected by an oracle/optimization step. Preparing its Gibbs state can require simulation, filtering, or sampling procedures with temperature and spectral dependence. Finding a violated constraint among $m$ possibilities and estimating its expectation add query and accuracy costs. Reversible access must return both locations and values of nonzero matrix entries, and preparation/control overhead must be instantiated.

The original sparse-oracle result has square-root-type dependence on matrix dimension and number of constraints, multiplied by substantial functions of sparsity, primal/dual norm bounds, and inverse accuracy. Dropping those factors can reverse a comparison. The source also changes the output format to avoid the cost of printing a matrix. Later improvements belong in an audit of a specific problem and input model; this chapter does not assert a current universally best runtime or practical speedup.

Noncommuting constraints are the important departure from our diagonal example. Their exponentials cannot be updated by simply multiplying scalar weights entry by entry in one fixed basis. Quantum Gibbs preparation is useful precisely because the required matrix may not remain diagonal in a known cheap basis—but that also makes implementation harder.

## Predictions, counterexamples, and practice

**Predict:** could we drop positivity and still interpret $X$ as a state?

<details><summary>Show the answer</summary>

No. Trace-one matrix $\operatorname{diag}(2,-1)$ has a negative diagonal entry and predicts a negative probability for outcome one. Positivity is what makes the density-matrix representation physical. Conversely, a positive matrix can have negative off-diagonal entries: $|-\rangle\langle-|=\frac12\begin{pmatrix}1&-1\\-1&1\end{pmatrix}$ is a valid state.

</details>

Change the bound to $d\leq1/10$. The exact diagonal Gibbs update needs $e^{-\eta}/(1+e^{-\eta})=1/10$, hence $e^{-\eta}=1/9$ and $\eta=\log9$. The prepared purification is $(3|00\rangle+|11\rangle)/\sqrt{10}$. If an application instead demands all entries of a $D\times D$ optimum, that output alone can require order $D^2$ numbers; a compact-state oracle theorem does not meet the request.

## Module synthesis

We have concretely connected [simulation](/lessons/product-formulas/) to phase estimation and HHL, [LCU](/lessons/block-encoding/) to Taylor evolution, [QSP](/lessons/signal-processing/) to [QSVT](/lessons/singular-value-transformation/), and spectral filtering to Gibbs states used in optimization. The recurring operation is a matrix function embedded in a reversible circuit, followed by explicit accounting for preparation, success, and measurement.

The locally specified feasibility framework includes its update, stopping rule, finite-accuracy run, and conservative measurement budget. It is a complete introductory mechanism, with an intentionally unoptimized constraint scan. The optimized Brandão–Svore dual-sampling oracle and its sharper dimension dependence remain a cited extension; they are not attributed to this simple implementation.

## Reproduce the calculation

Download the [standalone matrix-example checks](/examples/matrix-checks.py) and run `python3 matrix-checks.py`. The file uses only Python's standard library and tests the small ideal transformations in this module. It includes full matrix multiplications where shown, explicit postselection, and normalization checks; it is not a general sparse quantum algorithm implementation or a hardware experiment.

## References

- Fernando G. S. L. Brandão, Krysta Svore, [Quantum Speed-ups for Semidefinite Programming](https://arxiv.org/abs/1609.05537), input/output model and main algorithm: sparse oracles, Gibbs states, matrix multiplicative weights, and parameter dependence.
- John M. Martyn et al., [A Grand Unification of Quantum Algorithms](https://arxiv.org/abs/2105.02859): polynomial/Gibbs transformations used as possible implementation primitives.
- The diagonal optimum, purification, success probability, and expectation value are checked in [the downloadable matrix checks](/examples/matrix-checks.py).
