import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Auth.js credentials stub — wire to Postgres users next.
      </p>
      <form
        className="mt-8 space-y-4"
        action="/api/auth/callback/credentials"
        method="post"
      >
        <label className="block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-sm bg-ink px-4 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal"
        >
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-soft">
        New here?{" "}
        <Link href="/auth/sign-up" className="font-semibold text-signal">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        <Link href="/auth/forgot-password" className="text-steel hover:text-signal">
          Forgot password
        </Link>
      </p>
    </div>
  );
}
