import { stripePaymentsAdapter } from "./stripe";
import type { PaymentsAdapter } from "./types";

export type {
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  PaymentKind,
  PaymentStatus,
  PaymentsAdapter,
} from "./types";

/**
 * Thin payments adapter entrypoint.
 * Stripe is the locked production provider; Square can plug in later.
 */
export function getPaymentsAdapter(): PaymentsAdapter {
  const provider = process.env.PAYMENTS_PROVIDER ?? "stripe";
  if (provider === "stripe") {
    return stripePaymentsAdapter;
  }
  throw new Error(`Unsupported payments provider: ${provider}`);
}
