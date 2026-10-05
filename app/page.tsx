import Link from "next/link";

import { SectionHeading, SiteLayout } from "@/components/sevo/layout";
import { ProductCard } from "@/components/sevo/product-card";
import { brand } from "@/content/brand";
import { images } from "@/content/images";
import { featuredProducts } from "@/content/products";
import { stories } from "@/content/stories";

export const metadata = {
  title: "SEVO — Selective Essentials. Real Stories.",
  description:
    "A curated selection of sneakers chosen for design, character and everyday relevance. Born in Tanzania, built with a global perspective.",
  openGraph: {
    title: "SEVO — Selective Essentials. Real Stories.",
    description:
      "A curated selection of sneakers chosen for design, character and everyday relevance.",
    type: "website",
  },
};

export default function Home() {
  const featured = featuredProducts();
  const home = brand.homepage;

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] items-end gap-10 px-5 pb-14 pt-12 md:grid-cols-2 md:gap-16 md:px-10 md:pb-24 md:pt-20">
          <div className="sevo-fade">
            <p className="sevo-meta text-muted-foreground">
              {brand.campaignLine}
            </p>

            <h1 className="sevo-display mt-8 text-[3.25rem] md:text-[5.5rem]">
              {home.heroTitleLines[0]}
              <br />
              {home.heroTitleLines[1]}
            </h1>

            <p className="sevo-display mt-4 text-2xl text-muted-foreground md:text-3xl">
              {home.heroSecondary}
            </p>

            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {home.heroCopy}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link
                href="/shop"
                className="sevo-label bg-foreground px-7 py-4 text-center text-background transition-opacity hover:opacity-85"
              >
                {home.primaryCta}
              </Link>

              <Link
                href="/about"
                className="sevo-label self-start border-b border-foreground pb-1"
              >
                {home.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="sevo-fade bg-paper">
            <img
              src={images.heroEditorial}
              alt="Editorial photograph of a selected pair on concrete steps"
              width={1600}
              height={1904}
              className="aspect-4/5 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* The Selection */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <SectionHeading
          title={home.selectionTitle}
          support={home.selectionSupport}
          action={
            <Link
              href="/shop"
              className="sevo-label hidden shrink-0 border-b border-foreground pb-1 md:inline"
            >
              All selections
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Curation index */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <div>
              <h2 className="sevo-display text-3xl md:text-5xl">
                Why this one?
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Every pair passes through the same internal selection process
                before it receives a SEVO number. Nothing is listed because it
                is available.
              </p>

              <Link
                href="/selection"
                className="sevo-label mt-8 inline-block border-b border-foreground pb-1"
              >
                The selection process
              </Link>
            </div>

            <ul className="divide-y divide-border border-t border-border">
              {brand.curationIndex.map((criterion, index) => (
                <li key={criterion.title} className="flex gap-6 py-5">
                  <span className="sevo-meta w-8 shrink-0 text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="sevo-label">{criterion.title}</h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {criterion.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <SectionHeading
          title="SEVO Stories"
          support="Design, materials, places and the reasoning behind each selection."
          action={
            <Link
              href="/stories"
              className="sevo-label hidden shrink-0 border-b border-foreground pb-1 md:inline"
            >
              All stories
            </Link>
          }
        />

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {stories.slice(0, 3).map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              className="group"
            >
              <div className="overflow-hidden bg-paper">
                <img
                  src={images[story.image]}
                  alt={story.title}
                  loading="lazy"
                  width={1400}
                  height={1000}
                  className="aspect-3/2 w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              <p className="sevo-meta mt-4 text-muted-foreground">
                {story.category}
              </p>

              <h3 className="mt-2 text-base font-medium">{story.title}</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {story.standfirst}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Origin */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:gap-20 md:px-10 md:py-24">
          <img
            src={images.storyCity}
            alt="Street photograph, coastal city architecture"
            loading="lazy"
            width={1400}
            height={1000}
            className="aspect-3/2 w-full object-cover"
          />

          <div>
            <h2 className="sevo-display text-3xl md:text-5xl">
              {brand.about.headlineLines[0]}
              <br />
              {brand.about.headlineLines[1]}
            </h2>

            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              {brand.about.body[0]}
            </p>

            <p className="sevo-meta mt-8 text-muted-foreground">
              {brand.origin}
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
