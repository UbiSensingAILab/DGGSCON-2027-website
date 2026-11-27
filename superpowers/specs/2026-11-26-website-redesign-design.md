# DGGSCon 2027 website redesign — design

Date: 2026-11-26
Status: approved, ready to plan
Branch: `redesign`

> Location note: the brainstorming convention puts this under `docs/`, but `AGENTS.md`
> publishes `docs/` through GitHub Pages, so a design document there would appear on
> the public site. It lives outside `docs/`, at
> `superpowers/specs/`, so it is versioned with the site but never published.

## Intent and why

The current site reads as AI-generated. That is the problem being solved — not a
vague wish for "nicer". The specific devices that produce the impression were
identified by comparing the page against six real conference sites (CHI 2025,
NeurIPS 2025, ICML 2025, FOSS4G 2025, State of the Map 2025, AGILE 2025):

- Poetic two-line couplets as headings: "The world, / cell by cell.",
  "A world of cells. / A community of people.", "Think globally. / Meet in the Rockies."
- Numbered section labels with hairline rules: `01 / ABOUT`, `02 / PROGRAMME`.
- Decorative fake telemetry on the globe illustration: `LOCAL CELLS. GLOBAL CONNECTIONS.`
  and `01 / 27`.
- A band of single words separated by asterisks: Research ✳ Development ✳ Applications.
- Terse declarative headlines ending in periods: "Ideas meet practice."
- Extreme negative letter-spacing on very large display type (−5.5px at 93px).

Not one of the six reference sites uses any of these. Their entire decorative
vocabulary is `»` on links and a single horizontal rule style. They lead with
facts — conference name, dates, city — within the first few lines, label navigation
with plain nouns, and title sections with nouns ("Important Dates", "Registration",
"Venue").

The second, independent problem: text is too small to read comfortably. The current
stylesheet sets text at 8px (globe caption strip), 9px (programme tags) and a great
deal at 10–11px (section labels, status pills, footer, CMT acknowledgement, photo
credits). At the 520px breakpoint the globe strip drops to 6px.

This matters now because the call for participation is live and the site is the
public face of a real conference soliciting submissions and travel to Alberta.

## Goals

1. The site reads as a professional academic conference site to someone who knows the genre.
2. Nothing on either page is smaller than 13px.
3. The homepage leads with what the conference is, when it is, and where.
4. Navigation items correspond one-to-one with sections that exist on the page.
5. Every date shown matches `DGGSCON-2027/program/cfp/call-for-participation-draft.md`.

## Non-goals

- No new pages beyond the existing two (homepage, call for participation).
- No CMS, framework, build step or JavaScript dependency. The site stays buildless
  static HTML and CSS, per `AGENTS.md`.
- No organizers/committee section and no sponsor grid on the homepage — declined,
  because the committee is largely "TBC" and there are no sponsors yet. A single
  sponsorship line survives under the hosts band.
- No countdown timer and no news/announcement feed.
- No FAQ section. Its three answers (when and where, submitting, who hosts) are now
  carried by Venue, Dates, the call for participation and the hosts band.
- No change to the call for participation's *facts*. The `.md` in the planning repo is
  the source of record; dates, section order and anchor ids are unchanged. Its headings
  and numbered labels **are** rewritten — see "Call for participation page".

## Anti-goals

Things that would make this a failure even if it technically worked:

- Any reintroduction of the devices listed under Intent. If a future change wants a
  numbered section label, an eyebrow micro-label, a decorative metadata strip or a
  two-line poetic headline, that change is wrong.
- Inventing conference facts. Speakers, sponsors, endorsements, publication
  arrangements, deadlines and prices come from the CFP or the private planning repo,
  or they are left out (`AGENTS.md`).
- Hedged copy. `AGENTS.md` requires a definite voice; confirmed details are stated as
  fact, and unreleased details are described as "will be published here".
- Losing the Microsoft CMT acknowledgement. It is required verbatim and must stay visible.

## Constraints

- Buildless static site; relative asset paths so it works at the project URL and a
  future custom domain.
