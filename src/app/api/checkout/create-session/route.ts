import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/orders";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    shippingAddress?: Record<string, unknown>;
  } | null;

  if (!body?.email || typeof body.email !== "string" || !body.email.includes("@")) {
    return NextResponse.json({ error: "valid email is required" }, { status: 400 });
  }

  const shippingAddress = body.shippingAddress ?? {
    note: "Address capture pending — Stripe collects shipping if configured",
  };

  const result = await createCheckoutSession({
    email: body.email,
    shippingAddress,
  });

  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
