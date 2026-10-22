import { TOUR_DATES, type TourDate } from "@/data/tour";
import { withDb, query } from "@/lib/db";

export type { TourDate };

type TourRow = {
  id: string;
  starts_at: Date;
  timezone: string;
  venue_name: string;
  city: string;
  region: string | null;
  country: string;
  ticket_url: string | null;
  is_sold_out: boolean;
  notes: string | null;
};

async function loadTourFromDb(): Promise<TourDate[]> {
  const result = await query<TourRow>(
    `SELECT id, starts_at, timezone, venue_name, city, region, country,
            ticket_url, is_sold_out, notes
     FROM tour_dates
     WHERE is_published = true
     ORDER BY starts_at ASC`,
  );
  if (result.rows.length === 0) return TOUR_DATES;
  return result.rows.map((row) => ({
    id: row.id,
    startsAt: row.starts_at.toISOString(),
    timezone: row.timezone,
    venueName: row.venue_name,
    city: row.city,
    region: row.region,
    country: row.country,
    ticketUrl: row.ticket_url,
    isSoldOut: row.is_sold_out,
    notes: row.notes,
  }));
}

export async function listTourDates(): Promise<TourDate[]> {
  return withDb(loadTourFromDb, TOUR_DATES);
}
