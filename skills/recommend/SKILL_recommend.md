---
name: recommend
description: Given a listing the user likes (by address or MLS id), find the top comparable active listings using a hybrid structured + semantic score, each with a price assessment vs sold comps.
---

# Recommendations

Use this skill when the user wants listings SIMILAR to a specific one they've seen
— "show me homes like 419 Tangelo", "find something similar to that first
listing", "more like 385 S Oakland Ave", "comparable homes to <address>".

Use `property-search` for filter-based searches, `semantic-search` for vibe
searches, and `market-stats` for market questions. Use THIS skill when the
request is anchored to ONE listing and asks for others like it.

This is the required path for "similar to X" requests. Do not use web sources.

## How to run

Use the `exec` tool. Replace TARGET with the address or MLS id the user named
(keep the quotes):

```bash
cd ~/Desktop/idx-property-ai-agent && ./node_modules/.bin/tsx db/recommend.ts "TARGET"
```

Return the command's printed output exactly as printed. If it says it couldn't
find the listing, relay that and ask for the full street address or MLS number.

## How it works

- Each recommendation gets a match score out of 100: up to 60 for structured
  similarity (price, bedrooms, city, square footage) and up to 40 for semantic
  similarity of the listing descriptions.
- Each recommendation also carries a price assessment vs recent sold comps in the
  same city and size range — "below comps", "in line with comps", or "above
  comps" — sourced from california_sold.

## Notes

- Candidates are drawn from the same city as the target listing.
- "Below comps" means the list price is under what comparable sold homes suggest;
  it is a data comparison, not investment advice.
- Comp figures come from a fixed sold-data snapshot, so they reflect that data's
  date range, and some size ranges may have few comps.
