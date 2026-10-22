import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Create account
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Registration will insert into <code className="text-sm">users</code> with
        a password hash — UI stub for now.
      </p>
      <form className="mt-8 space-y-4">
        <label className="block text-sm font-medium">
          Display name
          <input
            name="displayName"
            type="text"
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
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
          type="button"
          className="w-full rounded-sm bg-signal px-4 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal-deep"
        >
          Sign up (stub)
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-semibold text-signal">
          Sign in
        </Link>
      </p>
    </div>
  );
}
