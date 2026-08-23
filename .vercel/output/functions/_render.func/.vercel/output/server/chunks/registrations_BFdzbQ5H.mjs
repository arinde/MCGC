import { i as makeCode, r as logActivity, s as dayLabels, t as getSupabase } from "./supabase_DnnZyzMy.mjs";
//#region src/lib/registrations.ts
/** "Me + 3" → 4. Anything unrecognised counts as 1 person. */
function partySizeFrom(guestsLabel) {
	if (!guestsLabel) return 1;
	const match = guestsLabel.match(/(\d+)/);
	if (!match) return 1;
	return Math.min(1 + Number(match[1]), 50);
}
/**
* Nigerian numbers arrive as 0803…, +234803…, 234 803…, with spaces and dashes.
* Store one canonical form so the same person can't register twice under two spellings.
*/
function normalisePhone(raw) {
	const digits = raw.replace(/[^\d+]/g, "").replace(/^\+/, "");
	if (digits.startsWith("234")) return `+${digits}`;
	if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
	return digits ? `+${digits}` : "";
}
function validate(input) {
	const errors = [];
	const name = input.name?.trim() ?? "";
	if (name.length < 2) errors.push({
		field: "name",
		message: "Please enter your name so we know who to expect."
	});
	else if (name.length > 120) errors.push({
		field: "name",
		message: "That name is too long."
	});
	const phone = normalisePhone(input.phone ?? "");
	if (phone.length < 10 || phone.length > 18) errors.push({
		field: "phone",
		message: "Please enter a valid phone number."
	});
	const email = input.email?.trim();
	if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push({
		field: "email",
		message: "That email address doesn't look right."
	});
	return errors;
}
/** Drops anything the form didn't legitimately offer — the client can send whatever it likes. */
function sanitiseDays(days) {
	if (!days?.length) return [];
	if (days.includes("All four days")) return [...dayLabels];
	const matched = days.map((value) => dayLabels.find((label) => value.startsWith(label))).filter((label) => Boolean(label));
	return [...new Set(matched)];
}
var KNOWN_FLAGS = /* @__PURE__ */ new Set([
	"First-time guest",
	"Bringing children",
	"Needs transport",
	"Accessible seating"
]);
function sanitiseFlags(flags) {
	return [...new Set((flags ?? []).filter((flag) => KNOWN_FLAGS.has(flag)))];
}
/**
* Creates a registration, or returns the existing one if this phone number
* already registered. Re-submitting is common (people tap twice, or register
* again after changing their mind) and should never create a duplicate row
* or a second confirmation code.
*/
async function createRegistration(input) {
	const errors = validate(input);
	if (errors.length) return {
		ok: false,
		errors
	};
	const supabase = getSupabase();
	const phone = normalisePhone(input.phone);
	const days = sanitiseDays(input.days);
	const { data: existing } = await supabase.from("registrations").select("id, code, name, phone, email, branch, guests_label, party_size, days, flags, source, notes, created_at").eq("phone", phone).maybeSingle();
	if (existing) {
		const mergedDays = [.../* @__PURE__ */ new Set([...existing.days ?? [], ...days])];
		const { data: updated, error } = await supabase.from("registrations").update({
			name: input.name.trim(),
			email: input.email?.trim() || existing.email,
			branch: input.branch?.trim() || existing.branch,
			guests_label: input.guestsLabel ?? existing.guests_label,
			party_size: partySizeFrom(input.guestsLabel) || existing.party_size,
			days: mergedDays,
			flags: sanitiseFlags(input.flags)
		}).eq("id", existing.id).select().single();
		if (error) throw error;
		await logActivity("registration", `${updated.name} updated their registration`, { code: updated.code });
		return {
			ok: true,
			registration: updated,
			alreadyRegistered: true
		};
	}
	const { data: created, error } = await supabase.from("registrations").insert({
		code: makeCode(),
		name: input.name.trim(),
		phone,
		email: input.email?.trim() || null,
		branch: input.branch?.trim() || null,
		guests_label: input.guestsLabel ?? null,
		party_size: partySizeFrom(input.guestsLabel),
		days,
		flags: sanitiseFlags(input.flags),
		source: "website"
	}).select().single();
	if (error) throw error;
	await logActivity("registration", `${created.name} registered${created.branch ? ` (${created.branch})` : ""}`, {
		code: created.code,
		party_size: created.party_size
	});
	return {
		ok: true,
		registration: created,
		alreadyRegistered: false
	};
}
//#endregion
export { normalisePhone as n, createRegistration as t };
