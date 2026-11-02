# Build a complete quantum-algorithms learning website

You are both the author of a rigorous quantum-algorithms textbook and the engineer building its interactive website.

Build the actual website in the current repository. Do not merely propose an outline, design a landing page, or return an essay in chat. Produce the application, substantive lesson content, navigation, working demonstrations, tests, and documentation.

Working title: Quantum Algorithms, Step by Step.

## 1. Mission, audience, and scope

Create a comprehensive, prerequisite-ordered curriculum covering the major quantum-algorithm families, their foundational primitives, and important representative applications.

I am an experienced programmer, but assume only ordinary arithmetic and basic programming knowledge. Do not assume that I know linear algebra, quantum mechanics, number theory, specialized probability, or the notation used in these fields.

I want mathematics + definitions + intuition, not an oversimplified explanation with the mathematics removed.

My preferred learning strategy is algorithm-first, with depth-first exploration of missing prerequisites. I learn through repeated, concrete uses of an idea across different algorithms. I lose the thread when long symbolic derivations accumulate without reminders of what the symbols mean and what problem we are solving.

My current learning sequence is Deutsch, then Grover. Keep those as the first two algorithm lessons. Make them understandable independently of earlier conversations.

Interpret “every important quantum algorithm” as broad, explicitly audited coverage of major families—not an unsupported claim to include every published variant. Use the required curriculum below as a minimum, research significant omissions, and publish scope criteria and a coverage table. Label algorithms, primitives, frameworks, protocols, and applications accurately rather than pretending they are all the same kind of thing.

## 2. Research and source requirements

Before authoring, validate the curriculum and prerequisite relationships using primary papers, official educational documentation, and author-maintained research material.

Starting sources:
- IBM Quantum Learning:
  https://quantum.cloud.ibm.com/learning/en
- IBM fundamentals:
  https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms
- Quantum Algorithm Zoo:
  https://quantumalgorithmzoo.org/
- End-to-end algorithms survey:
  https://arxiv.org/abs/2310.03011
- QSVT original paper:
  https://arxiv.org/abs/1806.01838
- QSVT pedagogical synthesis:
  https://arxiv.org/abs/2105.02859
- HHL original paper:
  https://arxiv.org/abs/0811.3171
- Aaronson's conceptual introduction:
  https://www.scottaaronson.com/democritus/lec9.html

Use catalogs to discover topics, then follow their references to verify technical claims. Do not treat an index as a substitute for the original argument.

Every lesson needs inline source attribution and a bibliography. Record source title, authors or organization, URL, and the claim or section supported. Give the coverage audit an actual verification date. Verify current software APIs against their official documentation.

Never invent citations, performance results, hardware demonstrations, or claims that code was executed. Clearly distinguish ideal simulation, physical experiments, and theoretical analysis. If a source cannot be verified, record that fact rather than claiming it was checked.

## 3. Required curriculum and learning order

Use the following default order. Create stable numbered lessons grouped into modules. Validate the dependency graph; add short bridges or adjust placement where justified. Explain any significant reordering.

Provide a clear beginner-to-advanced main path and optional branches. Numbered order is a recommended traversal, not a prerequisite lock. Let readers open any lesson and see what it depends on.

### Module 0 — Optional orientation and prerequisite library

Provide a short orientation, not a mandatory mathematics course. Definitions must still appear inline when needed later.

Include:
- Complex numbers.
- Vectors and matrices.
- Matrix multiplication.
- Tensor products.
- Normalization.
- Probability and conditional probability.
- Basis and basis changes.
- Inner and outer products.
- Conjugate transpose.
- Unitarity.
- Eigenvalues and eigenvectors.
- Singular values.
- Reversible computation.
- Controlled gates.
- Ancillas and uncomputation.
- Measurement.
- Global and relative phase.
- Density matrices.
- Observables.
- Query, gate, and runtime complexity.
- Classical versus coherent oracle access.

Include supporting modules for state preparation, reversible arithmetic, Hadamard and SWAP tests, and expectation-value estimation. Introduce them where used, with links to reusable detailed explanations.

Teleportation, superdense coding, error correction, and fault tolerance may be supporting context. Label them properly; do not substitute them for algorithm coverage.

