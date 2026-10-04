"use client";

import { useState } from "react";
import SearchResults from "./SearchResults";

type SearchItem = {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  location?: string | null;
  station?: string | null;
  status?: string | null;
  source?: string | null;
  url?: string | null;
};

const SUGGESTED_QUERIES = [
  "Bharati Station",
  "Antarctica 43rd",
  "Himadri Arctic",
  "Sea Ice Thickness",
  "NOAA Telemetry",
];

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const executeSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `/api/polar-data/search?q=${encodeURIComponent(trimmed)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Search failed");
      }

      setResults(Array.isArray(data?.results) ? data.results : []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    executeSearch(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleQuickSearch = (suggestion: string) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  return (
    <div className="w-full">
      {/* ENTERPRISE SEARCH BAR */}
      <div className="relative flex max-w-xl items-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-md transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        <div className="pointer-events-none pl-3 text-slate-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search polar expeditions, stations, NOAA data, publications..."
          className="w-full bg-transparent px-3 py-2.5 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          aria-label="Search polar science repository"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setSearched(false);
            }}
            className="mr-2 rounded-full p-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Searching
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* QUICK SUGGESTIONS */}
      <div className="mt-3 flex flex-wrap items-center justify-start gap-2 text-xs">
        <span className="font-semibold text-blue-200">Quick queries:</span>
        {SUGGESTED_QUERIES.map((sug) => (
          <button
            key={sug}
            type="button"
            onClick={() => handleQuickSearch(sug)}
            className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-white shadow-xs backdrop-blur-sm transition hover:border-white hover:bg-white/30 hover:text-white"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* SEARCH RESULTS */}
      {searched && (
        <div className="mt-8 text-left">
          <SearchResults results={results} query={query} />
        </div>
      )}
    </div>
  );
}