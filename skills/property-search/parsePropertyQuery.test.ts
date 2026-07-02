// parsePropertyQuery.test.ts
// Week 2 validation harness — 13 test queries with expected filter objects.
// No test framework required. Run with:  npx tsx parsePropertyQuery.test.ts
//
// Each expected object is merged over an all-null baseline, so a test fails
// if the parser MISSES a field OR extracts one it should not have.

import { parsePropertyQuery, PropertyFilters } from "./parsePropertyQuery";

const NULL_FILTERS: PropertyFilters = {
  city: null,
  maxPrice: null,
  beds: null,
  baths: null,
  sqft: null,
  type: null,
  pool: null,
  hasView: null,
  maxHoa: null,
};

interface Case {
  query: string;
  expected: Partial<PropertyFilters>;
}

const cases: Case[] = [
  {
    query: "Show me 3-bedroom condos in Irvine under $1.5M with a pool.",
    expected: { city: "Irvine", maxPrice: 1500000, beds: 3, type: "Condominium", pool: "True" },
  },
  {
    query: "Find single family homes in Newport Beach under $2,000,000 with a view",
    expected: { city: "Newport Beach", maxPrice: 2000000, type: "SingleFamilyResidence", hasView: "True" },
  },
  {
    query: "townhomes in San Diego with at least 2.5 baths",
    expected: { city: "San Diego", type: "Townhouse", baths: 2.5 },
  },
  {
    query: "4 bed 3 bath house in Pasadena up to 850k",
    expected: { city: "Pasadena", maxPrice: 850000, beds: 4, baths: 3 },
  },
  {
    query: "condos in Long Beach under $600,000 with min 1,800 sqft",
    expected: { city: "Long Beach", maxPrice: 600000, type: "Condominium", sqft: 1800 },
  },
  {
    query: "homes in Riverside with HOA under $300",
    expected: { city: "Riverside", maxHoa: 300 },
  },
  {
    query: "3br 2ba in Tustin",
    expected: { city: "Tustin", beds: 3, baths: 2 },
  },
  {
    query: "land in Temecula under $400k",
    expected: { city: "Temecula", maxPrice: 400000, type: "UnimprovedLand" },
  },
  {
    query: "houses in Irvine without a pool",
    expected: { city: "Irvine" },
  },
  {
    query: "5 bedroom homes in Mission Viejo at least 3000 square feet",
    expected: { city: "Mission Viejo", beds: 5, sqft: 3000 },
  },
  {
    query: "condo near Santa Monica max $1.2m with a view and a pool",
    expected: { city: "Santa Monica", maxPrice: 1200000, type: "Condominium", hasView: "True", pool: "True" },
  },
  {
    query: "homes at least 2000 sqft in Fullerton",
    expected: { city: "Fullerton", sqft: 2000 },
  },
  {
    query: "single family in Anaheim, no more than $750000",
    expected: { city: "Anaheim", type: "SingleFamilyResidence", maxPrice: 750000 },
  },
];

let passed = 0;
cases.forEach((c, i) => {
  const expectedFull = { ...NULL_FILTERS, ...c.expected };
  const actual = parsePropertyQuery(c.query);
  const ok = JSON.stringify(actual) === JSON.stringify(expectedFull);
  if (ok) {
    passed++;
    console.log(`PASS [${i + 1}] ${c.query}`);
  } else {
    console.log(`FAIL [${i + 1}] ${c.query}`);
    console.log(`     expected ${JSON.stringify(expectedFull)}`);
    console.log(`     actual   ${JSON.stringify(actual)}`);
  }
});

console.log(`\n${passed}/${cases.length} passed`);
if (passed !== cases.length) process.exitCode = 1;
