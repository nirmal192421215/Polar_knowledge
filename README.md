# 🧊 POLARIS — National Polar Science & Knowledge Hub
### Smart India Hackathon 2026 · Problem Statement 26063
**Ministry of Earth Sciences (MoES) & National Centre for Polar and Ocean Research (NCPOR)**  
*Category: Software · Domain: Smart Education / Environmental Informatics*

---

## 🌟 Executive Summary
**POLARIS** is India's unified digital gateway consolidating over four decades (1981–present) of scientific research across the **Antarctic, Arctic, Southern Ocean, and Himalayan Third Pole** frontiers. Developed to meet the national mandate of NCPOR and MoES, POLARIS integrates verified expedition histories, real in-situ meteorological observations from NOAA's South Pole Observatory, peer-reviewed publications, high-resolution media galleries, and Google Gemini-powered scientific informatics with native speech recognition and institutional outreach generation.

---

## 🚀 Key Innovations & Capabilities

### 1. 🧭 Indian Polar Expeditions Archive (`/expeditions`)
- **43+ Expeditions Catalog**: Complete archival record from the maiden 1981 expedition to the 43rd Indian Antarctic Expedition (2023–24), Arctic Himadri campaigns, and Southern Ocean cruises.
- **Dual Visualization**: Smooth toggle between responsive **Card Grid** and chronological **Timeline View**.
- **Multi-Faceted Search**: Filter instantly by region (*Antarctica*, *Arctic*, *Southern Ocean*), decade (*2020s*, *2010s*, *2000s*, *1990s*, *1980s*), mission leader, research vessel, or scientific discipline.
- **Mission Dossier Modal**: Comprehensive deliverables, station details (*Bharati*, *Maitri*, *Himadri*), and official NCPOR archival links.

### 2. 📊 Live Observation Telemetry & Anomaly Engine (`/data`)
- **Real NOAA Observations**: Ingested hourly observations from the NOAA South Pole Observatory (Station: `SPO`, Lat: `-90.0°`, Alt: `2835m`).
- **Statistical Anomaly Engine**: Automated detection flagging observations deviating by $> 2\sigma$ from 30-day baseline means (95.4% confidence interval), detecting polar storms and sub-zero temperature drops.
- **Interactive Multi-Parameter Canvas**: Toggle between Temperature (2m, 10m, Tower Top), Barometric Pressure, Wind Speed, Direction, and Humidity.
- **One-Click CSV Export**: Direct dataset download for academic researchers with automated missing-value (`-999.9`) filtering.
- **Multi-Station Comparison**: Comparative metrics across Maitri, Bharati, Himadri, and South Pole.

### 3. 🤖 Polar AI Copilot with Voice & Outreach Generation
- **Google Gemini Engine**: Low-latency AI conversational assistant trained on Indian polar science history, research stations, and observation datasets.
- **🎙️ Web Speech API (Voice Input)**: Native voice queries with zero external dependencies—speak questions naturally to receive instant AI scientific synthesis.
- **📣 Social Media & Outreach Generator**: Automated generation of fact-checked tweets, Instagram captions, press releases, student explainers, and institutional newsletters.

### 4. 🗺️ 3D Geospatial Explorer (`/map`)
- **Interactive Station Mapping**: Precise coordinates for *Maitri*, *Bharati*, *Himadri*, *Himansh*, and *South Pole*.
- **NASA GIBS Live Sea Ice Concentration**: Real-time satellite WMS layer overlay from NASA EOSDIS.
- **Station Telemetry Flyouts**: Instant access to station parameters, established year, elevation, and live data telemetry.

### 5. 📚 Publications & Reports Repository (`/publications`, `/reports`)
- **Peer-Reviewed Index**: Comprehensive research papers with journal filtering and direct DOI resolution.
- **One-Click Academic Citations**: Instant APA, MLA, and BibTeX citation formatting copied directly to the clipboard.
- **Official Documentation**: Technical monographs, annual expedition volumes, and government whitepapers.

