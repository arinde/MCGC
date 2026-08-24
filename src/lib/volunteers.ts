import { getSupabase, logActivity } from "./supabase";
import { normalisePhone } from "./registrations";
import { resolveBranch } from "./branches";
import { dayLabels } from "../data/convention";

/**
 * Volunteer sign-ups. Deliberately close to `registrations.ts` in shape — an
 * usher-facing form and a volunteer form have the same job: capture a name and
 * a number without losing anyone to a validation quibble.
 */

export type Team = {
  id: string;
  name: string;
  blurb: string;
  needs: string;
};

/** The teams serving the convention. `id` is stored in the database — keep stable. */
export const TEAMS: Team[] = [
  {
    id: "ushering",
    name: "Ushering",
    blurb: "Welcome people at the gate, find them seats, take the headcount.",
    needs: "Every service",
  },
  {
    id: "media",
    name: "Media",
    blurb: "Photos, video, live stream and the sound desk.",
    needs: "Cameras and laptops welcome",
  },
  {
    id: "prayer",
    name: "Prayer",
    blurb: "Intercession before each service, and prayer at the altar after.",
    needs: "Early arrival",
  },
  {
    id: "security",
    name: "Security",
    blurb: "The gate, the car park, and keeping walkways clear.",
    needs: "Night shifts included",
  },
  {
    id: "sanitation",
    name: "Sanitation",
    blurb: "Keeping the grounds, the hall and the conveniences clean.",
    needs: "Morning and evening",
  },
  {
    id: "protocol",
    name: "Protocol",
    blurb: "Receiving ministers and guests, and seating the high table.",
    needs: "Smart dress",
  },
  {
    id: "praise",
    name: "Praise team",
    blurb: "Choir, instrumentalists and worship leading through the week.",
    needs: "Rehearsals before",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    blurb: "Cooking and serving for the camp and the ministers' table.",
    needs: "Early mornings",
  },
  {
    id: "logistics",
    name: "Logistics",
    blurb: "Chairs, canopies, transport, generators and the store.",
    needs: "Heavy lifting",
  },
];

const TEAM_IDS = new Set(TEAMS.map((team) => team.id));

export type VolunteerInput = {
  name: string;
  phone: string;
  email?: string;
  branch?: string;
  branchOther?: string;
  teams?: string[];
  days?: string[];
  experience?: string;
};

export type VolunteerError = { field: string; message: string };

export function validate(input: VolunteerInput): VolunteerError[] {
  const errors: VolunteerError[] = [];

  const name = input.name?.trim() ?? "";
  if (name.length < 2) {
    errors.push({ field: "name", message: "Please enter your name." });
  }

  const phone = normalisePhone(input.phone ?? "");
  if (phone.length < 10 || phone.length > 18) {
    errors.push({ field: "phone", message: "Please enter a valid phone number." });
  }

  const email = input.email?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.push({ field: "email", message: "That email address doesn’t look right." });
  }

  if (!input.teams?.some((team) => TEAM_IDS.has(team))) {
    errors.push({ field: "teams", message: "Pick at least one team you'd like to serve on." });
  }

  return errors;
}

export type VolunteerResult =
  | { ok: true; name: string; teams: string[]; alreadySignedUp: boolean }
  | { ok: false; errors: VolunteerError[] };

export async function createVolunteer(input: VolunteerInput): Promise<VolunteerResult> {
  const errors = validate(input);
  if (errors.length) return { ok: false, errors };

  const supabase = getSupabase();
  const phone = normalisePhone(input.phone);
  const teams = [...new Set((input.teams ?? []).filter((team) => TEAM_IDS.has(team)))];
  const days = [...new Set((input.days ?? []).filter((day) => dayLabels.includes(day)))];

  const record = {
    name: input.name.trim(),
    phone,
    email: input.email?.trim() || null,
    branch: resolveBranch(input.branch, input.branchOther) || null,
    teams,
    days,
    experience: input.experience?.trim() || null,
  };

  const { data: existing } = await supabase
    .from("volunteers")
    .select("id, teams")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    // Someone coming back to add a second team means both, not a replacement.
    const merged = [...new Set([...(existing.teams ?? []), ...teams])];
    const { error } = await supabase
      .from("volunteers")
      .update({ ...record, teams: merged })
      .eq("id", existing.id);

    if (error) throw error;

    await logActivity("volunteer", `${record.name} updated their volunteer sign-up`, {
      teams: merged,
    });
    return { ok: true, name: record.name, teams: merged, alreadySignedUp: true };
  }

  const { error } = await supabase.from("volunteers").insert(record);
  if (error) throw error;

  await logActivity("volunteer", `${record.name} signed up to serve`, { teams });
  return { ok: true, name: record.name, teams, alreadySignedUp: false };
}

export function teamName(id: string): string {
  return TEAMS.find((team) => team.id === id)?.name ?? id;
}
