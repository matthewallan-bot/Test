-- Music: self-hosted audio metadata (R2 / S3-compatible)
CREATE TABLE albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  release_date date,
  cover_image_url text,
  description text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES albums (id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  duration_seconds integer,
  track_number integer,
  storage_key text,
  storage_url text,
  audio_url text,
  content_type text,
  file_size_bytes bigint,
  external_embed_ref text,
  stream_source text NOT NULL DEFAULT 'file',
  is_streamable boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT false,
  play_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tracks_album_track_number_idx ON tracks (album_id, track_number);
CREATE INDEX tracks_published_idx ON tracks (is_published);
CREATE UNIQUE INDEX tracks_storage_key_uidx ON tracks (storage_key) WHERE storage_key IS NOT NULL;

CREATE TABLE play_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES tracks (id) ON DELETE CASCADE,
  user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  played_at timestamptz NOT NULL DEFAULT now(),
  seconds_listened integer
);

CREATE INDEX play_events_track_played_idx ON play_events (track_id, played_at DESC);
