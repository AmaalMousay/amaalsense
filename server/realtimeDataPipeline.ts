/**
 * Real-Time Data Pipeline
 * 
 * Integrates GDELT (Global Database of Events, Language, and Tone) and World Bank APIs
 * to automatically populate EventVectors with real news and economic data
 */

import { EventVector, createEventVector } from './eventVectorModel';

/**
 * GDELT API Response
 */
interface GDELTEvent {
  GlobalEventID: string;
  Day: string;
  MonthYear: string;
  Year: string;
  FractionDate: number;
  Actor1Code: string;
  Actor1Name: string;
  Actor1CountryCode: string;
  Actor2Code: string;
  Actor2Name: string;
  Actor2CountryCode: string;
  IsRootEvent: number;
  EventCode: string;
  EventBaseCode: string;
  EventRootCode: string;
  QuadClass: number;
  GoldsteinScale: number;
  NumMentions: number;
  NumSources: number;
  NumArticles: number;
  AvgTone: number;
  Actor1Geo_Type: number;
  Actor1Geo_Fullname: string;
  Actor1Geo_CountryCode: string;
  Actor1Geo_ADM1Code: string;
  Actor1Geo_Lat: number;
  Actor1Geo_Long: number;
  Actor1Geo_FeatureID: string;
  Actor2Geo_Type: number;
  Actor2Geo_Fullname: string;
  Actor2Geo_CountryCode: string;
  Actor2Geo_ADM1Code: string;
  Actor2Geo_Lat: number;
  Actor2Geo_Long: number;
  Actor2Geo_FeatureID: string;
  EventGeo_Type: number;
  EventGeo_Fullname: string;
  EventGeo_CountryCode: string;
  EventGeo_ADM1Code: string;
  EventGeo_Lat: number;
  EventGeo_Long: number;
  EventGeo_FeatureID: string;
  DATEADDED: string;
  SOURCEURL: string;
}

/**
 * World Bank API Response
 */
interface WorldBankIndicator {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    value: string;
    id: string;
  };
  countryiso3code: string;
  date: string;
  value: string;
  decimal: string;
  obs_status: string;
}

/**
 * Map GDELT event codes to topics
 */
function mapGDELTEventToTopic(eventCode: string): 'economy' | 'politics' | 'conflict' | 'society' | 'health' | 'environment' | 'technology' | 'culture' | 'other' {
  const code = eventCode.substring(0, 2);
  
  const mapping: Record<string, 'economy' | 'politics' | 'conflict' | 'society' | 'health' | 'environment' | 'technology' | 'culture' | 'other'> = {
    '01': 'politics',
    '02': 'politics',
    '03': 'conflict',
    '04': 'conflict',
    '05': 'conflict',
    '06': 'conflict',
    '07': 'conflict',
    '08': 'conflict',
    '09': 'conflict',
    '10': 'politics',
    '11': 'politics',
    '12': 'politics',
    '13': 'politics',
    '14': 'politics',
    '15': 'politics',
    '16': 'politics',
    '17': 'politics',
    '18': 'politics',
    '19': 'politics',
    '20': 'politics',
  };
  
  return mapping[code] || 'other';
}

/**
 * Convert GDELT tone to emotion vector
 * GDELT AvgTone ranges from -100 (very negative) to +100 (very positive)
 */
function convertGDELTToneToEmotions(tone: number, quadClass: number): Record<string, number> {
  // Normalize tone from [-100, 100] to [0, 1]
  const normalizedTone = (tone + 100) / 200;
  
  // Map QuadClass to event type
  // 1 = Verbal Cooperation, 2 = Material Cooperation
  // 3 = Verbal Conflict, 4 = Material Conflict
  
  let emotions = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };
  
  if (quadClass === 1 || quadClass === 2) {
    // Cooperation events
    emotions.joy = normalizedTone * 0.8;
    emotions.hope = normalizedTone * 0.7;
    emotions.curiosity = 0.5;
    emotions.fear = (1 - normalizedTone) * 0.3;
    emotions.anger = (1 - normalizedTone) * 0.2;
    emotions.sadness = (1 - normalizedTone) * 0.2;
  } else {
    // Conflict events
    emotions.fear = (1 - normalizedTone) * 0.8;
    emotions.anger = (1 - normalizedTone) * 0.7;
    emotions.sadness = (1 - normalizedTone) * 0.6;
    emotions.joy = normalizedTone * 0.3;
    emotions.hope = normalizedTone * 0.4;
    emotions.curiosity = 0.6;
  }
  
  return emotions;
}

