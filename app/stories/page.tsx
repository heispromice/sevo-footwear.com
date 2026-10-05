import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/sevo/layout";
import { images } from "@/content/images";
import { stories } from "@/content/stories";

export const metadata: Metadata = {
  title: "SEVO Stories — Sneaker Culture, Design & Places",
  description:
    "An editorial journal on sneaker design, materials, care and culture, written from Dar es Salaam with a global perspective.",
  openGraph: {
    title: "SEVO Stories — Sneaker Culture, Design & Places",
    description:
      "Editorial writing on sneaker design, materials, care and culture.",
    type: "website",
  },
};

export default function StoriesPage() {
  const lead = stories[0]!;

  const rest = stories.slice(1);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
        <h1 className="sevo-display text-4xl md:text-6xl">
          SEVO Stories
        </h1>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          Why a silhouette matters. What a material does after a year. Where a
          shoe is actually worn.
        </p>

        <Link
          href={`/stories/${lead.slug}`}
          className="group mt-14 block border-t border-border pt-8"
        >
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
            <img
              src={images[lead.image]}
              alt={lead.title}
              width={1400}
              height={1000}
              className="aspect-3/2 w-full bg-paper object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />

            <div>
              <p className="sevo-meta text-muted-foreground">
                {lead.category} · {lead.readTime}
              </p>

              <h2 className="sevo-display mt-4 text-3xl md:text-4xl">
                {lead.title}
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                {lead.standfirst}
              </p>

              <span className="sevo-label mt-6 inline-block border-b border-foreground pb-1">
                Read
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {rest.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              className="group border-t border-border pt-6"
            >
              <img
                src={images[story.image]}
                alt={story.title}
                loading="lazy"
                width={1400}
                height={1000}
                className="aspect-3/2 w-full bg-paper object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <p className="sevo-meta mt-4 text-muted-foreground">
                {story.category} · {story.readTime}
              </p>

              <h2 className="mt-2 text-base font-medium">
                {story.title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {story.standfirst}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
