"use client";

import Link from "next/link";
import { useState, type FormEvent, type ChangeEvent } from "react";

import { SiteLayout } from "@/components/sevo/layout";
import { sevoNumber, type Product } from "@/content/products";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useBagTotals } from "@/lib/bag";

type FulfillmentMethod = "DELIVERY" | "PICKUP";

type CheckoutStage = "DETAILS" | "PAYMENT" | "SUBMITTED";

const DELIVERY_FEE = 10_000;
const PICKUP_FEE = 0;

const VODACOM_LIPA_NUMBER = "ADD_VODACOM_LIPA_NUMBER_HERE";

const PICKUP_LOCATION = {
  name: "SEVO — Mlimani City",
  city: "Dar es Salaam",
  label: "Mlimani City, Dar es Salaam",
};

function makePreviewReference() {
  return `SEVO-PREVIEW-${Date.now().toString(36).toUpperCase()}`;
}

export default function CheckoutContent() {
  const { detailed, subtotal } = useBagTotals();

  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("DELIVERY");

  const [stage, setStage] = useState<CheckoutStage>("DETAILS");

  const [submitting, setSubmitting] = useState(false);

  const [previewReference, setPreviewReference] = useState<string | null>(null);

  const [paymentReference, setPaymentReference] = useState("");

  const [payerPhone, setPayerPhone] = useState("");

  const [receipt, setReceipt] = useState<File | null>(null);

  const delivery = fulfillment === "DELIVERY" ? DELIVERY_FEE : PICKUP_FEE;

  const total = subtotal + delivery;

  const submitDetails = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);

    const reference = makePreviewReference();

    setPreviewReference(reference);
    setStage("PAYMENT");

    setSubmitting(false);
  };

  const submitPayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!paymentReference.trim()) {
      return;
    }

    setSubmitting(true);

    /*
     * FRONTEND-ONLY STATE
     * -------------------
     * Laravel will later:
     *
     * 1. Re-check product price and stock.
     * 2. Create the order transactionally.
     * 3. Reserve inventory for 60 minutes.
     * 4. Persist the payment submission.
     * 5. Verify the payment independently from admin.
     *
     * This client-side stage does NOT represent a real payment.
     */

    setStage("SUBMITTED");
    setSubmitting(false);
  };

  const handleReceiptChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setReceipt(file);
  };

  const restartCheckout = () => {
    setStage("DETAILS");
    setPreviewReference(null);
    setPaymentReference("");
    setPayerPhone("");
    setReceipt(null);
  };

  if (stage === "SUBMITTED") {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-5 py-24 md:py-32">
          <p className="sevo-meta text-muted-foreground">PAYMENT SUBMITTED</p>

          <h1 className="sevo-display mt-6 text-4xl md:text-5xl">
            Payment received for review
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
            Your payment reference has been submitted for manual verification.
            Payment submission does not mean the payment has been verified yet.
          </p>

          <div className="sevo-rule mt-10 space-y-5 pt-5">
            <div className="flex justify-between gap-6 text-sm">
              <span className="text-muted-foreground">Checkout reference</span>

              <span className="sevo-meta text-right">{previewReference}</span>
            </div>

            <div className="flex justify-between gap-6 text-sm">
              <span className="text-muted-foreground">Fulfilment</span>

              <span className="text-right">
                {fulfillment === "DELIVERY" ? "Delivery" : "Pickup"}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-sm">
              <span className="text-muted-foreground">Destination</span>

              <span className="text-right">
                {fulfillment === "DELIVERY"
                  ? "Customer delivery address"
                  : PICKUP_LOCATION.label}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-sm">
              <span className="text-muted-foreground">Amount submitted</span>

              <span className="font-medium">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-10 border border-border p-5">
            <p className="sevo-label">Important</p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Do not make another payment for this order unless SEVO instructs
              you to do so. Once the manual verification process is connected to
              the SEVO backend, your order status will update from
              PAYMENT_SUBMITTED to the appropriate verified or correction state.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-6">
            <Link
              href="/shop"
              className="sevo-label border-b border-foreground pb-1"
            >
              Continue shopping
            </Link>

            <button
              type="button"
              onClick={restartCheckout}
              className="sevo-label border-b border-border pb-1 text-muted-foreground"
            >
              Return to checkout
            </button>
          </div>

          <p className="sevo-meta mt-12 text-muted-foreground">
            Frontend development state — live order creation and payment
            verification are not connected yet.
          </p>
        </div>
      </SiteLayout>
    );
  }

  if (stage === "PAYMENT") {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
          <button
            type="button"
            onClick={() => setStage("DETAILS")}
            className="sevo-meta text-muted-foreground"
          >
            ← Back to order details
          </button>

          <div className="mt-10 max-w-2xl">
            <p className="sevo-meta text-muted-foreground">PAYMENT</p>

            <h1 className="sevo-display mt-4 text-4xl md:text-5xl">
              Complete your payment
            </h1>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Pay the exact order total using the SEVO Vodacom Lipa Namba below,
              then submit the transaction reference for manual verification.
            </p>
          </div>

          <div className="mt-12 grid gap-14 md:grid-cols-[1.3fr_1fr] md:gap-20">
            <form onSubmit={submitPayment} className="space-y-10">
              <section>
                <div className="sevo-label border-b border-border pb-4">
                  01 — Vodacom Lipa Namba
                </div>

                <div className="mt-6 border border-border p-6">
                  <div className="flex items-center gap-4">
                    <VodacomMark />

                    <div>
                      <p className="sevo-label">Vodacom</p>

                      <p className="sevo-meta mt-1 text-muted-foreground">
                        Merchant payment
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="sevo-meta text-muted-foreground">
                      Lipa Namba
                    </p>

                    <p className="mt-2 break-all text-2xl font-medium tracking-wide">
                      {VODACOM_LIPA_NUMBER}
                    </p>

                    <p className="mt-4 text-xs leading-6 text-muted-foreground">
                      The merchant number will be added here once the SEVO
                      Vodacom merchant account is registered.
                    </p>
                  </div>

                  <div className="sevo-rule mt-8 space-y-3 pt-5 text-sm">
                    <div className="flex justify-between gap-5">
                      <span className="text-muted-foreground">
                        Amount to pay
                      </span>

                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>

                    <div className="flex justify-between gap-5">
                      <span className="text-muted-foreground">Currency</span>

                      <span>TZS</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="sevo-label border-b border-border pb-4">
                  02 — Submit payment evidence
                </div>

                <div className="mt-6 space-y-7">
                  <Field
                    label="Transaction / reference ID"
                    name="paymentReference"
                    required
                    value={paymentReference}
                    onChange={(event) =>
                      setPaymentReference(event.target.value)
                    }
                  />

                  <Field
                    label="Payer phone number (optional)"
                    name="payerPhone"
                    type="tel"
                    value={payerPhone}
                    onChange={(event) => setPayerPhone(event.target.value)}
                  />

                  <label className="block">
                    <span className="sevo-meta text-muted-foreground">
                      Payment receipt / screenshot (optional)
                    </span>

                    <input
                      name="receipt"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleReceiptChange}
                      className="mt-3 block w-full border border-border bg-transparent px-3 py-3 text-sm file:mr-4 file:border-0 file:bg-transparent file:text-sm"
                    />

                    <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                      {receipt
                        ? receipt.name
                        : "Optional supporting evidence. File upload will be connected to Laravel later."}
                    </span>
                  </label>
                </div>
              </section>

              <section>
                <div className="sevo-label border-b border-border pb-4">
                  03 — Future online gateway
                </div>

                <div className="mt-6 border border-dashed border-border p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-sm font-medium">
                        Online payment gateway
                      </p>

                      <p className="mt-2 text-xs leading-6 text-muted-foreground">
                        Reserved for a future integrated payment gateway
                        supporting automated payment collection and
                        verification.
                      </p>
                    </div>

                    <span className="sevo-meta whitespace-nowrap text-muted-foreground">
                      COMING SOON
                    </span>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={submitting || paymentReference.trim().length === 0}
                className="sevo-label w-full bg-foreground py-4 text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Submitting" : "Submit payment reference"}
              </button>

              <p className="sevo-meta text-muted-foreground">
                Payment references are manually verified before fulfilment.
                Submission does not equal payment verification.
              </p>
            </form>

            <aside className="md:sticky md:top-24 md:self-start">
              <OrderSummary
                detailed={detailed}
                subtotal={subtotal}
                delivery={delivery}
                total={total}
                fulfillment={fulfillment}
              />
            </aside>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (detailed.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-5 py-24 text-center md:py-32">
          <h1 className="sevo-display text-3xl">Nothing to check out</h1>

          <Link
            href="/shop"
            className="sevo-label mt-8 inline-block border-b border-foreground pb-1"
          >
            Explore the selection
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
        <h1 className="sevo-display text-4xl md:text-5xl">Checkout</h1>

        <p className="sevo-meta mt-4 text-muted-foreground">
          Guest checkout — no account required
        </p>

        <form
          onSubmit={submitDetails}
          className="mt-12 grid gap-14 md:grid-cols-[1.3fr_1fr] md:gap-20"
        >
          <div className="space-y-12">
            <fieldset>
              <legend className="sevo-label border-b border-border pb-4">
                Contact
              </legend>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" name="name" required />

                <Field label="Phone" name="phone" type="tel" required />

                <div className="sm:col-span-2">
                  <Field label="Email" name="email" type="email" required />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="sevo-label border-b border-border pb-4">
                Fulfilment
              </legend>

              <div className="mt-6 grid gap-3">
                <label
                  className={cn(
                    "flex cursor-pointer items-start justify-between gap-6 border px-5 py-5",
                    fulfillment === "DELIVERY"
                      ? "border-foreground"
                      : "border-border",
                  )}
                >
                  <span className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="fulfillment"
                      value="DELIVERY"
                      checked={fulfillment === "DELIVERY"}
                      onChange={() => setFulfillment("DELIVERY")}
                      className="mt-1 accent-foreground"
                    />

                    <span>
                      <span className="text-sm font-medium">Delivery</span>

                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        Nationwide delivery across Tanzania.
                      </span>
                    </span>
                  </span>

                  <span className="sevo-meta whitespace-nowrap">
                    {formatPrice(DELIVERY_FEE)}
                  </span>
                </label>

                <label
                  className={cn(
                    "flex cursor-pointer items-start justify-between gap-6 border px-5 py-5",
                    fulfillment === "PICKUP"
                      ? "border-foreground"
                      : "border-border",
                  )}
                >
                  <span className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="fulfillment"
                      value="PICKUP"
                      checked={fulfillment === "PICKUP"}
                      onChange={() => setFulfillment("PICKUP")}
                      className="mt-1 accent-foreground"
                    />

                    <span>
                      <span className="text-sm font-medium">Pickup</span>

                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        Collect your order from Mlimani City, Dar es Salaam.
                      </span>
                    </span>
                  </span>

                  <span className="sevo-meta whitespace-nowrap">FREE</span>
                </label>
              </div>
            </fieldset>

            {fulfillment === "DELIVERY" ? (
              <fieldset>
                <legend className="sevo-label border-b border-border pb-4">
                  Delivery details
                </legend>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Delivery address" name="address" required />
                  </div>

                  <Field
                    label="City"
                    name="city"
                    defaultValue="Dar es Salaam"
                    required
                  />

                  <Field label="Region" name="region" required />

                  <div className="sm:col-span-2">
                    <Field label="Delivery notes (optional)" name="notes" />
                  </div>
                </div>
              </fieldset>
            ) : (
              <fieldset>
                <legend className="sevo-label border-b border-border pb-4">
                  Pickup details
                </legend>

                <div className="mt-6 border border-border p-5">
                  <p className="sevo-meta text-muted-foreground">
                    Pickup location
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {PICKUP_LOCATION.name}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {PICKUP_LOCATION.city}
                  </p>

                  <p className="mt-5 text-xs leading-6 text-muted-foreground">
                    Pickup instructions and collection timing will be provided
                    after payment verification.
                  </p>
                </div>
              </fieldset>
            )}

            <section>
              <div className="sevo-label border-b border-border pb-4">
                Payment
              </div>

              <div className="mt-6 border border-border p-5">
                <p className="text-sm font-medium">Manual Vodacom Lipa Namba</p>

                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  After reviewing your order, you will receive the SEVO Vodacom
                  Lipa Namba and submit your transaction reference for manual
                  verification.
                </p>

                <p className="mt-5 text-xs leading-6 text-muted-foreground">
                  Payment is required for both delivery and pickup. Cash,
                  pay-on-delivery and pay-on-pickup are not enabled.
                </p>
              </div>
            </section>
          </div>

          <aside className="md:sticky md:top-24 md:self-start">
            <OrderSummary
              detailed={detailed}
              subtotal={subtotal}
              delivery={delivery}
              total={total}
              fulfillment={fulfillment}
            />

            <button
              type="submit"
              disabled={submitting}
              className="sevo-label mt-8 w-full bg-foreground py-4 text-background transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {submitting ? "Preparing" : "Continue to payment"}
            </button>

            <p className="sevo-meta mt-5 text-muted-foreground">
              Stock will be reserved by the backend when the order is created.
              The planned reservation period is 1 hour.
            </p>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}

