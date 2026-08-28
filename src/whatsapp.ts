// whatsapp.ts — Week 10
// The WhatsApp entry point. Wraps the orchestrator with the things a chat
// channel needs that a CLI does not: guaranteed-safe error output, WhatsApp
// markdown, and message-length chunking.
//
//   ./node_modules/.bin/tsx src/whatsapp.ts "<userId>" "<message>"
//
// ARCHITECTURE NOTE — where the typing indicator lives:
// The handbook's sample calls sendTypingIndicator(userId) here. That assumes
// the app owns the channel connection. Under OpenClaw it doesn't: the WhatsApp
// plugin owns presence and sends typing automatically while a run is active,
// configured via agents.defaults.typingMode and typingIntervalSeconds. Trying
// to send presence from this process would have no channel to send it on. So
// typing is configuration, not code, and this handler covers what OpenClaw
// does NOT do for us: deciding what the user sees when something breaks.
//
// WHY A SEPARATE ENTRY POINT FROM orchestrate.ts:
// orchestrate.ts is the CLI. When it fails, printing a stack trace is correct
// — a developer is reading it. When WhatsApp fails, a stack trace is worse
// than useless: it leaks file paths and database internals to someone who
// asked about houses. Same core, different failure contract.

import { orchestrate } from "./orchestrate";
import { closePool } from "./db/db";
import { prepareForWhatsApp, safeErrorMessage } from "./lib/whatsappFormat";

export interface WhatsAppReply {
  // One agent reply can exceed WhatsApp's practical message length, so this
  // is always an array. Callers send each element as its own message.
  messages: string[];
  ok: boolean;
}

export async function handleWhatsAppMessage(
  message: string,
  userId: string
): Promise<WhatsAppReply> {
  const msg = (message || "").trim();
  const uid = (userId || "default").trim();

  if (!msg) {
    return {
      ok: true,
      messages: [
        "Ask me about California listings, a city's market, or a real estate term. " +
          'For example: "3 bed condos in Irvine under 1M".',
      ],
    };
  }

  try {
    const reply = await orchestrate(msg, uid);
    return { ok: true, messages: prepareForWhatsApp(reply) };
  } catch (err) {
    // Log the real error for us; return a safe one to the user. These are
    // deliberately different strings — that difference is the whole point.
    console.error("[whatsapp] orchestration failed:", err);
    return { ok: false, messages: [safeErrorMessage(err)] };
  }
}

// ── CLI ─────────────────────────────────────────────────────────────
// This is the command the OpenClaw skill runs. Chunks are printed separated
// by blank lines; OpenClaw applies its own delivery chunking on top.
if (require.main === module) {
  (async () => {
    const userId = (process.argv[2] || "default").trim();
    const message = process.argv.slice(3).join(" ").trim();
    const { messages, ok } = await handleWhatsAppMessage(message, userId);
    console.log(messages.join("\n\n"));
    if (!ok) process.exitCode = 1;
  })()
    .catch((err) => {
      // Last-resort guard: even a failure inside the error path must not
      // print a stack trace to the channel.
      console.log(safeErrorMessage(err));
      process.exitCode = 1;
    })
    .finally(() => closePool().catch(() => {}));
}