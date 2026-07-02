// parsePropertyQuery.ts
// Week 2 — Natural Language Property Search
//
// Turns a free-text real-estate query into a structured filter object that
// maps onto rets_property columns. This is PARSING ONLY — no database access.
// Running these filters against the database is Week 3.
//
// Field -> rets_property column mapping:
//   city     -> L_City           (exact match)
//   maxPrice -> L_SystemPrice    (<=)
//   beds     -> L_Keyword2       (>=)
//   baths    -> LM_Dec_3         (>=, supports half-baths)
//   sqft     -> LM_Int2_3        (>=)
//   type     -> L_Type_          (exact match)
//   pool     -> PoolPrivateYN    ("True")
//   hasView  -> ViewYN           ("True")
//   maxHoa   -> AssociationFee   (<=)

export interface PropertyFilters {
  city: string | null;
  maxPrice: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  type: string | null;
  pool: "True" | null;
  hasView: "True" | null;
  maxHoa: number | null;
}

// Ordered so more specific / multi-word types are tested before generic ones.
const TYPE_MAP: Array<[RegExp, string]> = [
  [/\bsingle[\s-]?family\b|\bsfr\b/i, "SingleFamilyResidence"],
  [/\btown[\s-]?(?:house|home)s?\b/i, "Townhouse"],
  [/\bcondo(?:s|minium|miniums)?\b/i, "Condominium"],
  [/\b(?:land|lots?|unimproved)\b/i, "UnimprovedLand"],
];

function toTitleCase(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function toNumber(raw: string, suffix?: string): number {
  let n = Number(raw.replace(/,/g, ""));
  const s = (suffix || "").toLowerCase();
  if (s === "k" || s === "thousand") n *= 1_000;
  if (s === "m" || s === "million") n *= 1_000_000;
  return Math.round(n);
}

export function parsePropertyQuery(query: string): PropertyFilters {
  const q = query.trim();

  // City: after "in / near / around", capture words until a boundary keyword,
  // a number, or punctuation. Handles multi-word cities (Newport Beach, San Diego).
  const cityMatch = q.match(
    /(?:^|\s)(?:in|near|around)\s+([a-z][a-z .'-]*?)(?=\s+(?:under|over|below|above|less|more|max|min|up|at|with|without|no|for|that|priced|around|between|and|near|<|>|\d)|[,.$]|$)/i
  );
  const city = cityMatch ? toTitleCase(cityMatch[1]) : null;

  // Pull HOA out first, then strip it so the price parser cannot grab the HOA number.
  let working = q;
  let maxHoa: number | null = null;
  const hoaMatch = working.match(
    /(?:hoa|association(?:\s+fee|\s+dues)?)\s*(?:fee)?\s*(?:under|below|max(?:imum)?|up to|of|<)?\s*\$?\s*([\d,]+)|\$?\s*([\d,]+)\s*(?:\/mo|per month|monthly|month)?\s*(?:in\s+)?hoa\b/i
  );
  if (hoaMatch) {
    maxHoa = Number((hoaMatch[1] ?? hoaMatch[2]).replace(/,/g, ""));
    working = working.replace(hoaMatch[0], " ");
  }

  // Max price: "under / below / up to / max / no more than / <"
  // The trailing lookahead stops it from mistaking "under 2000 sqft" for a price.
  const priceMatch = working.match(
    /(?:under|below|less than|up to|max(?:imum)?|no more than|<)\s*\$?\s*([\d,]+(?:\.\d+)?)\s*(k|m|thousand|million)?\b(?!\s*(?:sq|square|sf|bed|bath|ba\b|br\b|bd\b))/i
  );
  const maxPrice = priceMatch ? toNumber(priceMatch[1], priceMatch[2]) : null;

  // Bedrooms (minimum)
  const bedsMatch = q.match(/(\d+)\s*\+?\s*-?\s*(?:bedrooms|bedroom|beds|bed|br|bd)\b/i);
  const beds = bedsMatch ? Number(bedsMatch[1]) : null;

  // Bathrooms (minimum, supports half-baths e.g. 2.5)
  const bathsMatch = q.match(/(\d+(?:\.5)?)\s*\+?\s*-?\s*(?:bathrooms|bathroom|baths|bath|ba)\b/i);
  const baths = bathsMatch ? Number(bathsMatch[1]) : null;

  // Square footage (minimum)
  const sqftMatch = q.match(/([\d,]+)\s*(?:sq\.?\s*ft|sqft|square\s*feet|square\s*foot)\b/i);
  const sqft = sqftMatch ? Number(sqftMatch[1].replace(/,/g, "")) : null;

  // Property type
  let type: string | null = null;
  for (const [re, value] of TYPE_MAP) {
    if (re.test(q)) {
      type = value;
      break;
    }
  }

  // Pool / view, respecting simple negation ("without a pool" -> stays null)
  const poolNeg = /\b(?:no|without|don'?t\s+want|not?)\s+(?:a\s+)?pool/i.test(q);
  const pool = !poolNeg && /\bpool\b/i.test(q) ? "True" : null;

  const viewNeg = /\b(?:no|without|don'?t\s+want|not?)\s+(?:a\s+)?view/i.test(q);
  const hasView = !viewNeg && /\bview\b/i.test(q) ? "True" : null;

  return { city, maxPrice, beds, baths, sqft, type, pool, hasView, maxHoa };
}
