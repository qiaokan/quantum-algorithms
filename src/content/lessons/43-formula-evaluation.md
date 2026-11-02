## Problem and access model

A **Boolean formula** is a tree: input bits occupy the leaves, and each internal node applies a Boolean gate to its children. The formula is known; the leaf values are hidden. NAND means “not both”: $\operatorname{NAND}(a,b)=1-ab$ for bits $a,b$. We will evaluate

$$f(x)=\operatorname{NAND}(\operatorname{NAND}(x_1,x_2),\operatorname{NAND}(x_3,x_4))=(x_1\land x_2)\lor(x_3\land x_4).$$

Here $x=(x_1,x_2,x_3,x_4)$ is an unknown four-bit string, $\land$ means AND, and $\lor$ means OR. There is no promise on $x$. The output is one classical bit agreeing with $f(x)$ with a stated error bound.

The input is a coherent [bit oracle](/definitions/oracles/): $O_x|j,b\rangle=|j,b\mathbin{\oplus}x_j\rangle$, where $j\in\{1,2,3,4\}$ addresses a leaf, $b$ is a one-bit register, and $\oplus$ is addition modulo two. In a two-qubit address register, encode $j$ as the binary representation of $j-1$. This oracle is input-dependent; everything else below is fixed before the bits are known.

