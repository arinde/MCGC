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

    // Postgres 42P01 = undefined_table. Almost always means schema.sql hasn't
    // been re-run since the volunteers table was added, so say that outright
    // instead of hiding it behind a generic failure.
    const code = (error as { code?: string })?.code;
    if (code === "42P01") {
      return json(
        {
          errors: [
            {
              field: "",
              message:
                "Sign-ups aren’t set up yet on the server. Please call the convention desk instead.",
            },
          ],
          setup: "The `volunteers` table is missing. Re-run supabase/schema.sql in the Supabase SQL editor.",
        },
        503,
      );
    }

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
