## Meaning and a calculation

A derivative describes how a quantity changes per small change of its input. If $f(x)=x^2$, changing x from 2 to 2.01 changes f from 4 to 4.0401. The ratio is 0.0401/0.01=4.01. As the change shrinks, the ratio approaches 4, written $f'(2)=4$. The prime marks a derivative; it does not mean a different function chosen arbitrarily.

For general x, $( (x+h)^2-x^2)/h=2x+h$, which approaches 2x as h approaches zero. This gives $f'(x)=2x$. A gradient is the list of such derivatives when there are several input parameters.

If a parameter obeys $d\theta/dt=-\sin\theta$, a small step h gives $\theta(t+h)\approx\theta(t)-h\sin\theta(t)$. At θ=π/2 and h=0.1, the update is approximately 1.470796. It is approximate: the derivative changes during the step. Smaller steps reduce discretization error but require more updates. We use this in imaginary-time parameter evolution and variational optimization; a derivative formula is classical mathematical information, not a free quantum measurement.
