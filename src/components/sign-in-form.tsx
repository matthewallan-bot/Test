"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signInAction, type AuthFormState } from "@/app/auth/actions";

const initial: AuthFormState = {};

export function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account/profile";
  const [state, formAction, pending] = useActionState(signInAction, initial);

  return (
    <>
      <form className="mt-8 space-y-4" action={formAction}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
            autoComplete="current-password"
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
        {state.error ? <p className="text-sm text-signal">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-sm bg-ink px-4 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
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
    </>
  );
}