- Publish only `docs/`; maintenance material at the root.
- Lowercase hyphen-separated filenames.
- Keyboard access, visible focus, readable contrast, responsive layout, reduced-motion.
- The only permitted external resource is Google Fonts, which the site already uses.

## Approaches

Three directions were built as working pages and reviewed in a browser.

**A — Conference of record.** Serif masthead carrying the full conference name,
deadlines in a right sidebar, an announcements feed. Closest to AGILE, ICML and
NeurIPS. Rejected: it projects an institutional history a first edition does not
have, and it wastes the Banff photography, which is a genuine draw.

**B — Place-led.** Banff photograph full-bleed with the name, dates and venue over
it; facts-first; plain noun navigation. Closest to FOSS4G and CHI. **Chosen.** For a
first-edition conference asking people to fly to Alberta, the mountains are an
argument rather than decoration, and the facts-first hero is what every reference
site does.

**C — Current identity, cleaned up.** Keeps the existing paper-and-pine palette, logo
and Manrope/DM Sans pairing, with the AI tells stripped and the structure fixed.
Rejected as the primary direction: the homepage would still lead with abstraction
rather than with what and when. It was the cheapest option and remains the fallback
if the palette change below is ever reversed.

## The design

### Visual language

Direction B's palette replaces the current paper-and-pine one. **This retires the
`#f5f4eb` paper background and the Manrope/DM Sans pairing.** The logo and the Banff
photograph carry over unchanged.

| Token | Value | Use |
|---|---|---|
| Page | `#ffffff` | Body background |
| Ink | `#16242a` | Primary text |
| Muted | `#49595e` | Body paragraphs inside prose blocks |
| Muted light | `#5d7075` | Notes, captions, secondary labels |
| Pine | `#16514a` | Links, primary buttons, group labels, section rules |
| Pine dark | `#0f3d38` | Button hover |
| Footer | `#102b2d` | Footer background |
| Footer text | `#c9dad7` | Footer text |
| Panel | `#f4f7f6` | Announcement band, registration section |
| Rule | `#e2e7e8` / `#e4e9ea` / `#e9eded` | Borders, row hairlines, section dividers |

Typeface: **Inter** (400, 500, 600, 700) from Google Fonts, replacing DM Sans and Manrope.

### Type scale

Base 17px / 1.65. **Minimum size anywhere on the site: 13px.**

| Element | Size |
|---|---|
| `h1` hero | 52px, 700, −1.7px tracking |
| Hero subtitle (formal title) | 21px, 500 |
| Hero meta line | 18px |
| `h2` section | 30px, 600 |
| `h3` | 19–21px, 600 |
| Prose blocks (About, Venue, Registration) | 18px / 1.75 |
| Lede paragraph | 21px / 1.55, 500 |
| Row lists (dates, venue facts) | 18px |
| Body default, nav, announcement | 16–17px |
| Notes, group labels, host label, CMT | 13–16px |

Prose runs the full page width, which gives a 100–110 character line where 60–80 is
comfortable. 18px with 1.75 line-height is the agreed mitigation. This was raised as
a concern, reviewed on screen and accepted.

### Layout discipline

The page has **two shapes only**:

1. **Full-width blocks** — prose and row lists, running margin to margin.
2. **One three-column block** — the Programme strands.

This was the main correction during review: the earlier draft changed column count
four times down the page and read as cluttered. Dates and venue facts share a single
row style — label left, value hard right, hairline between — so the two sections
visually rhyme rather than each inventing a layout.

Page container: `width: min(1100px, 100% - 56px)`, centred.

### Homepage structure

Nav order mirrors page order exactly, and every item resolves to a real section.

| Nav label | Anchor | Section |
|---|---|---|
| About | `#about` | What DGGS are, who the conference is for. Lede plus two paragraphs, closing with one sentence naming the four theme areas and linking to the full topic list on the CFP page. |
| Dates | `#dates` | All deadlines, grouped: Full and short papers / Industry track / Registration / Conference. |
| Programme | `#programme` | Intro line, the three strands, the journal special issue line, and a note that schedule and keynotes follow. |
| Venue | `#venue` | Banff Centre prose, then a facts list. |
| Registration | `#registration` | States it is not open; holds an inert placeholder for the link. |
| Call for Participation | `call-for-participation.html` | The one off-page link, styled as the primary button. |

