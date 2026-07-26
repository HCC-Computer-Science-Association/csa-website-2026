// @ts-check
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

/**
 * Refuses to deploy while src/config.ts still contains TODO placeholder URLs
 * (Discord invite, socials). Local builds are unaffected; CI fails loudly.
 * Escape hatch for a deliberate preview deploy: ALLOW_PLACEHOLDERS=1.
 */
const placeholderGuard = {
  name: "placeholder-guard",
  hooks: {
    "astro:build:start": () => {
      if (!process.env.CI || process.env.ALLOW_PLACEHOLDERS) return;
      const config = readFileSync(new URL("./src/config.ts", import.meta.url), "utf8");
      if (config.includes("TODO")) {
        throw new Error(
          "src/config.ts still contains TODO placeholders (Discord invite / socials / email). " +
            "Fill them in before deploying, or set ALLOW_PLACEHOLDERS=1 to deploy anyway.",
        );
      }
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://hcc-csa.org",
  integrations: [sitemap(), placeholderGuard],
  vite: {
    plugins: [tailwindcss()],
  },
});
