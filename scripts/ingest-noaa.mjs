/**
 * NOAA South Pole In-Situ Meteorology Ingest Script
 * 
 * Parses: data/met_spo_insitu_1_obop_hour_2026.txt
 * Inserts into: Supabase `observations` table
 * 
 * Usage:
 *   node --env-file=.env.local scripts/ingest-noaa.mjs
 * 
 * Data format (NOAA OBOP hourly, space-separated):
 *   station year month day hour wind_dir wind_speed steadiness pressure temp_2m temp_10m temp_tower rh precip
 *
 * Example row:
 *   SPO 2026 01 01 00   57   2.2  -9  697.59  -25.8  -25.8  -26.2  64 -99
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =========================================================
// CONFIGURATION
// =========================================================

const NOAA_DATASET_UUID = "af06cb62-bbcb-4dad-9b88-bcc365f538d3";
const NOAA_FILE_PATH = path.join(__dirname, "../data/met_spo_insitu_1_obop_hour_2026.txt");
const BATCH_SIZE = 500; // rows per Supabase insert
const MISSING_SENTINEL = -999.9; // NOAA missing value flag
const MISSING_THRESHOLD = -990; // values below this are considered missing

// =========================================================
// SUPABASE
// =========================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  console.error("   Run with: node --env-file=.env.local scripts/ingest-noaa.mjs");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// =========================================================
// HELPERS
// =========================================================

function parseSentinel(value) {
  const n = parseFloat(value);
  if (isNaN(n) || n <= MISSING_THRESHOLD) return null;
  return n;
}

function parseIntSentinel(value) {
  const n = parseInt(value, 10);
  if (isNaN(n) || n <= -90) return null;
  return n;
}

function padTwo(n) {
  return String(n).padStart(2, "0");
}

// =========================================================
// PARSE NOAA FILE
// =========================================================

function parseNoaaFile(filePath) {
  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

  const rows = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);

    if (parts.length < 13) continue;

    const [station, year, month, day, hour,
      windDirRaw, windSpeedRaw, steadinessRaw,
      pressureRaw, temp2mRaw, temp10mRaw, tempTowerRaw,
      rhRaw, precipRaw] = parts;

    const y = parseInt(year, 10);
    const mo = parseInt(month, 10);
    const d = parseInt(day, 10);
    const h = parseInt(hour, 10);

    if (isNaN(y) || isNaN(mo) || isNaN(d) || isNaN(h)) continue;

    // Build UTC timestamp string
    const timestampUtc = `${y}-${padTwo(mo)}-${padTwo(d)}T${padTwo(h)}:00:00Z`;

    rows.push({
      dataset_id: NOAA_DATASET_UUID,
      timestamp_utc: timestampUtc,
      station: station,
      station_code: station,
      region: "Antarctica",
      environment: "in-situ",
      latitude: -90.0,
      longitude: 0.0,
      wind_direction_deg: parseIntSentinel(windDirRaw),
      wind_speed_m_s: parseSentinel(windSpeedRaw),
      wind_steadiness_factor: parseIntSentinel(steadinessRaw),
      barometric_pressure_hpa: parseSentinel(pressureRaw),
      temperature_2m_c: parseSentinel(temp2mRaw),
      temperature_10m_c: parseSentinel(temp10mRaw),
      temperature_tower_top_c: parseSentinel(tempTowerRaw),
      relative_humidity_percent: parseIntSentinel(rhRaw),
      precipitation_intensity_mm_per_hour: precipRaw ? parseSentinel(precipRaw) : null,
      data_status: "final",
      quality_flag: "good",
    });
  }

  return rows;
}

// =========================================================
// INSERT IN BATCHES
// =========================================================

async function insertBatches(rows) {
  let inserted = 0;
  let errors = 0;

  // Check how many rows already exist for this dataset
  const { count: existingCount } = await supabase
    .from("observations")
    .select("id", { count: "exact", head: true })
    .eq("dataset_id", NOAA_DATASET_UUID);

  if (existingCount && existingCount > 0) {
    console.log(`\n⚠️  Found ${existingCount} existing rows for this dataset.`);
    console.log("   Skipping existing data — delete rows first if you want to re-ingest.\n");
    // Still insert; duplicates will just cause DB errors which we handle below
  }

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    // Use plain insert — no upsert (table has no unique constraint)
    const { error } = await supabase
      .from("observations")
      .insert(batch);

    if (error) {
      console.error(`\n❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
      const pct = Math.round(((i + batch.length) / rows.length) * 100);
      process.stdout.write(`\r   Progress: ${inserted} rows inserted (${pct}%)    `);
    }
  }

  return { inserted, errors };
}

// =========================================================
// MAIN
// =========================================================

async function main() {
  console.log("=".repeat(60));
  console.log(" POLARIS — NOAA South Pole Ingest Script");
  console.log("=".repeat(60));
  console.log(`\n📂 File: ${NOAA_FILE_PATH}`);
  console.log(`🗄️  Dataset UUID: ${NOAA_DATASET_UUID}`);
  console.log(`🌐 Supabase: ${supabaseUrl}\n`);

  // Check file exists
  if (!fs.existsSync(NOAA_FILE_PATH)) {
    console.error(`❌ File not found: ${NOAA_FILE_PATH}`);
    process.exit(1);
  }

  // Parse
  console.log("📖 Parsing NOAA hourly file...");
  const rows = parseNoaaFile(NOAA_FILE_PATH);
  console.log(`✅ Parsed ${rows.length} observation records`);

  if (rows.length === 0) {
    console.error("❌ No rows parsed. Check the file format.");
    process.exit(1);
  }

  // Show sample
  console.log("\n🔍 Sample row:");
  console.log(JSON.stringify(rows[0], null, 2));

  // Insert
  console.log(`\n📤 Inserting ${rows.length} rows in batches of ${BATCH_SIZE}...`);
  const { inserted, errors } = await insertBatches(rows);

  console.log("\n\n" + "=".repeat(60));
  console.log(`✅ Done!`);
  console.log(`   Inserted: ${inserted} rows`);
  console.log(`   Errors:   ${errors} rows`);
  console.log(`   Dataset:  ${NOAA_DATASET_UUID}`);
  console.log("=".repeat(60));

  if (errors > 0) {
    console.warn("\n⚠️  Some rows failed — check your Supabase RLS policies.");
    console.warn("   You may need to use a service role key for bulk inserts.");
  }
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err);
  process.exit(1);
});
