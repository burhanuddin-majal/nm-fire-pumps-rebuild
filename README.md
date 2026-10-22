# NM Fire Website Rebuild

A responsive reference-style website rebuild for **CNP NM Fire-fighting System Co., Ltd.**, with product information, company pages, project references, resources, certificates, and a contact form.

- **Live preview:** https://burhanuddin-majal.github.io/nm-fire-pumps-rebuild/
- **Official website:** https://www.nmfirepumps.com/

## Pages

- `index.html` — Homepage with a three-image hero slideshow and product highlights
- `products.html` — Product categories
- `product-detail.html` — Product detail views
- `about.html` — Company background
- `strength.html` — Company capabilities
- `projects.html` — Project references
- `resources.html` — Resources and downloads
- `certificates.html` — UL, FM, CE/ECM, NFPA membership, and European Fire Sprinkler Network certificate gallery
- `calculators.html` — Engineering calculators
- `contact.html` — Contact form
- `sitemap.html` — Site navigation overview

## Project structure

```
.
├── assets/
│   ├── site.css
│   ├── site.js
│   └── 272.jpg
├── index.html
├── products.html
├── product-detail.html
├── about.html
├── strength.html
├── projects.html
├── resources.html
├── certificates.html
├── calculators.html
├── contact.html
└── sitemap.html
```

## Technology

This is a static website built with HTML, CSS, and vanilla JavaScript and intended for GitHub Pages. No package installation or build step is required. Shared styling is in `assets/site.css`; shared interactions are in `assets/site.js`.

## Run locally

1. Clone or download the repository.
2. Open `index.html` in a browser, or serve the repository folder with a local static web server.
3. Use the navigation to browse the pages.

## Contact form

The contact form uses FormSubmit. The recipient and form markup are configured in `contact.html`, and submission handling is in `assets/site.js`. The mailbox recipient must complete FormSubmit's activation process before normal email delivery works. Test delivery with the mailbox owner's permission before deployment.

The current contact form does not require a Cloudflare Worker.

## Deployment checks

After committing changes, allow GitHub Pages time to publish them. Test the homepage slideshow, navigation on desktop and mobile, certificate image links, and contact form delivery before the planned deployment.

## Verification note

This is a website rebuild/reference project. Verify product specifications, certificate validity and scope, and technical or commercial claims with NM Fire and the relevant issuing organizations before relying on them for engineering or procurement decisions.
