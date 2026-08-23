---
name: design-system
description: The visual and frontend conventions for this project — brand tokens, typography, layout, component patterns, and Astro/CSS implementation rules. Consult this before writing or changing ANY user-facing UI, including new pages, sections, components, dashboard views, forms, tables, empty states, or restyling existing markup. Use it even when the request sounds purely functional ("add a signup form", "make a speakers page", "show the registrations table") — those all produce UI, and UI built without this file drifts off-brand and has to be redone.
---

# Design System

Read this before writing UI code. Then decide which surface you are building for, because the rules differ:

- **Marketing site** — the public convention site. Its job is to make someone register. Personality is a feature.
- **Dashboard** — the internal admin surface. Its job is to let someone find and act on information fast. Personality is a distraction.

Never carry marketing treatments (oversized display type, decorative motion, hero gradients) into the dashboard, or dashboard density into the marketing site.

---

## 1. Brand tokens — SINGLE SOURCE OF TRUTH

Every color, size, and font in the codebase comes from here. Do not invent a hex value inline. If a value is genuinely missing, add it as a token here first, then use it.

> **STATUS: NEEDS FILLING IN.** The values below are placeholders. Ask the user for real values before building anything visual, or propose a concrete palette and get it confirmed. Do not silently ship the placeholders.

```css
/* src/styles/tokens.css */
:root {
  /* Brand — FILL IN */
  --color-brand:        #1a1a2e;  /* primary; headers, key surfaces */
  --color-brand-accent: #e94560;  /* CTAs, active states, one hero moment */
  --color-brand-soft:   #f5f3ef;  /* section backgrounds */

  /* Neutrals */
  --color-ink:      #16161a;  /* body text */
  --color-ink-mute: #5c5c66;  /* secondary text, captions */
  --color-line:     #e2e2e6;  /* borders, dividers */
  --color-surface:  #ffffff;
  --color-canvas:   #fafafa;  /* page background behind cards */

  /* Semantic — dashboard mostly */
  --color-success: #0f7b4f;
  --color-warning: #b26a00;
  --color-danger:  #c0362c;
  --color-info:    #1f6feb;

  /* Type — FILL IN with real families */
  --font-display: 'REPLACE_ME', serif;      /* headings only, used with restraint */
  --font-body:    'REPLACE_ME', sans-serif; /* everything else */
  --font-mono:    ui-monospace, monospace;  /* IDs, codes, tabular data */

  /* Type scale — 1.25 ratio, clamped for fluid sizing */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.25rem;
  --text-xl:   clamp(1.5rem,  2vw + 1rem, 1.953rem);
  --text-2xl:  clamp(1.95rem, 3vw + 1rem, 2.441rem);
  --text-3xl:  clamp(2.4rem,  5vw + 1rem, 3.815rem);

  /* Spacing — 4px base. Use these, not arbitrary px. */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Radii, elevation, motion */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.08), 0 1px 2px rgb(0 0 0 / 0.04);
  --shadow-pop:  0 8px 24px rgb(0 0 0 / 0.12);
  --ease: cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 120ms;
  --dur-base: 240ms;

  /* Layout */
  --measure: 68ch;      /* max line length for prose */
  --container: 1180px;
  --container-narrow: 760px;
}
```

**Typography rules that hold on both surfaces:**
- Display face for headings only, never for body copy or UI labels.
- Body copy never exceeds `--measure`. Long lines are the most common readability failure.
- Sentence case for UI labels and buttons. Not Title Case, not ALL CAPS except small eyebrow labels with letter-spacing.
- Numbers in tables and any aligned column use `font-variant-numeric: tabular-nums`.

---

## 2. Marketing site (the convention site)

**The single job of the homepage is registration.** Every section either builds the case for registering or removes a reason not to. If a section does neither, cut it.

### Content structure
Build with real content — real theme, real dates, real speaker names, real venue. Lorem ipsum hides layout problems and produces designs that break when real copy arrives. If content is missing, ask for it or write plausible specifics and flag them as placeholder.

Typical section order (deviate when the content calls for it):
1. **Hero** — theme, dates, venue, one primary CTA. The theme is the thesis; lead with it.
2. **What this is** — short, concrete, second person. Who it's for and what happens.
3. **Speakers / ministers** — faces and names. People register for people.
4. **Schedule** — real days and sessions, not vague "worship, teaching, fellowship".
5. **Venue & getting there** — practical detail removes friction.
6. **FAQ** — cost, registration deadline, childcare, accommodation, parking.
7. **Closing CTA** — repeat the primary action.

