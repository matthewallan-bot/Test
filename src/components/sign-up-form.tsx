"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction, type AuthFormState } from "@/app/auth/actions";

const initial: AuthFormState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initial);

  return (
    <>
      <form className="mt-8 space-y-4" action={formAction}>
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
            autoComplete="email"
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
        {state.error ? <p className="text-sm text-signal">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-sm bg-signal px-4 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal-deep disabled:opacity-60"
        >
          {pending ? "Creating…" : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-semibold text-signal">
          Sign in
        </Link>
      </p>
    </>
  );
}
