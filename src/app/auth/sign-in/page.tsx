import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/sign-in-form";

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
        Credentials checked against hashed passwords in{" "}
        <code className="text-sm">users</code>.
      </p>
      <Suspense fallback={<p className="mt-8 text-ink-soft">Loading…</p>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
