## Problem and the two distinct transformations

The goal remains estimating $\phi$ in $U|u\rangle=e^{2\pi i\phi}|u\rangle$. Two related ideas are often conflated:

- **Semiclassical Fourier measurement** replaces a QFT immediately followed by measurement with single-qubit measurements and classically controlled phase corrections. It preserves those measurement statistics, not a coherent QFT output for later quantum computation.
- **Iterative phase estimation** schedules controlled powers and those measurement corrections so one counting qubit can be reset and reused. The target eigenstate must remain available, or suitable preparation must be repeated with care.

[Griffiths and Niu](https://arxiv.org/html/quant-ph/9511007) establish the first transformation. [Dobšíček and collaborators](https://arxiv.org/html/quant-ph/0610214) describe the single-ancilla QFT-based iterative version and distinguish it from Kitaev's statistical phase-estimation approach.

## A binary-fraction bridge

The phase $3/8$ is the binary fraction $0.011_2$: the subscript 2 means base two, and its value is $0/2+1/4+1/8$. Write a general exact three-bit phase as $0.b_1b_2b_3$, where each $b_j$ is 0 or 1. Multiplying by 4 moves the binary point: the fractional part is $0.b_3$. Whole turns do not affect $e^{2\pi i\phi}$.

That is why we can learn the last bit first using $U^4$. Subsequent rounds subtract the fractional contribution of the bits already learned. The bit positions in the final answer remain most-significant-first; the measurement order is reversed.

## Three rounds, with every control state

Use the same eigenstate with phase $\phi=3/8$ as [the previous lesson](/lessons/phase-estimation/). A control starts at $|0\rangle$ every round. A Hadamard, controlled $U^k$, correction phase, final Hadamard and measurement form one round.

**Round 1: determine $b_3$.** Use $k=4$. The control becomes

$$\frac{|0\rangle+e^{2\pi i(4\cdot3/8)}|1\rangle}{\sqrt2}
=\frac{|0\rangle-|1\rangle}{\sqrt2}.$$

No correction is needed. The final Hadamard gives $|1\rangle$, so $b_3=1$.

**Round 2: determine $b_2$.** Reset and use $k=2$. The control is $(|0\rangle-i|1\rangle)/\sqrt2$ because $2\phi=3/4$. The known last bit contributes $1/4$ of a turn to this phase. Multiply the 1 amplitude by $e^{-2\pi i/4}=-i$. Its old factor $-i$ becomes $(-i)(-i)=-1$. The control is again $(|0\rangle-|1\rangle)/\sqrt2$, and measurement after $H$ yields $b_2=1$.

**Round 3: determine $b_1$.** Reset and use $k=1$. The 1 amplitude has factor $e^{2\pi i3/8}$. The known bits contribute $b_2/4+b_3/8=3/8$. Apply correction $e^{-2\pi i3/8}$. Their product is 1. The control is $|+\rangle$, the final Hadamard gives $|0\rangle$, and $b_1=0$.

The measurements arrived as 1,1,0. Assemble them as $b_1b_2b_3=011$, then output $3/8$. Reading them in arrival order would incorrectly produce $6/8$.

## Why classical feed-forward is valid here

In an inverse-QFT circuit, a qubit that is ready for its final computational-basis measurement subsequently controls only phase operations on other qubits. Measuring that control now and selecting the corresponding phase classically reproduces the same branch probabilities. There is no need to preserve coherence between branches that will never interfere again.

For example, a controlled phase applies $I$ on branch 0 and a known phase gate on branch 1. If that control is immediately measured in the 0/1 basis, the target conditional state is exactly the state obtained by measuring first and then applying the selected gate. This argument fails if later operations recombine the control's branches.

**Predict:** can this replace the inverse QFT inside a larger algorithm that needs an unmeasured phase register?

<details><summary>Show the answer</summary>

No. Measurement discards coherence between phase-register outcomes. Matching the final measurement distribution does not imply matching the intermediate quantum state. HHL-style coherent phase processing, for example, needs a different analysis before substituting measurements.

</details>

## Nonexact phases and repeated experiments

For a residual phase $\varphi$ after correction, the final control probabilities are $(1+\cos(2\pi\varphi))/2$ and $(1-\cos(2\pi\varphi))/2$. Exact-bit residuals are 0 or $1/2$ and deterministic. If a round leaves $\varphi=1/6$, then $\cos(\pi/3)=1/2$, so outcomes 0 and 1 have probabilities $3/4$ and $1/4$. A wrong early bit can alter later correction choices.

The adaptive procedure with one measurement per bit reproduces the corresponding QFT measurement statistics. Repetition and confidence bounds must account for the full adaptive algorithm. Repeated measurements of a phase on an eigenstate are legitimate because that state is unchanged up to phase. Repreparing a superposition independently each round may select inconsistent eigenphases; one cannot combine arbitrary bits from different eigenstates into one answer.

Kitaev-style estimation instead estimates sine and cosine of doubled phases through repeated controlled-unitary experiments and uses classical reconstruction. It is not the identical feed-forward bit-extraction circuit, despite also allowing a small counting register.

## Resources and baseline

Using one counting qubit saves $m-1$ qubits relative to an $m$-qubit counting register, but the target register remains. Controlled powers still cost $2^m-1$ base-$U$ applications for one full exact-bit run unless a justified shortcut exists. Reset, measurement latency, feed-forward, repetitions and maintaining the target state add engineering costs. Width savings are not an exponential runtime gain.

For a known tiny explicit matrix, classical eigenvalue calculation is still the appropriate baseline. In large simulation problems, the question is whether preparing the target and implementing long controlled evolution are feasible. The method changes the resource tradeoff, not the underlying problem's input model.

## Connections

The circuit explains why measured Fourier transforms can be cheaper than coherent ones. [Order finding](/lessons/order-finding/) can use iterative phase ideas because it ultimately wants classical samples. [Amplitude estimation](/lessons/amplitude-estimation/) has its own iterative variants; those often avoid QPE entirely and instead fit Grover success probabilities. Sharing the adjective “iterative” does not make them the same algorithm.

## Reproduce the calculation

Download the [standalone numerical checks](/examples/search-fourier-checks.py) and run `python3 search-fourier-checks.py`. They use only Python’s standard library, construct the relevant vectors and transformations, and check normalization without silently renormalizing. They test the tiny ideal examples; they are not hardware runs or scalable implementations of every general algorithm.

## References

- Robert B. Griffiths and Chi-Sheng Niu, [Semiclassical Fourier Transform for Quantum Computation](https://arxiv.org/html/quant-ph/9511007): measurement/feed-forward replacement for a terminal Fourier transform.
- Miroslav Dobšíček, Göran Johansson, Vitaly Shumeiko and Göran Wendin, [Arbitrary accuracy iterative phase estimation algorithm as a two qubit benchmark](https://arxiv.org/html/quant-ph/0610214): single-ancilla QFT-based iteration, exact binary phases and distinction from Kitaev's procedure.
