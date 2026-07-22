---
name: market-stats
description: Answer California housing MARKET questions for a city or zip code — median price, price per sqft, days on market, sold-to-list ratio, and recent trend — from the sold comps database.
---

# Market Stats

Use this skill for questions about a city's or zip code's housing MARKET or
CONDITIONS, rather than finding specific listings. For example: "what's the
average price per sqft in Pasadena", "how's the market in San Diego", "days on
market in Irvine", "market stats for 90012", "are homes selling above asking in
Arcadia", "median price in Long Beach".

Use the `property-search` skill instead when the user wants to SEE actual
listings ("show me 3 bed condos in Irvine"). Use THIS skill when they want to
understand the market.

This is the required path for market questions. Do not use web sources.

## How to run

Use the `exec` tool. Replace MESSAGE with the user's exact question (keep quotes):

```bash
cd ~/Desktop/idx-property-ai-agent && ./node_modules/.bin/tsx db/marketStats.ts "MESSAGE"
```

Return the command's printed output to the user exactly as printed. If it asks
which city or zip, relay that question and pass the user's answer back into the
command.

## Notes

- Accepts a city ("Pasadena"), a zip code ("90012"), or both ("Irvine 92602").
- Figures come from `california_sold` (historical sold comps). The output shows
  the actual date range covered, since the data is a fixed snapshot.
- This reports market data. It does not give buy/sell or investment advice.
- "Sold-to-list" above 100% means homes sold above asking on average; below
  100% means below asking.
