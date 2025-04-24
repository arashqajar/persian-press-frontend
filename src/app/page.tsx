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
    const res = await fetch(`https://pahlavi-persian-periodicals-ppp.onrender.com/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    if (data.length > 0) {
      setSelectedResult(data[0]); // Optional: auto-select first result
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white">
      <nav className="flex justify-between items-center px-8 py-4 bg-zinc-800 border-b border-zinc-700">
        <h1 className="text-xl font-semibold">Pahlavi Persian Press</h1>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-blue-400">About</a>
          <a href="#" className="hover:text-blue-400">Help</a>
          <a href="#" className="hover:text-blue-400">Publication Titles</a>
        </div>
      </nav>

      <div className="p-8">
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
    </main>
  );
}
