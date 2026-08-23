# Majiyagbe Convention 2026

Public site, registration, and admin dashboard for the Mercy of Christ Gospel Church
(World Wide) annual convention at Ori Oke Majiyagbe — **24–30 August 2026**.

Astro 7 · Supabase (Postgres) · deployed to Vercel.

---

## Run it locally

```bash
npm install
cp .env.example .env     # then fill in the values — see below
npm run dev              # http://localhost:4321
```

The public site works with no database. Registration and `/admin` need Supabase.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run check` | Type-checks everything. **Must pass before deploying.** |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |

---

## Setting up the database

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste all of `supabase/schema.sql`, and run it.
3. Go to **Project Settings → API** and copy into your `.env`:
   - `SUPABASE_URL` — the Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — the **service_role** key, *not* the anon key
4. Set `ADMIN_PASSWORD` to something long. This is the shared dashboard password.

**Why the service-role key?** Every table has Row Level Security on with zero
policies, so the database is unreachable from the browser. All access goes through
the server. Keep that key server-side only — never commit it, never expose it to
client code. If it leaks, rotate it in Supabase immediately.

---

## Deploying to Vercel

1. Push this folder to a Git repository.
2. Import it at [vercel.com/new](https://vercel.com/new). Astro is detected automatically.
3. Add all four environment variables under **Settings → Environment Variables**:
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `PUBLIC_SITE_URL`.
4. Deploy, then set `PUBLIC_SITE_URL` to the real URL and redeploy.

`PUBLIC_SITE_URL` must be correct — it builds the WhatsApp share card and the
sitemap. A wrong value here means links shared into WhatsApp render without a preview.

---

## The dashboard

`/admin`, one shared password.

| Page | What it's for |
| --- | --- |
| **Overview** | Live totals, per-night registered-vs-attended, branch breakdown, activity feed, CSV exports |
| **Check-in** | Search a name, phone or code at the door and mark someone present |
| **Headcounts** | Ushers record what they actually counted per session |

The overview refreshes every 30 seconds and pauses in a background tab.

---

## Editing content

**All public copy lives in `src/data/convention.ts`.** Nothing else needs touching.
Anything marked `🔴` is still unconfirmed and must be checked before launch.

Still outstanding:

- [ ] Real WhatsApp number and email for the convention desk
- [ ] Service times for 24–27 and 29 August (only Fri 9PM and Sun 9AM are confirmed)
- [ ] Travel and parking arrangements
- [ ] Camp checklist — confirm with the camp coordinator, especially bedding and feeding

Renaming a `day.label` after registrations have started **orphans existing rows** —
those labels are stored in the database. See `.claude/skills/convention-content/`.

---

## Project layout

```
src/
  assets/         flyers + logo (processed and compressed at build)
  components/     shared UI; home/ and admin/ for page-specific
  data/           convention.ts — the only content file
  layouts/        Base (public) and Admin (dashboard)
  lib/            server logic: supabase, auth, registrations, stats
  pages/
    api/          register, search, checkin
    admin/        dashboard, gated by src/middleware.ts
  styles/         tokens.css (single source of truth) + global.css
supabase/
  schema.sql      run this in Supabase
prototype/        the original single-file mockup, kept for reference
```

Conventions for working in this codebase are in `CLAUDE.md`; the visual system is
in `.claude/skills/design-system/SKILL.md`.
