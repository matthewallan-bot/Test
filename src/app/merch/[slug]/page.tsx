import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PRODUCTS, formatMoney, getProduct } from "@/data/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product?.name ?? "Merch",
    description: product?.description,
  };
}

export default function MerchDetailPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-ink-soft md:px-6">
          Loading product…
        </div>
      }
    >
      <MerchDetail params={params} />
    </Suspense>
  );
}

async function MerchDetail({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
      <div className="flex aspect-[4/5] items-end bg-gradient-to-br from-ink via-ink-soft to-haze p-6">
        <span className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide text-paper">
          {product.imageLabel}
        </span>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-steel">Merch</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink">
          {product.name}
        </h1>
        <p className="mt-2 font-mono text-lg text-ink-soft">
          {formatMoney(product.basePriceCents, product.currency)}
        </p>
        <p className="mt-6 text-ink-soft">{product.description}</p>

        <label className="mt-8 block text-sm font-medium text-ink">
          Variant
          <select className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2">
            {product.variants.map((v) => (
              <option key={v.sku} value={v.sku}>
                {v.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cart"
            className="rounded-sm bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal-deep"
          >
            Add to cart (stub)
          </Link>
          <Link
            href="/merch"
            className="rounded-sm border border-ink/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:border-signal"
          >
            Back to merch
          </Link>
        </div>
      </div>
    </div>
  );
}
