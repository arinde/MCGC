import { n as $$Image } from "./_astro_assets_DHgmT-rw.mjs";
import { D as maybeRenderHead, E as renderTemplate, I as createAstro, b as renderComponent, k as addAttribute } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { a as convention } from "./supabase_DnnZyzMy.mjs";
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
export { $$Brand as t };
