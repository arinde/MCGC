import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { a as convention, n as isConfigured, o as currentDayLabel, r as logActivity, t as getSupabase } from "./supabase_bDmEQrgt.mjs";
import { t as $$Admin } from "./Admin_DJM7pyny.mjs";
import { t as $$Button } from "./Button_DBgNkQE9.mjs";
//#region src/pages/admin/counts.astro
var counts_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Counts,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://majiyagbe-convention.vercel.app");
var $$Counts = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Counts;
	const today = currentDayLabel();
	let message = "";
	let isError = false;
	if (Astro.request.method === "POST" && isConfigured()) {
		const form = await Astro.request.formData();
		const dayLabel = String(form.get("dayLabel") ?? "");
		const sessionTime = String(form.get("sessionTime") ?? "");
		const headcount = Number(form.get("headcount"));
		const countedBy = String(form.get("countedBy") ?? "").trim();
		const day = convention.days.find((d) => d.label === dayLabel);
		const session = day?.sessions.find((s) => s.time === sessionTime);
		if (!day || !session || !Number.isFinite(headcount) || headcount < 0) {
			message = "Pick a night and a session, and enter a number.";
			isError = true;
		} else {
			const { error } = await getSupabase().from("session_counts").insert({
				day_label: dayLabel,
				session_time: sessionTime,
				session_name: session.title,
				headcount: Math.round(headcount),
				counted_by: countedBy || null
			});
			if (error) {
				message = "Couldn’t save that count.";
				isError = true;
			} else {
				await logActivity("count", `${headcount} counted at ${dayLabel} · ${session.title}`);
				message = `Recorded: ${headcount} at ${session.title}.`;
			}
		}
	}
	let history = [];
	if (isConfigured()) {
		const { data } = await getSupabase().from("session_counts").select("day_label, session_time, session_name, headcount, counted_at").order("counted_at", { ascending: false }).limit(25);
		history = data ?? [];
	}
	const timeFormat = new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
	return renderTemplate`${renderComponent($$result, "Admin", $$Admin, {
		"title": "Headcounts",
		"active": "counts",
		"data-astro-cid-cp3coxts": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<p class="eyebrow" data-astro-cid-cp3coxts>Per session</p><h1 class="display page-title" data-astro-cid-cp3coxts>Headcounts</h1><p class="lede" data-astro-cid-cp3coxts>What the ushers actually counted in the room. Separate from check-in, which only sees people who registered.</p>${message && renderTemplate`<p${addAttribute(["message", isError && "message--error"], "class:list")} role="status" data-astro-cid-cp3coxts>${message}</p>`}<form method="POST" class="count-form" data-astro-cid-cp3coxts><div class="field" data-astro-cid-cp3coxts><label for="dayLabel" data-astro-cid-cp3coxts>Night</label><select id="dayLabel" name="dayLabel" data-astro-cid-cp3coxts>${convention.days.map((day) => renderTemplate`<option${addAttribute(day.label, "value")}${addAttribute(day.label === today, "selected")} data-astro-cid-cp3coxts>${day.label} — ${day.date}</option>`)}</select></div><div class="field" data-astro-cid-cp3coxts><label for="sessionTime" data-astro-cid-cp3coxts>Session</label><select id="sessionTime" name="sessionTime" data-astro-cid-cp3coxts>${convention.days.map((day) => renderTemplate`<optgroup${addAttribute(day.label, "label")} data-astro-cid-cp3coxts>${day.sessions.map((session) => renderTemplate`<option${addAttribute(session.time, "value")} data-astro-cid-cp3coxts>${session.time} — ${session.title}</option>`)}</optgroup>`)}</select></div><div class="field" data-astro-cid-cp3coxts><label for="headcount" data-astro-cid-cp3coxts>Headcount</label><input type="number" id="headcount" name="headcount" min="0" step="1" required placeholder="0" data-astro-cid-cp3coxts></div><div class="field" data-astro-cid-cp3coxts><label for="countedBy" data-astro-cid-cp3coxts>Counted by</label><input type="text" id="countedBy" name="countedBy" placeholder="Usher's name" data-astro-cid-cp3coxts></div>${renderComponent($$result, "Button", $$Button, {
		"type": "submit",
		"class": "count-form__submit",
		"data-astro-cid-cp3coxts": true
	}, { "default": ($$result) => renderTemplate`Record count` })}</form><div class="panel" data-astro-cid-cp3coxts><h2 class="panel__title" data-astro-cid-cp3coxts>Recent counts</h2>${history.length === 0 ? renderTemplate`<p class="empty" data-astro-cid-cp3coxts>No counts recorded yet.</p>` : renderTemplate`<ul class="history" data-astro-cid-cp3coxts>${history.map((entry) => renderTemplate`<li data-astro-cid-cp3coxts><span class="history__count" data-astro-cid-cp3coxts>${entry.headcount}</span><span data-astro-cid-cp3coxts><strong data-astro-cid-cp3coxts>${entry.session_name ?? entry.session_time}</strong><em data-astro-cid-cp3coxts>${entry.day_label} · ${entry.session_time}</em></span><time data-astro-cid-cp3coxts>${timeFormat.format(new Date(entry.counted_at))}</time></li>`)}</ul>`}</div>` })}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/counts.astro", void 0);
var $$file = "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/counts.astro";
var $$url = "/admin/counts";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/counts@_@astro
var page = () => counts_exports;
//#endregion
export { page };
