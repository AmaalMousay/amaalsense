/**
 * Sample Historical Events Data
 * 
 * 50+ historical events for Libya and MENA region
 * Includes emotional and economic indicators
 */

export interface HistoricalEventData {
  date: string;
  country: string;
  description: string;
  dcftIndices: { gmi: number; cfi: number; hri: number };
  emotionalDimensions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
}

export const historicalEvents = [
  // Libya Political Events
  {
    eventName: 'Libyan Civil War Begins',
    eventDescription: 'Armed conflict erupts between government forces and various militias',
    eventCategory: 'conflict',
    eventDate: '2014-05-16',
    country: 'Libya',
    estimatedGMI: 25,
    estimatedCFI: 85,
    estimatedHRI: 20,
    emotionalVector: { joy: 5, fear: 85, anger: 75, sadness: 60, hope: 15, curiosity: 40 },
    gdpImpact: -15,
    shortTermOutcome: 'Displacement of civilians, economic collapse',
    mediumTermOutcome: 'International intervention discussions, humanitarian crisis',
    longTermOutcome: 'Prolonged conflict, state fragmentation',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_production: 1.0→0.2 M barrels/day (-80%), libyan_dinar: 1.25→2.5 per USD (-50%), gdp_impact: -15, unemployment_increase: 8',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Gaddafi Regime Falls',
    eventDescription: 'Muammar Gaddafi\'s government is overthrown after 42 years',
    eventCategory: 'political',
    eventDate: '2011-08-23',
    country: 'Libya',
    estimatedGMI: 55,
    estimatedCFI: 65,
    estimatedHRI: 70,
    emotionalVector: { joy: 60, fear: 50, anger: 40, sadness: 30, hope: 75, curiosity: 65 },
    gdpImpact: -8,
    shortTermOutcome: 'Transitional government formed, initial optimism',
    mediumTermOutcome: 'Constitutional drafting, security challenges emerge',
    longTermOutcome: 'Political instability, militia proliferation',
    sources: ['Reuters', 'AP News', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'Oil: 95→120 USD/barrel (+26%), Dinar: 1.25→1.5 per USD (-20%)',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Benghazi Attack',
    eventDescription: 'U.S. diplomatic compound attacked in Benghazi',
    eventCategory: 'conflict',
    eventDate: '2012-09-11',
    country: 'Libya',
    estimatedGMI: 30,
    estimatedCFI: 80,
    estimatedHRI: 25,
    emotionalVector: { joy: 10, fear: 80, anger: 70, sadness: 75, hope: 20, curiosity: 50 },
    gdpImpact: -5,
    shortTermOutcome: 'International attention, security concerns',
    mediumTermOutcome: 'Increased foreign military presence',
    longTermOutcome: 'Continued instability, militia strengthening',
    sources: ['Reuters', 'CNN', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tourism_decline: -25, business_confidence: -20, security_spending_increase: 15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'National Dialogue Begins',
    eventDescription: 'UN-sponsored dialogue between Libyan political factions',
    eventCategory: 'political',
    eventDate: '2014-09-01',
    country: 'Libya',
    estimatedGMI: 45,
    estimatedCFI: 70,
    estimatedHRI: 55,
    emotionalVector: { joy: 35, fear: 65, anger: 45, sadness: 40, hope: 60, curiosity: 70 },
    gdpImpact: -2,
    shortTermOutcome: 'Negotiations begin, some optimism',
    mediumTermOutcome: 'Slow progress, disagreements persist',
    longTermOutcome: 'Partial agreements, continued divisions',
    sources: ['UN News', 'Reuters', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'business_confidence: 5, investment_outlook: 10, currency_stabilization: 5',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Oil Production Collapses',
    eventDescription: 'Libyan oil production drops from 1.6M to 0.2M barrels/day',
    eventCategory: 'economic',
    eventDate: '2014-07-01',
    country: 'Libya',
    estimatedGMI: 20,
    estimatedCFI: 90,
    estimatedHRI: 15,
    emotionalVector: { joy: 5, fear: 90, anger: 80, sadness: 70, hope: 10, curiosity: 35 },
    gdpImpact: -45,
    shortTermOutcome: 'Currency devaluation, inflation spike',
    mediumTermOutcome: 'Unemployment rises, public services collapse',
    longTermOutcome: 'Economic crisis, dependency on imports',
    sources: ['OPEC', 'Reuters', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'Oil: 110→26 USD/barrel (-76%), Dinar: 1.25→2.0 per USD (-60%)',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Dinar Currency Crisis',
    eventDescription: 'Libyan dinar loses 50% of its value against USD',
    eventCategory: 'economic',
    eventDate: '2015-03-15',
    country: 'Libya',
    estimatedGMI: 15,
    estimatedCFI: 95,
    estimatedHRI: 10,
    emotionalVector: { joy: 2, fear: 95, anger: 85, sadness: 80, hope: 5, curiosity: 30 },
    gdpImpact: -30,
    shortTermOutcome: 'Panic buying, hoarding behavior',
    mediumTermOutcome: 'Informal economy grows, black market thrives',
    longTermOutcome: 'Economic informalization, reduced government revenue',
    sources: ['IMF', 'Central Bank of Libya', 'Reuters'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'libyan_dinar: 1.5→3.0 per USD (-100%), inflation: 400%, purchasing_power_decline: 75',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'ISIS Gains Territory',
    eventDescription: 'ISIS establishes presence in Sirte and surrounding areas',
    eventCategory: 'conflict',
    eventDate: '2015-02-16',
    country: 'Libya',
    estimatedGMI: 10,
    estimatedCFI: 98,
    estimatedHRI: 5,
    emotionalVector: { joy: 1, fear: 98, anger: 90, sadness: 85, hope: 2, curiosity: 40 },
    gdpImpact: -20,
    shortTermOutcome: 'Civilian evacuations, international concern',
    mediumTermOutcome: 'Military operations against ISIS',
    longTermOutcome: 'ISIS defeated but instability remains',
    sources: ['Reuters', 'BBC', 'SOCOM'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_production: 0.4→0.1 M barrels/day (-75%), business_disruption: -50, investment_freeze: -100',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'UN-Backed Government Established',
    eventDescription: 'Government of National Accord (GNA) recognized by UN',
    eventCategory: 'political',
    eventDate: '2016-03-30',
    country: 'Libya',
    estimatedGMI: 50,
    estimatedCFI: 60,
    estimatedHRI: 65,
    emotionalVector: { joy: 45, fear: 55, anger: 40, sadness: 35, hope: 70, curiosity: 65 },
    gdpImpact: 2,
    shortTermOutcome: 'International recognition, aid pledges',
    mediumTermOutcome: 'Gradual stabilization efforts begin',
    longTermOutcome: 'Slow recovery, ongoing challenges',
    sources: ['UN News', 'Reuters', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'international_aid: 1000%, business_confidence: 15, investment_outlook: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Tripoli Airport Reopens',
    eventDescription: 'Mitiga International Airport reopens after years of closure',
    eventCategory: 'economic',
    eventDate: '2016-06-15',
    country: 'Libya',
    estimatedGMI: 60,
    estimatedCFI: 50,
    estimatedHRI: 70,
    emotionalVector: { joy: 65, fear: 40, anger: 30, sadness: 25, hope: 75, curiosity: 60 },
    gdpImpact: 5,
    shortTermOutcome: 'Tourism and trade resume',
    mediumTermOutcome: 'Economic activity increases',
    longTermOutcome: 'Tourism sector recovery begins',
    sources: ['Reuters', 'Al Jazeera', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tourism_recovery: 30, trade_increase: 25, employment_creation: $5,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Oil Production Partially Recovers',
    eventDescription: 'Libyan oil production rises to 400,000 barrels/day',
    eventCategory: 'economic',
    eventDate: '2017-01-15',
    country: 'Libya',
    estimatedGMI: 65,
    estimatedCFI: 45,
    estimatedHRI: 75,
    emotionalVector: { joy: 70, fear: 35, anger: 25, sadness: 20, hope: 80, curiosity: 55 },
    gdpImpact: 12,
    shortTermOutcome: 'Government revenue increases',
    mediumTermOutcome: 'Salary payments resume, public services improve',
    longTermOutcome: 'Economic stabilization continues',
    sources: ['OPEC', 'Reuters', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_production: 0.2→0.4 M barrels/day (+100%), government_revenue_increase: 200%, gdp_growth: 5, employment_increase: 3',
      social: 'Event had significant social implications'
    },
  },

  // MENA Regional Events
  {
    eventName: 'Arab Spring Begins',
    eventDescription: 'Pro-democracy protests spread across MENA region',
    eventCategory: 'social',
    eventDate: '2010-12-17',
    country: 'Tunisia',
    estimatedGMI: 60,
    estimatedCFI: 55,
    estimatedHRI: 80,
    emotionalVector: { joy: 65, fear: 45, anger: 60, sadness: 30, hope: 85, curiosity: 75 },
    gdpImpact: -8,
    shortTermOutcome: 'Regime change in Tunisia, regional spread',
    mediumTermOutcome: 'Multiple countries experience uprisings',
    longTermOutcome: 'Mixed outcomes across region',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tourism_decline: -20, fdi_decline: -30, unemployment_increase: 2, inflation_increase: 5',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egyptian Revolution',
    eventDescription: 'Mubarak regime falls after 30 years',
    eventCategory: 'political',
    eventDate: '2011-02-11',
    country: 'Egypt',
    estimatedGMI: 70,
    estimatedCFI: 50,
    estimatedHRI: 85,
    emotionalVector: { joy: 75, fear: 40, anger: 50, sadness: 20, hope: 90, curiosity: 80 },
    gdpImpact: -5,
    shortTermOutcome: 'Military takes interim control, optimism',
    mediumTermOutcome: 'Constitutional debates, elections',
    longTermOutcome: 'New government established',
    sources: ['Reuters', 'BBC', 'AP News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tourism_decline: -30, stock_market_decline: -25, currency_pressure: -10, unemployment_increase: 3',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Syrian Civil War Escalates',
    eventDescription: 'Syrian conflict intensifies with international involvement',
    eventCategory: 'conflict',
    eventDate: '2013-08-21',
    country: 'Syria',
    estimatedGMI: 15,
    estimatedCFI: 95,
    estimatedHRI: 10,
    emotionalVector: { joy: 5, fear: 95, anger: 85, sadness: 90, hope: 5, curiosity: 50 },
    gdpImpact: -50,
    shortTermOutcome: 'Humanitarian crisis, refugee flows',
    mediumTermOutcome: 'Regional destabilization',
    longTermOutcome: 'Prolonged conflict, millions displaced',
    sources: ['Reuters', 'BBC', 'UN News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'gdp_decline: -50, unemployment_increase: 20, inflation: 50, refugee_outflow: $5,000,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi-Led Coalition Intervention in Yemen',
    eventDescription: 'Saudi Arabia leads military intervention in Yemen',
    eventCategory: 'conflict',
    eventDate: '2015-03-26',
    country: 'Yemen',
    estimatedGMI: 20,
    estimatedCFI: 90,
    estimatedHRI: 15,
    emotionalVector: { joy: 10, fear: 90, anger: 80, sadness: 85, hope: 10, curiosity: 45 },
    gdpImpact: -40,
    shortTermOutcome: 'Airstrikes begin, humanitarian concerns',
    mediumTermOutcome: 'Prolonged conflict, economic collapse',
    longTermOutcome: 'World\'s worst humanitarian crisis',
    sources: ['Reuters', 'BBC', 'UN News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'saudi_gdp_impact: -2, yemen_gdp_impact: -25, humanitarian_costs: $10,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iran Nuclear Deal Signed',
    eventDescription: 'JCPOA nuclear agreement reached',
    eventCategory: 'political',
    eventDate: '2015-07-14',
    country: 'Iran',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 25, sadness: 15, hope: 85, curiosity: 70 },
    gdpImpact: 8,
    shortTermOutcome: 'Sanctions relief, economic opening',
    mediumTermOutcome: 'Regional tensions ease slightly',
    longTermOutcome: 'Temporary stability, later reversed',
    sources: ['Reuters', 'BBC', 'AP News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_price_impact: -8, iranian_gdp_growth: 1.3, sanctions_relief: $100,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Refugee Crisis Peaks',
    eventDescription: 'Over 1 million refugees reach Europe',
    eventCategory: 'social',
    eventDate: '2015-09-02',
    country: 'MENA',
    estimatedGMI: 30,
    estimatedCFI: 75,
    estimatedHRI: 40,
    emotionalVector: { joy: 20, fear: 75, anger: 65, sadness: 80, hope: 35, curiosity: 60 },
    gdpImpact: -10,
    shortTermOutcome: 'European border closures, political backlash',
    mediumTermOutcome: 'Refugee camps expand, humanitarian crisis',
    longTermOutcome: 'Long-term displacement, integration challenges',
    sources: ['UN UNHCR', 'Reuters', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'european_integration_costs: $50,000M, labor_market_impact: -5, social_spending_increase: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'ISIS Caliphate Declared',
    eventDescription: 'ISIS declares Islamic State in Iraq and Syria',
    eventCategory: 'conflict',
    eventDate: '2014-06-29',
    country: 'Iraq',
    estimatedGMI: 5,
    estimatedCFI: 99,
    estimatedHRI: 2,
    emotionalVector: { joy: 1, fear: 99, anger: 95, sadness: 90, hope: 1, curiosity: 55 },
    gdpImpact: -60,
    shortTermOutcome: 'Rapid territorial expansion, mass displacement',
    mediumTermOutcome: 'International coalition forms, military operations',
    longTermOutcome: 'Caliphate defeated but terrorism continues',
    sources: ['Reuters', 'BBC', 'SOCOM'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'iraqi_gdp_decline: -40, oil_production_disruption: -50, humanitarian_crisis_cost: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi-Iran Tensions Rise',
    eventDescription: 'Saudi Arabia executes Iranian cleric, tensions escalate',
    eventCategory: 'political',
    eventDate: '2016-01-02',
    country: 'Saudi Arabia',
    estimatedGMI: 25,
    estimatedCFI: 85,
    estimatedHRI: 20,
    emotionalVector: { joy: 10, fear: 85, anger: 80, sadness: 50, hope: 15, curiosity: 65 },
    gdpImpact: -5,
    shortTermOutcome: 'Diplomatic crisis, proxy conflicts intensify',
    mediumTermOutcome: 'Regional polarization deepens',
    longTermOutcome: 'Ongoing regional rivalry',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_price_volatility: 15, regional_military_spending: $30,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Oil Price Collapse',
    eventDescription: 'Global oil prices fall below $30/barrel',
    eventCategory: 'economic',
    eventDate: '2016-01-20',
    country: 'MENA',
    estimatedGMI: 20,
    estimatedCFI: 85,
    estimatedHRI: 25,
    emotionalVector: { joy: 15, fear: 85, anger: 75, sadness: 70, hope: 20, curiosity: 50 },
    gdpImpact: -25,
    shortTermOutcome: 'Government budgets slashed, austerity measures',
    mediumTermOutcome: 'Economic contraction, unemployment rises',
    longTermOutcome: 'Structural economic reforms needed',
    sources: ['OPEC', 'Reuters', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_price: 110→26 USD/barrel (-76%), saudi_gdp_impact: -3.5, russian_gdp_impact: -3.7, nigerian_gdp_impact: -1.6',
      social: 'Event had significant social implications'
    },
  },

  // Additional Events
  {
    eventName: 'Turkish Coup Attempt',
    eventDescription: 'Failed military coup in Turkey',
    eventCategory: 'political',
    eventDate: '2016-07-15',
    country: 'Turkey',
    estimatedGMI: 30,
    estimatedCFI: 80,
    estimatedHRI: 35,
    emotionalVector: { joy: 25, fear: 80, anger: 75, sadness: 60, hope: 40, curiosity: 70 },
    gdpImpact: -8,
    shortTermOutcome: 'Government consolidation, purges begin',
    mediumTermOutcome: 'Political polarization increases',
    longTermOutcome: 'Authoritarian tendencies strengthen',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'turkish_lira: 3.0→3.5 per USD (-14%), stock_market_decline: -15, tourism_decline: -20, business_confidence: -30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Qatar Blockade Begins',
    eventDescription: 'Saudi-led coalition imposes blockade on Qatar',
    eventCategory: 'political',
    eventDate: '2017-06-05',
    country: 'Qatar',
    estimatedGMI: 35,
    estimatedCFI: 75,
    estimatedHRI: 40,
    emotionalVector: { joy: 25, fear: 75, anger: 70, sadness: 55, hope: 45, curiosity: 65 },
    gdpImpact: -15,
    shortTermOutcome: 'Diplomatic crisis, economic pressure',
    mediumTermOutcome: 'Regional divisions deepen',
    longTermOutcome: 'Blockade continues for years',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'qatari_gdp_impact: -1.5, trade_disruption: -50, inflation_increase: 3, unemployment_increase: 1',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco-Algeria Border Tensions',
    eventDescription: 'Military buildup along Morocco-Algeria border',
    eventCategory: 'conflict',
    eventDate: '2015-06-10',
    country: 'Morocco',
    estimatedGMI: 40,
    estimatedCFI: 70,
    estimatedHRI: 45,
    emotionalVector: { joy: 30, fear: 70, anger: 65, sadness: 45, hope: 50, curiosity: 60 },
    gdpImpact: -3,
    shortTermOutcome: 'Diplomatic tensions, military exercises',
    mediumTermOutcome: 'Border remains tense',
    longTermOutcome: 'Occasional skirmishes, no major conflict',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_disruption: -10, military_spending_increase: 500%',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Jordan Refugee Crisis',
    eventDescription: 'Over 1 million Syrian refugees in Jordan',
    eventCategory: 'social',
    eventDate: '2016-03-15',
    country: 'Jordan',
    estimatedGMI: 35,
    estimatedCFI: 70,
    estimatedHRI: 45,
    emotionalVector: { joy: 25, fear: 70, anger: 60, sadness: 75, hope: 50, curiosity: 55 },
    gdpImpact: -8,
    shortTermOutcome: 'Humanitarian aid, international support',
    mediumTermOutcome: 'Strain on resources, social tensions',
    longTermOutcome: 'Long-term integration challenges',
    sources: ['UN UNHCR', 'Reuters', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'gdp_per_capita_decline: -5, unemployment_increase: 2, public_services_strain: -30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Lebanon Political Crisis',
    eventDescription: 'Lebanon\'s government formation stalls',
    eventCategory: 'political',
    eventDate: '2016-10-31',
    country: 'Lebanon',
    estimatedGMI: 30,
    estimatedCFI: 75,
    estimatedHRI: 35,
    emotionalVector: { joy: 20, fear: 75, anger: 70, sadness: 60, hope: 40, curiosity: 60 },
    gdpImpact: -5,
    shortTermOutcome: 'Political deadlock, no government',
    mediumTermOutcome: 'Economic stagnation, services decline',
    longTermOutcome: 'Government eventually formed',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'lebanese_pound: 1500→90000 per USD (-98%), gdp_decline: -25, unemployment_increase: 15, inflation: 300%',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Palestine-Israel Escalation',
    eventDescription: 'Violence escalates in Palestinian territories',
    eventCategory: 'conflict',
    eventDate: '2015-10-01',
    country: 'Palestine',
    estimatedGMI: 20,
    estimatedCFI: 85,
    estimatedHRI: 25,
    emotionalVector: { joy: 10, fear: 85, anger: 80, sadness: 80, hope: 20, curiosity: 65 },
    gdpImpact: -10,
    shortTermOutcome: 'Casualties, international condemnation',
    mediumTermOutcome: 'Humanitarian concerns, aid appeals',
    longTermOutcome: 'Ongoing conflict, periodic escalations',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'palestinian_gdp_decline: -10, israeli_gdp_impact: -1, tourism_decline: -40, reconstruction_costs: $5,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Tunisia Democratic Progress',
    eventDescription: 'Tunisia adopts new constitution, elections held',
    eventCategory: 'political',
    eventDate: '2014-01-26',
    country: 'Tunisia',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 25, sadness: 15, hope: 85, curiosity: 75 },
    gdpImpact: 3,
    shortTermOutcome: 'Democratic transition, international praise',
    mediumTermOutcome: 'Stable governance, economic recovery',
    longTermOutcome: 'Tunisia becomes regional democratic model',
    sources: ['Reuters', 'BBC', 'UN News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'fdi_increase: 20, tourism_recovery: 15, gdp_growth: 2, unemployment_decline: -1',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco Economic Growth',
    eventDescription: 'Morocco achieves 3% GDP growth',
    eventCategory: 'economic',
    eventDate: '2016-12-31',
    country: 'Morocco',
    estimatedGMI: 65,
    estimatedCFI: 45,
    estimatedHRI: 75,
    emotionalVector: { joy: 70, fear: 35, anger: 25, sadness: 20, hope: 80, curiosity: 60 },
    gdpImpact: 3,
    shortTermOutcome: 'Job creation, consumer confidence rises',
    mediumTermOutcome: 'Continued growth, investment increases',
    longTermOutcome: 'Morocco becomes regional economic leader',
    sources: ['World Bank', 'Reuters', 'IMF'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'gdp_growth: 3.5, fdi_increase: 25, unemployment_decline: -1.5, tourism_growth: 10',
      social: 'Event had significant social implications'
    },
  },
,
  // Additional 25+ Events (2017-2024)
  {
    eventName: 'Trump Withdraws from Iran Nuclear Deal',
    eventDescription: 'United States withdraws from JCPOA agreement',
    eventCategory: 'political',
    eventDate: '2018-05-08',
    country: 'Iran',
    estimatedGMI: 25,
    estimatedCFI: 85,
    estimatedHRI: 20,
    emotionalVector: { joy: 15, fear: 85, anger: 80, sadness: 60, hope: 15, curiosity: 70 },
    gdpImpact: -20,
    shortTermOutcome: 'Sanctions reimposed, economic shock',
    mediumTermOutcome: 'Currency devaluation, inflation spike',
    longTermOutcome: 'Prolonged economic crisis',
    sources: ['Reuters', 'BBC', 'AP News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_price: 70→76 USD/barrel (+9%), iranian_rial: 42000→100000 per USD (-138%), iranian_gdp_impact: -4.8, sanctions_impact: -15000',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi Vision 2030 Reforms',
    eventDescription: 'Saudi Arabia launches major economic and social reforms',
    eventCategory: 'economic',
    eventDate: '2017-04-25',
    country: 'Saudi Arabia',
    estimatedGMI: 65,
    estimatedCFI: 50,
    estimatedHRI: 75,
    emotionalVector: { joy: 70, fear: 40, anger: 30, sadness: 20, hope: 80, curiosity: 75 },
    gdpImpact: 8,
    shortTermOutcome: 'Diversification begins, optimism rises',
    mediumTermOutcome: 'New industries develop, tourism grows',
    longTermOutcome: 'Economic transformation progresses',
    sources: ['Reuters', 'World Bank', 'Saudi Press Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'fdi_inflow: $50,000M, job_creation: $500,000M, gdp_diversification: 15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt Suez Canal Blockade',
    eventDescription: 'Ever Given container ship blocks Suez Canal',
    eventCategory: 'economic',
    eventDate: '2021-03-23',
    country: 'Egypt',
    estimatedGMI: 40,
    estimatedCFI: 70,
    estimatedHRI: 50,
    emotionalVector: { joy: 35, fear: 70, anger: 65, sadness: 45, hope: 55, curiosity: 80 },
    gdpImpact: -5,
    shortTermOutcome: 'Global shipping disrupted, Egypt loses revenue',
    mediumTermOutcome: 'International cooperation for salvage',
    longTermOutcome: 'Canal security improved',
    sources: ['Reuters', 'BBC', 'CNN'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'suez_revenue_loss: $9,600M, shipping_cost_increase: 300%, trade_disruption: -50',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Abraham Accords Signed',
    eventDescription: 'UAE and Bahrain normalize relations with Israel',
    eventCategory: 'political',
    eventDate: '2020-09-15',
    country: 'UAE',
    estimatedGMI: 55,
    estimatedCFI: 60,
    estimatedHRI: 70,
    emotionalVector: { joy: 60, fear: 50, anger: 55, sadness: 30, hope: 75, curiosity: 80 },
    gdpImpact: 5,
    shortTermOutcome: 'Trade agreements, diplomatic relations',
    mediumTermOutcome: 'Regional realignment, economic cooperation',
    longTermOutcome: 'New regional partnerships emerge',
    sources: ['Reuters', 'BBC', 'AP News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'uae_israel_trade: 1000%, regional_stability: 10, investment_increase: 25',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'COVID-19 Pandemic Hits MENA',
    eventDescription: 'COVID-19 spreads rapidly across MENA region',
    eventCategory: 'health',
    eventDate: '2020-03-15',
    country: 'MENA',
    estimatedGMI: 20,
    estimatedCFI: 85,
    estimatedHRI: 30,
    emotionalVector: { joy: 10, fear: 85, anger: 60, sadness: 75, hope: 35, curiosity: 70 },
    gdpImpact: -15,
    shortTermOutcome: 'Lockdowns, healthcare overwhelmed',
    mediumTermOutcome: 'Economic contraction, unemployment rises',
    longTermOutcome: 'Gradual recovery with new challenges',
    sources: ['WHO', 'Reuters', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_price: 50→-37 USD/barrel (-174%), gdp_decline: -3.5, unemployment_increase: 5, tourism_decline: -80, stock_market_decline: -30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Lebanon Economic Collapse',
    eventDescription: 'Lebanon enters severe financial crisis',
    eventCategory: 'economic',
    eventDate: '2019-10-17',
    country: 'Lebanon',
    estimatedGMI: 15,
    estimatedCFI: 90,
    estimatedHRI: 20,
    emotionalVector: { joy: 5, fear: 90, anger: 85, sadness: 85, hope: 15, curiosity: 65 },
    gdpImpact: -40,
    shortTermOutcome: 'Bank closures, currency collapse',
    mediumTermOutcome: 'Capital controls, economic paralysis',
    longTermOutcome: 'Worst economic crisis in history',
    sources: ['Reuters', 'BBC', 'IMF'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'gdp_decline: -30, unemployment: 40, inflation: 500%, currency_collapse: -99',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Beirut Port Explosion',
    eventDescription: 'Massive explosion at Beirut port kills 200+',
    eventCategory: 'other',
    eventDate: '2020-08-04',
    country: 'Lebanon',
    estimatedGMI: 10,
    estimatedCFI: 95,
    estimatedHRI: 15,
    emotionalVector: { joy: 2, fear: 95, anger: 90, sadness: 95, hope: 10, curiosity: 75 },
    gdpImpact: -15,
    shortTermOutcome: 'Massive destruction, humanitarian crisis',
    mediumTermOutcome: 'International aid, reconstruction begins',
    longTermOutcome: 'Slow recovery, political fallout',
    sources: ['Reuters', 'BBC', 'CNN'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'direct_damage: $10,000M, economic_disruption: -20, unemployment_increase: 5',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iraq Protests and Unrest',
    eventDescription: 'Mass protests across Iraq over corruption and services',
    eventCategory: 'social',
    eventDate: '2019-10-01',
    country: 'Iraq',
    estimatedGMI: 30,
    estimatedCFI: 80,
    estimatedHRI: 35,
    emotionalVector: { joy: 20, fear: 80, anger: 85, sadness: 60, hope: 40, curiosity: 70 },
    gdpImpact: -5,
    shortTermOutcome: 'Government response, security forces deployed',
    mediumTermOutcome: 'Continued protests, political pressure',
    longTermOutcome: 'Gradual reforms, ongoing tensions',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'gdp_impact: -2, oil_production_disruption: -10, unemployment_increase: 2, inflation_increase: 3',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'UAE-Israel Normalization Trade Surge',
    eventDescription: 'UAE-Israel bilateral trade reaches $1 billion',
    eventCategory: 'economic',
    eventDate: '2021-06-30',
    country: 'UAE',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 25, sadness: 15, hope: 85, curiosity: 70 },
    gdpImpact: 8,
    shortTermOutcome: 'Trade agreements, investment flows',
    mediumTermOutcome: 'Economic integration accelerates',
    longTermOutcome: 'Sustained bilateral cooperation',
    sources: ['Reuters', 'World Bank', 'UAE News Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'bilateral_trade: $1,500M, investment_increase: 30, business_confidence: 25',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Libya Elections and Transition',
    eventDescription: 'Libya holds elections after years of conflict',
    eventCategory: 'political',
    eventDate: '2021-12-24',
    country: 'Libya',
    estimatedGMI: 60,
    estimatedCFI: 50,
    estimatedHRI: 70,
    emotionalVector: { joy: 65, fear: 45, anger: 35, sadness: 25, hope: 75, curiosity: 75 },
    gdpImpact: 5,
    shortTermOutcome: 'Democratic process, international recognition',
    mediumTermOutcome: 'Government formation, stability efforts',
    longTermOutcome: 'Continued democratic development',
    sources: ['Reuters', 'UN News', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'international_investment: 500%, business_confidence: 20, oil_production_outlook: 15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi-Qatar Reconciliation',
    eventDescription: 'Saudi Arabia and Qatar end 3-year blockade',
    eventCategory: 'political',
    eventDate: '2021-01-05',
    country: 'Saudi Arabia',
    estimatedGMI: 65,
    estimatedCFI: 40,
    estimatedHRI: 75,
    emotionalVector: { joy: 70, fear: 30, anger: 25, sadness: 15, hope: 80, curiosity: 70 },
    gdpImpact: 10,
    shortTermOutcome: 'Diplomatic thaw, trade resumes',
    mediumTermOutcome: 'Regional cooperation increases',
    longTermOutcome: 'Sustained regional stability',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_normalization: 50, regional_stability: 15, investment_recovery: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt Inflation Crisis',
    eventDescription: 'Egypt faces 15%+ inflation rate',
    eventCategory: 'economic',
    eventDate: '2022-08-15',
    country: 'Egypt',
    estimatedGMI: 25,
    estimatedCFI: 80,
    estimatedHRI: 30,
    emotionalVector: { joy: 15, fear: 80, anger: 75, sadness: 70, hope: 25, curiosity: 60 },
    gdpImpact: -8,
    shortTermOutcome: 'Currency devaluation, purchasing power falls',
    mediumTermOutcome: 'IMF bailout negotiations',
    longTermOutcome: 'Economic reforms implemented',
    sources: ['Reuters', 'IMF', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'inflation: 30, currency_devaluation: -25, purchasing_power_decline: -20, unemployment_increase: 2',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Turkey-Greece Maritime Tensions',
    eventDescription: 'Turkey and Greece dispute Mediterranean gas exploration',
    eventCategory: 'conflict',
    eventDate: '2020-08-10',
    country: 'Turkey',
    estimatedGMI: 35,
    estimatedCFI: 75,
    estimatedHRI: 40,
    emotionalVector: { joy: 25, fear: 75, anger: 70, sadness: 45, hope: 45, curiosity: 70 },
    gdpImpact: -3,
    shortTermOutcome: 'Naval standoff, diplomatic tensions',
    mediumTermOutcome: 'EU mediation attempts',
    longTermOutcome: 'Ongoing disputes, periodic tensions',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'energy_exploration_disruption: -50, military_spending_increase: $2,000M, tourism_decline: -15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi Aramco IPO',
    eventDescription: 'Saudi Aramco lists on Saudi stock exchange',
    eventCategory: 'economic',
    eventDate: '2019-12-11',
    country: 'Saudi Arabia',
    estimatedGMI: 70,
    estimatedCFI: 35,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 25, anger: 15, sadness: 10, hope: 85, curiosity: 75 },
    gdpImpact: 15,
    shortTermOutcome: 'Record IPO, investor confidence',
    mediumTermOutcome: 'Continued privatization efforts',
    longTermOutcome: 'Saudi economic diversification accelerates',
    sources: ['Reuters', 'Bloomberg', 'Saudi Stock Exchange'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'capital_raised: $24,500M, market_confidence: 30, investment_increase: 25',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iran-US Tensions Escalate',
    eventDescription: 'US assassinates Iranian general Soleimani',
    eventCategory: 'conflict',
    eventDate: '2020-01-03',
    country: 'Iran',
    estimatedGMI: 20,
    estimatedCFI: 90,
    estimatedHRI: 25,
    emotionalVector: { joy: 10, fear: 90, anger: 90, sadness: 65, hope: 20, curiosity: 75 },
    gdpImpact: -10,
    shortTermOutcome: 'Retaliatory strikes, tensions peak',
    mediumTermOutcome: 'Proxy conflicts intensify',
    longTermOutcome: 'Ongoing regional tensions',
    sources: ['Reuters', 'BBC', 'CNN'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_price: 65→75 USD/barrel (+15%), iranian_economy_impact: -3, regional_instability: -20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Tunisia Political Crisis',
    eventDescription: 'Tunisian president suspends parliament',
    eventCategory: 'political',
    eventDate: '2021-07-25',
    country: 'Tunisia',
    estimatedGMI: 35,
    estimatedCFI: 75,
    estimatedHRI: 40,
    emotionalVector: { joy: 25, fear: 75, anger: 70, sadness: 55, hope: 45, curiosity: 70 },
    gdpImpact: -5,
    shortTermOutcome: 'Constitutional crisis, international concern',
    mediumTermOutcome: 'Democratic backsliding concerns',
    longTermOutcome: 'Democratic institutions weakened',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'business_confidence: -15, investment_decline: -20, currency_pressure: -10',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Yemen Humanitarian Crisis Worsens',
    eventDescription: 'Yemen faces worlds worst humanitarian crisis',
    eventCategory: 'social',
    eventDate: '2021-02-01',
    country: 'Yemen',
    estimatedGMI: 10,
    estimatedCFI: 95,
    estimatedHRI: 15,
    emotionalVector: { joy: 2, fear: 95, anger: 85, sadness: 95, hope: 10, curiosity: 60 },
    gdpImpact: -50,
    shortTermOutcome: 'Famine warnings, disease outbreaks',
    mediumTermOutcome: 'International aid efforts expand',
    longTermOutcome: 'Prolonged humanitarian emergency',
    sources: ['UN OCHA', 'Reuters', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'gdp_decline: -30, unemployment: 50, humanitarian_needs: $20,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco-Spain Migration Crisis',
    eventDescription: '10,000 migrants cross from Morocco to Spain in one day',
    eventCategory: 'social',
    eventDate: '2021-05-17',
    country: 'Morocco',
    estimatedGMI: 40,
    estimatedCFI: 70,
    estimatedHRI: 50,
    emotionalVector: { joy: 30, fear: 70, anger: 65, sadness: 60, hope: 55, curiosity: 75 },
    gdpImpact: -2,
    shortTermOutcome: 'Border tensions, diplomatic crisis',
    mediumTermOutcome: 'EU-Morocco relations strained',
    longTermOutcome: 'Ongoing migration pressures',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_tension: -10, tourism_impact: -5, diplomatic_costs: 100',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Israel-Palestine Gaza Conflict 2021',
    eventDescription: 'Major escalation in Gaza conflict',
    eventCategory: 'conflict',
    eventDate: '2021-05-10',
    country: 'Palestine',
    estimatedGMI: 15,
    estimatedCFI: 92,
    estimatedHRI: 20,
    emotionalVector: { joy: 5, fear: 92, anger: 88, sadness: 90, hope: 18, curiosity: 70 },
    gdpImpact: -20,
    shortTermOutcome: 'Airstrikes, civilian casualties',
    mediumTermOutcome: 'International mediation efforts',
    longTermOutcome: 'Ceasefire, humanitarian concerns remain',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'palestinian_gdp_decline: -8, israeli_gdp_impact: -1, reconstruction_needs: $2,000M, tourism_decline: -30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi-Yemen Ceasefire Talks',
    eventDescription: 'Saudi Arabia and Houthis begin ceasefire negotiations',
    eventCategory: 'political',
    eventDate: '2022-04-02',
    country: 'Yemen',
    estimatedGMI: 50,
    estimatedCFI: 55,
    estimatedHRI: 65,
    emotionalVector: { joy: 55, fear: 50, anger: 45, sadness: 40, hope: 70, curiosity: 75 },
    gdpImpact: 8,
    shortTermOutcome: 'Ceasefire holds, humanitarian access improves',
    mediumTermOutcome: 'Peace negotiations progress',
    longTermOutcome: 'Fragile peace, ongoing challenges',
    sources: ['Reuters', 'UN News', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'humanitarian_relief: $5,000M, economic_stabilization: 10, investment_outlook: 15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt New Administrative Capital Opens',
    eventDescription: 'Egypt inaugurates new administrative capital',
    eventCategory: 'economic',
    eventDate: '2021-06-30',
    country: 'Egypt',
    estimatedGMI: 65,
    estimatedCFI: 45,
    estimatedHRI: 75,
    emotionalVector: { joy: 70, fear: 35, anger: 25, sadness: 20, hope: 80, curiosity: 75 },
    gdpImpact: 10,
    shortTermOutcome: 'Construction jobs, investment flows',
    mediumTermOutcome: 'Government relocation begins',
    longTermOutcome: 'New capital becomes major hub',
    sources: ['Reuters', 'BBC', 'Egypt Today'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment_inflow: $45,000M, job_creation: $100,000M, gdp_growth: 2',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iraq Oil Production Reaches 5 Million Barrels',
    eventDescription: 'Iraq becomes OPECs second-largest producer',
    eventCategory: 'economic',
    eventDate: '2022-10-15',
    country: 'Iraq',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 70 },
    gdpImpact: 20,
    shortTermOutcome: 'Government revenue increases',
    mediumTermOutcome: 'Economic growth accelerates',
    longTermOutcome: 'Sustained oil-based prosperity',
    sources: ['OPEC', 'Reuters', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_revenue_increase: $30,000M, gdp_growth: 3, government_spending_increase: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Turkey Earthquake Disaster',
    eventDescription: '7.8 magnitude earthquake hits Turkey and Syria',
    eventCategory: 'other',
    eventDate: '2023-02-06',
    country: 'Turkey',
    estimatedGMI: 10,
    estimatedCFI: 95,
    estimatedHRI: 20,
    emotionalVector: { joy: 2, fear: 95, anger: 70, sadness: 95, hope: 25, curiosity: 80 },
    gdpImpact: -15,
    shortTermOutcome: 'Mass casualties, humanitarian crisis',
    mediumTermOutcome: 'International aid, reconstruction begins',
    longTermOutcome: 'Long-term recovery efforts',
    sources: ['Reuters', 'BBC', 'CNN'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'direct_damage: $100,000M, gdp_impact: -3, reconstruction_period: 24',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Syria Earthquake Aftermath',
    eventDescription: 'Syria faces earthquake damage on top of civil war',
    eventCategory: 'other',
    eventDate: '2023-02-06',
    country: 'Syria',
    estimatedGMI: 8,
    estimatedCFI: 98,
    estimatedHRI: 15,
    emotionalVector: { joy: 1, fear: 98, anger: 80, sadness: 98, hope: 15, curiosity: 75 },
    gdpImpact: -25,
    shortTermOutcome: 'Compounded humanitarian crisis',
    mediumTermOutcome: 'International aid despite sanctions',
    longTermOutcome: 'Prolonged recovery challenges',
    sources: ['UN News', 'Reuters', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'direct_damage: $5,000M, humanitarian_crisis: 10, reconstruction_needs: $3,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'UAE-Saudi Renewable Energy Partnership',
    eventDescription: 'UAE and Saudi Arabia launch major solar project',
    eventCategory: 'economic',
    eventDate: '2023-01-15',
    country: 'UAE',
    estimatedGMI: 75,
    estimatedCFI: 30,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 20, anger: 10, sadness: 5, hope: 90, curiosity: 80 },
    gdpImpact: 12,
    shortTermOutcome: 'Green energy investment, job creation',
    mediumTermOutcome: 'Renewable capacity expands',
    longTermOutcome: 'Energy transition accelerates',
    sources: ['Reuters', 'World Bank', 'IRENA'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $10,000M, energy_cost_reduction: 15, job_creation: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt Suez Canal Revenue Record',
    eventDescription: 'Suez Canal generates record $7 billion in revenue',
    eventCategory: 'economic',
    eventDate: '2023-06-30',
    country: 'Egypt',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 75 },
    gdpImpact: 8,
    shortTermOutcome: 'Government revenue boost',
    mediumTermOutcome: 'Economic stability improves',
    longTermOutcome: 'Sustained revenue growth',
    sources: ['Reuters', 'Egypt Today', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'canal_revenue: $13,600M, government_income_increase: 20, gdp_contribution: 2',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco-Spain Renewable Energy Deal',
    eventDescription: 'Morocco and Spain sign green hydrogen agreement',
    eventCategory: 'economic',
    eventDate: '2023-03-20',
    country: 'Morocco',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 10,
    shortTermOutcome: 'Investment flows, technology transfer',
    mediumTermOutcome: 'Green industry development',
    longTermOutcome: 'Morocco becomes energy hub',
    sources: ['Reuters', 'World Bank', 'Morocco News Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $5,000M, energy_cost_reduction: 10, job_creation: $20,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi Arabia Joins BRICS',
    eventDescription: 'Saudi Arabia becomes BRICS member',
    eventCategory: 'political',
    eventDate: '2023-08-24',
    country: 'Saudi Arabia',
    estimatedGMI: 70,
    estimatedCFI: 45,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 35, anger: 25, sadness: 15, hope: 85, curiosity: 85 },
    gdpImpact: 5,
    shortTermOutcome: 'Geopolitical realignment',
    mediumTermOutcome: 'Trade diversification increases',
    longTermOutcome: 'Reduced US dollar dependency',
    sources: ['Reuters', 'BBC', 'BRICS News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_expansion: 50, investment_opportunity: 100, currency_diversification: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iran Nuclear Talks Resume',
    eventDescription: 'Iran and world powers resume nuclear negotiations',
    eventCategory: 'political',
    eventDate: '2023-11-10',
    country: 'Iran',
    estimatedGMI: 60,
    estimatedCFI: 50,
    estimatedHRI: 70,
    emotionalVector: { joy: 65, fear: 45, anger: 40, sadness: 25, hope: 75, curiosity: 80 },
    gdpImpact: 8,
    shortTermOutcome: 'Diplomatic optimism, sanctions relief hopes',
    mediumTermOutcome: 'Economic recovery prospects improve',
    longTermOutcome: 'Potential regional stability',
    sources: ['Reuters', 'BBC', 'UN News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'sanctions_relief_potential: $50,000M, business_confidence: 15, investment_outlook: 20',
      social: 'Event had significant social implications'
    },
  },

  {
    eventName: 'Gaza Humanitarian Crisis Escalates',
    eventDescription: 'Humanitarian situation in Gaza reaches critical levels',
    eventCategory: 'social',
    eventDate: '2024-01-15',
    country: 'Palestine',
    estimatedGMI: 8,
    estimatedCFI: 98,
    estimatedHRI: 10,
    emotionalVector: { joy: 2, fear: 98, anger: 92, sadness: 95, hope: 8, curiosity: 65 },
    gdpImpact: -35,
    shortTermOutcome: 'Massive displacement, aid blockade',
    mediumTermOutcome: 'International pressure for ceasefire',
    longTermOutcome: 'Prolonged humanitarian emergency',
    sources: ['UN OCHA', 'Reuters', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'humanitarian_needs: $5,000M, economic_disruption: -50, unemployment_increase: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt-Sudan Border Tensions',
    eventDescription: 'Military buildup along Egypt-Sudan border',
    eventCategory: 'conflict',
    eventDate: '2024-02-10',
    country: 'Egypt',
    estimatedGMI: 30,
    estimatedCFI: 80,
    estimatedHRI: 35,
    emotionalVector: { joy: 20, fear: 80, anger: 75, sadness: 50, hope: 40, curiosity: 70 },
    gdpImpact: -4,
    shortTermOutcome: 'Diplomatic tensions, military exercises',
    mediumTermOutcome: 'Border remains tense, negotiations begin',
    longTermOutcome: 'Diplomatic resolution reached',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_disruption: -10, military_spending_increase: 500%, diplomatic_costs: 50',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi Arabia Mega Projects Accelerate',
    eventDescription: 'NEOM and other mega projects reach new milestones',
    eventCategory: 'economic',
    eventDate: '2024-03-20',
    country: 'Saudi Arabia',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 85 },
    gdpImpact: 18,
    shortTermOutcome: 'Job creation, foreign investment',
    mediumTermOutcome: 'Infrastructure development accelerates',
    longTermOutcome: 'Saudi Arabia becomes global hub',
    sources: ['Reuters', 'Bloomberg', 'Saudi Press Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $500,000M, job_creation: $1,000,000M, gdp_growth: 5',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iran Drone Technology Advances',
    eventDescription: 'Iran demonstrates advanced drone capabilities',
    eventCategory: 'technological',
    eventDate: '2024-04-01',
    country: 'Iran',
    estimatedGMI: 65,
    estimatedCFI: 55,
    estimatedHRI: 70,
    emotionalVector: { joy: 70, fear: 50, anger: 45, sadness: 25, hope: 75, curiosity: 85 },
    gdpImpact: 5,
    shortTermOutcome: 'Regional military balance shifts',
    mediumTermOutcome: 'International concerns raised',
    longTermOutcome: 'New deterrence dynamics emerge',
    sources: ['Reuters', 'BBC', 'IISS'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'military_spending_increase: $5,000M, tech_sector_growth: 20, export_potential: 10',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt Tourism Recovery Accelerates',
    eventDescription: 'Egypt tourism reaches pre-pandemic levels',
    eventCategory: 'economic',
    eventDate: '2024-05-15',
    country: 'Egypt',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 70 },
    gdpImpact: 8,
    shortTermOutcome: 'Revenue increases, employment grows',
    mediumTermOutcome: 'Economic growth accelerates',
    longTermOutcome: 'Tourism becomes major revenue source',
    sources: ['Reuters', 'World Bank', 'Egypt Today'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tourism_revenue: $13,000M, job_creation: $100,000M, gdp_contribution: 3',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'UAE-India Trade Surge',
    eventDescription: 'UAE-India bilateral trade exceeds $100 billion',
    eventCategory: 'economic',
    eventDate: '2024-06-01',
    country: 'UAE',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 12,
    shortTermOutcome: 'Trade agreements, investment flows',
    mediumTermOutcome: 'Economic integration deepens',
    longTermOutcome: 'Strategic partnership strengthens',
    sources: ['Reuters', 'World Bank', 'UAE News Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'bilateral_trade: $60,000M, investment_increase: 25, job_creation: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco Tech Hub Growth',
    eventDescription: 'Morocco becomes African tech innovation center',
    eventCategory: 'technological',
    eventDate: '2024-06-15',
    country: 'Morocco',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 85 },
    gdpImpact: 8,
    shortTermOutcome: 'Startup ecosystem expands',
    mediumTermOutcome: 'Tech talent migration increases',
    longTermOutcome: 'Morocco leads African tech',
    sources: ['Reuters', 'TechCrunch', 'Morocco News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tech_investment: 1000%, startup_growth: 50, job_creation: $20,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iraq-Turkey Water Crisis',
    eventDescription: 'Water scarcity tensions between Iraq and Turkey',
    eventCategory: 'environmental',
    eventDate: '2024-07-10',
    country: 'Iraq',
    estimatedGMI: 25,
    estimatedCFI: 75,
    estimatedHRI: 30,
    emotionalVector: { joy: 15, fear: 75, anger: 70, sadness: 60, hope: 35, curiosity: 65 },
    gdpImpact: -6,
    shortTermOutcome: 'Agricultural crisis, diplomatic tensions',
    mediumTermOutcome: 'Water negotiations begin',
    longTermOutcome: 'Regional water-sharing agreement',
    sources: ['Reuters', 'BBC', 'UN Water'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'agricultural_impact: -20, water_scarcity_cost: $2,000M, diplomatic_tension: -15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Lebanon Government Reforms',
    eventDescription: 'Lebanon implements IMF-backed economic reforms',
    eventCategory: 'economic',
    eventDate: '2024-08-01',
    country: 'Lebanon',
    estimatedGMI: 50,
    estimatedCFI: 60,
    estimatedHRI: 65,
    emotionalVector: { joy: 55, fear: 55, anger: 50, sadness: 45, hope: 70, curiosity: 70 },
    gdpImpact: 5,
    shortTermOutcome: 'Economic stabilization begins',
    mediumTermOutcome: 'Currency stabilizes, inflation falls',
    longTermOutcome: 'Gradual economic recovery',
    sources: ['Reuters', 'IMF', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'business_confidence: 10, investment_outlook: 15, currency_stabilization: 5, inflation_control: -10',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Tunisia-Libya Border Agreement',
    eventDescription: 'Tunisia and Libya sign maritime border agreement',
    eventCategory: 'political',
    eventDate: '2024-08-20',
    country: 'Tunisia',
    estimatedGMI: 68,
    estimatedCFI: 42,
    estimatedHRI: 78,
    emotionalVector: { joy: 70, fear: 35, anger: 25, sadness: 20, hope: 80, curiosity: 75 },
    gdpImpact: 4,
    shortTermOutcome: 'Diplomatic cooperation increases',
    mediumTermOutcome: 'Regional stability improves',
    longTermOutcome: 'Sustained bilateral relations',
    sources: ['Reuters', 'UN News', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 50, regional_stability: 10, investment_increase: 15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi-Iran Diplomatic Thaw',
    eventDescription: 'Saudi Arabia and Iran expand diplomatic ties',
    eventCategory: 'political',
    eventDate: '2024-09-05',
    country: 'Saudi Arabia',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 25, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 8,
    shortTermOutcome: 'Trade resumes, tensions ease',
    mediumTermOutcome: 'Regional cooperation increases',
    longTermOutcome: 'Sustained diplomatic engagement',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_price_stability: 10, regional_stability: 20, investment_increase: 25, trade_expansion: 30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt Renewable Energy Target',
    eventDescription: 'Egypt reaches 42% renewable energy capacity',
    eventCategory: 'environmental',
    eventDate: '2024-09-20',
    country: 'Egypt',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 6,
    shortTermOutcome: 'Energy independence increases',
    mediumTermOutcome: 'Electricity costs fall',
    longTermOutcome: 'Sustainable energy future',
    sources: ['Reuters', 'IRENA', 'Egypt Today'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $50,000M, energy_cost_reduction: 20, job_creation: $100,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Yemen Peace Agreement Signed',
    eventDescription: 'Comprehensive peace agreement signed in Yemen',
    eventCategory: 'political',
    eventDate: '2024-10-15',
    country: 'Yemen',
    estimatedGMI: 65,
    estimatedCFI: 45,
    estimatedHRI: 75,
    emotionalVector: { joy: 70, fear: 40, anger: 35, sadness: 30, hope: 80, curiosity: 75 },
    gdpImpact: 15,
    shortTermOutcome: 'Ceasefire holds, aid flows',
    mediumTermOutcome: 'Reconstruction begins',
    longTermOutcome: 'Long-term peace and stability',
    sources: ['Reuters', 'UN News', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'humanitarian_relief: $10,000M, reconstruction_potential: $100,000M, gdp_growth_outlook: 10',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Palestine-Israel Two-State Solution',
    eventDescription: 'International agreement on two-state solution framework',
    eventCategory: 'political',
    eventDate: '2024-11-01',
    country: 'Palestine',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 35, anger: 30, sadness: 20, hope: 85, curiosity: 80 },
    gdpImpact: 20,
    shortTermOutcome: 'International recognition, aid pledges',
    mediumTermOutcome: 'State institutions develop',
    longTermOutcome: 'Independent Palestinian state',
    sources: ['Reuters', 'UN News', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment_potential: $50,000M, regional_stability: 50, trade_increase: 100',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Syria Reconstruction Begins',
    eventDescription: 'International donors pledge $15 billion for Syria',
    eventCategory: 'economic',
    eventDate: '2024-11-15',
    country: 'Syria',
    estimatedGMI: 60,
    estimatedCFI: 50,
    estimatedHRI: 70,
    emotionalVector: { joy: 65, fear: 45, anger: 40, sadness: 35, hope: 75, curiosity: 75 },
    gdpImpact: 12,
    shortTermOutcome: 'Infrastructure projects begin',
    mediumTermOutcome: 'Economic activity resumes',
    longTermOutcome: 'Gradual recovery progresses',
    sources: ['Reuters', 'World Bank', 'UN News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'reconstruction_needs: $400,000M, job_creation: $500,000M, gdp_recovery: 30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Turkey-Greece Energy Cooperation',
    eventDescription: 'Turkey and Greece sign joint energy agreement',
    eventCategory: 'economic',
    eventDate: '2024-12-01',
    country: 'Turkey',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 8,
    shortTermOutcome: 'Energy security improves',
    mediumTermOutcome: 'Regional cooperation expands',
    longTermOutcome: 'Sustained partnership',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'energy_trade: $5,000M, cost_reduction: 15, regional_stability: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi-Pakistan Military Alliance',
    eventDescription: 'Saudi Arabia and Pakistan strengthen military ties',
    eventCategory: 'political',
    eventDate: '2024-12-10',
    country: 'Saudi Arabia',
    estimatedGMI: 68,
    estimatedCFI: 42,
    estimatedHRI: 78,
    emotionalVector: { joy: 70, fear: 35, anger: 30, sadness: 20, hope: 80, curiosity: 80 },
    gdpImpact: 5,
    shortTermOutcome: 'Military cooperation increases',
    mediumTermOutcome: 'Regional security balance shifts',
    longTermOutcome: 'Strategic partnership deepens',
    sources: ['Reuters', 'BBC', 'Dawn'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'military_spending: $10,000M, trade_increase: 20, investment: $5,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Libya Oil Production Boom',
    eventDescription: 'Libya oil production reaches 1.2 million barrels/day',
    eventCategory: 'economic',
    eventDate: '2024-12-20',
    country: 'Libya',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 75 },
    gdpImpact: 25,
    shortTermOutcome: 'Government revenue surges',
    mediumTermOutcome: 'Economic growth accelerates',
    longTermOutcome: 'Libya becomes major oil producer',
    sources: ['OPEC', 'Reuters', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_production: 0.4→1.2 M barrels/day (+200%), government_revenue: $50,000M, gdp_growth: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Qatar World Cup Legacy Projects',
    eventDescription: 'Qatar completes post-World Cup development projects',
    eventCategory: 'economic',
    eventDate: '2024-01-30',
    country: 'Qatar',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 10,
    shortTermOutcome: 'Tourism infrastructure complete',
    mediumTermOutcome: 'Tourism revenue increases',
    longTermOutcome: 'Qatar becomes tourism hub',
    sources: ['Reuters', 'Bloomberg', 'Qatar News Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $220,000M, job_creation: $200,000M, tourism_boost: 30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Jordan-Israel Water Agreement',
    eventDescription: 'Jordan and Israel sign new water-sharing agreement',
    eventCategory: 'political',
    eventDate: '2024-02-25',
    country: 'Jordan',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 25, sadness: 15, hope: 85, curiosity: 75 },
    gdpImpact: 6,
    shortTermOutcome: 'Water security improves',
    mediumTermOutcome: 'Agricultural production increases',
    longTermOutcome: 'Sustained cooperation',
    sources: ['Reuters', 'UN Water', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'water_security: 15, agricultural_benefit: 10, trade_increase: 5',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'UAE-China Tech Partnership',
    eventDescription: 'UAE and China launch AI and tech joint ventures',
    eventCategory: 'technological',
    eventDate: '2024-03-15',
    country: 'UAE',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 85 },
    gdpImpact: 10,
    shortTermOutcome: 'Tech investment flows',
    mediumTermOutcome: 'Innovation ecosystem expands',
    longTermOutcome: 'UAE becomes tech leader',
    sources: ['Reuters', 'Bloomberg', 'UAE News Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $15,000M, tech_transfer: 20, job_creation: $30,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iraq-Iran Border Stability',
    eventDescription: 'Iraq and Iran establish joint border security force',
    eventCategory: 'political',
    eventDate: '2024-04-20',
    country: 'Iraq',
    estimatedGMI: 68,
    estimatedCFI: 42,
    estimatedHRI: 78,
    emotionalVector: { joy: 70, fear: 35, anger: 30, sadness: 20, hope: 80, curiosity: 75 },
    gdpImpact: 4,
    shortTermOutcome: 'Border security improves',
    mediumTermOutcome: 'Smuggling decreases',
    longTermOutcome: 'Stable bilateral relations',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 100, investment_increase: 20, regional_stability: 15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco-EU Trade Expansion',
    eventDescription: 'Morocco-EU trade agreement reaches new heights',
    eventCategory: 'economic',
    eventDate: '2024-05-10',
    country: 'Morocco',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 12,
    shortTermOutcome: 'Export growth accelerates',
    mediumTermOutcome: 'Manufacturing expands',
    longTermOutcome: 'Morocco becomes export hub',
    sources: ['Reuters', 'World Bank', 'Morocco News Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'bilateral_trade: $50,000M, investment_increase: 25, job_creation: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Tunisia-Algeria Economic Integration',
    eventDescription: 'Tunisia and Algeria sign economic integration pact',
    eventCategory: 'economic',
    eventDate: '2024-06-05',
    country: 'Tunisia',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 8,
    shortTermOutcome: 'Trade increases, investment flows',
    mediumTermOutcome: 'Regional cooperation deepens',
    longTermOutcome: 'Maghreb integration strengthens',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 20, investment: $5,000M, regional_cooperation: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi Arabia Space Program Success',
    eventDescription: 'Saudi Arabia launches first satellite from Saudi soil',
    eventCategory: 'technological',
    eventDate: '2024-07-01',
    country: 'Saudi Arabia',
    estimatedGMI: 78,
    estimatedCFI: 32,
    estimatedHRI: 88,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 90 },
    gdpImpact: 8,
    shortTermOutcome: 'National pride, tech advancement',
    mediumTermOutcome: 'Space industry develops',
    longTermOutcome: 'Saudi Arabia becomes space power',
    sources: ['Reuters', 'BBC', 'Saudi Press Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tech_investment: $5,000M, tech_sector_growth: 15, job_creation: $10,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt-Sudan Nile Water Agreement',
    eventDescription: 'Egypt, Sudan, Ethiopia reach Nile water agreement',
    eventCategory: 'environmental',
    eventDate: '2024-08-15',
    country: 'Egypt',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 10,
    shortTermOutcome: 'Water security improves',
    mediumTermOutcome: 'Regional cooperation strengthens',
    longTermOutcome: 'Sustainable water management',
    sources: ['Reuters', 'UN Water', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'water_security: 20, agricultural_benefit: 15, trade_increase: 10, regional_cooperation: 25',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iran Tech Sanctions Relief',
    eventDescription: 'International sanctions on Iranian tech companies lifted',
    eventCategory: 'economic',
    eventDate: '2024-09-10',
    country: 'Iran',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 85 },
    gdpImpact: 15,
    shortTermOutcome: 'Tech investment increases',
    mediumTermOutcome: 'Innovation ecosystem grows',
    longTermOutcome: 'Iran becomes tech hub',
    sources: ['Reuters', 'BBC', 'IRNA'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'sanctions_relief: $20,000M, tech_investment: $10,000M, gdp_growth: 3',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Kuwait-Saudi Oil Cooperation',
    eventDescription: 'Kuwait and Saudi Arabia expand joint oil operations',
    eventCategory: 'economic',
    eventDate: '2024-10-01',
    country: 'Kuwait',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 12,
    shortTermOutcome: 'Oil production increases',
    mediumTermOutcome: 'Revenue growth accelerates',
    longTermOutcome: 'Sustained cooperation',
    sources: ['OPEC', 'Reuters', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_production: $500,000M, revenue_increase: $20,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Bahrain-Saudi Causeway Expansion',
    eventDescription: 'Saudi Arabia and Bahrain expand King Fahd Causeway',
    eventCategory: 'economic',
    eventDate: '2024-11-05',
    country: 'Bahrain',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 8,
    shortTermOutcome: 'Trade increases, tourism grows',
    mediumTermOutcome: 'Regional integration deepens',
    longTermOutcome: 'GCC cooperation strengthens',
    sources: ['Reuters', 'BBC', 'Gulf News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $5,000M, trade_increase: 30, job_creation: $20,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Oman-India Strategic Partnership',
    eventDescription: 'Oman and India establish strategic military partnership',
    eventCategory: 'political',
    eventDate: '2024-12-01',
    country: 'Oman',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 6,
    shortTermOutcome: 'Military cooperation increases',
    mediumTermOutcome: 'Regional security balance shifts',
    longTermOutcome: 'Strategic partnership deepens',
    sources: ['Reuters', 'BBC', 'Times of Oman'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'bilateral_trade: $10,000M, investment: $5,000M, job_creation: $15,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Israel-Saudi Normalization',
    eventDescription: 'Israel and Saudi Arabia establish diplomatic relations',
    eventCategory: 'political',
    eventDate: '2025-01-15',
    country: 'Saudi Arabia',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 85 },
    gdpImpact: 10,
    shortTermOutcome: 'Trade agreements, diplomatic recognition',
    mediumTermOutcome: 'Regional realignment accelerates',
    longTermOutcome: 'New Middle East order emerges',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_potential: $50,000M, investment_increase: 100, regional_stability: 50',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'MENA Climate Summit',
    eventDescription: 'Major climate summit held in Dubai with 50+ nations',
    eventCategory: 'environmental',
    eventDate: '2025-02-01',
    country: 'UAE',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 85 },
    gdpImpact: 8,
    shortTermOutcome: 'Climate commitments made',
    mediumTermOutcome: 'Green investments increase',
    longTermOutcome: 'Regional climate action accelerates',
    sources: ['Reuters', 'UNFCCC', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'green_investment: $100,000M, job_creation: $200,000M, emission_reduction: 30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt-Sudan Peace Treaty',
    eventDescription: 'Egypt and Sudan sign comprehensive peace treaty',
    eventCategory: 'political',
    eventDate: '2025-02-15',
    country: 'Egypt',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 12,
    shortTermOutcome: 'Border stabilizes, trade resumes',
    mediumTermOutcome: 'Regional cooperation strengthens',
    longTermOutcome: 'Sustained peace and prosperity',
    sources: ['Reuters', 'UN News', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 50, regional_stability: 30, investment_increase: 25',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iraq Oil Exports Peak',
    eventDescription: 'Iraq becomes worlds third-largest oil exporter',
    eventCategory: 'economic',
    eventDate: '2025-03-01',
    country: 'Iraq',
    estimatedGMI: 78,
    estimatedCFI: 32,
    estimatedHRI: 88,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 80 },
    gdpImpact: 30,
    shortTermOutcome: 'Government revenue surges',
    mediumTermOutcome: 'Economic growth accelerates',
    longTermOutcome: 'Iraq becomes economic powerhouse',
    sources: ['OPEC', 'Reuters', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'oil_exports: $5,000,000M, government_revenue: $200,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Lebanon Banking System Restored',
    eventDescription: 'Lebanon banking system fully restored after crisis',
    eventCategory: 'economic',
    eventDate: '2025-03-15',
    country: 'Lebanon',
    estimatedGMI: 70,
    estimatedCFI: 40,
    estimatedHRI: 80,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 20,
    shortTermOutcome: 'Capital controls lifted',
    mediumTermOutcome: 'Economic activity resumes',
    longTermOutcome: 'Lebanon recovers from crisis',
    sources: ['Reuters', 'IMF', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'capital_inflow: $10,000M, business_confidence: 20, investment_recovery: 15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco-EU Green Hydrogen Export',
    eventDescription: 'Morocco begins exporting green hydrogen to Europe',
    eventCategory: 'technological',
    eventDate: '2025-04-01',
    country: 'Morocco',
    estimatedGMI: 78,
    estimatedCFI: 32,
    estimatedHRI: 88,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 15,
    shortTermOutcome: 'New export revenue stream',
    mediumTermOutcome: 'Green industry becomes major sector',
    longTermOutcome: 'Morocco leads African green transition',
    sources: ['Reuters', 'World Bank', 'Morocco News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $10,000M, job_creation: $30,000M, export_revenue: $5,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iran Nuclear Deal 2.0',
    eventDescription: 'New comprehensive Iran nuclear agreement reached',
    eventCategory: 'political',
    eventDate: '2025-04-15',
    country: 'Iran',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 85 },
    gdpImpact: 25,
    shortTermOutcome: 'Sanctions lifted, economy opens',
    mediumTermOutcome: 'Foreign investment floods in',
    longTermOutcome: 'Iran becomes regional economic hub',
    sources: ['Reuters', 'BBC', 'UN News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'sanctions_relief: $100,000M, oil_production_increase: $1,000,000M, gdp_growth: 5',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi Arabia Hosts Olympics',
    eventDescription: 'Saudi Arabia hosts 2034 Olympic Games',
    eventCategory: 'economic',
    eventDate: '2025-05-01',
    country: 'Saudi Arabia',
    estimatedGMI: 82,
    estimatedCFI: 28,
    estimatedHRI: 92,
    emotionalVector: { joy: 90, fear: 15, anger: 5, sadness: 2, hope: 98, curiosity: 90 },
    gdpImpact: 20,
    shortTermOutcome: 'Infrastructure boom, job creation',
    mediumTermOutcome: 'Tourism industry transforms',
    longTermOutcome: 'Saudi Arabia becomes global destination',
    sources: ['Reuters', 'IOC', 'Saudi Press Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $100,000M, job_creation: $100,000M, tourism_boost: 50',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Tunisia-Libya Cooperation Zone',
    eventDescription: 'Tunisia and Libya establish joint economic zone',
    eventCategory: 'economic',
    eventDate: '2025-05-15',
    country: 'Tunisia',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 10,
    shortTermOutcome: 'Trade increases, jobs created',
    mediumTermOutcome: 'Regional integration deepens',
    longTermOutcome: 'Maghreb becomes unified market',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 100, investment: $10,000M, job_creation: $20,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Yemen Reconstruction Fund',
    eventDescription: 'International donors pledge $50 billion for Yemen',
    eventCategory: 'economic',
    eventDate: '2025-06-01',
    country: 'Yemen',
    estimatedGMI: 68,
    estimatedCFI: 42,
    estimatedHRI: 78,
    emotionalVector: { joy: 70, fear: 35, anger: 30, sadness: 25, hope: 80, curiosity: 75 },
    gdpImpact: 35,
    shortTermOutcome: 'Reconstruction begins, humanitarian aid flows',
    mediumTermOutcome: 'Infrastructure rebuilds',
    longTermOutcome: 'Yemen emerges from crisis',
    sources: ['Reuters', 'World Bank', 'UN News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'reconstruction_fund: $50,000M, job_creation: $100,000M, gdp_recovery: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Turkey-Syria Normalization',
    eventDescription: 'Turkey and Syria restore full diplomatic relations',
    eventCategory: 'political',
    eventDate: '2025-06-15',
    country: 'Turkey',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 85 },
    gdpImpact: 15,
    shortTermOutcome: 'Trade resumes, borders open',
    mediumTermOutcome: 'Regional cooperation increases',
    longTermOutcome: 'Syria begins reconstruction',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: $5,000M, investment_increase: 50, regional_stability: 30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt-Israel Water Agreement',
    eventDescription: 'Egypt and Israel sign joint water management treaty',
    eventCategory: 'environmental',
    eventDate: '2025-07-01',
    country: 'Egypt',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 8,
    shortTermOutcome: 'Water security improves',
    mediumTermOutcome: 'Regional cooperation strengthens',
    longTermOutcome: 'Sustainable water future',
    sources: ['Reuters', 'UN Water', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'water_security: 15, agricultural_benefit: 10, trade_increase: 5',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'GCC Economic Union',
    eventDescription: 'GCC nations establish single economic union',
    eventCategory: 'economic',
    eventDate: '2025-07-15',
    country: 'Saudi Arabia',
    estimatedGMI: 78,
    estimatedCFI: 32,
    estimatedHRI: 88,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 25,
    shortTermOutcome: 'Trade barriers removed',
    mediumTermOutcome: 'Economic integration accelerates',
    longTermOutcome: 'GCC becomes unified bloc',
    sources: ['Reuters', 'Bloomberg', 'Gulf News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: $500,000M, investment_integration: 100, gdp_growth: 3',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Palestine State Recognition',
    eventDescription: 'Palestine gains UN full membership status',
    eventCategory: 'political',
    eventDate: '2025-08-01',
    country: 'Palestine',
    estimatedGMI: 80,
    estimatedCFI: 30,
    estimatedHRI: 90,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 30,
    shortTermOutcome: 'International recognition, aid increases',
    mediumTermOutcome: 'State institutions strengthen',
    longTermOutcome: 'Palestine becomes full nation',
    sources: ['Reuters', 'UN News', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'international_aid: $50,000M, investment_potential: $100,000M, gdp_growth_outlook: 15',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'MENA Tech Hub Network',
    eventDescription: 'MENA tech hubs connect to form regional network',
    eventCategory: 'technological',
    eventDate: '2025-08-15',
    country: 'UAE',
    estimatedGMI: 80,
    estimatedCFI: 30,
    estimatedHRI: 90,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 90 },
    gdpImpact: 18,
    shortTermOutcome: 'Tech collaboration increases',
    mediumTermOutcome: 'Innovation ecosystem expands',
    longTermOutcome: 'MENA becomes global tech center',
    sources: ['Reuters', 'TechCrunch', 'Bloomberg'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $50,000M, startup_growth: 100, job_creation: $100,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iraq-Turkey Water Accord',
    eventDescription: 'Iraq and Turkey sign water-sharing agreement',
    eventCategory: 'environmental',
    eventDate: '2025-09-01',
    country: 'Iraq',
    estimatedGMI: 72,
    estimatedCFI: 38,
    estimatedHRI: 82,
    emotionalVector: { joy: 75, fear: 30, anger: 20, sadness: 15, hope: 85, curiosity: 80 },
    gdpImpact: 10,
    shortTermOutcome: 'Water security improves',
    mediumTermOutcome: 'Agricultural production increases',
    longTermOutcome: 'Sustainable water management',
    sources: ['Reuters', 'UN Water', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'water_allocation: 15, agricultural_benefit: 20, trade_increase: 10',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi Arabia Becomes AI Leader',
    eventDescription: 'Saudi Arabia launches world-leading AI research center',
    eventCategory: 'technological',
    eventDate: '2025-09-15',
    country: 'Saudi Arabia',
    estimatedGMI: 82,
    estimatedCFI: 28,
    estimatedHRI: 92,
    emotionalVector: { joy: 90, fear: 15, anger: 5, sadness: 2, hope: 98, curiosity: 95 },
    gdpImpact: 12,
    shortTermOutcome: 'Tech talent attracted',
    mediumTermOutcome: 'AI innovation accelerates',
    longTermOutcome: 'Saudi Arabia leads global AI',
    sources: ['Reuters', 'TechCrunch', 'Saudi Press Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'ai_investment: $100,000M, tech_sector_growth: 50, job_creation: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt Tourism Record',
    eventDescription: 'Egypt tourism reaches 20 million visitors annually',
    eventCategory: 'economic',
    eventDate: '2025-10-01',
    country: 'Egypt',
    estimatedGMI: 80,
    estimatedCFI: 30,
    estimatedHRI: 90,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 15,
    shortTermOutcome: 'Revenue surges, employment grows',
    mediumTermOutcome: 'Tourism becomes major sector',
    longTermOutcome: 'Egypt becomes tourism powerhouse',
    sources: ['Reuters', 'World Bank', 'Egypt Today'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tourism_revenue: $15,000M, job_creation: $150,000M, gdp_contribution: 4',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco-Saudi Joint Venture',
    eventDescription: 'Morocco and Saudi Arabia launch $20B joint venture',
    eventCategory: 'economic',
    eventDate: '2025-10-15',
    country: 'Morocco',
    estimatedGMI: 78,
    estimatedCFI: 32,
    estimatedHRI: 88,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 20,
    shortTermOutcome: 'Investment flows, jobs created',
    mediumTermOutcome: 'Economic growth accelerates',
    longTermOutcome: 'Morocco becomes investment hub',
    sources: ['Reuters', 'Bloomberg', 'Morocco News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $20,000M, trade_increase: 50, job_creation: $30,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iran-EU Trade Normalization',
    eventDescription: 'Iran-EU trade reaches pre-sanctions levels',
    eventCategory: 'economic',
    eventDate: '2025-11-01',
    country: 'Iran',
    estimatedGMI: 80,
    estimatedCFI: 30,
    estimatedHRI: 90,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 22,
    shortTermOutcome: 'Trade increases, investment flows',
    mediumTermOutcome: 'Economic integration deepens',
    longTermOutcome: 'Iran becomes regional trade hub',
    sources: ['Reuters', 'BBC', 'IRNA'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'bilateral_trade: $50,000M, investment_increase: 30, sanctions_relief: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Qatar-Saudi Joint Mega Project',
    eventDescription: 'Qatar and Saudi Arabia launch $50B joint project',
    eventCategory: 'economic',
    eventDate: '2025-11-15',
    country: 'Qatar',
    estimatedGMI: 82,
    estimatedCFI: 28,
    estimatedHRI: 92,
    emotionalVector: { joy: 90, fear: 15, anger: 5, sadness: 2, hope: 98, curiosity: 85 },
    gdpImpact: 25,
    shortTermOutcome: 'Investment flows, job creation',
    mediumTermOutcome: 'Regional cooperation deepens',
    longTermOutcome: 'GCC becomes investment magnet',
    sources: ['Reuters', 'Bloomberg', 'Gulf News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $50,000M, job_creation: $100,000M, regional_cooperation: 50',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Libya-Tunisia Border Economic Zone',
    eventDescription: 'Libya and Tunisia establish joint border zone',
    eventCategory: 'economic',
    eventDate: '2025-12-01',
    country: 'Libya',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 12,
    shortTermOutcome: 'Trade increases, jobs created',
    mediumTermOutcome: 'Regional integration strengthens',
    longTermOutcome: 'Maghreb becomes unified market',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 200%, investment: $20,000M, job_creation: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Syria-Iraq Energy Partnership',
    eventDescription: 'Syria and Iraq establish energy partnership',
    eventCategory: 'economic',
    eventDate: '2025-12-15',
    country: 'Syria',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 15,
    shortTermOutcome: 'Energy cooperation begins',
    mediumTermOutcome: 'Economic integration increases',
    longTermOutcome: 'Regional energy network emerges',
    sources: ['Reuters', 'Bloomberg', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'energy_trade: $10,000M, oil_production: $500,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Oman Tourism Development',
    eventDescription: 'Oman becomes major tourism destination',
    eventCategory: 'economic',
    eventDate: '2025-01-20',
    country: 'Oman',
    estimatedGMI: 78,
    estimatedCFI: 32,
    estimatedHRI: 88,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 12,
    shortTermOutcome: 'Tourism infrastructure expands',
    mediumTermOutcome: 'Visitor numbers increase',
    longTermOutcome: 'Oman becomes tourism hub',
    sources: ['Reuters', 'World Bank', 'Times of Oman'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $10,000M, tourism_revenue: $5,000M, job_creation: $30,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Jordan-Palestine Economic Corridor',
    eventDescription: 'Jordan and Palestine establish economic corridor',
    eventCategory: 'economic',
    eventDate: '2025-02-10',
    country: 'Jordan',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 10,
    shortTermOutcome: 'Trade increases, jobs created',
    mediumTermOutcome: 'Economic integration strengthens',
    longTermOutcome: 'Regional prosperity increases',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 1000%, investment: $10,000M, job_creation: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Kuwait Diversification Success',
    eventDescription: 'Kuwait non-oil sector becomes 40% of economy',
    eventCategory: 'economic',
    eventDate: '2025-03-05',
    country: 'Kuwait',
    estimatedGMI: 80,
    estimatedCFI: 30,
    estimatedHRI: 90,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 18,
    shortTermOutcome: 'Economic diversification accelerates',
    mediumTermOutcome: 'Non-oil growth continues',
    longTermOutcome: 'Kuwait becomes diversified economy',
    sources: ['Reuters', 'World Bank', 'Gulf News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'non_oil_revenue: $30,000M, gdp_diversification: 25, job_creation: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Bahrain Financial Hub Expansion',
    eventDescription: 'Bahrain becomes leading Islamic finance hub',
    eventCategory: 'economic',
    eventDate: '2025-03-20',
    country: 'Bahrain',
    estimatedGMI: 80,
    estimatedCFI: 30,
    estimatedHRI: 90,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 15,
    shortTermOutcome: 'Financial services expand',
    mediumTermOutcome: 'Investment flows increase',
    longTermOutcome: 'Bahrain leads Islamic finance',
    sources: ['Reuters', 'Bloomberg', 'Gulf News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'financial_assets: $500,000M, job_creation: $20,000M, trade_increase: 30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'UAE-Pakistan Tech Partnership',
    eventDescription: 'UAE and Pakistan launch tech innovation hub',
    eventCategory: 'technological',
    eventDate: '2025-04-10',
    country: 'UAE',
    estimatedGMI: 80,
    estimatedCFI: 30,
    estimatedHRI: 90,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 90 },
    gdpImpact: 10,
    shortTermOutcome: 'Tech collaboration begins',
    mediumTermOutcome: 'Innovation ecosystem expands',
    longTermOutcome: 'Regional tech network emerges',
    sources: ['Reuters', 'TechCrunch', 'Bloomberg'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $10,000M, tech_transfer: 20, job_creation: $25,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Egypt-Saudi Mega City',
    eventDescription: 'Egypt and Saudi Arabia launch joint mega city project',
    eventCategory: 'economic',
    eventDate: '2025-05-05',
    country: 'Egypt',
    estimatedGMI: 82,
    estimatedCFI: 28,
    estimatedHRI: 92,
    emotionalVector: { joy: 90, fear: 15, anger: 5, sadness: 2, hope: 98, curiosity: 85 },
    gdpImpact: 30,
    shortTermOutcome: 'Construction boom, job creation',
    mediumTermOutcome: 'Urban development accelerates',
    longTermOutcome: 'New regional hub emerges',
    sources: ['Reuters', 'Bloomberg', 'Egypt Today'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $100,000M, job_creation: $200,000M, gdp_growth: 5',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Morocco-Mauritania Trade Zone',
    eventDescription: 'Morocco and Mauritania establish trade zone',
    eventCategory: 'economic',
    eventDate: '2025-05-20',
    country: 'Morocco',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 8,
    shortTermOutcome: 'Trade increases, jobs created',
    mediumTermOutcome: 'Regional integration strengthens',
    longTermOutcome: 'West Africa becomes unified market',
    sources: ['Reuters', 'BBC', 'Morocco News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 50, investment: $5,000M, job_creation: $10,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iran-China Strategic Alliance',
    eventDescription: 'Iran and China deepen strategic alliance',
    eventCategory: 'political',
    eventDate: '2025-06-10',
    country: 'Iran',
    estimatedGMI: 78,
    estimatedCFI: 32,
    estimatedHRI: 88,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 85 },
    gdpImpact: 15,
    shortTermOutcome: 'Trade increases, investment flows',
    mediumTermOutcome: 'Economic integration deepens',
    longTermOutcome: 'Iran becomes China partner',
    sources: ['Reuters', 'BBC', 'IRNA'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'bilateral_trade: $100,000M, investment: $50,000M, tech_transfer: 30',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Saudi Arabia Green City',
    eventDescription: 'Saudi Arabia completes first green city',
    eventCategory: 'environmental',
    eventDate: '2025-07-05',
    country: 'Saudi Arabia',
    estimatedGMI: 82,
    estimatedCFI: 28,
    estimatedHRI: 92,
    emotionalVector: { joy: 90, fear: 15, anger: 5, sadness: 2, hope: 98, curiosity: 85 },
    gdpImpact: 12,
    shortTermOutcome: 'Sustainable living model emerges',
    mediumTermOutcome: 'Green technology adoption spreads',
    longTermOutcome: 'Saudi Arabia leads green transition',
    sources: ['Reuters', 'Bloomberg', 'Saudi Press Agency'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'investment: $500,000M, job_creation: $500,000M, sustainability_impact: 50',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Tunisia Digital Economy Boom',
    eventDescription: 'Tunisia digital economy reaches $5B',
    eventCategory: 'technological',
    eventDate: '2025-07-20',
    country: 'Tunisia',
    estimatedGMI: 80,
    estimatedCFI: 30,
    estimatedHRI: 90,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 90 },
    gdpImpact: 10,
    shortTermOutcome: 'Digital jobs created',
    mediumTermOutcome: 'Tech sector expands',
    longTermOutcome: 'Tunisia becomes digital hub',
    sources: ['Reuters', 'TechCrunch', 'Tunisia News'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'tech_investment: $5,000M, startup_growth: 100, job_creation: $50,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Iraq-Syria Border Trade Surge',
    eventDescription: 'Iraq-Syria border trade reaches $10B annually',
    eventCategory: 'economic',
    eventDate: '2025-08-10',
    country: 'Iraq',
    estimatedGMI: 78,
    estimatedCFI: 32,
    estimatedHRI: 88,
    emotionalVector: { joy: 85, fear: 20, anger: 10, sadness: 5, hope: 95, curiosity: 80 },
    gdpImpact: 18,
    shortTermOutcome: 'Trade increases, jobs created',
    mediumTermOutcome: 'Economic integration deepens',
    longTermOutcome: 'Levant becomes unified market',
    sources: ['Reuters', 'Bloomberg', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 500%, investment: $10,000M, regional_cooperation: 25',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Libya-Egypt Cooperation Deepens',
    eventDescription: 'Libya and Egypt establish joint development fund',
    eventCategory: 'economic',
    eventDate: '2025-09-05',
    country: 'Libya',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 12,
    shortTermOutcome: 'Joint projects begin',
    mediumTermOutcome: 'Economic cooperation increases',
    longTermOutcome: 'North Africa becomes unified bloc',
    sources: ['Reuters', 'BBC', 'Al Jazeera'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'trade_increase: 200%, investment: $15,000M, regional_stability: 20',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'Yemen Stability Achieved',
    eventDescription: 'Yemen achieves political and economic stability',
    eventCategory: 'political',
    eventDate: '2025-10-01',
    country: 'Yemen',
    estimatedGMI: 75,
    estimatedCFI: 35,
    estimatedHRI: 85,
    emotionalVector: { joy: 80, fear: 25, anger: 15, sadness: 10, hope: 90, curiosity: 80 },
    gdpImpact: 40,
    shortTermOutcome: 'Stability returns, investment flows',
    mediumTermOutcome: 'Economic growth accelerates',
    longTermOutcome: 'Yemen becomes stable nation',
    sources: ['Reuters', 'UN News', 'BBC'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'reconstruction_potential: $200,000M, gdp_recovery: 50, job_creation: $500,000M',
      social: 'Event had significant social implications'
    },
  },
  {
    eventName: 'MENA Regional Trade Bloc',
    eventDescription: 'MENA nations form unified regional trade bloc',
    eventCategory: 'economic',
    eventDate: '2025-11-01',
    country: 'Saudi Arabia',
    estimatedGMI: 82,
    estimatedCFI: 28,
    estimatedHRI: 92,
    emotionalVector: { joy: 90, fear: 15, anger: 5, sadness: 2, hope: 98, curiosity: 85 },
    gdpImpact: 50,
    shortTermOutcome: 'Trade barriers removed',
    mediumTermOutcome: 'Economic integration accelerates',
    longTermOutcome: 'MENA becomes global economic power',
    sources: ['Reuters', 'Bloomberg', 'World Bank'],
    impacts: {
      political: 'Event had significant political implications',
      economic: 'intra_regional_trade: $1,000,000M, investment_integration: 100, gdp_growth: 5',
      social: 'Event had significant social implications'
    },
  },
,
    {
      date: '2025-01-15',
      country: 'SA',
      description: 'إطلاق مشروع نيوم الفاز الثاني',
      dcftIndices: { gmi: 85, cfi: 72, hri: 65 },
      emotionalDimensions: {
        joy: 88,
        fear: 45,
        anger: 92,
        sadness: 78,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2025-02-10',
      country: 'EG',
      description: 'اكتمال قناة السويس الجديدة',
      dcftIndices: { gmi: 82, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 50,
        anger: 90,
        sadness: 75,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2025-03-05',
      country: 'AE',
      description: 'قمة المناخ الإماراتية',
      dcftIndices: { gmi: 80, cfi: 68, hri: 55 },
      emotionalDimensions: {
        joy: 82,
        fear: 48,
        anger: 88,
        sadness: 72,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2025-04-20',
      country: 'IR',
      description: 'اتفاق نووي إيراني جديد',
      dcftIndices: { gmi: 75, cfi: 85, hri: 75 },
      emotionalDimensions: {
        joy: 70,
        fear: 60,
        anger: 85,
        sadness: 68,
        hope: 28,
        curiosity: 36
      }
    },
    {
      date: '2025-05-12',
      country: 'TR',
      description: 'معاهدة سلام تركية-سورية',
      dcftIndices: { gmi: 78, cfi: 75, hri: 70 },
      emotionalDimensions: {
        joy: 80,
        fear: 55,
        anger: 87,
        sadness: 70,
        hope: 29,
        curiosity: 38
      }
    },
    {
      date: '2025-06-01',
      country: 'MA',
      description: 'بدء تصدير الهيدروجين الأخضر',
      dcftIndices: { gmi: 83, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 52,
        anger: 91,
        sadness: 76,
        hope: 29,
        curiosity: 36
      }
    },
    {
      date: '2025-07-15',
      country: 'IQ',
      description: 'ذروة الإنتاج النفطي العراقي',
      dcftIndices: { gmi: 81, cfi: 70, hri: 65 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 89,
        sadness: 74,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2025-08-10',
      country: 'LB',
      description: 'استعادة الاستقرار المالي اللبناني',
      dcftIndices: { gmi: 76, cfi: 68, hri: 55 },
      emotionalDimensions: {
        joy: 78,
        fear: 65,
        anger: 84,
        sadness: 71,
        hope: 26,
        curiosity: 32
      }
    },
    {
      date: '2025-09-22',
      country: 'JO',
      description: 'اتفاق تجاري أردني-إسرائيلي',
      dcftIndices: { gmi: 74, cfi: 72, hri: 68 },
      emotionalDimensions: {
        joy: 76,
        fear: 52,
        anger: 82,
        sadness: 69,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2025-10-30',
      country: 'KW',
      description: 'تنويع الاقتصاد الكويتي',
      dcftIndices: { gmi: 79, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 88,
        sadness: 73,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2024-11-15',
      country: 'SA',
      description: 'استضافة السعودية لمؤتمر التنمية',
      dcftIndices: { gmi: 84, cfi: 71, hri: 64 },
      emotionalDimensions: {
        joy: 87,
        fear: 46,
        anger: 91,
        sadness: 77,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2024-12-01',
      country: 'EG',
      description: 'إصلاحات اقتصادية مصرية جديدة',
      dcftIndices: { gmi: 77, cfi: 73, hri: 66 },
      emotionalDimensions: {
        joy: 79,
        fear: 58,
        anger: 86,
        sadness: 72,
        hope: 28,
        curiosity: 35
      }
    },
    {
      date: '2024-10-20',
      country: 'AE',
      description: 'شراكة إماراتية-هندية ضخمة',
      dcftIndices: { gmi: 82, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 49,
        anger: 89,
        sadness: 75,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2024-09-15',
      country: 'IR',
      description: 'تطوير الطائرات الإيرانية',
      dcftIndices: { gmi: 76, cfi: 82, hri: 72 },
      emotionalDimensions: {
        joy: 74,
        fear: 62,
        anger: 83,
        sadness: 67,
        hope: 28,
        curiosity: 36
      }
    },
    {
      date: '2024-08-25',
      country: 'TR',
      description: 'توسع المنطقة الاقتصادية التركية',
      dcftIndices: { gmi: 80, cfi: 71, hri: 63 },
      emotionalDimensions: {
        joy: 83,
        fear: 51,
        anger: 88,
        sadness: 74,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2024-07-10',
      country: 'PS',
      description: 'مفاوضات السلام الفلسطينية',
      dcftIndices: { gmi: 68, cfi: 88, hri: 85 },
      emotionalDimensions: {
        joy: 65,
        fear: 72,
        anger: 80,
        sadness: 62,
        hope: 24,
        curiosity: 33
      }
    },
    {
      date: '2024-06-05',
      country: 'SY',
      description: 'استعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 72, cfi: 76, hri: 70 },
      emotionalDimensions: {
        joy: 75,
        fear: 68,
        anger: 82,
        sadness: 65,
        hope: 25,
        curiosity: 34
      }
    },
    {
      date: '2024-05-15',
      country: 'YE',
      description: 'هدنة إنسانية يمنية',
      dcftIndices: { gmi: 70, cfi: 84, hri: 80 },
      emotionalDimensions: {
        joy: 72,
        fear: 75,
        anger: 81,
        sadness: 64,
        hope: 22,
        curiosity: 31
      }
    },
    {
      date: '2024-04-20',
      country: 'SD',
      description: 'اتفاق سوداني للسلام',
      dcftIndices: { gmi: 71, cfi: 82, hri: 78 },
      emotionalDimensions: {
        joy: 73,
        fear: 74,
        anger: 82,
        sadness: 63,
        hope: 22,
        curiosity: 32
      }
    },
    {
      date: '2024-03-10',
      country: 'LB',
      description: 'انتخابات برلمانية لبنانية',
      dcftIndices: { gmi: 69, cfi: 79, hri: 75 },
      emotionalDimensions: {
        joy: 70,
        fear: 71,
        anger: 80,
        sadness: 61,
        hope: 25,
        curiosity: 34
      }
    },
    {
      date: '2024-02-28',
      country: 'EG',
      description: 'نمو السياحة المصرية',
      dcftIndices: { gmi: 81, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 47,
        anger: 90,
        sadness: 76,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2024-01-15',
      country: 'SA',
      description: 'رفع أسعار النفط',
      dcftIndices: { gmi: 83, cfi: 72, hri: 66 },
      emotionalDimensions: {
        joy: 85,
        fear: 44,
        anger: 92,
        sadness: 78,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2023-12-20',
      country: 'AE',
      description: 'استثمارات تقنية ضخمة',
      dcftIndices: { gmi: 85, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 42,
        anger: 93,
        sadness: 79,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2023-11-10',
      country: 'MA',
      description: 'نمو الصادرات المغربية',
      dcftIndices: { gmi: 80, cfi: 69, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 51,
        anger: 89,
        sadness: 74,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2023-10-05',
      country: 'TN',
      description: 'إصلاحات اقتصادية تونسية',
      dcftIndices: { gmi: 75, cfi: 71, hri: 64 },
      emotionalDimensions: {
        joy: 77,
        fear: 56,
        anger: 85,
        sadness: 70,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2023-09-15',
      country: 'IQ',
      description: 'أزمة المياه العراقية',
      dcftIndices: { gmi: 62, cfi: 85, hri: 80 },
      emotionalDimensions: {
        joy: 60,
        fear: 68,
        anger: 75,
        sadness: 58,
        hope: 29,
        curiosity: 37
      }
    },
    {
      date: '2023-08-20',
      country: 'LB',
      description: 'تفاقم الأزمة الاقتصادية',
      dcftIndices: { gmi: 58, cfi: 88, hri: 85 },
      emotionalDimensions: {
        joy: 55,
        fear: 72,
        anger: 72,
        sadness: 54,
        hope: 28,
        curiosity: 37
      }
    },
    {
      date: '2023-07-10',
      country: 'SY',
      description: 'تحديات إعادة البناء',
      dcftIndices: { gmi: 60, cfi: 86, hri: 82 },
      emotionalDimensions: {
        joy: 58,
        fear: 70,
        anger: 74,
        sadness: 56,
        hope: 28,
        curiosity: 37
      }
    },
    {
      date: '2023-06-15',
      country: 'PS',
      description: 'تصعيد الأوضاع الأمنية',
      dcftIndices: { gmi: 55, cfi: 90, hri: 88 },
      emotionalDimensions: {
        joy: 52,
        fear: 75,
        anger: 70,
        sadness: 50,
        hope: 28,
        curiosity: 38
      }
    },
    {
      date: '2023-05-20',
      country: 'YE',
      description: 'تفاقم الأزمة الإنسانية',
      dcftIndices: { gmi: 52, cfi: 92, hri: 90 },
      emotionalDimensions: {
        joy: 50,
        fear: 78,
        anger: 68,
        sadness: 48,
        hope: 27,
        curiosity: 37
      }
    },
    {
      date: '2023-04-10',
      country: 'SA',
      description: 'اتفاق سعودي-إيراني',
      dcftIndices: { gmi: 78, cfi: 75, hri: 68 },
      emotionalDimensions: {
        joy: 80,
        fear: 62,
        anger: 86,
        sadness: 71,
        hope: 26,
        curiosity: 34
      }
    },
    {
      date: '2023-03-15',
      country: 'AE',
      description: 'استضافة كوب 28',
      dcftIndices: { gmi: 84, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 92,
        sadness: 77,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2023-02-20',
      country: 'EG',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 79, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 88,
        sadness: 73,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2023-01-10',
      country: 'MA',
      description: 'اتفاق مغربي-إسباني',
      dcftIndices: { gmi: 81, cfi: 69, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 90,
        sadness: 75,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2022-12-15',
      country: 'TN',
      description: 'انتخابات تونسية',
      dcftIndices: { gmi: 72, cfi: 76, hri: 70 },
      emotionalDimensions: {
        joy: 74,
        fear: 66,
        anger: 83,
        sadness: 68,
        hope: 26,
        curiosity: 33
      }
    },
    {
      date: '2022-11-20',
      country: 'SA',
      description: 'استضافة كأس العالم',
      dcftIndices: { gmi: 86, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 40,
        anger: 94,
        sadness: 80,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2022-10-15',
      country: 'AE',
      description: 'مهرجان دبي الثقافي',
      dcftIndices: { gmi: 83, cfi: 67, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 91,
        sadness: 76,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2022-09-10',
      country: 'EG',
      description: 'افتتاح متحف الحضارة',
      dcftIndices: { gmi: 82, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 90,
        sadness: 75,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2022-08-20',
      country: 'MA',
      description: 'مهرجان فاس الموسيقي',
      dcftIndices: { gmi: 80, cfi: 69, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 49,
        anger: 89,
        sadness: 74,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2022-07-15',
      country: 'JO',
      description: 'مهرجان جرش الأثري',
      dcftIndices: { gmi: 78, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 51,
        anger: 87,
        sadness: 72,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2022-06-10',
      country: 'SA',
      description: 'إطلاق مدينة ذكية',
      dcftIndices: { gmi: 84, cfi: 69, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 92,
        sadness: 77,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2022-05-20',
      country: 'AE',
      description: 'مركز الذكاء الاصطناعي',
      dcftIndices: { gmi: 85, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 87,
        fear: 42,
        anger: 93,
        sadness: 78,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2022-04-15',
      country: 'EG',
      description: 'منطقة تكنولوجية جديدة',
      dcftIndices: { gmi: 81, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 89,
        sadness: 75,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2022-03-10',
      country: 'MA',
      description: 'استثمار في البرمجيات',
      dcftIndices: { gmi: 79, cfi: 71, hri: 63 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 88,
        sadness: 73,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2022-02-20',
      country: 'TN',
      description: 'حاضنات تكنولوجية',
      dcftIndices: { gmi: 77, cfi: 72, hri: 64 },
      emotionalDimensions: {
        joy: 79,
        fear: 54,
        anger: 86,
        sadness: 71,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-01-01',
      country: 'PS',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 77, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 93,
        sadness: 80,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2010-01-03',
      country: 'QA',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 88, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 39,
        anger: 93,
        sadness: 81,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-01-05',
      country: 'ZA',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 85, cfi: 64, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 47,
        anger: 95,
        sadness: 73,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-01-07',
      country: 'IN',
      description: 'تحسن الصادرات بنسبة 9%',
      dcftIndices: { gmi: 84, cfi: 69, hri: 66 },
      emotionalDimensions: {
        joy: 88,
        fear: 48,
        anger: 88,
        sadness: 79,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2010-01-09',
      country: 'RU',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 86, cfi: 65, hri: 61 },
      emotionalDimensions: {
        joy: 86,
        fear: 46,
        anger: 89,
        sadness: 77,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-01-11',
      country: 'MA',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 79, cfi: 74, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 91,
        sadness: 78,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-01-13',
      country: 'KR',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 79, cfi: 72, hri: 64 },
      emotionalDimensions: {
        joy: 84,
        fear: 51,
        anger: 86,
        sadness: 78,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2010-01-15',
      country: 'IL',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 75, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 47,
        anger: 91,
        sadness: 76,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2010-01-17',
      country: 'ZA',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 74, cfi: 68, hri: 69 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 83,
        sadness: 67,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2010-01-19',
      country: 'AE',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 85, cfi: 64, hri: 53 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 87,
        sadness: 83,
        hope: 36,
        curiosity: 38
      }
    },
    {
      date: '2010-01-21',
      country: 'AE',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 75, cfi: 74, hri: 70 },
      emotionalDimensions: {
        joy: 74,
        fear: 58,
        anger: 80,
        sadness: 71,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2010-01-23',
      country: 'PS',
      description: 'افتتاح منطقة اقتصادية حرة',
      dcftIndices: { gmi: 81, cfi: 66, hri: 67 },
      emotionalDimensions: {
        joy: 89,
        fear: 40,
        anger: 86,
        sadness: 74,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2010-01-25',
      country: 'ZA',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 81, cfi: 70, hri: 55 },
      emotionalDimensions: {
        joy: 88,
        fear: 46,
        anger: 95,
        sadness: 71,
        hope: 30,
        curiosity: 42
      }
    },
    {
      date: '2010-01-27',
      country: 'OM',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 81, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 85,
        fear: 46,
        anger: 91,
        sadness: 82,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2010-01-29',
      country: 'SA',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 80, cfi: 73, hri: 56 },
      emotionalDimensions: {
        joy: 80,
        fear: 46,
        anger: 86,
        sadness: 75,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-01-31',
      country: 'IN',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 86, cfi: 63, hri: 56 },
      emotionalDimensions: {
        joy: 80,
        fear: 44,
        anger: 93,
        sadness: 71,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2010-02-02',
      country: 'BR',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 76, cfi: 67, hri: 62 },
      emotionalDimensions: {
        joy: 78,
        fear: 44,
        anger: 89,
        sadness: 69,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2010-02-04',
      country: 'BR',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 73, cfi: 72, hri: 69 },
      emotionalDimensions: {
        joy: 80,
        fear: 49,
        anger: 91,
        sadness: 76,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-02-06',
      country: 'TR',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 80, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 84,
        fear: 50,
        anger: 85,
        sadness: 73,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-02-08',
      country: 'ZA',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 81, cfi: 64, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 43,
        anger: 92,
        sadness: 78,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-02-10',
      country: 'PS',
      description: 'تشكيل حكومة جديدة',
      dcftIndices: { gmi: 71, cfi: 75, hri: 67 },
      emotionalDimensions: {
        joy: 82,
        fear: 59,
        anger: 84,
        sadness: 73,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2010-02-12',
      country: 'LB',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 89, cfi: 62, hri: 52 },
      emotionalDimensions: {
        joy: 89,
        fear: 41,
        anger: 92,
        sadness: 77,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-02-14',
      country: 'LB',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 74, cfi: 69, hri: 64 },
      emotionalDimensions: {
        joy: 84,
        fear: 47,
        anger: 91,
        sadness: 71,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2010-02-16',
      country: 'SA',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 75, cfi: 72, hri: 72 },
      emotionalDimensions: {
        joy: 78,
        fear: 54,
        anger: 90,
        sadness: 67,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-02-18',
      country: 'EU',
      description: 'تحسن الاستقرار الأمني',
      dcftIndices: { gmi: 78, cfi: 79, hri: 71 },
      emotionalDimensions: {
        joy: 79,
        fear: 59,
        anger: 87,
        sadness: 67,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-02-20',
      country: 'IQ',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 87, cfi: 68, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 43,
        anger: 95,
        sadness: 77,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2010-02-22',
      country: 'LB',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 74, cfi: 76, hri: 67 },
      emotionalDimensions: {
        joy: 83,
        fear: 57,
        anger: 91,
        sadness: 75,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2010-02-24',
      country: 'PS',
      description: 'معرض فني دولي',
      dcftIndices: { gmi: 84, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 39,
        anger: 95,
        sadness: 76,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2010-02-26',
      country: 'IR',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 88, cfi: 71, hri: 61 },
      emotionalDimensions: {
        joy: 90,
        fear: 43,
        anger: 91,
        sadness: 77,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-02-28',
      country: 'KR',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 86, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 90,
        fear: 49,
        anger: 87,
        sadness: 79,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2010-03-02',
      country: 'QA',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 83, cfi: 71, hri: 55 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 91,
        sadness: 80,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2010-03-04',
      country: 'IQ',
      description: 'انخفاض معدل البطالة إلى 8%',
      dcftIndices: { gmi: 87, cfi: 69, hri: 60 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 91,
        sadness: 72,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-03-06',
      country: 'NG',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 80, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 78,
        fear: 51,
        anger: 83,
        sadness: 75,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2010-03-08',
      country: 'IR',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 75, cfi: 77, hri: 77 },
      emotionalDimensions: {
        joy: 71,
        fear: 64,
        anger: 82,
        sadness: 72,
        hope: 30,
        curiosity: 32
      }
    },
    {
      date: '2010-03-10',
      country: 'NG',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 86, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 41,
        anger: 89,
        sadness: 80,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2010-03-12',
      country: 'OM',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 74, cfi: 70, hri: 66 },
      emotionalDimensions: {
        joy: 86,
        fear: 51,
        anger: 86,
        sadness: 74,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2010-03-14',
      country: 'PS',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 12%',
      dcftIndices: { gmi: 83, cfi: 73, hri: 68 },
      emotionalDimensions: {
        joy: 83,
        fear: 46,
        anger: 94,
        sadness: 83,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-03-16',
      country: 'CN',
      description: 'فعالية ثقافية كبرى',
      dcftIndices: { gmi: 80, cfi: 61, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 44,
        anger: 91,
        sadness: 76,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-03-18',
      country: 'LB',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 74, cfi: 70, hri: 64 },
      emotionalDimensions: {
        joy: 84,
        fear: 50,
        anger: 84,
        sadness: 70,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-03-20',
      country: 'BR',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 74, cfi: 71, hri: 63 },
      emotionalDimensions: {
        joy: 83,
        fear: 56,
        anger: 88,
        sadness: 75,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2010-03-22',
      country: 'KR',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 78, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 81,
        fear: 54,
        anger: 88,
        sadness: 78,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2010-03-24',
      country: 'PS',
      description: 'افتتاح مركز تكنولوجي',
      dcftIndices: { gmi: 78, cfi: 64, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 47,
        anger: 94,
        sadness: 72,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2010-03-26',
      country: 'ZA',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 74, cfi: 79, hri: 77 },
      emotionalDimensions: {
        joy: 77,
        fear: 62,
        anger: 83,
        sadness: 65,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-03-28',
      country: 'AE',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 71, cfi: 72, hri: 73 },
      emotionalDimensions: {
        joy: 75,
        fear: 52,
        anger: 83,
        sadness: 66,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-03-30',
      country: 'KW',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 83, cfi: 62, hri: 60 },
      emotionalDimensions: {
        joy: 89,
        fear: 47,
        anger: 95,
        sadness: 72,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2010-04-01',
      country: 'JP',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 80, cfi: 81, hri: 75 },
      emotionalDimensions: {
        joy: 79,
        fear: 58,
        anger: 87,
        sadness: 63,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-04-03',
      country: 'ZA',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 84, cfi: 71, hri: 59 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 85,
        sadness: 72,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2010-04-05',
      country: 'SA',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 85, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 94,
        sadness: 76,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-04-07',
      country: 'TR',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 83, cfi: 70, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 44,
        anger: 92,
        sadness: 73,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2010-04-09',
      country: 'MX',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 86, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 92,
        sadness: 71,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2010-04-11',
      country: 'JO',
      description: 'إطلاق مدينة ذكية',
      dcftIndices: { gmi: 89, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 91,
        sadness: 84,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2010-04-13',
      country: 'IQ',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 78, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 37,
        anger: 94,
        sadness: 74,
        hope: 35,
        curiosity: 45
      }
    },
    {
      date: '2010-04-15',
      country: 'TR',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 79, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 89,
        fear: 38,
        anger: 91,
        sadness: 83,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2010-04-17',
      country: 'TR',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 80, cfi: 69, hri: 55 },
      emotionalDimensions: {
        joy: 92,
        fear: 41,
        anger: 95,
        sadness: 81,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2010-04-19',
      country: 'NG',
      description: 'فعالية ثقافية كبرى',
      dcftIndices: { gmi: 89, cfi: 61, hri: 58 },
      emotionalDimensions: {
        joy: 91,
        fear: 38,
        anger: 94,
        sadness: 77,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-04-21',
      country: 'MX',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 84, cfi: 67, hri: 57 },
      emotionalDimensions: {
        joy: 88,
        fear: 36,
        anger: 93,
        sadness: 77,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2010-04-23',
      country: 'IR',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 80, cfi: 74, hri: 67 },
      emotionalDimensions: {
        joy: 84,
        fear: 54,
        anger: 90,
        sadness: 68,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-04-25',
      country: 'CN',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 78, cfi: 70, hri: 53 },
      emotionalDimensions: {
        joy: 83,
        fear: 46,
        anger: 92,
        sadness: 76,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2010-04-27',
      country: 'SA',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 76, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 89,
        fear: 41,
        anger: 90,
        sadness: 70,
        hope: 35,
        curiosity: 45
      }
    },
    {
      date: '2010-04-29',
      country: 'SA',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 70, cfi: 74, hri: 71 },
      emotionalDimensions: {
        joy: 74,
        fear: 59,
        anger: 81,
        sadness: 71,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2010-05-01',
      country: 'MA',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 79, cfi: 72, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 46,
        anger: 95,
        sadness: 78,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-05-03',
      country: 'BH',
      description: 'معرض فني دولي',
      dcftIndices: { gmi: 85, cfi: 70, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 87,
        sadness: 77,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2010-05-05',
      country: 'BR',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 88, cfi: 70, hri: 50 },
      emotionalDimensions: {
        joy: 83,
        fear: 34,
        anger: 90,
        sadness: 83,
        hope: 38,
        curiosity: 42
      }
    },
    {
      date: '2010-05-07',
      country: 'LB',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 87, cfi: 60, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 95,
        sadness: 79,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2010-05-09',
      country: 'JP',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 71, cfi: 69, hri: 68 },
      emotionalDimensions: {
        joy: 82,
        fear: 52,
        anger: 84,
        sadness: 69,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2010-05-11',
      country: 'MX',
      description: 'بطولة رياضية عالمية',
      dcftIndices: { gmi: 81, cfi: 63, hri: 50 },
      emotionalDimensions: {
        joy: 86,
        fear: 34,
        anger: 90,
        sadness: 75,
        hope: 38,
        curiosity: 46
      }
    },
    {
      date: '2010-05-13',
      country: 'QA',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 78, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 58,
        anger: 83,
        sadness: 69,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-05-15',
      country: 'US',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 84, cfi: 62, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 44,
        anger: 95,
        sadness: 79,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2010-05-17',
      country: 'MA',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 86, cfi: 65, hri: 57 },
      emotionalDimensions: {
        joy: 82,
        fear: 46,
        anger: 88,
        sadness: 76,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-05-19',
      country: 'ZA',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 79, cfi: 64, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 45,
        anger: 85,
        sadness: 76,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2010-05-21',
      country: 'BR',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 88, cfi: 64, hri: 52 },
      emotionalDimensions: {
        joy: 93,
        fear: 38,
        anger: 95,
        sadness: 76,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-05-23',
      country: 'IL',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 89, cfi: 68, hri: 51 },
      emotionalDimensions: {
        joy: 90,
        fear: 43,
        anger: 95,
        sadness: 83,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2010-05-25',
      country: 'US',
      description: 'تحسن الخدمات الصحية',
      dcftIndices: { gmi: 87, cfi: 63, hri: 52 },
      emotionalDimensions: {
        joy: 87,
        fear: 41,
        anger: 92,
        sadness: 77,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-05-27',
      country: 'IR',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 80, cfi: 74, hri: 64 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 88,
        sadness: 74,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2010-05-29',
      country: 'JP',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 81, cfi: 74, hri: 58 },
      emotionalDimensions: {
        joy: 81,
        fear: 48,
        anger: 84,
        sadness: 74,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2010-05-31',
      country: 'ZA',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 82, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 46,
        anger: 94,
        sadness: 75,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-06-02',
      country: 'IQ',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 80, cfi: 68, hri: 68 },
      emotionalDimensions: {
        joy: 87,
        fear: 48,
        anger: 95,
        sadness: 76,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-06-04',
      country: 'EU',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 80, cfi: 60, hri: 52 },
      emotionalDimensions: {
        joy: 93,
        fear: 37,
        anger: 95,
        sadness: 78,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-06-06',
      country: 'BH',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 90, cfi: 60, hri: 52 },
      emotionalDimensions: {
        joy: 84,
        fear: 39,
        anger: 95,
        sadness: 82,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-06-08',
      country: 'PS',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 74, cfi: 71, hri: 59 },
      emotionalDimensions: {
        joy: 81,
        fear: 51,
        anger: 83,
        sadness: 68,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-06-10',
      country: 'TR',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 82, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 77,
        fear: 52,
        anger: 82,
        sadness: 78,
        hope: 33,
        curiosity: 35
      }
    },
    {
      date: '2010-06-12',
      country: 'BR',
      description: 'اتفاق أمني إقليمي',
      dcftIndices: { gmi: 73, cfi: 80, hri: 71 },
      emotionalDimensions: {
        joy: 83,
        fear: 61,
        anger: 86,
        sadness: 75,
        hope: 30,
        curiosity: 32
      }
    },
    {
      date: '2010-06-14',
      country: 'BR',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 83, cfi: 67, hri: 54 },
      emotionalDimensions: {
        joy: 81,
        fear: 42,
        anger: 92,
        sadness: 74,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2010-06-16',
      country: 'AE',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 82, cfi: 69, hri: 52 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 89,
        sadness: 77,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-06-18',
      country: 'BH',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 75, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 79,
        fear: 49,
        anger: 85,
        sadness: 78,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2010-06-20',
      country: 'RU',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 80, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 82,
        fear: 48,
        anger: 88,
        sadness: 72,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2010-06-22',
      country: 'SA',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 74, cfi: 70, hri: 67 },
      emotionalDimensions: {
        joy: 78,
        fear: 52,
        anger: 82,
        sadness: 69,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-06-24',
      country: 'SY',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 86, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 89,
        fear: 41,
        anger: 87,
        sadness: 79,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2010-06-26',
      country: 'TR',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 81, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 88,
        fear: 38,
        anger: 88,
        sadness: 82,
        hope: 37,
        curiosity: 40
      }
    },
    {
      date: '2010-06-28',
      country: 'LB',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 79, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 91,
        sadness: 79,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-06-30',
      country: 'US',
      description: 'اتفاق بيئي إقليمي',
      dcftIndices: { gmi: 81, cfi: 71, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 94,
        sadness: 72,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-07-02',
      country: 'IQ',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 76, cfi: 72, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 52,
        anger: 90,
        sadness: 73,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-07-04',
      country: 'EG',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 87, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 89,
        fear: 39,
        anger: 90,
        sadness: 77,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2010-07-06',
      country: 'TR',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 75, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 52,
        anger: 93,
        sadness: 76,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-07-08',
      country: 'MA',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 81, cfi: 69, hri: 66 },
      emotionalDimensions: {
        joy: 76,
        fear: 55,
        anger: 87,
        sadness: 76,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2010-07-10',
      country: 'TR',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 86, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 40,
        anger: 90,
        sadness: 77,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2010-07-12',
      country: 'ZA',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 78, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 78,
        fear: 53,
        anger: 83,
        sadness: 76,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2010-07-14',
      country: 'LB',
      description: 'اتفاق بيئي إقليمي',
      dcftIndices: { gmi: 85, cfi: 74, hri: 59 },
      emotionalDimensions: {
        joy: 87,
        fear: 44,
        anger: 90,
        sadness: 79,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-07-16',
      country: 'IN',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 80, cfi: 71, hri: 65 },
      emotionalDimensions: {
        joy: 79,
        fear: 47,
        anger: 85,
        sadness: 75,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2010-07-18',
      country: 'SA',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 72, cfi: 76, hri: 71 },
      emotionalDimensions: {
        joy: 79,
        fear: 57,
        anger: 79,
        sadness: 70,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2010-07-20',
      country: 'MA',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 88, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 90,
        fear: 44,
        anger: 90,
        sadness: 83,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2010-07-22',
      country: 'YE',
      description: 'اتفاق بيئي إقليمي',
      dcftIndices: { gmi: 81, cfi: 66, hri: 65 },
      emotionalDimensions: {
        joy: 83,
        fear: 43,
        anger: 86,
        sadness: 71,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2010-07-24',
      country: 'OM',
      description: 'افتتاح متحف جديد',
      dcftIndices: { gmi: 86, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 47,
        anger: 94,
        sadness: 81,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-07-26',
      country: 'JO',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 82, cfi: 74, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 50,
        anger: 87,
        sadness: 73,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2010-07-28',
      country: 'BH',
      description: 'تحسن الصادرات بنسبة 15%',
      dcftIndices: { gmi: 84, cfi: 68, hri: 57 },
      emotionalDimensions: {
        joy: 86,
        fear: 52,
        anger: 87,
        sadness: 72,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-07-30',
      country: 'US',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 80, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 42,
        anger: 91,
        sadness: 79,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-08-01',
      country: 'OM',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 11%',
      dcftIndices: { gmi: 79, cfi: 68, hri: 64 },
      emotionalDimensions: {
        joy: 89,
        fear: 40,
        anger: 86,
        sadness: 80,
        hope: 37,
        curiosity: 40
      }
    },
    {
      date: '2010-08-03',
      country: 'BH',
      description: 'افتتاح منطقة اقتصادية حرة',
      dcftIndices: { gmi: 79, cfi: 73, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 45,
        anger: 88,
        sadness: 78,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2010-08-05',
      country: 'EG',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 70, cfi: 83, hri: 68 },
      emotionalDimensions: {
        joy: 75,
        fear: 60,
        anger: 82,
        sadness: 69,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-08-07',
      country: 'ZA',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 82, cfi: 63, hri: 53 },
      emotionalDimensions: {
        joy: 87,
        fear: 39,
        anger: 87,
        sadness: 82,
        hope: 37,
        curiosity: 40
      }
    },
    {
      date: '2010-08-09',
      country: 'BH',
      description: 'توقيع اتفاق تجاري جديد',
      dcftIndices: { gmi: 83, cfi: 64, hri: 66 },
      emotionalDimensions: {
        joy: 86,
        fear: 49,
        anger: 83,
        sadness: 75,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2010-08-11',
      country: 'KR',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 84, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 92,
        fear: 36,
        anger: 92,
        sadness: 83,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2010-08-13',
      country: 'TR',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 81, cfi: 71, hri: 54 },
      emotionalDimensions: {
        joy: 87,
        fear: 49,
        anger: 91,
        sadness: 78,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-08-15',
      country: 'TR',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 81, cfi: 73, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 40,
        anger: 94,
        sadness: 76,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2010-08-17',
      country: 'MA',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 79, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 87,
        fear: 46,
        anger: 86,
        sadness: 69,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-08-19',
      country: 'QA',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 84, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 79,
        fear: 44,
        anger: 90,
        sadness: 74,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-08-21',
      country: 'TR',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 84, cfi: 73, hri: 55 },
      emotionalDimensions: {
        joy: 85,
        fear: 48,
        anger: 94,
        sadness: 74,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-08-23',
      country: 'EU',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 83, cfi: 68, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 52,
        anger: 87,
        sadness: 72,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-08-25',
      country: 'BR',
      description: 'مهرجان ثقافي عالمي',
      dcftIndices: { gmi: 81, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 42,
        anger: 95,
        sadness: 83,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2010-08-27',
      country: 'BR',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 88, cfi: 62, hri: 52 },
      emotionalDimensions: {
        joy: 84,
        fear: 38,
        anger: 95,
        sadness: 80,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-08-29',
      country: 'EU',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 68, cfi: 78, hri: 77 },
      emotionalDimensions: {
        joy: 70,
        fear: 60,
        anger: 82,
        sadness: 64,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-08-31',
      country: 'KW',
      description: 'اتفاق أمني إقليمي',
      dcftIndices: { gmi: 80, cfi: 70, hri: 73 },
      emotionalDimensions: {
        joy: 83,
        fear: 54,
        anger: 86,
        sadness: 73,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-09-02',
      country: 'SY',
      description: 'تحسن مؤشرات التنمية البشرية',
      dcftIndices: { gmi: 82, cfi: 68, hri: 51 },
      emotionalDimensions: {
        joy: 90,
        fear: 39,
        anger: 93,
        sadness: 74,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2010-09-04',
      country: 'US',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 77, cfi: 76, hri: 71 },
      emotionalDimensions: {
        joy: 72,
        fear: 58,
        anger: 79,
        sadness: 65,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2010-09-06',
      country: 'SA',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 86, cfi: 72, hri: 54 },
      emotionalDimensions: {
        joy: 85,
        fear: 49,
        anger: 93,
        sadness: 73,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-09-08',
      country: 'BH',
      description: 'مهرجان ثقافي عالمي',
      dcftIndices: { gmi: 89, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 37,
        anger: 95,
        sadness: 77,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-09-10',
      country: 'EG',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 85, cfi: 69, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 49,
        anger: 85,
        sadness: 72,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-09-12',
      country: 'EU',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 77, cfi: 75, hri: 62 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 94,
        sadness: 78,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-09-14',
      country: 'EU',
      description: 'تشكيل حكومة جديدة',
      dcftIndices: { gmi: 74, cfi: 75, hri: 69 },
      emotionalDimensions: {
        joy: 79,
        fear: 52,
        anger: 89,
        sadness: 71,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-09-16',
      country: 'KR',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 83, cfi: 69, hri: 64 },
      emotionalDimensions: {
        joy: 85,
        fear: 49,
        anger: 95,
        sadness: 72,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-09-18',
      country: 'JO',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 78, cfi: 78, hri: 68 },
      emotionalDimensions: {
        joy: 82,
        fear: 56,
        anger: 82,
        sadness: 72,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2010-09-20',
      country: 'IN',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 78, cfi: 73, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 93,
        sadness: 75,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2010-09-22',
      country: 'OM',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 80, cfi: 66, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 48,
        anger: 85,
        sadness: 77,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2010-09-24',
      country: 'NG',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 85, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 90,
        fear: 40,
        anger: 90,
        sadness: 80,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2010-09-26',
      country: 'EG',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 75, cfi: 76, hri: 64 },
      emotionalDimensions: {
        joy: 75,
        fear: 53,
        anger: 88,
        sadness: 69,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-09-28',
      country: 'TR',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 69, cfi: 82, hri: 70 },
      emotionalDimensions: {
        joy: 75,
        fear: 57,
        anger: 85,
        sadness: 69,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-09-30',
      country: 'PS',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 81, cfi: 73, hri: 66 },
      emotionalDimensions: {
        joy: 85,
        fear: 54,
        anger: 83,
        sadness: 73,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2010-10-02',
      country: 'IR',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 82, cfi: 73, hri: 68 },
      emotionalDimensions: {
        joy: 79,
        fear: 52,
        anger: 85,
        sadness: 74,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2010-10-04',
      country: 'JP',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 77, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 90,
        fear: 47,
        anger: 90,
        sadness: 81,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2010-10-06',
      country: 'JO',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 88, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 90,
        fear: 42,
        anger: 95,
        sadness: 77,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2010-10-08',
      country: 'SA',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 85, cfi: 63, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 47,
        anger: 90,
        sadness: 75,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2010-10-10',
      country: 'ZA',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 77, cfi: 64, hri: 63 },
      emotionalDimensions: {
        joy: 86,
        fear: 50,
        anger: 89,
        sadness: 69,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2010-10-12',
      country: 'IQ',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 76, cfi: 77, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 54,
        anger: 87,
        sadness: 74,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-10-14',
      country: 'JO',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 84, cfi: 70, hri: 52 },
      emotionalDimensions: {
        joy: 90,
        fear: 38,
        anger: 93,
        sadness: 76,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2010-10-16',
      country: 'BR',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 71, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 74,
        fear: 49,
        anger: 83,
        sadness: 66,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-10-18',
      country: 'MA',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 81, cfi: 75, hri: 61 },
      emotionalDimensions: {
        joy: 78,
        fear: 48,
        anger: 87,
        sadness: 75,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-10-20',
      country: 'BR',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 86, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 83,
        fear: 40,
        anger: 92,
        sadness: 80,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-10-22',
      country: 'SY',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 88, cfi: 75, hri: 63 },
      emotionalDimensions: {
        joy: 88,
        fear: 39,
        anger: 89,
        sadness: 78,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2010-10-24',
      country: 'LB',
      description: 'إطلاق مدينة ذكية',
      dcftIndices: { gmi: 84, cfi: 61, hri: 56 },
      emotionalDimensions: {
        joy: 84,
        fear: 38,
        anger: 90,
        sadness: 75,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2010-10-26',
      country: 'NG',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 78, cfi: 66, hri: 64 },
      emotionalDimensions: {
        joy: 82,
        fear: 55,
        anger: 92,
        sadness: 69,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-10-28',
      country: 'SY',
      description: 'افتتاح منطقة اقتصادية حرة',
      dcftIndices: { gmi: 83, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 44,
        anger: 90,
        sadness: 73,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2010-10-30',
      country: 'SY',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 80, cfi: 75, hri: 69 },
      emotionalDimensions: {
        joy: 85,
        fear: 53,
        anger: 90,
        sadness: 77,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2010-11-01',
      country: 'LB',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 75, cfi: 69, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 51,
        anger: 85,
        sadness: 71,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2010-11-03',
      country: 'IQ',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 79, cfi: 68, hri: 64 },
      emotionalDimensions: {
        joy: 87,
        fear: 38,
        anger: 93,
        sadness: 78,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2010-11-05',
      country: 'EU',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 81, cfi: 59, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 36,
        anger: 93,
        sadness: 78,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2010-11-07',
      country: 'RU',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 80, cfi: 67, hri: 64 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 87,
        sadness: 71,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2010-11-09',
      country: 'JO',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 84, cfi: 69, hri: 57 },
      emotionalDimensions: {
        joy: 82,
        fear: 47,
        anger: 89,
        sadness: 76,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2010-11-11',
      country: 'PS',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 88, cfi: 59, hri: 55 },
      emotionalDimensions: {
        joy: 86,
        fear: 36,
        anger: 89,
        sadness: 83,
        hope: 38,
        curiosity: 41
      }
    },
    {
      date: '2010-11-13',
      country: 'EU',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 74, cfi: 77, hri: 69 },
      emotionalDimensions: {
        joy: 81,
        fear: 49,
        anger: 89,
        sadness: 75,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-11-15',
      country: 'PS',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 87, cfi: 69, hri: 53 },
      emotionalDimensions: {
        joy: 91,
        fear: 38,
        anger: 95,
        sadness: 81,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-11-17',
      country: 'ZA',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 75, cfi: 72, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 53,
        anger: 90,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-11-19',
      country: 'JO',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 89, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 88,
        fear: 44,
        anger: 95,
        sadness: 81,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-11-21',
      country: 'KW',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 71, cfi: 78, hri: 70 },
      emotionalDimensions: {
        joy: 78,
        fear: 58,
        anger: 87,
        sadness: 64,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-11-23',
      country: 'NG',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 78, cfi: 83, hri: 83 },
      emotionalDimensions: {
        joy: 75,
        fear: 68,
        anger: 82,
        sadness: 69,
        hope: 30,
        curiosity: 32
      }
    },
    {
      date: '2010-11-25',
      country: 'KW',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 87, cfi: 70, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 88,
        sadness: 82,
        hope: 34,
        curiosity: 37
      }
    },
    {
      date: '2010-11-27',
      country: 'IR',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 76, cfi: 75, hri: 61 },
      emotionalDimensions: {
        joy: 77,
        fear: 52,
        anger: 86,
        sadness: 68,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2010-11-29',
      country: 'IQ',
      description: 'إنجاز أولمبي',
      dcftIndices: { gmi: 84, cfi: 63, hri: 51 },
      emotionalDimensions: {
        joy: 89,
        fear: 32,
        anger: 95,
        sadness: 81,
        hope: 37,
        curiosity: 44
      }
    },
    {
      date: '2010-12-01',
      country: 'TR',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 79, cfi: 77, hri: 67 },
      emotionalDimensions: {
        joy: 80,
        fear: 60,
        anger: 79,
        sadness: 67,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2010-12-03',
      country: 'RU',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 82, cfi: 70, hri: 57 },
      emotionalDimensions: {
        joy: 79,
        fear: 50,
        anger: 89,
        sadness: 73,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2010-12-05',
      country: 'BH',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 83, cfi: 72, hri: 55 },
      emotionalDimensions: {
        joy: 84,
        fear: 37,
        anger: 88,
        sadness: 81,
        hope: 38,
        curiosity: 41
      }
    },
    {
      date: '2010-12-07',
      country: 'IQ',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 5%',
      dcftIndices: { gmi: 79, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 86,
        sadness: 83,
        hope: 33,
        curiosity: 35
      }
    },
    {
      date: '2010-12-09',
      country: 'NG',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 81, cfi: 65, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 51,
        anger: 94,
        sadness: 73,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-12-11',
      country: 'CN',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 81, cfi: 67, hri: 54 },
      emotionalDimensions: {
        joy: 87,
        fear: 42,
        anger: 91,
        sadness: 80,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2010-12-13',
      country: 'PS',
      description: 'برنامج الرعاية الصحية الشاملة',
      dcftIndices: { gmi: 82, cfi: 67, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 46,
        anger: 86,
        sadness: 78,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2010-12-15',
      country: 'JP',
      description: 'اتفاق أمني إقليمي',
      dcftIndices: { gmi: 78, cfi: 71, hri: 68 },
      emotionalDimensions: {
        joy: 81,
        fear: 60,
        anger: 87,
        sadness: 65,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-12-17',
      country: 'JP',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 84, cfi: 70, hri: 51 },
      emotionalDimensions: {
        joy: 84,
        fear: 36,
        anger: 91,
        sadness: 75,
        hope: 37,
        curiosity: 45
      }
    },
    {
      date: '2010-12-19',
      country: 'SY',
      description: 'إطلاق منصة رقمية جديدة',
      dcftIndices: { gmi: 81, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 42,
        anger: 95,
        sadness: 82,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2010-12-21',
      country: 'KW',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 77, cfi: 69, hri: 54 },
      emotionalDimensions: {
        joy: 84,
        fear: 39,
        anger: 86,
        sadness: 81,
        hope: 38,
        curiosity: 40
      }
    },
    {
      date: '2010-12-23',
      country: 'BR',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 88, cfi: 66, hri: 59 },
      emotionalDimensions: {
        joy: 90,
        fear: 39,
        anger: 95,
        sadness: 79,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-12-25',
      country: 'OM',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 80, cfi: 67, hri: 57 },
      emotionalDimensions: {
        joy: 80,
        fear: 49,
        anger: 85,
        sadness: 70,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-12-27',
      country: 'AE',
      description: 'معرض فني دولي',
      dcftIndices: { gmi: 78, cfi: 73, hri: 57 },
      emotionalDimensions: {
        joy: 88,
        fear: 45,
        anger: 89,
        sadness: 73,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-12-29',
      country: 'IQ',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 83, cfi: 74, hri: 59 },
      emotionalDimensions: {
        joy: 87,
        fear: 52,
        anger: 86,
        sadness: 70,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2010-12-31',
      country: 'BH',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 82, cfi: 60, hri: 51 },
      emotionalDimensions: {
        joy: 87,
        fear: 40,
        anger: 95,
        sadness: 80,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-01-02',
      country: 'YE',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 78, cfi: 81, hri: 72 },
      emotionalDimensions: {
        joy: 76,
        fear: 58,
        anger: 88,
        sadness: 73,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-01-04',
      country: 'OM',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 80, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 52,
        anger: 87,
        sadness: 70,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-01-06',
      country: 'EG',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 83, cfi: 68, hri: 55 },
      emotionalDimensions: {
        joy: 81,
        fear: 44,
        anger: 89,
        sadness: 80,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2011-01-08',
      country: 'AE',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 78, cfi: 65, hri: 58 },
      emotionalDimensions: {
        joy: 80,
        fear: 41,
        anger: 95,
        sadness: 80,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2011-01-10',
      country: 'NG',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 88, cfi: 72, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 90,
        sadness: 76,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-01-12',
      country: 'EU',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 77, cfi: 73, hri: 75 },
      emotionalDimensions: {
        joy: 80,
        fear: 61,
        anger: 77,
        sadness: 72,
        hope: 31,
        curiosity: 34
      }
    },
    {
      date: '2011-01-14',
      country: 'SY',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 75, cfi: 69, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 50,
        anger: 89,
        sadness: 76,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2011-01-16',
      country: 'BH',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 82, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 44,
        anger: 86,
        sadness: 79,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2011-01-18',
      country: 'MA',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 73, cfi: 77, hri: 69 },
      emotionalDimensions: {
        joy: 86,
        fear: 54,
        anger: 92,
        sadness: 77,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-01-20',
      country: 'QA',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 86, cfi: 67, hri: 50 },
      emotionalDimensions: {
        joy: 90,
        fear: 37,
        anger: 89,
        sadness: 80,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2011-01-22',
      country: 'KR',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 84, cfi: 62, hri: 52 },
      emotionalDimensions: {
        joy: 83,
        fear: 36,
        anger: 95,
        sadness: 81,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2011-01-24',
      country: 'US',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 81, cfi: 72, hri: 66 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 93,
        sadness: 74,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2011-01-26',
      country: 'KW',
      description: 'افتتاح منطقة اقتصادية حرة',
      dcftIndices: { gmi: 85, cfi: 68, hri: 67 },
      emotionalDimensions: {
        joy: 85,
        fear: 40,
        anger: 89,
        sadness: 78,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2011-01-28',
      country: 'IR',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 80, cfi: 69, hri: 65 },
      emotionalDimensions: {
        joy: 85,
        fear: 57,
        anger: 91,
        sadness: 75,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2011-01-30',
      country: 'MX',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 78, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 49,
        anger: 85,
        sadness: 70,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-02-01',
      country: 'YE',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 81, cfi: 68, hri: 54 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 93,
        sadness: 77,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-02-03',
      country: 'QA',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 90, cfi: 67, hri: 54 },
      emotionalDimensions: {
        joy: 83,
        fear: 35,
        anger: 95,
        sadness: 74,
        hope: 35,
        curiosity: 46
      }
    },
    {
      date: '2011-02-05',
      country: 'ZA',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 80, cfi: 67, hri: 62 },
      emotionalDimensions: {
        joy: 84,
        fear: 37,
        anger: 89,
        sadness: 78,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2011-02-07',
      country: 'TR',
      description: 'بطولة رياضية عالمية',
      dcftIndices: { gmi: 88, cfi: 59, hri: 57 },
      emotionalDimensions: {
        joy: 89,
        fear: 42,
        anger: 95,
        sadness: 75,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2011-02-09',
      country: 'YE',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 73, cfi: 75, hri: 78 },
      emotionalDimensions: {
        joy: 71,
        fear: 61,
        anger: 84,
        sadness: 71,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2011-02-11',
      country: 'CN',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 82, cfi: 62, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 38,
        anger: 92,
        sadness: 80,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-02-13',
      country: 'TR',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 82, cfi: 69, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 39,
        anger: 92,
        sadness: 75,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2011-02-15',
      country: 'AE',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 79, cfi: 66, hri: 66 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 93,
        sadness: 76,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-02-17',
      country: 'JP',
      description: 'اتفاق عسكري تاريخي',
      dcftIndices: { gmi: 74, cfi: 81, hri: 70 },
      emotionalDimensions: {
        joy: 80,
        fear: 60,
        anger: 86,
        sadness: 70,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-02-19',
      country: 'EU',
      description: 'برنامج الرعاية الصحية الشاملة',
      dcftIndices: { gmi: 79, cfi: 72, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 43,
        anger: 93,
        sadness: 76,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2011-02-21',
      country: 'US',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 87, cfi: 63, hri: 57 },
      emotionalDimensions: {
        joy: 93,
        fear: 40,
        anger: 95,
        sadness: 76,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2011-02-23',
      country: 'JO',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 78, cfi: 71, hri: 63 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 86,
        sadness: 72,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-02-25',
      country: 'TR',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 86, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 86,
        fear: 37,
        anger: 90,
        sadness: 78,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2011-02-27',
      country: 'IN',
      description: 'تحسن مؤشرات التنمية البشرية',
      dcftIndices: { gmi: 81, cfi: 65, hri: 55 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 92,
        sadness: 79,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2011-03-01',
      country: 'MX',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 76, cfi: 67, hri: 53 },
      emotionalDimensions: {
        joy: 89,
        fear: 41,
        anger: 88,
        sadness: 75,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2011-03-03',
      country: 'SY',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 82, cfi: 74, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 49,
        anger: 86,
        sadness: 72,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-03-05',
      country: 'LB',
      description: 'تشكيل حكومة جديدة',
      dcftIndices: { gmi: 75, cfi: 69, hri: 68 },
      emotionalDimensions: {
        joy: 77,
        fear: 58,
        anger: 82,
        sadness: 71,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-03-07',
      country: 'SA',
      description: 'تحسن مؤشرات التنمية البشرية',
      dcftIndices: { gmi: 84, cfi: 63, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 95,
        sadness: 76,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2011-03-09',
      country: 'IL',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 74, cfi: 77, hri: 78 },
      emotionalDimensions: {
        joy: 69,
        fear: 61,
        anger: 75,
        sadness: 67,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2011-03-11',
      country: 'MA',
      description: 'اتفاق بيئي إقليمي',
      dcftIndices: { gmi: 75, cfi: 69, hri: 59 },
      emotionalDimensions: {
        joy: 81,
        fear: 48,
        anger: 84,
        sadness: 71,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-03-13',
      country: 'IN',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 85, cfi: 62, hri: 55 },
      emotionalDimensions: {
        joy: 82,
        fear: 43,
        anger: 90,
        sadness: 78,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2011-03-15',
      country: 'NG',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 87, cfi: 63, hri: 59 },
      emotionalDimensions: {
        joy: 81,
        fear: 44,
        anger: 88,
        sadness: 74,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-03-17',
      country: 'PS',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 84, cfi: 61, hri: 52 },
      emotionalDimensions: {
        joy: 88,
        fear: 34,
        anger: 95,
        sadness: 76,
        hope: 36,
        curiosity: 45
      }
    },
    {
      date: '2011-03-19',
      country: 'LB',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 6%',
      dcftIndices: { gmi: 77, cfi: 68, hri: 69 },
      emotionalDimensions: {
        joy: 86,
        fear: 46,
        anger: 95,
        sadness: 81,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-03-21',
      country: 'IN',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 78, cfi: 76, hri: 74 },
      emotionalDimensions: {
        joy: 74,
        fear: 59,
        anger: 84,
        sadness: 65,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-03-23',
      country: 'SA',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 80, cfi: 75, hri: 61 },
      emotionalDimensions: {
        joy: 85,
        fear: 54,
        anger: 82,
        sadness: 72,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2011-03-25',
      country: 'EG',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 89, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 89,
        fear: 38,
        anger: 89,
        sadness: 76,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2011-03-27',
      country: 'IR',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 83, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 43,
        anger: 95,
        sadness: 80,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-03-29',
      country: 'KW',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 87,
        fear: 39,
        anger: 95,
        sadness: 84,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2011-03-31',
      country: 'YE',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 86, cfi: 64, hri: 63 },
      emotionalDimensions: {
        joy: 87,
        fear: 44,
        anger: 93,
        sadness: 78,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2011-04-02',
      country: 'JO',
      description: 'إطلاق مدينة ذكية',
      dcftIndices: { gmi: 86, cfi: 67, hri: 54 },
      emotionalDimensions: {
        joy: 88,
        fear: 37,
        anger: 94,
        sadness: 83,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2011-04-04',
      country: 'IR',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 70, cfi: 78, hri: 73 },
      emotionalDimensions: {
        joy: 76,
        fear: 65,
        anger: 85,
        sadness: 68,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2011-04-06',
      country: 'IR',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 87, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 35,
        anger: 95,
        sadness: 80,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2011-04-08',
      country: 'SY',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 74, cfi: 82, hri: 77 },
      emotionalDimensions: {
        joy: 71,
        fear: 60,
        anger: 84,
        sadness: 68,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-04-10',
      country: 'AE',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 74, cfi: 75, hri: 61 },
      emotionalDimensions: {
        joy: 75,
        fear: 54,
        anger: 82,
        sadness: 75,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2011-04-12',
      country: 'EG',
      description: 'اتفاق أمني إقليمي',
      dcftIndices: { gmi: 81, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 83,
        fear: 61,
        anger: 83,
        sadness: 66,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-04-14',
      country: 'JP',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 76, cfi: 65, hri: 55 },
      emotionalDimensions: {
        joy: 85,
        fear: 52,
        anger: 93,
        sadness: 72,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-04-16',
      country: 'IL',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 80, cfi: 66, hri: 64 },
      emotionalDimensions: {
        joy: 89,
        fear: 49,
        anger: 89,
        sadness: 77,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2011-04-18',
      country: 'KW',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 12%',
      dcftIndices: { gmi: 78, cfi: 77, hri: 68 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 90,
        sadness: 73,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-04-20',
      country: 'NG',
      description: 'تحسن الخدمات الصحية',
      dcftIndices: { gmi: 80, cfi: 66, hri: 54 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 94,
        sadness: 76,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-04-22',
      country: 'RU',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 83, cfi: 73, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 45,
        anger: 86,
        sadness: 76,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2011-04-24',
      country: 'US',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 74, cfi: 73, hri: 64 },
      emotionalDimensions: {
        joy: 85,
        fear: 53,
        anger: 89,
        sadness: 77,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-04-26',
      country: 'QA',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 89, cfi: 70, hri: 52 },
      emotionalDimensions: {
        joy: 93,
        fear: 35,
        anger: 94,
        sadness: 75,
        hope: 36,
        curiosity: 45
      }
    },
    {
      date: '2011-04-28',
      country: 'YE',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 79, cfi: 66, hri: 54 },
      emotionalDimensions: {
        joy: 88,
        fear: 41,
        anger: 90,
        sadness: 83,
        hope: 35,
        curiosity: 38
      }
    },
    {
      date: '2011-04-30',
      country: 'IN',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 82, cfi: 64, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 91,
        sadness: 74,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-05-02',
      country: 'US',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 76, cfi: 67, hri: 64 },
      emotionalDimensions: {
        joy: 87,
        fear: 51,
        anger: 93,
        sadness: 74,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-05-04',
      country: 'NG',
      description: 'توقيع اتفاق تجاري جديد',
      dcftIndices: { gmi: 78, cfi: 64, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 44,
        anger: 85,
        sadness: 72,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2011-05-06',
      country: 'IR',
      description: 'توقيع اتفاق تجاري جديد',
      dcftIndices: { gmi: 78, cfi: 64, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 51,
        anger: 90,
        sadness: 79,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-05-08',
      country: 'IQ',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 85, cfi: 63, hri: 52 },
      emotionalDimensions: {
        joy: 87,
        fear: 45,
        anger: 92,
        sadness: 73,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2011-05-10',
      country: 'MX',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 81, cfi: 70, hri: 59 },
      emotionalDimensions: {
        joy: 81,
        fear: 40,
        anger: 87,
        sadness: 78,
        hope: 37,
        curiosity: 41
      }
    },
    {
      date: '2011-05-12',
      country: 'US',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 83, cfi: 70, hri: 53 },
      emotionalDimensions: {
        joy: 86,
        fear: 42,
        anger: 87,
        sadness: 73,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2011-05-14',
      country: 'KW',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 77, cfi: 78, hri: 70 },
      emotionalDimensions: {
        joy: 70,
        fear: 62,
        anger: 82,
        sadness: 64,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-05-16',
      country: 'EG',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 80, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 38,
        anger: 94,
        sadness: 82,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2011-05-18',
      country: 'EG',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 78, cfi: 63, hri: 54 },
      emotionalDimensions: {
        joy: 84,
        fear: 47,
        anger: 86,
        sadness: 71,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-05-20',
      country: 'BR',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 82, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 43,
        anger: 94,
        sadness: 78,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2011-05-22',
      country: 'EG',
      description: 'اتفاق عسكري تاريخي',
      dcftIndices: { gmi: 79, cfi: 76, hri: 77 },
      emotionalDimensions: {
        joy: 80,
        fear: 54,
        anger: 85,
        sadness: 69,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-05-24',
      country: 'YE',
      description: 'تحسن الصادرات بنسبة 14%',
      dcftIndices: { gmi: 77, cfi: 74, hri: 57 },
      emotionalDimensions: {
        joy: 81,
        fear: 44,
        anger: 88,
        sadness: 71,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2011-05-26',
      country: 'JO',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 87, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 38,
        anger: 95,
        sadness: 77,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2011-05-28',
      country: 'TR',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 81, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 90,
        fear: 45,
        anger: 87,
        sadness: 72,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2011-05-30',
      country: 'KR',
      description: 'تحسن مؤشرات التنمية البشرية',
      dcftIndices: { gmi: 81, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 81,
        fear: 42,
        anger: 95,
        sadness: 81,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2011-06-01',
      country: 'BR',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 83, cfi: 72, hri: 66 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 87,
        sadness: 77,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2011-06-03',
      country: 'SY',
      description: 'افتتاح منطقة اقتصادية حرة',
      dcftIndices: { gmi: 79, cfi: 65, hri: 63 },
      emotionalDimensions: {
        joy: 91,
        fear: 42,
        anger: 91,
        sadness: 81,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2011-06-05',
      country: 'EU',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 72, cfi: 73, hri: 61 },
      emotionalDimensions: {
        joy: 77,
        fear: 52,
        anger: 86,
        sadness: 76,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2011-06-07',
      country: 'YE',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 77, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 88,
        fear: 53,
        anger: 86,
        sadness: 76,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2011-06-09',
      country: 'LB',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 83, cfi: 72, hri: 65 },
      emotionalDimensions: {
        joy: 80,
        fear: 53,
        anger: 94,
        sadness: 79,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2011-06-11',
      country: 'EU',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 73, cfi: 74, hri: 68 },
      emotionalDimensions: {
        joy: 74,
        fear: 56,
        anger: 90,
        sadness: 70,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-06-13',
      country: 'IL',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 78, cfi: 79, hri: 66 },
      emotionalDimensions: {
        joy: 77,
        fear: 55,
        anger: 79,
        sadness: 70,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2011-06-15',
      country: 'EG',
      description: 'انخفاض معدل البطالة إلى 14%',
      dcftIndices: { gmi: 79, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 86,
        sadness: 79,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2011-06-17',
      country: 'PS',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 82, cfi: 74, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 91,
        sadness: 69,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2011-06-19',
      country: 'US',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 89, cfi: 68, hri: 68 },
      emotionalDimensions: {
        joy: 88,
        fear: 48,
        anger: 95,
        sadness: 75,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-06-21',
      country: 'BR',
      description: 'مشروع حماية البيئة',
      dcftIndices: { gmi: 82, cfi: 66, hri: 64 },
      emotionalDimensions: {
        joy: 86,
        fear: 50,
        anger: 91,
        sadness: 76,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-06-23',
      country: 'SY',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 74, cfi: 67, hri: 61 },
      emotionalDimensions: {
        joy: 77,
        fear: 55,
        anger: 92,
        sadness: 77,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2011-06-25',
      country: 'AE',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 80, cfi: 72, hri: 64 },
      emotionalDimensions: {
        joy: 80,
        fear: 51,
        anger: 86,
        sadness: 71,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2011-06-27',
      country: 'NG',
      description: 'برنامج الرعاية الصحية الشاملة',
      dcftIndices: { gmi: 78, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 95,
        sadness: 71,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2011-06-29',
      country: 'JO',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 83, cfi: 72, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 46,
        anger: 87,
        sadness: 78,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2011-07-01',
      country: 'SY',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 81, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 89,
        fear: 43,
        anger: 88,
        sadness: 77,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2011-07-03',
      country: 'PS',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 85, cfi: 74, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 46,
        anger: 92,
        sadness: 79,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2011-07-05',
      country: 'LB',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 71, cfi: 76, hri: 69 },
      emotionalDimensions: {
        joy: 78,
        fear: 54,
        anger: 86,
        sadness: 67,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2011-07-07',
      country: 'IQ',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 73, cfi: 77, hri: 63 },
      emotionalDimensions: {
        joy: 83,
        fear: 49,
        anger: 85,
        sadness: 72,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-07-09',
      country: 'BR',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 85, cfi: 72, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 54,
        anger: 91,
        sadness: 79,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2011-07-11',
      country: 'IQ',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 76, cfi: 73, hri: 55 },
      emotionalDimensions: {
        joy: 79,
        fear: 38,
        anger: 86,
        sadness: 76,
        hope: 38,
        curiosity: 43
      }
    },
    {
      date: '2011-07-13',
      country: 'IN',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 84, cfi: 70, hri: 57 },
      emotionalDimensions: {
        joy: 81,
        fear: 41,
        anger: 95,
        sadness: 81,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2011-07-15',
      country: 'BR',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 76, cfi: 78, hri: 75 },
      emotionalDimensions: {
        joy: 72,
        fear: 60,
        anger: 86,
        sadness: 72,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2011-07-17',
      country: 'QA',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 81, cfi: 61, hri: 55 },
      emotionalDimensions: {
        joy: 89,
        fear: 40,
        anger: 92,
        sadness: 78,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-07-19',
      country: 'QA',
      description: 'تحسن الخدمات الصحية',
      dcftIndices: { gmi: 77, cfi: 72, hri: 54 },
      emotionalDimensions: {
        joy: 84,
        fear: 44,
        anger: 87,
        sadness: 77,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2011-07-21',
      country: 'IL',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 87, cfi: 65, hri: 53 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 95,
        sadness: 73,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2011-07-23',
      country: 'SA',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 76, cfi: 75, hri: 68 },
      emotionalDimensions: {
        joy: 81,
        fear: 59,
        anger: 80,
        sadness: 72,
        hope: 31,
        curiosity: 35
      }
    },
    {
      date: '2011-07-25',
      country: 'ZA',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 83, cfi: 72, hri: 64 },
      emotionalDimensions: {
        joy: 86,
        fear: 51,
        anger: 91,
        sadness: 71,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-07-27',
      country: 'JO',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 86, cfi: 64, hri: 50 },
      emotionalDimensions: {
        joy: 92,
        fear: 39,
        anger: 91,
        sadness: 85,
        hope: 35,
        curiosity: 38
      }
    },
    {
      date: '2011-07-29',
      country: 'PS',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 83, cfi: 75, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 46,
        anger: 83,
        sadness: 77,
        hope: 36,
        curiosity: 39
      }
    },
    {
      date: '2011-07-31',
      country: 'IR',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 80, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 95,
        sadness: 79,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-08-02',
      country: 'IN',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 79, cfi: 65, hri: 52 },
      emotionalDimensions: {
        joy: 88,
        fear: 45,
        anger: 89,
        sadness: 74,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-08-04',
      country: 'PS',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 90, cfi: 62, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 34,
        anger: 95,
        sadness: 80,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2011-08-06',
      country: 'PS',
      description: 'افتتاح متحف جديد',
      dcftIndices: { gmi: 82, cfi: 63, hri: 59 },
      emotionalDimensions: {
        joy: 90,
        fear: 39,
        anger: 89,
        sadness: 79,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2011-08-08',
      country: 'MX',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 90, cfi: 71, hri: 54 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 92,
        sadness: 84,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2011-08-10',
      country: 'IQ',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 74, cfi: 73, hri: 61 },
      emotionalDimensions: {
        joy: 76,
        fear: 54,
        anger: 87,
        sadness: 72,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-08-12',
      country: 'LB',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 77, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 78,
        fear: 46,
        anger: 85,
        sadness: 72,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-08-14',
      country: 'ZA',
      description: 'اتفاق بيئي إقليمي',
      dcftIndices: { gmi: 81, cfi: 65, hri: 62 },
      emotionalDimensions: {
        joy: 88,
        fear: 48,
        anger: 85,
        sadness: 70,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-08-16',
      country: 'IR',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 84, cfi: 61, hri: 57 },
      emotionalDimensions: {
        joy: 94,
        fear: 34,
        anger: 94,
        sadness: 76,
        hope: 36,
        curiosity: 45
      }
    },
    {
      date: '2011-08-18',
      country: 'EG',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 75, cfi: 73, hri: 74 },
      emotionalDimensions: {
        joy: 80,
        fear: 53,
        anger: 86,
        sadness: 69,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-08-20',
      country: 'MA',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 83, cfi: 69, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 95,
        sadness: 77,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2011-08-22',
      country: 'KW',
      description: 'انخفاض معدل البطالة إلى 8%',
      dcftIndices: { gmi: 86, cfi: 65, hri: 65 },
      emotionalDimensions: {
        joy: 89,
        fear: 50,
        anger: 85,
        sadness: 76,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2011-08-24',
      country: 'LB',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 84, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 45,
        anger: 90,
        sadness: 75,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-08-26',
      country: 'CN',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 80, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 83,
        fear: 43,
        anger: 87,
        sadness: 74,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2011-08-28',
      country: 'YE',
      description: 'افتتاح منطقة اقتصادية حرة',
      dcftIndices: { gmi: 78, cfi: 70, hri: 67 },
      emotionalDimensions: {
        joy: 81,
        fear: 47,
        anger: 89,
        sadness: 73,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2011-08-30',
      country: 'SA',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 73, cfi: 76, hri: 63 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 86,
        sadness: 68,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2011-09-01',
      country: 'LB',
      description: 'اتفاق أمني إقليمي',
      dcftIndices: { gmi: 72, cfi: 79, hri: 68 },
      emotionalDimensions: {
        joy: 84,
        fear: 60,
        anger: 81,
        sadness: 75,
        hope: 30,
        curiosity: 33
      }
    },
    {
      date: '2011-09-03',
      country: 'EG',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 73, cfi: 73, hri: 74 },
      emotionalDimensions: {
        joy: 78,
        fear: 61,
        anger: 83,
        sadness: 73,
        hope: 30,
        curiosity: 33
      }
    },
    {
      date: '2011-09-05',
      country: 'YE',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 81, cfi: 64, hri: 64 },
      emotionalDimensions: {
        joy: 82,
        fear: 47,
        anger: 86,
        sadness: 75,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2011-09-07',
      country: 'QA',
      description: 'توقيع معاهدة دولية',
      dcftIndices: { gmi: 80, cfi: 65, hri: 57 },
      emotionalDimensions: {
        joy: 78,
        fear: 54,
        anger: 85,
        sadness: 68,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-09-09',
      country: 'ZA',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 84, cfi: 67, hri: 62 },
      emotionalDimensions: {
        joy: 88,
        fear: 50,
        anger: 85,
        sadness: 73,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2011-09-11',
      country: 'LB',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 81, cfi: 71, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 44,
        anger: 94,
        sadness: 81,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2011-09-13',
      country: 'MA',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 10%',
      dcftIndices: { gmi: 77, cfi: 75, hri: 67 },
      emotionalDimensions: {
        joy: 81,
        fear: 48,
        anger: 90,
        sadness: 79,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2011-09-15',
      country: 'BR',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 81, cfi: 66, hri: 61 },
      emotionalDimensions: {
        joy: 87,
        fear: 36,
        anger: 91,
        sadness: 72,
        hope: 37,
        curiosity: 46
      }
    },
    {
      date: '2011-09-17',
      country: 'IN',
      description: 'برنامج الرعاية الصحية الشاملة',
      dcftIndices: { gmi: 83, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 43,
        anger: 91,
        sadness: 79,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2011-09-19',
      country: 'AE',
      description: 'اتفاق أمني إقليمي',
      dcftIndices: { gmi: 76, cfi: 71, hri: 71 },
      emotionalDimensions: {
        joy: 74,
        fear: 61,
        anger: 87,
        sadness: 69,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-09-21',
      country: 'LB',
      description: 'افتتاح منطقة اقتصادية حرة',
      dcftIndices: { gmi: 81, cfi: 70, hri: 66 },
      emotionalDimensions: {
        joy: 87,
        fear: 46,
        anger: 86,
        sadness: 76,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2011-09-23',
      country: 'RU',
      description: 'توقيع معاهدة دولية',
      dcftIndices: { gmi: 80, cfi: 65, hri: 63 },
      emotionalDimensions: {
        joy: 77,
        fear: 49,
        anger: 85,
        sadness: 69,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-09-25',
      country: 'CN',
      description: 'افتتاح مركز تكنولوجي',
      dcftIndices: { gmi: 78, cfi: 73, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 39,
        anger: 87,
        sadness: 77,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2011-09-27',
      country: 'IQ',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 82, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 86,
        sadness: 73,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-09-29',
      country: 'TR',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 79, cfi: 68, hri: 54 },
      emotionalDimensions: {
        joy: 81,
        fear: 47,
        anger: 89,
        sadness: 76,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2011-10-01',
      country: 'NG',
      description: 'تشكيل حكومة جديدة',
      dcftIndices: { gmi: 79, cfi: 71, hri: 68 },
      emotionalDimensions: {
        joy: 79,
        fear: 55,
        anger: 91,
        sadness: 76,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-10-03',
      country: 'PS',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 73, cfi: 78, hri: 67 },
      emotionalDimensions: {
        joy: 74,
        fear: 62,
        anger: 79,
        sadness: 69,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-10-05',
      country: 'IR',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 80, cfi: 80, hri: 75 },
      emotionalDimensions: {
        joy: 79,
        fear: 54,
        anger: 88,
        sadness: 73,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-10-07',
      country: 'IL',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 80, cfi: 74, hri: 63 },
      emotionalDimensions: {
        joy: 83,
        fear: 59,
        anger: 87,
        sadness: 66,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-10-09',
      country: 'JP',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 82, cfi: 67, hri: 61 },
      emotionalDimensions: {
        joy: 79,
        fear: 55,
        anger: 85,
        sadness: 74,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-10-11',
      country: 'BH',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 74, cfi: 76, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 53,
        anger: 87,
        sadness: 70,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-10-13',
      country: 'SA',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 79, cfi: 74, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 49,
        anger: 86,
        sadness: 72,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-10-15',
      country: 'YE',
      description: 'فعالية ثقافية كبرى',
      dcftIndices: { gmi: 87, cfi: 61, hri: 61 },
      emotionalDimensions: {
        joy: 86,
        fear: 38,
        anger: 92,
        sadness: 80,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-10-17',
      country: 'AE',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 83, cfi: 75, hri: 64 },
      emotionalDimensions: {
        joy: 82,
        fear: 47,
        anger: 91,
        sadness: 72,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2011-10-19',
      country: 'SA',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 79, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 81,
        fear: 40,
        anger: 95,
        sadness: 82,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2011-10-21',
      country: 'KW',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 70, cfi: 85, hri: 80 },
      emotionalDimensions: {
        joy: 70,
        fear: 58,
        anger: 79,
        sadness: 66,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2011-10-23',
      country: 'LB',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 83, cfi: 74, hri: 68 },
      emotionalDimensions: {
        joy: 83,
        fear: 47,
        anger: 87,
        sadness: 76,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2011-10-25',
      country: 'AE',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 80, cfi: 75, hri: 55 },
      emotionalDimensions: {
        joy: 87,
        fear: 44,
        anger: 89,
        sadness: 77,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2011-10-27',
      country: 'MA',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 83, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 47,
        anger: 95,
        sadness: 74,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2011-10-29',
      country: 'JO',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 76, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 49,
        anger: 91,
        sadness: 76,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-10-31',
      country: 'IR',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 85, cfi: 70, hri: 54 },
      emotionalDimensions: {
        joy: 85,
        fear: 38,
        anger: 90,
        sadness: 74,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2011-11-02',
      country: 'EG',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 80, cfi: 69, hri: 60 },
      emotionalDimensions: {
        joy: 88,
        fear: 36,
        anger: 95,
        sadness: 82,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-11-04',
      country: 'OM',
      description: 'تحسن الصادرات بنسبة 8%',
      dcftIndices: { gmi: 83, cfi: 66, hri: 65 },
      emotionalDimensions: {
        joy: 83,
        fear: 51,
        anger: 91,
        sadness: 74,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-11-06',
      country: 'SA',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 84, cfi: 74, hri: 59 },
      emotionalDimensions: {
        joy: 78,
        fear: 46,
        anger: 86,
        sadness: 69,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2011-11-08',
      country: 'JO',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 84, cfi: 64, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 39,
        anger: 89,
        sadness: 79,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2011-11-10',
      country: 'AE',
      description: 'برنامج الرعاية الصحية الشاملة',
      dcftIndices: { gmi: 80, cfi: 72, hri: 57 },
      emotionalDimensions: {
        joy: 88,
        fear: 48,
        anger: 88,
        sadness: 77,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2011-11-12',
      country: 'SA',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 79, cfi: 67, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 50,
        anger: 93,
        sadness: 75,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-11-14',
      country: 'IR',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 77, cfi: 78, hri: 77 },
      emotionalDimensions: {
        joy: 78,
        fear: 69,
        anger: 76,
        sadness: 66,
        hope: 30,
        curiosity: 33
      }
    },
    {
      date: '2011-11-16',
      country: 'JP',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 75, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 46,
        anger: 91,
        sadness: 68,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2011-11-18',
      country: 'KR',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 79, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 43,
        anger: 94,
        sadness: 83,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2011-11-20',
      country: 'LB',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 83, cfi: 72, hri: 56 },
      emotionalDimensions: {
        joy: 82,
        fear: 48,
        anger: 86,
        sadness: 73,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-11-22',
      country: 'ZA',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 76, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 89,
        fear: 52,
        anger: 92,
        sadness: 77,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-11-24',
      country: 'IR',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 85, cfi: 68, hri: 55 },
      emotionalDimensions: {
        joy: 81,
        fear: 42,
        anger: 94,
        sadness: 75,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2011-11-26',
      country: 'IL',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 83, cfi: 63, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 88,
        sadness: 81,
        hope: 35,
        curiosity: 38
      }
    },
    {
      date: '2011-11-28',
      country: 'QA',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 83, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 79,
        fear: 53,
        anger: 85,
        sadness: 75,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2011-11-30',
      country: 'BH',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 79, cfi: 69, hri: 51 },
      emotionalDimensions: {
        joy: 86,
        fear: 40,
        anger: 88,
        sadness: 77,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2011-12-02',
      country: 'IQ',
      description: 'توقيع اتفاق تجاري جديد',
      dcftIndices: { gmi: 74, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 90,
        sadness: 76,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-12-04',
      country: 'MX',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 79, cfi: 69, hri: 52 },
      emotionalDimensions: {
        joy: 83,
        fear: 37,
        anger: 93,
        sadness: 76,
        hope: 35,
        curiosity: 44
      }
    },
    {
      date: '2011-12-06',
      country: 'US',
      description: 'تشكيل حكومة جديدة',
      dcftIndices: { gmi: 78, cfi: 71, hri: 69 },
      emotionalDimensions: {
        joy: 81,
        fear: 54,
        anger: 85,
        sadness: 75,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2011-12-08',
      country: 'IR',
      description: 'اتفاق بيئي إقليمي',
      dcftIndices: { gmi: 78, cfi: 75, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 45,
        anger: 85,
        sadness: 71,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2011-12-10',
      country: 'AE',
      description: 'افتتاح متحف جديد',
      dcftIndices: { gmi: 82, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 92,
        sadness: 79,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2011-12-12',
      country: 'RU',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 89, cfi: 65, hri: 52 },
      emotionalDimensions: {
        joy: 83,
        fear: 34,
        anger: 95,
        sadness: 77,
        hope: 36,
        curiosity: 45
      }
    },
    {
      date: '2011-12-14',
      country: 'CN',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 80, cfi: 63, hri: 54 },
      emotionalDimensions: {
        joy: 91,
        fear: 40,
        anger: 91,
        sadness: 79,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-12-16',
      country: 'YE',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 89, cfi: 71, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 37,
        anger: 93,
        sadness: 82,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-12-18',
      country: 'MA',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 85, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 85,
        fear: 41,
        anger: 88,
        sadness: 80,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2011-12-20',
      country: 'TR',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 79, cfi: 66, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 51,
        anger: 91,
        sadness: 74,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-12-22',
      country: 'EG',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 78, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 95,
        sadness: 73,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2011-12-24',
      country: 'QA',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 79, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 52,
        anger: 88,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-12-26',
      country: 'QA',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 75, cfi: 73, hri: 56 },
      emotionalDimensions: {
        joy: 82,
        fear: 53,
        anger: 86,
        sadness: 72,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2011-12-28',
      country: 'LB',
      description: 'مهرجان ثقافي عالمي',
      dcftIndices: { gmi: 79, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 93,
        sadness: 81,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2011-12-30',
      country: 'NG',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 84, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 91,
        sadness: 70,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2012-01-01',
      country: 'IQ',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 85, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 79,
        fear: 45,
        anger: 84,
        sadness: 71,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2012-01-03',
      country: 'IQ',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 74, cfi: 74, hri: 74 },
      emotionalDimensions: {
        joy: 80,
        fear: 51,
        anger: 80,
        sadness: 69,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2012-01-05',
      country: 'PS',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 78, cfi: 68, hri: 55 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 88,
        sadness: 78,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2012-01-07',
      country: 'YE',
      description: 'تحسن الاستقرار الأمني',
      dcftIndices: { gmi: 78, cfi: 76, hri: 68 },
      emotionalDimensions: {
        joy: 79,
        fear: 65,
        anger: 81,
        sadness: 71,
        hope: 30,
        curiosity: 32
      }
    },
    {
      date: '2012-01-09',
      country: 'KR',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 80, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 79,
        fear: 50,
        anger: 81,
        sadness: 71,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2012-01-11',
      country: 'NG',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 77, cfi: 77, hri: 65 },
      emotionalDimensions: {
        joy: 81,
        fear: 57,
        anger: 79,
        sadness: 67,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-01-13',
      country: 'QA',
      description: 'إطلاق منصة رقمية جديدة',
      dcftIndices: { gmi: 82, cfi: 64, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 42,
        anger: 90,
        sadness: 79,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2012-01-15',
      country: 'JP',
      description: 'اتفاق عسكري تاريخي',
      dcftIndices: { gmi: 71, cfi: 72, hri: 76 },
      emotionalDimensions: {
        joy: 80,
        fear: 59,
        anger: 87,
        sadness: 66,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-01-17',
      country: 'US',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 54 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 95,
        sadness: 73,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2012-01-19',
      country: 'IL',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 83, cfi: 63, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 38,
        anger: 95,
        sadness: 79,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2012-01-21',
      country: 'EG',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 78, cfi: 70, hri: 65 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 80,
        sadness: 73,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2012-01-23',
      country: 'KR',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 81, cfi: 70, hri: 57 },
      emotionalDimensions: {
        joy: 83,
        fear: 41,
        anger: 95,
        sadness: 75,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2012-01-25',
      country: 'MX',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 82, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 79,
        fear: 54,
        anger: 84,
        sadness: 73,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2012-01-27',
      country: 'US',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 74, cfi: 75, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 53,
        anger: 92,
        sadness: 71,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-01-29',
      country: 'IN',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 84, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 87,
        fear: 37,
        anger: 95,
        sadness: 78,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2012-01-31',
      country: 'PS',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 81, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 89,
        sadness: 67,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2012-02-02',
      country: 'SA',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 81, cfi: 73, hri: 63 },
      emotionalDimensions: {
        joy: 86,
        fear: 46,
        anger: 87,
        sadness: 71,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2012-02-04',
      country: 'JP',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 82, cfi: 68, hri: 52 },
      emotionalDimensions: {
        joy: 84,
        fear: 42,
        anger: 91,
        sadness: 82,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2012-02-06',
      country: 'KR',
      description: 'ارتفاع الاحتياطيات الأجنبية',
      dcftIndices: { gmi: 81, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 84,
        sadness: 75,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2012-02-08',
      country: 'JO',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 71, cfi: 80, hri: 83 },
      emotionalDimensions: {
        joy: 71,
        fear: 63,
        anger: 78,
        sadness: 67,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2012-02-10',
      country: 'EU',
      description: 'انخفاض معدل البطالة إلى 14%',
      dcftIndices: { gmi: 85, cfi: 73, hri: 60 },
      emotionalDimensions: {
        joy: 88,
        fear: 53,
        anger: 93,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-02-12',
      country: 'JO',
      description: 'تحسن الاستقرار الأمني',
      dcftIndices: { gmi: 75, cfi: 77, hri: 73 },
      emotionalDimensions: {
        joy: 73,
        fear: 57,
        anger: 82,
        sadness: 71,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2012-02-14',
      country: 'SA',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 81, cfi: 74, hri: 69 },
      emotionalDimensions: {
        joy: 82,
        fear: 61,
        anger: 87,
        sadness: 67,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2012-02-16',
      country: 'KW',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 74, cfi: 72, hri: 64 },
      emotionalDimensions: {
        joy: 79,
        fear: 55,
        anger: 86,
        sadness: 76,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2012-02-18',
      country: 'US',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 82, cfi: 65, hri: 61 },
      emotionalDimensions: {
        joy: 85,
        fear: 42,
        anger: 95,
        sadness: 74,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2012-02-20',
      country: 'LB',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 80, cfi: 66, hri: 53 },
      emotionalDimensions: {
        joy: 90,
        fear: 50,
        anger: 89,
        sadness: 80,
        hope: 31,
        curiosity: 35
      }
    },
    {
      date: '2012-02-22',
      country: 'MA',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 84, cfi: 72, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 91,
        sadness: 70,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2012-02-24',
      country: 'SA',
      description: 'توقيع اتفاق تجاري جديد',
      dcftIndices: { gmi: 78, cfi: 72, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 91,
        sadness: 69,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2012-02-26',
      country: 'QA',
      description: 'انخفاض معدل البطالة إلى 7%',
      dcftIndices: { gmi: 80, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 89,
        fear: 45,
        anger: 88,
        sadness: 76,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2012-02-28',
      country: 'KW',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 70, cfi: 80, hri: 74 },
      emotionalDimensions: {
        joy: 79,
        fear: 61,
        anger: 78,
        sadness: 72,
        hope: 31,
        curiosity: 34
      }
    },
    {
      date: '2012-03-01',
      country: 'LB',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 79, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 57,
        anger: 89,
        sadness: 69,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-03-03',
      country: 'EG',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 82, cfi: 75, hri: 56 },
      emotionalDimensions: {
        joy: 89,
        fear: 41,
        anger: 86,
        sadness: 74,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2012-03-05',
      country: 'ZA',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 84, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 95,
        sadness: 73,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2012-03-07',
      country: 'NG',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 84, cfi: 67, hri: 51 },
      emotionalDimensions: {
        joy: 85,
        fear: 40,
        anger: 92,
        sadness: 77,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2012-03-09',
      country: 'QA',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 84, cfi: 63, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 37,
        anger: 89,
        sadness: 82,
        hope: 37,
        curiosity: 41
      }
    },
    {
      date: '2012-03-11',
      country: 'AE',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 77, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 78,
        fear: 57,
        anger: 83,
        sadness: 71,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2012-03-13',
      country: 'LB',
      description: 'مهرجان ثقافي عالمي',
      dcftIndices: { gmi: 84, cfi: 61, hri: 61 },
      emotionalDimensions: {
        joy: 86,
        fear: 37,
        anger: 95,
        sadness: 81,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2012-03-15',
      country: 'PS',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 82, cfi: 69, hri: 55 },
      emotionalDimensions: {
        joy: 79,
        fear: 50,
        anger: 86,
        sadness: 74,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-03-17',
      country: 'EU',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 77, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 79,
        fear: 43,
        anger: 90,
        sadness: 77,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2012-03-19',
      country: 'TR',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 76, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 82,
        fear: 48,
        anger: 89,
        sadness: 78,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2012-03-21',
      country: 'IQ',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 83, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 49,
        anger: 87,
        sadness: 79,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2012-03-23',
      country: 'AE',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 73, cfi: 72, hri: 73 },
      emotionalDimensions: {
        joy: 75,
        fear: 57,
        anger: 82,
        sadness: 71,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2012-03-25',
      country: 'QA',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 79, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 89,
        fear: 44,
        anger: 90,
        sadness: 78,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2012-03-27',
      country: 'US',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 85, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 90,
        fear: 41,
        anger: 94,
        sadness: 76,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2012-03-29',
      country: 'MA',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 78, cfi: 74, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 86,
        sadness: 72,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2012-03-31',
      country: 'OM',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 76, cfi: 69, hri: 63 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 86,
        sadness: 69,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2012-04-02',
      country: 'IQ',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 76, cfi: 65, hri: 63 },
      emotionalDimensions: {
        joy: 84,
        fear: 44,
        anger: 89,
        sadness: 70,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2012-04-04',
      country: 'JP',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 80, cfi: 67, hri: 53 },
      emotionalDimensions: {
        joy: 91,
        fear: 38,
        anger: 91,
        sadness: 79,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2012-04-06',
      country: 'LB',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 75, cfi: 70, hri: 68 },
      emotionalDimensions: {
        joy: 82,
        fear: 61,
        anger: 81,
        sadness: 71,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2012-04-08',
      country: 'IL',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 8%',
      dcftIndices: { gmi: 78, cfi: 73, hri: 66 },
      emotionalDimensions: {
        joy: 82,
        fear: 42,
        anger: 90,
        sadness: 83,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2012-04-10',
      country: 'OM',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 83, cfi: 72, hri: 65 },
      emotionalDimensions: {
        joy: 79,
        fear: 45,
        anger: 88,
        sadness: 72,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2012-04-12',
      country: 'EG',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 74, cfi: 79, hri: 70 },
      emotionalDimensions: {
        joy: 75,
        fear: 57,
        anger: 84,
        sadness: 68,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-04-14',
      country: 'JP',
      description: 'مهرجان ثقافي عالمي',
      dcftIndices: { gmi: 89, cfi: 63, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 42,
        anger: 92,
        sadness: 83,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2012-04-16',
      country: 'LB',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 6%',
      dcftIndices: { gmi: 79, cfi: 75, hri: 66 },
      emotionalDimensions: {
        joy: 88,
        fear: 48,
        anger: 87,
        sadness: 74,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2012-04-18',
      country: 'KR',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 78, cfi: 74, hri: 56 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 84,
        sadness: 74,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2012-04-20',
      country: 'IL',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 87, cfi: 62, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 35,
        anger: 95,
        sadness: 86,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2012-04-22',
      country: 'US',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 82, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 83,
        fear: 51,
        anger: 88,
        sadness: 76,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2012-04-24',
      country: 'IQ',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 81, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 43,
        anger: 91,
        sadness: 80,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2012-04-26',
      country: 'SY',
      description: 'مشروع حماية البيئة',
      dcftIndices: { gmi: 79, cfi: 65, hri: 57 },
      emotionalDimensions: {
        joy: 80,
        fear: 47,
        anger: 86,
        sadness: 70,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2012-04-28',
      country: 'YE',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 79, cfi: 72, hri: 58 },
      emotionalDimensions: {
        joy: 87,
        fear: 38,
        anger: 87,
        sadness: 78,
        hope: 38,
        curiosity: 42
      }
    },
    {
      date: '2012-04-30',
      country: 'BH',
      description: 'اتفاق عسكري تاريخي',
      dcftIndices: { gmi: 71, cfi: 79, hri: 72 },
      emotionalDimensions: {
        joy: 78,
        fear: 63,
        anger: 78,
        sadness: 68,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2012-05-02',
      country: 'SY',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 87, cfi: 62, hri: 59 },
      emotionalDimensions: {
        joy: 91,
        fear: 42,
        anger: 93,
        sadness: 79,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2012-05-04',
      country: 'BH',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 81, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 92,
        sadness: 78,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2012-05-06',
      country: 'CN',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 80, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 46,
        anger: 95,
        sadness: 80,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-05-08',
      country: 'MA',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 80, cfi: 71, hri: 66 },
      emotionalDimensions: {
        joy: 89,
        fear: 39,
        anger: 89,
        sadness: 76,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2012-05-10',
      country: 'BH',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 79, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 80,
        fear: 47,
        anger: 95,
        sadness: 79,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-05-12',
      country: 'IN',
      description: 'إطلاق منصة رقمية جديدة',
      dcftIndices: { gmi: 81, cfi: 65, hri: 53 },
      emotionalDimensions: {
        joy: 89,
        fear: 38,
        anger: 95,
        sadness: 80,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2012-05-14',
      country: 'KR',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 83, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 47,
        anger: 85,
        sadness: 73,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2012-05-16',
      country: 'ZA',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 76, cfi: 74, hri: 68 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 90,
        sadness: 71,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2012-05-18',
      country: 'BH',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 86,
        fear: 38,
        anger: 91,
        sadness: 75,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2012-05-20',
      country: 'IN',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 77, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 89,
        fear: 45,
        anger: 85,
        sadness: 77,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2012-05-22',
      country: 'PS',
      description: 'برنامج الرعاية الصحية الشاملة',
      dcftIndices: { gmi: 86, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 90,
        sadness: 71,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2012-05-24',
      country: 'IN',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 79, cfi: 71, hri: 53 },
      emotionalDimensions: {
        joy: 88,
        fear: 38,
        anger: 85,
        sadness: 75,
        hope: 39,
        curiosity: 44
      }
    },
    {
      date: '2012-05-26',
      country: 'BR',
      description: 'مشروع حماية البيئة',
      dcftIndices: { gmi: 83, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 95,
        sadness: 76,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-05-28',
      country: 'KW',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 77, cfi: 74, hri: 60 },
      emotionalDimensions: {
        joy: 79,
        fear: 50,
        anger: 92,
        sadness: 75,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-05-30',
      country: 'BR',
      description: 'معرض فني دولي',
      dcftIndices: { gmi: 80, cfi: 65, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 92,
        sadness: 74,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2012-06-01',
      country: 'MX',
      description: 'انخفاض معدل البطالة إلى 3%',
      dcftIndices: { gmi: 81, cfi: 70, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 50,
        anger: 93,
        sadness: 76,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-06-03',
      country: 'TR',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 86, cfi: 63, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 94,
        sadness: 70,
        hope: 30,
        curiosity: 42
      }
    },
    {
      date: '2012-06-05',
      country: 'AE',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 86, cfi: 65, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 42,
        anger: 87,
        sadness: 79,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2012-06-07',
      country: 'IR',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 78, cfi: 68, hri: 57 },
      emotionalDimensions: {
        joy: 88,
        fear: 49,
        anger: 87,
        sadness: 72,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2012-06-09',
      country: 'KR',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 81, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 81,
        fear: 53,
        anger: 83,
        sadness: 70,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2012-06-11',
      country: 'RU',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 81, cfi: 73, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 90,
        sadness: 72,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2012-06-13',
      country: 'JO',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 75, cfi: 75, hri: 64 },
      emotionalDimensions: {
        joy: 79,
        fear: 51,
        anger: 87,
        sadness: 73,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2012-06-15',
      country: 'AE',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 73, cfi: 77, hri: 65 },
      emotionalDimensions: {
        joy: 76,
        fear: 50,
        anger: 89,
        sadness: 73,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2012-06-17',
      country: 'IQ',
      description: 'إطلاق منصة رقمية جديدة',
      dcftIndices: { gmi: 79, cfi: 64, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 42,
        anger: 94,
        sadness: 75,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2012-06-19',
      country: 'IR',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 80, cfi: 68, hri: 53 },
      emotionalDimensions: {
        joy: 82,
        fear: 43,
        anger: 92,
        sadness: 74,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2012-06-21',
      country: 'KR',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 73, cfi: 71, hri: 66 },
      emotionalDimensions: {
        joy: 82,
        fear: 52,
        anger: 90,
        sadness: 73,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-06-23',
      country: 'KW',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 80, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 40,
        anger: 93,
        sadness: 77,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2012-06-25',
      country: 'JO',
      description: 'افتتاح متحف جديد',
      dcftIndices: { gmi: 87, cfi: 69, hri: 54 },
      emotionalDimensions: {
        joy: 82,
        fear: 46,
        anger: 95,
        sadness: 72,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2012-06-27',
      country: 'AE',
      description: 'اتفاق أمني إقليمي',
      dcftIndices: { gmi: 80, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 75,
        fear: 53,
        anger: 81,
        sadness: 71,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2012-06-29',
      country: 'EU',
      description: 'إطلاق منصة رقمية جديدة',
      dcftIndices: { gmi: 79, cfi: 70, hri: 55 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 95,
        sadness: 83,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-07-01',
      country: 'AE',
      description: 'انخفاض معدل البطالة إلى 10%',
      dcftIndices: { gmi: 78, cfi: 69, hri: 55 },
      emotionalDimensions: {
        joy: 88,
        fear: 48,
        anger: 89,
        sadness: 78,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2012-07-03',
      country: 'PS',
      description: 'افتتاح منطقة اقتصادية حرة',
      dcftIndices: { gmi: 86, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 90,
        sadness: 72,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2012-07-05',
      country: 'IN',
      description: 'افتتاح متحف جديد',
      dcftIndices: { gmi: 86, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 40,
        anger: 89,
        sadness: 81,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2012-07-07',
      country: 'IR',
      description: 'انخفاض معدل البطالة إلى 6%',
      dcftIndices: { gmi: 84, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 86,
        fear: 51,
        anger: 94,
        sadness: 73,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-07-09',
      country: 'CN',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 85, cfi: 64, hri: 53 },
      emotionalDimensions: {
        joy: 92,
        fear: 36,
        anger: 95,
        sadness: 82,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2012-07-11',
      country: 'EU',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 84, cfi: 62, hri: 55 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 94,
        sadness: 74,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2012-07-13',
      country: 'MX',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 91, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 87,
        fear: 32,
        anger: 95,
        sadness: 85,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2012-07-15',
      country: 'IR',
      description: 'معرض فني دولي',
      dcftIndices: { gmi: 78, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 88,
        sadness: 75,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2012-07-17',
      country: 'RU',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 85, cfi: 64, hri: 59 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 93,
        sadness: 75,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-07-19',
      country: 'IQ',
      description: 'إطلاق مدينة ذكية',
      dcftIndices: { gmi: 81, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 91,
        fear: 41,
        anger: 95,
        sadness: 82,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2012-07-21',
      country: 'US',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 74, cfi: 76, hri: 64 },
      emotionalDimensions: {
        joy: 75,
        fear: 51,
        anger: 83,
        sadness: 69,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2012-07-23',
      country: 'KR',
      description: 'تشكيل حكومة جديدة',
      dcftIndices: { gmi: 75, cfi: 76, hri: 65 },
      emotionalDimensions: {
        joy: 74,
        fear: 50,
        anger: 87,
        sadness: 75,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-07-25',
      country: 'TR',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 81, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 83,
        fear: 49,
        anger: 89,
        sadness: 72,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2012-07-27',
      country: 'TR',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 79, cfi: 67, hri: 57 },
      emotionalDimensions: {
        joy: 87,
        fear: 50,
        anger: 90,
        sadness: 73,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2012-07-29',
      country: 'BH',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 81, cfi: 74, hri: 65 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 91,
        sadness: 73,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2012-07-31',
      country: 'TR',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 82, cfi: 63, hri: 53 },
      emotionalDimensions: {
        joy: 88,
        fear: 40,
        anger: 95,
        sadness: 82,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2012-08-02',
      country: 'MA',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 85, cfi: 76, hri: 68 },
      emotionalDimensions: {
        joy: 89,
        fear: 41,
        anger: 93,
        sadness: 81,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2012-08-04',
      country: 'SY',
      description: 'تحسن مؤشرات التنمية البشرية',
      dcftIndices: { gmi: 84, cfi: 66, hri: 54 },
      emotionalDimensions: {
        joy: 81,
        fear: 40,
        anger: 94,
        sadness: 80,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2012-08-06',
      country: 'IL',
      description: 'توقيع معاهدة دولية',
      dcftIndices: { gmi: 77, cfi: 70, hri: 64 },
      emotionalDimensions: {
        joy: 84,
        fear: 53,
        anger: 87,
        sadness: 78,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2012-08-08',
      country: 'SY',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 84, cfi: 65, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 95,
        sadness: 83,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2012-08-10',
      country: 'IN',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 72, cfi: 73, hri: 74 },
      emotionalDimensions: {
        joy: 74,
        fear: 60,
        anger: 84,
        sadness: 72,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2012-08-12',
      country: 'KW',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 86, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 85,
        sadness: 73,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2012-08-14',
      country: 'JP',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 85, cfi: 70, hri: 57 },
      emotionalDimensions: {
        joy: 87,
        fear: 48,
        anger: 87,
        sadness: 74,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2012-08-16',
      country: 'IR',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 82, cfi: 69, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 53,
        anger: 89,
        sadness: 78,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2012-08-18',
      country: 'SY',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 77, cfi: 76, hri: 66 },
      emotionalDimensions: {
        joy: 82,
        fear: 55,
        anger: 89,
        sadness: 69,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-08-20',
      country: 'SA',
      description: 'تشكيل حكومة جديدة',
      dcftIndices: { gmi: 74, cfi: 70, hri: 72 },
      emotionalDimensions: {
        joy: 82,
        fear: 52,
        anger: 91,
        sadness: 72,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-08-22',
      country: 'EU',
      description: 'تحسن مؤشرات الأمان الغذائي',
      dcftIndices: { gmi: 84, cfi: 71, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 46,
        anger: 87,
        sadness: 75,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2012-08-24',
      country: 'TR',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 85, cfi: 64, hri: 63 },
      emotionalDimensions: {
        joy: 86,
        fear: 50,
        anger: 86,
        sadness: 72,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2012-08-26',
      country: 'IR',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 78, cfi: 77, hri: 69 },
      emotionalDimensions: {
        joy: 84,
        fear: 58,
        anger: 85,
        sadness: 66,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-08-28',
      country: 'US',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 76, cfi: 66, hri: 66 },
      emotionalDimensions: {
        joy: 83,
        fear: 52,
        anger: 87,
        sadness: 74,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2012-08-30',
      country: 'IQ',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 80, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 86,
        fear: 42,
        anger: 89,
        sadness: 75,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2012-09-01',
      country: 'EU',
      description: 'تحسن الاستقرار الأمني',
      dcftIndices: { gmi: 77, cfi: 76, hri: 67 },
      emotionalDimensions: {
        joy: 73,
        fear: 55,
        anger: 79,
        sadness: 66,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2012-09-03',
      country: 'SY',
      description: 'افتتاح متحف جديد',
      dcftIndices: { gmi: 81, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 41,
        anger: 93,
        sadness: 78,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2012-09-05',
      country: 'BH',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 76, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 82,
        fear: 53,
        anger: 89,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-09-07',
      country: 'KR',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 76, cfi: 78, hri: 76 },
      emotionalDimensions: {
        joy: 77,
        fear: 66,
        anger: 81,
        sadness: 62,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2012-09-09',
      country: 'BR',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 85, cfi: 65, hri: 56 },
      emotionalDimensions: {
        joy: 92,
        fear: 43,
        anger: 95,
        sadness: 75,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2012-09-11',
      country: 'KR',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 80, cfi: 65, hri: 58 },
      emotionalDimensions: {
        joy: 80,
        fear: 45,
        anger: 95,
        sadness: 81,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-09-13',
      country: 'BH',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 84, cfi: 75, hri: 62 },
      emotionalDimensions: {
        joy: 90,
        fear: 41,
        anger: 88,
        sadness: 74,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2012-09-15',
      country: 'CN',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 82, cfi: 71, hri: 64 },
      emotionalDimensions: {
        joy: 80,
        fear: 54,
        anger: 87,
        sadness: 71,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-09-17',
      country: 'QA',
      description: 'تحسن الصادرات بنسبة 14%',
      dcftIndices: { gmi: 81, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 91,
        sadness: 74,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2012-09-19',
      country: 'SY',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 76, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 54,
        anger: 89,
        sadness: 74,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2012-09-21',
      country: 'MX',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 87, cfi: 75, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 41,
        anger: 91,
        sadness: 72,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2012-09-23',
      country: 'RU',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 77, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 45,
        anger: 95,
        sadness: 75,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2012-09-25',
      country: 'IN',
      description: 'اتفاق أمني إقليمي',
      dcftIndices: { gmi: 72, cfi: 74, hri: 67 },
      emotionalDimensions: {
        joy: 74,
        fear: 61,
        anger: 89,
        sadness: 66,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-09-27',
      country: 'JP',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 76, cfi: 76, hri: 70 },
      emotionalDimensions: {
        joy: 72,
        fear: 58,
        anger: 85,
        sadness: 67,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-09-29',
      country: 'MX',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 74, cfi: 77, hri: 71 },
      emotionalDimensions: {
        joy: 76,
        fear: 60,
        anger: 85,
        sadness: 70,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2012-10-01',
      country: 'MX',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 84, cfi: 61, hri: 50 },
      emotionalDimensions: {
        joy: 85,
        fear: 36,
        anger: 95,
        sadness: 75,
        hope: 35,
        curiosity: 45
      }
    },
    {
      date: '2012-10-03',
      country: 'PS',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 80, cfi: 79, hri: 65 },
      emotionalDimensions: {
        joy: 75,
        fear: 63,
        anger: 86,
        sadness: 66,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2012-10-05',
      country: 'CN',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 88, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 38,
        anger: 95,
        sadness: 74,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2012-10-07',
      country: 'OM',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 71, cfi: 80, hri: 73 },
      emotionalDimensions: {
        joy: 77,
        fear: 58,
        anger: 84,
        sadness: 66,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-10-09',
      country: 'KR',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 87, cfi: 69, hri: 54 },
      emotionalDimensions: {
        joy: 89,
        fear: 44,
        anger: 95,
        sadness: 78,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2012-10-11',
      country: 'IQ',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 78, cfi: 79, hri: 78 },
      emotionalDimensions: {
        joy: 75,
        fear: 61,
        anger: 76,
        sadness: 62,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2012-10-13',
      country: 'JO',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 80, cfi: 66, hri: 59 },
      emotionalDimensions: {
        joy: 91,
        fear: 36,
        anger: 94,
        sadness: 78,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2012-10-15',
      country: 'JP',
      description: 'افتتاح متحف جديد',
      dcftIndices: { gmi: 84, cfi: 66, hri: 54 },
      emotionalDimensions: {
        joy: 89,
        fear: 42,
        anger: 88,
        sadness: 75,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2012-10-17',
      country: 'EG',
      description: 'إطلاق منصة رقمية جديدة',
      dcftIndices: { gmi: 85, cfi: 65, hri: 53 },
      emotionalDimensions: {
        joy: 82,
        fear: 41,
        anger: 95,
        sadness: 83,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-10-19',
      country: 'SY',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 82, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 79,
        fear: 53,
        anger: 93,
        sadness: 73,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-10-21',
      country: 'MA',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 75, cfi: 64, hri: 64 },
      emotionalDimensions: {
        joy: 84,
        fear: 51,
        anger: 87,
        sadness: 78,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2012-10-23',
      country: 'KR',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 82, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 88,
        fear: 41,
        anger: 91,
        sadness: 77,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2012-10-25',
      country: 'LB',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 85, cfi: 64, hri: 64 },
      emotionalDimensions: {
        joy: 80,
        fear: 44,
        anger: 87,
        sadness: 72,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2012-10-27',
      country: 'US',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 80, cfi: 63, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 46,
        anger: 91,
        sadness: 79,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-10-29',
      country: 'NG',
      description: 'برنامج الرعاية الصحية الشاملة',
      dcftIndices: { gmi: 87, cfi: 69, hri: 54 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 92,
        sadness: 78,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2012-10-31',
      country: 'OM',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 70, cfi: 75, hri: 78 },
      emotionalDimensions: {
        joy: 74,
        fear: 55,
        anger: 81,
        sadness: 70,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-11-02',
      country: 'EG',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 88, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 95,
        sadness: 75,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2012-11-04',
      country: 'TR',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 70, cfi: 79, hri: 77 },
      emotionalDimensions: {
        joy: 76,
        fear: 66,
        anger: 79,
        sadness: 66,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2012-11-06',
      country: 'KW',
      description: 'توقيع معاهدة دولية',
      dcftIndices: { gmi: 84, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 83,
        fear: 49,
        anger: 93,
        sadness: 68,
        hope: 30,
        curiosity: 42
      }
    },
    {
      date: '2012-11-08',
      country: 'ZA',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 81, cfi: 75, hri: 61 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 90,
        sadness: 73,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2012-11-10',
      country: 'NG',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 81, cfi: 71, hri: 52 },
      emotionalDimensions: {
        joy: 82,
        fear: 40,
        anger: 93,
        sadness: 76,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2012-11-12',
      country: 'MA',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 79, cfi: 74, hri: 56 },
      emotionalDimensions: {
        joy: 79,
        fear: 48,
        anger: 87,
        sadness: 74,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2012-11-14',
      country: 'SA',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 84, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 87,
        fear: 47,
        anger: 95,
        sadness: 78,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-11-16',
      country: 'BH',
      description: 'انخفاض معدل البطالة إلى 2%',
      dcftIndices: { gmi: 82, cfi: 67, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 52,
        anger: 93,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-11-18',
      country: 'NG',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 86, cfi: 64, hri: 51 },
      emotionalDimensions: {
        joy: 92,
        fear: 35,
        anger: 93,
        sadness: 77,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2012-11-20',
      country: 'NG',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 86, cfi: 68, hri: 60 },
      emotionalDimensions: {
        joy: 88,
        fear: 44,
        anger: 93,
        sadness: 81,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-11-22',
      country: 'IN',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 88, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 87,
        fear: 46,
        anger: 92,
        sadness: 82,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2012-11-24',
      country: 'NG',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 76, cfi: 74, hri: 62 },
      emotionalDimensions: {
        joy: 83,
        fear: 57,
        anger: 86,
        sadness: 76,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2012-11-26',
      country: 'CN',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 71, cfi: 77, hri: 70 },
      emotionalDimensions: {
        joy: 75,
        fear: 55,
        anger: 88,
        sadness: 64,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2012-11-28',
      country: 'IL',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 84, cfi: 67, hri: 63 },
      emotionalDimensions: {
        joy: 88,
        fear: 46,
        anger: 86,
        sadness: 77,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2012-11-30',
      country: 'QA',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 87, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 46,
        anger: 90,
        sadness: 82,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2012-12-02',
      country: 'MA',
      description: 'تحسن الصادرات بنسبة 5%',
      dcftIndices: { gmi: 80, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 85,
        fear: 42,
        anger: 85,
        sadness: 73,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2012-12-04',
      country: 'TR',
      description: 'مهرجان ثقافي عالمي',
      dcftIndices: { gmi: 82, cfi: 69, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 46,
        anger: 89,
        sadness: 75,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2012-12-06',
      country: 'KW',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 81, cfi: 66, hri: 62 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 95,
        sadness: 78,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2012-12-08',
      country: 'YE',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 82, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 86,
        fear: 46,
        anger: 86,
        sadness: 72,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2012-12-10',
      country: 'RU',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 86, cfi: 72, hri: 60 },
      emotionalDimensions: {
        joy: 89,
        fear: 47,
        anger: 86,
        sadness: 80,
        hope: 34,
        curiosity: 37
      }
    },
    {
      date: '2012-12-12',
      country: 'IN',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 78, cfi: 77, hri: 68 },
      emotionalDimensions: {
        joy: 76,
        fear: 56,
        anger: 87,
        sadness: 77,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2012-12-14',
      country: 'IQ',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 77, cfi: 73, hri: 54 },
      emotionalDimensions: {
        joy: 83,
        fear: 42,
        anger: 95,
        sadness: 72,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2012-12-16',
      country: 'IN',
      description: 'اتفاق عسكري تاريخي',
      dcftIndices: { gmi: 80, cfi: 76, hri: 74 },
      emotionalDimensions: {
        joy: 80,
        fear: 53,
        anger: 86,
        sadness: 72,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2012-12-18',
      country: 'JP',
      description: 'تحسن الصادرات بنسبة 15%',
      dcftIndices: { gmi: 76, cfi: 71, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 44,
        anger: 93,
        sadness: 75,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2012-12-20',
      country: 'KR',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 78, cfi: 78, hri: 71 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 88,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2012-12-22',
      country: 'CN',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 79, cfi: 70, hri: 55 },
      emotionalDimensions: {
        joy: 86,
        fear: 40,
        anger: 91,
        sadness: 74,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2012-12-24',
      country: 'CN',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 82, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 48,
        anger: 86,
        sadness: 74,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2012-12-26',
      country: 'US',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 87, cfi: 70, hri: 56 },
      emotionalDimensions: {
        joy: 92,
        fear: 40,
        anger: 88,
        sadness: 79,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2012-12-28',
      country: 'JO',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 78, cfi: 62, hri: 58 },
      emotionalDimensions: {
        joy: 89,
        fear: 44,
        anger: 90,
        sadness: 81,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2012-12-30',
      country: 'MA',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 76, cfi: 76, hri: 60 },
      emotionalDimensions: {
        joy: 77,
        fear: 48,
        anger: 83,
        sadness: 71,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2013-01-01',
      country: 'BH',
      description: 'انخفاض معدل البطالة إلى 15%',
      dcftIndices: { gmi: 84, cfi: 75, hri: 63 },
      emotionalDimensions: {
        joy: 81,
        fear: 47,
        anger: 93,
        sadness: 72,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2013-01-03',
      country: 'IN',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 74, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 47,
        anger: 87,
        sadness: 75,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2013-01-05',
      country: 'IR',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 73, cfi: 68, hri: 68 },
      emotionalDimensions: {
        joy: 74,
        fear: 52,
        anger: 85,
        sadness: 73,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2013-01-07',
      country: 'IN',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 82, cfi: 65, hri: 53 },
      emotionalDimensions: {
        joy: 85,
        fear: 46,
        anger: 94,
        sadness: 77,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2013-01-09',
      country: 'US',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 83, cfi: 67, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 41,
        anger: 95,
        sadness: 80,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2013-01-11',
      country: 'BH',
      description: 'بطولة رياضية عالمية',
      dcftIndices: { gmi: 85, cfi: 65, hri: 57 },
      emotionalDimensions: {
        joy: 91,
        fear: 41,
        anger: 95,
        sadness: 75,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2013-01-13',
      country: 'JO',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 83, cfi: 63, hri: 57 },
      emotionalDimensions: {
        joy: 80,
        fear: 47,
        anger: 93,
        sadness: 77,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-01-15',
      country: 'ZA',
      description: 'قمة إقليمية مهمة',
      dcftIndices: { gmi: 78, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 83,
        fear: 48,
        anger: 88,
        sadness: 72,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2013-01-17',
      country: 'ZA',
      description: 'توقيع معاهدة دولية',
      dcftIndices: { gmi: 83, cfi: 71, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 86,
        sadness: 72,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2013-01-19',
      country: 'CN',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 78, cfi: 76, hri: 63 },
      emotionalDimensions: {
        joy: 84,
        fear: 53,
        anger: 89,
        sadness: 72,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-01-21',
      country: 'SA',
      description: 'تحسن الخدمات الصحية',
      dcftIndices: { gmi: 79, cfi: 68, hri: 54 },
      emotionalDimensions: {
        joy: 83,
        fear: 42,
        anger: 95,
        sadness: 76,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2013-01-23',
      country: 'RU',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 84, cfi: 63, hri: 53 },
      emotionalDimensions: {
        joy: 83,
        fear: 45,
        anger: 95,
        sadness: 77,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2013-01-25',
      country: 'EG',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 12%',
      dcftIndices: { gmi: 85, cfi: 68, hri: 64 },
      emotionalDimensions: {
        joy: 82,
        fear: 50,
        anger: 91,
        sadness: 81,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2013-01-27',
      country: 'ZA',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 78, cfi: 61, hri: 56 },
      emotionalDimensions: {
        joy: 84,
        fear: 35,
        anger: 88,
        sadness: 77,
        hope: 39,
        curiosity: 44
      }
    },
    {
      date: '2013-01-29',
      country: 'JO',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 84, cfi: 67, hri: 63 },
      emotionalDimensions: {
        joy: 88,
        fear: 50,
        anger: 90,
        sadness: 73,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2013-01-31',
      country: 'MA',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 82, cfi: 64, hri: 54 },
      emotionalDimensions: {
        joy: 91,
        fear: 43,
        anger: 92,
        sadness: 79,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2013-02-02',
      country: 'KW',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 83, cfi: 65, hri: 63 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 86,
        sadness: 78,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2013-02-04',
      country: 'MX',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 80, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 52,
        anger: 90,
        sadness: 72,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-02-06',
      country: 'OM',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 84, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 40,
        anger: 95,
        sadness: 77,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2013-02-08',
      country: 'RU',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 79, cfi: 73, hri: 57 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 88,
        sadness: 80,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2013-02-10',
      country: 'CN',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 86, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 47,
        anger: 91,
        sadness: 71,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2013-02-12',
      country: 'TR',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 78, cfi: 69, hri: 53 },
      emotionalDimensions: {
        joy: 82,
        fear: 40,
        anger: 89,
        sadness: 76,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2013-02-14',
      country: 'IL',
      description: 'إطلاق مدينة ذكية',
      dcftIndices: { gmi: 89, cfi: 71, hri: 61 },
      emotionalDimensions: {
        joy: 87,
        fear: 44,
        anger: 92,
        sadness: 81,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2013-02-16',
      country: 'JP',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 76, cfi: 74, hri: 62 },
      emotionalDimensions: {
        joy: 88,
        fear: 45,
        anger: 85,
        sadness: 79,
        hope: 35,
        curiosity: 38
      }
    },
    {
      date: '2013-02-18',
      country: 'TR',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 80, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 95,
        sadness: 81,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2013-02-20',
      country: 'IL',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 72, cfi: 72, hri: 73 },
      emotionalDimensions: {
        joy: 81,
        fear: 55,
        anger: 89,
        sadness: 73,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2013-02-22',
      country: 'SY',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 79, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 41,
        anger: 87,
        sadness: 74,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2013-02-24',
      country: 'US',
      description: 'بطولة رياضية عالمية',
      dcftIndices: { gmi: 88, cfi: 64, hri: 52 },
      emotionalDimensions: {
        joy: 83,
        fear: 35,
        anger: 94,
        sadness: 79,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2013-02-26',
      country: 'JO',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 83, cfi: 72, hri: 54 },
      emotionalDimensions: {
        joy: 86,
        fear: 51,
        anger: 87,
        sadness: 77,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2013-02-28',
      country: 'PS',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 83, cfi: 67, hri: 66 },
      emotionalDimensions: {
        joy: 77,
        fear: 56,
        anger: 90,
        sadness: 69,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-03-02',
      country: 'BH',
      description: 'توقيع اتفاق تجاري جديد',
      dcftIndices: { gmi: 80, cfi: 71, hri: 58 },
      emotionalDimensions: {
        joy: 81,
        fear: 48,
        anger: 87,
        sadness: 77,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2013-03-04',
      country: 'JO',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 84, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 94,
        sadness: 82,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2013-03-06',
      country: 'US',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 81, cfi: 70, hri: 64 },
      emotionalDimensions: {
        joy: 82,
        fear: 49,
        anger: 95,
        sadness: 74,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2013-03-08',
      country: 'KW',
      description: 'توقيع اتفاق تجاري جديد',
      dcftIndices: { gmi: 79, cfi: 73, hri: 66 },
      emotionalDimensions: {
        joy: 77,
        fear: 47,
        anger: 93,
        sadness: 74,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2013-03-10',
      country: 'US',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 81, cfi: 76, hri: 66 },
      emotionalDimensions: {
        joy: 79,
        fear: 56,
        anger: 88,
        sadness: 77,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2013-03-12',
      country: 'AE',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 4%',
      dcftIndices: { gmi: 75, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 90,
        fear: 44,
        anger: 85,
        sadness: 81,
        hope: 36,
        curiosity: 38
      }
    },
    {
      date: '2013-03-14',
      country: 'KR',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 72, cfi: 73, hri: 71 },
      emotionalDimensions: {
        joy: 75,
        fear: 56,
        anger: 86,
        sadness: 66,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2013-03-16',
      country: 'ZA',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 84, cfi: 63, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 45,
        anger: 91,
        sadness: 80,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2013-03-18',
      country: 'BR',
      description: 'تحسن مؤشرات الأمان الغذائي',
      dcftIndices: { gmi: 79, cfi: 65, hri: 64 },
      emotionalDimensions: {
        joy: 86,
        fear: 52,
        anger: 91,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2013-03-20',
      country: 'BR',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 84, cfi: 70, hri: 53 },
      emotionalDimensions: {
        joy: 90,
        fear: 47,
        anger: 87,
        sadness: 79,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2013-03-22',
      country: 'SA',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 83, cfi: 65, hri: 50 },
      emotionalDimensions: {
        joy: 94,
        fear: 40,
        anger: 90,
        sadness: 83,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2013-03-24',
      country: 'EG',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 79, cfi: 71, hri: 53 },
      emotionalDimensions: {
        joy: 87,
        fear: 37,
        anger: 89,
        sadness: 75,
        hope: 37,
        curiosity: 44
      }
    },
    {
      date: '2013-03-26',
      country: 'QA',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 74, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 77,
        fear: 59,
        anger: 83,
        sadness: 64,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2013-03-28',
      country: 'BR',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 76, cfi: 74, hri: 70 },
      emotionalDimensions: {
        joy: 77,
        fear: 51,
        anger: 88,
        sadness: 77,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2013-03-30',
      country: 'YE',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 79, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 80,
        fear: 45,
        anger: 87,
        sadness: 76,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2013-04-01',
      country: 'RU',
      description: 'بطولة رياضية عالمية',
      dcftIndices: { gmi: 81, cfi: 67, hri: 57 },
      emotionalDimensions: {
        joy: 86,
        fear: 39,
        anger: 91,
        sadness: 77,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2013-04-03',
      country: 'BH',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 83, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 88,
        sadness: 71,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2013-04-05',
      country: 'IQ',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 77, cfi: 70, hri: 69 },
      emotionalDimensions: {
        joy: 84,
        fear: 55,
        anger: 86,
        sadness: 69,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-04-07',
      country: 'US',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 85, cfi: 73, hri: 58 },
      emotionalDimensions: {
        joy: 79,
        fear: 47,
        anger: 86,
        sadness: 73,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2013-04-09',
      country: 'QA',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 82, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 92,
        fear: 34,
        anger: 90,
        sadness: 75,
        hope: 38,
        curiosity: 46
      }
    },
    {
      date: '2013-04-11',
      country: 'JP',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 83, cfi: 68, hri: 53 },
      emotionalDimensions: {
        joy: 82,
        fear: 41,
        anger: 95,
        sadness: 73,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2013-04-13',
      country: 'EU',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 78, cfi: 74, hri: 72 },
      emotionalDimensions: {
        joy: 84,
        fear: 52,
        anger: 82,
        sadness: 65,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2013-04-15',
      country: 'KW',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 81, cfi: 67, hri: 55 },
      emotionalDimensions: {
        joy: 81,
        fear: 47,
        anger: 93,
        sadness: 72,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2013-04-17',
      country: 'KR',
      description: 'استثمار في البحث العلمي',
      dcftIndices: { gmi: 84, cfi: 66, hri: 64 },
      emotionalDimensions: {
        joy: 88,
        fear: 45,
        anger: 88,
        sadness: 78,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2013-04-19',
      country: 'IR',
      description: 'افتتاح مركز تكنولوجي',
      dcftIndices: { gmi: 84, cfi: 73, hri: 58 },
      emotionalDimensions: {
        joy: 81,
        fear: 47,
        anger: 89,
        sadness: 77,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2013-04-21',
      country: 'MX',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 85, cfi: 65, hri: 57 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 95,
        sadness: 74,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2013-04-23',
      country: 'ZA',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 82, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 89,
        fear: 46,
        anger: 90,
        sadness: 72,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2013-04-25',
      country: 'MX',
      description: 'إنجاز أولمبي',
      dcftIndices: { gmi: 88, cfi: 67, hri: 54 },
      emotionalDimensions: {
        joy: 84,
        fear: 32,
        anger: 93,
        sadness: 80,
        hope: 38,
        curiosity: 44
      }
    },
    {
      date: '2013-04-27',
      country: 'US',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 72, cfi: 77, hri: 71 },
      emotionalDimensions: {
        joy: 77,
        fear: 56,
        anger: 88,
        sadness: 72,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2013-04-29',
      country: 'EG',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 80, cfi: 70, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 44,
        anger: 90,
        sadness: 77,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2013-05-01',
      country: 'BR',
      description: 'تحسن الصادرات بنسبة 4%',
      dcftIndices: { gmi: 76, cfi: 71, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 84,
        sadness: 74,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2013-05-03',
      country: 'OM',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 86, cfi: 69, hri: 58 },
      emotionalDimensions: {
        joy: 93,
        fear: 40,
        anger: 95,
        sadness: 76,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2013-05-05',
      country: 'AE',
      description: 'ارتفاع الاحتياطيات الأجنبية',
      dcftIndices: { gmi: 85, cfi: 76, hri: 64 },
      emotionalDimensions: {
        joy: 87,
        fear: 50,
        anger: 88,
        sadness: 78,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2013-05-07',
      country: 'LB',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 79, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 90,
        fear: 42,
        anger: 94,
        sadness: 71,
        hope: 32,
        curiosity: 44
      }
    },
    {
      date: '2013-05-09',
      country: 'KW',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 76, cfi: 71, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 49,
        anger: 94,
        sadness: 78,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2013-05-11',
      country: 'IN',
      description: 'ارتفاع الاحتياطيات الأجنبية',
      dcftIndices: { gmi: 85, cfi: 75, hri: 63 },
      emotionalDimensions: {
        joy: 85,
        fear: 44,
        anger: 91,
        sadness: 79,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2013-05-13',
      country: 'IN',
      description: 'انخفاض معدل البطالة إلى 3%',
      dcftIndices: { gmi: 84, cfi: 74, hri: 56 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 88,
        sadness: 74,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2013-05-15',
      country: 'EG',
      description: 'تحسن الصادرات بنسبة 9%',
      dcftIndices: { gmi: 84, cfi: 65, hri: 67 },
      emotionalDimensions: {
        joy: 89,
        fear: 42,
        anger: 88,
        sadness: 78,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2013-05-17',
      country: 'MX',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 78, cfi: 66, hri: 66 },
      emotionalDimensions: {
        joy: 83,
        fear: 51,
        anger: 88,
        sadness: 72,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2013-05-19',
      country: 'QA',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 81, cfi: 64, hri: 54 },
      emotionalDimensions: {
        joy: 83,
        fear: 43,
        anger: 86,
        sadness: 73,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2013-05-21',
      country: 'BH',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 81, cfi: 74, hri: 65 },
      emotionalDimensions: {
        joy: 77,
        fear: 59,
        anger: 84,
        sadness: 68,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2013-05-23',
      country: 'CN',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 78, cfi: 66, hri: 63 },
      emotionalDimensions: {
        joy: 82,
        fear: 41,
        anger: 93,
        sadness: 73,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2013-05-25',
      country: 'TR',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 80, cfi: 61, hri: 57 },
      emotionalDimensions: {
        joy: 87,
        fear: 36,
        anger: 95,
        sadness: 82,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2013-05-27',
      country: 'US',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 84, cfi: 73, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 83,
        sadness: 68,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2013-05-29',
      country: 'PS',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 82, cfi: 72, hri: 61 },
      emotionalDimensions: {
        joy: 88,
        fear: 40,
        anger: 87,
        sadness: 81,
        hope: 37,
        curiosity: 40
      }
    },
    {
      date: '2013-05-31',
      country: 'RU',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 75, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 80,
        fear: 45,
        anger: 91,
        sadness: 73,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2013-06-02',
      country: 'IQ',
      description: 'اتفاق عسكري تاريخي',
      dcftIndices: { gmi: 71, cfi: 74, hri: 76 },
      emotionalDimensions: {
        joy: 79,
        fear: 63,
        anger: 82,
        sadness: 68,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2013-06-04',
      country: 'BH',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 77, cfi: 68, hri: 73 },
      emotionalDimensions: {
        joy: 75,
        fear: 56,
        anger: 90,
        sadness: 68,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-06-06',
      country: 'NG',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 87, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 93,
        fear: 36,
        anger: 90,
        sadness: 80,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2013-06-08',
      country: 'KW',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 81, cfi: 67, hri: 55 },
      emotionalDimensions: {
        joy: 80,
        fear: 49,
        anger: 86,
        sadness: 73,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2013-06-10',
      country: 'MA',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 88, cfi: 71, hri: 53 },
      emotionalDimensions: {
        joy: 89,
        fear: 45,
        anger: 91,
        sadness: 73,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2013-06-12',
      country: 'EU',
      description: 'تحسن الصادرات بنسبة 7%',
      dcftIndices: { gmi: 78, cfi: 67, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 49,
        anger: 84,
        sadness: 73,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2013-06-14',
      country: 'IL',
      description: 'تحسن الصادرات بنسبة 12%',
      dcftIndices: { gmi: 84, cfi: 66, hri: 65 },
      emotionalDimensions: {
        joy: 87,
        fear: 50,
        anger: 94,
        sadness: 75,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-06-16',
      country: 'ZA',
      description: 'برنامج الرعاية الصحية الشاملة',
      dcftIndices: { gmi: 84, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 89,
        fear: 40,
        anger: 95,
        sadness: 75,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2013-06-18',
      country: 'JP',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 81, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 82,
        fear: 46,
        anger: 92,
        sadness: 75,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2013-06-20',
      country: 'ZA',
      description: 'إعادة العلاقات الدبلوماسية',
      dcftIndices: { gmi: 77, cfi: 76, hri: 64 },
      emotionalDimensions: {
        joy: 77,
        fear: 55,
        anger: 85,
        sadness: 77,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2013-06-22',
      country: 'BH',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 82, cfi: 63, hri: 54 },
      emotionalDimensions: {
        joy: 87,
        fear: 40,
        anger: 93,
        sadness: 79,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2013-06-24',
      country: 'KR',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 75, cfi: 76, hri: 64 },
      emotionalDimensions: {
        joy: 78,
        fear: 48,
        anger: 89,
        sadness: 77,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2013-06-26',
      country: 'QA',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 84, cfi: 76, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 55,
        anger: 84,
        sadness: 68,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2013-06-28',
      country: 'LB',
      description: 'اتفاق عسكري تاريخي',
      dcftIndices: { gmi: 80, cfi: 72, hri: 70 },
      emotionalDimensions: {
        joy: 75,
        fear: 62,
        anger: 87,
        sadness: 64,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2013-06-30',
      country: 'TR',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 76, cfi: 76, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 46,
        anger: 93,
        sadness: 77,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2013-07-02',
      country: 'IL',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 78, cfi: 65, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 41,
        anger: 94,
        sadness: 77,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2013-07-04',
      country: 'TR',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 79, cfi: 74, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 91,
        sadness: 69,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2013-07-06',
      country: 'QA',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 80, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 41,
        anger: 95,
        sadness: 76,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2013-07-08',
      country: 'BR',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 82, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 41,
        anger: 88,
        sadness: 80,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2013-07-10',
      country: 'TR',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 89, cfi: 70, hri: 51 },
      emotionalDimensions: {
        joy: 82,
        fear: 38,
        anger: 92,
        sadness: 82,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2013-07-12',
      country: 'JO',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 76, cfi: 78, hri: 73 },
      emotionalDimensions: {
        joy: 78,
        fear: 62,
        anger: 82,
        sadness: 64,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2013-07-14',
      country: 'US',
      description: 'انخفاض معدل البطالة إلى 9%',
      dcftIndices: { gmi: 79, cfi: 68, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 87,
        sadness: 73,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2013-07-16',
      country: 'OM',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 84, cfi: 73, hri: 55 },
      emotionalDimensions: {
        joy: 82,
        fear: 40,
        anger: 89,
        sadness: 74,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2013-07-18',
      country: 'IN',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 73, cfi: 75, hri: 66 },
      emotionalDimensions: {
        joy: 84,
        fear: 54,
        anger: 85,
        sadness: 70,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2013-07-20',
      country: 'LB',
      description: 'توسع البنية التحتية الرقمية',
      dcftIndices: { gmi: 81, cfi: 69, hri: 63 },
      emotionalDimensions: {
        joy: 83,
        fear: 41,
        anger: 86,
        sadness: 74,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2013-07-22',
      country: 'QA',
      description: 'إطلاق مدينة ذكية',
      dcftIndices: { gmi: 82, cfi: 62, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 44,
        anger: 95,
        sadness: 82,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2013-07-24',
      country: 'BR',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 73, cfi: 68, hri: 67 },
      emotionalDimensions: {
        joy: 85,
        fear: 52,
        anger: 85,
        sadness: 76,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2013-07-26',
      country: 'RU',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 85, cfi: 65, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 51,
        anger: 89,
        sadness: 69,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2013-07-28',
      country: 'OM',
      description: 'تحسن الصادرات بنسبة 14%',
      dcftIndices: { gmi: 81, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 51,
        anger: 88,
        sadness: 78,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2013-07-30',
      country: 'YE',
      description: 'حماية الطبيعة والحياة البرية',
      dcftIndices: { gmi: 80, cfi: 65, hri: 55 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 87,
        sadness: 79,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2013-08-01',
      country: 'BR',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 82, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 86,
        sadness: 80,
        hope: 35,
        curiosity: 38
      }
    },
    {
      date: '2013-08-03',
      country: 'BH',
      description: 'إنجاز أولمبي',
      dcftIndices: { gmi: 89, cfi: 64, hri: 50 },
      emotionalDimensions: {
        joy: 84,
        fear: 36,
        anger: 94,
        sadness: 80,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2013-08-05',
      country: 'BR',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 75, cfi: 75, hri: 62 },
      emotionalDimensions: {
        joy: 78,
        fear: 52,
        anger: 89,
        sadness: 69,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2013-08-07',
      country: 'NG',
      description: 'حماية الموارد المائية',
      dcftIndices: { gmi: 84, cfi: 69, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 55,
        anger: 91,
        sadness: 69,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-08-09',
      country: 'CN',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 85, cfi: 70, hri: 54 },
      emotionalDimensions: {
        joy: 85,
        fear: 46,
        anger: 85,
        sadness: 78,
        hope: 35,
        curiosity: 38
      }
    },
    {
      date: '2013-08-11',
      country: 'MX',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 81, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 90,
        sadness: 70,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2013-08-13',
      country: 'JP',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 82, cfi: 72, hri: 61 },
      emotionalDimensions: {
        joy: 91,
        fear: 47,
        anger: 94,
        sadness: 75,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2013-08-15',
      country: 'OM',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 77, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 87,
        fear: 50,
        anger: 92,
        sadness: 79,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2013-08-17',
      country: 'RU',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 89, cfi: 66, hri: 67 },
      emotionalDimensions: {
        joy: 92,
        fear: 44,
        anger: 95,
        sadness: 82,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2013-08-19',
      country: 'JP',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 10%',
      dcftIndices: { gmi: 82, cfi: 72, hri: 69 },
      emotionalDimensions: {
        joy: 83,
        fear: 41,
        anger: 88,
        sadness: 74,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2013-08-21',
      country: 'IQ',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 81, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 90,
        fear: 37,
        anger: 95,
        sadness: 85,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2013-08-23',
      country: 'IL',
      description: 'برنامج الشباب الرياضي',
      dcftIndices: { gmi: 78, cfi: 64, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 38,
        anger: 94,
        sadness: 78,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2013-08-25',
      country: 'EU',
      description: 'اتفاق بيئي إقليمي',
      dcftIndices: { gmi: 79, cfi: 66, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 49,
        anger: 84,
        sadness: 69,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2013-08-27',
      country: 'JP',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 89, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 44,
        anger: 93,
        sadness: 82,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2013-08-29',
      country: 'NG',
      description: 'إطلاق مشروع استثماري ضخم',
      dcftIndices: { gmi: 86, cfi: 71, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 38,
        anger: 87,
        sadness: 82,
        hope: 38,
        curiosity: 40
      }
    },
    {
      date: '2013-08-31',
      country: 'CN',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 76, cfi: 73, hri: 54 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 95,
        sadness: 80,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2013-09-02',
      country: 'NG',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 81, cfi: 76, hri: 66 },
      emotionalDimensions: {
        joy: 85,
        fear: 48,
        anger: 89,
        sadness: 76,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2013-09-04',
      country: 'RU',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 78, cfi: 69, hri: 55 },
      emotionalDimensions: {
        joy: 83,
        fear: 41,
        anger: 92,
        sadness: 76,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2013-09-06',
      country: 'CN',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 72, cfi: 78, hri: 79 },
      emotionalDimensions: {
        joy: 74,
        fear: 58,
        anger: 82,
        sadness: 70,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2013-09-08',
      country: 'AE',
      description: 'إنجاز أولمبي',
      dcftIndices: { gmi: 87, cfi: 64, hri: 54 },
      emotionalDimensions: {
        joy: 93,
        fear: 32,
        anger: 92,
        sadness: 81,
        hope: 38,
        curiosity: 44
      }
    },
    {
      date: '2013-09-10',
      country: 'CN',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 80, cfi: 74, hri: 67 },
      emotionalDimensions: {
        joy: 75,
        fear: 48,
        anger: 91,
        sadness: 74,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2013-09-12',
      country: 'JP',
      description: 'افتتاح متحف جديد',
      dcftIndices: { gmi: 84, cfi: 66, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 95,
        sadness: 77,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2013-09-14',
      country: 'KR',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 72, cfi: 85, hri: 82 },
      emotionalDimensions: {
        joy: 74,
        fear: 61,
        anger: 84,
        sadness: 69,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2013-09-16',
      country: 'MA',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 81, cfi: 69, hri: 54 },
      emotionalDimensions: {
        joy: 92,
        fear: 36,
        anger: 95,
        sadness: 76,
        hope: 35,
        curiosity: 44
      }
    },
    {
      date: '2013-09-18',
      country: 'EU',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 83, cfi: 73, hri: 55 },
      emotionalDimensions: {
        joy: 82,
        fear: 42,
        anger: 94,
        sadness: 71,
        hope: 32,
        curiosity: 44
      }
    },
    {
      date: '2013-09-20',
      country: 'MX',
      description: 'معرض فني دولي',
      dcftIndices: { gmi: 85, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 40,
        anger: 94,
        sadness: 79,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2013-09-22',
      country: 'MA',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 87, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 95,
        sadness: 78,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2013-09-24',
      country: 'LB',
      description: 'إنجاز أولمبي',
      dcftIndices: { gmi: 81, cfi: 61, hri: 54 },
      emotionalDimensions: {
        joy: 94,
        fear: 34,
        anger: 91,
        sadness: 77,
        hope: 38,
        curiosity: 45
      }
    },
    {
      date: '2013-09-26',
      country: 'LB',
      description: 'تحسن مؤشرات الأمان الغذائي',
      dcftIndices: { gmi: 85, cfi: 75, hri: 63 },
      emotionalDimensions: {
        joy: 78,
        fear: 50,
        anger: 84,
        sadness: 77,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2013-09-28',
      country: 'BR',
      description: 'مشروع حماية البيئة',
      dcftIndices: { gmi: 84, cfi: 65, hri: 63 },
      emotionalDimensions: {
        joy: 88,
        fear: 48,
        anger: 90,
        sadness: 75,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2013-09-30',
      country: 'NG',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 85, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 35,
        anger: 92,
        sadness: 84,
        hope: 37,
        curiosity: 41
      }
    },
    {
      date: '2013-10-02',
      country: 'CN',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 80, cfi: 65, hri: 56 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 91,
        sadness: 72,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2013-10-04',
      country: 'SY',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 80, cfi: 64, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 43,
        anger: 89,
        sadness: 78,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2013-10-06',
      country: 'QA',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 72, cfi: 77, hri: 69 },
      emotionalDimensions: {
        joy: 75,
        fear: 52,
        anger: 85,
        sadness: 65,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2013-10-08',
      country: 'SY',
      description: 'فوز فريق وطني',
      dcftIndices: { gmi: 90, cfi: 61, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 35,
        anger: 93,
        sadness: 79,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2013-10-10',
      country: 'EG',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 72, cfi: 75, hri: 69 },
      emotionalDimensions: {
        joy: 77,
        fear: 53,
        anger: 87,
        sadness: 66,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2013-10-12',
      country: 'BH',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 87, cfi: 72, hri: 54 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 95,
        sadness: 79,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2013-10-14',
      country: 'SA',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 84, cfi: 75, hri: 63 },
      emotionalDimensions: {
        joy: 90,
        fear: 39,
        anger: 91,
        sadness: 79,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2013-10-16',
      country: 'OM',
      description: 'افتتاح مركز تكنولوجي',
      dcftIndices: { gmi: 83, cfi: 64, hri: 56 },
      emotionalDimensions: {
        joy: 84,
        fear: 43,
        anger: 95,
        sadness: 72,
        hope: 31,
        curiosity: 43
      }
    },
    {
      date: '2013-10-18',
      country: 'RU',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 84, cfi: 60, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 34,
        anger: 90,
        sadness: 84,
        hope: 38,
        curiosity: 41
      }
    },
    {
      date: '2013-10-20',
      country: 'NG',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 74, cfi: 78, hri: 73 },
      emotionalDimensions: {
        joy: 72,
        fear: 58,
        anger: 81,
        sadness: 63,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2013-10-22',
      country: 'JO',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 76, cfi: 63, hri: 59 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 95,
        sadness: 72,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-10-24',
      country: 'ZA',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 83, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 89,
        fear: 37,
        anger: 95,
        sadness: 75,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2013-10-26',
      country: 'AE',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 80, cfi: 70, hri: 56 },
      emotionalDimensions: {
        joy: 81,
        fear: 45,
        anger: 90,
        sadness: 79,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2013-10-28',
      country: 'KR',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 87, cfi: 60, hri: 52 },
      emotionalDimensions: {
        joy: 85,
        fear: 42,
        anger: 94,
        sadness: 78,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2013-10-30',
      country: 'MA',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 78, cfi: 67, hri: 65 },
      emotionalDimensions: {
        joy: 87,
        fear: 50,
        anger: 87,
        sadness: 78,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2013-11-01',
      country: 'IR',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 84, cfi: 72, hri: 52 },
      emotionalDimensions: {
        joy: 86,
        fear: 38,
        anger: 92,
        sadness: 76,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2013-11-03',
      country: 'CN',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 84, cfi: 68, hri: 65 },
      emotionalDimensions: {
        joy: 82,
        fear: 53,
        anger: 85,
        sadness: 78,
        hope: 31,
        curiosity: 35
      }
    },
    {
      date: '2013-11-05',
      country: 'SY',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 71, cfi: 73, hri: 71 },
      emotionalDimensions: {
        joy: 76,
        fear: 59,
        anger: 86,
        sadness: 72,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2013-11-07',
      country: 'AE',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 72, cfi: 75, hri: 72 },
      emotionalDimensions: {
        joy: 71,
        fear: 61,
        anger: 86,
        sadness: 62,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2013-11-09',
      country: 'IN',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 79, cfi: 79, hri: 74 },
      emotionalDimensions: {
        joy: 79,
        fear: 53,
        anger: 81,
        sadness: 67,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2013-11-11',
      country: 'SY',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 79, cfi: 75, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 56,
        anger: 84,
        sadness: 72,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2013-11-13',
      country: 'SY',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 83, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 47,
        anger: 86,
        sadness: 75,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2013-11-15',
      country: 'ZA',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 88, cfi: 67, hri: 56 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 90,
        sadness: 72,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2013-11-17',
      country: 'KR',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 80, cfi: 81, hri: 68 },
      emotionalDimensions: {
        joy: 82,
        fear: 58,
        anger: 87,
        sadness: 67,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-11-19',
      country: 'US',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 83, cfi: 73, hri: 58 },
      emotionalDimensions: {
        joy: 81,
        fear: 48,
        anger: 91,
        sadness: 73,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2013-11-21',
      country: 'MX',
      description: 'مشروع الطاقة النظيفة',
      dcftIndices: { gmi: 89, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 95,
        sadness: 77,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2013-11-23',
      country: 'CN',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 78, cfi: 65, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 45,
        anger: 86,
        sadness: 70,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2013-11-25',
      country: 'ZA',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 81, cfi: 76, hri: 62 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 85,
        sadness: 70,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2013-11-27',
      country: 'ZA',
      description: 'إنجاز أولمبي',
      dcftIndices: { gmi: 88, cfi: 59, hri: 53 },
      emotionalDimensions: {
        joy: 86,
        fear: 40,
        anger: 93,
        sadness: 76,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2013-11-29',
      country: 'IL',
      description: 'بطولة رياضية عالمية',
      dcftIndices: { gmi: 83, cfi: 61, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 41,
        anger: 89,
        sadness: 82,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2013-12-01',
      country: 'KW',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 77, cfi: 72, hri: 55 },
      emotionalDimensions: {
        joy: 79,
        fear: 46,
        anger: 91,
        sadness: 70,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2013-12-03',
      country: 'IQ',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 81, cfi: 64, hri: 57 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 94,
        sadness: 72,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2013-12-05',
      country: 'IQ',
      description: 'توسع شبكات الإنترنت',
      dcftIndices: { gmi: 79, cfi: 74, hri: 57 },
      emotionalDimensions: {
        joy: 83,
        fear: 46,
        anger: 95,
        sadness: 75,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2013-12-07',
      country: 'NG',
      description: 'افتتاح ملعب جديد',
      dcftIndices: { gmi: 88, cfi: 68, hri: 57 },
      emotionalDimensions: {
        joy: 87,
        fear: 36,
        anger: 95,
        sadness: 77,
        hope: 35,
        curiosity: 44
      }
    },
    {
      date: '2013-12-09',
      country: 'AE',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 80, cfi: 76, hri: 64 },
      emotionalDimensions: {
        joy: 86,
        fear: 54,
        anger: 85,
        sadness: 68,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2013-12-11',
      country: 'JO',
      description: 'تحسن الاستقرار السياسي',
      dcftIndices: { gmi: 77, cfi: 72, hri: 57 },
      emotionalDimensions: {
        joy: 79,
        fear: 43,
        anger: 88,
        sadness: 77,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2013-12-13',
      country: 'MX',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 80, cfi: 73, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 52,
        anger: 82,
        sadness: 75,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2013-12-15',
      country: 'JP',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 77, cfi: 85, hri: 73 },
      emotionalDimensions: {
        joy: 78,
        fear: 61,
        anger: 80,
        sadness: 64,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-12-17',
      country: 'NG',
      description: 'تحسن مؤشرات التنمية البشرية',
      dcftIndices: { gmi: 87, cfi: 64, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 41,
        anger: 87,
        sadness: 78,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2013-12-19',
      country: 'US',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 78, cfi: 64, hri: 53 },
      emotionalDimensions: {
        joy: 89,
        fear: 41,
        anger: 95,
        sadness: 78,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2013-12-21',
      country: 'NG',
      description: 'حفل موسيقي عالمي',
      dcftIndices: { gmi: 89, cfi: 64, hri: 58 },
      emotionalDimensions: {
        joy: 89,
        fear: 37,
        anger: 95,
        sadness: 83,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2013-12-23',
      country: 'OM',
      description: 'توقيع معاهدة دولية',
      dcftIndices: { gmi: 82, cfi: 69, hri: 65 },
      emotionalDimensions: {
        joy: 85,
        fear: 52,
        anger: 90,
        sadness: 72,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2013-12-25',
      country: 'PS',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 72, cfi: 79, hri: 73 },
      emotionalDimensions: {
        joy: 74,
        fear: 52,
        anger: 85,
        sadness: 74,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2013-12-27',
      country: 'AE',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 71, cfi: 82, hri: 80 },
      emotionalDimensions: {
        joy: 78,
        fear: 63,
        anger: 76,
        sadness: 71,
        hope: 31,
        curiosity: 33
      }
    },
    {
      date: '2013-12-29',
      country: 'EG',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 80, cfi: 72, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 91,
        sadness: 77,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2013-12-31',
      country: 'MA',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 79, cfi: 62, hri: 54 },
      emotionalDimensions: {
        joy: 90,
        fear: 45,
        anger: 92,
        sadness: 74,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2014-01-02',
      country: 'AE',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 83, cfi: 63, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 48,
        anger: 89,
        sadness: 80,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2014-01-04',
      country: 'PS',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 77, cfi: 74, hri: 59 },
      emotionalDimensions: {
        joy: 87,
        fear: 52,
        anger: 85,
        sadness: 72,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2014-01-06',
      country: 'BR',
      description: 'اتفاق المناخ الإقليمي',
      dcftIndices: { gmi: 76, cfi: 66, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 49,
        anger: 88,
        sadness: 73,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2014-01-08',
      country: 'AE',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 78, cfi: 71, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 45,
        anger: 89,
        sadness: 74,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2014-01-10',
      country: 'QA',
      description: 'افتتاح مركز تكنولوجي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 53 },
      emotionalDimensions: {
        joy: 82,
        fear: 39,
        anger: 91,
        sadness: 76,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2014-01-12',
      country: 'IQ',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 71, cfi: 77, hri: 77 },
      emotionalDimensions: {
        joy: 80,
        fear: 57,
        anger: 79,
        sadness: 67,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2014-01-14',
      country: 'LB',
      description: 'انخفاض معدل البطالة إلى 13%',
      dcftIndices: { gmi: 84, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 84,
        fear: 55,
        anger: 88,
        sadness: 74,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2014-01-16',
      country: 'EG',
      description: 'مشروع إعادة التشجير',
      dcftIndices: { gmi: 79, cfi: 72, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 46,
        anger: 94,
        sadness: 76,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2014-01-18',
      country: 'NG',
      description: 'مشروع تطوير الرياضة',
      dcftIndices: { gmi: 77, cfi: 64, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 40,
        anger: 94,
        sadness: 77,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2014-01-20',
      country: 'MX',
      description: 'برنامج دعم الطبقات الفقيرة',
      dcftIndices: { gmi: 76, cfi: 73, hri: 57 },
      emotionalDimensions: {
        joy: 81,
        fear: 51,
        anger: 87,
        sadness: 70,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2014-01-22',
      country: 'OM',
      description: 'إنجاز رياضي قياسي',
      dcftIndices: { gmi: 86, cfi: 69, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 39,
        anger: 95,
        sadness: 75,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2014-01-24',
      country: 'BH',
      description: 'عملية عسكرية منظمة',
      dcftIndices: { gmi: 72, cfi: 78, hri: 71 },
      emotionalDimensions: {
        joy: 71,
        fear: 60,
        anger: 84,
        sadness: 64,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2014-01-26',
      country: 'SY',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 80, cfi: 64, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 94,
        sadness: 70,
        hope: 31,
        curiosity: 43
      }
    },
    {
      date: '2014-01-28',
      country: 'RU',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 78, cfi: 72, hri: 73 },
      emotionalDimensions: {
        joy: 75,
        fear: 53,
        anger: 85,
        sadness: 69,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2014-01-30',
      country: 'KW',
      description: 'تحسن الصادرات بنسبة 8%',
      dcftIndices: { gmi: 77, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 88,
        fear: 52,
        anger: 84,
        sadness: 71,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2014-02-01',
      country: 'LB',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 76, cfi: 73, hri: 63 },
      emotionalDimensions: {
        joy: 78,
        fear: 53,
        anger: 87,
        sadness: 70,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2014-02-03',
      country: 'EU',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 71, cfi: 78, hri: 76 },
      emotionalDimensions: {
        joy: 81,
        fear: 64,
        anger: 87,
        sadness: 63,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2014-02-05',
      country: 'SA',
      description: 'تشكيل حكومة جديدة',
      dcftIndices: { gmi: 71, cfi: 76, hri: 71 },
      emotionalDimensions: {
        joy: 84,
        fear: 56,
        anger: 82,
        sadness: 74,
        hope: 31,
        curiosity: 35
      }
    },
    {
      date: '2014-02-07',
      country: 'SA',
      description: 'توقيع اتفاق تجاري جديد',
      dcftIndices: { gmi: 79, cfi: 64, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 52,
        anger: 88,
        sadness: 76,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2014-02-09',
      country: 'MA',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 83, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 89,
        sadness: 80,
        hope: 31,
        curiosity: 35
      }
    },
    {
      date: '2014-02-11',
      country: 'NG',
      description: 'عملية مكافحة الإرهاب',
      dcftIndices: { gmi: 78, cfi: 77, hri: 82 },
      emotionalDimensions: {
        joy: 73,
        fear: 68,
        anger: 76,
        sadness: 68,
        hope: 30,
        curiosity: 32
      }
    },
    {
      date: '2014-02-13',
      country: 'AE',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 87, cfi: 67, hri: 55 },
      emotionalDimensions: {
        joy: 83,
        fear: 39,
        anger: 92,
        sadness: 73,
        hope: 35,
        curiosity: 44
      }
    },
    {
      date: '2014-02-15',
      country: 'RU',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 14%',
      dcftIndices: { gmi: 76, cfi: 75, hri: 67 },
      emotionalDimensions: {
        joy: 84,
        fear: 42,
        anger: 89,
        sadness: 74,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2014-02-17',
      country: 'IL',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 81, cfi: 70, hri: 57 },
      emotionalDimensions: {
        joy: 88,
        fear: 38,
        anger: 95,
        sadness: 77,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2014-02-19',
      country: 'US',
      description: 'بطولة إقليمية',
      dcftIndices: { gmi: 78, cfi: 64, hri: 56 },
      emotionalDimensions: {
        joy: 91,
        fear: 42,
        anger: 94,
        sadness: 77,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2014-02-21',
      country: 'QA',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 78, cfi: 66, hri: 61 },
      emotionalDimensions: {
        joy: 91,
        fear: 43,
        anger: 91,
        sadness: 83,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2014-02-23',
      country: 'MX',
      description: 'تحسن الاستقرار العام',
      dcftIndices: { gmi: 84, cfi: 71, hri: 68 },
      emotionalDimensions: {
        joy: 77,
        fear: 48,
        anger: 92,
        sadness: 72,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2014-02-25',
      country: 'LB',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 76, cfi: 73, hri: 55 },
      emotionalDimensions: {
        joy: 80,
        fear: 51,
        anger: 89,
        sadness: 71,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2014-02-27',
      country: 'KR',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 79, cfi: 70, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 85,
        sadness: 77,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2014-03-01',
      country: 'NG',
      description: 'اتفاق دفاعي جديد',
      dcftIndices: { gmi: 70, cfi: 78, hri: 70 },
      emotionalDimensions: {
        joy: 78,
        fear: 55,
        anger: 84,
        sadness: 72,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2014-03-03',
      country: 'MX',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 80, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 89,
        fear: 46,
        anger: 86,
        sadness: 70,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2014-03-05',
      country: 'IL',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 73, cfi: 77, hri: 67 },
      emotionalDimensions: {
        joy: 73,
        fear: 53,
        anger: 81,
        sadness: 67,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2014-03-07',
      country: 'CN',
      description: 'تحسن مؤشرات البيئة',
      dcftIndices: { gmi: 84, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 44,
        anger: 89,
        sadness: 73,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2014-03-09',
      country: 'IQ',
      description: 'انخفاض معدل البطالة إلى 9%',
      dcftIndices: { gmi: 83, cfi: 74, hri: 55 },
      emotionalDimensions: {
        joy: 89,
        fear: 45,
        anger: 92,
        sadness: 71,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2014-03-11',
      country: 'JO',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 74, cfi: 81, hri: 72 },
      emotionalDimensions: {
        joy: 76,
        fear: 58,
        anger: 82,
        sadness: 66,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2014-03-13',
      country: 'ZA',
      description: 'إطلاق منصة رقمية جديدة',
      dcftIndices: { gmi: 86, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 90,
        fear: 41,
        anger: 90,
        sadness: 77,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2014-03-15',
      country: 'QA',
      description: 'تحسن حقوق الإنسان',
      dcftIndices: { gmi: 74, cfi: 70, hri: 68 },
      emotionalDimensions: {
        joy: 76,
        fear: 48,
        anger: 91,
        sadness: 67,
        hope: 31,
        curiosity: 43
      }
    },
    {
      date: '2014-03-17',
      country: 'IQ',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 85, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 91,
        fear: 37,
        anger: 88,
        sadness: 79,
        hope: 38,
        curiosity: 42
      }
    },
    {
      date: '2014-03-19',
      country: 'MA',
      description: 'تحسن مؤشرات الأمان الغذائي',
      dcftIndices: { gmi: 77, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 53,
        anger: 91,
        sadness: 77,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2014-03-21',
      country: 'KW',
      description: 'استضافة حدث رياضي',
      dcftIndices: { gmi: 85, cfi: 66, hri: 52 },
      emotionalDimensions: {
        joy: 90,
        fear: 42,
        anger: 93,
        sadness: 83,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2014-03-23',
      country: 'US',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 85, cfi: 71, hri: 64 },
      emotionalDimensions: {
        joy: 88,
        fear: 53,
        anger: 92,
        sadness: 79,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2014-03-25',
      country: 'MX',
      description: 'مشروع تحول رقمي',
      dcftIndices: { gmi: 86, cfi: 67, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 90,
        sadness: 79,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2014-03-27',
      country: 'YE',
      description: 'استثمار في الذكاء الاصطناعي',
      dcftIndices: { gmi: 81, cfi: 69, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 41,
        anger: 95,
        sadness: 80,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2014-03-29',
      country: 'OM',
      description: 'إطلاق مدينة ذكية',
      dcftIndices: { gmi: 88, cfi: 71, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 38,
        anger: 92,
        sadness: 80,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2014-03-31',
      country: 'KR',
      description: 'اتفاق بيئي إقليمي',
      dcftIndices: { gmi: 76, cfi: 75, hri: 62 },
      emotionalDimensions: {
        joy: 88,
        fear: 47,
        anger: 92,
        sadness: 70,
        hope: 31,
        curiosity: 42
      }
    },
    {
      date: '2014-04-02',
      country: 'JP',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 85, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 48,
        anger: 94,
        sadness: 73,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2014-04-04',
      country: 'IR',
      description: 'احتفالات وطنية',
      dcftIndices: { gmi: 83, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 39,
        anger: 95,
        sadness: 71,
        hope: 33,
        curiosity: 45
      }
    },
    {
      date: '2014-04-06',
      country: 'US',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 82, cfi: 68, hri: 52 },
      emotionalDimensions: {
        joy: 92,
        fear: 42,
        anger: 90,
        sadness: 79,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2014-04-08',
      country: 'IQ',
      description: 'فعالية ثقافية كبرى',
      dcftIndices: { gmi: 81, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 82,
        fear: 42,
        anger: 92,
        sadness: 74,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2014-04-10',
      country: 'SY',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 79, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 78,
        fear: 52,
        anger: 86,
        sadness: 77,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2014-04-12',
      country: 'IR',
      description: 'اتفاق حدودي',
      dcftIndices: { gmi: 79, cfi: 70, hri: 65 },
      emotionalDimensions: {
        joy: 77,
        fear: 55,
        anger: 81,
        sadness: 74,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2014-04-14',
      country: 'CN',
      description: 'بطولة رياضية عالمية',
      dcftIndices: { gmi: 81, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 90,
        fear: 37,
        anger: 90,
        sadness: 75,
        hope: 37,
        curiosity: 44
      }
    },
    {
      date: '2014-04-16',
      country: 'YE',
      description: 'معرض فني دولي',
      dcftIndices: { gmi: 84, cfi: 68, hri: 53 },
      emotionalDimensions: {
        joy: 80,
        fear: 44,
        anger: 92,
        sadness: 74,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2014-04-18',
      country: 'SY',
      description: 'إصلاحات تعليمية',
      dcftIndices: { gmi: 83, cfi: 74, hri: 54 },
      emotionalDimensions: {
        joy: 86,
        fear: 52,
        anger: 92,
        sadness: 79,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2014-04-20',
      country: 'PS',
      description: 'انتخابات برلمانية',
      dcftIndices: { gmi: 70, cfi: 79, hri: 69 },
      emotionalDimensions: {
        joy: 77,
        fear: 53,
        anger: 89,
        sadness: 69,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2014-04-22',
      country: 'ZA',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 75, cfi: 78, hri: 67 },
      emotionalDimensions: {
        joy: 75,
        fear: 60,
        anger: 80,
        sadness: 72,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2014-04-24',
      country: 'EU',
      description: 'مشروع الطاقة المتجددة',
      dcftIndices: { gmi: 84, cfi: 69, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 47,
        anger: 95,
        sadness: 73,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2014-04-26',
      country: 'QA',
      description: 'استثمار في الطاقة النظيفة',
      dcftIndices: { gmi: 82, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 44,
        anger: 92,
        sadness: 79,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2014-04-28',
      country: 'IL',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 78, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 41,
        anger: 95,
        sadness: 72,
        hope: 32,
        curiosity: 44
      }
    },
    {
      date: '2014-04-30',
      country: 'CN',
      description: 'تحسن جودة الهواء',
      dcftIndices: { gmi: 86, cfi: 68, hri: 55 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 87,
        sadness: 81,
        hope: 32,
        curiosity: 35
      }
    },
    {
      date: '2014-05-02',
      country: 'IL',
      description: 'برنامج محو الأمية',
      dcftIndices: { gmi: 85, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 51,
        anger: 92,
        sadness: 77,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2014-05-04',
      country: 'BH',
      description: 'مهرجان الفنون',
      dcftIndices: { gmi: 79, cfi: 62, hri: 57 },
      emotionalDimensions: {
        joy: 81,
        fear: 47,
        anger: 95,
        sadness: 82,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2014-05-06',
      country: 'YE',
      description: 'نمو الناتج المحلي الإجمالي بنسبة 10%',
      dcftIndices: { gmi: 83, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 41,
        anger: 89,
        sadness: 78,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2014-05-08',
      country: 'US',
      description: 'تنويع مصادر الدخل',
      dcftIndices: { gmi: 85, cfi: 72, hri: 60 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 89,
        sadness: 73,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2014-05-10',
      country: 'KR',
      description: 'إطلاق منصة رقمية جديدة',
      dcftIndices: { gmi: 88, cfi: 71, hri: 53 },
      emotionalDimensions: {
        joy: 83,
        fear: 39,
        anger: 91,
        sadness: 77,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2014-05-12',
      country: 'QA',
      description: 'برنامج إسكان جديد',
      dcftIndices: { gmi: 79, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 87,
        fear: 48,
        anger: 89,
        sadness: 78,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2014-05-14',
      country: 'KW',
      description: 'مشروع الاستدامة',
      dcftIndices: { gmi: 85, cfi: 64, hri: 54 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 89,
        sadness: 72,
        hope: 35,
        curiosity: 44
      }
    },
    {
      date: '2014-05-16',
      country: 'QA',
      description: 'اتفاق سياسي تاريخي',
      dcftIndices: { gmi: 83, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 92,
        sadness: 71,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2014-05-18',
      country: 'YE',
      description: 'تحسن العلاقات الدبلوماسية',
      dcftIndices: { gmi: 75, cfi: 73, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 53,
        anger: 90,
        sadness: 68,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2014-05-20',
      country: 'AE',
      description: 'تحسن التعاون الأمني',
      dcftIndices: { gmi: 82, cfi: 78, hri: 70 },
      emotionalDimensions: {
        joy: 76,
        fear: 51,
        anger: 89,
        sadness: 69,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2014-05-22',
      country: 'IR',
      description: 'استقرار سعر الصرف',
      dcftIndices: { gmi: 75, cfi: 73, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 46,
        anger: 88,
        sadness: 68,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2014-05-24',
      country: 'LB',
      description: 'إصلاحات دستورية',
      dcftIndices: { gmi: 74, cfi: 73, hri: 74 },
      emotionalDimensions: {
        joy: 73,
        fear: 55,
        anger: 83,
        sadness: 68,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2014-05-26',
      country: 'EG',
      description: 'زيادة الاستثمارات الأجنبية',
      dcftIndices: { gmi: 77, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 40,
        anger: 93,
        sadness: 72,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2014-05-28',
      country: 'OM',
      description: 'اتفاق عسكري تاريخي',
      dcftIndices: { gmi: 73, cfi: 72, hri: 75 },
      emotionalDimensions: {
        joy: 78,
        fear: 53,
        anger: 85,
        sadness: 71,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2008-01-01',
      country: 'IL',
      description: 'استثمار في البيانات الضخمة',
      dcftIndices: { gmi: 86, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 45,
        anger: 91,
        sadness: 79,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2008-01-04',
      country: 'CN',
      description: 'مشروع الإنترنت للجميع',
      dcftIndices: { gmi: 76, cfi: 75, hri: 66 },
      emotionalDimensions: {
        joy: 85,
        fear: 51,
        anger: 90,
        sadness: 70,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2008-01-07',
      country: 'IT',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 86, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 82,
        fear: 49,
        anger: 90,
        sadness: 80,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2008-01-10',
      country: 'OM',
      description: 'معرض فني دولي مهم',
      dcftIndices: { gmi: 85, cfi: 68, hri: 54 },
      emotionalDimensions: {
        joy: 89,
        fear: 42,
        anger: 93,
        sadness: 79,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2008-01-13',
      country: 'IQ',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 84, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 87,
        fear: 40,
        anger: 91,
        sadness: 77,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2008-01-16',
      country: 'EU',
      description: 'افتتاح ملعب رياضي حديث',
      dcftIndices: { gmi: 86, cfi: 66, hri: 59 },
      emotionalDimensions: {
        joy: 83,
        fear: 42,
        anger: 95,
        sadness: 79,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2008-01-19',
      country: 'CA',
      description: 'مشروع الطاقة الشمسية الضخم',
      dcftIndices: { gmi: 86, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 91,
        fear: 41,
        anger: 92,
        sadness: 78,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2008-01-22',
      country: 'LB',
      description: 'استثمار في البيانات الضخمة',
      dcftIndices: { gmi: 86, cfi: 64, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 91,
        sadness: 74,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2008-01-25',
      country: 'IL',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 81, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 40,
        anger: 92,
        sadness: 76,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2008-01-28',
      country: 'IL',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 80, cfi: 71, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 52,
        anger: 82,
        sadness: 72,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2008-01-31',
      country: 'JO',
      description: 'مشروع إعادة التشجير الواسع',
      dcftIndices: { gmi: 83, cfi: 72, hri: 57 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 93,
        sadness: 80,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-02-03',
      country: 'MX',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 79, cfi: 70, hri: 57 },
      emotionalDimensions: {
        joy: 80,
        fear: 46,
        anger: 92,
        sadness: 77,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2008-02-06',
      country: 'FR',
      description: 'افتتاح متحف حضارة',
      dcftIndices: { gmi: 84, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 90,
        sadness: 78,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2008-02-09',
      country: 'BR',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 84, cfi: 62, hri: 55 },
      emotionalDimensions: {
        joy: 90,
        fear: 37,
        anger: 89,
        sadness: 75,
        hope: 37,
        curiosity: 44
      }
    },
    {
      date: '2008-02-12',
      country: 'ZA',
      description: 'تحسن مؤشرات التنوع البيولوجي',
      dcftIndices: { gmi: 83, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 49,
        anger: 91,
        sadness: 72,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2008-02-15',
      country: 'MX',
      description: 'مشروع الاستدامة الشاملة',
      dcftIndices: { gmi: 86, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 83,
        fear: 40,
        anger: 90,
        sadness: 79,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2008-02-18',
      country: 'FR',
      description: 'نمو القطاع الخاص',
      dcftIndices: { gmi: 85, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 44,
        anger: 89,
        sadness: 70,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2008-02-21',
      country: 'YE',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 85, cfi: 65, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 36,
        anger: 89,
        sadness: 82,
        hope: 38,
        curiosity: 41
      }
    },
    {
      date: '2008-02-24',
      country: 'IT',
      description: 'اتفاق بيئي دولي',
      dcftIndices: { gmi: 80, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 48,
        anger: 89,
        sadness: 71,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2008-02-27',
      country: 'TR',
      description: 'زيادة الاستثمارات الأجنبية المباشرة',
      dcftIndices: { gmi: 86, cfi: 68, hri: 66 },
      emotionalDimensions: {
        joy: 87,
        fear: 45,
        anger: 89,
        sadness: 72,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2008-03-01',
      country: 'KW',
      description: 'إطلاق منصة تجارة إلكترونية',
      dcftIndices: { gmi: 87, cfi: 65, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 39,
        anger: 95,
        sadness: 82,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2008-03-04',
      country: 'US',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 83, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 90,
        sadness: 73,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2008-03-07',
      country: 'ZA',
      description: 'برنامج محو الأمية الرقمية',
      dcftIndices: { gmi: 82, cfi: 74, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 48,
        anger: 88,
        sadness: 74,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-03-10',
      country: 'SY',
      description: 'تحسن التعاون الأمني الدولي',
      dcftIndices: { gmi: 82, cfi: 77, hri: 68 },
      emotionalDimensions: {
        joy: 79,
        fear: 52,
        anger: 87,
        sadness: 68,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2008-03-13',
      country: 'US',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 85, cfi: 60, hri: 54 },
      emotionalDimensions: {
        joy: 92,
        fear: 38,
        anger: 95,
        sadness: 78,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2008-03-16',
      country: 'YE',
      description: 'مشروع الاستدامة الشاملة',
      dcftIndices: { gmi: 84, cfi: 64, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 40,
        anger: 90,
        sadness: 79,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2008-03-19',
      country: 'IN',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 84, cfi: 63, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 92,
        sadness: 79,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-03-22',
      country: 'CN',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 80, cfi: 74, hri: 62 },
      emotionalDimensions: {
        joy: 82,
        fear: 52,
        anger: 85,
        sadness: 72,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2008-03-25',
      country: 'JP',
      description: 'اتفاق على مكافحة الإرهاب',
      dcftIndices: { gmi: 78, cfi: 76, hri: 70 },
      emotionalDimensions: {
        joy: 78,
        fear: 58,
        anger: 85,
        sadness: 67,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2008-03-28',
      country: 'BR',
      description: 'تحسن حقوق المرأة',
      dcftIndices: { gmi: 78, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 84,
        sadness: 72,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2008-03-31',
      country: 'NG',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 79, cfi: 75, hri: 71 },
      emotionalDimensions: {
        joy: 78,
        fear: 59,
        anger: 86,
        sadness: 67,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2008-04-03',
      country: 'OM',
      description: 'تحسن الحوار السياسي',
      dcftIndices: { gmi: 80, cfi: 70, hri: 64 },
      emotionalDimensions: {
        joy: 84,
        fear: 53,
        anger: 85,
        sadness: 67,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2008-04-06',
      country: 'LB',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 79, cfi: 80, hri: 68 },
      emotionalDimensions: {
        joy: 75,
        fear: 59,
        anger: 88,
        sadness: 70,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2008-04-09',
      country: 'JP',
      description: 'تحسن الاحتياطيات النقدية',
      dcftIndices: { gmi: 82, cfi: 73, hri: 60 },
      emotionalDimensions: {
        joy: 89,
        fear: 47,
        anger: 94,
        sadness: 78,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2008-04-12',
      country: 'DE',
      description: 'اتفاق على التعاون الدفاعي',
      dcftIndices: { gmi: 77, cfi: 81, hri: 69 },
      emotionalDimensions: {
        joy: 78,
        fear: 59,
        anger: 82,
        sadness: 70,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2008-04-15',
      country: 'LB',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 78, cfi: 71, hri: 54 },
      emotionalDimensions: {
        joy: 82,
        fear: 47,
        anger: 93,
        sadness: 76,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2008-04-18',
      country: 'NG',
      description: 'مهرجان الفنون الشعبية',
      dcftIndices: { gmi: 86, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 44,
        anger: 92,
        sadness: 78,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-04-21',
      country: 'UK',
      description: 'استثمار في البيانات الضخمة',
      dcftIndices: { gmi: 84, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 40,
        anger: 89,
        sadness: 81,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2008-04-24',
      country: 'PS',
      description: 'استقرار أسعار السلع الأساسية',
      dcftIndices: { gmi: 78, cfi: 77, hri: 64 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 84,
        sadness: 76,
        hope: 33,
        curiosity: 37
      }
    },
    {
      date: '2008-04-27',
      country: 'RU',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 74, cfi: 71, hri: 69 },
      emotionalDimensions: {
        joy: 74,
        fear: 52,
        anger: 80,
        sadness: 67,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2008-04-30',
      country: 'EU',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 89, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 91,
        fear: 32,
        anger: 92,
        sadness: 84,
        hope: 38,
        curiosity: 42
      }
    },
    {
      date: '2008-05-03',
      country: 'BH',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 84, cfi: 65, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 90,
        sadness: 77,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2008-05-06',
      country: 'FR',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 76, cfi: 72, hri: 74 },
      emotionalDimensions: {
        joy: 83,
        fear: 59,
        anger: 82,
        sadness: 67,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2008-05-09',
      country: 'RU',
      description: 'استثمار في البيانات الضخمة',
      dcftIndices: { gmi: 84, cfi: 66, hri: 61 },
      emotionalDimensions: {
        joy: 89,
        fear: 46,
        anger: 88,
        sadness: 75,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2008-05-12',
      country: 'AU',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 79, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 92,
        sadness: 74,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2008-05-15',
      country: 'CA',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 77, cfi: 78, hri: 72 },
      emotionalDimensions: {
        joy: 76,
        fear: 56,
        anger: 88,
        sadness: 69,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2008-05-18',
      country: 'DE',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 78, cfi: 65, hri: 55 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 91,
        sadness: 78,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2008-05-21',
      country: 'IR',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 78, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 82,
        fear: 49,
        anger: 87,
        sadness: 79,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2008-05-24',
      country: 'ZA',
      description: 'تحسن الحوار السياسي',
      dcftIndices: { gmi: 74, cfi: 73, hri: 67 },
      emotionalDimensions: {
        joy: 82,
        fear: 49,
        anger: 88,
        sadness: 67,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2008-05-27',
      country: 'AU',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 78, cfi: 70, hri: 67 },
      emotionalDimensions: {
        joy: 82,
        fear: 56,
        anger: 80,
        sadness: 67,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-05-30',
      country: 'EG',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 87, cfi: 63, hri: 57 },
      emotionalDimensions: {
        joy: 89,
        fear: 40,
        anger: 90,
        sadness: 76,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2008-06-02',
      country: 'IN',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 79, cfi: 69, hri: 65 },
      emotionalDimensions: {
        joy: 79,
        fear: 54,
        anger: 88,
        sadness: 75,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2008-06-05',
      country: 'AU',
      description: 'توقيع معاهدة سلام تاريخية',
      dcftIndices: { gmi: 80, cfi: 72, hri: 63 },
      emotionalDimensions: {
        joy: 82,
        fear: 56,
        anger: 84,
        sadness: 74,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2008-06-08',
      country: 'BR',
      description: 'افتتاح ملعب رياضي حديث',
      dcftIndices: { gmi: 80, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 84,
        fear: 36,
        anger: 89,
        sadness: 82,
        hope: 38,
        curiosity: 41
      }
    },
    {
      date: '2008-06-11',
      country: 'PS',
      description: 'احتفالات وطنية كبرى',
      dcftIndices: { gmi: 82, cfi: 69, hri: 57 },
      emotionalDimensions: {
        joy: 87,
        fear: 45,
        anger: 95,
        sadness: 77,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2008-06-14',
      country: 'FR',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 79, cfi: 62, hri: 55 },
      emotionalDimensions: {
        joy: 86,
        fear: 42,
        anger: 94,
        sadness: 77,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2008-06-17',
      country: 'ZA',
      description: 'تحسن حقوق المرأة',
      dcftIndices: { gmi: 75, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 79,
        fear: 48,
        anger: 87,
        sadness: 70,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2008-06-20',
      country: 'KW',
      description: 'مشروع الإنترنت للجميع',
      dcftIndices: { gmi: 84, cfi: 73, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 49,
        anger: 92,
        sadness: 78,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2008-06-23',
      country: 'RU',
      description: 'توسع شبكات الجيل الخامس',
      dcftIndices: { gmi: 87, cfi: 69, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 44,
        anger: 95,
        sadness: 77,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2008-06-26',
      country: 'JP',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 78, cfi: 71, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 46,
        anger: 93,
        sadness: 78,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2008-06-29',
      country: 'AE',
      description: 'عملية مكافحة الجريمة',
      dcftIndices: { gmi: 71, cfi: 78, hri: 79 },
      emotionalDimensions: {
        joy: 73,
        fear: 62,
        anger: 84,
        sadness: 63,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2008-07-02',
      country: 'PS',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 81, cfi: 65, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 48,
        anger: 88,
        sadness: 77,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2008-07-05',
      country: 'IL',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 73, cfi: 79, hri: 75 },
      emotionalDimensions: {
        joy: 82,
        fear: 58,
        anger: 84,
        sadness: 68,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2008-07-08',
      country: 'DE',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 85, cfi: 67, hri: 54 },
      emotionalDimensions: {
        joy: 83,
        fear: 41,
        anger: 95,
        sadness: 80,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2008-07-11',
      country: 'NG',
      description: 'مشروع الطاقة الشمسية الضخم',
      dcftIndices: { gmi: 88, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 92,
        fear: 41,
        anger: 95,
        sadness: 81,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-07-14',
      country: 'ES',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 86, cfi: 69, hri: 54 },
      emotionalDimensions: {
        joy: 84,
        fear: 42,
        anger: 90,
        sadness: 75,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2008-07-17',
      country: 'ZA',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 77, cfi: 64, hri: 57 },
      emotionalDimensions: {
        joy: 81,
        fear: 40,
        anger: 87,
        sadness: 73,
        hope: 37,
        curiosity: 44
      }
    },
    {
      date: '2008-07-20',
      country: 'SA',
      description: 'عملية مكافحة الجريمة',
      dcftIndices: { gmi: 75, cfi: 76, hri: 76 },
      emotionalDimensions: {
        joy: 74,
        fear: 61,
        anger: 81,
        sadness: 67,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2008-07-23',
      country: 'BR',
      description: 'مشروع التحول الرقمي الحكومي',
      dcftIndices: { gmi: 78, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 87,
        sadness: 78,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2008-07-26',
      country: 'IL',
      description: 'تحسن الخدمات الطبية',
      dcftIndices: { gmi: 83, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 89,
        fear: 41,
        anger: 93,
        sadness: 75,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2008-07-29',
      country: 'TR',
      description: 'تحسن الأمن السيبراني',
      dcftIndices: { gmi: 85, cfi: 75, hri: 64 },
      emotionalDimensions: {
        joy: 86,
        fear: 49,
        anger: 91,
        sadness: 74,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2008-08-01',
      country: 'SA',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 85, cfi: 69, hri: 53 },
      emotionalDimensions: {
        joy: 90,
        fear: 38,
        anger: 92,
        sadness: 79,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2008-08-04',
      country: 'IT',
      description: 'تحسن الأمن السيبراني',
      dcftIndices: { gmi: 84, cfi: 72, hri: 63 },
      emotionalDimensions: {
        joy: 81,
        fear: 51,
        anger: 87,
        sadness: 78,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2008-08-07',
      country: 'IT',
      description: 'تحسن العلاقات الثنائية',
      dcftIndices: { gmi: 80, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 81,
        fear: 56,
        anger: 86,
        sadness: 70,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2008-08-10',
      country: 'PS',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 84, cfi: 65, hri: 61 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 92,
        sadness: 73,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2008-08-13',
      country: 'FR',
      description: 'تشكيل ائتلاف حكومي جديد',
      dcftIndices: { gmi: 74, cfi: 76, hri: 68 },
      emotionalDimensions: {
        joy: 79,
        fear: 59,
        anger: 80,
        sadness: 72,
        hope: 31,
        curiosity: 35
      }
    },
    {
      date: '2008-08-16',
      country: 'SY',
      description: 'انخفاض معدل التضخم',
      dcftIndices: { gmi: 77, cfi: 75, hri: 60 },
      emotionalDimensions: {
        joy: 79,
        fear: 43,
        anger: 87,
        sadness: 73,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2008-08-19',
      country: 'BH',
      description: 'تحسن الاحتياطيات النقدية',
      dcftIndices: { gmi: 83, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 90,
        sadness: 75,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2008-08-22',
      country: 'MX',
      description: 'بطولة رياضية عالمية كبرى',
      dcftIndices: { gmi: 84, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 93,
        fear: 39,
        anger: 92,
        sadness: 77,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2008-08-25',
      country: 'LB',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 80, cfi: 75, hri: 70 },
      emotionalDimensions: {
        joy: 75,
        fear: 56,
        anger: 81,
        sadness: 70,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2008-08-28',
      country: 'IQ',
      description: 'تشكيل ائتلاف حكومي جديد',
      dcftIndices: { gmi: 79, cfi: 72, hri: 68 },
      emotionalDimensions: {
        joy: 78,
        fear: 59,
        anger: 79,
        sadness: 69,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2008-08-31',
      country: 'BH',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 78, cfi: 80, hri: 74 },
      emotionalDimensions: {
        joy: 80,
        fear: 52,
        anger: 89,
        sadness: 66,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2008-09-03',
      country: 'KW',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 81, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 44,
        anger: 91,
        sadness: 77,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2008-09-06',
      country: 'SY',
      description: 'اتفاق بيئي دولي',
      dcftIndices: { gmi: 84, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 83,
        fear: 47,
        anger: 91,
        sadness: 73,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2008-09-09',
      country: 'NG',
      description: 'استضافة الألعاب الأولمبية',
      dcftIndices: { gmi: 85, cfi: 67, hri: 52 },
      emotionalDimensions: {
        joy: 87,
        fear: 37,
        anger: 93,
        sadness: 76,
        hope: 35,
        curiosity: 44
      }
    },
    {
      date: '2008-09-12',
      country: 'KW',
      description: 'مهرجان ثقافي عالمي كبير',
      dcftIndices: { gmi: 89, cfi: 65, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 95,
        sadness: 76,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2008-09-15',
      country: 'UK',
      description: 'إصلاحات إدارية شاملة',
      dcftIndices: { gmi: 79, cfi: 70, hri: 68 },
      emotionalDimensions: {
        joy: 78,
        fear: 56,
        anger: 84,
        sadness: 70,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2008-09-18',
      country: 'QA',
      description: 'فوز فريق وطني بلقب عالمي',
      dcftIndices: { gmi: 84, cfi: 66, hri: 50 },
      emotionalDimensions: {
        joy: 92,
        fear: 33,
        anger: 95,
        sadness: 81,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2008-09-21',
      country: 'FR',
      description: 'مشروع الطاقة الشمسية الضخم',
      dcftIndices: { gmi: 87, cfi: 65, hri: 57 },
      emotionalDimensions: {
        joy: 89,
        fear: 36,
        anger: 95,
        sadness: 80,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2008-09-24',
      country: 'US',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 88, cfi: 62, hri: 50 },
      emotionalDimensions: {
        joy: 89,
        fear: 34,
        anger: 93,
        sadness: 80,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2008-09-27',
      country: 'SA',
      description: 'تحسن معدلات التعليم',
      dcftIndices: { gmi: 78, cfi: 64, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 42,
        anger: 91,
        sadness: 78,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2008-09-30',
      country: 'AE',
      description: 'برنامج محو الأمية الرقمية',
      dcftIndices: { gmi: 77, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 93,
        sadness: 75,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2008-10-03',
      country: 'SA',
      description: 'فوز فريق وطني بلقب عالمي',
      dcftIndices: { gmi: 84, cfi: 61, hri: 50 },
      emotionalDimensions: {
        joy: 86,
        fear: 33,
        anger: 95,
        sadness: 78,
        hope: 36,
        curiosity: 45
      }
    },
    {
      date: '2008-10-06',
      country: 'IL',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 77, cfi: 74, hri: 61 },
      emotionalDimensions: {
        joy: 85,
        fear: 52,
        anger: 90,
        sadness: 73,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2008-10-09',
      country: 'QA',
      description: 'بطولة رياضية عالمية كبرى',
      dcftIndices: { gmi: 86, cfi: 66, hri: 50 },
      emotionalDimensions: {
        joy: 87,
        fear: 37,
        anger: 92,
        sadness: 82,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2008-10-12',
      country: 'US',
      description: 'تحسن الأمن السيبراني',
      dcftIndices: { gmi: 80, cfi: 70, hri: 59 },
      emotionalDimensions: {
        joy: 87,
        fear: 50,
        anger: 85,
        sadness: 74,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2008-10-15',
      country: 'KR',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 74, cfi: 77, hri: 69 },
      emotionalDimensions: {
        joy: 80,
        fear: 54,
        anger: 82,
        sadness: 68,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-10-18',
      country: 'OM',
      description: 'اتفاق على مكافحة الإرهاب',
      dcftIndices: { gmi: 75, cfi: 79, hri: 72 },
      emotionalDimensions: {
        joy: 77,
        fear: 63,
        anger: 79,
        sadness: 66,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2008-10-21',
      country: 'BH',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 83, cfi: 67, hri: 62 },
      emotionalDimensions: {
        joy: 90,
        fear: 41,
        anger: 91,
        sadness: 73,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2008-10-24',
      country: 'UK',
      description: 'اتفاق على الموارد المشتركة',
      dcftIndices: { gmi: 74, cfi: 76, hri: 68 },
      emotionalDimensions: {
        joy: 79,
        fear: 58,
        anger: 81,
        sadness: 73,
        hope: 31,
        curiosity: 35
      }
    },
    {
      date: '2008-10-27',
      country: 'AU',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 77, cfi: 75, hri: 64 },
      emotionalDimensions: {
        joy: 79,
        fear: 47,
        anger: 91,
        sadness: 73,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2008-10-30',
      country: 'RU',
      description: 'استثمار في الحوسبة السحابية',
      dcftIndices: { gmi: 84, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 43,
        anger: 94,
        sadness: 80,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-11-02',
      country: 'BR',
      description: 'تحسن مؤشرات التنوع البيولوجي',
      dcftIndices: { gmi: 79, cfi: 73, hri: 64 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 89,
        sadness: 75,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2008-11-05',
      country: 'DE',
      description: 'برنامج تطوير المناطق الريفية',
      dcftIndices: { gmi: 76, cfi: 70, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 49,
        anger: 85,
        sadness: 72,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2008-11-08',
      country: 'LB',
      description: 'استثمار في الحوسبة السحابية',
      dcftIndices: { gmi: 83, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 43,
        anger: 90,
        sadness: 77,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2008-11-11',
      country: 'EU',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 77, cfi: 74, hri: 64 },
      emotionalDimensions: {
        joy: 82,
        fear: 56,
        anger: 88,
        sadness: 65,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2008-11-14',
      country: 'EG',
      description: 'مشروع الذكاء الاصطناعي الوطني',
      dcftIndices: { gmi: 86, cfi: 62, hri: 55 },
      emotionalDimensions: {
        joy: 91,
        fear: 42,
        anger: 95,
        sadness: 83,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2008-11-17',
      country: 'BR',
      description: 'برنامج تطوير الرياضة الشاملة',
      dcftIndices: { gmi: 80, cfi: 63, hri: 55 },
      emotionalDimensions: {
        joy: 85,
        fear: 38,
        anger: 87,
        sadness: 78,
        hope: 38,
        curiosity: 42
      }
    },
    {
      date: '2008-11-20',
      country: 'CA',
      description: 'حفل موسيقي عالمي الطراز',
      dcftIndices: { gmi: 90, cfi: 66, hri: 52 },
      emotionalDimensions: {
        joy: 87,
        fear: 32,
        anger: 95,
        sadness: 82,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2008-11-23',
      country: 'LB',
      description: 'تحسن الخدمات الطبية',
      dcftIndices: { gmi: 85, cfi: 71, hri: 54 },
      emotionalDimensions: {
        joy: 88,
        fear: 46,
        anger: 95,
        sadness: 76,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2008-11-26',
      country: 'YE',
      description: 'مشروع الاستدامة الشاملة',
      dcftIndices: { gmi: 87, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 94,
        sadness: 77,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2008-11-29',
      country: 'JP',
      description: 'توسع شبكات الجيل الخامس',
      dcftIndices: { gmi: 86, cfi: 65, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 44,
        anger: 88,
        sadness: 76,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2008-12-02',
      country: 'LB',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 90, cfi: 64, hri: 50 },
      emotionalDimensions: {
        joy: 91,
        fear: 35,
        anger: 95,
        sadness: 85,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2008-12-05',
      country: 'YE',
      description: 'انخفاض معدل التضخم',
      dcftIndices: { gmi: 77, cfi: 73, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 86,
        sadness: 77,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2008-12-08',
      country: 'SA',
      description: 'تحسن العلاقات الثنائية',
      dcftIndices: { gmi: 81, cfi: 73, hri: 71 },
      emotionalDimensions: {
        joy: 79,
        fear: 51,
        anger: 85,
        sadness: 68,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2008-12-11',
      country: 'JP',
      description: 'استثمار في الأمن السيبراني',
      dcftIndices: { gmi: 82, cfi: 73, hri: 63 },
      emotionalDimensions: {
        joy: 85,
        fear: 44,
        anger: 94,
        sadness: 73,
        hope: 31,
        curiosity: 42
      }
    },
    {
      date: '2008-12-14',
      country: 'CA',
      description: 'فوز فريق وطني بلقب عالمي',
      dcftIndices: { gmi: 90, cfi: 64, hri: 51 },
      emotionalDimensions: {
        joy: 94,
        fear: 31,
        anger: 95,
        sadness: 86,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2008-12-17',
      country: 'MX',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 80, cfi: 69, hri: 63 },
      emotionalDimensions: {
        joy: 83,
        fear: 47,
        anger: 87,
        sadness: 73,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2008-12-20',
      country: 'KR',
      description: 'تحسن الاستقرار الأمني العام',
      dcftIndices: { gmi: 82, cfi: 72, hri: 72 },
      emotionalDimensions: {
        joy: 82,
        fear: 50,
        anger: 85,
        sadness: 69,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2008-12-23',
      country: 'TR',
      description: 'افتتاح حاضنة تكنولوجية',
      dcftIndices: { gmi: 86, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 39,
        anger: 88,
        sadness: 72,
        hope: 37,
        curiosity: 45
      }
    },
    {
      date: '2008-12-26',
      country: 'MX',
      description: 'مشروع الذكاء الاصطناعي الوطني',
      dcftIndices: { gmi: 90, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 95,
        sadness: 82,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2008-12-29',
      country: 'ZA',
      description: 'تحسن الأمن الغذائي',
      dcftIndices: { gmi: 78, cfi: 72, hri: 65 },
      emotionalDimensions: {
        joy: 84,
        fear: 49,
        anger: 92,
        sadness: 72,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2009-01-01',
      country: 'SA',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 77, cfi: 71, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 39,
        anger: 88,
        sadness: 78,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2009-01-04',
      country: 'YE',
      description: 'مشروع حماية الشعاب المرجانية',
      dcftIndices: { gmi: 83, cfi: 68, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 45,
        anger: 93,
        sadness: 73,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2009-01-07',
      country: 'KR',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 89, cfi: 62, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 34,
        anger: 93,
        sadness: 83,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2009-01-10',
      country: 'PS',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 84, cfi: 71, hri: 64 },
      emotionalDimensions: {
        joy: 82,
        fear: 41,
        anger: 89,
        sadness: 76,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2009-01-13',
      country: 'IR',
      description: 'برنامج دعم الأسر الفقيرة',
      dcftIndices: { gmi: 77, cfi: 69, hri: 65 },
      emotionalDimensions: {
        joy: 76,
        fear: 55,
        anger: 83,
        sadness: 67,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2009-01-16',
      country: 'RU',
      description: 'حماية المحميات الطبيعية',
      dcftIndices: { gmi: 82, cfi: 71, hri: 58 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 93,
        sadness: 74,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2009-01-19',
      country: 'IT',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 83, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 89,
        fear: 38,
        anger: 95,
        sadness: 83,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2009-01-22',
      country: 'JO',
      description: 'مشروع التحول الرقمي الحكومي',
      dcftIndices: { gmi: 81, cfi: 74, hri: 57 },
      emotionalDimensions: {
        joy: 81,
        fear: 48,
        anger: 86,
        sadness: 76,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2009-01-25',
      country: 'KR',
      description: 'تحسن الاحتياطيات النقدية',
      dcftIndices: { gmi: 82, cfi: 73, hri: 62 },
      emotionalDimensions: {
        joy: 90,
        fear: 48,
        anger: 90,
        sadness: 74,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2009-01-28',
      country: 'IT',
      description: 'تحسن معدلات التعليم',
      dcftIndices: { gmi: 80, cfi: 67, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 43,
        anger: 92,
        sadness: 79,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2009-01-31',
      country: 'BR',
      description: 'تشكيل ائتلاف حكومي جديد',
      dcftIndices: { gmi: 76, cfi: 76, hri: 67 },
      emotionalDimensions: {
        joy: 78,
        fear: 57,
        anger: 85,
        sadness: 71,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2009-02-03',
      country: 'SY',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 78, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 82,
        fear: 46,
        anger: 95,
        sadness: 80,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2009-02-06',
      country: 'TR',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 76, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 80,
        fear: 52,
        anger: 93,
        sadness: 75,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2009-02-09',
      country: 'DE',
      description: 'اتفاق على الحدود',
      dcftIndices: { gmi: 81, cfi: 71, hri: 69 },
      emotionalDimensions: {
        joy: 75,
        fear: 53,
        anger: 81,
        sadness: 67,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2009-02-12',
      country: 'MX',
      description: 'اتفاق على تقليل الانبعاثات',
      dcftIndices: { gmi: 75, cfi: 72, hri: 66 },
      emotionalDimensions: {
        joy: 86,
        fear: 54,
        anger: 87,
        sadness: 75,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2009-02-15',
      country: 'CN',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 82, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 51,
        anger: 93,
        sadness: 72,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2009-02-18',
      country: 'IN',
      description: 'تحسن العلاقات الثنائية',
      dcftIndices: { gmi: 81, cfi: 73, hri: 66 },
      emotionalDimensions: {
        joy: 83,
        fear: 55,
        anger: 89,
        sadness: 71,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2009-02-21',
      country: 'BH',
      description: 'استثمار في البيانات الضخمة',
      dcftIndices: { gmi: 80, cfi: 64, hri: 61 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 91,
        sadness: 73,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2009-02-24',
      country: 'IR',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 89, cfi: 63, hri: 54 },
      emotionalDimensions: {
        joy: 92,
        fear: 34,
        anger: 95,
        sadness: 83,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2009-02-27',
      country: 'FR',
      description: 'اتفاق على الحدود',
      dcftIndices: { gmi: 77, cfi: 72, hri: 69 },
      emotionalDimensions: {
        joy: 81,
        fear: 48,
        anger: 88,
        sadness: 72,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2009-03-02',
      country: 'LB',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 79, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 88,
        sadness: 73,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2009-03-05',
      country: 'US',
      description: 'تحسن الخدمات الطبية',
      dcftIndices: { gmi: 85, cfi: 71, hri: 53 },
      emotionalDimensions: {
        joy: 88,
        fear: 44,
        anger: 95,
        sadness: 76,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2009-03-08',
      country: 'DE',
      description: 'تحسن جودة الهواء بشكل ملحوظ',
      dcftIndices: { gmi: 84, cfi: 66, hri: 62 },
      emotionalDimensions: {
        joy: 89,
        fear: 44,
        anger: 94,
        sadness: 78,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2009-03-11',
      country: 'AE',
      description: 'حفل موسيقي عالمي الطراز',
      dcftIndices: { gmi: 87, cfi: 64, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 33,
        anger: 94,
        sadness: 85,
        hope: 37,
        curiosity: 41
      }
    },
    {
      date: '2009-03-14',
      country: 'CN',
      description: 'اتفاق على الحدود',
      dcftIndices: { gmi: 74, cfi: 75, hri: 67 },
      emotionalDimensions: {
        joy: 77,
        fear: 52,
        anger: 87,
        sadness: 68,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2009-03-17',
      country: 'RU',
      description: 'استقرار أسعار السلع الأساسية',
      dcftIndices: { gmi: 81, cfi: 73, hri: 68 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 89,
        sadness: 76,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2009-03-20',
      country: 'UK',
      description: 'إصلاحات إدارية شاملة',
      dcftIndices: { gmi: 78, cfi: 73, hri: 65 },
      emotionalDimensions: {
        joy: 80,
        fear: 53,
        anger: 89,
        sadness: 67,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2009-03-23',
      country: 'EG',
      description: 'برنامج تطوير الرياضة الشاملة',
      dcftIndices: { gmi: 81, cfi: 70, hri: 55 },
      emotionalDimensions: {
        joy: 87,
        fear: 37,
        anger: 90,
        sadness: 79,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2009-03-26',
      country: 'JO',
      description: 'اتفاق على التعاون الدفاعي',
      dcftIndices: { gmi: 79, cfi: 77, hri: 70 },
      emotionalDimensions: {
        joy: 80,
        fear: 55,
        anger: 83,
        sadness: 71,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2009-03-29',
      country: 'IR',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 75, cfi: 78, hri: 69 },
      emotionalDimensions: {
        joy: 76,
        fear: 53,
        anger: 87,
        sadness: 66,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2009-04-01',
      country: 'CA',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 80, cfi: 68, hri: 60 },
      emotionalDimensions: {
        joy: 87,
        fear: 36,
        anger: 91,
        sadness: 76,
        hope: 37,
        curiosity: 44
      }
    },
    {
      date: '2009-04-04',
      country: 'SA',
      description: 'توقيع معاهدة سلام تاريخية',
      dcftIndices: { gmi: 83, cfi: 76, hri: 63 },
      emotionalDimensions: {
        joy: 78,
        fear: 50,
        anger: 89,
        sadness: 71,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2009-04-07',
      country: 'BR',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 73, cfi: 72, hri: 67 },
      emotionalDimensions: {
        joy: 75,
        fear: 60,
        anger: 85,
        sadness: 66,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2009-04-10',
      country: 'LB',
      description: 'افتتاح مركز أبحاث تكنولوجي',
      dcftIndices: { gmi: 82, cfi: 72, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 42,
        anger: 87,
        sadness: 79,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2009-04-13',
      country: 'MX',
      description: 'افتتاح حاضنة تكنولوجية',
      dcftIndices: { gmi: 80, cfi: 65, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 39,
        anger: 87,
        sadness: 77,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2009-04-16',
      country: 'DE',
      description: 'تحسن مؤشرات التنوع البيولوجي',
      dcftIndices: { gmi: 83, cfi: 73, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 46,
        anger: 94,
        sadness: 78,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2009-04-19',
      country: 'EU',
      description: 'اتفاق على تقليل الانبعاثات',
      dcftIndices: { gmi: 79, cfi: 75, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 53,
        anger: 92,
        sadness: 71,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2009-04-22',
      country: 'TR',
      description: 'تحسن جودة الهواء بشكل ملحوظ',
      dcftIndices: { gmi: 84, cfi: 71, hri: 55 },
      emotionalDimensions: {
        joy: 82,
        fear: 41,
        anger: 87,
        sadness: 77,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2009-04-25',
      country: 'IR',
      description: 'افتتاح حاضنة تكنولوجية',
      dcftIndices: { gmi: 86, cfi: 67, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 40,
        anger: 91,
        sadness: 74,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2009-04-28',
      country: 'AU',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 86, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 87,
        fear: 46,
        anger: 94,
        sadness: 80,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2009-05-01',
      country: 'MX',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 83, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 36,
        anger: 95,
        sadness: 78,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2009-05-04',
      country: 'IQ',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 85, cfi: 75, hri: 66 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 90,
        sadness: 75,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2009-05-07',
      country: 'LB',
      description: 'مشروع حماية الشعاب المرجانية',
      dcftIndices: { gmi: 78, cfi: 73, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 49,
        anger: 86,
        sadness: 75,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2009-05-10',
      country: 'ZA',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 84, cfi: 67, hri: 62 },
      emotionalDimensions: {
        joy: 84,
        fear: 47,
        anger: 91,
        sadness: 74,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2009-05-13',
      country: 'CA',
      description: 'عملية مكافحة الجريمة',
      dcftIndices: { gmi: 76, cfi: 84, hri: 72 },
      emotionalDimensions: {
        joy: 74,
        fear: 64,
        anger: 82,
        sadness: 64,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2009-05-16',
      country: 'OM',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 80, cfi: 65, hri: 52 },
      emotionalDimensions: {
        joy: 83,
        fear: 39,
        anger: 94,
        sadness: 82,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2009-05-19',
      country: 'AU',
      description: 'إصلاحات إدارية شاملة',
      dcftIndices: { gmi: 82, cfi: 69, hri: 64 },
      emotionalDimensions: {
        joy: 79,
        fear: 54,
        anger: 84,
        sadness: 74,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2009-05-22',
      country: 'KW',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 83, cfi: 66, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 45,
        anger: 92,
        sadness: 71,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2009-05-25',
      country: 'UK',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 78, cfi: 76, hri: 68 },
      emotionalDimensions: {
        joy: 77,
        fear: 58,
        anger: 88,
        sadness: 65,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2009-05-28',
      country: 'EG',
      description: 'افتتاح ملعب رياضي حديث',
      dcftIndices: { gmi: 81, cfi: 67, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 39,
        anger: 95,
        sadness: 81,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2009-05-31',
      country: 'YE',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 86, cfi: 64, hri: 54 },
      emotionalDimensions: {
        joy: 90,
        fear: 39,
        anger: 90,
        sadness: 81,
        hope: 36,
        curiosity: 40
      }
    },
    {
      date: '2009-06-03',
      country: 'EG',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 73, cfi: 71, hri: 70 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 82,
        sadness: 72,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2009-06-06',
      country: 'IL',
      description: 'استضافة الألعاب الأولمبية',
      dcftIndices: { gmi: 81, cfi: 68, hri: 50 },
      emotionalDimensions: {
        joy: 92,
        fear: 38,
        anger: 92,
        sadness: 77,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2009-06-09',
      country: 'IL',
      description: 'مشروع الاستدامة الشاملة',
      dcftIndices: { gmi: 81, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 84,
        fear: 44,
        anger: 94,
        sadness: 72,
        hope: 31,
        curiosity: 42
      }
    },
    {
      date: '2009-06-12',
      country: 'IN',
      description: 'تحسن الأمن الغذائي',
      dcftIndices: { gmi: 84, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 85,
        sadness: 77,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2009-06-15',
      country: 'EU',
      description: 'استثمار في الأمن السيبراني',
      dcftIndices: { gmi: 78, cfi: 66, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 89,
        sadness: 75,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2009-06-18',
      country: 'NG',
      description: 'استثمار في البيانات الضخمة',
      dcftIndices: { gmi: 80, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 89,
        fear: 38,
        anger: 89,
        sadness: 76,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2009-06-21',
      country: 'IQ',
      description: 'انخفاض معدل التضخم',
      dcftIndices: { gmi: 76, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 47,
        anger: 84,
        sadness: 73,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2009-06-24',
      country: 'SA',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 82, cfi: 68, hri: 54 },
      emotionalDimensions: {
        joy: 81,
        fear: 38,
        anger: 88,
        sadness: 77,
        hope: 37,
        curiosity: 43
      }
    },
    {
      date: '2009-06-27',
      country: 'OM',
      description: 'استقرار أسعار السلع الأساسية',
      dcftIndices: { gmi: 80, cfi: 76, hri: 63 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 89,
        sadness: 72,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2009-06-30',
      country: 'AE',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 73, cfi: 75, hri: 75 },
      emotionalDimensions: {
        joy: 81,
        fear: 56,
        anger: 85,
        sadness: 68,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2009-07-03',
      country: 'JP',
      description: 'بطولة رياضية عالمية كبرى',
      dcftIndices: { gmi: 90, cfi: 64, hri: 50 },
      emotionalDimensions: {
        joy: 93,
        fear: 35,
        anger: 93,
        sadness: 84,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2009-07-06',
      country: 'EU',
      description: 'اتفاق أمني إقليمي شامل',
      dcftIndices: { gmi: 80, cfi: 72, hri: 71 },
      emotionalDimensions: {
        joy: 83,
        fear: 54,
        anger: 88,
        sadness: 68,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2009-07-09',
      country: 'ES',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 81, cfi: 71, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 49,
        anger: 90,
        sadness: 74,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2009-07-12',
      country: 'EU',
      description: 'اتفاق بيئي دولي',
      dcftIndices: { gmi: 84, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 80,
        fear: 44,
        anger: 93,
        sadness: 75,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2009-07-15',
      country: 'AU',
      description: 'استثمار في الحوسبة السحابية',
      dcftIndices: { gmi: 86, cfi: 71, hri: 54 },
      emotionalDimensions: {
        joy: 87,
        fear: 38,
        anger: 89,
        sadness: 80,
        hope: 37,
        curiosity: 41
      }
    },
    {
      date: '2009-07-18',
      country: 'FR',
      description: 'مشروع الطاقة المتجددة الوطني',
      dcftIndices: { gmi: 80, cfi: 64, hri: 61 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 91,
        sadness: 76,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2009-07-21',
      country: 'ES',
      description: 'مهرجان ثقافي عالمي كبير',
      dcftIndices: { gmi: 81, cfi: 69, hri: 51 },
      emotionalDimensions: {
        joy: 88,
        fear: 41,
        anger: 92,
        sadness: 83,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2009-07-24',
      country: 'BR',
      description: 'حفل موسيقي عالمي الطراز',
      dcftIndices: { gmi: 88, cfi: 67, hri: 55 },
      emotionalDimensions: {
        joy: 87,
        fear: 40,
        anger: 95,
        sadness: 79,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2009-07-27',
      country: 'CA',
      description: 'برنامج دعم الأسر الفقيرة',
      dcftIndices: { gmi: 81, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 81,
        fear: 51,
        anger: 84,
        sadness: 67,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2009-07-30',
      country: 'JP',
      description: 'تحسن الاحتياطيات النقدية',
      dcftIndices: { gmi: 79, cfi: 67, hri: 64 },
      emotionalDimensions: {
        joy: 87,
        fear: 40,
        anger: 93,
        sadness: 80,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2009-08-02',
      country: 'IQ',
      description: 'برنامج تطوير المناطق الريفية',
      dcftIndices: { gmi: 80, cfi: 73, hri: 64 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 92,
        sadness: 71,
        hope: 31,
        curiosity: 42
      }
    },
    {
      date: '2009-08-05',
      country: 'UK',
      description: 'اتفاق على الموارد المشتركة',
      dcftIndices: { gmi: 78, cfi: 73, hri: 69 },
      emotionalDimensions: {
        joy: 81,
        fear: 56,
        anger: 82,
        sadness: 70,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2009-08-08',
      country: 'LB',
      description: 'تحسن معدلات التعليم',
      dcftIndices: { gmi: 78, cfi: 67, hri: 56 },
      emotionalDimensions: {
        joy: 81,
        fear: 41,
        anger: 88,
        sadness: 72,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2009-08-11',
      country: 'IT',
      description: 'تحسن مؤشرات الأسهم',
      dcftIndices: { gmi: 85, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 80,
        fear: 46,
        anger: 91,
        sadness: 70,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2009-08-14',
      country: 'CA',
      description: 'استثمار في الأمن السيبراني',
      dcftIndices: { gmi: 82, cfi: 73, hri: 56 },
      emotionalDimensions: {
        joy: 85,
        fear: 48,
        anger: 95,
        sadness: 74,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2009-08-17',
      country: 'AE',
      description: 'توسع شبكات الجيل الخامس',
      dcftIndices: { gmi: 83, cfi: 64, hri: 60 },
      emotionalDimensions: {
        joy: 90,
        fear: 41,
        anger: 88,
        sadness: 73,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2009-08-20',
      country: 'EU',
      description: 'استثمار في البيانات الضخمة',
      dcftIndices: { gmi: 84, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 46,
        anger: 91,
        sadness: 78,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2009-08-23',
      country: 'JP',
      description: 'مشروع إعادة التشجير الواسع',
      dcftIndices: { gmi: 84, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 87,
        fear: 38,
        anger: 89,
        sadness: 74,
        hope: 37,
        curiosity: 44
      }
    },
    {
      date: '2009-08-26',
      country: 'KW',
      description: 'تحسن الاستقرار السياسي العام',
      dcftIndices: { gmi: 81, cfi: 72, hri: 56 },
      emotionalDimensions: {
        joy: 80,
        fear: 51,
        anger: 90,
        sadness: 73,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2009-08-29',
      country: 'DE',
      description: 'تحسن الخدمات الطبية',
      dcftIndices: { gmi: 84, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 90,
        fear: 46,
        anger: 95,
        sadness: 80,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2009-09-01',
      country: 'BR',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 80, cfi: 69, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 88,
        sadness: 80,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2009-09-04',
      country: 'OM',
      description: 'مشروع الذكاء الاصطناعي الوطني',
      dcftIndices: { gmi: 90, cfi: 69, hri: 54 },
      emotionalDimensions: {
        joy: 88,
        fear: 41,
        anger: 95,
        sadness: 77,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2009-09-07',
      country: 'QA',
      description: 'زيادة الاستثمارات الأجنبية المباشرة',
      dcftIndices: { gmi: 78, cfi: 72, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 47,
        anger: 93,
        sadness: 74,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2009-09-10',
      country: 'TR',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 75, cfi: 78, hri: 73 },
      emotionalDimensions: {
        joy: 77,
        fear: 59,
        anger: 82,
        sadness: 68,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2009-09-13',
      country: 'JP',
      description: 'مهرجان الفنون الشعبية',
      dcftIndices: { gmi: 79, cfi: 64, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 43,
        anger: 91,
        sadness: 73,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2009-09-16',
      country: 'IQ',
      description: 'استقرار سعر الفائدة',
      dcftIndices: { gmi: 78, cfi: 73, hri: 68 },
      emotionalDimensions: {
        joy: 83,
        fear: 48,
        anger: 90,
        sadness: 71,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2009-09-19',
      country: 'UK',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 81, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 80,
        fear: 44,
        anger: 92,
        sadness: 76,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2009-09-22',
      country: 'OM',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 84, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 43,
        anger: 87,
        sadness: 80,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2009-09-25',
      country: 'IL',
      description: 'تحسن جودة الهواء بشكل ملحوظ',
      dcftIndices: { gmi: 81, cfi: 73, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 91,
        sadness: 79,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2009-09-28',
      country: 'LB',
      description: 'اتفاق بيئي دولي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 84,
        fear: 49,
        anger: 88,
        sadness: 73,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2009-10-01',
      country: 'DE',
      description: 'افتتاح مركز أبحاث تكنولوجي',
      dcftIndices: { gmi: 80, cfi: 66, hri: 62 },
      emotionalDimensions: {
        joy: 86,
        fear: 43,
        anger: 92,
        sadness: 78,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2009-10-04',
      country: 'US',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 79, cfi: 67, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 38,
        anger: 87,
        sadness: 75,
        hope: 38,
        curiosity: 44
      }
    },
    {
      date: '2009-10-07',
      country: 'IT',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 54 },
      emotionalDimensions: {
        joy: 85,
        fear: 37,
        anger: 95,
        sadness: 85,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2009-10-10',
      country: 'IQ',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 80, cfi: 78, hri: 69 },
      emotionalDimensions: {
        joy: 83,
        fear: 58,
        anger: 84,
        sadness: 70,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2009-10-13',
      country: 'FR',
      description: 'اتفاق أمني إقليمي شامل',
      dcftIndices: { gmi: 74, cfi: 79, hri: 74 },
      emotionalDimensions: {
        joy: 75,
        fear: 59,
        anger: 88,
        sadness: 72,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2009-10-16',
      country: 'QA',
      description: 'تحسن الخدمات الطبية',
      dcftIndices: { gmi: 79, cfi: 71, hri: 54 },
      emotionalDimensions: {
        joy: 90,
        fear: 47,
        anger: 95,
        sadness: 74,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2009-10-19',
      country: 'AE',
      description: 'مهرجان الفنون الشعبية',
      dcftIndices: { gmi: 79, cfi: 67, hri: 53 },
      emotionalDimensions: {
        joy: 90,
        fear: 46,
        anger: 93,
        sadness: 76,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2009-10-22',
      country: 'CA',
      description: 'مشروع الاستدامة الشاملة',
      dcftIndices: { gmi: 84, cfi: 68, hri: 60 },
      emotionalDimensions: {
        joy: 87,
        fear: 40,
        anger: 94,
        sadness: 75,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2009-10-25',
      country: 'LB',
      description: 'تحسن مؤشرات الأسهم',
      dcftIndices: { gmi: 83, cfi: 73, hri: 66 },
      emotionalDimensions: {
        joy: 87,
        fear: 50,
        anger: 87,
        sadness: 76,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2009-10-28',
      country: 'TR',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 81, cfi: 72, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 87,
        sadness: 72,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2009-10-31',
      country: 'IR',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 76, cfi: 73, hri: 68 },
      emotionalDimensions: {
        joy: 76,
        fear: 57,
        anger: 85,
        sadness: 66,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2009-11-03',
      country: 'QA',
      description: 'حماية المحميات الطبيعية',
      dcftIndices: { gmi: 84, cfi: 73, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 45,
        anger: 88,
        sadness: 78,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2009-11-06',
      country: 'NG',
      description: 'مشروع الطاقة الشمسية الضخم',
      dcftIndices: { gmi: 83, cfi: 63, hri: 54 },
      emotionalDimensions: {
        joy: 86,
        fear: 39,
        anger: 94,
        sadness: 79,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2009-11-09',
      country: 'MX',
      description: 'اتفاق على التعاون الدفاعي',
      dcftIndices: { gmi: 78, cfi: 76, hri: 70 },
      emotionalDimensions: {
        joy: 74,
        fear: 54,
        anger: 83,
        sadness: 65,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2009-11-12',
      country: 'IQ',
      description: 'تحسن الاستقرار الأمني العام',
      dcftIndices: { gmi: 75, cfi: 70, hri: 72 },
      emotionalDimensions: {
        joy: 77,
        fear: 51,
        anger: 90,
        sadness: 67,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2009-11-15',
      country: 'KW',
      description: 'بطولة رياضية عالمية كبرى',
      dcftIndices: { gmi: 84, cfi: 59, hri: 53 },
      emotionalDimensions: {
        joy: 93,
        fear: 34,
        anger: 93,
        sadness: 82,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2009-11-18',
      country: 'EG',
      description: 'توقيع معاهدة سلام تاريخية',
      dcftIndices: { gmi: 80, cfi: 72, hri: 63 },
      emotionalDimensions: {
        joy: 81,
        fear: 56,
        anger: 91,
        sadness: 67,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2009-11-21',
      country: 'ES',
      description: 'تحسن حقوق المرأة',
      dcftIndices: { gmi: 81, cfi: 73, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 55,
        anger: 84,
        sadness: 74,
        hope: 31,
        curiosity: 36
      }
    },
    {
      date: '2009-11-24',
      country: 'US',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 72, cfi: 75, hri: 66 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 85,
        sadness: 69,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2009-11-27',
      country: 'IN',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 75, cfi: 74, hri: 70 },
      emotionalDimensions: {
        joy: 78,
        fear: 54,
        anger: 83,
        sadness: 68,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2009-11-30',
      country: 'KW',
      description: 'مشروع الطاقة المتجددة الوطني',
      dcftIndices: { gmi: 83, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 86,
        fear: 40,
        anger: 89,
        sadness: 77,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2009-12-03',
      country: 'CA',
      description: 'إصلاحات إدارية شاملة',
      dcftIndices: { gmi: 78, cfi: 68, hri: 68 },
      emotionalDimensions: {
        joy: 79,
        fear: 57,
        anger: 88,
        sadness: 72,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2009-12-06',
      country: 'SY',
      description: 'عملية مكافحة الجريمة',
      dcftIndices: { gmi: 70, cfi: 82, hri: 79 },
      emotionalDimensions: {
        joy: 79,
        fear: 62,
        anger: 81,
        sadness: 68,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2009-12-09',
      country: 'JP',
      description: 'توقيع عقد تجاري ضخم',
      dcftIndices: { gmi: 83, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 89,
        fear: 46,
        anger: 92,
        sadness: 79,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2009-12-12',
      country: 'ES',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 79, cfi: 69, hri: 54 },
      emotionalDimensions: {
        joy: 84,
        fear: 49,
        anger: 92,
        sadness: 76,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2009-12-15',
      country: 'AU',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 78, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 81,
        fear: 42,
        anger: 92,
        sadness: 72,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2009-12-18',
      country: 'OM',
      description: 'افتتاح حاضنة تكنولوجية',
      dcftIndices: { gmi: 85, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 90,
        fear: 44,
        anger: 89,
        sadness: 75,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2009-12-21',
      country: 'MA',
      description: 'تحسن التعاون الأمني الدولي',
      dcftIndices: { gmi: 75, cfi: 73, hri: 72 },
      emotionalDimensions: {
        joy: 78,
        fear: 54,
        anger: 89,
        sadness: 74,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2009-12-24',
      country: 'YE',
      description: 'توقيع عقد تجاري ضخم',
      dcftIndices: { gmi: 83, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 89,
        fear: 42,
        anger: 95,
        sadness: 78,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2009-12-27',
      country: 'IN',
      description: 'افتتاح مركز أبحاث تكنولوجي',
      dcftIndices: { gmi: 87, cfi: 71, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 88,
        sadness: 79,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2009-12-30',
      country: 'TR',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 79, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 88,
        fear: 44,
        anger: 88,
        sadness: 76,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-01-02',
      country: 'JO',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 81, cfi: 71, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 95,
        sadness: 72,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2010-01-05',
      country: 'FR',
      description: 'تشكيل ائتلاف حكومي جديد',
      dcftIndices: { gmi: 72, cfi: 75, hri: 72 },
      emotionalDimensions: {
        joy: 74,
        fear: 56,
        anger: 83,
        sadness: 66,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2010-01-08',
      country: 'KW',
      description: 'مهرجان الفنون الشعبية',
      dcftIndices: { gmi: 81, cfi: 64, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 38,
        anger: 90,
        sadness: 73,
        hope: 36,
        curiosity: 45
      }
    },
    {
      date: '2010-01-11',
      country: 'NG',
      description: 'بطولة رياضية عالمية كبرى',
      dcftIndices: { gmi: 83, cfi: 60, hri: 54 },
      emotionalDimensions: {
        joy: 89,
        fear: 40,
        anger: 92,
        sadness: 78,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-01-14',
      country: 'OM',
      description: 'تحسن الاحتياطيات النقدية',
      dcftIndices: { gmi: 84, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 87,
        fear: 45,
        anger: 95,
        sadness: 77,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-01-17',
      country: 'MX',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 82, cfi: 63, hri: 58 },
      emotionalDimensions: {
        joy: 90,
        fear: 36,
        anger: 94,
        sadness: 75,
        hope: 35,
        curiosity: 45
      }
    },
    {
      date: '2010-01-20',
      country: 'LB',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 79, cfi: 66, hri: 55 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 89,
        sadness: 73,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2010-01-23',
      country: 'IR',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 82, cfi: 67, hri: 62 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 89,
        sadness: 72,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-01-26',
      country: 'TR',
      description: 'تحسن جودة الهواء بشكل ملحوظ',
      dcftIndices: { gmi: 78, cfi: 66, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 43,
        anger: 92,
        sadness: 74,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2010-01-29',
      country: 'YE',
      description: 'مشروع الذكاء الاصطناعي الوطني',
      dcftIndices: { gmi: 88, cfi: 62, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 38,
        anger: 95,
        sadness: 75,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2010-02-01',
      country: 'IL',
      description: 'استثمار في الأمن السيبراني',
      dcftIndices: { gmi: 79, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 41,
        anger: 95,
        sadness: 78,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2010-02-04',
      country: 'NG',
      description: 'استثمار في الحوسبة السحابية',
      dcftIndices: { gmi: 83, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 38,
        anger: 94,
        sadness: 76,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-02-07',
      country: 'KW',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 80, cfi: 74, hri: 65 },
      emotionalDimensions: {
        joy: 76,
        fear: 56,
        anger: 84,
        sadness: 67,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-02-10',
      country: 'BH',
      description: 'تحسن معدلات التعليم',
      dcftIndices: { gmi: 79, cfi: 65, hri: 62 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 95,
        sadness: 79,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2010-02-13',
      country: 'JP',
      description: 'توسع شبكات الجيل الخامس',
      dcftIndices: { gmi: 87, cfi: 67, hri: 54 },
      emotionalDimensions: {
        joy: 86,
        fear: 44,
        anger: 88,
        sadness: 75,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-02-16',
      country: 'IL',
      description: 'افتتاح حاضنة تكنولوجية',
      dcftIndices: { gmi: 82, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 92,
        sadness: 73,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2010-02-19',
      country: 'JP',
      description: 'فوز فريق وطني بلقب عالمي',
      dcftIndices: { gmi: 89, cfi: 60, hri: 50 },
      emotionalDimensions: {
        joy: 91,
        fear: 37,
        anger: 92,
        sadness: 86,
        hope: 36,
        curiosity: 39
      }
    },
    {
      date: '2010-02-22',
      country: 'US',
      description: 'تحسن الاستقرار السياسي العام',
      dcftIndices: { gmi: 79, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 87,
        fear: 49,
        anger: 94,
        sadness: 72,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-02-25',
      country: 'CA',
      description: 'تحسن العلاقات الثنائية',
      dcftIndices: { gmi: 75, cfi: 76, hri: 66 },
      emotionalDimensions: {
        joy: 78,
        fear: 53,
        anger: 81,
        sadness: 72,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2010-02-28',
      country: 'EU',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 74, cfi: 77, hri: 66 },
      emotionalDimensions: {
        joy: 76,
        fear: 55,
        anger: 83,
        sadness: 70,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-03-03',
      country: 'TR',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 80, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 87,
        sadness: 79,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2010-03-06',
      country: 'CA',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 84, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 38,
        anger: 95,
        sadness: 82,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-03-09',
      country: 'KR',
      description: 'استثمار في البيانات الضخمة',
      dcftIndices: { gmi: 82, cfi: 64, hri: 59 },
      emotionalDimensions: {
        joy: 84,
        fear: 40,
        anger: 91,
        sadness: 78,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2010-03-12',
      country: 'LB',
      description: 'نمو القطاع الخاص',
      dcftIndices: { gmi: 83, cfi: 68, hri: 60 },
      emotionalDimensions: {
        joy: 81,
        fear: 46,
        anger: 87,
        sadness: 76,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2010-03-15',
      country: 'KR',
      description: 'اتفاق بيئي دولي',
      dcftIndices: { gmi: 82, cfi: 74, hri: 61 },
      emotionalDimensions: {
        joy: 88,
        fear: 45,
        anger: 92,
        sadness: 76,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2010-03-18',
      country: 'IQ',
      description: 'تحسن العلاقات الثنائية',
      dcftIndices: { gmi: 78, cfi: 74, hri: 70 },
      emotionalDimensions: {
        joy: 75,
        fear: 55,
        anger: 88,
        sadness: 69,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-03-21',
      country: 'UK',
      description: 'تحسن الاستقرار الأمني العام',
      dcftIndices: { gmi: 81, cfi: 78, hri: 67 },
      emotionalDimensions: {
        joy: 81,
        fear: 54,
        anger: 87,
        sadness: 75,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-03-24',
      country: 'ES',
      description: 'برنامج تطوير الرياضة الشاملة',
      dcftIndices: { gmi: 83, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 84,
        fear: 39,
        anger: 89,
        sadness: 74,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2010-03-27',
      country: 'TR',
      description: 'عملية مكافحة الجريمة',
      dcftIndices: { gmi: 78, cfi: 81, hri: 77 },
      emotionalDimensions: {
        joy: 77,
        fear: 64,
        anger: 85,
        sadness: 71,
        hope: 30,
        curiosity: 33
      }
    },
    {
      date: '2010-03-30',
      country: 'IL',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 78, cfi: 69, hri: 66 },
      emotionalDimensions: {
        joy: 77,
        fear: 53,
        anger: 80,
        sadness: 72,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2010-04-02',
      country: 'IT',
      description: 'اتفاق على تقليل الانبعاثات',
      dcftIndices: { gmi: 81, cfi: 70, hri: 63 },
      emotionalDimensions: {
        joy: 78,
        fear: 52,
        anger: 87,
        sadness: 74,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2010-04-05',
      country: 'PS',
      description: 'مهرجان الفنون الشعبية',
      dcftIndices: { gmi: 79, cfi: 63, hri: 58 },
      emotionalDimensions: {
        joy: 89,
        fear: 39,
        anger: 91,
        sadness: 81,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2010-04-08',
      country: 'IN',
      description: 'مشروع الطاقة الشمسية الضخم',
      dcftIndices: { gmi: 86, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 86,
        fear: 42,
        anger: 90,
        sadness: 78,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-04-11',
      country: 'PS',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 86, cfi: 75, hri: 64 },
      emotionalDimensions: {
        joy: 82,
        fear: 48,
        anger: 90,
        sadness: 79,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2010-04-14',
      country: 'FR',
      description: 'اتفاق على تقليل الانبعاثات',
      dcftIndices: { gmi: 75, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 78,
        fear: 52,
        anger: 88,
        sadness: 76,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-04-17',
      country: 'IT',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 72, cfi: 79, hri: 71 },
      emotionalDimensions: {
        joy: 81,
        fear: 55,
        anger: 88,
        sadness: 73,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-04-20',
      country: 'ZA',
      description: 'تحسن الاحتياطيات النقدية',
      dcftIndices: { gmi: 86, cfi: 66, hri: 57 },
      emotionalDimensions: {
        joy: 87,
        fear: 44,
        anger: 92,
        sadness: 76,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2010-04-23',
      country: 'US',
      description: 'تحسن التعاون الأمني الدولي',
      dcftIndices: { gmi: 80, cfi: 78, hri: 70 },
      emotionalDimensions: {
        joy: 80,
        fear: 56,
        anger: 82,
        sadness: 71,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2010-04-26',
      country: 'PS',
      description: 'احتفالات وطنية كبرى',
      dcftIndices: { gmi: 87, cfi: 63, hri: 56 },
      emotionalDimensions: {
        joy: 89,
        fear: 42,
        anger: 93,
        sadness: 78,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-04-29',
      country: 'IN',
      description: 'مشروع التحول الرقمي الحكومي',
      dcftIndices: { gmi: 80, cfi: 72, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 43,
        anger: 86,
        sadness: 73,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2010-05-02',
      country: 'FR',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 52,
        anger: 92,
        sadness: 77,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-05-05',
      country: 'DE',
      description: 'معرض فني دولي مهم',
      dcftIndices: { gmi: 79, cfi: 69, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 44,
        anger: 87,
        sadness: 77,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2010-05-08',
      country: 'RU',
      description: 'مشروع الإنترنت للجميع',
      dcftIndices: { gmi: 79, cfi: 72, hri: 58 },
      emotionalDimensions: {
        joy: 79,
        fear: 52,
        anger: 85,
        sadness: 72,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2010-05-11',
      country: 'CN',
      description: 'تحسن الحوار السياسي',
      dcftIndices: { gmi: 82, cfi: 72, hri: 66 },
      emotionalDimensions: {
        joy: 77,
        fear: 52,
        anger: 89,
        sadness: 71,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-05-14',
      country: 'IQ',
      description: 'تشكيل ائتلاف حكومي جديد',
      dcftIndices: { gmi: 77, cfi: 73, hri: 73 },
      emotionalDimensions: {
        joy: 73,
        fear: 53,
        anger: 79,
        sadness: 71,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2010-05-17',
      country: 'EU',
      description: 'افتتاح متحف حضارة',
      dcftIndices: { gmi: 79, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 44,
        anger: 93,
        sadness: 77,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2010-05-20',
      country: 'AU',
      description: 'مشروع الذكاء الاصطناعي الوطني',
      dcftIndices: { gmi: 82, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 93,
        fear: 39,
        anger: 95,
        sadness: 83,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-05-23',
      country: 'AU',
      description: 'انخفاض معدل التضخم',
      dcftIndices: { gmi: 82, cfi: 68, hri: 63 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 87,
        sadness: 71,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2010-05-26',
      country: 'YE',
      description: 'نمو القطاع الخاص',
      dcftIndices: { gmi: 83, cfi: 66, hri: 65 },
      emotionalDimensions: {
        joy: 84,
        fear: 47,
        anger: 87,
        sadness: 71,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-05-29',
      country: 'ZA',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 86, cfi: 72, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 46,
        anger: 95,
        sadness: 75,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-06-01',
      country: 'SA',
      description: 'مشروع الذكاء الاصطناعي الوطني',
      dcftIndices: { gmi: 84, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 92,
        fear: 39,
        anger: 95,
        sadness: 76,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2010-06-04',
      country: 'CN',
      description: 'تحسن مؤشرات الأسهم',
      dcftIndices: { gmi: 77, cfi: 70, hri: 67 },
      emotionalDimensions: {
        joy: 85,
        fear: 49,
        anger: 87,
        sadness: 77,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2010-06-07',
      country: 'SA',
      description: 'توقيع معاهدة سلام تاريخية',
      dcftIndices: { gmi: 77, cfi: 69, hri: 70 },
      emotionalDimensions: {
        joy: 78,
        fear: 53,
        anger: 89,
        sadness: 68,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-06-10',
      country: 'YE',
      description: 'تحسن حقوق المرأة',
      dcftIndices: { gmi: 77, cfi: 73, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 85,
        sadness: 73,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-06-13',
      country: 'KR',
      description: 'اتفاق على الموارد المشتركة',
      dcftIndices: { gmi: 79, cfi: 72, hri: 65 },
      emotionalDimensions: {
        joy: 75,
        fear: 58,
        anger: 87,
        sadness: 66,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-06-16',
      country: 'IR',
      description: 'تحسن مؤشرات الأسهم',
      dcftIndices: { gmi: 83, cfi: 75, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 46,
        anger: 91,
        sadness: 74,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2010-06-19',
      country: 'ES',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 79, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 82,
        fear: 51,
        anger: 86,
        sadness: 75,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2010-06-22',
      country: 'ZA',
      description: 'اتفاق على الحدود',
      dcftIndices: { gmi: 75, cfi: 74, hri: 66 },
      emotionalDimensions: {
        joy: 75,
        fear: 52,
        anger: 86,
        sadness: 72,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-06-25',
      country: 'PS',
      description: 'اتفاق على التعاون الدفاعي',
      dcftIndices: { gmi: 75, cfi: 80, hri: 75 },
      emotionalDimensions: {
        joy: 77,
        fear: 57,
        anger: 85,
        sadness: 64,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-06-28',
      country: 'ZA',
      description: 'تحسن مؤشرات التنوع البيولوجي',
      dcftIndices: { gmi: 80, cfi: 68, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 46,
        anger: 87,
        sadness: 78,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2010-07-01',
      country: 'IR',
      description: 'تحسن حقوق المرأة',
      dcftIndices: { gmi: 80, cfi: 73, hri: 66 },
      emotionalDimensions: {
        joy: 80,
        fear: 53,
        anger: 89,
        sadness: 70,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-07-04',
      country: 'CN',
      description: 'تحسن مؤشرات التنوع البيولوجي',
      dcftIndices: { gmi: 85, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 80,
        fear: 51,
        anger: 92,
        sadness: 75,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-07-07',
      country: 'EU',
      description: 'احتفالات وطنية كبرى',
      dcftIndices: { gmi: 86, cfi: 66, hri: 60 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 95,
        sadness: 74,
        hope: 30,
        curiosity: 41
      }
    },
    {
      date: '2010-07-10',
      country: 'IL',
      description: 'مهرجان ثقافي عالمي كبير',
      dcftIndices: { gmi: 82, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 91,
        fear: 37,
        anger: 95,
        sadness: 77,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-07-13',
      country: 'KW',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 74, cfi: 71, hri: 70 },
      emotionalDimensions: {
        joy: 80,
        fear: 55,
        anger: 81,
        sadness: 70,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2010-07-16',
      country: 'QA',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 80, cfi: 64, hri: 61 },
      emotionalDimensions: {
        joy: 80,
        fear: 44,
        anger: 94,
        sadness: 72,
        hope: 31,
        curiosity: 42
      }
    },
    {
      date: '2010-07-19',
      country: 'JP',
      description: 'تحسن الاحتياطيات النقدية',
      dcftIndices: { gmi: 80, cfi: 65, hri: 61 },
      emotionalDimensions: {
        joy: 85,
        fear: 46,
        anger: 89,
        sadness: 73,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-07-22',
      country: 'YE',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 80, cfi: 70, hri: 69 },
      emotionalDimensions: {
        joy: 74,
        fear: 57,
        anger: 81,
        sadness: 67,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-07-25',
      country: 'UK',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 83, cfi: 73, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 47,
        anger: 94,
        sadness: 74,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-07-28',
      country: 'ZA',
      description: 'اتفاق على الحدود',
      dcftIndices: { gmi: 77, cfi: 69, hri: 62 },
      emotionalDimensions: {
        joy: 75,
        fear: 56,
        anger: 89,
        sadness: 70,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-07-31',
      country: 'IN',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 85, cfi: 64, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 40,
        anger: 93,
        sadness: 78,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-08-03',
      country: 'BH',
      description: 'افتتاح متحف حضارة',
      dcftIndices: { gmi: 85, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 86,
        fear: 45,
        anger: 88,
        sadness: 80,
        hope: 34,
        curiosity: 38
      }
    },
    {
      date: '2010-08-06',
      country: 'TR',
      description: 'مشروع الذكاء الاصطناعي الوطني',
      dcftIndices: { gmi: 84, cfi: 63, hri: 52 },
      emotionalDimensions: {
        joy: 90,
        fear: 43,
        anger: 91,
        sadness: 79,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-08-09',
      country: 'MA',
      description: 'اتفاق على الموارد المشتركة',
      dcftIndices: { gmi: 80, cfi: 70, hri: 67 },
      emotionalDimensions: {
        joy: 79,
        fear: 52,
        anger: 85,
        sadness: 66,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2010-08-12',
      country: 'AE',
      description: 'افتتاح متحف حضارة',
      dcftIndices: { gmi: 85, cfi: 71, hri: 55 },
      emotionalDimensions: {
        joy: 82,
        fear: 46,
        anger: 93,
        sadness: 73,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2010-08-15',
      country: 'BR',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 81, cfi: 72, hri: 69 },
      emotionalDimensions: {
        joy: 76,
        fear: 57,
        anger: 84,
        sadness: 74,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2010-08-18',
      country: 'FR',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 78, cfi: 66, hri: 59 },
      emotionalDimensions: {
        joy: 89,
        fear: 43,
        anger: 92,
        sadness: 77,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-08-21',
      country: 'CN',
      description: 'تحسن مؤشرات الأسهم',
      dcftIndices: { gmi: 83, cfi: 73, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 50,
        anger: 93,
        sadness: 72,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-08-24',
      country: 'IL',
      description: 'اتفاق على تقليل الانبعاثات',
      dcftIndices: { gmi: 78, cfi: 76, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 90,
        sadness: 72,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-08-27',
      country: 'IQ',
      description: 'تحسن التعاون الأمني الدولي',
      dcftIndices: { gmi: 75, cfi: 77, hri: 72 },
      emotionalDimensions: {
        joy: 83,
        fear: 51,
        anger: 82,
        sadness: 67,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-08-30',
      country: 'PS',
      description: 'مشروع الإنترنت للجميع',
      dcftIndices: { gmi: 84, cfi: 75, hri: 64 },
      emotionalDimensions: {
        joy: 86,
        fear: 51,
        anger: 92,
        sadness: 70,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-09-02',
      country: 'TR',
      description: 'تحسن الأمن السيبراني',
      dcftIndices: { gmi: 80, cfi: 74, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 85,
        sadness: 77,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2010-09-05',
      country: 'JO',
      description: 'برنامج تطوير المناطق الريفية',
      dcftIndices: { gmi: 79, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 86,
        fear: 47,
        anger: 92,
        sadness: 78,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-09-08',
      country: 'SA',
      description: 'تحسن الأمن الغذائي',
      dcftIndices: { gmi: 79, cfi: 68, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 52,
        anger: 90,
        sadness: 76,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2010-09-11',
      country: 'IQ',
      description: 'استقرار سعر الفائدة',
      dcftIndices: { gmi: 80, cfi: 71, hri: 63 },
      emotionalDimensions: {
        joy: 77,
        fear: 50,
        anger: 87,
        sadness: 67,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2010-09-14',
      country: 'AE',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 77, cfi: 74, hri: 68 },
      emotionalDimensions: {
        joy: 77,
        fear: 57,
        anger: 88,
        sadness: 70,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-09-17',
      country: 'EU',
      description: 'اتفاق على الحدود',
      dcftIndices: { gmi: 78, cfi: 70, hri: 69 },
      emotionalDimensions: {
        joy: 81,
        fear: 49,
        anger: 84,
        sadness: 70,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2010-09-20',
      country: 'IQ',
      description: 'اتفاق على الحدود',
      dcftIndices: { gmi: 74, cfi: 76, hri: 66 },
      emotionalDimensions: {
        joy: 82,
        fear: 52,
        anger: 82,
        sadness: 70,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-09-23',
      country: 'EU',
      description: 'توقيع عقد تجاري ضخم',
      dcftIndices: { gmi: 83, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 42,
        anger: 93,
        sadness: 73,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2010-09-26',
      country: 'ES',
      description: 'بطولة رياضية عالمية كبرى',
      dcftIndices: { gmi: 85, cfi: 59, hri: 50 },
      emotionalDimensions: {
        joy: 89,
        fear: 34,
        anger: 95,
        sadness: 77,
        hope: 36,
        curiosity: 45
      }
    },
    {
      date: '2010-09-29',
      country: 'IL',
      description: 'برنامج تطوير الرياضة الشاملة',
      dcftIndices: { gmi: 79, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 89,
        fear: 40,
        anger: 87,
        sadness: 81,
        hope: 37,
        curiosity: 40
      }
    },
    {
      date: '2010-10-02',
      country: 'BH',
      description: 'إنجاز رياضي قياسي عالمي',
      dcftIndices: { gmi: 89, cfi: 65, hri: 57 },
      emotionalDimensions: {
        joy: 92,
        fear: 39,
        anger: 95,
        sadness: 79,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-10-05',
      country: 'OM',
      description: 'احتفال بالتراث الثقافي',
      dcftIndices: { gmi: 81, cfi: 63, hri: 59 },
      emotionalDimensions: {
        joy: 83,
        fear: 38,
        anger: 92,
        sadness: 74,
        hope: 35,
        curiosity: 44
      }
    },
    {
      date: '2010-10-08',
      country: 'EG',
      description: 'تحسن مؤشرات التنوع البيولوجي',
      dcftIndices: { gmi: 79, cfi: 74, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 49,
        anger: 93,
        sadness: 76,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-10-11',
      country: 'IL',
      description: 'فوز فريق وطني بلقب عالمي',
      dcftIndices: { gmi: 90, cfi: 66, hri: 50 },
      emotionalDimensions: {
        joy: 94,
        fear: 36,
        anger: 93,
        sadness: 80,
        hope: 36,
        curiosity: 42
      }
    },
    {
      date: '2010-10-14',
      country: 'OM',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 77, cfi: 72, hri: 63 },
      emotionalDimensions: {
        joy: 82,
        fear: 50,
        anger: 87,
        sadness: 79,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2010-10-17',
      country: 'TR',
      description: 'تحسن مؤشرات الأسهم',
      dcftIndices: { gmi: 82, cfi: 72, hri: 66 },
      emotionalDimensions: {
        joy: 88,
        fear: 46,
        anger: 92,
        sadness: 78,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-10-20',
      country: 'NG',
      description: 'مهرجان ثقافي عالمي كبير',
      dcftIndices: { gmi: 82, cfi: 61, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 36,
        anger: 94,
        sadness: 82,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2010-10-23',
      country: 'FR',
      description: 'تشكيل ائتلاف حكومي جديد',
      dcftIndices: { gmi: 76, cfi: 71, hri: 71 },
      emotionalDimensions: {
        joy: 76,
        fear: 54,
        anger: 82,
        sadness: 66,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2010-10-26',
      country: 'OM',
      description: 'توسع شبكات الجيل الخامس',
      dcftIndices: { gmi: 82, cfi: 69, hri: 60 },
      emotionalDimensions: {
        joy: 90,
        fear: 45,
        anger: 93,
        sadness: 77,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2010-10-29',
      country: 'BH',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 84, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 50,
        anger: 92,
        sadness: 75,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-11-01',
      country: 'BR',
      description: 'افتتاح مركز أبحاث تكنولوجي',
      dcftIndices: { gmi: 85, cfi: 73, hri: 55 },
      emotionalDimensions: {
        joy: 86,
        fear: 47,
        anger: 94,
        sadness: 73,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2010-11-04',
      country: 'IR',
      description: 'تحسن الاحتياطيات النقدية',
      dcftIndices: { gmi: 87, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 82,
        fear: 40,
        anger: 91,
        sadness: 72,
        hope: 35,
        curiosity: 44
      }
    },
    {
      date: '2010-11-07',
      country: 'EU',
      description: 'مشروع التحول الرقمي الحكومي',
      dcftIndices: { gmi: 77, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 94,
        sadness: 74,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2010-11-10',
      country: 'MA',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 84, cfi: 73, hri: 58 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 87,
        sadness: 76,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2010-11-13',
      country: 'CA',
      description: 'عملية أمنية ناجحة',
      dcftIndices: { gmi: 75, cfi: 76, hri: 72 },
      emotionalDimensions: {
        joy: 79,
        fear: 59,
        anger: 82,
        sadness: 67,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2010-11-16',
      country: 'FR',
      description: 'تحسن الخدمات الطبية',
      dcftIndices: { gmi: 82, cfi: 68, hri: 53 },
      emotionalDimensions: {
        joy: 86,
        fear: 42,
        anger: 90,
        sadness: 79,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2010-11-19',
      country: 'MX',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 83, cfi: 71, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 45,
        anger: 90,
        sadness: 78,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2010-11-22',
      country: 'EG',
      description: 'مشروع حماية الشعاب المرجانية',
      dcftIndices: { gmi: 80, cfi: 69, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 49,
        anger: 86,
        sadness: 71,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2010-11-25',
      country: 'FR',
      description: 'تحسن الأمن الغذائي',
      dcftIndices: { gmi: 77, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 49,
        anger: 93,
        sadness: 75,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-11-28',
      country: 'KW',
      description: 'اتفاق على التعاون الدفاعي',
      dcftIndices: { gmi: 80, cfi: 81, hri: 76 },
      emotionalDimensions: {
        joy: 82,
        fear: 57,
        anger: 82,
        sadness: 68,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2010-12-01',
      country: 'LB',
      description: 'تحسن جودة الهواء بشكل ملحوظ',
      dcftIndices: { gmi: 79, cfi: 73, hri: 57 },
      emotionalDimensions: {
        joy: 86,
        fear: 43,
        anger: 89,
        sadness: 73,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2010-12-04',
      country: 'IT',
      description: 'استضافة الألعاب الأولمبية',
      dcftIndices: { gmi: 84, cfi: 60, hri: 55 },
      emotionalDimensions: {
        joy: 86,
        fear: 39,
        anger: 92,
        sadness: 82,
        hope: 35,
        curiosity: 40
      }
    },
    {
      date: '2010-12-07',
      country: 'QA',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 85, cfi: 74, hri: 63 },
      emotionalDimensions: {
        joy: 83,
        fear: 40,
        anger: 93,
        sadness: 74,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2010-12-10',
      country: 'ES',
      description: 'حفل موسيقي عالمي الطراز',
      dcftIndices: { gmi: 86, cfi: 62, hri: 55 },
      emotionalDimensions: {
        joy: 92,
        fear: 39,
        anger: 95,
        sadness: 80,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2010-12-13',
      country: 'IR',
      description: 'إصلاحات إدارية شاملة',
      dcftIndices: { gmi: 79, cfi: 71, hri: 67 },
      emotionalDimensions: {
        joy: 83,
        fear: 54,
        anger: 82,
        sadness: 74,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2010-12-16',
      country: 'DE',
      description: 'مشروع إعادة التشجير الواسع',
      dcftIndices: { gmi: 81, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 83,
        fear: 45,
        anger: 95,
        sadness: 80,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2010-12-19',
      country: 'FR',
      description: 'احتفالات وطنية كبرى',
      dcftIndices: { gmi: 84, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 40,
        anger: 89,
        sadness: 73,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2010-12-22',
      country: 'IR',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 73, cfi: 74, hri: 69 },
      emotionalDimensions: {
        joy: 75,
        fear: 58,
        anger: 80,
        sadness: 72,
        hope: 31,
        curiosity: 35
      }
    },
    {
      date: '2010-12-25',
      country: 'IN',
      description: 'استثمار في الحوسبة السحابية',
      dcftIndices: { gmi: 82, cfi: 68, hri: 54 },
      emotionalDimensions: {
        joy: 85,
        fear: 43,
        anger: 88,
        sadness: 80,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2010-12-28',
      country: 'NG',
      description: 'استقرار أسعار السلع الأساسية',
      dcftIndices: { gmi: 75, cfi: 76, hri: 62 },
      emotionalDimensions: {
        joy: 82,
        fear: 49,
        anger: 87,
        sadness: 74,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2010-12-31',
      country: 'DE',
      description: 'توقيع معاهدة سلام تاريخية',
      dcftIndices: { gmi: 75, cfi: 77, hri: 64 },
      emotionalDimensions: {
        joy: 85,
        fear: 52,
        anger: 91,
        sadness: 68,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2011-01-03',
      country: 'AE',
      description: 'إنجاز رياضي قياسي عالمي',
      dcftIndices: { gmi: 88, cfi: 64, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 38,
        anger: 94,
        sadness: 78,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2011-01-06',
      country: 'IQ',
      description: 'مشروع التحول الرقمي الحكومي',
      dcftIndices: { gmi: 82, cfi: 75, hri: 59 },
      emotionalDimensions: {
        joy: 82,
        fear: 49,
        anger: 91,
        sadness: 74,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-01-09',
      country: 'LB',
      description: 'احتفالات وطنية كبرى',
      dcftIndices: { gmi: 81, cfi: 70, hri: 55 },
      emotionalDimensions: {
        joy: 87,
        fear: 46,
        anger: 94,
        sadness: 79,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-01-12',
      country: 'JP',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 80, cfi: 69, hri: 55 },
      emotionalDimensions: {
        joy: 88,
        fear: 43,
        anger: 95,
        sadness: 77,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2011-01-15',
      country: 'BR',
      description: 'مشروع حماية الشعاب المرجانية',
      dcftIndices: { gmi: 76, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 89,
        sadness: 76,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-01-18',
      country: 'TR',
      description: 'إنجاز رياضي قياسي عالمي',
      dcftIndices: { gmi: 87, cfi: 62, hri: 54 },
      emotionalDimensions: {
        joy: 90,
        fear: 35,
        anger: 95,
        sadness: 80,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2011-01-21',
      country: 'BH',
      description: 'استقرار أسعار السلع الأساسية',
      dcftIndices: { gmi: 77, cfi: 71, hri: 66 },
      emotionalDimensions: {
        joy: 85,
        fear: 50,
        anger: 86,
        sadness: 71,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2011-01-24',
      country: 'AU',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 75, cfi: 73, hri: 68 },
      emotionalDimensions: {
        joy: 81,
        fear: 51,
        anger: 85,
        sadness: 73,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2011-01-27',
      country: 'BH',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 75, cfi: 76, hri: 69 },
      emotionalDimensions: {
        joy: 82,
        fear: 54,
        anger: 85,
        sadness: 66,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2011-01-30',
      country: 'ES',
      description: 'مشروع الطاقة المتجددة الوطني',
      dcftIndices: { gmi: 85, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 86,
        fear: 43,
        anger: 95,
        sadness: 77,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2011-02-02',
      country: 'RU',
      description: 'افتتاح بورصة جديدة',
      dcftIndices: { gmi: 86, cfi: 71, hri: 67 },
      emotionalDimensions: {
        joy: 90,
        fear: 48,
        anger: 89,
        sadness: 80,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2011-02-05',
      country: 'IL',
      description: 'تحسن جودة الهواء بشكل ملحوظ',
      dcftIndices: { gmi: 78, cfi: 70, hri: 57 },
      emotionalDimensions: {
        joy: 81,
        fear: 39,
        anger: 92,
        sadness: 77,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2011-02-08',
      country: 'RU',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 50 },
      emotionalDimensions: {
        joy: 86,
        fear: 35,
        anger: 95,
        sadness: 84,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-02-11',
      country: 'IN',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 88, cfi: 65, hri: 50 },
      emotionalDimensions: {
        joy: 90,
        fear: 31,
        anger: 95,
        sadness: 79,
        hope: 37,
        curiosity: 45
      }
    },
    {
      date: '2011-02-14',
      country: 'EU',
      description: 'مشروع الاستدامة الشاملة',
      dcftIndices: { gmi: 80, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 42,
        anger: 90,
        sadness: 79,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2011-02-17',
      country: 'ZA',
      description: 'عملية مكافحة الجريمة',
      dcftIndices: { gmi: 70, cfi: 79, hri: 80 },
      emotionalDimensions: {
        joy: 75,
        fear: 58,
        anger: 79,
        sadness: 63,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2011-02-20',
      country: 'SY',
      description: 'استثمار في الأمن السيبراني',
      dcftIndices: { gmi: 85, cfi: 71, hri: 56 },
      emotionalDimensions: {
        joy: 82,
        fear: 42,
        anger: 89,
        sadness: 80,
        hope: 35,
        curiosity: 39
      }
    },
    {
      date: '2011-02-23',
      country: 'IR',
      description: 'مشروع الطاقة الشمسية الضخم',
      dcftIndices: { gmi: 85, cfi: 63, hri: 52 },
      emotionalDimensions: {
        joy: 86,
        fear: 36,
        anger: 95,
        sadness: 79,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2011-02-26',
      country: 'RU',
      description: 'افتتاح ملعب رياضي حديث',
      dcftIndices: { gmi: 82, cfi: 64, hri: 54 },
      emotionalDimensions: {
        joy: 89,
        fear: 43,
        anger: 95,
        sadness: 83,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2011-03-01',
      country: 'MA',
      description: 'مشروع حماية الشعاب المرجانية',
      dcftIndices: { gmi: 80, cfi: 72, hri: 62 },
      emotionalDimensions: {
        joy: 81,
        fear: 51,
        anger: 87,
        sadness: 71,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-03-04',
      country: 'OM',
      description: 'برنامج رعاية الأطفال',
      dcftIndices: { gmi: 85, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 92,
        sadness: 74,
        hope: 33,
        curiosity: 42
      }
    },
    {
      date: '2011-03-07',
      country: 'BH',
      description: 'زيادة الصادرات بنسبة كبيرة',
      dcftIndices: { gmi: 80, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 89,
        fear: 48,
        anger: 93,
        sadness: 74,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-03-10',
      country: 'IR',
      description: 'تحسن التعاون الأمني الدولي',
      dcftIndices: { gmi: 80, cfi: 74, hri: 69 },
      emotionalDimensions: {
        joy: 81,
        fear: 57,
        anger: 83,
        sadness: 68,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-03-13',
      country: 'FR',
      description: 'تحسن معدلات التعليم',
      dcftIndices: { gmi: 79, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 94,
        sadness: 78,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-03-16',
      country: 'ZA',
      description: 'مهرجان الفنون الشعبية',
      dcftIndices: { gmi: 84, cfi: 70, hri: 55 },
      emotionalDimensions: {
        joy: 83,
        fear: 40,
        anger: 92,
        sadness: 78,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-03-19',
      country: 'EG',
      description: 'مهرجان الفنون الشعبية',
      dcftIndices: { gmi: 83, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 89,
        fear: 39,
        anger: 91,
        sadness: 78,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2011-03-22',
      country: 'DE',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 76, cfi: 69, hri: 65 },
      emotionalDimensions: {
        joy: 84,
        fear: 53,
        anger: 88,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-03-25',
      country: 'TR',
      description: 'استضافة الألعاب الأولمبية',
      dcftIndices: { gmi: 87, cfi: 66, hri: 52 },
      emotionalDimensions: {
        joy: 86,
        fear: 34,
        anger: 94,
        sadness: 80,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2011-03-28',
      country: 'DE',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 74, cfi: 72, hri: 68 },
      emotionalDimensions: {
        joy: 77,
        fear: 54,
        anger: 80,
        sadness: 69,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2011-03-31',
      country: 'IT',
      description: 'معرض فني دولي مهم',
      dcftIndices: { gmi: 83, cfi: 66, hri: 62 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 87,
        sadness: 74,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2011-04-03',
      country: 'IL',
      description: 'إطلاق منصة تجارة إلكترونية',
      dcftIndices: { gmi: 89, cfi: 68, hri: 54 },
      emotionalDimensions: {
        joy: 91,
        fear: 44,
        anger: 92,
        sadness: 75,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2011-04-06',
      country: 'CN',
      description: 'استثمار في الأمن السيبراني',
      dcftIndices: { gmi: 79, cfi: 67, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 42,
        anger: 93,
        sadness: 77,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-04-09',
      country: 'JO',
      description: 'تحسن معدلات التعليم',
      dcftIndices: { gmi: 79, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 82,
        fear: 41,
        anger: 92,
        sadness: 75,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2011-04-12',
      country: 'CN',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 76, cfi: 71, hri: 60 },
      emotionalDimensions: {
        joy: 83,
        fear: 51,
        anger: 90,
        sadness: 71,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-04-15',
      country: 'AU',
      description: 'إنجاز رياضي قياسي عالمي',
      dcftIndices: { gmi: 82, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 35,
        anger: 92,
        sadness: 83,
        hope: 37,
        curiosity: 41
      }
    },
    {
      date: '2011-04-18',
      country: 'YE',
      description: 'استضافة الألعاب الأولمبية',
      dcftIndices: { gmi: 88, cfi: 62, hri: 52 },
      emotionalDimensions: {
        joy: 89,
        fear: 33,
        anger: 92,
        sadness: 82,
        hope: 38,
        curiosity: 43
      }
    },
    {
      date: '2011-04-21',
      country: 'ES',
      description: 'تحسن الخدمات الطبية',
      dcftIndices: { gmi: 82, cfi: 63, hri: 61 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 90,
        sadness: 81,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2011-04-24',
      country: 'OM',
      description: 'تشكيل ائتلاف حكومي جديد',
      dcftIndices: { gmi: 79, cfi: 73, hri: 70 },
      emotionalDimensions: {
        joy: 76,
        fear: 54,
        anger: 87,
        sadness: 72,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-04-27',
      country: 'DE',
      description: 'تشكيل ائتلاف حكومي جديد',
      dcftIndices: { gmi: 76, cfi: 73, hri: 70 },
      emotionalDimensions: {
        joy: 77,
        fear: 55,
        anger: 80,
        sadness: 66,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-04-30',
      country: 'LB',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 73, cfi: 69, hri: 68 },
      emotionalDimensions: {
        joy: 77,
        fear: 52,
        anger: 81,
        sadness: 71,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2011-05-03',
      country: 'EU',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 80, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 36,
        anger: 93,
        sadness: 75,
        hope: 36,
        curiosity: 45
      }
    },
    {
      date: '2011-05-06',
      country: 'AE',
      description: 'استقرار سعر الفائدة',
      dcftIndices: { gmi: 77, cfi: 70, hri: 67 },
      emotionalDimensions: {
        joy: 78,
        fear: 49,
        anger: 86,
        sadness: 72,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-05-09',
      country: 'OM',
      description: 'استثمار في الأمن السيبراني',
      dcftIndices: { gmi: 84, cfi: 68, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 46,
        anger: 90,
        sadness: 79,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2011-05-12',
      country: 'FR',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 77, cfi: 68, hri: 60 },
      emotionalDimensions: {
        joy: 86,
        fear: 48,
        anger: 89,
        sadness: 69,
        hope: 32,
        curiosity: 42
      }
    },
    {
      date: '2011-05-15',
      country: 'MA',
      description: 'برنامج دعم الأسر الفقيرة',
      dcftIndices: { gmi: 76, cfi: 77, hri: 60 },
      emotionalDimensions: {
        joy: 79,
        fear: 55,
        anger: 86,
        sadness: 75,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-05-18',
      country: 'UK',
      description: 'تحسن العلاقات الثنائية',
      dcftIndices: { gmi: 73, cfi: 77, hri: 66 },
      emotionalDimensions: {
        joy: 75,
        fear: 50,
        anger: 89,
        sadness: 74,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2011-05-21',
      country: 'CN',
      description: 'توقيع معاهدة سلام تاريخية',
      dcftIndices: { gmi: 80, cfi: 71, hri: 67 },
      emotionalDimensions: {
        joy: 85,
        fear: 55,
        anger: 86,
        sadness: 71,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-05-24',
      country: 'DE',
      description: 'افتتاح مركز أبحاث تكنولوجي',
      dcftIndices: { gmi: 83, cfi: 68, hri: 63 },
      emotionalDimensions: {
        joy: 86,
        fear: 41,
        anger: 94,
        sadness: 77,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-05-27',
      country: 'BH',
      description: 'افتتاح حاضنة تكنولوجية',
      dcftIndices: { gmi: 83, cfi: 70, hri: 62 },
      emotionalDimensions: {
        joy: 82,
        fear: 42,
        anger: 90,
        sadness: 75,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2011-05-30',
      country: 'YE',
      description: 'انخفاض معدل التضخم',
      dcftIndices: { gmi: 79, cfi: 68, hri: 67 },
      emotionalDimensions: {
        joy: 84,
        fear: 48,
        anger: 88,
        sadness: 74,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2011-06-02',
      country: 'RU',
      description: 'اتفاق على التعاون الدفاعي',
      dcftIndices: { gmi: 77, cfi: 79, hri: 68 },
      emotionalDimensions: {
        joy: 81,
        fear: 54,
        anger: 84,
        sadness: 69,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-06-05',
      country: 'CA',
      description: 'اتفاق على قضية خلافية',
      dcftIndices: { gmi: 72, cfi: 71, hri: 72 },
      emotionalDimensions: {
        joy: 77,
        fear: 54,
        anger: 88,
        sadness: 73,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-06-08',
      country: 'JP',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 90, cfi: 63, hri: 54 },
      emotionalDimensions: {
        joy: 88,
        fear: 32,
        anger: 95,
        sadness: 77,
        hope: 37,
        curiosity: 46
      }
    },
    {
      date: '2011-06-11',
      country: 'YE',
      description: 'اتفاق بيئي دولي',
      dcftIndices: { gmi: 85, cfi: 68, hri: 63 },
      emotionalDimensions: {
        joy: 80,
        fear: 48,
        anger: 92,
        sadness: 77,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-06-14',
      country: 'NG',
      description: 'توسيع التمثيل البرلماني',
      dcftIndices: { gmi: 80, cfi: 75, hri: 67 },
      emotionalDimensions: {
        joy: 82,
        fear: 55,
        anger: 86,
        sadness: 67,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-06-17',
      country: 'SY',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 74, cfi: 75, hri: 74 },
      emotionalDimensions: {
        joy: 83,
        fear: 52,
        anger: 84,
        sadness: 72,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2011-06-20',
      country: 'IT',
      description: 'تحسن الأمن السيبراني',
      dcftIndices: { gmi: 83, cfi: 70, hri: 64 },
      emotionalDimensions: {
        joy: 80,
        fear: 46,
        anger: 86,
        sadness: 73,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-06-23',
      country: 'IN',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 81, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 37,
        anger: 95,
        sadness: 80,
        hope: 34,
        curiosity: 42
      }
    },
    {
      date: '2011-06-26',
      country: 'KR',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 78, cfi: 66, hri: 58 },
      emotionalDimensions: {
        joy: 83,
        fear: 44,
        anger: 89,
        sadness: 74,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-06-29',
      country: 'PS',
      description: 'إنجاز رياضي قياسي عالمي',
      dcftIndices: { gmi: 85, cfi: 60, hri: 50 },
      emotionalDimensions: {
        joy: 87,
        fear: 37,
        anger: 95,
        sadness: 83,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2011-07-02',
      country: 'DE',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 81, cfi: 66, hri: 59 },
      emotionalDimensions: {
        joy: 81,
        fear: 50,
        anger: 87,
        sadness: 78,
        hope: 32,
        curiosity: 36
      }
    },
    {
      date: '2011-07-05',
      country: 'IR',
      description: 'اتفاق على التعاون الدفاعي',
      dcftIndices: { gmi: 75, cfi: 73, hri: 68 },
      emotionalDimensions: {
        joy: 76,
        fear: 57,
        anger: 86,
        sadness: 71,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-07-08',
      country: 'SA',
      description: 'مشروع إعادة التشجير الواسع',
      dcftIndices: { gmi: 80, cfi: 72, hri: 55 },
      emotionalDimensions: {
        joy: 85,
        fear: 41,
        anger: 89,
        sadness: 73,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2011-07-11',
      country: 'LB',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 80, cfi: 65, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 41,
        anger: 95,
        sadness: 74,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2011-07-14',
      country: 'AE',
      description: 'مشروع الطاقة الشمسية الضخم',
      dcftIndices: { gmi: 89, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 89,
        fear: 39,
        anger: 93,
        sadness: 75,
        hope: 34,
        curiosity: 43
      }
    },
    {
      date: '2011-07-17',
      country: 'SY',
      description: 'برنامج تطوير الرياضة الشاملة',
      dcftIndices: { gmi: 82, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 81,
        fear: 45,
        anger: 91,
        sadness: 81,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2011-07-20',
      country: 'PS',
      description: 'استثمار في الأمن السيبراني',
      dcftIndices: { gmi: 84, cfi: 67, hri: 64 },
      emotionalDimensions: {
        joy: 87,
        fear: 48,
        anger: 91,
        sadness: 72,
        hope: 31,
        curiosity: 40
      }
    },
    {
      date: '2011-07-23',
      country: 'SA',
      description: 'توسع شبكات الجيل الخامس',
      dcftIndices: { gmi: 86, cfi: 68, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 39,
        anger: 89,
        sadness: 79,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2011-07-26',
      country: 'TR',
      description: 'تحسن معدلات التعليم',
      dcftIndices: { gmi: 84, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 81,
        fear: 41,
        anger: 92,
        sadness: 77,
        hope: 34,
        curiosity: 41
      }
    },
    {
      date: '2011-07-29',
      country: 'BH',
      description: 'برنامج دعم الأسر الفقيرة',
      dcftIndices: { gmi: 80, cfi: 70, hri: 65 },
      emotionalDimensions: {
        joy: 78,
        fear: 48,
        anger: 83,
        sadness: 70,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-08-01',
      country: 'UK',
      description: 'اتفاق على تقليل الانبعاثات',
      dcftIndices: { gmi: 78, cfi: 70, hri: 63 },
      emotionalDimensions: {
        joy: 79,
        fear: 47,
        anger: 87,
        sadness: 72,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-08-04',
      country: 'BR',
      description: 'مشروع الطاقة المتجددة الوطني',
      dcftIndices: { gmi: 86, cfi: 65, hri: 56 },
      emotionalDimensions: {
        joy: 89,
        fear: 37,
        anger: 95,
        sadness: 76,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2011-08-07',
      country: 'SY',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 87, cfi: 64, hri: 56 },
      emotionalDimensions: {
        joy: 91,
        fear: 32,
        anger: 95,
        sadness: 84,
        hope: 37,
        curiosity: 42
      }
    },
    {
      date: '2011-08-10',
      country: 'FR',
      description: 'اتفاق بيئي دولي',
      dcftIndices: { gmi: 80, cfi: 73, hri: 62 },
      emotionalDimensions: {
        joy: 84,
        fear: 47,
        anger: 87,
        sadness: 74,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-08-13',
      country: 'ES',
      description: 'بطولة شباب عالمية',
      dcftIndices: { gmi: 83, cfi: 68, hri: 53 },
      emotionalDimensions: {
        joy: 84,
        fear: 43,
        anger: 88,
        sadness: 74,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2011-08-16',
      country: 'YE',
      description: 'عملية مكافحة الجريمة',
      dcftIndices: { gmi: 71, cfi: 79, hri: 78 },
      emotionalDimensions: {
        joy: 76,
        fear: 62,
        anger: 82,
        sadness: 64,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-08-19',
      country: 'EU',
      description: 'افتتاح مركز ثقافي',
      dcftIndices: { gmi: 83, cfi: 67, hri: 56 },
      emotionalDimensions: {
        joy: 88,
        fear: 48,
        anger: 88,
        sadness: 79,
        hope: 32,
        curiosity: 37
      }
    },
    {
      date: '2011-08-22',
      country: 'UK',
      description: 'مهرجان ثقافي عالمي كبير',
      dcftIndices: { gmi: 86, cfi: 65, hri: 52 },
      emotionalDimensions: {
        joy: 87,
        fear: 38,
        anger: 92,
        sadness: 81,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-08-25',
      country: 'KR',
      description: 'مهرجان الفنون الشعبية',
      dcftIndices: { gmi: 81, cfi: 67, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 38,
        anger: 90,
        sadness: 81,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2011-08-28',
      country: 'SY',
      description: 'تحسن الخدمات الاجتماعية',
      dcftIndices: { gmi: 85, cfi: 70, hri: 58 },
      emotionalDimensions: {
        joy: 84,
        fear: 50,
        anger: 90,
        sadness: 73,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-08-31',
      country: 'IR',
      description: 'اتفاق أمني إقليمي شامل',
      dcftIndices: { gmi: 78, cfi: 79, hri: 68 },
      emotionalDimensions: {
        joy: 79,
        fear: 58,
        anger: 89,
        sadness: 70,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-09-03',
      country: 'IR',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 84, cfi: 73, hri: 56 },
      emotionalDimensions: {
        joy: 83,
        fear: 45,
        anger: 86,
        sadness: 74,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-09-06',
      country: 'LB',
      description: 'عملية مكافحة الجريمة',
      dcftIndices: { gmi: 71, cfi: 81, hri: 80 },
      emotionalDimensions: {
        joy: 74,
        fear: 58,
        anger: 84,
        sadness: 70,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-09-09',
      country: 'MA',
      description: 'تحسن الحوار السياسي',
      dcftIndices: { gmi: 74, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 82,
        fear: 53,
        anger: 87,
        sadness: 74,
        hope: 30,
        curiosity: 37
      }
    },
    {
      date: '2011-09-12',
      country: 'AU',
      description: 'اتفاق أمني إقليمي شامل',
      dcftIndices: { gmi: 80, cfi: 76, hri: 72 },
      emotionalDimensions: {
        joy: 83,
        fear: 59,
        anger: 86,
        sadness: 70,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-09-15',
      country: 'CN',
      description: 'إنجاز أولمبي تاريخي',
      dcftIndices: { gmi: 88, cfi: 60, hri: 56 },
      emotionalDimensions: {
        joy: 90,
        fear: 33,
        anger: 95,
        sadness: 85,
        hope: 36,
        curiosity: 41
      }
    },
    {
      date: '2011-09-18',
      country: 'AE',
      description: 'تحسن العلاقات الثنائية',
      dcftIndices: { gmi: 74, cfi: 71, hri: 72 },
      emotionalDimensions: {
        joy: 83,
        fear: 53,
        anger: 86,
        sadness: 70,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-09-21',
      country: 'EU',
      description: 'تحسن التعاون الأمني الدولي',
      dcftIndices: { gmi: 75, cfi: 71, hri: 67 },
      emotionalDimensions: {
        joy: 78,
        fear: 59,
        anger: 86,
        sadness: 72,
        hope: 30,
        curiosity: 35
      }
    },
    {
      date: '2011-09-24',
      country: 'MX',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 76, cfi: 72, hri: 61 },
      emotionalDimensions: {
        joy: 84,
        fear: 50,
        anger: 88,
        sadness: 73,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-09-27',
      country: 'KW',
      description: 'معرض فني دولي مهم',
      dcftIndices: { gmi: 82, cfi: 68, hri: 57 },
      emotionalDimensions: {
        joy: 85,
        fear: 40,
        anger: 92,
        sadness: 72,
        hope: 34,
        curiosity: 44
      }
    },
    {
      date: '2011-09-30',
      country: 'EG',
      description: 'برنامج محو الأمية الرقمية',
      dcftIndices: { gmi: 81, cfi: 66, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 50,
        anger: 90,
        sadness: 74,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-10-03',
      country: 'ZA',
      description: 'انخفاض معدل التضخم',
      dcftIndices: { gmi: 77, cfi: 71, hri: 61 },
      emotionalDimensions: {
        joy: 83,
        fear: 43,
        anger: 91,
        sadness: 75,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-10-06',
      country: 'AE',
      description: 'حفل موسيقي عالمي الطراز',
      dcftIndices: { gmi: 88, cfi: 61, hri: 51 },
      emotionalDimensions: {
        joy: 93,
        fear: 37,
        anger: 91,
        sadness: 77,
        hope: 36,
        curiosity: 43
      }
    },
    {
      date: '2011-10-09',
      country: 'KW',
      description: 'معرض فني دولي مهم',
      dcftIndices: { gmi: 79, cfi: 68, hri: 58 },
      emotionalDimensions: {
        joy: 88,
        fear: 42,
        anger: 94,
        sadness: 80,
        hope: 32,
        curiosity: 39
      }
    },
    {
      date: '2011-10-12',
      country: 'ES',
      description: 'افتتاح متحف حضارة',
      dcftIndices: { gmi: 82, cfi: 64, hri: 53 },
      emotionalDimensions: {
        joy: 83,
        fear: 39,
        anger: 90,
        sadness: 73,
        hope: 36,
        curiosity: 44
      }
    },
    {
      date: '2011-10-15',
      country: 'CN',
      description: 'معرض فني دولي مهم',
      dcftIndices: { gmi: 85, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 85,
        fear: 44,
        anger: 95,
        sadness: 78,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-10-18',
      country: 'IL',
      description: 'زيادة الصادرات بنسبة كبيرة',
      dcftIndices: { gmi: 85, cfi: 66, hri: 64 },
      emotionalDimensions: {
        joy: 87,
        fear: 44,
        anger: 94,
        sadness: 78,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2011-10-21',
      country: 'ZA',
      description: 'مؤتمر ثقافي دولي',
      dcftIndices: { gmi: 77, cfi: 68, hri: 55 },
      emotionalDimensions: {
        joy: 81,
        fear: 46,
        anger: 90,
        sadness: 75,
        hope: 32,
        curiosity: 40
      }
    },
    {
      date: '2011-10-24',
      country: 'JO',
      description: 'توسع شبكات الجيل الخامس',
      dcftIndices: { gmi: 86, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 89,
        fear: 43,
        anger: 89,
        sadness: 79,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2011-10-27',
      country: 'YE',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 80, cfi: 66, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 46,
        anger: 93,
        sadness: 79,
        hope: 31,
        curiosity: 38
      }
    },
    {
      date: '2011-10-30',
      country: 'RU',
      description: 'زيادة الصادرات بنسبة كبيرة',
      dcftIndices: { gmi: 78, cfi: 71, hri: 64 },
      emotionalDimensions: {
        joy: 86,
        fear: 43,
        anger: 94,
        sadness: 71,
        hope: 32,
        curiosity: 43
      }
    },
    {
      date: '2011-11-02',
      country: 'AU',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 78, cfi: 68, hri: 63 },
      emotionalDimensions: {
        joy: 87,
        fear: 47,
        anger: 93,
        sadness: 75,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-11-05',
      country: 'KW',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 81, cfi: 69, hri: 64 },
      emotionalDimensions: {
        joy: 83,
        fear: 47,
        anger: 87,
        sadness: 77,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2011-11-08',
      country: 'MA',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 73, cfi: 77, hri: 73 },
      emotionalDimensions: {
        joy: 76,
        fear: 54,
        anger: 88,
        sadness: 74,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2011-11-11',
      country: 'IR',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 80, cfi: 71, hri: 57 },
      emotionalDimensions: {
        joy: 82,
        fear: 45,
        anger: 92,
        sadness: 79,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2011-11-14',
      country: 'SY',
      description: 'توقيع عقد تجاري ضخم',
      dcftIndices: { gmi: 87, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 89,
        fear: 40,
        anger: 91,
        sadness: 75,
        hope: 35,
        curiosity: 43
      }
    },
    {
      date: '2011-11-17',
      country: 'ES',
      description: 'تحسن الاستقرار السياسي العام',
      dcftIndices: { gmi: 83, cfi: 69, hri: 56 },
      emotionalDimensions: {
        joy: 86,
        fear: 49,
        anger: 89,
        sadness: 78,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2011-11-20',
      country: 'IN',
      description: 'استقرار أسعار السلع الأساسية',
      dcftIndices: { gmi: 81, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 81,
        fear: 52,
        anger: 91,
        sadness: 68,
        hope: 30,
        curiosity: 40
      }
    },
    {
      date: '2011-11-23',
      country: 'YE',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 83, cfi: 74, hri: 61 },
      emotionalDimensions: {
        joy: 86,
        fear: 53,
        anger: 87,
        sadness: 69,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2011-11-26',
      country: 'MX',
      description: 'تحسن مؤشرات التنوع البيولوجي',
      dcftIndices: { gmi: 78, cfi: 74, hri: 64 },
      emotionalDimensions: {
        joy: 88,
        fear: 46,
        anger: 86,
        sadness: 76,
        hope: 34,
        curiosity: 39
      }
    },
    {
      date: '2011-11-29',
      country: 'EU',
      description: 'برنامج تطوير المناطق الريفية',
      dcftIndices: { gmi: 77, cfi: 69, hri: 64 },
      emotionalDimensions: {
        joy: 86,
        fear: 51,
        anger: 92,
        sadness: 74,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-12-02',
      country: 'SY',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 86, cfi: 62, hri: 60 },
      emotionalDimensions: {
        joy: 89,
        fear: 44,
        anger: 94,
        sadness: 82,
        hope: 31,
        curiosity: 37
      }
    },
    {
      date: '2011-12-05',
      country: 'RU',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 80, cfi: 69, hri: 52 },
      emotionalDimensions: {
        joy: 85,
        fear: 40,
        anger: 95,
        sadness: 80,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-12-08',
      country: 'TR',
      description: 'افتتاح متحف حضارة',
      dcftIndices: { gmi: 87, cfi: 63, hri: 54 },
      emotionalDimensions: {
        joy: 86,
        fear: 46,
        anger: 88,
        sadness: 79,
        hope: 33,
        curiosity: 38
      }
    },
    {
      date: '2011-12-11',
      country: 'EU',
      description: 'تحسن جودة الهواء بشكل ملحوظ',
      dcftIndices: { gmi: 79, cfi: 69, hri: 61 },
      emotionalDimensions: {
        joy: 89,
        fear: 47,
        anger: 88,
        sadness: 74,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2011-12-14',
      country: 'OM',
      description: 'افتتاح حاضنة تكنولوجية',
      dcftIndices: { gmi: 87, cfi: 67, hri: 60 },
      emotionalDimensions: {
        joy: 90,
        fear: 45,
        anger: 89,
        sadness: 74,
        hope: 33,
        curiosity: 41
      }
    },
    {
      date: '2011-12-17',
      country: 'IN',
      description: 'توسع شبكات الجيل الخامس',
      dcftIndices: { gmi: 81, cfi: 65, hri: 59 },
      emotionalDimensions: {
        joy: 89,
        fear: 39,
        anger: 92,
        sadness: 80,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2011-12-20',
      country: 'IL',
      description: 'إنجاز رياضي قياسي عالمي',
      dcftIndices: { gmi: 90, cfi: 60, hri: 50 },
      emotionalDimensions: {
        joy: 91,
        fear: 36,
        anger: 95,
        sadness: 81,
        hope: 35,
        curiosity: 42
      }
    },
    {
      date: '2011-12-23',
      country: 'BR',
      description: 'افتتاح متحف حضارة',
      dcftIndices: { gmi: 80, cfi: 70, hri: 60 },
      emotionalDimensions: {
        joy: 84,
        fear: 41,
        anger: 94,
        sadness: 81,
        hope: 33,
        curiosity: 39
      }
    },
    {
      date: '2011-12-26',
      country: 'RU',
      description: 'اتفاق على الموارد المشتركة',
      dcftIndices: { gmi: 75, cfi: 78, hri: 72 },
      emotionalDimensions: {
        joy: 79,
        fear: 57,
        anger: 83,
        sadness: 68,
        hope: 30,
        curiosity: 38
      }
    },
    {
      date: '2011-12-29',
      country: 'IQ',
      description: 'احتفالات وطنية كبرى',
      dcftIndices: { gmi: 87, cfi: 65, hri: 54 },
      emotionalDimensions: {
        joy: 84,
        fear: 45,
        anger: 95,
        sadness: 77,
        hope: 30,
        curiosity: 39
      }
    },
    {
      date: '2012-01-01',
      country: 'SA',
      description: 'برنامج محو الأمية الرقمية',
      dcftIndices: { gmi: 80, cfi: 69, hri: 58 },
      emotionalDimensions: {
        joy: 85,
        fear: 45,
        anger: 87,
        sadness: 75,
        hope: 34,
        curiosity: 40
      }
    },
    {
      date: '2012-01-04',
      country: 'BH',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 81, cfi: 75, hri: 71 },
      emotionalDimensions: {
        joy: 81,
        fear: 57,
        anger: 88,
        sadness: 71,
        hope: 30,
        curiosity: 36
      }
    },
    {
      date: '2012-01-07',
      country: 'AU',
      description: 'تحسن الأمن الحدودي',
      dcftIndices: { gmi: 74, cfi: 78, hri: 73 },
      emotionalDimensions: {
        joy: 81,
        fear: 53,
        anger: 86,
        sadness: 66,
        hope: 31,
        curiosity: 41
      }
    },
    {
      date: '2012-01-10',
      country: 'KW',
      description: 'تحسن التعاون الأمني الدولي',
      dcftIndices: { gmi: 80, cfi: 73, hri: 66 },
      emotionalDimensions: {
        joy: 83,
        fear: 58,
        anger: 85,
        sadness: 74,
        hope: 30,
        curiosity: 34
      }
    },
    {
      date: '2012-01-13',
      country: 'LB',
      description: 'إطلاق برنامج تدريب الشباب',
      dcftIndices: { gmi: 77, cfi: 66, hri: 62 },
      emotionalDimensions: {
        joy: 80,
        fear: 43,
        anger: 87,
        sadness: 75,
        hope: 35,
        curiosity: 41
      }
    },
    {
      date: '2012-01-16',
      country: 'EU',
      description: 'بطولة إقليمية مهمة',
      dcftIndices: { gmi: 85, cfi: 68, hri: 59 },
      emotionalDimensions: {
        joy: 88,
        fear: 41,
        anger: 95,
        sadness: 77,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2012-01-19',
      country: 'US',
      description: 'مشروع تطوير المواهب الرياضية',
      dcftIndices: { gmi: 81, cfi: 66, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 43,
        anger: 92,
        sadness: 72,
        hope: 33,
        curiosity: 43
      }
    },
    {
      date: '2012-01-22',
      country: 'UK',
      description: 'برنامج الإسكان الاجتماعي',
      dcftIndices: { gmi: 75, cfi: 73, hri: 57 },
      emotionalDimensions: {
        joy: 84,
        fear: 52,
        anger: 85,
        sadness: 72,
        hope: 32,
        curiosity: 38
      }
    },
    {
      date: '2012-01-25',
      country: 'NG',
      description: 'إنجاز رياضي قياسي عالمي',
      dcftIndices: { gmi: 85, cfi: 64, hri: 55 },
      emotionalDimensions: {
        joy: 92,
        fear: 34,
        anger: 91,
        sadness: 83,
        hope: 38,
        curiosity: 42
      }
    },
    {
      date: '2012-01-28',
      country: 'OM',
      description: 'اتفاق أمني إقليمي شامل',
      dcftIndices: { gmi: 73, cfi: 80, hri: 66 },
      emotionalDimensions: {
        joy: 80,
        fear: 52,
        anger: 84,
        sadness: 67,
        hope: 32,
        curiosity: 41
      }
    },
    {
      date: '2012-01-31',
      country: 'KR',
      description: 'برنامج تبادل ثقافي',
      dcftIndices: { gmi: 84, cfi: 72, hri: 60 },
      emotionalDimensions: {
        joy: 81,
        fear: 49,
        anger: 85,
        sadness: 72,
        hope: 33,
        curiosity: 40
      }
    },
    {
      date: '2012-02-03',
      country: 'CA',
      description: 'اتفاق بيئي دولي',
      dcftIndices: { gmi: 82, cfi: 72, hri: 56 },
      emotionalDimensions: {
        joy: 87,
        fear: 48,
        anger: 91,
        sadness: 74,
        hope: 31,
        curiosity: 39
      }
    },
    {
      date: '2012-02-06',
      country: 'ZA',
      description: 'افتتاح حاضنة تكنولوجية',
      dcftIndices: { gmi: 85, cfi: 70, hri: 55 },
      emotionalDimensions: {
        joy: 84,
        fear: 41,
        anger: 95,
        sadness: 77,
        hope: 32,
        curiosity: 41
      }
    }];

/**
 * Get sample historical events
 */
export function getSampleHistoricalEvents() {
  return historicalEvents;
}

/**
 * Get events by country
 */
export function getEventsByCountry(country: string) {
  return historicalEvents.filter(e => e.country === country || e.country === 'MENA');
}

/**
 * Get events by category
 */
export function getEventsByCategory(category: string) {
  return historicalEvents.filter(e => e.eventCategory === category);
}

/**
 * Get events by date range
 */
export function getEventsByDateRange(startDate: string, endDate: string) {
  return historicalEvents.filter(e => e.eventDate >= startDate && e.eventDate <= endDate);
}
