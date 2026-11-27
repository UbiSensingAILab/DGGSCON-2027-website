# DGGSCon 2027 Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the two pages of the DGGSCon 2027 site so they read as a professional academic conference site, with nothing smaller than 13px and every nav item resolving to a real section.

**Architecture:** Buildless static HTML and CSS. `docs/index.html` is rewritten to the agreed structure; `docs/call-for-participation.html` keeps its content and anchor ids but has its headings rewritten and is restyled to match; `docs/assets/styles.css` is replaced wholesale rather than extended, because the existing file is a stack of eight append-only patches. A dependency-free Node script at `tools/check-site.mjs` is the test harness: it asserts the structural and factual rules the spec fixes, and it is the thing each task runs to prove its work.

**Tech Stack:** HTML, CSS, Inter via Google Fonts, Node (already present, used only for checks), ffmpeg (already present, used once to crop a logo).

**Spec:** `superpowers/specs/2026-11-26-website-redesign-design.md`

**Reference mockup:** `superpowers/specs/2026-11-26-homepage-mockup.html` — the approved homepage, reviewed and signed off in the browser. When this plan says "as in the mockup", that file is the authority for markup order, class names, copy and CSS values. It is not published; it sits outside `docs/`.

## Global Constraints

- Buildless static site. No framework, no build step, no package.json, no dependencies (`AGENTS.md`).
- Only `docs/` is published through GitHub Pages. Plans, specs and tools live outside it.
- All asset paths relative, so the site works at the project URL and a future custom domain.
- Lowercase hyphen-separated filenames for new files.
- **No text anywhere below 13px.**
- Only permitted external resource: Google Fonts (`Inter`, weights 400/500/600/700).
- Definite voice. No "provisional", "tentative", "subject to confirmation" (`AGENTS.md`). Unreleased details use "will be published here".
- No invented facts. Every date, deadline and submission rule comes from `F:\UCalgary_postdoc\DGGSCON-2027\program\cfp\call-for-participation-draft.md`.
- The Microsoft CMT acknowledgement appears verbatim in the footer of both pages, at 14px.
- Commit after every task, on branch `redesign`.

## Review Focus

Five things the spec implies, that no obvious task would test, ranked by how likely they are to bite a real visitor:

1. **The hero photo fails to load or is still loading.** White hero text on a white page is invisible. The hero element needs a dark background colour behind the image so the text is legible before and without it. Test in Task 4.
2. **Text contrast over the photograph.** The gradient must carry the text regardless of which photo is chosen — a bright sky behind the meta line fails WCAG AA. Task 4 pins the gradient's end stop and the test asserts it.
3. **The long formal title at phone width.** "1st International Conference on Discrete Global Grid Systems" is 58 characters under a 52px heading; at 360px it must wrap without overflowing the viewport. Test in Task 8.
4. **The submission-types table on a phone.** It is wider than any phone; its scroll region must stay keyboard-reachable, which means keeping `tabindex="0"` and a visible focus style on the wrapper. Test in Task 7.
5. **A stale deadline shipped by hand-editing.** Nine dates appear on the homepage and the same nine on the CFP page; the two must agree with the CFP markdown. Task 1 makes this a machine check rather than a reading exercise.

---

## File Structure

| File | Responsibility |
|---|---|
| `tools/check-site.mjs` | Create. All automated checks. Dependency-free Node, run as `node tools/check-site.mjs [filter]`. |
| `docs/assets/styles.css` | Replace. Tokens, type scale, layout, components for both pages. |
| `docs/index.html` | Rewrite to the agreed five-section structure. |
| `docs/call-for-participation.html` | Modify: headings rewritten, numbered labels removed, restyled. Content, dates, anchor ids unchanged. |
| `docs/assets/university-of-calgary-logo-cropped.jpg` | Create, from the existing logo via ffmpeg. |
| `docs/assets/banff-hero.jpg` | Create. The chosen licence-clean hero photograph. |
| `docs/assets/globe.svg` | Delete. Retired with the illustrated hero. |

---

### Task 1: Check harness

**Files:**
- Create: `tools/check-site.mjs`

**Interfaces:**
- Produces: `node tools/check-site.mjs` exits 0 when all checks pass, 1 otherwise, printing one line per check. An optional first argument filters checks by substring of their name. Every later task runs it.

- [ ] **Step 1: Write the checks**

Nine named checks, each a function returning `{name, ok, detail}`:

