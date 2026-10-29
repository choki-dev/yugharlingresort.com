/* Yugharling Resort — Cloudflare Worker: serves the static site from ./dist and
   POST /api/booking, which emails a booking request to reservations through Resend.
   Secret: RESEND_API_KEY (wrangler secret put RESEND_API_KEY; locally in .dev.vars).
   Vars (wrangler.jsonc): BOOKING_TO, BOOKING_FROM, ALLOWED_ORIGINS. */

const MAX_TEXT = 5000;

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/booking") return handleBooking(request, env);
    return env.ASSETS.fetch(request);
  },
};

async function handleBooking(request, env) {
  // The GitHub Pages preview posts here from another origin, so answer CORS for listed sites only
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const cors = allowed.includes(origin)
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" }
    : {};
  const reply = (status, body) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return reply(405, { ok: false, error: "Method not allowed" });
  if (origin && !cors["Access-Control-Allow-Origin"] && origin !== new URL(request.url).origin) {
    return reply(403, { ok: false, error: "Origin not allowed" });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return reply(400, { ok: false, error: "Invalid request" });
  }

  // Hidden "website" field: people leave it empty, form-filling bots don't. Pretend it worked.
  if (data.website) return reply(200, { ok: true });

  const name = String(data.name || "").trim().slice(0, 120);
  const phone = String(data.phone || "").trim().slice(0, 60);
  const email = String(data.email || "").trim().slice(0, 200);
  const subject = String(data.subject || "").trim().slice(0, 200);
  const text = String(data.text || "").slice(0, MAX_TEXT);
  if (!name || !phone || !subject || !text) return reply(400, { ok: false, error: "Missing details" });
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!env.RESEND_API_KEY) return reply(500, { ok: false, error: "Email is not configured" });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.BOOKING_FROM,
      to: env.BOOKING_TO.split(",").map((s) => s.trim()),
      // Replying in Gmail answers the guest directly
      ...(validEmail ? { reply_to: email } : {}),
      subject,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return reply(502, { ok: false, error: "Could not send" });
  }
  return reply(200, { ok: true });
}
