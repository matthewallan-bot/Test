import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { formatMoney, listProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Merch",
  description: "Official Fixed Reaction merchandise.",
};

export default function MerchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Merch</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
        Wear the tour
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Live catalog from Postgres when{" "}
        <code className="text-sm">DATABASE_URL</code> is set; otherwise seed
        fallbacks.
      </p>
      <Suspense
        fallback={
          <p className="mt-10 text-ink-soft">Loading catalog…</p>
        }
      >
        <MerchGrid />
      </Suspense>
    </div>
  );
}

async function MerchGrid() {
  await connection();
  const products = await listProducts();

  return (
    <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.slug}>
          <Link href={`/merch/${product.slug}`} className="group block">
            <div className="flex aspect-[4/5] items-end bg-gradient-to-br from-ink via-ink-soft to-haze p-4 transition-transform group-hover:-translate-y-1">
              <span className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-paper">
                {product.imageLabel}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold text-ink">{product.name}</h2>
              <p className="font-mono text-sm text-ink-soft">
                {formatMoney(product.basePriceCents, product.currency)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
