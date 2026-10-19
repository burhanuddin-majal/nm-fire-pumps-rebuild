const ALLOWED_ORIGINS = new Set([
  "https://burhanuddin-majal.github.io",
  "https://nmfirepumppakistan.com",
  "https://www.nmfirepumppakistan.com"
]);
const INQUIRY_RECIPIENT = "pakistan@nmfirepump.com";

function corsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "null";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) }
  });
}

function clean(value, max = 1000) {
  return String(value ?? "").replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]/g, "").trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
    if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return json({ error: "Expected JSON." }, 415, origin);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Invalid request." }, 400, origin); }

    // Honeypot: accept silently so basic bots do not retry.
    if (clean(body.website, 200)) return json({ ok: true }, 200, origin);

    const name = clean(body.name, 120);
    const email = clean(body.email, 254);
    const country = clean(body.country, 100);
    const company = clean(body.company, 160);
    const telephone = clean(body.telephone, 80);
    const product = clean(body.product, 160);
    const message = clean(body.message, 1000);

    if (!name || !email || !message) return json({ error: "Please complete the required fields." }, 400, origin);
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400, origin);
    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
      return json({ error: "Email service is not configured yet." }, 503, origin);
    }

    const textBody = [
      "New enquiry from the NM Fire website",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Country: ${country || "Not provided"}`,
      `Company: ${company || "Not provided"}`,
      `Telephone: ${telephone || "Not provided"}`,
      `Product interest: ${product || "Not specified"}`,
      "",
      "Project details / message:",
      message
    ].join("\\n");

    const htmlBody = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#222">
      <h2>New NM Fire website enquiry</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        <tr><th align="left">Name</th><td>${escapeHtml(name)}</td></tr>
        <tr><th align="left">Email</th><td>${escapeHtml(email)}</td></tr>
        <tr><th align="left">Country</th><td>${escapeHtml(country || "Not provided")}</td></tr>
        <tr><th align="left">Company</th><td>${escapeHtml(company || "Not provided")}</td></tr>
        <tr><th align="left">Telephone</th><td>${escapeHtml(telephone || "Not provided")}</td></tr>
        <tr><th align="left">Product interest</th><td>${escapeHtml(product || "Not specified")}</td></tr>
      </table>
      <h3>Project details / message</h3>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      <hr><p style="color:#666;font-size:12px">Sent from the NM Fire website inquiry form.</p>
    </body></html>`;

    let response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: [INQUIRY_RECIPIENT],
          reply_to: email,
          subject: `NM Fire website enquiry — ${name}`,
          text: textBody,
          html: htmlBody
        })
      });
    } catch {
      return json({ error: "Could not send the enquiry. Please try again later." }, 502, origin);
    }

    if (!response.ok) {
      // Do not expose provider details or credentials to the public form.
      return json({ error: "Email delivery failed. Please try again later or use the official contact page." }, 502, origin);
    }
    return json({ ok: true }, 200, origin);
  }
};
