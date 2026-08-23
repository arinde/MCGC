/**
 * Generates public/og.png — the 1200×630 card that WhatsApp, Facebook and
 * X render when someone shares a link to the site.
 *
 * Run with: npm run og
 *
 * Regenerate this whenever the theme, dates or venue change in
 * src/data/convention.ts, otherwise shared links will show stale details.
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const WIDTH = 1200;
const HEIGHT = 630;

// Kept in step with src/data/convention.ts by hand — this script runs outside
// Astro, so it can't import the TypeScript module directly.
const content = {
  church: "MERCY OF CHRIST GOSPEL CHURCH",
  suffix: "(WORLD WIDE) · ORI OKE MAJIYAGBE",
  event: "MAJIYAGBE CONVENTION 2026",
  theme: ["BEHOLD, I COME", "QUICKLY"],
  verseRef: "REVELATION 22:12",
  dates: "24 – 30 AUGUST 2026",
  venue: "Ori Oke Majiyagbe · Igbogbo Bayeku, Ikorodu, Lagos",
};

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function build() {
  const logo = await sharp(join(root, "src/assets/mcgc-logo.jpeg"))
    .resize(132, 132, { fit: "cover" })
    .composite([
      {
        // Round the logo by masking it with a circle.
        input: Buffer.from(
          `<svg width="132" height="132"><circle cx="66" cy="66" r="66" fill="#fff"/></svg>`,
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#101426"/>
      <stop offset="100%" stop-color="#0b0d1a"/>
    </linearGradient>
    <radialGradient id="bloom" cx="50%" cy="12%" r="62%">
      <stop offset="0%" stop-color="#9fb0e8" stop-opacity="0.34"/>
      <stop offset="34%" stop-color="#4a63b8" stop-opacity="0.22"/>
      <stop offset="68%" stop-color="#e8b44a" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0b0d1a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#ground)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bloom)"/>

  <!-- gold rule top and bottom -->
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="#e8b44a"/>
  <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="#8c6520"/>

  <text x="230" y="82" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700"
        letter-spacing="3.5" fill="#f3eada">${escape(content.church)}</text>
  <text x="230" y="114" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="500"
        letter-spacing="2.6" fill="#99a1bd">${escape(content.suffix)}</text>

  <text x="600" y="212" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21"
        font-weight="700" letter-spacing="6.5" fill="#e8b44a">${escape(content.event)}</text>

  <text x="600" y="318" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="76" font-weight="bold" fill="#f3eada">${escape(content.theme[0])}</text>
  <text x="600" y="400" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="76" font-weight="bold" fill="#f3eada">${escape(content.theme[1])}</text>

  <text x="600" y="444" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="19"
        font-weight="600" letter-spacing="4.5" fill="#99a1bd">${escape(content.verseRef)}</text>

  <line x1="420" y1="486" x2="780" y2="486" stroke="#8c6520" stroke-width="1.5"/>

  <text x="600" y="540" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34"
        font-weight="700" letter-spacing="2.5" fill="#e8b44a">${escape(content.dates)}</text>
  <text x="600" y="580" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20"
        font-weight="500" fill="#99a1bd">${escape(content.venue)}</text>
</svg>`;

  const png = await sharp(Buffer.from(svg))
    .composite([{ input: logo, top: 30, left: 66 }])
    .png({ quality: 90 })
    .toBuffer();

  await mkdir(join(root, "public"), { recursive: true });
  await writeFile(join(root, "public/og.png"), png);

  const { size } = await sharp(png).metadata().then(async (m) => ({
    size: png.length,
    ...m,
  }));

  console.log(`public/og.png written — ${WIDTH}×${HEIGHT}, ${(size / 1024).toFixed(0)}KB`);
}

build().catch((error) => {
  console.error("Could not build the OG image:", error);
  process.exit(1);
});
