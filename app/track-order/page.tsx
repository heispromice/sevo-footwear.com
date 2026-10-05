"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { SiteLayout } from "@/components/sevo/layout";
import { OrderStatus } from "@/components/sevo/order-status";
import {
  previewOrderByDisplayNumber,
  previewProductById,
} from "@/content/order-preview";
import { imageFor } from "@/content/images";
import { formatPrice } from "@/lib/money";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [searched, setSearched] = useState(false);

  const order =
    searched && orderNumber.trim()
      ? previewOrderByDisplayNumber(orderNumber)
      : undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearched(true);
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1000px] px-5 py-12 md:px-10 md:py-20">
        <Link href="/account" className="sevo-meta text-muted-foreground">
          ← Account
        </Link>

        <div className="mt-10 max-w-2xl border-b border-border pb-6">
          <p className="sevo-meta text-muted-foreground">GUEST ORDER</p>

          <h1 className="sevo-display mt-3 text-4xl md:text-5xl">
            Track your order
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Enter your SEVO order number and the email or phone number used when
            placing the order.
          </p>
        </div>

        <div className="mt-10 border border-dashed border-border p-5">
          <p className="sevo-label">Development preview</p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Guest tracking will eventually validate these details securely
            against the SEVO backend. No order data should be trusted from the
            browser alone.
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 max-w-xl space-y-6">
          <Field
            id="track-order-number"
            label="Order number"
            value={orderNumber}
            onChange={setOrderNumber}
            placeholder="e.g. SEVO-1001"
          />

          <Field
            id="track-contact"
            label="Email or phone number"
            value={contact}
            onChange={setContact}
            placeholder="The contact used at checkout"
          />

          <button
            type="submit"
            disabled={!orderNumber.trim() || !contact.trim()}
            className="sevo-label h-12 w-full bg-foreground text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Find order
          </button>
        </form>

        {searched && !order && (
          <div className="mt-10 border border-border p-6">
            <p className="sevo-label">Order not found</p>

            <h2 className="sevo-display mt-3 text-2xl">
              We could not find that order.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
              Check the order number and the contact details used at checkout.
            </p>

            <p className="mt-5 text-xs leading-6 text-muted-foreground">
              In the final system, guest tracking will also use server-side
              authorization and a secure tracking mechanism.
            </p>
          </div>
        )}

        {order && (
          <div className="mt-12">
            <div className="flex flex-col justify-between gap-3 border-b border-border pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="sevo-meta text-muted-foreground">
                  {order.displayNumber}
                </p>

                <h2 className="sevo-display mt-2 text-3xl">Order status</h2>
              </div>

              <p className="text-sm">{formatPrice(order.total)}</p>
            </div>

            <div className="mt-8">
              <OrderStatus
                status={order.status}
                fulfillment={order.fulfillment}
              />
            </div>

            <div className="mt-8 border border-border p-5">
              <p className="sevo-label">Order summary</p>

              <div className="mt-5 space-y-5">
                {order.items.map((item) => {
                  const product = previewProductById(item.productId);

                  if (!product) {
                    return null;
                  }

                  return (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex gap-4"
                    >
                      <img
                        src={imageFor(product.images[0])}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="h-20 w-20 shrink-0 bg-paper object-cover"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          EU {item.size} × {item.quantity}
                        </p>
                      </div>

                      <p className="sevo-meta">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              <Link
                href="/shop"
                className="sevo-label border-b border-foreground pb-1"
              >
                Continue shopping
              </Link>

              <Link
                href="/account"
                className="sevo-label border-b border-border pb-1 text-muted-foreground"
              >
                Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="sevo-label mb-2 block">{label}</span>

      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        required
        className="h-12 w-full border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-foreground placeholder:text-muted-foreground"
      />
    </label>
  );
}
