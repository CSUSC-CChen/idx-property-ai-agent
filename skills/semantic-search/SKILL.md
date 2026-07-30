---
name: semantic-search
description: Find listings by DESCRIPTION or vibe rather than exact filters — "charming craftsman with character", "cozy beach cottage", "bright modern open-concept" — using semantic similarity over listing descriptions.
---

# Semantic Search

Use this skill when the user describes the FEEL, STYLE, or CHARACTER of a home in
words that are not simple filters — for example: "charming craftsman with
character and mountain views", "a cozy cottage near the beach", "bright modern
open-concept condo", "something with old-world charm". These describe the listing
DESCRIPTION, which structured filters cannot capture.

Use `property-search` instead when the request is all concrete filters ("3 bed
condos in Irvine under 1M"). Use `market-stats` for market questions. Use THIS
skill when the request is about vibe, style, or description.

This is the required path for descriptive/semantic searches. Do not use web
sources.

## How to run

Use the `exec` tool. Replace QUERY with the user's exact description (keep quotes):

```bash
cd ~/Desktop/idx-property-ai-agent && ./node_modules/.bin/tsx db/semanticSearch.ts "QUERY"
```

Return the command's printed output to the user exactly as printed. Each result
shows a "match: N%" — the semantic closeness of that listing to their
description.

## Notes

- Any concrete filters in the request (a city, a price cap, bedrooms) narrow the
  pool first, then descriptions are ranked by meaning. Including a city gives the
  best results and keeps it fast.
- The first search in a new city embeds its listings (a one-time step that may
  take a few seconds); later searches in that city are instant.
- Results rank by description similarity, so a strong match on style may not meet
  every literal constraint — it is a "closest in spirit" search, not a filter.
