// sessions.ts — Week 4
// Per-user conversation state for multi-turn property search.
//
// WHY THIS IS FILE-BACKED, NOT AN IN-MEMORY MAP:
// The skill runs the search as a fresh `exec` process on every WhatsApp
// message. A module-level Map would be created and destroyed inside a single
// message, so it would remember nothing between turns. Persisting to disk is
// what actually makes the conversation multi-turn in this architecture.

import { PropertyFilters } from "../skills/property-search/parsePropertyQuery";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface UserSession {
  filters: PropertyFilters;
  conversationStep: number;
  hasSearched: boolean;
  lastResultIds: string[];
  updatedAt: string;
}

const SESSION_DIR = path.join(os.homedir(), ".openclaw", "idx-sessions");

const EMPTY_FILTERS: PropertyFilters = {
  city: null,
  maxPrice: null,
  beds: null,
  baths: null,
  sqft: null,
  type: null,
  pool: null,
  hasView: null,
  maxHoa: null,
  zip: null,
};

function newSession(): UserSession {
  return {
    filters: { ...EMPTY_FILTERS },
    conversationStep: 0,
    hasSearched: false,
    lastResultIds: [],
    updatedAt: new Date().toISOString(),
  };
}

// Keep the filename filesystem-safe: "+18402319859" -> "_18402319859".
function sessionPath(userId: string): string {
  const safe = userId.replace(/[^a-zA-Z0-9]/g, "_") || "default";
  return path.join(SESSION_DIR, `${safe}.json`);
}

export function getSession(userId: string): UserSession {
  try {
    const raw = fs.readFileSync(sessionPath(userId), "utf8");
    const parsed = JSON.parse(raw) as UserSession;
    // Defensive: an older or hand-edited file may be missing fields.
    return {
      filters: { ...EMPTY_FILTERS, ...(parsed.filters || {}) },
      conversationStep: parsed.conversationStep ?? 0,
      hasSearched: parsed.hasSearched ?? false,
      lastResultIds: parsed.lastResultIds ?? [],
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return newSession(); // no file yet, or unreadable -> start fresh
  }
}

export function saveSession(userId: string, session: UserSession): void {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
  session.updatedAt = new Date().toISOString();
  fs.writeFileSync(sessionPath(userId), JSON.stringify(session, null, 2), "utf8");
}

export function clearSession(userId: string): void {
  try {
    fs.unlinkSync(sessionPath(userId));
  } catch {
    // already gone; nothing to do
  }
}

// Merge newly parsed filters over the remembered ones.
// Only non-null values overwrite, so "under 1.2M" refines the existing search
// instead of wiping the city the user gave two messages ago.
export function mergeFilters(
  existing: PropertyFilters,
  incoming: PropertyFilters
): PropertyFilters {
  const merged: PropertyFilters = { ...existing };
  (Object.keys(incoming) as (keyof PropertyFilters)[]).forEach((key) => {
    const value = incoming[key];
    if (value !== null && value !== undefined) {
      (merged as any)[key] = value;
    }
  });
  return merged;
}

// Did the user ask to start fresh?
export function isResetRequest(text: string): boolean {
  return /\b(start over|reset|new search|start again|forget (it|that|everything))\b/i.test(
    text
  );
}

// How many filters has the user actually given us?
export function filterCount(f: PropertyFilters): number {
  return Object.values(f).filter((v) => v !== null && v !== undefined).length;
}