- `html-structure` — tags balanced in both pages (void elements: meta, link, img, br, hr).
- `anchors` — every `href="#id"` in a page resolves to an `id` in that page.
- `local-links` — every relative `href`/`src` resolves to a file under `docs/` (strip `?v=` query).
- `min-font-size` — no `font-size` under 13px in `styles.css`. Parse `font-size:<n>px`, fail on `n < 13`.
- `cmt-verbatim` — the acknowledgement string appears in both pages, exactly as in the spec.
- `dates-match-cfp` — read the CFP markdown; for each of the nine milestones assert the date string appears in both HTML pages.
- `no-hedging` — none of `provisional`, `tentative`, `subject to confirmation` appear in either page.
- `no-ai-tells` — no `NN / UPPERCASE` section labels, no heading text ending in a period inside `<h1>`/`<h2>`, no `✳`.
- `assets-exist` — every file named in the File Structure table above exists, and `globe.svg` does not.

- [ ] **Step 2: Run it against the current site to prove the checks detect**

Run: `node tools/check-site.mjs`
Expected: FAIL on at least `min-font-size` (8px exists today), `no-ai-tells` (`01 / ABOUT`), `assets-exist`. A harness that passes against the unmodified site is broken.

- [ ] **Step 3: Commit**

```bash
git add tools/check-site.mjs
git commit -m "Add site check harness"
```

---

### Task 2: Stylesheet foundation

**Files:**
- Replace: `docs/assets/styles.css`

**Interfaces:**
- Produces: the custom properties and base rules every later task uses. Token names and values exactly as the spec's Visual language table: `--page`, `--ink`, `--muted`, `--muted-light`, `--pine`, `--pine-dark`, `--footer`, `--footer-text`, `--panel`, `--rule`. Base `body` 17px/1.65 Inter. `.shell` = `width:min(1100px,100% - 56px);margin-inline:auto`. Utility classes `.prose`, `.rows`, `.group`, `.note`, `.link`, `.btn` as in the mockup.

- [ ] **Step 1: Write the file**

Replace the whole file. Keep the Google Fonts `@import` pattern already in use, swapped to Inter. Do not carry over any rule from the old stylesheet; the two pages are rewritten in Tasks 4–7 and nothing depends on the old class names except `.skip-link`, `.sr-only`, which you re-create.

- [ ] **Step 2: Verify the floor**

Run: `node tools/check-site.mjs min-font-size`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add docs/assets/styles.css
git commit -m "Replace stylesheet with the new design tokens and base"
```

---

### Task 3: Image assets

**Files:**
- Create: `docs/assets/university-of-calgary-logo-cropped.jpg`
- Create: `docs/assets/banff-hero.jpg`
- Delete: `docs/assets/globe.svg`

**Interfaces:**
- Produces: the two images Tasks 4 and 5 reference by path.

- [ ] **Step 1: Crop the Calgary logo**

Run: `ffmpeg -y -i docs/assets/university-of-calgary-logo.jpg -vf "crop=461:129:56:91" -q:v 2 docs/assets/university-of-calgary-logo-cropped.jpg`

A pre-cropped copy is at `superpowers/specs/university-of-calgary-logo-cropped.jpg` if ffmpeg is unavailable. Keep the uncropped original in the repository.

- [ ] **Step 2: Add the hero photograph**

Save the chosen photo as `docs/assets/banff-hero.jpg`, at most 2400px wide and at most 600KB. **The choice is Erin's and must be made before this step** — either one of the three Pexels-licensed candidates or her own photograph. Do not reuse `banff-centre-autumn-rita-taylor.jpg`: no licence covers that use.

- [ ] **Step 3: Delete the retired illustration**

Run: `git rm docs/assets/globe.svg`

- [ ] **Step 4: Verify**

Run: `node tools/check-site.mjs assets-exist`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/assets
git commit -m "Add hero photograph and cropped host logo, retire the globe"
```

---

### Task 4: Homepage header, hero and announcement

**Files:**
- Rewrite: `docs/index.html` (header, hero, announcement band only; sections follow in Task 5)
- Modify: `docs/assets/styles.css`

**Interfaces:**
- Consumes: tokens from Task 2, `banff-hero.jpg` from Task 3.
- Produces: `.site-header` (sticky), `.hero`, `.announce`. Nav markup that Task 7 copies to the CFP page.

- [ ] **Step 1: Write the failing test**

Add to `tools/check-site.mjs` a check `hero-contrast`:

```js
// The hero must stay legible before and without the photograph.
const hero = css.match(/\.hero\s*\{[^}]*\}/)[0];
assert(/background:\s*#(10|0f)[0-9a-f]{4}/i.test(hero), "hero needs an opaque dark background behind the image");
const after = css.match(/\.hero::after\s*\{[^}]*\}/)[0];
assert(/rgba\(10,\s*30,\s*32,\s*\.8[0-9]?\)/.test(after), "gradient must end at >=0.8 alpha for text contrast");
```

- [ ] **Step 2: Run it**

Run: `node tools/check-site.mjs hero-contrast`
Expected: FAIL — no `.hero` rule exists yet.

