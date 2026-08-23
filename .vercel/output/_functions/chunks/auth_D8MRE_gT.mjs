import { t as env } from "./env_X662t_9j.mjs";
//#region src/lib/auth.ts
var COOKIE = "mcgc_admin";
var MAX_AGE_DAYS = 14;
async function sign(issuedAt, secret) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
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
function isPasswordConfigured() {
	return Boolean(env.adminPassword);
}
function checkPassword(submitted) {
	const expected = env.adminPassword;
	if (!expected) return false;
	return timingSafeEqual(submitted, expected);
}
async function createSession(cookies) {
	const secret = env.adminPassword;
	if (!secret) return false;
	try {
		const issuedAt = Date.now().toString();
		const value = `${issuedAt}.${await sign(issuedAt, secret)}`;
		cookies.set(COOKIE, value, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			maxAge: 1209600
		});
		return true;
	} catch (error) {
		console.error("[auth] could not create session:", error);
		return false;
	}
}
async function isAuthenticated(cookies) {
	const secret = env.adminPassword;
	if (!secret) return false;
	const raw = cookies.get(COOKIE)?.value;
	if (!raw) return false;
	const [issuedAt, mac] = raw.split(".");
	if (!issuedAt || !mac) return false;
	const age = Date.now() - Number(issuedAt);
	if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_DAYS * 864e5) return false;
	try {
		return timingSafeEqual(mac, await sign(issuedAt, secret));
	} catch {
		return false;
	}
}
function destroySession(cookies) {
	cookies.delete(COOKIE, { path: "/" });
}
var attempts = /* @__PURE__ */ new Map();
var WINDOW_MS = 6e5;
var MAX_ATTEMPTS = 8;
function rateLimit(ip) {
	const now = Date.now();
	const record = attempts.get(ip);
	if (!record || now - record.first > WINDOW_MS) {
		attempts.set(ip, {
			count: 1,
			first: now
		});
		return {
			allowed: true,
			retryInMinutes: 0
		};
	}
	record.count += 1;
	if (record.count > MAX_ATTEMPTS) return {
		allowed: false,
		retryInMinutes: Math.max(1, Math.ceil((WINDOW_MS - (now - record.first)) / 6e4))
	};
	return {
		allowed: true,
		retryInMinutes: 0
	};
}
function clearRateLimit(ip) {
	attempts.delete(ip);
}
//#endregion
export { isAuthenticated as a, destroySession as i, clearRateLimit as n, isPasswordConfigured as o, createSession as r, rateLimit as s, checkPassword as t };
