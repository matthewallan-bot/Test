import { NextResponse } from "next/server";
import {
  addOrUpdateCartItem,
  getCart,
  setCartItemQuantity,
} from "@/lib/cart";

export async function GET() {
  const cart = await getCart();
  if (cart === null) {
    return NextResponse.json(
      {
        items: [],
        subtotalCents: 0,
        currency: "USD",
        message: "DATABASE_URL not set — cart requires Postgres",
      },
      { status: 200 },
    );
  }
  return NextResponse.json(cart);
}

/** Add to cart (increments quantity when SKU already present). Body: { sku, quantity? } */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    sku?: string;
    quantity?: number;
  } | null;
  if (!body?.sku || typeof body.sku !== "string") {
    return NextResponse.json({ error: "sku is required" }, { status: 400 });
  }
  const quantity = body.quantity ?? 1;
  const result = await addOrUpdateCartItem(body.sku, quantity);
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}

/** Set absolute quantity (0 removes). Body: { sku, quantity } */
export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    sku?: string;
    quantity?: number;
  } | null;
  if (!body?.sku || typeof body.sku !== "string") {
    return NextResponse.json({ error: "sku is required" }, { status: 400 });
  }
  if (typeof body.quantity !== "number") {
    return NextResponse.json({ error: "quantity is required" }, { status: 400 });
  }
  const result = await setCartItemQuantity(body.sku, body.quantity);
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
