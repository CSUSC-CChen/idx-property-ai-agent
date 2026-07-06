---
name: property-search
description: Search active California MLS listings from a natural-language property request and return matching homes. Use for any home, condo, or property search.
---

# Property Search

Use this skill for ANY request to find homes, condos, townhomes, or other
properties in California — for example "3 bed condos in Irvine under 1M",
"houses in Pasadena with a pool", or "listings in San Diego". This is the
required path for property searches. Do not use web search or external sites
like Zillow or Redfin for listing data.

## How it works

The search reads the user's request, parses it into structured filters, and
queries the local MLS database (`rets_property`) for matching active listings.

## How to run a search

When the user asks for a property search, use the `exec` tool to run this
command, replacing QUERY with the user's exact request text (keep the quotes):

```bash
cd ~/Desktop/idx-property-ai-agent && ./node_modules/.bin/tsx db/agentSearch.ts "QUERY"
```

Then return the command's printed output to the user exactly as printed.

Rules:
- Return only what the command prints. Do not invent, add, or supplement
  listings from any other source.
- If it prints "No active listings matched", relay that and suggest loosening
  one filter (for example, drop the pool or raise the price).
- Never fall back to web search or external websites for property data.

## Notes

- The database is a fixed MLS snapshot, so listing status reflects the export
  date, not today's live market.
