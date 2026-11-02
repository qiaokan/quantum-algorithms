# Software documentation verification

Checked on 2026-11-02. Dependencies are resolved by the local lockfile; application behavior was verified by executing the documented checks in `docs/VALIDATION.md`.

- [Astro getting started](https://docs.astro.build/en/getting-started/) and [routing](https://docs.astro.build/en/guides/routing/): supported Node requirements, static pages, dynamic routes with `getStaticPaths`, and local development/build commands.
- [Astro CLI reference](https://docs.astro.build/en/reference/cli-reference/#astro-preview): preview behavior and foreground/background server ownership. The installed CLI's help was also inspected. Playwright uses `--ignore-lock` so its server remains owned by the test process.
- [KaTeX Node API](https://katex.org/docs/node): mathematical rendering and error behavior. Lessons render at build time through remark/rehype; malformed expressions fail the content audit. Fonts are bundled locally.
- [Playwright assertions](https://playwright.dev/docs/test-assertions): locator assertions and asynchronous browser checks. Tests run in isolated Chromium contexts and do not attach to a personal browser profile.
- [NumPy `linalg.eigh`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html): Hermitian eigensolver used by the independent numerical examples. Executed reference environment uses NumPy 2.3.5; the exact dependency is pinned separately from JavaScript packages.

Official documentation was used for API verification. Scientific sources and their verification depths are maintained separately in `src/content/sources/`.

## Standalone repository preparation

The GitHub Actions workflow was checked against the official [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), and [setup-python](https://github.com/actions/setup-python) repositories, which document their v7 entry points, and [Playwright's CI setup](https://playwright.dev/docs/ci-intro) for installing Chromium's system dependencies. The workflow runs the existing local checks with read-only repository permissions. Its GitHub-hosted execution remains unverified until the repository is pushed and Actions runs.
