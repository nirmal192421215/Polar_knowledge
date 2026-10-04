import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

type SearchResult = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  location: string | null;
  station: string | null;
  status: string | null;
  source: string | null;
  url: string | null;
};

/*
 * Convert any database row into searchable text.
 * This lets us search across different table structures
 * without depending on every table having identical columns.
 */
function rowContainsQuery(
  row: Record<string, unknown>,
  query: string
) {
  const searchableText = Object.values(row)
    .filter(
      (value) =>
        value !== null &&
        value !== undefined
    )
    .map((value) => String(value))
    .join(" ")
    .toLowerCase();

  return searchableText.includes(
    query.toLowerCase()
  );
}

/*
 * Safely pick the first available value
 * from possible column names.
 */
function pickString(
  row: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = row[key];

    if (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return null;
}

/*
 * Create a consistent search result.
 */
function createResult(
  row: Record<string, unknown>,
  type: string
): SearchResult {
  return {
    id: String(row.id),

    title:
      pickString(row, [
        "title",
        "name",
        "dataset_name",
      ]) || "Untitled Resource",

    description:
      pickString(row, [
        "description",
        "abstract",
        "summary",
        "details",
      ]),

    type,

    location:
      pickString(row, [
        "location",
        "region",
        "area",
        "place",
      ]),

    station:
      pickString(row, [
        "station",
        "station_code",
      ]),

    status:
      pickString(row, [
        "status",
        "data_status",
      ]),

    source:
      pickString(row, [
        "source_name",
        "source",
        "publisher",
        "institution",
      ]),

    url:
      pickString(row, [
        "source_url",
        "official_url",
        "data_url",
        "document_url",
        "publication_url",
        "media_url",
        "url",
      ]),
  };
}

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const query =
      searchParams.get("q")?.trim() || "";

    /*
     * Empty search
     */
    if (!query) {
      return NextResponse.json({
        results: [],
        query: "",
      });
    }

    /*
     * Search all major POLARIS content tables
     * in parallel.
     */
    const [
      datasetsResponse,
      publicationsResponse,
      expeditionsResponse,
      documentsResponse,
      researchResponse,
      mediaResponse,
    ] = await Promise.all([
      supabase
        .from("datasets")
        .select("*")
        .limit(100),

      supabase
        .from("publications")
        .select("*")
        .limit(100),

      supabase
        .from("expeditions")
        .select("*")
        .limit(100),

      supabase
        .from("documents")
        .select("*")
        .limit(100),

      supabase
        .from("research_activities")
        .select("*")
        .limit(100),

      supabase
        .from("media")
        .select("*")
        .limit(100),
    ]);

    /*
     * Check database errors.
     */
    const errors = [
      datasetsResponse.error,
      publicationsResponse.error,
      expeditionsResponse.error,
      documentsResponse.error,
      researchResponse.error,
      mediaResponse.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error(
        "Search database errors:",
        errors
      );

      return NextResponse.json(
        {
          error:
            "Unable to search the knowledge repository.",
          results: [],
          query,
        },
        {
          status: 500,
        }
      );
    }

    const results: SearchResult[] = [];

    /*
     * =====================================================
     * DATASETS
     * =====================================================
     */

    for (
      const row of datasetsResponse.data || []
    ) {
      if (
        rowContainsQuery(
          row,
          query
        )
      ) {
        results.push(
          createResult(
            row,
            "Dataset"
          )
        );
      }
    }

    /*
     * =====================================================
     * PUBLICATIONS
     * =====================================================
     */

    for (
      const row of publicationsResponse.data || []
    ) {
      if (
        rowContainsQuery(
          row,
          query
        )
      ) {
        results.push(
          createResult(
            row,
            "Publication"
          )
        );
      }
    }

    /*
     * =====================================================
     * EXPEDITIONS
     * =====================================================
     */

    for (
      const row of expeditionsResponse.data || []
    ) {
      if (
        rowContainsQuery(
          row,
          query
        )
      ) {
        results.push(
          createResult(
            row,
            "Expedition"
          )
        );
      }
    }

    /*
     * =====================================================
     * SCIENTIFIC REPORTS / DOCUMENTS
     * =====================================================
     */

    for (
      const row of documentsResponse.data || []
    ) {
      if (
        rowContainsQuery(
          row,
          query
        )
      ) {
        results.push(
          createResult(
            row,
            "Report"
          )
        );
      }
    }

    /*
     * =====================================================
     * RESEARCH ACTIVITIES
     * =====================================================
     */

    for (
      const row of researchResponse.data || []
    ) {
      if (
        rowContainsQuery(
          row,
          query
        )
      ) {
        results.push(
          createResult(
            row,
            "Research"
          )
        );
      }
    }

    /*
     * =====================================================
     * MEDIA
     * =====================================================
     */

    for (
      const row of mediaResponse.data || []
    ) {
      if (
        rowContainsQuery(
          row,
          query
        )
      ) {
        results.push(
          createResult(
            row,
            "Media"
          )
        );
      }
    }

    /*
     * =====================================================
     * REMOVE DUPLICATES
     * =====================================================
     */

    const uniqueResults =
      Array.from(
        new Map(
          results.map(
            (item) => [
              `${item.type}-${item.id}`,
              item,
            ]
          )
        ).values()
      );

    /*
     * =====================================================
     * LIMIT RESULTS
     * =====================================================
     */

    const finalResults =
      uniqueResults.slice(0, 30);

    return NextResponse.json({
      results: finalResults,
      query,
      total: finalResults.length,
    });
  } catch (error) {
    console.error(
      "Search API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to perform search.",
        results: [],
      },
      {
        status: 500,
      }
    );
  }
}