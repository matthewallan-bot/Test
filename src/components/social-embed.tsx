import type { ReactNode } from "react";
import type { SocialEmbed } from "@/data/social-embeds";

function spotifyEmbedSrc(embed: SocialEmbed): string | null {
  if (embed.externalId) {
    return `https://open.spotify.com/embed/artist/${embed.externalId}?utm_source=generator`;
  }
  if (!embed.embedUrl) return null;
  return embed.embedUrl.replace(
    "open.spotify.com/",
    "open.spotify.com/embed/",
  );
}

function youtubeEmbedSrc(embed: SocialEmbed): string | null {
  const id = embed.externalId;
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

function discordWidgetSrc(embed: SocialEmbed): string | null {
  if (!embed.externalId) return null;
  const theme = typeof embed.config.theme === "string" ? embed.config.theme : "dark";
  return `https://discord.com/widget?id=${embed.externalId}&theme=${theme}`;
}

export function SocialEmbedBlock({ embed }: { embed: SocialEmbed }) {
  const height =
    typeof embed.config.height === "number" ? embed.config.height : 352;
  const anchor = embed.platform;

  let body: ReactNode;

  if (embed.platform === "spotify" && embed.embedType === "iframe") {
    const src = spotifyEmbedSrc(embed);
    body = src ? (
      <iframe
        title={embed.label}
        src={src}
        width="100%"
        height={height}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="border-0"
      />
    ) : null;
  } else if (embed.platform === "youtube" && embed.embedType === "iframe") {
    const src = youtubeEmbedSrc(embed);
    body = src ? (
      <div className="aspect-video w-full overflow-hidden bg-ink">
        <iframe
          title={embed.label}
          src={src}
          className="h-full w-full border-0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : null;
  } else if (embed.platform === "discord" && embed.embedType === "widget") {
    const src = discordWidgetSrc(embed);
    body = (
      <div className="space-y-3">
        {src ? (
          <iframe
            title={embed.label}
            src={src}
            width="100%"
            height={height}
            loading="lazy"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            className="border-0"
          />
        ) : null}
        {embed.embedUrl ? (
          <a
            href={embed.embedUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-sm font-semibold text-signal hover:text-signal-deep"
          >
            Join Discord →
          </a>
        ) : null}
      </div>
    );
  } else {
    const cta =
      typeof embed.config.ctaLabel === "string"
        ? embed.config.ctaLabel
        : `Open ${embed.label}`;
    body = (
      <a
        href={embed.embedUrl ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center justify-between border border-ink/15 bg-paper/70 px-4 py-5 transition-colors hover:border-signal/50"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-steel">
            {embed.platform.replace("_", " ")}
          </p>
          <p className="mt-1 font-medium text-ink">{cta}</p>
        </div>
        <span className="text-signal transition-transform group-hover:translate-x-1">
          →
        </span>
      </a>
    );
  }

  return (
    <section id={anchor} className="scroll-mt-24 space-y-3">
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-ink">
        {embed.label}
      </h2>
      {body}
    </section>
  );
}
