"use client";

import { useEffect, useRef, useState } from "react";

type Station = {
  name: string;
  code: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  established?: string;
  altitude?: string;
  dataUrl?: string;
};

const stations: Station[] = [
  {
    name: "Maitri",
    code: "MAI",
    region: "Antarctica",
    latitude: -70.77,
    longitude: 11.73,
    established: "1989",
    altitude: "117m",
    description:
      "India's second Antarctic research station, operational year-round. Located in Schirmacher Oasis, East Antarctica. Supports atmospheric, glaciological and biological research.",
    dataUrl: "/data",
  },
  {
    name: "Bharati",
    code: "BHA",
    region: "Antarctica",
    latitude: -69.41,
    longitude: 76.19,
    established: "2012",
    altitude: "35m",
    description:
      "India's third and newest Antarctic station, built to international energy-efficiency standards. Located in Larsemann Hills, Prydz Bay. Focuses on oceanography and atmospheric science.",
    dataUrl: "/data",
  },
  {
    name: "Himadri",
    code: "HIM",
    region: "Arctic",
    latitude: 78.92,
    longitude: 11.93,
    established: "2008",
    altitude: "15m",
    description:
      "India's Arctic research station, located at Ny-Ålesund, Svalbard, Norway. Studies climate change, glaciers, atmospheric chemistry, and ocean circulation in the Arctic.",
    dataUrl: "/data",
  },
  {
    name: "Himansh",
    code: "HNS",
    region: "Himalaya",
    latitude: 32.38,
    longitude: 77.52,
    established: "2016",
    altitude: "4070m",
    description:
      "High-altitude research station in Spiti Valley, Himachal Pradesh. Studies Himalayan glaciers, snow hydrology, and high-altitude climate processes.",
    dataUrl: "/data",
  },
  {
    name: "South Pole",
    code: "SPO",
    region: "Antarctica",
    latitude: -90,
    longitude: 0,
    altitude: "2835m",
    description:
      "NOAA/ESRL South Pole Observatory. Provides continuous in-situ meteorological observations: temperature, pressure, wind, humidity. 2026 hourly data available in POLARIS.",
    dataUrl: "/data",
  },
];

const REGION_COLORS: Record<string, string> = {
  Antarctica: "#22d3ee",
  Arctic: "#a78bfa",
  Himalaya: "#34d399",
};

type LeafletMap = any;
type LeafletMarker = any;
type LeafletModule = any;

