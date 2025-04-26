"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type SearchHit = {
  _source: {
    text: string;
    publication: string;
    issue_folder: string;
    page_number: string;
    pdf_url?: string;
    pdf_path?: string;
    gcs_path?: string;
  };
  highlight?: {
    text?: string[];
  };
};

function getNextPdfUrl(currentPath: string, offset: number): string | null {
  const match = currentPath.match(/(.+\/)(\d+)\.pdf$/);
  if (!match) return null;

  const folder = match[1];
  const currentPage = parseInt(match[2], 10);
  const nextPage = currentPage + offset;
  return `${folder}${nextPage}.pdf`;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number | null>(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const runDefaultSearch = async () => {
      const defaultQuery = "رادیو";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?query=${encodeURIComponent(defaultQuery)}`
      );
      const data = await res.json();
      setQuery(defaultQuery);
      setResults(data);
      if (data.length > 0) {
        setSelectedResultIndex(0);
        setCurrentPdfUrl(data[0]._source.pdf_url || null);
      }
    };
    runDefaultSearch();
  }, []);

  const handleSearch = async () => {
    setSelectedResultIndex(null);
    setCurrentPdfUrl(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setResults(data);
    if (data.length > 0) {
      setSelectedResultIndex(0);
      setCurrentPdfUrl(data[0]._source.pdf_url || null);
    }
  };

  const navigatePdf = (offset: number) => {
    if (
      selectedResultIndex === null ||
      !results[selectedResultIndex]?._source.pdf_path
    )
      return;
    const nextPath = getNextPdfUrl(results[selectedResultIndex]._source.pdf_path!, offset);
    if (nextPath) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signed-url?blob_name=${encodeURIComponent(nextPath)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCurrentPdfUrl(data.url);
        });
    }
  };

  const extractMetadata = (docxPath: string) => {
    const parts = docxPath.split("/");
    const issue = parts.find((p) => p.includes("Year_"));
    const filename = parts.at(-1) || "";
    const match = filename.match(/(\d+)_ocr/);
    const page = match ? match[1] : "";
    const publication = parts[0].replace("_OCR", "").replace("_", " ");
    return `${publication} – ${issue?.replace(/_/g, " ")}, page ${page}`;
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/5 pr-6 border-r border-zinc-800 p-4">
        <div className="mb-8">
          <Image
            src="/pahlavi-logo.png"
            alt="Pahlavi Persian Press Logo"
            width={300}
            height={100}
            className="w-full h-auto mb-4 object-contain"
            priority
          />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-sm"
          />
          <button
            onClick={handleSearch}
            className="mt-2 w-full px-3 py-2 bg-blue-600 rounded text-sm hover:bg-blue-500"
          >
            Search
          </button>
        </div>

        <h3 className="text-zinc-400 text-sm font-medium mb-2">Publications</h3>
        <ul className="text-sm text-zinc-300 space-y-1">
          <li>Iranshahr</li>
        </ul>
      </aside>

      {/* Main and PDF preview side-by-side */}
      <section className="w-4/5 pl-6 flex gap-6">
        <div className="w-2/3">
          <h2 className="text-2xl font-bold mb-4">🔍 Search Results</h2>
          {results.length === 0 ? (
            <p className="text-zinc-400">No results yet. Try a search above.</p>
          ) : (
            <div className="space-y-4">
              {results.map((result, idx) => {
                const isSelected = selectedResultIndex === idx;
                const textToShow = isSelected
                  ? result._source.text
                  : result.highlight?.text?.[0] ?? result._source.text;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedResultIndex(idx);
                      setCurrentPdfUrl(result._source.pdf_url || null);
                    }}
                    className={`p-4 border rounded cursor-pointer bg-zinc-800 transition ${
                      isSelected ? "border-blue-500" : "border-zinc-700 hover:border-blue-500"
                    }`}
                  >
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: textToShow }}
                    />
                    <p className="text-sm mt-2 text-zinc-400">
                      {extractMetadata(result._source.gcs_path || "")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-1/3">
          <h2 className="text-xl mb-2">📄 PDF Preview</h2>
          {currentPdfUrl && (
            <div>
              <iframe
                src={currentPdfUrl}
                className="w-full h-[80vh] border border-zinc-700 rounded"
                title="PDF Preview"
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => navigatePdf(-1)}
                  className="px-4 py-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                >
                  ◀ Previous
                </button>
                <button
                  onClick={() => navigatePdf(1)}
                  className="px-4 py-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                >
                  Next ▶
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
