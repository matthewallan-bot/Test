import { clearCart, getCart, type CartView } from "@/lib/cart";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { getPaymentsAdapter } from "@/lib/payments";

function appUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function nextOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `FR-${n}`;
}

export async function createCheckoutSession(input: {
  email: string;
  shippingAddress: Record<string, unknown>;
}): Promise<{ url: string; orderId: string } | { error: string }> {
  if (!isDatabaseConfigured()) {
    return { error: "DATABASE_URL is not set" };
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "STRIPE_SECRET_KEY is not set" };
  }

  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    return { error: "cart is empty" };
  }

  const session = await auth();
  const orderNumber = nextOrderNumber();
  const shippingCents = 0;
  const taxCents = 0;
  const totalCents = cart.subtotalCents + shippingCents + taxCents;

  const orderResult = await query<{ id: string }>(
    `INSERT INTO orders (
       order_number, user_id, email, status, currency,
       subtotal_cents, shipping_cents, tax_cents, total_cents,
       shipping_address
     ) VALUES ($1, $2, $3, 'awaiting_payment', $4, $5, $6, $7, $8, $9::jsonb)
     RETURNING id`,
    [
      orderNumber,
      session?.user?.id ?? null,
      input.email.toLowerCase(),
      cart.currency,
      cart.subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      JSON.stringify(input.shippingAddress),
    ],
  );
  const orderId = orderResult.rows[0].id;

  for (const item of cart.items) {
    await query(
      `INSERT INTO order_items (
         order_id, variant_id, sku, product_name, variant_name,
         quantity, unit_price_cents, line_total_cents
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        orderId,
        item.variantId,
        item.sku,
        item.productName,
        item.variantName,
        item.quantity,
        item.unitPriceCents,
        item.lineTotalCents,
      ],
    );
  }

  const adapter = getPaymentsAdapter();
  const checkout = await adapter.createCheckoutSession({
    kind: "checkout",
    currency: cart.currency,
    customerEmail: input.email,
    successUrl: `${appUrl()}/checkout/success?order=${encodeURIComponent(orderNumber)}`,
    cancelUrl: `${appUrl()}/checkout?cancelled=1`,
    metadata: {
      order_id: orderId,
      order_number: orderNumber,
      cart_id: cart.id,
    },
    lineItems: cart.items.map((item) => ({
      name: `${item.productName} — ${item.variantName}`,
      amountCents: item.unitPriceCents,
      quantity: item.quantity,
      currency: cart.currency,
    })),
  });

  await query(
    `INSERT INTO payments (
       kind, order_id, provider, provider_session_id,
       amount_cents, currency, status
     ) VALUES ('checkout', $1, $2, $3, $4, $5, 'requires_action')`,
    [
      orderId,
      adapter.provider,
      checkout.sessionId,
      totalCents,
      cart.currency,
    ],
  );

  if (!checkout.url) {
    return { error: "Stripe did not return a checkout URL" };
  }

  return { url: checkout.url, orderId };
}

export async function createDonationSession(input: {
  amountCents: number;
  email?: string;
  message?: string;
  isAnonymous?: boolean;
  source?: string;
}): Promise<{ url: string; donationId: string } | { error: string }> {
  if (!isDatabaseConfigured()) {
    return { error: "DATABASE_URL is not set" };
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "STRIPE_SECRET_KEY is not set" };
  }
  if (!Number.isInteger(input.amountCents) || input.amountCents < 100) {
    return { error: "amountCents must be an integer >= 100 ($1)" };
  }

  const session = await auth();
  const currency = "USD";
  const source = input.source ?? "music_page";

  const donationResult = await query<{ id: string }>(
    `INSERT INTO donations (
       user_id, email, amount_cents, currency, message, is_anonymous, status, source
     ) VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
     RETURNING id`,
    [
      session?.user?.id ?? null,
      input.email?.toLowerCase() ?? null,
      input.amountCents,
      currency,
      input.message ?? null,
      input.isAnonymous ?? false,
      source,
    ],
  );
  const donationId = donationResult.rows[0].id;

  const adapter = getPaymentsAdapter();
  const checkout = await adapter.createCheckoutSession({
    kind: "donation",
    amountCents: input.amountCents,
    currency,
    customerEmail: input.email,
    successUrl: `${appUrl()}/music?donated=1`,
    cancelUrl: `${appUrl()}/music?cancelled=1`,
    metadata: {
      donation_id: donationId,
      kind: "donation",
    },
  });

  await query(
    `INSERT INTO payments (
       kind, donation_id, provider, provider_session_id,
       amount_cents, currency, status
     ) VALUES ('donation', $1, $2, $3, $4, $5, 'requires_action')`,
    [
      donationId,
      adapter.provider,
      checkout.sessionId,
      input.amountCents,
      currency,
    ],
  );

  if (!checkout.url) {
    return { error: "Stripe did not return a checkout URL" };
  }

  return { url: checkout.url, donationId };
}

export async function applyPaymentWebhook(event: {
  sessionId?: string;
  paymentIntentId?: string;
  status: string;
  metadata: Record<string, string>;
  raw: unknown;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  if (event.status !== "succeeded" && event.status !== "failed") return;

  const payment = await query<{
    id: string;
    kind: string;
    order_id: string | null;
    donation_id: string | null;
    raw_events: unknown;
  }>(
    `SELECT id, kind::text AS kind, order_id, donation_id, raw_events
     FROM payments
     WHERE ($1::text IS NOT NULL AND provider_session_id = $1)
        OR ($2::text IS NOT NULL AND provider_payment_id = $2)
     LIMIT 1`,
    [event.sessionId ?? null, event.paymentIntentId ?? null],
  );

  let paymentId = payment.rows[0]?.id;
  let kind = payment.rows[0]?.kind;
  let orderId = payment.rows[0]?.order_id;
  let donationId = payment.rows[0]?.donation_id;
  const existingEvents = Array.isArray(payment.rows[0]?.raw_events)
    ? (payment.rows[0].raw_events as unknown[])
    : [];

  // Fallback: locate via metadata when session id was not stored yet.
  if (!paymentId && event.metadata.order_id) {
    const byOrder = await query<{ id: string }>(
      `SELECT id FROM payments WHERE order_id = $1 AND kind = 'checkout' LIMIT 1`,
      [event.metadata.order_id],
    );
    paymentId = byOrder.rows[0]?.id;
    kind = "checkout";
    orderId = event.metadata.order_id;
  }
  if (!paymentId && event.metadata.donation_id) {
    const byDonation = await query<{ id: string }>(
      `SELECT id FROM payments WHERE donation_id = $1 AND kind = 'donation' LIMIT 1`,
      [event.metadata.donation_id],
    );
    paymentId = byDonation.rows[0]?.id;
    kind = "donation";
    donationId = event.metadata.donation_id;
  }

  if (!paymentId) {
    console.warn("[payments] webhook matched no payment row", event.sessionId);
    return;
  }

  const paymentStatus = event.status === "succeeded" ? "succeeded" : "failed";
  await query(
    `UPDATE payments
     SET status = $2::payment_status,
         provider_payment_id = COALESCE($3, provider_payment_id),
         provider_session_id = COALESCE($4, provider_session_id),
         raw_events = $5::jsonb,
         updated_at = now()
     WHERE id = $1`,
    [
      paymentId,
      paymentStatus,
      event.paymentIntentId ?? null,
      event.sessionId ?? null,
      JSON.stringify([
        ...existingEvents,
        {
          at: new Date().toISOString(),
          status: paymentStatus,
          summary: { type: "webhook", sessionId: event.sessionId },
        },
      ]),
    ],
  );

  if (paymentStatus !== "succeeded") {
    if (kind === "donation" && donationId) {
      await query(
        `UPDATE donations SET status = 'failed', updated_at = now() WHERE id = $1`,
        [donationId],
      );
    }
    if (kind === "checkout" && orderId) {
      await query(
        `UPDATE orders SET status = 'cancelled', updated_at = now() WHERE id = $1`,
        [orderId],
      );
    }
    return;
  }

  if (kind === "donation" && donationId) {
    await query(
      `UPDATE donations SET status = 'paid', updated_at = now() WHERE id = $1`,
      [donationId],
    );
    return;
  }

  if (kind === "checkout" && orderId) {
    await query(
      `UPDATE orders
       SET status = 'paid', placed_at = COALESCE(placed_at, now()), updated_at = now()
       WHERE id = $1`,
      [orderId],
    );

    // Commit inventory: decrement on_hand for each line.
    const items = await query<{ variant_id: string | null; quantity: number }>(
      `SELECT variant_id, quantity FROM order_items WHERE order_id = $1`,
      [orderId],
    );
    for (const item of items.rows) {
      if (!item.variant_id) continue;
      await query(
        `UPDATE inventory_items
         SET quantity_on_hand = GREATEST(0, quantity_on_hand - $2),
             updated_at = now()
         WHERE variant_id = $1`,
        [item.variant_id, item.quantity],
      );
    }

    const cartId = event.metadata.cart_id;
    if (cartId) await clearCart(cartId);
  }
}

export type OrderListItem = {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentStatus: string;
  currency: string;
  totalCents: number;
  placedAt: string | null;
  createdAt: string;
  itemCount: number;
};

export type OrderLineItem = {
  id: string;
  sku: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentStatus: string;
  currency: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  email: string;
  shippingAddress: Record<string, unknown>;
  placedAt: string | null;
  createdAt: string;
  items: OrderLineItem[];
};

type OrderListRow = {
  id: string;
  order_number: string;
  status: string;
  fulfillment_status: string;
  currency: string;
  total_cents: number;
  placed_at: Date | string | null;
  created_at: Date | string;
  item_count: string | number;
};

type OrderDetailRow = {
  id: string;
  order_number: string;
  status: string;
  fulfillment_status: string;
  currency: string;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  email: string;
  shipping_address: Record<string, unknown>;
  placed_at: Date | string | null;
  created_at: Date | string;
};

type OrderItemRow = {
  id: string;
  sku: string;
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

function toIso(value: Date | string | null): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/** Orders for the signed-in user, newest first. Empty when DB unset or no rows. */
export async function listOrdersForUser(
  userId: string,
): Promise<OrderListItem[]> {
  if (!isDatabaseConfigured()) return [];

  const result = await query<OrderListRow>(
    `SELECT o.id, o.order_number, o.status::text AS status,
            o.fulfillment_status, o.currency, o.total_cents,
            o.placed_at, o.created_at,
            COALESCE(COUNT(oi.id), 0) AS item_count
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY COALESCE(o.placed_at, o.created_at) DESC`,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    fulfillmentStatus: row.fulfillment_status,
    currency: row.currency,
    totalCents: row.total_cents,
    placedAt: toIso(row.placed_at),
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    itemCount: Number(row.item_count),
  }));
}

/** Single order owned by the user, or null if missing / not theirs. */
export async function getOrderForUser(
  userId: string,
  orderNumber: string,
): Promise<OrderDetail | null> {
  if (!isDatabaseConfigured()) return null;

  const orderResult = await query<OrderDetailRow>(
    `SELECT id, order_number, status::text AS status, fulfillment_status,
            currency, subtotal_cents, shipping_cents, tax_cents, total_cents,
            email::text AS email, shipping_address, placed_at, created_at
     FROM orders
     WHERE user_id = $1 AND order_number = $2
     LIMIT 1`,
    [userId, orderNumber],
  );
  const order = orderResult.rows[0];
  if (!order) return null;

  const items = await query<OrderItemRow>(
    `SELECT id, sku, product_name, variant_name, quantity,
            unit_price_cents, line_total_cents
     FROM order_items
     WHERE order_id = $1
     ORDER BY product_name, variant_name`,
    [order.id],
  );

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    fulfillmentStatus: order.fulfillment_status,
    currency: order.currency,
    subtotalCents: order.subtotal_cents,
    shippingCents: order.shipping_cents,
    taxCents: order.tax_cents,
    totalCents: order.total_cents,
    email: order.email,
    shippingAddress:
      order.shipping_address && typeof order.shipping_address === "object"
        ? order.shipping_address
        : {},
    placedAt: toIso(order.placed_at),
    createdAt: toIso(order.created_at) ?? new Date().toISOString(),
    items: items.rows.map((row) => ({
      id: row.id,
      sku: row.sku,
      productName: row.product_name,
      variantName: row.variant_name,
      quantity: row.quantity,
      unitPriceCents: row.unit_price_cents,
      lineTotalCents: row.line_total_cents,
    })),
  };
}

/** Expose cart type for API responses. */
export type { CartView };