### Module 1 — First examples and oracle reasoning

01. Deutsch's algorithm.
02. Grover's algorithm: four candidates first, then general behavior.
03. Bernstein–Vazirani.
04. Deutsch–Jozsa.
05. Simon's algorithm, including the classical linear-equation step.

### Module 2 — Search and amplitude amplification

06. General amplitude amplification.
07. Multiple marked items, unknown solution counts, and BBHT search.
08. Fixed-point amplitude amplification.
09. Dürr–Høyer minimum finding.
10. Brassard–Høyer–Tapp collision finding.

### Module 3 — Fourier structure and number theory

11. Quantum Fourier transform and inverse QFT.
12. Quantum phase estimation.
13. Iterative phase estimation and semiclassical Fourier measurement variants; distinguish them carefully.
14. Period finding and modular order finding.
15. Shor's factoring algorithm, including classical preprocessing and postprocessing.
16. Quantum discrete-logarithm algorithms.
17. The abelian hidden-subgroup framework connecting the preceding algorithms.

### Module 4 — Estimation and sampling expectations

18. Quantum counting.
19. Canonical quantum amplitude estimation.
20. Iterative and maximum-likelihood amplitude-estimation variants.
21. Quantum mean estimation and Monte Carlo applications.
22. Jordan's quantum gradient-estimation algorithm.

### Module 5 — Simulation and an initial linear-systems algorithm

23. Hamiltonian simulation using Trotter–Suzuki product formulas.
24. Randomized product-formula simulation, including qDRIFT.
25. Phase-estimation-based energy estimation and ground-state preparation, including overlap and success assumptions.
26. HHL, beginning with a small explicit linear system.

### Module 6 — Modern algorithmic building blocks

27. Block encoding and linear combinations of unitaries: primitives and access models.
28. Oblivious amplitude amplification.
29. Truncated-Taylor/LCU Hamiltonian simulation.
30. Qubitization.
31. Quantum signal processing.
32. Quantum singular value transformation.
33. Modern quantum linear-system solvers using these techniques.
34. Polynomial filtering and ground/thermal-state preparation methods.
35. Singular-value estimation and quantum principal-component methods; separate their different input models.
36. Quantum algorithms for differential equations, with output/readout costs.
37. Quantum semidefinite-programming algorithms, with their oracle assumptions.

### Module 7 — Quantum walks and combinatorial algorithms

38. Discrete-time coined quantum walks.
39. Continuous-time quantum walks.
40. Szegedy walks and the MNRS search framework.
41. Element distinctness.
42. Triangle finding.
43. NAND-tree/formula evaluation.
44. Quantum backtracking and its connection to branch-and-bound.

### Module 8 — Variational, optimization, and adiabatic methods

45. Variational quantum eigensolver.
46. ADAPT-VQE and adaptive variational construction.
47. Quantum approximate optimization algorithm, using a small Max-Cut example.
48. Quantum imaginary-time evolution and variational alternatives; distinguish the algorithms and assumptions.
49. Adiabatic algorithms and quantum annealing; distinguish ideal models from hardware implementations.

### Module 9 — Learning, measurement, and sampling tasks

50. Quantum state tomography and its measurement costs.
51. Classical shadows.
52. Quantum kernel-estimation methods.
53. Variational quantum classifiers and representative quantum machine-learning workflows.
54. IQP sampling.
55. Boson sampling and Gaussian boson sampling.
56. Random-circuit sampling.

### Module 10 — Specialized advanced extensions

57. Kuperberg's hidden-shift/dihedral hidden-subgroup algorithms.
58. Hallgren's algorithms for Pell-type and related number-theoretic problems.
59. Approximation of the Jones polynomial.
60. Quantum Metropolis and related Gibbs-sampling methods.
61. Forrelation and related oracle-separation examples.

Research additional significant omissions, including important developments in established families. Add substantive topics when warranted, with prerequisites and sources. Do not add marginal variants merely to inflate the chapter count.

For each lesson, record:
- Why it is included.
- Its prerequisites and concepts reused.
- Whether it is a main-path lesson or an advanced branch.
- Whether its claimed advantage is proven, oracle-model, conditional, heuristic, experimental, or not established for practical workloads.

