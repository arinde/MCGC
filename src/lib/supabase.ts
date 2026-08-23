import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 *
 * Uses the SERVICE ROLE key, which bypasses Row Level Security. That is
 * deliberate: every table has RLS on with zero policies, so the database is
 * unreachable except through this file, which only ever runs on the server.
 *
 * Never import this into a component that ships to the browser.
 */

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env and fill in " +
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API).",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** True when the database is wired up — lets pages degrade gracefully instead of crashing. */
export function isConfigured(): boolean {
  return Boolean(import.meta.env.SUPABASE_URL && import.meta.env.SUPABASE_SERVICE_ROLE_KEY);
}

// ---------------------------------------------------------------- types

export type Registration = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string | null;
  branch: string | null;
  guests_label: string | null;
  party_size: number;
  days: string[];
  flags: string[];
  source: string | null;
  notes: string | null;
  created_at: string;
};

export type Checkin = {
  id: string;
  registration_id: string;
  day_label: string;
  party_size: number;
  checked_in_by: string | null;
  checked_in_at: string;
};

export type SessionCount = {
  id: string;
  day_label: string;
  session_time: string;
  session_name: string | null;
  headcount: number;
  counted_by: string | null;
  counted_at: string;
};

export type Activity = {
  id: string;
  kind: string;
  summary: string;
  meta: Record<string, unknown>;
  created_at: string;
};

// ---------------------------------------------------------------- helpers

/**
 * Confirmation code: 6 characters, no vowels (so it can't spell anything
 * unfortunate) and no 0/O/1/I (so it can't be misread over the phone).
 */
const ALPHABET = "23456789BCDFGHJKLMNPQRSTVWXYZ";

export function makeCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** Writes a line to the dashboard's activity feed. Never throws — logging must not break a request. */
export async function logActivity(
  kind: Activity["kind"],
  summary: string,
  meta: Record<string, unknown> = {},
): Promise<void> {
  try {
    await getSupabase().from("activity_log").insert({ kind, summary, meta });
  } catch {
    /* the feed is a convenience, not a guarantee */
  }
}