We use a **discrete span-program algorithm**, with phase estimation of two reflections. This differs from an incoming wavepacket in the original Hamiltonian NAND-tree algorithm. [Reichardt and Špalek](https://arxiv.org/html/0710.2630) connect span programs, formulas, and spectral estimation; [Reichardt](https://arxiv.org/html/1005.1601) develops the two-reflection query algorithm. The matrices, finite resolution, and error constants below are an independently derived teaching instance. They evaluate every possible four-bit input; they are not an optimized implementation of the large-tree theorem.

## Classical baseline

For our worked input $x=1101$, the lower NANDs are $0$ and $1$, so the root is $1$. The first AND already certifies this: a classical algorithm that reads $x_1$ and $x_2$ first can stop after two queries. Reading all four bits always suffices, with no error. Our deliberately conservative quantum circuit will use **84** bit-oracle calls. It loses on this tiny instance.

The asymptotic comparison concerns a family of large balanced binary trees. Their optimized quantum evaluation uses $O(\sqrt N)$ coherent leaf queries, while the classical randomized query complexity is $\Theta(N^{\log_2((1+\sqrt{33})/4)})$, approximately $\Theta(N^{0.754})$, for the balanced binary AND-OR/NAND family. This compares against randomized pruning, not just naive traversal. Fixed computation between queries must still be implemented. These model distinctions and results are reviewed in the [primary formula-evaluation paper](https://arxiv.org/html/0710.2630).

## Turn the logical question into a span question

A **linear combination** of vectors is a sum of scaled vectors. For example,

$$1\begin{pmatrix}1\\1\\0\end{pmatrix}-1\begin{pmatrix}0\\1\\0\end{pmatrix}=\begin{pmatrix}1\\0\\0\end{pmatrix}.$$

The **span** of a collection is the set of every linear combination of its vectors. A **span program** specifies a target vector and input-labelled vectors; it accepts when the available vectors span the target. Availability is determined by input bits. This describes a function, not yet a quantum operation.

Use target $t$ and input vectors

$$t=\begin{pmatrix}1\\0\\0\end{pmatrix},\quad v_1=\begin{pmatrix}1\\1\\0\end{pmatrix},\quad v_2=\begin{pmatrix}0\\1\\0\end{pmatrix},\quad v_3=\begin{pmatrix}1\\0\\1\end{pmatrix},\quad v_4=\begin{pmatrix}0\\0\\1\end{pmatrix}.$$

Vector $v_j$ is available exactly when $x_j=1$. If the first pair is available, $v_1-v_2=t$. If the second pair is available, $v_3-v_4=t$. Conversely, suppose $a_1v_1+a_2v_2+a_3v_3+a_4v_4=t$, with unavailable coefficients forced to zero. Comparing coordinates gives

$$a_1+a_3=1,\qquad a_1+a_2=0,\qquad a_3+a_4=0.$$

At least one of $a_1,a_3$ is nonzero. If $a_1\ne0$, then $a_2=-a_1\ne0$, requiring both first-pair bits. If $a_3\ne0$, both second-pair bits are required. This span question is exactly $f(x)$.

For $1101$, $v_1-v_2$ is a **witness**: explicit coefficients proving acceptance. For $1010$, only $v_1,v_3$ are available; cancelling the second and third coordinates forces both coefficients to zero, so they cannot produce $t$.

We needed this encoding so the logical answer could become a property of a fixed matrix and input-dependent signs. We now construct the actual unitary.

## The fixed reflection

Our quantum work register uses five basis states, ordered $|0\rangle,|1\rangle,|2\rangle,|3\rangle,|4\rangle$. These are **labels for columns**, not the three coordinates of the span-program vectors. Embed them in three qubits as $000,001,010,011,100$. Unused labels $101,110,111$ never receive amplitude.

Append a target column scaled by $1/2$:

$$A=[t/2\;v_1\;v_2\;v_3\;v_4]=\begin{pmatrix}1/2&1&0&1&0\\0&1&1&0&0\\0&0&0&1&1\end{pmatrix}.$$

The **kernel** of $A$ consists of five-entry vectors $w$ with $Aw=0$. Solving its three row equations gives two spanning vectors

$$q_1=(2,-1,1,0,0)^T,\qquad q_2=(2,0,0,-1,1)^T.$$

Here $T$ means transpose, so the lists represent columns. For example, $Aq_1=(1-1,-1+1,0)^T=0$. A **projector** onto a subspace keeps the component in that subspace and removes the perpendicular component. Write $Q=[q_1\;q_2]$. The two vectors are not perpendicular, so their projector is not simply the sum of their normalized outer products. Calculate

$$G=Q^TQ=\begin{pmatrix}6&4\\4&6\end{pmatrix},\qquad G^{-1}=\frac1{20}\begin{pmatrix}6&-4\\-4&6\end{pmatrix},\qquad \Lambda=QG^{-1}Q^T.$$

Multiplying $G$ by the displayed inverse gives identity because $36-16=20$ and $24-24=0$. Consequently $\Lambda Q=Q$, while $Q^Tw=0$ implies $\Lambda w=0$. This establishes the desired projector.

A **reflection** about this kernel preserves kernel components and negates perpendicular components. Its matrix is $R=2\Lambda-I$, where $I$ is identity:

$$R=\frac15\begin{pmatrix}3&-2&2&-2&2\\-2&-2&-3&-2&2\\2&-3&-2&2&-2\\-2&-2&2&-2&-3\\2&2&-2&-3&-2\end{pmatrix}.$$

For example, $\Lambda_{00}=(2,2)G^{-1}(2,2)^T=4/5$, so $R_{00}=3/5$. Because $\Lambda^2=\Lambda$, we get $R^2=4\Lambda^2-4\Lambda+I=I$. The real symmetric matrix $R$ preserves vector lengths and is a valid [unitary](/definitions/unitarity/). Extend it by identity on unused labels.

## The input reflection and the leaf encoding

Let $\Pi_x$ keep label $0$ and every label $j$ whose bit is one. On the five used labels it is diagonal with entries $(1,x_1,x_2,x_3,x_4)$. Its reflection is

$$D_x=2\Pi_x-I=\operatorname{diag}(1,2x_1-1,2x_2-1,2x_3-1,2x_4-1).$$

A false leaf changes its label's amplitude sign; a true leaf leaves it unchanged. Label $0$ is always unchanged. The walk step is

$$U_x=R D_x.$$

Products act right-to-left: apply the input signs, then mix amplitudes with $R$. Both factors are unitary; no renormalization is needed. For $1101$, $D_x=\operatorname{diag}(1,1,1,-1,1)$: only label $3$ changes sign. This is the full leaf encoding, not a classical formula evaluation hidden inside an oracle.

To implement controlled $D_x$, reversibly compute the leaf address from the work label into an address register; for label $0$ or unused labels use a dummy valid address. Query the bit into a clean auxiliary bit. Apply a minus sign exactly when the outer control is one, the work label is valid and nonzero, and the queried bit is zero. Query $O_x$ again to erase the bit, then erase the address computation. This gives the required sign with all auxiliary registers reset. It uses **two** bit-oracle calls. It does not assume a controlled unknown oracle is free; only the known phase operation is controlled. Extend $D_x$ by identity on unused labels.

The two-reflection construction in [Reichardt's Section 2](https://arxiv.org/html/1005.1601) uses the opposite ordering. Reversing two reflections takes the inverse unitary, negating its eigenphases; zero-phase detection is unchanged. Our target scale and finite error analysis are specific to this example.

## Why the answer appears at zero phase

An eigenvector with eigenvalue $1=e^{2\pi i\cdot0}$ has **zero eigenphase**: repeated steps do not change it. If $x_1=x_2=1$, both reflections fix $q_1$: it is in the kernel of $A$, and all its nonzero labels are available. Thus $U_xq_1=q_1$. Its squared length is $4+1+1=6$, and the squared overlap of the easily prepared $|0\rangle$ with $q_1/\sqrt6$ is

$$\left|\langle0|\frac{q_1}{\sqrt6}\rangle\right|^2=\frac46=\frac23.$$

The second pair gives the same result using $q_2$. Every true input has at least $2/3$ of the initial state's probability weight in the zero-phase subspace.

For a false input, a common fixed vector of both reflections with nonzero label-$0$ amplitude would give a target witness using available columns, contradicting the span calculation. A vector negated by both reflections also has walk eigenvalue $1$, but is perpendicular to the always-available $|0\rangle$. Thus false inputs have no accessible *exact* zero phase. This uses the product-of-reflections decomposition: its eigenvalue-one space consists of the common fixed and common negated subspaces.

That is insufficient alone: finite phase estimation can confuse a nearby phase with zero. We must calculate that leakage.

## Complete eight-bin phase estimation

Prepare three phase qubits and three work qubits in $|000\rangle|000\rangle$. Three Hadamards on the phase register give

$$\frac1{\sqrt8}\sum_{k=0}^7|k\rangle|0\rangle.$$

For the phase bits in big-endian order, apply controlled $U_x^4$, controlled $U_x^2$, and controlled $U_x$. Repeat the base step to implement each power. A branch labelled $k=4k_2+2k_1+k_0$ acquires $U_x^k$, giving

$$\frac1{\sqrt8}\sum_{k=0}^7|k\rangle \psi_k,\qquad \psi_k=U_x^k|0\rangle.$$

Here $\psi_k$ (psi subscript $k$) is a work-register vector, not a bit. There are $4+2+1=7$ base steps, not three queries. After the first controlled power, labels $0,1,2,3$ carry $\psi_0$ and $4,5,6,7$ carry $\psi_4$, all with factor $1/\sqrt8$. After the second, labels $0,1$ carry $\psi_0$, $2,3$ carry $\psi_2$, $4,5$ carry $\psi_4$, and $6,7$ carry $\psi_6$. The last control produces the eight individual $\psi_k$.

For $x=1101$, the first two multiplications are

$$\psi_1=R|0\rangle=\frac15(3,-2,2,-2,2)^T,$$

$$\psi_2=R\frac15(3,-2,2,2,2)^T=\frac1{25}(17,-8,8,-8,-12)^T.$$

In the second line $D_x$ first flips the fourth entry. The first row of the multiplication is $3(3)-2(-2)+2(2)-2(2)+2(2)=17$. The same row-by-column operation produces every entry below. Each row is the listed integer vector **divided by $5^k$**:

| $k$ | Integer numerator of $\psi_k$ | Denominator |
|---|---|---|
| 0 | $(1,0,0,0,0)$ | 1 |
| 1 | $(3,-2,2,-2,2)$ | 5 |
| 2 | $(17,-8,8,-8,-12)$ | 25 |
| 3 | $(43,-82,82,18,2)$ | 125 |
| 4 | $(497,-128,128,272,-192)$ | 625 |
| 5 | $(2163,-962,962,638,1682)$ | 3125 |
| 6 | $(14977,-648,648,-4248,-972)$ | 15625 |
| 7 | $(37083,-41042,41042,-32942,16562)$ | 78125 |

For example, $\psi_1$ is normalized because $(9+4+4+4+4)/25=1$. All rows are normalized. This inspection is a classical simulator privilege; the circuit does not measure these vectors.

Apply the [inverse QFT](/lessons/qft/) to the phase register, with matrix entry $8^{-1/2}e^{-2\pi i ky/8}$ from input label $k$ to output label $y$. Combining this with the preparation factor gives final state

$$\sum_{y=0}^7|y\rangle b_y,\qquad b_y=\frac18\sum_{k=0}^7e^{-2\pi i ky/8}\psi_k,\qquad p_y=\|b_y\|^2.$$

The squared norm sums the squared absolute values of the five entries. It is the probability of measuring phase label $y$, with the work register unmeasured. The original work state is not an eigenvector; this formula handles its whole superposition.

For $y=0$, all Fourier weights are $1$. Adding table columns gives

$$b_0=\frac1{78125}(54146,-23979,23979,-6154,3094)^T,$$

$$p_0=\frac{54146^2+2(23979)^2+6154^2+3094^2}{78125^2}=\frac{52854}{78125}=0.6765312.$$

For $y=4$, the weights are $(-1)^k$, giving

$$b_4=\frac1{78125}(12919,12919,-12919,3094,-19684)^T,\qquad p_4=0.1470848.$$

Amplitudes for the *same work label and phase outcome* add with these Fourier weights. Probabilities from distinct work labels then add; their amplitudes do not. The full measured distribution is

| Phase label $y$ | Binary result | Probability for $1101$ |
|---|---|---|
| 0 | 000 | 0.6765312000 |
| 1 | 001 | 0.0450052728 |
| 2 | 010 | 0.0369920000 |
| 3 | 011 | 0.0061947272 |
| 4 | 100 | 0.1470848000 |
| 5 | 101 | 0.0061947272 |
| 6 | 110 | 0.0369920000 |
| 7 | 111 | 0.0450052728 |

These sum to one. The measured number estimates a walk eigenphase; it is not the formula's Boolean value. We only retain “was $y=0$?”

## Finite error bound and the final classical answer

For this fixed four-bit problem we can verify soundness exhaustively. Every entry of $U_x$ is rational, so

$$p_0(x)=\left\|\frac18\sum_{k=0}^7 U_x^k|0\rangle\right\|^2$$

is exactly computable. The table groups **all sixteen inputs** by this calculation:

| Inputs | $f(x)$ | Exact $p_0(x)$ |
|---|---|---|
| 0000 | 0 | $1764/78125$ |
| 0001, 0010, 0100, 1000 | 0 | $406/78125$ |
| 0101, 0110, 1001, 1010 | 0 | $3136/78125$ |
| 0011, 1100 | 1 | $52436/78125$ |
| 0111, 1011, 1101, 1110 | 1 | $52854/78125$ |
| 1111 | 1 | $4/5$ |

True inputs have $p_0\ge2/3$; false inputs have $p_0\le3136/78125<1/24$. Nonzero false-input probabilities are finite-resolution leakage. Exhaustive arithmetic certifies this finite example; it is not proposed preprocessing for an exponentially large truth table.

Run six trials, freshly preparing both registers each time. Let $Z$ count the trials whose phase result is zero. Output $1$ if $Z\ge2$, and $0$ otherwise. For a true input, failure means zero or one zero-labelled trial. Independence and $p_0\ge2/3$ give

$$\Pr[Z<2]\le(1/3)^6+6(2/3)(1/3)^5=13/729<0.018.$$

For a false input, erroneous acceptance includes a pair of zero-labelled trials. There are $\binom62=15$ pairs; each has probability at most $(1/24)^2$. Adding their probabilities may overcount events, which is safe for an upper bound:

$$\Pr[Z\ge2]\le15(1/24)^2=5/192<0.027.$$

The final Boolean answer is correct with probability at least $187/192$ on every input. For $1101$, the exact false-negative probability is $(1-p_0)^6+6p_0(1-p_0)^5\approx0.01552027$, so the algorithm outputs $1$ with probability about $98.448\%$.

**Predict:** Why not accept if any one of the six trials gives zero?

<details><summary>Show the answer</summary>

That raises false acceptance to $1-(1-p_0)^6$. For false input $0101$, $p_0\approx0.04014$ gives about $0.218$ error. Repetition needs a threshold appropriate to both distributions; it is not automatically amplification.

</details>

## Implementation, cost, and precision

Six trials use $6\cdot7=42$ controlled walk steps, each with one controlled $R$ and two bit-oracle calls for $D_x$. The total is **84 bit-oracle calls**, plus six three-qubit inverse QFTs and fixed address/phase logic. Phase and work registers use six qubits, with additional oracle-address and scratch registers. Oracle construction is separate: providing coherent access to classical data is not free in a larger problem.

The fixed $R$ does not require any leaf queries to compile. A finite compilation recipe eliminates matrix entries below the diagonal with two-coordinate rotations. If the current pivot and lower entry are $a,b$, set $r=\sqrt{a^2+b^2}$ and multiply their two rows by

$$G=\begin{pmatrix}a/r&b/r\\-b/r&a/r\end{pmatrix}.$$

This maps $(a,b)^T$ to $(r,0)^T$; skip a pair with $a=b=0$. For the first pair in $R$, $a=3/5,b=-2/5$, so the entries are $3/\sqrt{13}$ and $-2/\sqrt{13}$. At most ten rotations triangularize a real five-dimensional matrix. A triangular orthogonal matrix is diagonal with entries $\pm1$. Starting with these signs, reverse the elimination order and invert each rotation to implement $R$. Each rotation acts on two known three-qubit basis labels. Reversible basis permutations map that pair to labels differing in one bit, allowing a controlled one-qubit rotation, after which the permutation is undone. This is constant-size compilation here; the downloaded check constructs the elimination and verifies the reconstructed matrix.

The probability bounds assume ideal gates and an exact bit oracle. An explicit synthesis budget is also possible. Suppose each of the 42 controlled-$R$ blocks and six inverse-QFT blocks has [operator-norm](/definitions/norms/) error at most $10^{-4}$, with other operations exact. Total measurement-distribution error is at most $48\cdot10^{-4}=0.0048$: replacing one unitary changes a normalized state by at most that operator error; inserting replacements one at a time adds these differences. Measurement probability variation is at most the resulting state-distance bound. The wrong-answer probability is below $5/192+0.0048<0.031$. This is a logical synthesis budget, not a physical-noise analysis or a fault-tolerant resource estimate.

## Generalization and the boundary of this construction

The mechanism is: encode a target-span question, reflect about a fixed kernel and the available labels, then distinguish accessible zero phase from nonzero phase. Formula structure determines the fixed reflection; unknown bits appear only in the leaf reflection. Coherent dynamics reveal the global answer without evaluating each internal gate classically.

Larger AND-OR formulas admit compositional encodings. One elementary construction represents a true input leaf as an available edge between two terminals. For AND, join subgraphs in series; for OR, join them in parallel. The terminals are connected exactly when the formula is true. Give each directed edge $u\to v$ the vector $e_u-e_v$, where $e_u$ has one in coordinate $u$ and zero elsewhere. Use target $e_s-e_t$ for terminal vertices $s,t$. Along a path, edge vectors add to the target because internal coordinates cancel. If the terminals are disconnected, summing coordinates over the component containing $s$ gives zero on every available edge vector but one on the target, proving the target cannot be spanned. Thus this is a family of encodings, not a four-input coincidence. De Morgan's laws can push negations to leaves; a negated literal reverses that leaf's availability test.

However, eight bins and target scale $1/2$ are **not universal settings**. Target scale controls overlap with true witnesses; formula geometry controls the smallest distinguishable phases. Efficient algorithms select weights and resolution using quantitative witness bounds. Naively compiling a dense kernel projector can also cost much more than its query count suggests. The primary papers analyze optimized constructions and their different query/time guarantees. This chapter establishes a complete finite discrete algorithm and its measured output; it does not derive their optimal asymptotic constants or gate-efficient implementation for arbitrary formulas.

Do not transfer the balanced NAND exponent to every Boolean gate set. Shape, gate set, repeated leaves, and access model matter. Also, “there is a zero eigenvector” is insufficient without initial overlap, and “there is no zero eigenvector” is insufficient without finite-resolution leakage control. Our two probability bounds address exactly those failure modes.

## Connections and practice

The product of reflections recalls [Grover](/lessons/grover/), but the readout is spectral rather than a marked-label measurement. [Phase estimation](/lessons/phase-estimation/) translates that spectrum into labels. [Continuous walks](/lessons/continuous-walks/) offer another route from graph spectra to computation; they do not make this discrete query count a Hamiltonian evolution time. [Quantum backtracking](/lessons/quantum-backtracking/) uses a tree-dependent walk whose tree represents a search procedure rather than a fixed logical formula.

**Exercise:** For $x=0011$, exhibit a normalized zero-phase vector and calculate its overlap with $|0\rangle$.

<details><summary>Show the answer</summary>

Use $q_2/\sqrt6=(2,0,0,-1,1)^T/\sqrt6$. Its nonzero labels are available, and $Aq_2=0$, so both reflections preserve it. Its overlap squared is $4/6=2/3$. Finite phase estimation collects additional nearby-phase leakage, giving the table's slightly larger $p_0=52436/78125$.

</details>

**Exercise:** Why must auxiliary oracle bits be erased before the next walk step?

<details><summary>Show the answer</summary>

Otherwise the state is $\sum_j a_j|j\rangle|x_j\rangle$, rather than a clean sign-modified work state times a fixed auxiliary state. Mixing work labels with $R$ acts on different auxiliary components, changing the intended interference. The second query restores the auxiliary bit to zero while retaining the phase. This is why the clean bit-oracle implementation costs two calls.

</details>

The runnable [exact-arithmetic example and checks](/examples/nand-checks.py) reproduce the matrix construction, all intermediate states, the sixteen-input certificate, final binomial errors, oracle cleanup, and rotation compilation. The full Fourier distribution uses complex floating-point arithmetic; the zero-bin certificate and decision bounds use exact fractions. These are executed classical ideal simulations, not hardware observations.

## References

- Ben W. Reichardt and Robert Špalek, [Span-program-based quantum algorithm for evaluating formulas](https://arxiv.org/html/0710.2630): span programs, composition, spectral evaluation, and balanced NAND/AND-OR query comparisons. Relevant full-text sections inspected.
- Ben W. Reichardt, [Reflections for quantum query algorithms](https://arxiv.org/html/1005.1601): fixed/input-dependent reflections, zero-phase detection, and the distinction between query complexity and implementing the fixed reflection. Relevant full-text construction and analysis inspected. The specific matrices and finite certificate are derived here.
