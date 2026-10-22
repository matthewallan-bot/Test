import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@/lib/auth";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tour", label: "Tour" },
  { href: "/merch", label: "Merch" },
  { href: "/music", label: "Music" },
  { href: "/socials", label: "Socials" },
];

export async function SiteHeader() {
  // Auth.js reads cookies / uses crypto during session resolution. With Cache
  // Components this must be request-time so prerender does not trip
  // blocking-prerender-crypto (layout already wraps this in <Suspense>).
  await connection();
  const session = await auth();

  return (
    <header className="relative z-20 border-b border-ink/10 bg-paper/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.04em] text-ink md:text-xl"
        >
          Fixed Reaction
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 text-sm font-medium text-ink-soft md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-signal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link href="/cart" className="text-ink-soft hover:text-signal">
            Cart
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/account/profile"
                className="text-ink-soft hover:text-signal"
              >
                Account
              </Link>
              <Link
                href="/auth/sign-out"
                className="rounded-sm bg-ink px-3 py-1.5 text-paper transition-colors hover:bg-signal"
              >
                Sign out
              </Link>
            </>
          ) : (
            <Link
              href="/auth/sign-in"
              className="rounded-sm bg-ink px-3 py-1.5 text-paper transition-colors hover:bg-signal"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
      <nav
        aria-label="Mobile"
        className="flex gap-3 overflow-x-auto border-t border-ink/10 px-4 py-2 text-xs font-medium text-ink-soft md:hidden"
      >
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
