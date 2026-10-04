"use client";

import { useMemo, useState } from "react";

export type ReportDocument = {
  id: string;
  title: string;
  description?: string | null;
  document_type?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  file_url?: string | null;
  created_at?: string | null;
};

export default function ReportsSection({
  data,
  error,
}: {
  data: ReportDocument[];
  error?: any;
}) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const documentTypes = useMemo(() => {
    const types = new Set<string>();
    data.forEach((d) => {
      if (d.document_type) types.add(d.document_type);
    });
    return ["All", ...Array.from(types)];
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchType =
        selectedType === "All" ||
        item.document_type?.toLowerCase() === selectedType.toLowerCase();

      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.source_name?.toLowerCase().includes(q);

      return matchType && matchQuery;
    });
  }, [data, selectedType, query]);

  function handleCopyCitation(doc: ReportDocument) {
    const citation = `${doc.source_name || "Ministry of Earth Sciences, Govt. of India"}. "${doc.title}." Official Polar Science Documentation, POLARIS Knowledge Repository. ${doc.source_url || ""}`;
    navigator.clipboard.writeText(citation.trim());
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-bold text-sm">Unable to load scientific reports.</p>
          <p className="mt-1 text-xs text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* HEADER CONTROLS */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="polar-badge mb-2">Documentation Archive</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Scientific Reports &amp; Expedition Logs
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Archived institutional reviews, annual reports, and technical bulletins published by MoES and NCPOR.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="w-full md:w-80">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports by title or keyword..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <span className="pointer-events-none absolute left-3.5 top-3 text-sm text-slate-400">
              🔍
            </span>
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-5">
        {documentTypes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSelectedType(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              selectedType === t
                ? "border border-sky-500 bg-sky-600 text-white shadow-2xs"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-xs font-medium text-slate-500">
          Showing {filtered.length} of {data.length} records
        </span>
      </div>

      {/* REPORTS GRID */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-2xs">
          <div className="text-4xl">📄</div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">No matching reports</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
            No scientific documents matched your filter criteria. Try clearing your search keyword.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="polar-card p-6 flex flex-col justify-between group"
            >
              <div>
                {/* TOP META */}
                <div className="flex items-start justify-between gap-4">
                  <div className="text-3xl">📄</div>
                  <div className="flex flex-wrap gap-2">
                    {item.document_type && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-200">
                        {item.document_type}
                      </span>
                    )}
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  </div>
                </div>

                {/* TITLE & DESCRIPTION */}
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-2.5 text-xs leading-5 text-slate-600 line-clamp-3">
                    {item.description}
                  </p>
                )}

                {/* SOURCE */}
                {item.source_name && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <span>🏛️</span>
                    <span className="font-medium text-slate-700">{item.source_name}</span>
                  </div>
                )}
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => handleCopyCitation(item)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <span>📋</span>
                  <span>{copiedId === item.id ? "Citation Copied!" : "Copy Citation"}</span>
                </button>

                <div className="flex items-center gap-2.5">
                  {item.file_url && (
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                    >
                      <span>⬇️</span> PDF
                    </a>
                  )}

                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 transition"
                    >
                      Source <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