export default function PolarMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const seaIceLayerRef = useRef<any>(null);
  const baseLayerRef = useRef<any>(null);

  const markersRef = useRef<Record<string, LeafletMarker>>({});

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showSeaIce, setShowSeaIce] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  /*
   * =========================================================
   * LOAD LEAFLET CSS
   *
   * IMPORTANT:
   * This is loaded from CDN.
   * Do NOT add Leaflet CSS to globals.css.
   * =========================================================
   */

  useEffect(() => {
    const existing = document.getElementById(
      "polaris-leaflet-css"
    );

    if (existing) {
      return;
    }

    const link = document.createElement("link");

    link.id = "polaris-leaflet-css";
    link.rel = "stylesheet";
    link.href =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

    document.head.appendChild(link);
  }, []);

  /*
   * =========================================================
   * LOAD LEAFLET JAVASCRIPT
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = async () => {
      if (typeof window === "undefined") {
        return;
      }

      /*
       * Leaflet already loaded
       */
      if ((window as any).L) {
        leafletRef.current = (window as any).L;
        return;
      }

      /*
       * Check whether another script is already loading
       */
      const existingScript = document.getElementById(
        "polaris-leaflet-js"
      ) as HTMLScriptElement | null;

      if (existingScript) {
        await new Promise<void>((resolve) => {
          existingScript.addEventListener(
            "load",
            () => resolve(),
            { once: true }
          );
        });

        if (!cancelled) {
          leafletRef.current = (window as any).L;
        }

        return;
      }

      /*
       * Load Leaflet from CDN
       */
      const script = document.createElement("script");

      script.id = "polaris-leaflet-js";
      script.src =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();

        script.onerror = () =>
          reject(
            new Error(
              "Unable to load the map library."
            )
          );

        document.body.appendChild(script);
      });

      if (!cancelled) {
        leafletRef.current = (window as any).L;
      }
    };

    loadLeaflet().catch((error) => {
      console.error(
        "POLARIS map loading error:",
        error
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================================
   * INITIALIZE MAP
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const waitForLeaflet = async () => {
      /*
       * Wait for Leaflet to load
       */
      for (let i = 0; i < 100; i++) {
        if ((window as any).L) {
          break;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 100)
        );
      }

      /*
       * Stop if component was removed
       */
      if (
        cancelled ||
        !mapContainerRef.current ||
        mapRef.current ||
        !(window as any).L
      ) {
        return;
      }

      const L = (window as any).L;

      leafletRef.current = L;

      /*
       * =====================================================
       * CREATE MAP
       * =====================================================
       */

      const map = L.map(
        mapContainerRef.current,
        {
          center: [-15, 20],
          zoom: 2,
          minZoom: 2,
          maxZoom: 10,
          zoomControl: true,
          attributionControl: true,
          worldCopyJump: true,
        }
      );

      mapRef.current = map;

      /*
       * =====================================================
       * OPENSTREETMAP TILE LAYER
       *
       * This is the working tile source.
       * =====================================================
       */

      L.tileLayer(
        darkMode
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: darkMode
            ? "Tiles &copy; Esri"
            : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      baseLayerRef.current = map;

      /*
       * =====================================================
       * ADD STATION MARKERS
       * =====================================================
       */

      stations.forEach((station) => {
        /*
         * Web Mercator cannot display exactly -90°.
         *
         * Therefore only the VISUAL marker is moved
         * slightly upward.
         *
         * The actual station data remains:
         *
         * latitude = -90
         * longitude = 0
         */

        const mapLatitude =
          station.latitude <= -85
            ? -84.8
            : station.latitude;

        /*
         * Create marker
         */

        const color = REGION_COLORS[station.region] ?? "#0891b2";

        const marker = L.circleMarker(
          [mapLatitude, station.longitude],
          {
            radius: 9,
            weight: 3,
            color: "#ffffff",
            fillColor: color,
            fillOpacity: 1,
          }
        );

        marker.bindTooltip(station.name, {
          permanent: true,
          direction: "top",
          offset: [0, -12],
          className: "polaris-leaflet-tooltip",
        });

        /*
         * ===================================================
         * CLICK MAP MARKER
         * ===================================================
         */

        marker.on("click", () => {
          setSelectedStation(station);

          map.flyTo(
            [
              mapLatitude,
              station.longitude,
            ],
            station.name === "South Pole"
              ? 4
              : 5,
            {
              animate: true,
              duration: 0.8,
            }
          );
        });

        marker.addTo(map);

        markersRef.current[
          station.code
        ] = marker;
      });

      /*
       * =====================================================
       * FIT ALL STATIONS
       * =====================================================
       */

      const mapPoints = stations.map(
        (station) => [
          station.latitude <= -85
            ? -84.8
            : station.latitude,
          station.longitude,
        ]
      );

      const bounds =
        L.latLngBounds(mapPoints);

      map.fitBounds(
        bounds.pad(0.12),
        {
          maxZoom: 3,
          animate: false,
        }
      );

      /*
       * Fix map size after rendering
       */

      setTimeout(() => {
        map.invalidateSize();
      }, 300);

      setMapReady(true);
    };

    waitForLeaflet();

    /*
     * =======================================================
     * CLEANUP
     * =======================================================
     */

    return () => {
      cancelled = true;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      markersRef.current = {};

      setMapReady(false);
    };
  }, []);

  /*
   * =========================================================
   * HIGHLIGHT SELECTED STATION
   * =========================================================
   */

  useEffect(() => {
    Object.entries(
      markersRef.current
    ).forEach(
      ([code, marker]) => {
        const selected =
          selectedStation?.code === code;

        marker.setStyle({
          radius: selected ? 13 : 9,
          weight: selected ? 4 : 3,
          color: selected ? "#ffffff" : "#ffffff",
          fillColor: selected ? "#f59e0b" : (REGION_COLORS[marker.options?.stationRegion] ?? "#22d3ee"),
          fillOpacity: 1,
        });

        if (selected) {
          marker.bringToFront();
        }
      }
    );
  }, [selectedStation]);

  /* SEA ICE LAYER TOGGLE */
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    if (showSeaIce) {
      // NASA GIBS Sea Ice Concentration (AMSR2) WMS
      const seaIceLayer = L.tileLayer.wms(
        "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi",
        {
          layers: "AMSR2_Sea_Ice_Concentration_12km",
          format: "image/png",
          transparent: true,
          opacity: 0.65,
          attribution: "NASA GIBS",
          version: "1.3.0",
          crs: L.CRS.EPSG4326,
        }
      );
      seaIceLayer.addTo(map);
      seaIceLayerRef.current = seaIceLayer;
    } else {
      if (seaIceLayerRef.current) {
        map.removeLayer(seaIceLayerRef.current);
        seaIceLayerRef.current = null;
      }
    }
  }, [showSeaIce]);

  /*
   * =========================================================
   * SELECT STATION FROM RIGHT PANEL
   * =========================================================
   */

  const selectStation = (
    station: Station
  ) => {
    setSelectedStation(station);

    const map = mapRef.current;

    if (!map) {
      return;
    }

    const mapLatitude =
      station.latitude <= -85
        ? -84.8
        : station.latitude;

    map.flyTo(
      [
        mapLatitude,
        station.longitude,
      ],
      station.name === "South Pole"
        ? 4
        : 5,
      {
        animate: true,
        duration: 0.8,
      }
    );
  };

  /*
   * =========================================================
   * RESET MAP
   * =========================================================
   */

  const resetMap = () => {
    const map = mapRef.current;
    const L = leafletRef.current;

    if (!map || !L) {
      return;
    }

    const mapPoints = stations.map(
      (station) => [
        station.latitude <= -85
          ? -84.8
          : station.latitude,
        station.longitude,
      ]
    );

    const bounds =
      L.latLngBounds(mapPoints);

    setSelectedStation(null);

    map.fitBounds(
      bounds.pad(0.12),
      {
        maxZoom: 3,
        animate: true,
      }
    );
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <>
      <section
        id="map"
        className="border-t border-slate-200 bg-slate-50 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-10">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
              POLAR MAP
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
              Indian Polar Research Stations
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Explore the geographical locations connected
              with India's polar research activities and the
              POLARIS data repository.
            </p>

          </div>

          {/* =================================================
              MAP + DETAILS
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">

            {/* =================================================
                MAP
            ================================================= */}
            {/* MAP CONTAINER */}
            <div className="relative min-h-[560px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* ACTUAL MAP */}
              <div ref={mapContainerRef} className="absolute inset-0 z-0" />

              {/* RESET BUTTON */}
              <button type="button" onClick={resetMap}
                className="absolute left-5 top-5 z-[500] rounded-xl border border-slate-200 bg-white/95 px-4 py-3 text-xs font-semibold text-slate-700 shadow-md backdrop-blur transition hover:border-cyan-400 hover:text-cyan-700">
                Reset View
              </button>

              {/* LAYER CONTROLS TOOLBAR */}
              <div className="absolute right-5 top-5 z-[500] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowSeaIce((v) => !v)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold shadow-md backdrop-blur transition ${
                    showSeaIce
                      ? "border-cyan-500 bg-cyan-500/90 text-white"
                      : "border-slate-200 bg-white/95 text-slate-700 hover:border-cyan-400 hover:text-cyan-700"
                  }`}
                >
                  🧊 Sea Ice
                </button>

                <button
                  type="button"
                  onClick={() => setDarkMode((v) => !v)}
                  className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold shadow-md backdrop-blur transition hover:border-cyan-400 hover:text-cyan-700 text-slate-700"
                >
                  {darkMode ? "🗺️ Street" : "🌑 Dark"}
                </button>
              </div>

              {/* MAP LOADING */}
              {!mapReady && (
                <div className="absolute inset-0 z-[400] flex items-center justify-center bg-slate-100">
                  <div className="rounded-xl border border-slate-200 bg-white/95 px-5 py-4 text-center shadow-lg">
                    <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
                    <p className="mt-3 text-sm font-medium text-slate-700">Loading research map...</p>
                  </div>
                </div>
              )}

              {/* MAP LEGEND */}
              <div className="absolute bottom-5 left-5 z-[500] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Regions</p>
                <div className="space-y-1.5">
                  {Object.entries(REGION_COLORS).map(([region, color]) => (
                    <div key={region} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                      {region}
                    </div>
                  ))}
                </div>
                {showSeaIce && (
                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-3 w-3 rounded-sm bg-blue-200" />
                      Sea Ice Concentration
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* =================================================
                RIGHT SIDE DETAILS
            ================================================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              {selectedStation ? (
                <>
                  {/* SELECTED STATION HEADER */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-cyan-600">Selected Station</p>
                      <h3 className="mt-2 text-3xl font-bold text-slate-900">{selectedStation.name}</h3>
                    </div>
                    <button type="button" onClick={() => setSelectedStation(null)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-400 hover:text-cyan-700">
                      Close
                    </button>
                  </div>

                  {/* DETAILS GRID */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Code</p>
                      <p className="mt-1 font-bold text-slate-900 font-mono">{selectedStation.code}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Region</p>
                      <p className="mt-1 font-semibold text-slate-900">{selectedStation.region}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Latitude</p>
                      <p className="mt-1 font-semibold text-slate-900 font-mono">{selectedStation.latitude}°</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Longitude</p>
                      <p className="mt-1 font-semibold text-slate-900 font-mono">{selectedStation.longitude}°</p>
                    </div>
                    {selectedStation.altitude && (
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Altitude</p>
                        <p className="mt-1 font-semibold text-slate-900">{selectedStation.altitude}</p>
                      </div>
                    )}
                    {selectedStation.established && (
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Established</p>
                        <p className="mt-1 font-semibold text-slate-900">{selectedStation.established}</p>
                      </div>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-4 text-sm leading-6 text-slate-600">{selectedStation.description}</p>

                  {/* VIEW DATA BUTTON */}
                  {selectedStation.dataUrl && (
                    <a
                      href={selectedStation.dataUrl}
                      className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                    >
                      📊 View Live Data →
                    </a>
                  )}

                </>
              ) : (
                /*
                 * =================================================
                 * DEFAULT PANEL
                 * =================================================
                 */

                <div className="flex h-full min-h-[500px] flex-col justify-center">

                  <div className="text-5xl">
                    📍
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    Explore Polar Stations
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    Select a station on the map to view its
                    region, coordinates and data details.
                  </p>

                  <div className="mt-8 space-y-3">

                    {stations.map(
                      (station) => (
                        <button
                          key={station.code}
                          type="button"
                          onClick={() =>
                            selectStation(
                              station
                            )
                          }
                          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-cyan-300 hover:bg-cyan-50"
                        >

                          <span className="font-medium text-slate-800">
                            {station.name}
                          </span>

                          <span className="text-xs font-medium text-cyan-600">
                            DATA
                          </span>

                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          LEAFLET STYLING

          IMPORTANT:
          This stays inside PolarMap.tsx.
          Do NOT put this into globals.css.
      ====================================================== */}

      <style jsx global>{`

        .leaflet-container {
          height: 100%;
          width: 100%;
          background: #e2e8f0;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          z-index: 1;
        }

        .leaflet-pane {
          z-index: 1;
        }

        .leaflet-tile-pane {
          z-index: 2;
        }

        .leaflet-overlay-pane {
          z-index: 4;
        }

        .leaflet-shadow-pane {
          z-index: 5;
        }

        .leaflet-marker-pane {
          z-index: 6;
        }

        .leaflet-tooltip-pane {
          z-index: 7;
        }

        .leaflet-popup-pane {
          z-index: 8;
        }

        .leaflet-control {
          z-index: 800;
        }

        /*
         * Zoom buttons
         */

        .leaflet-control-zoom {
          border: none !important;
          box-shadow:
            0 6px 18px
            rgba(15, 23, 42, 0.15);
        }

        .leaflet-control-zoom a {
          color: #334155 !important;
          background: rgba(
            255,
            255,
            255,
            0.96
          ) !important;

          border-bottom:
            1px solid #e2e8f0 !important;
        }

        .leaflet-control-zoom a:hover {
          color: #0891b2 !important;
          background: #f8fafc !important;
        }

        /*
         * Attribution
         */

        .leaflet-control-attribution {
          background: rgba(
            255,
            255,
            255,
            0.92
          ) !important;

          color: #64748b !important;

          font-size: 10px;
        }

        .leaflet-control-attribution a {
          color: #0e7490 !important;
        }

        /*
         * Station labels
         */

        .polaris-leaflet-tooltip {
          background: rgba(
            255,
            255,
            255,
            0.97
          );

          border:
            1px solid
            rgba(15, 23, 42, 0.14);

          border-radius: 7px;

          color: #172033;

          font-size: 12px;

          font-weight: 600;

          padding: 4px 8px;

          box-shadow:
            0 4px 14px
            rgba(15, 23, 42, 0.15);
        }

        .polaris-leaflet-tooltip::before {
          border-top-color:
            rgba(255, 255, 255, 0.97);
        }

      `}</style>
    </>
  );
}