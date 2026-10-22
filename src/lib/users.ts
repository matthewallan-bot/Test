import { isDatabaseConfigured, query } from "@/lib/db";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string | null;
  role: string;
};

/** Load profile fields from `users` for the signed-in account. */
export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  if (!isDatabaseConfigured()) return null;

  const result = await query<{
    id: string;
    email: string;
    display_name: string | null;
    role: string;
  }>(
    `SELECT id, email::text AS email, display_name, role::text AS role
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId],
  );
  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
  };
}
