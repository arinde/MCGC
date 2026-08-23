-- =====================================================================
--  MCGC Convention — database schema
--  Run this once in Supabase: Dashboard → SQL Editor → New query → Run.
--  Safe to re-run; it drops and recreates cleanly.
-- =====================================================================

-- ---------- registrations ----------
create table if not exists registrations (
  id           uuid primary key default gen_random_uuid(),
  -- Short human-friendly code shown on the confirmation page and the QR.
  -- Ushers can also type it in by hand if a phone won't scan.
  code         text unique not null,

  name         text not null,
  phone        text not null,
  email        text,
  branch       text,

  -- "Just me", "Me + 2", … kept as text so the wording can change
  -- without a migration; party_size is the number we actually count.
  guests_label text,
  party_size   int  not null default 1,

  -- Which nights they said they'd come to, e.g. {"Day 1","Day 3"}
  days         text[] not null default '{}',

  -- first_timer / children / transport / accessible
  flags        text[] not null default '{}',

  source       text default 'website',
  notes        text,
  created_at   timestamptz not null default now()
);

create index if not exists registrations_created_idx on registrations (created_at desc);
create index if not exists registrations_phone_idx   on registrations (phone);
-- Powers the usher's type-ahead search at the door.
create index if not exists registrations_name_idx    on registrations using gin (to_tsvector('simple', name));

-- ---------- check-ins (one row per person per night) ----------
create table if not exists checkins (
  id              uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id) on delete cascade,
  day_label       text not null,              -- "Day 1", "Day 2", …
  party_size      int  not null default 1,    -- how many actually walked in
  checked_in_by   text,                       -- which usher/device
  checked_in_at   timestamptz not null default now(),
  -- A person can only be checked in once per night.
  unique (registration_id, day_label)
);

create index if not exists checkins_day_idx on checkins (day_label, checked_in_at desc);

-- ---------- session headcounts (ushers' manual count) ----------
create table if not exists session_counts (
  id           uuid primary key default gen_random_uuid(),
  day_label    text not null,
  session_time text not null,
  session_name text,
  headcount    int  not null check (headcount >= 0),
  counted_by   text,
  counted_at   timestamptz not null default now()
);

create index if not exists session_counts_day_idx on session_counts (day_label, counted_at desc);

-- ---------- activity log (audit trail for the dashboard) ----------
create table if not exists activity_log (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null,     -- 'registration' | 'checkin' | 'count' | 'login' | 'export'
  summary    text not null,
  meta       jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_created_idx on activity_log (created_at desc);

-- =====================================================================
--  Row Level Security
--  The site talks to Supabase ONLY through the server (Astro API routes)
--  using the service_role key, which bypasses RLS. So we lock every table
--  down completely — no anon access at all. If the anon key ever leaks,
--  it can read nothing.
-- =====================================================================
alter table registrations  enable row level security;
alter table checkins       enable row level security;
alter table session_counts enable row level security;
alter table activity_log   enable row level security;

-- No policies are created on purpose: with RLS on and zero policies,
-- the anon and authenticated roles are denied everything.

-- =====================================================================
--  Convenience views for the dashboard
-- =====================================================================

-- Registered head-count per night (counts the whole party, not just the
-- person who filled the form).
create or replace view v_registered_by_day as
select d.day_label,
       count(*)::int              as parties,
       coalesce(sum(r.party_size), 0)::int as people
from   registrations r
cross  join lateral unnest(r.days) as d(day_label)
group  by d.day_label
order  by d.day_label;

-- Actual attendance per night, from check-ins.
create or replace view v_attendance_by_day as
select day_label,
       count(*)::int                    as parties,
       coalesce(sum(party_size), 0)::int as people
from   checkins
group  by day_label
order  by day_label;

-- Top branches by registered people.
create or replace view v_by_branch as
select coalesce(nullif(trim(branch), ''), 'Not stated') as branch,
       count(*)::int as parties,
       coalesce(sum(party_size), 0)::int as people
from   registrations
group  by 1
order  by people desc;

-- =====================================================================
--  Volunteers ("join the team")
--  Added after launch planning — run this block on an existing database
--  and it will create just the new table.
-- =====================================================================
create table if not exists volunteers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  phone        text not null,
  email        text,
  branch       text,

  -- media / sanitation / prayer / security / ushering / protocol
  teams        text[] not null default '{}',

  -- Which days they can serve, e.g. {"Day 1","Day 5"}
  days         text[] not null default '{}',

  experience   text,
  notes        text,

  -- pending → contacted → confirmed → declined
  status       text not null default 'pending'
                 check (status in ('pending','contacted','confirmed','declined')),

  created_at   timestamptz not null default now(),
  -- One sign-up per phone number; re-submitting updates the existing row.
  unique (phone)
);

create index if not exists volunteers_created_idx on volunteers (created_at desc);
create index if not exists volunteers_status_idx  on volunteers (status);

alter table volunteers enable row level security;
-- No policies, as with every other table: server-side access only.

create or replace view v_volunteers_by_team as
select t.team, count(*)::int as people
from   volunteers v
cross  join lateral unnest(v.teams) as t(team)
where  v.status <> 'declined'
group  by t.team
order  by people desc;
