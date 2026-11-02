## Transformation and access model

The quantum Fourier transform, or QFT, is a **primitive**: it changes the amplitudes of an already prepared quantum state. It is not a procedure that takes an ordinary array and prints its Fourier coefficients. Its usefulness is that regular phase patterns can become concentrated measurement outcomes. [Shor's paper](https://arxiv.org/html/quant-ph/9508027) uses this structure for period finding; [IBM's lesson](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure) derives a gate construction.

A classical Fourier transform receives $N$ explicit numbers and returns $N$ explicit numbers, commonly in $O(N\log N)$ arithmetic operations. A QFT on $n=\log_2N$ qubits changes $N$ amplitudes using $O(n^2)$ ideal one- and two-qubit gates. The different input and output contracts prevent a blanket exponential-speedup claim. Preparing an arbitrary amplitude array or reading all its transformed entries may erase the advantage.

## The smallest complex example

Use two qubits and basis order $00,01,10,11$, representing integers 0,1,2,3. Define $i$ by $i^2=-1$. Multiplication by $i$ rotates a complex number by a quarter turn, so its powers cycle through $1,i,-1,-i,1$. The QFT matrix with our **positive exponent** convention is

$$
F_4={1\over2}\begin{pmatrix}
1&1&1&1\\1&i&-1&-i\\1&-1&1&-1\\1&-i&-1&i
\end{pmatrix}.
$$

A column shows the output for its corresponding basis input. For $|01\rangle=(0,1,0,0)^T$, multiplying rows by the column gives

$$F_4|01\rangle={1\over2}(1,i,-1,-i)^T.$$

For example the second row gives $(1\cdot0+i\cdot1-1\cdot0-i\cdot0)/2=i/2$. Each probability is $1/4$, because $|i|=|-i|=1$. Measuring this state immediately does not reveal that the input label was 1.

## Where interference becomes useful

Instead prepare $|\psi\rangle=(|00\rangle+|10\rangle)/\sqrt2=(1,0,1,0)^T/\sqrt2$. The four output amplitudes are

$$
{1\over2\sqrt2}\begin{pmatrix}
1+1\\1-1\\1+1\\1-1
\end{pmatrix}
={1\over\sqrt2}\begin{pmatrix}1\\0\\1\\0\end{pmatrix}.
$$

The second and fourth rows cancel because input contributions have opposite signs; the first and third reinforce. The input has a repetition spacing of 2. The output has support only on Fourier labels 0 and 2. QFT has exposed a constraint, not printed the input values.

**Predict:** what changes for $(|01\rangle+|11\rangle)/\sqrt2$?

<details><summary>Show the calculation</summary>

Add columns 1 and 3: the output is $(2,0,-2,0)^T/(2\sqrt2)=(|00\rangle-|10\rangle)/\sqrt2$. The offset changes relative phases, while the same two labels still have probabilities $1/2$. The period information survives an unknown offset.

</details>

## A real gate circuit for the first example

The Hadamard gate is $H=\left(\begin{smallmatrix}1&1\\1&-1\end{smallmatrix}\right)/\sqrt2$. A controlled phase $\operatorname{CP}(\pi/2)$ multiplies $|11\rangle$ by $i$ and leaves the other basis states unchanged. SWAP exchanges the two bit positions. Starting with $|01\rangle$:

1. Apply $H$ to the **left** bit: $(|01\rangle+|11\rangle)/\sqrt2$.
2. Apply controlled phase: $(|01\rangle+i|11\rangle)/\sqrt2$.
3. Apply $H$ to the right bit. Since $H|1\rangle=(|0\rangle-|1\rangle)/\sqrt2$, the result is $(|00\rangle-|01\rangle+i|10\rangle-i|11\rangle)/2$.
4. SWAP: $(|00\rangle+i|01\rangle-|10\rangle-i|11\rangle)/2$.

This matches the matrix calculation entry by entry. Omitting the last SWAP changes bit ordering: the result then represents a bit-reversed QFT, not the stated $F_4$.

## General definition and inverse

For $N=2^n$, define

$$F_N|x\rangle={1\over\sqrt N}\sum_{y=0}^{N-1}e^{2\pi ixy/N}|y\rangle.$$

Here $x$ is the input integer label, $y$ is an output label, and $\sum$ means add one term for each integer in the stated range. The expression $e^{it}=\cos t+i\sin t$ is a unit-length phase; it is not a large real exponential. For $N=4$, the phase $e^{2\pi i/4}=i$ reproduces our matrix.

The inverse $F_N^\dagger$ uses the **negative** exponent. Applying inverse after forward gives the identity because an output entry contains

$$\frac1N\sum_{y=0}^{N-1}e^{2\pi i(x-z)y/N}.$$

If $x=z$, all terms are 1 and the sum is $N$. Otherwise the phases run around a regular polygon and cancel. Algebraically, for $r=e^{2\pi i(x-z)/N}\ne1$, multiplying the sum by $1-r$ gives $1-r^N=0$. This is a concrete finite sum, not an appeal to mysterious “parallelism.”

## Implementation and approximation

For each input bit, a Hadamard creates the first phase contribution, followed by controlled phases from later bits with angles $\pi/2,\pi/4,\ldots$. Final bit swaps match our integer labeling. There are $n$ Hadamards, $n(n-1)/2$ controlled rotations and $\lfloor n/2\rfloor$ swaps. Exact arbitrary-angle rotations are mathematical gates; a fault-tolerant gate set generally approximates them, with an accuracy and synthesis cost.

Small-angle rotations can be omitted to construct an approximate QFT with an explicit error tolerance. “Approximate” must refer to a bound on the transformation or output statistics, not merely a visually similar histogram. The tiny simulator uses the stated ordering and computes ideal amplitudes; its ability to display them is a classical-simulation privilege.

[Phase estimation](/lessons/phase-estimation/) supplies a phase ramp that the inverse QFT converts into a label. [Order finding](/lessons/order-finding/) supplies periodic cosets whose Fourier samples reveal a denominator. These are input structures for which a few output samples are useful.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Peter W. Shor, [Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer](https://arxiv.org/html/quant-ph/9508027), section 4: efficient Fourier transforms used in algorithms.
- IBM Quantum Learning, [The phase-estimation procedure](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure), QFT definition, unitarity and circuit subsections: educational derivation and ordering context.
