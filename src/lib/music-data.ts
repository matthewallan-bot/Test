import { PLACEHOLDER_TRACKS, type Track } from "@/data/tracks";
import { withDb, query } from "@/lib/db";

export type { Track };

type TrackRow = {
  id: string;
  slug: string;
  title: string;
  album_title: string | null;
  duration_seconds: number | null;
  track_number: number | null;
  audio_url: string | null;
  storage_url: string | null;
  content_type: string | null;
  storage_key: string | null;
};

async function loadTracksFromDb(): Promise<Track[]> {
  const result = await query<TrackRow>(
    `SELECT t.id, t.slug, t.title,
            a.title AS album_title,
            t.duration_seconds, t.track_number,
            t.audio_url, t.storage_url, t.content_type, t.storage_key
     FROM tracks t
     LEFT JOIN albums a ON a.id = t.album_id
     WHERE t.is_published = true AND t.is_streamable = true
     ORDER BY a.sort_order NULLS LAST, t.track_number NULLS LAST, t.title`,
  );
  if (result.rows.length === 0) return PLACEHOLDER_TRACKS;

  return result.rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    albumTitle: row.album_title ?? "Singles",
    durationSeconds: row.duration_seconds ?? 0,
    trackNumber: row.track_number ?? 0,
    audioUrl: row.audio_url ?? row.storage_url ?? "",
    contentType: row.content_type ?? "audio/mpeg",
    storageKey: row.storage_key ?? "",
  }));
}

export async function listTracks(): Promise<Track[]> {
  return withDb(loadTracksFromDb, PLACEHOLDER_TRACKS);
}
