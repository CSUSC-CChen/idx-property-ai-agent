// agentSearchSession.ts — Week 4 (refactored for Week 9)
// Multi-turn conversational property search.
//
//   ./node_modules/.bin/tsx db/agentSearchSession.ts "<userId>" "<message>"
//
// WEEK 9 CHANGES:
// - main() -> exported propertySearchAgent(message, userId), returning an
//   AgentResult instead of console.log-ing. The follow-up questions ("What's
//   your budget?") become { kind: "message" } results rather than side effects.
// - closePool() removed: the process owner closes the pool, not the agent.
// - CLI guarded by require.main === module so importing doesn't run it.
// - Card formatting moved to agentFormat.ts.

import { parsePropertyQuery } from "../lib/parsePropertyQuery";
import { searchActiveListings } from "../db/queries";
import { closePool } from "../db/db";
import {
  getSession,
  saveSession,
  clearSession,
  mergeFilters,
  isResetRequest,
} from "../sessions";
import { AgentResult } from "../agentTypes";

function money(n: number): string {
  return n != null ? `$${Number(n).toLocaleString()}` : "N/A";
}

// A short readable summary of what we're currently searching for, so the user
// can see the remembered state rather than having to trust it silently.
function describeFilters(f: ReturnType<typeof parsePropertyQuery>): string {
  const parts: string[] = [];
  if (f.beds) parts.push(`${f.beds}+ bed`);
  if (f.baths) parts.push(`${f.baths}+ bath`);
  if (f.type) parts.push(f.type);
  if (f.city && f.zip) parts.push(`in ${f.city} ${f.zip}`);
  else if (f.city) parts.push(`in ${f.city}`);
  else if (f.zip) parts.push(`in ${f.zip}`);
  if (f.maxPrice) parts.push(`under ${money(f.maxPrice)}`);
  if (f.sqft) parts.push(`${f.sqft}+ sqft`);
  if (f.pool) parts.push("private pool");
  if (f.hasView) parts.push("with a view");
  if (f.maxHoa) parts.push(`HOA under ${money(f.maxHoa)}`);
  return parts.join(", ");
}

export async function propertySearchAgent(
  message: string,
  userId: string
): Promise<AgentResult> {
  const msg = (message || "").trim();
  const uid = (userId || "default").trim();

  if (!msg) {
    return {
      kind: "message",
      text: 'What are you looking for? For example: "3 bed condos in Irvine under 1M".',
    };
  }

  if (isResetRequest(msg)) {
    clearSession(uid);
    return { kind: "message", text: "Starting fresh. What city are you looking in?" };
  }

  const session = getSession(uid);
  const incoming = parsePropertyQuery(msg);
  session.filters = mergeFilters(session.filters, incoming);

  // Follow-up questions — only before the first search. Once results have been
  // shown, every new message refines them instead of interrogating further.
  if (!session.hasSearched) {
    if (!session.filters.city && !session.filters.zip) {
      session.conversationStep = 1;
      saveSession(uid, session);
      return { kind: "message", text: "Which city or zip code are you looking in?" };
    }
    if (!session.filters.maxPrice) {
      session.conversationStep = 2;
      saveSession(uid, session);
      const loc = session.filters.city ?? `zip ${session.filters.zip}`;
      return { kind: "message", text: `Got it — ${loc}. What's your budget?` };
    }
    if (!session.filters.type && !session.filters.beds) {
      session.conversationStep = 3;
      saveSession(uid, session);
      return {
        kind: "message",
        text: "Any preferences — condo, townhome, or single family? And how many bedrooms?",
      };
    }
  }

  // Save merged filters BEFORE querying: if the DB call fails we must not lose
  // what the user just told us, or a transient error silently erases their
  // last message from the conversation.
  session.hasSearched = true;
  session.conversationStep += 1;
  saveSession(uid, session);

  const rows = await searchActiveListings(session.filters, 1, 5);

  session.lastResultIds = rows.map((r) => String(r.L_ListingID));
  saveSession(uid, session);

  return {
    kind: "listings",
    query: describeFilters(session.filters),
    filters: session.filters,
    listings: rows,
  };
}

if (require.main === module) {
  (async () => {
    const userId = (process.argv[2] || "default").trim();
    const message = process.argv.slice(3).join(" ").trim();
    const result = await propertySearchAgent(message, userId);
    const { formatResult } = await import("../lib/agentFormat");
    console.log(formatResult(result));
  })()
    .catch((err) => {
      console.error("Search failed:", err.message);
      process.exitCode = 1;
    })
    .finally(() => closePool().catch(() => {}));
}