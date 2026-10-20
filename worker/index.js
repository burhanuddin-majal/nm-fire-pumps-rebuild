const ALLOWED_ORIGINS = new Set([
  "https://burhanuddin-majal.github.io",
  "https://nmfirepumppakistan.com",
  "https://www.nmfirepumppakistan.com"
]);
const SESSION_SECONDS = 8 * 60 * 60;
const MAX_BODY_BYTES = 12_000;
const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "null",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function json(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
}
function clean(value, max = 1000) {
  return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}
function b64url(bytes) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function unb64url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(normalized + "=".repeat((4 - normalized.length % 4) % 4)), c => c.charCodeAt(0));
}
async function hmac(secret, value) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}
async function makeToken(env) {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ exp: Math.floor(Date.now()/1000) + SESSION_SECONDS, nonce: crypto.randomUUID() })));
  return payload + "." + b64url(await hmac(env.SESSION_SECRET, payload));
}
async function validToken(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const parts = token.split(".");
  if (parts.length !== 2 || !env.SESSION_SECRET) return false;
  try {
    const expected = await hmac(env.SESSION_SECRET, parts[0]);
    const supplied = unb64url(parts[1]);
    if (expected.length !== supplied.length || !crypto.subtle.timingSafeEqual) {
      // Web Crypto has no portable timingSafeEqual method; compare fixed-length MAC bytes.
      if (expected.length !== supplied.length) return false;
      let diff = 0; for (let i=0;i<expected.length;i++) diff |= expected[i] ^ supplied[i];
      if (diff !== 0) return false;
    } else if (!crypto.subtle.timingSafeEqual(expected, supplied)) return false;
    const payload = JSON.parse(new TextDecoder().decode(unb64url(parts[0])));
    return Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now()/1000);
  } catch { return false; }
}
async function readJson(request) {
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > MAX_BODY_BYTES) throw new Error("Request is too large.");
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new Error("Request is too large.");
  return JSON.parse(text);
}
async function rateLimitLogin(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ipHash = b64url(await hmac(env.SESSION_SECRET, "login:" + ip));
  const now = Math.floor(Date.now()/1000);
  const row = await env.DB.prepare("SELECT window_start, attempts FROM auth_attempts WHERE ip_hash = ?").bind(ipHash).first();
  if (row && now - row.window_start < 900 && row.attempts >= 8) return false;
  if (!row || now - row.window_start >= 900) {
    await env.DB.prepare("INSERT INTO auth_attempts (ip_hash, window_start, attempts) VALUES (?, ?, 1) ON CONFLICT(ip_hash) DO UPDATE SET window_start=excluded.window_start, attempts=1").bind(ipHash, now).run();
  } else {
    await env.DB.prepare("UPDATE auth_attempts SET attempts=attempts+1 WHERE ip_hash=?").bind(ipHash).run();
  }
  return true;
}
async function authenticated(request, env) {
  return Boolean(env.SESSION_SECRET && await validToken(request, env));
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);
    if (!env.DB) return json({ error: "Database is not configured yet." }, 503, origin);

    if (url.pathname === "/api/login" && request.method === "POST") {
      if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: "Admin authentication is not configured." }, 503, origin);
      if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Expected JSON." }, 415, origin);
      let body; try { body = await readJson(request); } catch { return json({ error: "Invalid request." }, 400, origin); }
      if (!await rateLimitLogin(request, env)) return json({ error: "Too many login attempts. Try again in 15 minutes." }, 429, origin);
      const password = String(body.password || "");
      if (password.length > 200 || password !== env.ADMIN_PASSWORD) return json({ error: "Incorrect password." }, 401, origin);
      await env.DB.prepare("DELETE FROM auth_attempts WHERE window_start < ?").bind(Math.floor(Date.now()/1000)-86400).run();
      return json({ ok: true, token: await makeToken(env), expiresIn: SESSION_SECONDS }, 200, origin);
    }

    if (url.pathname === "/api/logout" && request.method === "POST") {
      return json({ ok: true }, 200, origin);
    }
    if (url.pathname === "/api/me" && request.method === "GET") {
      if (!await authenticated(request, env)) return json({ error: "Please sign in again." }, 401, origin);
      return json({ ok: true }, 200, origin);
    }

    if (url.pathname === "/api/inquiries" && request.method === "POST") {
      if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Expected JSON." }, 415, origin);
      let body; try { body = await readJson(request); } catch { return json({ error: "Invalid or oversized request." }, 400, origin); }
      if (clean(body.website, 200)) return json({ ok: true }, 200, origin);
      const name=clean(body.name,120), email=clean(body.email,254), country=clean(body.country,100), company=clean(body.company,160), telephone=clean(body.telephone,80), product=clean(body.product,160), message=clean(body.message,3000);
      if (!name || !email || !message) return json({ error: "Please complete the required fields." }, 400, origin);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400, origin);
      const id = crypto.randomUUID(), createdAt = new Date().toISOString();
      try {
        await env.DB.prepare("INSERT INTO inquiries (id,name,email,country,company,telephone,product,message,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)")
          .bind(id,name,email,country,company,telephone,product,message,"new",createdAt).run();
      } catch { return json({ error: "Could not save your enquiry. Please try again later." }, 500, origin); }
      return json({ ok: true }, 200, origin);
    }

    if (url.pathname === "/api/inquiries" && request.method === "GET") {
      if (!await authenticated(request, env)) return json({ error: "Please sign in again." }, 401, origin);
      const result = await env.DB.prepare("SELECT id,name,email,country,company,telephone,product,message,status,created_at FROM inquiries ORDER BY created_at DESC LIMIT 500").all();
      return json({ ok: true, inquiries: result.results || [] }, 200, origin);
    }
    const match = url.pathname.match(/^\/api\/inquiries\/([a-f0-9-]+)$/i);
    if (match && request.method === "PATCH") {
      if (!await authenticated(request, env)) return json({ error: "Please sign in again." }, 401, origin);
      let body; try { body = await readJson(request); } catch { return json({ error: "Invalid request." }, 400, origin); }
      const status = clean(body.status, 20);
      if (!["new","read","resolved"].includes(status)) return json({ error: "Invalid status." }, 400, origin);
      const result = await env.DB.prepare("UPDATE inquiries SET status=? WHERE id=?").bind(status,match[1]).run();
      if (!result.meta?.changes) return json({ error: "Inquiry not found." }, 404, origin);
      return json({ ok: true }, 200, origin);
    }
    return json({ error: "Not found." }, 404, origin);
  }
};