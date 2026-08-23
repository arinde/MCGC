import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as destroySession } from "./auth_D8MRE_gT.mjs";
//#region src/pages/admin/logout.ts
var logout_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = ({ cookies, redirect }) => {
	destroySession(cookies);
	return redirect("/admin/login", 302);
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/logout@_@ts
var page = () => logout_exports;
//#endregion
export { page };