- [ ] **Step 3: Build header, hero and announcement**

Markup and CSS as in the mockup. The hero carries `background:#102b2d` beneath the image, the gradient runs `rgba(10,30,32,.22)` to `rgba(10,30,32,.84)`, and the photo credit is 13px, not 12px. Hero copy, button label and announcement text are fixed by the spec's Copy section — the deadline split matters: full and short papers 16 April, industry abstracts 28 May.

Nav: About · Dates · Programme · Venue · Registration · Call for Participation (the last an `<a class="cta">` to `call-for-participation.html`). Header `position:sticky`, with `html{scroll-padding-top:76px}` and `section{scroll-margin-top:70px}`.

- [ ] **Step 4: Run the checks**

Run: `node tools/check-site.mjs`
Expected: `hero-contrast`, `min-font-size`, `cmt-verbatim` (still failing until Task 6) — `hero-contrast` PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/index.html docs/assets/styles.css tools/check-site.mjs
git commit -m "Rebuild the homepage header, hero and announcement band"
```

---

### Task 5: Homepage sections

**Files:**
- Modify: `docs/index.html`
- Modify: `docs/assets/styles.css`

**Interfaces:**
- Consumes: `.prose`, `.rows`, `.group`, `.note` from Task 2.
- Produces: sections `#about`, `#dates`, `#programme`, `#venue`, `#registration`, matching the nav from Task 4.

- [ ] **Step 1: Write the failing test**

Extend the `anchors` check so it also asserts the five section ids exist in `index.html` and that the nav order matches the document order of those sections.

- [ ] **Step 2: Run it**

Run: `node tools/check-site.mjs anchors`
Expected: FAIL — sections not yet written.

- [ ] **Step 3: Write the five sections**

Copy, verbatim, from the spec's Copy section. Layout discipline: **two shapes only** — full-width prose or full-width rows, plus the single three-column `.tracks` block in Programme. Dates carry both qualifiers: the Pacific Time line below the list, and "Then open until the rooms are filled" as a `.sub` line on workshop proposals. About closes with the topics sentence linking to the CFP's topic list. Programme carries the journal special issue line, in the CFP's own wording ("may be invited"). Registration holds the inert `.btn-wait` placeholder.

- [ ] **Step 4: Run the checks**

Run: `node tools/check-site.mjs`
Expected: `anchors`, `dates-match-cfp`, `no-hedging`, `no-ai-tells` all PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/index.html docs/assets/styles.css tools/check-site.mjs
git commit -m "Add the five homepage sections"
```

---

### Task 6: Hosts band and footer

**Files:**
- Modify: `docs/index.html`
- Modify: `docs/assets/styles.css`

**Interfaces:**
- Consumes: `university-of-calgary-logo-cropped.jpg` from Task 3.
- Produces: `.hosts` and `footer` markup, copied verbatim to the CFP page in Task 7.

- [ ] **Step 1: Run the failing test**

Run: `node tools/check-site.mjs cmt-verbatim`
Expected: FAIL — the acknowledgement is not yet in the rewritten page.

- [ ] **Step 2: Build the band and footer**

Light hosts band above the dark footer, no cards. Both logos at `height:42px`; Calgary `grayscale(1)` + `mix-blend-mode:multiply` + `opacity:.78`; Guelph `grayscale(1) brightness(.42)` — its SVG wordmark is white-filled and invisible on light backgrounds without it. One line beneath: "Sponsorship opportunities will be published here."

Footer: conference name and formal title, venue, dates, a Contact link pointing to `call-for-participation.html#contact` (not a `mailto:`), then the CMT acknowledgement verbatim at 14px on its own rule-separated full-width line.

- [ ] **Step 3: Run the checks**

Run: `node tools/check-site.mjs`
Expected: `cmt-verbatim` PASS; all homepage checks PASS.

- [ ] **Step 4: Commit**

```bash
git add docs/index.html docs/assets/styles.css
git commit -m "Add the hosts band and rebuilt footer"
```

---

### Task 7: Call for participation page

**Files:**
- Modify: `docs/call-for-participation.html`

**Interfaces:**
- Consumes: header, nav, hosts band and footer markup from Tasks 4 and 6; all styles from Task 2.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Write the failing test**

Add a check `cfp-table-keyboard`:

```js
const w = cfp.match(/<div class="table-scroll"[^>]*>/)[0];
assert(/tabindex="0"/.test(w) && /role="region"/.test(w), "table scroll region must stay keyboard reachable");
assert(/\.table-scroll:focus-visible/.test(css), "and must have a visible focus style");
```

- [ ] **Step 2: Run it**

Run: `node tools/check-site.mjs cfp-table-keyboard`
Expected: FAIL on the focus style — Task 2 replaced the stylesheet.