Above the sections, in order:

1. **Sticky header** — logo, "DGGSCon 2027", the nav. `scroll-padding-top: 76px` and
   `scroll-margin-top: 70px` on sections so headings do not hide behind it.
2. **Hero** — Banff photograph full-bleed, gradient overlay
   (`rgba(10,30,32,.22)` to `rgba(10,30,32,.84)`), with: `DGGSCon 2027`; the formal
   title *1st International Conference on Discrete Global Grid Systems*; one meta line
   reading `25–27 October 2027 · Banff Centre, Banff, Alberta, Canada`; a single
   "Call for Participation" button, and no photo credit. One button only — a second
   competes with the primary action for no gain.
3. **Announcement band** — panel background, a "NOW OPEN" tag, then:
   *"The call for participation is open. Full and short papers are due 16 April 2027,
   industry abstracts 28 May 2027."* with a "Read the call →" link. One fact, one action.
   The deadline split matters: an earlier draft wrongly gave all three submission types
   the 16 April date.

Below the sections: the **hosts band**, then the footer.

### Copy

The approved mockup is the copy source, not a description of one. Text that is fixed:

**Hero.** `DGGSCon 2027` / *1st International Conference on Discrete Global Grid Systems* /
`25–27 October 2027 · Banff Centre, Banff, Alberta, Canada` / button `Call for Participation`.
**No photo credit.** The Pexels License requires none, and Erin chose to carry none rather
than mark a licence the photograph does not have.

**Announcement band.** Tag `NOW OPEN`, then: "The call for participation is open. Full and
short papers are due 16 April 2027, industry abstracts 28 May 2027." with `Read the call →`.

**About.** Lede: "DGGS organize the Earth into systems of cells, creating a common framework
for connecting and analysing geospatial information." Then the two paragraphs from the
mockup, then: "Topics span the foundations of DGGS, tools, standards and interoperability,
analysis and applications, and DGGS with GeoAI." linking to the CFP's topic list.

**Programme.** Intro: "One day of workshops and tutorials on 25 October, followed by two
days of conference sessions on 26–27 October." Three strands: *Workshops & tutorials*
(25 October), *Research & applications* (26–27 October), *Industry & demonstrations*
(26–27 October). Then: "Authors of accepted full papers may be invited to a journal
special issue." — the CFP's own wording, which is softer than "will" and matches the
source of record. Then: "The detailed schedule and keynote speakers will be published here."

**Dates.** Four groups as in the CFP, plus both qualifiers: "All deadlines 23:59 Pacific
Time (UTC−7)" below the list, and "Then open until the rooms are filled" as a sub-line on
workshop and tutorial proposals.

**Venue.** The confirmed prose and the four-row facts list, then "Accommodation and travel
guidance will be published here."

**Registration.** "Registration is not yet open" / "Fees, the registration link and
accommodation booking will be published here. Super early bird registration closes
15 June 2027, and every author and presenter must register by 15 July 2027." / inert
placeholder reading `Registration link — to come`.

**Hosts band.** Label `Hosted by`, the two marks, and one line beneath: "Sponsorship
opportunities will be published here." This is where sponsorship lives; there is no
sponsor section.

### Hosts band

Light background, above the dark footer, no cards or boxes. Label "Hosted by", then
the two university marks at a shared 42px height.

The two assets are built for opposite backgrounds, which is the whole difficulty:

- `university-of-calgary-logo.jpg` is dark artwork on white, and **the artwork fills
  only 40.2% of the image height** — measured bounding box `x 58–514, y 93–217` of a
  576×311 file. Matching box heights therefore rendered it at roughly half the visual
  size of the Guelph mark.
- `university-of-guelph-logo.svg` is built for dark backgrounds: `.cls-1{fill:#fff}`.
  On a white card its wordmark disappears and only the yellow crest survives.

