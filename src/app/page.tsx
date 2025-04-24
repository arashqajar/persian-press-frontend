"use client";

import { useState } from "react";

type SearchHit = {
  _source: {
    text: string;
    publication: string;
    issue_folder: string;
    page_number: string;
    pdf_url?: string;
  };
  highlight?: {
    text?: string[];
  };
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchHit | null>(null);

  const handleSearch = async () => {
    setSelectedResult(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setResults(data);
    if (data.length > 0) {
      setSelectedResult(data[0]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Pahlavi Persian Press</h2>
      <p className="text-sm text-zinc-400 mb-6">
        This archive is currently under construction. Functions are limited.
      </p>

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
          <h2 className="text-xl mb-2">📄 Search Results</h2>
          {results.length === 0 && <p>No results yet. Try a search above.</p>}
          {results.map((result, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedResult(result)}
              className={`mb-4 p-4 border border-zinc-700 rounded bg-zinc-800 cursor-pointer hover:border-blue-500 transition ${
                selectedResult === result ? "border-blue-500" : ""
              }`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: result.highlight?.text?.[0] ?? result._source.text,
                }}
              />
              <p className="text-sm mt-2 text-zinc-400">
                {result._source.publication} / {result._source.issue_folder} / Page{" "}
                {result._source.page_number}
              </p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl mb-2">📄 PDF Preview</h2>
          {selectedResult && (
            <iframe
              src={selectedResult._source.pdf_url}
              className="w-full h-[80vh] border border-zinc-700 rounded"
              title="PDF Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
}
