"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMoney } from "@/data/products";
import type { CartView } from "@/lib/cart";

export function CartClient({ initial }: { initial: CartView | null }) {
  const router = useRouter();
  const [cart, setCart] = useState(initial);
  const [pending, setPending] = useState(false);

  async function setQty(sku: string, quantity: number) {
    setPending(true);
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, quantity }),
    });
    const data = await res.json();
    setPending(false);
    if (res.ok && !("error" in data)) {
      setCart(data as CartView);
      router.refresh();
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mt-8 border border-dashed border-ink/20 bg-paper/60 px-4 py-10 text-center text-ink-soft">
        No items yet — browse{" "}
        <Link href="/merch" className="font-semibold text-signal">
          merch
        </Link>
        .
        {!cart ? (
          <p className="mt-2 text-sm">
            Set <code className="text-sm">DATABASE_URL</code> and seed to persist
            carts.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {cart.items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-ink">{item.productName}</p>
              <p className="text-sm text-ink-soft">{item.variantName}</p>
              <p className="mt-1 font-mono text-sm text-steel">
                {formatMoney(item.unitPriceCents, cart.currency)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={pending}
                className="border border-ink/20 px-2 py-1 text-sm"
                onClick={() => setQty(item.sku, item.quantity - 1)}
              >
                −
              </button>
              <span className="font-mono text-sm">{item.quantity}</span>
              <button
                type="button"
                disabled={pending}
                className="border border-ink/20 px-2 py-1 text-sm"
                onClick={() => setQty(item.sku, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-right font-mono text-lg text-ink">
        Subtotal {formatMoney(cart.subtotalCents, cart.currency)}
      </p>
      <Link
        href="/checkout"
        className="inline-flex rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal"
      >
        Checkout
      </Link>
    </div>
  );
}
