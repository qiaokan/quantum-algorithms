## Trace is a sum of diagonal entries

For a square matrix $A$, $\operatorname{Tr}(A)=\sum_jA_{jj}$. Thus the trace of $\begin{pmatrix}3/4&1/8\\1/8&1/4\end{pmatrix}$ is one. Off-diagonal entries contribute no direct term to this sum. A density matrix has trace one because its computational-basis probabilities must sum to one.

For a state $\rho$ and observable $M$, the expected measurement value is $\operatorname{Tr}(M\rho)$. If $M=Z=\operatorname{diag}(1,-1)$ and $\rho=\operatorname{diag}(3/4,1/4)$, multiply to get $M\rho=\operatorname{diag}(3/4,-1/4)$, then trace to obtain $1/2$. This is also $(+1)(3/4)+(-1)(1/4)$.

## Ignoring a register means partial trace

For a bipartite state, the partial trace over a register adds matrix blocks with equal labels on that register. It is not a sum of state-vector amplitudes. Consider

$$|\Psi\rangle=(2|00\rangle+|11\rangle)/\sqrt5.$$

Its density matrix contains diagonal terms $4|00\rangle\langle00|/5$ and $|11\rangle\langle11|/5$, plus cross terms $2|00\rangle\langle11|/5$ and its adjoint. Ignoring the second register retains the diagonal terms as $4|0\rangle\langle0|/5$ and $|1\rangle\langle1|/5$. Cross terms vanish because their second-register labels are orthogonal: $\langle1|0\rangle=0$. The remaining state is the mixture $\operatorname{diag}(4/5,1/5)$.

This differs from the pure vector $(2,1)^T/\sqrt5$, whose density matrix has off-diagonal entries $2/5$. They share one basis's probabilities but differ under other measurements.

## Thermal normalization

For a Hamiltonian $H$ and inverse temperature $\beta$, the Gibbs state is $e^{-\beta H}/Z_\beta$, where $Z_\beta=\operatorname{Tr}(e^{-\beta H})$ is the partition function. For $H=\operatorname{diag}(0,1)$ and $\beta=\log4$, the unnormalized diagonal entries are $1,1/4$, with trace $5/4$. Dividing yields probabilities $4/5,1/5$.

Return to the algorithm with this distinction: trace normalizes a matrix or computes an expectation; partial trace describes ignoring a subsystem. Neither operation prints an unknown quantum state for free.
