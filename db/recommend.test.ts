// recommend.test.ts — Week 7 validation
// Covers the hybrid scoring and comp assessment. Pure logic, no DB/OpenAI.
import { structuredScore, hybridScore, assessComp, ScorableListing } from "./recommendLib";

let passed = 0, failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { passed++; console.log(`PASS  ${name}`); }
  else { failed++; console.log(`FAIL  ${name}\n      want ${JSON.stringify(want)}\n      got  ${JSON.stringify(got)}`); }
}
function checkTrue(name: string, g: boolean){ check(name, g, true); }

const L = (o: Partial<ScorableListing>): ScorableListing => ({
  L_SystemPrice: 1000000, L_Keyword2: 3, LM_Int2_3: 1500, L_City: "Irvine", ...o,
});

console.log("\n--- structuredScore: price buckets ---");
check("price within 50k -> +20", structuredScore(L({}), L({ L_SystemPrice: 1040000 })), 20 + 15 + 15 + 10);
check("price within 150k -> +12", structuredScore(L({}), L({ L_SystemPrice: 1120000 })), 12 + 15 + 15 + 10);
check("price within 300k -> +5", structuredScore(L({}), L({ L_SystemPrice: 1250000 })), 5 + 15 + 15 + 10);
check("price far -> +0", structuredScore(L({}), L({ L_SystemPrice: 2000000 })), 0 + 15 + 15 + 10);

console.log("\n--- structuredScore: beds / city / sqft ---");
check("beds differ -> no +15", structuredScore(L({}), L({ L_Keyword2: 4 })), 20 + 0 + 15 + 10);
check("city differs -> no +15", structuredScore(L({}), L({ L_City: "Tustin" })), 20 + 15 + 0 + 10);
check("sqft within 300 -> +10", structuredScore(L({}), L({ LM_Int2_3: 1700 })), 20 + 15 + 15 + 10);
check("sqft within 700 -> +5", structuredScore(L({}), L({ LM_Int2_3: 2100 })), 20 + 15 + 15 + 5);
check("sqft far -> +0", structuredScore(L({}), L({ LM_Int2_3: 3000 })), 20 + 15 + 15 + 0);

console.log("\n--- structuredScore: identical + max + nulls ---");
check("identical listing -> max 60", structuredScore(L({}), L({})), 60);
check("string numbers coerce", structuredScore(L({ L_SystemPrice: "1000000" as any }), L({ L_SystemPrice: "1010000" as any })), 60);
check("null price skips price component", structuredScore(L({ L_SystemPrice: null }), L({})), 15 + 15 + 10);
check("null sqft skips sqft component", structuredScore(L({}), L({ LM_Int2_3: null })), 20 + 15 + 15);
check("all nulls -> 0", structuredScore({} as any, {} as any), 0);

console.log("\n--- hybridScore: combine + clamp ---");
check("perfect structural + full semantic -> 100", hybridScore(L({}), L({}), 1), 100);
check("perfect structural + zero semantic -> 60", hybridScore(L({}), L({}), 0), 60);
check("semantic 0.5 adds 20", hybridScore(L({}), L({}), 0.5), 80);
check("negative cosine clamps to 0", hybridScore(L({}), L({}), -0.9), 60);
check("cosine >1 clamps to 40", hybridScore(L({}), L({}), 1.5), 100);
{
  // A weaker structural match with strong semantic can still score reasonably.
  const s = hybridScore(L({}), L({ L_City: "Tustin", L_SystemPrice: 2000000, LM_Int2_3: 3000, L_Keyword2: 5 }), 0.9);
  check("weak structure + strong semantic", s, Math.round((0 + 0.9 * 40) * 100) / 100);
}

console.log("\n--- assessComp ---");
{
  // List price below comp value -> flagged as below comps (potential value).
  const a = assessComp(900000, 700, 1500, 12); // comp price = 700*1500 = 1,050,000
  check("below comps price", a.compPrice, 1050000);
  checkTrue("delta is negative", (a.deltaPct ?? 0) < 0);
  check("label below comps", a.label, "14% below comps");
  check("comp count carried", a.compCount, 12);
}
{
  const a = assessComp(1200000, 700, 1500, 8); // comp = 1,050,000, list higher
  check("above comps label", a.label, "14% above comps");
}
{
  const a = assessComp(1060000, 700, 1500, 5); // comp = 1,050,000, ~1% off
  check("in line with comps", a.label, "in line with comps");
}
{
  const a = assessComp(900000, null, 1500, 0);
  check("no comps -> null price", a.compPrice, null);
  check("no comps label", a.label, "no comps available");
  check("no comps delta null", a.deltaPct, null);
}
{
  const a = assessComp(900000, 700, null, 3); // missing sqft
  check("missing sqft -> no comps", a.label, "no comps available");
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
