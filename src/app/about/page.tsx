import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { groq } from "next-sanity";

const query = groq`*[_type == "staticPage" && slug == "about"][0]{
  title,
  body
}`;

export default async function AboutPage() {
  const data = await client.fetch(query);

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-12">
      <h1 className="text-4xl font-bold text-left mb-12">{data?.title}</h1>

      <div className="max-w-3xl text-left">
        <PortableText value={data?.body} />
      </div>

      <div className="mt-12">
        <Link href="/">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded">
            ⬅ Back to Home
          </button>
        </Link>
      </div>
    </main>
  );
}