### Design direction
- **One signature element.** Pick the single thing the site is remembered by — a typographic treatment of the theme, a scroll-revealed schedule, a distinctive speaker card. Spend boldness there and keep everything else quiet.
- **Avoid the AI-default look.** Cream background + high-contrast serif + terracotta accent is the current template answer, as is near-black + one acid accent. If you land on one of those, check whether you chose it or defaulted into it.
- **Motion is deliberate and sparse.** One orchestrated moment beats scattered fades on every section. Respect `prefers-reduced-motion` always.
- **CTA discipline.** One primary action per screen. Everything else is secondary or a text link.

### Copy
- Active voice, plain verbs. "Register for the convention", not "Submit registration request".
- Name things the way an attendee would: "accommodation", not "lodging allocation module".
- Be specific. "Three days, nine sessions, 12–14 November" beats "a powerful time of encounter".

---

## 3. Dashboard

**Optimize for scanning and acting, not for looking impressive.** Someone opens this to answer a question or change a record.

- **Density over air.** Tighter vertical rhythm than the marketing site: `--space-2`/`--space-3` inside rows, `--space-6` between regions.
- **Body face only.** No display type. Largest text on the page is a page title at `--text-lg`.
- **Color carries meaning, not decoration.** Use semantic tokens only for status. Never encode status by color alone — pair with a label or icon.
- **Tables:** left-align text, right-align numbers, tabular numerals, sticky header on scroll, and a visible sort affordance on sortable columns. Row actions live in a consistent last column.
- **Every async surface has four states.** Loading (skeleton matching final layout, not a spinner blocking the page), empty, error, and populated. An empty state names what goes here and offers the action that creates the first one.
- **Errors are specific and actionable.** Say what failed and what to do. Never "Something went wrong" alone.
- **Forms:** labels above inputs, always visible — never placeholder-as-label. Validate on blur, not on every keystroke. Show errors adjacent to the field, and keep the submit button's label constant ("Save changes" → toast "Changes saved").
- **Destructive actions confirm**, and the confirm button names the act ("Delete registration"), not "OK".

---

## 4. Astro implementation

- **Ship zero JavaScript by default.** A section is a `.astro` component unless it needs client state. Static content in a framework component is a mistake to correct, not a style preference.
- **Islands are the exception.** Reach for a client component only for genuine interactivity (filtering, multi-step forms, live data). Then pick the narrowest directive: `client:visible` for below-the-fold, `client:idle` for non-urgent, `client:load` only when it must be interactive on first paint.
- **Images go through `astro:assets`.** Use `<Image>`/`<Picture>` with explicit `width`/`height` to prevent layout shift. Hero images get `loading="eager"`; everything else lazy-loads.
- **Content lives in content collections** with a Zod schema — speakers, sessions, FAQs. Schema-validated content catches typos at build time instead of in production.
- **Fonts:** self-host, preload the display face, `font-display: swap`, and subset if the family is large.

### Styling
Default approach: **Astro scoped `<style>` blocks per component**, with `tokens.css` and a small `global.css` (reset, base type, utility layout classes) imported once in the base layout.

- Reach for a global class only when the style must cross component boundaries. Name those with BEM (`c-speaker-card__name`) so scope is obvious from the name.
- Nest no more than two levels deep in SCSS. Deep nesting produces specificity that later rules can't override.
- Don't set both margin and padding on section wrappers from two different selectors — that collision is the most common source of mystery spacing in this kind of layout.

---

## 5. Quality floor

Non-negotiable, and not worth announcing in the response — just meet it:

- Responsive from 320px up. Test the narrow end, not just the wide end.
- Visible keyboard focus on every interactive element. Never `outline: none` without a replacement.
- Semantic HTML: one `<h1>` per page, headings in order, `<button>` for actions and `<a>` for navigation, real `<label for>` on every input.
- Text contrast meets WCAG AA (4.5:1 body, 3:1 large text).
- `prefers-reduced-motion` respected.
- Interactive targets at least 44×44px on touch.

---

## 6. Before you finish

Run this check and fix what fails:

1. Did every color and spacing value come from a token?
2. Is there exactly one primary action per screen?
3. Would this design be recognizable as *this* convention, or could it be any event site? If the latter, the signature element isn't doing its job.
4. Does the layout hold at 320px and at 1440px?
5. Do all async surfaces have loading, empty, and error states?
6. Is there any decoration that serves nothing? Remove one thing.
