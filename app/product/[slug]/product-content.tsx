"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/sevo/product-card";
import { collectionLabel } from "@/content/collections";
import { imageFor } from "@/content/images";
import { liveProducts, sevoNumber, type Product } from "@/content/products";
import { toStorefrontProduct } from "@/content/storefront";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";

export default function ProductContent({ product }: { product: Product }) {
  const { add, toggleSaved, isSaved } = useCart();

  const [size, setSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  /*
   * Convert the current legacy product into the new
   * commerce-aware storefront model.
   *
   * This is still a frontend bridge for the current
   * local catalogue. Laravel will become the real
   * source of product/inventory data later.
   */
  const storefrontProduct = toStorefrontProduct(product);

  const selectedVariant = storefrontProduct.variants.find(
    (variant) => variant.size === size,
  );

  const soldOut = storefrontProduct.availability === "SOLD_OUT";

  /*
   * Add to Bag
   *
   * The CartProvider now validates:
   * - product existence
   * - size existence
   * - available inventory
   * - maximum quantity
   *
   * We therefore must use the result of add()
   * instead of assuming the operation succeeded.
   */
  const handleAdd = () => {
    if (!size) {
      toast("Select a size first");
      return;
    }

    if (!selectedVariant?.available) {
      toast("That size is no longer available");
      return;
    }

    const result = add(product.id, size);

    if (!result.ok) {
      showCartAddError(result.reason, size);
      return;
    }

    toast(`${sevoNumber(product)} added to your bag — size ${size}`);
  };

  /*
   * Buy Now
   *
   * Successful cart addition allows navigation to
   * checkout.
   *
   * Failed cart addition prevents navigation and
   * shows the actual reason.
   */
  const handleBuyNow = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (soldOut) {
      event.preventDefault();
      toast("This selection is sold out");
      return;
    }

    if (!size) {
      event.preventDefault();
      toast("Select a size first");
      return;
    }

    if (!selectedVariant?.available) {
      event.preventDefault();
      toast("That size is no longer available");
      return;
    }

    const result = add(product.id, size);

    if (!result.ok) {
      event.preventDefault();
      showCartAddError(result.reason, size);
    }
  };

  const related = liveProducts()
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const fit = storefrontProduct.fit;

  /*
   * A selected unavailable size should not allow the
   * customer to submit Add to Bag.
   *
   * With no size selected, the button remains enabled
   * so the customer receives the "Select a size first"
   * guidance.
   */
  const selectedSizeUnavailable = Boolean(size) && !selectedVariant?.available;

  return (
    <>
      {/* Product main area */}
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-8 md:grid-cols-2 md:gap-16 md:px-10 md:py-12">
        {/* Gallery */}
        <div>
          <div className="bg-paper">
            <img
              key={activeImage}
              src={imageFor(product.images[activeImage] ?? product.images[0])}
              alt={`${product.name} — ${product.brand} ${product.model}`}
              width={1200}
              height={1400}
              className="sevo-fade aspect-4/5 w-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((imageKey, index) => (
                <button
                  key={imageKey}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "w-20 border transition-colors",
                    index === activeImage
                      ? "border-foreground"
                      : "border-transparent",
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={imageFor(imageKey)}
                    alt=""
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product information */}
        <div>
          <p className="sevo-meta text-muted-foreground">
            {sevoNumber(product)}
          </p>

          <h1 className="sevo-display mt-4 text-4xl md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            {product.brand} · {product.model} ·{" "}
            {collectionLabel(product.collection)}
          </p>

          <p className="mt-6 text-lg">{formatPrice(product.price)}</p>

          {/* Overall availability */}
          <p className="sevo-meta mt-6 text-muted-foreground">
            {storefrontProduct.availability === "SOLD_OUT"
              ? "Sold out"
              : storefrontProduct.availability === "LOW_STOCK"
                ? "Low stock"
                : "Available"}
          </p>

          <p className="mt-6 max-w-md text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Sizes */}
          <div className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="sevo-label">Size (EU)</h2>

              <button
                type="button"
                className="sevo-meta text-muted-foreground underline underline-offset-4"
                onClick={() => setShowSizeGuide((value) => !value)}
                aria-expanded={showSizeGuide}
              >
                Size guide
              </button>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {storefrontProduct.variants.map((variant) => {
                const disabled = !variant.available;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      setSize((current) =>
                        current === variant.size ? null : variant.size,
                      )
                    }
                    className={cn(
                      "sevo-meta border py-3 transition-colors",
                      disabled &&
                        "border-border text-muted-foreground/50 line-through",
                      !disabled &&
                        size === variant.size &&
                        "border-foreground bg-foreground text-background",
                      !disabled &&
                        size !== variant.size &&
                        "border-border hover:border-foreground",
                    )}
                    aria-label={`EU size ${variant.size}${
                      disabled ? ", sold out" : ""
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>

            {/* Selected size availability */}
            {selectedVariant?.available && (
              <p className="sevo-meta mt-3 text-muted-foreground">
                {selectedVariant.availableQuantity === 1
                  ? "1 left"
                  : `${selectedVariant.availableQuantity} available`}
              </p>
            )}

            {/* Size guide */}
            {showSizeGuide && (
              <div className="mt-4 border border-border p-4 text-sm text-muted-foreground">
                <p>
                  Sizes are EU.{" "}
                  {fit?.recommendation ?? "Select your usual EU size."}
                </p>

                {fit?.footLengthCm?.min !== undefined &&
                  fit?.footLengthCm?.max !== undefined && (
                    <p className="mt-3">
                      Recommended foot length: {fit.footLengthCm.min}–{" "}
                      {fit.footLengthCm.max} cm.
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* Commerce actions */}
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut || selectedSizeUnavailable}
              className="sevo-label w-full bg-foreground py-4 text-background transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {soldOut
                ? "Sold out"
                : selectedSizeUnavailable
                  ? "Size unavailable"
                  : "Add to bag"}
            </button>

            <Link
              href="/checkout"
              onClick={handleBuyNow}
              className={cn(
                "sevo-label block w-full border border-foreground py-4 text-center transition-colors",
                soldOut
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-foreground hover:text-background",
              )}
              aria-disabled={soldOut}
            >
              Buy now
            </Link>

            <button
              type="button"
              onClick={() => toggleSaved(product.id)}
              className="sevo-label w-full py-2 text-muted-foreground hover:text-foreground"
            >
              {isSaved(product.id) ? "Saved" : "Save for later"}
            </button>
          </div>

          {/* Fulfilment summary */}
          <div className="sevo-rule mt-10 pt-6">
            <p className="sevo-meta text-muted-foreground">Fulfilment</p>

            <div className="mt-3 space-y-2 text-sm">
              <p>Dar es Salaam pickup available.</p>

              <p>Nationwide delivery — TZS 10,000.</p>
            </div>
          </div>

          {/* Fit */}
          <div className="sevo-rule mt-10 pt-6">
            <p className="sevo-meta text-muted-foreground">Fit</p>

            <p className="mt-2 text-sm">
              {fit?.recommendation ?? "Select your usual EU size."}
            </p>
          </div>

          {/* Selected for */}
          <div className="sevo-rule mt-10 pt-6">
            <p className="sevo-meta text-muted-foreground">Selected for</p>

            <p className="mt-2 text-sm">{product.selectedFor.join(" / ")}</p>
          </div>

          {/* Editorial story */}
          <div className="mt-10 divide-y divide-border border-t border-border">
            <Block title="The story" body={product.story} />

            <Block title="Why we selected it" body={product.whySelected} />

            <Block title="Design" body={product.design} />

            <Block title="Material" body={product.material} />

            <Block title="Heritage" body={product.heritage} />

            <Block title="How to wear it" body={product.howToWear} />

            <Block title="SEVO's take" body={product.sevoTake} />

            <Block
              title="Shipping & returns"
              body="Dispatched from Dar es Salaam. Nationwide delivery is available for TZS 10,000. Pickup is available in Dar es Salaam. Returns are accepted within 3 days of receiving the product, provided the pair is unworn and all original labels and tags remain intact."
            />
          </div>
        </div>
      </div>

      {/* Related selections */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
        <h2 className="sevo-display border-b border-border pb-5 text-2xl md:text-3xl">
          Also in the selection
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8">
          {related.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </>
  );
}

/*
 * Convert a failed Cart.add() operation into
 * a customer-facing message.
 *
 * The Cart remains responsible for deciding
 * whether the operation succeeds. The Product
 * page is only responsible for presenting the
 * result.
 */
function showCartAddError(
  reason:
    | "PRODUCT_NOT_FOUND"
    | "SIZE_NOT_FOUND"
    | "SOLD_OUT"
    | "MAX_QUANTITY_REACHED",
  size: string,
) {
  switch (reason) {
    case "PRODUCT_NOT_FOUND":
      toast("This product is no longer available.");
      break;

    case "SIZE_NOT_FOUND":
      toast("This size is not available.");
      break;

    case "SOLD_OUT":
      toast(`EU ${size} is sold out.`);
      break;

    case "MAX_QUANTITY_REACHED":
      toast(`You already have the maximum available quantity for EU ${size}.`);
      break;
  }
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-6">
      <h3 className="sevo-label">{title}</h3>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
