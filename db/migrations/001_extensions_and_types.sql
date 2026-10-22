-- Fixed Reaction: extensions and shared enum types
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE order_status AS ENUM (
  'pending',
  'awaiting_payment',
  'paid',
  'fulfilled',
  'cancelled',
  'refunded'
);
CREATE TYPE donation_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_kind AS ENUM ('checkout', 'donation');
CREATE TYPE payment_status AS ENUM (
  'requires_action',
  'processing',
  'succeeded',
  'failed',
  'refunded'
);
CREATE TYPE social_platform AS ENUM (
  'discord',
  'meta',
  'spotify',
  'amazon_music',
  'youtube'
);
