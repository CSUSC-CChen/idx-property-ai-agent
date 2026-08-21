// rag.ts — Week 8 (refactored for Week 9 in-process orchestration)
// Document-aware RAG. Reads knowledge/*.md, builds/caches a per-chunk
// embedding index on disk, retrieves the most relevant chunks for a
// question, and asks the model to answer grounded only in that context.
//
//   ./node_modules/.bin/tsx db/rag.ts "What does DOM mean?"
//
// WEEK 9 CHANGES:
// - main() -> exported ragAgent(question): takes input as a parameter and
//   RETURNS an AgentResult instead of console.log-ing, so orchestrate.ts can
//   call it in-process and merge its output.
// - The CLI entry point is guarded by `require.main === module`, so importing
//   this file no longer fires the script as an import side effect.

import fs from "fs";
import path from "path";
import crypto from "crypto";
import OpenAI from "openai";
import {
  chunkDocuments,
  rankChunks,
  buildGroundedPrompt,
  DocSource,
  IndexedChunk,
} from "../lib/ragLib";
import { embedText, embedBatch } from "../embeddings";
import { AgentResult } from "../agentTypes";

const KNOWLEDGE_DIR = path.join(__dirname, "..", "..", "knowledge");
const RAG_CACHE_FILE = path.join(__dirname, "..", "..", ".rag-index-cache.json");
const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 100;
const TOP_K = 4;
const EMBED_BATCH = 64;

let client: OpenAI | null = null;
function openai(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

// ── Load source documents ──────────────────────────────────────────
function loadKnowledgeDocs(): DocSource[] {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    throw new Error(`knowledge/ folder not found at ${KNOWLEDGE_DIR}`);
  }
  const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    throw new Error(`No .md files found in ${KNOWLEDGE_DIR}`);
  }
  return files.map((file) => ({
    source: file,
    content: fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8"),
  }));
}

// ── Chunk embedding cache ──────────────────────────────────────────
// Keyed by a hash of (source + chunk text) rather than (source + index), so
// editing a knowledge doc only re-embeds the chunks that actually changed.
type RagCache = Record<string, number[]>;

function loadRagCache(): RagCache {
  if (!fs.existsSync(RAG_CACHE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(RAG_CACHE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveRagCache(cache: RagCache) {
  fs.writeFileSync(RAG_CACHE_FILE, JSON.stringify(cache));
}

function chunkKey(source: string, chunk: string): string {
  return crypto.createHash("sha1").update(`${source}::${chunk}`).digest("hex");
}

// ── Build (or load from cache) the full embedded chunk index ──────────
async function buildIndex(): Promise<IndexedChunk[]> {
  const docs = loadKnowledgeDocs();
  const chunks = chunkDocuments(docs, CHUNK_SIZE, CHUNK_OVERLAP);

  const cache = loadRagCache();
  const needEmbedding = chunks.filter((c) => !cache[chunkKey(c.source, c.chunk)]);

  if (needEmbedding.length > 0) {
    for (let i = 0; i < needEmbedding.length; i += EMBED_BATCH) {
      const slice = needEmbedding.slice(i, i + EMBED_BATCH);
      const vecs = await embedBatch(slice.map((c) => c.chunk));
      slice.forEach((c, j) => {
        cache[chunkKey(c.source, c.chunk)] = vecs[j];
      });
    }
    saveRagCache(cache);
  }

  return chunks.map((c) => ({
    ...c,
    embedding: cache[chunkKey(c.source, c.chunk)],
  }));
}

// ── Generation ──────────────────────────────────────────────────────
async function generateAnswer(prompt: string): Promise<string> {
  const resp = await openai().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  return resp.choices[0]?.message?.content?.trim() ?? "I couldn't generate an answer.";
}

// ── Agent entry point ───────────────────────────────────────────────
export async function ragAgent(question: string): Promise<AgentResult> {
  const q = (question || "").trim();
  if (!q) {
    return { kind: "message", text: 'Ask a question, e.g. "What does DOM mean?"' };
  }

  const index = await buildIndex();
  const queryEmbedding = await embedText(q);
  const retrieved = rankChunks(queryEmbedding, index, TOP_K);

  if (retrieved.length === 0) {
    return { kind: "message", text: "Knowledge base is empty — check the knowledge/ folder." };
  }

  const answer = await generateAnswer(buildGroundedPrompt(q, retrieved));
  const sources = [...new Set(retrieved.map((r) => r.source))];
  return { kind: "knowledge", answer, sources };
}

// ── CLI ─────────────────────────────────────────────────────────────
// Guarded so `import { ragAgent } from "./rag"` does NOT run the script.
if (require.main === module) {
  (async () => {
    const result = await ragAgent(process.argv.slice(2).join(" ").trim());
    const { formatResult } = await import("./agentFormat");
    console.log(formatResult(result));
  })().catch((err) => {
    console.error("RAG query failed:", err.message);
    process.exit(1);
  });
}