import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as maybeRenderHead, E as renderTemplate, I as createAstro, P as unescapeHTML, b as renderComponent } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
import { t as renderScript } from "./script_BbaWhd6Z.mjs";
import { t as $$Base } from "./Base_bfGYQTWK.mjs";
import { a as convention, n as isConfigured, t as getSupabase } from "./supabase_DnnZyzMy.mjs";
import { t as $$Brand } from "./Brand_CNKY5Fga.mjs";
import { t as $$Button } from "./Button_DBgNkQE9.mjs";
import { i as qrSvg, n as isValidCode, r as passUrl } from "./pass_BME2bPa6.mjs";
//#region src/pages/pass/[code].astro
var _code__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Code,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://majiyagbe-convention.vercel.app");
var $$Code = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Code;
	const code = (Astro.params.code ?? "").toUpperCase();
	if (!isValidCode(code)) return Astro.redirect("/#register", 302);
	let registration = null;
	if (isConfigured()) {
		const { data } = await getSupabase().from("registrations").select("name, days, party_size").eq("code", code).maybeSingle();
		registration = data;
	}
	const url = passUrl(code, Astro.site ?? Astro.url);
	const qr = registration ? await qrSvg(url) : "";
	return renderTemplate`${renderComponent($$result, "Base", $$Base, {
		"title": registration ? `${registration.name}'s pass` : "Pass not found",
		"description": "Your pass for the Majiyagbe Convention 2026.",
		"noindex": true,
		"data-astro-cid-vwldfv5k": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="pass" data-astro-cid-vwldfv5k>${registration ? renderTemplate`<article class="card" data-astro-cid-vwldfv5k><header class="card__head" data-astro-cid-vwldfv5k>${renderComponent($$result, "Brand", $$Brand, {
		"href": "/",
		"size": "md",
		"data-astro-cid-vwldfv5k": true
	})}<p class="card__event" data-astro-cid-vwldfv5k>${convention.title} ${convention.year}</p></header><div class="card__qr" data-astro-cid-vwldfv5k>${unescapeHTML(qr)}</div><p class="card__code" data-astro-cid-vwldfv5k>${code}</p><p class="card__hint" data-astro-cid-vwldfv5k>Show this at the gate. If it won’t scan, read out the code.</p><dl class="card__details" data-astro-cid-vwldfv5k><div data-astro-cid-vwldfv5k><dt data-astro-cid-vwldfv5k>Name</dt><dd data-astro-cid-vwldfv5k>${registration.name}</dd></div><div data-astro-cid-vwldfv5k><dt data-astro-cid-vwldfv5k>Coming</dt><dd data-astro-cid-vwldfv5k>${registration.party_size === 1 ? "Just them" : `${registration.party_size} people`}</dd></div><div data-astro-cid-vwldfv5k><dt data-astro-cid-vwldfv5k>Days</dt><dd data-astro-cid-vwldfv5k>${registration.days.length ? registration.days.join(", ") : "Not stated"}</dd></div><div data-astro-cid-vwldfv5k><dt data-astro-cid-vwldfv5k>Venue</dt><dd data-astro-cid-vwldfv5k>${convention.venue.name}<span data-astro-cid-vwldfv5k>${convention.datesLabel}</span></dd></div></dl><div class="card__actions" data-astro-cid-vwldfv5k>${renderComponent($$result, "Button", $$Button, {
		"href": "/#venue",
		"variant": "ghost",
		"data-astro-cid-vwldfv5k": true
	}, { "default": ($$result) => renderTemplate`Getting there` })}${renderComponent($$result, "Button", $$Button, {
		"id": "share-pass",
		"variant": "ghost",
		"data-astro-cid-vwldfv5k": true
	}, { "default": ($$result) => renderTemplate`Share my pass` })}</div><p class="card__save" data-astro-cid-vwldfv5k>Screenshot this page — it works with no signal at the gate.</p></article>` : renderTemplate`<article class="card card--empty" data-astro-cid-vwldfv5k>${renderComponent($$result, "Brand", $$Brand, {
		"href": "/",
		"size": "md",
		"data-astro-cid-vwldfv5k": true
	})}<h1 class="display" data-astro-cid-vwldfv5k>We can’t find that pass.</h1><p data-astro-cid-vwldfv5k>The code <b data-astro-cid-vwldfv5k>${code}</b> isn’t in our records. It may have been typed wrongly, or the registration didn’t save.</p>${renderComponent($$result, "Button", $$Button, {
		"href": "/#register",
		"data-astro-cid-vwldfv5k": true
	}, { "default": ($$result) => renderTemplate`Register again` })}</article>`}</main>` })}${renderScript($$result, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/pass/[code].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/pass/[code].astro", void 0);
var $$file = "C:/Users/ADEDAMOLA/Desktop/MCGC/src/pages/pass/[code].astro";
var $$url = "/pass/[code]";
//#endregion
//#region \0virtual:astro:page:src/pages/pass/[code]@_@astro
var page = () => _code__exports;
//#endregion
export { page };
