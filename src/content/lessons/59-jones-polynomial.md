## Problem and access model

The Jones polynomial assigns a polynomial expression to a knot or link. The quantum algorithm estimates its value at particular roots of unity from a braid description. A *braid* lists crossings of adjacent strands; closing its loose ends produces a link. The output guarantee is an additive approximation with a specific normalization, not exact evaluation or uniformly small relative error. [Aharonov, Jones, and Landau](https://arxiv.org/html/quant-ph/0511096) construct an efficient unitary representation and estimate an associated trace or matrix element. Trace closure and plat closure have different guarantees; the paper's BQP-completeness discussion must not be transferred indiscriminately between them.

## A two-strand, one-crossing instance

Take root parameter k=5, so the evaluation point is $t=e^{2\pi i/5}$. Set $A=i e^{-i\pi/10}=e^{2\pi i/5}$ and $d=-A^2-A^{-2}=2\cos(\pi/5)=(1+\sqrt5)/2$. Here d≈1.618034, and $d^2=d+1$. The letter A is a complex scalar, not a matrix in this chapter.

Two allowed path basis states are 1→2→1 and 1→2→3 on the chain of labels 1,2,3,4. They encode the two-dimensional representation. In that basis define $E=\operatorname{diag}(d,0)$, so $E^2=dE$. Represent the positive crossing by

$$U=A E+A^{-1}I=\operatorname{diag}(-A^3,A^{-1}).$$

The first equality becomes the second because $Ad+A^{-1}=-A^3-A^{-1}+A^{-1}=-A^3$. Both entries have magnitude one, so U is unitary. Numerically its diagonal entries are approximately $0.809017+0.587785i$ and $0.309017-0.951057i$.

## Estimate the weighted trace

The path-model weights for these two paths are $w_0=1/d^2\approx0.381966$ and $w_1=1-w_0\approx0.618034$. Choose a path with those classical probabilities. For the selected basis state |j〉, a Hadamard test estimates $\operatorname{Re}\langle j|U|j\rangle$: prepare ancilla |+〉, apply controlled-U, then H and measure ancilla. Its zero probability is $(1+\operatorname{Re}U_{jj})/2$. An S† before the final H gives the imaginary-part version.

Averaging over paths estimates

$$T=w_0(-A^3)+w_1A^{-1}\approx0.5-0.363271i.$$

The combined real-part experiment therefore has ideal zero probability 0.75; the imaginary-part experiment has probability about 0.318364. These are probabilities of repeated ancilla measurements, not direct readout of a complex amplitude.

## Recover the polynomial value

For trace closure, the conversion in this convention is $V(t)=(-A)^{3w}d^{n-1}T$, where n is the number of strands and w is the signed sum of crossings (the writhe). Here n=2 and w=1. Calculate

$$dT=\frac{-A^3+(d^2-1)A^{-1}}{d}.
$$

Using $d^2-1=A^4+1+A^{-4}$, the numerator is $-A^3+A^3+A^{-1}+A^{-5}=A^{-1}+A^{-5}=-A^{-3}d$. Hence $dT=-A^{-3}$ and $V(t)=(-A)^3(-A^{-3})=1$. The closure is an unknot, whose Jones polynomial is indeed one in this normalization. This completes the tiny instance from braid operation through measured estimator to classical answer.

## Where the general circuit comes from

For n strands, represent paths $j_0=1,j_1,\ldots,j_n$ with adjacent labels differing by one and all labels between 1 and k−1. Let $\lambda_a=\sin(a\pi/k)$. At crossing position i, if the two neighboring labels $j_{i-1},j_{i+1}$ differ, the corresponding E operator is zero. If both equal a, its matrix on the possible middle labels b,b′ is $\sqrt{\lambda_b\lambda_{b'}}/\lambda_a$. The identity $\lambda_{a-1}+\lambda_{a+1}=d\lambda_a$ makes $E_i^2=dE_i$, so $A E_i+A^{-1}I$ is unitary. A braid word is a product of these local gates, with inverse gates for negative crossings.

Classical dynamic programming counts weighted paths so the final-label distribution proportional to $\lambda_{j_n}$ can be sampled. Controlled versions of the local gates implement the Hadamard test. Finite-precision trigonometry, gate synthesis, path-register validity, and repetition costs must be included. One crossing costs local work; an m-crossing braid does not become one free oracle.

## Baselines and limitations

A classical knot program easily handles this example. Quantum advantage concerns scaling of a normalized approximation task, not every knot. Ancilla scores have bounded variance, so estimating T to additive error ε uses order $1/\epsilon^2$ ordinary samples. Multiplication by $d^{n-1}$ scales absolute error accordingly. A normalized additive approximation may be weak when the desired polynomial value is tiny; it is not an exact solution to a hard counting problem.

**Predict:** Does a trace estimate of zero imply the Jones polynomial is exactly zero?

<details><summary>Show the answer</summary>

No. Finite sampling provides an interval around the estimate. After applying the normalization factor, that interval may be large. Exact zero testing is a different promise and cannot be inferred from an approximate trace.

</details>

## Reproduce the calculation

The [downloadable NumPy checks](/examples/applications.py) contain independent small-matrix calculations for this part of the book. Save the file locally and run `python3 applications.py` in an environment with NumPy installed. The checks compare computed amplitudes, probabilities, matrix identities, or estimator moments against the worked results; they do not submit circuits to hardware. Conditional states are normalized only after their success probability is computed. The code labels the register ordering and reports failed assertions rather than silently repairing states.

## References

- Dorit Aharonov, Vaughan Jones, Zeph Landau, [A Polynomial Quantum Algorithm for Approximating the Jones Polynomial](https://arxiv.org/html/quant-ph/0511096), path model and trace-closure construction: unitary representation, Markov weights, normalization, and closure-dependent guarantees. The k=5 one-crossing arithmetic is independently derived.