/**
 * Fetch events from GDELT API
 * GDELT provides free access to global event data
 */
export async function fetchGDELTEvents(
  startDate: string = '20240101',
  endDate: string = '20240131'
): Promise<EventVector[]> {
  try {
    // GDELT API endpoint for event data
    const url = `https://api.gdeltproject.org/api/v2/search/tv?query=*&mode=TimelineVolumeChange&format=json&startdatetime=${startDate}000000&enddatetime=${endDate}235959`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error('GDELT API error:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    const eventVectors: EventVector[] = [];
    
    // Process GDELT events
    if (data.data && Array.isArray(data.data)) {
      for (const event of data.data.slice(0, 50)) {
        // Limit to 50 events for performance
        const emotions = convertGDELTToneToEmotions(event.AvgTone || 0, event.QuadClass || 3);
        
        // Determine polarity from tone
        const polarity = (event.AvgTone || 0) / 100;
        
        // Determine intensity from number of mentions and sources
        const intensity = Math.min(1, (event.NumMentions || 1) / 100);
        
        const eventVector = createEventVector({
          topic: mapGDELTEventToTopic(event.EventCode),
          subTopic: event.EventRootCode || 'general',
          region: mapCountryToRegion(event.EventGeo_CountryCode || 'XX'),
          country: event.EventGeo_CountryCode || 'XX',
          emotions: {
            joy: Math.max(0, Math.min(1, emotions.joy)),
            fear: Math.max(0, Math.min(1, emotions.fear)),
            anger: Math.max(0, Math.min(1, emotions.anger)),
            sadness: Math.max(0, Math.min(1, emotions.sadness)),
            hope: Math.max(0, Math.min(1, emotions.hope)),
            curiosity: Math.max(0, Math.min(1, emotions.curiosity)),
          },
          intensity,
          polarity,
          uncertainty: 0.3, // GDELT doesn't provide uncertainty
          sourceType: 'news',
          sourceName: 'GDELT',
          summary: `${event.Actor1Name || 'Unknown'} ${event.EventRootCode || 'event'} ${event.Actor2Name || 'Unknown'} in ${event.EventGeo_Fullname || 'Unknown location'}`,
        });
        
        eventVectors.push(eventVector);
      }
    }
    
    return eventVectors;
  } catch (error) {
    console.error('Error fetching GDELT events:', error);
    return [];
  }
}

/**
 * Fetch economic indicators from World Bank API
 */
export async function fetchWorldBankIndicators(
  countryCode: string = 'LY', // Libya by default
  indicators: string[] = ['NY.GDP.MKTP.CD', 'FP.CPI.TOTL.ZG', 'SP.URB.TOTL.IN.ZS']
): Promise<EventVector[]> {
  try {
    const eventVectors: EventVector[] = [];
    
    for (const indicator of indicators) {
      const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=100`;
      
      const response = await fetch(url);
      if (!response.ok) continue;
      
      const [metadata, data] = await response.json();
      
      if (!Array.isArray(data)) continue;
      
      // Process economic data
      for (const record of data.slice(0, 10)) {
        if (!record.value) continue;
        
        const value = parseFloat(record.value);
        const year = parseInt(record.date);
        
        // Determine topic based on indicator
        let topic: 'economy' | 'politics' | 'conflict' | 'society' | 'health' | 'environment' | 'technology' | 'culture' | 'other' = 'economy';
        let emotions = {
          joy: 0.5,
          fear: 0.3,
          anger: 0.2,
          sadness: 0.2,
          hope: 0.6,
          curiosity: 0.5,
        };
        
        // Adjust emotions based on indicator type
        if (indicator.includes('CPI') || indicator.includes('INFL')) {
          // Inflation - negative emotion
          emotions.fear = Math.min(1, value / 20); // Higher inflation = more fear
          emotions.sadness = emotions.fear * 0.8;
          emotions.hope = 1 - emotions.fear;
        } else if (indicator.includes('GDP')) {
          // GDP - positive emotion
          emotions.joy = Math.min(1, value / 1000000000000); // Normalize to 0-1
          emotions.hope = emotions.joy * 0.9;
          emotions.fear = 1 - emotions.joy;
        }
        
        const eventVector = createEventVector({
          topic,
          subTopic: metadata.indicator.name || indicator,
          region: mapCountryToRegion(countryCode),
          country: countryCode,
          emotions,
          intensity: 0.5,
          polarity: emotions.joy - emotions.fear,
          uncertainty: 0.2,
          sourceType: 'analysis',
          sourceName: 'World Bank',
          summary: `${metadata.indicator.name || indicator} for ${countryCode} in ${year}: ${value}`,
        });
        
        eventVectors.push(eventVector);
      }
    }
    
    return eventVectors;
  } catch (error) {
    console.error('Error fetching World Bank indicators:', error);
    return [];
  }
}

/**
 * Map country code to region
 */
function mapCountryToRegion(
  countryCode: string
): 'global' | 'europe' | 'mena' | 'asia' | 'americas' | 'africa' | 'oceania' {
  const regions: Record<string, 'global' | 'europe' | 'mena' | 'asia' | 'americas' | 'africa' | 'oceania'> = {
    // MENA
    'LY': 'mena', 'EG': 'mena', 'SA': 'mena', 'AE': 'mena', 'KW': 'mena', 'QA': 'mena', 'BH': 'mena', 'OM': 'mena', 'YE': 'mena', 'JO': 'mena', 'SY': 'mena', 'IQ': 'mena', 'IR': 'mena', 'IL': 'mena', 'PS': 'mena', 'LB': 'mena', 'TN': 'mena', 'DZ': 'mena', 'MA': 'mena', 'SD': 'mena',
    // Europe
    'GB': 'europe', 'FR': 'europe', 'DE': 'europe', 'IT': 'europe', 'ES': 'europe', 'PL': 'europe', 'RU': 'europe', 'UA': 'europe', 'SE': 'europe', 'NO': 'europe', 'DK': 'europe', 'NL': 'europe', 'BE': 'europe', 'CH': 'europe', 'AT': 'europe', 'CZ': 'europe', 'GR': 'europe', 'PT': 'europe',
    // Asia
    'CN': 'asia', 'JP': 'asia', 'IN': 'asia', 'KR': 'asia', 'TH': 'asia', 'VN': 'asia', 'ID': 'asia', 'MY': 'asia', 'SG': 'asia', 'PH': 'asia', 'PK': 'asia', 'BD': 'asia', 'TR': 'asia',
    // Americas
    'US': 'americas', 'CA': 'americas', 'MX': 'americas', 'BR': 'americas', 'AR': 'americas', 'CL': 'americas', 'CO': 'americas', 'PE': 'americas',
    // Africa
    'ZA': 'africa', 'NG': 'africa', 'KE': 'africa', 'ET': 'africa', 'GH': 'africa',
    // Oceania
    'AU': 'oceania', 'NZ': 'oceania',
  };
  
  return regions[countryCode] || 'global';
}

/**
 * Combine GDELT and World Bank data
 */
export async function fetchRealTimeData(): Promise<EventVector[]> {
  const gdeltEvents = await fetchGDELTEvents();
  const bankIndicators = await fetchWorldBankIndicators();
  
  return [...gdeltEvents, ...bankIndicators];
}

/**
 * Scheduled job to refresh data (runs every 6 hours)
 */
export async function scheduleDataRefresh(intervalHours: number = 6) {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  setInterval(async () => {
    try {
      const eventVectors = await fetchRealTimeData();
      console.log(`[Data Pipeline] Refreshed ${eventVectors.length} events at ${new Date().toISOString()}`);
      // Store in database or cache
    } catch (error) {
      console.error('[Data Pipeline] Error during refresh:', error);
    }
  }, intervalMs);
  
  console.log(`[Data Pipeline] Scheduled data refresh every ${intervalHours} hours`);
}

/**
 * Manual trigger for data refresh
 */
export async function triggerDataRefresh(): Promise<{
  success: boolean;
  gdeltCount: number;
  bankCount: number;
  totalCount: number;
}> {
  try {
    const gdeltEvents = await fetchGDELTEvents();
    const bankIndicators = await fetchWorldBankIndicators();
    
    return {
      success: true,
      gdeltCount: gdeltEvents.length,
      bankCount: bankIndicators.length,
      totalCount: gdeltEvents.length + bankIndicators.length,
    };
  } catch (error) {
    console.error('Error triggering data refresh:', error);
    return {
      success: false,
      gdeltCount: 0,
      bankCount: 0,
      totalCount: 0,
    };
  }
}
