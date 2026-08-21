// orchestrateLib.test.ts — Week 9 validation
// Routing decisions only. Pure logic, no DB/OpenAI.
import { classifyIntent, detectSignals, extractListingRef } from "../src/lib/orchestrateLib";

let passed = 0, failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { passed++; console.log(`PASS  ${name}`); }
  else { failed++; console.log(`FAIL  ${name}\n      want ${JSON.stringify(want)}\n      got  ${JSON.stringify(got)}`); }
}

console.log("\n--- classifyIntent: search ---");
check("beds + city + budget", classifyIntent("3 bed condos in Irvine under 1M"), "search");
check("show me phrasing", classifyIntent("Show me homes in Pasadena"), "search");
check("bare property type", classifyIntent("townhomes with 2 baths"), "search");

console.log("\n--- classifyIntent: market ---");
check("market question", classifyIntent("how's the market in Pasadena?"), "market");
check("median price", classifyIntent("what's the median price in Arcadia"), "market");
check("timing question", classifyIntent("is now a good time to buy in San Diego"), "market");
check("price direction", classifyIntent("are prices rising in Long Beach"), "market");

console.log("\n--- classifyIntent: knowledge (must outrank market) ---");
check("DOM definition", classifyIntent("What does DOM mean?"), "knowledge");
check("list-to-close definition", classifyIntent("What is a list-to-close ratio?"), "knowledge");
check("columns question", classifyIntent("What columns are in california_sold?"), "knowledge");
check("define verb", classifyIntent("define escrow"), "knowledge");

console.log("\n--- classifyIntent: recommend (must outrank search) ---");
check("homes like address", classifyIntent("homes like 419 Tangelo"), "recommend");
check("similar to", classifyIntent("find something similar to 385 S Oakland Ave"), "recommend");
check("anaphoric reference", classifyIntent("more like that first one"), "recommend");

console.log("\n--- classifyIntent: semantic ---");
check("vibe words", classifyIntent("charming craftsman with character"), "semantic");
check("cozy description", classifyIntent("a cozy hidden gem with mountain views"), "semantic");

console.log("\n--- classifyIntent: mixed ---");
check("search + market", classifyIntent("Find me affordable homes in Pasadena and tell me whether prices are rising"), "mixed");
check("listings + trend", classifyIntent("show me condos in Irvine and how is the market doing"), "mixed");

console.log("\n--- classifyIntent: unknown ---");
check("empty string", classifyIntent(""), "unknown");
check("whitespace only", classifyIntent("   "), "unknown");
check("off topic", classifyIntent("hello there"), "unknown");

console.log("\n--- detectSignals ---");
{
  const s = detectSignals("Find me affordable homes in Pasadena and tell me whether prices are rising");
  check("mixed message flags search", s.search, true);
  check("mixed message flags market", s.market, true);
  check("mixed message not recommend", s.recommend, false);
}

console.log("\n--- extractListingRef ---");
check("street address", extractListingRef("homes like 419 Tangelo"), "419 Tangelo");
check("address with directional", extractListingRef("similar to 385 S Oakland Ave"), "385 S Oakland Ave");
check("mls id", extractListingRef("comps for OC12345678"), "OC12345678");
check("anaphoric -> null", extractListingRef("more like that first one"), null);
check("no reference -> null", extractListingRef("show me condos"), null);
check("trailing punctuation stripped", extractListingRef("homes like 419 Tangelo?"), "419 Tangelo");

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
