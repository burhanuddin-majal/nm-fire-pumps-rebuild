// The website contact form now submits directly to FormSubmit.
// This Worker is no longer part of the website's inquiry flow.
// Redeploy this file to Cloudflare only if you want to retire the old endpoint.
export default {
  async fetch() {
    return new Response(JSON.stringify({
      ok: false,
      error: "This inquiry endpoint has been retired. The website uses FormSubmit for email delivery."
    }), {
      status: 410,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }
};
