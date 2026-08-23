import { r as logActivity, s as dayLabels, t as getSupabase } from "./supabase_DnnZyzMy.mjs";
import { n as normalisePhone } from "./registrations_BFdzbQ5H.mjs";
//#region src/lib/volunteers.ts
/** The teams serving the convention. `id` is stored in the database — keep stable. */
var TEAMS = [
	{
		id: "ushering",
		name: "Ushering",
		blurb: "Welcome people at the gate, find them seats, take the headcount.",
		needs: "Every service"
	},
	{
		id: "media",
		name: "Media",
		blurb: "Photos, video, live stream and the sound desk.",
		needs: "Cameras and laptops welcome"
	},
	{
		id: "prayer",
		name: "Prayer",
		blurb: "Intercession before each service, and prayer at the altar after.",
		needs: "Early arrival"
	},
	{
		id: "security",
		name: "Security",
		blurb: "The gate, the car park, and keeping walkways clear.",
		needs: "Night shifts included"
	},
	{
		id: "sanitation",
		name: "Sanitation",
		blurb: "Keeping the grounds, the hall and the conveniences clean.",
		needs: "Morning and evening"
	},
	{
		id: "protocol",
		name: "Protocol",
		blurb: "Receiving ministers and guests, and seating the high table.",
		needs: "Smart dress"
	},
	{
		id: "praise",
		name: "Praise team",
		blurb: "Choir, instrumentalists and worship leading through the week.",
		needs: "Rehearsals before"
	},
	{
		id: "kitchen",
		name: "Kitchen",
		blurb: "Cooking and serving for the camp and the ministers' table.",
		needs: "Early mornings"
	},
	{
		id: "logistics",
		name: "Logistics",
		blurb: "Chairs, canopies, transport, generators and the store.",
		needs: "Heavy lifting"
	}
];
var TEAM_IDS = new Set(TEAMS.map((team) => team.id));
function validate(input) {
	const errors = [];
	if ((input.name?.trim() ?? "").length < 2) errors.push({
		field: "name",
		message: "Please enter your name."
	});
	const phone = normalisePhone(input.phone ?? "");
	if (phone.length < 10 || phone.length > 18) errors.push({
		field: "phone",
		message: "Please enter a valid phone number."
	});
	const email = input.email?.trim();
	if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push({
		field: "email",
		message: "That email address doesn’t look right."
	});
	if (!input.teams?.some((team) => TEAM_IDS.has(team))) errors.push({
		field: "teams",
		message: "Pick at least one team you'd like to serve on."
	});
	return errors;
}
async function createVolunteer(input) {
	const errors = validate(input);
	if (errors.length) return {
		ok: false,
		errors
	};
	const supabase = getSupabase();
	const phone = normalisePhone(input.phone);
	const teams = [...new Set((input.teams ?? []).filter((team) => TEAM_IDS.has(team)))];
	const days = [...new Set((input.days ?? []).filter((day) => dayLabels.includes(day)))];
	const record = {
		name: input.name.trim(),
		phone,
		email: input.email?.trim() || null,
		branch: input.branch?.trim() || null,
		teams,
		days,
		experience: input.experience?.trim() || null
	};
	const { data: existing } = await supabase.from("volunteers").select("id, teams").eq("phone", phone).maybeSingle();
	if (existing) {
		const merged = [.../* @__PURE__ */ new Set([...existing.teams ?? [], ...teams])];
		const { error } = await supabase.from("volunteers").update({
			...record,
			teams: merged
		}).eq("id", existing.id);
		if (error) throw error;
		await logActivity("volunteer", `${record.name} updated their volunteer sign-up`, { teams: merged });
		return {
			ok: true,
			name: record.name,
			teams: merged,
			alreadySignedUp: true
		};
	}
	const { error } = await supabase.from("volunteers").insert(record);
	if (error) throw error;
	await logActivity("volunteer", `${record.name} signed up to serve`, { teams });
	return {
		ok: true,
		name: record.name,
		teams,
		alreadySignedUp: false
	};
}
function teamName(id) {
	return TEAMS.find((team) => team.id === id)?.name ?? id;
}
//#endregion
export { createVolunteer as n, teamName as r, TEAMS as t };
