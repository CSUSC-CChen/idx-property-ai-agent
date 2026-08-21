// orchestrate.ts — Week 9
// Single entry point across all five agents. Classifies intent, routes to the
// right agent (or several in parallel), and renders one reply.
//
//   ./node_modules/.bin/tsx db/orchestrate.ts "<userId>" "<message>"
//
// WHY IN-PROCESS FUNCTION CALLS, NOT exec SUBPROCESSES:
// The "mixed" case runs two agents concurrently. As separate processes each
// would open its own MySQL pool and its own embedding cache read — and the
// first to finish would tear down state the other still needs. Calling them as
// functions in one process means one pool, one cache, one place that owns
// shutdown, and Promise.all is genuinely cheap.

import "dotenv/config";
import { closePool } from "./db";
import { getSession } from "./sessions";
import { AgentResult, Intent } from "./agentTypes";
import { classifyIntent, extractListingRef } from "./orchestrateLib";
import { formatResult, formatCombined } from "./agentFormat";

import { propertySearchAgent } from "./agentSearchSession";
import { marketStatsAgent } from "./marketStats";
import { semanticAgent } from "./semanticSearch";
import { recommendAgent } from "./recommend";
import { ragAgent } from "./rag";

export async function orchestrate(message: string, userId: string): Promise<string> {
  const msg = (message || "").trim();
  const intent: Intent = classifyIntent(msg);

  switch (intent) {
    case "search":
      return formatResult(await propertySearchAgent(msg, userId));

    case "semantic":
      return formatResult(await semanticAgent(msg));

    case "market":
      return formatResult(await marketStatsAgent(msg));

    case "knowledge":
      return formatResult(await ragAgent(msg));

    case "recommend": {
      // Prefer an address/MLS id stated in the message. If the user is
      // referring back ("more like that first one"), fall back to the most
      // recent result in their session — this is what makes the follow-up
      // work without them repeating an address.
      const explicit = extractListingRef(msg);
      const ref = explicit ?? getSession(userId).lastResultIds?.[0] ?? null;
      if (!ref) {
        return "Which listing should I find similar homes to? Give me an address or MLS number, or run a search first.";
      }
      return formatResult(await recommendAgent(ref));
    }

    case "mixed": {
      // The one case that needs two agents. Both run against the same pool in
      // the same process; Promise.all overlaps their DB and API waits.
      const [listings, market] = await Promise.all([
        propertySearchAgent(msg, userId),
        marketStatsAgent(msg),
      ]);
      return formatCombined([listings, market]);
    }

    default:
      return (
        "I'm not sure how to help with that yet. You can ask me to:\n" +
        "• search listings — \"3 bed condos in Irvine under 1M\"\n" +
        "• describe a vibe — \"charming craftsman with character\"\n" +
        "• check a market — \"how's the market in Pasadena?\"\n" +
        "• find similar homes — \"homes like 419 Tangelo\"\n" +
        "• explain a term — \"what is a list-to-close ratio?\""
      );
  }
}

// ── CLI ─────────────────────────────────────────────────────────────
// The orchestrator OWNS the pool lifecycle: agents never close it, so the
// close happens exactly once, here, after everything has settled.
if (require.main === module) {
  (async () => {
    const userId = (process.argv[2] || "default").trim();
    const message = process.argv.slice(3).join(" ").trim();
    if (!message) {
      console.log('Usage: tsx db/orchestrate.ts "<userId>" "<message>"');
      return;
    }
    console.log(await orchestrate(message, userId));
  })()
    .catch((err) => {
      console.error("Orchestration failed:", err.message);
      process.exitCode = 1;
    })
    .finally(() => closePool().catch(() => {}));
}
