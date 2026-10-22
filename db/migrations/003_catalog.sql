-- Merch catalog
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  status product_status NOT NULL DEFAULT 'draft',
  base_price_cents integer NOT NULL,
  currency char(3) NOT NULL DEFAULT 'USD',
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_status_sort_idx ON products (status, sort_order);

CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  option_values jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_cents integer,
  compare_at_cents integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX product_variants_product_id_idx ON product_variants (product_id);
CREATE INDEX product_variants_option_values_gin ON product_variants USING gin (option_values);

CREATE TABLE inventory_items (
  variant_id uuid PRIMARY KEY REFERENCES product_variants (id) ON DELETE CASCADE,
  quantity_on_hand integer NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
  quantity_reserved integer NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants (id) ON DELETE SET NULL,
  url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX product_images_product_sort_idx ON product_images (product_id, sort_order);
