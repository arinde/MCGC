import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as isConfigured } from "./supabase_DnnZyzMy.mjs";
import { n as createVolunteer } from "./volunteers_DD2rSOdJ.mjs";
//#region src/pages/api/volunteer.ts
var volunteer_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var json = (body, status = 200) => Response.json(body, { status });
var POST = async ({ request }) => {
	if (!isConfigured()) return json({ errors: [{
		field: "",
		message: "Sign-ups aren’t switched on yet. Please try later."
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
		const result = await createVolunteer(input);
		if (!result.ok) return json({ errors: result.errors }, 422);
		return json({
			name: result.name,
			teams: result.teams,
			alreadySignedUp: result.alreadySignedUp
		});
	} catch (error) {
		console.error("[volunteer] failed:", error);
		return json({ errors: [{
			field: "",
			message: "We couldn’t save that. Please try again, or call the convention desk."
		}] }, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/volunteer@_@ts
var page = () => volunteer_exports;
//#endregion
export { page };
