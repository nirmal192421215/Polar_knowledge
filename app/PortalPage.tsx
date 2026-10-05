import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import { NAV_LINKS } from "./nav-config";
import { createClient } from "@/utils/supabase/client";

import PolarDataChart from "./PolarDataChart";
import MultiStationComparison from "./MultiStationComparison";
import DatasetCatalog from "./DatasetCatalog";
import PolarMap from "./PolarMap";
import ReportsSection from "./ReportsSection";
import PublicationsClient from "./PublicationsClient";
import ExpeditionsClient from "./ExpeditionsClient";
import MediaClient from "./MediaClient";
import ResearchClient from "./ResearchClient";

type Section =
  | "explore"
  | "expeditions"
  | "publications"
  | "media"
  | "data"
  | "map"
  | "research"
  | "reports";

export default async function PortalPage({
  section,
  regionFilter,
}: {
  section: Section;
  regionFilter?: string;
}) {
  const supabase = createClient();

  let data: any[] = [];
  let error: any = null;

  if (section === "expeditions") {
    const result = await supabase
      .from("expeditions")
      .select("*")
      .order("created_at", { ascending: false });

    data = result.data ?? [];
    error = result.error;
  }

  if (section === "publications") {
    const result = await supabase
      .from("publications")
      .select("*")
      .order("created_at", { ascending: false });

    data = result.data ?? [];
    error = result.error;
  }

  if (section === "media") {
    const result = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    data = result.data ?? [];
    error = result.error;
  }

  if (section === "research") {
    const result = await supabase
      .from("research_activities")
      .select("*")
      .order("created_at", { ascending: false });

    data = result.data ?? [];
    error = result.error;
  }

  if (section === "reports") {
    const result = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    data = result.data ?? [];
    error = result.error;
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* UNIFIED ENTERPRISE NAVBAR */}
      <Navbar />

      {/* PAGE HEADER BANNER */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50/60 via-white to-white px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 mb-4">
            🇮🇳 National Polar Repository
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold capitalize tracking-tight text-slate-900">
            {section === "data" ? (
              <>Live Polar <span className="text-blue-600">Telemetry</span></>
            ) : section === "map" ? (
              <>Polar Research <span className="text-blue-600">Map</span></>
            ) : section === "reports" ? (
              <>Scientific <span className="text-blue-600">Reports Archive</span></>
            ) : section === "expeditions" ? (
              <>Indian Polar <span className="text-blue-600">Expeditions</span></>
            ) : section === "publications" ? (
              <>Peer-Reviewed <span className="text-blue-600">Publications</span></>
            ) : (
              <span className="text-blue-600 capitalize">{section}</span>
            )}
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
            {getDescription(section)}
          </p>
        </div>
      </section>

      {/* SECTION CONTENT */}
      {section === "explore" && (
        <ExploreSection regionFilter={regionFilter} />
      )}

      {section === "expeditions" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <ExpeditionsClient data={data} error={error} />
        </section>
      )}

      {section === "publications" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <PublicationsClient data={data} error={error} />
        </section>
      )}

      {section === "media" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <MediaClient data={data} error={error} />
        </section>
      )}

      {section === "data" && (
        <DataSection />
      )}

      {section === "map" && (
        <MapSection />
      )}

      {section === "research" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <ResearchClient data={data} error={error} />
        </section>
      )}

      {section === "reports" && (
        <ReportsSection data={data} error={error} />
      )}

      {/* ENTERPRISE FOOTER */}
      <footer className="bg-[#0F1E3D] text-white">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm inline-flex items-center">
              <Image
                src="/images/polaris_logo.png"
                alt="POLARIS — India's Polar Science & Knowledge Portal"
                width={170}
                height={55}
                className="h-9 w-auto object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              {NAV_LINKS.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              ))}
              <Link href="/institutional" className="text-blue-300 hover:text-white transition font-medium">
                Institutional AI
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry Ingest Active</span>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 md:flex-row">
            <p>© 2026 POLARIS — Ministry of Earth Sciences (MoES) &amp; NCPOR | SIH 2026 PS 26063</p>
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition">
              Return to Portal Home
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

/* =========================================================
   DESCRIPTIONS
========================================================= */
function getDescription(section: Section) {
  switch (section) {
    case "explore":
      return "Discover polar domains, scientific research activities, publications, datasets, and media through India's unified knowledge platform.";
    case "expeditions":
      return "Explore India's historic scientific expeditions and research journeys across Antarctica, the Arctic, and the Southern Ocean since 1981.";
    case "publications":
      return "Browse peer-reviewed polar scientific publications, technical monographs, and academic literature with citation generation.";
    case "media":
      return "Discover photographs, research station imagery, and field documentation from India's polar expeditions.";
    case "data":
      return "Explore precision meteorological observations from NOAA South Pole Observatory and multi-station polar telemetry.";
    case "map":
      return "Interactive geographic visualization of India's polar research stations, field camps, and oceanic mooring points.";
    case "research":
      return "Explore multidisciplinary polar research themes: glaciology, atmospheric physics, marine biology, and geomagnetism.";
    case "reports":
      return "Access official scientific expedition reports, annual reviews, and technical bulletins archived by MoES and NCPOR.";
    default:
      return "Explore polar science knowledge and research.";
  }
}

