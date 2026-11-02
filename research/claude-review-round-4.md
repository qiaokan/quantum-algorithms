Review date: 2026-11-02. Actual Claude Code CLI, focused review of the hosted-CI layout fix. Response preserved verbatim.

I've finished reviewing the patch and the relevant files. **I found no regressions. The narrow changes are sound, but a passing hosted CI rerun is still needed.**

**The math is unchanged.** Each formula moved verbatim from `$…$` to `$$…$$`, and the surrounding prose only changed to match the new line breaks. I rechecked all three:
- **Probabilities:** (2∓√3)/8 gives 0.033494 and 0.466506, which sum to 1 (`56-random-circuit-sampling.md:23`).
- **Squared-probability sum:** (2−√3)² + (2+√3)² = 14, so 2·14/64 = 7/16 and 4·7/16 − 1 = 3/4 (`:37`).
- **Total-variation distance:** 1 − (2+√3)/8 = (6−√3)/8 ≈ 0.533494 (`:47`).

Ending the display formulas with a comma or period matches the lesson's existing display equations (`:11`, `:19`).

**It works with the existing display-math rendering and accessibility:**
- `render()` already splits every `$$…$$` onto its own lines (`content.ts:54`). Every `katex-display` element gets `tabindex="0" role="region" aria-label="Scrollable equation"` (`content.ts:60`), so the three new displays are keyboard-focusable and labelled regions like the others.
- On screen, `.katex-display` uses `overflow-x:auto` with `max-width:100%` and `nowrap`, so a wide formula scrolls inside its box instead of widening the page. Mobile shrinks it slightly to `.96em`.
- The print rule (`overflow:visible; .85em`) is the same one already used by every other display. The global `:focus-visible` outline applies.
- KaTeX still runs with `strict:'error'`, so any malformed TeX would fail the build.

**The test assertion is preserved** (`book.spec.ts:137-138`):
- The check is still `scrollWidth ≤ clientWidth + 1`, the same strict limit.
- `expect.soft` still marks the test as failed. It just keeps looping through the other lessons first, so you see every failing lesson instead of only the first.
- The new `longMath` lookup only adds detail to the failure message and has no effect on pass/fail. Its `clientWidth − 46` cutoff is just a reporting heuristic.

**Two cosmetic notes, neither a defect:**
- If a page overflows for some reason other than inline math, the failure message ends with an empty list after `lesson.id:`, which is harmless.
- Line 49 still says the XEB value is "calculated below." That wording predates this patch and is still accurate, since the Predict answer follows.

The CI failure was only 9px of overflow, and moving those formulas into the scrollable display container is a reasonable fix for it. I couldn't run the browser suite here, though, so the 390px width on Linux still needs to be confirmed by the hosted rerun before you call this done.