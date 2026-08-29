# IDX Property AI Agent

A production-style multi-agent AI assistant for real estate, built on the
[OpenClaw](https://github.com/openclaw/openclaw) runtime. The assistant performs
natural-language MLS property search, market analytics, semantic search and
recommendations, RAG-based knowledge retrieval, and WhatsApp + email
communication over real California MLS data.

> **AI Agentic Engineer Internship — IDX Exchange · Summer 2026 · 12 Weeks**

---

## Overview

Six specialized agents sit behind a single orchestrator. The orchestrator
classifies each incoming message, routes it to the right agent — or fans it out
across several in parallel — and renders one unified reply back through WhatsApp.

```
User → WhatsApp → OpenClaw Runtime → orchestrate() → [agents] → MySQL / OpenAI → formatted reply → User
```

**Agents**

| Agent | Responsibility |
|---|---|
| `propertySearch` | Multi-turn filtered search over active listings, with session memory |
| `marketStats` | Market analytics from sold-transaction history |
| `semanticSearch` | Description/vibe matching via OpenAI embeddings |
| `recommend` | Hybrid similarity scoring with comp-validated pricing |
| `rag` | Grounded answers from indexed knowledge documents |
| `email` | Market report delivery behind a human-approval gate |

**Tech stack:** OpenClaw · TypeScript · MySQL · OpenAI (embeddings + chat) · WhatsApp · Nodemailer

---

## Architecture

Two design decisions shape most of the codebase.

**Pure logic separated from I/O.** Every agent splits into a `*Lib.ts` module of
pure functions and a runner that performs database, API, and filesystem work.
Scoring, parsing, chunking, ranking, formatting, and routing are all unit-tested
without a live database or a single API call.

**In-process orchestration, not subprocesses.** The orchestrator imports agents
as functions rather than shelling out to them. Mixed-intent queries run two
agents concurrently against one shared connection pool, and one place owns
shutdown — a design that also removes a whole class of concurrency bugs that
independent processes would introduce.

---

## Data

Two MySQL tables in a local schema (`idx_exchange`), imported from partial
IDX Exchange exports:

| Table | Rows | Role |
|---|---|---|
| `rets_property` | ~54K active listings, 130+ fields | Live search & discovery |
| `california_sold` | ~87K sold transactions, 46 fields | Historical comps & analytics |

**Join pattern:** `CAST(rets_property.L_ListingID AS UNSIGNED) = california_sold.ListingKey`,
or match on city + postal code for market-level analysis.

> MLS data is confidential and is **not** committed to this repository (see
> `.gitignore`). Dumps are imported into a local MySQL instance only.

**Indexing note:** `california_sold` ships without indexes. Adding
`(City, PropertyType, CloseDate)` takes market queries from full table scans to
sub-second lookups and is required for usable performance:

```sql
CREATE INDEX idx_cs_city ON california_sold(City);
CREATE INDEX idx_cs_city_type_date ON california_sold(City, PropertyType, CloseDate);
```

---

## Project Structure

```
idx-property-ai-agent/
├── src/
│   ├── agents/            # One callable agent per capability
│   │   ├── propertySearch.ts
│   │   ├── marketStats.ts
│   │   ├── semanticSearch.ts
│   │   ├── recommend.ts
│   │   ├── rag.ts
│   │   └── email.ts
│   ├── lib/               # Pure logic — no I/O, fully unit-tested
│   │   ├── parsePropertyQuery.ts
│   │   ├── marketStatsLib.ts
│   │   ├── recommendLib.ts
│   │   ├── ragLib.ts
│   │   ├── orchestrateLib.ts
│   │   ├── agentFormat.ts
│   │   ├── whatsappFormat.ts
│   │   ├── emailLib.ts
│   │   └── emailDrafts.ts
│   ├── db/                # Connection pool and parameterized queries
│   │   ├── db.ts
│   │   └── queries.ts
│   ├── agentTypes.ts      # Shared AgentResult union and domain types
│   ├── embeddings.ts      # OpenAI embeddings + disk-backed cache
│   ├── buildEmbeddings.ts # Pre-warm the embedding cache for a city
│   ├── sessions.ts        # File-backed multi-turn conversation state
│   ├── orchestrate.ts     # Intent routing across all agents
│   └── whatsapp.ts        # Channel entry point: safe errors, chunking
├── tests/                 # One suite per module
├── knowledge/             # RAG source documents
├── skills/                # OpenClaw SKILL.md descriptors
├── scripts/               # Tooling (test runner)
└── docs/                  # Architecture diagram, schema annotations
```

---

## Setup

### Prerequisites
- Node.js 22.22.3+ (24.15+ or 26 recommended)
- MySQL 8.0 running locally
- OpenClaw installed and onboarded
- An OpenAI API key with available billing credit
- A Gmail account with 2FA enabled (for App Password email sending)

### 1. Clone & install
```bash
git clone https://github.com/CSUSC-CChen/idx-property-ai-agent.git
cd idx-property-ai-agent
npm install
```

### 2. Import the MLS data
```bash
mysql -u root -p -e "CREATE DATABASE idx_exchange CHARACTER SET utf8mb4;"
mysql -u root -p idx_exchange
```
Then, inside the MySQL shell (`SOURCE` avoids the escaped-quote mangling that
piping the file through a shell can cause):
```sql
SET autocommit=0; SET unique_checks=0; SET foreign_key_checks=0;
SOURCE /path/to/rets_property.sql
SOURCE /path/to/california_sold.sql
COMMIT;
```
Then create the `california_sold` indexes shown above.

### 3. Configure environment
Copy `.env.example` to `.env` and fill in your values. **Never commit `.env`.**
```bash
cp .env.example .env
```

### 4. Deploy the skill
Copy the skill folder into your OpenClaw skills directory and restart the
gateway. Remove the destination first — copying into an existing directory
nests it instead of replacing it.

### 5. Connect WhatsApp
```bash
openclaw plugins install clawhub:@openclaw/whatsapp
openclaw channels login --channel whatsapp
# Scan the QR via WhatsApp → Settings → Linked Devices
```

---

## Environment Variables

See `.env.example`. Required keys:

```
OPENAI_API_KEY=
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=idx_exchange
EMAIL_USER=
EMAIL_PASSWORD=
```

---

## Running

```bash
# Full orchestrator (any query type)
npx tsx src/orchestrate.ts "<userId>" "<message>"

# WhatsApp entry point (adds safe error mapping and message chunking)
npx tsx src/whatsapp.ts "<userId>" "<message>"

# A single agent directly
npx tsx src/agents/marketStats.ts "how's the market in Pasadena?"

# Pre-warm the embedding cache so the first semantic search in a city is fast
npx tsx src/buildEmbeddings.ts "Irvine"
```

---

## Testing

```bash
npm test         # every suite in tests/
npm run typecheck
```

Suites cover query parsing, SQL construction, session merging, market
statistics, similarity scoring, RAG chunking and retrieval, intent routing,
output formatting, WhatsApp handling, and the email approval guardrail — all
without a live database or API calls.

---

## 12-Week Roadmap

| Week | Module | Status |
|------|--------|-------|
| 0 | Environment setup, MySQL import, WhatsApp config | ✅ |
| 1 | OpenClaw architecture: skills, sessions, tools, memory | ✅ |
| 2 | NL property search (query → structured filters) | ✅ |
| 3 | MySQL integration: parameterized queries, pagination | ✅ |
| 4 | Conversational agent: multi-turn session memory | ✅ |
| 5 | Market analytics over `california_sold` | ✅ |
| 6 | Embeddings & vector search (semantic matching) | ✅ |
| 7 | Recommendation engine (hybrid scoring) | ✅ |
| 8 | RAG pipeline (MLS field definitions, terminology) | ✅ |
| 9 | Multi-agent orchestration (coordinator routing) | ✅ |
| 10 | WhatsApp communication layer (end-to-end) | ✅ |
| 11 | Email agents with human-in-the-loop approval gate | ✅ |
| 12 | Capstone demo: full production assistant | 🚧 |

---

## Safety & Guardrails

- **No autonomous outbound actions.** Emails are composed as drafts, previewed
  in full — recipient and subject included — and sent only after an explicit
  approval message. A single send path exists in the codebase and it refuses
  any draft not marked approved. Ambiguous replies never count as approval.
- **No secrets in logs or version control.** Credentials live only in `.env`.
- **No bulk data export.** Result sets are capped at 50 rows per query; MLS
  dumps are never committed or exported.
- **Errors never leak internals.** The channel layer maps failures to
  user-facing messages; stack traces, file paths, and connection details go to
  server logs only.
- **Grounded answers only.** Knowledge responses cite their source documents
  and decline rather than guess when the knowledge base doesn't cover a topic.

---

## License

Internship coursework — not licensed for redistribution. MLS data is
confidential and property of IDX Exchange.