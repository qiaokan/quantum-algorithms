## Problem and access model

We can implement a unitary $U$ and controlled powers of it. We also possess a state $|u\rangle$ satisfying

$$U|u\rangle=e^{2\pi i\phi}|u\rangle,$$

where the unknown number $0\leq\phi<1$ is the phase to estimate. The state is an **eigenvector**: applying $U$ changes it only by a scalar, called its eigenvalue. The eigenvalue has length 1 because $U$ preserves normalization. See [eigenvalues](/definitions/eigenvalues/) and [controlled gates](/definitions/controlled-gates/).

The output is a classical estimate of $\phi$, not a copy of all eigenvectors. If the input is a mixture or superposition of eigenvectors, the measurement samples their phases according to their weights. Preparing a useful eigenvector is an additional problem, central to energy estimation.

A classical baseline depends on access. An explicitly given two-by-two matrix is easily diagonalized classically. An arbitrary $2^n$-dimensional matrix is not automatically the input: the quantum circuit may have a short description. The useful resource comparison concerns implementing controlled $U$ and extracting phase information to a specified precision. [IBM's derivation](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure) supplies the ideal circuit analysis.

## One control bit explains the mechanism

Prepare a control in $|+\rangle=(|0\rangle+|1\rangle)/\sqrt2$. Apply $U$ only on its 1 branch:

$$
{\,|0\rangle|u\rangle+|1\rangle U|u\rangle\over\sqrt2}
={|0\rangle+e^{2\pi i\phi}|1\rangle\over\sqrt2}|u\rangle.
$$

This equality factors a scalar; it is not a scalar physically traveling between qubits. The control now has a **relative** phase. A Hadamard maps it to amplitudes $(1+e^{2\pi i\phi})/2$ and $(1-e^{2\pi i\phi})/2$, so the probability of 0 is $(1+\cos(2\pi\phi))/2$.

For $\phi=0$, output 0 is certain. For $\phi=1/2$, output 1 is certain. Other phases need more resolution. Merely measuring before the final Hadamard would give two equally likely outcomes independent of phase.

## Exact worked instance: phase three eighths

Let $U=\operatorname{diag}(1,e^{2\pi i3/8})$ on a target qubit and prepare $|u\rangle=|1\rangle$. Three counting bits begin at $|000\rangle$. Their Hadamards give $\sum_{x=0}^7|x\rangle/\sqrt8$.

Use big-endian bits: $x=4x_0+2x_1+x_2$. Control $U^4$ by the left bit, $U^2$ by the middle bit, and $U$ by the right bit. In branch $x$, their combined action is $U^x$. The target stays $|1\rangle$; the counting amplitude becomes $e^{2\pi i3x/8}/\sqrt8$.

The three controlled phases are $-1$, $-i$, and $(-1+i)/\sqrt2$, respectively. Multiplying the selected factors for each bit string gives the counting vector

$$
{1\over\sqrt8}\left(1,{ -1+i\over\sqrt2},-i,{1+i\over\sqrt2},-1,{1-i\over\sqrt2},i,{ -1-i\over\sqrt2}\right)^T.
$$

For example, $x=5=101$ selects $U^4$ and $U$, so its phase is $(-1)(-1+i)/\sqrt2=(1-i)/\sqrt2$. All eight probabilities remain $1/8$. The information is still in relative phases.

Apply $F_8^\dagger$, the inverse QFT. Its output amplitude at $y$ is

$$b_y={1\over8}\sum_{x=0}^7 e^{2\pi i(3-y)x/8}.$$

At $y=3$, every contribution is $1/8$, giving $b_3=1$. For other $y$, the geometric sum is zero. Measurement returns $011$, interpreted as integer 3, then divide by $2^3=8$ to obtain $3/8$.

## Inexact instance: phase one third with two bits

Set $\phi=1/3$ but allow only $M=2^2=4$ counting labels. The state before inverse QFT is $(1,\omega,\omega^2,1)^T/2$, where $\omega=e^{2\pi i/3}=-1/2+i\sqrt3/2$. No label $y/4$ equals $1/3$.

For $y=1$, the inverse-QFT row is $(1,-i,-1,i)/2$. Its amplitude is

$$b_1={1-i\omega-\omega^2+i\over4}
={3+\sqrt3+i(3+\sqrt3)\over8}.$$

Thus $|b_1|^2=(3+\sqrt3)^2/32\approx0.699760$. The complete output probabilities are

| $y$ | estimate $y/4$ | probability |
|---|---|---|
| 0 | 0 | $1/16=0.0625$ |
| 1 | $1/4$ | $(3+\sqrt3)^2/32\approx0.699760$ |
| 2 | $1/2$ | $3/16=0.1875$ |
| 3 | $3/4$ | $(3-\sqrt3)^2/32\approx0.050240$ |

They sum to 1. The most likely estimate is close but not exact. One measurement does not magically produce an arbitrary real number.

## Precision and the powered-oracle bill

With $m$ counting bits and $M=2^m$, the general amplitude is

$$b_y={1\over M}\sum_{x=0}^{M-1}e^{2\pi ix(\phi-y/M)}.$$

This sum peaks near $y/M=\phi$ modulo 1. The nearest grid point has probability at least $4/\pi^2$, and additional precision bits or repeated suitably processed samples raise confidence. An ordinary median must be used carefully across the wraparound at phase 0.

There are $m$ controlled-power *blocks*, but if only base $U$ is available, their implementation uses $1+2+\cdots+2^{m-1}=2^m-1$ base-$U$ applications. Precision of order $\epsilon=2^{-m}$ therefore costs order $1/\epsilon$ coherent evolution. Counting powered blocks as unit-cost queries silently changes the access model.

For modular multiplication, a known arithmetic shortcut can implement a large power efficiently. For generic Hamiltonian evolution, the long evolution time cannot simply be discarded. Fault-tolerant synthesis, control overhead, state preparation and repetitions are additional resources.

## Predictions, limitations and connections

If the target is $\sqrt{3/4}|u_0\rangle+\sqrt{1/4}|u_1\rangle$ for orthogonal eigenvectors, exact-grid QPE returns the first phase with probability $3/4$ and the second with probability $1/4$. It does not return their mean. A state with tiny ground-state overlap can therefore make energy estimation expensive despite an efficient phase circuit.

[Iterative phase estimation](/lessons/iterative-phase-estimation/) trades counting-register width for measurements and feed-forward. [Quantum counting](/lessons/quantum-counting/) applies QPE to the Grover rotation. The same operation that made search oscillate now carries a measurable numerical answer.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- IBM Quantum Learning, [The phase-estimation procedure](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure), controlled powers, QFT analysis and probability bounds.
- Miroslav Dobšíček et al., [Arbitrary accuracy iterative phase estimation algorithm as a two qubit benchmark](https://arxiv.org/html/quant-ph/0610214), introductory comparison: counting width versus exponentially growing powers.