**Decision:** add a cropped Calgary asset at `docs/assets/university-of-calgary-logo-cropped.jpg`,
cropped to `461×129` (ffmpeg `crop=461:129:56:91`). Its proportions then run 3.57:1
against Guelph's 3.08:1, close enough that one shared height balances them. Calgary
gets `grayscale(1)` with `mix-blend-mode: multiply` at `opacity .78`; Guelph gets
`grayscale(1) brightness(.42)`, the same treatment the current live site already uses.
The original uncropped file stays in the repository.

### Footer

Dark. Conference name and formal title, venue, dates, a contact link, and then the
**Microsoft CMT acknowledgement, verbatim and unaltered**, on its own rule-separated
full-width line at 14px — up from the 10px it is set at today:

> The Microsoft CMT service was used for managing the peer-reviewing process for this
> conference. This service was provided for free by Microsoft and they bore all
> expenses, including costs for Azure cloud services as well as for software
> development and support.

### Call for participation page

Restyled to the same system — same header, nav, type scale, row style and footer. Its
nav marks itself the current page. The submission-types table with its scrollable
region, the grouped dates, the template download links, section order and anchor ids
all carry over unchanged, and its small type comes up to the 13px floor.

**Its headings are rewritten**, because the page is built from the devices this project
exists to remove: nine `01 / OVERVIEW` … `09 / COMMITTEE & CONTACT` labels, `01`–`04`
topic numbers, split two-line headings, headings ending in periods, and the
"A world of cells. / A community of people." closing block. Leaving them would mean half
the public site still carries the look, and goal 1 fails.

No fact, date, link or anchor id changes — presentation only:

| Now | Becomes |
|---|---|
| `01 / OVERVIEW` + "A first gathering<br>for the DGGS community." | "Overview" |
| `02 / TOPICS` + "Topics of interest." | "Topics of interest" |
| `03 / SUBMISSION TYPES` + "Three ways to contribute." | "Submission types" |
| `04 / IMPORTANT DATES` + "Important dates." | "Important dates" |
| `05 / WORKSHOPS & TUTORIALS` + "Propose a workshop<br>or a tutorial." | "Workshops and tutorials" |
| `06 / REVIEW` + "Review process." | "Review process" |
| `07 / PROCEEDINGS` + "Proceedings." | "Proceedings" |
| `08 / HOW TO SUBMIT` + "How to submit." | "How to submit" |
| `09 / COMMITTEE & CONTACT` + "Organizing committee<br>and contact." | "Organizing committee and contact" |
| Closing block "A world of cells. / A community of people." | Removed |
| Topic card numbers `01`–`04` | Removed; the four group headings stay |

The chip-style table of contents at the top of the page stays — it is navigation, not
decoration — with its labels unchanged.

Erin should read the new headings before this ships.

### Responsive

- Programme strands collapse to one column at 860px; row lists drop to 17px.
- Nav wraps rather than overflowing.
- Hero type scales down; the photograph keeps its subject at phone width.
- `prefers-reduced-motion` disables smooth scrolling.

### Accessibility

- Visible focus rings on every interactive element.
- The submission-types table keeps its focusable scroll region on the CFP page.
- Contrast checked against the new palette, particularly muted text on white and
  footer text on `#102b2d`.
- Hosts band logos keep their `alt` text.

### Hero photograph

The photograph the site carried until now — `banff-centre-autumn-rita-taylor.jpg`, taken
from `tourismealberta.ca` — **has no licence covering this use** and is removed. Travel
Alberta's terms grant a limited licence "for educational or personal, non-commercial
purposes only" and prohibit third-party hosting; Banff Centre's media room offers the same
file under a mandatory credit but states no scope for web use. Nobody obtained permission.

Replaced with Pexels photo 40105389 — Banff Avenue and Cascade Mountain seen from Cascade
Gardens, autumn. Downloaded at 3456 × 5184 and cropped with
`ffmpeg -vf "crop=3456:2156:0:1514,scale=2400:-1" -q:v 5`, giving 2400 × 1497 at 454 KB,
saved as `docs/assets/banff-hero.jpg`.

