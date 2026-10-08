# DGGSCon 2027 Website

Public website source for DGGSCon 2027. This repository contains only website material intended for public release.

## Files

- `docs/index.html`: page content and structure.
- `docs/assets/styles.css`: responsive styling.
- `docs/assets/globe.svg`: original illustrative grid artwork.
- `docs/assets/icon.svg`: original site icon.
- `docs/.nojekyll`: serve the static files without Jekyll processing.

## Preview locally

From the repository root:

```sh
python3 -m http.server 8080 --directory docs
```

Open `http://localhost:8080`. No dependencies or build step are required.

## Publish and maintain

GitHub Pages publishes the `docs/` directory on `main`. Commit and push updates to deploy them. The default address is:

https://ubisensingailab.github.io/DGGSCON-2027-website/

The custom domain is not configured. Add it only after domain ownership and DNS access have been arranged.

October 25–27, 2027 and Banff Centre are published as tentative dates and venue. The tentative schedule has arrival on October 24, workshops and tutorials on October 25, and two conference days on October 26–27. Final dates and venue arrangements, speakers, organizing appointments, submission deadlines, registration prices and publication arrangements remain unconfirmed. Replace the relevant copy when confirmed. The page has no registration form, payment processing, analytics or backend.

All visual assets in this repository are original SVG artwork. The illustration is conceptual, not an implementation of a particular DGGS tessellation or a photograph of the venue.
