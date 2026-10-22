import {
  SOCIAL_EMBEDS,
  type SocialEmbed,
  type SocialPlatform,
} from "@/data/social-embeds";
import { withDb, query } from "@/lib/db";

export type { SocialEmbed, SocialPlatform };

type EmbedRow = {
  id: string;
  platform: SocialPlatform;
  label: string;
  embed_type: string;
  embed_url: string | null;
  external_id: string | null;
  config: Record<string, unknown>;
  is_enabled: boolean;
  sort_order: number;
};

async function loadEmbedsFromDb(): Promise<SocialEmbed[]> {
  const result = await query<EmbedRow>(
    `SELECT id, platform, label, embed_type, embed_url, external_id, config,
            is_enabled, sort_order
     FROM social_embeds
     WHERE is_enabled = true
     ORDER BY sort_order, platform`,
  );
  if (result.rows.length === 0) {
    return SOCIAL_EMBEDS.filter((e) => e.isEnabled).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }
  return result.rows.map((row) => ({
    id: row.id,
    platform: row.platform,
    label: row.label,
    embedType: row.embed_type as SocialEmbed["embedType"],
    embedUrl: row.embed_url,
    externalId: row.external_id,
    config: row.config ?? {},
    isEnabled: row.is_enabled,
    sortOrder: row.sort_order,
  }));
}

export async function listEnabledSocialEmbeds(): Promise<SocialEmbed[]> {
  return withDb(loadEmbedsFromDb, () =>
    SOCIAL_EMBEDS.filter((e) => e.isEnabled).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    ),
  );
}
