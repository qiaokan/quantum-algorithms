# Quantum Algorithms, Step by Step

A local-first, static textbook for programmers learning quantum algorithms through complete worked examples and depth-first prerequisite detours. Deutsch and Grover are the first two algorithm lessons. No account, paid API, cloud quantum service, or explanation-generation service is used.

Read online: **[quantum-algorithms-rho.vercel.app](https://quantum-algorithms-rho.vercel.app/)**. Source: [qiaokan/quantum-algorithms](https://github.com/qiaokan/quantum-algorithms).

## Addendum, 2 November 2026: decision path and error-correction module

The default route is now the [decision path](https://quantum-algorithms-rho.vercel.app/path/), from useful application to hardware. The former main path is the "Complete algorithms path" at `/path/complete/`. A new module, "FT: Error correction and fault tolerance", adds FT-01 to FT-12 and a synthesis page, "The full chain" (FT-13), with catalog sequences 63–75 and an interactive resource calculator. The counts elsewhere in this README describe the original 61-topic edition and are kept as written. Supporting code:

- `src/lib/stabilizer.ts`: a stabilizer-tableau simulator for Clifford circuits with Pauli noise, up to 512 qubits.
- `src/lib/surface-code.ts`: rotated surface-code layouts and decoding graphs.
- `src/lib/decoders.ts`: exact minimum-weight matching and a union-find decoder.
- `src/lib/resource-estimate.ts` and `src/components/ResourceCalculator.astro`: the teaching resource model and calculator.
- `public/examples/ft-checks.py`: recomputes the FT lessons' numbers, including an independent version of the resource model.
- `public/examples/notebooks/`: optional companion notebooks (Stim and PyMatching; simulation only, not run in CI). One covers Λ and thresholds up to d = 9; the other times software decoder latency against distance. Pinned dependencies are in `requirements-ft-notebooks.txt`, and `make_notebooks.py` regenerates and re-executes both.

The task specification and its source verification are in `docs/proposals/decision-path-ft-spec.md`.

## Run locally

From a fresh clone, install dependencies and start the site with the commands below. On macOS, after installation, `./start.command` is an optional launcher that locates a compatible existing Node runtime without changing shell settings.

Requirements: Node.js **24.x**, npm 9.6.5+, and Python 3.11+ for all independent numerical checks. The Node major version is pinned consistently for local use, GitHub Actions, and Vercel builds.

```sh
cd quantum-algorithms
npm ci
npm run dev
```

Open the printed loopback address, normally `http://127.0.0.1:4321`. `npm run dev` binds only to 127.0.0.1. Astro 7 may background its server when run by an automation agent; `npx astro dev status`, `npx astro dev logs`, and `npx astro dev stop` manage that project-local server. A terminal session ordinarily runs in the foreground. Restart the dev server after adding or changing curriculum JSON metadata; static builds always read the current files.

The production output is self-contained HTML, CSS, JavaScript, and local KaTeX fonts:

```sh
npm run build
npm run preview
```

This is a directory containing a site, not an HTML file intended to run via `file://`. Serve `dist/` with a static HTTP server; search and definition panels load local JSON assets. Individual lesson text and formulas also work without JavaScript.

## What is included

- 61 required numbered algorithm/family topics plus a synthesis chapter; exact completion/review/partial counts are generated in `docs/content-audit.json` and displayed at `/coverage/`.
- Optional prerequisite library with numerical examples; all essential prose lives in local Markdown.
- Seven genuine small-state step-through demonstrations: Deutsch, Grover, Bernstein–Vazirani, Deutsch–Jozsa, Simon, QFT, and phase estimation.
- Desktop and mobile hierarchy, section anchors, previous/next navigation, full-text search including aliases/symbols, prerequisite map, source library, main path and family index.
- Nested definition panels preserving the parent lesson, originating context, nested scroll stack, and return focus; stable standalone definition URLs.
- Explicit local reading states (`read`, `practiced`, `revisit`), last reading location, light/dark themes, full-detail mode, and browser print/save-to-PDF support.
- Independent numerical example scripts for later chapters, mathematical unit tests, and desktop/mobile browser acceptance tests.

Authored complete is **not** independently reviewed. Partial chapters disclose their exact remaining gaps. Consult the generated audit for the current edition rather than inferring status from a page existing. The scope audit date is 2 November 2026; this is not an exhaustive claim about every paper published by that date.

## Validate

```sh
npm run check             # Astro/TypeScript diagnostics
npm test                  # state-vector, algorithm and search tests
npm run audit:content     # metadata, dependencies, sources, exercises, links, math
npm run build             # content audit, then static build
npx playwright install chromium
npm run test:browser      # built site, desktop + mobile Chromium
python3 public/examples/search-fourier-checks.py
python3 public/examples/matrix-checks.py
python3 public/examples/nand-checks.py
python3 public/examples/hallgren-checks.py
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-examples.txt
.venv/bin/python public/examples/applications.py
```

Other delivered Python scripts in `public/examples/` document their own commands and run with the standard library unless their header explicitly states otherwise. The current executed checks and limitations are recorded in [docs/VALIDATION.md](docs/VALIDATION.md). Browser tests use an isolated temporary profile and loopback preview port 4322; they do not use a personal Chrome profile. Playwright's server uses Astro's supported `--ignore-lock` option to remain owned by the test process rather than agent-autobackgrounding.

The GitHub Actions workflow in [.github/workflows/ci.yml](.github/workflows/ci.yml) runs type checks, unit tests, the content audit and build, all five Python suites, and desktop/mobile Chromium checks on pushes and pull requests. It uses Node 24, Python 3.12, and the checked-in dependency locks. It validates the project without deploying it.

The simulator never silently renormalizes a bad unitary result. Tests distinguish amplitudes from probabilities and compare states up to global phase only when appropriate. Inspection of simulator amplitudes is explicitly not claimed as an operation available on quantum hardware.

The `katex` override keeps the Markdown math plugins on the same patched renderer as the site's KaTeX styles and fonts. The plugins' declared ranges otherwise install an older renderer. Recheck rendering and the dependency audit before changing this override.

## Content and code architecture

```text
src/content/lessons/         One Markdown file per numbered lesson
src/content/catalog-*.json   Curriculum, dependencies, evidence/status metadata
src/content/definitions/     Reusable worked prerequisite explanations
src/content/definitions*.json Definition titles, aliases, stable IDs
src/content/sources/         Bibliographic records and verification depth
src/content/exercises/      Questions and explained answers
src/content/module-revisits.json Concrete backward connections per module
src/lib/content.ts          Typed local-content loader and math rendering
src/lib/quantum.ts          Reusable complex state-vector simulator
src/lib/demos.ts            Circuits and explanatory frames
src/lib/reader.ts           Progress, theme, navigation, definition call stack
src/lib/search.ts           Local full-text ranking and snippets
src/components/             Typed Astro components, including demo controls
src/layouts/Book.astro       Shared textbook reading layout
src/pages/                  Static routes and JSON assets
public/examples/            Downloadable tested numerical examples
scripts/audit-content.ts    Dependency cycles, internal links and content checks
research/                   Source checks, derivation notes, review scope
```

State convention: column vectors; leftmost bit most significant; bit index 0 means the leftmost bit; ascending binary basis labels; matrix products act right-to-left; positive-exponent QFT and negative-exponent inverse. Circuit frames are computed from those operations. The dense simulator caps inputs at 8 qubits and uses exponential memory; it makes no scalability claim.

## Add or revise a lesson

1. Add `src/content/lessons/NN-stable-id.md` with no H1/front matter. Use real `##` section headings, `$...$` inline math, and `$$...$$` display math. Essential explanations must appear locally; links supplement them. The renderer normalizes display delimiters and protects ket bars inside Markdown tables.
2. Add a record to a `catalog-*.json`: stable ID, sequence, module, title, kind, summary, why included, lesson prerequisites, introduced/reused definition IDs, example/source IDs, main/branch route, editorial state, advantage statement, aliases, file, and exact gaps. IDs must stay stable when order changes.
3. Add at least two explained exercises in `exercises/`; insert prediction-and-reveal checks in the lesson where they help. Add new definitions with their own metadata, inline meaning, numerical calculation, and return-to-parent explanation.
4. Add sources with title, authors, URL, supported claim, actual verification date and depth (`abstract`, `full-text`, `official-doc`, or `unverified`). Cite the relevant source inline too. Do not promote abstract verification to a full-text claim.
5. Run the content audit and appropriate numerical tests, then build and browser tests for interactive changes. A nonempty heading or word-count threshold cannot establish teaching completeness. Keep partial status until the worked instance reaches output and all declared gaps are resolved.
6. Independent review is recorded with scope/findings under `research/`. Only independently reviewed content receives `reviewed`; learner progress remains separate.

## Deployment

The production site is hosted on Vercel's Hobby plan in the `qiaokan's projects` team. The project is connected directly to this public GitHub repository; its production branch is `codex/initial-setup`. Pushes to that branch trigger production deployments.

[vercel.json](vercel.json) specifies the Astro preset, `npm ci`, `npm run build`, the `dist` output directory, and trailing slashes. Node 24 is specified in `package.json`. No environment variables, server-side runtime, database, or paid resource is required. Vercel's GitHub installation for this account is limited to this repository. Local Vercel linkage files are ignored by Git.

The same output can be hosted elsewhere: build with `npm ci && npm run build` and upload **only `dist/`**. Serve at the site root, preserve trailing-slash directories, and map unknown URLs to `404.html`. All internal URLs currently assume the origin root; subpath deployment requires updating base-aware links and asset URLs first.

## Git repository

The standalone public repository is [qiaokan/quantum-algorithms](https://github.com/qiaokan/quantum-algorithms). Dependencies, build output, browser reports, local environment files, and machine caches are ignored. Keep the lockfile, authored content, numerical examples, and validation records in version control.

The full authoring requirements are preserved in [docs/SPECIFICATION.md](docs/SPECIFICATION.md), and the maintained content format is described in [docs/AUTHORING-CONTRACT.md](docs/AUTHORING-CONTRACT.md).

## Deliberate limits

The demonstrations are ideal simulations; no hardware experiments or physical speed claims are presented. Advanced examples isolate an explicitly stated transformation rather than masquerading as full scalable circuits. Complexity guarantees apply to their specified access, output, precision, and success models. Automated tests are not peer review of every theorem. Source verification levels and unfinished derivations are public in the site, not hidden in this README.

## Review record

The [self-review and four Claude review rounds](research/review-disposition.md) record findings, fixes, executed tests, and the final scoped agreement. The optimized element-distinctness walk is explicitly marked partial; review agreement does not imply full-book mathematical peer review.
