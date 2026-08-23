import QRCode from "qrcode";

/**
 * Attendee passes.
 *
 * The QR encodes the pass URL rather than the bare code, so a normal phone
 * camera opens the pass page — the attendee doesn't need our scanner to use it.
 * Our scanner reads the same URL and pulls the code back out.
 */

/** Codes are 6 characters from the no-vowel, no-lookalike alphabet in supabase.ts. */
const CODE_PATTERN = /^[23456789BCDFGHJKLMNPQRSTVWXYZ]{6}$/;

export function isValidCode(value: string): boolean {
  return CODE_PATTERN.test(value);
}

export function passUrl(code: string, site: URL | string): string {
  return new URL(`/pass/${code}`, site).href;
}

/**
 * Pulls a code out of whatever the scanner read. Accepts a full pass URL, a
 * bare code, or a code someone typed in lowercase — an usher at the gate should
 * not have to care which.
 */
export function extractCode(scanned: string): string | null {
  const raw = scanned.trim();
  if (!raw) return null;

  const candidate = raw.includes("/") ? (raw.split(/[/?#]/).filter(Boolean).pop() ?? "") : raw;
  const normalised = candidate.toUpperCase();

  return isValidCode(normalised) ? normalised : null;
}

/**
 * QR as an inline SVG string. SVG rather than PNG so it stays sharp on any
 * screen and adds roughly a kilobyte instead of an image request.
 */
export async function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    // Rendered into a sized container, so the intrinsic width is arbitrary.
    width: 320,
    color: { dark: "#0b0d1a", light: "#ffffff" },
  });
}
