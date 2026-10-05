"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { brand, navigation } from "@/content/brand";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Mark, Wordmark } from "./logo";
import { SearchOverlay } from "./search-overlay";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function useClientReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return ready;
}

function BagCount({ ready }: { ready: boolean }) {
  const { count } = useCart();

  return (
    <span className="sevo-meta">{ready && count > 0 ? `(${count})` : ""}</span>
  );
}

function SavedCount({ ready }: { ready: boolean }) {
  const { saved } = useCart();

  return (
    <span className="sevo-meta">
      {ready && saved.length > 0 ? `(${saved.length})` : ""}
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const ready = useClientReady();
  const { saved, count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:h-16 md:px-10">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <Mark size={14} />
              <Wordmark className="text-sm md:text-base" />
            </Link>

            <nav
              className="hidden items-center gap-7 md:flex"
              aria-label="Primary"
            >
              {navigation.primary.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className={cn(
                    "sevo-label text-muted-foreground transition-colors hover:text-foreground",
                    isActivePath(pathname, item.to) && "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              type="button"
              aria-label="Open search"
              onClick={() => {
                setOpen(false);
                setSearchOpen(true);
              }}
              className="sevo-label flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <span className="hidden md:inline">Search</span>
            </button>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Account"
              className={cn(
                "sevo-label hidden items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:flex",
                isActivePath(pathname, "/account") && "text-foreground",
              )}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
              </svg>

              <span>Account</span>
            </Link>

            {/* Saved */}
            <Link
              href="/wishlist"
              aria-label="Saved selections"
              className={cn(
                "sevo-label hidden items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:flex",
                isActivePath(pathname, "/wishlist") && "text-foreground",
              )}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M20.8 8.7c0 5.4-8.8 10.1-8.8 10.1S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 8 4c1.6 0 3.1.8 4 2.1A4.8 4.8 0 0 1 16 4a4.7 4.7 0 0 1 4.8 4.7Z" />
              </svg>

              <span>Saved</span>
              <SavedCount ready={ready} />
            </Link>

            {/* Bag */}
            <Link href="/cart" className="sevo-label flex items-center gap-1.5">
              Bag
              <BagCount ready={ready} />
            </Link>

            {/* Mobile menu */}
            <button
              type="button"
              className="sevo-label md:hidden"
              aria-expanded={open}
              aria-controls="sevo-mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="sevo-mobile-menu"
            className="border-t border-border bg-background px-5 py-6 md:hidden"
            aria-label="Mobile"
          >
            <ul className="space-y-5">
              {navigation.primary.map((item) => (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "sevo-display block text-3xl",
                      isActivePath(pathname, item.to) &&
                        "underline decoration-1 underline-offset-8",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="border-t border-border pt-5">
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "sevo-label block py-1",
                    isActivePath(pathname, "/account") && "text-foreground",
                  )}
                >
                  Account
                </Link>
              </li>

              <li>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="sevo-label block py-1"
                >
                  Bag
                  <span className="sevo-meta ml-1">
                    {ready && count > 0 ? `(${count})` : ""}
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/track-order"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "sevo-label block py-1",
                    isActivePath(pathname, "/track-order") && "text-foreground",
                  )}
                >
                  Track Order
                </Link>
              </li>

              <li>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="sevo-label block py-1"
                >
                  Bag
                  <span className="sevo-meta ml-1">
                    {ready
                      ? (() => {
                          const { count } = useCart();
                          return count > 0 ? `(${count})` : "";
                        })()
                      : ""}
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export function BottomNav() {
  const pathname = usePathname() ?? "";
  const { count } = useCart();
  const ready = useClientReady();

  const items = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Stories", to: "/stories" },
    {
      label: ready && count > 0 ? `Bag (${count})` : "Bag",
      to: "/cart",
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-border bg-background md:hidden"
      aria-label="Bottom"
    >
      {items.map((item) => (
        <Link
          key={item.to}
          href={item.to}
          className={cn(
            "sevo-label py-4 text-center text-muted-foreground",
            isActivePath(pathname, item.to) && "text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteFooter() {
  /*
   * Keep this list completely static.
   *
   * This is important for hydration:
   * the server and browser must render the same number
   * of <li> elements during the initial render.
   */
  const footerItems = [
    ...navigation.primary,
    { label: "Account", to: "/account" },
    { label: "Saved", to: "/wishlist" },
    { label: "Track Order", to: "/track-order" },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Wordmark className="text-lg" />

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {brand.tagline}
            </p>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {brand.origin}
            </p>
          </div>

          <div>
            <h2 className="sevo-label">Explore</h2>

            <ul className="mt-5 space-y-3">
              {footerItems.map((item) => (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="sevo-label">Contact</h2>

            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>Dar es Salaam, Tanzania</li>
              <li>Worldwide shipping</li>
            </ul>
          </div>
        </div>

        <div className="sevo-rule mt-14 flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="sevo-meta text-muted-foreground">
            © {new Date().getFullYear()} SEVO
          </p>

          <p className="sevo-meta text-muted-foreground">{brand.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className={cn("flex-1 pb-20 md:pb-0", className)}>{children}</main>

      <SiteFooter />

      <div className="h-14 md:hidden" />

      <BottomNav />
    </div>
  );
}

export function SectionHeading({
  title,
  support,
  action,
}: {
  title: string;
  support?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
      <div>
        <h2 className="sevo-display text-2xl md:text-4xl">{title}</h2>

        {support && (
          <p className="mt-3 text-sm text-muted-foreground">{support}</p>
        )}
      </div>

      {action}
    </div>
  );
}
