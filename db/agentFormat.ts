// agentFormat.ts — Week 9
// Turns structured AgentResults into WhatsApp-ready text. Formatting lives
// here (not inside each agent) so the orchestrator can merge two agents'
// DATA and render one coherent reply, rather than gluing two finished
// strings together.
//
// Pure functions — no DB, no OpenAI, no side effects. Unit-testable.

import { AgentResult, MarketStats, ScoredRec, SemanticMatch } from "./agentTypes";
import { formatCard, ListingRow } from "./queries";

export function money(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

export function formatListings(query: string, listings: ListingRow[]): string {
  if (listings.length === 0) {
    return "No active listings matched those filters. Try loosening the price or dropping a constraint.";
  }
  const header = `${listings.length} match${listings.length === 1 ? "" : "es"} for "${query}":`;
  return `${header}\n\n${listings.map(formatCard).join("\n\n")}`;
}

export function formatSemantic(query: string, matches: SemanticMatch[]): string {
  if (matches.length === 0) {
    return "No active listings with descriptions matched that. Try naming a city or loosening the filters.";
  }
  const header = `Top ${matches.length} closest match${matches.length === 1 ? "" : "es"} for "${query}":`;
  const body = matches
    .map(({ row, score }) => `${formatCard(row)}\n  match: ${Math.round(score * 100)}%`)
    .join("\n\n");
  return `${header}\n\n${body}`;
}

export function formatMarket(s: MarketStats): string {
  let ltcLine = "Sold-to-list: N/A";
  if (s.avgLtc != null) {
    const posture = s.avgLtc >= 100 ? "above asking on average" : "below asking on average";
    ltcLine = `Sold-to-list: ${s.avgLtc.toFixed(1)}% (${posture})`;
  }

  const trendLines = s.monthly.map((m) => `${m.month}: ${money(m.median)} (${m.count} sold)`);

  let direction = "";
  if (s.directionPct != null && s.monthly.length >= 2) {
    const word = s.directionPct >= 0 ? "up" : "down";
    const first = s.monthly[0].month;
    const last = s.monthly[s.monthly.length - 1].month;
    direction = `\nMedian ${word} ${Math.abs(s.directionPct).toFixed(1)}% from ${first} to ${last}.`;
  }

  return [
    `*${s.place} market* — ${s.soldCount} sold homes, ${s.rangeStart} to ${s.rangeEnd}`,
    ``,
    `Median close: ${money(s.medianClose)}`,
    `Average close: ${money(s.avgClose)}`,
    `Price per sqft: ${s.avgPpsf != null ? money(s.avgPpsf) : "N/A"}`,
    `Days on market: ${s.avgDom != null ? Math.round(s.avgDom) : "N/A"} (avg)`,
    ltcLine,
    `Active listings now: ${s.activeInventory}`,
    ``,
    `Monthly median:`,
    ...trendLines,
    direction,
  ].join("\n");
}

export function formatRecommendations(target: ListingRow, items: ScoredRec[]): string {
  const header =
    `Homes similar to *${target.L_Address}, ${target.L_City}* ` +
    `(${money(Number(target.price) || 0)}):`;
  const body = items
    .map(({ row, score, assessment }, i) => {
      const comp =
        assessment.deltaPct != null
          ? `${assessment.label} (${assessment.compCount} comps)`
          : assessment.label;
      return `${i + 1}. match ${Math.round(score)}/100 · ${comp}\n${formatCard(row)}`;
    })
    .join("\n\n");
  return `${header}\n\n${body}`;
}

export function formatKnowledge(answer: string, sources: string[]): string {
  return sources.length > 0
    ? `${answer}\n\n(sourced from: ${sources.join(", ")})`
    : answer;
}

// ── Single entry point ──────────────────────────────────────────────
export function formatResult(r: AgentResult): string {
  switch (r.kind) {
    case "listings":
      return formatListings(r.query, r.listings);
    case "semantic":
      return formatSemantic(r.query, r.matches);
    case "market":
      return formatMarket(r.stats);
    case "recommendations":
      return formatRecommendations(r.target, r.items);
    case "knowledge":
      return formatKnowledge(r.answer, r.sources);
    case "message":
      return r.text;
  }
}

// ── Mixed-intent merge ──────────────────────────────────────────────
// Renders several results as one reply. Because we hold DATA rather than
// finished strings, "message" results (e.g. "no results found") can be
// dropped when a sibling agent DID return something useful — which blind
// string concatenation could never do.
export function formatCombined(results: AgentResult[]): string {
  const useful = results.filter((r) => r.kind !== "message");
  const chosen = useful.length > 0 ? useful : results.slice(0, 1);
  return chosen.map(formatResult).join("\n\n———\n\n");
}
