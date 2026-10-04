"use client";

import Link from "next/link";
import Navbar from "../Navbar";
import { useMemo, useState } from "react";

type Activity = {
  id: string;
  category: string;
  title: string;
  date: string;
  location: string;
  description: string;
};

type ContentType =
  | "Website Article"
  | "Website Announcement"
  | "LinkedIn"
  | "Instagram"
  | "X";

const activities: Activity[] = [
  {
    id: "antarctic-research",
    category: "Research Programme",
    title: "Antarctic Research Programme",
    date: "2026",
    location: "Antarctica",
    description:
      "Scientific activities supporting long-term observations, environmental monitoring and polar research in Antarctica.",
  },
  {
    id: "arctic-research",
    category: "Research Programme",
    title: "Arctic Research Programme",
    date: "2026",
    location: "Arctic",
    description:
      "Research activities focused on Arctic environmental conditions, climate processes and high-latitude observations.",
  },
  {
    id: "polar-outreach",
    category: "Outreach",
    title: "Polar Science Outreach",
    date: "2026",
    location: "India",
    description:
      "Educational and public outreach activities designed to improve awareness and understanding of polar science.",
  },
  {
    id: "scientific-workshop",
    category: "Workshop",
    title: "Polar Science Workshop",
    date: "2026",
    location: "India",
    description:
      "A scientific knowledge-sharing activity bringing together researchers, students and polar science communities.",
  },
  {
    id: "field-observations",
    category: "Field Activity",
    title: "Polar Field Observations",
    date: "2026",
    location: "Polar Regions",
    description:
      "Field-based observations and environmental measurements supporting long-term polar research.",
  },
  {
    id: "knowledge-dissemination",
    category: "Knowledge Dissemination",
    title: "Polar Knowledge Dissemination",
    date: "2026",
    location: "India",
    description:
      "Activities focused on communicating scientific findings, datasets and polar knowledge to wider audiences.",
  },
];

const contentTypes: ContentType[] = [
  "Website Article",
  "Website Announcement",
  "LinkedIn",
  "Instagram",
  "X",
];

/* ============================================================
   CONTENT GENERATOR
   ============================================================ */

function generateContent(
  activity: Activity,
  type: ContentType,
  instructions: string
): string {
  const title = activity.title;
  const location = activity.location;

  const userInstruction = instructions.trim().toLowerCase();

  const wantsConcise =
    userInstruction.includes("concise") ||
    userInstruction.includes("short") ||
    userInstruction.includes("brief");

  const wantsSimple =
    userInstruction.includes("simple") ||
    userInstruction.includes("easy") ||
    userInstruction.includes("students");

  const wantsFormal =
    userInstruction.includes("formal") ||
    userInstruction.includes("professional") ||
    userInstruction.includes("official");

  const wantsBullets =
    userInstruction.includes("bullet") ||
    userInstruction.includes("points");

  const wantsHeadline =
    userInstruction.includes("headline") ||
    userInstruction.includes("title");

  const introduction = wantsSimple
    ? `Polar science helps us understand the changing environments of ${location.toLowerCase()} and their importance to our planet.`
    : `Polar research provides important scientific knowledge about environmental processes, observations and changes across high-latitude regions.`;

  const professionalLine = wantsFormal
    ? `The activity supports structured scientific research, observation and knowledge dissemination through continued institutional engagement.`
    : `The activity contributes to scientific research, observation and wider knowledge sharing.`;

  const keyAreas = wantsBullets
    ? `
Key areas of focus:

• Scientific research and observation
• Environmental monitoring
• Knowledge sharing and dissemination
• Public and educational engagement
`
    : `
The activity focuses on scientific research and observation, environmental monitoring, knowledge sharing and public engagement.
`;

  if (type === "Website Article") {
    if (wantsConcise) {
      return `${wantsHeadline ? `${title}\n\n` : ""}${activity.description}

${introduction}

${professionalLine}

${keyAreas}

Explore polar research, publications, data and scientific information through POLARIS.`;
    }

    return `${title}

${activity.description}

${introduction}

POLARIS brings together information related to polar research, scientific activities, environmental observations and knowledge resources in a structured knowledge environment.

This activity contributes to a broader understanding of ${location.toLowerCase()} research and supports the dissemination of scientific knowledge to researchers, students, educators and the wider public.

${professionalLine}

${keyAreas}

Through continued research and information sharing, polar science contributes to a better understanding of Earth's environmental systems and changes across high-latitude environments.

Explore POLARIS for additional polar research resources, publications, data and scientific information.`;
  }

  if (type === "Website Announcement") {
    if (wantsConcise) {
      return `POLARIS | ${title}

${activity.description}

Location: ${location}
Year: ${activity.date}

${professionalLine}

More information is available through the POLARIS knowledge platform.`;
    }

    return `POLARIS | ${title}

${activity.description}

Location: ${location}
Year: ${activity.date}
Category: ${activity.category}

${professionalLine}

The activity forms part of ongoing efforts to strengthen access to polar science information and improve scientific knowledge dissemination.

More information and related resources are available through the POLARIS knowledge platform.`;
  }

  if (type === "LinkedIn") {
    return `🌍 ${title}

${activity.description}

${introduction}

${professionalLine}

🔬 Research and observation
📊 Environmental information
🌐 Knowledge dissemination
🎓 Education and outreach

Discover more polar science resources through POLARIS.

#PolarScience #PolarResearch #ClimateScience #Research #ScienceCommunication`;
  }

  if (type === "Instagram") {
    return `🌍 Exploring Polar Science

${title}

${activity.description}

${introduction}

📍 ${location}
🔬 ${activity.category}
📅 ${activity.date}

${wantsConcise ? "Discover more through POLARIS." : "Discover polar research, knowledge and scientific resources through POLARIS."}

#PolarScience #PolarResearch #Antarctica #Arctic #ClimateScience #Science #Research #POLARIS`;
  }

  return `${title}

${activity.description}

📍 ${location}
🔬 ${activity.category}

${introduction}

${professionalLine}

Discover polar science with POLARIS.

#PolarScience #PolarResearch #Science`;
}

