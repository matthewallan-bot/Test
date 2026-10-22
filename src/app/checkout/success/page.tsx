import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order confirmed",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Checkout</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
        Thanks — order received
      </h1>
      <p className="mt-4 text-ink-soft">
        Confirmation stub. Live order numbers and receipts will appear here after
        Stripe webhooks update <code className="text-sm">orders</code> /
        <code className="text-sm"> payments</code>.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/account/orders"
          className="rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal"
        >
          View orders
        </Link>
        <Link
          href="/merch"
          className="rounded-sm border border-ink/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
