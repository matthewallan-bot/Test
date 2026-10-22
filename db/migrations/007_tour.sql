-- Tour dates
CREATE TABLE tour_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL,
  timezone text NOT NULL,
  venue_name text NOT NULL,
  city text NOT NULL,
  region text,
  country char(2) NOT NULL DEFAULT 'US',
  ticket_url text,
  is_sold_out boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tour_dates_published_starts_idx ON tour_dates (is_published, starts_at);
