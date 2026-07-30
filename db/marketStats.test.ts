// marketStats.test.ts — Week 5 validation
// Tests the market analytics math and location resolution. Imports from
// marketStatsLib (pure helpers, no database, no side effects) so these run
// instantly with no MySQL connection.
//
//   npx tsx db/marketStats.test.ts

import {
  money,
  median,
  avg,
  monthsBefore,
  fallbackCity,
  resolveLocation,
} from "./marketStatsLib";

let passed = 0;
let failed = 0;

function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) {
    passed++;
    console.log(`PASS  ${name}`);
  } else {
    failed++;
    console.log(`FAIL  ${name}`);
    console.log(`      want ${JSON.stringify(want)}`);
    console.log(`      got  ${JSON.stringify(got)}`);
  }
}

function checkTrue(name: string, got: boolean) {
  check(name, got, true);
}

// ── median ─────────────────────────────────────────────────────────
// Median is computed in TypeScript because MySQL has no MEDIAN function,
// so the correctness of this function is entirely on us.

console.log("\n--- median ---");

check("odd count picks the middle", median([1, 3, 2]), 2);
check("even count averages the two middles", median([10, 20, 30, 40]), 25);
check("single value", median([500000]), 500000);
check("two values", median([100, 200]), 150);
check("empty array returns 0 (no crash)", median([]), 0);
check("already sorted", median([1, 2, 3, 4, 5]), 3);
check("reverse sorted", median([5, 4, 3, 2, 1]), 3);
check("duplicates", median([100, 100, 100]), 100);
{
  // Median must resist a single outlier — the whole reason we report it
  // alongside the average for housing prices.
  const prices = [500000, 550000, 600000, 650000, 9000000];
  check("median resists an outlier", median(prices), 600000);
  checkTrue("average is skewed by the same outlier", avg(prices) > 2000000);
}
{
  // Must not mutate the caller's array (the trend code reuses it).
  const input = [3, 1, 2];
  median(input);
  check("does not mutate input array", input, [3, 1, 2]);
}

// ── avg ────────────────────────────────────────────────────────────

console.log("\n--- avg ---");

check("simple average", avg([10, 20, 30]), 20);
check("single value", avg([42]), 42);
check("empty array returns 0 (no divide-by-zero)", avg([]), 0);

// ── monthsBefore ───────────────────────────────────────────────────
// Used to build the 12-month window measured from the latest sale in the
// data (not today), since the comps table is a fixed snapshot.

console.log("\n--- monthsBefore ---");

check("12 months back", monthsBefore("2025-03-10", 12), "2024-03-10");
check("3 months back", monthsBefore("2025-01-15", 3), "2024-10-15");
check("crosses year boundary", monthsBefore("2025-01-01", 1), "2024-12-01");
check("zero months is a no-op", monthsBefore("2025-06-15", 0), "2025-06-15");
check("returns YYYY-MM-DD form", monthsBefore("2024-11-30", 6).length, 10);
{
  // String comparison is how CloseDate (a VARCHAR) gets filtered, so the
  // output format must stay lexicographically sortable.
  const older = monthsBefore("2025-06-01", 12);
  checkTrue("older date sorts before newer as a string", older < "2025-06-01");
}

// ── fallbackCity ───────────────────────────────────────────────────
// The shared parser only understands "in/near/around <city>". Market
// questions are often phrased differently, so these patterns fill the gap —
// without inventing a city when the user never named one.

console.log("\n--- fallbackCity: recognized phrasings ---");

check('"for Pasadena"', fallbackCity("market stats for Pasadena"), "Pasadena");
check('"for San Diego"', fallbackCity("how is the market for San Diego"), "San Diego");
check('"Pasadena market stats"', fallbackCity("Pasadena market stats"), "Pasadena");
check('"Long Beach home prices"', fallbackCity("Long Beach home prices"), "Long Beach");
check('"how is Arcadia doing"', fallbackCity("how is Arcadia doing"), "Arcadia");
check('"what about Newport Beach"', fallbackCity("what about Newport Beach"), "Newport Beach");

console.log("\n--- fallbackCity: must NOT invent a location ---");

check("vague: market doing", fallbackCity("how's the market doing"), null);
check("vague: market looking", fallbackCity("how is the market looking"), null);
check("vague: home prices", fallbackCity("what are home prices like"), null);
check("vague: good time to buy", fallbackCity("is now a good time to buy"), null);
check("empty string", fallbackCity(""), null);

// ── resolveLocation: city, zip, both, neither ──────────────────────

console.log("\n--- resolveLocation ---");

{
  const r = resolveLocation("how's the market in Pasadena?");
  check("city from 'in' phrasing", [r.city, r.zip, r.place], ["Pasadena", null, "Pasadena"]);
}
{
  const r = resolveLocation("market stats for Pasadena");
  check("city from fallback phrasing", r.place, "Pasadena");
}
{
  const r = resolveLocation("how is the market in 90012");
  check("zip only", [r.city, r.zip, r.place], [null, 90012, "90012"]);
}
{
  const r = resolveLocation("market stats in Irvine 92602");
  check("city and zip together", [r.city, r.zip, r.place], ["Irvine", 92602, "Irvine 92602"]);
}
{
  const r = resolveLocation("market stats for Irvine 92602");
  check("city and zip via fallback", r.place, "Irvine 92602");
}
{
  const r = resolveLocation("how's the market doing?");
  check("no location -> place is null", r.place, null);
}
{
  // A trailing "?" must not defeat city extraction — market questions
  // almost always end with one.
  const withQ = resolveLocation("median price in Long Beach?");
  const withoutQ = resolveLocation("median price in Long Beach");
  check("trailing ? does not break parsing", withQ.place, withoutQ.place);
}
{
  const r = resolveLocation("average price per sqft in San Diego");
  check("multi-word city with a metric question", r.place, "San Diego");
}

// ── money formatting ───────────────────────────────────────────────

console.log("\n--- money ---");

check("formats with commas and $", money(1234567), "$1,234,567");
check("rounds to whole dollars", money(999999.6), "$1,000,000");
check("null is N/A", money(null), "N/A");
check("zero renders", money(0), "$0");

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
