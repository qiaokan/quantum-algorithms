## Vector length counts total probability

For a complex vector $v=(v_0,\ldots,v_{D-1})^T$, its Euclidean norm is $\|v\|=\sqrt{\sum_j|v_j|^2}$. The bars give a complex number's magnitude. For $(3,4)^T$, the norm is five; dividing by five gives a normalized vector with probabilities $9/25$ and $16/25$. A state vector must have norm one before measurement.

## Matrix norm is worst-case stretch

The operator norm is $\|A\|=\max_{\|v\|=1}\|Av\|$: the largest factor by which $A$ can stretch a normalized input. For $A=\operatorname{diag}(2,1/2)$, unit vector $(1,0)^T$ becomes $(2,0)^T$, so the maximum stretch is two. The smallest stretch is $1/2$, on $(0,1)^T$.

These stretches are the largest and smallest [singular values](/definitions/singular-values/). For invertible $A$, the condition number is $\kappa=\sigma_{\max}/\sigma_{\min}$. The example has $\kappa=2/(1/2)=4$. Large $\kappa$ means the matrix treats some directions very differently; inversion magnifies errors along small-singular-value directions.

## Why algorithms track these quantities

A block encoding of $A/\alpha$ needs $\alpha\geq\|A\|$, since a selected block of a unitary cannot increase a normalized vector's length above one. Success probability on input $|\psi\rangle$ is $\|A|\psi\rangle\|^2/\alpha^2$.

If $\|U-V\|\leq\epsilon$, then for every normalized input $\|(U-V)|\psi\rangle\|\leq\epsilon$. This is a uniform state-vector error bound. For products of ideal unitaries and approximations, a telescoping expansion often bounds total operator error by the sum of individual errors. It does not equate operator error, probability error, and physical noise without further analysis.

Return to the originating algorithm: identify which norm is being used, what matrix is scaled, and whether the promised lower singular-value bound actually holds.
