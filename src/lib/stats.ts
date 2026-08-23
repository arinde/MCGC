import { getSupabase, type Activity, type Registration } from "./supabase";
import { dayLabels } from "../data/convention";

export type DayRow = {
  label: string;
  registeredParties: number;
  registeredPeople: number;
  attendedParties: number;
  attendedPeople: number;
  /** Attendance as a share of those who said they'd come. Null when nobody registered. */
  turnout: number | null;
};

export type Totals = {
  parties: number;
  people: number;
  firstTimers: number;
  withChildren: number;
  needTransport: number;
  needAccessible: number;
  registeredToday: number;
};

export type BranchRow = { branch: string; parties: number; people: number };

export type DashboardData = {
  totals: Totals;
  days: DayRow[];
  branches: BranchRow[];
  recent: Registration[];
  activity: Activity[];
  sessionCounts: { day_label: string; session_time: string; headcount: number; counted_at: string }[];
};

const REGISTRATION_COLUMNS =
  "id, code, name, phone, email, branch, guests_label, party_size, days, flags, source, notes, created_at";

function countFlag(registrations: Pick<Registration, "flags">[], flag: string): number {
  return registrations.filter((r) => r.flags?.includes(flag)).length;
}

/**
 * One round-trip per table, then aggregate in memory. At convention scale
 * (hundreds to low thousands of rows) this is far simpler than a set of SQL
 * aggregates, and fast enough that the dashboard feels instant.
 */
export async function loadDashboard(): Promise<DashboardData> {
  const supabase = getSupabase();

  const [registrationsResult, checkinsResult, activityResult, countsResult] = await Promise.all([
    supabase.from("registrations").select(REGISTRATION_COLUMNS).order("created_at", { ascending: false }),
    supabase.from("checkins").select("registration_id, day_label, party_size, checked_in_at"),
    supabase.from("activity_log").select("id, kind, summary, meta, created_at").order("created_at", { ascending: false }).limit(30),
    supabase.from("session_counts").select("day_label, session_time, headcount, counted_at").order("counted_at", { ascending: false }),
  ]);

  if (registrationsResult.error) throw registrationsResult.error;

  const registrations = (registrationsResult.data ?? []) as Registration[];
  const checkins = checkinsResult.data ?? [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totals: Totals = {
    parties: registrations.length,
    people: registrations.reduce((sum, r) => sum + (r.party_size || 1), 0),
    firstTimers: countFlag(registrations, "First-time guest"),
    withChildren: countFlag(registrations, "Bringing children"),
    needTransport: countFlag(registrations, "Needs transport"),
    needAccessible: countFlag(registrations, "Accessible seating"),
    registeredToday: registrations.filter((r) => new Date(r.created_at) >= startOfToday).length,
  };

  const days: DayRow[] = dayLabels.map((label) => {
    const registeredFor = registrations.filter((r) => r.days?.includes(label));
    const attendedFor = checkins.filter((c) => c.day_label === label);

    const registeredPeople = registeredFor.reduce((sum, r) => sum + (r.party_size || 1), 0);
    const attendedPeople = attendedFor.reduce((sum, c) => sum + (c.party_size || 1), 0);

    return {
      label,
      registeredParties: registeredFor.length,
      registeredPeople,
      attendedParties: attendedFor.length,
      attendedPeople,
      turnout: registeredPeople > 0 ? attendedPeople / registeredPeople : null,
    };
  });

  const branchMap = new Map<string, BranchRow>();
  for (const registration of registrations) {
    const branch = registration.branch?.trim() || "Not stated";
    const row = branchMap.get(branch) ?? { branch, parties: 0, people: 0 };
    row.parties += 1;
    row.people += registration.party_size || 1;
    branchMap.set(branch, row);
  }

  const branches = [...branchMap.values()].sort((a, b) => b.people - a.people).slice(0, 10);

  return {
    totals,
    days,
    branches,
    recent: registrations.slice(0, 12),
    activity: (activityResult.data ?? []) as Activity[],
    sessionCounts: countsResult.data ?? [],
  };
}

/** Rows for the CSV export, optionally narrowed to one follow-up list. */
export async function loadForExport(filter?: string): Promise<Registration[]> {
  const supabase = getSupabase();
  let query = supabase.from("registrations").select(REGISTRATION_COLUMNS).order("created_at", { ascending: false });

  if (filter && filter !== "all") {
    query = query.contains("flags", [filter]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Registration[];
}
