// emailLib.ts — Week 11
// Pure logic for the email agent: recipient validation, draft construction,
// approval-intent detection, and body rendering. No SMTP, no filesystem, no
// database — so every safety rule here is unit-testable without the risk of
// actually sending mail during a test run.
//
// THE CORE SAFETY IDEA:
// Sending is irreversible. Everything that can be decided BEFORE the network
// call lives here and is tested: is the address well-formed, is the draft
// complete, did the human actually approve. sendEmail.ts does nothing except
// hand an already-approved draft to nodemailer.

import { MarketStats } from "../agentTypes";

export type DraftStatus = "pending_approval" | "approved" | "sent" | "cancelled";

export interface EmailDraft {
  id: string;
  to: string;
  subject: string;
  body: string; // plain text
  html: string;
  status: DraftStatus;
  createdAt: string;
  sentAt?: string;
}

// ── Recipient validation ───────────────────────────────────────────
// Deliberately strict. A malformed address that slips through becomes a
// bounce or, worse, mail to the wrong person — neither is recoverable.
export function isValidEmail(address: string): boolean {
  const a = (address || "").trim();
  if (!a || a.length > 254) return false;
  if (/\s/.test(a)) return false;
  if ((a.match(/@/g) || []).length !== 1) return false;
  const [local, domain] = a.split("@");
  if (!local || !domain) return false;
  if (local.length > 64) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (!/^[A-Za-z0-9._%+-]+$/.test(local)) return false;
  if (!/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domain)) return false;
  if (domain.startsWith("-") || domain.includes("..")) return false;
  return true;
}

// Pull a recipient out of a natural-language request:
// "email the Pasadena report to leo@example.com"
export function extractRecipient(message: string): string | null {
  const m = (message || "").match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  if (!m) return null;
  return isValidEmail(m[0]) ? m[0] : null;
}

// ── Approval intent ────────────────────────────────────────────────
// The guardrail's hinge. This must be CONSERVATIVE: a false positive sends
// mail the user never authorized. Anything ambiguous ("maybe", "looks good
// but...") must NOT count as approval — when unsure, we ask again, which
// costs one message; guessing wrong costs an unretractable email.
const APPROVE_RE =
  /^(?:yes|yep|yeah|yup|ok|okay|sure|confirm(?:ed)?|approve[d]?|send(?:\s+it)?(?:\s+now)?|do\s+it|go\s+ahead|looks?\s+good|lgtm|ship\s+it)\b[\s.!]*$/i;

