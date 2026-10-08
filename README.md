# DGGSCon 2027 Website

Public website source for DGGSCon 2027. This repository contains only website material intended for public release.

## Files

- `docs/index.html`: page content and structure.
- `docs/assets/styles.css`: responsive styling.
- `docs/assets/globe.svg`: original illustrative grid artwork.
- `docs/assets/dggscon-logo.png`: brush-style mountain and grid logo used in the header, footer and favicon.
- `docs/assets/banff-centre-autumn-rita-taylor.jpg`: Banff Centre campus photograph by Rita Taylor.
- `docs/assets/icon.svg`: retained original grid icon.
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

The globe and abstract mountain illustrations are original SVG artwork. The grid illustration is conceptual rather than an implementation of a particular DGGS tessellation. The brush-style logo was created with OpenAI image generation.

The Banff Centre autumn photograph is credited to Rita Taylor and was sourced from [Tourisme Alberta](https://tourismealberta.ca/wp-content/uploads/2018/05/Banff-Centre-for-Arts-and-Creativity-Campus-Fall-Photo-by-Rita-Taylor.jpg). The visible photographer credit and source link are retained beneath the image.

University host logos are sourced from the universities' own public websites: [University of Calgary black horizontal logo](https://www.ucalgary.ca/sites/default/files/2019-10/UCalgary_Horizontal_logo_black.jpg) and the [University of Guelph header component](https://www.uoguelph.ca/@uoguelph/web-components/uofg-header.esm.js). The Guelph SVG is extracted unchanged from that component. CSS applies the requested grey treatment; source artwork and proportions are retained.
