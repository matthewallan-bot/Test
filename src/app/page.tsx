import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100dvh-7.5rem)] overflow-hidden">
      <div
        aria-hidden
        className="hero-grain absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(122,135,153,0.35),transparent_55%),linear-gradient(135deg,#1c2430_0%,#3d4a5c_42%,#8fa0b3_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(18,21,26,0.72),rgba(18,21,26,0.35)_55%,transparent)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-7.5rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 md:justify-center md:px-6 md:pb-24">
        <p className="animate-rise signal-line mb-4 h-1 w-24 bg-signal" />
        <h1 className="animate-rise font-[family-name:var(--font-display)] text-6xl font-semibold uppercase leading-[0.92] tracking-[0.02em] text-paper sm:text-7xl md:text-8xl lg:text-9xl">
          Fixed Reaction
        </h1>
        <p className="animate-rise-delay mt-5 max-w-xl text-lg text-ash md:text-xl">
          Loud rooms, clean lines, and songs that stick after the lights cut.
        </p>
        <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
          <Link
            href="/merch"
            className="rounded-sm bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-signal-deep"
          >
            Shop merch
          </Link>
          <Link
            href="/music"
            className="rounded-sm border border-paper/40 bg-paper/10 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper backdrop-blur-sm transition-colors hover:bg-paper/20"
          >
            Stream free
          </Link>
          <Link
            href="/tour"
            className="rounded-sm border border-paper/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-paper/10"
          >
            Tour dates
          </Link>
        </div>
      </div>
    </section>
  );
}
