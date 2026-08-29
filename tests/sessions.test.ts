// sessions.test.ts — Week 4 validation
// Tests conversation state: filter merging, reset detection, and the
// file-backed persistence that makes multi-turn search work across the
// separate exec processes the skill spawns.
//
//   npx tsx db/sessions.test.ts
//
// Persistence tests use throwaway user IDs prefixed "__test__" and clean up
// after themselves, so they never touch a real conversation's session file.

import {
  getSession,
  saveSession,
  clearSession,
  mergeFilters,
  isResetRequest,
  filterCount,
} from "../src/sessions";
import { PropertyFilters } from "../src/lib/parsePropertyQuery";

const EMPTY: PropertyFilters = {
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

function f(overrides: Partial<PropertyFilters>): PropertyFilters {
  return { ...EMPTY, ...overrides };
}

let passed = 0;
let failed = 0;

function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) {
    passed++;
    console.log(`PASS  ${name}`);
  } else {
    failed++;
    console.log(`FAIL  ${name}`);
    console.log(`      want ${JSON.stringify(want)}`);
    console.log(`      got  ${JSON.stringify(got)}`);
  }
}

function checkTrue(name: string, got: boolean) {
  check(name, got, true);
}

// ── mergeFilters: the core of multi-turn refinement ────────────────

console.log("\n--- mergeFilters ---");

{
  // The central rule: a new value overwrites, but null must NOT erase.
  const existing = f({ city: "Irvine", maxPrice: 1200000, beds: 3 });
  const incoming = f({ maxPrice: 900000 });
  const merged = mergeFilters(existing, incoming);
  check("new value overwrites", merged.maxPrice, 900000);
  check("null does not erase city", merged.city, "Irvine");
  check("null does not erase beds", merged.beds, 3);
}
{
  // "Actually make it San Gabriel" — swap one field, keep the rest.
  const existing = f({ city: "Los Angeles", beds: 3, type: "SingleFamilyResidence", maxPrice: 2000000 });
  const merged = mergeFilters(existing, f({ city: "San Gabriel" }));
  check("city swaps", merged.city, "San Gabriel");
  check("beds survive the swap", merged.beds, 3);
  check("type survives the swap", merged.type, "SingleFamilyResidence");
  check("price survives the swap", merged.maxPrice, 2000000);
}
{
  const merged = mergeFilters(EMPTY, f({ city: "Tustin" }));
  check("merging onto empty works", merged.city, "Tustin");
}
{
  const existing = f({ city: "Irvine" });
  const merged = mergeFilters(existing, EMPTY);
  check("empty incoming changes nothing", merged, existing);
}
{
  // Accumulation across three turns, the real conversational pattern.
  let acc = EMPTY;
  acc = mergeFilters(acc, f({ city: "Tustin" }));
  acc = mergeFilters(acc, f({ maxPrice: 900000 }));
  acc = mergeFilters(acc, f({ beds: 4 }));
  check("three turns accumulate", [acc.city, acc.maxPrice, acc.beds], ["Tustin", 900000, 4]);
}
{
  const existing = f({ city: "Irvine" });
  const merged = mergeFilters(existing, f({ zip: 92602 }));
  check("zip merges alongside city", [merged.city, merged.zip], ["Irvine", 92602]);
}
{
  // mergeFilters must not mutate its inputs (callers reuse them).
  const existing = f({ city: "Irvine" });
  const snapshot = JSON.stringify(existing);
  mergeFilters(existing, f({ city: "Tustin" }));
  check("does not mutate the existing object", JSON.stringify(existing), snapshot);
}

// ── isResetRequest ─────────────────────────────────────────────────

console.log("\n--- isResetRequest ---");

for (const phrase of [
  "start over",
  "Start Over",
  "reset",
  "new search",
  "start again",
  "forget it",
  "forget everything",
  "actually, start over please",
]) {
  checkTrue(`recognizes "${phrase}"`, isResetRequest(phrase));
}

for (const phrase of [
  "3 bed condos in Irvine",
  "under 1.2M",
  "what about San Gabriel",
  "show me more",
  "", // empty message must not read as a reset
]) {
  checkTrue(`does NOT treat "${phrase}" as reset`, !isResetRequest(phrase));
}

// ── filterCount ────────────────────────────────────────────────────

console.log("\n--- filterCount ---");

check("empty filters count 0", filterCount(EMPTY), 0);
check("one filter counts 1", filterCount(f({ city: "Irvine" })), 1);
check("three filters count 3", filterCount(f({ city: "Irvine", beds: 3, maxPrice: 900000 })), 3);

// ── Persistence: the reason sessions are file-backed ───────────────

console.log("\n--- persistence ---");

const USER_A = "__test__user_a";
const USER_B = "__test__user_b";

clearSession(USER_A);
clearSession(USER_B);

{
  // A brand-new user gets a clean session, not a crash.
  const s = getSession(USER_A);
  check("new session starts with empty filters", s.filters, EMPTY);
  check("new session step is 0", s.conversationStep, 0);
  check("new session has not searched", s.hasSearched, false);
}
{
  // Save, then read back — this is what survives between exec processes.
  const s = getSession(USER_A);
  s.filters = f({ city: "Irvine", maxPrice: 1200000 });
  s.conversationStep = 2;
  s.hasSearched = true;
  s.lastResultIds = ["111", "222"];
  saveSession(USER_A, s);

  const reloaded = getSession(USER_A);
  check("filters survive a round-trip", reloaded.filters, f({ city: "Irvine", maxPrice: 1200000 }));
  check("conversationStep survives", reloaded.conversationStep, 2);
  check("hasSearched survives", reloaded.hasSearched, true);
  check("lastResultIds survive", reloaded.lastResultIds, ["111", "222"]);
  checkTrue("updatedAt is set", typeof reloaded.updatedAt === "string" && reloaded.updatedAt.length > 0);
}
{
  // Two users must never see each other's search.
  const a = getSession(USER_A);
  const b = getSession(USER_B);
  b.filters = f({ city: "San Diego" });
  saveSession(USER_B, b);

  check("user A unaffected by user B", getSession(USER_A).filters.city, "Irvine");
  check("user B has its own city", getSession(USER_B).filters.city, "San Diego");
}
{
  // Phone-number IDs contain "+" — the filename must still work.
  const PHONE = "__test__+1555000111";
  clearSession(PHONE);
  const s = getSession(PHONE);
  s.filters = f({ zip: 90012 });
  saveSession(PHONE, s);
  check("phone-style id round-trips", getSession(PHONE).filters.zip, 90012);
  clearSession(PHONE);
}
{
  clearSession(USER_A);
  const s = getSession(USER_A);
  check("clearSession wipes filters", s.filters, EMPTY);
  check("clearSession resets hasSearched", s.hasSearched, false);
}
{
  // Clearing a session that does not exist must be a no-op, not a throw.
  let threw = false;
  try {
    clearSession("__test__never_existed");
  } catch {
    threw = true;
  }
  checkTrue("clearing a missing session does not throw", !threw);
}

// cleanup
clearSession(USER_A);
clearSession(USER_B);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