export default function InstitutionalPage() {
  const [selectedActivity, setSelectedActivity] =
    useState<Activity>(activities[0]);

  const [contentType, setContentType] =
    useState<ContentType>("Website Article");

  const [generatedContent, setGeneratedContent] =
    useState<string>("");

  const [copied, setCopied] = useState(false);

  const [search, setSearch] = useState("");

  /* NEW:
     Stores the user's requested writing style/key points.
  */
  const [customInstructions, setCustomInstructions] =
    useState("");

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return activities;
    }

    return activities.filter(
      (activity) =>
        activity.title.toLowerCase().includes(query) ||
        activity.category.toLowerCase().includes(query) ||
        activity.location.toLowerCase().includes(query)
    );
  }, [search]);

  /* ============================================================
     GENERATE
     ============================================================ */

  const handleGenerate = () => {
    const content = generateContent(
      selectedActivity,
      contentType,
      customInstructions
    );

    setGeneratedContent(content);
    setCopied(false);
  };

  /* ============================================================
     COPY
     ============================================================ */

  const handleCopy = async () => {
    if (!generatedContent) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedContent);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  /* ============================================================
     REGENERATE
     ============================================================ */

  const handleRegenerate = () => {
    const content = generateContent(
      selectedActivity,
      contentType,
      customInstructions
    );

    setGeneratedContent(content);
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* UNIFIED ENTERPRISE NAVBAR */}
      <Navbar />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
              Institutional Activities
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Research, Outreach &
              <span className="text-cyan-600">
                {" "}Knowledge Dissemination
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
              Explore institutional research activities,
              scientific programmes, outreach initiatives and
              knowledge-sharing efforts connected with polar
              science.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          ACTIVITIES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Activities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select an activity to create communication content.
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search activities..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />

          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {filteredActivities.map((activity) => {

            const isSelected =
              selectedActivity.id === activity.id;

            return (
              <button
                key={activity.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedActivity(activity);
                  setGeneratedContent("");
                  setCopied(false);

                  setTimeout(() => {
                    document
                      .getElementById("content-studio")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }, 50);
                }}
                className={`text-left rounded-2xl border p-6 transition-all duration-200 ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-cyan-300 hover:shadow-sm"
                }`}
              >

                <div className="flex items-start justify-between gap-4">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {activity.category}
                  </span>

                  <span className="text-xs font-medium text-slate-400">
                    {activity.date}
                  </span>

                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {activity.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {activity.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-medium text-cyan-700">
                  <span>📍</span>
                  {activity.location}
                </div>

                <div className="mt-6 flex items-center justify-between text-sm font-semibold text-cyan-600">

                  <span>
                    {isSelected
                      ? "Selected ✓"
                      : "Select activity →"}
                  </span>

                </div>

              </button>
            );
          })}

        </div>

        {filteredActivities.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

            <p className="font-semibold text-slate-800">
              No activities found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term.
            </p>

          </div>
        )}

      </section>

      {/* =====================================================
          CONTENT STUDIO
      ====================================================== */}

      <section
        id="content-studio"
        className="scroll-mt-6 border-y border-slate-200 bg-slate-50"
      >

        <div className="mx-auto max-w-7xl px-6 py-14">

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">
              Content Studio
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Generate communication content
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Create structured communication content from
              institutional activity information for websites
              and social-media channels.
            </p>

          </div>

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

            {/* =================================================
                CONTROL PANEL
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selected Activity
              </p>

              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                {selectedActivity.title}
              </h3>

              <div className="mt-4 space-y-3">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedActivity.category}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedActivity.location}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    Description
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {selectedActivity.description}
                  </p>

                </div>

              </div>

              {/* =================================================
                  CONTENT TYPE
              ================================================== */}

              <div className="mt-7">

                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Generate for
                </label>

                <div className="mt-3 grid gap-2">

                  {contentTypes.map((type) => (

                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setContentType(type);
                        setGeneratedContent("");
                        setCopied(false);
                      }}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                        contentType === type
                          ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
                      }`}
                    >
                      {type}
                    </button>

                  ))}

                </div>

              </div>

              {/* =================================================
                  NEW USER INSTRUCTIONS
              ================================================== */}

              <div className="mt-7">

                <div className="flex items-center justify-between">

                  <label
                    htmlFor="content-instructions"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Content instructions
                  </label>

                  <span className="text-xs text-slate-400">
                    Optional
                  </span>

                </div>

                <textarea
                  id="content-instructions"
                  value={customInstructions}
                  onChange={(event) =>
                    setCustomInstructions(
                      event.target.value
                    )
                  }
                  placeholder="Tell us how you want the content written..."
                  className="mt-3 min-h-[130px] w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Example: “Make it concise and professional,
                  highlight the importance of field observations,
                  and make it suitable for an official website.”
                </p>

              </div>

              {/* =================================================
                  GENERATE
              ================================================== */}

              <button
                type="button"
                onClick={handleGenerate}
                className="mt-7 w-full rounded-xl bg-cyan-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
              >
                Generate Content
              </button>

            </div>

            {/* =================================================
                GENERATED CONTENT
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Generated Content
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {contentType}
                  </h3>

                </div>

                {generatedContent && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                )}

              </div>

              <div className="min-h-[500px] p-6">

                {generatedContent ? (
                  <>

                    <textarea
                      value={generatedContent}
                      onChange={(event) =>
                        setGeneratedContent(
                          event.target.value
                        )
                      }
                      className="min-h-[420px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">

                      {/* REGENERATE */}

                      <button
                        type="button"
                        onClick={handleRegenerate}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
                      >
                        Regenerate
                      </button>

                      {/* COPY */}

                      <button
                        type="button"
                        onClick={handleCopy}
                        className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
                      >
                        {copied
                          ? "Copied ✓"
                          : "Copy Content"}
                      </button>

                    </div>

                  </>
                ) : (

                  <div className="flex min-h-[450px] flex-col items-center justify-center text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-3xl">
                      ✦
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-900">
                      Ready to generate
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Select an activity, choose a content
                      format and optionally provide your own
                      instructions before generating.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WORKFLOW
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="text-2xl">
              01
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Select an activity
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose a research programme, outreach activity
              or institutional initiative.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="text-2xl">
              02
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Choose a channel
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Select a website or social-media format and
              provide your preferred content instructions.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="text-2xl">
              03
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Edit and publish
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review the generated material, make changes and
              copy it for use on the selected platform.
            </p>

          </div>

        </div>

      </section>

      {/* ENTERPRISE FOOTER */}
      <footer className="bg-[#0F1E3D] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-slate-950 font-black text-sm">
                P
              </div>
              <div>
                <span className="text-lg font-black tracking-widest text-white">POLARIS</span>
                <p className="text-xs text-slate-400">National Polar Science Knowledge Hub</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <Link href="/explore" className="transition-colors hover:text-white">Explore</Link>
              <Link href="/expeditions" className="transition-colors hover:text-white">Expeditions</Link>
              <Link href="/publications" className="transition-colors hover:text-white">Publications</Link>
              <Link href="/reports" className="transition-colors hover:text-white">Reports</Link>
              <Link href="/data" className="transition-colors hover:text-white">Telemetry</Link>
              <Link href="/analytics" className="transition-colors hover:text-white">Analytics</Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="polar-live-dot" />
              <span>Outreach Engine Active</span>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-slate-400 md:flex-row">
            <p>© 2026 POLARIS — Ministry of Earth Sciences (MoES) &amp; NCPOR | SIH 2026 PS 26063</p>
            <Link href="/" className="text-sky-400 hover:underline">
              Return to Portal Home
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}