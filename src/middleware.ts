import { defineMiddleware } from "astro:middleware";
import { isAuthenticated } from "./lib/auth";

/**
 * Gates everything under /admin behind the shared password.
 *
 * Doing this in middleware rather than per-page means a new dashboard page is
 * protected the moment it's created — there is no way to forget the check.
 */
export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const isAdminArea = url.pathname.startsWith("/admin");
  const isLoginPage = url.pathname === "/admin/login";

  if (!isAdminArea || isLoginPage) return next();

  if (!(await isAuthenticated(cookies))) {
    // Remember where they were headed so login can send them back.
    const target = encodeURIComponent(url.pathname + url.search);
    return redirect(`/admin/login?next=${target}`, 302);
  }

  return next();
});
