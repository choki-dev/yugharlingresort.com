// @ts-check
import { defineConfig } from "astro/config";

// Static build served by Cloudflare Workers (static assets) — see wrangler.jsonc.
// Hosted at the domain root, so no base path is needed.
export default defineConfig({
  site: "https://yugharlingresort.com",
  trailingSlash: "ignore",
});
