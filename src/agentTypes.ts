// agentTypes.ts — Week 9
// Shared result types for the multi-agent orchestrator.
//
// WHY STRUCTURED RESULTS (not formatted strings):
// The orchestrator's "mixed" case runs two agents in parallel and has to merge
// their output into one coherent reply. If each agent returned a pre-formatted
// string, merging would be blind concatenation — two headers, two sets of
// spacing, no way to interleave. Returning data and formatting once at the end
// keeps the merge meaningful and makes routing unit-testable without a DB.

import { ListingRow } from "./db/queries";
import { PropertyFilters } from "./lib/parsePropertyQuery";
import { CompAssessment } from "./lib/recommendLib";

// ── Market statistics ──────────────────────────────────────────────
export interface MonthlyPoint {
  month: string; // "YYYY-MM"
  median: number;
  count: number;
}

export interface MarketStats {
  place: string; // human-readable: "Pasadena", "92602", "Pasadena 91101"
  soldCount: number;
  rangeStart: string; // "YYYY-MM-DD"
  rangeEnd: string;
  medianClose: number;
  avgClose: number;
  avgPpsf: number | null;
  avgDom: number | null;
  avgLtc: number | null; // sold-to-list %, e.g. 103.0
  activeInventory: number;
  monthly: MonthlyPoint[];
  directionPct: number | null; // % change, first month -> last month
}

// ── Scored recommendation ──────────────────────────────────────────
export interface ScoredRec {
  row: ListingRow;
  score: number; // 0–100 hybrid score
  assessment: CompAssessment;
}

// ── Semantic match ─────────────────────────────────────────────────
export interface SemanticMatch {
  row: ListingRow;
  score: number; // cosine similarity, 0–1
}

// ── Agent results ──────────────────────────────────────────────────
// Discriminated union: `kind` tells the formatter and the orchestrator's merge
// logic what shape they're holding, with no type assertions needed.
export type AgentResult =
  | { kind: "listings"; query: string; filters: PropertyFilters; listings: ListingRow[] }
  | { kind: "semantic"; query: string; matches: SemanticMatch[] }
  | { kind: "market"; stats: MarketStats }
  | { kind: "recommendations"; target: ListingRow; items: ScoredRec[] }
  | { kind: "knowledge"; answer: string; sources: string[] }
  // "message" carries anything that used to be a bare console.log inside an
  // agent — "which city?", "no results found", "couldn't find that listing".
  // The orchestrator needs those as returnable values, not side effects.
  | { kind: "message"; text: string };

export type Intent =
  | "search"
  | "semantic"
  | "market"
  | "recommend"
  | "knowledge"
  | "mixed"
  | "unknown";
