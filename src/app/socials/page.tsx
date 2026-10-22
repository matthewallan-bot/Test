import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { SocialEmbedBlock } from "@/components/social-embed";
import { listEnabledSocialEmbeds } from "@/lib/socials-data";

export const metadata: Metadata = {
  title: "Socials",
  description: "Fixed Reaction on Discord, Spotify, YouTube, and more.",
};

export default function SocialsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Socials</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
        Find the band
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Enabled embeds from Postgres when configured; otherwise seed config.
        Lazy iframes where the platform supports them; link cards otherwise.
      </p>
      <Suspense fallback={<p className="mt-10 text-ink-soft">Loading embeds…</p>}>
        <SocialsBody />
      </Suspense>
    </div>
  );
}

async function SocialsBody() {
  await connection();
  const embeds = await listEnabledSocialEmbeds();

  return (
    <div className="mt-10 space-y-12">
      {embeds.map((embed) => (
        <SocialEmbedBlock key={embed.id} embed={embed} />
      ))}
    </div>
  );
}
