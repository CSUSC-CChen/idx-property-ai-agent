// queries.test.ts — Week 3 validation
// Tests the SQL builder and the card formatter. No database required: the
// query construction is tested through the pure buildListingQuery() function,
// so these run anywhere, instantly, with no MySQL connection.
//
//   npx tsx db/queries.test.ts

import { buildListingQuery, formatCard, ListingRow } from "./queries";
import { PropertyFilters } from "../skills/property-search/parsePropertyQuery";

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

// ── Filters produce the right clause and param ─────────────────────

console.log("\n--- individual filters ---");

{
  const { sql, params } = buildListingQuery(f({ city: "Irvine" }));
  checkTrue("city adds L_City clause", sql.includes("AND L_City = ?"));
  check("city param", params, ["Irvine"]);
}
{
  const { sql, params } = buildListingQuery(f({ maxPrice: 1500000 }));
  checkTrue("maxPrice uses <=", sql.includes("AND L_SystemPrice <= ?"));
  check("maxPrice param", params, [1500000]);
}
{
  const { sql, params } = buildListingQuery(f({ beds: 3 }));
  checkTrue("beds uses >= (minimum)", sql.includes("AND L_Keyword2 >= ?"));
  check("beds param", params, [3]);
}
{
  const { sql, params } = buildListingQuery(f({ baths: 2.5 }));
  checkTrue("baths uses >= (half-baths ok)", sql.includes("AND LM_Dec_3 >= ?"));
  check("baths param", params, [2.5]);
}
{
  const { sql, params } = buildListingQuery(f({ sqft: 1800 }));
  checkTrue("sqft uses >=", sql.includes("AND LM_Int2_3 >= ?"));
  check("sqft param", params, [1800]);
}
{
  const { sql, params } = buildListingQuery(f({ type: "Condominium" }));
  checkTrue("type adds L_Type_ clause", sql.includes("AND L_Type_ = ?"));
  check("type param", params, ["Condominium"]);
}
{
  const { sql, params } = buildListingQuery(f({ pool: "True" }));
  checkTrue("pool adds PoolPrivateYN", sql.includes("AND PoolPrivateYN = ?"));
  check("pool param", params, ["True"]);
}
{
  const { sql, params } = buildListingQuery(f({ hasView: "True" }));
  checkTrue("view adds ViewYN", sql.includes("AND ViewYN = ?"));
  check("view param", params, ["True"]);
}
{
  const { sql, params } = buildListingQuery(f({ maxHoa: 300 }));
  checkTrue("maxHoa uses <=", sql.includes("AND AssociationFee <= ?"));
  check("maxHoa param", params, [300]);
}
{
  const { sql, params } = buildListingQuery(f({ zip: 92602 }));
  checkTrue("zip adds L_Zip clause", sql.includes("AND L_Zip = ?"));
  check("zip param", params, [92602]);
}

// ── Null filters must add nothing ──────────────────────────────────

console.log("\n--- null filters are skipped ---");

{
  const { sql, params } = buildListingQuery(EMPTY);
  check("no filters -> no params", params, []);
  // Note: L_City / L_SystemPrice appear in the SELECT list, so assert on the
  // WHERE clause form specifically, not bare column names.
  checkTrue("no city clause", !sql.includes("AND L_City = ?"));
  checkTrue("no price clause", !sql.includes("AND L_SystemPrice <= ?"));
  checkTrue("no zip clause", !sql.includes("AND L_Zip = ?"));
  checkTrue("still filters to Active", sql.includes("WHERE L_Status = 'Active'"));
}

// ── Combined filters: order and completeness ───────────────────────

console.log("\n--- combined filters ---");

