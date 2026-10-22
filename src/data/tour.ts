export type TourDate = {
  id: string;
  startsAt: string;
  timezone: string;
  venueName: string;
  city: string;
  region: string | null;
  country: string;
  ticketUrl: string | null;
  isSoldOut: boolean;
  notes: string | null;
};

export const TOUR_DATES: TourDate[] = [
  {
    id: "tour-1",
    startsAt: "2026-11-14T20:00:00-08:00",
    timezone: "America/Los_Angeles",
    venueName: "The Echo",
    city: "Los Angeles",
    region: "CA",
    country: "US",
    ticketUrl: "https://example.com/tickets/echo",
    isSoldOut: false,
    notes: "Doors 7pm",
  },
  {
    id: "tour-2",
    startsAt: "2026-11-21T21:00:00-08:00",
    timezone: "America/Los_Angeles",
    venueName: "Great American Music Hall",
    city: "San Francisco",
    region: "CA",
    country: "US",
    ticketUrl: "https://example.com/tickets/gamh",
    isSoldOut: false,
    notes: null,
  },
  {
    id: "tour-3",
    startsAt: "2026-12-05T20:00:00-07:00",
    timezone: "America/Denver",
    venueName: "Larimer Lounge",
    city: "Denver",
    region: "CO",
    country: "US",
    ticketUrl: null,
    isSoldOut: true,
    notes: "Sold out — waitlist at the door",
  },
];
