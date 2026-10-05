"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteLayout } from "@/components/sevo/layout";
import { collectionLabel } from "@/content/collections";
import { liveProducts, totalStock, sevoNumber } from "@/content/products";
import { imageFor } from "@/content/images";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/money";

export default function WishlistContent() {
  const { saved, toggleSaved } = useCart();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const savedProducts = useMemo(() => {
    const live = liveProducts();

    return saved
      .map((id) => live.find((product) => product.id === id))
      .filter((product): product is (typeof live)[number] => Boolean(product));
  }, [saved]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
        <div className="border-b border-border pb-6">
          <p className="sevo-meta text-muted-foreground">Your selections</p>

          <div className="mt-4 flex items-end justify-between gap-6">
            <div>
              <h1 className="sevo-display text-4xl md:text-5xl">Saved</h1>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Keep the pairs you are considering in one place.
              </p>
            </div>

            {ready && savedProducts.length > 0 && (
              <p className="sevo-meta hidden text-muted-foreground md:block">
                {savedProducts.length}{" "}
                {savedProducts.length === 1 ? "selection" : "selections"}
              </p>
            )}
          </div>
        </div>

        {!ready ? (
          <div className="py-24">
            <p className="sevo-meta text-muted-foreground">
              Loading saved selections…
            </p>
          </div>
        ) : savedProducts.length === 0 ? (
          <div className="py-24">
            <p className="sevo-display text-2xl md:text-3xl">
              Nothing saved yet.
            </p>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              When a pair catches your attention, use “Save for later” on its
              product page.
            </p>

            <Link
              href="/shop"
              className="sevo-label mt-8 inline-block border-b border-foreground pb-1"
            >
              Explore the selection
            </Link>
          </div>
        ) : (
          <section className="mt-10">
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
              {savedProducts.map((product) => {
                const stock = totalStock(product);

                return (
                  <article key={product.id} className="group">
                    <Link href={`/product/${product.slug}`} className="block">
                      <div className="overflow-hidden bg-paper">
                        <img
                          src={imageFor(product.images[0])}
                          alt={`${product.name} — ${product.brand} ${product.model}`}
                          width={800}
                          height={1000}
                          loading="lazy"
                          className="aspect-4/5 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </div>

                      <div className="mt-4">
                        <p className="sevo-meta text-muted-foreground">
                          {sevoNumber(product)}
                        </p>

                        <h2 className="mt-1.5 text-sm font-medium">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {product.brand} ·{" "}
                          {collectionLabel(product.collection)}
                        </p>

                        <p className="mt-2 text-sm">
                          {formatPrice(product.price)}
                        </p>

                        <p className="sevo-meta mt-2 text-muted-foreground">
                          {stock <= 0
                            ? "Sold out"
                            : stock <= 2
                              ? "Limited availability"
                              : "Available"}
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleSaved(product.id)}
                      className="sevo-label mt-4 border-b border-border pb-1 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      Remove from saved
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {ready && savedProducts.length > 0 && (
          <div className="mt-16 border-t border-border pt-6">
            <p className="sevo-meta text-muted-foreground">
              Saved selections are currently stored on this device. Account
              syncing will come with the customer backend.
            </p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
