// marketStats.ts — Week 5
// Market analytics over california_sold (historical sold comps).
//
// Answers questions like "median price in Pasadena", "days on market in Irvine",
// "are homes selling above asking in Arcadia". Extracts the city from the
// message, pulls that city's residential sales, and computes stats + a recent
// monthly trend in TypeScript.
//
//   ./node_modules/.bin/tsx db/marketStats.ts "how's the market in Pasadena?"
//
// DESIGN NOTES:
// - Median is computed in TS. MySQL has no MEDIAN function, and doing it in SQL
//   with window functions is fragile across versions; fetching the values and
//   computing here is simpler and provably correct.
// - CloseDate is a VARCHAR in 'YYYY-MM-DD' form, so string comparison sorts and
//   filters it correctly. We bound it to [2021-01-01 .. today] to drop the junk
//   future dates (e.g. 2072) that exist in the dataset.
// - The 12-month window is measured from the most recent sale IN THE DATA, not
//   from today's calendar date — the comps are a snapshot, so "last 12 months
//   of today" could be empty. This keeps the output meaningful regardless of
//   how old the export is, and the actual date range is shown to the user.

import "dotenv/config";
import { parsePropertyQuery } from "../skills/property-search/parsePropertyQuery";
import { query, closePool } from "./db";

interface SoldStatRow {
  ClosePrice: number;
  ListPrice: number;
  LivingArea: number;
  DaysOnMarket: number;
  CloseDate: string;
}

function money(n: number | null): string {
  return n != null ? `$${Math.round(n).toLocaleString()}` : "N/A";
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

// Subtract n months from a 'YYYY-MM-DD' string, return 'YYYY-MM-DD'.
function monthsBefore(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() - n);
  return d.toISOString().slice(0, 10);
}


// The shared parser only recognizes "in/near/around <city>". Market questions
// are often phrased differently ("market stats for Pasadena", "Pasadena market",
// "how is Arcadia doing"), so we add market-specific fallbacks here rather than
// loosening the shared parser — adding "for" there would break property search
// ("looking for a condo in Irvine" would capture "A Condo In Irvine").
// A candidate starting with one of these is a question fragment, not a place
// (e.g. "how is the market doing" must not yield "How Is The").
const LEADING_NON_PLACE = new Set([
  "how", "what", "whats", "what's", "hows", "how's", "is", "are", "the", "a",
  "an", "this", "that", "when", "where", "why", "do", "does", "did", "tell",
  "show", "give", "can", "could", "would", "should", "any", "some", "there",
]);

const LOCATION_STOPWORDS = new Set([
  "the market", "market", "it", "things", "the housing market", "housing market",
  "the area", "real estate", "the real estate market", "home prices", "prices",
  "this", "that", "everything", "the city", "my area", "here",
]);