const REJECT_RE =
  /\b(?:no|nope|don'?t|do\s+not|cancel|stop|abort|nevermind|never\s+mind|discard|delete|wait|hold\s+on|not\s+yet)\b/i;

export type ApprovalIntent = "approve" | "reject" | "unclear";

export function classifyApproval(message: string): ApprovalIntent {
  const m = (message || "").trim();
  if (!m) return "unclear";

  // Rejection is checked FIRST and wins on conflict. "yes but wait" or
  // "ok don't send" must never resolve to approve — when the user's words
  // contain any hesitation at all, the safe reading is stop.
  if (REJECT_RE.test(m)) return "reject";
  if (APPROVE_RE.test(m)) return "approve";
  return "unclear";
}

// ── Draft construction ─────────────────────────────────────────────
export function makeDraftId(now = new Date()): string {
  return `draft_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface DraftInput {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

// Returns a draft that is ALWAYS pending_approval. There is no code path in
// this function that produces an approved draft — approval can only happen
// later, through approveDraft(), in response to an explicit human message.
export function buildDraft(input: DraftInput, now = new Date()): EmailDraft {
  if (!isValidEmail(input.to)) {
    throw new Error(`Invalid recipient address: "${input.to}"`);
  }
  const subject = (input.subject || "").trim();
  if (!subject) throw new Error("Draft subject cannot be empty");
  const body = (input.body || "").trim();
  if (!body) throw new Error("Draft body cannot be empty");

  return {
    id: makeDraftId(now),
    to: input.to.trim(),
    subject,
    body,
    html: input.html ?? textToHtml(body),
    status: "pending_approval",
    createdAt: now.toISOString(),
  };
}

// Transition a pending draft to approved. Refuses anything else: a draft that
// was already sent must not be re-approved into a duplicate send, and a
// cancelled draft must not be revived.
export function approveDraft(draft: EmailDraft): EmailDraft {
  if (draft.status !== "pending_approval") {
    throw new Error(`Cannot approve a draft with status "${draft.status}"`);
  }
  return { ...draft, status: "approved" };
}

export function cancelDraft(draft: EmailDraft): EmailDraft {
  if (draft.status === "sent") {
    throw new Error("Cannot cancel an email that has already been sent");
  }
  return { ...draft, status: "cancelled" };
}

export function markSent(draft: EmailDraft, now = new Date()): EmailDraft {
  if (draft.status !== "approved") {
    throw new Error(`Cannot send a draft with status "${draft.status}" — approval required`);
  }
  return { ...draft, status: "sent", sentAt: now.toISOString() };
}

// The single gate the sender consults. Kept as its own function so the rule
// is stated in exactly one place and tested directly.
export function isSendable(draft: EmailDraft): boolean {
  return draft.status === "approved";
}

// ── Rendering ──────────────────────────────────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function textToHtml(text: string): string {
  const paragraphs = (text || "")
    .trim()
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#222">\n${paragraphs}\n</div>`;
}

// Human-readable preview shown in chat before approval. This is what the user
// is actually approving, so it must show the real recipient and subject —
// never a summary of them.
export function renderPreview(draft: EmailDraft): string {
  return [
    "*Draft email — not sent yet*",
    "",
    `*To:* ${draft.to}`,
    `*Subject:* ${draft.subject}`,
    "",
    draft.body,
    "",
    'Reply "send it" to send, or "cancel" to discard.',
  ].join("\n");
}

// ── Market report body ─────────────────────────────────────────────
// Built from the same MarketStats the Week 5 agent already returns, so the
// email can never disagree with what the chat reply said.
export function marketReportSubject(stats: MarketStats): string {
  return `${stats.place} market report — median ${money(stats.medianClose)}`;
}

function money(n: number | null): string {
  return n != null ? `$${Math.round(n).toLocaleString()}` : "N/A";
}

export function marketReportBody(stats: MarketStats): string {
  const lines: string[] = [
    `${stats.place} market summary`,
    `${stats.soldCount} sold homes, ${stats.rangeStart} to ${stats.rangeEnd}`,
    "",
    `Median close price: ${money(stats.medianClose)}`,
    `Average close price: ${money(stats.avgClose)}`,
    `Price per square foot: ${money(stats.avgPpsf)}`,
    `Average days on market: ${stats.avgDom != null ? Math.round(stats.avgDom) : "N/A"}`,
  ];

  if (stats.avgLtc != null) {
    const posture = stats.avgLtc >= 100 ? "above asking on average" : "below asking on average";
    lines.push(`Sold-to-list ratio: ${stats.avgLtc.toFixed(1)}% (${posture})`);
  }
  lines.push(`Active listings currently: ${stats.activeInventory}`);

  if (stats.monthly.length > 0) {
    lines.push("", "Monthly median close price:");
    for (const m of stats.monthly) {
      lines.push(`  ${m.month}: ${money(m.median)} (${m.count} sold)`);
    }
  }

  if (stats.directionPct != null && stats.monthly.length >= 2) {
    const word = stats.directionPct >= 0 ? "up" : "down";
    const first = stats.monthly[0].month;
    const last = stats.monthly[stats.monthly.length - 1].month;
    lines.push(
      "",
      `Median ${word} ${Math.abs(stats.directionPct).toFixed(1)}% from ${first} to ${last}.`
    );
  }

  lines.push(
    "",
    "This report is generated from historical sold-transaction data and reflects " +
      "that data's date range. It is a data summary, not investment advice."
  );

  return lines.join("\n");
}