# NM Fire AI Assistant API (Beta)

This Worker provides the private backend for the Beta website chat widget. It retrieves published Beta pages and product-detail data for each request, then asks an OpenAI-compatible chat-completions API to answer from that material.

## Required Worker secrets / variables

Configure these in Cloudflare Workers → Settings → Variables and Secrets:

- AI_API_KEY: secret API key from your chosen AI provider.
- AI_MODEL: model name supported by that provider.
- AI_BASE_URL: optional API base URL; defaults to https://api.openai.com/v1.
- ALLOWED_ORIGINS: optional comma-separated origin list; defaults to https://burhanuddin-majal.github.io. Add the exact origin of any future custom website domain.

Never commit API keys into this repository or frontend files. AI providers may charge for usage; set provider spending limits where available.

## Deploy

1. Install Wrangler and authenticate with the Cloudflare account that will host the Worker.
2. From this directory, run `npx wrangler secret put AI_API_KEY` and paste the key securely.
3. Add AI_MODEL and optional AI_BASE_URL / ALLOWED_ORIGINS under Worker Settings → Variables.
4. Run `npx wrangler deploy`.
5. Copy the deployed Worker URL, ending in /chat, into CHAT_API_URL at the top of beta/assets/site.js and commit that change.
6. Test on the Beta preview before considering any Stable rollout.

The Worker rejects unlisted browser origins, caps message/history sizes, does not store chat transcripts, and instructs the model not to invent missing specifications. This is not a substitute for engineering review. Add stronger provider-side rate limits/usage controls before public production use.
