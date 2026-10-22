"use client";

import { useState } from "react";

export function CheckoutForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const shipping = String(form.get("shipping") ?? "");

    const res = await fetch("/api/checkout/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        shippingAddress: { raw: shipping },
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
    };
    setPending(false);

    if (!res.ok || !data.url) {
      setError(data.error ?? "Could not start Stripe Checkout");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <label className="block text-sm font-medium">
        Email
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Shipping address
        <textarea
          name="shipping"
          rows={3}
          required
          placeholder="Street, city, region, postal code"
          className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-signal">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal-deep disabled:opacity-60"
      >
        {pending ? "Redirecting…" : "Pay with Stripe"}
      </button>
    </form>
  );
}
