# IDX Property AI Agent

A production-style multi-agent AI assistant for real estate, built on the
[OpenClaw](https://github.com/openclaw/openclaw) runtime. The assistant performs
natural-language MLS property search, market analytics, semantic recommendations,
RAG-based knowledge retrieval, and WhatsApp + email communication over 667K+
California MLS records.

> **AI Agentic Engineer Internship — IDX Exchange · Summer 2026 · 12 Weeks**

---

## Overview

This project wires a set of custom OpenClaw **skills** and **agents** over two real
MLS datasets, coordinated by an orchestrator that routes each incoming query to the
right specialized agent and returns a unified response through WhatsApp.

```
User → WhatsApp → OpenClaw Runtime → Orchestrator → [specialized agents] → MySQL → response → User
```

**Tech stack:** OpenClaw · TypeScript · Python · MySQL · OpenAI (embeddings + chat) · WhatsApp · Nodemailer

---

## Data

Two MySQL tables in a local schema (`idx_exchange`):

| Table | Rows | Role |
|---|---|---|
| `rets_property` | ~228K active listings, 130+ fields | Live search & discovery |
| `california_sold` | ~439K sold transactions, 46 fields | Historical comps & analytics |

**Join pattern:** `CAST(rets_property.L_ListingID AS UNSIGNED) = california_sold.ListingKey`,
or match on city + postal code for market-level analysis.

> The MLS data is confidential and is **not** committed to this repository
> (see `.gitignore`). Dumps are imported into a local MySQL instance only.

---

## Project Structure

```
idx-property-ai-agent/
├── skills/        # Custom OpenClaw skills (one folder per capability)
├── src/           # Query layers, embedding pipelines, agent logic (TS/Python)
├── docs/          # Architecture diagram, schema annotations, design notes
├── .env.example   # Template for required environment variables (no real keys)
└── README.md
```

OpenClaw discovers any skill whose `SKILL.md` lives under a configured workspace
root, so this repo is used as the agent **workspace** — the OpenClaw runtime itself
is installed separately and is not part of this repo.

---

## Setup

### Prerequisites
- Node.js (v20+) and npm
- Python 3.10+
- MySQL (running locally)
- OpenClaw installed (`npm install -g openclaw`, then `openclaw onboard`)
- An OpenAI API key with available billing credit

### 1. Clone & install
```bash
git clone https://github.com/CSUSC-CChen/idx-property-ai-agent.git
cd idx-property-ai-agent
npm install                # if/when package.json is added
```

### 2. Python environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install pandas openai mysql-connector-python sqlalchemy scikit-learn numpy
```

### 3. Import the MLS data
```bash
mysql -u root -p -e "CREATE DATABASE idx_exchange CHARACTER SET utf8mb4;"
mysql -u root -p idx_exchange < rets_property.sql      # ~228K rows; FULLTEXT index takes time
mysql -u root -p idx_exchange < california_sold.sql    # ~439K rows
```

### 4. Configure environment
Copy `.env.example` to `.env` and fill in your values. **Never commit `.env`.**
```bash
cp .env.example .env
```

### 5. Connect WhatsApp
```bash
openclaw channels login --channel whatsapp
# Scan the QR via WhatsApp → Settings → Linked Devices
```

---

## Environment Variables

See `.env.example`. Required keys:

```
OPENAI_API_KEY=
MYSQL_HOST=localhost
MYSQL_USER=idx_user
MYSQL_PASSWORD=
MYSQL_DATABASE=idx_exchange
EMAIL_USER=
EMAIL_PASSWORD=
```

---

## 12-Week Roadmap

| Week | Module | Status |
|------|--------|--------|
| 0 | Environment setup, MySQL import, WhatsApp config | ⬜ |
| 1 | OpenClaw architecture: skills, sessions, tools, memory | ⬜ |
| 2 | NL property search (query → structured filters) | ⬜ |
| 3 | MySQL integration: parameterized queries, pagination | ⬜ |
| 4 | Conversational agent: multi-turn session memory | ⬜ |
| 5 | Market analytics over `california_sold` | ⬜ |
| 6 | Embeddings & vector search (semantic matching) | ⬜ |
| 7 | Recommendation engine (hybrid scoring) | ⬜ |
| 8 | RAG pipeline (MLS field definitions, terminology) | ⬜ |
| 9 | Multi-agent orchestration (coordinator routing) | ⬜ |
| 10 | WhatsApp communication layer (end-to-end) | ⬜ |
| 11 | Email agents with human-in-the-loop approval gate | ⬜ |
| 12 | Capstone demo: full production assistant | ⬜ |

---

## Safety & Guardrails

This project follows the program's non-negotiable safety rules:

- **No autonomous outbound actions.** Emails are drafted, previewed, and require
  explicit confirmation before sending.
- **No secrets in logs or version control.** Credentials live only in `.env`.
- **No bulk data export.** Query result sets are capped (≤50 rows per query); full
  MLS dumps are never committed or exported.
- **Human oversight** on every destructive or outbound operation.

---

## License

Internship coursework — not licensed for redistribution. MLS data is confidential
and property of IDX Exchange.
