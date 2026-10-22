import { signOutAction } from "@/app/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal"
      >
        Sign out
      </button>
    </form>
  );
}
