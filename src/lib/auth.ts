import type { AstroCookies } from "astro";

/**
 * Dashboard authentication: one shared password.
 *
 * The cookie holds an HMAC of the issue-time, signed with ADMIN_PASSWORD.
 * That means we never store the password itself in the cookie, and changing
 * ADMIN_PASSWORD instantly invalidates every session already out there.
 */

const COOKIE = "mcgc_admin";
const MAX_AGE_DAYS = 14;

function secret(): string {
  const pw = import.meta.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD is not set. See .env.example.");
  return pw;
}

async function sign(issuedAt: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(issuedAt));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Compares two strings in time independent of how many characters match,
 * so an attacker can't discover the password one byte at a time.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkPassword(submitted: string): boolean {
  const expected = import.meta.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(submitted, expected);
}

export async function createSession(cookies: AstroCookies): Promise<void> {
  const issuedAt = Date.now().toString();
  const value = `${issuedAt}.${await sign(issuedAt)}`;

  cookies.set(COOKIE, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export async function isAuthenticated(cookies: AstroCookies): Promise<boolean> {
  const raw = cookies.get(COOKIE)?.value;
  if (!raw) return false;

  const [issuedAt, mac] = raw.split(".");
  if (!issuedAt || !mac) return false;

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_DAYS * 86_400_000) return false;

  try {
    return timingSafeEqual(mac, await sign(issuedAt));
  } catch {
    // ADMIN_PASSWORD missing — fail closed rather than letting anyone through.
    return false;
  }
}

export function destroySession(cookies: AstroCookies): void {
  cookies.delete(COOKIE, { path: "/" });
}
