//#region src/lib/auth.ts
var COOKIE = "mcgc_admin";
var MAX_AGE_DAYS = 14;
function secret() {
	throw new Error("ADMIN_PASSWORD is not set. See .env.example.");
}
async function sign(issuedAt) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(issuedAt));
	return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function timingSafeEqual(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}
function checkPassword(submitted) {
	return false;
}
async function createSession(cookies) {
	const issuedAt = Date.now().toString();
	const value = `${issuedAt}.${await sign(issuedAt)}`;
	cookies.set(COOKIE, value, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: true,
		maxAge: 1209600
	});
}
async function isAuthenticated(cookies) {
	const raw = cookies.get(COOKIE)?.value;
	if (!raw) return false;
	const [issuedAt, mac] = raw.split(".");
	if (!issuedAt || !mac) return false;
	const age = Date.now() - Number(issuedAt);
	if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_DAYS * 864e5) return false;
	try {
		return timingSafeEqual(mac, await sign(issuedAt));
	} catch {
		return false;
	}
}
function destroySession(cookies) {
	cookies.delete(COOKIE, { path: "/" });
}
//#endregion
export { isAuthenticated as i, createSession as n, destroySession as r, checkPassword as t };
