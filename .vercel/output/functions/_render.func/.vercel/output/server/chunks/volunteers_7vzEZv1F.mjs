import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute, x as Fragment } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { n as isConfigured, t as getSupabase } from "./supabase_DnnZyzMy.mjs";
import { t as $$Admin } from "./Admin_7x7lGI5U.mjs";
import { r as teamName, t as TEAMS } from "./volunteers_DD2rSOdJ.mjs";
//#region src/pages/admin/volunteers.astro
var volunteers_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Volunteers,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://majiyagbe-convention.vercel.app");
var $$Volunteers = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Volunteers;
	const teamFilter = Astro.url.searchParams.get("team") ?? "all";
	let volunteers = [];
	let ready = isConfigured();
	let loadError = "";
	if (ready) try {
		let query = getSupabase().from("volunteers").select("id, name, phone, email, branch, teams, days, experience, status, created_at").order("created_at", { ascending: false });
		if (teamFilter !== "all") query = query.contains("teams", [teamFilter]);
		const { data, error } = await query;
		if (error) throw error;
		volunteers = data ?? [];
	} catch (error) {
		console.error("[volunteers] load failed:", error);
		ready = false;
		loadError = "Couldn’t load volunteers. If you just added the volunteers table, re-run supabase/schema.sql.";
	}
	const counts = /* @__PURE__ */ new Map();
	for (const volunteer of volunteers) for (const team of volunteer.teams) counts.set(team, (counts.get(team) ?? 0) + 1);
	const dateFormat = new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
	return renderTemplate`${renderComponent($$result, "Admin", $$Admin, {
		"title": "Volunteers",
		"active": "volunteers",
		"data-astro-cid-kcuxtwkl": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="page-head" data-astro-cid-kcuxtwkl><div data-astro-cid-kcuxtwkl><p class="eyebrow" data-astro-cid-kcuxtwkl>Serving</p><h1 class="page-head__title" data-astro-cid-kcuxtwkl>Volunteers</h1></div><p class="page-head__meta" data-astro-cid-kcuxtwkl><b data-astro-cid-kcuxtwkl>${volunteers.length}</b> signed up</p></div>${!ready ? renderTemplate`<p class="empty" data-astro-cid-kcuxtwkl>${loadError || "Connect the database first — see the Overview tab."}</p>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="filters" data-astro-cid-kcuxtwkl><a href="/admin/volunteers"${addAttribute(["filter", teamFilter === "all" && "filter--on"], "class:list")} data-astro-cid-kcuxtwkl>All</a>${TEAMS.map((team) => renderTemplate`<a${addAttribute(`/admin/volunteers?team=${team.id}`, "href")}${addAttribute(["filter", teamFilter === team.id && "filter--on"], "class:list")} data-astro-cid-kcuxtwkl>${team.name}<b data-astro-cid-kcuxtwkl>${counts.get(team.id) ?? 0}</b></a>`)}</div>${volunteers.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-kcuxtwkl><p data-astro-cid-kcuxtwkl><b data-astro-cid-kcuxtwkl>No volunteers yet${teamFilter !== "all" ? ` for ${teamName(teamFilter)}` : ""}.</b></p><p data-astro-cid-kcuxtwkl>Share the sign-up page and they’ll appear here as they come in.</p><a class="empty-state__link" href="/volunteer" data-astro-cid-kcuxtwkl>Open the sign-up page →</a></div>` : renderTemplate`<div class="table-scroll" data-astro-cid-kcuxtwkl><table data-astro-cid-kcuxtwkl><thead data-astro-cid-kcuxtwkl><tr data-astro-cid-kcuxtwkl><th scope="col" data-astro-cid-kcuxtwkl>Name</th><th scope="col" data-astro-cid-kcuxtwkl>Phone</th><th scope="col" data-astro-cid-kcuxtwkl>Teams</th><th scope="col" data-astro-cid-kcuxtwkl>Days</th><th scope="col" data-astro-cid-kcuxtwkl>Branch</th><th scope="col" data-astro-cid-kcuxtwkl>Signed up</th></tr></thead><tbody data-astro-cid-kcuxtwkl>${volunteers.map((volunteer) => renderTemplate`<tr data-astro-cid-kcuxtwkl><th scope="row" data-astro-cid-kcuxtwkl>${volunteer.name}${volunteer.experience && renderTemplate`<small data-astro-cid-kcuxtwkl>${volunteer.experience}</small>`}</th><td data-astro-cid-kcuxtwkl><a${addAttribute(`tel:${volunteer.phone}`, "href")} data-astro-cid-kcuxtwkl>${volunteer.phone}</a></td><td data-astro-cid-kcuxtwkl><span class="tags" data-astro-cid-kcuxtwkl>${volunteer.teams.map((team) => renderTemplate`<span class="tag" data-astro-cid-kcuxtwkl>${teamName(team)}</span>`)}</span></td><td data-astro-cid-kcuxtwkl>${volunteer.days.length ? volunteer.days.join(", ") : "Any"}</td><td data-astro-cid-kcuxtwkl>${volunteer.branch ?? "—"}</td><td data-astro-cid-kcuxtwkl>${dateFormat.format(new Date(volunteer.created_at))}</td></tr>`)}</tbody></table></div>`}` })}`}` })}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/volunteers.astro", void 0);
var $$file = "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/volunteers.astro";
var $$url = "/admin/volunteers";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/volunteers@_@astro
var page = () => volunteers_exports;
//#endregion
export { page };
