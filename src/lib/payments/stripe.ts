import Stripe from "stripe";
import type {
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  ParsedWebhookEvent,
  PaymentStatus,
  PaymentsAdapter,
} from "./types";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
}

function mapStripeStatus(
  status: string | null | undefined,
): PaymentStatus | "unknown" {
  switch (status) {
    case "complete":
    case "succeeded":
    case "paid":
      return "succeeded";
    case "processing":
      return "processing";
    case "requires_action":
    case "requires_payment_method":
    case "requires_confirmation":
    case "open":
      return "requires_action";
    case "canceled":
    case "cancelled":
    case "failed":
      return "failed";
    default:
      return "unknown";
  }
}

/**
 * Stripe implementation of the thin payments adapter.
 * Domain code should import from `@/lib/payments`, not this module.
 */
export const stripePaymentsAdapter: PaymentsAdapter = {
  provider: "stripe",

  async createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult> {
    const stripe = getStripe();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      input.lineItems && input.lineItems.length > 0
        ? input.lineItems.map((item) => ({
            quantity: item.quantity,
            price_data: {
              currency: (item.currency ?? input.currency).toLowerCase(),
              unit_amount: item.amountCents,
              product_data: { name: item.name },
            },
          }))
        : [
            {
              quantity: 1,
              price_data: {
                currency: input.currency.toLowerCase(),
                unit_amount: input.amountCents ?? 0,
                product_data: {
                  name:
                    input.kind === "donation"
                      ? "Fixed Reaction donation"
                      : "Fixed Reaction order",
                },
              },
            },
          ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.customerEmail,
      metadata: {
        kind: input.kind,
        ...input.metadata,
      },
      line_items: lineItems,
    });

    return {
      provider: "stripe",
      sessionId: session.id,
      url: session.url,
    };
  },

  async parseWebhookEvent(
    payload: string | Buffer,
    signatureHeader: string | null,
  ): Promise<ParsedWebhookEvent | null> {
    const stripe = getStripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;
    if (secret && signatureHeader) {
      event = stripe.webhooks.constructEvent(payload, signatureHeader, secret);
    } else if (process.env.NODE_ENV !== "production" && !secret) {
      // Local stub: accept unsigned JSON when webhook secret is unset.
      event = JSON.parse(
        typeof payload === "string" ? payload : payload.toString("utf8"),
      ) as Stripe.Event;
    } else {
      throw new Error("STRIPE_WEBHOOK_SECRET is required to verify webhooks");
    }

    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded" &&
      event.type !== "checkout.session.async_payment_failed" &&
      event.type !== "payment_intent.succeeded" &&
      event.type !== "payment_intent.payment_failed"
    ) {
      return null;
    }

    const obj = event.data.object as
      | Stripe.Checkout.Session
      | Stripe.PaymentIntent;

    const metadata =
      (obj.metadata as Record<string, string> | null | undefined) ?? {};

    let sessionId: string | undefined;
    let paymentIntentId: string | undefined;
    let amountCents: number | undefined;
    let currency: string | undefined;
    let status: PaymentStatus | "unknown" = "unknown";

    if (event.type.startsWith("checkout.session")) {
      const session = obj as Stripe.Checkout.Session;
      sessionId = session.id;
      paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;
      amountCents = session.amount_total ?? undefined;
      currency = session.currency?.toUpperCase();
      status =
        event.type === "checkout.session.async_payment_failed"
          ? "failed"
          : mapStripeStatus(session.payment_status);
    } else {
      const pi = obj as Stripe.PaymentIntent;
      paymentIntentId = pi.id;
      amountCents = pi.amount;
      currency = pi.currency?.toUpperCase();
      status = mapStripeStatus(pi.status);
    }

    return {
      type: event.type,
      providerEventId: event.id,
      sessionId,
      paymentIntentId,
      status,
      metadata,
      amountCents,
      currency,
      raw: event,
    };
  },
};
