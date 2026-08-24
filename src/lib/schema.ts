import { getSupabase } from "./supabase";

/**
 * What the live database actually supports.
 *
 * Columns get added to `supabase/schema.sql` between deployments, but the SQL
 * has to be run by hand in the Supabase dashboard. Between a deploy and that
 * run, the code is ahead of the database.
 *
 * PostgREST fails an entire query if you name a column that doesn't exist —
 * so on a database that hasn't caught up, selecting `guest_names` would take
 * down the dashboard and inserting it would break registration itself. Probing
 * once and degrading is the difference between a missing column and an outage
 * during the convention.
 */

const BASE_REGISTRATION_COLUMNS =
  "id, code, name, phone, email, branch, guests_label, party_size, days, flags, source, notes, created_at";

/** null = not yet probed. Cached for the life of the server process. */
let guestNames: boolean | null = null;

export async function hasGuestNames(): Promise<boolean> {
  if (guestNames === null) {
    const { error } = await getSupabase().from("registrations").select("guest_names").limit(1);
    guestNames = !error;

    if (error) {
      console.warn(
        "[schema] registrations.guest_names is missing. Re-run supabase/schema.sql to " +
          "start recording who each person is bringing.",
      );
    }
  }

  return guestNames;
}

/** The column list to select, narrowed to what this database has. */
export async function registrationColumns(): Promise<string> {
  return (await hasGuestNames())
    ? `${BASE_REGISTRATION_COLUMNS}, guest_names`
    : BASE_REGISTRATION_COLUMNS;
}
