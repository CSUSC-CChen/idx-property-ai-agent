// marketStats.ts — Week 5 (refactored for Week 9)
// Market analytics over california_sold (historical sold comps).
//
//   ./node_modules/.bin/tsx db/marketStats.ts "how's the market in Pasadena?"
//
// WEEK 9 CHANGES:
// - main() -> exported marketStatsAgent(message), returning an AgentResult.
// - The stats math moved to marketStatsLib.computeMarketStats (pure, testable).
// - closePool() removed; formatting moved to agentFormat.ts.
//
// DESIGN NOTES (unchanged):
// - Median is computed in TS: MySQL has no MEDIAN function and window-function
//   workarounds are fragile across versions.
// - CloseDate is a VARCHAR 'YYYY-MM-DD', so string comparison sorts correctly.
//   Bounded to [2021-01-01 .. today] to drop junk future dates (e.g. 2072).

import { resolveLocation, computeMarketStats, normalizeSoldRows } from "../lib/marketStatsLib";
import { query, closePool } from "../db/db";
import { AgentResult } from "../agentTypes";

interface SoldStatRow {
  ClosePrice: number;
  ListPrice: number;
  LivingArea: number;
  DaysOnMarket: number;
  CloseDate: string;
}

async function activeInventory(city: string | null, zip: number | null): Promise<number> {
  let sql = `SELECT COUNT(*) AS c FROM rets_property WHERE L_Status = 'Active'`;
  const params: any[] = [];
  if (city) { sql += " AND L_City = ?"; params.push(city); }
  if (zip)  { sql += " AND L_Zip = ?";  params.push(zip); }
  const rows = await query<{ c: number }>(sql, params);
  return Number(rows[0]?.c ?? 0);
}

export async function marketStatsAgent(message: string): Promise<AgentResult> {
  const raw = (message || "").trim();
  const { city, zip, place } = resolveLocation(raw);

  if (!city && !zip) {
    return {
      kind: "message",
      text: 'Which city or zip code would you like market stats for? For example: "market stats for Pasadena" or "how is 92602 doing".',
    };
  }

  const label = place ?? String(city ?? zip);
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
  const data = normalizeSoldRows(rows);

  if (data.length === 0) {
    return { kind: "message", text: `No sold-home data found for ${label} in the comps database.` };
  }

  const active = await activeInventory(city, zip);
  const stats = computeMarketStats(label, data, active);

  if (!stats) {
    return { kind: "message", text: `No sold-home data found for ${label} in the comps database.` };
  }
  return { kind: "market", stats };
}

if (require.main === module) {
  (async () => {
    const result = await marketStatsAgent(process.argv.slice(2).join(" ").trim());
    const { formatResult } = await import("./agentFormat");
    console.log(formatResult(result));
  })()
    .catch((err) => {
      console.error("Market stats failed:", err.message);
      process.exitCode = 1;
    })
    .finally(() => closePool().catch(() => {}));
}