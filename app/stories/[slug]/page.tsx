import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteLayout } from "@/components/sevo/layout";
import { images } from "@/content/images";
import { stories, storyBySlug } from "@/content/stories";

type StoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  const story = storyBySlug(slug);

  if (!story) {
    return {
      title: "Unavailable — SEVO",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: story.seo.title,
    description: story.seo.description,
    openGraph: {
      title: story.seo.title,
      description: story.seo.description,
      type: "article",
    },
  };
}

export default async function StoryDetailPage({
  params,
}: StoryPageProps) {
  const { slug } = await params;

  const story = storyBySlug(slug);

  if (!story) {
    notFound();
  }

  const more = stories
    .filter((s) => s.slug !== story.slug)
    .slice(0, 2);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    datePublished: story.date,
    articleSection: story.category,
    author: {
      "@type": "Organization",
      name: "SEVO",
    },
  };

  return (
    <SiteLayout>
      <article className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-16">
        <p className="sevo-meta text-muted-foreground">
          {story.category} · {story.readTime}
        </p>

        <h1 className="sevo-display mt-6 max-w-3xl text-[2.5rem] md:text-[4.5rem]">
          {story.title}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {story.standfirst}
        </p>

        <img
          src={images[story.image]}
          alt={story.title}
          width={1400}
          height={1000}
          className="mt-12 aspect-3/2 w-full bg-paper object-cover"
        />

        <div className="mx-auto mt-14 max-w-2xl space-y-7">
          {story.body.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-relaxed md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl border-t border-border pt-8">
          <Link
            href="/shop"
            className="sevo-label border-b border-foreground pb-1"
          >
            See the selection
          </Link>
        </div>
      </article>

      <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
        <h2 className="sevo-display border-b border-border pb-5 text-2xl">
          More stories
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {more.map((s) => (
            <Link
              key={s.id}
              href={`/stories/${s.slug}`}
              className="group"
            >
              <img
                src={images[s.image]}
                alt={s.title}
                loading="lazy"
                width={1400}
                height={1000}
                className="aspect-3/2 w-full bg-paper object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <p className="sevo-meta mt-4 text-muted-foreground">
                {s.category}
              </p>

              <h3 className="mt-2 text-base font-medium">
                {s.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </SiteLayout>
  );
}
