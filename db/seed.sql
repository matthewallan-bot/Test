-- Fixed Reaction demo seed (idempotent-ish via ON CONFLICT / fixed keys).
-- Demo admin password (plaintext — documented in README only): fixed-reaction-demo
-- bcrypt hash below; never commit plaintext passwords as user data.

INSERT INTO users (id, email, password_hash, display_name, role, email_verified_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@fixedreaction.demo',
  '$2b$10$CzzZvST.y703FHdkwZKpk.MtynNEB0pJ5rYMlSklhSttK.xh4FVZK',
  'Demo Admin',
  'admin',
  now()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  updated_at = now();

INSERT INTO products (id, slug, name, description, status, base_price_cents, currency, sort_order, published_at)
VALUES
  (
    '22222222-2222-2222-2222-222222222201',
    'signal-tee',
    'Signal Tee',
    'Heavyweight tee with Fixed Reaction wordmark. Soft black ink on ash.',
    'active',
    3200,
    'USD',
    10,
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    'afterimage-hoodie',
    'Afterimage Hoodie',
    'Midweight hoodie. Embroidered mark on chest, tour back print.',
    'active',
    5800,
    'USD',
    20,
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    'static-cap',
    'Static Cap',
    'Structured cap with tonal Fixed Reaction embroidery.',
    'active',
    2800,
    'USD',
    30,
    now()
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  base_price_cents = EXCLUDED.base_price_cents,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO product_variants (id, product_id, sku, name, option_values, is_active)
VALUES
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'FR-TEE-S', 'S / Ash', '{"size":"S","color":"Ash"}'::jsonb, true),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'FR-TEE-M', 'M / Ash', '{"size":"M","color":"Ash"}'::jsonb, true),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'FR-TEE-L', 'L / Ash', '{"size":"L","color":"Ash"}'::jsonb, true),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222202', 'FR-HOOD-M', 'M / Charcoal', '{"size":"M","color":"Charcoal"}'::jsonb, true),
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222202', 'FR-HOOD-L', 'L / Charcoal', '{"size":"L","color":"Charcoal"}'::jsonb, true),
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222202', 'FR-HOOD-XL', 'XL / Charcoal', '{"size":"XL","color":"Charcoal"}'::jsonb, true),
  ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222203', 'FR-CAP-OS', 'One Size / Black', '{"size":"OS","color":"Black"}'::jsonb, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  option_values = EXCLUDED.option_values,
  is_active = EXCLUDED.is_active,
  updated_at = now();

INSERT INTO inventory_items (variant_id, quantity_on_hand, quantity_reserved)
VALUES
  ('33333333-3333-3333-3333-333333333301', 25, 0),
  ('33333333-3333-3333-3333-333333333302', 40, 0),
  ('33333333-3333-3333-3333-333333333303', 30, 0),
  ('33333333-3333-3333-3333-333333333304', 20, 0),
  ('33333333-3333-3333-3333-333333333305', 18, 0),
  ('33333333-3333-3333-3333-333333333306', 12, 0),
  ('33333333-3333-3333-3333-333333333307', 50, 0)
ON CONFLICT (variant_id) DO UPDATE SET
  quantity_on_hand = EXCLUDED.quantity_on_hand,
  updated_at = now();

