// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// The public URL of the finished site. This MUST be correct before launch —
// it builds the WhatsApp/Facebook share-card links and the sitemap.
const SITE = process.env.PUBLIC_SITE_URL || "https://majiyagbe-convention.vercel.app";

export default defineConfig({
  site: SITE,

  // Pages are static by default (fast, cached at the edge).
  // The dashboard and the registration API opt out with `export const prerender = false`.
  output: "static",

  adapter: vercel(),

  integrations: [sitemap()],

  build: { inlineStylesheets: "auto" },

  vite: {
    build: { cssMinify: "lightningcss" },
  },
});
