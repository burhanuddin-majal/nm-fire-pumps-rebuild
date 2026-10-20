# NM Fire inquiry form

The website contact form now uses FormSubmit's AJAX endpoint and sends inquiries to `pakistan@nmfirepump.com`.

## Initial activation

1. Open the live website's Contact Us page.
2. Submit one test inquiry using an email address you control.
3. FormSubmit should send an activation/verification email to `pakistan@nmfirepump.com` the first time the endpoint is used.
4. The recipient must complete that verification before normal email delivery is activated.
5. Submit a second harmless test and confirm the inquiry arrives.

The endpoint is configured in `contact.html`; the AJAX submit logic is in `assets/site.js`.

## Notes

- This flow does not require Gmail SMTP, an app password, Discord, or Wispbyte.
- The old Cloudflare Worker is no longer used by the website. The source file here is a retirement stub; changes in GitHub do **not** automatically redeploy an already deployed Cloudflare Worker.
- The contact form keeps FormSubmit's spam protection enabled and includes a hidden honeypot field.
- FormSubmit handles email delivery; the website does not store a private inquiry dashboard.
