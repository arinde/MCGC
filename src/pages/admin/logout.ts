import type { APIRoute } from "astro";
import { destroySession } from "../../lib/auth";

// Clears a cookie — server only.
export const prerender = false;

export const POST: APIRoute = ({ cookies, redirect }) => {
  destroySession(cookies);
  return redirect("/admin/login", 302);
};
