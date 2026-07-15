---
name: property-search
description: Search active California MLS listings from a natural-language property request and return matching homes. Use for any home, condo, or property search, and for follow-up messages that refine an ongoing search.
---

# Property Search (Conversational)

Use this skill for ANY request to find homes, condos, townhomes, or other
properties in California — for example "3 bed condos in Irvine under 1M",
"houses in Pasadena with a pool", or "listings in San Diego".

Also use it for FOLLOW-UP messages in an ongoing property conversation, even
when they are short and would not look like a search on their own — for
example "under $1.2M", "make it 4 beds", "what about San Diego", "with a
view", or "start over". The search remembers the conversation, so these
messages refine the previous search rather than starting a new one.

This is the required path for property searches. Do not use web search or
external sites like Zillow or Redfin for listing data.

## How to run a search

Use the `exec` tool to run this command. Replace MESSAGE with the user's exact
message text, and USER_ID with the sender's identifier (their phone number if
you have it; otherwise use `default`). Keep the quotes.

```bash
cd ~/Desktop/idx-property-ai-agent && ./node_modules/.bin/tsx db/agentSearchSession.ts "USER_ID" "MESSAGE"
```

Return the command's printed output to the user exactly as printed.

Rules:
- Return only what the command prints. Do not invent, add, or supplement
  listings from any other source.
- The command may reply with a follow-up question (for example "What's your
  budget?") instead of listings. That is expected — relay the question as-is
  and pass the user's answer back into the same command on the next turn.
- Always use the same USER_ID for the same person across the conversation, so
  their remembered search is not lost.
- Never fall back to web search or external websites for property data.

## Notes

- The database is a fixed MLS snapshot, so listing status reflects the export
  date, not today's live market.
- "pool" maps to a private pool (`PoolPrivateYN`), which is rare for condos —
  most condo pools are shared community amenities.
- The user can say "start over" to clear their remembered search.
