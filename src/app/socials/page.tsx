import type { Metadata } from "next";
import { SocialEmbedBlock } from "@/components/social-embed";
import { enabledSocialEmbeds } from "@/data/social-embeds";

export const metadata: Metadata = {
  title: "Socials",
  description: "Fixed Reaction on Discord, Spotify, YouTube, and more.",
};

export default function SocialsPage() {
  const embeds = enabledSocialEmbeds();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Socials</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
        Find the band
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Enabled embeds from the seed config (mirrors{" "}
        <code className="text-sm">social_embeds</code>). Lazy iframes where the
        platform supports them; link cards otherwise.
      </p>

      <div className="mt-10 space-y-12">
        {embeds.map((embed) => (
          <SocialEmbedBlock key={embed.id} embed={embed} />
        ))}
      </div>
    </div>
  );
}
