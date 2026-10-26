# NM Fire AI Assistant

Cloudflare Worker backend for the NM Fire Pumps Beta website chatbot. It retrieves published Beta pages and product-detail data, then sends the context exclusively to the Google Gemini API.

## Configuration

In **Cloudflare Dashboard → Workers & Pages → your Worker → Settings → Variables and Secrets**, configure:

- `GEMINI_API_KEY` — required Cloudflare secret containing your Google Gemini API key.
- `GEMINI_MODEL` — optional Gemini model ID; defaults to `gemini-3.8-flash`.

This backend uses Gemini only. There is no OpenRouter fallback or provider switch.
- `ALLOWED_ORIGINS` — optional comma-separated list of allowed browser origins; defaults to `https://burhanuddin-majal.github.io`.

Never commit API keys to GitHub or put them in frontend files. Free model availability and rate limits depend on the provider.

## Deploy

1. Install Node.js and Wrangler, then authenticate with the Cloudflare account that hosts the Worker.
2. Set the Gemini key securely with `npx wrangler secret put GEMINI_API_KEY`.
3. Optionally set `GEMINI_MODEL` in Cloudflare Worker variables. The default is `gemini-3.8-flash`.
4. Deploy from this directory with `npx wrangler deploy`.
5. Ensure the Beta frontend's `CHAT_API_URL` points to the deployed Worker endpoint ending in `/chat`.
6. Test on the Beta preview before making any Stable-site changes.

## Safety and behavior

- Accepts chat requests at `POST /chat` and handles CORS preflight requests.
- Checks the request origin against `ALLOWED_ORIGINS`.
- Limits message and history sizes and does not persist chat transcripts.
- Grounds responses in published website content and tells the model not to invent missing specifications.
- This assistant is not a substitute for official datasheets or qualified engineering review.

Configure provider-side rate limits and usage controls before public production use.
