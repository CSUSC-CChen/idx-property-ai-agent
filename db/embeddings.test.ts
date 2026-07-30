// embeddings.test.ts — Week 6 validation (remarks-only)
import { cosineSimilarity, buildListingText, rankBySimilarity } from "./embeddings";

let passed = 0, failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { passed++; console.log(`PASS  ${name}`); }
  else { failed++; console.log(`FAIL  ${name}\n      want ${JSON.stringify(want)}\n      got  ${JSON.stringify(got)}`); }
}
function checkClose(name: string, got: number, want: number, tol = 1e-9) {
  const ok = Math.abs(got - want) <= tol;
  if (ok) { passed++; console.log(`PASS  ${name}`); }
  else { failed++; console.log(`FAIL  ${name}  want ~${want}, got ${got}`); }
}
function checkTrue(name: string, got: boolean) { check(name, got, true); }

console.log("\n--- cosineSimilarity ---");
checkClose("identical -> 1", cosineSimilarity([1,2,3],[1,2,3]), 1);
checkClose("same direction diff magnitude -> 1", cosineSimilarity([1,2,3],[2,4,6]), 1);
checkClose("orthogonal -> 0", cosineSimilarity([1,0],[0,1]), 0);
checkClose("opposite -> -1", cosineSimilarity([1,2,3],[-1,-2,-3]), -1);
checkClose("45 degrees", cosineSimilarity([1,0],[1,1]), 1/Math.sqrt(2));
check("zero vector -> 0", cosineSimilarity([0,0,0],[1,2,3]), 0);
check("both zero -> 0", cosineSimilarity([0,0],[0,0]), 0);
checkTrue("finite on zero", Number.isFinite(cosineSimilarity([0,0],[0,0])));
checkTrue("finite on mismatched length", Number.isFinite(cosineSimilarity([1,2,3,4],[1,2,3])));
checkClose("symmetric", cosineSimilarity([0.2,0.5,0.9,0.1],[0.7,0.1,0.3,0.8]), cosineSimilarity([0.7,0.1,0.3,0.8],[0.2,0.5,0.9,0.1]));

console.log("\n--- buildListingText (remarks-only) ---");
{
  const text = buildListingText({ L_Type_:"Condominium", L_City:"Irvine", L_Keyword2:3,
    L_Remarks:"Charming craftsman with mountain views and tons of character." });
  check("returns remarks verbatim", text, "Charming craftsman with mountain views and tons of character.");
  checkTrue("does NOT embed type", !text.includes("Condominium"));
  checkTrue("does NOT embed city prefix", !text.includes("in Irvine, CA"));
}
{ const t = buildListingText({ L_Remarks:"Cozy   bungalow\n\nnear the arroyo." });
  check("collapses whitespace", t, "Cozy bungalow near the arroyo.");
  checkTrue("no double spaces", !t.includes("  ")); }
check("no remarks -> empty", buildListingText({ L_City:"Pasadena", L_Type_:"Condominium" }), "");
check("empty row -> empty", buildListingText({}), "");
checkTrue("truncated <= 8000", buildListingText({ L_Remarks:"x".repeat(20000) }).length <= 8000);
{ const t = buildListingText({ L_Remarks:"Ocean view penthouse." });
  checkTrue("no 'undefined'", !t.toLowerCase().includes("undefined"));
  checkTrue("no 'null'", !t.toLowerCase().includes("null")); }

console.log("\n--- rankBySimilarity ---");
{
  const ranked = rankBySimilarity([1,0], [
    { vector:[0,1], row:"orthogonal" }, { vector:[1,0], row:"exact" },
    { vector:[1,1], row:"diagonal" }, { vector:[-1,0], row:"opposite" },
  ], 5);
  check("ranked best-first", ranked.map(r=>r.row), ["exact","diagonal","orthogonal","opposite"]);
  checkClose("top score 1", ranked[0].score, 1);
}
check("topK limits to 3", rankBySimilarity([1,0], Array.from({length:10},(_,i)=>({vector:[1,i/10],row:i})), 3).length, 3);
check("fewer than topK returns all", rankBySimilarity([1,0],[{vector:[1,0],row:"a"}],5).length, 1);
{
  const ranked = rankBySimilarity([1,0], [{vector:[],row:"missing"},{vector:[1,0],row:"real"}], 5);
  check("empty-vector ranks last", ranked[0].row, "real");
  checkTrue("no NaN scores", ranked.every(r=>Number.isFinite(r.score)));
}
check("no candidates -> empty", rankBySimilarity([1,0],[],5), []);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
