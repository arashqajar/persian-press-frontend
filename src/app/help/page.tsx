import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { groq } from "next-sanity";

const query = groq`*[_type == "staticPage" && slug == "help"][0]{
  title,
  body
}`;

export default async function HelpPage() {
  const data = await client.fetch(query);

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">{data?.title}</h1>
      <div className="prose prose-invert max-w-none">
        <PortableText value={data?.body} />
      </div>
    </main>
  );
}
