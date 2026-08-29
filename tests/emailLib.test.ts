// emailLib.test.ts — Week 11 validation
// The safety guardrail suite. These tests exist because sending email is
// irreversible: a bug here doesn't produce a wrong answer on screen, it puts
// mail in someone's inbox that can't be recalled. Pure logic — no SMTP, so
// running this suite cannot send anything.
import {
  isValidEmail,
  extractRecipient,
  classifyApproval,
  buildDraft,
  approveDraft,
  cancelDraft,
  markSent,
  isSendable,
  textToHtml,
  renderPreview,
  marketReportBody,
  marketReportSubject,
  EmailDraft,
} from "../src/lib/emailLib";
import { MarketStats } from "../src/agentTypes";

let passed = 0, failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { passed++; console.log(`PASS  ${name}`); }
  else { failed++; console.log(`FAIL  ${name}\n      want ${JSON.stringify(want)}\n      got  ${JSON.stringify(got)}`); }
}
function checkTrue(name: string, g: boolean) { check(name, g, true); }
function checkThrows(name: string, fn: () => unknown) {
  let threw = false;
  try { fn(); } catch { threw = true; }
  check(name, threw, true);
}

console.log("\n--- isValidEmail ---");
check("standard address", isValidEmail("leo@example.com"), true);
check("plus addressing", isValidEmail("leo+idx@example.com"), true);
check("subdomain", isValidEmail("leo@mail.example.co.uk"), true);
check("empty", isValidEmail(""), false);
check("no @", isValidEmail("leoexample.com"), false);
check("two @", isValidEmail("leo@@example.com"), false);
check("no domain dot", isValidEmail("leo@example"), false);
check("trailing dot in local", isValidEmail("leo.@example.com"), false);
check("double dot in local", isValidEmail("le..o@example.com"), false);
check("contains a space", isValidEmail("leo @example.com"), false);
check("newline injection attempt", isValidEmail("leo@example.com\nbcc:evil@x.com"), false);
check("one-letter TLD rejected", isValidEmail("leo@example.c"), false);

console.log("\n--- extractRecipient ---");
check("pulls address from a sentence",
  extractRecipient("email the Pasadena report to leo@example.com please"), "leo@example.com");
check("no address present", extractRecipient("email me the report"), null);
check("malformed address not returned", extractRecipient("send to leo@example"), null);

console.log("\n--- classifyApproval: approvals ---");
["yes", "Yes", "yep", "ok", "okay", "sure", "confirm", "approved", "send it", "send", "do it", "go ahead", "looks good", "lgtm", "ship it", "Send it now"].forEach((w) => {
  check(`"${w}" -> approve`, classifyApproval(w), "approve");
});

console.log("\n--- classifyApproval: rejections ---");
["no", "nope", "don't", "do not send", "cancel", "stop", "abort", "nevermind", "never mind", "discard", "wait", "hold on", "not yet"].forEach((w) => {
  check(`"${w}" -> reject`, classifyApproval(w), "reject");
});

console.log("\n--- classifyApproval: must NOT auto-approve ---");
// Every one of these would send an unauthorized email if misread as approval.
check("empty string", classifyApproval(""), "unclear");
check("whitespace", classifyApproval("   "), "unclear");
check("a question", classifyApproval("what does it say?"), "unclear");
check("unrelated message", classifyApproval("how's the market in Pasadena"), "unclear");
check("conditional praise", classifyApproval("looks good if you change the subject"), "unclear");
check("new request", classifyApproval("email it to someone else"), "unclear");
{
  // Conflict cases: any hesitation present means stop, regardless of the
  // affirmative word appearing first.
  check("'yes but wait' -> reject", classifyApproval("yes but wait"), "reject");
  check("'ok don't send' -> reject", classifyApproval("ok don't send"), "reject");
  check("'sure, cancel it' -> reject", classifyApproval("sure, cancel it"), "reject");
}

console.log("\n--- buildDraft ---");
{
  const d = buildDraft({ to: "leo@example.com", subject: "Report", body: "Body text" });
  check("new draft is ALWAYS pending_approval", d.status, "pending_approval");
  check("recipient preserved", d.to, "leo@example.com");
  check("subject preserved", d.subject, "Report");
  checkTrue("has an id", d.id.length > 0);
  checkTrue("has a createdAt", d.createdAt.length > 0);
  check("no sentAt on a new draft", d.sentAt, undefined);
  checkTrue("html generated", d.html.includes("Body text"));
}
checkThrows("invalid recipient rejected", () => buildDraft({ to: "nope", subject: "s", body: "b" }));
checkThrows("empty subject rejected", () => buildDraft({ to: "leo@example.com", subject: "  ", body: "b" }));
checkThrows("empty body rejected", () => buildDraft({ to: "leo@example.com", subject: "s", body: "  " }));

