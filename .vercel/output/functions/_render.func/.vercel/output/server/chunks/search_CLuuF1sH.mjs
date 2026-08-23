import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as isAuthenticated } from "./auth_D8MRE_gT.mjs";
import { t as getSupabase } from "./supabase_DnnZyzMy.mjs";
import { n as normalisePhone } from "./registrations_BFdzbQ5H.mjs";
//#region src/pages/api/search.ts
var search_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var MAX_RESULTS = 12;
/** `%` and `_` are wildcards in ILIKE; a name containing them must not widen the search. */
function escapeLikePattern(value) {
	return value.replace(/[%_\\]/g, "\\$&");
}
var GET = async ({ url, cookies }) => {
	if (!await isAuthenticated(cookies)) return new Response("Unauthorised", { status: 401 });
	const query = (url.searchParams.get("q") ?? "").trim();
	const dayLabel = url.searchParams.get("day") ?? "";
	if (query.length < 2) return Response.json([]);
	const supabase = getSupabase();
	const pattern = `%${escapeLikePattern(query)}%`;
	const filters = [`name.ilike.${pattern}`, `code.ilike.${pattern}`];
	const phone = normalisePhone(query);
	if (phone.length >= 6) filters.push(`phone.ilike.%${escapeLikePattern(phone)}%`);
	const { data, error } = await supabase.from("registrations").select("id, name, phone, branch, code, party_size").or(filters.join(",")).limit(MAX_RESULTS);
	if (error) {
		console.error("[search] failed:", error);
		return Response.json([], { status: 500 });
	}
	const registrations = data ?? [];
	if (registrations.length === 0) return Response.json([]);
	const { data: checkins } = await supabase.from("checkins").select("registration_id").eq("day_label", dayLabel).in("registration_id", registrations.map((r) => r.id));
	const alreadyIn = new Set((checkins ?? []).map((c) => c.registration_id));
	return Response.json(registrations.map((registration) => ({
		...registration,
		checked_in: alreadyIn.has(registration.id)
	})));
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/search@_@ts
var page = () => search_exports;
//#endregion
export { page };
