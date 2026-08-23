import { C as renderSlot, D as maybeRenderHead, E as renderTemplate, I as createAstro, _ as spreadAttributes, k as addAttribute } from "./sequence_cgC9RwYc.mjs";
import { t as createComponent } from "./compiler_CQKGis8q.mjs";
//#region src/components/Button.astro
createAstro("https://majiyagbe-convention.vercel.app");
var $$Button = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Button;
	const { href, variant = "gold", size = "md", type = "button", id, class: className = "", external = false } = Astro.props;
	const classes = [
		"btn",
		`btn--${variant}`,
		size === "sm" && "btn--sm",
		className
	].filter(Boolean).join(" ");
	const externalAttrs = external ? {
		target: "_blank",
		rel: "noopener noreferrer"
	} : {};
	return renderTemplate`${href ? renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(id, "id")}${addAttribute(classes, "class")}${spreadAttributes(externalAttrs)} data-astro-cid-ekguhzzh>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(id, "id")}${addAttribute(classes, "class")} data-astro-cid-ekguhzzh>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "C:/Users/ADEDAMOLA/Desktop/MCGC/src/components/Button.astro", void 0);
//#endregion
export { $$Button as t };
