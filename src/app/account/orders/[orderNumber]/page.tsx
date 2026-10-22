import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

type Props = { params: Promise<{ orderNumber: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Order ${orderNumber}` };
}

export default function OrderDetailPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-ink-soft md:px-6">
          Loading order…
        </div>
      }
    >
      <OrderDetail params={params} />
    </Suspense>
  );
}

async function OrderDetail({ params }: Props) {
  const { orderNumber } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Account</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Order {orderNumber}
      </h1>
      <p className="mt-3 text-ink-soft">
        Detail stub for line items, payment status, and fulfillment. Load from{" "}
        <code className="text-sm">orders</code> /{" "}
        <code className="text-sm">order_items</code> by{" "}
        <code className="text-sm">order_number</code>.
      </p>
      <Link
        href="/account/orders"
        className="mt-6 inline-flex text-sm font-semibold text-signal"
      >
        ← All orders
      </Link>
    </div>
  );
}
