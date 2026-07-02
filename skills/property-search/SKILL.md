---
name: property-search
description: Parse a free-text real-estate request into a structured property filter object for searching active MLS listings.
---

# Property Search — Query Parsing

When the user describes the property they want in natural language, convert their
request into a structured filter object that can be used to search active MLS
listings (the `rets_property` table). This skill handles parsing only — turning
text into filters. Running those filters against the database is a separate step.

## Example

User: "Show me 3-bedroom condos in Irvine under $1.5M with a pool."

Filter object:

```json
{
  "city": "Irvine",
  "maxPrice": 1500000,
  "beds": 3,
  "baths": null,
  "sqft": null,
  "type": "Condominium",
  "pool": "True",
  "hasView": null,
  "maxHoa": null
}
```

## Fields to extract (and their rets_property columns)

| Filter     | Column          | Meaning                       |
|------------|-----------------|-------------------------------|
| `city`     | `L_City`        | exact city match              |
| `maxPrice` | `L_SystemPrice` | price cap (<=)                |
| `beds`     | `L_Keyword2`    | minimum bedrooms (>=)         |
| `baths`    | `LM_Dec_3`      | minimum bathrooms (>=, halves)|
| `sqft`     | `LM_Int2_3`     | minimum square footage (>=)   |
| `type`     | `L_Type_`       | property subtype              |
| `pool`     | `PoolPrivateYN` | "True" if a pool is wanted    |
| `hasView`  | `ViewYN`        | "True" if a view is wanted    |
| `maxHoa`   | `AssociationFee`| HOA fee cap (<=)              |

## Rules

- Only fill fields the user actually specified. Leave everything else `null`.
- `beds`, `baths`, and `sqft` are minimums; `maxPrice` and `maxHoa` are caps.
- Respect negation: "without a pool" leaves `pool` as `null`, not `"True"`.
- Normalize property type to RESO values: `Condominium`, `Townhouse`,
  `SingleFamilyResidence`, `UnimprovedLand`.
- Do not invent a `type` for generic words like "home" or "house".

## Reference implementation

A deterministic parser lives alongside this file in `parsePropertyQuery.ts`, with
a validation suite in `parsePropertyQuery.test.ts` (13 test queries). Run it with:

```bash
npx tsx parsePropertyQuery.test.ts
```
