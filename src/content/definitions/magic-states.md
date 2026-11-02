A magic state is a resource state that, consumed with Clifford operations and measurement, applies a non-Clifford gate. For the T gate it is $|T\rangle=(|0\rangle+e^{i\pi/4}|1\rangle)/\sqrt2=T|+\rangle$.

Worked: with a CNOT from the data qubit to $|T\rangle$ and a $Z$ measurement of the magic qubit, outcome 0 (probability 1/2) leaves $T|\psi\rangle$ on the data, and outcome 1 leaves $T^\dagger|\psi\rangle$ up to a global phase, which an $S$ correction fixes. Because the correction depends on a measured outcome, the next operation must wait for it. 15-to-1 distillation turns 15 states of error $\epsilon$ into one of error about $35\epsilon^3$: $\epsilon=10^{-3}$ gives $3.5\times10^{-8}$.

Factories that make magic states cost qubits and cycles, and their output rate can limit runtime. Return to the parent lesson and check whether the computation is limited by magic-state supply or by reaction time.

## Reference

[Boykin et al. (1999)](https://arxiv.org/abs/quant-ph/9906054) prove that Hadamard, CNOT and $\sigma_z^{1/4}$ (T up to a global phase) form a universal basis; [Bravyi and Kitaev (2005)](https://arxiv.org/abs/quant-ph/0403025) introduce magic-state distillation. Numerical examples here are derived locally.
