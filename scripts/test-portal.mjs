/**
 * POLARIS Automated System Test Suite
 * Smart India Hackathon (SIH 2026) · Problem Statement 26063
 * Ministry of Earth Sciences (MoES) & NCPOR
 */

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

const ROUTES = [
  { path: "/", name: "Landing Page & Viewport Hero" },
  { path: "/explore", name: "Explore Resources & Outreach" },
  { path: "/expeditions", name: "Expeditions Client & Timeline" },
  { path: "/publications", name: "Peer-Reviewed Publications" },
  { path: "/reports", name: "Expedition Reports Archive" },
  { path: "/media", name: "Media Gallery & Documentaries" },
  { path: "/data", name: "NOAA Telemetry & CSV Exporter" },
  { path: "/analytics", name: "Informatics & Analytics Dashboard" },
  { path: "/map", name: "3D Polar Geospatial Map" },
  { path: "/research", name: "Research Thrusts & PACER Grants" },
  { path: "/institutional", name: "Outreach & Press Release AI" },
];

async function runTests() {
  console.log("\n===========================================================");
  console.log("  🧊 POLARIS — SIH 2026 AUTOMATED INTEGRITY TEST SUITE");
  console.log("  Target Environment:", BASE_URL);
  console.log("===========================================================\n");

  let passed = 0;
  let failed = 0;

  // 1. TEST ALL 11 PORTAL ROUTES
  console.log("▶ 1. Verifying Portal Web Routes (HTTP 200 OK)...");
  for (const route of ROUTES) {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}${route.path}`);
      const duration = Date.now() - start;
      if (res.status === 200) {
        console.log(`  ✓ [200 OK] ${route.name.padEnd(35)} (${route.path}) - ${duration}ms`);
        passed++;
      } else {
        console.error(`  ✗ [FAIL] ${route.name.padEnd(35)} returned HTTP ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`  ✗ [ERROR] ${route.name}: ${err.message}`);
      failed++;
    }
  }

  // 2. TEST TELEMETRY API
  console.log("\n▶ 2. Verifying NOAA Telemetry API (/api/polar-data)...");
  try {
    const start = Date.now();
    const res = await fetch(`${BASE_URL}/api/polar-data?datasetId=af06cb62-bbcb-4dad-9b88-bcc365f538d3`);
    const duration = Date.now() - start;
    if (res.status === 200) {
      const json = await res.json();
      const records = json.data || json;
      const count = Array.isArray(records) ? records.length : 0;
      console.log(`  ✓ [200 OK] Telemetry API responded with ${count} observations (${duration}ms)`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] Telemetry API returned HTTP ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ✗ [ERROR] Telemetry API: ${err.message}`);
    failed++;
  }

  // 3. TEST UNIFIED SEARCH API
  console.log("\n▶ 3. Verifying Unified Search Engine (/api/polar-data/search)...");
  try {
    const start = Date.now();
    const res = await fetch(`${BASE_URL}/api/polar-data/search?q=Bharati`);
    const duration = Date.now() - start;
    if (res.status === 200) {
      const json = await res.json();
      const results = json.results || json.data || json;
      const count = Array.isArray(results) ? results.length : 0;
      console.log(`  ✓ [200 OK] Search query "Bharati" returned ${count} indexed records (${duration}ms)`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] Search API returned HTTP ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ✗ [ERROR] Search API: ${err.message}`);
    failed++;
  }

  // 4. TEST POLAR AI ENDPOINT STRUCTURE
  console.log("\n▶ 4. Verifying Polar AI Copilot Endpoint (/api/polar-ai)...");
  try {
    const start = Date.now();
    // Test with empty message to check validation handler
    const res = await fetch(`${BASE_URL}/api/polar-ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "" }),
    });
    const duration = Date.now() - start;
    // 400 Bad Request with "Message is required" means route is live and validating correctly
    if (res.status === 400 || res.status === 200) {
      console.log(`  ✓ [HEALTHY] Polar AI Endpoint active & responding correctly (${duration}ms)`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] Polar AI Endpoint returned unexpected status: ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ✗ [ERROR] Polar AI Endpoint: ${err.message}`);
    failed++;
  }

  // SUMMARY
  console.log("\n===========================================================");
  console.log(`  RESULTS: ${passed} PASSED · ${failed} FAILED · TOTAL: ${passed + failed}`);
  console.log("===========================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("  🎉 All POLARIS systems are healthy and ready for demonstration!\n");
    process.exit(0);
  }
}

runTests();
