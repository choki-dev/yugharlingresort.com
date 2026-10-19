// @ts-check
import { defineConfig } from "astro/config";

// Live domain, served from the root (Cloudflare Workers — see wrangler.jsonc).
// GitHub Pages preview (see .github/workflows/deploy.yml) overrides both: SITE_URL=https://choki-dev.github.io, BASE_PATH=/yugharlingresort.com
export default defineConfig({
  site: process.env.SITE_URL || "https://yugharlingresort.com",
  base: process.env.BASE_PATH || "/",
  trailingSlash: "ignore",
});
