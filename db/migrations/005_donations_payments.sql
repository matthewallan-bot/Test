-- Donations + payments (Stripe provider default; thin multi-provider field)
CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  email citext,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency char(3) NOT NULL DEFAULT 'USD',
  message text,
  is_anonymous boolean NOT NULL DEFAULT false,
  status donation_status NOT NULL DEFAULT 'pending',
  source text NOT NULL DEFAULT 'music_page',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX donations_user_created_idx ON donations (user_id, created_at DESC);
CREATE INDEX donations_status_idx ON donations (status);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind payment_kind NOT NULL,
  order_id uuid REFERENCES orders (id),
  donation_id uuid REFERENCES donations (id),
  provider text NOT NULL DEFAULT 'stripe',
  provider_payment_id text,
  provider_session_id text,
  amount_cents integer NOT NULL,
  currency char(3) NOT NULL,
  status payment_status NOT NULL,
  raw_events jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_kind_target_chk CHECK (
    (kind = 'checkout' AND order_id IS NOT NULL AND donation_id IS NULL)
    OR (kind = 'donation' AND donation_id IS NOT NULL AND order_id IS NULL)
  )
);

CREATE UNIQUE INDEX payments_provider_payment_id_uidx
  ON payments (provider_payment_id)
  WHERE provider_payment_id IS NOT NULL;

CREATE UNIQUE INDEX payments_one_checkout_per_order_uidx
  ON payments (order_id)
  WHERE kind = 'checkout' AND order_id IS NOT NULL;

CREATE UNIQUE INDEX payments_one_donation_per_donation_uidx
  ON payments (donation_id)
  WHERE kind = 'donation' AND donation_id IS NOT NULL;
