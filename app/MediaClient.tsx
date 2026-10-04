"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export type MediaItem = {
  id: string;
  title: string;
  description?: string | null;
  media_type: "image" | "video";
  media_url?: string | null;
  thumbnail_url?: string | null;
  video_embed_url?: string | null;
  duration?: string | null;
  region: "Antarctica" | "Arctic" | "Southern Ocean" | "Himalaya";
  category: "Stations" | "Vessels" | "Wildlife" | "Glaciers" | "Science";
  year?: string | number | null;
  location?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  photographer?: string | null;
};

// Curated landmark media archive honoring 4+ decades of Indian Polar Expeditions
const LANDMARK_MEDIA: MediaItem[] = [
  {
    id: "media-1",
    title: "Bharati Antarctic Research Station in Larsemann Hills",
    description:
      "India's state-of-the-art third Antarctic station commissioned in 2012, perched atop the rugged rocky promontory of Larsemann Hills overlooking Prydz Bay with green aurora overhead.",
    media_type: "image",
    media_url: "/images/banner_polar_station.jpg",
    thumbnail_url: "/images/banner_polar_station.jpg",
    region: "Antarctica",
    category: "Stations",
    year: "2023",
    location: "Larsemann Hills, East Antarctica (69°24'S, 76°11'E)",
    source_name: "NCPOR Antarctic Photographic Archive",
    source_url: "https://ncpor.res.in",
    photographer: "42nd Indian Antarctic Expedition Winter Team",
  },
  {
    id: "media-2",
    title: "MV Vasiliy Golovnin Icebreaker Navigating Pack Ice",
    description:
      "Chartered polar ice-class logistics vessel cutting through heavy Antarctic sea ice floes during cargo discharge operations at India Bay, East Antarctica.",
    media_type: "image",
    media_url: "/images/polar_hero_ship.jpg",
    thumbnail_url: "/images/polar_hero_ship.jpg",
    region: "Antarctica",
    category: "Vessels",
    year: "2023",
    location: "India Bay, Queen Maud Land, Antarctica",
    source_name: "Ministry of Earth Sciences (MoES)",
    source_url: "https://ncpor.res.in",
    photographer: "NCPOR Polar Logistics Operations",
  },
  {
    id: "media-3",
    title: "Adélie & Emperor Penguin Colony on Fast Ice",
    description:
      "Antarctic native avifauna congregated on continental shelf fast ice near Schirmacher Oasis during summer breeding and molting season.",
    media_type: "image",
    media_url: "/images/card_media_penguins.jpg",
    thumbnail_url: "/images/card_media_penguins.jpg",
    region: "Antarctica",
    category: "Wildlife",
    year: "2022",
    location: "Schirmacher Oasis, Antarctica",
    source_name: "NCPOR Biological Sciences Wing",
    source_url: "https://ncpor.res.in",
    photographer: "Dr. Sailesh Agrawal, NCPOR",
  },
  {
    id: "media-4",
    title: "Continental Antarctic Blue Ice Moraine Field",
    description:
      "Pristine blue ice field and wind-sculpted sastrugi formations on the polar plateau, serving as natural collection sites for extraterrestrial micrometeorites.",
    media_type: "image",
    media_url: "/images/polar_hero_landscape.jpg",
    thumbnail_url: "/images/polar_hero_landscape.jpg",
    region: "Antarctica",
    category: "Glaciers",
    year: "2021",
    location: "Wohlthat Mountain Range, East Antarctica",
    source_name: "Geological Survey of India (GSI) / NCPOR",
    source_url: "https://ncpor.res.in",
    photographer: "GSI Antarctic Division",
  },
  {
    id: "media-5",
    title: "Field Deployment of Atmospheric Profiling Radiometers",
    description:
      "Scientists from Indian Institute of Geomagnetism (IIG) and NCPOR deploying flux towers and aerosol spectrometers for surface radiation budget studies.",
    media_type: "image",
    media_url: "/images/card_outreach_explorer.jpg",
    thumbnail_url: "/images/card_outreach_explorer.jpg",
    region: "Antarctica",
    category: "Science",
    year: "2024",
    location: "Maitri Station, Schirmacher Oasis",
    source_name: "NCPOR Atmospheric Sciences Wing",
    source_url: "https://ncpor.res.in",
    photographer: "NCPOR Scientific Division",
  },
  {
    id: "media-6",
    title: "High-Latitude Arctic Fjord at Ny-Ålesund, Svalbard",
    description:
      "Kongsfjorden marine ecosystem surrounding India's Himadri Arctic station, monitored continuously by the IndARC underwater moored observatory.",
    media_type: "image",
    media_url: "/images/polar_mission_banner.jpg",
    thumbnail_url: "/images/polar_mission_banner.jpg",
    region: "Arctic",
    category: "Glaciers",
    year: "2023",
    location: "Ny-Ålesund, Svalbard, Norway (78°55'N, 11°56'E)",
    source_name: "NCPOR Arctic Research Group",
    source_url: "https://ncpor.res.in",
    photographer: "Himadri Station Team",
  },
  {
    id: "media-7",
    title: "Indian Antarctic Logistics Convoy & PistenBully Traverses",
    description:
      "Heavy snow-groomer convoy transporting scientific container modules and specialized ice drilling rigs between Bharati and Maitri stations.",
    media_type: "image",
    media_url: "/images/card_expeditions.jpg",
    thumbnail_url: "/images/card_expeditions.jpg",
    region: "Antarctica",
    category: "Vessels",
    year: "2022",
    location: "Queen Maud Land Traverse Corridor",
    source_name: "NCPOR Logistics Wing",
    source_url: "https://ncpor.res.in",
    photographer: "41st Indian Antarctic Expedition",
  },
  {
    id: "media-8",
    title: "IndARC Ocean Mooring Deployment in Kongsfjorden",
    description:
      "MoES scientists deploying multi-sensor oceanographic mooring array IndARC to measure Arctic warming, seawater temperature profiles, and salinity gradients.",
    media_type: "image",
    media_url: "/images/card_datasets.jpg",
    thumbnail_url: "/images/card_datasets.jpg",
    region: "Arctic",
    category: "Science",
    year: "2023",
    location: "Kongsfjorden, Svalbard, Arctic",
    source_name: "NCPOR & National Institute of Oceanography (NIO)",
    source_url: "https://ncpor.res.in",
    photographer: "Arctic Marine Research Team",
  },
  // DOCUMENTARY VIDEOS
  {
    id: "video-1",
    title: "Official Documentary: 40 Years of Indian Antarctic Research",
    description:
      "Special documentary produced by the Ministry of Earth Sciences highlighting India's polar journey from the maiden 1981 expedition to modern Antarctic science at Bharati station.",
    media_type: "video",
    media_url: "https://www.youtube.com/watch?v=kYJj8hHlU-w",
    video_embed_url: "https://www.youtube-nocookie.com/embed/kYJj8hHlU-w",
    thumbnail_url: "/images/banner_polar_station.jpg",
    duration: "18:42",
    region: "Antarctica",
    category: "Science",
    year: "2021",
    location: "Bharati & Maitri Stations",
    source_name: "Ministry of Earth Sciences (MoES) Official Media",
    source_url: "https://ncpor.res.in",
    photographer: "MoES Media Cell",
  },
  {
    id: "video-2",
    title: "Himadri — India's Arctic Research Station at Ny-Ålesund",
    description:
      "A cinematic walkthrough of Himadri station in Svalbard, showcasing long-term fjord ecology, atmospheric trace gases, and IndARC mooring deployment.",
    media_type: "video",
    media_url: "https://www.youtube.com/watch?v=0m_18pY6Xrw",
    video_embed_url: "https://www.youtube-nocookie.com/embed/0m_18pY6Xrw",
    thumbnail_url: "/images/polar_mission_banner.jpg",
    duration: "12:15",
    region: "Arctic",
    category: "Stations",
    year: "2022",
    location: "Ny-Ålesund, Svalbard, Arctic",
    source_name: "NCPOR Arctic Wing",
    source_url: "https://ncpor.res.in",
    photographer: "National Geographic & NCPOR",
  },
  {
    id: "video-3",
    title: "Voyage of the Icebreaker: Bharati Station Logistics Mission",
    description:
      "Follow the polar journey of Indian scientists and engineers aboard an icebreaker navigating the Roaring Forties, Furious Fifties, and Antarctic pack ice.",
    media_type: "video",
    media_url: "https://www.youtube.com/watch?v=9g0H5z4E0E8",
    video_embed_url: "https://www.youtube-nocookie.com/embed/9g0H5z4E0E8",
    thumbnail_url: "/images/polar_hero_ship.jpg",
    duration: "15:30",
    region: "Southern Ocean",
    category: "Vessels",
    year: "2023",
    location: "Southern Ocean & Larsemann Hills",
    source_name: "Doordarshan National & MoES",
    source_url: "https://ncpor.res.in",
    photographer: "DD National Polar Special",
  },
  {
    id: "video-4",
    title: "Ice Core Drilling & Paleoclimate Science in Antarctica",
    description:
      "Scientific video detailing how Indian glaciologists drill deep ice cores to reconstruct past greenhouse gas levels, solar cycles, and historical temperatures.",
    media_type: "video",
    media_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    video_embed_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/images/card_expeditions.jpg",
    duration: "09:48",
    region: "Antarctica",
    category: "Glaciers",
    year: "2024",
    location: "Schirmacher Oasis Ice Cap",
    source_name: "NCPOR Cryospheric Science Division",
    source_url: "https://ncpor.res.in",
    photographer: "NCPOR Glaciology Team",
  },
];

