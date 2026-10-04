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

const SYNTHETIC_DATASET_ID =
  "596a4304-a54d-4185-a00e-c72526bddcf8";

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
  timestamp_utc: string;
  station: string | null;
  station_code: string | null;
  temperature_2m_c: number | null;
  temperature_10m_c: number | null;
  temperature_tower_top_c: number | null;
  relative_humidity_percent: number | null;
  barometric_pressure_hpa: number | null;
  wind_speed_m_s: number | null;
  wind_direction_deg: number | null;
  precipitation_intensity_mm_per_hour: number | null;
};

export default function MultiStationComparison() {
  const [records, setRecords] = useState<PolarRecord[]>([]);
  const [stations, setStations] = useState<string[]>([]);
  const [selectedStations, setSelectedStations] =
    useState<string[]>([]);

  const [parameter, setParameter] =
    useState<ParameterKey>("temperature_2m_c");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * LOAD DATA
   */
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/polar-data?datasetId=${SYNTHETIC_DATASET_ID}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load comparison observations"
          );
        }

        const loadedRecords: PolarRecord[] =
          Array.isArray(result.records)
            ? result.records
            : [];

        setRecords(loadedRecords);

        const stationSet = new Set<string>();

        loadedRecords.forEach((row) => {
          const name =
            row.station ||
            row.station_code;

          if (name) {
            stationSet.add(name);
          }
        });

        const stationList =
          Array.from(stationSet).sort();

        setStations(stationList);

        /*
         * Select all stations initially.
         */
        setSelectedStations(stationList);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load comparison data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedParameter =
    parameters.find(
      (item) => item.key === parameter
    ) || parameters[0];

  /*
   * STATION TOGGLE
   */
  function toggleStation(station: string) {
    setSelectedStations((current) => {
      if (current.includes(station)) {
        return current.filter(
          (item) => item !== station
        );
      }

      return [...current, station];
    });
  }

  /*
   * SELECT ALL
   */
  function selectAllStations() {
    setSelectedStations(stations);
  }

  /*
   * CLEAR ALL
   */
  function clearAllStations() {
    setSelectedStations([]);
  }

  /*
   * PREPARE COMPARISON DATA
   */
  const chartData = useMemo(() => {
    const grouped = new Map<
      string,
      Record<string, any>
    >();

    records.forEach((row) => {
      const stationName =
        row.station ||
        row.station_code ||
        "Unknown";

      if (
        !selectedStations.includes(
          stationName
        )
      ) {
        return;
      }

      const rawValue =
        row[selectedParameter.key];

      if (
        rawValue === null ||
        rawValue === undefined ||
        !Number.isFinite(Number(rawValue))
      ) {
        return;
      }

      const timestamp =
        row.timestamp_utc;

      if (!grouped.has(timestamp)) {
        const date =
          new Date(timestamp);

        grouped.set(timestamp, {
          timestamp,
          timestampLabel:
            date.toLocaleString(
              "en-IN",
              {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            ),
        });
      }

      grouped.get(timestamp)![stationName] =
        Number(rawValue);
    });

    return Array.from(
      grouped.values()
    ).sort((a, b) =>
      a.timestamp.localeCompare(
        b.timestamp
      )
    );
  }, [
    records,
    selectedStations,
    selectedParameter,
  ]);

  /*
   * KEEP GRAPH LIGHT
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

    const sampled = [];

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

  /*
   * LINE SETTINGS
   */
  const lineStyles = [
    "#0284c7", // Sky blue
    "#0d9488", // Teal
    "#d97706", // Amber
    "#4f46e5", // Indigo
    "#059669", // Emerald
    "#7c3aed", // Purple
    "#dc2626", // Red
    "#ea580c", // Orange
  ];

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">

      {/* HEADER */}
      <div className="mb-8">
        <span className="polar-badge mb-2">Comparative Informatics</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Multi-Station Telemetry Comparison
        </h2>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
          Compare environmental parameters across Indian and international polar research bases using synchronous observation timestamps.
        </p>
      </div>

      {/* CONTROLS */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50/80 p-5">

        {/* PARAMETER */}
        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
            Select Observation Parameter
          </label>

          <select
            value={parameter}
            onChange={(e) =>
              setParameter(
                e.target.value as ParameterKey
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-500"
          >
            {parameters.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label} ({item.unit})
              </option>
            ))}
          </select>
        </div>

        {/* STATION BUTTONS */}
        <div>
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Active Stations for Correlation
            </label>

            <div className="flex gap-2">
              <button
                onClick={selectAllStations}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                Select All
              </button>

              <button
                onClick={clearAllStations}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                Clear Selection
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {stations.map((item) => {
              const selected = selectedStations.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleStation(item)}
                  className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                    selected
                      ? "border-sky-400 bg-sky-50 text-sky-700 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {selected ? "✓ " : ""}{item}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-bold text-sm">Unable to load comparison data</p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* STATUS */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
          MULTI-STATION TELEMETRY
        </span>

        <span className="text-xs font-medium text-slate-500">
          {records.length.toLocaleString()} observations loaded · {selectedStations.length} stations selected
        </span>
      </div>

      {/* CHART HEADER */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-900">
          {selectedParameter.label}
        </h3>
        <p className="text-xs text-slate-500">
          Synchronized comparison · UTC Timestamps · Measured in {selectedParameter.unit}
        </p>
      </div>

      {/* CHART */}
      <div className="h-[460px] w-full rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm font-semibold text-sky-700">Loading station telemetry...</p>
          </div>
        ) : displayData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-base font-bold text-slate-800">No comparison data available</p>
            <p className="mt-1 text-xs text-slate-500">Select at least one station to visualize telemetry.</p>
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
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                  color: "#0f172a",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 600, color: "#334155" }} />

              {selectedStations.map((stationName, index) => (
                <Line
                  key={stationName}
                  type="monotone"
                  dataKey={stationName}
                  name={stationName}
                  stroke={lineStyles[index % lineStyles.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* PROVENANCE */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Comparative Dataset Provenance
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Observations synchronized across Indian Polar Research Stations and affiliated meteorological networks.
        </p>
      </div>

    </section>
  );
}