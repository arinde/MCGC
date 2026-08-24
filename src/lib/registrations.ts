import { getSupabase, makeCode, logActivity, type Registration } from "./supabase";
import { dayLabels } from "../data/convention";
import { resolveBranch } from "./branches";
import { hasGuestNames, registrationColumns } from "./schema";

/** What the registration form sends us. Everything is untrusted. */
export type RegistrationInput = {
  name: string;
  phone: string;
  email?: string;
  branch?: string;
  branchOther?: string;
  guestsLabel?: string;
  guestNames?: string;
  days?: string[];
  flags?: string[];
};

export type ValidationError = { field: string; message: string };

/** "Me + 3" → 4. Anything unrecognised counts as 1 person. */
export function partySizeFrom(guestsLabel: string | undefined): number {
  if (!guestsLabel) return 1;
  const match = guestsLabel.match(/(\d+)/);
  if (!match) return 1;
  return Math.min(1 + Number(match[1]), 50);
}

/**
 * How many people this booking is really for.
 *
 * If someone picks "Me + 4 or more" and then lists six names, six is the truth
 * and the dropdown was just the closest option available. The count never goes
 * below what they picked, so leaving the names blank changes nothing.
 */
export function partySize(guestsLabel: string | undefined, guestNames: string[]): number {
  return Math.min(Math.max(partySizeFrom(guestsLabel), 1 + guestNames.length), 50);
}

const MAX_GUESTS = 30;
const MAX_GUEST_NAME = 80;

/**
 * The guests someone is bringing, typed as free text.
 *
 * People split names however feels natural on a phone — one per line, commas,
 * or both — so all three are accepted. Names are NOT de-duplicated: two
 * brothers can share a first name, and silently dropping one would understate
 * the party at the gate.
 */
export function sanitiseGuestNames(raw: string | undefined): string[] {
  if (!raw) return [];

  return raw
    .split(/[\n,;]+/)
    .map((name) => name.trim().replace(/\s+/g, " ").slice(0, MAX_GUEST_NAME))
    .filter((name) => name.length >= 2)
    .slice(0, MAX_GUESTS);
}

/**
 * Nigerian numbers arrive as 0803…, +234803…, 234 803…, with spaces and dashes.
 * Store one canonical form so the same person can't register twice under two spellings.
 */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return digits ? `+${digits}` : "";
}

export function validate(input: RegistrationInput): ValidationError[] {
  const errors: ValidationError[] = [];

  const name = input.name?.trim() ?? "";
  if (name.length < 2) {
    errors.push({ field: "name", message: "Please enter your name so we know who to expect." });
  } else if (name.length > 120) {
    errors.push({ field: "name", message: "That name is too long." });
  }

  const phone = normalisePhone(input.phone ?? "");
  // +234 plus 10 digits = 14 characters; allow a little room for other countries.
  if (phone.length < 10 || phone.length > 18) {
    errors.push({ field: "phone", message: "Please enter a valid phone number." });
  }

  const email = input.email?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.push({ field: "email", message: "That email address doesn't look right." });
  }

  return errors;
}

/** Drops anything the form didn't legitimately offer — the client can send whatever it likes. */
function sanitiseDays(days: string[] | undefined): string[] {
  if (!days?.length) return [];
  if (days.includes("All four days")) return [...dayLabels];

  // Chip values look like "Day 1 (Thu · 27 Aug)" — keep only the stable label.
  const matched = days
    .map((value) => dayLabels.find((label) => value.startsWith(label)))
    .filter((label): label is string => Boolean(label));

  return [...new Set(matched)];
}

const KNOWN_FLAGS = new Set([
  "First-time guest",
  "Bringing children",
  "Needs transport",
  "Accessible seating",
]);

function sanitiseFlags(flags: string[] | undefined): string[] {
  return [...new Set((flags ?? []).filter((flag) => KNOWN_FLAGS.has(flag)))];
}

export type CreateResult =
  | { ok: true; registration: Registration; alreadyRegistered: boolean }
  | { ok: false; errors: ValidationError[] };

/**
 * Creates a registration, or returns the existing one if this phone number
 * already registered. Re-submitting is common (people tap twice, or register
 * again after changing their mind) and should never create a duplicate row
 * or a second confirmation code.
 */
export async function createRegistration(input: RegistrationInput): Promise<CreateResult> {
  const errors = validate(input);
  if (errors.length) return { ok: false, errors };

  const supabase = getSupabase();
  const phone = normalisePhone(input.phone);
  const days = sanitiseDays(input.days);
  const guestNames = sanitiseGuestNames(input.guestNames);
  const branch = resolveBranch(input.branch, input.branchOther);

  // Only write the column if the database has it — see src/lib/schema.ts.
  const guestNamesColumn = (await hasGuestNames()) ? { guest_names: guestNames } : {};

  const { data: existingRow } = await supabase
    .from("registrations")
    .select(await registrationColumns())
    .eq("phone", phone)
    .maybeSingle();

  // The column list is built at runtime, so supabase-js cannot infer the row.
  const existing = existingRow as unknown as Registration | null;

  if (existing) {
    // Merge rather than overwrite: if they registered for Day 1 and come back
    // to add Day 3, they meant both.
    const mergedDays = [...new Set([...(existing.days ?? []), ...days])];
    const { data: updated, error } = await supabase
      .from("registrations")
      .update({
        name: input.name.trim(),
        email: input.email?.trim() || existing.email,
        branch: branch || existing.branch,
        guests_label: input.guestsLabel ?? existing.guests_label,
        party_size: partySize(input.guestsLabel, guestNames) || existing.party_size,
        // Someone returning to add a name shouldn't wipe the ones already there.
        ...(guestNames.length > 0 ? guestNamesColumn : {}),
        days: mergedDays,
        flags: sanitiseFlags(input.flags),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;

    await logActivity("registration", `${updated.name} updated their registration`, {
      code: updated.code,
    });
    return { ok: true, registration: updated as Registration, alreadyRegistered: true };
  }

  const { data: created, error } = await supabase
    .from("registrations")
    .insert({
      code: makeCode(),
      name: input.name.trim(),
      phone,
      email: input.email?.trim() || null,
      branch: branch || null,
      guests_label: input.guestsLabel ?? null,
      party_size: partySize(input.guestsLabel, guestNames),
      ...guestNamesColumn,
      days,
      flags: sanitiseFlags(input.flags),
      source: "website",
    })
    .select()
    .single();

  if (error) throw error;

  await logActivity(
    "registration",
    `${created.name} registered${created.branch ? ` (${created.branch})` : ""}`,
    { code: created.code, party_size: created.party_size },
  );

  return { ok: true, registration: created as Registration, alreadyRegistered: false };
}
