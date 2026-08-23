import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as isConfigured } from "./supabase_bDmEQrgt.mjs";
import { t as createRegistration } from "./registrations_CNo9-H-H.mjs";
//#region src/pages/api/register.ts
var register_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var json = (body, status = 200) => new Response(JSON.stringify(body), {
	status,
	headers: { "Content-Type": "application/json" }
});
var POST = async ({ request }) => {
	if (!isConfigured()) return json({ errors: [{
		field: "",
		message: "Registration isn’t switched on yet. Please try later."
	}] }, 503);
	let input;
	try {
		input = await request.json();
	} catch {
		return json({ errors: [{
			field: "",
			message: "That request didn’t come through."
		}] }, 400);
	}
	try {
		const result = await createRegistration(input);
		if (!result.ok) return json({ errors: result.errors }, 422);
		return json({
			code: result.registration.code,
			name: result.registration.name,
			days: result.registration.days,
			alreadyRegistered: result.alreadyRegistered
		});
	} catch (error) {
		console.error("[register] failed:", error);
		return json({ errors: [{
			field: "",
			message: "We couldn’t save that. Please try again, or call the convention desk."
		}] }, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/register@_@ts
var page = () => register_exports;
//#endregion
export { page };
