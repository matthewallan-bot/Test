"use client";

import Link from "next/link";
import { useState } from "react";

const PRESETS = [
  { label: "$5", cents: 500 },
  { label: "$10", cents: 1000 },
  { label: "$25", cents: 2500 },
];

export function DonateButtons() {
  const [pending, setPending] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function donate(amountCents: number) {
    setError(null);
    setPending(amountCents);
    const res = await fetch("/api/donations/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountCents, source: "music_page" }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
    };
    setPending(null);
    if (!res.ok || !data.url) {
      setError(data.error ?? "Could not start donation checkout");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.cents}
            type="button"
            disabled={pending !== null}
            onClick={() => donate(p.cents)}
            className="rounded-sm border border-paper/30 px-4 py-2 text-sm font-semibold hover:border-signal hover:text-signal disabled:opacity-60"
          >
            {pending === p.cents ? "…" : p.label}
          </button>
        ))}
        <Link
          href="/socials"
          className="rounded-sm bg-signal px-4 py-2 text-sm font-semibold text-paper hover:bg-signal-deep"
        >
          Listen elsewhere
        </Link>
      </div>
      {error ? <p className="text-sm text-signal">{error}</p> : null}
    </div>
  );
}
