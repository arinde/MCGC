import { C as renderSlot, D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { t as $$Base } from "./Base_bfGYQTWK.mjs";
import { t as $$Brand } from "./Brand_CNKY5Fga.mjs";
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
			key: "scan",
			href: "/admin/scan",
			label: "Scan"
		},
		{
			key: "checkin",
			href: "/admin/checkin",
			label: "Search"
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
