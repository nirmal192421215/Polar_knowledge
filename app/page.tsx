import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import SearchBox from "./SearchBox";
import PolarDataChart from "./PolarDataChart";
import { createClient } from "@/utils/supabase/client";

export const metadata = {
  title: "POLARIS | India's National Polar Science Knowledge Hub",
  description:
    "Official unified platform for India's polar expeditions, real NOAA South Pole observations, peer-reviewed scientific publications, and AI research exploration across Antarctica, Arctic, and Southern Ocean.",
};

const STATS = [
  { icon: "🗻", value: "15+", label: "Polar Expeditions" },
  { icon: "📄", value: "500+", label: "Research Publications" },
  { icon: "🗃️", value: "1,200+", label: "Scientific Datasets" },
  { icon: "🖼️", value: "10,000+", label: "Photos & Videos" },
  { icon: "🎓", value: "50+", label: "Educational Resources" },
];

const RESOURCE_CARDS = [
  {
    icon: "📋",
    title: "Expedition Reports",
    desc: "Official reports from Indian polar expeditions.",
    href: "/expeditions",
    img: "/images/card_expeditions.jpg",
    color: "from-blue-900/90 to-blue-800/70",
  },
  {
    icon: "📊",
    title: "Scientific Datasets",
    desc: "Access research datasets and metadata.",
    href: "/data",
    img: "/images/card_datasets.jpg",
    color: "from-indigo-900/90 to-indigo-700/70",
  },
  {
    icon: "📚",
    title: "Publications",
    desc: "Research papers, articles and documents.",
    href: "/publications",
    img: "/images/card_expeditions.jpg",
    color: "from-sky-900/90 to-sky-700/70",
  },
  {
    icon: "🖼️",
    title: "Media Library",
    desc: "Photos, videos and expedition media.",
    href: "/media",
    img: "/images/card_media_penguins.jpg",
    color: "from-teal-900/90 to-teal-700/70",
  },
  {
    icon: "🎓",
    title: "Education & Outreach",
    desc: "Learn about polar science with engaging content.",
    href: "/explore",
    img: "/images/card_outreach_explorer.jpg",
    color: "from-cyan-900/90 to-cyan-700/70",
  },
];

const POLAR_REGIONS = [
  { icon: "🔬", label: "Research" },
  { icon: "🌿", label: "Environment" },
  { icon: "🌡️", label: "Climate" },
  { icon: "🌍", label: "Future Generations" },
];

