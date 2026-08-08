// recommendLib.ts — Week 7
// Pure scoring for the recommendation engine — no database, no OpenAI, no side
// effects, so it's fully unit-testable. IO (lookups, embeddings, comp queries)
// lives in recommend.ts.
//
// The hybrid score follows the handbook: up to 60 points of structured
// similarity (price, beds, city, sqft) + up to 40 points of semantic similarity
// (embedding cosine), for a 0–100 scale.

export interface ScorableListing {
  L_SystemPrice?: number | string | null;
  L_Keyword2?: number | string | null; // bedrooms
  LM_Int2_3?: number | string | null; // finished sqft
  L_City?: string | null;
}

function num(x: unknown): number | null {
  if (x === null || x === undefined || x === "") return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

// ── Structured similarity (0–60) ───────────────────────────────────
export function structuredScore(target: ScorableListing, cand: ScorableListing): number {
  let score = 0;

  const tp = num(target.L_SystemPrice);
  const cp = num(cand.L_SystemPrice);
  if (tp != null && cp != null) {
    const d = Math.abs(tp - cp);
    if (d < 50_000) score += 20;
    else if (d < 150_000) score += 12;
    else if (d < 300_000) score += 5;
  }

  const tb = num(target.L_Keyword2);
  const cb = num(cand.L_Keyword2);
  if (tb != null && cb != null && tb === cb) score += 15;

  if (target.L_City && cand.L_City && target.L_City === cand.L_City) score += 15;

  const ts = num(target.LM_Int2_3);
  const cs = num(cand.LM_Int2_3);
  if (ts != null && cs != null) {
    const d = Math.abs(ts - cs);
    if (d < 300) score += 10;
    else if (d < 700) score += 5;
  }

  return score;
}

// ── Hybrid score (0–100) ───────────────────────────────────────────
export function hybridScore(
  target: ScorableListing,
  cand: ScorableListing,
  semSim: number
): number {
  const structured = structuredScore(target, cand);
  // Clamp cosine to [0, 1] for scoring: a negative similarity shouldn't push a
  // candidate below its structured merit, and cosine can't exceed 1.
  const sem = Math.max(0, Math.min(1, semSim)) * 40;
  return Math.round((structured + sem) * 100) / 100;
}

// ── Comp-validated price assessment ────────────────────────────────
export interface CompAssessment {
  compPrice: number | null;
  listPrice: number;
  compCount: number;
  deltaPct: number | null;
  label: string;
}

// Given the average price/sqft of nearby sold comps, estimate what this listing
// "should" cost and how its list price compares.
export function assessComp(
  listPrice: number,
  avgPpsf: number | null,
  sqft: number | null,
  compCount: number
): CompAssessment {
  if (!avgPpsf || !sqft || compCount === 0) {
    return { compPrice: null, listPrice, compCount, deltaPct: null, label: "no comps available" };
  }
  const compPrice = avgPpsf * sqft;
  const deltaPct = ((listPrice - compPrice) / compPrice) * 100;

  let label: string;
  if (deltaPct < -5) label = `${Math.abs(Math.round(deltaPct))}% below comps`;
  else if (deltaPct > 5) label = `${Math.round(deltaPct)}% above comps`;
  else label = "in line with comps";

  return {
    compPrice: Math.round(compPrice),
    listPrice,
    compCount,
    deltaPct: Math.round(deltaPct * 10) / 10,
    label,
  };
}
