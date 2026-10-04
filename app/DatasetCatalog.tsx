"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Dataset = {
  id: string;
  title: string;
  description: string | null;
  dataset_type: string | null;
  location: string | null;
  station: string | null;
  source_name: string | null;
  source_url: string | null;
  data_url: string | null;
  last_updated: string | null;
  status: string | null;
};

export default function DatasetCatalog() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (dataset: Dataset) => {
    const citation = `${dataset.source_name || "National Centre for Polar and Ocean Research (NCPOR)"}. (${new Date().getFullYear()}). "${dataset.title}." POLARIS National Polar Science Knowledge Hub, Ministry of Earth Sciences, Govt. of India. ${dataset.source_url || "https://polaris.ncpor.res.in/data"}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(dataset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  useEffect(() => {
    async function loadDatasets() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("datasets")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setDatasets(data ?? []);
      } catch (err: any) {
        setError(err?.message || "Unable to load datasets.");
      } finally {
        setLoading(false);
      }
    }

    loadDatasets();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <span className="polar-badge mb-2">Scientific Catalog</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Polar Dataset Catalog
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Discover verified polar datasets available through the POLARIS scientific repository, including real NOAA insitu observations and simulation models.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-sky-700">
          Loading datasets from repository...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-bold text-sm">Unable to load dataset catalog</p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      ) : datasets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
          <div className="text-4xl">📊</div>
          <h3 className="mt-3 text-lg font-bold text-slate-800">No datasets available</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
            Dataset records will appear here when they are added to the POLARIS repository.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {datasets.map((dataset) => {
            const isSynthetic =
              dataset.title.toLowerCase().includes("synthetic") ||
              dataset.title.toLowerCase().includes("prototype");

            return (
              <div
                key={dataset.id}
                className="polar-card p-7 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-3xl">📊</div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        isSynthetic
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {isSynthetic ? "SIMULATION MODEL" : "VERIFIED DATASET"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {dataset.title}
                  </h3>

                  {dataset.description && (
                    <p className="mt-2.5 text-xs leading-5 text-slate-600">
                      {dataset.description}
                    </p>
                  )}

                  <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Location
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-800">
                        {dataset.location || "Antarctica"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Station
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-800">
                        {dataset.station || "Multiple Stations"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Domain Type
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-800">
                        {dataset.dataset_type || "Meteorological"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Authority
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-800">
                        {dataset.source_name || "NCPOR / MoES"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">
                  {dataset.source_url && (
                    <a
                      href={dataset.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100 transition"
                    >
                      Official Source ↗
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCopyCitation(dataset)}
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    {copiedId === dataset.id ? "✓ Citation Copied!" : "📋 Cite Dataset"}
                  </button>

                  <a
                    href="#data"
                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    View in Explorer →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}