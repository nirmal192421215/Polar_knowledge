"use client";

import { useMemo, useState } from "react";

export type PublicationItem = {
  id: string;
  title: string;
  authors?: string | null;
  abstract?: string | null;
  publication_year?: number | string | null;
  publication_type?: string | null;
  source_name?: string | null;
  source_url?: string | null;
};

export default function PublicationsClient({
  data,
  error,
}: {
  data: PublicationItem[];
  error?: any;
}) {
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [outreachModalPub, setOutreachModalPub] = useState<PublicationItem | null>(null);
  const [outreachCopied, setOutreachCopied] = useState(false);

  const years = useMemo(() => {
    const set = new Set<string>();
    data.forEach((p) => {
      if (p.publication_year) set.add(String(p.publication_year));
    });
    return ["All", ...Array.from(set).sort().reverse()];
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchYear =
        selectedYear === "All" ||
        String(item.publication_year) === selectedYear;

      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.authors?.toLowerCase().includes(q) ||
        item.abstract?.toLowerCase().includes(q) ||
        item.source_name?.toLowerCase().includes(q);

      return matchYear && matchQuery;
    });
  }, [data, selectedYear, query]);

  function copyCitation(pub: PublicationItem, format: "APA" | "BibTeX") {
    let citation = "";
    if (format === "APA") {
      citation = `${pub.authors || "NCPOR Researchers"} (${pub.publication_year || "n.d."}). ${pub.title}. ${pub.source_name || "Polar Science Repository"}. ${pub.source_url || ""}`.trim();
    } else {
      const citeKey = (pub.authors?.split(" ")[0] || "polar") + (pub.publication_year || "2024");
      citation = `@article{${citeKey.toLowerCase()},
  title={${pub.title}},
  author={${pub.authors || "NCPOR"}},
  year={${pub.publication_year || "2024"}},
  journal={${pub.source_name || "Polar Research Journal"}}
}`;
    }
    navigator.clipboard.writeText(citation);
    setCopiedId(`${pub.id}-${format}`);
    setTimeout(() => setCopiedId(null), 2500);
  }

  function generateOutreachText(pub: PublicationItem): string {
    return `🔬 New Indian Polar Science Research: "${pub.title}"\n\nAuthored by: ${pub.authors || "Indian Polar Research Team"}\nYear: ${pub.publication_year || "Recent"}\n\nRead more via @NCPOR_India & POLARIS Knowledge Hub: ${pub.source_url || "https://ncpor.res.in"}\n\n#PolarScience #Antarctica #Arctic #ClimateScience #MoES #IndiaInScience`;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-bold text-sm">Unable to load scientific publications.</p>
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search publications by title, authors, or keyword..."
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

        {/* YEAR FILTER */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
            Year:
          </span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing {filtered.length} of {data.length} publications
        </span>
        <span className="font-semibold text-sky-700">
          Peer-reviewed articles, monographs, &amp; cruise proceedings
        </span>
      </div>

      {/* PUBLICATIONS GRID */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-2xs">
          <div className="text-4xl">📚</div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">No publications found</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
            Try adjusting your search keywords or year filter.
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
                <div className="flex items-start justify-between gap-4">
                  <div className="text-3xl">📚</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 border border-sky-200">
                      Scientific Paper
                    </span>
                    {item.publication_year && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                        📅 {item.publication_year}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900 group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>

                {item.authors && (
                  <p className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Authors:</span> {item.authors}
                  </p>
                )}

                {item.abstract && (
                  <p className="mt-3 text-xs leading-5 text-slate-600 line-clamp-4">
                    {item.abstract}
                  </p>
                )}

                {item.source_name && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <span>🏛️</span>
                    <span className="font-medium text-slate-700">{item.source_name}</span>
                  </div>
                )}
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                {/* CITATION BUTTONS */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyCitation(item, "APA")}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    {copiedId === `${item.id}-APA` ? "✓ APA Copied" : "Cite (APA)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyCitation(item, "BibTeX")}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    {copiedId === `${item.id}-BibTeX` ? "✓ BibTeX" : "BibTeX"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOutreachModalPub(item);
                      setOutreachCopied(false);
                    }}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    ✨ Outreach Post
                  </button>
                </div>

                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-sky-700 hover:text-sky-800 inline-flex items-center gap-1"
                  >
                    Source ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* OUTREACH POST GENERATOR MODAL */}
      {outreachModalPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                <span>✨</span> Outreach &amp; Social Media Generator
              </span>
              <button
                type="button"
                onClick={() => setOutreachModalPub(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <h4 className="mt-3 text-base font-bold text-slate-900">
              {outreachModalPub.title}
            </h4>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs leading-relaxed text-slate-800 font-mono whitespace-pre-line">
                {generateOutreachText(outreachModalPub)}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Ready for X / Twitter &amp; LinkedIn
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateOutreachText(outreachModalPub));
                  setOutreachCopied(true);
                  setTimeout(() => setOutreachCopied(false), 2500);
                }}
                className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 transition shadow-2xs"
              >
                {outreachCopied ? "✓ Copied to Clipboard!" : "Copy Post Text"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
