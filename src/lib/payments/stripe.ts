import Stripe from "stripe";
import type {
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  PaymentsAdapter,
} from "./types";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
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
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.customerEmail,
      metadata: {
        kind: input.kind,
        ...input.metadata,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: input.amountCents,
            product_data: {
              name:
                input.kind === "donation"
                  ? "Fixed Reaction donation"
                  : "Fixed Reaction order",
            },
          },
        },
      ],
    });

    return {
      provider: "stripe",
      sessionId: session.id,
      url: session.url,
    };
  },
};
