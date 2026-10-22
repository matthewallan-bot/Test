import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { formatMoney } from "@/lib/catalog";
import { listOrdersForUser } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Orders",
};

function formatStatus(status: string): string {
  return status.replaceAll("_", " ");
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Account</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Order history
      </h1>
      <p className="mt-3 text-ink-soft">
        Paid and pending orders for your signed-in account.
      </p>
      <Suspense
        fallback={
          <div className="mt-8 border border-dashed border-ink/20 px-4 py-10 text-center text-ink-soft">
            Loading orders…
          </div>
        }
      >
        <OrdersList />
      </Suspense>
    </div>
  );
}

async function OrdersList() {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="mt-8 border border-dashed border-ink/20 px-4 py-10 text-center text-ink-soft">
        Sign in to view orders.{" "}
        <Link href="/auth/sign-in" className="font-semibold text-signal">
          Sign in
        </Link>
      </div>
    );
  }

  const orders = await listOrdersForUser(userId);

  if (orders.length === 0) {
    return (
      <div className="mt-8 border border-dashed border-ink/20 px-4 py-10 text-center text-ink-soft">
        No orders yet.{" "}
        <Link href="/merch" className="font-semibold text-signal">
          Shop merch
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-ink/10 border border-ink/15 bg-paper/70">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
            className="flex flex-col gap-1 px-4 py-4 transition hover:bg-ink/[0.03] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-ink">{order.orderNumber}</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                {formatDate(order.placedAt ?? order.createdAt)} ·{" "}
                {order.itemCount}{" "}
                {order.itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-semibold text-ink">
                {formatMoney(order.totalCents, order.currency)}
              </p>
              <p className="mt-0.5 text-sm capitalize text-steel">
                {formatStatus(order.status)}
                {order.fulfillmentStatus !== "unfulfilled"
                  ? ` · ${formatStatus(order.fulfillmentStatus)}`
                  : ""}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
