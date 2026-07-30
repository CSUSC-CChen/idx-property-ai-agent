// semanticSearch.ts — Week 6
// Semantic ("vibe") property search. Takes a free-text description and returns
// the closest active listings by embedding similarity to their L_Remarks.
//
//   ./node_modules/.bin/tsx db/semanticSearch.ts "charming craftsman with character and mountain views"
//
// HYBRID DESIGN: any structured hints the parser finds (city, price, beds, type)
// first NARROW the candidate pool via SQL, then embeddings RANK what's left by
// meaning. This keeps embedding cost bounded (we never embed all 53K listings)
// and makes results better — semantic ranking within the right city beats
// semantic ranking across the whole state.

import "dotenv/config";
import { parsePropertyQuery } from "../skills/property-search/parsePropertyQuery";
import { query, closePool } from "./db";
import { formatCard, ListingRow } from "./queries";
import {
  buildListingText,
  embedText,
  embedBatch,
  loadCache,
  saveCache,
  rankBySimilarity,
  EmbeddableRow,
} from "./embeddings";

const MAX_CANDIDATES = 400; // bounds embedding cost/latency per query
const EMBED_BATCH = 128;

type CandidateRow = ListingRow & EmbeddableRow & { L_Remarks: string };

async function main() {
  const q = process.argv.slice(2).join(" ").trim();
  if (!q) {
    console.log(
      'Describe what you\'re looking for — e.g. "charming craftsman with character and mountain views".'
    );
    return;
  }

  // Structured hints narrow the pool (all optional).
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
    console.log(
      `No active listings with descriptions matched those constraints. Try naming a city or loosening the filters.`
    );
    await closePool();
    return;
  }

  // Ensure every candidate has an embedding (cache-aware; only new ones cost).
  const cache = loadCache();
  const missing = rows.filter((r) => !cache[String(r.L_ListingID)]);
  if (missing.length > 0) {
    for (let i = 0; i < missing.length; i += EMBED_BATCH) {
      const slice = missing.slice(i, i + EMBED_BATCH);
      const vecs = await embedBatch(slice.map((r) => buildListingText(r)));
      slice.forEach((r, j) => {
        cache[String(r.L_ListingID)] = vecs[j];
      });
    }
    saveCache(cache);
  }

  // Embed the query and rank.
  const queryVec = await embedText(q);
  const items = rows.map((r) => ({
    vector: cache[String(r.L_ListingID)] || [],
    row: r,
  }));
  const top = rankBySimilarity(queryVec, items, 5);

  await closePool();

  const header = `Top ${top.length} closest match${top.length === 1 ? "" : "es"} for "${q}":`;
  const body = top
    .map(({ row, score }) => `${formatCard(row)}\n  match: ${Math.round(score * 100)}%`)
    .join("\n\n");
  console.log(`${header}\n\n${body}`);
}

main().catch((err) => {
  console.error("Semantic search failed:", err.message);
  process.exit(1);
});
