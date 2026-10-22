import { NextResponse } from "next/server";
import { applyPaymentWebhook } from "@/lib/orders";
import { getPaymentsAdapter } from "@/lib/payments";

/**
 * Stripe webhook handler — updates `payments` + orders/donations status.
 * Set STRIPE_WEBHOOK_SECRET in production. Without it (local only), unsigned
 * JSON payloads are accepted for stub testing.
 */
export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  try {
    const adapter = getPaymentsAdapter();
    const event = await adapter.parseWebhookEvent(payload, signature);
    if (!event) {
      return NextResponse.json({ received: true, ignored: true });
    }

    await applyPaymentWebhook({
      sessionId: event.sessionId,
      paymentIntentId: event.paymentIntentId,
      status: event.status,
      metadata: event.metadata,
      raw: event.raw,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "webhook error" },
      { status: 400 },
    );
  }
}
