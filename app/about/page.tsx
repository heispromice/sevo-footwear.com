import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/sevo/layout";
import { brand } from "@/content/brand";
import { images } from "@/content/images";

export const metadata: Metadata = {
  title: "About SEVO — Not Everything. Just What Matters.",
  description:
    "SEVO is a sneaker curation label born in Tanzania and built with a global perspective. We curate with intention; every selection has a reason.",
  openGraph: {
    title: "About SEVO — Not Everything. Just What Matters.",
    description:
      "A sneaker curation label born in Tanzania, built with a global perspective.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
        <h1 className="sevo-display max-w-3xl text-[2.75rem] md:text-[5.5rem]">
          {brand.about.headlineLines[0]}
          <br />
          {brand.about.headlineLines[1]}
        </h1>
      </section>

      <section className="border-y border-border">
        <img
          src={images.storyArchitecture}
          alt="Concrete wall with strong shadow lines"
          loading="lazy"
          width={1400}
          height={1000}
          className="h-[42vh] w-full object-cover md:h-[62vh]"
        />
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:gap-24 md:px-10 md:py-24">
        <div>
          <p className="sevo-meta text-muted-foreground">The idea</p>
          <p className="sevo-meta mt-4 text-muted-foreground">
            {brand.origin}
          </p>
        </div>

        <div className="space-y-7">
          {brand.about.body.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-relaxed md:text-lg"
            >
              {paragraph}
            </p>
          ))}

          <div className="sevo-rule pt-7">
            <p className="sevo-display text-2xl md:text-3xl">
              Curate. Explain. Sell. Archive. Create.
            </p>

            <p className="mt-5 max-w-lg text-sm text-muted-foreground">
              We begin by curating existing sneakers. In time, the same
              numbering system will carry sneakers of our own.
            </p>
          </div>

          <Link
            href="/selection"
            className="sevo-label inline-block border-b border-foreground pb-1"
          >
            How we select
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
