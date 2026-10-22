import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { DonateButtons } from "@/components/donate-buttons";
import { MusicPlayer } from "@/components/music-player";
import { listTracks } from "@/lib/music-data";

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

      <Suspense
        fallback={
          <div className="mt-10 text-ink-soft">Loading player…</div>
        }
      >
        <MusicBody />
      </Suspense>

      <aside className="mt-12 border border-ink/15 bg-ink px-5 py-6 text-paper">
        <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
          Support the band
        </h2>
        <p className="mt-2 text-sm text-ash">
          Opens Stripe Checkout for a donation (
          <code className="text-ash-deep">donations</code> +{" "}
          <code className="text-ash-deep">payments</code>).
        </p>
        <DonateButtons />
      </aside>
    </div>
  );
}

async function MusicBody() {
  await connection();
  const tracks = await listTracks();
  return (
    <div className="mt-10">
      <MusicPlayer tracks={tracks} />
    </div>
  );
}
