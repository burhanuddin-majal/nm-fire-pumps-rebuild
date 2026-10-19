# NM Fire inquiry email relay

This Cloudflare Worker sends contact-form inquiries to `pakistan@nmfirepump.com` using the Resend email API. Email credentials stay in Cloudflare Worker secrets, not in the public website.

## Setup

1. Create or sign in to a Resend account and add a sending domain you control.
2. Complete Resend's domain verification by adding the DNS records it provides at the domain's DNS host. Use a sender address on that verified domain for `RESEND_FROM_EMAIL`.
3. In Cloudflare, open the `nm-fire-inquiry-relay` Worker and add these settings under **Settings → Variables and Secrets**:
   - Secret `RESEND_API_KEY`: your Resend API key.
   - Variable `RESEND_FROM_EMAIL`: a sender such as `NM Fire Website <website@your-verified-domain.example>`, using a real address/domain that Resend has verified. Do not use the example literally.
4. Replace the currently deployed Worker code with the current `worker/index.js` from this repository, then deploy it. If the Cloudflare editor's filename is `worker.js`, paste the contents of `index.js` into that editor; the filename itself can differ.
5. The website form should point to the Worker URL in `contact.html` via its `data-endpoint` attribute.
6. Submit a harmless test enquiry and verify that it arrives at `pakistan@nmfirepump.com`.

## Allowed website origins

The Worker currently accepts these origins:
- `https://burhanuddin-majal.github.io`
- `https://nmfirepumppakistan.com`
- `https://www.nmfirepumppakistan.com`

Only the origin that matches the actual page is sent in CORS headers. If the production site uses a different hostname, update `ALLOWED_ORIGINS` in `index.js` and redeploy.

## Security notes

- Never commit or paste `RESEND_API_KEY` into GitHub or frontend code.
- The recipient is fixed in the Worker as `pakistan@nmfirepump.com`; form visitors cannot choose where inquiries are sent.
- The Worker validates required fields, limits field lengths, escapes submitted text in the HTML email, and includes a honeypot. CORS is not a substitute for rate limiting.
- GitHub Pages is static and cannot run this Worker by itself. The Worker must be deployed separately.
- The email provider must authorize the sender domain before delivery to arbitrary recipients is enabled. The recipient address does not need to be the sender domain.
