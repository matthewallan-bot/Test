import type { Metadata } from "next";
import { SignOutButton } from "./sign-out-button";

export const metadata: Metadata = {
  title: "Sign out",
};

export default function SignOutPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Sign out
      </h1>
      <p className="mt-2 text-sm text-ink-soft">End your session on this device.</p>
      <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
}
