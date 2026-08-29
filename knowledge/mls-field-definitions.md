# MLS Field Definitions

This document describes every field in the two core IDX Exchange databases:
`rets_property` (active listings) and `california_sold` (sold transactions).
Both tables live in the `idx_exchange` MySQL schema.

## rets_property — Active Listings (~228,410 rows)

The live search and discovery table. 130+ fields; the ones used by the agent
are listed below.

| Column | Type | Description |
|---|---|---|
| id | INT PK | Auto-increment primary key |
| L_ListingID | VARCHAR | MLS system listing ID — joins to `california_sold.ListingKey` |
| L_DisplayId | VARCHAR | Human-readable MLS number shown on portals |
| L_Address | VARCHAR | Full street address |
| L_City | VARCHAR | City — indexed for fast city-based queries |
| L_Zip | VARCHAR | Postal code — indexed |
| L_Class | VARCHAR | Property class: Residential, CommercialSale, Land, etc. |
| L_Type_ | VARCHAR | Subtype: SingleFamilyResidence, Condominium, etc. — indexed |
| L_Keyword2 | INT | Bedrooms total |
| LM_Dec_3 | DECIMAL(4,1) | Bathrooms total (supports half-baths, e.g. 2.5) |
| L_SystemPrice | INT | Current list price (search/display price) |
| LM_Int2_3 | INT | Approximate finished square footage |
| L_Keyword1 | VARCHAR | Lot size (string, often in sq ft or acres) |
| LMD_MP_Latitude | DECIMAL(18,15) | Geo latitude — high precision |
| LMD_MP_Longitude | DECIMAL(19,15) | Geo longitude — high precision |
| L_Status | VARCHAR | Listing status: Active, Pending, Withdrawn, etc. |
| L_Remarks | MEDIUMTEXT | Full listing description — FULLTEXT indexed (`ft_remarks`) |
| L_Photos | LONGTEXT | JSON array of Cotality/Trestle photo URLs |
| LA1_UserFirstName | VARCHAR | Listing agent first name |
| LA1_UserLastName | VARCHAR | Listing agent last name |
| ListAgentEmail | VARCHAR | Listing agent email address |
| ListAgentDirectPhone | VARCHAR | Listing agent direct phone |
| LO1_OrganizationName | VARCHAR | Listing office / brokerage name |
| ListingContractDate | DATE | Date listing agreement was signed |
| YearBuilt | INT | Year property was constructed |
| SubdivisionName | VARCHAR | Subdivision or community name |
| AssociationFee | INT | Monthly HOA fee in dollars |
| AssociationAmenities | TEXT | HOA amenities: Golf, Pool, Tennis, etc. |
| DaysOnMarket | INT | Days on market at time of data pull |
| PoolPrivateYN | VARCHAR | Private pool present (True/False) |
| FireplaceYN | VARCHAR | Fireplace present (True/False) |
| ViewYN | VARCHAR | Has a notable view (True/False) |
| View | VARCHAR | View description: Mountains, Ocean, GolfCourse, etc. |
| LotSizeAcres | DECIMAL(10,4) | Lot size in acres |
| LotSizeSquareFeet | DECIMAL(14,2) | Lot size in square feet |
| PreviousListPrice | DECIMAL(12,0) | Prior list price — enables price reduction analysis |
| StandardStatus | VARCHAR | RESO standard status: Active, Pending, Closed |
| CountyOrParish | VARCHAR | County name (e.g., Riverside, Los Angeles) |
| ParcelNumber | VARCHAR | Assessor parcel number (APN) |
| Cooling | VARCHAR | Cooling system type |
| Heating | VARCHAR | Heating system type |
| ArchitecturalStyle | VARCHAR | Architectural style: Modern, Ranch, Mediterranean, etc. |
| PhotoCount | INT | Number of listing photos available |
| ModificationTimestamp | DATETIME | Last modification timestamp for incremental sync |

## california_sold — Sold Transactions (~439,167 rows)

The historical comps and market analytics table, spanning 2021–2025.

| Column | Type | Description |
|---|---|---|
| ListingKey | BIGINT | Unique listing identifier — joins to `rets_property.L_ListingID` |
| ClosePrice | DOUBLE | Final sale/close price |
| CloseDate | VARCHAR | Date the transaction closed (YYYY-MM-DD) |
| OriginalListPrice | DOUBLE | Original asking price when first listed |
| ListPrice | DOUBLE | List price at time of contract |
| DaysOnMarket | BIGINT | Days from listing to contract |
| PropertyType | VARCHAR | Residential, Land, ResidentialLease, CommercialSale, etc. |
| PropertySubType | VARCHAR | SingleFamilyResidence, Condominium, Duplex, etc. |
| LivingArea | DOUBLE | Finished living area in square feet |
| LotSizeAcres | DOUBLE | Lot size in acres |
| LotSizeSquareFeet | DOUBLE | Lot size in square feet |
| BedroomsTotal | DOUBLE | Number of bedrooms |
| BathroomsTotalInteger | DOUBLE | Number of bathrooms |
| YearBuilt | DOUBLE | Year property was built |
| City | VARCHAR | City of the property |
| PostalCode | VARCHAR | ZIP code |
| Latitude | DOUBLE | Geographic latitude |
| Longitude | DOUBLE | Geographic longitude |
| UnparsedAddress | VARCHAR | Full street address |
| ListAgentFirstName | VARCHAR | List agent first name |
| ListAgentLastName | VARCHAR | List agent last name |
| ListAgentFullName | VARCHAR | List agent full name |
| BuyerAgentFirstName | VARCHAR | Buyer agent first name |
| BuyerAgentLastName | VARCHAR | Buyer agent last name |
| ListOfficeName | VARCHAR | Listing brokerage name |
| BuyerOfficeName | VARCHAR | Buyer brokerage name |
| PoolPrivateYN | VARCHAR | Private pool (True/False/empty) |
| ViewYN | VARCHAR | Has view (True/False/empty) |
| FireplaceYN | VARCHAR | Has fireplace (True/False/empty) |
| NewConstructionYN | VARCHAR | New construction (True/False) |
| GarageSpaces | DOUBLE | Number of garage spaces |
| AssociationFee | DOUBLE | Monthly HOA fee |
| SubdivisionName | VARCHAR | Subdivision / community name |
| HighSchoolDistrict | VARCHAR | School district name |
| ListingContractDate | VARCHAR | Date listing was entered (YYYY-MM-DD) |
| PurchaseContractDate | VARCHAR | Date offer was accepted |

## Key Join Pattern

To correlate an active listing with its historical comps:

```sql
JOIN rets_property r ON CAST(r.L_ListingID AS UNSIGNED) = cs.ListingKey
```

For market-level (not listing-level) comparisons, join or filter on `City` +
postal code instead, since not every active listing has a prior sold record.
