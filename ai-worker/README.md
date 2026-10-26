# NM Fire AI Assistant

Cloudflare Worker backend for the NM Fire Pumps Beta website chatbot. It retrieves published Beta pages and product-detail data, then sends the context to either Google Gemini or an OpenAI-compatible chat-completions API.

## Configuration

In **Cloudflare Dashboard → Workers & Pages → your Worker → Settings → Variables and Secrets**, configure:

- `AI_PROVIDER` — set to `gemini` to use Google Gemini; defaults to `openrouter`.
- `GEMINI_API_KEY` — secret API key when `AI_PROVIDER=gemini`.
- `GEMINI_MODEL` — optional Gemini model ID; defaults to `gemini-2.5-flash`. `AI_MODEL` is accepted as a fallback model setting.
- `OPENROUTER_API_KEY` — secret key when using the default OpenRouter provider. `AI_API_KEY` is also accepted as a fallback.
- `AI_MODEL` — optional model ID for OpenRouter; defaults to `openrouter/free`.
- `AI_BASE_URL` — optional OpenRouter-compatible API base URL; defaults to `https://openrouter.ai/api/v1`.
- `ALLOWED_ORIGINS` — optional comma-separated list of allowed browser origins; defaults to `https://burhanuddin-majal.github.io`.

Never commit API keys to GitHub or put them in frontend files. Free model availability and rate limits depend on the provider.

## Deploy

1. Install Node.js and Wrangler, then authenticate with the Cloudflare account that hosts the Worker.
2. For Gemini, set `AI_PROVIDER` to `gemini` in Worker variables and set the key securely with `npx wrangler secret put GEMINI_API_KEY`. Set `GEMINI_MODEL` if you want a different supported model.
3. For OpenRouter instead, set `OPENROUTER_API_KEY` with `npx wrangler secret put OPENROUTER_API_KEY`; OpenRouter remains the default when `AI_PROVIDER` is unset. Add optional variables in Cloudflare Worker settings as needed.
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