export default async function Home() {
  const supabase = createClient();

  const { data: expeditions } = await supabase
    .from("expeditions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <main className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── UNIFIED NAVBAR ── */}
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO & STATS VIEWPORT — FIT TO SCREEN
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-91px)] flex flex-col justify-between overflow-hidden">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/polar_hero_ship.jpg"
            alt="Indian polar research icebreaker in Antarctica"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlay - dark blue on left, transparent on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d5e]/92 via-[#0d2d5e]/75 to-[#0d2d5e]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d5e]/70 via-transparent to-transparent" />
        </div>

        {/* HERO CONTENT (Vertically Centered in Available Space) */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 py-8 lg:py-12">

          {/* LEFT — Text Content */}
          <div className="max-w-xl lg:max-w-2xl flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2.5 flex items-center gap-2">
              <span className="h-px w-8 bg-blue-300/60 block" />
              India in the Polar Regions
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
              Exploring the{" "}
              <span className="text-blue-300">Polar Frontiers</span>{" "}
              for<br />a Sustainable Future
            </h1>
            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-blue-100/90 max-w-xl">
              A unified digital knowledge hub archiving 43+ Antarctic expeditions,
              real-time NOAA data, scientific publications, media resources and
              AI-accelerated scientific informatics.
            </p>

            {/* SEARCH BAR (with integrated quick suggestions) */}
            <div className="mt-6 max-w-xl">
              <SearchBox />
            </div>
          </div>

          {/* RIGHT — Info Card */}
          <div className="w-72 shrink-0 hidden lg:block">
            <div className="rounded-2xl bg-[#0d2d5e]/85 backdrop-blur-md border border-white/20 p-5 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  🌍
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">India in the</h3>
                  <h3 className="text-sm font-bold leading-tight text-blue-200">Polar Regions</h3>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-blue-100">
                {POLAR_REGIONS.map((r) => (
                  <li key={r.label} className="flex items-center gap-2.5">
                    <span className="text-base">{r.icon}</span>
                    <span className="font-medium">{r.label}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/expeditions"
                className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white text-blue-900 font-bold text-xs py-2.5 hover:bg-blue-50 transition shadow-sm"
              >
                Explore Expeditions →
              </Link>
            </div>
          </div>

        </div>

        {/* ── STATS STRIP (Anchored to Screen Bottom, Flawlessly Aligned) ── */}
        <div className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-xs relative z-20 mt-auto">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
              {STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-3.5 py-4 ${
                    idx === 0
                      ? "sm:pr-4"
                      : idx === STATS.length - 1
                      ? "sm:pl-6"
                      : "sm:px-6"
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    {stat.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-black text-slate-900 leading-tight">{stat.value}</div>
                    <div className="text-xs text-slate-500 font-medium truncate">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EXPLORE OUR RESOURCES — IMAGE CARDS
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore <span className="text-blue-600">Our Resources</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Access knowledge, data and media from India&apos;s polar research activities.
            </p>
          </div>
          <Link href="/explore" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition shrink-0">
            View All →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {RESOURCE_CARDS.map((card) => (
            <Link
              key={card.href + card.title}
              href={card.href}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-auto sm:min-h-[260px] block"
            >
              <Image
                src={card.img}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${card.color}`} />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm text-lg">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{card.title}</h3>
                  <p className="mt-1 text-xs text-white/80 leading-4">{card.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white group-hover:gap-2 transition-all">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          INDIA'S POLAR MISSIONS BANNER
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[220px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/polar_mission_banner.jpg"
            alt="India's polar research station"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d5e]/90 via-[#0d2d5e]/60 to-[#0d2d5e]/10" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              India&apos;s <span className="text-blue-300">Polar Missions</span>
            </h2>
            <p className="mt-2 text-sm text-blue-100/90 max-w-md">
              Scientific expeditions to Antarctica and the Arctic for a better
              understanding of our planet and a sustainable future.
            </p>
          </div>
          <Link
            href="/expeditions"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-900/30"
          >
            Learn More →
          </Link>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          POLAR KNOWLEDGE DOMAINS (CLEAN CARDS)
      ══════════════════════════════════════════ */}
      <section className="bg-[#F8FAFD] border-y border-slate-100 px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 mb-3">
                Knowledge Modules
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Polar Domains &amp; Scientific Capabilities
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Access comprehensive data repositories spanning Antarctica, the Arctic, the Southern Ocean, and the Himalayan cryosphere.
              </p>
            </div>
            <Link href="/explore" className="btn-polar-secondary shrink-0 whitespace-nowrap">
              View All Domains →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🐧",
                title: "Antarctica Missions",
                href: "/explore?region=antarctica",
                desc: "Maitri and Bharati scientific bases. 43 national expeditions conducting ozone, ice core, and geomagnetic research.",
                tag: "43+ Expeditions",
                accent: "text-blue-700",
                tagCls: "bg-blue-50 text-blue-700 border-blue-200",
              },
              {
                icon: "🧊",
                title: "Arctic Research",
                href: "/explore?region=arctic",
                desc: "Himadri Station at Ny-Ålesund, Svalbard. Long-term atmospheric physics, fjord oceanography, and marine ecology.",
                tag: "Svalbard Base",
                accent: "text-teal-700",
                tagCls: "bg-teal-50 text-teal-700 border-teal-200",
              },
              {
                icon: "🌊",
                title: "Southern Ocean",
                href: "/explore?region=southern-ocean",
                desc: "Sub-polar oceanographic cruises investigating carbon cycling, marine biodiversity, and Antarctic convergence.",
                tag: "Oceanography",
                accent: "text-indigo-700",
                tagCls: "bg-indigo-50 text-indigo-700 border-indigo-200",
              },
              {
                icon: "🏔️",
                title: "Himalayan Cryo",
                href: "/explore?region=himalaya",
                desc: "Himansh high-altitude glacier monitoring station in Chandra Basin, Himachal Pradesh. Third Pole monitoring.",
                tag: "Third Pole",
                accent: "text-emerald-700",
                tagCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
              },
              {
                icon: "📡",
                title: "Live Data Center",
                href: "/data",
                desc: "14,616+ verified NOAA South Pole observations with interactive charting and direct CSV dataset export.",
                tag: "NOAA Telemetry",
                accent: "text-blue-700",
                tagCls: "bg-blue-50 text-blue-700 border-blue-200",
              },
              {
                icon: "📚",
                title: "Scientific Papers",
                href: "/publications",
                desc: "Searchable index of peer-reviewed publications, technical monographs, and scientific citations with APA format.",
                tag: "Publications",
                accent: "text-purple-700",
                tagCls: "bg-purple-50 text-purple-700 border-purple-200",
              },
              {
                icon: "📑",
                title: "Reports Archive",
                href: "/reports",
                desc: "Official MoES expedition reports, scientific bulletins, and NCPOR institutional annual reviews.",
                tag: "MoES & NCPOR",
                accent: "text-amber-700",
                tagCls: "bg-amber-50 text-amber-700 border-amber-200",
              },
              {
                icon: "📈",
                title: "Analytics Hub",
                href: "/analytics",
                desc: "Interactive informatics dashboard exploring expedition distributions, station telemetry, and domain matrices.",
                tag: "Dashboards",
                accent: "text-slate-700",
                tagCls: "bg-slate-100 text-slate-700 border-slate-200",
              },
            ].map((card) => (
              <Link
                key={card.href + card.title}
                href={card.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between transition hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{card.icon}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${card.tagCls}`}>
                      {card.tag}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold text-slate-900 group-hover:${card.accent} transition-colors`}>
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{card.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          RECENT EXPEDITIONS
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 mb-3">
              Historical Expeditions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Indian Polar Expeditions Archive
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Four decades of national scientific missions, spanning the 1st Antarctic Expedition (1981) to the present day.
            </p>
          </div>
          <Link href="/expeditions" className="btn-polar-secondary shrink-0 whitespace-nowrap">
            View All Expeditions →
          </Link>
        </div>

        {expeditions && expeditions.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {expeditions.map((exp: any) => (
              <div
                key={exp.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">🚢</div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                      Official Record
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {exp.name ?? "Expedition"}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.region && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                        📍 {exp.region}
                      </span>
                    )}
                    {exp.year && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                        📅 {exp.year}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="mt-3 text-xs leading-5 text-slate-600 line-clamp-3">
                      {exp.description}
                    </p>
                  )}
                </div>
                {exp.official_url && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <a
                      href={exp.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                    >
                      NCPOR Documentation ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-14 text-center">
            <div className="text-5xl mb-4">🧭</div>
            <p className="text-base font-bold text-slate-800">Expedition Archives Indexed</p>
            <p className="mt-1 text-sm text-slate-500">Official NCPOR expedition data will appear here.</p>
            <Link href="/expeditions" className="mt-4 btn-polar-primary inline-flex">View Expeditions →</Link>
          </div>
        )}
      </section>


      {/* ══════════════════════════════════════════
          LIVE NOAA TELEMETRY CHART
      ══════════════════════════════════════════ */}
      <section className="bg-[#F8FAFD] border-y border-slate-100 px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry Active
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                NOAA South Pole Verified
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Atmospheric &amp; Meteorological Observations
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Continuous multi-level meteorological measurements streamed from polar stations — surface temperature, wind velocity, barometric pressure, and precipitation.
            </p>
          </div>
          <PolarDataChart />
        </div>
      </section>


      {/* ══════════════════════════════════════════
          PUBLICATIONS SECTION
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 mb-3">
              Academic Literature
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Peer-Reviewed Publications
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Scientific papers, oceanographic cruise reports, and monographs produced through Indian polar scientific endeavors.
            </p>
          </div>
          <Link href="/publications" className="btn-polar-secondary shrink-0 whitespace-nowrap">
            All Publications →
          </Link>
        </div>

        {publications && publications.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {publications.map((pub: any) => (
              <div
                key={pub.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between transition hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">📚</span>
                    {pub.publication_year && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200">
                        {pub.publication_year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {pub.title ?? "Scientific Paper"}
                  </h3>
                  {pub.authors && (
                    <p className="mt-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Authors:</span> {pub.authors}
                    </p>
                  )}
                  {pub.abstract && (
                    <p className="mt-3 text-xs leading-5 text-slate-500 line-clamp-3">{pub.abstract}</p>
                  )}
                </div>
                {pub.source_url && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <a
                      href={pub.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                    >
                      View Source ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-14 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-base font-bold text-slate-800">Publications Catalog</p>
            <p className="mt-1 text-sm text-slate-500">Polar literature and research monographs will appear here.</p>
          </div>
        )}
      </section>


      {/* ══════════════════════════════════════════
          OFFICIAL SCIENTIFIC REPORTS
      ══════════════════════════════════════════ */}
      <section className="bg-[#F8FAFD] border-y border-slate-100 px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700 mb-3">
                Institutional Documentation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Official Scientific Reports
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Government reports, annual summaries, and technical reviews archived by the Ministry of Earth Sciences.
              </p>
            </div>
            <Link href="/reports" className="btn-polar-secondary shrink-0 whitespace-nowrap">
              View All Reports →
            </Link>
          </div>

          {documents && documents.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between transition hover:border-blue-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">📄</span>
                      {doc.document_type && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-200">
                          {doc.document_type}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="mt-2 text-xs leading-5 text-slate-500 line-clamp-2">{doc.description}</p>
                    )}
                    {doc.source_name && (
                      <p className="mt-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Source:</span> {doc.source_name}
                      </p>
                    )}
                  </div>
                  {doc.source_url && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <a
                        href={doc.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition"
                      >
                        View Official Document ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-14 text-center">
              <div className="text-5xl mb-4">📑</div>
              <p className="text-base font-bold text-slate-800">Institutional Reports</p>
              <p className="mt-1 text-sm text-slate-500">Reports and documentation from MoES and NCPOR will appear here.</p>
            </div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          POLAR AI COPILOT SECTION
      ══════════════════════════════════════════ */}
      <section id="polar-ai" className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 mb-4">
              ✦ Powered by Gemini AI
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Meet Polar AI — Your Scientific Research Copilot
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Interact with India&apos;s polar knowledge repository using conversational AI. Ask questions about station telemetry, climate observations, expedition history, or generate professional communication materials with one click.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { q: "What scientific instruments are operational at Bharati Station?", icon: "🏔️" },
                { q: "Summarize temperature and wind trends from NOAA South Pole data", icon: "📊" },
                { q: "Create an official press release summary for Arctic research", icon: "📰" },
              ].map((item) => (
                <div
                  key={item.q}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-sm font-medium"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="italic">&ldquo;{item.q}&rdquo;</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#polar-ai-chat" className="btn-polar-primary">
                ✦ Open Polar AI Assistant
              </a>
              <Link href="/institutional" className="btn-polar-secondary">
                Content Generation Studio →
              </Link>
            </div>
          </div>

          {/* AI PREVIEW CARD */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-7 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold">
                  ✦
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Polar AI Copilot</h4>
                  <p className="text-[10px] text-slate-500">Verified Science Knowledge Engine</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                Online
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-800 max-w-[85%]">
                <span className="font-bold block mb-0.5">Researcher Query:</span>
                What is the significance of the 43rd Indian Antarctic Expedition?
              </div>
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3.5 text-xs text-slate-700 leading-relaxed max-w-[92%] ml-auto">
                <span className="font-bold text-indigo-900 block mb-1">Polar AI Response:</span>
                The 43rd Indian Scientific Expedition to Antarctica (2023–2024) deployed scientists to Maitri and Bharati bases, focusing on deep ice-core paleoclimate drilling, geomagnetism, atmospheric ozone monitoring, and testing eco-friendly energy systems for polar survival.
              </div>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Multi-turn contextual citations enabled</span>
              <span className="font-bold text-indigo-600">Gemini API</span>
            </div>
          </div>
        </div>
      </section>




      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-[#0F1E3D] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <div className="grid gap-10 md:grid-cols-4">

            {/* BRANDING */}
            <div className="md:col-span-1">
              <div className="mb-4 inline-block">
                <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm inline-flex items-center">
                  <Image
                    src="/images/polaris_logo.png"
                    alt="POLARIS — India's Polar Science & Knowledge Portal"
                    width={180}
                    height={60}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                National portal connecting India&apos;s polar expeditions, meteorological observations, and academic literature across Antarctica, Arctic, and Southern Ocean.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Real-Time NOAA Stream Active
              </div>
            </div>

            {/* POLAR DOMAINS */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Polar Domains</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {[
                  { label: "Antarctica (Maitri & Bharati)", href: "/explore?region=antarctica" },
                  { label: "Arctic Research (Himadri Station)", href: "/explore?region=arctic" },
                  { label: "Southern Ocean Biogeochemistry", href: "/explore?region=southern-ocean" },
                  { label: "Himalayan Cryosphere (Himansh)", href: "/explore?region=himalaya" },
                  { label: "Interactive 3D Polar Map", href: "/map" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* REPOSITORIES */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Knowledge Repositories</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {[
                  { label: "NOAA Live Telemetry Ingestion", href: "/data" },
                  { label: "Expedition Log Archives (1981–2026)", href: "/expeditions" },
                  { label: "Scientific Papers & DOI Index", href: "/publications" },
                  { label: "MoES & NCPOR Official Reports", href: "/reports" },
                  { label: "Telemetry Analytics Dashboard", href: "/analytics" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* DATA STANDARDS */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Scientific Governance</h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                {[
                  { color: "bg-blue-400", label: "NOAA Verified Telemetry" },
                  { color: "bg-emerald-400", label: "FAIR Open Data Principles" },
                  { color: "bg-indigo-400", label: "Antarctic Treaty System Protocol" },
                  { color: "bg-amber-400", label: "SCAR & IASC Scientific Compliance" },
                  { color: "bg-purple-400", label: "MoES Accredited National Portal" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-12 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 md:flex-row">
            <p>© 2026 POLARIS — National Polar Science Knowledge Hub | Ministry of Earth Sciences &amp; NCPOR</p>
            <div className="flex items-center gap-3">
              <span>Smart India Hackathon 2026</span>
              <span className="text-slate-600">·</span>
              <span className="text-blue-400 font-bold">Problem Statement 26063</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}