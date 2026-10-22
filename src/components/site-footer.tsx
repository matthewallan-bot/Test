import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
            Fixed Reaction
          </p>
          <p className="mt-2 max-w-sm text-sm text-ash-deep">
            Merch, free streams, and the road ahead.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-ash">
          <Link href="/music" className="hover:text-signal">
            Support the band
          </Link>
          <Link href="/socials" className="hover:text-signal">
            Socials
          </Link>
          <Link href="/tour" className="hover:text-signal">
            Tour
          </Link>
          <Link href="/account" className="hover:text-signal">
            Account
          </Link>
        </div>
      </div>
    </footer>
  );
}
