// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// The public URL of the finished site. This MUST be correct before launch —
// it builds the WhatsApp/Facebook share-card links and the sitemap.
// Read at BUILD time, so PUBLIC_SITE_URL must exist in the Vercel project
// before the build runs — changing it later needs a redeploy to take effect.
// The fallback is the live domain, so a missing variable degrades to correct
// rather than to a domain that 404s the share card.
const SITE = process.env.PUBLIC_SITE_URL || "https://mcgc.vercel.app";

export default defineConfig({
  site: SITE,

  // Pages are static by default (fast, cached at the edge).
  // The dashboard and the registration API opt out with `export const prerender = false`.
  output: "static",

  adapter: vercel(),

  integrations: [
    sitemap({
      // Never advertise the dashboard, the API, or an attendee's personal pass.
      // robots.txt disallows them too; listing them here would point crawlers
      // straight at the surfaces we're trying to keep unlisted.
      filter: (page) => !/\/(admin|api|pass)\b/.test(page),
    }),
  ],

  build: { inlineStylesheets: "auto" },

  vite: {
    build: { cssMinify: "lightningcss" },
  },
});
