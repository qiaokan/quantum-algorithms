## Meaning and a calculation

A Hermitian matrix M is positive semidefinite when $v^\dagger Mv\ge0$ for every vector v. The dagger means [conjugate transpose](/definitions/conjugate-transpose/). For $M=\operatorname{diag}(2,0)$ and $v=(a,b)^T$, the expression is $2|a|^2$, never negative. Zero eigenvalues are allowed; “positive definite” requires strict positivity for every nonzero v.

For $M=\begin{pmatrix}1&2\\2&1\end{pmatrix}$, choose $v=(1,-1)^T$. Then Mv=(−1,1), and $v^TMv=-2$, so M is not positive semidefinite despite all its entries being positive. Entrywise positivity and matrix positivity differ.

A [density matrix](/definitions/density-matrices/) must be positive semidefinite so every measurement probability is nonnegative. A classical kernel matrix must satisfy this property for the standard kernel optimization guarantees. Noisy estimates can violate it; correcting the eigenvalues changes the estimator and should be reported.
