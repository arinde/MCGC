import type { APIRoute } from "astro";
import { loadForExport, readFilters, hasFilters, type PeopleFilters } from "../../lib/people";
import { logActivity } from "../../lib/supabase";

// Streams live data; the middleware has already checked auth.
export const prerender = false;

const HEADERS = [
  "Name",
  "Phone",
  "Email",
  "Branch",
  "Party size",
  "Bringing",
  "Nights booked",
  "Needs",
  "Checked in for",
  "Notes",
  "Code",
  "Registered at",
];

/**
 * Excel treats a leading =, +, - or @ as a formula, which turns a malicious
 * name into a live cell. Prefixing with an apostrophe keeps it text.
 */
function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Names the file after what's actually in it, so downloads don't all collide. */
function describe(filters: PeopleFilters): string {
  if (!hasFilters(filters)) return "all";

  const parts = [
    filters.flag,
    filters.day,
    filters.branch,
    filters.attendance,
    filters.search && `search-${filters.search}`,
  ].filter(Boolean) as string[];

  return (
    parts
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "filtered"
  );
}

export const GET: APIRoute = async ({ url }) => {
  const filters = readFilters(url.searchParams);

  try {
    const people = await loadForExport(filters);

    const rows = people.map((person) =>
      [
        person.name,
        person.phone,
        person.email,
        person.branch,
        person.party_size,
        (person.guest_names ?? []).join(" / "),
        person.days.join(" / "),
        person.flags.join(" / "),
        person.attendedDays.join(" / "),
        person.notes,
        person.code,
        new Date(person.created_at).toISOString(),
      ]
        .map(csvCell)
        .join(","),
    );

    // The BOM makes Excel open UTF-8 correctly on Windows.
    const csv = "﻿" + [HEADERS.map(csvCell).join(","), ...rows].join("\r\n");

    const slug = describe(filters);
    const filename = `mcgc-register-${slug}-${new Date().toISOString().slice(0, 10)}.csv`;

    await logActivity("export", `Exported the "${slug}" list (${people.length} rows)`);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[export] failed:", error);
    return new Response("Export failed", { status: 500 });
  }
};
