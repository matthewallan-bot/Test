# Fixed Reaction

Official band site: merch ecommerce, accounts, free self-hosted music streaming, donations, tour dates, and social embeds.

**Repo:** https://github.com/matthewallan-bot/Test

## Stack

| Layer | Choice |
|-------|--------|
| App | Next.js App Router (TypeScript, ESLint, Tailwind) |
| Database | Postgres (Neon-ready) — SQL migrations in `db/migrations/` |
| Auth | Auth.js (`next-auth` v5) credentials + bcrypt against `users` |
| Payments | Stripe behind a thin adapter (`src/lib/payments`) |
| Media | Cloudflare R2 / S3-compatible for images + audio |

Cost-first: Neon free tier, Vercel Hobby, R2, Stripe test mode.

## Quick start (UI without secrets)

```bash
npm install
cp .env.example .env.local
# optional for UI-only: leave DATABASE_URL / Stripe unset
# set AUTH_SECRET for Auth.js (required for protected /account routes)
openssl rand -base64 32   # paste into AUTH_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Merch / tour / music / socials fall back to in-repo seed data when `DATABASE_URL` is unset.

## Full local setup (Neon + Auth + Stripe test)

### 1. Create a free Neon database

1. Sign up at [neon.tech](https://neon.tech) and create a project.
2. Copy the connection string (include `?sslmode=require`).
3. Put it in `.env.local` as `DATABASE_URL`.
4. Leave `DATABASE_SSL=true` (default) for Neon.

Any Postgres URL works — the client is not Neon-specific.

### 2. Run migrations + seed

```bash
npm run db:migrate   # applies db/migrations/* once (tracked in schema_migrations)
npm run db:seed      # loads db/seed.sql sample catalog, tour, music, socials, demo admin
```

**Demo admin (seed only):**

| Field | Value |
|-------|--------|
| Email | `admin@fixedreaction.demo` |
| Password | `fixed-reaction-demo` |

The password hash is stored in `db/seed.sql`; do not use this account in production.

### 3. Auth.js secret

```bash
openssl rand -base64 32
```

Set `AUTH_SECRET` and `AUTH_URL=http://localhost:3000`. Sign-up posts to `/api/auth/register` (bcrypt hash into `users`). Sign-in verifies credentials; JWT sessions are issued and a row is written to `sessions`. Routes under `/account/*` require a session (middleware).

### 4. Stripe test keys

1. Create a Stripe account → Developers → API keys → **test** mode.
2. Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. For webhooks (payment status updates on orders/donations):

```bash
# optional local forward
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Set `STRIPE_WEBHOOK_SECRET` from the listen output. Keep `PAYMENTS_PROVIDER=stripe`. Domain code calls `getPaymentsAdapter()` from `src/lib/payments` (not Stripe types directly).

### 5. Cloudflare R2 (optional for real audio files)

1. Create an R2 bucket for merch images and audio.
2. Set `R2_*` vars from `.env.example`.
3. Upload tracks; update `tracks.storage_key` / `storage_url` (seed uses placeholder public MP3 URLs).

## API surface (Phase 2)

| Method | Path | Purpose |
|--------|------|---------|
| GET/POST/PATCH | `/api/cart` | Read / add / set quantity |
| POST | `/api/checkout/create-session` | Order + Stripe Checkout Session |
| POST | `/api/donations/create-session` | Donation + Stripe Checkout Session |
| POST | `/api/webhooks/stripe` | Payment status → orders/donations |
| POST | `/api/auth/register` | Create user with hashed password |
| * | `/api/auth/[...nextauth]` | Auth.js handlers |

## Routes

| Path | Notes |
|------|--------|
| `/` | Brand-first Fixed Reaction home |
| `/about` | Bio |
| `/tour` | Tour dates (DB or seed fallback) |
| `/merch`, `/merch/[slug]` | Catalog (DB or seed); add to cart |
| `/cart`, `/checkout`, `/checkout/success` | Cart + Stripe Checkout |
| `/music` | Self-hosted audio player + donate CTA |
| `/socials` | Enabled embeds |
| `/auth/*`, `/account/*` | Auth / protected account |

## Scripts

```bash
npm run dev         # local development
npm run build       # production build
npm run start       # serve build
npm run lint        # ESLint
npm run db:migrate  # apply SQL migrations
npm run db:seed     # sample data
```

## Project docs

Living product docs live in the Cursor Project store (`docs/project-context.md`, `docs/plan.md`, `docs/site-architecture.md`, `docs/database-schema.md`).
