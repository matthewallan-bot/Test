import type { Metadata } from "next";
import { SignUpForm } from "@/components/sign-up-form";

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
        Creates a <code className="text-sm">users</code> row with a bcrypt
        password hash (requires <code className="text-sm">DATABASE_URL</code>).
      </p>
      <SignUpForm />
    </div>
  );
}
