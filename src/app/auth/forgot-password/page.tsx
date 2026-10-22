import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Reset password
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Optional Phase 1 flow — uses{" "}
        <code className="text-sm">password_reset_tokens</code>.
      </p>
      <form className="mt-8 space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
        <button
          type="button"
          className="rounded-sm bg-ink px-4 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal"
        >
          Send reset link (stub)
        </button>
      </form>
      <Link
        href="/auth/sign-in"
        className="mt-4 inline-block text-sm text-steel hover:text-signal"
      >
        Back to sign in
      </Link>
    </div>
  );
}
