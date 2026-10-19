const ALLOWED_ORIGIN = "https://burhanuddin-majal.github.io";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
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
  return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
    if (origin !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed." }, 403, origin);
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400, origin);
    if (!env.DISCORD_WEBHOOK_URL) return json({ error: "Inquiry service is not configured yet." }, 503, origin);

    const fields = [
      { name: "Name", value: name, inline: true },
      { name: "Email", value: email, inline: true },
      { name: "Country", value: country || "Not provided", inline: true },
      { name: "Company", value: company || "Not provided", inline: true },
      { name: "Telephone", value: telephone || "Not provided", inline: true },
      { name: "Product interest", value: product || "Not specified", inline: false },
      { name: "Project details / message", value: message, inline: false }
    ];

    let response;
    try {
      response = await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "NM Fire Website Enquiries",
          allowed_mentions: { parse: [] },
          embeds: [{
            title: "New website enquiry",
            color: 15158332,
            fields,
            footer: { text: "NM Fire website inquiry form" },
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch {
      return json({ error: "Could not send the enquiry. Please try again later." }, 502, origin);
    }

    if (!response.ok) return json({ error: "Discord could not accept the enquiry. Please try again later." }, 502, origin);
    return json({ ok: true }, 200, origin);
  }
};
