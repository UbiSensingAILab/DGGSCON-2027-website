# DGGSCon 2027 Website

Public website source for DGGSCon 2027. This repository contains only website material
intended for public release. Internal planning, finances, governance drafts and personal
assessments live in the private planning repository.

The conventions this site is built to are in [`AGENTS.md`](AGENTS.md). Read that before
changing anything — in particular the definite-voice rule and the prohibition on
inventing conference facts.

## Layout

Only `docs/` is published. Everything else is maintenance material.

| Path | What it is |
|---|---|
| `docs/index.html` | Homepage: About, Dates, Programme, Venue & travel, Registration. |
| `docs/call-for-participation.html` | The call for participation. |
| `docs/assets/styles.css` | The whole stylesheet. Design tokens at the top. |
| `docs/assets/banff-hero.jpg` | Homepage hero photograph. |
| `docs/assets/dggscon-logo.png` | Conference logomark, used in the header and as the favicon. |
| `docs/assets/university-of-calgary-logo-cropped.jpg` | Host logo, cropped to its artwork. |
| `docs/assets/university-of-guelph-logo.svg` | Host logo. Built for dark backgrounds. |
| `docs/assets/templates/` | Springer LNCS author templates offered to authors. |
| `docs/.nojekyll` | Serve the static files without Jekyll processing. |
| `tools/check-site.mjs` | Automated checks. Run before every push. |
| `asset-credits.md` | Where every image came from and what licence it carries. |
| `superpowers/specs/`, `superpowers/plans/` | Design and implementation record for the 2026-11 redesign. |

## Checks

```sh
node tools/check-site.mjs          # everything
node tools/check-site.mjs dates    # one check, by substring of its name
```

Seventeen checks: HTML structure, anchors, local links, the 13px minimum font size,
text contrast, the Microsoft CMT acknowledgement, every date against the call for
participation, hedging words, the removed AI-generated styling devices, hero contrast,
focus-ring visibility, the submission table's keyboard access, nav legibility,
responsive rules, narrow-width overflow, the table-of-contents layout, and the asset list.

**Dates are checked against the call for participation in the private planning
repository**, expected at `../DGGSCON-2027/program/cfp/call-for-participation-draft.md`.
Elsewhere, point `CFP_SOURCE` at that file. Without it, `dates-match-cfp` fails rather
than passing silently — the deadlines on this site are the one thing worth failing loudly
over.

Every check must be able to fail. If you add one, mutate the thing it names and confirm it
goes red before trusting it.

## Preview locally

Open `docs/index.html` in a browser. The site is buildless with relative paths, so
`file://` behaves the same as the published site. For an HTTP origin:

```sh
npx --yes http-server docs -p 8080 -o
```

## Publish

GitHub Pages publishes `docs/` from `main`:

https://ubisensingailab.github.io/DGGSCON-2027-website/

Commit and push to deploy. No custom domain is configured; add one only after domain
ownership and DNS access are arranged. The site has no registration form, payment
processing, analytics or backend.

## Facts and provenance

Conference details — dates, venue, deadlines, review and publication arrangements — come
from the call for participation in the private planning repository. It is the source of
record; this site follows it, never the other way round.

Image sources and licences are recorded in [`asset-credits.md`](asset-credits.md). Note
that the Banff Centre photograph previously used here was removed in November 2026
because no licence covered the use. Do not reinstate it.
