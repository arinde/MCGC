---
name: design-system
description: Visual and frontend conventions for the Majiyagbe Convention 2026 site and its admin dashboard — brand tokens, typography, layout, component patterns, and Astro/CSS rules. Consult this before writing or changing ANY user-facing UI: new pages, sections, components, dashboard views, forms, tables, empty states, or restyling existing markup. Use it even when the request sounds purely functional ("add a schedule page", "show the attendance table", "fix this spacing") — those all produce UI, and UI built without this file drifts off-brand and gets redone.
---

# Majiyagbe Convention — Design System

Read this before writing UI code, then pick your surface:

- **Convention site** — public. Dark, warm, ceremonial. Its job is to get someone to the right place at the right time.
- **Dashboard** — internal admin. Light, dense, plain. Its job is to let someone find and act on a record fast.

The brand lives on the public site. The dashboard borrows only its accent colour and logo. Never put oxblood backgrounds or display type behind a data table.

---

## 1. The event

Real content. Use these facts; don't invent alternatives.

| | |
|---|---|
| Church | Mercy of Christ Gospel Church (World Wide), Ori Oke Majiyagbe |
| Event | Majiyagbe Convention 2026 |
| Theme | **Behold I Come Quickly** — Revelation 22:12 |
| Dates | 24–30 August 2026 |
| Venue | Ori Oke Majiyagbe, 1–7 Majiyagbe Street, Igbe Alagemo, off Ipetu–Oloja, Igbogbo Bayeku, Ikorodu, Lagos State |
| Convener | Prophet N.G. Bolarinde JP (Baba Majiyagbe), General Overseer |
| Ministers | Min. Oluwafemi Simeon · Min. Mobolaji John (Authority) · Min. Segun Peculiar · Min. Ariyo Best · Min. Biola Tayo |
| Known sessions | Fri 28 Aug — Praise Night, 9:00 PM · Sun 30 Aug — Thanksgiving Service, 9:00 AM |

Sessions for 24–27 and 29 Aug are not yet known. Mark them clearly as unconfirmed in the UI rather than inventing service titles — a wrong time on a church schedule sends people to a locked gate.

---

## 2. Brand tokens — SINGLE SOURCE OF TRUTH

Derived from the 2026 flyer. Every colour and size in the codebase comes from here; never write a raw hex inline. If a value is missing, add it here first.

```css
/* src/styles/tokens.css */
:root {
  /* Brand — oxblood ground, gold type, sky portal */
  --color-oxblood-deep: #1a0402;  /* page floor, footer */
  --color-oxblood:      #3d0a06;  /* primary dark surface */
  --color-ember:        #8c1f0b;  /* mid warm red, gradients */
  --color-flame:        #e2691c;  /* orange glow, hover warmth */

  --color-gold:        #e8b94a;   /* primary accent, headings, CTA */
  --color-gold-bright: #f8e08e;   /* highlight, gradient top */
  --color-gold-deep:   #a8761f;   /* gradient bottom, borders */

  --color-sky:      #5bb0e0;      /* the portal blue — use sparingly */
  --color-sky-pale: #c9e7f7;

  --color-cream:      #fff6e8;    /* body text on dark */
  --color-cream-mute: #d9c7b4;    /* secondary text on dark */

  /* Dashboard neutrals (light surface) */
  --color-ink:      #16130f;
  --color-ink-mute: #5c554c;
  --color-line:     #e4dfd7;
  --color-surface:  #ffffff;
  --color-canvas:   #faf7f2;

  /* Semantic — dashboard only */
  --color-success: #0f7b4f;
  --color-warning: #b26a00;
  --color-danger:  #c0362c;
  --color-info:    #1f6feb;

  /* Type */
  --font-display: 'Fraunces', Georgia, serif;   /* headings only */
  --font-body:    'Figtree', system-ui, sans-serif;
  --font-mono:    ui-monospace, 'SF Mono', monospace;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.25rem;
  --text-xl:   clamp(1.5rem,  2vw + 1rem, 1.95rem);
  --text-2xl:  clamp(1.95rem, 3vw + 1rem, 2.44rem);
  --text-3xl:  clamp(2.4rem,  5vw + 1rem, 3.82rem);

  /* Spacing — 4px base */
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;    --space-24: 6rem;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-arch: 999px 999px 8px 8px;  /* the arch motif — see §3 */

  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.3);
  --shadow-glow: 0 0 48px rgb(226 105 28 / 0.35);

  --ease: cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 120ms;
  --dur-base: 240ms;

  --measure: 66ch;
  --container: 1180px;
  --container-narrow: 720px;
}
```

**Typography rules:**
- Fraunces for headings only — never body copy, never UI labels. Use its `wght` 700–900 and lean into the `SOFT`/`WONK` axes for the theme lockup; keep it conventional elsewhere.
- Figtree for everything else. Self-host both, `font-display: swap`, preload Fraunces.
- Gold text on oxblood passes AA at large sizes but **not** at body size. Body copy on dark is `--color-cream`. Gold is for headings, eyebrows, and CTA fills.
- Sentence case for buttons and labels. ALL CAPS only for small eyebrow labels with letter-spacing.
- Times and dates use `font-variant-numeric: tabular-nums` wherever they stack in a column.

---

## 3. The signature: the arch

The flyer's central idea is a circular portal of daylight breaking through dark red — light arriving. That is the one memorable element. Use it deliberately and nowhere else:

