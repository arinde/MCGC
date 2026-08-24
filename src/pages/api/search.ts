import type { APIRoute } from "astro";
import { getSupabase } from "../../lib/supabase";
import { normalisePhone } from "../../lib/registrations";
import { hasGuestNames } from "../../lib/schema";
import { isAuthenticated } from "../../lib/auth";

// Queries live data behind auth.
export const prerender = false;

const MAX_RESULTS = 12;

/** What the usher's search returns for each match. */
type Match = {
  id: string;
  name: string;
  phone: string;
  branch: string | null;
  code: string;
  party_size: number;
  guest_names?: string[];
};

/** `%` and `_` are wildcards in ILIKE; a name containing them must not widen the search. */
function escapeLikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

export const GET: APIRoute = async ({ url, cookies }) => {
  if (!(await isAuthenticated(cookies))) {
    return new Response("Unauthorised", { status: 401 });
  }

  const query = (url.searchParams.get("q") ?? "").trim();
  const dayLabel = url.searchParams.get("day") ?? "";

  if (query.length < 2) {
    return Response.json([]);
  }

  const supabase = getSupabase();
  const pattern = `%${escapeLikePattern(query)}%`;

  // Ushers search by whatever the person offers: name, the number they
  // registered with, or the code on their confirmation.
  const filters = [`name.ilike.${pattern}`, `code.ilike.${pattern}`];

  const phone = normalisePhone(query);
  if (phone.length >= 6) {
    filters.push(`phone.ilike.%${escapeLikePattern(phone)}%`);
  }

  // Typed as a plain string on purpose: supabase-js infers the row shape from
  // a literal select, and cannot parse one built at runtime. `guest_names` is
  // only named when the database actually has it — see src/lib/schema.ts.
  const columns: string = (await hasGuestNames())
    ? "id, name, phone, branch, code, party_size, guest_names"
    : "id, name, phone, branch, code, party_size";

  const { data, error } = await supabase
    .from("registrations")
    .select(columns)
    .or(filters.join(","))
    .limit(MAX_RESULTS);

  if (error) {
    console.error("[search] failed:", error);
    return Response.json([], { status: 500 });
  }

  const registrations = (data ?? []) as unknown as Match[];
  if (registrations.length === 0) return Response.json([]);

  const { data: checkins } = await supabase
    .from("checkins")
    .select("registration_id")
    .eq("day_label", dayLabel)
    .in(
      "registration_id",
      registrations.map((r) => r.id),
    );

  const alreadyIn = new Set((checkins ?? []).map((c) => c.registration_id));

  return Response.json(
    registrations.map((registration) => ({
      ...registration,
      checked_in: alreadyIn.has(registration.id),
    })),
  );
};
