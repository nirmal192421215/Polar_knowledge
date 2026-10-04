import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const NOAA_DATASET_ID =
  "af06cb62-bbcb-4dad-9b88-bcc365f538d3";

const SYNTHETIC_DATASET_ID =
  "596a4304-a54d-4185-a00e-c72526bddcf8";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const { searchParams } = new URL(request.url);

    const datasetId =
      searchParams.get("datasetId") || NOAA_DATASET_ID;

    const station =
      searchParams.get("station") || "all";

    const startDate =
      searchParams.get("startDate") || "";

    const endDate =
      searchParams.get("endDate") || "";

    if (
      datasetId !== NOAA_DATASET_ID &&
      datasetId !== SYNTHETIC_DATASET_ID
    ) {
      return NextResponse.json(
        {
          error: "Invalid dataset ID",
        },
        { status: 400 }
      );
    }

    let allData: any[] = [];

    /*
     * Supabase commonly returns a maximum of 1000 rows
     * per request. Fetch in chunks so both datasets work.
     */
    const CHUNK_SIZE = 1000;

    for (let offset = 0; ; offset += CHUNK_SIZE) {
      let query = supabase
        .from("observations")
        .select(`
          id,
          dataset_id,
          timestamp_utc,
          station,
          station_code,
          region,
          environment,
          latitude,
          longitude,
          wind_direction_deg,
          wind_speed_m_s,
          wind_steadiness_factor,
          barometric_pressure_hpa,
          temperature_2m_c,
          temperature_10m_c,
          temperature_tower_top_c,
          relative_humidity_percent,
          precipitation_intensity_mm_per_hour,
          data_status,
          quality_flag
        `)
        .eq("dataset_id", datasetId)
        .order("timestamp_utc", {
          ascending: true,
        })
        .range(offset, offset + CHUNK_SIZE - 1);

      if (station !== "all") {
        query = query.eq("station", station);
      }

      if (startDate) {
        query = query.gte(
          "timestamp_utc",
          `${startDate}T00:00:00.000Z`
        );
      }

      if (endDate) {
        query = query.lte(
          "timestamp_utc",
          `${endDate}T23:59:59.999Z`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase error:", error);

        return NextResponse.json(
          {
            error: error.message,
          },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        break;
      }

      allData.push(...data);

      if (data.length < CHUNK_SIZE) {
        break;
      }
    }

    return NextResponse.json({
      source: "Supabase",
      dataset_id: datasetId,
      records: allData,
      count: allData.length,
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      {
        error: "Unable to load polar observations",
      },
      { status: 500 }
    );
  }
}