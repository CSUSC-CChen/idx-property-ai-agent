// buildEmbeddings.ts — Week 6
// Pre-populate the embedding cache so semantic searches are instant (cache hits)
// instead of embedding candidates on the first query. Run once per city you plan
// to demo.
//
//   ./node_modules/.bin/tsx db/buildEmbeddings.ts "Irvine"        # one city
//   ./node_modules/.bin/tsx db/buildEmbeddings.ts "Irvine" 800    # cap at 800
//   ./node_modules/.bin/tsx db/buildEmbeddings.ts                 # recent statewide, capped
//
// Cost note: text-embedding-3-small is inexpensive (a few hundred listings is a
// fraction of a cent), but embeddings do add up on disk — each listing vector is
// ~1,536 floats. Embedding a whole city is fine; embedding all 53K listings would
// produce a large cache file, so this script caps how many it pulls.

import "dotenv/config";
import { query, closePool } from "./db";
import {
  buildListingText,
  embedBatch,
  loadCache,
  saveCache,
  cacheSize,
} from "./embeddings";

const EMBED_BATCH = 128;
const DEFAULT_LIMIT = 400;
const HARD_CAP = 5000;

async function main() {
  const city = process.argv[2];
  const limit = Math.max(1, Math.min(HARD_CAP, Math.trunc(Number(process.argv[3] || DEFAULT_LIMIT))));

  let sql = `
    SELECT L_ListingID, L_Type_, L_City, L_Keyword2, LM_Dec_3,
           LM_Int2_3, YearBuilt, L_SystemPrice, L_Remarks
    FROM rets_property
    WHERE L_Status = 'Active'
      AND L_Remarks IS NOT NULL AND L_Remarks <> ''
  `;
  const params: any[] = [];
  if (city) { sql += " AND L_City = ?"; params.push(city); }
  sql += ` ORDER BY DaysOnMarket ASC LIMIT ${limit}`;

  const rows = await query<any>(sql, params);
  console.log(`Found ${rows.length} listings${city ? ` in ${city}` : ""} with descriptions.`);

  const cache = loadCache();
  const todo = rows.filter((r) => !cache[String(r.L_ListingID)]);
  console.log(`${rows.length - todo.length} already cached, ${todo.length} to embed.`);

  for (let i = 0; i < todo.length; i += EMBED_BATCH) {
    const slice = todo.slice(i, i + EMBED_BATCH);
    const vecs = await embedBatch(slice.map(buildListingText));
    slice.forEach((r, j) => {
      cache[String(r.L_ListingID)] = vecs[j];
    });
    saveCache(cache);
    console.log(`  embedded ${Math.min(i + EMBED_BATCH, todo.length)}/${todo.length}`);
  }

  console.log(`Done. Cache now holds ${cacheSize(cache)} listing embeddings.`);
  await closePool();
}

main().catch((err) => {
  console.error("Build failed:", err.message);
  process.exit(1);
});
