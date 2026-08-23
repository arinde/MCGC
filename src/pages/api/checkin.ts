import type { APIRoute } from "astro";
import { getSupabase, logActivity } from "../../lib/supabase";
import { isAuthenticated } from "../../lib/auth";
import { dayLabels } from "../../data/convention";
import { extractCode } from "../../lib/pass";

// Writes a check-in behind auth.
export const prerender = false;

type Body = {
  /** From the search list. */
  registrationId?: string;
  /** From the scanner — a pass URL or a bare code. */
  scanned?: string;
  dayLabel?: string;
  partySize?: number;
};

const json = (body: unknown, status = 200) => Response.json(body, { status });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isAuthenticated(cookies))) {
    return json({ error: "Unauthorised" }, 401);
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  const { dayLabel } = body;
  if (!dayLabel || !dayLabels.includes(dayLabel)) {
    return json({ error: "Unknown night" }, 400);
  }

  const supabase = getSupabase();

  // Resolve whichever identifier we were given to one registration.
  let registration: { id: string; name: string; party_size: number } | null = null;

  if (body.scanned) {
    const code = extractCode(body.scanned);
    if (!code) {
      return json({ error: "That code isn’t one of ours.", reason: "unreadable" }, 422);
    }

    const { data } = await supabase
      .from("registrations")
      .select("id, name, party_size")
      .eq("code", code)
      .maybeSingle();

    if (!data) {
      return json({ error: `No registration found for ${code}.`, reason: "not_found" }, 404);
    }
    registration = data;
  } else if (body.registrationId) {
    const { data } = await supabase
      .from("registrations")
      .select("id, name, party_size")
      .eq("id", body.registrationId)
      .maybeSingle();

    if (!data) {
      return json({ error: "That registration no longer exists.", reason: "not_found" }, 404);
    }
    registration = data;
  } else {
    return json({ error: "Nothing to check in" }, 400);
  }

  const partySize = Math.max(1, Math.min(Number(body.partySize) || registration.party_size || 1, 50));

  const { error } = await supabase
    .from("checkins")
    .insert({ registration_id: registration.id, day_label: dayLabel, party_size: partySize });

  if (error) {
    // 23505 = unique violation. Scanning the same pass twice is routine at a
    // gate, so report it as a state, not a failure.
    if (error.code === "23505") {
      return json({
        ok: true,
        alreadyCheckedIn: true,
        name: registration.name,
        partySize,
      });
    }
    console.error("[checkin] failed:", error);
    return json({ error: "Could not check in" }, 500);
  }

  await logActivity("checkin", `${registration.name} checked in for ${dayLabel}`, {
    party_size: partySize,
  });

  return json({ ok: true, alreadyCheckedIn: false, name: registration.name, partySize });
};