- [ ] **Step 3: Rewrite the headings**

Exactly these eleven changes and nothing else. **No date, fact, link or anchor id moves.**

| Now | Becomes |
|---|---|
| `<h1>` "Call for / Participation." | "Call for Participation" |
| `01 / OVERVIEW` + "A first gathering / for the DGGS community." | "Overview" |
| `02 / TOPICS` + "Topics of interest." | "Topics of interest" |
| `03 / SUBMISSION TYPES` + "Three ways to contribute." | "Submission types" |
| `04 / IMPORTANT DATES` + "Important dates." | "Important dates" |
| `05 / WORKSHOPS & TUTORIALS` + "Propose a workshop / or a tutorial." | "Workshops and tutorials" |
| `06 / REVIEW` + "Review process." | "Review process" |
| `07 / PROCEEDINGS` + "Proceedings." | "Proceedings" |
| `08 / HOW TO SUBMIT` + "How to submit." | "How to submit" |
| `09 / COMMITTEE & CONTACT` + "Organizing committee / and contact." | "Organizing committee and contact" |
| Closing block "A world of cells. / A community of people." | Delete the section |
| Topic card numbers `01`–`04` | Delete the `<span class="topic-number">`; group headings stay |

- [ ] **Step 4: Restyle to the new system**

Swap header, nav (marking itself current), hosts band and footer for the Task 4 and 6 markup. Keep the chip table of contents, the submission-types table and its scroll region, the grouped dates and the template download links. Raise every size to the 13px floor.

- [ ] **Step 5: Run the checks**

Run: `node tools/check-site.mjs`
Expected: all PASS, including `dates-match-cfp` across both pages.

- [ ] **Step 6: Commit**

```bash
git add docs/call-for-participation.html docs/assets/styles.css tools/check-site.mjs
git commit -m "Rewrite the call for participation headings and restyle the page"
```

---

### Task 8: Responsive and accessibility

**Files:**
- Modify: `docs/assets/styles.css`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Write the failing test**

Add a check `responsive-rules` asserting the stylesheet contains: a `max-width:860px` block collapsing `.tracks` to one column; a `prefers-reduced-motion` block setting `scroll-behavior:auto`; an `:focus-visible` outline rule; and a `clamp(` on the hero `h1`.

- [ ] **Step 2: Run it**

Run: `node tools/check-site.mjs responsive-rules`
Expected: FAIL.

- [ ] **Step 3: Implement**

Hero `h1` uses `clamp(34px, 7vw, 52px)` and the formal title `clamp(17px, 2.4vw, 21px)`, so the 58-character title wraps rather than overflowing at 360px. `.tracks` and `.rows` collapse at 860px. Nav wraps. `:focus-visible` outline in `--pine`, 3px, offset 3px, on every link, button and the table scroll region. `prefers-reduced-motion` disables smooth scrolling.

- [ ] **Step 4: Verify at width**

Run: `node tools/check-site.mjs`
Expected: all PASS.

Then open both pages in a browser at 360px, 800px and 1400px. Confirm: no horizontal scrollbar at any width; the hero title wraps to at most three lines at 360px; the sticky header does not cover a heading after clicking a nav item.

- [ ] **Step 5: Commit**

```bash
git add docs/assets/styles.css tools/check-site.mjs
git commit -m "Add responsive breakpoints and accessibility rules"
```

---

### Task 9: Metadata and final pass

**Files:**
- Modify: `docs/index.html`, `docs/call-for-participation.html`

- [ ] **Step 1: Update metadata**

On both pages: `<title>`, `meta description`, `og:title`, `og:description` to match the new hero wording ("DGGSCon 2027 — 1st International Conference on Discrete Global Grid Systems", 25–27 October 2027, Banff Centre). Remove the `og:title` tagline "The world, cell by cell." Bump the stylesheet cache query to `?v=8`.

- [ ] **Step 2: Run everything**

Run: `node tools/check-site.mjs`
Expected: every check PASS.

- [ ] **Step 3: Commit**

```bash
git add docs
git commit -m "Update page metadata for the redesign"
```

---

## Self-review notes

- **Spec coverage.** Visual language → Task 2. Type scale → Tasks 2, 8. Layout discipline → Task 5. Homepage structure → Tasks 4–6. Copy → Tasks 4–6. Hosts band → Tasks 3, 6. Footer → Task 6. CFP page → Task 7. Responsive → Task 8. Accessibility → Tasks 7, 8. Verified facts → Task 1's `dates-match-cfp`, run by every task after.
- **Left open deliberately.** CSS property order and rule grouping; exact hover treatments; whether the hosts band appears on the CFP page (Task 7 Step 4 says swap it in — reverse it if it crowds that page).
- **Blocking before Task 3:** the hero photograph choice.
