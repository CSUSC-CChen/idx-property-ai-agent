// semanticSearch.ts — Week 6 (refactored for Week 9)
// Semantic ("vibe") property search over L_Remarks embeddings.
//
//   ./node_modules/.bin/tsx db/semanticSearch.ts "charming craftsman with character"
//
// WEEK 9 CHANGES: exported semanticAgent(query) returning an AgentResult;
// closePool() removed; formatting moved to agentFormat.ts; CLI guarded.
//
// HYBRID DESIGN (unchanged): structured hints from the parser NARROW the
// candidate pool via SQL, then embeddings RANK what's left by meaning. This
// bounds embedding cost and improves results — semantic ranking within the
// right city beats semantic ranking across the whole state.

import { parsePropertyQuery } from "../lib/parsePropertyQuery";
import { query, closePool } from "../db/db";
import { ListingRow } from "../db/queries";
import {
  buildListingText,
  embedText,
  embedBatch,
  loadCache,
  saveCache,
  rankBySimilarity,
  EmbeddableRow,
} from "../embeddings";
import { AgentResult } from "../agentTypes";

const MAX_CANDIDATES = 400; // bounds embedding cost/latency per query
const EMBED_BATCH = 128;

type CandidateRow = ListingRow & EmbeddableRow & { L_Remarks: string };

export async function semanticAgent(userQuery: string): Promise<AgentResult> {
  const q = (userQuery || "").trim();
  if (!q) {
    return {
      kind: "message",
      text: 'Describe what you\'re looking for — e.g. "charming craftsman with character and mountain views".',
    };
  }

  const hint = parsePropertyQuery(q);

  let sql = `
    SELECT
      L_ListingID, L_DisplayId, L_Address, L_City, L_Zip,
      L_SystemPrice AS price, L_Keyword2 AS beds, LM_Dec_3 AS baths,
      LM_Int2_3 AS sqft, L_Type_ AS type, L_Status AS status,
      YearBuilt, AssociationFee, DaysOnMarket,
      PoolPrivateYN, ViewYN, FireplaceYN, PhotoCount,
      LA1_UserFirstName, LA1_UserLastName, LO1_OrganizationName,
      L_Remarks
    FROM rets_property
    WHERE L_Status = 'Active'
      AND L_Remarks IS NOT NULL AND L_Remarks <> ''
  `;
  const params: any[] = [];
  if (hint.city)     { sql += " AND L_City = ?";         params.push(hint.city); }
  if (hint.zip)      { sql += " AND L_Zip = ?";          params.push(hint.zip); }
  if (hint.maxPrice) { sql += " AND L_SystemPrice <= ?"; params.push(hint.maxPrice); }
  if (hint.beds)     { sql += " AND L_Keyword2 >= ?";    params.push(hint.beds); }
  if (hint.type)     { sql += " AND L_Type_ = ?";        params.push(hint.type); }
  sql += ` ORDER BY DaysOnMarket ASC LIMIT ${MAX_CANDIDATES}`;

  const rows = await query<CandidateRow>(sql, params);

  if (rows.length === 0) {
    return {
      kind: "message",
      text: "No active listings with descriptions matched those constraints. Try naming a city or loosening the filters.",
    };
  }

  // Ensure every candidate has an embedding (cache-aware; only new ones cost).
  const cache = loadCache();
  const missing = rows.filter((r) => !cache[String(r.L_ListingID)]);
  if (missing.length > 0) {
    for (let i = 0; i < missing.length; i += EMBED_BATCH) {
      const slice = missing.slice(i, i + EMBED_BATCH);
      const vecs = await embedBatch(slice.map((r) => buildListingText(r)));
      slice.forEach((r, j) => { cache[String(r.L_ListingID)] = vecs[j]; });
    }
    saveCache(cache);
  }

  const queryVec = await embedText(q);
  const items = rows.map((r) => ({ vector: cache[String(r.L_ListingID)] || [], row: r }));
  const top = rankBySimilarity(queryVec, items, 5);

  return {
    kind: "semantic",
    query: q,
    matches: top.map(({ row, score }) => ({ row: row as ListingRow, score })),
  };
}

if (require.main === module) {
  (async () => {
    const result = await semanticAgent(process.argv.slice(2).join(" ").trim());
    const { formatResult } = await import("../lib/agentFormat");
    console.log(formatResult(result));
  })()
    .catch((err) => {
      console.error("Semantic search failed:", err.message);
      process.exitCode = 1;
    })
    .finally(() => closePool().catch(() => {}));
}