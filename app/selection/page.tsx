import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/sevo/layout";
import { brand } from "@/content/brand";
import { images } from "@/content/images";

export const metadata: Metadata = {
  title: "Why This One? The SEVO Selection Process",
  description:
    "How SEVO selects: form, versatility, quality, story, distinctiveness, cultural relevance and fit. Every pair is reviewed before it receives a number.",
  openGraph: {
    title: "Why This One? The SEVO Selection Process",
    description:
      "The seven criteria behind every sneaker SEVO chooses to list.",
    type: "website",
  },
};

export default function SelectionPage() {
  const steps = [
    "A pair is sourced and logged.",
    "Supplier and authenticity are verified.",
    "Photography is produced.",
    "The pair is evaluated against the criteria.",
    "A selection reason is written by hand.",
    "A SEVO number is assigned.",
    "It goes live.",
  ];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
        <p className="sevo-meta text-muted-foreground">The Curation Index</p>

        <h1 className="sevo-display mt-6 max-w-2xl text-[2.75rem] md:text-[5rem]">
          Why this one?
        </h1>

        <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Nothing is listed because it is available. Every pair passes through
          the same internal review, and the reasoning is written down before a
          number is assigned.
        </p>
      </section>

      <section className="border-y border-border bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <ul className="grid gap-x-16 gap-y-10 md:grid-cols-2">
            {brand.curationIndex.map((criterion, index) => (
              <li key={criterion.title} className="border-t border-border pt-5">
                <div className="flex items-baseline gap-5">
                  <span className="sevo-meta text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h2 className="sevo-display text-2xl">{criterion.title}</h2>
                </div>

                <p className="mt-3 pl-13 text-sm text-muted-foreground">
                  {criterion.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
        <div>
          <h2 className="sevo-display text-3xl md:text-4xl">
            Before it goes live
          </h2>

          <ol className="mt-8 divide-y divide-border border-t border-border">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-6 py-4">
                <span className="sevo-meta w-8 text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm text-muted-foreground">
            Internal scoring stays internal. What you read on a product page is
            the conclusion, in plain language.
          </p>

          <Link
            href="/shop"
            className="sevo-label mt-8 inline-block border-b border-foreground pb-1"
          >
            See what passed
          </Link>
        </div>

        <img
          src={images.textureDetail}
          alt="Close detail of sneaker sole and stitching"
          loading="lazy"
          width={1400}
          height={1000}
          className="aspect-3/2 w-full object-cover"
        />
      </section>
    </SiteLayout>
  );
}
