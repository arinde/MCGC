import { getSupabase, type Registration } from "./supabase";
import { dayLabels, branches as conventionBranches } from "../data/convention";
import { FLAGS } from "./stats";
import { registrationColumns } from "./schema";
import { branchLabel, normaliseBranch } from "./branches";

/**
 * The searchable, filterable register of everyone who signed up.
 *
 * Filtering happens in memory rather than in PostgREST. Two reasons:
 *
 *  1. A free-text search has to reach name, phone, email and code at once.
 *     Expressing that in PostgREST means building an `.or()` string out of
 *     user input, where an unescaped comma or bracket silently changes the
 *     query. Matching in JavaScript removes that class of bug entirely.
 *  2. The dataset is a few hundred rows. The round-trip dominates; the filter
 *     is free.
 */

export type Attendance = "" | "checked-in" | "not-checked-in";
export type Sort = "recent" | "name" | "party" | "branch";

export type PeopleFilters = {
  search: string;
  flag: string;
  day: string;
  branch: string;
  attendance: Attendance;
  sort: Sort;
};

export type Person = Registration & {
  /** Nights this person has actually been checked in for. */
  attendedDays: string[];
};

export type PeopleResult = {
  people: Person[];
  /** Every branch present in the data, for the filter dropdown. */
  branches: string[];
  /** Totals for the filtered set, not the whole table. */
  matchedParties: number;
  matchedPeople: number;
  /** Total before filtering, so the page can say "42 of 380". */
  totalParties: number;
};

const SORTS = new Set<Sort>(["recent", "name", "party", "branch"]);
const ATTENDANCE = new Set<Attendance>(["", "checked-in", "not-checked-in"]);
const FLAG_IDS = new Set<string>(FLAGS.map((flag) => flag.id));

/**
 * Reads filters off the URL, discarding anything that isn't a value we
 * recognise. An unrecognised flag or day would otherwise match nothing and
 * look like an empty database.
 */
export function readFilters(params: URLSearchParams): PeopleFilters {
  const flag = params.get("flag") ?? "";
  const day = params.get("day") ?? "";
  const attendance = (params.get("attendance") ?? "") as Attendance;
  const sort = (params.get("sort") ?? "recent") as Sort;

  return {
    search: (params.get("q") ?? "").trim().slice(0, 80),
    flag: FLAG_IDS.has(flag) ? flag : "",
    day: dayLabels.includes(day) ? day : "",
    branch: (params.get("branch") ?? "").trim().slice(0, 80),
    attendance: ATTENDANCE.has(attendance) ? attendance : "",
    sort: SORTS.has(sort) ? sort : "recent",
  };
}

/** True when anything is narrowing the list — drives the "Clear filters" button. */
export function hasFilters(filters: PeopleFilters): boolean {
  return Boolean(
    filters.search || filters.flag || filters.day || filters.branch || filters.attendance,
  );
}

/** Rebuilds the query string, dropping empty values so URLs stay shareable. */
export function filterQuery(filters: Partial<PeopleFilters>): string {
  const params = new URLSearchParams();
  const map: Record<string, string | undefined> = {
    q: filters.search,
    flag: filters.flag,
    day: filters.day,
    branch: filters.branch,
    attendance: filters.attendance,
    sort: filters.sort === "recent" ? "" : filters.sort,
  };

  for (const [key, value] of Object.entries(map)) {
    if (value) params.set(key, value);
  }

  return params.toString();
}

function matchesSearch(person: Registration, needle: string): boolean {
  if (!needle) return true;
  const haystack = [person.name, person.phone, person.email, person.code, person.branch]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Digits typed with spaces or dashes should still find a phone number.
  const digits = needle.replace(/\D/g, "");
  if (digits.length >= 4 && person.phone.replace(/\D/g, "").includes(digits)) return true;

  return haystack.includes(needle.toLowerCase());
}

export async function loadPeople(filters: PeopleFilters): Promise<PeopleResult> {
  const supabase = getSupabase();
  const columns = await registrationColumns();

  const [registrationsResult, checkinsResult] = await Promise.all([
    supabase
      .from("registrations")
      .select(columns)
      .order("created_at", { ascending: false }),
    supabase.from("checkins").select("registration_id, day_label"),
  ]);

  if (registrationsResult.error) throw registrationsResult.error;

  const registrations = (registrationsResult.data ?? []) as unknown as Registration[];
  const checkins = checkinsResult.data ?? [];

  const attendedBy = new Map<string, string[]>();
  for (const checkin of checkins) {
    const existing = attendedBy.get(checkin.registration_id) ?? [];
    existing.push(checkin.day_label);
    attendedBy.set(checkin.registration_id, existing);
  }

  // The convention's own branches always appear, in their canonical order, so
  // the dropdown doesn't reshuffle as people register. Anything typed into
  // "Other" is appended after them, alphabetically.
  const found = new Set(
    registrations.map((row) => normaliseBranch(row.branch)).filter(Boolean),
  );
  const others = [...found]
    .filter((branch) => !(conventionBranches as readonly string[]).includes(branch))
    .sort((a, b) => a.localeCompare(b));

  const branches = [...conventionBranches, ...others];

  let people: Person[] = registrations.map((registration) => ({
    ...registration,
    attendedDays: (attendedBy.get(registration.id) ?? []).sort(),
  }));

  if (filters.search) {
    people = people.filter((person) => matchesSearch(person, filters.search));
  }
  if (filters.flag) {
    people = people.filter((person) => person.flags?.includes(filters.flag));
  }
  if (filters.day) {
    people = people.filter((person) => person.days?.includes(filters.day));
  }
  if (filters.branch) {
    people = people.filter((person) => branchLabel(person.branch) === filters.branch);
  }
  if (filters.attendance === "checked-in") {
    people = people.filter((person) => person.attendedDays.length > 0);
  }
  if (filters.attendance === "not-checked-in") {
    people = people.filter((person) => person.attendedDays.length === 0);
  }

  people.sort((a, b) => {
    switch (filters.sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "party":
        return (b.party_size || 1) - (a.party_size || 1);
      case "branch":
        // Blank branches sort last rather than first.
        return (normaliseBranch(a.branch) || "~~").localeCompare(
          normaliseBranch(b.branch) || "~~",
        );
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return {
    people,
    branches,
    matchedParties: people.length,
    matchedPeople: people.reduce((sum, person) => sum + (person.party_size || 1), 0),
    totalParties: registrations.length,
  };
}

/**
 * Rows for the CSV export. Takes the same filters as the page, so the button
 * always exports exactly what is on screen.
 */
export async function loadForExport(filters: PeopleFilters): Promise<Person[]> {
  const { people } = await loadPeople(filters);
  return people;
}
