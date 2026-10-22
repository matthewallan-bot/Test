export type SocialPlatform =
  | "discord"
  | "meta"
  | "spotify"
  | "amazon_music"
  | "youtube";

export type SocialEmbed = {
  id: string;
  platform: SocialPlatform;
  label: string;
  embedType: "widget" | "iframe" | "oembed" | "link_card";
  embedUrl: string | null;
  externalId: string | null;
  config: Record<string, unknown>;
  isEnabled: boolean;
  sortOrder: number;
};

/**
 * Seed-shaped social embed config (mirrors `social_embeds` rows).
 * Replace with DB reads once migrations are applied.
 */
export const SOCIAL_EMBEDS: SocialEmbed[] = [
  {
    id: "soc-discord",
    platform: "discord",
    label: "Discord",
    embedType: "widget",
    embedUrl: "https://discord.gg/fixedreaction",
    externalId: "000000000000000000",
    config: { theme: "dark", height: 360 },
    isEnabled: true,
    sortOrder: 10,
  },
  {
    id: "soc-spotify",
    platform: "spotify",
    label: "Spotify",
    embedType: "iframe",
    embedUrl: "https://open.spotify.com/artist/0LyfUBJTZqY23Or3YNY3UZ",
    externalId: "0LyfUBJTZqY23Or3YNY3UZ",
    config: { view: "list", height: 352 },
    isEnabled: true,
    sortOrder: 20,
  },
  {
    id: "soc-youtube",
    platform: "youtube",
    label: "YouTube",
    embedType: "iframe",
    embedUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    externalId: "dQw4w9WgXcQ",
    config: { autoplay: false },
    isEnabled: true,
    sortOrder: 30,
  },
  {
    id: "soc-meta",
    platform: "meta",
    label: "Instagram / Facebook",
    embedType: "link_card",
    embedUrl: "https://www.instagram.com/",
    externalId: null,
    config: { ctaLabel: "Follow on Meta" },
    isEnabled: true,
    sortOrder: 40,
  },
  {
    id: "soc-amazon",
    platform: "amazon_music",
    label: "Amazon Music",
    embedType: "link_card",
    embedUrl: "https://music.amazon.com/",
    externalId: null,
    config: { ctaLabel: "Listen on Amazon Music" },
    isEnabled: true,
    sortOrder: 50,
  },
];

export function enabledSocialEmbeds(): SocialEmbed[] {
  return SOCIAL_EMBEDS.filter((e) => e.isEnabled).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}
