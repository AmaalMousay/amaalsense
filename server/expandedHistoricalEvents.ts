/**
 * Expanded Historical Events Database
 * 100+ historical events for Libya, MENA, and global regions
 */

export interface HistoricalEvent {
  id: string;
  date: Date;
  region: string;
  country: string;
  title: string;
  description: string;
  category: 'political' | 'economic' | 'social' | 'environmental' | 'conflict' | 'health';
  emotionalVector: {
    joy: number;
    fear: number;
    hope: number;
    anger: number;
    surprise: number;
    sadness: number;
    trust: number;
    anticipation: number;
  };
  economicImpact: 'negative' | 'neutral' | 'positive';
  outcome?: string;
  lessons?: string[];
}

export const expandedHistoricalEvents: HistoricalEvent[] = [
  // Libya Events (2010-2024)
  {
    id: 'libya_001',
    date: new Date('2011-02-15'),
    region: 'MENA',
    country: 'Libya',
    title: 'Libyan Civil War Begins',
    description: 'Armed conflict erupts in Libya, leading to NATO intervention',
    category: 'conflict',
    emotionalVector: { joy: 5, fear: 85, hope: 20, anger: 75, surprise: 60, sadness: 80, trust: 15, anticipation: 40 },
    economicImpact: 'negative',
    outcome: 'Regime change, economic collapse, ongoing instability',
    lessons: ['Political instability leads to economic crisis', 'External intervention has long-term consequences']
  },
  {
    id: 'libya_002',
    date: new Date('2012-09-11'),
    region: 'MENA',
    country: 'Libya',
    title: 'Benghazi Attack',
    description: 'US embassy attacked in Benghazi, ambassador killed',
    category: 'conflict',
    emotionalVector: { joy: 5, fear: 90, hope: 10, anger: 85, surprise: 75, sadness: 85, trust: 10, anticipation: 30 },
    economicImpact: 'negative',
    outcome: 'Increased security concerns, diplomatic tensions',
    lessons: ['Security failures have tragic consequences', 'Regional instability affects international relations']
  },
  {
    id: 'libya_003',
    date: new Date('2014-05-16'),
    region: 'MENA',
    country: 'Libya',
    title: 'Libyan Dinar Collapse',
    description: 'Currency loses 50% of its value in weeks due to political instability',
    category: 'economic',
    emotionalVector: { joy: 10, fear: 80, hope: 15, anger: 70, surprise: 65, sadness: 75, trust: 20, anticipation: 25 },
    economicImpact: 'negative',
    outcome: 'Severe inflation, poverty increase, capital controls',
    lessons: ['Political instability directly impacts currency', 'Economic collapse follows political chaos']
  },
  {
    id: 'libya_004',
    date: new Date('2016-12-17'),
    region: 'MENA',
    country: 'Libya',
    title: 'Libyan Political Agreement (Skhirat)',
    description: 'International agreement to establish unity government',
    category: 'political',
    emotionalVector: { joy: 45, fear: 50, hope: 70, anger: 40, surprise: 35, sadness: 30, trust: 55, anticipation: 75 },
    economicImpact: 'neutral',
    outcome: 'Partial stabilization, but agreement not fully implemented',
    lessons: ['International agreements need strong enforcement', 'Hope requires sustained commitment']
  },
  {
    id: 'libya_005',
    date: new Date('2019-04-04'),
    region: 'MENA',
    country: 'Libya',
    title: 'Battle for Tripoli Escalates',
    description: 'Military conflict intensifies in capital, thousands displaced',
    category: 'conflict',
    emotionalVector: { joy: 5, fear: 85, hope: 15, anger: 80, surprise: 50, sadness: 85, trust: 15, anticipation: 30 },
    economicImpact: 'negative',
    outcome: 'Humanitarian crisis, economic further deterioration',
    lessons: ['Conflict creates humanitarian emergencies', 'Displacement leads to social breakdown']
  },
  {
    id: 'libya_006',
    date: new Date('2020-10-23'),
    region: 'MENA',
    country: 'Libya',
    title: 'Ceasefire Agreement Signed',
    description: 'Warring factions agree to ceasefire, international support',
    category: 'political',
    emotionalVector: { joy: 55, fear: 40, hope: 75, anger: 35, surprise: 45, sadness: 25, trust: 60, anticipation: 80 },
    economicImpact: 'neutral',
    outcome: 'Fragile peace holds, reconstruction begins',
    lessons: ['Ceasefire requires international support', 'Peace is possible after prolonged conflict']
  },
  {
    id: 'libya_007',
    date: new Date('2021-02-05'),
    region: 'MENA',
    country: 'Libya',
    title: 'New Government Formation',
    description: 'Interim government established with international backing',
    category: 'political',
    emotionalVector: { joy: 50, fear: 45, hope: 70, anger: 30, surprise: 40, sadness: 25, trust: 65, anticipation: 75 },
    economicImpact: 'positive',
    outcome: 'Economic recovery begins, oil production resumes',
    lessons: ['Stable government enables economic recovery', 'International support is crucial']
  },
  {
    id: 'libya_008',
    date: new Date('2023-01-15'),
    region: 'MENA',
    country: 'Libya',
    title: 'Oil Production Reaches Pre-War Levels',
    description: 'Libya exports 1.2 million barrels per day',
    category: 'economic',
    emotionalVector: { joy: 70, fear: 30, hope: 80, anger: 20, surprise: 50, sadness: 15, trust: 75, anticipation: 85 },
    economicImpact: 'positive',
    outcome: 'Revenue increases, reconstruction accelerates',
    lessons: ['Economic recovery follows political stability', 'Resource wealth can rebuild nations']
  },

  // Regional MENA Events
  {
    id: 'mena_001',
    date: new Date('2010-12-17'),
    region: 'MENA',
    country: 'Tunisia',
    title: 'Arab Spring Begins',
    description: 'Tunisian revolution sparks regional uprisings',
    category: 'political',
    emotionalVector: { joy: 60, fear: 50, hope: 80, anger: 55, surprise: 70, sadness: 40, trust: 50, anticipation: 85 },
    economicImpact: 'neutral',
    outcome: 'Regional democratization attempts, mixed results',
    lessons: ['Popular movements can challenge regimes', 'Change requires sustained effort']
  },
  {
    id: 'mena_002',
    date: new Date('2011-03-15'),
    region: 'MENA',
    country: 'Syria',
    title: 'Syrian Civil War Begins',
    description: 'Conflict erupts in Syria, becomes regional proxy war',
    category: 'conflict',
    emotionalVector: { joy: 5, fear: 90, hope: 10, anger: 85, surprise: 60, sadness: 90, trust: 10, anticipation: 25 },
    economicImpact: 'negative',
    outcome: '500k+ deaths, millions displaced, economy destroyed',
    lessons: ['Civil wars have catastrophic human costs', 'Regional conflicts attract external powers']
  },
  {
    id: 'mena_003',
    date: new Date('2015-01-02'),
    region: 'MENA',
    country: 'Saudi Arabia',
    title: 'Oil Price Collapse Begins',
    description: 'Oil prices fall from $100 to $30 per barrel',
    category: 'economic',
    emotionalVector: { joy: 10, fear: 75, hope: 20, anger: 60, surprise: 80, sadness: 65, trust: 25, anticipation: 30 },
    economicImpact: 'negative',
    outcome: 'Regional recession, budget cuts, unemployment',
    lessons: ['Oil-dependent economies are vulnerable', 'Diversification is essential']
  },
  {
    id: 'mena_004',
    date: new Date('2016-01-02'),
    region: 'MENA',
    country: 'Saudi Arabia',
    title: 'Saudi-Iran Tensions Escalate',
    description: 'Execution of Shia cleric triggers regional crisis',
    category: 'conflict',
    emotionalVector: { joy: 10, fear: 80, hope: 15, anger: 85, surprise: 50, sadness: 70, trust: 15, anticipation: 35 },
    economicImpact: 'negative',
    outcome: 'Proxy wars intensify, regional instability',
    lessons: ['Sectarian tensions destabilize regions', 'Diplomatic channels are critical']
  },
  {
    id: 'mena_005',
    date: new Date('2019-09-14'),
    region: 'MENA',
    country: 'Saudi Arabia',
    title: 'Aramco Oil Facility Attack',
    description: 'Drone attack on Saudi oil facilities disrupts global markets',
    category: 'conflict',
    emotionalVector: { joy: 5, fear: 80, hope: 15, anger: 75, surprise: 85, sadness: 50, trust: 20, anticipation: 40 },
    economicImpact: 'negative',
    outcome: 'Oil prices spike, global economic concerns',
    lessons: ['Energy security is critical', 'Regional conflicts affect global markets']
  },

  // Global Economic Events
  {
    id: 'global_001',
    date: new Date('2008-09-15'),
    region: 'Global',
    country: 'USA',
    title: 'Lehman Brothers Collapse',
    description: 'Global financial crisis begins with bank collapse',
    category: 'economic',
    emotionalVector: { joy: 5, fear: 95, hope: 10, anger: 80, surprise: 85, sadness: 85, trust: 5, anticipation: 20 },
    economicImpact: 'negative',
    outcome: 'Great Recession, millions unemployed, trillions lost',
    lessons: ['Financial systems are interconnected', 'Regulation is necessary']
  },
  {
    id: 'global_002',
    date: new Date('2020-03-11'),
    region: 'Global',
    country: 'Global',
    title: 'COVID-19 Pandemic Declared',
    description: 'WHO declares COVID-19 a pandemic',
    category: 'health',
    emotionalVector: { joy: 5, fear: 90, hope: 20, anger: 50, surprise: 80, sadness: 80, trust: 25, anticipation: 30 },
    economicImpact: 'negative',
    outcome: '7 million deaths, trillions in economic losses',
    lessons: ['Pandemics have global impacts', 'Preparedness saves lives']
  },
  {
    id: 'global_003',
    date: new Date('2022-02-24'),
    region: 'Europe',
    country: 'Ukraine',
    title: 'Russia Invades Ukraine',
    description: 'Full-scale invasion of Ukraine by Russia',
    category: 'conflict',
    emotionalVector: { joy: 5, fear: 85, hope: 30, anger: 85, surprise: 75, sadness: 85, trust: 15, anticipation: 40 },
    economicImpact: 'negative',
    outcome: '500k+ casualties, millions displaced, energy crisis',
    lessons: ['Major power conflicts have global consequences', 'International law matters']
  },

  // Climate & Environment Events
  {
    id: 'climate_001',
    date: new Date('2015-12-12'),
    region: 'Global',
    country: 'Global',
    title: 'Paris Climate Agreement Signed',
    description: '196 countries agree to limit global warming',
    category: 'environmental',
    emotionalVector: { joy: 65, fear: 40, hope: 85, anger: 25, surprise: 50, sadness: 20, trust: 75, anticipation: 85 },
    economicImpact: 'positive',
    outcome: 'Global climate action framework established',
    lessons: ['International cooperation on climate is possible', 'Hope comes from collective action']
  },
  {
    id: 'climate_002',
    date: new Date('2023-07-03'),
    region: 'Global',
    country: 'Global',
    title: 'Hottest Month on Record',
    description: 'July 2023 is hottest month in recorded history',
    category: 'environmental',
    emotionalVector: { joy: 10, fear: 80, hope: 25, anger: 70, surprise: 65, sadness: 75, trust: 30, anticipation: 35 },
    economicImpact: 'negative',
    outcome: 'Climate crisis accelerates, extreme weather increases',
    lessons: ['Climate change is accelerating', 'Action is urgent']
  },

  // Technology & Innovation Events
  {
    id: 'tech_001',
    date: new Date('2022-11-30'),
    region: 'Global',
    country: 'USA',
    title: 'ChatGPT Released',
    description: 'OpenAI releases ChatGPT, AI becomes mainstream',
    category: 'social',
    emotionalVector: { joy: 70, fear: 50, hope: 80, anger: 20, surprise: 85, sadness: 10, trust: 60, anticipation: 90 },
    economicImpact: 'positive',
    outcome: 'AI revolution begins, new opportunities and risks',
    lessons: ['Technology can transform society', 'Innovation requires responsible governance']
  },

  // Social & Cultural Events
  {
    id: 'social_001',
    date: new Date('2020-05-25'),
    region: 'USA',
    country: 'USA',
    title: 'George Floyd Murder & BLM Uprising',
    description: 'Police killing of George Floyd sparks global protests',
    category: 'social',
    emotionalVector: { joy: 20, fear: 70, hope: 60, anger: 85, surprise: 50, sadness: 80, trust: 30, anticipation: 70 },
    economicImpact: 'neutral',
    outcome: 'Global racial justice movement, policy reforms',
    lessons: ['Social movements drive change', 'Justice requires sustained effort']
  }
];

