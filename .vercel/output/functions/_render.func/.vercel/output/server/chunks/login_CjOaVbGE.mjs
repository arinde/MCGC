import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { n as createSession, t as checkPassword } from "./auth_DRoDW2VP.mjs";
import { t as $$Base } from "./Base_BzF_dTgF.mjs";
import { r as logActivity } from "./supabase_B8Xh_2a2.mjs";
import { t as $$Button } from "./Button_C61ewlor.mjs";
//#region src/pages/admin/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://majiyagbe-convention.vercel.app");
var $$Login = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Login;
	const nextPath = Astro.url.searchParams.get("next") ?? "/admin";
	const safeNext = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/admin";
	let error = "";
	if (Astro.request.method === "POST") {
		const form = await Astro.request.formData();
		const password = String(form.get("password") ?? "");
		if (checkPassword(password)) {
			await createSession(Astro.cookies);
			await logActivity("login", "Signed in to the dashboard");
			return Astro.redirect(safeNext, 302);
		}
		error = "That password isn’t right.";
	}
	return renderTemplate`${renderComponent($$result, "Base", $$Base, {
		"title": "Sign in · MCGC Admin",
		"noindex": true,
		"data-astro-cid-xeimgta2": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="login" data-astro-cid-xeimgta2><form class="login__card" method="POST" data-astro-cid-xeimgta2><p class="eyebrow" data-astro-cid-xeimgta2>MCGC Convention</p><h1 class="display login__title" data-astro-cid-xeimgta2>Dashboard</h1><p class="login__hint" data-astro-cid-xeimgta2>Enter the shared admin password.</p><label for="password" class="sr-only" data-astro-cid-xeimgta2>Password</label><input type="password" id="password" name="password" autocomplete="current-password" placeholder="Password" required autofocus data-astro-cid-xeimgta2>${error && renderTemplate`<p class="login__error" role="alert" data-astro-cid-xeimgta2>${error}</p>`}${renderComponent($$result, "Button", $$Button, {
		"type": "submit",
		"class": "login__submit",
		"data-astro-cid-xeimgta2": true
	}, { "default": ($$result) => renderTemplate`Sign in` })}</form></main>` })}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/login.astro", void 0);
var $$file = "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/admin/login.astro";
var $$url = "/admin/login";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
