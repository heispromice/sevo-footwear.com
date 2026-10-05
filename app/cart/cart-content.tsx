"use client";

import Link from "next/link";

import { SiteLayout } from "@/components/sevo/layout";
import { images } from "@/content/images";
import { products, sevoNumber } from "@/content/products";
import { useCart } from "@/lib/cart";
import { useBagTotals } from "@/lib/bag";
import { formatPrice } from "@/lib/money";

export default function CartContent() {
  const { setQuantity, remove, toggleSaved, isSaved, saved } = useCart();
  const { detailed, subtotal, delivery, total } = useBagTotals();

  const savedProducts = products.filter((p) => saved.includes(p.id));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
        <h1 className="sevo-display text-4xl md:text-5xl">Your bag</h1>

        {detailed.length === 0 ? (
          <div className="mt-12">
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>

            <Link
              href="/shop"
              className="sevo-label mt-6 inline-block border-b border-foreground pb-1"
            >
              Explore the selection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-14 md:grid-cols-[1.5fr_1fr] md:gap-20">
            <ul className="divide-y divide-border border-y border-border">
              {detailed.map(({ line, product }) => (
                <li
                  key={`${line.productId}-${line.size}`}
                  className="flex gap-5 py-6"
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="w-24 shrink-0"
                  >
                    <img
                      src={images[product.images[0]]}
                      alt={product.name}
                      loading="lazy"
                      className="aspect-4/5 w-full bg-paper object-cover"
                    />
                  </Link>

                  <div className="flex-1">
                    <p className="sevo-meta text-muted-foreground">
                      {sevoNumber(product)}
                    </p>

                    <h2 className="mt-1.5 text-sm font-medium">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.brand} · Size {line.size}
                    </p>

                    <div className="mt-4 flex items-center gap-6">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          className="sevo-meta px-3 py-2"
                          onClick={() =>
                            setQuantity(
                              line.productId,
                              line.size,
                              line.quantity - 1,
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="sevo-meta w-8 text-center">
                          {line.quantity}
                        </span>

                        <button
                          type="button"
                          className="sevo-meta px-3 py-2"
                          onClick={() =>
                            setQuantity(
                              line.productId,
                              line.size,
                              line.quantity + 1,
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaved(product.id)}
                        className="sevo-meta text-muted-foreground hover:text-foreground"
                      >
                        {isSaved(product.id) ? "Saved" : "Save for later"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          remove(line.productId, line.size)
                        }
                        className="sevo-meta text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="sevo-meta whitespace-nowrap">
                    {formatPrice(product.price * line.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <aside className="md:sticky md:top-24 md:self-start">
              <h2 className="sevo-label border-b border-border pb-4">
                Summary
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <Row
                  label="Subtotal"
                  value={formatPrice(subtotal)}
                />

                <Row
                  label="Delivery"
                  value={formatPrice(delivery)}
                />

                <div className="sevo-rule pt-3">
                  <Row
                    label="Total"
                    value={formatPrice(total)}
                    strong
                  />
                </div>
              </dl>

              <Link
                href="/checkout"
                className="sevo-label mt-8 block bg-foreground py-4 text-center text-background transition-opacity hover:opacity-85"
              >
                Checkout
              </Link>

              <p className="sevo-meta mt-5 text-muted-foreground">
                No account required. Guest checkout is available.
              </p>
            </aside>
          </div>
        )}

        {savedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="sevo-display border-b border-border pb-4 text-2xl">
              Saved for later
            </h2>

            <ul className="mt-6 flex flex-wrap gap-6">
              {savedProducts.map((p) => (
                <li key={p.id} className="w-32">
                  <Link href={`/product/${p.slug}`}>
                    <img
                      src={images[p.images[0]]}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-4/5 w-full bg-paper object-cover"
                    />

                    <p className="sevo-meta mt-2 text-muted-foreground">
                      {sevoNumber(p)}
                    </p>

                    <p className="mt-1 text-xs">{p.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt
        className={
          strong
            ? "sevo-label"
            : "text-muted-foreground"
        }
      >
        {label}
      </dt>

      <dd
        className={
          strong
            ? "text-sm font-medium"
            : "text-sm"
        }
      >
        {value}
      </dd>
    </div>
  );
}
