"use client";

import { useMemo, useState } from "react";

export type ResearchActivityItem = {
  id: string;
  title: string;
  discipline:
    | "Cryosphere & Glaciology"
    | "Atmospheric Physics"
    | "Marine Biology"
    | "Paleoclimatology"
    | "Space Weather & Geomagnetism"
    | "Environmental Sciences";
  region: "Antarctica" | "Arctic" | "Himalaya" | "Southern Ocean";
  station?: string | null;
  institution?: string | null;
  pi?: string | null;
  status: "Active / Ongoing" | "Long-term Baseline" | "Completed Phase";
  description?: string | null;
  objectives?: string[] | null;
  funding_program?: string | null;
  source_url?: string | null;
};

// Comprehensive landmark research programs across Indian polar science
const LANDMARK_RESEARCH_PROGRAMS: ResearchActivityItem[] = [
  {
    id: "res-1",
    title: "Dynamics and Mass Balance of East Antarctic Ice Sheet (Larsemann Hills & Schirmacher Oasis)",
    discipline: "Cryosphere & Glaciology",
    region: "Antarctica",
    station: "Bharati & Maitri Stations",
    institution: "NCPOR & Geological Survey of India (GSI)",
    pi: "Dr. Thamban Meloth & Cryospheric Science Group",
    status: "Active / Ongoing",
    description:
      "High-precision continuous monitoring of coastal ice shelf calving, sub-glacial bedrock topography using ground-penetrating radar (GPR), and differential GPS measurements of ice flow velocity across Queen Maud Land.",
    objectives: [
      "Quantify annual ice mass loss along coastal Antarctica",
      "Survey grounding line migration of Amery and Dronning Maud Land ice shelves",
      "Deploy automated ablation sensor stakes on continental ice sheet",
      "Reconstruct seasonal accumulation rates using Shallow firn cores",
    ],
    funding_program: "MoES PRITHVI Scheme · Polar Science and Cryosphere (PACER)",
    source_url: "https://ncpor.res.in/polar-research-glaciology",
  },
  {
    id: "res-2",
    title: "IndARC: Long-Term Underwater Moored Oceanographic Observatory in Kongsfjorden",
    discipline: "Marine Biology",
    region: "Arctic",
    station: "Himadri Station (Ny-Ålesund)",
    institution: "NCPOR, NIO & NIOT (Ministry of Earth Sciences)",
    pi: "Dr. K. P. Krishnan & Arctic Research Group",
    status: "Long-term Baseline",
    description:
      "India's first multi-sensor underwater moored observatory deployed at 192m depth in the Arctic fjord Kongsfjorden, recording continuous seawater temperature, salinity, acoustic zooplankton backscatter, and dissolved oxygen to assess Arctic-Indian Monsoon teleconnections.",
    objectives: [
      "Decipher Arctic warming impacts on Atlantic Water intrusion into Kongsfjorden",
      "Continuous biogeochemical profiling of high-latitude marine ecosystems",
      "Investigate teleconnections between Arctic sea ice retreat and Indian Monsoon variability",
      "Monitor phytoplankton bloom dynamics under 24-hour polar day and night transitions",
    ],
    funding_program: "Indian Arctic Research Programme (IARP) · MoES",
    source_url: "https://ncpor.res.in/polar-research-arctic",
  },
  {
    id: "res-3",
    title: "Stratospheric Ozone, Aerosol Radiative Forcing & Boundary Layer Meteorology",
    discipline: "Atmospheric Physics",
    region: "Antarctica",
    station: "Maitri Station",
    institution: "Indian Institute of Geomagnetism (IIG) & IMD",
    pi: "Dr. B. Pathak (IIG) & NCPOR Winter Atmospheric Team",
    status: "Active / Ongoing",
    description:
      "Continuous observation of atmospheric trace gases, black carbon concentrations, ozone hole recovery dynamics, and surface energy budget at Schirmacher Oasis using sun-photometers, ozonesondes, and sonic anemometers.",
    objectives: [
      "Ozonesonde balloon launches to track spring Antarctic stratospheric ozone depletion",
      "Aerosol optical depth (AOD) measurements in pristine polar atmospheres",
      "Atmospheric boundary layer turbulence and katabatic wind modeling",
      "Global electricity circuit (GEC) measurements via atmospheric electric field mills",
    ],
    funding_program: "MoES Atmospheric & Oceanic Sciences Initiative",
    source_url: "https://ncpor.res.in",
  },
  {
    id: "res-4",
    title: "High-Altitude Himalayan Cryospheric Monitoring at Himansh Observatory",
    discipline: "Cryosphere & Glaciology",
    region: "Himalaya",
    station: "Himansh Station (Chandra Basin, Spiti Valley)",
    institution: "NCPOR, Wadia Institute of Himalayan Geology (WIHG)",
    pi: "Dr. Parmanand Sharma & Himalayan Cryosphere Group",
    status: "Active / Ongoing",
    description:
      "Integrated hydrological, glaciological, and meteorological monitoring of the Chandra Basin glaciers at 4,070m altitude, providing benchmark baseline data on glacier retreat, debris cover insulation, and glacial lake outburst flood (GLOF) hazards in the Third Pole.",
    objectives: [
      "Benchmark mass balance on Batal, Sutri Dhaka, and Samudra Tapu glaciers",
      "Automated weather station (AWS) telemetry at 4,000m+ elevations",
      "Hydro-chemical sampling of glacial meltwater discharge",
      "Early warning modeling for high-altitude proglacial lake expansion",
    ],
    funding_program: "National Mission for Sustaining the Himalayan Ecosystem (NMSHE)",
    source_url: "https://ncpor.res.in/polar-research-himalaya",
  },
  {
    id: "res-5",
    title: "Paleoclimate Reconstruction from Deep Antarctic Ice & Sediment Cores",
    discipline: "Paleoclimatology",
    region: "Antarctica",
    station: "Bharati Station",
    institution: "NCPOR National Centre for Polar and Ocean Research",
    pi: "Dr. Sunil Kumar Shukla & Paleoclimate Team",
    status: "Active / Ongoing",
    description:
      "Extracting and analyzing high-resolution stable water isotope ratios (δ18O and δD), dust particulates, and trace elemental chemistry from Antarctic ice cores and lacustrine sediment cores to reconstruct past climatic shifts over the last 10,000 years.",
    objectives: [
      "Sub-millimeter laser ablation ICP-MS analysis of ice core sections",
      "Lake sediment diatom and geochemical paleoclimate proxies at Priyadarshini Lake",
      "Establish Southern Hemisphere climatic teleconnections with tropical monsoon records",
      "Identify historical volcanic tephra layers for chronological calibration",
    ],
    funding_program: "MoES PACER Paleoclimate Programme",
    source_url: "https://ncpor.res.in",
  },
  {
    id: "res-6",
    title: "Geomagnetic Pulsations and Ionospheric Scintillations in Polar Cusps",
    discipline: "Space Weather & Geomagnetism",
    region: "Antarctica",
    station: "Maitri & Bharati Stations",
    institution: "Indian Institute of Geomagnetism (IIG, Navi Mumbai)",
    pi: "Dr. A. K. Sinha & IIG Polar Team",
    status: "Long-term Baseline",
    description:
      "Investigating solar wind-magnetosphere coupling and geomagnetic storms using fluxgate magnetometers, induction coil sensors, and high-rate GNSS ionospheric scintillation monitors in the sub-auroral auroral oval zones of Antarctica.",
    objectives: [
      "Real-time recording of Pc1-Pc5 geomagnetic pulsations",
      "Ionospheric TEC (Total Electron Content) perturbation mapping during CMEs",
      "Polar cap absorption and aurora australis particle precipitation modeling",
      "Space weather risk assessment for polar satellite communications",
    ],
    funding_program: "Department of Science and Technology (DST) & MoES",
    source_url: "https://iigm.res.in",
  },
  {
    id: "res-7",
    title: "Microbial Diversity, Cold-Active Enzymes & Extremophile Bioprospecting",
    discipline: "Marine Biology",
    region: "Antarctica",
    station: "Maitri Station",
    institution: "NCPOR, CCMB & Delhi University",
    pi: "Dr. Archana Singh & Extremophile Biotechnology Group",
    status: "Active / Ongoing",
    description:
      "Isolating psychrophilic bacteria, fungi, and cyanobacterial mats from Antarctic soil and meltwater lakes to identify novel cold-active enzymes (lipases, proteases) and antimicrobial compounds with high industrial and pharmaceutical value.",
    objectives: [
      "Metagenomic sequencing of Schirmacher Oasis microbial mats",
      "Characterization of polyunsaturated fatty acid (PUFA) cold-adaptation pathways",
      "Screening for novel bio-surfactants and cryoprotectants",
      "Bio-remediation studies of hydrocarbon residues under extreme sub-zero conditions",
    ],
    funding_program: "MoES Biotechnology Initiative & CSIR-CCMB",
    source_url: "https://ncpor.res.in",
  },
  {
    id: "res-8",
    title: "Southern Ocean Biogeochemical Carbon Sequestration & Eddy Dynamics",
    discipline: "Environmental Sciences",
    region: "Southern Ocean",
    station: "ORV Sagar Kanya & Polar Logistics Cruises",
    institution: "NCPOR, NIO & CMLRE (Ministry of Earth Sciences)",
    pi: "Dr. Anoop Tiwari & Southern Ocean Group",
    status: "Active / Ongoing",
    description:
      "Investigating the role of the Southern Ocean as a global carbon sink through hydrographic transects across the Subtropical Front, Polar Front, and Southern Antarctic Circumpolar Current Front.",
    objectives: [
      "Measure surface and deep ocean partial pressure of CO2 (pCO2)",
      "Assess trace metal (iron) limitation on Antarctic phytoplankton productivity",
      "Continuous CTD and Argo float profiling across 40°S to 65°S latitudes",
      "Evaluate ocean acidification impacts on polar calcifying organisms",
    ],
    funding_program: "MoES Southern Ocean Expedition Programme (ISOE)",
    source_url: "https://ncpor.res.in",
  },
];

