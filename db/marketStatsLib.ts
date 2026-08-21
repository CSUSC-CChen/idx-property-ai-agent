// marketStatsLib.ts — Week 5
// Pure helpers for market analytics. No database access and no side effects,
// so these can be imported by tests (and by marketStats.ts) safely.

import { parsePropertyQuery } from "../skills/property-search/parsePropertyQuery";
import { MarketStats, MonthlyPoint } from "./agentTypes";
export function money(n: number | null): string {
  return n != null ? `$${Math.round(n).toLocaleString()}` : "N/A";
}

export function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function avg(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

// Subtract n months from a 'YYYY-MM-DD' string, return 'YYYY-MM-DD'.
export function monthsBefore(dateStr: string, n: number): string {
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

export function fallbackCity(text: string): string | null {
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

// Pure location resolution, mirroring what main() does. Exported for testing.
export function resolveLocation(rawMessage: string): {
  city: string | null;
  zip: number | null;
  place: string | null;
} {
  const cleaned = rawMessage.replace(/[?!]/g, " ").trim();
  const parsed = parsePropertyQuery(cleaned);
  const city = parsed.city ?? fallbackCity(cleaned);
  const zip = parsed.zip;
  const place =
    city && zip ? `${city} ${zip}` : city ? city : zip ? `${zip}` : null;
  return { city, zip, place };
}

export interface SoldStatInput {
  close: number;
  list: number;
  area: number;
  dom: number;
  date: string; // "YYYY-MM-DD"
}

// Normalize raw DB rows: coerce numbers, drop rows with no close price or a
// malformed date. Kept separate so the DB row shape stays out of the pure math.
export function normalizeSoldRows(
  rows: Array<{ ClosePrice: any; ListPrice: any; LivingArea: any; DaysOnMarket: any; CloseDate: any }>
): SoldStatInput[] {
  return rows
    .map((r) => ({
      close: Number(r.ClosePrice),
      list: Number(r.ListPrice),
      area: Number(r.LivingArea),
      dom: Number(r.DaysOnMarket),
      date: String(r.CloseDate).slice(0, 10),
    }))
    .filter((r) => r.close > 0 && /^\d{4}-\d{2}-\d{2}$/.test(r.date));
}

export function computeMarketStats(
  place: string,
  data: SoldStatInput[],
  activeInventory: number
): MarketStats | null {
  if (data.length === 0) return null;

  // 12-month window measured from the latest sale IN THE DATA, not today's
  // calendar date — the comps are a snapshot, so "last 12 months of today"
  // could be empty. Falls back to the full set if the window is too thin.
  const maxDate = data[data.length - 1].date;
  const windowStart = monthsBefore(maxDate, 12);
  const recent = data.filter((r) => r.date >= windowStart);
  const use = recent.length >= 5 ? recent : data;

  const closes = use.map((r) => r.close);
  const ppsf = use.filter((r) => r.area > 0).map((r) => r.close / r.area);
  const dom = use.filter((r) => Number.isFinite(r.dom) && r.dom >= 0).map((r) => r.dom);
  const ltc = use.filter((r) => r.list > 0).map((r) => (r.close / r.list) * 100);

  const byMonth = new Map<string, number[]>();
  for (const r of use) {
    const m = r.date.slice(0, 7);
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(r.close);
  }
  const months = [...byMonth.keys()].sort().slice(-12);
  const monthly: MonthlyPoint[] = months.map((m) => {
    const vals = byMonth.get(m)!;
    return {month: m, median: median(vals), count: vals.length};
  });

  let directionPct: number | null = null;
  if (monthly.length >= 2) {
    const first = monthly[0].median;
    const last = monthly[monthly.length - 1].median;
    if (first > 0) directionPct = ((last - first) / first) * 100;
  }

  return {
    place,
    soldCount: use.length,
    rangeStart: use[0].date,
    rangeEnd: use[use.length - 1].date,
    medianClose: median(closes),
    avgClose: avg(closes),
    avgPpsf: ppsf.length ? avg(ppsf) : null,
    avgDom: dom.length ? avg(dom) : null,
    avgLtc: ltc.length ? avg(ltc) : null,
    activeInventory,
    monthly,
    directionPct,
  };
}