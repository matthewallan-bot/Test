import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Checkout</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
        Review & pay
      </h1>
      <p className="mt-4 text-ink-soft">
        Stripe Checkout will be created through the thin payments adapter (
        <code className="text-sm">getPaymentsAdapter()</code>). Guest and
        signed-in flows share this route.
      </p>
      <form className="mt-8 space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Shipping address
          <textarea
            name="shipping"
            rows={3}
            placeholder="Street, city, region, postal code"
            className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          />
        </label>
        <button
          type="button"
          className="rounded-sm bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal-deep"
        >
          Pay with Stripe (wire next)
        </button>
      </form>
      <p className="mt-6 text-sm text-steel">
        After payment:{" "}
        <Link href="/checkout/success" className="text-signal">
          /checkout/success
        </Link>
      </p>
    </div>
  );
}
