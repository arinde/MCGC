---
name: convention-content
description: Update the convention's content — theme, dates, programme, ministers, venue, contact details — or add a new day/session/minister. Use whenever the user supplies real convention materials, sends corrections like "Night 3 moved to 6:30", or asks to swap placeholder content for the real thing.
---

# Updating convention content

All public copy lives in **one file**: `src/data/convention.ts`. Components read from it.
Never edit copy inside a component.

## Before editing

Read `src/data/convention.ts` in full. Placeholders are marked `🔴` — every one of
those must be gone before launch.

## The rules that bite

**`day.label` is a database key, not just a UI string.**
It is stored in `registrations.days[]` and `checkins.day_label`. Renaming "Day 1" to
"Opening Night" **orphans existing rows**. If a rename is genuinely wanted after
registrations have started, write a migration in `supabase/` that updates both
columns, and say so explicitly to the user.

**`starts` drives real behaviour.** The top-level `convention.starts` powers the
countdown. Each `day.starts` powers `currentDayLabel()`, which preselects the night
at check-in. Both are local time, `m` is 1-indexed (August = 8). Getting these wrong
is the single most visible failure on the site.

**`theme` renders one word per line** in the hero. Two or three short words work.
Four-plus words, or one long word, will overflow on a phone — check it.

**`facts` must stay at 4 entries.** The strip is a 4-column grid; 3 or 5 breaks it.

## Adding a minister photo

1. Save the image to `public/ministers/<kebab-name>.jpg`, max 800×800, under ~200KB.
2. Set `photo: "/ministers/<kebab-name>.jpg"`.
3. Leave `photo` off entirely to fall back to the gold monogram — that fallback is
   deliberate and looks fine, so never invent a photo path that doesn't exist.

## Adding a day

Add to `convention.days`. It automatically flows into the schedule tabs, the
registration form's night chips, the check-in day selector, and the dashboard's
per-night breakdown. Nothing else needs touching.

## After any edit

```bash
npm run check     # must pass clean — this catches most content mistakes
npm run build
```

Then confirm on the rendered page: the countdown reads sensibly, the hero headline
doesn't overflow at 360px wide, and every `🔴` you touched is really resolved.
