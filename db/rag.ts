// rag.ts — Week 8
// Document-aware RAG. Reads knowledge/*.md, builds/caches a per-chunk
// embedding index on disk, retrieves the most relevant chunks for a
// question, and asks the model to answer grounded only in that context.
//
//   ./node_modules/.bin/tsx db/rag.ts "What does DOM mean?"
//   ./node_modules/.bin/tsx db/rag.ts "What columns are in california_sold?"
//   ./node_modules/.bin/tsx db/rag.ts "What is a list-to-close ratio?"
//
// Reuses the Week 6 embedding helpers (embedText, embedBatch) and the
// disk-cache pattern from recommend.ts. Pure chunking/ranking logic lives in
// ragLib.ts and is unit-tested there.

import "dotenv/config";
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
} from "./ragLib";
import { embedText, embedBatch } from "./embeddings";

const KNOWLEDGE_DIR = path.join(__dirname, "..", "knowledge");
const RAG_CACHE_FILE = path.join(__dirname, "..", ".rag-index-cache.json");
const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 100;
const TOP_K = 4;
const EMBED_BATCH = 64;

const openai = new OpenAI();

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
// editing a knowledge doc only re-embeds the chunks that actually changed —
// it doesn't silently reuse a stale embedding just because a chunk still
// happens to land at the same index after an edit.
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
    console.log(`Embedding ${needEmbedding.length} new/changed chunks (of ${chunks.length} total)...`);
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
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  return resp.choices[0]?.message?.content?.trim() ?? "I couldn't generate an answer.";
}

async function main() {
  const question = process.argv.slice(2).join(" ").trim();
  if (!question) {
    console.log('Ask a question, e.g. "What does DOM mean?"');
    return;
  }

  const index = await buildIndex();
  const queryEmbedding = await embedText(question);
  const retrieved = rankChunks(queryEmbedding, index, TOP_K);

  if (retrieved.length === 0) {
    console.log("Knowledge base is empty — check the knowledge/ folder.");
    return;
  }

  const prompt = buildGroundedPrompt(question, retrieved);
  const answer = await generateAnswer(prompt);

  const sources = [...new Set(retrieved.map((r) => r.source))].join(", ");
  console.log(`${answer}\n\n(sourced from: ${sources})`);
}

main().catch((err) => {
  console.error("RAG query failed:", err.message);
  process.exit(1);
});
