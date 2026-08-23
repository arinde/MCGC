import type { APIRoute } from "astro";
import { getSupabase, logActivity } from "../../lib/supabase";
import { isAuthenticated } from "../../lib/auth";
import { dayLabels } from "../../data/convention";

// Writes a check-in behind auth.
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isAuthenticated(cookies))) {
    return new Response("Unauthorised", { status: 401 });
  }

  let body: { registrationId?: string; dayLabel?: string; partySize?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const { registrationId, dayLabel } = body;

  if (!registrationId || !dayLabel || !dayLabels.includes(dayLabel)) {
    return Response.json({ error: "Unknown registration or night" }, { status: 400 });
  }

  const supabase = getSupabase();
  const partySize = Math.max(1, Math.min(Number(body.partySize) || 1, 50));

  const { data, error } = await supabase
    .from("checkins")
    .insert({ registration_id: registrationId, day_label: dayLabel, party_size: partySize })
    .select("id")
    .single();

  if (error) {
    // 23505 = unique violation: they were already checked in for this night.
    // Two ushers tapping at once is normal, not an error worth showing.
    if (error.code === "23505") {
      return Response.json({ ok: true, alreadyCheckedIn: true });
    }
    console.error("[checkin] failed:", error);
    return Response.json({ error: "Could not check in" }, { status: 500 });
  }

  const { data: registration } = await supabase
    .from("registrations")
    .select("name")
    .eq("id", registrationId)
    .single();

  await logActivity("checkin", `${registration?.name ?? "Someone"} checked in for ${dayLabel}`, {
    party_size: partySize,
  });

  return Response.json({ ok: true, id: data.id });
};
