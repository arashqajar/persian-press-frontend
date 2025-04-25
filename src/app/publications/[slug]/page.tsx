import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation"; // ✅

type Props = {
  params: {
    slug: string;
  };
};

const query = groq`*[_type == "publication" && slug.current == $slug][0]{
  title,
  coverImage {
    asset->{
      url
    }
  },
  description,
  body
}`;

export default async function Page({ params }: Props) {
  const data = await client.fetch(query, { slug: params.slug });

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">{data?.title}</h1>

      {data?.coverImage?.asset?.url && (
        <div className="relative w-full h-96 mb-6">
          <Image
            src={data.coverImage.asset.url}
            alt={data.title}
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="prose prose-invert max-w-none">
        <p>{data?.description}</p>
        <PortableText value={data?.body} />
      </div>
    </main>
  );
}
