import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { formatMoney } from "@/lib/catalog";
import { getOrderForUser } from "@/lib/orders";

type Props = { params: Promise<{ orderNumber: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Order ${decodeURIComponent(orderNumber)}` };
}

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

function addressLines(address: Record<string, unknown>): string[] {
  const lines: string[] = [];
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const value = address[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return null;
  };
  const name = pick("name", "fullName", "full_name");
  const line1 = pick("line1", "address1", "street");
  const line2 = pick("line2", "address2");
  const city = pick("city");
  const region = pick("region", "state", "province");
  const postal = pick("postal_code", "postalCode", "zip");
  const country = pick("country");
  if (name) lines.push(name);
  if (line1) lines.push(line1);
  if (line2) lines.push(line2);
  const cityLine = [city, region, postal].filter(Boolean).join(", ");
  if (cityLine) lines.push(cityLine);
  if (country) lines.push(country);
  return lines;
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
  await connection();
  const { orderNumber: raw } = await params;
  const orderNumber = decodeURIComponent(raw);
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-ink-soft">
          Sign in to view this order.{" "}
          <Link href="/auth/sign-in" className="font-semibold text-signal">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  const order = await getOrderForUser(userId, orderNumber);
  if (!order) notFound();

  const ship = addressLines(order.shippingAddress);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Account</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Order {order.orderNumber}
      </h1>
      <p className="mt-3 capitalize text-ink-soft">
        {formatStatus(order.status)}
        {order.fulfillmentStatus !== "unfulfilled"
          ? ` · ${formatStatus(order.fulfillmentStatus)}`
          : ""}{" "}
        · {formatDate(order.placedAt ?? order.createdAt)}
      </p>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-[0.2em] text-steel">
          Line items
        </h2>
        <ul className="mt-3 divide-y divide-ink/10 border border-ink/15 bg-paper/70">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="font-semibold text-ink">{item.productName}</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {item.variantName} · SKU {item.sku}
                </p>
                <p className="mt-0.5 text-sm text-steel">Qty {item.quantity}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold text-ink">
                  {formatMoney(item.lineTotalCents, order.currency)}
                </p>
                <p className="mt-0.5 text-sm text-steel">
                  {formatMoney(item.unitPriceCents, order.currency)} each
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-steel">
            Totals
          </h2>
          <dl className="mt-3 space-y-2 text-sm text-ink">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd>{formatMoney(order.subtotalCents, order.currency)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Shipping</dt>
              <dd>{formatMoney(order.shippingCents, order.currency)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Tax</dt>
              <dd>{formatMoney(order.taxCents, order.currency)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-ink/10 pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatMoney(order.totalCents, order.currency)}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-steel">
            Shipping
          </h2>
          <p className="mt-3 text-sm text-ink-soft">{order.email}</p>
          {ship.length > 0 ? (
            <address className="mt-2 not-italic text-sm leading-relaxed text-ink">
              {ship.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">No address on file.</p>
          )}
        </div>
      </section>

      <Link
        href="/account/orders"
        className="mt-8 inline-flex text-sm font-semibold text-signal"
      >
        ← All orders
      </Link>
    </div>
  );
}
