import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/users";

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
        Display name and email from your account (database when configured,
        otherwise the signed-in session).
      </p>
      <Suspense
        fallback={
          <dl className="mt-8 space-y-4 border border-ink/15 bg-paper/70 p-5 text-ink-soft">
            Loading profile…
          </dl>
        }
      >
        <ProfileBody />
      </Suspense>
      <Link
        href="/account/orders"
        className="mt-6 inline-flex text-sm font-semibold text-signal hover:text-signal-deep"
      >
        Order history →
      </Link>
    </div>
  );
}

async function ProfileBody() {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;
  const profile = userId ? await getUserProfile(userId) : null;

  const displayName =
    profile?.displayName ??
    session?.user?.name ??
    "—";
  const email = profile?.email ?? session?.user?.email ?? "—";
  const role = profile?.role ?? session?.user?.role ?? "customer";

  return (
    <dl className="mt-8 space-y-4 border border-ink/15 bg-paper/70 p-5">
      <div>
        <dt className="text-xs uppercase tracking-wide text-steel">Name</dt>
        <dd className="mt-1 text-ink">{displayName}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-steel">Email</dt>
        <dd className="mt-1 text-ink">{email}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-steel">Role</dt>
        <dd className="mt-1 text-ink">{role}</dd>
      </div>
    </dl>
  );
}
