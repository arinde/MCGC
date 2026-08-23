import type { AstroCookies } from "astro";
import { env } from "./env";

/**
 * Dashboard authentication: one shared password.
 *
 * The cookie holds an HMAC of the issue-time, signed with ADMIN_PASSWORD, so
 * the password itself is never stored in the cookie and changing it instantly
 * invalidates every session already out there.
 *
 * Nothing here throws. A missing ADMIN_PASSWORD fails closed (nobody gets in)
 * rather than crashing the serverless function with a 500.
 */

const COOKIE = "mcgc_admin";
const MAX_AGE_DAYS = 14;

async function sign(issuedAt: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(issuedAt));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compares in time independent of how many characters match. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isPasswordConfigured(): boolean {
  return Boolean(env.adminPassword);
}

export function checkPassword(submitted: string): boolean {
  const expected = env.adminPassword;
  if (!expected) return false;
  return timingSafeEqual(submitted, expected);
}

/** Returns false if the session could not be created, rather than throwing. */
export async function createSession(cookies: AstroCookies): Promise<boolean> {
  const secret = env.adminPassword;
  if (!secret) return false;

  try {
    const issuedAt = Date.now().toString();
    const value = `${issuedAt}.${await sign(issuedAt, secret)}`;

    cookies.set(COOKIE, value, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
    });
    return true;
  } catch (error) {
    console.error("[auth] could not create session:", error);
    return false;
  }
}

export async function isAuthenticated(cookies: AstroCookies): Promise<boolean> {
  const secret = env.adminPassword;
  if (!secret) return false;

  const raw = cookies.get(COOKIE)?.value;
  if (!raw) return false;

  const [issuedAt, mac] = raw.split(".");
  if (!issuedAt || !mac) return false;

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_DAYS * 86_400_000) return false;

  try {
    return timingSafeEqual(mac, await sign(issuedAt, secret));
  } catch {
    return false;
  }
}

export function destroySession(cookies: AstroCookies): void {
  cookies.delete(COOKIE, { path: "/" });
}

/**
 * Throttles password guesses per IP. The shared password is short, and the
 * dashboard holds people's phone numbers — without this, a public URL is
 * brute-forceable in minutes.
 *
 * In-memory, so it resets when the function cold-starts. That is fine here:
 * it blunts sustained guessing, which is what matters, without adding a
 * database round-trip to every login.
 */
const attempts = new Map<string, { count: number; first: number }>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function rateLimit(ip: string): { allowed: boolean; retryInMinutes: number } {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now - record.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return { allowed: true, retryInMinutes: 0 };
  }

  record.count += 1;

  if (record.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryInMinutes: Math.max(1, Math.ceil((WINDOW_MS - (now - record.first)) / 60_000)),
    };
  }

  return { allowed: true, retryInMinutes: 0 };
}

/** Clears the counter after a correct password, so one typo doesn't linger. */
export function clearRateLimit(ip: string): void {
  attempts.delete(ip);
}
