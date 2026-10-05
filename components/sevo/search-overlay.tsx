"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { collectionLabel } from "@/content/collections";
import { imageFor } from "@/content/images";
import {
  products,
  liveProducts,
  sevoNumber,
  type Product,
} from "@/content/products";
import { recommendedProductIds, topSearches } from "@/content/search";
import { formatPrice } from "@/lib/money";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return liveProducts().filter((product) => {
      const searchable = [
        product.name,
        product.brand,
        product.model,
        product.number,
        product.sku,
        product.collection,
        product.shortStatement,
        product.description,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const recommended = useMemo(() => {
    const live = liveProducts();

    return recommendedProductIds
      .map((id) => live.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product));
  }, []);

  if (!isOpen) return null;

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const runSearch = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-14 z-[60] bg-background md:top-16"
      role="dialog"
      aria-modal="true"
      aria-label="Search SEVO"
    >
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-[1080px] px-5 pb-16 md:px-8 md:pb-20">
          {/* Search field */}
          <div className="pt-5 md:pt-7">
            <div className="flex h-12 items-center border border-black bg-white md:h-14">
              {/* Search icon */}
              <span
                className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center text-black"
                aria-hidden="true"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </span>

              {/* Input */}
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search."
                autoComplete="off"
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-[15px] font-medium tracking-normal text-black outline-none placeholder:text-neutral-500 md:text-base"
                aria-label="Search"
              />

              {/* Clear */}
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mr-3 shrink-0 text-[13px] font-semibold text-black underline underline-offset-4 transition-opacity hover:opacity-50 md:mr-4"
                >
                  Clear
                </button>
              )}

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center text-black transition-opacity hover:opacity-50 md:mr-3"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </div>

          {!normalizedQuery ? (
            <>
              {/* Top Searches */}
              <section className="pt-8 md:pt-10">
                <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-black md:text-[15px]">
                  Top Searches
                </h2>

                <div className="mt-3 grid max-w-[620px] grid-cols-2 gap-x-16 md:gap-x-20">
                  {topSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => runSearch(term)}
                      className="py-2 text-left text-[13px] font-medium text-black transition-opacity hover:opacity-50 md:text-[14px]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>

              {/* Recommended */}
              <section className="mt-10 border-t border-border pt-7 md:mt-12 md:pt-8">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-black md:text-[15px]">
                    Recommended for you
                  </h2>

                  <span className="text-[11px] font-medium text-muted-foreground">
                    Curated by SEVO
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8 md:gap-y-10">
                  {recommended.map((product) => (
                    <SearchProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            /* Live search results */
            <section className="pt-8 md:pt-10">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <h2 className="text-[14px] font-semibold text-black md:text-[15px]">
                  Search results
                </h2>

                <span className="sevo-meta text-muted-foreground">
                  {results.length}{" "}
                  {results.length === 1 ? "selection" : "selections"}
                </span>
              </div>

              {results.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8 md:gap-y-10">
                  {results.map((product) => (
                    <SearchProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <p className="text-lg font-semibold text-black">
                    No selections found.
                  </p>

                  <p className="mt-3 text-[13px] text-muted-foreground">
                    Try another model, brand, collection or SEVO number.
                  </p>

                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-6 text-[13px] font-semibold text-black underline underline-offset-4"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Compact recommendation card      */
/* -------------------------------- */

function SearchProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block min-w-0">
      {/* Product image */}
      <div className="overflow-hidden bg-paper">
        <img
          src={imageFor(product.images[0])}
          alt={`${product.brand} ${product.model} — ${product.name}`}
          loading="lazy"
          width={600}
          height={600}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* Product information */}
      <div className="mt-3">
        <p className="text-[13px] font-semibold leading-tight text-black md:text-[14px]">
          {product.name}
        </p>

        <p className="mt-1 text-[11px] leading-relaxed text-neutral-600 md:text-xs">
          {collectionLabel(product.collection)}
        </p>

        <p className="mt-1 text-[11px] font-medium text-neutral-600">
          {sevoNumber(product)}
        </p>

        <p className="mt-1.5 text-[13px] font-semibold text-black md:text-[14px]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
