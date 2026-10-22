import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";

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
        Creates an order + Stripe Checkout Session via{" "}
        <code className="text-sm">getPaymentsAdapter()</code>. Needs{" "}
        <code className="text-sm">DATABASE_URL</code> and{" "}
        <code className="text-sm">STRIPE_SECRET_KEY</code>.
      </p>
      <CheckoutForm />
      <p className="mt-6 text-sm text-steel">
        After payment:{" "}
        <Link href="/checkout/success" className="text-signal">
          /checkout/success
        </Link>
      </p>
    </div>
  );
}