- **Hero** — the theme lockup sits inside a radial light bloom (`--color-sky` → `--color-flame` → transparent) against `--color-oxblood`. This is the page's one big moment.
- **Minister portraits** — arch-topped crops via `--radius-arch`. Echoes both the portal and a church window.
- Do **not** also add gradient section dividers, glowing card borders, animated particles, or a second radial anywhere. One light source per page.

Everything outside the hero stays quiet: flat oxblood or cream sections, hairline `--color-gold-deep` rules at 20% opacity, generous space.

Do not attempt to reproduce the flyer's 3D bevelled gold lettering in CSS. Approximations of chrome and bevel read as cheap. Gold as a colour and a subtle gradient, yes; fake extrusion, no.

---

## 4. Convention site

**The site's job right now is wayfinding, not persuasion.** The event begins 24 August. Someone landing on this page is already coming and needs to know where and when. Structure accordingly:

1. **Hero** — theme, Rev. 22:12, dates, venue name, and one primary action: **Get directions**. Not "Register".
2. **Today / next session** — the single most useful component on the site. Surfaces what is happening now or next, with time and location. During 24–30 Aug this sits directly below the hero.
3. **Full schedule** — by day, 24–30 Aug. Confirmed sessions show times; unconfirmed days say so plainly.
4. **Ministering** — Prophet Bolarinde as convener, then the five ministers. Names and photos, no invented biographies.
5. **Getting there** — full address, embedded map, and landmark-based directions from Ikorodu. Landmarks matter more than coordinates here.
6. **Contact** — a phone number people can call, prominent. Add a WhatsApp link if there's a church number.

### Copy
- Active voice, plain verbs. "Get directions", not "View location details".
- Be specific. "Praise Night, Friday 28 August, 9:00 PM" beats "a night of powerful worship".
- Second person, warm, unhurried. This is a church, not a product launch.

### Performance
Attendees will open this on mid-range Android over patchy mobile data in Ikorodu. Hard constraint, not a nice-to-have.
- Ship no JavaScript unless a component genuinely needs it.
- Compress flyer artwork to WebP/AVIF at responsive sizes; the source JPEGs are far too heavy to ship as-is.
- The address, dates, and next session must be readable before any web font loads.

---

## 5. Dashboard

Light surface. Brand appears only in the header bar and as `--color-gold` on primary buttons.

- **Density over air.** `--space-2`/`--space-3` inside rows, `--space-6` between regions.
- **Body face only.** No Fraunces. Largest text is a page title at `--text-lg`.
- **Colour carries meaning, not mood.** Semantic tokens for status only, always paired with a text label — never colour alone.
- **Tables:** text left, numbers right, tabular numerals, sticky header, visible sort affordance, row actions in a consistent last column.
- **Four states everywhere:** loading (skeleton matching final layout, not a blocking spinner), empty, error, populated. An empty state names what belongs there and offers the action that creates the first one.
- **Errors are specific.** What failed and what to do next. Never a bare "Something went wrong".
- **Forms:** visible labels above inputs, never placeholder-as-label. Validate on blur. Errors adjacent to the field. Button label stays constant ("Save changes" → toast "Changes saved").
- **Destructive actions confirm**, and the confirm button names the act ("Delete registration"), not "OK".

---

## 6. Astro implementation

- **Zero JavaScript by default.** A section is a `.astro` component unless it needs client state. Static content inside a framework component is a bug to fix, not a preference.
- **Islands are the exception.** Only for real interactivity — schedule filtering, the next-session countdown, admin forms. Pick the narrowest directive: `client:visible` below the fold, `client:idle` for non-urgent, `client:load` only when it must be live on first paint.
- **Images via `astro:assets`.** `<Image>`/`<Picture>` with explicit `width`/`height` to prevent layout shift. Hero eager, everything else lazy.
- **Content collections with Zod schemas** for ministers and sessions. Schema validation catches a wrong service time at build instead of at the gate.
- **Fonts self-hosted and subset.** Fraunces is variable — ship the variable file, not six static weights.

### Styling
Astro scoped `<style>` blocks per component, plus `tokens.css` and a small `global.css` (reset, base type, container utilities) imported once in the base layout.

- Global classes only when a style must cross component boundaries. Name those BEM (`c-minister-card__name`) so the scope is obvious.
- Nest no more than two levels in SCSS. Deeper produces specificity later rules can't beat.
- Don't set margin and padding on the same section wrapper from two different selectors — that collision is the usual source of mystery spacing here.

---

## 7. Quality floor

Meet it; don't announce it.

- Responsive from 320px up. Test the narrow end first — most traffic is mobile.
- Visible keyboard focus on every interactive element. Never `outline: none` without a replacement.
- Semantic HTML: one `<h1>`, headings in order, `<button>` for actions, `<a>` for navigation, real `<label for>` on inputs.
- Contrast AA: 4.5:1 body, 3:1 large text. Check gold-on-oxblood at every size you use it.
- `prefers-reduced-motion` respected.
- Touch targets 44×44px minimum.

---

## 8. Before you finish

1. Did every colour and space value come from a token?
2. Is there exactly one light source on the page, and is the arch used only where §3 allows?
3. Are the date, time, and address correct and readable without JavaScript?
4. Does it hold at 320px?
5. Do all async surfaces have loading, empty, and error states?
6. Remove one thing that serves nothing.
