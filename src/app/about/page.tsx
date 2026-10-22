import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The Fixed Reaction story.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">About</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink md:text-6xl">
        Built for the room that answers back
      </h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
        <p>
          Fixed Reaction is a band project focused on sharp hooks, live voltage,
          and a direct line between stage and fans — merch you can wear, music
          you can stream free, and tour dates you can plan around.
        </p>
        <p>
          This site is the home base: accounts for orders, self-hosted streams
          on the Music page, and socials when you want the platforms. No locked
          tracks. No cluttered hero dashboards. Just the band and the next show.
        </p>
      </div>
    </div>
  );
}