### 6. 📸 Multimedia Archive (`/media`)
- **High-Resolution Photography**: Filtered by region (*Antarctica*, *Arctic*, *Southern Ocean*) and category (*Stations*, *Vessels*, *Wildlife*, *Glaciers*, *Science*).
- **Official Video Documentaries**: Embedded documentary films from MoES and Doordarshan.
- **1-Click Social Media Captions**: Instant pre-crafted post generation with official MoES/NCPOR hashtags.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technologies Used |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling & Design System** | Tailwind CSS v4, Vanilla CSS, Enterprise Polar Design System |
| **Database & Auth** | Supabase (PostgreSQL), `@supabase/ssr` server-client integration |
| **Artificial Intelligence** | Google Gemini (`@google/genai`), Multi-turn conversation context |
| **Visualizations** | Recharts (Telemetry), Leaflet (Geospatial with NASA GIBS WMS) |
| **Voice Processing** | Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) |
| **Testing** | Custom Automated Integrity Test Suite (`scripts/test-portal.mjs`) |

---

## ⏱️ 5-Minute SIH Live Judging Demo Script

> **Follow this exact walkthrough during the SIH 2026 jury presentation:**

1. **0:00 – 0:45 | The Problem & Landing Viewport (`/`)**
   - *"India has conducted polar missions since 1981, but research has remained fragmented. POLARIS provides India's unified National Polar Knowledge Hub."*
   - Highlight the full-screen viewport hero fitting screen bounds with anchored live stats strip (`15+ Expeditions`, `500+ Publications`, `1,200+ Datasets`).
   - Demonstrate the unified 9-link navigation and official Government of India ribbon.

2. **0:45 – 1:30 | Expeditions Explorer (`/expeditions`)**
   - Filter by `Antarctica` → toggle `Timeline View`.
   - Click **"View Full Dossier"** on the *43rd Indian Antarctic Expedition* to show scientific deliverables, lead institutions, and logistics icebreakers.

3. **1:30 – 2:30 | Real Telemetry, Anomaly Detection & CSV Export (`/data`)**
   - Show real 2026 hourly observations from the NOAA South Pole Observatory.
   - Point out the **Automated Anomaly Alert Banner** (detecting extreme values $> 2\sigma$).
   - Click **"📥 Export CSV Dataset"** to prove researchers can immediately download real data.

4. **2:30 – 3:30 | Polar AI with Voice & Content Generation**
   - Click the **`🎙️` Microphone** in Polar AI and speak: *"Tell me about Bharati station in Antarctica."*
   - Show real-time transcription and instant Gemini synthesis.
   - Switch to the **"Generate"** tab and click **"Tweet"** or **"Instagram"** to show instant institutional outreach content generation.

5. **3:30 – 4:15 | Geospatial Explorer & Sea Ice Overlay (`/map`)**
   - Fly to *Maitri* and *Bharati* stations.
   - Toggle the **NASA GIBS Live Sea Ice Concentration layer** on/off.

6. **4:15 – 5:00 | Automated Tests & Closing (`npm test`)**
   - Run `npm test` in the terminal: show 14/14 test cases passing with green status across all endpoints.
   - *"POLARIS is fully functional, scientifically verified, and production-ready."*

---

## 💻 Local Setup & Development

### 1. Clone & Install Dependencies
```bash
cd polar-knowledge-hub
npm install
```

### 2. Configure Environment Variables
Create `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Production Build
```bash
npm run build
```

---

## 🏛️ Government Compliance & Scientific Integrity
- **Sentinel Filtering**: Preserves scientific integrity by filtering NOAA `-999.9` missing-value sentinels without modifying raw archives.
- **Accreditation**: Formally credits the Ministry of Earth Sciences (MoES), National Centre for Polar and Ocean Research (NCPOR), and NOAA ESRL Global Monitoring Laboratory.
- **Structured Data**: Implements `schema.org/GovernmentOrganization` for high-authority academic indexing.

---
*Created for Smart India Hackathon (SIH 2026) · Problem Statement 26063*