Create a final synthesis chapter connecting search, Fourier methods, phase estimation, simulation, quantum walks, and matrix transformations. Explain connections already demonstrated concretely, rather than introducing an unexplained grand abstraction.

## 4. The central teaching rule: depth-first prerequisite explanations

Whenever an explanation introduces an unfamiliar concept, notation, or operation:

1. State its plain-language meaning.
2. Explain why it is needed at this exact point.
3. Give its mathematical definition.
4. Work the smallest useful numerical example.
5. Recursively explain any additional prerequisite that example needs.
6. Return explicitly to the original algorithm step and substitute the result.

Do not replace one undefined concept with another. For example, do not explain a tensor product solely as “combining Hilbert spaces.” Show the input vectors, calculate every output entry, and explain what the entries mean.

Keep each detour purposeful. Essential definitions belong in the lesson itself, not only in external references or a distant glossary. Optional deeper derivations can expand inline or in a side panel.

After a detour, explicitly restore context:
“We needed this to calculate X. We can now return to step Y.”

Make nested prerequisite explanations navigable like a call stack:
- Preserve the parent lesson.
- Preserve the originating equation.
- Preserve scroll position.
- Provide a clear return action.
- Avoid circular definition chains and a maze of cross-links.

## 5. Required structure of every algorithm lesson

Each lesson must contain a substantive end-to-end explanation, not a short overview with empty headings.

A. The problem: inputs, required outputs, promises, known/hidden information, and access model.

B. A straightforward classical method and a fair comparison target.

C. The core intuition in ordinary language, with the analogy's limits.

D. One small, fixed worked instance.

E. Preparation and each actual operation, with complete intermediate calculations.

F. Final output or measurement probabilities, including success/failure cases.

G. Why it works, tied back to the concrete calculation.

H. How its important operations are implemented and what they cost.

I. Generalization beyond the toy instance, including the special features of that instance.

J. Complexity, assumptions, precision, repetitions, limitations, and end-to-end caveats.

K. Common misunderstandings and counterexamples.

L. Small exercises with explained answers.

M. Connections backward and forward in the curriculum.

N. References and runnable example code where appropriate.

Long lessons may have ordered sublessons, but provide a continuous “read entire lesson” view. Do not end before the worked example reaches its output.

For frameworks or primitives, adapt the structure honestly: identify the transformation they implement and show a concrete application. Do not invent a standalone search problem just to fit a template.

## 6. Mathematics: visible steps, stable notation

Define every symbol when first used, including primes, bars, subscripts, exponentials, brackets, and operator symbols. Remind the reader after a long gap.

Specify basis ordering, register ordering, bit significance, and whether matrix products act right-to-left. Keep these conventions consistent; explain library-specific differences.

For every important transformation, show:
- The input state or data.
- The operation and its purpose.
- The calculation, including relevant intermediate terms.
- The output and what changed.
- What did not change.
- Why that change helps solve the problem.

Show matrix rows multiplied by columns, tensor-product entries, sign changes, factoring, normalization, and probability calculations. Explain rather than merely invoke linearity or a theorem.

Distinguish actual gates from algebraic rewriting. Equality signs do not represent additional physical operations. Never describe a scalar as physically “moving between qubits.”

Distinguish basis labels, amplitudes, probabilities, and measurement outcomes. A minus sign is not a negative probability or a bit flip. Define global versus relative phase when needed.

Pair ket notation with small numerical vectors. Introduce density matrices, geometric pictures, or other representations only when they help, and explicitly translate between them.

For interference, identify contributions to the same output amplitude and show cancellation/reinforcement. Do not simply say “quantum parallelism” or “the amplitudes interfere.”

Explain large formulas through a tiny numerical instance before relying on them. Give optional general proofs after the concrete mechanism is established.

Do not impose arbitrary short word limits on lessons. Split into coherent sections instead of deleting necessary derivations.

## 7. Scientific and computational-model safeguards

Be explicit about:
- Oracle use versus oracle construction.
- Query count versus parallel rounds.
- Logical gates versus physical gates.
- Theoretical complexity versus elapsed time.

Never hide two classical evaluations inside a wrapper and count that as one elementary oracle evaluation. Show the function-dependent operations separately from fixed operations.

