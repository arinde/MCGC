import type { APIRoute } from "astro";
import { loadForExport } from "../../lib/stats";
import { logActivity } from "../../lib/supabase";

// Streams live data; the middleware has already checked auth.
export const prerender = false;

const HEADERS = [
  "Name",
  "Phone",
  "Email",
  "Branch",
  "Party size",
  "Nights",
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

export const GET: APIRoute = async ({ url }) => {
  const filter = url.searchParams.get("filter") ?? "all";

  try {
    const registrations = await loadForExport(filter);

    const rows = registrations.map((registration) =>
      [
        registration.name,
        registration.phone,
        registration.email,
        registration.branch,
        registration.party_size,
        registration.days.join(" / "),
        registration.flags.join(" / "),
        registration.code,
        new Date(registration.created_at).toISOString(),
      ]
        .map(csvCell)
        .join(","),
    );

    // The BOM makes Excel open UTF-8 correctly on Windows.
    const csv = "﻿" + [HEADERS.map(csvCell).join(","), ...rows].join("\r\n");

    const slug = filter === "all" ? "all" : filter.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const filename = `mcgc-registrations-${slug}-${new Date().toISOString().slice(0, 10)}.csv`;

    await logActivity("export", `Exported the "${filter}" list (${registrations.length} rows)`);

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
