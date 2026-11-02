## Problem and access model

A variational classifier maps an input to a quantum state, applies trainable gates, and measures an output used to predict a label. Classical optimization adjusts the parameters from labeled examples. The required output is a prediction rule and evaluated out-of-sample performance, not merely a low training loss. [Farhi and Neven](https://arxiv.org/abs/1802.06002) present a representative parameterized-circuit classifier; their reported learning examples were small classical simulations, not a general advantage theorem.

## A fully specified two-example dataset

Use two training examples: angle $x=0$ has label 0 and angle $x=\pi$ has label 1. Encode x with $R_y(x)|0\rangle$, then apply a trainable $R_y(\theta)$. Measurement outcome 1 has probability

$$p_\theta(x)=\sin^2((x+\theta)/2).$$

To check this, multiply the two rotation matrices. The output amplitudes are $\cos((x+\theta)/2)$ and $\sin((x+\theta)/2)$; their squared magnitudes sum to one. No nonlinear activation was applied to the state: probability extraction through measurement supplies the scalar nonlinear function of the angle.

## Define and optimize a loss

Let the loss be the average squared error against the two labels:

$$L(\theta)=\tfrac12[p_\theta(0)^2+(p_\theta(\pi)-1)^2].$$

Set $q=\sin^2(\theta/2)$. Since $p_\theta(\pi)=\cos^2(\theta/2)=1-q$, the loss is $(q^2+(-q)^2)/2=q^2$. At $\theta=\pi/2$, q=1/2 and L=1/4. At θ=π/3, q=1/4 and L=1/16. At θ=0, q=0 and L=0. The trained circuit then predicts both training examples deterministically. A general optimizer would have to discover an angle using estimates; these values demonstrate an exact path of improvement, not an executed optimizer.

For a test input $x=\pi/3$ at θ=0, output amplitudes are $(\sqrt3/2,1/2)$, so $p=1/4$. Thresholding at 1/2 predicts label 0. Whether that is correct depends on the true labeling rule and held-out labels, which the quantum circuit does not provide.

## A gradient that can be measured

For this single rotation occurrence,

$$\frac{\partial p_\theta(x)}{\partial\theta}=\frac{p_{\theta+\pi/2}(x)-p_{\theta-\pi/2}(x)}2.$$

This parameter-shift identity follows from $p=(1-\cos(x+\theta))/2$. At x=0, θ=π/2, the shifted probabilities are 1 and 0, so the derivative is 1/2. The loss derivative is $2q\,dq/d\theta=1/2$, hence a small negative angle step reduces the loss. Each shifted probability needs its own state preparations and shots. Parameters appearing in multiple gates may require a sum of occurrence-wise shifts or a different rule; do not apply this two-evaluation formula blindly to an arbitrary circuit.

## Count preparations and expose the noisy loss

At one parameter setting, estimating both training probabilities with m shots requires 2m fresh circuit executions. A two-sided parameter-shift gradient using both examples needs another 4m executions if data are not reused. Repeating over K optimization steps therefore costs order Km state preparations even though the circuit has only one trainable angle. More parameters add shifted circuits or different gradient estimators.

For a Bernoulli frequency estimate $\widehat p$, $\mathbb E[(\widehat p-y)^2]=(p-y)^2+p(1-p)/m$. This follows by expanding $\widehat p=p+(\widehat p-p)$: the cross term averages to zero and the squared fluctuation is the variance. At θ=π/2, both true probabilities are 1/2. With m=100 shots per example, the expected measured training loss is $1/4+1/400=0.2525$, not exactly 0.25. The extra term depends on the parameter through p, so naive finite-shot training can favor different parameters. Independent validation and an explicit estimator keep this effect visible.

## Baseline and practical limitations

A classical model can directly compute the same sine function, and two labeled points do not establish generalization. The useful comparison includes classical kernels, neural networks, simple structured baselines, hyperparameter search, and total training/inference cost. Quantum data input may create a different task from classical data encoding; label that distinction explicitly.

With m shots, the observed frequency of outcome 1 has variance $p(1-p)/m$. Plugging a noisy frequency into a squared loss introduces an additional variance term in its expectation. Finite sampling therefore changes optimization, not just the display of the final score. Circuit noise, vanishing gradients, inadequate features, optimization traps, and data leakage can all undermine a workflow. There is no general guarantee of a practical speedup.

## Prediction and connection

**Predict:** Would appending a trainable Rz gate immediately before this Z measurement help classification?

<details><summary>Show the answer</summary>

No, not without a later basis-changing operation. Rz changes relative phase but preserves computational-basis probabilities. Its output parameter would be unidentifiable from this measurement. This is the same phase-versus-probability distinction as the cost layer in QAOA.

</details>

A complete empirical study must specify train/validation/test splitting, an objective, optimization budget, measurement budget, repeated seeds, and matched classical comparisons. [Quantum kernels](/lessons/quantum-kernels/) move most training into a classical kernel solver; this chapter instead trains the circuit itself. Both reuse state preparation and expectation estimation, and both must pay their input and output costs.

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Edward Farhi and Hartmut Neven, [Classification with Quantum Neural Networks on Near Term Processors](https://arxiv.org/abs/1802.06002): circuit-based classifier model and exploratory simulation scope. The explicit rotation classifier, loss, and parameter-shift check are independently derived.
