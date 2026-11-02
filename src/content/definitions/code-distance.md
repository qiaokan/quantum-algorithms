The distance $d$ of a code is the smallest number of single-qubit errors that changes the logical state while passing every check. A distance-$d$ code corrects any $\lfloor (d-1)/2\rfloor$ errors and detects any $d-1$.

Worked: the three-qubit repetition code has distance 3 against bit flips, since $XXX$ passes both checks and flips the logical qubit. It has distance 1 against phase flips, since a single $Z$ passes both checks and changes the logical phase. The distance-3 surface code needs at least three $X$ errors, one per row, to flip its logical $Z$ undetected.

Distance sets how fast logical errors fall as physical errors become rarer: roughly as $p^{(d+1)/2}$ well below threshold. Return to the parent lesson and find the smallest undetected logical error.

## Reference

Error-correction notation follows Daniel Gottesman, [Stabilizer Codes and Quantum Error Correction](https://arxiv.org/abs/quant-ph/9705052) (1997), and Barbara M. Terhal, [Quantum error correction for quantum memories](https://arxiv.org/abs/1302.3428) (2015). Numerical examples here are derived locally.
