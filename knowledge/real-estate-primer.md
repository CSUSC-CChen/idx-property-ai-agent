                Real Estate Data Analyst Primer
            Understanding MLS Data, Real Estate Transactions, and the Analytics Workflow
                    For analysts with data experience entering the real estate domain




1. Where the Data Comes From: The MLS
The dataset you will be working with originates from CRMLS — the California Regional Multiple
Listing Service — one of the largest MLS systems in the United States, covering much of Southern
California. Understanding what an MLS is and how it works is the foundation for everything else in
this course.

What Is an MLS?
A Multiple Listing Service (MLS) is a private, cooperative database operated by a regional
association of real estate brokers. Agents use it to share listing information with each other —
essentially a centralized marketplace for properties. There is no single national MLS; instead, each
region operates its own (e.g., CRMLS for Southern California, NWMLS for the Pacific Northwest,
MRED for the Chicago area).

📌 Analyst Note
Consumer-facing sites like Zillow and Redfin pull data from MLS feeds via licensed agreements. When
you see a listing on Zillow, you are almost always looking at data that originated in an MLS. Working
directly with CRMLS data puts you one step closer to the source than most public datasets.




Key Data Fields You Will Encounter
When a listing agent enters a property into the MLS, they populate a structured form. The fields
below are the most important for analysis:

       Field Name                Example Value                           What It Means
ListingKey                   547863987             Unique identifier for the listing record
ListingContractDate          2024-03-01            Date the listing agreement was signed
ListPrice                    $875,000              Seller's asking price at time of listing
ClosePrice                   $862,500              Final agreed sale price
PurchaseContractDate         2024-03-31            Date the purchase agreement was signed by both parties;
                                                   typically 30–45 days before CloseDate
CloseDate                    2024-04-15            Date the transaction officially closed
LivingArea                   1,850                 Interior square footage
BedroomsTotal                3                     Number of bedrooms
BathroomsTotalInteger       2                    Number of bathrooms (integer)
Latitude / Longitude        33.9425 / -118.4     Geographic coordinates for mapping
UnparsedAddress             123 Main St, LA      Full address as entered by the agent



2. The Transaction Lifecycle
Real estate data is not just a snapshot — it captures a sequential business process. Each field in
your dataset maps to a specific stage in that process. Analysts who understand this context can
avoid misinterpretations that are common when treating the data as abstract rows and columns.

Stage 1 — Listing
The seller signs a listing agreement with a licensed agent. The agent enters the property details into
the MLS, creating the listing record. At this point, ListPrice, LivingArea, BedroomsTotal, and address
fields are populated. The property is now part of active market supply.

Stage 2 — Buyer Preapproval & Offers
Interested buyers typically obtain a mortgage preapproval before submitting an offer. A
preapproval letter from a lender confirms the buyer's borrowing capacity based on income, credit
score, and debt-to-income ratio. Sellers often require it before accepting an offer — it functions as a
financial qualification filter.

💡 Why This Matters for Analysis
Listings that receive many competing offers in a short window often close above list price — a pattern
you can detect by comparing ListPrice vs. ClosePrice alongside days-on-market. Conversely, a large
gap between list and close price (downward) may signal an overpriced listing or deteriorating market
conditions.




Stage 3 — Purchase Agreement & Escrow
When an offer is accepted, both parties sign a purchase agreement that locks in the price,
contingencies, and a closing date agreed upon by both buyer and seller — typically 30–45 days out,
though this is fully negotiable. That agreed date becomes the CloseDate field in the sold dataset. At
this point the property status changes to Pending in the MLS.
Contingencies are conditions that must be met for the deal to proceed. The three most common are:
•   Inspection contingency — buyer can cancel or renegotiate if the inspection reveals significant
    issues
•   Appraisal contingency — protects the buyer if the lender's appraisal comes in below the agreed
    price
•   Financing contingency — allows the buyer to exit if their loan falls through
Once the purchase agreement is signed, escrow opens. Escrow is a neutral third-party account
managed by a title company or escrow officer that holds the buyer's deposit and all transaction
funds until every condition has been met. The closing window allows time for:
•   Home inspection — buyer confirms physical condition of the property
•   Appraisal — lender's independent confirmation that the property is worth the loan amount
•   Loan underwriting — lender's final review of the buyer's financials
•   Title search — confirms the seller has clear legal ownership
•   Final paperwork — signing, funding, and recording the deed



📌 When Deals Fall Through
If a contingency is not satisfied — for example, the inspection reveals major structural damage or the
buyer's financing falls through — the deal can be cancelled. When this happens, the property status
reverts to Active in the MLS, often labeled Back on Market (BOM). In your data, you may see a
property with multiple listing records or status changes. This is not a data error — it reflects a real
transaction that failed to close.




Stage 4 — Close
When all contingencies are cleared, escrow closes: funds are transferred, the deed is recorded, and
ownership officially changes hands. CloseDate and ClosePrice are then recorded in the MLS. These
fields only exist in sold records — active listings that never sell will never have these values, which
is a critical structural difference between the listings and sold datasets.

