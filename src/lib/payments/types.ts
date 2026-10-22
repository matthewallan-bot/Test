export type PaymentKind = "checkout" | "donation";

export type PaymentStatus =
  | "requires_action"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded";

export type CheckoutLineItem = {
  name: string;
  amountCents: number;
  quantity: number;
  currency?: string;
};

export type CreateCheckoutSessionInput = {
  kind: PaymentKind;
  /** Total amount when using a single synthetic line item (legacy / donation). */
  amountCents?: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
  /** Multi-line merch cart; preferred for checkout kind. */
  lineItems?: CheckoutLineItem[];
};

export type CreateCheckoutSessionResult = {
  provider: string;
  sessionId: string;
  url: string | null;
};

export type ParsedWebhookEvent = {
  type: string;
  providerEventId: string;
  sessionId?: string;
  paymentIntentId?: string;
  status: PaymentStatus | "unknown";
  metadata: Record<string, string>;
  amountCents?: number;
  currency?: string;
  raw: unknown;
};

export type PaymentsAdapter = {
  readonly provider: string;
  createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult>;
  /**
   * Verify + parse a provider webhook payload.
   * Returns null when the event is irrelevant or signature verification fails.
   */
  parseWebhookEvent(
    payload: string | Buffer,
    signatureHeader: string | null,
  ): Promise<ParsedWebhookEvent | null>;
};
