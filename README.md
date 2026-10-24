# NM Fire Website Rebuild

A responsive, static reference-style website rebuild for **CNP NM Fire-fighting System Co., Ltd.** The project includes product information, company pages, technical resources, a contact form, and an on-site website issue-reporting form.

- **Preview website:** https://burhanuddin-majal.github.io/nm-fire-pumps-rebuild/
- **Official NM Fire website:** https://www.nmfirepumps.com/
- **Repository:** https://github.com/burhanuddin-majal/nm-fire-pumps-rebuild

## Preview Website Notice

**This website is a preview rebuild and is not yet the officially published production website.** It may contain unfinished content, bugs, inaccurate information, or features that have not been fully tested. Until this preview is formally reviewed, approved, and published, we recommend using the official NM Fire website for current company information and enquiries. Once this rebuild has been officially published and verified, we recommend using the published website.

Do not rely on this preview for engineering, safety, procurement, or other critical decisions. Confirm current product specifications, certifications, and company information directly with NM Fire and the relevant issuing organizations.

## Abuse, Spam, and Network Blocking Policy

Please use the website and its forms responsibly. Do not submit spam, repeated irrelevant content, abusive messages, malicious payloads, threats, or other inappropriate information. Submissions that violate this policy may be rejected, restricted, or reported, and access may be blocked.

Where technically available and legally permitted, the site operator may use IP-address blocking, VPN/proxy access restrictions, and network or device-related signals to detect and limit repeated abuse or attempts to bypass restrictions. These methods may not identify every attempt and do not guarantee that a particular person or device can be identified. Do not attempt to evade a block. Any collection or use of technical data remains subject to applicable law and the site's actual configuration.

**Important:** This section describes the site's abuse policy; it does not mean that IP blocking, VPN blocking, or device/network detection is already implemented or active. Those controls must be separately configured and tested before they can be relied on.

## Stable website pages

| File | Purpose |
|---|---|
| `index.html` | Homepage, product highlights, slideshow, and Bugs and Issues Report section |
| `products.html` | Product categories |
| `product-detail.html` | Product details rendered from the shared product data script |
| `about.html` | Company background |
| `strength.html` | Company capabilities and facilities |
| `projects.html` | Project references |
| `resources.html` | Resources and downloads |
| `certificates.html` | Certificate and membership information |
| `calculators.html` | Engineering calculation/reference tools |
| `contact.html` | General project and product enquiry form |
| `fire-protection-consulting.html` | Fire-protection planning and consulting information |
| `news.html` | News and updates page |
| `video.html` | Video resources page |
| `training.html` | Training information |
| `sitemap.html` | Site navigation overview |
| `report-issue.html` | Website bug, content-correction, and feature-suggestion form |

## Repository structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── config.yml
│   └── workflows/
│       └── release-notes.yml
├── ai-worker/
│   ├── index.js
│   ├── wrangler.toml
│   └── README.md
├── assets/
│   ├── 272.jpg
│   ├── nmfire-pakistan-logo.svg
│   ├── product-detail.js
│   ├── site.css
│   └── site.js
├── worker/
│   ├── index.js
│   └── wrangler.toml
├── about.html
├── allowed-users.txt
├── calculators.html
├── certificates.html
├── CODE_OF_CONDUCT.md
├── contact.html
├── fire-protection-consulting.html
├── index.html
├── LICENSE
├── news.html
├── product-detail.html
├── products.html
├── projects.html
├── RELEASE_NOTES.md
├── report-issue.html
├── resources.html
├── sitemap.html
├── strength.html
├── training.html
└── video.html
```

### Shared assets and scripts

- `assets/site.css` — shared site layout, responsive styling, and page components.
- `assets/site.js` — navigation, slideshow, shared form submission, and small page interactions.
- `assets/product-detail.js` — product detail content and page rendering.
- `assets/272.jpg` — current logo image used across the site.

### Website status

The repository's default branch is `main`. Root-level pages are the current website preview. No separate preview snapshot is maintained. This repository should be treated as a preview until the rebuild is formally reviewed, approved, and published.

## Forms and email delivery

- **General contact form:** `contact.html` submits through FormSubmit to the configured NM Fire contact mailbox.
- **Website issue form:** `report-issue.html` uses a FormSubmit token-based endpoint. The endpoint identifier is intentionally not repeated in this README.
- **Form handling:** `assets/site.js` submits forms marked with `data-contact-form` and displays success or error feedback.
- **Fire protection consulting:** `fire-protection-consulting.html` provides a prefilled email draft using a `mailto:` link; the visitor reviews and sends it in their email application.

FormSubmit may require recipient/endpoint activation before delivery works. A committed form is not proof that email delivery is working: test both forms with the appropriate mailbox owner's permission before relying on them in production. Never place passwords, private customer information, or other confidential information in a public issue report.

## GitHub repository workflows and policies

- `.github/ISSUE_TEMPLATE/` contains templates for bug reports and feature requests submitted through GitHub Issues. These are separate from the website's `report-issue.html` form.
- `.github/workflows/release-notes.yml` is configured to update `RELEASE_NOTES.md` for commits pushed to `main`, including version, generated serial number, commit reference, date, and message. Check the Actions tab to confirm a workflow run completed successfully.
- `CODE_OF_CONDUCT.md` describes expected participation and conduct.
- `LICENSE` contains the project's usage terms.
- `allowed-users.txt` lists the named users/entities recorded by the project license.

## Technology and local preview

This is a static website preview built with HTML, CSS, and vanilla JavaScript. There is no package installation or build step required for the website itself.

1. Clone the repository.
2. Open the project folder in a code editor.
3. Open `index.html` directly in a browser, or serve the folder with a local static web server for a more realistic preview.
4. Browse the pages and test links at desktop and mobile widths.

The `worker/` folder contains a **retired Cloudflare Worker endpoint** kept in the repository for reference. Its current response is HTTP 410 (Gone); the website's inquiry forms now submit through FormSubmit. It is not required to preview or serve the static website. Do not deploy it as an active form relay.

## Deployment and QA checklist

Before or after a production release, verify:

- Homepage slideshow, navigation menu, and responsive layouts.
- Product category links and product detail rendering.
- Certificate, resource, news, video, and training page links.
- The homepage Bugs and Issues Report links open the correct form.
- The general contact form and issue-report form submit successfully and email delivery is confirmed.
- Consulting email links open a correctly prefilled draft.
- GitHub Pages deployment completes successfully in the repository's Actions/deployment status.

## Accuracy note

This is a reference rebuild, not a substitute for official engineering documentation. Confirm product specifications, certification status and scope, and technical or commercial claims with NM Fire and the relevant issuing organizations before making engineering, safety, or procurement decisions.