Explain state-preparation, data-loading, output extraction, sampling, classical postprocessing, accuracy, success probability, and error-correction costs when relevant.

Audit examples of controlled U^(2^k): do not count an expensive powered oracle as a single base-U call without an explicit access assumption.

Distinguish deterministic and bounded-error classical baselines. Do not imply every textbook oracle separation holds against the strongest randomized classical comparison.

For Shor, distinguish a genuine implementation from a demonstration compiled using knowledge of the answer. Explain unsuccessful order-finding trials and classical retries.

For QFT, distinguish transforming amplitudes from printing all classical Fourier coefficients.

For linear-system algorithms, specify whether the output is a quantum state, an observable estimate, or an explicit classical vector. Include conditioning, precision, sparsity/access assumptions, and readout costs.

For variational methods, optimization, and quantum machine learning, do not promise a general practical speedup. Identify evidence and limitations for the actual problem and model.

For sampling demonstrations, distinguish complexity evidence from useful application speedup and experimentally verified claims.

Treat these as verification requirements, not as slogans to repeat identically in every chapter.

## 8. Website navigation and reading experience

Build a usable textbook website, not a dashboard of algorithm cards.

Required navigation:
- Persistent desktop sidebar with numbered, collapsible modules and lesson titles.
- Accessible mobile menu exposing the same hierarchy.
- Clear current-lesson and current-section highlighting.
- Previous/next links following the recommended learning order.
- A lesson table of contents linking to real section anchors.
- Breadcrumbs and direct links to prerequisite explanations.
- Full-text search across lessons, definitions, symbols, and common aliases.
- Search results with useful snippets linking to the relevant section.
- An algorithm index, glossary, prerequisite map, coverage page, and references library.
- A recommended main-path view and a browse-by-family view.
- Stable shareable URLs for lessons, subsections, and definitions.

The prerequisite map must reflect the actual content metadata. Provide a readable list/table alternative to any graph.

Reader features:
- Remember progress and the last reading location locally, without requiring an account.
- Allow explicit “read,” “practiced,” and “revisit” states; do not equate scrolling with understanding.
- Keep learner progress separate from editorial completion status.
- Essential definitions appear inline.
- Optional “explain this,” “show algebra,” and “show numerical example” controls expand genuine content.
- A full-detail reading mode expands derivations; print/export includes them.
- Light and dark themes.
- Readable type and comfortable line lengths.
- Generous equation spacing.
- Mobile-safe horizontal scrolling for wide formulas and tables.
- Keyboard-accessible controls and visible focus.
- Appropriate contrast, reduced-motion support, and semantic headings.

Prefer simple, readable layouts. No giant decorative hero sections, forced sign-ins, autoplay, decorative animations, or charts without educational purpose.

## 9. Demonstrations must be real and explain their limits

Build a reusable small-state simulator for the examples where it is appropriate. Compute state transitions; do not hardcode a different claimed result behind each button.

For Deutsch, Grover, Bernstein–Vazirani, Deutsch–Jozsa, Simon, small QFT, and small phase-estimation examples, provide meaningful step-through demonstrations.

Show:
- The current operation.
- The circuit position.
- Basis labels.
- Amplitudes.
- Probabilities.
- A plain-language explanation.

Support next, previous, and reset. Allow changing the small problem instance when educationally useful.

Clearly separate:
- Ideal state-vector probabilities.
- Randomly sampled measurement results.
- Any hypothetical or actual hardware observations.

Label internal state-vector inspection as a classical simulator privilege, not something quantum hardware provides for free. Indicate the simulator's size limit and exponential memory scaling.

Use exact fractions and radicals in authored derivations where helpful, and readable numerical approximations in simulation. Cross-check them.

For advanced lessons, provide an honest small worked transformation or tested numerical notebook rather than a fake full-algorithm simulator. No inert controls, fake terminals, fabricated hardware results, or unimplemented interactive placeholders.

## 10. Retrieval practice and connections

After each substantial concept, include a small prediction before revealing the explanation:
- Does this sign change alter the immediate probabilities?
- What happens if this gate is omitted?
- What changes if the marked candidate moves?
- Does this operation depend on the hidden function?
- What happens if we measure at this point?

Provide worked answers, not just “correct/incorrect.” Explain why tempting wrong answers fail.