3. List Price vs. Close Price: Why the Difference Matters
This distinction is one of the most important concepts for a real estate data analyst to internalize.

      Field Name             Example Value                             What It Means
ListPrice                  What the seller       Marketing price; reflects seller expectations and agent
                           wants                 strategy
ClosePrice                 What the market       The true transaction value; use this for price trend analysis
                           will pay



The ratio of ClosePrice to ListPrice — often called the sale-to-list ratio — is a key market health
indicator. A ratio above 1.0 (close > list) signals a competitive seller's market. This typically occurs
when multiple buyers submit competing offers simultaneously, driving the final price above asking.
In a bidding war, buyers may also waive contingencies to make their offer more attractive — a
detail not captured in the price fields but visible in days-on-market patterns. A ratio below 1.0
signals buyer leverage or an overpriced listing.

📊 Example Calculation
ListPrice: $875,000 | ClosePrice: $901,000
Sale-to-List Ratio: $901,000 ÷ $875,000 = 1.030 → sold 3% over asking

Aggregate this metric across ZIP codes and time periods and you have a powerful proxy for local
market momentum.




4. Commission Structure and Agent Fields
Real estate commissions are typically 5–6% of the sale price, historically split between the listing
agent (seller's side) and the buyer's agent. Since 2024, NAR settlement changes have altered how
buyer-agent compensation is structured — buyer-agent fees are now negotiated separately rather
than being automatically offered through the MLS.
These agent relationships are captured in your dataset through fields such as:
•   Listing agent: ListAgentFirstName, ListAgentLastName, ListOfficeName
•   Buyer's agent: BuyerAgentFirstName, BuyerAgentLastName, BuyerOfficeName


For analysts, these fields enable brokerage-level performance analysis — which offices close the
most volume, which agents have the highest sale-to-list ratios, and how market share is distributed
across brokerages in a given area.

📌 How Agent Fees Are Actually Paid
Neither the buyer nor the seller pays agent fees upfront. For the seller, the commission is deducted
directly from the sale proceeds at closing — they never write a separate check. For the buyer, the
actual payment also happens at closing, not out of pocket beforehand. Critically, commissions are fully
contingent on the deal closing. If a transaction falls through, neither agent receives anything. This is a
key reason agents are highly motivated to see deals close.




5. Home Financing Basics
Most homebuyers do not pay cash — they finance the purchase with a mortgage. Understanding
how mortgages work helps analysts contextualize price data, affordability trends, and buyer
behavior in the market.

Down Payment
The down payment is the portion of the purchase price the buyer pays upfront out of pocket. The
lender finances the rest. Common down payment amounts are:
•   Low: 3–5% — minimum for conventional loans (requires private mortgage insurance / PMI)
•   Mid: 10% — eliminates some PMI requirements depending on the lender
•    Standard: 20% — the traditional benchmark; eliminates PMI entirely and signals a strong
     buyer
•    High: 25%+ — common in investor purchases or jumbo loans


On a $500,000 home, a 20% down payment is $100,000 — leaving a loan balance (principal) of
$400,000.

Interest Rate & Loan Term
The interest rate determines how much the buyer pays the lender annually to borrow the principal.
The 30-year fixed-rate mortgage is by far the most common loan structure in the U.S. — the rate is
locked for the life of the loan and payments are spread evenly over 360 months. Rates fluctuate
based on Federal Reserve policy, inflation, and bond markets. As a reference point, rates ranged
from roughly 3% (2021) to over 7% (2023–2024).

Monthly Payment Example
The monthly mortgage payment (principal + interest) is calculated using the standard amortization
formula. Here is what a $500,000 home looks like at three common rate scenarios, assuming 20%
down ($400,000 loan):

    Interest Rate      Monthly Payment            Total Interest Paid              Total Cost of Loan
       3.0%                 $1,686                     $207,110                         $607,110
       6.0%                 $2,398                     $463,353                         $863,353
       7.5%                 $2,797                     $607,024                        $1,007,024



💡 Why This Matters for Analysis
The monthly payment is what buyers actually qualify for — not the purchase price. When interest
rates rise from 3% to 7.5%, the monthly payment on the same $400,000 loan increases by over
$1,100. This directly compresses buyer purchasing power and is a primary driver of transaction
volume slowdowns. When you see ClosePrice trends flatten or dip in your data, rising rates are often
the underlying cause.




6. Listings Dataset vs. Sold Dataset
You will work with two related but structurally distinct datasets:

       Field Name           Example Value                             What It Means
Listings dataset          All properties        Includes active, expired, withdrawn, and sold listings. Use
                          entered into MLS      for supply analysis.
Sold dataset              Properties that       Subset of listings. Always has ClosePrice and CloseDate.
                          completed a           Use for price and volume analysis.
                          transaction



7. MLS Status Codes
Every listing in the MLS has a StandardStatus field that tracks where the property is in its lifecycle.
This is one of the most important fields for filtering your data correctly — aggregating across
statuses without filtering will produce misleading results.

         Field Name          Example Value                               What It Means
Active                     Property is live and    Use for current inventory and supply analysis. Days on
                           available               market is actively accumulating.
Pending                    Under contract; not     Offer accepted, purchase agreement signed. Excluded from
                           yet closed              active supply. ClosePrice not yet set.
Closed                     Transaction             ClosePrice and CloseDate are populated. Use for price
                           completed               trend and volume analysis.
Back on Market             Returned to Active      Deal fell through. Property is available again. Watch for
                           after going Pending     these when analyzing DOM — the clock may have reset.
Expired                    Listing term ended      Seller did not renew with agent. Useful for analyzing
                           without a sale          overpriced or hard-to-sell properties.
Withdrawn                  Seller pulled listing   Seller chose to exit the market. May indicate a change in
                           before expiry           seller circumstances.



📌 Analyst Note
When building price trend analyses, always filter to StandardStatus = Closed. When measuring active
inventory, filter to StandardStatus = Active. Mixing statuses — for example, including Pending records
in a price analysis — is a common source of error because Pending records do not yet have a
confirmed ClosePrice.




8. Days on Market (DOM)
Days on Market is one of the most widely used metrics in real estate analytics. It measures how long
a property has been listed before going under contract or selling. It is a direct indicator of demand
— low DOM signals a hot market, high DOM signals soft demand or an overpriced listing.

How It Is Calculated
DOM is typically calculated as the number of calendar days between the ListingContractDate and
either the date the status changed to Pending or the CloseDate, depending on the platform. Some
MLS systems also track Cumulative Days on Market (CDOM), which adds together DOM across
multiple listing periods for the same property — useful for spotting properties that have been
relisted after expiring or falling out of contract.
       Field Name           Example Value                               What It Means
DOM                       Days on Market          Days from listing date to Pending or Close for a single
                                                  listing period
CDOM                      Cumulative Days on      Total days across all listing periods for the same property;
                          Market                  resets only on ownership change



How to Interpret DOM
•   Very Low: 1–7 days: Extremely competitive — likely received multiple offers quickly
•   Low: 8–30 days: Healthy demand — normal for most active markets
•   Average: 31–60 days: Moderate — may reflect seasonal slowdown or slight overpricing
•   High: 60+ days: Weak demand — property may be overpriced, have condition issues, or face
    low buyer interest



9. Property Types
Not all residential properties behave the same way in the market or in the data. The PropertyType
and PropertySubType fields in the MLS distinguish between different structures, and mixing them
in an analysis without filtering can produce misleading results.

        Field Name           Example Value                               What It Means
Single Family              Detached home on       The most common property type. Owner controls the
                           its own lot            land. Typically the highest price per unit. Benchmark for
                                                  most market analyses.
Condo                      Unit within a multi-   Owner holds the interior unit; common areas shared.
                           unit building          Subject to HOA fees. Prices per sq ft differ significantly
                                                  from SFR.
Townhouse                  Attached home,         Shares one or two walls with neighbors. May have a small
                           usually multi-story    yard. Hybrid between SFR and condo in terms of pricing
                                                  and ownership.
Multi-Family               2–4 unit residential   Investor-oriented. Priced on income potential (cap rate)
                           property               as much as comps. Should be analyzed separately from
                                                  owner-occupied types.
Manufactured               Factory-built home     Often lower price points. May not qualify for conventional
                           on leased or owned     financing. Separate market dynamics from site-built
                           land                   homes.



📌 Analyst Note
Always filter by PropertyType before calculating median price, price per sq ft, or DOM. A ZIP code
median that mixes condos and single-family homes will be skewed by the composition of what sold
that month — not just by price movement. For most market trend dashboards, Single Family
Residential (SFR) is the standard benchmark used by analysts and reported by media.
10. The Analytics Workflow
The work you are doing in this course mirrors a real production workflow used at companies like
Zillow, Redfin, CoStar, and regional brokerages. The pipeline has four stages:

       1. Raw API Data        JSON / CSV pulls from CRMLS or third-party data vendors. Fields may be
                              inconsistent, have nulls, or require type coercion.
     2. Python Cleaning       Standardize field types, handle missing values, deduplicate, apply outlier
                              treatment, and engineer features (e.g., price per sq ft, days on market).
    3. Structured Datasets    Clean, analysis-ready tables organized by business object: listings,
                              transactions, agents, offices. These feed downstream tools.
    4. Tableau Dashboards     Interactive visualizations: price trend charts, heat maps by ZIP, agent
                              performance leaderboards, days-on-market distributions.



As you move through this course you will execute every stage of this pipeline: pulling raw MLS data,
cleaning and structuring it in Python, and connecting the output to Tableau for visualization. By the
end, you will have a working, end-to-end analytics workflow — not just a dataset.

11. The Analyst Mindset
Technical skills — SQL, Python, Tableau — are table stakes. What separates a strong analyst from a
capable technician is domain knowledge: understanding where the data comes from, what business
process generated it, and what questions it can and cannot answer.
As you work through this material, keep asking three questions:
•     Context: What does this field actually represent in the real world?
•     Skepticism: Why does this value look the way it does — and when might it be wrong?
•     Purpose: What decision or insight does answering this question enable?
