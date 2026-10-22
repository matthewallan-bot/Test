import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { listTourDates } from "@/lib/tour-data";

export const metadata: Metadata = {
  title: "Tour",
  description: "Upcoming Fixed Reaction shows.",
};

export default function TourPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Tour</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
        On the road
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Upcoming dates. Ticket links open externally when available.
      </p>
      <Suspense fallback={<p className="mt-10 text-ink-soft">Loading dates…</p>}>
        <TourList />
      </Suspense>
    </div>
  );
}

async function TourList() {
  await connection();
  const dates = await listTourDates();

  return (
    <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
      {dates.map((show) => {
        const date = new Date(show.startsAt);
        const when = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: show.timezone,
        }).format(date);

        return (
          <li
            key={show.id}
            className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-mono text-sm text-steel">{when}</p>
              <p className="mt-1 text-xl font-semibold text-ink">
                {show.venueName}
              </p>
              <p className="text-ink-soft">
                {show.city}
                {show.region ? `, ${show.region}` : ""}
              </p>
              {show.notes ? (
                <p className="mt-1 text-sm text-steel">{show.notes}</p>
              ) : null}
            </div>
            <div>
              {show.isSoldOut ? (
                <span className="text-sm font-semibold uppercase tracking-wide text-steel">
                  Sold out
                </span>
              ) : show.ticketUrl ? (
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-signal"
                >
                  Tickets
                </a>
              ) : (
                <span className="text-sm text-steel">TBA</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
