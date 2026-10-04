"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type ExpeditionItem = {
  id: string;
  name: string;
  region?: string | null;
  year?: string | number | null;
  description?: string | null;
  official_url?: string | null;
  leader?: string | null;
  vessel?: string | null;
  station?: string | null;
  objectives?: string[] | null;
  disciplines?: string[] | null;
};

// Comprehensive landmark expeditions catalog bridging database records
const LANDMARK_EXPEDITIONS: ExpeditionItem[] = [
  {
    id: "exp-43",
    name: "43rd Indian Antarctic Expedition",
    region: "Antarctica",
    year: "2023-24",
    leader: "Dr. Sailesh Agrawal & NCPOR Winter Team",
    vessel: "MV Vasiliy Golovnin",
    station: "Bharati & Maitri Stations",
    description:
      "Ongoing long-term multi-disciplinary scientific observation expedition investigating atmospheric trace gases, glaciological mass balance, paleoclimate ice-core reconstruction, and geomagnetism in East Antarctica.",
    objectives: [
      "Deep ice core retrieval at Schirmacher Oasis",
      "Continuous radiation budget and meteorological monitoring",
      "Refurbishment and modernization of Bharati station infrastructure",
      "Biological sampling of Antarctic microbial ecosystems",
    ],
    disciplines: ["Glaciology", "Atmospheric Physics", "Microbiology", "Geodesy"],
    official_url: "https://ncps.ncpor.res.in/expedition/india_antarctica.php",
  },
  {
    id: "exp-42",
    name: "42nd Indian Antarctic Expedition",
    region: "Antarctica",
    year: "2022-23",
    leader: "NCPOR Scientific Division",
    vessel: "MV Vasiliy Golovnin",
    station: "Bharati Station (Larsemann Hills)",
    description:
      "Conducted extensive high-precision measurements of coastal Antarctic ice shelf calving, ocean-atmosphere flux exchanges, and real-time seismic monitoring along the Larsemann Hills corridor.",
    objectives: [
      "GPS crustal deformation measurements across Queen Maud Land",
      "Aerosol optical depth and black carbon concentration profiling",
      "Installation of automated polar weather telemetry sensors",
    ],
    disciplines: ["Seismology", "Oceanography", "Meteorology"],
    official_url: "https://ncps.ncpor.res.in/expedition/india_antarctica.php",
  },
  {
    id: "exp-41",
    name: "41st Indian Antarctic Expedition",
    region: "Antarctica",
    year: "2021-22",
    leader: "Dr. Shailendra Saini (NCPOR)",
    vessel: "MV Vasiliy Golovnin",
    station: "Maitri & Bharati Stations",
    description:
      "Successfully completed white-continent winter overoperations during the COVID-19 pandemic, successfully maintaining uninterrupted scientific records at Maitri and Bharati without contamination.",
    objectives: [
      "Geomagnetic storm monitoring during solar cycle transition",
      "Amery Ice Shelf structural stability assessment",
      "Fuel and logistics replenishment for year-round research teams",
    ],
    disciplines: ["Space Weather", "Cryospheric Science", "Environmental Physics"],
    official_url: "https://ncps.ncpor.res.in/expedition/india_antarctica.php",
  },
  {
    id: "exp-40",
    name: "40th Indian Antarctic Expedition",
    region: "Antarctica",
    year: "2020-21",
    leader: "Dr. Atul Suresh Kulkarni",
    vessel: "MV Vasiliy Golovnin",
    station: "Bharati & Maitri",
    description:
      "Marked four historic decades of sustained Indian scientific presence on the Antarctic continent since the maiden 1981 expedition, focusing on climate change signatures in Antarctic lakes.",
    objectives: [
      "Priyadarshini Lake limnological core drilling",
      "Long-term climate baseline database synchronization",
      "Stratospheric ozone depletion dynamics over South Pole",
    ],
    disciplines: ["Limnology", "Paleoclimatology", "Atmospheric Science"],
    official_url: "https://ncps.ncpor.res.in/expedition/india_antarctica.php",
  },
  {
    id: "exp-arc-16",
    name: "16th Indian Arctic Scientific Expedition",
    region: "Arctic",
    year: "2023",
    leader: "NCPOR Arctic Research Group",
    vessel: "Ny-Ålesund Research Facility",
    station: "Himadri Station (Svalbard, Norway)",
    description:
      "Summer research campaign at 78°55′N focusing on fjords hydrography, atmospheric boundary layer profiling, and Arctic sea-ice loss impacts on the Indian monsoon system.",
    objectives: [
      "Retrieval of IndARC underwater mooring telemetry data",
      "Svalbard glacier snout retreat photogrammetry",
      "Marine bio-fouling and microbial enzyme analysis in sub-zero water",
    ],
    disciplines: ["Monsoon Dynamics", "Marine Ecology", "Fjord Oceanography"],
    official_url: "https://ncpor.res.in/pages/view/29/18-arctic-research-himadri",
  },
  {
    id: "exp-so-12",
    name: "12th Indian Southern Ocean Expedition",
    region: "Southern Ocean",
    year: "2020",
    leader: "MoES Multi-Institutional Cruise",
    vessel: "ORV Sagar Nidhi / SA Agulhas",
    station: "Antarctic Convergence Zone",
    description:
      "Dedicated multi-disciplinary oceanographic cruise investigating carbon dioxide draw-down, trace metal biogeochemistry, and ocean acidification across 40°S to 68°S latitudes.",
    objectives: [
      "Nutrient limitation mapping along the Polar Front",
      "Phytoplankton community structure and primary productivity",
      "Deep CTD casts to 4,500m depth across Sub-Antarctic waters",
    ],
    disciplines: ["Chemical Oceanography", "Biogeochemistry", "Climate Modeling"],
    official_url: "https://ncpor.res.in/pages/view/31/20-southern-ocean-expeditions",
  },
  {
    id: "exp-30",
    name: "30th Indian Antarctic Expedition",
    region: "Antarctica",
    year: "2010-11",
    leader: "Dr. Rajesh Asthana (GSI)",
    vessel: "MV Ivan Papanin",
    station: "Bharati Station Construction Site",
    description:
      "Landmark expedition that laid the foundation and erected the main containerized architecture for India's 3rd research station, Bharati, at Larsemann Hills.",
    objectives: [
      "Site structural engineering and environmental impact assessment",
      "Oceanographic survey of Prydz Bay",
      "Fast-ice satellite ground truthing",
    ],
    disciplines: ["Polar Engineering", "Oceanography", "Geophysics"],
    official_url: "https://ncps.ncpor.res.in/expedition/india_antarctica.php",
  },
  {
    id: "exp-arc-01",
    name: "1st Indian Arctic Expedition",
    region: "Arctic",
    year: "2007-08",
    leader: "Dr. Rasik Ravindra (NCPOR)",
    vessel: "Ny-Ålesund Research Base",
    station: "Himadri Station (Inaugurated July 2008)",
    description:
      "India's historic entry into Arctic science, establishing India as one of only a handful of nations operating permanent year-round research infrastructure in both polar regions.",
    objectives: [
      "Commissioning of Himadri Station at Ny-Ålesund, Spitsbergen",
      "Initiation of long-term aerosol and glaciological monitoring",
      "Indo-Norwegian polar science bilateral collaboration",
    ],
    disciplines: ["Glaciology", "Atmospheric Chemistry", "Polar Policy"],
    official_url: "https://ncpor.res.in/pages/view/29/18-arctic-research-himadri",
  },
  {
    id: "exp-08",
    name: "8th Indian Antarctic Expedition",
    region: "Antarctica",
    year: "1988-89",
    leader: "Dr. Amitava Sengupta (NPL)",
    vessel: "MV Thuleland",
    station: "Maitri Station (Commissioned 1989)",
    description:
      "Constructed and commissioned Maitri Station in the ice-free Schirmacher Oasis to replace Dakshin Gangotri, providing year-round living quarters and advanced laboratories.",
    objectives: [
      "Erection of permanent heated accommodation for 25 winter members",
      "Freshwater extraction system from Lake Priyadarshini",
      "Permanent riometer and magnetometer installation",
    ],
    disciplines: ["Civil Engineering", "Geomagnetism", "Meteorology"],
    official_url: "https://ncps.ncpor.res.in/expedition/india_antarctica.php",
  },
  {
    id: "exp-03",
    name: "3rd Indian Antarctic Expedition",
    region: "Antarctica",
    year: "1983-84",
    leader: "Dr. Harsh K. Gupta (NGRI)",
    vessel: "MV Finnpolaris",
    station: "Dakshin Gangotri (India's First Station)",
    description:
      "Historic milestone expedition that built India's first permanent Antarctic base—Dakshin Gangotri—in record time of 60 days on the Princess Astrid Coast ice shelf.",
    objectives: [
      "Construction of India's first permanent station, Dakshin Gangotri",
      "First Indian team to spend winter in Antarctica (12 members)",
      "Continuous meteorological recording station installation",
    ],
    disciplines: ["Geophysics", "Meteorology", "Structural Engineering"],
    official_url: "https://ncps.ncpor.res.in/expedition/india_antarctica.php",
  },
  {
    id: "exp-01",
    name: "1st Indian Antarctic Expedition",
    region: "Antarctica",
    year: "1981-82",
    leader: "Dr. S.Z. Qasim (Secretary, DOD)",
    vessel: "MV Polar Circle",
    station: "Queen Maud Land Ice Shelf",
    description:
      "The historic maiden voyage that launched India's Polar Science Programme. On January 9, 1982, the Indian tricolor was hoisted in Antarctica, establishing India's pioneering status as the first developing nation to explore the white continent.",
    objectives: [
      "Maiden landing of Indian scientific team on Antarctic ice cap",
      "Oceanographic sampling along 40°S to 70°S traverse",
      "Geological surveys of nunataks and ice thickness soundings",
      "Paved the way for India joining the Antarctic Treaty in 1983",
    ],
    disciplines: ["Exploration", "Oceanography", "Geology", "Meteorology"],
    official_url: "https://ncps.ncpor.res.in/expedition/india_antarctica.php",
  },
];

