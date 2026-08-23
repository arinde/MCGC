import { C as renderSlot, E as renderTemplate, I as createAstro, O as renderHead, b as renderComponent, k as addAttribute, x as Fragment } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { a as convention } from "./supabase_bDmEQrgt.mjs";
//#region src/layouts/Base.astro
createAstro("https://majiyagbe-convention.vercel.app");
var $$Base = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Base;
	const { title, description = `${convention.title} ${convention.year} — ${convention.datesLabel}. ${convention.venue.name}. Free to attend.`, noindex = false } = Astro.props;
	const canonical = new URL(Astro.url.pathname, Astro.site).href;
	const shareImage = new URL("/og.png", Astro.site).href;
	return renderTemplate`<html lang="en" data-astro-cid-hkbrpulz><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonical, "href")}><link rel="icon" href="/favicon.svg" type="image/svg+xml">${noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`}${!noindex && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<meta property="og:type" content="website"><meta property="og:site_name"${addAttribute(convention.church, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:image"${addAttribute(shareImage, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#0b0d1a">` })}`}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600..900&display=swap">${renderSlot($$result, $$slots["head"])}${renderHead($$result)}</head><body data-astro-cid-hkbrpulz><a href="#main" class="skip" data-astro-cid-hkbrpulz>Skip to content</a>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/layouts/Base.astro", void 0);
//#endregion
export { $$Base as t };
