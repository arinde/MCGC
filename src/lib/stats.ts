import { getSupabase, type Activity, type Registration } from "./supabase";
import { dayLabels } from "../data/convention";
import type { Slice } from "./charts";
import { branchLabel, UNSTATED } from "./branches";
import { registrationColumns } from "./schema";

/**
 * Everything the dashboard counts.
 *
 * One round-trip per table, then aggregate in memory. At convention scale
 * (hundreds to low thousands of rows) this is far simpler than a wall of SQL
 * aggregates, and fast enough that the dashboard feels instant.
 */

// ---------------------------------------------------------------- flags

/**
 * The needs an attendee can declare on the registration form. The `id` is the
 * literal string stored in `registrations.flags[]` — changing one orphans every
 * row that carries it. `label` and `team` are display only.
 *
 * `team` answers the question the dashboard exists to answer: who needs to act
 * on this number.
 */
export const FLAGS = [
  { id: "First-time guest", label: "First-timers", team: "Follow-up team" },
  { id: "Bringing children", label: "Bringing children", team: "Children's church" },
  { id: "Needs transport", label: "Need transport", team: "Logistics — shuttle" },
  { id: "Accessible seating", label: "Accessible seating", team: "Ushering — front rows" },
] as const;

export type FlagRow = {
  id: string;
  label: string;
  team: string;
  parties: number;
  people: number;
  /** Share of all bookings that declared this need. */
  share: number;
};

// ---------------------------------------------------------------- types

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
  registeredThisWeek: number;
  averageParty: number;
  branchCount: number;
  checkedInTotal: number;
  peakNight: DayRow | null;
};

export type BranchRow = { branch: string; parties: number; people: number };

export type TimelinePoint = {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  label: string;
  parties: number;
  people: number;
  cumulativePeople: number;
};

export type HourPoint = { hour: number; label: string; people: number };

export type VolunteerSummary = {
  total: number;
  byStatus: { status: string; count: number }[];
  byTeam: Slice[];
  noDaysChosen: number;
};

export type DashboardData = {
  totals: Totals;
  days: DayRow[];
  branches: BranchRow[];
  flags: FlagRow[];
  timeline: TimelinePoint[];
  partySizes: Slice[];
  checkinFlow: { day: string; points: HourPoint[] };
  volunteers: VolunteerSummary;
  recent: Registration[];
  activity: Activity[];
  sessionCounts: {
    day_label: string;
    session_time: string;
    headcount: number;
    counted_at: string;
  }[];
};

// ---------------------------------------------------------------- helpers

