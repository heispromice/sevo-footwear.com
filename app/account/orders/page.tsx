import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/sevo/layout";
import {
  previewOrdersForCustomer,
  previewProductById,
} from "@/content/order-preview";
import { imageFor } from "@/content/images";
import { formatPrice } from "@/lib/money";

export const metadata: Metadata = {
  title: "Orders | SEVO",
  description: "View your SEVO orders.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersPage() {
  const orders = previewOrdersForCustomer();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-10 md:py-20">
        <Link href="/account" className="sevo-meta text-muted-foreground">
          ← Account
        </Link>

        <div className="mt-10 border-b border-border pb-6">
          <p className="sevo-meta text-muted-foreground">SEVO ACCOUNT</p>

          <h1 className="sevo-display mt-3 text-4xl md:text-5xl">Orders</h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
            Review your orders, payment status and fulfilment progress.
          </p>
        </div>

        <div className="mt-10 border border-dashed border-border p-5">
          <p className="sevo-label">Development preview</p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            These orders are temporary frontend data. Real customer orders will
            be loaded securely from Laravel after authentication is connected.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="sevo-display text-2xl">No orders yet</h2>

            <Link
              href="/shop"
              className="sevo-label mt-8 inline-block border-b border-foreground pb-1"
            >
              Browse the selection
            </Link>
          </div>
        ) : (
          <div className="mt-10 divide-y divide-border border-y border-border">
            {orders.map((order) => {
              const firstItem = order.items[0];
              const product = firstItem
                ? previewProductById(firstItem.productId)
                : undefined;

              return (
                <article key={order.id} className="py-7 md:py-8">
                  <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
                    <div className="flex gap-5">
                      {product && (
                        <img
                          src={imageFor(product.images[0])}
                          alt={product.name}
                          width={160}
                          height={160}
                          className="h-24 w-24 shrink-0 bg-paper object-cover md:h-28 md:w-28"
                        />
                      )}

                      <div>
                        <p className="sevo-meta text-muted-foreground">
                          {order.displayNumber}
                        </p>

                        <h2 className="mt-2 text-base font-medium">
                          {product?.name ?? "SEVO order"}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"} ·{" "}
                          {order.fulfillment === "DELIVERY"
                            ? "Delivery"
                            : "Pickup"}
                        </p>

                        <p className="mt-2 text-sm">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="md:text-right">
                      <p className="sevo-meta text-muted-foreground">
                        {statusLabel(order.status)}
                      </p>

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="sevo-label mt-5 inline-block border-b border-foreground pb-1"
                      >
                        View order
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/track-order"
            className="sevo-label border-b border-border pb-1 text-muted-foreground"
          >
            Track a guest order
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}

function statusLabel(
  status:
    | "PENDING_PAYMENT"
    | "PAYMENT_SUBMITTED"
    | "PAYMENT_VERIFIED"
    | "PROCESSING"
    | "OUT_FOR_DELIVERY"
    | "READY_FOR_PICKUP"
    | "DELIVERED"
    | "COLLECTED"
    | "NEEDS_CORRECTION"
    | "EXPIRED"
    | "CANCELLED",
) {
  const labels: Record<typeof status, string> = {
    PENDING_PAYMENT: "Payment pending",
    PAYMENT_SUBMITTED: "Payment submitted",
    PAYMENT_VERIFIED: "Payment verified",
    PROCESSING: "Processing",
    OUT_FOR_DELIVERY: "Out for delivery",
    READY_FOR_PICKUP: "Ready for pickup",
    DELIVERED: "Delivered",
    COLLECTED: "Collected",
    NEEDS_CORRECTION: "Needs correction",
    EXPIRED: "Expired",
    CANCELLED: "Cancelled",
  };

  return labels[status];
}
