// email.ts — Week 11
// Email agent with a human-approval gate.
//
//   ./node_modules/.bin/tsx src/agents/email.ts "<userId>" "<message>"
//
// THE GUARDRAIL, STATED PLAINLY:
// There is exactly ONE call to transporter.sendMail in this file, it is
// reachable only from sendApprovedEmail(), and that function refuses any draft
// whose status is not "approved". A draft only becomes approved inside
// handleEmailMessage(), in response to a message the user sent AFTER seeing
// the full preview. No other path exists.
//
// The two-turn shape is why emailDrafts.ts persists to disk: each WhatsApp
// message is a separate process, so the draft the user approves in turn two
// must have survived from turn one.

import "dotenv/config";
import nodemailer from "nodemailer";
import {
  EmailDraft,
  buildDraft,
  approveDraft,
  cancelDraft,
  markSent,
  isSendable,
  classifyApproval,
  extractRecipient,
  renderPreview,
  marketReportBody,
  marketReportSubject,
} from "../lib/emailLib";
import { getPendingDraft, savePendingDraft, clearPendingDraft } from "../lib/emailDrafts";
import { marketStatsAgent } from "./marketStats";
import { AgentResult } from "../agentTypes";

// ── SMTP (the only place mail is actually sent) ────────────────────
let transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("EMAIL_USER and EMAIL_PASSWORD must be set in .env");
    }
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });
  }
  return transporter;
}

// STEP 2 of the flow. Guarded: an unapproved draft throws before any network
// call happens. This check is deliberately redundant with the caller's — the
// send path should be safe even if a future caller forgets.
export async function sendApprovedEmail(draft: EmailDraft): Promise<EmailDraft> {
  if (!isSendable(draft)) {
    throw new Error(
      `Refusing to send draft ${draft.id}: status is "${draft.status}", not "approved".`
    );
  }
  await getTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to: draft.to,
    subject: draft.subject,
    text: draft.body,
    html: draft.html,
  });
  return markSent(draft);
}

// ── Draft builders ─────────────────────────────────────────────────
// STEP 1 of the flow: compose, never send.
async function buildMarketReportDraft(
  message: string,
  recipient: string
): Promise<{ draft: EmailDraft } | { error: string }> {
  const marketQuery = message
  .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, " ")
  .replace(/\b(?:e-?mail|send|forward|to\s+me|please)\b/gi, " ")
  .replace(/\s+/g, " ")
  .trim()
  .replace(/^(?:the|a|an)\s+/i, "")
  .trim();
  const result = await marketStatsAgent(marketQuery);
  if (result.kind !== "market") {
    // marketStatsAgent returned a clarifying question ("which city?") rather
    // than stats. Pass it through instead of emailing an empty report.
    return { error: result.kind === "message" ? result.text : "I couldn't build that report." };
  }
  return {
    draft: buildDraft({
      to: recipient,
      subject: marketReportSubject(result.stats),
      body: marketReportBody(result.stats),
    }),
  };
}

// ── Agent entry point ──────────────────────────────────────────────
export async function emailAgent(message: string, userId: string): Promise<AgentResult> {
  const msg = (message || "").trim();
  const uid = (userId || "default").trim();

  const pending = getPendingDraft(uid);

  // A draft is waiting: this message is an approval decision, not a new request.
  if (pending) {
    const intent = classifyApproval(msg);

    if (intent === "reject") {
      clearPendingDraft(uid);
      return { kind: "message", text: "Cancelled — nothing was sent." };
    }

    if (intent === "approve") {
      try {
        const sent = await sendApprovedEmail(approveDraft(pending));
        savePendingDraft(uid, sent);
        clearPendingDraft(uid);
        return { kind: "message", text: `Sent to ${sent.to}.` };
      } catch (err: any) {
        return {
          kind: "message",
          text: `I couldn't send it: ${err.message}. The draft is still waiting — reply "send it" to try again or "cancel" to discard.`,
        };
      }
    }

    // Unclear. Do NOT send, do NOT discard — ask again. Guessing here is the
    // one failure mode this whole module exists to prevent.
    return {
      kind: "message",
      text:
        `You still have a draft to ${pending.to} waiting.\n\n` +
        'Reply "send it" to send, or "cancel" to discard.',
    };
  }

  // No pending draft: this is a new email request.
  const recipient = extractRecipient(msg);
  if (!recipient) {
    return {
      kind: "message",
      text: 'Who should I email? Include an address, e.g. "email the Pasadena market report to me@example.com".',
    };
  }

  const built = await buildMarketReportDraft(msg, recipient);
  if ("error" in built) return { kind: "message", text: built.error };

  savePendingDraft(uid, built.draft);
  return { kind: "message", text: renderPreview(built.draft) };
}

// ── CLI ─────────────────────────────────────────────────────────────
if (require.main === module) {
  (async () => {
    const userId = (process.argv[2] || "default").trim();
    const message = process.argv.slice(3).join(" ").trim();
    const result = await emailAgent(message, userId);
    const { formatResult } = await import("../lib/agentFormat");
    console.log(formatResult(result));
  })()
    .catch((err) => {
      console.error("Email agent failed:", err.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      const { closePool } = await import("../db/db");
      await closePool().catch(() => {});
    });
}