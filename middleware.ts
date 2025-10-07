// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  // block everything except Next internals, static assets, and Stripe webhook
  matcher: [
    "/((?!_next|favicon.ico|icon.png|apple-icon.png|site.webmanifest|.*\\.(?:png|jpg|jpeg|gif|svg|webp)|api/stripe-webhook).*)",
  ],
};

export function middleware(req: NextRequest) {
  const locked = process.env.SITE_LOCK === "1";
  if (!locked) return NextResponse.next();

  const user = process.env.BASIC_USER;
  const pass = process.env.BASIC_PASS;

  // If BASIC auth is configured, require it
  if (user && pass) {
    const auth = req.headers.get("authorization") || "";
    if (auth.startsWith("Basic ")) {
      const base64 = auth.slice(6).trim();
      // Edge runtime: use atob (Buffer is not available)
      const decoded = atob(base64);
      const [u, p] = decoded.split(":");
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
    const res = new NextResponse("Authentication required", { status: 401 });
    res.headers.set("WWW-Authenticate", 'Basic realm="Sister Core", charset="UTF-8"');
    return res;
  }

  // Otherwise show a friendly maintenance page
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="robots" content="noindex"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Sister Core — Be right back</title>
<style>
:root{--pink:#f3d9ee;--text:#0b0b0b;--border:#e8cfe4}
html,body{height:100%}body{margin:0;display:grid;place-items:center;background:#fff;color:var(--text);font:16px/1.45 system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif}
.card{border:1px solid var(--border);border-radius:16px;padding:24px 28px;text-align:center;max-width:560px;box-shadow:0 10px 30px rgba(0,0,0,.06)}
h1{margin:0 0 8px;font-size:22px}p{margin:6px 0}.pill{display:inline-block;padding:6px 10px;border-radius:999px;background:var(--pink);font-weight:700;margin-bottom:8px}
a{color:inherit;text-decoration:underline}
</style></head><body>
<div class="card">
  <div class="pill">Sister Core ATX</div>
  <h1>We’re baking something new 🧁</h1>
  <p>Online ordering is temporarily offline.</p>
  <p>Questions? <a href="mailto:orders@sistercoreatx.com">orders@sistercoreatx.com</a></p>
</div></body></html>`;
  return new NextResponse(html, { status: 503, headers: { "Content-Type": "text/html" } });
}
