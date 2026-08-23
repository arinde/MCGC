import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as isAuthenticated } from "./auth_DRoDW2VP.mjs";
import { r as logActivity, s as dayLabels, t as getSupabase } from "./supabase_B8Xh_2a2.mjs";
//#region src/pages/api/checkin.ts
var checkin_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	if (!await isAuthenticated(cookies)) return new Response("Unauthorised", { status: 401 });
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Bad request" }, { status: 400 });
	}
	const { registrationId, dayLabel } = body;
	if (!registrationId || !dayLabel || !dayLabels.includes(dayLabel)) return Response.json({ error: "Unknown registration or night" }, { status: 400 });
	const supabase = getSupabase();
	const partySize = Math.max(1, Math.min(Number(body.partySize) || 1, 50));
	const { data, error } = await supabase.from("checkins").insert({
		registration_id: registrationId,
		day_label: dayLabel,
		party_size: partySize
	}).select("id").single();
	if (error) {
		if (error.code === "23505") return Response.json({
			ok: true,
			alreadyCheckedIn: true
		});
		console.error("[checkin] failed:", error);
		return Response.json({ error: "Could not check in" }, { status: 500 });
	}
	const { data: registration } = await supabase.from("registrations").select("name").eq("id", registrationId).single();
	await logActivity("checkin", `${registration?.name ?? "Someone"} checked in for ${dayLabel}`, { party_size: partySize });
	return Response.json({
		ok: true,
		id: data.id
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/checkin@_@ts
var page = () => checkin_exports;
//#endregion
export { page };
