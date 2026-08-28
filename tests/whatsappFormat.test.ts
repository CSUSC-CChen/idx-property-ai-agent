// whatsappFormat.test.ts — Week 10 validation
// Covers the WhatsApp output pipeline: markdown normalization, message
// chunking, and safe error mapping. Pure logic — no DB, no OpenAI, no channel.
import {
  toWhatsAppMarkdown,
  chunkMessage,
  safeErrorMessage,
  prepareForWhatsApp,
  WHATSAPP_CHUNK_LIMIT,
} from "../src/lib/whatsappFormat";

let passed = 0, failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { passed++; console.log(`PASS  ${name}`); }
  else { failed++; console.log(`FAIL  ${name}\n      want ${JSON.stringify(want)}\n      got  ${JSON.stringify(got)}`); }
}
function checkTrue(name: string, g: boolean) { check(name, g, true); }

console.log("\n--- toWhatsAppMarkdown ---");
check("double asterisks become single", toWhatsAppMarkdown("**Pasadena market**"), "*Pasadena market*");
check("existing single asterisks untouched", toWhatsAppMarkdown("*Pasadena market*"), "*Pasadena market*");
check("double underscore becomes single", toWhatsAppMarkdown("__emphasis__"), "_emphasis_");
check("heading becomes bold", toWhatsAppMarkdown("## Market Summary"), "*Market Summary*");
check("h1 becomes bold", toWhatsAppMarkdown("# Title"), "*Title*");
check("multiple bolds on one line", toWhatsAppMarkdown("**a** and **b**"), "*a* and *b*");
check("bold spanning a newline", toWhatsAppMarkdown("**line one\nline two**"), "*line one\nline two*");
check("empty string safe", toWhatsAppMarkdown(""), "");
{
  // A real market reply already uses WhatsApp syntax — it must survive intact.
  const real = "*Pasadena market* — 441 sold homes\n\nMedian close: $1,298,000";
  check("real agent output passes through unchanged", toWhatsAppMarkdown(real), real);
}

console.log("\n--- chunkMessage: basics ---");
check("empty -> []", chunkMessage(""), []);
check("whitespace only -> []", chunkMessage("   \n  "), []);
check("short text -> single chunk", chunkMessage("hello"), ["hello"]);
{
  const text = "x".repeat(WHATSAPP_CHUNK_LIMIT);
  check("exactly at limit -> one chunk", chunkMessage(text).length, 1);
}
{
  const text = "x".repeat(WHATSAPP_CHUNK_LIMIT + 1);
  check("one over limit -> two chunks", chunkMessage(text).length, 2);
}

console.log("\n--- chunkMessage: boundaries ---");
{
  // Paragraph-separated cards must not be split mid-card.
  const card = "419 Tangelo, Irvine 92618\n  $789,921 · 2 bd / 2 ba";
  const text = Array(10).fill(card).join("\n\n");
  const chunks = chunkMessage(text, 200);
  checkTrue("splits into multiple chunks", chunks.length > 1);
  checkTrue(
    "no chunk starts mid-card",
    chunks.every((c) => c.startsWith("419 Tangelo"))
  );
  checkTrue("every chunk within limit", chunks.every((c) => c.length <= 200));
}
{
  // No paragraph breaks available — fall back to line breaks.
  const text = Array(40).fill("a line of text here").join("\n");
  const chunks = chunkMessage(text, 120);
  checkTrue("line-break fallback still chunks", chunks.length > 1);
  checkTrue("chunks respect the limit", chunks.every((c) => c.length <= 120));
}
{
  // Pathological: one unbroken string with nowhere good to cut. Must still
  // terminate rather than looping forever looking for a boundary.
  const text = "y".repeat(1000);
  const chunks = chunkMessage(text, 100);
  check("hard-cut fallback chunk count", chunks.length, 10);
  checkTrue("all chunks within limit", chunks.every((c) => c.length <= 100));
}
{
  // Content must be preserved across the split, not silently dropped.
  const text = Array(6).fill("paragraph body text").join("\n\n");
  const chunks = chunkMessage(text, 60);
  const rejoined = chunks.join("\n\n");
  check("paragraph count preserved", rejoined.split("paragraph body text").length - 1, 6);
}
{
  let threw = false;
  try { chunkMessage("abc", 0); } catch { threw = true; }
  checkTrue("zero limit throws rather than looping", threw);
}

console.log("\n--- safeErrorMessage ---");
{
  const e: any = new Error("connect ECONNREFUSED 127.0.0.1:3306");
  e.code = "ECONNREFUSED";
  const msg = safeErrorMessage(e);
  checkTrue("db error is user-facing", msg.includes("listings database"));
  checkTrue("db error leaks no host or port", !msg.includes("127.0.0.1") && !msg.includes("3306"));
}
{
  const msg = safeErrorMessage(new Error("Got timeout reading communication packets"));
  checkTrue("packet timeout maps to db message", msg.includes("listings database"));
}
{
  const msg = safeErrorMessage(new Error("429 rate limit exceeded"));
  checkTrue("rate limit maps to search service", msg.includes("search service"));
}
{
  const msg = safeErrorMessage(new Error("No API key found for provider openai"));
  checkTrue("missing api key maps to search service", msg.includes("search service"));
  checkTrue("api key error does not say 'api key'", !msg.toLowerCase().includes("api key"));
}
{
  const msg = safeErrorMessage(new Error("knowledge/ folder not found at C:/repo/knowledge"));
  checkTrue("missing knowledge dir explains the limit", msg.includes("reference documents"));
  checkTrue("does not leak the filesystem path", !msg.includes("C:/repo"));
}
{
  const msg = safeErrorMessage(new Error("Cannot read properties of undefined (reading 'foo')"));
  check("unknown error falls back to generic", msg, "Sorry, I hit an issue handling that. Please try again.");
}
{
  const msg = safeErrorMessage("just a string");
  checkTrue("non-Error input handled", msg.length > 0);
}
check("null input handled", safeErrorMessage(null), "Sorry, I hit an issue handling that. Please try again.");
{
  // A stack trace must never survive into user-facing text.
  const e = new Error("boom");
  e.stack = "Error: boom\n    at Object.<anonymous> (C:\\repo\\src\\db\\db.ts:12:3)";
  const msg = safeErrorMessage(e);
  checkTrue("stack trace never leaks", !msg.includes("db.ts") && !msg.includes("at Object"));
}

console.log("\n--- prepareForWhatsApp ---");
{
  const out = prepareForWhatsApp("**Bold** heading\n\nbody");
  check("normalizes then chunks", out, ["*Bold* heading\n\nbody"]);
}
{
  const long = Array(20).fill("**Card Title**\nsome details here").join("\n\n");
  const out = prepareForWhatsApp(long, 200);
  checkTrue("long input yields multiple chunks", out.length > 1);
  checkTrue("no double asterisks survive", out.every((c) => !c.includes("**")));
}
check("empty input -> []", prepareForWhatsApp(""), []);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;