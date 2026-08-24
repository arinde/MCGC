import { branches, type Branch } from "../data/convention";

/**
 * Branch names, resolved to the canonical list in convention.ts.
 *
 * The forms offer a dropdown, so new sign-ups arrive clean. Two things still
 * need resolving:
 *
 *   1. Rows saved before the dropdown existed — "Igbe", "igbe branch",
 *      "Igbe Alagemo" are all one place typed three ways, and the dashboard
 *      counted them as three branches.
 *   2. The "Other" option, which stays free text on purpose so a visitor from
 *      another church can say where they've come from. Those values are tidied
 *      but never forced into a branch they don't belong to.
 */

/**
 * The dropdown value meaning "somewhere not on the list".
 *
 * Never stored: the server swaps it for whatever the person typed, so the
 * database only ever holds real place names.
 */
export const OTHER_BRANCH = "__other";

/** Decorative suffixes people add. "Ayetoro branch" and "Ayetoro" are one place. */
const SUFFIXES = ["branch", "assembly", "parish", "district", "centre", "center", "church"];

/** Kept upper-case: these are initialisms, not words. */
const INITIALISMS = new Set(["MCGC", "CAC", "RCCG", "MFM", "CCC", "TREM", "HQ"]);

/**
 * Spellings that mean a branch on the canonical list.
 *
 * `igbe alagemo` maps to Igbe HQ because the headquarters sits on Majiyagbe
 * Street, Igbe Alagemo — people write the district instead of the branch. If
 * Igbe Alagemo is in fact a separate congregation, delete that one line and it
 * becomes its own group again; nothing else depends on it.
 *
 * Keys are compared after tidying, so they are lower-case and suffix-free.
 */
const ALIASES: Record<string, Branch> = {
  igbe: "Igbe HQ",
  "igbe hq": "Igbe HQ",
  "igbe alagemo": "Igbe HQ",
  hq: "Igbe HQ",
  headquarters: "Igbe HQ",
  "head office": "Igbe HQ",
  majiyagbe: "Igbe HQ",
  "ori oke majiyagbe": "Igbe HQ",
  "ori oke": "Igbe HQ",
  ayetoro: "Ayetoro",
  ikorodu: "Ikorodu",
  weighbridge: "Weighbridge",
  "weigh bridge": "Weighbridge",
};

/** Lower-cased mid-name: "City of David", not "City Of David". */
const MINOR_WORDS = new Set(["of", "the", "and", "at", "on", "in", "for", "de", "la"]);

function titleCaseWord(word: string, index: number): string {
  const upper = word.toUpperCase();
  if (INITIALISMS.has(upper)) return upper;
  // A word already mixed-case ("McCarthy", "OluwaSeun") is left as the person
  // typed it — re-casing it would be a downgrade, not a tidy-up.
  if (/[a-z]/.test(word) && /[A-Z]/.test(word.slice(1))) return word;

  const lower = word.toLowerCase();
  if (index > 0 && MINOR_WORDS.has(lower)) return lower;

  return word.charAt(0).toUpperCase() + lower.slice(1);
}

/** Whitespace, casing and decoration only. No opinion about what the name means. */
function tidy(raw: string): string {
  let value = raw.trim().replace(/\s+/g, " ");
  if (!value) return "";

  // "MCGC Ayetoro" is just "Ayetoro" — every branch here is MCGC.
  value = value.replace(/^mcgc[\s,-]+/i, "").trim();

  // Strip one trailing decoration, not all of them.
  const words = value.split(" ");
  if (words.length > 1 && SUFFIXES.includes(words[words.length - 1].toLowerCase())) {
    words.pop();
  }

  return words.join(" ").replace(/[.,;]+$/, "").trim();
}

/**
 * Canonical branch name, or the tidied free text for anywhere not on the list.
 * Returns "" for nothing usable, so callers can choose between "Not stated"
 * and omitting the row.
 */
export function normaliseBranch(raw: string | null | undefined): string {
  if (!raw) return "";

  const cleaned = tidy(raw);
  if (!cleaned) return "";

  const key = cleaned.toLowerCase();

  const alias = ALIASES[key];
  if (alias) return alias;

  const canonical = branches.find((branch) => branch.toLowerCase() === key);
  if (canonical) return canonical;

  // Somewhere we don't know — a visitor's own church. Keep it, tidied.
  return cleaned.split(" ").map(titleCaseWord).join(" ");
}

/**
 * Picks between the dropdown and the "Other" text box.
 *
 * Anything unrecognised falls through to the free text, so a stale cached form
 * posting an old value can't wipe someone's branch.
 */
export function resolveBranch(
  branch: string | undefined,
  branchOther: string | undefined,
): string {
  const chosen = (branch ?? "").trim();

  if (chosen === OTHER_BRANCH || chosen === "") {
    return normaliseBranch(branchOther);
  }

  return normaliseBranch(chosen);
}

/** True when the value is one of the convention's own branches. */
export function isKnownBranch(value: string): value is Branch {
  return (branches as readonly string[]).includes(value);
}

/** What the dashboard shows when someone left the field blank. */
export const UNSTATED = "Not stated";

/** Normalised name, or the "Not stated" placeholder. Use for grouping and display. */
export function branchLabel(raw: string | null | undefined): string {
  return normaliseBranch(raw) || UNSTATED;
}
