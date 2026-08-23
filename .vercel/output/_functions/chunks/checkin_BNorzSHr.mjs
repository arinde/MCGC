import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute, x as Fragment } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { t as renderScript } from "./script_BbaWhd6Z.mjs";
import { a as convention, n as isConfigured, o as currentDayLabel, t as getSupabase } from "./supabase_bDmEQrgt.mjs";
import { t as $$Admin } from "./Admin_BYHl7AEU.mjs";
//#region src/pages/admin/checkin.astro
var checkin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Checkin,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://majiyagbe-convention.vercel.app");
var $$Checkin = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Checkin;
	const today = currentDayLabel();
	const selectedDay = Astro.url.searchParams.get("day") ?? today;
	let checkedInCount = 0;
	let ready = isConfigured();
	if (ready) try {
		const { count } = await getSupabase().from("checkins").select("id", {
			count: "exact",
			head: true
		}).eq("day_label", selectedDay);
		checkedInCount = count ?? 0;
	} catch {
		ready = false;
	}
	return renderTemplate`${renderComponent($$result, "Admin", $$Admin, {
		"title": "Check-in",
		"active": "checkin",
		"data-astro-cid-nb6poqdm": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="page-head" data-astro-cid-nb6poqdm><div data-astro-cid-nb6poqdm><p class="eyebrow" data-astro-cid-nb6poqdm>At the door</p><h1 class="display page-head__title" data-astro-cid-nb6poqdm>Check-in</h1></div><p class="page-head__meta" data-astro-cid-nb6poqdm><b id="checked-count" data-astro-cid-nb6poqdm>${checkedInCount}</b> checked in tonight</p></div>${!ready ? renderTemplate`<p class="empty" data-astro-cid-nb6poqdm>Connect the database first — see the Overview tab.</p>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="day-picker" role="group" aria-label="Which night" data-astro-cid-nb6poqdm>${convention.days.map((day) => renderTemplate`<a${addAttribute(`/admin/checkin?day=${encodeURIComponent(day.label)}`, "href")}${addAttribute(["day", day.label === selectedDay && "day--active"], "class:list")} data-astro-cid-nb6poqdm>${day.label}${day.label === today && renderTemplate`<small data-astro-cid-nb6poqdm>tonight</small>`}</a>`)}</div><div class="search" data-astro-cid-nb6poqdm><label for="q" class="sr-only" data-astro-cid-nb6poqdm>Search by name, phone or code</label><input type="search" id="q" placeholder="Type a name, phone number or code…" autocomplete="off" autofocus${addAttribute(selectedDay, "data-day")} data-astro-cid-nb6poqdm><p class="search__hint" id="search-hint" data-astro-cid-nb6poqdm>Start typing — results appear as you go.</p></div><ul class="results" id="results" data-astro-cid-nb6poqdm></ul>` })}`}` })}${renderScript($$result, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/checkin.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/checkin.astro", void 0);
var $$file = "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/checkin.astro";
var $$url = "/admin/checkin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/checkin@_@astro
var page = () => checkin_exports;
//#endregion
export { page };
