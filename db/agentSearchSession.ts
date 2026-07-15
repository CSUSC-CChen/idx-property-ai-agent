// agentSearchSession.ts — Week 4
// Multi-turn conversational property search.
//
// Replaces the Week 3 one-shot runner. Instead of treating every message as a
// fresh search, it remembers what the user has already told us, asks a
// follow-up question when key details are missing, and refines results as the
// conversation continues.
//
//   ./node_modules/.bin/tsx db/agentSearchSession.ts "<userId>" "<message>"
//
// Example flow:
//   "Find homes in Irvine"            -> "What's your budget?"
//   "Under $1.2M"                     -> "Condo, townhome, or single family?"
//   "Single family with 3 beds"       -> [returns listings]
//   "Actually make it 4 beds"         -> [refines and re-searches]

import "dotenv/config";
import { parsePropertyQuery } from "../skills/property-search/parsePropertyQuery";
import { searchActiveListings, ListingRow } from "./queries";
import { closePool } from "./db";
import {
  getSession,
  saveSession,
  clearSession,
  mergeFilters,
  isResetRequest,
  filterCount,
} from "./sessions";

function money(n: number): string {
  return n != null ? `$${Number(n).toLocaleString()}` : "N/A";
}

// WhatsApp renders *single asterisks* as bold.
function whatsappCard(r: ListingRow): string {
  const beds = r.beds ?? "?";
  const baths = r.baths ?? "?";
  const sqft = r.sqft != null ? `${Number(r.sqft).toLocaleString()} sqft` : "sqft N/A";
  const photos = r.PhotoCount != null ? `${r.PhotoCount} photos` : "no photos";
  const pool = r.PoolPrivateYN === "True" ? " · private pool" : "";
  return (
    `*${r.L_Address}, ${r.L_City} ${r.L_Zip}*\n` +
    `${money(r.price)} · ${beds} bd / ${baths} ba · ${sqft}\n` +
    `${r.type} · ${r.DaysOnMarket ?? "?"} days on market${pool} · ${photos}`
  );
}

// A short readable summary of what we're currently searching for, so the user
// can see the remembered state rather than having to trust it silently.
function describeFilters(f: ReturnType<typeof parsePropertyQuery>): string {
  const parts: string[] = [];
  if (f.beds) parts.push(`${f.beds}+ bed`);
  if (f.baths) parts.push(`${f.baths}+ bath`);
  if (f.type) parts.push(f.type);
  if (f.city) parts.push(`in ${f.city}`);
  if (f.maxPrice) parts.push(`under ${money(f.maxPrice)}`);
  if (f.sqft) parts.push(`${f.sqft}+ sqft`);
  if (f.pool) parts.push("private pool");
  if (f.hasView) parts.push("with a view");
  if (f.maxHoa) parts.push(`HOA under ${money(f.maxHoa)}`);
  return parts.join(", ");
}

async function main() {
  const userId = (process.argv[2] || "default").trim();
  const message = process.argv.slice(3).join(" ").trim();

  if (!message) {
    console.log("What are you looking for? For example: \"3 bed condos in Irvine under 1M\".");
    return;
  }

  // "Start over" wipes the remembered filters.
  if (isResetRequest(message)) {
    clearSession(userId);
    console.log("Starting fresh. What city are you looking in?");
    return;
  }

  const session = getSession(userId);
  const incoming = parsePropertyQuery(message);
  session.filters = mergeFilters(session.filters, incoming);

  // --- Follow-up questions -------------------------------------------------
  // Only ask before the first search. Once we've shown results, every new
  // message just refines them — no more interrogation.
  if (!session.hasSearched) {
    if (!session.filters.city) {
      session.conversationStep = 1;
      saveSession(userId, session);
      console.log("Which city are you looking in?");
      return;
    }
    if (!session.filters.maxPrice) {
      session.conversationStep = 2;
      saveSession(userId, session);
      console.log(`Got it — ${session.filters.city}. What's your budget?`);
      return;
    }
    if (!session.filters.type && !session.filters.beds) {
      session.conversationStep = 3;
      saveSession(userId, session);
      console.log(
        "Any preferences — condo, townhome, or single family? And how many bedrooms?"
      );
      return;
    }
  }

  // --- Search --------------------------------------------------------------
  // Save the merged filters BEFORE querying. If the database call fails, we
  // must not lose what the user just told us — otherwise a transient DB error
  // silently erases their last message from the conversation.
  session.hasSearched = true;
  session.conversationStep += 1;
  saveSession(userId, session);

  const rows = await searchActiveListings(session.filters, 1, 5);
  const summary = describeFilters(session.filters);

  session.lastResultIds = rows.map((r) => String(r.L_ListingID));
  saveSession(userId, session);

  if (rows.length === 0) {
    console.log(
      `No active listings match ${summary}.\n\n` +
        `Try loosening one thing — a higher budget, fewer beds, or dropping the pool. ` +
        `Say "start over" to begin a new search.`
    );
    await closePool();
    return;
  }

  const header = `Found ${rows.length} listing${rows.length === 1 ? "" : "s"} — ${summary}:`;
  const body = rows.map(whatsappCard).join("\n\n");
  const footer =
    filterCount(session.filters) < 9
      ? `\n\nWant to narrow it down? You can add things like a minimum square footage, a view, or an HOA cap.`
      : "";

  console.log(`${header}\n\n${body}${footer}`);
  await closePool();
}

main().catch((err) => {
  console.error("Search failed:", err.message);
  process.exit(1);
});
