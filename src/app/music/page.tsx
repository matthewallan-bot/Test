import type { Metadata } from "next";
import Link from "next/link";
import { MusicPlayer } from "@/components/music-player";
import { PLACEHOLDER_TRACKS } from "@/data/tracks";

export const metadata: Metadata = {
  title: "Music",
  description: "Free Fixed Reaction streams — self-hosted audio.",
};

export default function MusicPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Music</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
        Free streams
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Self-hosted audio via object storage URLs. Streaming is free — donations
        are optional gratitude, never a gate.
      </p>

      <div className="mt-10">
        <MusicPlayer tracks={PLACEHOLDER_TRACKS} />
      </div>

      <aside className="mt-12 border border-ink/15 bg-ink px-5 py-6 text-paper">
        <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
          Support the band
        </h2>
        <p className="mt-2 text-sm text-ash">
          Preset amounts and Stripe Checkout will hook into{" "}
          <code className="text-ash-deep">donations</code> +{" "}
          <code className="text-ash-deep">payments</code> through the thin
          adapter.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["$5", "$10", "$25"].map((amount) => (
            <button
              key={amount}
              type="button"
              className="rounded-sm border border-paper/30 px-4 py-2 text-sm font-semibold hover:border-signal hover:text-signal"
            >
              {amount}
            </button>
          ))}
          <Link
            href="/socials"
            className="rounded-sm bg-signal px-4 py-2 text-sm font-semibold text-paper hover:bg-signal-deep"
          >
            Listen elsewhere
          </Link>
        </div>
      </aside>
    </div>
  );
}
