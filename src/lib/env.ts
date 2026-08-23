/**
 * Runtime environment access.
 *
 * Astro statically replaces `import.meta.env.X` at build time. On a serverless
 * host the secrets only exist at request time, so a build-time reference can
 * compile to `undefined` and blow up inside the function. `process.env` is read
 * live, so we check it first and fall back to the build-time value for `astro dev`.
 *
 * Every server secret must be read through here — never `import.meta.env` directly.
 */

function read(name: string): string | undefined {
  const runtime = typeof process !== "undefined" ? process.env?.[name] : undefined;
  const build = (import.meta.env as Record<string, string | undefined>)[name];
  const value = runtime ?? build;
  return value && value.length > 0 ? value : undefined;
}

export const env = {
  get supabaseUrl() {
    return read("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return read("SUPABASE_SERVICE_ROLE_KEY");
  },
  get adminPassword() {
    return read("ADMIN_PASSWORD");
  },
  get siteUrl() {
    return read("PUBLIC_SITE_URL");
  },
};

/** Which required variables are missing — powers the dashboard's setup notice. */
export function missingEnv(): string[] {
  const required: Record<string, string | undefined> = {
    SUPABASE_URL: env.supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: env.supabaseServiceRoleKey,
    ADMIN_PASSWORD: env.adminPassword,
  };

  return Object.entries(required)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}
