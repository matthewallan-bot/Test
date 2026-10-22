import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Cart</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
        Your cart
      </h1>
      <p className="mt-4 text-ink-soft">
        Cart persistence against Postgres lands in a later phase. This page is
        the route stub so checkout UX can attach next.
      </p>
      <div className="mt-8 border border-dashed border-ink/20 bg-paper/60 px-4 py-10 text-center text-ink-soft">
        No items yet — browse{" "}
        <Link href="/merch" className="font-semibold text-signal">
          merch
        </Link>
        .
      </div>
      <Link
        href="/checkout"
        className="mt-6 inline-flex rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal"
      >
        Checkout
      </Link>
    </div>
  );
}