**Pexels License:** free to use including commercially, no permission request, no
attribution required. Its only restrictions — no use as a trade mark or business name, no
implying endorsement by people or brands depicted — do not apply here.

Provenance for every image is recorded in `asset-credits.md` at the repository root:
source URL, licence, and the date downloaded. That file is the internal record; it is not
a public claim and is not published.

## Verified facts

Checked against `DGGSCON-2027/program/cfp/call-for-participation-draft.md` as of
2026-11-26; all nine dates match: papers 16 April, workshop and tutorial proposals
30 April ("then open until the rooms are filled"), notification 31 May, camera-ready
13 August, industry abstracts 28 May, industry notification 8 June, super early bird
15 June, early bird and author/presenter deadline 15 July, regular registration from
16 July. Conference 25 October (workshops), 26–27 October (main).

Venue details were written for this redesign and **confirmed correct by Erin on
2026-11-26**: Banff Centre for Arts and Creativity, 107 Tunnel Mountain Drive, Banff,
Alberta; Calgary International (YYC) about 90 minutes by road; lecture theatres,
breakout rooms and accommodation on site.

## Decisions made during the builder check

A fresh reviewer read this document as if they had to build from it. Erin decided the
first two; the rest were settled here and are recorded as my calls, not hers.

1. **The CFP page's headings are rewritten**, not just restyled. Erin's decision.
2. **Orphaned homepage content:** the journal special issue line and the sponsorship
   line survive; the FAQ is dropped; Topics of interest is folded into the About text
   as one sentence rather than getting its own section. Erin's decision.
3. **Date qualifiers are kept.** Dropping the time-zone line would change what the
   deadlines mean.
4. **Footer "Contact" points at the CFP's contact section**, not a `mailto:`. Putting
   a personal university address in every footer is a decision nobody has made; the
   CFP already carries the address in context. Revisit if a conference address exists.
5. **`globe.svg` is retired** from the homepage; the file stays in the repository.
   Giving it a slot would introduce a third layout shape, against the discipline above.
6. **The hero photograph is replaced and carries no credit.** Resolved 2026-11-26 — see
   "Hero photograph" below.
7. **No registration opening date** is published; none exists in anything available
   here. The section states registration is not open and lists the closing dates only.

## What is left to the builder

- CSS file organisation, property order, and how much of the existing stylesheet to
  keep versus replace.
- Exact hover, focus and active treatments within the palette above.
- Updating `<title>`, meta description and Open Graph tags on both pages to match the
  new hero wording.
- The cache-busting query on the stylesheet link.
- Whether the hosts band appears on the CFP page as well as the homepage.
- Favicon and logo files stay as they are.

### Host logo sizing

The two institutional lockups have very different internal proportions. Measured from
the artwork: the wordmark is **41.1%** of the cropped Calgary image's height but only
**23.2%** of the Guelph SVG's, so equal box heights render Calgary's type about 1.8×
larger — which is what it looked like, and was reported twice.

Sizing them by wordmark alone is wrong too, because Guelph's crest would then tower over
Calgary's shield. The shipped compromise is `.host-calgary img{height:38px}` and
`.host-guelph img{height:52px}`, which brings the wordmarks close while keeping the
crests comparable. Four options are rendered side by side with the real files in
[`2026-11-26-host-logo-sizing.html`](2026-11-26-host-logo-sizing.html); open it if the
balance is ever revisited.

### Arrival day

The previous site published "Sunday, October 24 — Arrival". It is **not** in the call for
participation, so it is not published anywhere on the redesigned site. Confirmed by Erin
on 2026-11-26: dropping it is intended, not an oversight. Do not reinstate it unless the
CFP gains it.

## Open, not blocking

- The registration link URL does not exist yet; the placeholder stands until it does.
- Keynote speakers, the detailed schedule and committee names are unannounced; each
  has a "will be published here" line.
- There is one Banff photograph. If the Venue section should carry its own image
  later, a second photograph is needed rather than reusing the hero.