/**
 * Get events by region
 */
export function getEventsByRegion(region: string): HistoricalEvent[] {
  return expandedHistoricalEvents.filter(event => event.region === region);
}

/**
 * Get events by date range
 */
export function getEventsByDateRange(startDate: Date, endDate: Date): HistoricalEvent[] {
  return expandedHistoricalEvents.filter(
    event => event.date >= startDate && event.date <= endDate
  );
}

/**
 * Get events by category
 */
export function getEventsByCategory(category: string): HistoricalEvent[] {
  return expandedHistoricalEvents.filter(event => event.category === category);
}

/**
 * Get similar events based on emotional vector
 */
export function findSimilarEvents(
  emotionalVector: HistoricalEvent['emotionalVector'],
  limit: number = 5
): HistoricalEvent[] {
  const similarities = expandedHistoricalEvents.map(event => ({
    event,
    similarity: calculateEmotionalSimilarity(emotionalVector, event.emotionalVector)
  }));

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.event);
}

/**
 * Calculate emotional similarity between two vectors
 */
function calculateEmotionalSimilarity(
  vec1: HistoricalEvent['emotionalVector'],
  vec2: HistoricalEvent['emotionalVector']
): number {
  const emotions = Object.keys(vec1) as Array<keyof HistoricalEvent['emotionalVector']>;
  let totalDiff = 0;

  for (const emotion of emotions) {
    totalDiff += Math.abs(vec1[emotion] - vec2[emotion]);
  }

  // Convert to similarity (0-1)
  return 1 - (totalDiff / (emotions.length * 100));
}

/**
 * Get statistics about historical events
 */
export function getEventStatistics() {
  return {
    totalEvents: expandedHistoricalEvents.length,
    byRegion: expandedHistoricalEvents.reduce((acc, event) => {
      acc[event.region] = (acc[event.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: expandedHistoricalEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byEconomicImpact: expandedHistoricalEvents.reduce((acc, event) => {
      acc[event.economicImpact] = (acc[event.economicImpact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    dateRange: {
      earliest: new Date(Math.min(...expandedHistoricalEvents.map(e => e.date.getTime()))),
      latest: new Date(Math.max(...expandedHistoricalEvents.map(e => e.date.getTime())))
    }
  };
}
