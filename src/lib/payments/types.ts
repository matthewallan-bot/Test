export type PaymentKind = "checkout" | "donation";

export type PaymentStatus =
  | "requires_action"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded";

export type CreateCheckoutSessionInput = {
  kind: PaymentKind;
  amountCents: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
};

export type CreateCheckoutSessionResult = {
  provider: string;
  sessionId: string;
  url: string | null;
};

export type PaymentsAdapter = {
  readonly provider: string;
  createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult>;
};
