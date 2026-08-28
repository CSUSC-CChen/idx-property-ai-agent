import { readdirSync } from "fs";
import { execSync } from "child_process";

const files = readdirSync("tests").filter((f) => f.endsWith(".test.ts")).sort();
let failed = 0;

for (const f of files) {
  console.log(`\n=== tests/${f} ===`);
  try {
    execSync(`npx tsx tests/${f}`, { stdio: "inherit" });
  } catch {
    failed++;
  }
}

console.log(`\n${files.length - failed}/${files.length} suites passed`);
process.exit(failed > 0 ? 1 : 0);