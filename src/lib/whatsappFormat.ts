// whatsappFormat.ts — Week 10
// WhatsApp-specific output handling. Pure functions — no I/O, no channel
// calls — so every rule here is unit-testable.
//
// WHY THIS IS SEPARATE FROM agentFormat.ts:
// agentFormat turns AgentResults into text. This turns text into something
// WhatsApp will actually render correctly and accept: single-asterisk bold,
// a hard length ceiling, and error text that never leaks internals to a user.

// WhatsApp's per-message ceiling is 65,536 characters, but long walls of text
// read badly on a phone. We split well below that so replies stay scannable.
export const WHATSAPP_CHUNK_LIMIT = 3500;

// ── Markdown normalization ─────────────────────────────────────────
// WhatsApp uses *single* asterisks for bold, not the **double** asterisks of
// standard markdown. A model-authored or doc-sourced string can arrive with
// double asterisks, which WhatsApp renders literally — the user sees the
// asterisks instead of bold text.
export function toWhatsAppMarkdown(text: string): string {
  return (text || "")
    // **bold** -> *bold*  (do this before any single-asterisk handling)
    .replace(/\*\*(.+?)\*\*/gs, "*$1*")
    // __italic__ -> _italic_
    .replace(/__(.+?)__/gs, "_$1_")
    // ### Heading -> *Heading*  (WhatsApp has no headings)
    .replace(/^#{1,6}\s+(.+)$/gm, "*$1*");
}

// ── Chunking ───────────────────────────────────────────────────────
// Split on paragraph boundaries so a property card is never cut in half.
// Falls back to line boundaries, then to a hard slice, so this always
// terminates even on pathological input (one enormous unbroken string).
export function chunkMessage(text: string, limit = WHATSAPP_CHUNK_LIMIT): string[] {
  const body = (text || "").trim();
  if (!body) return [];
  if (body.length <= limit) return [body];
  if (limit <= 0) throw new Error("limit must be positive");

  const chunks: string[] = [];
  let remaining = body;

  while (remaining.length > limit) {
    const window = remaining.slice(0, limit);

    // Prefer a paragraph break, then a line break, then give up and hard-cut.
    let cut = window.lastIndexOf("\n\n");
    if (cut < limit * 0.5) cut = window.lastIndexOf("\n");
    if (cut < limit * 0.5) cut = limit;

    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

// ── Error messages ─────────────────────────────────────────────────
// A thrown error must never reach the user as a stack trace, a SQL fragment,
// or a file path. Those leak internals and mean nothing to someone asking
// about houses. We map the failures we can recognize to something actionable
// and fall back to a generic line for everything else.
export function safeErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const code = (err as { code?: string })?.code ?? "";

  // Database unreachable / refused / timed out. The "communication packets"
  // and "packets out of order" cases are mysql2 handshake failures — they read
  // as protocol gibberish to a user but mean the same thing: no database.
  if (
    /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|ER_ACCESS_DENIED|packets out of order|communication packets|ER_BAD_DB_ERROR|PROTOCOL_/i.test(
      `${code} ${raw}`
    )
  ) {
    return "I can't reach the listings database right now. Please try again in a moment.";
  }

  // OpenAI / embedding failures.
  if (/api key|rate limit|429|openai|insufficient_quota/i.test(raw)) {
    return "I'm having trouble with the search service right now. Please try again shortly.";
  }

  // Knowledge base missing or unreadable.
  if (/knowledge\/ folder not found|No \.md files found/i.test(raw)) {
    return "My reference documents aren't available right now, so I can't answer terminology questions. Property and market searches still work.";
  }

  return "Sorry, I hit an issue handling that. Please try again.";
}

// ── Full outbound pipeline ─────────────────────────────────────────
// Normalize markdown, then chunk. Returns an array because one agent reply
// may legitimately need more than one WhatsApp message.
export function prepareForWhatsApp(
  text: string,
  limit = WHATSAPP_CHUNK_LIMIT
): string[] {
  return chunkMessage(toWhatsAppMarkdown(text), limit);
}