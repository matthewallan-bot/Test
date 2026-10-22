import { getOrCreateCartSessionKey } from "@/lib/cart-cookie";
import { getVariantBySku } from "@/lib/catalog";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";

export type CartLine = {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type CartView = {
  id: string;
  currency: string;
  items: CartLine[];
  subtotalCents: number;
};

async function resolveOwner(): Promise<{
  userId: string | null;
  sessionKey: string;
}> {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const sessionKey = await getOrCreateCartSessionKey();
  return { userId, sessionKey };
}

async function getOrCreateCartId(
  userId: string | null,
  sessionKey: string,
): Promise<string> {
  if (userId) {
    const existing = await query<{ id: string }>(
      `SELECT id FROM carts WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`,
      [userId],
    );
    if (existing.rows[0]) return existing.rows[0].id;

    const guest = await query<{ id: string }>(
      `SELECT id FROM carts WHERE session_key = $1 AND user_id IS NULL LIMIT 1`,
      [sessionKey],
    );
    if (guest.rows[0]) {
      await query(`UPDATE carts SET user_id = $1, updated_at = now() WHERE id = $2`, [
        userId,
        guest.rows[0].id,
      ]);
      return guest.rows[0].id;
    }

    const created = await query<{ id: string }>(
      `INSERT INTO carts (user_id, session_key) VALUES ($1, $2) RETURNING id`,
      [userId, sessionKey],
    );
    return created.rows[0].id;
  }

  const guest = await query<{ id: string }>(
    `SELECT id FROM carts WHERE session_key = $1 LIMIT 1`,
    [sessionKey],
  );
  if (guest.rows[0]) return guest.rows[0].id;

  const created = await query<{ id: string }>(
    `INSERT INTO carts (session_key) VALUES ($1) RETURNING id`,
    [sessionKey],
  );
  return created.rows[0].id;
}

export async function getCart(): Promise<CartView | null> {
  if (!isDatabaseConfigured()) return null;

  const { userId, sessionKey } = await resolveOwner();
  const cartResult = await query<{ id: string; currency: string }>(
    userId
      ? `SELECT id, currency FROM carts WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`
      : `SELECT id, currency FROM carts WHERE session_key = $1 LIMIT 1`,
    [userId ?? sessionKey],
  );
  const cart = cartResult.rows[0];
  if (!cart) {
    return { id: "", currency: "USD", items: [], subtotalCents: 0 };
  }

  const items = await query<{
    id: string;
    variant_id: string;
    sku: string;
    product_name: string;
    variant_name: string;
    quantity: number;
    unit_price_cents: number;
  }>(
    `SELECT ci.id, ci.variant_id, v.sku, p.name AS product_name, v.name AS variant_name,
            ci.quantity, ci.unit_price_cents
     FROM cart_items ci
     JOIN product_variants v ON v.id = ci.variant_id
     JOIN products p ON p.id = v.product_id
     WHERE ci.cart_id = $1
     ORDER BY ci.created_at`,
    [cart.id],
  );

  const lines: CartLine[] = items.rows.map((row) => ({
    id: row.id,
    variantId: row.variant_id,
    sku: row.sku,
    productName: row.product_name,
    variantName: row.variant_name,
    quantity: row.quantity,
    unitPriceCents: row.unit_price_cents,
    lineTotalCents: row.quantity * row.unit_price_cents,
  }));

  return {
    id: cart.id,
    currency: cart.currency,
    items: lines,
    subtotalCents: lines.reduce((sum, line) => sum + line.lineTotalCents, 0),
  };
}

export async function addOrUpdateCartItem(
  sku: string,
  quantity: number,
): Promise<CartView | { error: string }> {
  if (!isDatabaseConfigured()) {
    return { error: "DATABASE_URL is not set — cart requires Postgres" };
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { error: "quantity must be a positive integer" };
  }

  const variant = await getVariantBySku(sku);
  if (!variant) return { error: "variant not found" };

  const { userId, sessionKey } = await resolveOwner();
  const cartId = await getOrCreateCartId(userId, sessionKey);

  await query(
    `INSERT INTO cart_items (cart_id, variant_id, quantity, unit_price_cents)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (cart_id, variant_id)
     DO UPDATE SET
       quantity = cart_items.quantity + EXCLUDED.quantity,
       unit_price_cents = EXCLUDED.unit_price_cents,
       updated_at = now()`,
    [cartId, variant.variantId, quantity, variant.unitPriceCents],
  );
  await query(`UPDATE carts SET updated_at = now() WHERE id = $1`, [cartId]);

  const cart = await getCart();
  return cart ?? { error: "failed to load cart" };
}

export async function setCartItemQuantity(
  sku: string,
  quantity: number,
): Promise<CartView | { error: string }> {
  if (!isDatabaseConfigured()) {
    return { error: "DATABASE_URL is not set — cart requires Postgres" };
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { error: "quantity must be a non-negative integer" };
  }

  const variant = await getVariantBySku(sku);
  if (!variant) return { error: "variant not found" };

  const { userId, sessionKey } = await resolveOwner();
  const cartId = await getOrCreateCartId(userId, sessionKey);

  if (quantity === 0) {
    await query(
      `DELETE FROM cart_items WHERE cart_id = $1 AND variant_id = $2`,
      [cartId, variant.variantId],
    );
  } else {
    await query(
      `INSERT INTO cart_items (cart_id, variant_id, quantity, unit_price_cents)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (cart_id, variant_id)
       DO UPDATE SET
         quantity = EXCLUDED.quantity,
         unit_price_cents = EXCLUDED.unit_price_cents,
         updated_at = now()`,
      [cartId, variant.variantId, quantity, variant.unitPriceCents],
    );
  }
  await query(`UPDATE carts SET updated_at = now() WHERE id = $1`, [cartId]);

  const cart = await getCart();
  return cart ?? { error: "failed to load cart" };
}

export async function clearCart(cartId: string): Promise<void> {
  if (!isDatabaseConfigured() || !cartId) return;
  await query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);
}