console.log("\n--- the send gate ---");
{
  const draft = buildDraft({ to: "leo@example.com", subject: "s", body: "b" });
  check("a pending draft is NOT sendable", isSendable(draft), false);

  const approved = approveDraft(draft);
  check("approval flips status", approved.status, "approved");
  check("an approved draft IS sendable", isSendable(approved), true);
  check("approving does not mutate the original", draft.status, "pending_approval");

  const sent = markSent(approved);
  check("sent status recorded", sent.status, "sent");
  checkTrue("sentAt recorded", !!sent.sentAt);
  check("a sent draft is NOT sendable again", isSendable(sent), false);
}
{
  const draft = buildDraft({ to: "leo@example.com", subject: "s", body: "b" });
  const cancelled = cancelDraft(draft);
  check("cancelled status", cancelled.status, "cancelled");
  check("a cancelled draft is NOT sendable", isSendable(cancelled), false);
  checkThrows("a cancelled draft cannot be approved", () => approveDraft(cancelled));
}
{
  // The critical one: skipping approval must be impossible, not merely
  // discouraged. markSent on a pending draft has to throw.
  const draft = buildDraft({ to: "leo@example.com", subject: "s", body: "b" });
  checkThrows("cannot send without approval", () => markSent(draft));
}
{
  const draft = buildDraft({ to: "leo@example.com", subject: "s", body: "b" });
  const sent = markSent(approveDraft(draft));
  checkThrows("cannot re-approve a sent draft (no duplicate sends)", () => approveDraft(sent));
  checkThrows("cannot cancel an already-sent draft", () => cancelDraft(sent));
  checkThrows("cannot send the same draft twice", () => markSent(sent));
}

console.log("\n--- textToHtml ---");
{
  const html = textToHtml("Line one\n\nLine two");
  checkTrue("wraps paragraphs", html.includes("<p>Line one</p>"));
  checkTrue("second paragraph present", html.includes("<p>Line two</p>"));
}
{
  const html = textToHtml("5 > 3 & <script>alert(1)</script>");
  checkTrue("escapes angle brackets", !html.includes("<script>"));
  checkTrue("escapes ampersand", html.includes("&amp;"));
  checkTrue("script tag neutralized", html.includes("&lt;script&gt;"));
}
check("single newline becomes br", textToHtml("a\nb").includes("<br>"), true);

console.log("\n--- renderPreview ---");
{
  const draft = buildDraft({ to: "leo@example.com", subject: "Pasadena report", body: "Median: $1,298,000" });
  const preview = renderPreview(draft);
  checkTrue("states it is NOT sent", preview.toLowerCase().includes("not sent"));
  checkTrue("shows the real recipient", preview.includes("leo@example.com"));
  checkTrue("shows the real subject", preview.includes("Pasadena report"));
  checkTrue("shows the body", preview.includes("Median: $1,298,000"));
  checkTrue("tells the user how to approve", preview.toLowerCase().includes("send it"));
  checkTrue("tells the user how to cancel", preview.toLowerCase().includes("cancel"));
}

console.log("\n--- market report rendering ---");
{
  const stats: MarketStats = {
    place: "Pasadena", soldCount: 441, rangeStart: "2026-03-31", rangeEnd: "2026-08-12",
    medianClose: 1298000, avgClose: 1659955, avgPpsf: 831, avgDom: 34, avgLtc: 103.2,
    activeInventory: 288,
    monthly: [
      { month: "2026-03", median: 1305000, count: 3 },
      { month: "2026-08", median: 1435000, count: 40 },
    ],
    directionPct: 10.0,
  };
  const subject = marketReportSubject(stats);
  checkTrue("subject names the place", subject.includes("Pasadena"));
  checkTrue("subject includes the median", subject.includes("$1,298,000"));

  const body = marketReportBody(stats);
  checkTrue("body has the sold count", body.includes("441 sold homes"));
  checkTrue("body has the date range", body.includes("2026-03-31 to 2026-08-12"));
  checkTrue("body has median", body.includes("$1,298,000"));
  checkTrue("body labels above-asking", body.includes("above asking on average"));
  checkTrue("body lists monthly rows", body.includes("2026-03: $1,305,000 (3 sold)"));
  checkTrue("body states direction", body.includes("up 10.0%"));
  checkTrue("body carries the not-advice disclaimer", body.toLowerCase().includes("not investment advice"));
}
{
  const stats: MarketStats = {
    place: "Nowhere", soldCount: 1, rangeStart: "2026-01-01", rangeEnd: "2026-01-01",
    medianClose: 100000, avgClose: 100000, avgPpsf: null, avgDom: null, avgLtc: null,
    activeInventory: 0, monthly: [], directionPct: null,
  };
  const body = marketReportBody(stats);
  checkTrue("null ppsf renders N/A", body.includes("Price per square foot: N/A"));
  checkTrue("null dom renders N/A", body.includes("Average days on market: N/A"));
  checkTrue("null ltc omits the ratio line", !body.includes("Sold-to-list"));
  checkTrue("no monthly section when empty", !body.includes("Monthly median"));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;