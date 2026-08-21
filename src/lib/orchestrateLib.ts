// orchestrateLib.ts — Week 9
// Pure intent classification for the multi-agent orchestrator. No DB, no
// OpenAI, no side effects — so routing decisions are unit-testable without
// touching a database or spending an API call.
//
// WHY RULE-BASED, NOT AN LLM CALL:
// Routing runs on every single message. A model call would add latency and
// cost to every turn, and would make routing non-deterministic — the same
// message could route differently run to run, which is miserable to debug.
// These signals are specific enough that rules are both faster and testable.

import { Intent } from "../agentTypes";

// "Homes like 419 Tangelo", "similar to that one", "comparable properties"
const RECOMMEND_RE =
  /\b(?:similar\s+to|like\s+(?:that|this|the\s+(?:first|second|third|last)|\d+\s)|homes?\s+like|houses?\s+like|comparable|comps?\s+(?:to|for)|more\s+like)\b/i;

// "What does DOM mean", "define escrow", "what is a list-to-close ratio"
// NOTE the article distinction: "what is A list-to-close ratio" asks for a
// CONCEPT (knowledge), while "what is THE median price in Arcadia" asks for a
// NUMBER (market). Matching only the indefinite article keeps them apart.
const KNOWLEDGE_RE =
  /\b(?:what\s+(?:does|is|are)\s+(?:a|an|the)?\s*[\w-]+\s*(?:mean|stand\s+for)|what(?:'s|\s+is)\s+(?:a|an)\s+[\w-]+|define|definition\s+of|explain\s+(?:what|the\s+(?:term|concept))|what\s+columns|which\s+columns|terminology|what\s+fields)\b/i;

// Market-health questions: trends, medians, DOM, buy/sell timing
const MARKET_RE =
  /\b(?:market|median\s+price|average\s+price|price\s+per\s+(?:sq|square)|days\s+on\s+market|dom\b|sold[- ]to[- ]list|list[- ]to[- ]close|sale[- ]to[- ]list|prices?\s+(?:are\s+|is\s+|been\s+)?(?:rising|falling|going|trending|climbing|dropping|up|down)|good\s+time\s+to\s+(?:buy|sell)|comps?\b|inventory|appreciat)/i;

// Vibe/description language that structured filters can't express
const SEMANTIC_RE =
  /\b(?:charming|cozy|character|vibe|feel(?:s|ing)?\s+like|quaint|rustic|modern\s+open|bright|airy|serene|stunning|breathtaking|hidden\s+gem|fixer|turnkey|updated|renovated|craftsman|mid[- ]century|spanish\s+style|beachy|mountain\s+views?|something\s+(?:like|with))\b/i;

// Concrete structured constraints -> a filter search.
// Deliberately does NOT include a bare "in <City>" pattern: almost every market
// question names a city too, so that alternative made every market question
// look mixed. Search intent has to come from property nouns or constraints.
const SEARCH_RE =
  /\b(?:\d+\s*(?:\+)?\s*(?:bed|bd|br|bath|ba)\b|under\s+\$?[\d,.]|below\s+\$?[\d,.]|condo|townhome|townhouse|single\s+family|sfr\b|house|home|listing|property|properties|show\s+me|find\s+me|looking\s+for|search)/i;

export interface IntentSignals {
  recommend: boolean;
  knowledge: boolean;
  market: boolean;
  semantic: boolean;
  search: boolean;
}

export function detectSignals(message: string): IntentSignals {
  const m = message || "";
  return {
    recommend: RECOMMEND_RE.test(m),
    knowledge: KNOWLEDGE_RE.test(m),
    market: MARKET_RE.test(m),
    semantic: SEMANTIC_RE.test(m),
    search: SEARCH_RE.test(m),
  };
}

// Priority order matters and is deliberate:
//  1. recommend  — "homes like X" is unambiguous and would otherwise be
//                  swallowed by the generic search signal ("homes").
//  2. knowledge  — definitional questions often contain market vocabulary
//                  ("what is a list-to-close ratio" hits MARKET_RE too), so
//                  this must outrank market or every definition would route
//                  to the stats agent and return numbers instead of a meaning.
//  3. mixed      — search AND market together, the case that needs two agents.
//  4. market / semantic / search — single-signal routes.
export function classifyIntent(message: string): Intent {
  const msg = (message || "").trim();
  if (!msg) return "unknown";

  const s = detectSignals(msg);

  if (s.recommend) return "recommend";
  if (s.knowledge) return "knowledge";
  if (s.market && s.search) return "mixed";
  if (s.market) return "market";
  if (s.semantic) return "semantic";
  if (s.search) return "search";
  return "unknown";
}

// Pull an explicit listing reference out of a "similar to X" message so the
// recommend agent gets a clean target. Returns null when the user is referring
// back to a previous result ("more like that first one") rather than naming
// something — the orchestrator then falls back to session history.
export function extractListingRef(message: string): string | null {
  const m = message || "";

  // An MLS-style display id: 2+ letters followed by 6+ digits.
  const mls = m.match(/\b([A-Z]{2,}\d{6,})\b/);
  if (mls) return mls[1];

  // "similar to 419 Tangelo", "homes like 385 S Oakland Ave"
  const addr = m.match(
    /\b(?:similar\s+to|like|comparable\s+to|comps?\s+(?:to|for))\s+(\d+\s+[A-Za-z][A-Za-z0-9 .'-]*?)(?=\s*[?.,!]|\s+in\b|$)/i
  );
  if (addr) return addr[1].trim();

  return null;
}
