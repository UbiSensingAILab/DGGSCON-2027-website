# Asset credits and provenance

Internal record of where every image in `docs/assets/` came from and what licence it
carries. This file is **not** published — it sits outside `docs/`, which is what GitHub
Pages serves. It is not a public licence claim; it is the answer to "can we reuse this?"
asked two years from now.

Add a row whenever an image is added. Where provenance is genuinely unknown, write
"unknown" rather than guessing.

| File | What it is | Source | Licence | Added |
|---|---|---|---|---|
| `banff-hero.jpg` | Banff Avenue and Cascade Mountain from Cascade Gardens, autumn. Homepage hero. | Pexels photo 40105389, https://www.pexels.com/photo/40105389/ — downloaded at 3456 × 5184 and cropped to 2400 × 1497 with `ffmpeg -vf "crop=3456:2156:0:1514,scale=2400:-1" -q:v 5` | Pexels License: free to use including commercially, no permission needed, **no attribution required**. Restrictions: not usable as a trade mark or business name; must not imply endorsement by people or brands depicted. Neither applies here, so the page carries no credit. | 2026-11-26 |
| `dggscon-logo.png` | DGGSCon conference logomark. | Commissioned or made for the conference; originating designer unknown to this repository. Check the private planning repository before reuse outside the conference. | unknown | before 2026-10-07 |
| `university-of-calgary-logo.jpg` | University of Calgary institutional lockup. Original, with the publisher's white margin. | University of Calgary. Used to identify a host institution. | Institutional trade mark, used with permission implied by the hosting relationship. Not a free licence — do not reuse outside DGGSCon material. | before 2026-10-07 |
| `university-of-calgary-logo-cropped.jpg` | The same lockup, cropped to its artwork so it optically matches the Guelph mark. | Derived from the file above: `ffmpeg -vf "crop=461:129:56:91"`. The original JPEG's artwork filled only 40.2% of its height. | As above. | 2026-11-26 |
| `university-of-guelph-logo.svg` | University of Guelph institutional lockup. Built for dark backgrounds — its wordmark is filled `#fff`, so it needs `filter: grayscale(1) brightness(.42)` to be visible on light ones. | University of Guelph. Used to identify a host institution. | Institutional trade mark, as above. | before 2026-10-07 |
| `icon.svg` | Site icon. | unknown | unknown | before 2026-10-07 |
| `templates/springer-lncs-*` | Springer LNCS author templates offered to authors for download. | Springer conference proceedings guidelines page, downloaded 2026-11-24. | **Unresolved.** `llncs.cls` on CTAN is CC BY 4.0, but the Word template carries no stated licence and Springer presents these files for its own proceedings. The planning repository's `program/cfp/template/README.md` flags confirming with lncs@springer.com. | 2026-11-24 |

## Removed

| File | Why |
|---|---|
| `banff-centre-autumn-rita-taylor.jpg` | **No licence covered the use.** Taken from `tourismealberta.ca`, whose terms reserve rights to the site owner; Travel Alberta grants only "educational or personal, non-commercial" use and bars third-party hosting. Banff Centre's media room offers the same file under a mandatory credit but states no scope for web use, and no permission was ever requested. Removed 2026-11-26 and replaced with `banff-hero.jpg`. |
| `globe.svg` | Retired with the illustrated hero in the 2026-11 redesign. Still in git history. |
