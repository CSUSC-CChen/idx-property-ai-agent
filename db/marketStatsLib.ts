// marketStatsLib.ts — Week 5
// Pure helpers for market analytics. No database access and no side effects,
// so these can be imported by tests (and by marketStats.ts) safely.

import { parsePropertyQuery } from "../skills/property-search/parsePropertyQuery";

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

