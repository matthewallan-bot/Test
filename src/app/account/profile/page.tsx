import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Account</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Profile
      </h1>
      <p className="mt-3 text-ink-soft">
        Display name, email, and default address stubs. Prefill from{" "}
        <code className="text-sm">users</code> /{" "}
        <code className="text-sm">addresses</code> once Auth.js sessions are live.
      </p>
      <dl className="mt-8 space-y-4 border border-ink/15 bg-paper/70 p-5">
        <div>
          <dt className="text-xs uppercase tracking-wide text-steel">Name</dt>
          <dd className="mt-1 text-ink">—</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-steel">Email</dt>
          <dd className="mt-1 text-ink">—</dd>
        </div>
      </dl>
      <Link
        href="/account/orders"
        className="mt-6 inline-flex text-sm font-semibold text-signal hover:text-signal-deep"
      >
        Order history →
      </Link>
    </div>
  );
}
