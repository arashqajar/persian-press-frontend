import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { groq } from "next-sanity";

// ✅ Strict and safe PortableBlock type
type PortableBlock = {
  _type: string;
  language?: string;
  children?: unknown[];
  [key: string]: unknown;
};

const query = groq`*[_type == "staticPage" && slug == "about"][0]{
  title,
  body
}`;

export default async function AboutPage() {
  const data = await client.fetch(query);

  const blocks = data?.body as PortableBlock[] || [];

  const persianBlocks = blocks.filter((block) => block.language === "fa");
  const englishBlocks = blocks.filter((block) => block.language !== "fa");

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-12">
      <h1 className="text-4xl font-bold text-center mb-12">{data?.title}</h1>

      <div className="flex gap-8">
        {/* Persian column */}
        <div className="w-1/2 text-right" dir="rtl">
          <PortableText value={persianBlocks} />
        </div>

        {/* Divider */}
        <div className="w-px bg-zinc-700" />

        {/* English column */}
        <div className="w-1/2">
          <PortableText value={englishBlocks} />
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded">
            ⬅ Back to Home
          </button>
        </Link>
      </div>
    </main>
  );
}
