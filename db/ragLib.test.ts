// ragLib.test.ts — Week 8 validation
// Covers chunking, retrieval ranking, and prompt assembly. Pure logic, no
// DB/OpenAI.
import {
  chunkText,
  chunkDocuments,
  rankChunks,
  buildGroundedPrompt,
  IndexedChunk,
} from "./ragLib";

let passed = 0, failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { passed++; console.log(`PASS  ${name}`); }
  else { failed++; console.log(`FAIL  ${name}\n      want ${JSON.stringify(want)}\n      got  ${JSON.stringify(got)}`); }
}
function checkTrue(name: string, g: boolean) { check(name, g, true); }

console.log("\n--- chunkText: basic sizing ---");
check("shorter than chunkSize -> 1 chunk, unchanged", chunkText("hello world", 600, 100), ["hello world"]);
check("empty string -> []", chunkText("", 600, 100), []);
check("whitespace-only -> []", chunkText("   \n\t  ", 600, 100), []);
{
  const text = "a".repeat(600);
  check("exact chunkSize length -> 1 chunk", chunkText(text, 600, 100).length, 1);
}
{
  const text = "a".repeat(601);
  check("one char over chunkSize -> 2 chunks", chunkText(text, 600, 100).length, 2);
}

console.log("\n--- chunkText: overlap correctness ---");
{
  const text = "0123456789".repeat(30); // 300 chars
  const chunks = chunkText(text, 100, 20);
  // step = chunkSize - overlap = 80; chunks start at 0, 80, 160, 240
  check("chunk count for 300 chars / size 100 / overlap 20", chunks.length, 4);
  check("first chunk starts at index 0", chunks[0], text.slice(0, 100));
  check("second chunk starts at step offset", chunks[1], text.slice(80, 180));
  checkTrue("consecutive chunks actually overlap", chunks[0].slice(-20) === chunks[1].slice(0, 20));
  check("last chunk reaches end of text", chunks[chunks.length - 1], text.slice(240, 300));
}
{
  // Text length exactly divisible by step shouldn't produce a trailing
  // duplicate/empty chunk.
  const text = "x".repeat(180); // step 80 -> starts 0, 80, 160(end at 260 clamped to 180)
  const chunks = chunkText(text, 100, 20);
  checkTrue("no empty trailing chunk", chunks.every((c) => c.length > 0));
  check("last chunk ends exactly at text length", chunks[chunks.length - 1].length <= 100, true);
}

console.log("\n--- chunkText: invalid args ---");
{
  let threw = false;
  try { chunkText("abc", 0, 0); } catch { threw = true; }
  checkTrue("chunkSize 0 throws", threw);
}
{
  let threw = false;
  try { chunkText("abc", 100, 100); } catch { threw = true; }
  checkTrue("overlap equal to chunkSize throws", threw);
}
{
  let threw = false;
  try { chunkText("abc", 100, 150); } catch { threw = true; }
  checkTrue("overlap greater than chunkSize throws", threw);
}
{
  let threw = false;
  try { chunkText("abc", 100, -1); } catch { threw = true; }
  checkTrue("negative overlap throws", threw);
}

console.log("\n--- chunkDocuments ---");
{
  const docs = [
    { source: "a.md", content: "x".repeat(150) },
    { source: "b.md", content: "short" },
  ];
  const chunks = chunkDocuments(docs, 100, 20);
  check("total chunk count across docs", chunks.length, 3); // a.md -> 2, b.md -> 1
  check("first doc's chunks tagged with correct source", chunks[0].source, "a.md");
  check("first doc's chunkIndex starts at 0", chunks[0].chunkIndex, 0);
  check("first doc's second chunk has chunkIndex 1", chunks[1].chunkIndex, 1);
  check("second doc's chunk resets chunkIndex to 0", chunks[2].source, "b.md");
  check("second doc's chunkIndex reset", chunks[2].chunkIndex, 0);
}
check("empty docs list -> []", chunkDocuments([], 100, 20), []);

console.log("\n--- rankChunks ---");
{
  const indexed: IndexedChunk[] = [
    { source: "a", chunk: "orthogonal", chunkIndex: 0, embedding: [0, 1] },
    { source: "b", chunk: "identical", chunkIndex: 0, embedding: [1, 0] },
    { source: "c", chunk: "partial", chunkIndex: 0, embedding: [1, 1] },
  ];
  const ranked = rankChunks([1, 0], indexed, 3);
  check("best match ranked first", ranked[0].source, "b");
  check("orthogonal match ranked last", ranked[2].source, "a");
  checkTrue("scores are sorted descending", ranked[0].score >= ranked[1].score && ranked[1].score >= ranked[2].score);
}
{
  const indexed: IndexedChunk[] = [
    { source: "a", chunk: "x", chunkIndex: 0, embedding: [1, 0] },
    { source: "b", chunk: "y", chunkIndex: 0, embedding: [0, 1] },
    { source: "c", chunk: "z", chunkIndex: 0, embedding: [1, 1] },
  ];
  check("topK limits result count", rankChunks([1, 0], indexed, 2).length, 2);
  check("topK larger than pool returns all", rankChunks([1, 0], indexed, 10).length, 3);
}
check("empty index -> []", rankChunks([1, 0], [], 4), []);

console.log("\n--- buildGroundedPrompt ---");
{
  const retrieved = [
    { source: "glossary.md", chunk: "DOM means days on market.", chunkIndex: 0, embedding: [], score: 0.9 },
  ];
  const prompt = buildGroundedPrompt("What does DOM mean?", retrieved);
  checkTrue("prompt includes the question", prompt.includes("What does DOM mean?"));
  checkTrue("prompt tags the source", prompt.includes("[glossary.md]"));
  checkTrue("prompt includes the chunk text", prompt.includes("DOM means days on market."));
  checkTrue("prompt instructs context-only answering", prompt.toLowerCase().includes("using only the context"));
  checkTrue("prompt instructs treating synonyms as equivalent", prompt.toLowerCase().includes("treat them as the same thing"));
}
{
  const prompt = buildGroundedPrompt("Unanswerable question", []);
  checkTrue("empty retrieval still includes the question", prompt.includes("Unanswerable question"));
  checkTrue("empty retrieval says no context found", prompt.includes("no relevant context found"));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;