# Quantum Algorithms, Step by Step

A local-first, static textbook for programmers learning quantum algorithms through complete worked examples and depth-first prerequisite detours. Deutsch and Grover are the first two algorithm lessons. No account, paid API, cloud quantum service, or explanation-generation service is used.

## Run locally

From a fresh clone, install dependencies and start the site with the commands below. On macOS, after installation, `./start.command` is an optional launcher that locates a compatible existing Node runtime without changing shell settings.

Requirements: Node.js **22.23.4 or later** (Node 24 recommended), npm 9.6.5+, and Python 3.11+ for all independent numerical checks.

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

## Static deployment instructions (not performed)

Build with `npm ci && npm run build` and upload **only `dist/`** to a static host such as a static web server, Cloudflare Pages, or Netlify. No server-side runtime, environment secret, database, or paid resource is required. Serve at the site root, preserve trailing-slash directories, and map unknown URLs to `404.html`. All internal URLs currently assume the origin root; subpath deployment requires updating base-aware links and asset URLs first. This task did not register a hosted Site or publish anything.

## Connect this repository to GitHub

The project has its own Git history. Dependencies, build output, browser reports, local environment files, and machine caches are ignored. Keep the lockfile, authored content, numerical examples, and validation records in version control.

After creating an empty GitHub repository with the intended owner and visibility, add its actual URL as `origin` and push the current branch:

```sh
git remote add origin git@github.com:OWNER/quantum-algorithms.git
git push -u origin HEAD
```

Replace `OWNER` with the chosen account or organization. Creating or pushing the repository is separate from publishing the website. The full authoring requirements are preserved in [docs/SPECIFICATION.md](docs/SPECIFICATION.md), and the maintained content format is described in [docs/AUTHORING-CONTRACT.md](docs/AUTHORING-CONTRACT.md).

## Deliberate limits

The demonstrations are ideal simulations; no hardware experiments or physical speed claims are presented. Advanced examples isolate an explicitly stated transformation rather than masquerading as full scalable circuits. Complexity guarantees apply to their specified access, output, precision, and success models. Automated tests are not peer review of every theorem. Source verification levels and unfinished derivations are public in the site, not hidden in this README.
