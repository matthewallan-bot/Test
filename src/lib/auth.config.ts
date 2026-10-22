import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Node-only imports).
 * Used by middleware; full credentials provider lives in auth.ts.
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/auth/sign-in",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/account")) {
        return !!auth?.user;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        (session.user as { role?: string }).role =
          (token.role as string) ?? "customer";
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
