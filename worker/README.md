# NM Fire inquiry webhook relay

This Cloudflare Worker keeps the Discord webhook token server-side rather than exposing it in the public website.

## Setup

1. Create a Cloudflare Worker named `nm-fire-inquiry-relay`.
2. Deploy `index.js` from this folder as the Worker entry point.
3. In the Worker settings, add a secret named `DISCORD_WEBHOOK_URL` containing a **newly regenerated** Discord webhook URL. Do not put the URL in GitHub or frontend code.
4. Deploy the Worker and copy its public `workers.dev` URL.
5. In `contact.html`, set the form's `data-endpoint` attribute to that real Worker URL.
6. Commit the endpoint change and test with a non-sensitive test enquiry.

The Worker accepts requests only from `https://burhanuddin-majal.github.io`. If the site later uses a custom domain, update `ALLOWED_ORIGIN` in `index.js` to that exact origin and redeploy.

## Security notes

- Rotate any Discord webhook URL that has been shared in chat or other public places.
- The Worker validates required fields, limits field lengths, includes a honeypot, and disables automatic Discord mentions.
- GitHub Pages is static and cannot run this Worker by itself. The Worker must be deployed separately.