function OrderSummary({
  detailed,
  subtotal,
  delivery,
  total,
  fulfillment,
}: {
  detailed: Array<{
    line: {
      productId: string;
      size: string;
      quantity: number;
    };
    product: Product;
  }>;
  subtotal: number;
  delivery: number;
  total: number;
  fulfillment: FulfillmentMethod;
}) {
  return (
    <section>
      <h2 className="sevo-label border-b border-border pb-4">Order</h2>

      <ul className="mt-5 space-y-4">
        {detailed.map(({ line, product }) => (
          <li
            key={`${line.productId}-${line.size}`}
            className="flex justify-between gap-4 text-sm"
          >
            <span>
              <span className="sevo-meta block text-muted-foreground">
                {sevoNumber(product)}
              </span>
              {product.name} — size {line.size} × {line.quantity}
            </span>

            <span className="sevo-meta whitespace-nowrap">
              {formatPrice(product.price * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="sevo-rule mt-6 space-y-3 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>

          <dd>{formatPrice(subtotal)}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            {fulfillment === "DELIVERY" ? "Delivery" : "Pickup"}
          </dt>

          <dd>{delivery === 0 ? "FREE" : formatPrice(delivery)}</dd>
        </div>

        <div className="sevo-rule flex justify-between pt-3">
          <dt className="sevo-label">Total</dt>

          <dd className="font-medium">{formatPrice(total)}</dd>
        </div>
      </dl>
    </section>
  );
}

function VodacomMark() {
  return (
    <div
      aria-label="Vodacom"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e60000] text-white"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6">
        <path
          d="M8.5 8.5c4.8-4.8 10.2-4.8 15 0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
        />

        <path
          d="M9 9.5c5.1 5.6 8.2 11.2 7 14"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
        />

        <circle cx="16" cy="9" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="sevo-meta text-muted-foreground">{label}</span>

      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className="mt-2 w-full border-b border-input bg-transparent pb-2 text-sm outline-none focus:border-foreground"
      />
    </label>
  );
}
