Property

           GET     /trestle/odata/Property

           GET     /trestle/rets/search?SearchType=Property&Class=Property

                ListingKey is the primary key and uniquely identifies records in the Property resource.

                The following fields are considered InKeyIndex fields and may be queried in batches up to 300,000 at a time: ListingId , Li
                 stingKey , ModificationTimestamp , PhotosChangeTimestamp , PhotosCount , PostalCode , StandardStatus .

    Fields

      Field                                           Type                               Size    Description

                                                                                                 Finished area within the structure that is at or above the
      AboveGradeFinishedArea                          Decimal                            14.2    surface of the ground.

                                                                                                 The source of the measurements. This is a pick list of
      AboveGradeFinishedAreaSource                    AreaSource Enum                            options showing the source of the measurement. i.e. Agent,
                                                                                                 Assessor, Estimate, etc.

                                                                                                 A pick list of the unit of measurement for the area (e.g.,
      AboveGradeFinishedAreaUnits                     AreaUnits Enum                             Square Feet, Square Meters).

                                                                                                 Unfinished area within the structure that is at or above the
      AboveGradeUnfinishedArea                        Decimal                            14.2    surface of the ground.

                                                                                                 The source of the measurements of the unfinished area
      AboveGradeUnfinishedAreaSource                  AreaSource Enum                            above grade. This is a pick list of options showing the source
                                                                                                 of the measurement (e.g., Agent, Assessor, Estimate).

                                                                                                 A pick list of the unit of measurement for the unfinished
      AboveGradeUnfinishedAreaUnits                   AreaUnits Enum
                                                                                                 area above grade (e.g., Square Feet, Square Meters).

                                                                                                 If the property is located behind an unmanned security gate
      AccessCode                                      String                               25    such as in a Gated Community, what is the code to gain
                                                                                                 access through the secured gate.

                                                                                                 A list or description of the accessibility features included in
      AccessibilityFeatures                           AccessibilityFeatures Enum
                                                                                                 the sale/lease.

      ActivationDate                                  DateTime                                   Expresses when the listing agent intends to change the
                                                                                                 property to the Active status.

                                                                                                 If additional parcels are included in the sale, a list of those
                                                                                                 parcel's IDs separated by commas. Do not include the first
      AdditionalParcelsDescription                    String                              255    or primary parcel number, that should be located in the
                                                                                                 Parcel Number field.

      AdditionalParcelsYN                           Boolean                                 Are there more than one parcel or lot included in the sale?

                                                                                            The main or most notable tenants as well as other tenants
      AnchorsCoTenants                              String                           1024   of the shopping center or mall in which the commercial
                                                                                            property is located.

                                                                                            A list of the appliances that will be included in the sale/lease
      Appliances                                    Appliances Enum
                                                                                            of the property.

                                                                                            A list describing the style of the structure. For example,
      ArchitecturalStyle                            ArchitecturalStyle Enum
                                                                                            Victorian, Ranch, Craftsman, etc.

                                                                                            Amenities provided by the Home Owners Association,
      AssociationAmenities                          AssociationAmenities Enum
                                                                                            Mobile Park or Complex. For example Pool, Clubhouse, etc.

                                                                                            A fee paid by the homeowner to the Home Owners
      AssociationFee                                Decimal                          14.2   Association which is used for the upkeep of the common
                                                                                            area, neighborhood or other association related benefits.

                                                                                            A fee paid by the homeowner to the second of two Home
                                                                                            Owners Associations, which is used for the upkeep of the
      AssociationFee2                               Decimal                          14.2
                                                                                            common area, neighborhood or other association related
                                                                                            benefits.

                                                                                            The frequency the association fee is paid. For example,
      AssociationFee2Frequency                      FeeFrequency Enum                       Weekly, Monthly, Annually, Bi-Monthly, One Time, etc.

      AssociationFee3                               Decimal                          14.2   AssociationFee3

      AssociationFee3Frequency                      FeeFrequency Enum                       AssociationFee3Frequency

      AssociationFeeFrequency                       FeeFrequency Enum                       The frequency the association fee is paid. For example,
                                                                                            Weekly, Monthly, Annually, Bi-Monthly, One Time, etc.

      AssociationFeeIncludes                        AssociationFeeIncludes Enum             Services included with the association fee. For example
                                                                                            Landscaping, Trash, Water, etc.

      AssociationName                               String                            50    The name of the Home Owners Association.

      AssociationName2                              String                            50    The name of the second of two Home Owners Association.

                                                                                            The phone number of the Home Owners Association. North
                                                                                            American 10 digit phone numbers should be in the format
      AssociationPhone                              String                            16    of ###-###-#### (separated by hyphens). Other
                                                                                            conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            The phone number of the second of two Home Owners
                                                                                            Association. North American 10 digit phone numbers should
      AssociationPhone2                             String                            16    be in the format of ###-###-#### (separated by hyphens).
                                                                                            Other conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            Is there a Home Owners Association. A separate Y/N field is
      AssociationYN                                 Boolean                                 needed because not all associations have dues.

                                                                                            A flag indicating that a garage is attached to the
                                                                                            main/primary dwelling. If more than one garage structure
      AttachedGarageYN                              Boolean                                 exists, this field would be set to Yes if any of the garage
                                                                                            structures were attached to the main structure.

      AttributionContact                            String                           120    AttributionContact

                                                                                            The date the property will be available for
      AvailabilityDate                              DateTime                                possession/occupation.

                                                                                            Information about the available types of lease for the
      AvailableLeaseType                            ExistingLeaseType Enum                  property (i.e., Net, NNN, NN, Gross, Absolute Net, Escalation
                                                                                            Clause, Ground Lease, etc.).

                                                                                            The date a listing, which had previously gone off market,
      BackOnMarketDate                              DateTime                                went back to being on market. This date typically will reflect
                                                                                            contractual dates. System timestamp should leverage the
                                                                                            term Timestamp rather than Date in the field name.

                                                                                            A list of information and features about the basement. i.e.
      Basement                                      Basement Enum                           None/Slab, Finished, Partially Finished, Crawl Space, Dirt,
                                                                                            Outside Entrance, Radon Mitigation

      BasementYN                                    Boolean                                 Does the property have a basement?

                                                                                            A room containing all 4 of the 4 elements constituting a
                                                                                            bath, which are; Toilet, Sink, Bathtub or Shower Head. A Full
                                                                                            Bath will typically contain four elements; Sink, Toilet, Tub and
                                                                                            Shower Head (in tub or stall). However, some may
      BathroomsFull                                 Int32                              4    considered a Sink, Toilet and Tub (without a shower) a Full
                                                                                            Bath, others consider this to be a Three Quarter Bath. In the
                                                                                            event that BathroomsThreeQuarter is not in use, this field
                                                                                            may represent the sum of all Full and Three Quarter
                                                                                            bathrooms.

                                                                                            A room containing 2 of the 4 elements constituting a bath,
      BathroomsHalf                                 Int32                              4    which are; Toilet, Sink, Bathtub or Shower Head. A Half Bath
                                                                                            will typically contain a Sink and Toilet.

                                                                                            A room containing 1 of the 4 elements constituting a bath
                                                                                            which are; Toilet, Sink, Bathtub or Shower Head. Examples
      BathroomsOneQuarter                           Int32                              4    are a vanity with a sink or a WC (Water Closet, which is a
                                                                                            room with only a toilet).

                                                                                            The number of partial bathrooms in the property being
                                                                                            sold/leased. When used in combination with the
                                                                                            BathroomsFull field, this replaces (or is the sum of) all Half
      BathroomsPartial                              Int32                              4    and One Quarter bathrooms; and in the event
                                                                                            BathroomsThreeQuarter is not used, BathroomsFull
                                                                                            replaces (or is the sum of) all Full and Three Quarter baths.
                                                                                            This field should not be used in combination with the
                                                                                            BathroomsOneQuarter or the BathroomsHalf.

                                                                                            A room containing 3 of the 4 elements constituting a bath,
                                                                                            which are; Toilet, Sink, Bathtub or Shower Head. A typical
                                                                                            Three Quarter Bath will contain Sink, Toilet and Shower.
      BathroomsThreeQuarter                         Int32                              4    Some may considered a Sink, Toilet and Tub (without a
                                                                                            shower) a Three Quarter Bath, others consider this to be a
                                                                                            Full Bath.

                                                                                            The simple sum of the number of bathrooms. For example
                                                                                            for a property with two Full Bathrooms and one Half
      BathroomsTotalInteger                         Int32                              4    Bathroom, the Bathrooms Total Integer will be 3. Expressing
                                                                                            this example as 2.5, you will need to use a non-standard
                                                                                            field name. Decimal based bathrooms are not
                                                                                            recommended but possible via the Dictionary's extensibility.

                                                                                            The sum of BedroomsTotal plus other rooms that may be
      BedroomsPossible                              Int32                              4    used as a bedroom but are not defined as bedroom per
                                                                                            local policy.

      BedroomsTotal                                 Int32                              4    The total number of bedrooms in the dwelling.

      BelowGradeFinishedArea                        Decimal                          14.2   Finished area within the structure that is below ground.

                                                                                            The source of the measurements. This is a pick list of
      BelowGradeFinishedAreaSource                  AreaSource Enum                         options showing the source of the measurement. i.e. Agent,
                                                                                            Assessor, Estimate, etc.

      BelowGradeFinishedAreaUnits                   AreaUnits Enum                          A pick list of the unit of measurement for the area. i.e.
                                                                                            Square Feet, Square Meters, Acres, etc.

      BelowGradeUnfinishedArea                      Decimal                          14.2   Unfinished area within the structure that is below the
                                                                                            surface of the ground.

                                                                                            The source of the measurements of the unfinished area
                                                                                            below grade. This is a pick list of options showing the source
      BelowGradeUnfinishedAreaSource                AreaSource Enum                         of the measurement (e.g., Agent, Assessor, Estimate).

      BelowGradeUnfinishedAreaUnits                 AreaUnits Enum                          A pick list of the unit of measurement for the unfinished
                                                                                            area below grade (e.g., Square Feet, Square Meters).

      BodyType                                      BodyType Enum                           Type of mobile home.

      BuilderModel                                  String                            50    The builders model name or number for the property.

      BuilderName                                   String                            50    Name of the builder of the property or builder's tract.

                                                                                            The source of the measurements. This is a pick list of
      BuildingAreaSource                            AreaSource Enum                         options showing the source of the measurement. i.e. Agent,
                                                                                            Assessor, Estimate, etc.

      BuildingAreaTotal                             Decimal                          14.2   Total area of the structure. Includes both finished and
                                                                                            unfinished areas.

      BuildingAreaUnits                             AreaUnits Enum                          A pick list of the unit of measurement for the area. i.e.
                                                                                            Square Feet, Square Meters, Acres, etc.

      BuildingFeatures                              BuildingFeatures Enum                   Features or amenities of the building or business park.

      BuildingName                                  String                            50    Name of the building or business park.

      BusinessName                                  String                           255    Name of the business being sold.

      BusinessType                                  BusinessType Enum                       The type of business being sold. Retail, Wholesale, Grocery,
                                                                                            Food & Bev, etc.

      BuyerAgentAOR                                 AOR Enum                                The Buyer's Agent's Board or Association of REALTORS.

                                                                                            Designations and certifications acknowledging experience
      BuyerAgentDesignation                         BuyerAgentDesignation Enum              and expertise in various real estate sectors are awarded by
                                                                                            NAR and each affiliated group upon completion of required
                                                                                            courses.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentDirectPhone                         String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      BuyerAgentEmail                               String                            80    The email address of the Buyer's Agent.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentFax                                 String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      BuyerAgentFirstName                           String                            50    The first name of the buyer's agent.

      BuyerAgentFullName                            String                           150    The full name of the buyer's agent. (First Middle Last)

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentHomePhone                           String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
      BuyerAgentKey                                 String                            20    system that the record was just retrieved. This may be
                                                                                            identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Member resource's MemberKey.

      BuyerAgentKeyNumeric                          Int32                              4    BuyerAgentKeyNumeric

      BuyerAgentLastName                            String                            50    The last name of the buyer's agent.

      BuyerAgentMiddleName                          String                            50    The middle name of the buyer's agent.

                                                                                            The local, well-known identifier. This value may not be
      BuyerAgentMlsId                               String                            25    unique, specifically in the case of aggregation systems, this
                                                                                            value should be the identifier from the original system.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentMobilePhone                         String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      BuyerAgentNamePrefix                          String                            10    Prefix to the name (e.g. Dr. Mr. Ms. etc.)

      BuyerAgentNameSuffix                          String                            10    Suffix to the BuyerAgentLastName (e.g. Esq., Jr., III etc.)

      BuyerAgentNationalAssociationId               String                            30    The national association ID of the buyer's agent (e.g., the
                                                                                            NRDS number in the U.S.).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentOfficePhone                         String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      BuyerAgentOfficePhoneExt                      String                            10    The extension of the given phone number (if applicable).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentPager                               String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentPreferredPhone                      String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      BuyerAgentPreferredPhoneExt                   String                            10    The extension of the given phone number (if applicable).

                                                                                            The license of the buyers agent. Separate multiple licenses
      BuyerAgentStateLicense                        String                            50    with a comma and space.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentTollFreePhone                       String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      BuyerAgentURL                                 String                           8000   The website URI of the buyers agent.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerAgentVoiceMail                           String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      BuyerAgentVoiceMailExt                        String                            10    The extension of the given phone number (if applicable).

      BuyerBrokerageCompensation                    String                            50    The total commission to be paid for this sale, expressed as
                                                                                            either a percentage or a constant currency amount.

                                                                                            A list of types to clarify the value entered in the
      BuyerBrokerageCompensationType                CompensationType Enum                   BuyerBrokerageCompensation field. For example, $, % or
                                                                                            some other clarification of the BuyerAgencyCompensation
                                                                                            field.

                                                                                            A list of options that describe the type of financing used. This
      BuyerFinancing                                BuyerFinancing Enum                     field is used when setting a listing to Closed. i.e. cash, FHA
                                                                                            loan, etc.

      BuyerOfficeAOR                                AOR Enum                                The buyer's office's board or association of REALTORS®.

      BuyerOfficeEmail                              String                            80    The email address of the Buyer's Office.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerOfficeFax                                String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
                                                                                            system that the record was just retrieved. This may be
      BuyerOfficeKey                                String                            20    identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Office resource's OfficeKey.

      BuyerOfficeKeyNumeric                         Int32                              4    BuyerOfficeKeyNumeric

                                                                                            The local, well-known identifier. This value may not be
      BuyerOfficeMlsId                              String                            25    unique, specifically in the case of aggregation systems, this
                                                                                            value should be the identifier from the original system.

      BuyerOfficeName                               String                           255    The legal name of the brokerage representing the buyer.

      BuyerOfficeNationalAssociationId              String                            30    The national association ID of the buyer's office (e.g., the
                                                                                            NRDS number in the U.S.).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      BuyerOfficePhone                              String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      BuyerOfficePhoneExt                           String                            10    The extension of the given phone number (if applicable).

      BuyerOfficeURL                                String                           8000   The website URI for the buyers office.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
                                                                                            system that the record was just retrieved. This may be
      BuyerTeamKey                                  String                           255    identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Teams resource's TeamKey.

      BuyerTeamKeyNumeric                           Int32                              4    BuyerTeamKeyNumeric

      BuyerTeamName                                 String                            50    The name of the team representing the buyer.

      CableTvExpense                                Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

                                                                                            Date the listing contract between the seller and listing agent
      CancellationDate                              DateTime                                was cancelled. This is the date entered by the agent
                                                                                            reflecting when the change occurred contractually, not a
                                                                                            timestamp of when the change was made in the MLS.

                                                                                            Cap Rate is equivalent to the return on investment you
                                                                                            would receive if you pay cash for a property. The ratio
      CapRate                                       Decimal                           5.2   between the net operating income produced by an asset
                                                                                            and its capital cost (the original price paid to buy the asset)
                                                                                            or alternatively its current market value.

      CarportSpaces                                 Decimal                          14.2   The number of carport spaces included in the sale.

                                                                                            A flag indicating that the listing has a car port. This flag may
      CarportYN                                     Boolean                                 be T/F, Y/N or other true, false or unknown indicator. As with
                                                                                            all flags, the field may be null.

                                                                                            The group of addresses to which the USPS assigns the same
      CarrierRoute                                  String                             9    code to aid in mail delivery. For the USPS, these codes are 9
                                                                                            digits: 5 numbers for the ZIP Code, one letter for the carrier
                                                                                            route type, and 3 numbers for the carrier route number.

      City                                          String                            50    The city in listing address.

                                                                                            A sub-section or area of a defined city. Examples would be

      CityRegion                                    String                           150    SOHO in New York, NY, Ironbound in Newark, NJ or Inside
                                                                                            the Beltway.

      CLIP                                          Int64                             10    CLIP

                                                                                            With for-sale listings, the date the purchase agreement was
                                                                                            fulfilled. With lease listings, the date the requirements were
      CloseDate                                     DateTime                                fulfilled, such as contract and/or deposit. This is the date
                                                                                            entered by the agent reflecting when the change occurred
                                                                                            contractually, not a timestamp of when the change was
                                                                                            made in the MLS.

      ClosePrice                                    Decimal                          14.2   The amount of money paid by the purchaser to the seller for
                                                                                            the property under the agreement.

      CoBuyerAgentAOR                               AOR Enum                                The Co Buyer's Agent's Board or Association of REALTORS.

                                                                                            Designations and certifications acknowledging experience
      CoBuyerAgentDesignation                       CoBuyerAgentDesignation                 and expertise in various real estate sectors are awarded by
                                                    Enum                                    NAR and each affiliated group upon completion of required
                                                                                            courses.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentDirectPhone                       String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoBuyerAgentEmail                             String                            80    The email address of the Buyer's Co Agent.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentFax                               String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoBuyerAgentFirstName                         String                            50    The first name of the buyer's co-agent.

      CoBuyerAgentFullName                          String                           150    The full name of the buyer's co-agent. (First Middle Last)

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentHomePhone                         String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
      CoBuyerAgentKey                               String                            20    system that the record was just retrieved. This may be
                                                                                            identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Member resource's MemberKey.

      CoBuyerAgentKeyNumeric                        Int32                              4    CoBuyerAgentKeyNumeric

      CoBuyerAgentLastName                          String                            50    The last name of the buyer's co-agent.

      CoBuyerAgentMiddleName                        String                            50    The middle name of the buyer's co-agent.

                                                                                            The local, well-known identifier. This value may not be
      CoBuyerAgentMlsId                             String                            25    unique, specifically in the case of aggregation systems, this
                                                                                            value should be the identifier from the original system.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentMobilePhone                       String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoBuyerAgentNamePrefix                        String                            10    Prefix to the name (e.g. Dr. Mr. Ms. etc.)

      CoBuyerAgentNameSuffix                        String                            10    Suffix to the CoBuyerAgentLastName (e.g. Esq., Jr., III etc.)

      CoBuyerAgentNationalAssociationId             String                            30    The national association ID of the co-buyer's agent (e.g., the
                                                                                            NRDS number in the U.S.).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentOfficePhone                       String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoBuyerAgentOfficePhoneExt                    String                            10    The extension of the given phone number (if applicable).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentPager                             String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentPreferredPhone                    String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoBuyerAgentPreferredPhoneExt                 String                            10    The extension of the given phone number (if applicable).

      CoBuyerAgentStateLicense                      String                            50    The license of the co-buyers agent. Separate multiple
                                                                                            licenses with a comma and space.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentTollFreePhone                     String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoBuyerAgentURL                               String                           8000   The website URI of the co-buyers agent.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerAgentVoiceMail                         String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoBuyerAgentVoiceMailExt                      String                            10    The extension of the given phone number (if applicable).

      CoBuyerOfficeAOR                              AOR Enum                                The Co Buyer's Office's Board or Association of REALTORS.

      CoBuyerOfficeEmail                            String                            80    The email address of the Buyer's Co Office.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoBuyerOfficeFax                              String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
      CoBuyerOfficeKey                              String                            20    system that the record was just retrieved. This may be
                                                                                            identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Office resource's OfficeKey.

      CoBuyerOfficeKeyNumeric                       Int32                              4    CoBuyerOfficeKeyNumeric

                                                                                            The local, well-known identifier. This value may not be
      CoBuyerOfficeMlsId                            String                            25    unique, specifically in the case of aggregation systems, this
                                                                                            value should be the identifier from the original system.

      CoBuyerOfficeName                             String                           255    The legal name of the brokerage co-representing the buyer.

      CoBuyerOfficeNationalAssociationId            String                            30    The national association ID of the co-buyer's office (e.g., the
                                                                                            NRDS number in the U.S.).

                                                                                            North American 10 digit phone numbers should be in the

      CoBuyerOfficePhone                            String                            16    format of ###-###-#### (separated by hyphens). Other
                                                                                            conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoBuyerOfficePhoneExt                         String                            10    The extension of the given phone number (if applicable).

      CoBuyerOfficeURL                              String                           8000   The website URI for the co-buyers office.

      CoListAgent2AOR                               AOR Enum                                CoListAgent2AOR

      CoListAgent2DirectPhone                       String                            16    CoListAgent2DirectPhone

      CoListAgent2Email                             String                            80    CoListAgent2Email

      CoListAgent2FirstName                         String                            50    CoListAgent2FirstName

      CoListAgent2FullName                          String                           150    CoListAgent2FullName

      CoListAgent2HomePhone                         String                            16    CoListAgent2HomePhone

      CoListAgent2Key                               String                            50    CoListAgent2Key

      CoListAgent2LastName                          String                            50    CoListAgent2LastName

      CoListAgent2MiddleName                        String                            50    CoListAgent2MiddleName

      CoListAgent2MlsId                             String                            25    CoListAgent2MlsId

      CoListAgent2MobilePhone                       String                            16    CoListAgent2MobilePhone

      CoListAgent2NationalAssociationId             String                            30    CoListAgent2NationalAssociationId

      CoListAgent2Nickname                          String                           100    CoListAgent2Nickname

      CoListAgent2OfficePhone                       String                            16    CoListAgent2OfficePhone

      CoListAgent2PreferredPhone                    String                            16    CoListAgent2PreferredPhone

      CoListAgent2StateLicense                      String                            50    CoListAgent2StateLicense

      CoListAgent2URL                               String                           8000   CoListAgent2URL

      CoListAgent3AOR                               AOR Enum                                CoListAgent3AOR

      CoListAgent3DirectPhone                       String                            16    CoListAgent3DirectPhone

      CoListAgent3Email                             String                            80    CoListAgent3Email

      CoListAgent3FirstName                         String                            50    CoListAgent3FirstName

      CoListAgent3FullName                          String                           150    CoListAgent3FullName

      CoListAgent3HomePhone                         String                            16    CoListAgent3HomePhone

      CoListAgent3Key                               String                            50    CoListAgent3Key

      CoListAgent3LastName                          String                            50    CoListAgent3LastName

      CoListAgent3MiddleName                        String                            50    CoListAgent3MiddleName

      CoListAgent3MlsId                             String                            25    CoListAgent3MlsId

      CoListAgent3MobilePhone                       String                            16    CoListAgent3MobilePhone

      CoListAgent3NationalAssociationId             String                            30    CoListAgent3NationalAssociationId

      CoListAgent3Nickname                          String                           100    CoListAgent3Nickname

      CoListAgent3OfficePhone                       String                            16    CoListAgent3OfficePhone

      CoListAgent3PreferredPhone                    String                            16    CoListAgent3PreferredPhone

      CoListAgent3StateLicense                      String                            50    CoListAgent3StateLicense

      CoListAgent3URL                               String                           8000   CoListAgent3URL

      CoListAgentAOR                                AOR Enum                                The Co Listing Agent's Board or Association of REALTORS.

                                                                                            Designations and certifications acknowledging experience
      CoListAgentDesignation                        CoListAgentDesignation                  and expertise in various real estate sectors are awarded by
                                                    Enum                                    NAR and each affiliated group upon completion of required
                                                                                            courses.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentDirectPhone                        String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoListAgentEmail                              String                            80    The email address of the Co Listing Agent.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentFax                                String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoListAgentFirstName                          String                            50    The first name of the co-listing agent.

      CoListAgentFullName                           String                           150    The full name of the co-listing agent. (First Middle Last)

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentHomePhone                          String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
      CoListAgentKey                                String                            20    system that the record was just retrieved. This may be
                                                                                            identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Member resource's MemberKey.

      CoListAgentKeyNumeric                         Int32                              4    CoListAgentKeyNumeric

      CoListAgentLastName                           String                            50    The last name of the co-listing agent.

      CoListAgentMiddleName                         String                            50    The middle name of the co-listing agent.

                                                                                            The local, well-known identifier. This value may not be
      CoListAgentMlsId                              String                            25    unique, specifically in the case of aggregation systems, this
                                                                                            value should be the identifier from the original system.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentMobilePhone                        String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoListAgentNamePrefix                         String                            10    Prefix to the name (e.g. Dr. Mr. Ms. etc.)

      CoListAgentNameSuffix                         String                            10    Suffix to the CoListAgentLastName (e.g. Esq., Jr., III etc.)

      CoListAgentNationalAssociationId              String                            30    The national association ID of the co-listing agent (e.g., the
                                                                                            NRDS number in the U.S.).

      CoListAgentNickname                           String                           100    CoListAgentNickname

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentOfficePhone                        String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoListAgentOfficePhoneExt                     String                            10    The extension of the given phone number (if applicable).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentPager                              String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentPreferredPhone                     String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoListAgentPreferredPhoneExt                  String                            10    The extension of the given phone number (if applicable).

      CoListAgentStateLicense                       String                            50    The license of the co-listing agent. Separate multiple licenses
                                                                                            with a comma and space.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentTollFreePhone                      String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoListAgentURL                                String                           8000   The website URI of the co-listing agent.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListAgentVoiceMail                          String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoListAgentVoiceMailExt                       String                            10    The extension of the given phone number (if applicable).

      CoListOffice2AOR                              AOR Enum                                CoListOffice2AOR

      CoListOffice2Email                            String                            80    CoListOffice2Email

      CoListOffice2Key                              String                            50    CoListOffice2Key

      CoListOffice2MlsId                            String                            25    CoListOffice2MlsId

      CoListOffice2Name                             String                           255    CoListOffice2Name

      CoListOffice2Phone                            String                            16    CoListOffice2Phone

      CoListOffice2URL                              String                           8000   CoListOffice2URL

      CoListOfficeAOR                               AOR Enum                                The Co Listing Office's Board or Association of REALTORS.

      CoListOfficeEmail                             String                            80    The email address of the Co Listing Office.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListOfficeFax                               String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
                                                                                            system that the record was just retrieved. This may be
      CoListOfficeKey                               String                            20    identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Office resource's OfficeKey.

      CoListOfficeKeyNumeric                        Int32                              4    CoListOfficeKeyNumeric

                                                                                            The local, well-known identifier. This value may not be
      CoListOfficeMlsId                             String                            25    unique, specifically in the case of aggregation systems, this
                                                                                            value should be the identifier from the original system.

      CoListOfficeName                              String                           255    The legal name of the brokerage co-representing the seller.

      CoListOfficeNationalAssociationId             String                            30    The national association ID of the co-listing office (e.g., the
                                                                                            NRDS number in the U.S.).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      CoListOfficePhone                             String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      CoListOfficePhoneExt                          String                            10    The extension of the given phone number (if applicable).

      CoListOfficeURL                               String                           8000   The website URI for the co-listing office.

                                                                                            Common Interest is a type of ownership in a property that is
                                                                                            composed of an individual lot or unit and a share of the
      CommonInterest                                CommonInterest Enum                     ownership or use of common areas. A Common Interest
                                                                                            Development (CID) is usually governed by a recorded set of
                                                                                            Covenants, Conditions & Restrictions (CC&Rs).

                                                                                            A multi select list with options like 1 Common Wall, 2
                                                                                            Common Walls, No Common Walls, No One Above, No One
      CommonWalls                                   CommonWalls Enum                        Below. Implementation should include rules preventing
                                                                                            illogical selection combinations and to ensure consistency
                                                                                            with the Property Attached Y/N field.

      CommunityFeatures                             CommunityFeatures Enum                  A list of features related to, or available within, the
                                                                                            community.

      CompensationComments                          String                           255    CompensationComments

      CompSaleYN                                    Boolean                                 Indicates whether or not this sale was entered for
                                                                                            comparative purposes.

      Concessions                                   Concessions Enum                        Are there concessions included in the sales agreement? Yes,
                                                                                            No or Call Listing Agent

                                                                                            The dollar amount of the concessions. If the concessions are
                                                                                            made by the seller, some may subtract this value from the
                                                                                            sales price as a means of calculating their own true price. If
                                                                                            concessions are made by the buyer, some may add this
      ConcessionsAmount                             Int32                              4    amount to the sale price to create their own true price.
                                                                                            Concessions made by both buyer and seller should be
                                                                                            subtracted from each other providing a net value. Details of
                                                                                            this calculation should be added to the Concessions
                                                                                            Comments field.

      ConcessionsComments                           String                           200    Comments describing the concessions made by the buyer
                                                                                            or the seller.

      ConstructionMaterials                         ConstructionMaterials Enum              A list of the materials that were used in the construction of
                                                                                            the property.

      ContinentRegion                               String                           150    A sub-section or area of a continent. Examples would be
                                                                                            Southern Europe or Scandinavia.

      Contingency                                   String                           1024   A list of contingencies that must be satisfied in order to
                                                                                            complete the transaction.

                                                                                            The date an offer was made with a contingency. The Listing
                                                                                            remains On Market. This is the date entered by the agent
      ContingentDate                                DateTime                                reflecting when the change occurred contractually, not a
                                                                                            timestamp of when the change was made in the MLS.

                                                                                            The date of the listings contractual status change. This is not
      ContractStatusChangeDate                      DateTime                                necessarily the time the agent made the change in the MLS

                                                                                            system, but rather the date of the contractual change.

      Cooling                                       Cooling Enum                            A list describing the cooling or air conditioning features of
                                                                                            the property.

      CoolingYN                                     Boolean                                 The property has cooling or Air Conditioning.

      CopyrightNotice                               String                           500    Notice of the legal rights of the owner of the information or
                                                                                            data.

      Country                                       Country Enum                            The country abbreviation in a postal address.

      CountryRegion                                 String                           150    A sub-section or area of a defined country. Examples would
                                                                                            be Napa Valley in the US, or the Amalfi Coast in Italy.

      CountyOrParish                                String                            50    The County, Parish or other regional authority

      CoveredSpaces                                 Decimal                          14.2   The total number of garage and carport spaces.

      CropsIncludedYN                               Boolean                                 Are crops included in the sale of the property.

      CrossStreet                                   String                            50    Nearest cross streets to the property. This field is in addition
                                                                                            to, and independent of, the driving directions field.

      CultivatedArea                                Decimal                          14.2   Measurement or percentage of the property that has been
                                                                                            cultivated.

      CumulativeDaysOnMarket                        Int32                              4    The number of days the property is on market, as defined by
                                                                                            the MLS business rules.

                                                                                            A list of options that describe the type of financing that the
      CurrentFinancing                              CurrentFinancing Enum                   seller currently has in place for the property being sold. i.e.
                                                                                            cash, assumable, FHA loan, etc.

      CurrentPrice                                  Decimal                          14.2   CurrentPrice

                                                                                            A list of the type(s) of current use of the property. The
      CurrentUse                                    CurrentOrPossibleUse Enum               current use of the property is an important factor in
                                                                                            understanding the overall condition of the land and
                                                                                            determining it's appropriateness for intended use.

      DaysOnMarket                                  Int32                              4    The number of days the listing is on market, as defined by
                                                                                            the MLS business rules.

      DaysOnMarketReplication                       Int32                              4    DaysOnMarketReplication

      DaysOnMarketReplicationDate                   DateTime                                DaysOnMarketReplicationDate

      DaysOnMarketReplicationIncreasingYN           Boolean                                 DaysOnMarketReplicationIncreasingYN

                                                                                            A list of the Development Status of the property. The
      DevelopmentStatus                             DevelopmentStatus Enum                  developmental status of land is an important factor in
                                                                                            selling, purchasing and developing of land properties.

                                                                                            The compass direction that the main entrance to the
      DirectionFaces                                DirectionFaces Enum                     building faces. For example, North, South, East, West, South-
                                                                                            West, etc. It may also be known as the building exposure.

      Directions                                    String                           1024   Driving directions to the property.

      Disclaimer                                    String                           500    Text that serves as the negation or limitation of the rights
                                                                                            under a warranty given by a seller to a buyer.

      Disclosures                                   Disclosures Enum                        Legal or pertinent information that should be disclosed to
                                                                                            potential buyer's agents.

      DistanceToBusComments                         String                           255    A textual description of the distance to local bus stops.

      DistanceToBusNumeric                          Int32                              4    Numeric distance from the property to the nearest bus stop.

      DistanceToBusUnits                            LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                           yards, kilometers, miles, etc.

      DistanceToElectricComments                    String                           255   If the property does not currently have electrical utility, is
                                                                                           service available and if so, what is the distance.

      DistanceToElectricNumeric                     Int32                             4    Numeric distance from the property to the electrical utility.

      DistanceToElectricUnits                       LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                           yards, kilometers, miles, etc.

      DistanceToFreewayComments                     String                           255   A textual description of the distance to freeways.

      DistanceToFreewayNumeric                      Int32                             4    Numeric distance from the property to the nearest freeway.

      DistanceToFreewayUnits                        LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                           yards, kilometers, miles, etc.

      DistanceToGasComments                         String                           255   If the property does not currently have natural gas utility, is
                                                                                           service available and if so, what is the distance.

      DistanceToGasNumeric                          Int32                             4    Numeric distance from the property to the gas utility.

      DistanceToGasUnits                            LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                           yards, kilometers, miles, etc.

      DistanceToPhoneServiceComments                String                           255   If the property does not currently have phone service, is
                                                                                           service available and if so, what is the distance.

      DistanceToPhoneServiceNumeric                 Int32                             4    Numeric distance from the property to the phone utility.

      DistanceToPhoneServiceUnits                   LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feet, meters,
                                                                                           yards, kilometers, miles, etc.

      DistanceToPlaceofWorshipComments              String                           255   A textual description of the distance to local places of
                                                                                           worship.

      DistanceToPlaceofWorshipNumeric               Int32                             4    Numeric distance from the property to the nearest place of
                                                                                           worship.

      DistanceToPlaceofWorshipUnits                 LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                           yards, kilometers, miles, etc.

      DistanceToSchoolBusComments                   String                           255   Distance from the property to the nearest school bus pickup
                                                                                           point.

      DistanceToSchoolBusNumeric                    Int32                             4    Numeric distance from the property to the nearest school
                                                                                           bus pickup point.

      DistanceToSchoolBusUnits                      LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                           yards, kilometers, miles, etc.

      DistanceToSchoolsComments                     String                           255   A textual description of the distance to local schools.

      DistanceToSchoolsNumeric                      Int32                             4    Numeric distance from the property to the nearest school.

      DistanceToSchoolsUnits                        LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                           yards, kilometers, miles, etc.

      DistanceToSewerComments                       String                           255   If the property does not currently have sewer or septic, is
                                                                                           sewer service available and if so, what is the distance.

      DistanceToSewerNumeric                        Int32                             4    Numeric distance from the property to the sewer utility.

      DistanceToSewerUnits                          LinearUnits Enum                       A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                           yards, kilometers, miles, etc.

                                                                                           A description of the distance to primary shopping sources
      DistanceToShoppingComments                    String                           255   such as groceries, gasoline, clothing or department stores.

      DistanceToShoppingNumeric                     Int32                              4    Numeric distance from the property to the nearest
                                                                                            shopping.

      DistanceToShoppingUnits                       LinearUnits Enum                        A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                            yards, kilometers, miles, etc.

                                                                                            If the property does not have a maintained road or street
      DistanceToStreetComments                      String                           255    adjacent to the lot, what are the conditions of access and
                                                                                            distance to a maintained road.

      DistanceToStreetNumeric                       Int32                              4    Numeric distance from the property to the street.

                                                                                            A pick list of the unit linear measurement. i.e. feed, meters,
      DistanceToStreetUnits                         LinearUnits Enum                        yards, kilometers, miles, etc.

      DistanceToWaterComments                       String                           255    If the property does not currently have water utility, is service
                                                                                            available and if so, what is the distance.

      DistanceToWaterNumeric                        Int32                              4    Numeric distance from the property to the water utility.

      DistanceToWaterUnits                          LinearUnits Enum                        A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                            yards, kilometers, miles, etc.

                                                                                            A list of the Documents available for the property. Knowing
      DocumentsAvailable                            DocumentsAvailable Enum                 what documents are available for the property is valuable
                                                                                            information.

      DocumentsChangeTimestamp                      DateTimeOffset                          System generated timestamp of when the last update or
                                                                                            change to the documents for this listing was made.

      DocumentsCount                                Int32                              4    The total number of documents or supplements included
                                                                                            with the listings.

                                                                                            Department of Housing decal number for the mobile or
      DOH1                                          String                            25    manufactured home. For the first or only unit/section use
                                                                                            DOH 1 over DOH 2 or 3.

                                                                                            Department of Housing decal number for the mobile or
      DOH2                                          String                            25    manufactured home. For two units/sections use DOH 1 and
                                                                                            2 over DOH 3.

                                                                                            Department of Housing decal number for the mobile or
      DOH3                                          String                            25    manufactured home. For two units/sections use DOH 1 and
                                                                                            2 over DOH 3.

      DoorFeatures                                  DoorFeatures Enum                       A list of features or description of the doors included in the
                                                                                            sale/lease.

                                                                                            A commission arrangement in which the seller agrees to pay
                                                                                            a specified commission to the listing broker if the property is
      DualOrVariableRateCommissionYN                Boolean                                 sold through the efforts of a cooperating broker. The seller
                                                                                            pays the listing broker a different commission amount if
                                                                                            there is no cooperating broker involved in the sale or the
                                                                                            sale occurs due to the efforts of the seller directly.

      DualVariableCompensationYN                    Boolean                                 DualVariableCompensationYN

                                                                                            A list of electric-service related features of the property (e.g.
      Electric                                      Electric Enum                           110 Volt, 3 Phase, 220 Volt, RV Hookup). Note: the previous
                                                                                            "Electric" field was renamed to DistanceToElectricComments

      ElectricExpense                               Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      ElectricOnPropertyYN                          Boolean                                 Does the property currently have electrical utility available
                                                                                            on the property.

                                                                                            The name of the primary school having a catchment area
      ElementarySchool                              String                            50    that includes the associated property.

      ElementarySchoolDistrict                      String                            50    The name of the elementary school district having a
                                                                                            catchment area that includes the associated property.

                                                                                            The elevation of the property in relation to sea level. Use the
      Elevation                                     Int32                              4    Elevation Units field to communicate the unit of
                                                                                            measurement. i.e. Feet or Meters.

      ElevationUnits                                LinearUnits Enum                        A pick list of the unit of measurement used in the Elevation
                                                                                            field. i.e. Feet, Meters.

                                                                                            A numeric field that describes the level within the structure,
      EntryLevel                                    Int32                              4    SFR or a unit in a building, where the main entry to the
                                                                                            dwelling is located. When a unit has one floor it is implicit
                                                                                            that this is also the level of the unit itself.

                                                                                            A description of the main entry way to the property. i.e.
      EntryLocation                                 String                            50    Elevator, Ground Level w/ Steps, Ground Level w/o Steps,
                                                                                            Mid Level, Top Level, etc.

      EstimatedCloseDate                            DateTime                                EstimatedCloseDate

      Exclusions                                    String                           1024   Elements of the property that will not be included in the sale.
                                                                                            i.e. Chandeliers will be removed prior to close.

                                                                                            Information about the status of the existing lease on the
      ExistingLeaseType                             ExistingLeaseType Enum                  property. i.e. Net, NNN, NN, Gross, Absolute Net, Escalation
                                                                                            Clause, Ground Lease, etc.

                                                                                            The date when the listing agreement will expire. This is the
                                                                                            date entered by the agent reflecting when the change
                                                                                            occurred, or will occur, contractually, not a timestamp of
      ExpirationDate                                DateTime                                when the change was made in the MLS. The expiration date
                                                                                            of listings, prior to their expiration, cancellation, sale or lease,
                                                                                            is confidential information and should be restricted to the
                                                                                            agent and their managers, partners or broker.

      ExteriorFeatures                              ExteriorFeatures Enum                   A list of features or description of the exterior of the
                                                                                            property included in the sale/lease.

      FarmCreditServiceInclYN                       Boolean                                 Specifies whether or not Farm Credit Service shares are
                                                                                            included in the price of the property.

                                                                                            The source of the measurements. This may be a pick list of
      FarmLandAreaSource                            AreaSource Enum                         options showing the source of the measurement. i.e. Agent,
                                                                                            Assessor, Estimate, etc. This field applies to all farm area
                                                                                            fields (Cultivated, Pasture, Range, Wooded)

                                                                                            A pick list of the unit of measurement for the area. i.e.
      FarmLandAreaUnits                             AreaUnits Enum                          Square Feet, Square Meters, Acres, etc. This field applies to
                                                                                            all farm area fields (Cultivated, Pasture, Range, Wooded)

      Fencing                                       Fencing Enum                            A list of types of fencing found at the property being sold.

      FhaEligibility                                FhaEligibility Enum                     A list of options that describe the FHA eligibility of the
                                                                                            property being sold.

      FinancialDataSource                           FinancialDataSource Enum                The source of the Rental information. For example
                                                                                            Accountant, Owner, etc.

                                                                                            A list of features or description of the fireplace(s) included in
      FireplaceFeatures                             FireplaceFeatures Enum                  the sale/lease.

      FireplacesTotal                               Int32                              4    The total number of fireplaces included in the property.

      FireplaceYN                                   Boolean                                 Does the property include a fireplace.

      Flooring                                      Flooring Enum                           A list of the type(s) of flooring found within the property.

      FoundationArea                                Decimal                          14.2   The area or dimensions of the footprint of the structure on
                                                                                            the lot.

      FoundationDetails                             FoundationDetails Enum                  A list of the type(s) of foundation on which the property sits.

      FrontageLength                                String                           255    Textual description of the length of the frontages selected in
                                                                                            the Frontage Type field.

                                                                                            Pick list of types of frontage. i.e. Oceanfront, Lakefront, Golf
      FrontageType                                  FrontageType Enum                       course, etc. Information about roads or road frontage
                                                                                            should be located in the Road Frontage Type and Road
                                                                                            Surface Type fields.

      FuelExpense                                   Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      Furnished                                     Furnished Enum                          The property being leased is furnished, unfurnished or
                                                                                            partially furnished.

      FurnitureReplacementExpense                   Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      GarageSpaces                                  Decimal                          14.2   The number of spaces in the garage(s).

                                                                                            A flag indicating that the listing has a garage. This flag may be
      GarageYN                                      Boolean                                 T/F, Y/N or other true, false or unknown indicator. As with all
                                                                                            flags, the field may be null.

      GardenerExpense                               Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      GrazingPermitsBlmYN                           Boolean                                 Specifies whether or not the property owner has grazing
                                                                                            permits from the Bureau of Land Management.

      GrazingPermitsForestServiceYN                 Boolean                                 Specifies whether or not the property owner has grazing
                                                                                            permits from the Forestry Service.

      GrazingPermitsPrivateYN                       Boolean                                 Specifies whether or not the property owner has private
                                                                                            grazing permits.

                                                    GreenBuildingVerificationType           The name of the verification or certification awarded to a
      GreenBuildingVerificationType                 Enum                                    new or pre-existing residential or commercial structure (e.g.,
                                                                                            LEED, ENERGY STAR, ICC-700).

                                                                                            Pick list of general green attributes such as energy efficient
      GreenEnergyEfficient                          GreenEnergyEfficient Enum               doors, or appliances without naming specific elements with
                                                                                            ratings that may wane over time.

      GreenEnergyGeneration                         GreenEnergyGeneration                   Methods of generating power that are included in the sale
                                                    Enum                                    or lease.

      GreenIndoorAirQuality                         GreenIndoorAirQuality Enum              Pick list of indoor air quality measures without naming
                                                                                            specific elements with ratings that may wane over time.

                                                                                            Pick list describing efficiencies involved with the property's
      GreenLocation                                 GreenLocation Enum                      location such as walkability or transportation proximity
                                                                                            without naming specific elements with ratings that may
                                                                                            wane over time.

                                                                                            Pick list of sustainable elements used in the construction of
      GreenSustainability                           GreenSustainability Enum                the structure without naming specific elements with ratings
                                                                                            that may wane over time.

      GreenVerificationYN                           Boolean                                 Indicates whether or not there is a green verification or
                                                                                            certification on the property being sold.

                                                                                            Pick list of general water conserving attributes of the
      GreenWaterConservation                        GreenWaterConservation                  property such as landscaping or reclamation without
                                                    Enum                                    naming specific elements with ratings that may wane over
                                                                                            time.

      GrossIncome                                   Decimal                          14.2   The actual current income from rent and all other revenue
                                                                                            generating sources.

                                                                                            The maximum amount of annual rent collected if the
      GrossScheduledIncome                          Decimal                          14.2   property were 100% occupied all year and all tenants paid
                                                                                            their rent.

      HabitableResidenceYN                          Boolean                                 Does the property include a structure that can be lived in.

      Heating                                       Heating Enum                            A list describing the heating features of the property.

      HeatingYN                                     Boolean                                 The property has heating.

      HighSchool                                    String                            50    The name of the high school having a catchment area that
                                                                                            includes the associated property.

                                                                                            The name of the high school district having a catchment
      HighSchoolDistrict                            String                            50    area that includes the associated property. When only one
                                                                                            school district is used, this field should be used over the
                                                                                            Junior or Elementary Districts.

      HomeWarrantyYN                                Boolean                                 Is a home warranty included in the sale of the property?
                                                                                            Single select.

      HorseAmenities                                HorseAmenities Enum                     A list of horse amenities on the lot or in the community.

      HorseYN                                       Boolean                                 The Property is allowed to raise horses.

                                                                                            A simplified enumerated list of the days and hours of
      HoursDaysOfOperation                          HoursDaysOfOperation Enum               operation of the business being sold. i.e. Open 24 Hours or
                                                                                            Open 7 Days. For more detailed descriptions use the
                                                                                            HoursDaysofOperationDescription field.

                                                                                            A detailed description of the hours and days the business
      HoursDaysOfOperationDescription               String                           255    being sold is open for business. For a specific list of
                                                                                            simplified times the business is open, use the
                                                                                            HoursDaysOfOperation Field (enumerated).

      HumanModifiedYN                               Boolean                                 HumanModifiedYN

      Inclusions                                    String                           1024   Portable elements of the property that will be included in
                                                                                            the sale.

                                                                                            A list of income sources included in the
      IncomeIncludes                                IncomeIncludes Enum                     GrossScheduledIncome and GrossIncome. i.e. Laundry,
                                                                                            Parking, Recreation, Storage, etc.

      InsuranceExpense                              Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      InteriorFeatures                              InteriorOrRoomFeatures                  A list of features or description of the interior of the property
                                                    Enum                                    included in the sale/lease.

      InternetAddressDisplayYN                      Boolean                                 A yes/no field that states the seller has allowed the listing
                                                                                            address to be displayed on Internet sites.

      InternetAutomatedValuationDisplayYN           Boolean                                 A yes/no field that states the seller allows the listing can be
                                                                                            displayed with an AVM on Internet sites.

                                                                                            A yes/no field that states the seller allows a comment or blog
      InternetConsumerCommentYN                     Boolean                                 system to be attached to the listing on Internet sites.

      InternetEntireListingDisplayYN                Boolean                                 A yes/no field that states the seller has allowed the listing to
                                                                                            be displayed on Internet sites.

      IrrigationSource                              IrrigationSource Enum                   The source which the property receives its water for
                                                                                            irrigation.

      IrrigationWaterRightsAcres                    Decimal                          16.4   The number of acres allowed under the property's water
                                                                                            rights.

      IrrigationWaterRightsYN                       Boolean                                 Does the property include water rights for irrigation? A
                                                                                            Boolean or Yes / No field.

                                                                                            Information about labor laws that are applicable to the
      LaborInformation                              LaborInformation Enum                   business being sold. i.e. Union, Non-Union, Employee
                                                                                            License Required.

                                                                                            When the land is not included in the sale, but is leased, the
      LandLeaseAmount                               Decimal                          14.2   amount of the lease. This is the Space Rent for Mobile
                                                                                            homes in a Park.

      LandLeaseAmountFrequency                      FeeFrequency Enum                       When the land is not included in the sale, but is leased, the
                                                                                            frequency the Land Lease Fee is paid.

      LandLeaseExpirationDate                       DateTime                                When the land is not included in the sale, but is leased, the
                                                                                            expiration date of the Land Lease.

      LandLeaseYN                                   Boolean                                 The land is not included in the sale and a lease exists.

                                                                                            The geographic latitude of some reference point on the
      Latitude                                      Decimal                          12.8   property, specified in degrees and decimal parts. Positive
                                                                                            numbers must not include the plus symbol.

                                                                                            Add this pick list of features and locations where the laundry
      LaundryFeatures                               LaundryFeatures Enum                    is located in the property being sold. i.e. Gas Dryer Hookup,
                                                                                            In Kitchen, In Garage, etc.

      LeasableArea                                  Decimal                          14.2   The area that may be leased within the commercial
                                                                                            property.

      LeasableAreaUnits                             AreaUnits Enum                          A pick list of the unit of measurement for the area. i.e.
                                                                                            Square Feet, Square Meters, Acres, etc.

      LeaseAmount                                   Decimal                          14.2   The amount of any lease the business pays for it's current
                                                                                            location.

                                                                                            The frequency of the LeaseAmount is paid. Monthly, weekly,
      LeaseAmountFrequency                          FeeFrequency Enum                       annual, etc.

      LeaseAssignableYN                             Boolean                                 Can the lease at the business' current location be assigned
                                                                                            to another party.

      LeaseConsideredYN                             Boolean                                 Will the seller consider leasing the property instead of
                                                                                            selling? Single select.

      LeaseExpiration                               DateTime                                The expiration date of the lease for the business' current
                                                                                            location.

                                                                                            A list of compensations other than the original Selling Office
      LeaseRenewalCompensation                      LeaseRenewalCompensation                Compensation. i.e. Compensation Paid on Renewal,
                                                    Enum                                    Compensation Paid on Tennant Purchase, No Renewal
                                                                                            Commission, Call Listing Office, etc.

      LeaseRenewalOptionYN                          Boolean                                 Is there an option to renew the lease at the business'
                                                                                            current location.

                                                                                            A pick list of lengths that represent the length of the lease.
      LeaseTerm                                     LeaseTerm Enum                          i.e. Weekly, Month to Month, 6 Month Lease, 12 Month
                                                                                            Lease, 24 Month Lease.

                                                                                            The number of levels in the property being sold. For
                                                                                            example, One Level, Two Levels, Three or More Levels, <a
      Levels                                        Levels Enum                             href="http://ddwiki.reso.org/pages/viewpage.action?
                                                                                            pageId=9941240">Multi/Split</a>, Loft. A discreet horizontal
                                                                                            plane of interior living space (excluding basements).

                                                                                            License number of the mobile or manufactured home. Also
      License1                                      String                            25    known as the Department of Housing label/insignia number.
                                                                                            For the first or only unit/section use License 1 over License 2
                                                                                            or 3.

                                                                                            License number of the mobile or manufactured home. Also
      License2                                      String                            25    known as the Department of Housing label/insignia number.
                                                                                            For two units/sections use License 1 and 2 over License 3.

                                                                                            License number of the mobile or manufactured home. Also
                                                                                            known as the Department of Housing label/insignia number.
      License3                                      String                            25    For two units/sections use License 1 and 2 over License 3.

      LicensesExpense                               Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      ListAgentAOR                                  AOR Enum                               The Listing Agent's Board or Association of REALTORS.

                                                                                           Designations and certifications acknowledging experience
      ListAgentDesignation                          ListAgentDesignation Enum              and expertise in various real estate sectors are awarded by
                                                                                           NAR and each affiliated group upon completion of required
                                                                                           courses.

                                                                                           North American 10 digit phone numbers should be in the
                                                                                           format of ###-###-#### (separated by hyphens). Other
      ListAgentDirectPhone                          String                           16    conventions should use the common local standard.
                                                                                           International numbers should be preceded by a plus
                                                                                           symbol.

      ListAgentEmail                                String                           80    The email address of the Listing Agent.

                                                                                           North American 10 digit phone numbers should be in the
                                                                                           format of ###-###-#### (separated by hyphens). Other
      ListAgentFax                                  String                           16    conventions should use the common local standard.
                                                                                           International numbers should be preceded by a plus
                                                                                           symbol.

      ListAgentFirstName                            String                           50    The first name of the listing agent.

      ListAgentFullName                             String                           150   The full name of the listing agent. (First Middle Last)

                                                                                           North American 10 digit phone numbers should be in the
                                                                                           format of ###-###-#### (separated by hyphens). Other
      ListAgentHomePhone                            String                           16    conventions should use the common local standard.
                                                                                           International numbers should be preceded by a plus
                                                                                           symbol.

                                                                                           A system unique identifier. Specifically, in aggregation
                                                                                           systems, the ListAgentKey is the system unique identifier
      ListAgentKey                                  String                           20    from the system that the record was retrieved. This may be
                                                                                           identical to the related xxxId. This is a foreign key relating to
                                                                                           the Member resource's MemberKey.

      ListAgentKeyNumeric                           Int32                             4    ListAgentKeyNumeric

      ListAgentLastName                             String                           50    The last name of the listing agent.

      ListAgentMiddleName                           String                           50    The middle name of the listing agent.

                                                                                           The local, well-known identifier for the member. This value
      ListAgentMlsId                                String                           25    may not be unique, specifically in the case of aggregation
                                                                                           systems, this value should be the identifier from the original
                                                                                           system.

                                                                                           North American 10 digit phone numbers should be in the
                                                                                           format of ###-###-#### (separated by hyphens). Other
      ListAgentMobilePhone                          String                           16    conventions should use the common local standard.
                                                                                           International numbers should be preceded by a plus
                                                                                           symbol.

      ListAgentNamePrefix                           String                           10    Prefix to the name (e.g. Dr. Mr. Ms. etc.)

      ListAgentNameSuffix                           String                           10    Suffix to the ListAgentLastName (e.g. Esq., Jr., III etc.)

                                                                                           The national association ID of the listing agent (e.g., the
      ListAgentNationalAssociationId                String                           30    NRDS number in the U.S.).

      ListAgentNickname                             String                           100   ListAgentNickname

                                                                                           North American 10 digit phone numbers should be in the
                                                                                           format of ###-###-#### (separated by hyphens). Other
                                                                                           conventions should use the common local standard.
      ListAgentOfficePhone                          String                           16    International numbers should be preceded by a plus
                                                                                           symbol.

      ListAgentOfficePhoneExt                       String                           10    The extension of the given phone number (if applicable).

                                                                                           North American 10 digit phone numbers should be in the

      ListAgentPager                                String                            16    format of ###-###-#### (separated by hyphens). Other
                                                                                            conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      ListAgentPreferredPhone                       String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      ListAgentPreferredPhoneExt                    String                            10    The extension of the given phone number (if applicable).

      ListAgentStateLicense                         String                            50    The license of the listing agent. Separate multiple licenses
                                                                                            with a comma and space.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      ListAgentTollFreePhone                        String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      ListAgentURL                                  String                           8000   The website URI of the listing agent.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      ListAgentVoiceMail                            String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      ListAgentVoiceMailExt                         String                            10    The extension of the given phone number (if applicable).

      ListAOR                                       AOR Enum                                The responsible Board or Association of REALTORS for this
                                                                                            listing.

                                                                                            The nature of the agreement between the seller and the
      ListingAgreement                              ListingAgreement Enum                   listing agent. Examples are Exclusive Agency, Open Listing,
                                                                                            etc.

                                                                                            The effective date of the agreement between the seller and
      ListingContractDate                           DateTime                                the seller's broker. This is the date entered by the agent
                                                                                            reflecting when the change occurred contractually, not a
                                                                                            timestamp of when the change was made in the MLS.

                                                                                            The well known identifier for the listing. The value may be
                                                                                            identical to that of the Listing Key, but the Listing ID is
                                                                                            intended to be the value used by a human to retrieve the
      ListingId    InKey                            String                           255    information about a specific listing. In a multiple originating
                                                                                            system or a merged system, this value may not be unique
                                                                                            and may require the use of the provider system to create a
                                                                                            synthetic unique value.

                                                                                            A unique identifier for this record from the immediate
                                                                                            source. This is a string that can include a Uniform Resource
                                                                                            Identifier (URI) or other forms. This is the local key of the
      ListingKey     Key      InKey                 String                            20    system. When records are received from other systems, a
                                                                                            local key is commonly applied. If conveying the original keys
                                                                                            from the source or originating systems, see
                                                                                            SourceSystemKey and OriginatingSystemKey.

      ListingKeyNumeric                             Int64                             10    ListingKeyNumeric

                                                                                            Defines the type or level of service the listing member will be
      ListingService                                ListingService Enum                     providing to the selling home owner. This will typically be a
                                                                                            single selection. Examples include Full Service, Limited
                                                                                            Service or Entry Only.

                                                                                            Terms of the listing such as Lien Release, Subject to Court
                                                                                            Approval or Owner Will Carry. Also may include options that
      ListingTerms                                  ListingTerms Enum                       describe the financing terms that are acceptable to the
                                                                                            seller, i.e. cash, assumable, FHA loan, etc.

      ListingURL                                    String                           8000   Provides a link to the specific listing on a brokerage website,
                                                                                            agent website or other public-facing source.

      ListingURLDescription                         ListingURLDescription Enum              A pick list of options showing where the listing URL resides
                                                                                            (i.e., Brokerage Website, Agent Website, etc.).

      ListOfficeAOR                                 AOR Enum                                The Listing Office's Board or Association of REALTORS.

      ListOfficeEmail                               String                            80    The email address of the Listing Office.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      ListOfficeFax                                 String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
      ListOfficeKey                                 String                            20    system that the record was just retrieved. This may be
                                                                                            identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Office resource's OfficeKey.

      ListOfficeKeyNumeric                          Int32                              4    ListOfficeKeyNumeric

                                                                                            The local, well-known identifier. This value may not be
      ListOfficeMlsId                               String                            25    unique, specifically in the case of aggregation systems, this
                                                                                            value should be the identifier from the original system.

      ListOfficeName                                String                           255    The legal name of the brokerage representing the seller.

      ListOfficeNationalAssociationId               String                            30    The national association ID of the listing office (e.g., the
                                                                                            NRDS number in the U.S.).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      ListOfficePhone                               String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      ListOfficePhoneExt                            String                            10    The extension of the given phone number (if applicable).

      ListOfficeURL                                 String                           8000   The website URI for the listing office.

                                                                                            The current price of the property as determined by the
      ListPrice                                     Decimal                          14.2   seller and the seller's broker. For auctions this is the
                                                                                            minimum or reserve price.

      ListPriceLow                                  Decimal                          14.2   The lower price used for Value Range Pricing. The List Price
                                                                                            must be greater than or equal to the ListPriceLow.

                                                                                            A system unique identifier. Specifically, in aggregation
                                                                                            systems, the Key is the system unique identifier from the
      ListTeamKey                                   String                           255    system that the record was just retrieved. This may be
                                                                                            identical to the related xxxId identifier, but the key is
                                                                                            guaranteed unique for this record set. This is a foreign key
                                                                                            relating to the Teams resource's TeamKey.

      ListTeamKeyNumeric                            Int32                              4    ListTeamKeyNumeric

      ListTeamName                                  String                            50    The name of the team representing the seller.

      LivingArea                                    Decimal                          14.2   The total livable area within the structure.

                                                                                            The source of the measurements. This is a pick list of
      LivingAreaSource                              AreaSource Enum                         options showing the source of the measurement. i.e. Agent,
                                                                                            Assessor, Estimate, etc.

      LivingAreaUnits                               AreaUnits Enum                          A pick list of the unit of measurement for the area. i.e.
                                                                                            Square Feet, Square Meters, Acres, etc.

      LockBoxLocation                               String                           255    A field describing the location of the lock box.

      LockBoxSerialNumber                           String                            25    The serial number of the lockbox placed on the property.

      LockBoxType                                   LockBoxType Enum                        A field describing the type of lock box.

                                                                                            The geographic longitude of some reference point on the
      Longitude                                     Decimal                          12.8   property, specified in degrees and decimal parts. Positive
                                                                                            numbers must not include the plus symbol.

                                                                                            The source of the measurements. This may be a pick list of
      LotDimensionsSource                           LotDimensionsSource Enum                options showing the source of the measurement. i.e. Agent,
                                                                                            Assessor, Estimate, etc.

      LotFeatures                                   LotFeatures Enum                        A list of features or description of the lot included in the
                                                                                            sale/lease.

                                                                                            The total Acres of the lot. This field is related to the Lot Size
      LotSizeAcres                                  Decimal                          16.4   Area and Lot Size Units and must be in sync with the values
                                                                                            represented in those fields. Lot Size Source also applies to
                                                                                            this field when used.

      LotSizeArea                                   Decimal                          16.4   The total area of the lot. See Lot Size Units for the units of
                                                                                            measurement (Square Feet, Square Meters, Acres, etc.).

                                                                                            The dimensions of the lot minimally represented as length
      LotSizeDimensions                             String                           150    and width (i.e. 250 x 180) or a measurement of all sides of
                                                                                            the polygon representing the property lines of the property.
                                                                                            i.e. 30 x 50 x 120 x 60 x 22.

                                                                                            The source of the measurements. This may be a pick list of
      LotSizeSource                                 LotSizeSource Enum                      options showing the source of the measurement. i.e. Agent,
                                                                                            Assessor, Estimate, etc.

                                                                                            The total square footage of the lot. This field is related to the
      LotSizeSquareFeet                             Decimal                          14.2   Lot Size Area and Lot Size Units and must be in sync with the
                                                                                            values represented in those fields. Lot Size Source also
                                                                                            applies to this field when used.

      LotSizeUnits                                  LotSizeUnits Enum                       A pick list of the unit of measurement for the area. i.e.
                                                                                            Square Feet, Square Meters, Acres, etc.

      MainLevelBathrooms                            Int32                              4    The number of bathrooms located on the main or entry level
                                                                                            of the property.

      MainLevelBedrooms                             Int32                              4    The number of bedrooms located on the main or entry level
                                                                                            of the property.

      MaintenanceExpense                            Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      MajorChangeTimestamp                          DateTimeOffset                          Timestamp of the last major change on the listing (see also
                                                                                            MajorChangeType).

                                                                                            Description of the last major change on the listing, i.e. “price
      MajorChangeType                               ChangeType Enum                         reduction”, “back on market”, etc. May be used to display on
                                                                                            a summary view of listing results to quickly identify listings
                                                                                            that have had major changes recently.

      Make                                          String                            50    Make of the mobile or manufactured home.

                                                                                            The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations. This is
      ManagerExpense                                Decimal                          14.2   for an individual manager. Use
                                                                                            ProfessionalManagementExpense for a management
                                                                                            company.

                                                                                            A map coordinate for the property, as determined by local
                                                                                            custom. This is not necessarily the same as the geographic
                                                                                            coordinate but may depend on the coordinate system used
      MapCoordinate                                 String                            25    by whatever mapping service is customarily used by the
                                                                                            listing service.

      MapCoordinateSource                           String                            25    Name of the map or map book publisher.

      MapURL                                        String                           8000   URI to a map of the property.

      MiddleOrJuniorSchool                          String                            50    The name of the junior or middle school having a catchment
                                                                                            area that includes the associated property.

      MiddleOrJuniorSchoolDistrict                  String                            50    The name of the junior or middle school district having a
                                                                                            catchment area that includes the associated property.

                                                                                            The major marketing area name, as defined by the MLS or
      MLSAreaMajor                                  String                            50    other non-governmental organization. If there is only one
                                                                                            MLS Area in use, it must be the MLSAreaMajor.

                                                                                            The minor/sub marketing area name, as defined by the MLS
      MLSAreaMinor                                  String                            50    or other non-governmental organization. If there is only one
                                                                                            MLS Area in use, it must be the MLSAreaMajor.

                                                                                            Local or regional status that are well known by business
      MlsStatus                                     MlsStatus Enum                          users. Each MlsStatus must map to a single StandardStatus.
                                                                                            Multiple MlsStatus may map to a single StandardStatus.

      MobileDimUnits                                LinearUnits Enum                        A pick list of the unit linear measurement. i.e. feed, meters,
                                                                                            yards, kilometers, miles, etc.

      MobileHomeRemainsYN                           Boolean                                 Is the mobile home to remain and be included in the sale of
                                                                                            the property.

      MobileLength                                  Int32                              4    Length of the mobile/manufactured home.

      MobileWidth                                   Int32                              4    Width of the mobile/manufactured home.

      Model                                         String                            50    Model of the mobile or manufactured home.

                                                                                            The transactional timestamp automatically recorded by the
      ModificationTimestamp     InKey               DateTimeOffset                          MLS system representing the date/time the listing was last
                                                                                            modified.

                                                                                            Net operating income is the revenue from a property after
                                                                                            operating expenses have been deducted, but before
      NetOperatingIncome                            Decimal                          14.2   deducting income taxes and financing expenses (interest
                                                                                            and Principal Payments). For example, Gross Income -
                                                                                            Operating Expenses = Net Operating Income (NOI).

      NewConstructionYN                             Boolean                                 Is the property newly constructed and has not been
                                                                                            previously occupied?

      NewTaxesExpense                               Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      NumberOfBuildings                             Int32                              4    Total number of separate buildings included in the income
                                                                                            property.

      NumberOfFullTimeEmployees                     Int32                              4    The current number of individuals employed by the
                                                                                            business on a full-time basis.

                                                                                            Total number of lots on the property or included in the sale.
                                                                                            Land properties are often sold with multiple lots. It is
      NumberOfLots                                  Int32                              4    important to be able to describe how many lots are in the
                                                                                            property and not in all cases do lots have separate Parcel
                                                                                            IDs.

      NumberOfPads                                  Int32                              4    The number of pads or spaces in the mobile home park.

      NumberOfPartTimeEmployees                     Int32                              4    The current number of individuals employed by the
                                                                                            business on a part-time basis.

      NumberOfSeparateElectricMeters                Int32                              4    Total number of separate meters on the property.

      NumberOfSeparateGasMeters                     Int32                              4    Total number of separate meters on the property.

      NumberOfSeparateWaterMeters                   Int32                              4    Total number of separate meters on the property.

                                                                                            The total number of units in the building, complex or
      NumberOfUnitsInCommunity                      Int32                              4    community. This is not the number of units being sold, but
                                                                                            rather the size of the community in which the dwelling being
                                                                                            sold is located.

      NumberOfUnitsLeased                           Int32                              4    Total number of units currently under a lease agreement.

      NumberOfUnitsMoMo                             Int32                              4    The total number of units leasable month to month.

      NumberOfUnitsTotal                            Int32                              4    Total number of units included in the income property,
                                                                                            occupied or unoccupied.

      NumberOfUnitsVacant                           Int32                              4    The number of units currently vacant.

      OccupantName                                  String                            50    Name of the current occupant, if any, of the property being
                                                                                            sold.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      OccupantPhone                                 String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      OccupantType                                  OccupantType Enum                       A field that describes the type of occupant, i.e. Owner,
                                                                                            Tenant, Vacant.

                                                                                            The date the listing was taken off market. Where possible,
      OffMarketDate                                 DateTime                                this date is reflective of the date entered by the agent
                                                                                            reflecting when the change occurred contractually, not a
                                                                                            timestamp of when the change was made in the MLS.

                                                                                            The transactional timestamp automatically recorded by the
      OffMarketTimestamp                            DateTimeOffset                          MLS system representing the most recent date/time the
                                                                                            listing's status was set to and off market status (not Active or
                                                                                            Backup)

                                                                                            The date the listing was placed on market. Where possible,
      OnMarketDate                                  DateTime                                this date is reflective of the date entered by the agent
                                                                                            reflecting when the change occurred contractually, not a
                                                                                            timestamp of when the change was made in the MLS.

                                                                                            The transactional timestamp automatically recorded by the
                                                                                            MLS system representing the most recent date/time the
      OnMarketTimestamp                             DateTimeOffset                          listing's status was set to Active or Backup. This also includes
                                                                                            initial input of the listing to Active/Backup or from a draft or
                                                                                            approval status to Active/Backup.

      OpenHouseModificationTimestamp                DateTimeOffset                          OpenHouseModificationTimestamp

      OpenParkingSpaces                             Decimal                          14.2   The number of open or uncovered parking spaces included
                                                                                            in the sale.

      OpenParkingYN                                 Boolean                                 A flag indicating that any parking spaces associated with the
                                                                                            property are not covered by a roof.

      OperatingExpense                              Decimal                          14.2   The costs associated with the operation and maintenance of
                                                                                            an income-producing property.

                                                    OperatingExpenseIncludes                When individual expense fields are not used and only a total
      OperatingExpenseIncludes                      Enum                                    is entered, this lists the expenses that are included in the
                                                                                            OperatingExpense field.

                                                                                            The transactional timestamp automatically recorded by the
      OriginalEntryTimestamp                        DateTimeOffset                          MLS system representing the date/time the listing was
                                                                                            entered and made visible to members of the MLS.

      OriginalListPrice                             Decimal                          14.2   The original price of the property on the initial agreement
                                                                                            between the seller and the seller's broker.

      OriginatingSystemBuyerAgentMemberKey          String                           255    OriginatingSystemBuyerAgentMemberKey

      OriginatingSystemBuyerOfficeKey               String                           255    OriginatingSystemBuyerOfficeKey

      OriginatingSystemBuyerTeamKey                 String                            50    OriginatingSystemBuyerTeamKey

      OriginatingSystemCoBuyerAgentMemberKey        String                           255    OriginatingSystemCoBuyerAgentMemberKey

      OriginatingSystemCoBuyerOfficeKey             String                           255    OriginatingSystemCoBuyerOfficeKey

      OriginatingSystemCoListAgent2MemberKey        String                           255    OriginatingSystemCoListAgent2MemberKey

      OriginatingSystemCoListAgent3MemberKey        String                           255    OriginatingSystemCoListAgent3MemberKey

      OriginatingSystemCoListAgentMemberKey         String                           255    OriginatingSystemCoListAgentMemberKey

      OriginatingSystemCoListOffice2Key             String                            50    OriginatingSystemCoListOffice2Key

      OriginatingSystemCoListOfficeKey              String                           255    OriginatingSystemCoListOfficeKey

                                                                                            The RESO OUID's OrganizationUniqueId of the Originating
                                                                                            record provider. The Originating system is the system with
      OriginatingSystemID                           String                            25    authoritative control over the record. For example; the name
                                                                                            of the MLS where the listing was input. In cases where the
                                                                                            Originating system was not where the record originated (the
                                                                                            authoritative system), see the Originating System fields.

                                                                                            The system key, a unique record identifier, from the
                                                                                            Originating system. The Originating system is the system
                                                                                            with authoritative control over the record. For example, the
      OriginatingSystemKey                          String                           255    Multiple Listing Service where the listing was input. There
                                                                                            may be cases where the Source System (how you received
                                                                                            the record) is not the Originating System. See Source System
                                                                                            Key for more information.

      OriginatingSystemListAgentMemberKey           String                           255    OriginatingSystemListAgentMemberKey

      OriginatingSystemListOfficeKey                String                           255    OriginatingSystemListOfficeKey

      OriginatingSystemListTeamKey                  String                            50    OriginatingSystemListTeamKey

      OriginatingSystemModificationTimestamp        DateTimeOffset                          OriginatingSystemModificationTimestamp

                                                                                            The name of the Originating record provider. Most
      OriginatingSystemName                         String                           255    commonly the name of the MLS. The place where the listing
                                                                                            is originally input by the member. The legal name of the
                                                                                            company.

      OriginatingSystemSubName                      String                           255    OriginatingSystemSubName

                                                                                            A list of other equipment that will be included in the sale of
      OtherEquipment                                OtherEquipment Enum                     the property.

      OtherExpense                                  Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      OtherParking                                  String                           1024   Other types of parking available to, or part of, the property.

      OtherStructures                               OtherStructures Enum                    A list of structures other than the main dwelling. For
                                                                                            example, Guest House, Barn, Shed, etc.

      OwnerName                                     String                            50    Name of the owner of the property being sold.

      OwnerName2                                    String                           100    OwnerName2

      OwnerPays                                     OwnerPays Enum                          A list of expenses for the property paid for by the owner as
                                                                                            opposed to the tenant (e.g. Water, Trash, Electric).

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      OwnerPhone                                    String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      Ownership                                     String                           1024   A text description of the manner in which title to a property
                                                                                            is held. Trust, Corporation, Joint Tennant, Individual.

      OwnershipType                                 OwnershipType Enum                      Current type of ownership of the business being sold. i.e.
                                                                                            Corporation, LLC, Sole P, Partnership, etc.,

                                                                                            A number used to uniquely identify a parcel or lot. This
                                                                                            number is typically issued by the county or county assessor.
      ParcelNumber                                  String                            50    The AP number format varies from county to county. It is
                                                                                            recommended that all Parcel Numbers be transmitted
                                                                                            without dashes or hyphens.

      ParkingFeatures                               ParkingFeatures Enum                    A list of features or description of the parking included in the
                                                                                            sale/lease.

      ParkingTotal                                  Decimal                          14.2   The total number of parking spaces included in the sale.

      ParkManagerName                               String                            50    Name of the manager of the mobile home park.

                                                                                            North American 10 digit phone numbers should be in the
                                                                                            format of ###-###-#### (separated by hyphens). Other
      ParkManagerPhone                              String                            16    conventions should use the common local standard.
                                                                                            International numbers should be preceded by a plus
                                                                                            symbol.

      ParkName                                      String                            50    Name of the mobile home park or corporate/commercial
                                                                                            park.

      PastureArea                                   Decimal                          14.2   Measurement or percentage of the property that has been
                                                                                            allocated as pasture or grazing area.

      PatioAndPorchFeatures                         PatioAndPorchFeatures Enum              A list of features or description of the patio or porch
                                                                                            included in the sale/lease.

                                                                                            The transactional timestamp automatically recorded by the
      PendingTimestamp                              DateTimeOffset                          MLS system representing the most recent date/time the
                                                                                            listing's status was set to Pending.

      Permission                                    Permission Enum                         Permission

      PermissionPrivate                             String                           8000   PermissionPrivate

      PestControlExpense                            Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      PetDeposit                                    Decimal                          14.2   PetDeposit

      PetsAllowed                                   PetsAllowed Enum                        Are pets allowed at the property being leased? A list of yes,
                                                                                            no and more detailed restrictions/allowances.

      PhotosChangeTimestamp                                                                 System generated timestamp of when the last update or
                                  InKey             DateTimeOffset                          change to the photos for this listing was made.

      PhotosCount                                                                           The total number of pictures or photos included with the
                        InKey                       Int32                              4    listing.

      PoolExpense                                   Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      PoolFeatures                                  PoolFeatures Enum                       A list of features or description of the pool included in the
                                                                                            sale/lease.

      PoolPrivateYN                                 Boolean                                 The property has a privately owned pool that is included in
                                                                                            the sale/lease.

      Possession                                    Possession Enum                         A list defining when possession will occur. i.e. COE, COE+1,
                                                                                            etc.

                                                                                            A list of the type(s) of possible or best uses of the property.
                                                                                            Probable use gives a good indication of what the best use or
      PossibleUse                                   CurrentOrPossibleUse Enum               potential use of the property could be. i.e. Primary, Vacation,
                                                                                            Investment, Rental, Retirement

                                                                                            The official city per the USPS. May be different from the
      PostalCity                                    String                            50    "City".

      PostalCode      InKey                         String                            10    The postal code portion of a street or mailing address.

      PostalCodePlus4                               String                             4    The postal code +4 portion of a street or mailing address.

                                                                                            This field is a list of the types of power production system(s)
                                                                                            available on the property. The key characteristics of the
                                                                                            system are expected to appear as the "[type]" in the related
                                                                                            power production fields in a flattened implementation (RETS
                                                                                            1.x only) of the power production fields. A relational
                                                                                            implementation of power production must omit the type
      PowerProductionType                           PowerProductionType Enum                from the field name and use PowerProductionType to create
                                                                                            a vertical representation of the various types of power
                                                                                            production available. **Note that PV Solar is the only type of
                                                                                            power production currently justified in multiple markets and
                                                                                            thus shown. Up and coming renewables that could be
                                                                                            added in the future depending on uptake: Wind,
                                                                                            Geothermal, Thin Film Solar.

      PowerProductionYN                             Boolean                                 Indicates whether or not there is a power production system
                                                                                            on the property being sold.

      PreviousListPrice                             Decimal                          14.2   The most recent previous ListPrice of the listing.

                                                                                            The transactional timestamp automatically recorded by the
      PriceChangeTimestamp                          DateTimeOffset                          MLS system representing the date/time the listing's price
                                                                                            was last changed.

      PrivateOfficeRemarks                          String                           4000   A remarks field that is only visible to members of the same
                                                                                            offices as the listing agent.

                                                                                            Remarks that may contain security or proprietary
      PrivateRemarks                                String                           4000   information and should be restricted from public view.

                                                                                            The annual expense that is not paid directly by the tenant
      ProfessionalManagementExpense                 Decimal                          14.2   and is included in the Operating Expense calculations. This is
                                                                                            for a management company. Use ManagerExpense for a
                                                                                            individual manager.

                                                                                            A flag indicating that the primary structure is attached to
                                                                                            another structure that is not included in the sale. i.e. one
      PropertyAttachedYN                            Boolean                                 unit of a duplex. This flag may be T/F, Y/N or a list of attached
                                                                                            or detached. As with all flags, the field may be null. In some
                                                                                            systems this information may be part of the Property Sub
                                                                                            Type.

      PropertyCondition                             PropertyCondition Enum                  A list describing the condition of the property and any
                                                                                            structures included in the sale.

                                                                                            A list of sub types to Residential, Residential Lease,
                                                                                            Manufactured in Park, Commercial and Business
      PropertySubType                               PropertySubType Enum                    Opportunity listings. e.g. Single Family Residence,
                                                                                            Condominium, Manufactured on Land, Townhouse, Multi
                                                                                            Family, Office, Retail, etc.

      PropertySubTypeAdditional                     PropertySubTypeAdditional               PropertySubTypeAdditional
                                                    Enum

      PropertyType                                  PropertyType Enum                       A list of types of properties such as Residential, Lease,
                                                                                            Income, Land, Mobile, Commercial Sale, etc...

                                                                                            Text remarks that may be displayed to the public. In an MLS,
                                                                                            it is the field where information is entered for the public. This
                                                                                            information is intended to be visible on-line. This is typically
                                                                                            information that describes the selling points of the building
                                                                                            and/or land for sale. Local conditions and rules will
      PublicRemarks                                 String                           4000   determine what such content can contain. Generally, the
                                                                                            following information is excluded: any information pertaining
                                                                                            to entry to the property, the seller and/or tenant, listing
                                                                                            member contact information. In other systems, these
                                                                                            remarks will be determined by local business rules.

      PublicSurveyRange                             String                            20    This field specifically identifies the Range identified by the
                                                                                            Public Land Survey System (PLSS).

                                                                                            This field specifically identifies the Section identified by the
      PublicSurveySection                           String                            20
                                                                                            Public Land Survey System (PLSS).

                                                                                            This field specifically identifies the Township identified by the
      PublicSurveyTownship                          String                            20    Public Land Survey System (PLSS).

                                                                                            With for-sale listings, the date an offer was accepted and the
                                                                                            listing was no longer on market. This is the date entered by
                                                                                            the agent reflecting when the change occurred contractually,
      PurchaseContractDate                          DateTime                                not a timestamp of when the change was made in the MLS.
                                                                                            With lease listings this may represent a meeting of the minds
                                                                                            to lease, but some contractual requirements are yet to be
                                                                                            fulfilled, such as contract signing or receipt of the deposit.

      RangeArea                                     Decimal                          14.2   Measurement or percentage of the property that has been
                                                                                            allocated as range.

      RentControlYN                                 Boolean                                 Is the property in a rent control area?

      RentIncludes                                  RentIncludes Enum                       A list of services or items that the tenant is not responsible
                                                                                            to pay.

                                                                                            Pick list of types of Road frontage. i.e. Freeway frontage, No
      RoadFrontageType                              RoadFrontageType Enum                   Road Frontage, etc. The road frontage of the property is an
                                                                                            important factor in determining value of the property and it’s
                                                                                            appropriateness for intended use.

      RoadResponsibility                            RoadResponsibility Enum                 The person or entity responsible for road maintenance (e.g.,
                                                                                            City, County, Private).

                                                                                            Pick list of types of surface of the Road to access the
                                                                                            property. The surface of the road(s) for access to the
      RoadSurfaceType                               RoadSurfaceType Enum                    property is an important factor in determining value of the
                                                                                            property and it’s appropriateness for intended use.

      Roof                                          Roof Enum                               A list describing the type or style of roof. For example
                                                                                            Spanish Tile, Composite, Shake, etc.

      RoomsTotal                                    Int32                              4    The number of rooms in the dwelling.

                                                                                            A list of possible room types (i.e., bedroom, bathroom, living
                                                                                            room, workshop, etc.). Each selected is expected to appear
                                                                                            as the type in the related room fields in a flattened
                                                                                            implementation (RETS 1.x only). A relational implementation
      RoomType                                      RoomType Enum                           of rooms must omit the type from the field name and use
                                                                                            RoomType to create a vertical representation of the various
                                                                                            rooms. Note that garage or basement should not be added
                                                                                            as a room type, as these are represented by the
                                                                                            ParkingFeatures and Basement fields, respectively.

                                                                                            The dimensions of the RV parking area minimally
      RVParkingDimensions                           String                            50    represented as length and width (i.e. 25 x 18) or a
                                                                                            measurement of all sides of the polygon representing the
                                                                                            usable RV parking space. i.e. 33 x 15 x 12 x 60.

      SaleOrLeaseIndicator                          SaleOrLeaseIndicator Enum               SaleOrLeaseIndicator

      SeatingCapacity                               Int32                              4    The seating capacity of the business being sold.

      SecurityDeposit                               Decimal                          14.2   SecurityDeposit

                                                                                            A list describing the security features included in the
      SecurityFeatures                              SecurityFeatures Enum                   sale/lease.

      SeniorCommunityYN                             Boolean                                 The community is a senior community.

                                                                                            Serial number of the mobile or manufactured home. For the
      SerialU                                       String                            25    first or only unit/section use Serial U over Serial X or Serial
                                                                                            XX.

                                                                                            Serial number of the mobile or manufactured home. For two
      SerialX                                       String                            25    units/sections, Serial U should be used first, Serial X second
                                                                                            over or Serial XX.

                                                                                            Serial number of the mobile or manufactured home. For two

      SerialXX                                      String                            25    units/sections, Serial U should be used first, Serial X second
                                                                                            over or Serial XX.

      Sewer                                         Sewer Enum                              A list describing the sewer or septic features of the property.

      ShowingAdvanceNotice                          Int32                              4    The hours of advance notice required to schedule a
                                                                                            showing.

                                                                                            Does this home require an attended showing? i.e. Yes =
      ShowingAttendedYN                             Boolean                                 licensed agent representing the seller must be present
                                                                                            during showing.

      ShowingContactName                            String                            40    The name of the contact for the showing of the listed
                                                                                            property.

                                                                                            A telephone number that should be called to arrange
      ShowingContactPhone                           String                            16    showing the property.

      ShowingContactPhoneExt                        String                            10    The extension of the given phone number (if applicable).

      ShowingContactType                            ShowingContactType Enum                 The type of contact for the showing. i.e. Agent, Broker, Seller.

                                                                                            The days of the week that the property is available for
      ShowingDays                                   ShowingDays Enum                        showing. i.e. Sundays, Mondays, Tuesdays, Wednesdays,
                                                                                            Thursdays, Fridays, Saturdays

      ShowingEndTime                                DateTimeOffset                          From the days selected in the ShowingDays field, the end
                                                                                            time that the property is available for showing.

                                                                                            Remarks that detail the seller's instructions for showing the
                                                                                            subject property. Showing instructions may include: contact
      ShowingInstructions                           String                           4000   information, showing times, notice required or other
                                                                                            information. These remarks are privileged and are not for
                                                                                            public viewing.

      ShowingRequirements                           ShowingRequirements Enum                A pick list of types of notice required to see the home. i.e.
                                                                                            Appointment Required, Courtesy Call Only, Go Direct, etc.

      ShowingStartTime                              DateTimeOffset                          From the days selected in the ShowingDays field, the start
                                                                                            time that the property is available for showing.

      SignOnPropertyYN                              Boolean                                 Is there a sign on the property.

      Skirt                                         Skirt Enum                              A list of types of mobile home skirting.

                                                                                            The RESO OUID's OrganizationUniqueId of the Source
                                                                                            record provider. The source system is the system from
      SourceSystemID                                String                            25    which the record was directly received. In cases where the
                                                                                            source system was not where the record originated (the
                                                                                            authoritative system), see the Originating System fields.

                                                                                            The system key, a unique record identifier, from the Source
                                                                                            System. The Source System is the system from which the
      SourceSystemKey                               String                           255    record was directly received. In cases where the Source
                                                                                            System was not where the record originated (the
                                                                                            authoritative system), see the Originating System fields.

                                                                                            The name of the immediate record provider. The system
      SourceSystemName                              String                           255    from which the record was directly received. The legal name
                                                                                            of the company.

      SpaFeatures                                   SpaFeatures Enum                        A list of features or description of the spa included in the
                                                                                            sale/lease.

      SpaYN                                         Boolean                                 The property has a spa.

      SpecialLicenses                               SpecialLicenses Enum                    Special licenses required/used by the business being sold.
                                                                                            i.e. Beer/Wine, Class H, Professional, Gambling, None.

                                                                                            A list of options that describe the type of sale. i.e. Standard,
      SpecialListingConditions                      SpecialListingConditions                REO, Short Sale, Probate, Auction, NOD, etc., at the time of
                                                    Enum
                                                                                            listing.

                                                                                            The status of the listing as it reflects the state of the contract
      StandardStatus     InKey                      StandardStatus Enum                     between the listing agent and seller or an agreement with a
                                                                                            buyer (Active, Active Under Contract, Canceled, Closed,
                                                                                            Expired, Pending, Withdrawn). This is a Single Select field.

      StartShowingDate                              DateTime                                The date the listing agent/broker expects to start showing
                                                                                            the property.

      StateOrProvince                               StateOrProvince Enum                    Text field containing the accepted postal abbreviation for the
                                                                                            state or province.

      StateRegion                                   String                           150    A sub-section or area of a defined state or province.
                                                                                            Examples would be the Keys in FL or Hudson Valley in NY.

                                                                                            The transactional timestamp automatically recorded by the
      StatusChangeTimestamp                         DateTimeOffset                          MLS system representing the date/time the listing's status
                                                                                            was last changed.

      Stories                                       Int32                              4    The number of floors in the property being sold.

                                                                                            The total number of floors in the building. In the case of
      StoriesTotal                                  Int32                              4    multi-dwelling structures, this is the entire structure and not
                                                                                            the individual dwelling being sold.

      StreetAdditionalInfo                          String                            50    Information other than a prefix or suffix for the street
                                                                                            portion of a postal address.

      StreetDirPrefix                               StreetDirection Enum                    The direction indicator that precedes the listed property's
                                                                                            street name.

      StreetDirSuffix                               StreetDirection Enum                    The direction indicator that follows a listed property's street
                                                                                            address.

      StreetName                                    String                            50    The street name portion of a listed property's street
                                                                                            address.

                                                                                            The street number portion of a listed property's street
                                                                                            address. In some areas the street number may contain non-
      StreetNumber                                  String                            25    numeric characters. This field can also contain extensions
                                                                                            and modifiers to the street number, such as "1/2" or "-B".
                                                                                            This street number field should not include Prefixes,
                                                                                            Direction or Suffixes.

      StreetNumberNumeric                           Int32                              4    The integer portion of the street number.

      StreetSuffix                                  StreetSuffix Enum                       The suffix portion of a listed property's street address.

                                                                                            The Street Suffix Modifier allows the member to enter a
      StreetSuffixModifier                          String                            25    unique Street Suffix that was not found in the Street Suffix
                                                                                            pick list or to extend or prefix the suffix.

                                                                                            The type of structure that the property completely or
                                                                                            partially encompasses. For example, House or Cabin are the
                                                                                            overall structure and typically sold or leased as a whole.
      StructureType                                 StructureType Enum                      Multi Family and Docks may be sold in whole, but are often
                                                                                            sold or leased by unit/slip. This field is the type of structure
                                                                                            as opposed to style, which is under the Architectural Style
                                                                                            field.

                                                                                            The total commission to be paid to the Sub Agency,
      SubAgencyCompensation                         String                            25    expressed as either a percentage or a constant currency
                                                                                            amount.

                                                                                            A list of types to clarify the value entered in the
      SubAgencyCompensationType                     CompensationType Enum                   SubAgencyCompensation field. For example $, % or some
                                                                                            other clarification of the SubAgencyCompensation.

      SubdivisionName                               String                            50    A neighborhood, community, complex or builder tract.

      SuppliesExpense                               Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

                                                                                            When permitted by the broker, the options made by the

      SyndicateTo                                   SyndicateTo Enum                        agent on behalf of the seller, where they would like their
                                                                                            listings syndicated. i.e. Zillow, Trulia, Homes.com, etc.

                                                                                            Becoming more common in the industry, MLS's are hosting
                                                                                            a separate "Public Remarks" for syndication purposes. This
      SyndicationRemarks                            String                           4000   field should be defaulted to containing the Public Remarks,
                                                                                            but upon broker decision, modified to include contact and
                                                                                            other information denied by IDX rules, but allowed under
                                                                                            local and national regulations.

      TaxAnnualAmount                               Decimal                          14.2   The annual property tax amount as of the last assessment
                                                                                            made by the taxing authority.

                                                                                            The property value as of the last assessment made by the
      TaxAssessedValue                              Int32                              4    taxing authority.

                                                                                            A type of legal description for land in developed areas where
                                                                                            streets or other rights-of-ways delineate large parcels of land
                                                                                            referred to as divided into lots on which homes or other
                                                                                            types of developments are built. An example would read
      TaxBlock                                      String                            25    "Lot 12 of Block 45 of Tract 3002 of the City of San Dunes,
                                                                                            Desert County." Such a description would also reference an
                                                                                            official plat filed with the clerk or recorder for that area
                                                                                            which shows the location of the block and often the
                                                                                            dimensions of the lots therein.

                                                                                            Some systems of parcel identification incorporate a method
      TaxBookNumber                                 String                            25    which utilizes a county identifier, a tax book number, a tax
                                                                                            map number and a parcel identification number.

                                                                                            A type of legal description for land in developed areas where
                                                                                            streets or other rights-of-ways delineate large parcels of land
                                                                                            referred to as divided into lots on which homes or other
                                                                                            types of developments are built. An example would read
      TaxLegalDescription                           String                           6000   "Lot 12 of Block 45 of Tract 3002 of the City of San Dunes,
                                                                                            Desert County." Such a description would also reference an
                                                                                            official plat filed with the clerk or recorder for that area
                                                                                            which shows the location of the block and often the
                                                                                            dimensions of the lots therein. The text here is also an index
                                                                                            into the property as described by the County Recorder.

                                                                                            A type of legal description for land in developed areas where
                                                                                            streets or other rights-of-ways delineate large parcels of land
                                                                                            referred to as divided into lots on which homes or other
                                                                                            types of developments are built. An example would read
      TaxLot                                        String                            25    "Lot 12 of Block 45 of Tract 3002 of the City of San Dunes,
                                                                                            Desert County." Such a description would also reference an
                                                                                            official plat filed with the clerk or recorder for that area
                                                                                            which shows the location of the block and often the
                                                                                            dimensions of the lots therein.

                                                                                            Some systems of parcel identification incorporate a method
      TaxMapNumber                                  String                            25    which utilizes a county identifier, a tax book number, a tax
                                                                                            map number and a parcel identification number.

                                                                                            Any other annual taxes, not including the tax reported in the
      TaxOtherAnnualAssessmentAmount                Decimal                          14.2   TaxAmount field, as of the last assessment made by the
                                                                                            taxing authority.

                                                                                            Some systems of parcel identification incorporate a method
      TaxParcelLetter                               String                            25    which utilizes a county identifier, a tax book number, a tax
                                                                                            map number and a parcel identification number.

      TaxStatusCurrent                              TaxStatusCurrent Enum                   The current tax status of the mobile home in cases where
                                                                                            the land or space is included in the sale.

                                                                                            A type of legal description for land in developed areas where
                                                                                            streets or other rights-of-ways delineate large parcels of land
                                                                                            referred to as divided into lots on which homes or other
                                                                                            types of developments are built. An example would read
                                                                                            "Lot 12 of Block 45 of Tract 3002 of the City of San Dunes,
      TaxTract                                      String                            25    Desert County." Such a description would also reference an
                                                                                            official plat filed with the clerk or recorder for that area
                                                                                            which shows the location of the block and often the
                                                                                            dimensions of the lots therein.

      TaxYear                                       Int32                              4    The year in with the last assessment of the property
                                                                                            value/tax was made.

      TenantPays                                    TenantPays Enum                         A list of services or items that the tenant is responsible to
                                                                                            pay.

      Topography                                    String                           768    The state of the surface of the land included with the
                                                                                            property. i.e. flat, rolling, etc.

      TotalActualRent                               Decimal                          14.2   Total actual rent currently being collected from tenants of
                                                                                            the income property.

      TotalDocumentsCount                           Int32                              4    TotalDocumentsCount

      TotalPhotosCount                              Int32                              4    TotalPhotosCount

      Township                                      String                            50    A subdivision of the county.

                                                                                            The total commission to be paid to the transaction facilitator,
      TransactionBrokerCompensation                 String                            25    expressed as either a percentage or a constant currency
                                                                                            amount.

                                                                                            A list of types to clarify the value entered in the
                                                                                            TransactionBrokerCompensation field. For example $, % or
      TransactionBrokerCompensationType             CompensationType Enum                   some other clarification of the
                                                                                            TransactionBrokerCompensation.

      TrashExpense                                  Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

                                                                                            Text field containing the number or portion of a larger
      UnitNumber                                    String                            25    building or complex. Unit Number should appear following
                                                                                            the street suffix or, if it exists, the street suffix direction, in
                                                                                            the street address. Examples are: "APT G", "55", etc.

      UnitsFurnished                                UnitsFurnished Enum                     Are the units furnished? i.e. All Units, Varies By Unit, None.

                                                                                            The type is a list of possible unit types (i.e. 1 Bedroom, 2
                                                                                            Bedroom, 3 Bedroom, Studio, Loft, etc.). Each selected item
                                                                                            is expected to appear as the type in the related UnitType
      UnitTypeType                                  UnitTypeType Enum                       fields in a flattened implementation (RETS 1.x only). A
                                                                                            relational implementation of UnitTypes must omit the type
                                                                                            from the field name and use UnitTypeType to create a
                                                                                            vertical representation of the various unit types.

                                                                                            The Universal Property Identifier is a unique identifier for all
                                                                                            real property in the US and Canada. It is based on country
      UniversalPropertyId                           String                           128    and local identification methods and is limited to real
                                                                                            property. For cases such as shares of real property, units,
                                                                                            and other more granular cases, please utilize the
                                                                                            UniversalPropertySubId.

                                                                                            The Universal Property Sub Identifier is a unique identifier
                                                                                            for all sub sets or shares of real property in the US and
                                                                                            Canada. This may include Stock Cooperatives, Community
      UniversalPropertySubId                        String                           128    Apartment, Units for Rent, etc. Informally abbreviated as
                                                                                            "UPSI", It is based on country and local identification
                                                                                            methods just as the UPI, but is limited to sub sets or shares
                                                                                            of real property. For cases of complete real property, please
                                                                                            utilize the UniversalPropertyId field.

                                                                                            The UnparsedAddress is a text representation of the
      UnparsedAddress                               String                           255    address with the full civic location as a single entity. It may
                                                                                            optionally include any of City, StateOrProvince, PostalCode
                                                                                            and Country.

      Utilities                                     Utilities Enum                          A list of the utilities for the property being sold/leased.

      UtilitiesExpense                              Decimal                          14.2   UtilitiesExpense

      VacancyAllowance                              Int32                              4    An estimate of the amount of rent that may be foregone
                                                                                            because of unoccupied units.

                                                                                            An estimate of the percent of rent that may be foregone

      VacancyAllowanceRate                          Decimal                           5.2   because of unoccupied units.

                                                                                            A list of the type(s) of vegetation on the property. Note that
      Vegetation                                    Vegetation Enum                         this is not for farm crops, but more residential type
                                                                                            vegetation.

      VideosChangeTimestamp                         DateTimeOffset                          System generated timestamp of when the last update or
                                                                                            change to the videos for this listing was made.

      VideosCount                                   Int32                              4    The total number of videos or virtual tours included with the
                                                                                            listing.

      View                                          View Enum                               A view as seen from the listed property.

      ViewYN                                        Boolean                                 The property has a view.

      VirtualTourURLBranded                         String                           8000   A text field that holds the URL for a branded virtual tour of
                                                                                            the property.

      VirtualTourURLBranded2                        String                           8000   VirtualTourURLBranded2

      VirtualTourURLBranded3                        String                           8000   VirtualTourURLBranded3

      VirtualTourURLUnbranded                       String                           8000   A text field that holds the URL for an unbranded virtual tour
                                                                                            of the property.

      VirtualTourURLUnbranded2                      String                           8000   VirtualTourURLUnbranded2

      VirtualTourURLUnbranded3                      String                           8000   VirtualTourURLUnbranded3

                                                                                            A walkability index based on the time to walk from a
      WalkScore                                     Int32                              4    property to near by essentials such as grocery stores,
                                                                                            schools, churches, etc. See www.walkscore.com for more
                                                                                            information and requirements for using WalkScore.

                                                                                            The name, if known, of the body of water on which the
      WaterBodyName                                 String                            50    property is located. (E.g., lake name, river name, ocean
                                                                                            name, sea name, canal name).

      WaterfrontFeatures                            WaterfrontFeatures Enum                 Features of the waterfront on which the property is located.

      WaterfrontYN                                  Boolean                                 The property is on the waterfront.

      WaterSewerExpense                             Decimal                          14.2   The annual expense that is not paid directly by the tenant
                                                                                            and is included in the Operating Expense calculations.

      WaterSource                                   WaterSource Enum                        A list of the source(s) of water for the property

      WindowFeatures                                WindowFeatures Enum                     A list of features or description of the windows included in
                                                                                            the sale/lease.

                                                                                            Date the listing was withdrawn from the market. This is not
                                                                                            when a listing contact was cancelled or closed, but a
                                                                                            withdrawal from the market while the contract between the
      WithdrawnDate                                 DateTime                                seller and listing agent is still in effect and an offer has not
                                                                                            been accepted. This is the date entered by the agent
                                                                                            reflecting when the change occurred contractually, not a
                                                                                            timestamp of when the change was made in the MLS.

      WoodedArea                                    Decimal                          14.2   Measurement or percentage of the property that is wooded
                                                                                            or forest.

                                                                                            The annual expense that is not paid directly by the tenant
      WorkmansCompensationExpense                   Decimal                          14.2   and is included in the Operating Expense calculations.

      X_GeocodeSource                               GeocodeSource Enum                      X_GeocodeSource

      X_Location                                    GeographyPoint                          X_Location

                                                                                            The year that an occupancy permit is first granted for the

                                                                                            house or other local measure of initial habitability of the
      YearBuilt                                     Int32                              4    build. The type definition permits an empty value with an
                                                                                            attribute noting that it is an unknown date or that the
                                                                                            building is new construction. While constraints have not
                                                                                            been applied, convention at the time of adoption has this as
                                                                                            a four (4) digit year value.

      YearBuiltDetails                              String                           1024   A description of the details behind the year the structure
                                                                                            was built.

      YearBuiltEffective                            Int32                              4    The year a major rebuild/renovated of the structure
                                                                                            occurred.

                                                                                            Add a list of sources of the year built. i.e. Appraiser,
      YearBuiltSource                               YearBuiltSource Enum                    Assessor, Builder, Estimated, etc.,

      YearEstablished                               Int32                              4    The year the business being sold was established.

      YearsCurrentOwner                             Int32                              4    The number of years the current owner has had possession
                                                                                            of the business.

                                                                                            A division of the city or county into areas of different
      Zoning                                        String                            25    permissible land uses. This Zone field should be used for the
                                                                                            short code that is commonly used. For full textual
                                                                                            descriptions please use the ZoningDescription field.

                                                                                            A list of descriptions of the zoning of the property. The
                                                                                            zoning codes are often non-descriptive and variant. Zoning
      ZoningDescription                             String                           255    Description is a more descriptive form of the zoning for the
                                                                                            property, i.e. Agricultural, Residential, Rezone Possible, etc.
                                                                                            Specific zone codes must be added to the Zoning field.

    Expands

      Name                 Target

      BuyerAgent           Member

      BuyerOffice          Office

      CoBuyerAgent         Member

      CoBuyerOffice        Office

      CoListAgent          Member

      CoListOffice         Office

      CustomProperty       CustomProperty

      ListAgent            Member

      ListOffice           Office

      Media                Media

      OpenHouse            OpenHouse

      Rooms                PropertyRooms

      UnitTypes            PropertyUnitTypes
