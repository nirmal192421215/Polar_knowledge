"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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

type SearchResultsProps = {
  results?: SearchItem[];
  query?: string;
};

function getInternalHref(item: SearchItem): string | null {
  const type = item.type.toLowerCase();
  if (type === "expedition") return `/expeditions`;
  if (type === "publication") return `/publications`;
  if (type === "dataset") return `/data`;
  if (type === "research") return `/research`;
  if (type === "media") return `/media`;
  if (type === "report") return `/reports`;
  return null;
}

const TYPE_COLORS: Record<string, string> = {
  Dataset: "border-sky-200 bg-sky-50 text-sky-700",
  Publication: "border-indigo-200 bg-indigo-50 text-indigo-700",
  Expedition: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Research: "border-amber-200 bg-amber-50 text-amber-700",
  Media: "border-pink-200 bg-pink-50 text-pink-700",
  Report: "border-blue-200 bg-blue-50 text-blue-700",
};

export default function SearchResults({
  results = [],
  query = "",
}: SearchResultsProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Datasets",
    "Publications",
    "Expeditions",
    "Research",
    "Media",
    "Reports",
  ];

  const filteredResults = useMemo(() => {
    if (activeFilter === "All") return results;

    return results.filter((item) => {
      const type = item.type.toLowerCase();
      if (activeFilter === "Datasets") return type === "dataset";
      if (activeFilter === "Publications") return type === "publication";
      if (activeFilter === "Expeditions") return type === "expedition";
      if (activeFilter === "Research") return type === "research";
      if (activeFilter === "Media") return type === "media";
      if (activeFilter === "Reports") return type === "report";
      return true;
    });
  }, [results, activeFilter]);

  const handleAskAI = (q: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-polar-ai", { detail: { query: q } }));
    }
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Search Results
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            {query ? (
              <>
                Matches for <span className="text-sky-600">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "All Indexed Records"
            )}
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500">
          {filteredResults.length} record{filteredResults.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              activeFilter === filter
                ? "border border-sky-500 bg-sky-600 text-white shadow-2xs"
                : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Results */}
      {filteredResults.length > 0 ? (
        <div className="grid gap-4">
          {filteredResults.map((item) => {
            const internalHref = getInternalHref(item);
            const colorClass =
              TYPE_COLORS[item.type] ??
              "border-slate-200 bg-slate-50 text-slate-700";

            return (
              <article
                key={`${item.type}-${item.id}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${colorClass}`}
                      >
                        {item.type}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      {item.location && <span>📍 {item.location}</span>}
                      {item.station && <span>🏔️ {item.station}</span>}
                      {item.status && <span className="font-medium text-emerald-600">● {item.status}</span>}
                      {item.source && <span>📚 {item.source}</span>}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    {internalHref && (
                      <Link
                        href={internalHref}
                        className="rounded-lg border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-center text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                      >
                        View in Section →
                      </Link>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-center text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        Source ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center">
          <div className="text-4xl">🔍</div>
          <h4 className="mt-3 text-base font-bold text-slate-800">No database matches found</h4>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            We couldn&apos;t find exact database records matching &ldquo;{query}&rdquo;.
          </p>
          {query && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => handleAskAI(query)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition"
              >
                <span>✦ Ask POLAR AI:</span>
                <span>&ldquo;{query}&rdquo; →</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}