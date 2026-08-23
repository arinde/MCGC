import { n as $$Image } from "./_astro_assets_DHgmT-rw.mjs";
import { C as renderSlot, D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { t as $$Base } from "./Base_DWzEZ8Ma.mjs";
import { a as convention } from "./supabase_bDmEQrgt.mjs";
//#region src/assets/mcgc-logo.jpeg
var mcgc_logo_default = new Proxy({
	"src": "/_astro/mcgc-logo.I8udLYWZ.jpeg",
	"width": 1080,
	"height": 1066,
	"format": "jpg",
	"orientation": 1
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "C:/Users/ADEDAMOLA/Desktop/MCGC/src/assets/mcgc-logo.jpeg";
	return target[name];
} });
//#endregion
//#region src/components/Brand.astro
createAstro("https://majiyagbe-convention.vercel.app");
var $$Brand = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Brand;
	const { href = "#top", size = "sm", compact = false } = Astro.props;
	const px = size === "md" ? 52 : 38;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(["brand", compact && "brand--compact"], "class:list")}${addAttribute(href, "href")} data-astro-cid-6bctqxxv>${renderComponent($$result, "Image", $$Image, {
		"src": mcgc_logo_default,
		"alt": "",
		"width": px,
		"height": px,
		"densities": [1, 2],
		"loading": "eager",
		"class": "brand__logo",
		"data-astro-cid-6bctqxxv": true
	})}<span class="brand__text" data-astro-cid-6bctqxxv><b data-astro-cid-6bctqxxv>${convention.church}</b><small data-astro-cid-6bctqxxv>${convention.churchSuffix}</small></span><span class="sr-only" data-astro-cid-6bctqxxv>${convention.church} — home</span></a>`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/components/Brand.astro", void 0);
//#endregion
//#region src/layouts/Admin.astro
createAstro("https://majiyagbe-convention.vercel.app");
var $$Admin = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Admin;
	const { title, active } = Astro.props;
	const tabs = [
		{
			key: "overview",
			href: "/admin",
			label: "Overview"
		},
		{
			key: "checkin",
			href: "/admin/checkin",
			label: "Check-in"
		},
		{
			key: "counts",
			href: "/admin/counts",
			label: "Headcounts"
		}
	];
	return renderTemplate`${renderComponent($$result, "Base", $$Base, {
		"title": `${title} · Majiyagbe Admin`,
		"noindex": true,
		"data-astro-cid-vyz22n65": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="admin-root" data-astro-cid-vyz22n65><header class="admin-bar" data-astro-cid-vyz22n65><div class="admin-bar__inner" data-astro-cid-vyz22n65>${renderComponent($$result, "Brand", $$Brand, {
		"href": "/admin",
		"compact": true,
		"data-astro-cid-vyz22n65": true
	})}<span class="admin-bar__label" data-astro-cid-vyz22n65>Convention admin</span><nav class="admin-bar__tabs" aria-label="Dashboard sections" data-astro-cid-vyz22n65>${tabs.map((tab) => renderTemplate`<a${addAttribute(tab.href, "href")}${addAttribute(active === tab.key ? "page" : void 0, "aria-current")} data-astro-cid-vyz22n65>${tab.label}</a>`)}</nav><form method="POST" action="/admin/logout" data-astro-cid-vyz22n65><button type="submit" class="admin-bar__signout" data-astro-cid-vyz22n65>Sign out</button></form></div></header><main id="main" class="admin-main" data-astro-cid-vyz22n65>${renderSlot($$result, $$slots["default"])}</main></div>` })}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/layouts/Admin.astro", void 0);
//#endregion
export { $$Admin as t };
