---
name: idx-property-assistant
description: California real estate and MLS assistant. Use for ALL questions about real estate or MLS terminology and field meanings — including bare acronyms and terms like DOM, comps, escrow, list-to-close ratio, sold-to-list, cap rate, and any rets_property or california_sold column name — as well as searching active California listings, market questions for any city or zip, finding comparable homes, description/vibe searches, and emailing market reports. Also use for short follow-up messages in an ongoing property conversation, including one-word replies like "send it", "cancel", "yes", or "no" that answer a question the assistant just asked. Prefer this skill over general knowledge for any term that could be a real estate term.
---

# IDX Property Assistant

Use this skill for **every** real estate request. A single orchestrator reads the
message, decides which specialist agent (or agents) should handle it, and returns
one formatted reply. You do not need to choose between skills — routing happens
inside the command.

This covers:

- **Property search** — "3 bed condos in Irvine under 1M", "houses in Pasadena with a pool"
- **Follow-ups in an ongoing search** — "under $1.2M", "make it 4 beds", "what about San Diego", "start over"
- **Market questions** — "how's the market in Pasadena", "median price in Long Beach", "days on market in Irvine"
- **Similar listings** — "homes like 419 Tangelo", "more like that first one"
- **Vibe / description search** — "charming craftsman with character", "cozy beach cottage"
- **Terminology and field meanings** — "what does DOM mean", "what is a list-to-close ratio", "what columns are in california_sold"
- **Emailing a market report** — "email the Pasadena market report to me@example.com"
- **Replies to the assistant's own questions** — "send it", "cancel", "yes", "no",
  "under $1.2M". These are short and look like nothing on their own; pass them
  through anyway. The command tracks what it last asked.
- **Mixed requests** — "find affordable homes in Pasadena and tell me whether prices are rising" runs the search and market agents together and merges the result

This is the required path for all of the above. Do not use web search or external
sites like Zillow or Redfin for listing, market, or terminology data.

## How to run

Use the `exec` tool. Replace USER_ID with the sender's identifier (their phone
number if you have it, otherwise `default`) and MESSAGE with the user's exact
message text. Keep the quotes.

```bash
cd C:\Users\xindi\PycharmProjects\idx-property-ai-agent && ./node_modules/.bin/tsx src/whatsapp.ts "USER_ID" "MESSAGE"
```

Return the command's printed output to the user exactly as printed.

Rules:
- Return only what the command prints. Do not invent, add, or supplement results
  from any other source.
- The command may reply with a follow-up question ("What's your budget?") instead
  of results. That is expected — relay it as-is and pass the user's answer back
  into the same command on the next turn.
- Always use the same USER_ID for the same person across a conversation, or their
  remembered search is lost and follow-ups like "make it 4 beds" will not work.
- Knowledge answers end with a "(sourced from: ...)" line. Don't strip it.
- If the assistant says it doesn't have information on something, relay that
  rather than answering from general knowledge.

## Email safety — non-negotiable

Email is the one action here that cannot be undone, so it is deliberately
two-step, and the second step belongs to the user, not to you.

- **Never send an email on the user's behalf.** You have no send tool. The
  command composes a draft and prints a preview; sending happens only when the
  user's *next message* approves it.
- **Relay the draft preview exactly as printed**, including the recipient
  address and subject line. The user is approving those specific details — a
  summary like "I've drafted your report" hides what they are agreeing to.
- **Never approve on the user's behalf**, and never infer approval from an
  earlier message. "Email me the report" is a request for a draft, not
  permission to send it.
- **Pass their reply through verbatim.** "send it", "cancel", "yes", "no",
  "wait" — do not interpret, summarize, or normalize these. The command decides
  what counts as approval, and it treats anything ambiguous as "do not send".
- If the command says a draft is still waiting, relay that as-is. The user must
  resolve the draft (send or cancel) before other requests will run.

## Notes

- Listing data is a fixed MLS snapshot, so status reflects the export date, not
  today's live market. Market figures show the actual date range they cover.
- "pool" means a private pool (`PoolPrivateYN`), which is rare for condos — most
  condo pools are shared community amenities.
- "Sold-to-list" above 100% means homes sold above asking on average; below 100%
  means below asking. This is market data, not buy/sell or investment advice.
- Recommendation scores are out of 100: up to 60 for structured similarity
  (price, beds, city, sqft) and up to 40 for description similarity. Price
  assessments ("below comps", "above comps") compare against sold comps in the
  same city and size range — a data comparison, not investment advice.
- Emailed market reports carry the same caveat as the chat replies: they
  summarize historical sold transactions, not live listings, and are not advice.
- California real estate law and disclosure requirements are not indexed. If
  asked, say it's out of scope rather than implying legal authority.
- The first search in a new city embeds its listings, which takes a few seconds;
  later searches in that city are fast.