const isoDate = (value: Date): string =>
  [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-");

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

function peopleIn(registrations: Pick<Registration, "party_size">[]): number {
  return registrations.reduce((sum, row) => sum + (row.party_size || 1), 0);
}

/**
 * A continuous daily series from the first registration to today.
 *
 * The empty days matter: a chart that silently skips the three days nobody
 * signed up shows a healthy climb where the truth is a stall.
 */
function buildTimeline(registrations: Registration[]): TimelinePoint[] {
  if (registrations.length === 0) return [];

  const buckets = new Map<string, { parties: number; people: number }>();

  for (const registration of registrations) {
    const key = isoDate(new Date(registration.created_at));
    const bucket = buckets.get(key) ?? { parties: 0, people: 0 };
    bucket.parties += 1;
    bucket.people += registration.party_size || 1;
    buckets.set(key, bucket);
  }

  const earliest = [...buckets.keys()].sort()[0];
  const cursor = new Date(`${earliest}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const points: TimelinePoint[] = [];
  let running = 0;

  // A bad created_at far in the past would otherwise spin out thousands of
  // empty points, so the walk is bounded rather than trusting the data.
  const MAX_DAYS = 400;

  while (cursor <= today && points.length < MAX_DAYS) {
    const bucket = buckets.get(isoDate(cursor)) ?? { parties: 0, people: 0 };
    running += bucket.people;

    points.push({
      date: isoDate(cursor),
      label: dayFormat.format(cursor),
      parties: bucket.parties,
      people: bucket.people,
      cumulativePeople: running,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

/**
 * Gate flow for the busiest check-in day, bucketed by the hour.
 *
 * This is the number that decides how many ushers stand at the gate and when.
 */
function buildCheckinFlow(
  checkins: { day_label: string; party_size: number; checked_in_at: string }[],
): { day: string; points: HourPoint[] } {
  if (checkins.length === 0) return { day: "", points: [] };

  const perDay = new Map<string, number>();
  for (const checkin of checkins) {
    perDay.set(checkin.day_label, (perDay.get(checkin.day_label) ?? 0) + 1);
  }

  const busiest = [...perDay.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const forDay = checkins.filter((checkin) => checkin.day_label === busiest);

  const hours = forDay.map((checkin) => new Date(checkin.checked_in_at).getHours());
  const from = Math.min(...hours);
  const to = Math.max(...hours);

  const points: HourPoint[] = [];
  for (let hour = from; hour <= to; hour += 1) {
    const people = forDay
      .filter((checkin) => new Date(checkin.checked_in_at).getHours() === hour)
      .reduce((sum, checkin) => sum + (checkin.party_size || 1), 0);

    points.push({ hour, label: `${String(hour).padStart(2, "0")}:00`, people });
  }

  return { day: busiest, points };
}

// ---------------------------------------------------------------- load

export async function loadDashboard(): Promise<DashboardData> {
  const supabase = getSupabase();
  const columns = await registrationColumns();

  const [registrationsResult, checkinsResult, activityResult, countsResult, volunteersResult] =
    await Promise.all([
      supabase
        .from("registrations")
        .select(columns)
        .order("created_at", { ascending: false }),
      supabase.from("checkins").select("registration_id, day_label, party_size, checked_in_at"),
      supabase
        .from("activity_log")
        .select("id, kind, summary, meta, created_at")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("session_counts")
        .select("day_label, session_time, headcount, counted_at")
        .order("counted_at", { ascending: false }),
      // The volunteers table arrived after launch. A database that hasn't had
      // the newer schema block run yet should still render the rest of the
      // dashboard, so this result is read defensively rather than thrown on.
      supabase.from("volunteers").select("teams, days, status"),
    ]);

  if (registrationsResult.error) throw registrationsResult.error;

  const registrations = (registrationsResult.data ?? []) as unknown as Registration[];
  const checkins = checkinsResult.data ?? [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const days: DayRow[] = dayLabels.map((label) => {
    const registeredFor = registrations.filter((row) => row.days?.includes(label));
    const attendedFor = checkins.filter((row) => row.day_label === label);

    const registeredPeople = peopleIn(registeredFor);
    const attendedPeople = attendedFor.reduce((sum, row) => sum + (row.party_size || 1), 0);

    return {
      label,
      registeredParties: registeredFor.length,
      registeredPeople,
      attendedParties: attendedFor.length,
      attendedPeople,
      turnout: registeredPeople > 0 ? attendedPeople / registeredPeople : null,
    };
  });

  const flags: FlagRow[] = FLAGS.map((flag) => {
    const matching = registrations.filter((row) => row.flags?.includes(flag.id));
    return {
      id: flag.id,
      label: flag.label,
      team: flag.team,
      parties: matching.length,
      people: peopleIn(matching),
      share: registrations.length > 0 ? matching.length / registrations.length : 0,
    };
  });

  const flagCount = (id: string): number => flags.find((row) => row.id === id)?.parties ?? 0;

  const branchMap = new Map<string, BranchRow>();
  for (const registration of registrations) {
    const branch = branchLabel(registration.branch);
    const row = branchMap.get(branch) ?? { branch, parties: 0, people: 0 };
    row.parties += 1;
    row.people += registration.party_size || 1;
    branchMap.set(branch, row);
  }
  const branches = [...branchMap.values()].sort((a, b) => b.people - a.people);

  const partyMap = new Map<number, number>();
  for (const registration of registrations) {
    const size = registration.party_size || 1;
    partyMap.set(size, (partyMap.get(size) ?? 0) + 1);
  }
  const partySizes: Slice[] = [...partyMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([size, count]) => ({
      label: size === 1 ? "Coming alone" : `Party of ${size}`,
      value: count,
    }));

  const people = peopleIn(registrations);

  const totals: Totals = {
    parties: registrations.length,
    people,
    firstTimers: flagCount("First-time guest"),
    withChildren: flagCount("Bringing children"),
    needTransport: flagCount("Needs transport"),
    needAccessible: flagCount("Accessible seating"),
    registeredToday: registrations.filter((row) => new Date(row.created_at) >= startOfToday).length,
    registeredThisWeek: registrations.filter((row) => new Date(row.created_at) >= startOfWeek)
      .length,
    averageParty: registrations.length > 0 ? people / registrations.length : 0,
    branchCount: branches.filter((row) => row.branch !== UNSTATED).length,
    checkedInTotal: checkins.reduce((sum, row) => sum + (row.party_size || 1), 0),
    peakNight:
      days.length > 0
        ? days.reduce((best, day) => (day.registeredPeople > best.registeredPeople ? day : best))
        : null,
  };

  const volunteerRows = (volunteersResult.data ?? []) as {
    teams: string[];
    days: string[];
    status: string;
  }[];

  const teamMap = new Map<string, number>();
  const statusMap = new Map<string, number>();
  for (const volunteer of volunteerRows) {
    for (const team of volunteer.teams ?? []) {
      teamMap.set(team, (teamMap.get(team) ?? 0) + 1);
    }
    statusMap.set(volunteer.status, (statusMap.get(volunteer.status) ?? 0) + 1);
  }

  const volunteers: VolunteerSummary = {
    total: volunteerRows.length,
    byStatus: [...statusMap.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count),
    byTeam: [...teamMap.entries()].map(([label, value]) => ({ label, value })),
    noDaysChosen: volunteerRows.filter((row) => (row.days ?? []).length === 0).length,
  };

  return {
    totals,
    days,
    branches: branches.slice(0, 10),
    flags,
    timeline: buildTimeline(registrations),
    partySizes,
    checkinFlow: buildCheckinFlow(checkins),
    volunteers,
    recent: registrations.slice(0, 12),
    activity: (activityResult.data ?? []) as Activity[],
    sessionCounts: countsResult.data ?? [],
  };
}
