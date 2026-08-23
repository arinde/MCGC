import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as logActivity } from "./supabase_bDmEQrgt.mjs";
import { n as loadForExport } from "./stats_BcOfvGZ0.mjs";
//#region src/pages/admin/export.csv.ts
var export_csv_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var HEADERS = [
	"Name",
	"Phone",
	"Email",
	"Branch",
	"Party size",
	"Nights",
	"Notes",
	"Code",
	"Registered at"
];
/**
* Excel treats a leading =, +, - or @ as a formula, which turns a malicious
* name into a live cell. Prefixing with an apostrophe keeps it text.
*/
function csvCell(value) {
	const text = value === null || value === void 0 ? "" : String(value);
	return `"${(/^[=+\-@]/.test(text) ? `'${text}` : text).replace(/"/g, "\"\"")}"`;
}
var GET = async ({ url }) => {
	const filter = url.searchParams.get("filter") ?? "all";
	try {
		const registrations = await loadForExport(filter);
		const rows = registrations.map((registration) => [
			registration.name,
			registration.phone,
			registration.email,
			registration.branch,
			registration.party_size,
			registration.days.join(" / "),
			registration.flags.join(" / "),
			registration.code,
			new Date(registration.created_at).toISOString()
		].map(csvCell).join(","));
		const csv = "﻿" + [HEADERS.map(csvCell).join(","), ...rows].join("\r\n");
		const filename = `mcgc-registrations-${filter === "all" ? "all" : filter.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		await logActivity("export", `Exported the "${filter}" list (${registrations.length} rows)`);
		return new Response(csv, { headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="${filename}"`
		} });
	} catch (error) {
		console.error("[export] failed:", error);
		return new Response("Export failed", { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/export.csv@_@ts
var page = () => export_csv_exports;
//#endregion
export { page };
