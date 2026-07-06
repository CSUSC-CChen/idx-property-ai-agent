// searchListings.demo.ts — Week 3
// End-to-end smoke test: natural-language query -> filters -> SQL -> cards.
// Run it with a query as arguments, e.g.:
//   npx tsx db/searchListings.demo.ts "3-bedroom condos in Irvine under 1.5M with a pool"

import "dotenv/config";
import { parsePropertyQuery } from "../skills/property-search/parsePropertyQuery";
import { searchActiveListings, formatCard } from "./queries";
import { closePool } from "./db";

async function main() {
  const q =
    process.argv.slice(2).join(" ") ||
    "3-bedroom condos in Irvine under 1.5M with a pool";

  console.log(`\nQuery: ${q}\n`);

  const filters = parsePropertyQuery(q);
  console.log("Parsed filters:", JSON.stringify(filters), "\n");

  const rows = await searchActiveListings(filters, 1, 10);
  console.log(`Found ${rows.length} active listing(s):\n`);

  for (const r of rows) {
    console.log(formatCard(r));
    console.log("");
  }

  await closePool();
}

main().catch((err) => {
  console.error("Query failed:", err.message);
  process.exit(1);
});
