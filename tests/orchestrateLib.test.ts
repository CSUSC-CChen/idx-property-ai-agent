import { classifyIntent, detectSignals, extractListingRef } from "../src/lib/orchestrateLib";
let passed=0, failed=0;
function check(n:string,g:unknown,w:unknown){const ok=JSON.stringify(g)===JSON.stringify(w);if(ok){passed++;console.log(`PASS  ${n}`);}else{failed++;console.log(`FAIL  ${n}\n      want ${JSON.stringify(w)}\n      got  ${JSON.stringify(g)}`);}}

console.log("\n--- existing routes must not regress ---");
check("search", classifyIntent("3 bed condos in Irvine under 1M"), "search");
check("show me", classifyIntent("Show me homes in Pasadena"), "search");
check("bare type", classifyIntent("townhomes with 2 baths"), "search");
check("market", classifyIntent("how's the market in Pasadena?"), "market");
check("median", classifyIntent("what's the median price in Arcadia"), "market");
check("timing", classifyIntent("is now a good time to buy in San Diego"), "market");
check("direction", classifyIntent("are prices rising in Long Beach"), "market");
check("DOM", classifyIntent("What does DOM mean?"), "knowledge");
check("ltc", classifyIntent("What is a list-to-close ratio?"), "knowledge");
check("columns", classifyIntent("What columns are in california_sold?"), "knowledge");
check("define", classifyIntent("define escrow"), "knowledge");
check("homes like", classifyIntent("homes like 419 Tangelo"), "recommend");
check("similar to", classifyIntent("find something similar to 385 S Oakland Ave"), "recommend");
check("anaphoric", classifyIntent("more like that first one"), "recommend");
check("vibe", classifyIntent("charming craftsman with character"), "semantic");
check("cozy", classifyIntent("a cozy hidden gem with mountain views"), "semantic");
check("mixed", classifyIntent("Find me affordable homes in Pasadena and tell me whether prices are rising"), "mixed");
check("mixed2", classifyIntent("show me condos in Irvine and how is the market doing"), "mixed");
check("empty", classifyIntent(""), "unknown");
check("ws", classifyIntent("   "), "unknown");
check("offtopic", classifyIntent("hello there"), "unknown");

console.log("\n--- email routing (must outrank market and search) ---");
check("email + address", classifyIntent("email the Pasadena market report to leo@example.com"), "email");
check("email me", classifyIntent("email me the Pasadena market report"), "email");
check("e-mail hyphen", classifyIntent("e-mail me the report"), "email");
check("bare address", classifyIntent("send the Irvine report to leo@example.com"), "email");
check("email it", classifyIntent("email it to leo@example.com"), "email");
check("forward me", classifyIntent("forward me that market summary"), "email");

console.log("\n--- approval words must NOT look like new email requests ---");
check("send it -> unknown", classifyIntent("send it"), "unknown");
check("cancel -> unknown", classifyIntent("cancel"), "unknown");
check("yes -> unknown", classifyIntent("yes"), "unknown");
check("go ahead -> unknown", classifyIntent("go ahead"), "unknown");

console.log("\n--- market/search must not be stolen by email ---");
check("plain market", classifyIntent("how is the market in Irvine"), "market");
check("plain search", classifyIntent("3 bed homes in Irvine"), "search");

console.log("\n--- detectSignals ---");
{
  const s = detectSignals("email the Pasadena market report to leo@example.com");
  check("email flagged", s.email, true);
  check("market also flagged (email wins)", s.market, true);
}
{
  const s = detectSignals("Find me affordable homes in Pasadena and tell me whether prices are rising");
  check("no email signal", s.email, false);
  check("search", s.search, true);
  check("market", s.market, true);
}

console.log("\n--- extractListingRef unchanged ---");
check("addr", extractListingRef("homes like 419 Tangelo"), "419 Tangelo");
check("dir", extractListingRef("similar to 385 S Oakland Ave"), "385 S Oakland Ave");
check("mls", extractListingRef("comps for OC12345678"), "OC12345678");
check("null", extractListingRef("more like that first one"), null);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed>0) process.exitCode=1;