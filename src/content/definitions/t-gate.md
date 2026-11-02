The T gate is the single-qubit phase gate $T=\mathrm{diag}(1,e^{i\pi/4})$. It leaves $|0\rangle$ alone and multiplies the amplitude of $|1\rangle$ by $e^{i\pi/4}=(1+i)/\sqrt2$. Applying it twice gives $S=\mathrm{diag}(1,i)$, and four times gives $Z$.

Worked: $T(0.6|0\rangle+0.8|1\rangle)=0.6|0\rangle+0.8e^{i\pi/4}|1\rangle=0.6|0\rangle+(0.5657+0.5657i)|1\rangle$. The probabilities stay 0.36 and 0.64; only the relative phase changes. T is not a Clifford gate: $TXT^\dagger=(X+Y)/\sqrt2$ is not a single Pauli string. Adding T to the Clifford gates gives a universal gate set.

On a surface-code processor T cannot be applied directly to a patch, so each one consumes a magic state. That is why resource estimates count T (or Toffoli) gates. Return to the parent lesson and count the T gates in the circuit.

## Reference

[Boykin et al. (1999)](https://arxiv.org/abs/quant-ph/9906054) prove that Hadamard, CNOT and $\sigma_z^{1/4}$ (T up to a global phase) form a universal basis; [Bravyi and Kitaev (2005)](https://arxiv.org/abs/quant-ph/0403025) introduce magic-state distillation. Numerical examples here are derived locally.
