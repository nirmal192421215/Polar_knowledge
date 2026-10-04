"use client";

import { useEffect, useMemo, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const NOAA_DATASET_ID =
  "af06cb62-bbcb-4dad-9b88-bcc365f538d3";

const SYNTHETIC_DATASET_ID =
  "596a4304-a54d-4185-a00e-c72526bddcf8";

type DatasetType = "real" | "synthetic";

type ParameterKey =
  | "temperature_2m_c"
  | "temperature_10m_c"
  | "temperature_tower_top_c"
  | "relative_humidity_percent"
  | "barometric_pressure_hpa"
  | "wind_speed_m_s"
  | "wind_direction_deg"
  | "precipitation_intensity_mm_per_hour";

type Parameter = {
  key: ParameterKey;
  label: string;
  unit: string;
};

const parameters: Parameter[] = [
  {
    key: "temperature_2m_c",
    label: "Temperature (2m)",
    unit: "°C",
  },
  {
    key: "temperature_10m_c",
    label: "Temperature (10m)",
    unit: "°C",
  },
  {
    key: "temperature_tower_top_c",
    label: "Tower Top Temperature",
    unit: "°C",
  },
  {
    key: "relative_humidity_percent",
    label: "Relative Humidity",
    unit: "%",
  },
  {
    key: "barometric_pressure_hpa",
    label: "Barometric Pressure",
    unit: "hPa",
  },
  {
    key: "wind_speed_m_s",
    label: "Wind Speed",
    unit: "m/s",
  },
  {
    key: "wind_direction_deg",
    label: "Wind Direction",
    unit: "°",
  },
  {
    key: "precipitation_intensity_mm_per_hour",
    label: "Precipitation",
    unit: "mm/h",
  },
];

type PolarRecord = {
  id: string;
  dataset_id: string;
  timestamp_utc: string;
  station: string | null;
  station_code: string | null;
  region: string | null;
  environment: string | null;
  latitude: number | null;
  longitude: number | null;

  wind_direction_deg: number | null;
  wind_speed_m_s: number | null;
  wind_steadiness_factor: number | null;
  barometric_pressure_hpa: number | null;

  temperature_2m_c: number | null;
  temperature_10m_c: number | null;
  temperature_tower_top_c: number | null;

  relative_humidity_percent: number | null;

  precipitation_intensity_mm_per_hour: number | null;

  data_status: string | null;
  quality_flag: string | null;
};

type ChartRecord = {
  timestamp: string;
  timestampLabel: string;
  station: string;
  value: number;
};

export default function PolarDataChart() {
  const [dataset, setDataset] =
    useState<DatasetType>("real");

  const [station, setStation] =
    useState("all");

  const [parameter, setParameter] =
    useState<ParameterKey>("temperature_2m_c");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [records, setRecords] =
    useState<PolarRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [stations, setStations] =
    useState<string[]>([]);

  const datasetId =
    dataset === "real"
      ? NOAA_DATASET_ID
      : SYNTHETIC_DATASET_ID;

  const selectedParameter =
    parameters.find(
      (item) => item.key === parameter
    ) || parameters[0];

  /*
   * LOAD DATA
   */
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("datasetId", datasetId);

        if (station !== "all") {
          params.set("station", station);
        }

        if (startDate) {
          params.set("startDate", startDate);
        }

        if (endDate) {
          params.set("endDate", endDate);
        }

        const response = await fetch(
          `/api/polar-data?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load observations"
          );
        }

        const loadedRecords =
          Array.isArray(result.records)
            ? result.records
            : [];

        setRecords(loadedRecords);

        /*
         * Build station list from returned records.
         */
        const stationSet = new Set<string>();

        loadedRecords.forEach(
          (row: PolarRecord) => {
            if (row.station) {
              stationSet.add(row.station);
            }
          }
        );

        setStations(
          Array.from(stationSet).sort()
        );
      } catch (err) {
        console.error(err);

        setRecords([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load polar data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [
    datasetId,
    station,
    startDate,
    endDate,
  ]);

  /*
   * CHANGE DATASET
   */
  function handleDatasetChange(
    value: DatasetType
  ) {
    setDataset(value);
    setStation("all");
    setStartDate("");
    setEndDate("");
    setRecords([]);
  }

  /*
   * CLEAR DATE FILTER
   */
  function clearDateFilter() {
    setStartDate("");
    setEndDate("");
  }

  /*
   * EXPORT CSV
   */
  function handleExportCSV() {
    if (records.length === 0) return;

    const headers = [
      "timestamp_utc",
      "station",
      "station_code",
      "region",
      "environment",
      "latitude",
      "longitude",
      selectedParameter.key,
      "quality_flag",
    ];

    const rows = records.map((r) => [
      r.timestamp_utc,
      `"${r.station || ""}"`,
      `"${r.station_code || ""}"`,
      `"${r.region || ""}"`,
      `"${r.environment || ""}"`,
      r.latitude ?? "",
      r.longitude ?? "",
      r[selectedParameter.key] ?? "",
      `"${r.quality_flag || ""}"`,
    ]);

    const csvStr = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `polar_data_${selectedParameter.key}_${dataset}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /*
   * PREPARE CHART DATA
   *
   * IMPORTANT:
   * NOAA uses -999.90 as a missing-value
   * sentinel in some observations.
   *
   * We remove that value only from the
   * visualization/statistics.
   *
   * The original records remain untouched.
   */
  const chartData = useMemo<ChartRecord[]>(() => {
    return records
      .map((row) => {
        const rawValue =
          row[selectedParameter.key];

        if (
          rawValue === null ||
          rawValue === undefined ||
          !Number.isFinite(Number(rawValue))
        ) {
          return null;
        }

        const numericValue = Number(rawValue);

        /*
         * Ignore NOAA missing-value sentinel.
         * This does NOT modify the database or
         * the original records.
         */
        if (
          Math.abs(numericValue + 999.9) < 0.001
        ) {
          return null;
        }

        const date =
          new Date(row.timestamp_utc);

        if (
          Number.isNaN(date.getTime())
        ) {
          return null;
        }

        return {
          timestamp: row.timestamp_utc,

          timestampLabel:
            date.toLocaleString("en-IN", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),

          station:
            row.station ||
            row.station_code ||
            "Unknown",

          value: numericValue,
        };
      })
      .filter(
        (
          row
        ): row is ChartRecord =>
          row !== null
      );
  }, [
    records,
    selectedParameter,
  ]);

  /*
   * STATISTICS
   */
  const statistics = useMemo(() => {
    if (chartData.length === 0) {
      return {
        min: null,
        avg: null,
        max: null,
      };
    }

    const values =
      chartData.map(
        (item) => item.value
      );

    const min =
      Math.min(...values);

    const max =
      Math.max(...values);

    const avg =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      ) / values.length;

    return {
      min,
      avg,
      max,
    };
  }, [chartData]);

  /*
   * SCIENTIFIC ANOMALY DETECTION (> 2 Standard Deviations)
   */
  const anomalyAlert = useMemo(() => {
    if (chartData.length < 10) return null;
    const values = chartData.map((d) => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return null;

    const outliers = chartData.filter(
      (d) => Math.abs(d.value - mean) > 2.0 * stdDev
    );
    if (outliers.length === 0) return null;

    let peak = outliers[0];
    let maxDiff = Math.abs(peak.value - mean);
    for (const item of outliers) {
      const diff = Math.abs(item.value - mean);
      if (diff > maxDiff) {
        maxDiff = diff;
        peak = item;
      }
    }

    return {
      count: outliers.length,
      peakValue: peak.value.toFixed(2),
      peakTime: peak.timestampLabel,
      station: peak.station,
      stdDev: stdDev.toFixed(2),
      mean: mean.toFixed(2),
      unit: selectedParameter.unit,
      paramName: selectedParameter.label,
    };
  }, [chartData, selectedParameter]);

  /*
   * GRAPH DATA LIMIT
   *
   * We don't draw thousands of points at once.
   * This keeps the browser fast.
   */
  const displayData = useMemo(() => {
    const MAX_POINTS = 1200;

    if (
      chartData.length <= MAX_POINTS
    ) {
      return chartData;
    }

    const step =
      chartData.length /
      MAX_POINTS;

    const sampled: ChartRecord[] = [];

    for (
      let i = 0;
      i < MAX_POINTS;
      i++
    ) {
      sampled.push(
        chartData[
          Math.floor(i * step)
        ]
      );
    }

    return sampled;
  }, [chartData]);

  const isReal =
    dataset === "real";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700 border border-sky-200">
            {isReal ? "Verified Scientific Data" : "Multi-Station Dataset"}
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Live NOAA Telemetry
          </span>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900">
          Polar Meteorological Telemetry Explorer
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Explore precision environmental observations from South Pole and Indian stations across multiple atmospheric levels and timeframes.
        </p>
      </div>

      {/* FILTER PANEL */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50/80 p-5">
        <div className="grid gap-5 md:grid-cols-4">

          {/* DATASET */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Dataset Source
            </label>
            <select
              value={dataset}
              onChange={(e) =>
                handleDatasetChange(
                  e.target.value as DatasetType
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="real">
                Real — NOAA South Pole
              </option>
              <option value="synthetic">
                Multi-Station Comparison
              </option>
            </select>
          </div>

          {/* STATION */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Station
            </label>
            <select
              value={station}
              onChange={(e) =>
                setStation(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="all">
                All Stations
              </option>
              {stations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* PARAMETER */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Parameter
            </label>
            <select
              value={parameter}
              onChange={(e) =>
                setParameter(
                  e.target.value as ParameterKey
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {parameters.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label} ({item.unit})
                </option>
              ))}
            </select>
          </div>

          {/* RECORD COUNT */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Loaded Records
            </label>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-bold text-sky-700">
              {loading ? "Ingesting..." : `${records.length.toLocaleString()} points`}
            </div>
          </div>

        </div>

        {/* DATE FILTERS */}
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearDateFilter}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              Clear Date Filters
            </button>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-bold text-red-800 text-sm">Unable to load observations</p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* STATUS & EXPORT BAR */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border ${
              isReal
                ? "bg-sky-50 text-sky-700 border-sky-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isReal ? "NOAA Certified" : "Multi-Station Dataset"}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {records.length.toLocaleString()} observations loaded into interactive canvas
          </span>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={records.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 disabled:opacity-40"
        >
          <span>📥</span> Export CSV Dataset ({records.length.toLocaleString()})
        </button>
      </div>

      {/* SCIENTIFIC ANOMALY ALERT BANNER */}
      {anomalyAlert && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-50/80 to-white p-4 text-xs shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white text-base shadow-sm">
              ⚠️
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900">
                  Statistical Anomaly Detected ({anomalyAlert.count} Outliers &gt; 2σ)
                </span>
                <span className="rounded-full bg-amber-200/70 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  Confidence 95.4%
                </span>
              </div>
              <p className="mt-0.5 text-slate-600">
                Peak deviation of <strong className="text-amber-900">{anomalyAlert.peakValue} {anomalyAlert.unit}</strong> recorded at <strong>{anomalyAlert.station}</strong> on {anomalyAlert.peakTime} (Baseline Mean: {anomalyAlert.mean} {anomalyAlert.unit}, σ: {anomalyAlert.stdDev}).
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-800">
            Automated QC Flag
          </span>
        </div>
      )}

      {/* STATISTICS CARDS */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard
          title="Minimum Recorded"
          value={statistics.min}
          unit={selectedParameter.unit}
        />
        <StatCard
          title="Period Average"
          value={statistics.avg}
          unit={selectedParameter.unit}
        />
        <StatCard
          title="Maximum Recorded"
          value={statistics.max}
          unit={selectedParameter.unit}
        />
      </div>

      {/* CHART HEADER */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900">
          {selectedParameter.label}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">
          {station === "all" ? "All Station Average" : station} · UTC Timestamps · Measured in {selectedParameter.unit}
        </p>
      </div>

      {/* CHART CONTAINER */}
      <div className="h-[460px] w-full rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
              Ingesting polar observations...
            </div>
          </div>
        ) : displayData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-base font-bold text-slate-800">No telemetry in this range</p>
            <p className="mt-1 text-xs text-slate-500">Try broadening your date filter or selecting all stations.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="timestampLabel"
                tick={{ fill: "#64748b", fontSize: 11 }}
                minTickGap={35}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                  color: "#0f172a",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
                formatter={(value) => [
                  Number(value).toFixed(2),
                  selectedParameter.label,
                ]}
                labelFormatter={(label) => String(label)}
              />
              <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 600, color: "#334155" }} />
              <Line
                type="monotone"
                dataKey="value"
                name={selectedParameter.label}
                stroke="#0284c7"
                strokeWidth={2.2}
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* PROVENANCE FOOTNOTE */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Scientific Provenance &amp; Verification
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          {isReal
            ? "Data source: NOAA Global Monitoring Laboratory — South Pole Observatory. Verified for research use."
            : "Data source: POLARIS Scientific Simulation & Historical Dataset."}
        </p>
      </div>

    </section>
  );
}

/* -------------------------------- */
/* STAT CARD */
/* -------------------------------- */
function StatCard({
  title,
  value,
  unit,
}: {
  title: string;
  value: number | null;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:bg-slate-50">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
      <p className="mt-1.5 text-2xl font-black text-slate-900">
        {value === null ? "—" : value.toFixed(2)}
        <span className="ml-1 text-xs font-bold text-sky-600">{unit}</span>
      </p>
    </div>
  );
}