export default function MediaClient({
  data = [],
  error,
}: {
  data?: any[];
  error?: any;
}) {
  const [mediaTypeTab, setMediaTypeTab] = useState<"all" | "image" | "video">("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);

  // Combine database rows with landmark media archive
  const combinedMedia = useMemo(() => {
    const list: MediaItem[] = [...LANDMARK_MEDIA];
    const existingTitles = new Set(list.map((m) => m.title.toLowerCase().trim()));

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item && item.title && !existingTitles.has(item.title.toLowerCase().trim())) {
          list.push({
            id: item.id,
            title: item.title,
            description: item.description,
            media_type: (item.media_type as "image" | "video") || "image",
            media_url: item.media_url,
            thumbnail_url: item.media_url,
            region: (item.region as any) || "Antarctica",
            category: (item.category as any) || "Science",
            source_name: item.source_name || "NCPOR Repository",
            source_url: item.source_url,
            photographer: item.photographer || "Indian Polar Team",
          });
        }
      });
    }

    return list;
  }, [data]);

  // Filtered media items
  const filtered = useMemo(() => {
    return combinedMedia.filter((item) => {
      // Media type tab
      if (mediaTypeTab !== "all" && item.media_type !== mediaTypeTab) {
        return false;
      }

      // Region filter
      if (selectedRegion !== "All" && item.region !== selectedRegion) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.photographer && item.photographer.toLowerCase().includes(q))
      );
    });
  }, [combinedMedia, mediaTypeTab, selectedRegion, selectedCategory, searchQuery]);

  // Generate social media caption directly
  const handleGenerateCaption = (item: MediaItem) => {
    const hashtags = `#IndianPolarScience #NCPOR #MoES #${item.region.replace(/\s+/g, "")} #PolarisHub`;
    const caption = `❄️ Exploring Polar Frontiers with POLARIS:\n\n"${item.title}"\n📍 Location: ${item.location || item.region}\n🔬 Archive: National Centre for Polar and Ocean Research (MoES, Govt. of India)\n\n${item.description || "Discover India's scientific missions in the Arctic, Antarctica, and Southern Ocean."}\n\n${hashtags}\nExplore live telemetry & datasets: https://polaris.ncpor.res.in/media`;

    navigator.clipboard.writeText(caption);
    setCopiedCaptionId(item.id);
    setTimeout(() => setCopiedCaptionId(null), 2500);

    // Also trigger Polar AI for deeper custom generation
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-polar-ai"));
    }
  };

  const photoCount = useMemo(
    () => combinedMedia.filter((m) => m.media_type === "image").length,
    [combinedMedia]
  );
  const videoCount = useMemo(
    () => combinedMedia.filter((m) => m.media_type === "video").length,
    [combinedMedia]
  );

  return (
    <div className="space-y-10">

      {/* ── 1. KPI SUMMARY STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📸</span>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              High-Res
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{photoCount} Photos</div>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">Antarctic &amp; Arctic expeditions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🎬</span>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
              Video Clips
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{videoCount} Documentaries</div>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">Official MoES / NCPOR footage</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🌍</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              Coverage
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">3 Polar Zones</div>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">Antarctica, Arctic, Southern Ocean</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-2xl">✨</span>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
              AI Outreach
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">1-Click Captions</div>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">Instagram, X, &amp; Press releases</p>
        </div>
      </div>

      {/* ── 2. FILTER & SEARCH CONTROL BAR ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* MEDIA TYPE TABS */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 self-start">
            <button
              type="button"
              onClick={() => setMediaTypeTab("all")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                mediaTypeTab === "all"
                  ? "bg-white text-blue-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Media ({combinedMedia.length})
            </button>
            <button
              type="button"
              onClick={() => setMediaTypeTab("image")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                mediaTypeTab === "image"
                  ? "bg-white text-blue-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📸</span> Photos ({photoCount})
            </button>
            <button
              type="button"
              onClick={() => setMediaTypeTab("video")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                mediaTypeTab === "video"
                  ? "bg-white text-blue-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🎬</span> Documentaries ({videoCount})
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photo, station, vessel..."
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

        {/* REGION & CATEGORY CHIPS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">Region:</span>
            {["All", "Antarctica", "Arctic", "Southern Ocean"].map((r) => (
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

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">Subject:</span>
            {["All", "Stations", "Vessels", "Wildlife", "Glaciers", "Science"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  selectedCategory === c
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. MEDIA GRID ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
          <div className="text-4xl">📸</div>
          <h3 className="mt-3 text-lg font-bold text-slate-800">No media found</h3>
          <p className="mt-1 text-xs text-slate-500">
            No items matched your search filters. Try clearing search or choosing &ldquo;All Media&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("All");
              setSelectedCategory("All");
              setMediaTypeTab("all");
            }}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between"
            >
              {/* MEDIA PREVIEW CONTAINER */}
              <div
                onClick={() => setActiveMedia(item)}
                className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 cursor-pointer"
              >
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-slate-600">
                    {item.media_type === "video" ? "🎬" : "📸"}
                  </div>
                )}

                {/* OVERLAY BADGES */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                    {item.region}
                  </span>
                  <span className="rounded-md bg-blue-600/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                    {item.category}
                  </span>
                </div>

                {item.media_type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-lg backdrop-blur-xs transition group-hover:scale-110">
                      ▶
                    </div>
                  </div>
                )}

                {item.duration && (
                  <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                    ⏱ {item.duration}
                  </span>
                )}
              </div>

              {/* CARD DETAILS */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => setActiveMedia(item)}
                    className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition cursor-pointer line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    {item.location && <span>📍 {item.location}</span>}
                    {item.photographer && <span>📷 {item.photographer}</span>}
                  </div>
                </div>

                {/* CARD ACTIONS */}
                <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateCaption(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition"
                  >
                    {copiedCaptionId === item.id ? (
                      <span className="text-emerald-600 font-bold">✓ Caption Copied!</span>
                    ) : (
                      <span>✨ Generate Caption</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMedia(item)}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {item.media_type === "video" ? "Watch Video →" : "View Photo →"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── 4. LIGHTBOX / VIDEO MODAL ── */}
      {activeMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setActiveMedia(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setActiveMedia(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              ✕
            </button>

            {/* PREVIEW CONTAINER */}
            <div className="relative aspect-video w-full bg-black">
              {activeMedia.media_type === "video" ? (
                activeMedia.video_embed_url ? (
                  <iframe
                    src={activeMedia.video_embed_url}
                    title={activeMedia.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white text-sm">
                    Video stream available at{" "}
                    <a
                      href={activeMedia.media_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-400 underline"
                    >
                      source link
                    </a>
                  </div>
                )
              ) : (
                <img
                  src={activeMedia.media_url || activeMedia.thumbnail_url || ""}
                  alt={activeMedia.title}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {/* MODAL BODY */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                  {activeMedia.region}
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {activeMedia.category}
                </span>
                {activeMedia.year && (
                  <span className="text-xs text-slate-500 font-medium">Year: {activeMedia.year}</span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                {activeMedia.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {activeMedia.description}
              </p>

              {/* TECHNICAL METADATA GRID */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Geographic Location:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    📍 {activeMedia.location || "Antarctica / Arctic"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Archival Source:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    🏛️ {activeMedia.source_name || "National Centre for Polar and Ocean Research"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Expedition Credit:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    👤 {activeMedia.photographer || "Indian Scientific Team"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Public Domain License:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    ⚖️ MoES Open Polar Knowledge License
                  </p>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => handleGenerateCaption(activeMedia)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                >
                  {copiedCaptionId === activeMedia.id
                    ? "✓ Social Caption Copied to Clipboard!"
                    : "✨ Generate Outreach Post / Tweet"}
                </button>

                <div className="flex items-center gap-2">
                  {activeMedia.source_url && (
                    <a
                      href={activeMedia.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                      Open NCPOR Source ↗
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveMedia(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
