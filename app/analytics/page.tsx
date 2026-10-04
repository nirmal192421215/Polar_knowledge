import Link from "next/link";
import Navbar from "../Navbar";
import AnalyticsDashboard from "./AnalyticsDashboard";

export const metadata = {
  title: "Polar Science Analytics & Telemetry Dashboard | POLARIS",
  description:
    "Comprehensive analytics on India's polar research expeditions, meteorological observation trends, and atmospheric telemetry.",
};

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* UNIFIED ENTERPRISE NAVBAR */}
      <Navbar />

      {/* HEADER BANNER */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50/60 via-white to-white px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 mb-4">
            📊 Polar Informatics &amp; Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Research Analytics &amp; <span className="text-blue-600">Telemetry</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
            Real-time informatics synthesis across India&apos;s Arctic, Antarctic, and Southern Ocean expeditions, multi-station observation telemetry, and scientific publications.
          </p>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <AnalyticsDashboard />
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F1E3D] text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-10 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold tracking-widest text-white text-lg">POLARIS</span>
              <span className="text-xs text-blue-400">· Science Informatics</span>
            </div>
            <p className="text-xs text-slate-400">
              National Polar Science Knowledge &amp; Outreach Portal · MoES / NCPOR
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-xs text-slate-400">
            {[
              { label: "Explore", href: "/explore" },
              { label: "Live Data", href: "/data" },
              { label: "Reports", href: "/reports" },
              { label: "Analytics", href: "/analytics" },
              { label: "Home", href: "/" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
