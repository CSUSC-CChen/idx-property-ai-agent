// emailDrafts.ts — Week 11
// File-backed storage for pending email drafts.
//
// WHY THIS EXISTS (same reason as sessions.ts):
// Approval is a TWO-TURN conversation. The user asks for an email in one
// WhatsApp message and approves it in the next — but each message runs as a
// fresh exec process, so an in-memory draft would be gone before the approval
// ever arrives. Without persistence there is no way to approve anything, which
// would push us toward the one thing Week 11 forbids: sending immediately.
//
// Drafts are stored per user, one pending draft at a time. Asking for a second
// email while one is pending replaces the first — simpler than a queue, and it
// avoids the dangerous ambiguity of "send it" when two drafts are outstanding.

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { EmailDraft } from "./emailLib";

const DRAFT_DIR = path.join(os.homedir(), ".openclaw", "idx-email-drafts");

// Same filesystem-safe scheme as sessions.ts: "+18402319859" -> "_18402319859".
function draftPath(userId: string): string {
  const safe = (userId || "default").replace(/[^a-zA-Z0-9]/g, "_") || "default";
  return path.join(DRAFT_DIR, `${safe}.json`);
}

export function getPendingDraft(userId: string): EmailDraft | null {
  try {
    const raw = fs.readFileSync(draftPath(userId), "utf8");
    const draft = JSON.parse(raw) as EmailDraft;
    // A stored draft that is already sent or cancelled is history, not a
    // pending action. Treat it as absent so "send it" can never resend it.
    if (draft.status === "sent" || draft.status === "cancelled") return null;
    return draft;
  } catch {
    return null;
  }
}

export function savePendingDraft(userId: string, draft: EmailDraft): void {
  fs.mkdirSync(DRAFT_DIR, { recursive: true });
  fs.writeFileSync(draftPath(userId), JSON.stringify(draft, null, 2), "utf8");
}

export function clearPendingDraft(userId: string): void {
  try {
    fs.unlinkSync(draftPath(userId));
  } catch {
    // already gone
  }
}