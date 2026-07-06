// agentSearch.ts — Week 3, Phase F
// The command the OpenClaw skill runs via exec. Takes a natural-language
// query, runs the full parse -> SQL -> format pipeline, and prints a clean
// WhatsApp-ready message (and nothing else) so the agent can relay it as-is.
//
//   ./node_modules/.bin/tsx db/agentSearch.ts "3 bed condos in Irvine under 1M"

import "dotenv/config";
import { parsePropertyQuery } from "../skills/property-search/parsePropertyQuery";
import { searchActiveListings, ListingRow } from "./queries";
import { closePool } from "./db";

function money(n: number): string {
  return n != null ? `$${Number(n).toLocaleString()}` : "N/A";
}

// WhatsApp uses *single asterisks* for bold.
function whatsappCard(r: ListingRow): string {
  const beds = r.beds ?? "?";
  const baths = r.baths ?? "?";
  const sqft = r.sqft != null ? `${Number(r.sqft).toLocaleString()} sqft` : "sqft N/A";
  const pool = r.PoolPrivateYN === "True" ? " · private pool" : "";
  return (
    `*${r.L_Address}, ${r.L_City} ${r.L_Zip}*\n` +
    `${money(r.price)} · ${beds} bd / ${baths} ba · ${sqft}\n` +
    `${r.type} · ${r.DaysOnMarket ?? "?"} days on market${pool}`
  );
}

async function main() {
  const q = process.argv.slice(2).join(" ").trim();
  if (!q) {
    console.log('Please include a property search, e.g. "3 bed condos in Irvine under 1M".');
    return;
  }

  const filters = parsePropertyQuery(q);
  const rows = await searchActiveListings(filters, 1, 5); // 5 cards keeps WhatsApp tidy

  if (rows.length === 0) {
    console.log(
      `No active listings matched "${q}" in the MLS data. Try loosening one filter — for example, drop the pool or raise the price.`
    );
    await closePool();
    return;
  }

  const header = `Found ${rows.length} listing${rows.length === 1 ? "" : "s"} for "${q}":`;
  const body = rows.map(whatsappCard).join("\n\n");
  console.log(`${header}\n\n${body}`);
  await closePool();
}

main().catch((err) => {
  console.error("Search failed:", err.message);
  process.exit(1);
});
