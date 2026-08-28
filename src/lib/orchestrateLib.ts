import { Intent } from "../agentTypes";

const RECOMMEND_RE =
  /\b(?:similar\s+to|like\s+(?:that|this|the\s+(?:first|second|third|last)|\d+\s)|homes?\s+like|houses?\s+like|comparable|comps?\s+(?:to|for)|more\s+like)\b/i;

const KNOWLEDGE_RE =
  /\b(?:what\s+(?:does|is|are)\s+(?:a|an|the)?\s*[\w-]+\s*(?:mean|stand\s+for)|what(?:'s|\s+is)\s+(?:a|an)\s+[\w-]+|define|definition\s+of|explain\s+(?:what|the\s+(?:term|concept))|what\s+columns|which\s+columns|terminology|what\s+fields)\b/i;

const MARKET_RE =
  /\b(?:market|median\s+price|average\s+price|price\s+per\s+(?:sq|square)|days\s+on\s+market|dom\b|sold[- ]to[- ]list|list[- ]to[- ]close|sale[- ]to[- ]list|prices?\s+(?:are\s+|is\s+|been\s+)?(?:rising|falling|going|trending|climbing|dropping|up|down)|good\s+time\s+to\s+(?:buy|sell)|comps?\b|inventory|appreciat)/i;

const SEMANTIC_RE =
  /\b(?:charming|cozy|character|vibe|feel(?:s|ing)?\s+like|quaint|rustic|modern\s+open|bright|airy|serene|stunning|breathtaking|hidden\s+gem|fixer|turnkey|updated|renovated|craftsman|mid[- ]century|spanish\s+style|beachy|mountain\s+views?|something\s+(?:like|with))\b/i;

const SEARCH_RE =
  /\b(?:\d+\s*(?:\+)?\s*(?:bed|bd|br|bath|ba)\b|under\s+\$?[\d,.]|below\s+\$?[\d,.]|condo|townhome|townhouse|single\s+family|sfr\b|house|home|listing|property|properties|show\s+me|find\s+me|looking\s+for|search)/i;

// Week 11: an explicit request to send something by email. Requires the word
// "email"/"e-mail" or a literal address — NOT a bare "send", because "send it"
// is an APPROVAL of an existing draft, not a request for a new one, and those
// are handled before classification ever runs.
const EMAIL_RE =
  /\b(?:e-?mail(?:\s+(?:me|it|this|that))?|mail\s+(?:me|it|this)\s+|forward\s+(?:me|it|this)\b)|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;

export interface IntentSignals {
  recommend: boolean;
  knowledge: boolean;
  market: boolean;
  semantic: boolean;
  search: boolean;
  email: boolean;
}

export function detectSignals(message: string): IntentSignals {
  const m = message || "";
  return {
    recommend: RECOMMEND_RE.test(m),
    knowledge: KNOWLEDGE_RE.test(m),
    market: MARKET_RE.test(m),
    semantic: SEMANTIC_RE.test(m),
    search: SEARCH_RE.test(m),
    email: EMAIL_RE.test(m),
  };
}

// Priority order, in full:
//  1. email      — "email the Pasadena market report" contains market AND
//                  search vocabulary. Delivery is the actual request; the
//                  report is just what's being delivered. Must outrank both.
//  2. recommend  — "homes like X" would otherwise be swallowed by "homes".
//  3. knowledge  — definitional questions carry market vocabulary
//                  ("what is a list-to-close ratio"), so this must beat market
//                  or every definition returns numbers instead of a meaning.
//  4. mixed      — search AND market together; the two-agent case.
//  5. single-signal routes.
export function classifyIntent(message: string): Intent {
  const msg = (message || "").trim();
  if (!msg) return "unknown";

  const s = detectSignals(msg);

  if (s.email) return "email";
  if (s.recommend) return "recommend";
  if (s.knowledge) return "knowledge";
  if (s.market && s.search) return "mixed";
  if (s.market) return "market";
  if (s.semantic) return "semantic";
  if (s.search) return "search";
  return "unknown";
}

export function extractListingRef(message: string): string | null {
  const m = message || "";
  const mls = m.match(/\b([A-Z]{2,}\d{6,})\b/);
  if (mls) return mls[1];
  const addr = m.match(
    /\b(?:similar\s+to|like|comparable\s+to|comps?\s+(?:to|for))\s+(\d+\s+[A-Za-z][A-Za-z0-9 .'-]*?)(?=\s*[?.,!]|\s+in\b|$)/i
  );
  if (addr) return addr[1].trim();
  return null;
}