/* =========================================================
   EXPLORE SECTION
========================================================= */
function ExploreSection({ regionFilter }: { regionFilter?: string }) {
  const ALL_CARDS = [
    {
      icon: "🧊",
      title: "Arctic Research",
      region: "arctic",
      description:
        "India's Himadri Station at Ny-Ålesund, Svalbard. Long-term atmospheric studies, fjord oceanography, and cryosphere monitoring.",
      href: "/explore?region=arctic",
      tag: "Himadri Station",
    },
    {
      icon: "🐧",
      title: "Antarctica Missions",
      region: "antarctica",
      description:
        "43 Indian scientific expeditions since 1981. Operational research bases at Maitri (Schirmacher Oasis) and Bharati (Larsemann Hills).",
      href: "/explore?region=antarctica",
      tag: "43+ Expeditions",
    },
    {
      icon: "🌊",
      title: "Southern Ocean",
      region: "southern-ocean",
      description:
        "Oceanographic cruises investigating carbon cycling, marine biodiversity, and Antarctic convergence dynamics.",
      href: "/explore?region=southern-ocean",
      tag: "Oceanography",
    },
    {
      icon: "🏔️",
      title: "Himalayan Cryo",
      region: "himalaya",
      description:
        "Himansh high-altitude glacier monitoring station in Chandra Basin, Himachal Pradesh. Third Pole observation.",
      href: "/explore?region=himalaya",
      tag: "Himansh Station",
    },
    {
      icon: "📚",
      title: "Scientific Papers",
      region: "publications",
      description:
        "Comprehensive index of peer-reviewed articles, expedition proceeding volumes, and technical reports.",
      href: "/publications",
      tag: "Publications",
    },
    {
      icon: "📊",
      title: "Live Datasets",
      region: "datasets",
      description:
        "14,616+ real NOAA South Pole observations with interactive charting and direct CSV dataset export.",
      href: "/data",
      tag: "NOAA Telemetry",
    },
    {
      icon: "📸",
      title: "Expedition Media",
      region: "media",
      description:
        "Curated visual documentation, field photographs, and station media from Antarctic and Arctic missions.",
      href: "/media",
      tag: "Photo Archive",
    },
    {
      icon: "🗺️",
      title: "3D Polar Map",
      region: "map",
      description:
        "Interactive 3D geospatial visualization of India's research stations, coordinates, and geographic context.",
      href: "/map",
      tag: "Interactive Map",
    },
    {
      icon: "📣",
      title: "Institutional Outreach AI",
      region: "outreach",
      description:
        "AI-assisted social media content, press releases, and articles generator for NCPOR/MoES activities and milestones.",
      href: "/institutional",
      tag: "AI Generator",
    },
  ];

  const activeRegion = regionFilter?.toLowerCase();
  const cards = activeRegion
    ? ALL_CARDS.filter((c) => c.region === activeRegion)
    : ALL_CARDS;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* Active filter banner */}
      {activeRegion && (
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-full border border-sky-300 bg-sky-50 px-4 py-1.5 text-xs font-bold text-sky-800">
            Filtering Region: <strong className="capitalize">{activeRegion.replace("-", " ")}</strong>
          </div>
          <Link href="/explore" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
            ✕ Clear filter
          </Link>
        </div>
      )}

      {/* Region filter chips */}
      {!activeRegion && (
        <div className="mb-10 flex flex-wrap gap-2.5">
          {["arctic", "antarctica", "southern-ocean", "himalaya"].map((r) => (
            <Link
              key={r}
              href={`/explore?region=${r}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold capitalize text-slate-700 shadow-2xs transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
            >
              {r.replace("-", " ")}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="polar-card p-3.5 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2.5 sm:mb-4">
                <span className="text-2xl sm:text-3xl">{card.icon}</span>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-700 border border-sky-200 truncate max-w-[85px] sm:max-w-none">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-xs sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                {card.title}
              </h3>
              <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs leading-snug sm:leading-5 text-slate-600 font-normal line-clamp-2 sm:line-clamp-none">
                {card.description}
              </p>
            </div>

            <div className="mt-3 sm:mt-6 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
              Explore Section <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}




/* =========================================================
   DATA SECTION
========================================================= */
function DataSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 space-y-12">
      <PolarDataChart />
      <MultiStationComparison />
      <DatasetCatalog />
    </section>
  );
}

/* =========================================================
   MAP SECTION
========================================================= */
function MapSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <span className="polar-badge mb-2">Geospatial Explorer</span>
        <h2 className="text-3xl font-extrabold text-slate-900">
          Geographic Research Coordinates
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Interactive map visualizing Maitri, Bharati, Himadri, and oceanic moorings.
        </p>
      </div>

      <PolarMap />
    </section>
  );
}



/* =========================================================
   EMPTY & ERROR STATES
========================================================= */
function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-2xs">
      <div className="text-5xl">{icon}</div>
      <h3 className="mt-4 text-xl font-bold text-slate-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
      <p className="font-bold text-sm">Unable to load this section</p>
      <p className="mt-1 text-xs text-red-600">{message}</p>
    </div>
  );
}