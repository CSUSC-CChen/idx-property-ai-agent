// embeddings.ts — Week 6
// Semantic search building blocks: cosine similarity, the text we embed for a
// listing, OpenAI embedding calls, a disk-backed embedding cache, and ranking.
//
// WHY A DISK CACHE (not an in-memory list like the handbook):
// The skill runs a fresh exec process per message, so an in-memory embedding
// list would be rebuilt — and re-billed — on every single query. Embeddings are
// cached to disk keyed by listing ID, so each listing is embedded once and
// reused across queries and process restarts.
//
// The pure functions (cosineSimilarity, buildListingText, rankBySimilarity) have
// no side effects and are unit-tested. The OpenAI calls are validated live.

import "dotenv/config";
import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export const EMBED_MODEL = "text-embedding-3-small";

const CACHE_DIR = path.join(os.homedir(), ".openclaw", "idx-embeddings");
const CACHE_FILE = path.join(CACHE_DIR, "listings.json");

let client: OpenAI | null = null;
function openai(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

// ── Pure: cosine similarity ────────────────────────────────────────
// Returns a value in [-1, 1]; 1 = identical direction, 0 = orthogonal.
export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ── Pure: the text we embed for a listing ──────────────────────────
export interface EmbeddableRow {
  L_Type_?: string | null;
  L_City?: string | null;
  L_Keyword2?: number | string | null;
  LM_Dec_3?: number | string | null;
  LM_Int2_3?: number | string | null;
  YearBuilt?: number | string | null;
  L_SystemPrice?: number | string | null;
  L_Remarks?: string | null;
}

export function buildListingText(row: EmbeddableRow): string {
  // Remarks-only: embed the free-text listing description and let SQL own all
  // structured matching (city, price, beds, type). Embedding the structured
  // fields too made every listing's vector start with similar boilerplate
  // ("Condominium. in Irvine, CA. ..."), pulling scores together and diluting
  // the description signal. Pure remarks give a sharper, wider similarity spread.
  return (row.L_Remarks || "")
    .toString()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}

// ── Pure: rank candidates by similarity to a query vector ──────────
export function rankBySimilarity<T>(
  queryVec: number[],
  items: Array<{ vector: number[]; row: T }>,
  topK = 5
): Array<{ row: T; score: number }> {
  return items
    .map((it) => ({ row: it.row, score: cosineSimilarity(queryVec, it.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// ── IO: OpenAI embedding calls ─────────────────────────────────────
function clean(text: string): string {
  return (text || "").replace(/\n/g, " ").trim().slice(0, 8000) || " ";
}

export async function embedText(text: string): Promise<number[]> {
  const res = await openai().embeddings.create({
    model: EMBED_MODEL,
    input: clean(text),
  });
  return res.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai().embeddings.create({
    model: EMBED_MODEL,
    input: texts.map(clean),
  });
  return res.data.map((d) => d.embedding);
}

// ── IO: disk-backed cache ──────────────────────────────────────────
export type EmbeddingCache = Record<string, number[]>;

export function loadCache(): EmbeddingCache {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as EmbeddingCache;
  } catch {
    return {};
  }
}

export function saveCache(cache: EmbeddingCache): void {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
}

export function cacheSize(cache: EmbeddingCache): number {
  return Object.keys(cache).length;
}
