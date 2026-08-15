// ragLib.ts — Week 8
// Pure logic for the RAG pipeline: chunking source documents and ranking
// retrieved chunks by similarity. No OpenAI, no filesystem, no database, so
// it's fully unit-testable. I/O (reading knowledge/ docs, calling the
// embeddings API, calling the chat model) lives in rag.ts.

import { cosineSimilarity } from "./embeddings";

export interface DocSource {
  source: string;  // display name of the source document, e.g. "mls-field-definitions.md"
  content: string; // raw text of the document
}

export interface Chunk {
  source: string;
  chunk: string;
  chunkIndex: number; // position within the source doc — useful for citation/debugging
}

export interface IndexedChunk extends Chunk {
  embedding: number[];
}

export interface RetrievedChunk extends IndexedChunk {
  score: number;
}

// ── Chunking ────────────────────────────────────────────────────────
// Splits text into overlapping windows so a concept split across a sentence
// or table row boundary still has a chance of appearing whole in some chunk.
export function chunkText(text: string, chunkSize = 600, overlap = 100): string[] {
  const clean = text.trim();
  if (!clean) return [];
  if (chunkSize <= 0) throw new Error("chunkSize must be positive");
  if (overlap < 0) throw new Error("overlap cannot be negative");
  if (overlap >= chunkSize) throw new Error("overlap must be smaller than chunkSize");

  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length);
    chunks.push(clean.slice(start, end));
    if (end === clean.length) break;
    start += chunkSize - overlap;
  }
  return chunks;
}

// Chunk multiple named source documents at once, tagging each chunk with its
// source file and position so retrieved chunks can be cited.
export function chunkDocuments(docs: DocSource[], chunkSize = 600, overlap = 100): Chunk[] {
  const out: Chunk[] = [];
  for (const doc of docs) {
    const pieces = chunkText(doc.content, chunkSize, overlap);
    pieces.forEach((chunk, i) => {
      out.push({ source: doc.source, chunk, chunkIndex: i });
    });
  }
  return out;
}

// ── Retrieval ───────────────────────────────────────────────────────
// Ranks indexed chunks by cosine similarity to a query embedding and returns
// the top K with their scores attached, highest first.
export function rankChunks(
  queryEmbedding: number[],
  indexed: IndexedChunk[],
  topK = 4
): RetrievedChunk[] {
  return indexed
    .map((c) => ({ ...c, score: cosineSimilarity(queryEmbedding, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// ── Prompt assembly ─────────────────────────────────────────────────
// Builds the grounded prompt from retrieved chunks. Pure string assembly so
// it's testable without a live model call. Each chunk is tagged with its
// source so the model (and a human reviewer) can trace where an answer came
// from.
export function buildGroundedPrompt(query: string, retrieved: RetrievedChunk[]): string {
  const instructions =
    `Answer using only the context below. Real estate sources often use different ` +
    `names for the same concept — for example, "list-to-close ratio", ` +
    `"sale-to-list ratio", and "sold-to-list ratio" all refer to the identical ` +
    `close-price-to-list-price calculation. If the question's term is a synonym for ` +
    `a concept defined in the context, treat them as the same thing and answer ` +
    `directly and confidently — don't hedge, and don't say the specific term is ` +
    `missing just because the wording differs. Only say you don't have the ` +
    `information if the underlying concept itself, under any name, is absent from ` +
    `the context.`;

  if (retrieved.length === 0) {
    return `${instructions}\n\nContext:\n(no relevant context found)\n\nQuestion: ${query}`;
  }
  const context = retrieved.map((r) => `[${r.source}]\n${r.chunk}`).join("\n\n");
  return `${instructions}\n\nContext:\n${context}\n\nQuestion: ${query}`;
}