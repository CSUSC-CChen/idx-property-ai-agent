---
name: rag
description: Answer conceptual, definitional, or field-meaning questions about real estate and MLS data by retrieving grounded context from indexed knowledge documents, rather than answering from general knowledge.
---

# RAG Knowledge Assistant

Use this skill when the user asks a conceptual or definitional question about
real estate terminology, MLS/database field meanings, or market context —
"what does DOM mean", "what is a list-to-close ratio", "what columns are in
california_sold", "how is DOM calculated".

Use `property-search` for finding listings, `market-stats` for live numbers
on a specific city, and `recommend` for "similar to X" requests. Use THIS
skill when the request is about a *concept or definition*, not a live query
against the databases.

This is the required path for conceptual/definitional questions. Do not
answer from general knowledge — always run the query so the answer is
grounded in the indexed documents.

## How to run

Use the `exec` tool. Replace QUESTION with what the user asked (keep the
quotes):

```bash
cd ~/Desktop/idx-property-ai-agent && ./node_modules/.bin/tsx db/rag.ts "QUESTION"
```

Return the command's printed output, including the "(sourced from: ...)"
line — don't strip it. If the knowledge base can't answer the question, the
model will say so rather than guessing; relay that as-is.

## How it works

- Four source documents live in `knowledge/`: the Real Estate Data Analyst
  Primer (terminology/glossary), the Trestle metadata documentation
  (RESO-standard field definitions), Week 5 market summaries (real
  `marketStatsAgent` output), and a schema reference doc covering IDX's own
  legacy field names not found in Trestle (`L_SystemPrice`, `L_Keyword2`,
  `LM_Dec_3`, `LM_Int2_3`, `L_City`, `L_Address`, etc.).
- Documents are chunked into overlapping windows (600 chars, 100 overlap),
  embedded, and cached on disk (`.rag-index-cache.json`) so unchanged chunks
  aren't re-embedded on every run.
- The top 4 most relevant chunks are retrieved by cosine similarity and
  passed to the model with an instruction to answer only from that context.

## Coverage notes

- `california_sold`'s columns map almost entirely to Trestle's RESO-standard
  names, so that table is fully covered by the Trestle doc.
- `rets_property`'s core search fields (`L_SystemPrice`, `L_Keyword2`,
  `LM_Dec_3`, `LM_Int2_3`, `L_City`, `L_Address`) use IDX's own legacy
  naming and are covered by the schema reference doc instead.
- California real estate law and disclosure requirements are **not**
  indexed — this is a known gap, not a missing file. Don't imply legal
  authority on those topics; say it's out of scope for this assistant.
- Market summaries are a point-in-time snapshot (currently Pasadena, San
  Pedro, San Francisco, and Beverly Hills, 2025-12-16 to 2026-06-15) — not
  live data. For a live number on a city not in that list, route to
  `market-stats` instead.
