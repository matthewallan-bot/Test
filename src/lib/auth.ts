import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createHash, randomUUID } from "node:crypto";
import { authConfig } from "@/lib/auth.config";
import { isDatabaseConfigured, query } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

type DbUser = {
  id: string;
  email: string;
  password_hash: string | null;
  display_name: string | null;
  role: string;
};

async function findUserByEmail(email: string): Promise<DbUser | null> {
  if (!isDatabaseConfigured()) return null;
  const result = await query<DbUser>(
    `SELECT id, email::text AS email, password_hash, display_name, role::text AS role
     FROM users WHERE email = $1`,
    [email.toLowerCase()],
  );
  return result.rows[0] ?? null;
}

/** Persist a session row for audit / future revocation (JWT is the live session). */
async function persistSessionRow(userId: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  const token = randomUUID();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt.toISOString()],
  );
}

/**
 * Auth.js credentials against hashed passwords in `users`.
 * Requires DATABASE_URL + seeded/registered users. Sessions use JWT cookies;
 * a matching row is also written to `sessions` on successful sign-in.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }
        if (!email.includes("@") || password.length < 1) {
          return null;
        }
        if (!isDatabaseConfigured()) {
          console.error(
            "[auth] DATABASE_URL is not set — cannot verify credentials",
          );
          return null;
        }

        const user = await findUserByEmail(email);
        if (!user?.password_hash) return null;

        const ok = await verifyPassword(password, user.password_hash);
        if (!ok) return null;

        try {
          await persistSessionRow(user.id);
        } catch (err) {
          console.error("[auth] session persist failed", err);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.display_name ?? user.email.split("@")[0] ?? "Fan",
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
