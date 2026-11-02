## Functions of a matrix use matrix products

For a square matrix $A$, $A^2=AA$ and $A^3=AAA$; these are [row-by-column matrix products](/definitions/matrix-multiplication/), not entrywise powers. A polynomial $p(x)=c_0+c_1x+c_2x^2$ becomes $p(A)=c_0I+c_1A+c_2A^2$, where $I$ is the identity matrix.

The exponential is defined by the convergent series

$$e^A=I+A+A^2/2!+A^3/3!+\cdots.$$

The factorial $k!$ is $1\cdot2\cdots k$; by convention $0!=1$. A finite sum is a Taylor approximation. Its discarded tail must be bounded; a polynomial truncation of a unitary exponential is generally not exactly unitary.

## Calculate an example

Let $X=\begin{pmatrix}0&1\\1&0\end{pmatrix}$. Then $X^2=I$, $X^3=X$, and the powers alternate. The even terms in $e^{-iXt}$ sum to $\cos t\,I$; the odd terms sum to $-i\sin t\,X$. Thus

$$e^{-iXt}=\begin{pmatrix}\cos t&-i\sin t\\-i\sin t&\cos t\end{pmatrix}.$$

At $t=\pi/2$, this equals $-iX$. Applied to $(1,0)^T$, it gives $(0,-i)^T$, so measurement returns one certainly. This algebra explains a gate's action; each equality is not another gate.

## Eigenvalues give another interpretation

If $A|v\rangle=\lambda|v\rangle$, repeated multiplication gives $A^k|v\rangle=\lambda^k|v\rangle$. Substituting into the polynomial or exponential series gives $f(A)|v\rangle=f(\lambda)|v\rangle$. For a Hermitian matrix with an orthonormal eigenbasis, a function acts separately on those eigenvalues. A diagonal matrix makes this literal: $e^{\operatorname{diag}(1,2)}=\operatorname{diag}(e,e^2)$.

A matrix square root in these lessons means the nonnegative square root of a positive semidefinite matrix: diagonalize it and take nonnegative square roots of its eigenvalues. For $\operatorname{diag}(1,1/4)$ the result is $\operatorname{diag}(1,1/2)$.

Entrywise exponentiation is different. Also, $e^{A+B}=e^Ae^B$ need not hold when $AB\ne BA$. Product-formula simulation exists to control exactly that difference. Return to the algorithm's matrix function with the input/output eigencomponents and the approximation budget kept explicit.
