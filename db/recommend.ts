// recommend.ts — Week 7 (refactored for Week 9)
// "Homes like this one." Given a listing the user likes (by address or MLS id),
// find comparable active listings using a hybrid score (structured + semantic),
// and validate each recommendation's price against california_sold comps.
//
//   ./node_modules/.bin/tsx db/recommend.ts "419 Tangelo"
//   ./node_modules/.bin/tsx db/recommend.ts "OC12345678"     (an MLS display id)
//
// WEEK 9 CHANGES: exported recommendAgent(ref) returning an AgentResult;
// closePool() removed (it was called in four places, which would have torn
// down the shared pool underneath a sibling agent during a mixed-intent
// Promise.all); debug logs removed; formatting moved to agentFormat.ts.

import { query, closePool } from "./db";
import { ListingRow } from "./queries";
import {
  buildListingText,
  embedText,
  embedBatch,
  loadCache,
  saveCache,
  cosineSimilarity,
} from "./embeddings";
import { hybridScore, assessComp, ScorableListing } from "./recommendLib";
import { AgentResult, ScoredRec } from "./agentTypes";

const MAX_CANDIDATES = 300;
const EMBED_BATCH = 128;

// Columns needed for BOTH formatting (aliased) and scoring (raw). No name
// collisions: raw column + a distinct alias are two different output names.
const LISTING_COLS = `
  L_ListingID, L_DisplayId, L_Address, L_City, L_Zip,
  L_SystemPrice, L_Keyword2, LM_Int2_3,
  L_SystemPrice AS price, L_Keyword2 AS beds, LM_Dec_3 AS baths,
  LM_Int2_3 AS sqft, L_Type_ AS type, L_Status AS status,
  YearBuilt, AssociationFee, DaysOnMarket,
  PoolPrivateYN, ViewYN, FireplaceYN, PhotoCount,
  LA1_UserFirstName, LA1_UserLastName, LO1_OrganizationName,
  L_Remarks
`;

type FullRow = ListingRow & ScorableListing & { L_Remarks: string };

async function compPpsf(
  city: string,
  sqft: number,
  today: string
): Promise<{ avgPpsf: number | null; count: number }> {
  if (!city || !sqft) return { avgPpsf: null, count: 0 };
  const rows = await query<{ avg_ppsf: number | null; comp_count: number }>(
    `SELECT AVG(ClosePrice / NULLIF(LivingArea, 0)) AS avg_ppsf, COUNT(*) AS comp_count
     FROM california_sold
     WHERE City = ?
       AND PropertyType = 'Residential'
       AND LivingArea BETWEEN ? AND ?
       AND CloseDate >= '2021-01-01'
       AND CloseDate <= ?`,
    [city, Math.round(sqft * 0.8), Math.round(sqft * 1.2), today]
  );
  const avg = rows[0]?.avg_ppsf;
  return { avgPpsf: avg != null ? Number(avg) : null, count: Number(rows[0]?.comp_count ?? 0) };
}

export async function recommendAgent(reference: string): Promise<AgentResult> {
  const ref = (reference || "").trim();
  if (!ref) {
    return {
      kind: "message",
      text: 'Which listing? Give an address or MLS id, e.g. "homes like 419 Tangelo".',
    };
  }

  const today = new Date().toISOString().slice(0, 10);

  const targets = await query<FullRow>(
    `SELECT ${LISTING_COLS}
     FROM rets_property
     WHERE L_Status = 'Active'
       AND (L_DisplayId = ? OR L_ListingID = ? OR L_Address LIKE ?)
     LIMIT 1`,
    [ref, ref, `%${ref}%`]
  );
  const target = targets[0];
  if (!target) {
    return {
      kind: "message",
      text: `Couldn't find an active listing matching "${ref}". Try the full street address or MLS number.`,
    };
  }

  // Candidate pool: same city, active, has a description, ordered by price
  // proximity so we embed the most relevant ones.
  const candidates = await query<FullRow>(
    `SELECT ${LISTING_COLS}
     FROM rets_property
     WHERE L_Status = 'Active'
       AND L_City = ?
       AND L_ListingID <> ?
       AND L_Remarks IS NOT NULL AND L_Remarks <> ''
     ORDER BY ABS(L_SystemPrice - ?) ASC
     LIMIT ${MAX_CANDIDATES}`,
    [target.L_City, target.L_ListingID, Number(target.L_SystemPrice) || 0]
  );

  if (candidates.length === 0) {
    return {
      kind: "message",
      text: `Found ${target.L_Address}, but no comparable active listings with descriptions in ${target.L_City}.`,
    };
  }

  // Ensure embeddings for the target + candidates (cache-aware).
  const cache = loadCache();
  const needEmbedding = [target, ...candidates].filter((r) => !cache[String(r.L_ListingID)]);
  if (needEmbedding.length > 0) {
    for (let i = 0; i < needEmbedding.length; i += EMBED_BATCH) {
      const slice = needEmbedding.slice(i, i + EMBED_BATCH);
      const vecs = await embedBatch(slice.map((r) => buildListingText(r)));
      slice.forEach((r, j) => { cache[String(r.L_ListingID)] = vecs[j]; });
    }
    saveCache(cache);
  }
  const targetVec =
    cache[String(target.L_ListingID)] || (await embedText(buildListingText(target)));

  const scored = candidates
    .map((c) => ({
      row: c,
      score: hybridScore(target, c, cosineSimilarity(targetVec, cache[String(c.L_ListingID)] || [])),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const items: ScoredRec[] = [];
  for (const { row, score } of scored) {
    const sqft = Number(row.sqft) || 0;
    const listPrice = Number(row.price) || 0;
    const { avgPpsf, count } = await compPpsf(String(row.L_City), sqft, today);
    items.push({ row, score, assessment: assessComp(listPrice, avgPpsf, sqft, count) });
  }

  return { kind: "recommendations", target, items };
}

if (require.main === module) {
  (async () => {
    const result = await recommendAgent(process.argv.slice(2).join(" ").trim());
    const { formatResult } = await import("./agentFormat");
    console.log(formatResult(result));
  })()
    .catch((err) => {
      console.error("Recommendation failed:", err.message);
      process.exitCode = 1;
    })
    .finally(() => closePool().catch(() => {}));
}