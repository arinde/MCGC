import { C as renderSlot, D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { t as $$Base } from "./Base_BzF_dTgF.mjs";
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
		"title": `${title} · MCGC Admin`,
		"noindex": true,
		"data-astro-cid-vyz22n65": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<header class="admin-bar" data-astro-cid-vyz22n65><div class="wrap admin-bar__inner" data-astro-cid-vyz22n65><a class="admin-bar__mark" href="/admin" data-astro-cid-vyz22n65>MC<span data-astro-cid-vyz22n65>G</span>C <small data-astro-cid-vyz22n65>admin</small></a><nav class="admin-bar__tabs" aria-label="Dashboard sections" data-astro-cid-vyz22n65>${tabs.map((tab) => renderTemplate`<a${addAttribute(tab.href, "href")}${addAttribute(active === tab.key ? "page" : void 0, "aria-current")} data-astro-cid-vyz22n65>${tab.label}</a>`)}</nav><form method="POST" action="/admin/logout" class="admin-bar__logout" data-astro-cid-vyz22n65><button type="submit" data-astro-cid-vyz22n65>Sign out</button></form></div></header><main id="main" class="admin-main" data-astro-cid-vyz22n65><div class="wrap" data-astro-cid-vyz22n65>${renderSlot($$result, $$slots["default"])}</div></main>` })}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/layouts/Admin.astro", void 0);
//#endregion
export { $$Admin as t };
