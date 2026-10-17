// @ts-check
import { defineConfig } from "astro/config";

// Hosted on GitHub Pages at https://choki-dev.github.io/yugharlingresort.com/
// If the site moves to its own domain (yugharlingresort.com), set base to "/".
export default defineConfig({
  site: "https://choki-dev.github.io",
  base: "/yugharlingresort.com",
  trailingSlash: "ignore",
});
