"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const EXPEDITIONS_BY_REGION = [
  { name: "Antarctica (South)", count: 43, color: "#2563eb" },
  { name: "Arctic (North)", count: 16, color: "#0d9488" },
  { name: "Southern Ocean", count: 12, color: "#4f46e5" },
  { name: "Himalayan Cryo", count: 8, color: "#d97706" },
];

const RESEARCH_DOMAIN_DISTRIBUTION = [
  { name: "Cryosphere & Sea Ice", percentage: 32, color: "#2563eb" },
  { name: "Atmospheric Physics", percentage: 28, color: "#0d9488" },
  { name: "Polar Oceanography", percentage: 18, color: "#4f46e5" },
  { name: "Space Weather & Geomagnetism", percentage: 12, color: "#7c3aed" },
  { name: "Polar Biology & Ecosystems", percentage: 10, color: "#059669" },
];

const OBSERVATIONS_BY_MONTH = [
  { month: "Jan", records: 744, avgTemp: -28.2 },
  { month: "Feb", records: 672, avgTemp: -40.5 },
  { month: "Mar", records: 744, avgTemp: -53.8 },
  { month: "Apr", records: 720, avgTemp: -57.4 },
  { month: "May", records: 744, avgTemp: -58.1 },
  { month: "Jun", records: 720, avgTemp: -59.0 },
  { month: "Jul", records: 744, avgTemp: -60.4 },
  { month: "Aug", records: 744, avgTemp: -59.8 },
  { month: "Sep", records: 720, avgTemp: -58.7 },
  { month: "Oct", records: 744, avgTemp: -51.2 },
  { month: "Nov", records: 720, avgTemp: -38.6 },
  { month: "Dec", records: 744, avgTemp: -27.9 },
];

const STATION_STATUS = [
  {
    name: "South Pole Station (SPO)",
    region: "Antarctica (90° S)",
    status: "Active / Telemetry Ingested",
    records: "14,616 rows",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    metrics: "Temp, Wind, Pressure, Humidity, Radiation",
  },
  {
    name: "Bharati Station",
    region: "Larsemann Hills, Antarctica",
    status: "Operational Research Base",
    records: "Automated Weather Station (AWS)",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    metrics: "Oceanography, Atmosphere, Glaciology",
  },
  {
    name: "Maitri Station",
    region: "Schirmacher Oasis, Antarctica",
    status: "Operational Research Base",
    records: "Multidisciplinary Lab",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    metrics: "Geomagnetism, Meteorology, Biology",
  },
  {
    name: "Himadri Station",
    region: "Ny-Ålesund, Svalbard (Arctic)",
    status: "Operational Arctic Base",
    records: "Continuous AWS",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    metrics: "Atmospheric Science, Marine Biology",
  },
];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "observations" | "domains">("overview");

  return (
    <div className="space-y-10">
      {/* KPI STATS ROW */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Live Observations
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">14,616+</div>
          <p className="mt-1.5 text-xs text-slate-500">
            NOAA SPO meteorological points synchronized
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Active Stations
            </span>
            <span className="text-lg">🏔️</span>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">4 Bases</div>
          <p className="mt-1.5 text-xs text-slate-500">
            Bharati, Maitri, Himadri &amp; South Pole SPO
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Indian Expeditions
            </span>
            <span className="text-lg">🚢</span>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">43+</div>
          <p className="mt-1.5 text-xs text-slate-500">
            Historic and ongoing scientific research missions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Data Integrity
            </span>
            <span className="text-lg">🛡️</span>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">99.8%</div>
          <p className="mt-1.5 text-xs text-slate-500">
            Verified insitu observations without telemetry gaps
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`rounded-xl px-5 py-2 text-xs font-bold transition ${
            activeTab === "overview"
              ? "border border-blue-600 bg-blue-600 text-white shadow-xs"
              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          📊 Comprehensive Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("observations")}
          className={`rounded-xl px-5 py-2 text-xs font-bold transition ${
            activeTab === "observations"
              ? "border border-blue-600 bg-blue-600 text-white shadow-xs"
              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          📈 Annual Observation Cycle
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("domains")}
          className={`rounded-xl px-5 py-2 text-xs font-bold transition ${
            activeTab === "domains"
              ? "border border-blue-600 bg-blue-600 text-white shadow-xs"
              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          🧪 Research Domains &amp; Stations
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* EXPEDITIONS BY REGION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Expeditions by Polar Domain</h3>
            <p className="mt-1 text-xs text-slate-500">
              Distribution of India&apos;s 79+ polar and cryospheric scientific expeditions
            </p>
            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EXPEDITIONS_BY_REGION} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                      color: "#0f172a",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  />
                  <Bar dataKey="count" name="Expeditions" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RESEARCH DOMAIN PIE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Scientific Research Focus</h3>
            <p className="mt-1 text-xs text-slate-500">
              Breakdown of publication areas under MoES &amp; NCPOR polar scientific programs
            </p>
            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RESEARCH_DOMAIN_DISTRIBUTION}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={55}
                    paddingAngle={4}
                  >
                    {RESEARCH_DOMAIN_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                      color: "#0f172a",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    formatter={(val) => [`${val}%`, "Share"]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                    formatter={(val) => <span className="text-slate-700 font-medium">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OBSERVATIONS ANNUAL CYCLE */}
      {activeTab === "observations" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">South Pole Monthly Temperature Trend</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Annual temperature profile demonstrating extreme Antarctic winter plunge down to -60.4°C
                </p>
              </div>
              <Link
                href="/data"
                className="btn-polar-secondary text-xs px-3.5 py-1.5 self-start"
              >
                <span>📈</span> View Live Data Explorer →
              </Link>
            </div>

            <div className="mt-6 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={OBSERVATIONS_BY_MONTH} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="tempGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="°C" domain={[-70, -20]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                      color: "#0f172a",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    formatter={(val) => [`${val} °C`, "Average Temp"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgTemp"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGradientLight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOMAINS & STATIONS */}
      {activeTab === "domains" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Monitored Polar Research Stations</h3>
            <p className="mt-1 text-xs text-slate-500">
              Operational status, geographic sectors, and telemetry feeds from Antarctic &amp; Arctic observatories
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {STATION_STATUS.map((station) => (
                <div
                  key={station.name}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:bg-white hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{station.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">📍 {station.region}</p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${station.badgeColor}`}
                    >
                      {station.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col gap-1 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-800 font-semibold">Data Stream:</span> {station.records}
                    </div>
                    <div>
                      <span className="text-slate-800 font-semibold">Instrumentation:</span> {station.metrics}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCIENTIFIC COMPLIANCE & EXPORT BAR */}
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
        <div>
          <span className="polar-badge mb-2">
            Open Polar Science Initiative
          </span>
          <h4 className="text-base font-extrabold text-slate-900">
            FAIR Data Principles Compliant (Findable, Accessible, Interoperable, Reusable)
          </h4>
          <p className="mt-1 text-xs text-slate-600 max-w-xl">
            All telemetry streams and metadata comply with international Antarctic Treaty &amp; SCAR (Scientific Committee on Antarctic Research) standards.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/data"
            className="btn-polar-primary text-xs"
          >
            📥 Export Observations (.CSV)
          </Link>
          <Link
            href="/reports"
            className="btn-polar-secondary text-xs"
          >
            📑 Browse Reports Archive
          </Link>
        </div>
      </div>
    </div>
  );
}
