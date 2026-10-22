import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign out",
};

export default function SignOutPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Sign out
      </h1>
      <p className="mt-3 text-ink-soft">
        POST to Auth.js sign-out when sessions are live.
      </p>
      <form action="/api/auth/signout" method="post" className="mt-6">
        <button
          type="submit"
          className="rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal"
        >
          Sign out
        </button>
      </form>
      <Link href="/" className="mt-4 inline-block text-sm text-steel hover:text-signal">
        Back home
      </Link>
    </div>
  );
}
