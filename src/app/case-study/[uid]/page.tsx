import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrismicText, SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import StarGrid from "@/components/StarGrid";
import { PrismicNextImage } from "@prismicio/next";
import { asText } from "@prismicio/client";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();

  // Ignore the type error for the getByUID method
  //@ts-ignore
  const page = await client
    .getByUID("page", params.uid)
    .catch(() => notFound());

  return (
    <Bounded as="article">
      <div className="relative grid place-items-center text-center">
        <StarGrid />
        <h1 className="text-7xl font-medium">
          <PrismicText field={page.data.title} />
          <p className="text-lg text-yellow-500">Case Study</p>
        </h1>
        <p className="mb-4 mt-8 max-w-xl text-lg text-slate-300">
          <PrismicText field={page.data.title} />
        </p>
        <PrismicNextImage
          field={page.data.meta_image}
          className="rounded-lg"
          quality={100}
        />
      </div>
      <div className="mx-auto">
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();

  //@ts-ignore
  const page = await client
    .getByUID("page", params.uid)
    .catch(() => notFound());

  return {
    title: `${page.data.meta_title || asText(page.data.title) + " Case Study"}`,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();

  //@ts-ignore
  const pages = await client.getAllByType("case_study");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
