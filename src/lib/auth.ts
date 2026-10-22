import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js stub — wire Credentials (or magic link / OAuth) to `users` /
 * `sessions` tables once Neon is connected. No real password verification yet.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        if (typeof email !== "string" || !email.includes("@")) {
          return null;
        }
        // Stub: accept any email/password pair for local UI smoke tests only.
        // Replace with password_hash verification against Postgres.
        return {
          id: "stub-user",
          email,
          name: email.split("@")[0] ?? "Fan",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
