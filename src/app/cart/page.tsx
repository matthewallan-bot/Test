import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { CartClient } from "@/components/cart-client";
import { getCart } from "@/lib/cart";

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
        Guest carts use a session cookie; signed-in carts attach to your
        account. Requires Postgres.
      </p>
      <Suspense
        fallback={
          <div className="mt-8 border border-dashed border-ink/20 px-4 py-10 text-center text-ink-soft">
            Loading cart…
          </div>
        }
      >
        <CartBody />
      </Suspense>
    </div>
  );
}

async function CartBody() {
  await connection();
  const cart = await getCart();
  return <CartClient initial={cart} />;
}
