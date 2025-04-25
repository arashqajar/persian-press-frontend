import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

type Publication = {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: { asset: { url: string } };
  description?: any; // you can replace with PortableTextBlock[] if you want
};

const query = groq`*[_type == "publication"]{
  _id,
  title,
  slug,
  coverImage {
    asset -> {
      url
    }
  },
  description
}`;

export default async function PublicationsPage() {
  const publications: Publication[] = await client.fetch(query);

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Publications</h1>
      <div className="space-y-6">
        {publications.map((pub) => (
          <Link
            key={pub._id}
            href={`/publications/${pub.slug.current}`}
            className="block"
          >
            <div
              className="flex overflow-hidden bg-zinc-800 rounded shadow hover:bg-zinc-700 transition-all"
              style={{ height: "25vh", cursor: "pointer" }}
            >
              {pub.coverImage?.asset?.url && (
                <div className="w-1/4 relative">
                  <Image
                    src={pub.coverImage.asset.url}
                    alt={pub.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 w-3/4 overflow-hidden">
                <h2 className="text-2xl font-semibold mb-2">{pub.title}</h2>
                <p className="text-sm text-zinc-300 line-clamp-5">
                  {/* Optional chaining just in case */}
                  {typeof pub.description === "string"
                    ? pub.description
                    : "Click to read more"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
