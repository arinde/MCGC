import { n as defineMiddleware, t as sequence } from "./chunks/sequence_cgC9RwYc.mjs";
import { i as isAuthenticated } from "./chunks/auth_DRoDW2VP.mjs";
//#region src/middleware.ts
/**
* Gates everything under /admin behind the shared password.
*
* Doing this in middleware rather than per-page means a new dashboard page is
* protected the moment it's created — there is no way to forget the check.
*/
var onRequest$1 = defineMiddleware(async ({ url, cookies, redirect }, next) => {
	const isAdminArea = url.pathname.startsWith("/admin");
	const isLoginPage = url.pathname === "/admin/login";
	if (!isAdminArea || isLoginPage) return next();
	if (!await isAuthenticated(cookies)) return redirect(`/admin/login?next=${encodeURIComponent(url.pathname + url.search)}`, 302);
	return next();
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };
