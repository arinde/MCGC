import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute, x as Fragment } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { t as renderScript } from "./script_BbaWhd6Z.mjs";
import { n as isConfigured } from "./supabase_DnnZyzMy.mjs";
import { t as $$Admin } from "./Admin_D5ffv7AT.mjs";
import { t as loadDashboard } from "./stats_Dmf5gPqs.mjs";
//#region src/components/admin/StatTile.astro
createAstro("https://majiyagbe-convention.vercel.app");
var $$StatTile = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$StatTile;
	const { label, value, detail, feature = false } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["tile", feature && "tile--feature"], "class:list")} data-astro-cid-nijkb24y><p class="tile__label" data-astro-cid-nijkb24y>${label}</p><p class="tile__value" data-astro-cid-nijkb24y>${value}</p>${detail && renderTemplate`<p class="tile__detail" data-astro-cid-nijkb24y>${detail}</p>`}</div>`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/components/admin/StatTile.astro", void 0);
//#endregion
//#region src/components/admin/DayTable.astro
createAstro("https://majiyagbe-convention.vercel.app");
var $$DayTable = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DayTable;
	const { days } = Astro.props;
	const peak = Math.max(1, ...days.map((day) => Math.max(day.registeredPeople, day.attendedPeople)));
	function turnoutLabel(turnout) {
		return turnout === null ? "—" : `${Math.round(turnout * 100)}%`;
	}
	function turnoutState(turnout) {
		if (turnout === null) return "none";
		if (turnout >= .8) return "good";
		if (turnout >= .5) return "warn";
		return "bad";
	}
	return renderTemplate`${maybeRenderHead($$result)}<div class="panel" data-astro-cid-nkmupmqj><h2 class="panel__title" data-astro-cid-nkmupmqj>Night by night</h2><div class="table-scroll" data-astro-cid-nkmupmqj><table data-astro-cid-nkmupmqj><thead data-astro-cid-nkmupmqj><tr data-astro-cid-nkmupmqj><th scope="col" data-astro-cid-nkmupmqj>Night</th><th scope="col" data-astro-cid-nkmupmqj>Registered</th><th scope="col" data-astro-cid-nkmupmqj>Attended</th><th scope="col" data-astro-cid-nkmupmqj>Turnout</th><th scope="col" class="col-bar" data-astro-cid-nkmupmqj><span class="sr-only" data-astro-cid-nkmupmqj>Comparison</span></th></tr></thead><tbody data-astro-cid-nkmupmqj>${days.map((day) => renderTemplate`<tr data-astro-cid-nkmupmqj><th scope="row" data-astro-cid-nkmupmqj>${day.label}</th><td data-astro-cid-nkmupmqj>${day.registeredPeople}<small data-astro-cid-nkmupmqj>${day.registeredParties} bookings</small></td><td data-astro-cid-nkmupmqj>${day.attendedPeople || "—"}${day.attendedParties > 0 && renderTemplate`<small data-astro-cid-nkmupmqj>${day.attendedParties} checked in</small>`}</td><td data-astro-cid-nkmupmqj><span${addAttribute(["pill", `pill--${turnoutState(day.turnout)}`], "class:list")} data-astro-cid-nkmupmqj>${turnoutLabel(day.turnout)}</span></td><td class="col-bar" data-astro-cid-nkmupmqj><span class="bar bar--registered"${addAttribute(`width:${day.registeredPeople / peak * 100}%`, "style")} data-astro-cid-nkmupmqj></span><span class="bar bar--attended"${addAttribute(`width:${day.attendedPeople / peak * 100}%`, "style")} data-astro-cid-nkmupmqj></span></td></tr>`)}</tbody></table></div><p class="legend" data-astro-cid-nkmupmqj><span class="key key--registered" data-astro-cid-nkmupmqj></span> Registered<span class="key key--attended" data-astro-cid-nkmupmqj></span> Actually attended</p></div>`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/components/admin/DayTable.astro", void 0);
//#endregion
//#region src/pages/admin/index.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	let data = null;
	let loadError = "";
	if (!isConfigured()) loadError = "Supabase isn’t configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env.";
	else try {
		data = await loadDashboard();
	} catch (error) {
		console.error("[dashboard] load failed:", error);
		loadError = "Couldn’t reach the database. Check the credentials and that schema.sql has been run.";
	}
	const exportLists = [
		{
			filter: "all",
			label: "Everyone"
		},
		{
			filter: "First-time guest",
			label: "First-timers"
		},
		{
			filter: "Bringing children",
			label: "Bringing children"
		},
		{
			filter: "Needs transport",
			label: "Need transport"
		},
		{
			filter: "Accessible seating",
			label: "Accessible seating"
		}
	];
	const timeFormat = new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
	return renderTemplate`${renderComponent($$result, "Admin", $$Admin, {
		"title": "Overview",
		"active": "overview",
		"data-astro-cid-nsou3le4": true
	}, { "default": ($$result) => renderTemplate`${loadError ? renderTemplate`${maybeRenderHead($$result)}<div class="notice" data-astro-cid-nsou3le4><h1 class="display notice__title" data-astro-cid-nsou3le4>Not connected yet</h1><p data-astro-cid-nsou3le4>${loadError}</p><p class="notice__hint" data-astro-cid-nsou3le4>See <code data-astro-cid-nsou3le4>README.md</code> → “Setting up the database”.</p></div>` : data && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="page-head" data-astro-cid-nsou3le4><div data-astro-cid-nsou3le4><p class="eyebrow" data-astro-cid-nsou3le4>Live</p><h1 class="display page-head__title" data-astro-cid-nsou3le4>Registrations</h1></div><p class="page-head__meta" data-astro-cid-nsou3le4>${data.totals.registeredToday} today · refreshes every 30s</p></div><div class="tiles" data-astro-cid-nsou3le4>${renderComponent($$result, "StatTile", $$StatTile, {
		"label": "People expected",
		"value": data.totals.people,
		"detail": `${data.totals.parties} bookings`,
		"feature": true,
		"data-astro-cid-nsou3le4": true
	})}${renderComponent($$result, "StatTile", $$StatTile, {
		"label": "First-timers",
		"value": data.totals.firstTimers,
		"detail": "Follow-up list",
		"data-astro-cid-nsou3le4": true
	})}${renderComponent($$result, "StatTile", $$StatTile, {
		"label": "Bringing children",
		"value": data.totals.withChildren,
		"detail": "For children's church",
		"data-astro-cid-nsou3le4": true
	})}${renderComponent($$result, "StatTile", $$StatTile, {
		"label": "Need transport",
		"value": data.totals.needTransport,
		"detail": "For the shuttle team",
		"data-astro-cid-nsou3le4": true
	})}</div><div class="columns" data-astro-cid-nsou3le4>${renderComponent($$result, "DayTable", $$DayTable, {
		"days": data.days,
		"data-astro-cid-nsou3le4": true
	})}<div class="panel" data-astro-cid-nsou3le4><h2 class="panel__title" data-astro-cid-nsou3le4>By branch</h2>${data.branches.length === 0 ? renderTemplate`<p class="empty" data-astro-cid-nsou3le4>No registrations yet.</p>` : renderTemplate`<ul class="branches" data-astro-cid-nsou3le4>${data.branches.map((branch) => renderTemplate`<li data-astro-cid-nsou3le4><span class="branches__name" data-astro-cid-nsou3le4>${branch.branch}</span><span class="branches__count" data-astro-cid-nsou3le4>${branch.people}</span></li>`)}</ul>`}</div></div><div class="panel" data-astro-cid-nsou3le4><div class="panel__head" data-astro-cid-nsou3le4><h2 class="panel__title" data-astro-cid-nsou3le4>Latest registrations</h2><div class="exports" data-astro-cid-nsou3le4>${exportLists.map((list) => renderTemplate`<a class="export"${addAttribute(`/admin/export.csv?filter=${encodeURIComponent(list.filter)}`, "href")} data-astro-cid-nsou3le4>${list.label}</a>`)}</div></div>${data.recent.length === 0 ? renderTemplate`<p class="empty" data-astro-cid-nsou3le4>Nothing yet — the first registration will appear here.</p>` : renderTemplate`<div class="table-scroll" data-astro-cid-nsou3le4><table data-astro-cid-nsou3le4><thead data-astro-cid-nsou3le4><tr data-astro-cid-nsou3le4><th scope="col" data-astro-cid-nsou3le4>Name</th><th scope="col" data-astro-cid-nsou3le4>Phone</th><th scope="col" data-astro-cid-nsou3le4>Branch</th><th scope="col" data-astro-cid-nsou3le4>Party</th><th scope="col" data-astro-cid-nsou3le4>Nights</th><th scope="col" data-astro-cid-nsou3le4>Code</th><th scope="col" data-astro-cid-nsou3le4>When</th></tr></thead><tbody data-astro-cid-nsou3le4>${data.recent.map((registration) => renderTemplate`<tr data-astro-cid-nsou3le4><th scope="row" data-astro-cid-nsou3le4>${registration.name}${registration.flags.length > 0 && renderTemplate`<small data-astro-cid-nsou3le4>${registration.flags.join(" · ")}</small>`}</th><td data-astro-cid-nsou3le4>${registration.phone}</td><td data-astro-cid-nsou3le4>${registration.branch ?? "—"}</td><td data-astro-cid-nsou3le4>${registration.party_size}</td><td data-astro-cid-nsou3le4>${registration.days.join(", ") || "—"}</td><td data-astro-cid-nsou3le4><code data-astro-cid-nsou3le4>${registration.code}</code></td><td data-astro-cid-nsou3le4>${timeFormat.format(new Date(registration.created_at))}</td></tr>`)}</tbody></table></div>`}</div><div class="panel" data-astro-cid-nsou3le4><h2 class="panel__title" data-astro-cid-nsou3le4>Activity</h2>${data.activity.length === 0 ? renderTemplate`<p class="empty" data-astro-cid-nsou3le4>No activity recorded yet.</p>` : renderTemplate`<ul class="activity" data-astro-cid-nsou3le4>${data.activity.map((entry) => renderTemplate`<li data-astro-cid-nsou3le4><span${addAttribute(["activity__kind", `activity__kind--${entry.kind}`], "class:list")} data-astro-cid-nsou3le4>${entry.kind}</span><span class="activity__text" data-astro-cid-nsou3le4>${entry.summary}</span><time data-astro-cid-nsou3le4>${timeFormat.format(new Date(entry.created_at))}</time></li>`)}</ul>`}</div>` })}`}` })}${renderScript($$result, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/index.astro", void 0);
var $$file = "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/index.astro";
var $$url = "/admin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/index@_@astro
var page = () => admin_exports;
//#endregion
export { page };
