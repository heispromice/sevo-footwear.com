"use client";

import { useMemo, useState } from "react";
import type {
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";

import {
  SectionHeading,
  SiteLayout,
} from "@/components/sevo/layout";
import { ProductCard } from "@/components/sevo/product-card";
import { collections } from "@/content/collections";
import type { Product } from "@/content/products";
import { toStorefrontProduct } from "@/content/storefront";
import { cn } from "@/lib/utils";

type SortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "name";

type Availability =
  | "all"
  | "in-stock"
  | "limited"
  | "sold-out";

type PriceRange =
  | "all"
  | "under-200"
  | "200-299"
  | "300-399"
  | "400-plus";

export default function ShopContent({
  products,
}: {
  products: Product[];
}) {
  const [activeCollection, setActiveCollection] =
    useState("all");

  const [query, setQuery] = useState("");

  const [selectedSizes, setSelectedSizes] =
    useState<string[]>([]);

  const [selectedBrands, setSelectedBrands] =
    useState<string[]>([]);

  const [availability, setAvailability] =
    useState<Availability>("all");

  const [priceRange, setPriceRange] =
    useState<PriceRange>("all");

  const [sort, setSort] =
    useState<SortOption>("featured");

  const [filterOpen, setFilterOpen] =
    useState(false);

  /*
   * Temporary bridge between the current legacy catalogue
   * and the new commerce-aware storefront model.
   *
   * The current Product data is still local/static.
   * Later, Laravel will provide this data from the API.
   */
  const storefrontProducts = useMemo(
    () =>
      products.map((product) =>
        toStorefrontProduct(product),
      ),
    [products],
  );

  /*
   * Keep the existing Product objects for ProductCard,
   * while using StorefrontProduct for commerce logic.
   */
  const storefrontById = useMemo(
    () =>
      new Map(
        storefrontProducts.map((product) => [
          product.id,
          product,
        ]),
      ),
    [storefrontProducts],
  );

  const usedCollections = useMemo(
    () =>
      collections.filter((collection) =>
        products.some(
          (product) =>
            product.collection === collection.slug,
        ),
      ),
    [products],
  );

  const brands = useMemo(
    () =>
      [
        ...new Set(
          products.map((product) => product.brand),
        ),
      ].sort(),
    [products],
  );

  /*
   * EU sizes are derived from storefront variants.
   *
   * A size appears in the filter only when at least one
   * product has a positive available quantity for that size.
   */
  const sizes = useMemo(
    () =>
      [
        ...new Set(
          storefrontProducts.flatMap((product) =>
            product.variants
              .filter(
                (variant) =>
                  variant.availableQuantity > 0,
              )
              .map((variant) => variant.size),
          ),
        ),
      ].sort(
        (a, b) => Number(a) - Number(b),
      ),
    [storefrontProducts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = products.filter((product) => {
      /*
       * Find the commerce-aware representation of this product.
       * If there is no representation, fail closed rather than
       * making an assumption about inventory.
       */
      const storefrontProduct =
        storefrontById.get(product.id);

      if (!storefrontProduct) {
        return false;
      }

      // Collection
      const matchesCollection =
        activeCollection === "all" ||
        product.collection === activeCollection;

      // Search
      const matchesSearch =
        !q ||
        [
          product.name,
          product.brand,
          product.model,
          product.number,
          product.sku,
        ].some((value) =>
          value.toLowerCase().includes(q),
        );

      /*
       * Size
       *
       * Use variant-level availableQuantity rather than
       * directly reading the legacy Product.sizes array.
       */
      const matchesSize =
        selectedSizes.length === 0 ||
        storefrontProduct.variants.some(
          (variant) =>
            variant.availableQuantity > 0 &&
            selectedSizes.includes(variant.size),
        );

      // Brand
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand);

      /*
       * Availability comes from the commerce model.
       *
       * IN_STOCK  = above the low-stock threshold
       * LOW_STOCK = positive quantity at/below threshold
       * SOLD_OUT  = zero available quantity
       */
      const matchesAvailability =
        availability === "all" ||
        (availability === "in-stock" &&
          storefrontProduct.availability ===
            "IN_STOCK") ||
        (availability === "limited" &&
          storefrontProduct.availability ===
            "LOW_STOCK") ||
        (availability === "sold-out" &&
          storefrontProduct.availability ===
            "SOLD_OUT");

      // Price
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-200" &&
          product.price < 200000) ||
        (priceRange === "200-299" &&
          product.price >= 200000 &&
          product.price < 300000) ||
        (priceRange === "300-399" &&
          product.price >= 300000 &&
          product.price < 400000) ||
        (priceRange === "400-plus" &&
          product.price >= 400000);

      return (
        matchesCollection &&
        matchesSearch &&
        matchesSize &&
        matchesBrand &&
        matchesAvailability &&
        matchesPrice
      );
    });

    switch (sort) {
      case "newest":
        return [...result].sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() -
            new Date(a.dateAdded).getTime(),
        );

      case "price-low":
        return [...result].sort(
          (a, b) => a.price - b.price,
        );

      case "price-high":
        return [...result].sort(
          (a, b) => b.price - a.price,
        );

      case "name":
        return [...result].sort((a, b) =>
          a.name.localeCompare(b.name),
        );

      case "featured":
      default:
        return result;
    }
  }, [
    products,
    storefrontById,
    activeCollection,
    query,
    selectedSizes,
    selectedBrands,
    availability,
    priceRange,
    sort,
  ]);

  const activeFilterCount =
    selectedSizes.length +
    selectedBrands.length +
    (availability !== "all" ? 1 : 0) +
    (priceRange !== "all" ? 1 : 0);

  const clearFilters = () => {
    setActiveCollection("all");
    setQuery("");
    setSelectedSizes([]);
    setSelectedBrands([]);
    setAvailability("all");
    setPriceRange("all");
    setSort("featured");
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
        <SectionHeading
          title="The Selection"
          support="Not everything makes it in. Every pair carries a SEVO number."
        />

        {/* Collection navigation */}
        <div className="mt-8 border-b border-border pb-3">
          <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            <div className="flex w-max items-center gap-3">
              <FilterChip
                label="All"
                active={
                  activeCollection === "all"
                }
                onClick={() =>
                  setActiveCollection("all")
                }
              />

              {usedCollections.map(
                (collection) => (
                  <FilterChip
                    key={collection.slug}
                    label={collection.label}
                    active={
                      activeCollection ===
                      collection.slug
                    }
                    onClick={() =>
                      setActiveCollection(
                        collection.slug,
                      )
                    }
                  />
                ),
              )}
            </div>
          </div>
        </div>

        {/* Search + controls */}
        <div className="mt-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <label className="flex w-full items-center gap-3 border-b border-border pb-2 md:max-w-md">
              <span className="sevo-meta text-muted-foreground">
                Search
              </span>

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Model, brand, number"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            {/* Desktop controls */}
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() =>
                  setFilterOpen(true)
                }
                className="sevo-label flex items-center gap-2 border border-border px-4 py-3 transition-colors hover:border-foreground"
              >
                Filters

                {activeFilterCount > 0 && (
                  <span className="sevo-meta">
                    ({activeFilterCount})
                  </span>
                )}
              </button>

              <SortSelect
                value={sort}
                onChange={setSort}
              />
            </div>

            {/* Mobile controls */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              <button
                type="button"
                onClick={() =>
                  setFilterOpen(true)
                }
                className="sevo-label flex items-center justify-center gap-2 border border-border py-3"
              >
                Filters

                {activeFilterCount > 0 && (
                  <span className="sevo-meta">
                    ({activeFilterCount})
                  </span>
                )}
              </button>

              <SortSelect
                value={sort}
                onChange={setSort}
              />
            </div>
          </div>
        </div>

        {/* Active filters */}
        {(activeFilterCount > 0 ||
          activeCollection !== "all" ||
          query) && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {query && (
              <ActiveFilter
                label={`Search: ${query}`}
                onRemove={() => setQuery("")}
              />
            )}

            {activeCollection !== "all" && (
              <ActiveFilter
                label={
                  usedCollections.find(
                    (collection) =>
                      collection.slug ===
                      activeCollection,
                  )?.label ??
                  activeCollection
                }
                onRemove={() =>
                  setActiveCollection("all")
                }
              />
            )}

            {selectedSizes.map((size) => (
              <ActiveFilter
                key={`size-${size}`}
                label={`EU ${size}`}
                onRemove={() =>
                  setSelectedSizes(
                    (current) =>
                      current.filter(
                        (item) => item !== size,
                      ),
                  )
                }
              />
            ))}

            {selectedBrands.map((brand) => (
              <ActiveFilter
                key={`brand-${brand}`}
                label={brand}
                onRemove={() =>
                  setSelectedBrands(
                    (current) =>
                      current.filter(
                        (item) => item !== brand,
                      ),
                  )
                }
              />
            ))}

            {availability !== "all" && (
              <ActiveFilter
                label={formatAvailability(
                  availability,
                )}
                onRemove={() =>
                  setAvailability("all")
                }
              />
            )}

            {priceRange !== "all" && (
              <ActiveFilter
                label={formatPriceRange(
                  priceRange,
                )}
                onRemove={() =>
                  setPriceRange("all")
                }
              />
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="sevo-meta ml-2 text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <p className="sevo-meta text-muted-foreground">
            {filtered.length}{" "}
            {filtered.length === 1
              ? "selection"
              : "selections"}
          </p>

          <p className="sevo-meta hidden text-muted-foreground md:block">
            {sortLabel(sort)}
          </p>
        </div>

        {/* Products */}
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="sevo-display text-2xl">
              Nothing in the selection.
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              Try another size, collection, price
              range or search.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="sevo-label mt-7 border-b border-foreground pb-1"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Filter drawer */}
      {filterOpen && (
        <FilterPanel
          sizes={sizes}
          brands={brands}
          selectedSizes={selectedSizes}
          selectedBrands={selectedBrands}
          availability={availability}
          priceRange={priceRange}
          setSelectedSizes={setSelectedSizes}
          setSelectedBrands={setSelectedBrands}
          setAvailability={setAvailability}
          setPriceRange={setPriceRange}
          onClear={clearFilters}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </SiteLayout>
  );
}

/* ----------------------------- */
/* Filter panel                  */
/* ----------------------------- */

function FilterPanel({
  sizes,
  brands,
  selectedSizes,
  selectedBrands,
  availability,
  priceRange,
  setSelectedSizes,
  setSelectedBrands,
  setAvailability,
  setPriceRange,
  onClear,
  onClose,
}: {
  sizes: string[];
  brands: string[];
  selectedSizes: string[];
  selectedBrands: string[];
  availability: Availability;
  priceRange: PriceRange;
  setSelectedSizes: Dispatch<
    SetStateAction<string[]>
  >;
  setSelectedBrands: Dispatch<
    SetStateAction<string[]>
  >;
  setAvailability: Dispatch<
    SetStateAction<Availability>
  >;
  setPriceRange: Dispatch<
    SetStateAction<PriceRange>
  >;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30"
      />

      {/* Panel */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-5 md:px-7">
          <h2 className="sevo-display text-2xl">
            Filters
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="sevo-label"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
          {/* Size */}
          <FilterGroup title="Size">
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => {
                const active =
                  selectedSizes.includes(size);

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setSelectedSizes(
                        (current) =>
                          active
                            ? current.filter(
                                (item) =>
                                  item !== size,
                              )
                            : [
                                ...current,
                                size,
                              ],
                      )
                    }
                    className={cn(
                      "sevo-meta border py-3 transition-colors",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    EU {size}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* Brand */}
          <FilterGroup title="Brand">
            <div className="space-y-3">
              {brands.map((brand) => {
                const checked =
                  selectedBrands.includes(
                    brand,
                  );

                return (
                  <label
                    key={brand}
                    className="flex cursor-pointer items-center gap-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedBrands(
                          (current) =>
                            checked
                              ? current.filter(
                                  (item) =>
                                    item !==
                                    brand,
                                )
                              : [
                                ...current,
                                brand,
                              ],
                        )
                      }
                      className="h-4 w-4 accent-foreground"
                    />

                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </FilterGroup>

          {/* Price */}
          <FilterGroup title="Price">
            <div className="space-y-2">
              {[
                ["all", "Any price"],
                [
                  "under-200",
                  "Under TZS 200,000",
                ],
                [
                  "200-299",
                  "TZS 200,000 — 299,999",
                ],
                [
                  "300-399",
                  "TZS 300,000 — 399,999",
                ],
                [
                  "400-plus",
                  "TZS 400,000+",
                ],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="radio"
                    name="price"
                    value={value}
                    checked={
                      priceRange === value
                    }
                    onChange={() =>
                      setPriceRange(
                        value as PriceRange,
                      )
                    }
                    className="h-4 w-4 accent-foreground"
                  />

                  <span>{label}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Availability */}
          <FilterGroup title="Availability">
            <div className="space-y-2">
              {[
                ["all", "Any availability"],
                ["in-stock", "In stock"],
                ["limited", "Limited"],
                ["sold-out", "Sold out"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="radio"
                    name="availability"
                    value={value}
                    checked={
                      availability === value
                    }
                    onChange={() =>
                      setAvailability(
                        value as Availability,
                      )
                    }
                    className="h-4 w-4 accent-foreground"
                  />

                  <span>{label}</span>
                </label>
              ))}
            </div>
          </FilterGroup>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border p-5 md:p-7">
          <button
            type="button"
            onClick={onClear}
            className="sevo-label border border-border py-4 hover:border-foreground"
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={onClose}
            className="sevo-label bg-foreground py-4 text-background"
          >
            Show results
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ----------------------------- */
/* Small UI helpers              */
/* ----------------------------- */

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border py-6 first:pt-0">
      <h3 className="sevo-label mb-4">
        {title}
      </h3>

      {children}
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "sevo-label border px-4 py-2.5 transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function ActiveFilter({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="sevo-meta inline-flex items-center gap-2 border border-border px-3 py-2 hover:border-foreground"
    >
      {label}

      <span aria-hidden="true">
        ×
      </span>
    </button>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <label className="flex items-center gap-2 border border-border px-4 py-2.5">
      <span className="sevo-label">
        Sort
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value as SortOption,
          )
        }
        className="bg-transparent text-sm outline-none"
      >
        <option value="featured">
          Featured
        </option>

        <option value="newest">
          Newest
        </option>

        <option value="price-low">
          Price: Low to high
        </option>

        <option value="price-high">
          Price: High to low
        </option>

        <option value="name">
          Name
        </option>
      </select>
    </label>
  );
}

/* ----------------------------- */
/* Format helpers                */
/* ----------------------------- */

function formatAvailability(
  value: Availability,
) {
  switch (value) {
    case "in-stock":
      return "In stock";

    case "limited":
      return "Limited";

    case "sold-out":
      return "Sold out";

    default:
      return "Any availability";
  }
}

function formatPriceRange(
  value: PriceRange,
) {
  switch (value) {
    case "under-200":
      return "Under TZS 200,000";

    case "200-299":
      return "TZS 200,000 — 299,999";

    case "300-399":
      return "TZS 300,000 — 399,999";

    case "400-plus":
      return "TZS 400,000+";

    default:
      return "Any price";
  }
}

function sortLabel(
  value: SortOption,
) {
  switch (value) {
    case "newest":
      return "Newest";

    case "price-low":
      return "Price: low to high";

    case "price-high":
      return "Price: high to low";

    case "name":
      return "Name";

    case "featured":
    default:
      return "Featured";
  }
}
