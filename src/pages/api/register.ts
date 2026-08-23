import type { APIRoute } from "astro";
import { createRegistration, type RegistrationInput } from "../../lib/registrations";
import { isConfigured } from "../../lib/supabase";

// Writes to the database, so this cannot be prerendered.
export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  if (!isConfigured()) {
    return json(
      { errors: [{ field: "", message: "Registration isn’t switched on yet. Please try later." }] },
      503,
    );
  }

  let input: RegistrationInput;
  try {
    input = (await request.json()) as RegistrationInput;
  } catch {
    return json({ errors: [{ field: "", message: "That request didn’t come through." }] }, 400);
  }

  try {
    const result = await createRegistration(input);

    if (!result.ok) {
      return json({ errors: result.errors }, 422);
    }

    // Only what the confirmation UI needs — never echo the whole row back.
    return json({
      code: result.registration.code,
      name: result.registration.name,
      days: result.registration.days,
      alreadyRegistered: result.alreadyRegistered,
    });
  } catch (error) {
    console.error("[register] failed:", error);
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