function fallbackCity(text: string): string | null {
  const patterns: RegExp[] = [
    // "market stats for Pasadena", "how about San Diego"
    /\b(?:for|about)\s+([A-Za-z][A-Za-z .'-]*?)(?=\s+(?:market|area|right now|these days|now|please)\b|\s+\d|[?.,!]|$)/i,
    // "Pasadena market", "San Diego real estate", "Long Beach home prices"
    /^\s*([A-Za-z][A-Za-z .'-]*?)\s+(?:market|real estate|home prices|prices|comps)\b/i,
    // "how is Arcadia doing", "how's Pasadena looking"
    /\bhow(?:'s|\s+is|\s+are)\s+([A-Za-z][A-Za-z .'-]*?)\s+(?:doing|looking|performing|trending)\b/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    const candidate = m[1].trim().replace(/\s+/g, " ");
    if (!candidate) continue;
    if (LOCATION_STOPWORDS.has(candidate.toLowerCase())) continue;
    if (LEADING_NON_PLACE.has(candidate.split(" ")[0].toLowerCase())) continue;
    if (candidate.length < 3) continue;
    return candidate
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return null;
}

async function activeInventory(
  city: string | null,
  zip: number | null
): Promise<number> {
  try {
    let sql = `SELECT COUNT(*) AS c FROM rets_property WHERE L_Status = 'Active'`;
    const params: any[] = [];
    if (city) { sql += " AND L_City = ?"; params.push(city); }
    if (zip)  { sql += " AND L_Zip = ?";  params.push(zip); }
    const rows = await query<{ c: number }>(sql, params);
    return Number(rows[0]?.c ?? 0);
  } catch {
    return 0;
  }
}

async function main() {
  const raw = process.argv.slice(2).join(" ").trim();
  // Strip ? and ! so a trailing "?" doesn't defeat the city parser.
  const cleaned = raw.replace(/[?!]/g, " ").trim();
  const parsed = parsePropertyQuery(cleaned);
  const city = parsed.city ?? fallbackCity(cleaned);
  const zip = parsed.zip;

  if (!city && !zip) {
    console.log(
      'Which city or zip code would you like market stats for? For example: "market stats for Pasadena" or "how is 92602 doing".'
    );
    return;
  }

  // Human-readable label for whichever location filters we ended up with.
  const place =
    city && zip ? `${city} ${zip}` : city ? city : `${zip}`;

  const today = new Date().toISOString().slice(0, 10);
  let sql = `SELECT ClosePrice, ListPrice, LivingArea, DaysOnMarket, CloseDate
     FROM california_sold
     WHERE PropertyType = 'Residential'
       AND CloseDate >= '2021-01-01'
       AND CloseDate <= ?`;
  const params: any[] = [today];
  if (city) { sql += " AND City = ?";       params.push(city); }
  if (zip)  { sql += " AND PostalCode = ?"; params.push(zip); }
  sql += " ORDER BY CloseDate ASC";
  const rows = await query<SoldStatRow>(sql, params);

  const data = rows
    .map((r) => ({
      close: Number(r.ClosePrice),
      list: Number(r.ListPrice),
      area: Number(r.LivingArea),
      dom: Number(r.DaysOnMarket),
      date: String(r.CloseDate).slice(0, 10),
    }))
    .filter((r) => r.close > 0 && /^\d{4}-\d{2}-\d{2}$/.test(r.date));

  if (data.length === 0) {
    console.log(`No sold-home data found for ${place} in the comps database.`);
    await closePool();
    return;
  }

  // 12-month window measured from the latest sale present in the data.
  const maxDate = data[data.length - 1].date;
  const windowStart = monthsBefore(maxDate, 12);
  const recent = data.filter((r) => r.date >= windowStart);
  const use = recent.length >= 5 ? recent : data; // fall back if the window is thin
  const rangeStart = use[0].date;
  const rangeEnd = use[use.length - 1].date;

  const closes = use.map((r) => r.close);
  const medianClose = median(closes);
  const avgClose = avg(closes);

  const ppsf = use.filter((r) => r.area > 0).map((r) => r.close / r.area);
  const avgPpsf = ppsf.length ? avg(ppsf) : null;

  const dom = use.filter((r) => Number.isFinite(r.dom) && r.dom >= 0).map((r) => r.dom);
  const avgDom = dom.length ? avg(dom) : null;

  const ltc = use.filter((r) => r.list > 0).map((r) => (r.close / r.list) * 100);
  const avgLtc = ltc.length ? avg(ltc) : null;

  // Monthly trend (up to the last 12 months present).
  const byMonth = new Map<string, number[]>();
  for (const r of use) {
    const m = r.date.slice(0, 7);
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(r.close);
  }
  const months = [...byMonth.keys()].sort().slice(-12);
  const trendLines = months.map((m) => {
    const vals = byMonth.get(m)!;
    return `${m}: ${money(median(vals))} (${vals.length} sold)`;
  });

  // Overall direction across the window.
  let direction = "";
  if (months.length >= 2) {
    const first = median(byMonth.get(months[0])!);
    const last = median(byMonth.get(months[months.length - 1])!);
    if (first > 0) {
      const pct = ((last - first) / first) * 100;
      const word = pct >= 0 ? "up" : "down";
      direction = `\nMedian ${word} ${Math.abs(pct).toFixed(1)}% from ${months[0]} to ${months[months.length - 1]}.`;
    }
  }

  const active = await activeInventory(city, zip);
  await closePool();

  // Factual sold-to-list phrasing (not advice).
  let ltcLine = "Sold-to-list: N/A";
  if (avgLtc != null) {
    const posture =
      avgLtc >= 100 ? "above asking on average" : "below asking on average";
    ltcLine = `Sold-to-list: ${avgLtc.toFixed(1)}% (${posture})`;
  }

  const out = [
    `*${place} market* — ${use.length} sold homes, ${rangeStart} to ${rangeEnd}`,
    ``,
    `Median close: ${money(medianClose)}`,
    `Average close: ${money(avgClose)}`,
    `Price per sqft: ${avgPpsf != null ? money(avgPpsf) : "N/A"}`,
    `Days on market: ${avgDom != null ? Math.round(avgDom) : "N/A"} (avg)`,
    ltcLine,
    `Active listings now: ${active}`,
    ``,
    `Monthly median:`,
    ...trendLines,
    direction,
  ]
    .filter((l) => l !== null && l !== undefined)
    .join("\n");

  console.log(out);
}

main().catch((err) => {
  console.error("Market stats failed:", err.message);
  process.exit(1);
});
