-- Site content / social embed config
CREATE TABLE site_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES site_pages (id) ON DELETE CASCADE,
  block_key text NOT NULL,
  body jsonb NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (page_id, block_key)
);

CREATE TABLE social_embeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform social_platform NOT NULL,
  label text NOT NULL,
  embed_type text NOT NULL,
  embed_url text,
  embed_html text,
  external_id text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX social_embeds_platform_sort_idx ON social_embeds (platform, sort_order);
CREATE INDEX social_embeds_enabled_sort_idx ON social_embeds (is_enabled, sort_order);