{
  const { params } = buildListingQuery(
    f({ city: "Irvine", maxPrice: 1000000, beds: 3, type: "Condominium" })
  );
  check("params in clause order", params, ["Irvine", 1000000, 3, "Condominium"]);
}
{
  const { sql, params } = buildListingQuery(
    f({ city: "Irvine", zip: 92602 })
  );
  checkTrue("city and zip can coexist", sql.includes("L_City = ?") && sql.includes("L_Zip = ?"));
  check("city+zip params", params, ["Irvine", 92602]);
}
{
  // Every filter at once — guards against a filter being dropped by a future edit.
  const all = f({
    city: "Irvine", maxPrice: 900000, beds: 3, baths: 2, sqft: 1200,
    type: "Condominium", pool: "True", hasView: "True", maxHoa: 400, zip: 92602,
  });
  const { params } = buildListingQuery(all);
  check("all 10 filters produce 10 params", params.length, 10);
}

// ── Pagination safety ──────────────────────────────────────────────

console.log("\n--- LIMIT / OFFSET safety ---");

{
  const { sql } = buildListingQuery(EMPTY, 1, 10);
  checkTrue("page 1 -> OFFSET 0", sql.includes("LIMIT 10 OFFSET 0"));
}
{
  const { sql } = buildListingQuery(EMPTY, 3, 10);
  checkTrue("page 3 of 10 -> OFFSET 20", sql.includes("LIMIT 10 OFFSET 20"));
}
{
  const { sql } = buildListingQuery(EMPTY, 1, 5000);
  checkTrue("limit capped at 50 (safety rule)", sql.includes("LIMIT 50"));
}
{
  const { sql } = buildListingQuery(EMPTY, 0, 10);
  checkTrue("page 0 does not produce negative OFFSET", sql.includes("OFFSET 0"));
}
{
  const { sql } = buildListingQuery(EMPTY, 1, 0);
  checkTrue("limit 0 floors to 1", sql.includes("LIMIT 1"));
}
{
  // LIMIT/OFFSET are inlined, so non-integer input must not reach the SQL.
  const { sql } = buildListingQuery(EMPTY, 1, 7.9);
  checkTrue("fractional limit truncated to integer", sql.includes("LIMIT 7"));
  checkTrue("no decimal point in LIMIT", !/LIMIT \d+\.\d/.test(sql));
}

// ── formatCard ─────────────────────────────────────────────────────

console.log("\n--- formatCard ---");

const row = (o: Partial<ListingRow>): ListingRow =>
  ({
    L_Address: "123 Test St", L_City: "Irvine", L_Zip: "92602",
    price: 1199000, beds: 3, baths: 2.5, sqft: 1450,
    type: "Condominium", DaysOnMarket: 12, PoolPrivateYN: "False",
    LA1_UserFirstName: "Jane", LA1_UserLastName: "Doe",
    LO1_OrganizationName: "Acme Realty",
    ...o,
  } as ListingRow);

{
  const out = formatCard(row({}));
  checkTrue("includes address and city", out.includes("123 Test St, Irvine 92602"));
  checkTrue("formats price with commas", out.includes("$1,199,000"));
  checkTrue("shows beds/baths", out.includes("3 bd / 2.5 ba"));
  checkTrue("formats sqft with commas", out.includes("1,450 sqft"));
  checkTrue("shows days on market", out.includes("12 days on market"));
  checkTrue("shows agent", out.includes("Jane Doe"));
}
{
  const out = formatCard(row({ PoolPrivateYN: "True" }));
  checkTrue("private pool is labelled", out.includes("pool"));
}
{
  const out = formatCard(row({ PoolPrivateYN: "False" }));
  checkTrue("no pool label when False", !out.includes("· pool"));
}
{
  // Real MLS rows have missing fields; the formatter must not crash or print "undefined".
  const out = formatCard(
    row({ price: null as any, beds: null as any, baths: null as any, sqft: null as any })
  );
  checkTrue("null price -> N/A", out.includes("N/A"));
  checkTrue("null beds/baths -> ?", out.includes("? bd / ? ba"));
  checkTrue("never prints 'undefined'", !out.includes("undefined"));
}
{
  const out = formatCard(
    row({ LA1_UserFirstName: "" as any, LA1_UserLastName: "" as any })
  );
  checkTrue("missing agent omits the agent line", !out.includes("Listed by"));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
