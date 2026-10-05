/**
 * Payment abstraction layer.
 *
 * No live payment provider is wired up. Every provider below is declared but
 * only the `mock` provider is implemented, so checkout can be exercised end to
 * end without credentials.
 *
 * TODO(payments): implement real providers server-side (never in the browser):
 *   - M-Pesa (Vodacom Tanzania)   – USSD push / STK
 *   - Airtel Money
 *   - Tigo Pesa (Mixx by Yas)
 *   - Card payments (Stripe / Flutterwave / DPO)
 * Each provider should be added as a `PaymentProvider` implementation calling a
 * server function; the checkout UI must not change.
 */

export type PaymentProviderId = "mock" | "mpesa" | "airtel" | "tigopesa" | "card";

export interface PaymentIntent {
  reference: string;
  amount: number;
  currency: string;
  provider: PaymentProviderId;
}

export interface PaymentResult {
  status: "succeeded" | "failed" | "pending";
  reference: string;
  message: string;
}

export interface PaymentProvider {
  id: PaymentProviderId;
  label: string;
  /** Available in this build. Unimplemented providers stay disabled. */
  enabled: boolean;
  note: string;
  pay?: (intent: PaymentIntent) => Promise<PaymentResult>;
}

const mockProvider: PaymentProvider = {
  id: "mock",
  label: "Demo payment (no money moves)",
  enabled: true,
  note: "Mock integration — clearly labelled, for demonstration only.",
  async pay(intent) {
    await new Promise((r) => setTimeout(r, 900));
    return {
      status: "succeeded",
      reference: intent.reference,
      message: "Demo order recorded. No payment was taken.",
    };
  },
};

export const paymentProviders: PaymentProvider[] = [
  mockProvider,
  { id: "mpesa", label: "M-Pesa", enabled: false, note: "Not connected yet." },
  { id: "airtel", label: "Airtel Money", enabled: false, note: "Not connected yet." },
  { id: "tigopesa", label: "Mixx by Yas / Tigo Pesa", enabled: false, note: "Not connected yet." },
  { id: "card", label: "Card", enabled: false, note: "Not connected yet." },
];

export function getProvider(id: PaymentProviderId): PaymentProvider {
  return paymentProviders.find((p) => p.id === id) ?? mockProvider;
}

export function newReference(): string {
  return `SEVO-${Date.now().toString(36).toUpperCase()}`;
}
