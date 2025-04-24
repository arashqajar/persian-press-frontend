"use client";

import { useState } from "react";

type SearchHit = {
  _source: {
    text: string;
    publication: string;
    issue_folder: string;
    page_number: string;
    pdf_url?: string;
    pdf_path?: string;
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

function formatMetadata(path: string, publication: string): string {
  const filename = path.split("/").pop() || "";
  const cleanPub = publication.replace("_OCR", "").replace(/_/g, " ");

  const match = filename.match(/Year_(\d+)_No_(\d+)_([A-Za-z]+)_(\d{4})_(\d+)_ocr/);
  if (!match) return cleanPub;

  const [, year, no, month, yearNum, page] = match;
  return `${cleanPub} – Year ${year}, No. ${no}, ${month} ${yearNum}, page ${page}`;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchHit | null>(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);

  const handleSearch = async () => {
    setSelectedResult(null);
    setCurrentPdfUrl(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setResults(data);
    if (data.length > 0) {
      setSelectedResult(data[0]);
      setCurrentPdfUrl(data[0]._source.pdf_url || null);
    }
  };

  const navigatePdf = (offset: number) => {
    if (!selectedResult || !selectedResult._source.pdf_path) return;
    const nextPath = getNextPdfUrl(selectedResult._source.pdf_path, offset);
    if (nextPath) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/signed-url?blob_name=${encodeURIComponent(nextPath)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCurrentPdfUrl(data.url);
        });
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <section className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Pahlavi Persian Press</h1>
        <p className="text-base text-zinc-400">
          This site is in development. Search functionality is limited.
        </p>
        <p className="text-base text-zinc-400 mt-1 text-right font-medium" dir="rtl">
          این سایت در حال توسعه است. قابلیت جستجو محدود است.
        </p>
      </section>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Type a word in Persian..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl mb-2">📃 Search Results</h2>
          {results.length === 0 && <p>No results yet. Try a search above.</p>}
          {results.map((result, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedResult(result);
                setCurrentPdfUrl(result._source.pdf_url || null);
              }}
              className={`mb-4 p-4 border border-zinc-700 rounded bg-zinc-800 cursor-pointer hover:border-blue-500 transition ${
                selectedResult === result ? "border-blue-500" : ""
              }`}
            >
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    result.highlight?.text?.[0]
                      ?.replace(
                        new RegExp(query, "gi"),
                        (match) => `<mark class="bg-yellow-400 text-black">${match}</mark>`
                      ) ?? result._source.text,
                }}
              />
              <p className="text-xs mt-3 text-zinc-400 italic">
                {formatMetadata(result._source.pdf_path || "", result._source.publication)}
              </p>
            </div>
          ))}
        </div>

        <div>
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
      </div>
    </main>
  );
}
