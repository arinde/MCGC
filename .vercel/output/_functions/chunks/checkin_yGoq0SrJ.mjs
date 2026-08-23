import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as isAuthenticated } from "./auth_D8MRE_gT.mjs";
import { r as logActivity, s as dayLabels, t as getSupabase } from "./supabase_DnnZyzMy.mjs";
import { t as extractCode } from "./pass_BME2bPa6.mjs";
//#region src/pages/api/checkin.ts
var checkin_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var json = (body, status = 200) => Response.json(body, { status });
var POST = async ({ request, cookies }) => {
	if (!await isAuthenticated(cookies)) return json({ error: "Unauthorised" }, 401);
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: "Bad request" }, 400);
	}
	const { dayLabel } = body;
	if (!dayLabel || !dayLabels.includes(dayLabel)) return json({ error: "Unknown night" }, 400);
	const supabase = getSupabase();
	let registration = null;
	if (body.scanned) {
		const code = extractCode(body.scanned);
		if (!code) return json({
			error: "That code isn’t one of ours.",
			reason: "unreadable"
		}, 422);
		const { data } = await supabase.from("registrations").select("id, name, party_size").eq("code", code).maybeSingle();
		if (!data) return json({
			error: `No registration found for ${code}.`,
			reason: "not_found"
		}, 404);
		registration = data;
	} else if (body.registrationId) {
		const { data } = await supabase.from("registrations").select("id, name, party_size").eq("id", body.registrationId).maybeSingle();
		if (!data) return json({
			error: "That registration no longer exists.",
			reason: "not_found"
		}, 404);
		registration = data;
	} else return json({ error: "Nothing to check in" }, 400);
	const partySize = Math.max(1, Math.min(Number(body.partySize) || registration.party_size || 1, 50));
	const { error } = await supabase.from("checkins").insert({
		registration_id: registration.id,
		day_label: dayLabel,
		party_size: partySize
	});
	if (error) {
		if (error.code === "23505") return json({
			ok: true,
			alreadyCheckedIn: true,
			name: registration.name,
			partySize
		});
		console.error("[checkin] failed:", error);
		return json({ error: "Could not check in" }, 500);
	}
	await logActivity("checkin", `${registration.name} checked in for ${dayLabel}`, { party_size: partySize });
	return json({
		ok: true,
		alreadyCheckedIn: false,
		name: registration.name,
		partySize
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/checkin@_@ts
var page = () => checkin_exports;
//#endregion
export { page };