INSERT INTO albums (id, slug, title, release_date, description, is_published, sort_order)
VALUES (
  '44444444-4444-4444-4444-444444444401',
  'demos',
  'Fixed Reaction — Demos',
  '2026-01-01',
  'Early demos for the Music page player.',
  true,
  10
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO tracks (
  id, album_id, slug, title, duration_seconds, track_number,
  storage_key, storage_url, audio_url, content_type,
  stream_source, is_streamable, is_published
)
VALUES
  (
    '55555555-5555-5555-5555-555555555501',
    '44444444-4444-4444-4444-444444444401',
    'signal-burn',
    'Signal Burn',
    12,
    1,
    'audio/demos/signal-burn.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'audio/mpeg',
    'file',
    true,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555502',
    '44444444-4444-4444-4444-444444444401',
    'afterimage',
    'Afterimage',
    12,
    2,
    'audio/demos/afterimage.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'audio/mpeg',
    'file',
    true,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555503',
    '44444444-4444-4444-4444-444444444401',
    'static-room',
    'Static Room',
    12,
    3,
    'audio/demos/static-room.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'audio/mpeg',
    'file',
    true,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  storage_url = EXCLUDED.storage_url,
  audio_url = EXCLUDED.audio_url,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO tour_dates (
  id, starts_at, timezone, venue_name, city, region, country,
  ticket_url, is_sold_out, is_published, notes
)
VALUES
  (
    '66666666-6666-6666-6666-666666666601',
    '2026-11-15T04:00:00Z',
    'America/Los_Angeles',
    'The Echo',
    'Los Angeles',
    'CA',
    'US',
    'https://example.com/tickets/echo',
    false,
    true,
    'Doors 7pm'
  ),
  (
    '66666666-6666-6666-6666-666666666602',
    '2026-11-22T05:00:00Z',
    'America/Los_Angeles',
    'Great American Music Hall',
    'San Francisco',
    'CA',
    'US',
    'https://example.com/tickets/gamh',
    false,
    true,
    NULL
  ),
  (
    '66666666-6666-6666-6666-666666666603',
    '2026-12-06T03:00:00Z',
    'America/Denver',
    'Larimer Lounge',
    'Denver',
    'CO',
    'US',
    NULL,
    true,
    true,
    'Sold out — waitlist at the door'
  )
ON CONFLICT (id) DO UPDATE SET
  venue_name = EXCLUDED.venue_name,
  ticket_url = EXCLUDED.ticket_url,
  is_sold_out = EXCLUDED.is_sold_out,
  is_published = EXCLUDED.is_published,
  notes = EXCLUDED.notes,
  updated_at = now();

INSERT INTO social_embeds (
  id, platform, label, embed_type, embed_url, external_id, config, is_enabled, sort_order
)
VALUES
  (
    '77777777-7777-7777-7777-777777777701',
    'discord',
    'Discord',
    'widget',
    'https://discord.gg/fixedreaction',
    '000000000000000000',
    '{"theme":"dark","height":360}'::jsonb,
    true,
    10
  ),
  (
    '77777777-7777-7777-7777-777777777702',
    'spotify',
    'Spotify',
    'iframe',
    'https://open.spotify.com/artist/0LyfUBJTZqY23Or3YNY3UZ',
    '0LyfUBJTZqY23Or3YNY3UZ',
    '{"view":"list","height":352}'::jsonb,
    true,
    20
  ),
  (
    '77777777-7777-7777-7777-777777777703',
    'youtube',
    'YouTube',
    'iframe',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'dQw4w9WgXcQ',
    '{"autoplay":false}'::jsonb,
    true,
    30
  ),
  (
    '77777777-7777-7777-7777-777777777704',
    'meta',
    'Instagram / Facebook',
    'link_card',
    'https://www.instagram.com/',
    NULL,
    '{"ctaLabel":"Follow on Meta"}'::jsonb,
    true,
    40
  ),
  (
    '77777777-7777-7777-7777-777777777705',
    'amazon_music',
    'Amazon Music',
    'link_card',
    'https://music.amazon.com/',
    NULL,
    '{"ctaLabel":"Listen on Amazon Music"}'::jsonb,
    true,
    50
  )
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  embed_url = EXCLUDED.embed_url,
  config = EXCLUDED.config,
  is_enabled = EXCLUDED.is_enabled,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO site_config (key, value)
VALUES
  ('brand.name', '"Fixed Reaction"'::jsonb),
  ('donation.presets_cents', '[500,1000,2500]'::jsonb)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
