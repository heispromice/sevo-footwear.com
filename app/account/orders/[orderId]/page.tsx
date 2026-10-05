import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteLayout } from "@/components/sevo/layout";
import { OrderStatus } from "@/components/sevo/order-status";
import { previewOrderById, previewProductById } from "@/content/order-preview";
import { imageFor } from "@/content/images";
import { sevoNumber } from "@/content/products";
import { formatPrice } from "@/lib/money";

type OrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const order = previewOrderById(orderId);

  if (!order) {
    return {
      title: "Order unavailable | SEVO",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${order.displayNumber} | SEVO`,
    description: `SEVO order ${order.displayNumber}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const order = previewOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-10 md:py-20">
        <Link
          href="/account/orders"
          className="sevo-meta text-muted-foreground"
        >
          ← Orders
        </Link>

        <div className="mt-10 border-b border-border pb-6">
          <p className="sevo-meta text-muted-foreground">
            {order.displayNumber}
          </p>

          <h1 className="sevo-display mt-3 text-4xl md:text-5xl">
            Order details
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            Placed {formatOrderDate(order.createdAt)}
          </p>
        </div>

        <div className="mt-10 border border-dashed border-border p-5">
          <p className="sevo-label">Development preview</p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This order is temporary frontend data. The final version will load
            customer-specific order data from Laravel and enforce server-side
            authorization.
          </p>
        </div>

        <div className="mt-10">
          <OrderStatus status={order.status} fulfillment={order.fulfillment} />
        </div>

        <div className="mt-10 grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
          <div>
            <section>
              <h2 className="sevo-label border-b border-border pb-4">Items</h2>

              <div className="divide-y divide-border border-b border-border">
                {order.items.map((item) => {
                  const product = previewProductById(item.productId);

                  if (!product) {
                    return null;
                  }

                  return (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex gap-5 py-6"
                    >
                      <img
                        src={imageFor(product.images[0])}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="h-28 w-28 shrink-0 bg-paper object-cover md:h-32 md:w-32"
                      />

                      <div className="flex min-w-0 flex-1 justify-between gap-5">
                        <div>
                          <p className="sevo-meta text-muted-foreground">
                            {sevoNumber(product)}
                          </p>

                          <h3 className="mt-2 text-sm font-medium">
                            {product.name}
                          </h3>

                          <p className="mt-2 text-sm text-muted-foreground">
                            EU size {item.size} × {item.quantity}
                          </p>
                        </div>

                        <p className="sevo-meta whitespace-nowrap">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="sevo-label border-b border-border pb-4">
                Fulfilment
              </h2>

              {order.fulfillment === "DELIVERY" && order.deliveryAddress && (
                <div className="mt-6 text-sm leading-7">
                  <p className="font-medium">Delivery</p>

                  <p className="mt-2 text-muted-foreground">
                    {order.deliveryAddress.address}
                    <br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.region}
                  </p>

                  {order.deliveryAddress.notes && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Note: {order.deliveryAddress.notes}
                    </p>
                  )}
                </div>
              )}

              {order.fulfillment === "PICKUP" && order.pickupLocation && (
                <div className="mt-6 text-sm leading-7">
                  <p className="font-medium">Pickup</p>

                  <p className="mt-2 text-muted-foreground">
                    {order.pickupLocation.name}
                    <br />
                    {order.pickupLocation.city}
                  </p>

                  <p className="mt-4 text-xs text-muted-foreground">
                    Collection instructions will be provided after payment
                    verification.
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside>
            <h2 className="sevo-label border-b border-border pb-4">Summary</h2>

            <dl className="sevo-rule mt-5 space-y-4 pt-5 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Subtotal</dt>

                <dd>{formatPrice(order.subtotal)}</dd>
              </div>

              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">
                  {order.fulfillment === "DELIVERY" ? "Delivery" : "Pickup"}
                </dt>

                <dd>
                  {order.deliveryFee === 0
                    ? "FREE"
                    : formatPrice(order.deliveryFee)}
                </dd>
              </div>

              <div className="sevo-rule flex justify-between gap-6 pt-4">
                <dt className="sevo-label">Total</dt>

                <dd className="font-medium">{formatPrice(order.total)}</dd>
              </div>
            </dl>

            <div className="sevo-rule mt-8 space-y-4 pt-6 text-sm">
              <div className="flex justify-between gap-6">
                <span className="text-muted-foreground">Payment</span>

                <span>
                  {order.paymentReference ? "Reference submitted" : "Pending"}
                </span>
              </div>

              {order.paymentReference && (
                <div className="flex justify-between gap-6">
                  <span className="text-muted-foreground">Reference</span>

                  <span className="sevo-meta text-right">
                    {order.paymentReference}
                  </span>
                </div>
              )}
            </div>

            {(order.status === "DELIVERED" || order.status === "COLLECTED") && (
              <div className="mt-8 border border-border p-5">
                <p className="sevo-label">Returns</p>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Returns are available within 3 days of receiving or collecting
                  the order, subject to SEVO return conditions.
                </p>

                <button
                  type="button"
                  disabled
                  className="sevo-label mt-5 border-b border-border pb-1 text-muted-foreground"
                >
                  Return request — coming soon
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-TZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
