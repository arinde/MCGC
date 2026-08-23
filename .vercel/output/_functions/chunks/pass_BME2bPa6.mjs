import QRCode from "qrcode";
//#region src/lib/pass.ts
/**
* Attendee passes.
*
* The QR encodes the pass URL rather than the bare code, so a normal phone
* camera opens the pass page — the attendee doesn't need our scanner to use it.
* Our scanner reads the same URL and pulls the code back out.
*/
/** Codes are 6 characters from the no-vowel, no-lookalike alphabet in supabase.ts. */
var CODE_PATTERN = /^[23456789BCDFGHJKLMNPQRSTVWXYZ]{6}$/;
function isValidCode(value) {
	return CODE_PATTERN.test(value);
}
function passUrl(code, site) {
	return new URL(`/pass/${code}`, site).href;
}
/**
* Pulls a code out of whatever the scanner read. Accepts a full pass URL, a
* bare code, or a code someone typed in lowercase — an usher at the gate should
* not have to care which.
*/
function extractCode(scanned) {
	const raw = scanned.trim();
	if (!raw) return null;
	const normalised = (raw.includes("/") ? raw.split(/[/?#]/).filter(Boolean).pop() ?? "" : raw).toUpperCase();
	return isValidCode(normalised) ? normalised : null;
}
/**
* QR as an inline SVG string. SVG rather than PNG so it stays sharp on any
* screen and adds roughly a kilobyte instead of an image request.
*/
async function qrSvg(text) {
	return QRCode.toString(text, {
		type: "svg",
		errorCorrectionLevel: "M",
		margin: 1,
		width: 320,
		color: {
			dark: "#0b0d1a",
			light: "#ffffff"
		}
	});
}
//#endregion
export { qrSvg as i, isValidCode as n, passUrl as r, extractCode as t };
