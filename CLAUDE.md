# MCGC Convention — project conventions

Marketing site + registration + admin dashboard for the MCGC annual convention.
Astro 7 (static public pages, server-rendered admin), Supabase Postgres, deployed to Netlify.

## Golden rules

1. **All public copy lives in `src/data/convention.ts`.** Never hardcode a date,
   name, phone number or venue into a component. If a component needs content,
   it takes it as a prop or imports it from that file.
2. **Server-only code never reaches the browser.** `src/lib/supabase.ts` uses the
   service-role key. It may only be imported from `src/pages/api/**`, `src/pages/admin/**`,
   and `src/middleware.ts` — never from a `.astro` component that renders client-side JS.
3. **Public pages stay static.** Only files that genuinely need a server set
   `export const prerender = false`. Every such file must justify it in a comment.

## File size and structure

- **A `.astro` component over ~150 lines should be split.** Extract the inner
  repeating unit first (a card, a row, a field), not an arbitrary top/bottom slice.
- One component per file, named in PascalCase, matching the filename.
- Components that are only used by one page live in `src/components/<page>/`.
  Shared ones live directly in `src/components/`.
- Logic that isn't markup belongs in `src/lib/`, not in a component's frontmatter.

```
src/
  components/     shared UI (Button, Section, …)
    home/         used only by the public landing page
    admin/        used only by the dashboard
  data/           convention.ts — all editable content
  layouts/        page shells
  lib/            server + shared logic, no markup
  pages/
    api/          JSON endpoints (prerender = false)
    admin/        dashboard (prerender = false, auth-gated)
  styles/         global tokens + base
```

## Style

- **TypeScript everywhere.** No `any`. Export types next to what they describe.
- **Named exports** for functions and types. Default export only for Astro components.
- **Comments explain *why*, never *what*.** If the code needs a comment to say what
  it does, rename things until it doesn't.
- Format: 2-space indent, double quotes, semicolons, trailing commas.
- CSS: design tokens as custom properties in `src/styles/tokens.css`. No magic hex
  values in a component — use the token. Layout with flex/grid + `gap`, not margins.

## Database

- Schema lives in `supabase/schema.sql`. Change the schema **there** and re-run it,
  so the file is always the truth.
- RLS is on with **zero policies** on every table — the anon key can read nothing.
  All access goes through the server with the service-role key. Keep it that way.
- Never `select("*")` in the dashboard. Name the columns, so a schema change can't
  silently start leaking a new field to the page.

## Accessibility and performance

- Every interactive element is reachable and operable by keyboard, with a visible
  `:focus-visible` state.
- Respect `prefers-reduced-motion` for anything that animates.
- No web font beyond the two already loaded (Bodoni Moda, Manrope).
- Images go through Astro's `<Image>` so they're sized and lazy-loaded.

## Before saying "done"

Run `npm run check` (astro check + tsc). It must pass with zero errors.
Then `npm run build`. A green dev server is not proof the build works.
