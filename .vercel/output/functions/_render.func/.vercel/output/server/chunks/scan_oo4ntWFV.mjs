import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute, x as Fragment } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { t as renderScript } from "./script_BbaWhd6Z.mjs";
import { a as convention, n as isConfigured, o as currentDayLabel, t as getSupabase } from "./supabase_DnnZyzMy.mjs";
import { t as $$Admin } from "./Admin_7x7lGI5U.mjs";
//#region src/pages/admin/scan.astro
var scan_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Scan,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://majiyagbe-convention.vercel.app");
var $$Scan = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Scan;
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
		"title": "Scan",
		"active": "scan",
		"data-astro-cid-2kwotoxa": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="page-head" data-astro-cid-2kwotoxa><div data-astro-cid-2kwotoxa><p class="eyebrow" data-astro-cid-2kwotoxa>At the gate</p><h1 class="page-head__title" data-astro-cid-2kwotoxa>Scan to tap in</h1></div><p class="page-head__meta" data-astro-cid-2kwotoxa><b id="scan-count" data-astro-cid-2kwotoxa>${checkedInCount}</b> in tonight</p></div>${!ready ? renderTemplate`<p class="empty" data-astro-cid-2kwotoxa>Connect the database first — see the Overview tab.</p>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="days" role="group" aria-label="Which night" data-astro-cid-2kwotoxa>${convention.days.map((day) => renderTemplate`<a${addAttribute(`/admin/scan?day=${encodeURIComponent(day.label)}`, "href")}${addAttribute(["day", day.label === selectedDay && "day--on"], "class:list")} data-astro-cid-2kwotoxa>${day.label}${day.label === today && renderTemplate`<small data-astro-cid-2kwotoxa>tonight</small>`}</a>`)}</div><div class="scanner"${addAttribute(selectedDay, "data-day")} data-astro-cid-2kwotoxa><div class="viewport" id="viewport" data-astro-cid-2kwotoxa><video id="video" playsinline muted data-astro-cid-2kwotoxa></video><div class="reticle" aria-hidden="true" data-astro-cid-2kwotoxa></div><p class="viewport__idle" id="viewport-idle" data-astro-cid-2kwotoxa>Camera is off</p></div><div class="controls" data-astro-cid-2kwotoxa><button type="button" class="btn btn--primary" id="scan-toggle" data-astro-cid-2kwotoxa>Start camera</button><button type="button" class="btn" id="flip-camera" hidden data-astro-cid-2kwotoxa>Flip camera</button></div><p class="status" id="status" role="status" aria-live="polite" data-astro-cid-2kwotoxa>Point the camera at the pass. It checks in automatically.</p><form class="manual" id="manual-form" data-astro-cid-2kwotoxa><label for="manual-code" data-astro-cid-2kwotoxa>Or type the code</label><div class="manual__row" data-astro-cid-2kwotoxa><input type="text" id="manual-code" name="code" placeholder="e.g. K7M2QP" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="6" data-astro-cid-2kwotoxa><button type="submit" class="btn btn--primary" data-astro-cid-2kwotoxa>Check in</button></div></form></div><ul class="log" id="log" aria-label="Recently scanned" data-astro-cid-2kwotoxa></ul>` })}`}` })}${renderScript($$result, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/scan.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/scan.astro", void 0);
var $$file = "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/scan.astro";
var $$url = "/admin/scan";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/scan@_@astro
var page = () => scan_exports;
//#endregion
export { page };