export default function ExpeditionsClient({
  data = [],
  error,
}: {
  data?: ExpeditionItem[];
  error?: any;
}) {
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedDecade, setSelectedDecade] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [selectedExpedition, setSelectedExpedition] = useState<ExpeditionItem | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Combine Supabase data with rich landmark catalog (avoiding duplicate names)
  const combinedList = useMemo(() => {
    const list = [...LANDMARK_EXPEDITIONS];
    const existingNames = new Set(list.map((e) => e.name.toLowerCase().trim()));

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item && item.name && !existingNames.has(item.name.toLowerCase().trim())) {
          list.push({
            id: item.id,
            name: item.name,
            region: item.region || "Antarctica",
            year: item.year || "Recorded",
            description: item.description,
            official_url: item.official_url,
          });
        }
      });
    }

    return list;
  }, [data]);

  // Filtered dataset
  const filtered = useMemo(() => {
    return combinedList.filter((item) => {
      // Region Match
      const matchRegion =
        selectedRegion === "All" ||
        (item.region && item.region.toLowerCase().includes(selectedRegion.toLowerCase()));

      // Decade Match
      const yearNum = parseInt(String(item.year).slice(0, 4), 10);
      let matchDecade = true;
      if (selectedDecade === "2020s") matchDecade = yearNum >= 2020;
      else if (selectedDecade === "2010s") matchDecade = yearNum >= 2010 && yearNum < 2020;
      else if (selectedDecade === "2000s") matchDecade = yearNum >= 2000 && yearNum < 2010;
      else if (selectedDecade === "1990s") matchDecade = yearNum >= 1990 && yearNum < 2000;
      else if (selectedDecade === "1980s") matchDecade = yearNum >= 1980 && yearNum < 1990;

      // Query Search
      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.leader && item.leader.toLowerCase().includes(q)) ||
        (item.station && item.station.toLowerCase().includes(q)) ||
        (item.vessel && item.vessel.toLowerCase().includes(q)) ||
        (item.disciplines && item.disciplines.some((d) => d.toLowerCase().includes(q)));

      return matchRegion && matchDecade && matchQuery;
    });
  }, [combinedList, selectedRegion, selectedDecade, query]);

  const handleShare = (exp: ExpeditionItem) => {
    const text = `🧭 Indian Polar Expedition: ${exp.name} (${exp.year})\nRegion: ${exp.region || "Antarctica"}\nStation/Vessel: ${exp.station || exp.vessel || "NCPOR"}\nExplore India's 43+ polar missions on POLARIS Knowledge Hub: https://polaris.ncpor.res.in/expeditions`;
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-bold text-sm">Unable to load expedition records.</p>
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── 1. KPI SUMMARY STRIP ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Antarctic Missions
            </span>
            <span className="text-xl">🧊</span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">43+</div>
          <p className="mt-1 text-xs text-slate-500">
            Consecutive summer &amp; winter expeditions since 1981
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Arctic Expeditions
            </span>
            <span className="text-xl">❄️</span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">16+</div>
          <p className="mt-1 text-xs text-slate-500">
            Continuous annual campaigns at Himadri Station, Svalbard
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Southern Ocean
            </span>
            <span className="text-xl">🌊</span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">12 Cruises</div>
          <p className="mt-1 text-xs text-slate-500">
            Biogeochemical surveys across 40°S to 68°S
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Active Stations
            </span>
            <span className="text-xl">🏔️</span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">4 Bases</div>
          <p className="mt-1 text-xs text-slate-500">
            Bharati, Maitri, Himadri &amp; Himansh (Third Pole)
          </p>
        </div>
      </div>

      {/* ── 2. SEARCH & CONTROLS TOOLBAR ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search expeditions by name, leader, station, vessel, or discipline..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute left-3.5 top-2.5 text-sm text-slate-400">
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

          {/* VIEW MODE TOGGLE */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-white text-blue-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔲 Card Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "timeline"
                  ? "bg-white text-blue-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ⏳ Timeline View
            </button>
          </div>
        </div>

        {/* FILTER CHIPS (REGIONS & DECADES) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* REGION FILTERS */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Region:</span>
            {["All", "Antarctica", "Arctic", "Southern Ocean"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRegion(r)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  selectedRegion === r
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {r === "All" ? "🌐 All Regions" : r === "Antarctica" ? "🧊 Antarctica" : r === "Arctic" ? "❄️ Arctic" : "🌊 Southern Ocean"}
              </button>
            ))}
          </div>

          {/* DECADE FILTERS */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Era:</span>
            {["All", "2020s", "2010s", "2000s", "1990s", "1980s"].map((dec) => (
              <button
                key={dec}
                type="button"
                onClick={() => setSelectedDecade(dec)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  selectedDecade === dec
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {dec === "All" ? "All Time" : dec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. RESULTS STATUS BAR ── */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-900">{filtered.length}</span> of{" "}
          <span className="font-semibold text-slate-700">{combinedList.length}</span> documented expeditions
          {selectedRegion !== "All" && (
            <span className="ml-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 font-semibold">
              {selectedRegion}
            </span>
          )}
          {selectedDecade !== "All" && (
            <span className="ml-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 font-semibold">
              {selectedDecade}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setQuery("");
            setSelectedRegion("All");
            setSelectedDecade("All");
          }}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Reset Filters
        </button>
      </div>

      {/* ── 4. VIEW RENDERING ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="text-4xl mb-3">🧭</div>
          <h3 className="text-base font-bold text-slate-900">No matching expeditions found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, clearing region filters, or resetting the era filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedRegion("All");
              setSelectedDecade("All");
            }}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            Show All Expeditions
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ── GRID VIEW ── */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between transition-all duration-200 hover:border-blue-300 hover:shadow-md group"
            >
              <div>
                {/* TOP BADGES */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.region === "Arctic"
                        ? "border-teal-200 bg-teal-50 text-teal-700"
                        : item.region === "Southern Ocean"
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                    {item.region === "Arctic" ? "❄️ Arctic" : item.region === "Southern Ocean" ? "🌊 Southern Ocean" : "🧊 Antarctica"}
                  </span>

                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    📅 {item.year}
                  </span>
                </div>

                {/* EXPEDITION TITLE */}
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>

                {/* STATION / VESSEL / LEADER */}
                {(item.station || item.vessel || item.leader) && (
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    {item.station && (
                      <p className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-400">📍</span>
                        <span className="font-semibold text-slate-800">Base:</span> {item.station}
                      </p>
                    )}
                    {item.vessel && (
                      <p className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-400">🚢</span>
                        <span className="font-semibold text-slate-800">Vessel:</span> {item.vessel}
                      </p>
                    )}
                    {item.leader && (
                      <p className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-400">👤</span>
                        <span className="font-semibold text-slate-800">Leader:</span> {item.leader}
                      </p>
                    )}
                  </div>
                )}

                {/* DESCRIPTION */}
                {item.description && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {item.description}
                  </p>
                )}

                {/* DISCIPLINES TAGS */}
                {item.disciplines && item.disciplines.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.disciplines.map((d) => (
                      <span
                        key={d}
                        className="rounded-md bg-slate-50 border border-slate-200/80 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* CARD ACTIONS */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedExpedition(item)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  Mission Dossier →
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleShare(item)}
                    title="Copy Share Link"
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition text-xs"
                  >
                    🔗
                  </button>

                  {item.official_url && (
                    <a
                      href={item.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition"
                    >
                      MoES / NCPOR ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* ── TIMELINE VIEW ── */
        <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-3 md:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-200">
          {filtered.map((item, index) => (
            <div key={item.id} className="relative group">
              {/* TIMELINE NODE */}
              <div className="absolute -left-6 md:-left-10 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 bg-white text-[10px] font-black text-blue-600 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
                {index + 1}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-xs font-black">
                      {item.year}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      📍 {item.region}
                    </span>
                  </div>

                  {item.station && (
                    <span className="text-xs font-bold text-slate-700">
                      🏢 {item.station}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                )}

                {item.objectives && item.objectives.length > 0 && (
                  <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Key Mission Objectives:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                      {item.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedExpedition(item)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    View Full Mission Dossier →
                  </button>

                  {item.official_url && (
                    <a
                      href={item.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-500 hover:text-blue-600"
                    >
                      Official NCPOR Archive ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 5. MISSION DOSSIER MODAL ── */}
      {selectedExpedition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setSelectedExpedition(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600 hover:bg-slate-200 transition"
            >
              ×
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-800">
                Official Mission Dossier
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                📅 {selectedExpedition.year}
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 pr-8">
              {selectedExpedition.name}
            </h2>

            {/* SPECIFICATIONS GRID */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Geographic Domain:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  📍 {selectedExpedition.region || "Antarctica"}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Base / Station:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  🏢 {selectedExpedition.station || "Maitri / Bharati Stations"}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Research Vessel:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  🚢 {selectedExpedition.vessel || "Polar Icebreaker"}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Mission Leader:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  👤 {selectedExpedition.leader || "National Centre for Polar and Ocean Research (NCPOR)"}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Executive Scientific Summary
              </h4>
              <p className="text-sm leading-relaxed text-slate-700">
                {selectedExpedition.description ||
                  "This scientific expedition forms a key pillar of India's long-term polar observation initiative managed under the Ministry of Earth Sciences (MoES)."}
              </p>
            </div>

            {/* OBJECTIVES */}
            {selectedExpedition.objectives && selectedExpedition.objectives.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Scientific Deliverables &amp; Milestones
                </h4>
                <div className="space-y-2">
                  {selectedExpedition.objectives.map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs text-slate-700"
                    >
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DISCIPLINES */}
            {selectedExpedition.disciplines && selectedExpedition.disciplines.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Research Disciplines
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExpedition.disciplines.map((d) => (
                    <span
                      key={d}
                      className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MODAL FOOTER */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => handleShare(selectedExpedition)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                {shareCopied ? "✓ Link Copied!" : "🔗 Share Mission Dossier"}
              </button>

              <div className="flex items-center gap-2">
                {selectedExpedition.official_url && (
                  <a
                    href={selectedExpedition.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
                  >
                    Open NCPOR Archive ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedExpedition(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
