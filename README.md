# Fixed Reaction

Official band site: merch ecommerce, accounts, free self-hosted music streaming, donations, tour dates, and social embeds.

**Repo:** https://github.com/matthewallan-bot/Test

## Stack

| Layer | Choice |
|-------|--------|
| App | Next.js App Router (TypeScript, ESLint, Tailwind) |
| Database | Postgres (Neon-ready) — SQL migrations in `db/migrations/` |
| Auth | Auth.js (`next-auth` v5) stub |
| Payments | Stripe behind a thin adapter (`src/lib/payments`) |
| Media | Cloudflare R2 / S3-compatible for images + audio |

Cost-first: Neon free tier, Vercel Hobby, R2, Stripe test mode.

## Quick start

```bash
npm install
cp .env.example .env.local
# fill AUTH_SECRET at minimum for Auth.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment setup

### 1. Neon Postgres

1. Create a Neon project and copy the connection string.
2. Set `DATABASE_URL` in `.env.local`.
3. Apply migrations in order:

```bash
# example with psql
psql "$DATABASE_URL" -f db/migrations/001_extensions_and_types.sql
psql "$DATABASE_URL" -f db/migrations/002_users_auth.sql
psql "$DATABASE_URL" -f db/migrations/003_catalog.sql
psql "$DATABASE_URL" -f db/migrations/004_cart_orders.sql
psql "$DATABASE_URL" -f db/migrations/005_donations_payments.sql
psql "$DATABASE_URL" -f db/migrations/006_music.sql
psql "$DATABASE_URL" -f db/migrations/007_tour.sql
psql "$DATABASE_URL" -f db/migrations/008_site_content.sql
```

Schema matches the Project store `database-schema.md` (users, catalog, cart/orders, donations, payments with Stripe provider, music tracks with self-hosted file fields, tour, social embeds).

### 2. Auth.js

```bash
openssl rand -base64 32
```

Set `AUTH_SECRET` and `AUTH_URL` (local: `http://localhost:3000`). Credentials provider is stubbed in `src/lib/auth.ts` — replace with real password-hash checks against `users`.

### 3. Stripe (test keys)

1. Create a Stripe account and copy **test** secret + publishable keys.
2. Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Optional webhook secret for later: `STRIPE_WEBHOOK_SECRET`.
4. Keep `PAYMENTS_PROVIDER=stripe`. Domain code should call `getPaymentsAdapter()` from `src/lib/payments` (not Stripe types directly).

### 4. Cloudflare R2

1. Create an R2 bucket for merch images and audio.
2. Create an API token with object read/write.
3. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_BASE_URL`.
4. Upload tracks; store `storage_key` / public `storage_url` on `tracks` rows. The Music page player uses progressive `<audio>` against those URLs (placeholder tracks in `src/data/tracks.ts` until DB is seeded).

## Routes

| Path | Notes |
|------|--------|
| `/` | Brand-first Fixed Reaction home |
| `/about` | Bio |
| `/tour` | Tour dates (seed data) |
| `/merch`, `/merch/[slug]` | Catalog stubs |
| `/cart`, `/checkout`, `/checkout/success` | Checkout stubs |
| `/music` | Self-hosted audio player + donate CTA |
| `/socials` | Enabled embeds from seed config |
| `/auth/*`, `/account/*` | Auth / account stubs |

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run start    # serve build
npm run lint     # ESLint
```

## Project docs

Living product docs live in the Cursor Project store (`docs/project-context.md`, `docs/plan.md`, `docs/site-architecture.md`, `docs/database-schema.md`).
