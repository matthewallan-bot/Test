-- Cart / orders
CREATE TABLE carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  session_key text,
  currency char(3) NOT NULL DEFAULT 'USD',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX carts_session_key_uidx ON carts (session_key) WHERE session_key IS NOT NULL;
CREATE INDEX carts_user_id_idx ON carts (user_id);

CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
  variant_id uuid NOT NULL REFERENCES product_variants (id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_cents integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cart_id, variant_id)
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  email citext NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  currency char(3) NOT NULL,
  subtotal_cents integer NOT NULL,
  shipping_cents integer NOT NULL DEFAULT 0,
  tax_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL,
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  fulfillment_status text NOT NULL DEFAULT 'unfulfilled'
    CHECK (fulfillment_status IN ('unfulfilled', 'shipped', 'cancelled')),
  notes text,
  placed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_user_placed_idx ON orders (user_id, placed_at DESC);
CREATE INDEX orders_status_idx ON orders (status);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants (id) ON DELETE SET NULL,
  sku text NOT NULL,
  product_name text NOT NULL,
  variant_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_cents integer NOT NULL,
  line_total_cents integer NOT NULL
);

CREATE INDEX order_items_order_id_idx ON order_items (order_id);