export default function ResearchClient({
  data = [],
  error,
}: {
  data?: any[];
  error?: any;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ResearchActivityItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Combine database rows with rich landmark research projects
  const combinedProjects = useMemo(() => {
    const list: ResearchActivityItem[] = [...LANDMARK_RESEARCH_PROGRAMS];
    const existingTitles = new Set(list.map((r) => r.title.toLowerCase().trim()));

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const title = item.title || item.name;
        if (title && !existingTitles.has(title.toLowerCase().trim())) {
          list.push({
            id: item.id,
            title: title,
            discipline: (item.research_area as any) || "Environmental Sciences",
            region: (item.region as any) || "Antarctica",
            station: item.station || "Maitri / Bharati",
            institution: item.institution || "NCPOR (MoES)",
            pi: item.leader || "Principal Investigator",
            status: "Active / Ongoing",
            description: item.description,
            source_url: item.source_url,
          });
        }
      });
    }

    return list;
  }, [data]);

  // Filtered dataset
  const filtered = useMemo(() => {
    return combinedProjects.filter((item) => {
      // Discipline filter
      if (selectedDiscipline !== "All" && item.discipline !== selectedDiscipline) {
        return false;
      }

      // Region filter
      if (selectedRegion !== "All" && item.region !== selectedRegion) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "All" && item.status !== selectedStatus) {
        return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.institution && item.institution.toLowerCase().includes(q)) ||
        (item.pi && item.pi.toLowerCase().includes(q)) ||
        (item.station && item.station.toLowerCase().includes(q))
      );
    });
  }, [combinedProjects, selectedDiscipline, selectedRegion, selectedStatus, searchQuery]);

  const handleShare = (project: ResearchActivityItem) => {
    const text = `🔬 Indian Polar Science Project: ${project.title}\nDomain: ${project.discipline}\nRegion: ${project.region} (${project.station || "MoES Base"})\nLead: ${project.pi || "NCPOR"}\nExplore India's Polar Knowledge Hub: https://polaris.ncpor.res.in/research`;
    navigator.clipboard.writeText(text);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-10">

      {/* ── 1. KPI SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🧊</span>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              Core Thrust
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">Cryosphere</div>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">Ice sheet mass balance &amp; firn cores</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🌊</span>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[10px] font-bold text-cyan-700">
              High-Latitude
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">IndARC Mooring</div>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">192m deep Arctic Kongsfjorden sensor</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🏔️</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              Third Pole
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">Himansh 4,070m</div>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">Himalayan glacier telemetry observatory</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🏛️</span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
              National Grants
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">PACER / MoES</div>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">Polar Science &amp; Cryosphere Research</p>
        </div>
      </div>

      {/* ── 2. FILTER & SEARCH CONTROLS ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Discipline:
            </span>
            {[
              "All",
              "Cryosphere & Glaciology",
              "Atmospheric Physics",
              "Marine Biology",
              "Paleoclimatology",
              "Space Weather & Geomagnetism",
            ].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDiscipline(d)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedDiscipline === d
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* SEARCH BOX */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project, scientist, base..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* REGION & STATUS CHIPS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium mr-1">Region:</span>
            {["All", "Antarctica", "Arctic", "Himalaya", "Southern Ocean"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRegion(r)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  selectedRegion === r
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium mr-1">Status:</span>
            {["All", "Active / Ongoing", "Long-term Baseline"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStatus(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  selectedStatus === s
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. RESEARCH ACTIVITIES GRID ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
          <div className="text-4xl">🔬</div>
          <h3 className="mt-3 text-lg font-bold text-slate-800">No research activities found</h3>
          <p className="mt-1 text-xs text-slate-500">
            No projects matched your criteria. Try adjusting or resetting your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedDiscipline("All");
              setSelectedRegion("All");
              setSelectedStatus("All");
            }}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between"
            >
              <div>
                {/* DISCIPLINE & REGION BADGES */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                    🧪 {item.discipline}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {item.status}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedProject(item)}
                  className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition cursor-pointer line-clamp-2"
                >
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {item.description}
                  </p>
                )}

                {/* METADATA TAGS */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  {item.station && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">📍 Base:</span>
                      <span className="font-semibold text-slate-800 truncate">{item.station}</span>
                    </div>
                  )}
                  {item.institution && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">🏛️ Institute:</span>
                      <span className="font-semibold text-slate-800 truncate">{item.institution}</span>
                    </div>
                  )}
                  {item.pi && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">👤 Lead PI:</span>
                      <span className="font-semibold text-slate-800 truncate">{item.pi}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="mt-6 border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(item)}
                  className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition"
                >
                  {copiedId === item.id ? "✓ Copied!" : "🔗 Share"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProject(item)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform"
                >
                  Project Dossier →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── 4. PROJECT DOSSIER MODAL ── */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              ✕
            </button>

            {/* MODAL HEADER */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                🧪 {selectedProject.discipline}
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                📍 {selectedProject.region}
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                ● {selectedProject.status}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
              {selectedProject.title}
            </h2>

            {/* KEY RESEARCH METADATA GRID */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Observatory / Base:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  🏔️ {selectedProject.station || "National Polar Station"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Principal Investigator:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  👤 {selectedProject.pi || "NCPOR Scientist"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Participating Institutions:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  🏛️ {selectedProject.institution || "NCPOR (MoES)"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Funding &amp; Grant Scheme:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  💼 {selectedProject.funding_program || "MoES PACER Scheme"}
                </p>
              </div>
            </div>

            {/* SCIENTIFIC SUMMARY */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Executive Scientific Overview
              </h4>
              <p className="text-sm leading-relaxed text-slate-700">
                {selectedProject.description}
              </p>
            </div>

            {/* OBJECTIVES */}
            {selectedProject.objectives && selectedProject.objectives.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Scientific Deliverables &amp; Research Milestones
                </h4>
                <div className="space-y-2">
                  {selectedProject.objectives.map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs text-slate-700"
                    >
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODAL FOOTER */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => handleShare(selectedProject)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                {copiedId === selectedProject.id ? "✓ Dossier Link Copied!" : "🔗 Share Project Dossier"}
              </button>

              <div className="flex items-center gap-2">
                {selectedProject.source_url && (
                  <a
                    href={selectedProject.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    Open Official MoES Archive ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
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