At the end of each module, revisit earlier algorithms using the newly learned idea. Do not simply link back; include a short concrete comparison.

The learning goal is to reproduce a small example with definitions available and make predictions about modifications—not memorize equations before advancing.

## 11. Engineering and content architecture

Inspect the existing repository first. Preserve its conventions and unrelated work.

Reuse a suitable existing stack; otherwise choose a lightweight maintainable static-first web stack with typed components, routed pages, structured lesson content, and proper mathematical typesetting.

Use local content files, not one giant component containing the entire book.

Separate:
- Lesson prose and derivations.
- Curriculum and prerequisite metadata.
- Reusable definitions.
- Citations.
- Simulator logic and fixtures.
- UI components.
- Exercises and answer explanations.

Maintain a machine-readable curriculum manifest with:
- Stable IDs.
- Sequence.
- Module.
- Content type.
- Prerequisites.
- Concepts introduced and reused.
- Example IDs.
- Source IDs.
- Main-path or branch status.
- Editorial status.

Validate prerequisite references and detect cycles. Do not let changes to sidebar ordering break stable links.

Essential content must be authored and available locally. Do not require a paid API, external LLM, account, cloud quantum service, or network access to generate explanations while reading.

Use supported dependencies, a lockfile, documented setup commands, and a reproducible build.

Do not deploy publicly or create paid resources without authorization. Provide deployment instructions for a suitable static host.

## 12. Verification and acceptance tests

Run the available type checks, build, unit tests, and browser checks. Report actual commands and outcomes.

Mathematical tests must cover representative examples:
- Normalization and probability sums after applicable operations.
- Reversibility/unitarity for small implemented gates.
- All four Deutsch functions.
- Every marked position in four-item Grover and its iteration-dependent behavior.
- Bernstein–Vazirani outputs and Simon's sampled linear constraints.
- QFT/inverse-QFT consistency with documented ordering.
- Exact and inexact phase-estimation examples.
- Shor's classical postprocessing and rejected trials.
- HHL or other linear-systems toy examples against a classical numerical solution, including normalization and postselection.
- Representative simulation and variational examples where implemented.

Compare quantum states up to global phase when appropriate. Test probabilities separately from amplitudes. Do not silently renormalize incorrect results to make tests pass.

Website tests must cover:
- Navigation and deep links.
- Sidebar order.
- Search.
- Prerequisite return navigation.
- Equation rendering.
- Mobile overflow.
- Keyboard use.
- Demonstrations.
- Local progress persistence.

Audit lesson metadata and actual content. Missing sections must not pass because a heading exists. Count complete, reviewed, partial, and planned lessons separately.

If an environment prevents a test, state the limitation and what was inspected instead. Never claim unexecuted checks passed.

## 13. Delivery and completion standards

Deliver:
1. A runnable website containing the curriculum and substantive lessons.
2. Working menus, search, definition navigation, and specified demonstrations.
3. A coverage/dependency manifest and source library.
4. Tests and a documented validation report.
5. A README with install, develop, test, build, and deployment instructions.
6. A concise description of how to add or revise a lesson.

Prioritize complete teaching content over decorative UI. Establish the shared site and first complete lessons, then extend systematically through the ordered curriculum.

Do not spread a few shallow paragraphs over dozens of pages and call the textbook complete.

Do not stop at a plan or ask me to approve each chapter. Make reasonable choices, record them, and implement.

If execution limits prevent finishing everything:
- Preserve the working site and completed material.
- Publish an exact coverage report.
- Distinguish remaining work clearly.
- Never label a partial chapter complete.
- Never fabricate finished lessons.
- Never link to blank pages as though they contain tutorials.
- Planned entries may be visible but must be labelled as planned rather than presented as finished destinations.

The final chat response should identify the files changed, how to run the site, the actual content coverage, tests executed, and any remaining limitations.

Do not paste the entire textbook into chat.

The final quality criterion is:

Can a programmer who understands ordinary arithmetic, but lacks the relevant mathematics, open a lesson from the menu, descend into every essential missing definition, return without losing their place, calculate the worked example, and explain why the algorithm produces its result?

If not, repair the missing explanation, mathematical step, or navigation path before declaring that lesson complete.