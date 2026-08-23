import type { APIRoute } from "astro";
import { createVolunteer, type VolunteerInput } from "../../lib/volunteers";
import { isConfigured } from "../../lib/supabase";

// Writes to the database.
export const prerender = false;

const json = (body: unknown, status = 200) => Response.json(body, { status });

export const POST: APIRoute = async ({ request }) => {
  if (!isConfigured()) {
    return json(
      { errors: [{ field: "", message: "Sign-ups aren’t switched on yet. Please try later." }] },
      503,
    );
  }

  let input: VolunteerInput;
  try {
    input = (await request.json()) as VolunteerInput;
  } catch {
    return json({ errors: [{ field: "", message: "That request didn’t come through." }] }, 400);
  }

  try {
    const result = await createVolunteer(input);
    if (!result.ok) return json({ errors: result.errors }, 422);

    return json({
      name: result.name,
      teams: result.teams,
      alreadySignedUp: result.alreadySignedUp,
    });
  } catch (error) {
    console.error("[volunteer] failed:", error);
    return json(
      {
        errors: [
          {
            field: "",
            message: "We couldn’t save that. Please try again, or call the convention desk.",
          },
        ],
      },
      500,
    );
  }
};
