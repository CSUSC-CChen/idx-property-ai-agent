// queries.ts — Week 3
// Parameterized queries over the two MLS tables, plus a card formatter.
// Filters come from the Week 2 parser (PropertyFilters).

import { PropertyFilters } from "../skills/property-search/parsePropertyQuery";
import { query } from "./db";

// ── Active listings (rets_property) ────────────────────────────────

export interface ListingRow {
  L_ListingID: string;
  L_DisplayId: string;
  L_Address: string;
  L_City: string;
  L_Zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  status: string;
  lat: number;
  lng: number;
  YearBuilt: number;
  AssociationFee: number;
  DaysOnMarket: number;
  PoolPrivateYN: string;
  ViewYN: string;
  FireplaceYN: string;
  PhotoCount: number;
  LA1_UserFirstName: string;
  LA1_UserLastName: string;
  LO1_OrganizationName: string;
}

export async function searchActiveListings(
  filters: PropertyFilters,
  page = 1,
  limit = 10
): Promise<ListingRow[]> {
  let sql = `
    SELECT
      L_ListingID, L_DisplayId, L_Address, L_City, L_Zip,
      L_SystemPrice AS price, L_Keyword2 AS beds, LM_Dec_3 AS baths,
      LM_Int2_3 AS sqft, L_Type_ AS type, L_Status AS status,
      LMD_MP_Latitude AS lat, LMD_MP_Longitude AS lng,
      YearBuilt, AssociationFee, DaysOnMarket,
      PoolPrivateYN, ViewYN, FireplaceYN, PhotoCount,
      LA1_UserFirstName, LA1_UserLastName, LO1_OrganizationName
    FROM rets_property
    WHERE L_Status = 'Active'
  `;
  const params: any[] = [];

  if (filters.city)     { sql += " AND L_City = ?";        params.push(filters.city); }
  if (filters.maxPrice) { sql += " AND L_SystemPrice <= ?"; params.push(filters.maxPrice); }
  if (filters.beds)     { sql += " AND L_Keyword2 >= ?";    params.push(filters.beds); }
  if (filters.baths)    { sql += " AND LM_Dec_3 >= ?";      params.push(filters.baths); }
  if (filters.sqft)     { sql += " AND LM_Int2_3 >= ?";     params.push(filters.sqft); }
  if (filters.type)     { sql += " AND L_Type_ = ?";        params.push(filters.type); }
  if (filters.pool)     { sql += " AND PoolPrivateYN = ?";  params.push(filters.pool); }
  if (filters.hasView)  { sql += " AND ViewYN = ?";         params.push(filters.hasView); }
  if (filters.maxHoa)   { sql += " AND AssociationFee <= ?"; params.push(filters.maxHoa); }

  // LIMIT/OFFSET are inlined as validated integers on purpose: mysql2 prepared
  // statements can reject placeholders in LIMIT/OFFSET. Coercing to integers
  // keeps this injection-safe. limit is capped at 50 (handbook safety rule).
  const safeLimit = Math.max(1, Math.min(50, Math.trunc(limit)));
  const safeOffset = Math.max(0, Math.trunc((page - 1) * limit));
  sql += ` ORDER BY L_SystemPrice ASC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

  return query<ListingRow>(sql, params);
}

// ── Sold comps (california_sold) ───────────────────────────────────

export interface SoldRow {
  ListingKey: number;
  UnparsedAddress: string;
  City: string;
  CloseDate: string;
  ClosePrice: number;
  OriginalListPrice: number;
  ListPrice: number;
  DaysOnMarket: number;
  BedroomsTotal: number;
  BathroomsTotalInteger: number;
  LivingArea: number;
  PropertyType: string;
  PropertySubType: string;
  YearBuilt: number;
  ListAgentFullName: string;
  ListOfficeName: string;
  BuyerOfficeName: string;
}

export async function getSoldComps(city: string, months = 12): Promise<SoldRow[]> {
  // months inlined as an integer for the same prepared-statement reason as above.
  // CloseDate <= CURDATE() guards against junk future dates in the dataset.
  const safeMonths = Math.max(1, Math.min(120, Math.trunc(months)));
  const sql = `
    SELECT
      ListingKey, UnparsedAddress, City, CloseDate, ClosePrice,
      OriginalListPrice, ListPrice, DaysOnMarket,
      BedroomsTotal, BathroomsTotalInteger, LivingArea,
      PropertyType, PropertySubType, YearBuilt,
      ListAgentFullName, ListOfficeName, BuyerOfficeName
    FROM california_sold
    WHERE City = ?
      AND PropertyType = 'Residential'
      AND CloseDate <= CURDATE()
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL ${safeMonths} MONTH)
    ORDER BY CloseDate DESC
    LIMIT 50
  `;
  return query<SoldRow>(sql, [city]);
}

// ── Formatting ─────────────────────────────────────────────────────

export function formatCard(r: ListingRow): string {
  const price = r.price != null ? `$${Number(r.price).toLocaleString()}` : "N/A";
  const beds = r.beds ?? "?";
  const baths = r.baths ?? "?";
  const sqft = r.sqft != null ? `${Number(r.sqft).toLocaleString()} sqft` : "sqft N/A";
  const agent = [r.LA1_UserFirstName, r.LA1_UserLastName].filter(Boolean).join(" ");
  const lines = [
    `${r.L_Address}, ${r.L_City} ${r.L_Zip}`,
    `  ${price} · ${beds} bd / ${baths} ba · ${sqft}`,
    `  ${r.type} · ${r.DaysOnMarket ?? "?"} days on market${r.PoolPrivateYN === "True" ? " · pool" : ""}`,
    agent ? `  Listed by ${agent}${r.LO1_OrganizationName ? ", " + r.LO1_OrganizationName : ""}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
