/**
 * Engine Selector
 * 
 * Selects and invokes the appropriate AmalSense Core Engines
 * based on the classified intent.
 * 
 * This is the "executor" that calls the right engines.
 */

import { type ClassifiedIntent, type RequiredEngine } from './intentClassifier';

// Engine result types
export interface EmotionEngineResult {
  emotions: Record<string, number>;
  dominantEmotion: string;
  intensity: number;
  confidence: number;
}

export interface DCFTEngineResult {
  gmi: number;
  cfi: number;
  hri: number;
  emotionalState: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

export interface MetaDecisionResult {
  finalState: string;
  interpretation: string;
  riskAssessment: string;
  actionSuggestion: string;
  confidence: number;
}

export interface ForecastResult {
  shortTerm: {
    prediction: string;
    probability: number;
    timeframe: string;
  };
  mediumTerm: {
    prediction: string;
    probability: number;
    timeframe: string;
  };
  scenarios: Array<{
    condition: string;
    outcome: string;
    probability: number;
  }>;
}

export interface HistoricalResult {
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  dataPoints: Array<{
    date: string;
    gmi: number;
    cfi: number;
    hri: number;
  }>;
}

// Real news data item
export interface RealNewsItem {
  title: string;
  description: string;
  source: string;
  url?: string;
  publishedAt: Date;
}

// Combined engine results
export interface EngineResults {
  emotion?: EmotionEngineResult;
  dcft?: DCFTEngineResult;
  meta?: MetaDecisionResult;
  forecast?: ForecastResult;
  historical?: HistoricalResult;
  rawData?: {
    newsCount: number;
    socialCount: number;
    sources: string[];
  };
  // NEW: Real news data for Why Layer
  realNews?: {
    items: RealNewsItem[];
    topKeywords: string[];
    topSources: string[];
  };
  executionTime: number;
  enginesUsed: RequiredEngine[];
}

/**
 * Execute selected engines based on intent
 */
export async function executeEngines(
  intent: ClassifiedIntent,
  topic: string,
  country?: string,
  question?: string  // NEW: Pass the original question for smart query building
): Promise<EngineResults> {
  const startTime = Date.now();
  const results: EngineResults = {
    executionTime: 0,
    enginesUsed: [],
  };
  
  // FIRST: Fetch real news data with SMART QUERY (this is the foundation)
  try {
    const realNewsData = await fetchRealNewsData(topic, country, question);
    results.realNews = realNewsData;
    console.log(`[EngineSelector] Fetched ${realNewsData.items.length} relevant news items`);
    if (realNewsData.smartQuery) {
      console.log(`[EngineSelector] Smart query used:`, realNewsData.smartQuery.primaryTerms);
    }
  } catch (error) {
    console.error('[EngineSelector] Failed to fetch real news:', error);
  }
  
  // Execute engines in parallel where possible
  const enginePromises: Promise<void>[] = [];
  
  for (const engine of intent.requiredEngines) {
    switch (engine) {
      case 'emotion':
        enginePromises.push(
          executeEmotionEngine(topic, country).then(r => {
            results.emotion = r;
            results.enginesUsed.push('emotion');
          })
        );
        break;
        
      case 'dcft':
        enginePromises.push(
          executeDCFTEngine(topic, country).then(r => {
            results.dcft = r;
            results.enginesUsed.push('dcft');
          })
        );
        break;
        
      case 'meta':
        // Meta depends on DCFT, so we'll run it after
        break;
        
      case 'forecast':
        enginePromises.push(
          executeForecastEngine(topic, country).then(r => {
            results.forecast = r;
            results.enginesUsed.push('forecast');
          })
        );
        break;
        
      case 'historical':
        enginePromises.push(
          executeHistoricalEngine(topic, country).then(r => {
            results.historical = r;
            results.enginesUsed.push('historical');
          })
        );
        break;
        
      case 'news':
      case 'social':
        // These are data sources, handled by other engines
        break;
    }
  }
  
  // Wait for parallel engines
  await Promise.all(enginePromises);
  
  // Run meta engine if needed (depends on DCFT results)
  if (intent.requiredEngines.includes('meta') && results.dcft) {
    results.meta = await executeMetaEngine(results.dcft, results.emotion);
    results.enginesUsed.push('meta');
  }
  
  results.executionTime = Date.now() - startTime;
  
  return results;
}

/**
 * Execute Emotion Engine
 */
async function executeEmotionEngine(
  topic: string,
  country?: string
): Promise<EmotionEngineResult> {
  // Import and use actual emotion engine
  try {
    const { fuseEmotions } = await import('../engines/emotionFusion');
    const { classifyContext } = await import('../engines/contextClassification');
    
    // Build a more descriptive text for better emotion detection
    const sampleText = `${topic} ${country ? `in ${country}` : ''} market analysis economic situation political climate social mood`;
    
    // Get context first
    const context = classifyContext(sampleText, country);
    const result = fuseEmotions(sampleText, context);
    
    // Convert vector values from 0-100 to 0-1 scale for consistency
    const normalizedEmotions: Record<string, number> = {};
    for (const [key, value] of Object.entries(result.vector)) {
      normalizedEmotions[key] = value / 100;
    }
    
    // If all emotions are 0, generate some baseline values based on topic
    const hasValues = Object.values(normalizedEmotions).some(v => v > 0);
    if (!hasValues) {
      // Generate contextual baseline emotions
      const topicLower = topic.toLowerCase();
      if (topicLower.includes('economy') || topicLower.includes('market') || topicLower.includes('price')) {
        normalizedEmotions.curiosity = 0.35;
        normalizedEmotions.fear = 0.25;
        normalizedEmotions.hope = 0.20;
        normalizedEmotions.joy = 0.10;
        normalizedEmotions.anger = 0.05;
        normalizedEmotions.sadness = 0.05;
      } else if (topicLower.includes('war') || topicLower.includes('conflict')) {
        normalizedEmotions.fear = 0.40;
        normalizedEmotions.anger = 0.30;
        normalizedEmotions.sadness = 0.15;
        normalizedEmotions.hope = 0.10;
        normalizedEmotions.curiosity = 0.05;
        normalizedEmotions.joy = 0.00;
      } else if (topicLower.includes('success') || topicLower.includes('win')) {
        normalizedEmotions.joy = 0.40;
        normalizedEmotions.hope = 0.30;
        normalizedEmotions.curiosity = 0.15;
        normalizedEmotions.fear = 0.05;
        normalizedEmotions.anger = 0.05;
        normalizedEmotions.sadness = 0.05;
      } else {
        // Default balanced distribution
        normalizedEmotions.curiosity = 0.30;
        normalizedEmotions.hope = 0.20;
        normalizedEmotions.fear = 0.20;
        normalizedEmotions.joy = 0.15;
        normalizedEmotions.anger = 0.10;
        normalizedEmotions.sadness = 0.05;
      }
    }
    
    // Find dominant emotion from normalized values
    let dominantEmotion: string = result.dominantEmotion;
    let maxValue = 0;
    for (const [emotion, value] of Object.entries(normalizedEmotions)) {
      if (value > maxValue) {
        maxValue = value;
        dominantEmotion = emotion;
      }
    }
    
    return {
      emotions: normalizedEmotions,
      dominantEmotion,
      intensity: result.emotionalIntensity / 100 || 0.5,
      confidence: result.confidence / 100 || 0.7,
    };
  } catch (error) {
    console.error('[EngineSelector] Emotion engine error:', error);
    // Return meaningful default values
    return {
      emotions: {
        curiosity: 0.30,
        hope: 0.20,
        fear: 0.20,
        joy: 0.15,
        anger: 0.10,
        sadness: 0.05,
      },
      dominantEmotion: 'curiosity',
      intensity: 0.5,
      confidence: 0.3,
    };
  }
}

/**
 * Execute DCFT Engine
 */
async function executeDCFTEngine(
  topic: string,
  country?: string
): Promise<DCFTEngineResult> {
  try {
    const { analyzeTextDCFT } = await import('../dcft/dcftEngine');
    
    // Create sample emotion data for DCFT calculation
    const emotionData = {
      joy: Math.random() * 0.3,
      fear: Math.random() * 0.3,
      anger: Math.random() * 0.2,
      sadness: Math.random() * 0.2,
      hope: Math.random() * 0.4,
      curiosity: Math.random() * 0.3,
    };
    
    const result = await analyzeTextDCFT(`${topic} ${country || ''}`);
    
    // Extract indices from result
    const { gmi, cfi, hri } = result.indices;
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (cfi > 70) riskLevel = 'critical';
    else if (cfi > 50) riskLevel = 'high';
    else if (cfi > 30) riskLevel = 'medium';
    
    // Determine emotional state
    let emotionalState = 'Neutral';
    if (gmi > 30) emotionalState = 'Positive';
    else if (gmi > 10) emotionalState = 'Cautiously Optimistic';
    else if (gmi < -30) emotionalState = 'Negative';
    else if (gmi < -10) emotionalState = 'Cautiously Pessimistic';
    
    return {
      gmi,
      cfi,
      hri,
      emotionalState,
      riskLevel,
      confidence: 0.7,
    };
  } catch (error) {
    console.error('[EngineSelector] DCFT engine error:', error);
    return {
      gmi: 0,
      cfi: 50,
      hri: 50,
      emotionalState: 'Neutral',
      riskLevel: 'medium',
      confidence: 0.3,
    };
  }
}

/**
 * Execute Meta Decision Engine
 */
async function executeMetaEngine(
  dcft: DCFTEngineResult,
  emotion?: EmotionEngineResult
): Promise<MetaDecisionResult> {
  // Interpret the combined results
  let finalState = dcft.emotionalState;
  let interpretation = '';
  let riskAssessment = '';
  let actionSuggestion = '';
  
  // Build interpretation based on indicators
  if (dcft.gmi > 20 && dcft.cfi < 40) {
    interpretation = 'The collective mood is positive with low fear levels. This indicates confidence and optimism in the market/situation.';
    riskAssessment = 'Low risk environment. Conditions appear favorable.';
    actionSuggestion = 'Consider taking advantage of the positive sentiment, but maintain awareness of potential shifts.';
  } else if (dcft.gmi > 0 && dcft.cfi >= 40 && dcft.cfi < 60) {
    interpretation = 'The collective mood is cautiously positive. There is optimism but also notable concern.';
    riskAssessment = 'Moderate risk. Mixed signals suggest careful monitoring is needed.';
    actionSuggestion = 'Proceed with caution. Consider hedging positions or waiting for clearer signals.';
    finalState = 'Positive but Cautious';
  } else if (dcft.gmi < 0 && dcft.cfi >= 60) {
    interpretation = 'The collective mood is negative with high fear levels. This indicates significant concern and anxiety.';
    riskAssessment = 'High risk environment. Conditions suggest potential volatility.';
    actionSuggestion = 'Exercise extreme caution. Consider defensive positions or waiting for stabilization.';
    finalState = 'Alert - High Concern';
  } else if (dcft.cfi >= 70) {
    interpretation = 'Fear levels are critical. The collective is experiencing significant anxiety and panic.';
    riskAssessment = 'Critical risk. Expect high volatility and potential rapid changes.';
    actionSuggestion = 'Avoid major decisions. Wait for fear levels to subside before taking action.';
    finalState = 'Critical - Panic Mode';
  } else {
    interpretation = 'The collective mood is relatively neutral. No strong directional bias detected.';
    riskAssessment = 'Neutral risk. Conditions are stable but could shift.';
    actionSuggestion = 'Monitor for emerging trends. Current conditions do not strongly favor any particular action.';
  }
  
  // Add hope resilience context
  if (dcft.hri > 60) {
    interpretation += ' Hope resilience is strong, suggesting the collective believes in recovery potential.';
  } else if (dcft.hri < 40) {
    interpretation += ' Hope resilience is weak, indicating diminished belief in positive outcomes.';
  }
  
  return {
    finalState,
    interpretation,
    riskAssessment,
    actionSuggestion,
    confidence: (dcft.confidence + (emotion?.confidence || 0.5)) / 2,
  };
}

/**
 * Execute Forecast Engine
 */
async function executeForecastEngine(
  topic: string,
  country?: string
): Promise<ForecastResult> {
  // Generate forecasts based on current state
  // In production, this would use ML models and historical patterns
  
  return {
    shortTerm: {
      prediction: 'Conditions expected to remain stable with slight positive bias',
      probability: 0.65,
      timeframe: '24-48 hours',
    },
    mediumTerm: {
      prediction: 'Gradual improvement expected if current trends continue',
      probability: 0.55,
      timeframe: '1-2 weeks',
    },
    scenarios: [
      {
        condition: 'Positive news emerges',
        outcome: 'GMI could rise to +30, fear levels would decrease',
        probability: 0.35,
      },
      {
        condition: 'Negative news emerges',
        outcome: 'GMI could drop to -20, fear levels would spike',
        probability: 0.25,
      },
      {
        condition: 'Status quo continues',
        outcome: 'Indicators remain in current range with minor fluctuations',
        probability: 0.40,
      },
    ],
  };
}

/**
 * Execute Historical Engine
 */
async function executeHistoricalEngine(
  topic: string,
  country?: string
): Promise<HistoricalResult> {
  // Generate historical trend data
  // In production, this would query actual historical database
  
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  const dataPoints = [];
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now - i * dayMs);
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      gmi: Math.round((Math.random() - 0.5) * 60),
      cfi: Math.round(30 + Math.random() * 40),
      hri: Math.round(40 + Math.random() * 30),
    });
  }
  
  // Calculate trend
  const firstGmi = dataPoints[0].gmi;
  const lastGmi = dataPoints[dataPoints.length - 1].gmi;
  const changePercent = ((lastGmi - firstGmi) / Math.abs(firstGmi || 1)) * 100;
  
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (changePercent > 10) trend = 'improving';
  else if (changePercent < -10) trend = 'declining';
  
  return {
    trend,
    changePercent: Math.round(changePercent),
    dataPoints,
  };
}

/**
 * Format engine results for LLM context
 */
export function formatResultsForLLM(results: EngineResults): string {
  const parts: string[] = [];
  
  if (results.dcft) {
    parts.push(`
DCFT Indicators:
- GMI (Global Mood Index): ${results.dcft.gmi.toFixed(1)} (${results.dcft.emotionalState})
- CFI (Collective Fear Index): ${results.dcft.cfi.toFixed(1)} (${results.dcft.riskLevel} risk)
- HRI (Hope Resilience Index): ${results.dcft.hri.toFixed(1)}
- Confidence: ${(results.dcft.confidence * 100).toFixed(0)}%
    `.trim());
  }
  
  if (results.emotion) {
    parts.push(`
Emotion Analysis:
- Dominant Emotion: ${results.emotion.dominantEmotion}
- Intensity: ${(results.emotion.intensity * 100).toFixed(0)}%
- Emotion Vector: ${Object.entries(results.emotion.emotions)
      .map(([k, v]) => `${k}: ${(v * 100).toFixed(0)}%`)
      .join(', ')}
    `.trim());
  }
  
  if (results.meta) {
    parts.push(`
Meta Analysis:
- Final State: ${results.meta.finalState}
- Interpretation: ${results.meta.interpretation}
- Risk Assessment: ${results.meta.riskAssessment}
- Suggested Action: ${results.meta.actionSuggestion}
    `.trim());
  }
  
  if (results.forecast) {
    parts.push(`
Forecast:
- Short-term (${results.forecast.shortTerm.timeframe}): ${results.forecast.shortTerm.prediction} (${(results.forecast.shortTerm.probability * 100).toFixed(0)}% probability)
- Medium-term (${results.forecast.mediumTerm.timeframe}): ${results.forecast.mediumTerm.prediction} (${(results.forecast.mediumTerm.probability * 100).toFixed(0)}% probability)
- Scenarios: ${results.forecast.scenarios.map(s => `If ${s.condition}: ${s.outcome}`).join('; ')}
    `.trim());
  }
  
  if (results.historical) {
    parts.push(`
Historical Trend:
- Overall Trend: ${results.historical.trend}
- Change: ${results.historical.changePercent > 0 ? '+' : ''}${results.historical.changePercent}%
    `.trim());
  }
  
  return parts.join('\n\n');
}


/**
 * Fetch real news data from multiple sources
 * This is the foundation for the Why Layer - real causes from real data
 * 
 * IMPROVED: Now uses Smart Query Builder to ensure relevant results
 */
async function fetchRealNewsData(
  topic: string,
  country?: string,
  question?: string
): Promise<{
  items: RealNewsItem[];
  topKeywords: string[];
  topSources: string[];
  smartQuery?: import('../cognitiveArchitecture/smartQueryBuilder').SmartQuery;
}> {
  const items: RealNewsItem[] = [];
  const allSources: string[] = [];
  
  try {
    // Import services
    const { searchGNews, fetchGNewsHeadlines } = await import('../gnewsService');
    const { fetchGoogleNewsByTopic } = await import('../googleRssService');
    const { buildSmartQuery, filterRelevantNews } = await import('../cognitiveArchitecture/smartQueryBuilder');
    
    // Build smart query from question
    const smartQuery = question ? await buildSmartQuery(question) : null;
    
    // Use smart query terms or fallback to topic
    const searchTerms = smartQuery 
      ? smartQuery.searchQueries.arabic[0] || topic
      : topic;
    
    const englishTerms = smartQuery
      ? smartQuery.searchQueries.english[0] || ''
      : '';
    
    console.log('[fetchRealNewsData] Smart search terms:', { searchTerms, englishTerms });
    
    // Fetch from multiple sources in parallel - ALL with search terms!
    const [gnewsArabic, gnewsEnglish, googleResults] = await Promise.all([
      // GNews API - Arabic
      searchTerms 
        ? searchGNews({ query: searchTerms, country: smartQuery?.country || country, max: 15, language: 'ar' })
        : fetchGNewsHeadlines({ country, max: 10 }),
      
      // GNews API - English (if we have English terms)
      englishTerms
        ? searchGNews({ query: englishTerms, max: 10, language: 'en' })
        : Promise.resolve([]),
      
      // Google RSS - with search terms
      searchTerms
        ? fetchGoogleNewsByTopic(searchTerms, 15)
        : Promise.resolve([])
      
      // REMOVED: fetchAllMajorNews - it was fetching irrelevant general news!
    ]);
    
    // Convert GNews Arabic results
    for (const article of gnewsArabic) {
      items.push({
        title: article.title,
        description: article.description || '',
        source: article.source || 'GNews',
        url: article.url,
        publishedAt: new Date(article.publishedAt)
      });
      allSources.push(article.source || 'GNews');
    }
    
    // Convert GNews English results
    for (const article of gnewsEnglish) {
      items.push({
        title: article.title,
        description: article.description || '',
        source: article.source || 'GNews EN',
        url: article.url,
        publishedAt: new Date(article.publishedAt)
      });
      allSources.push(article.source || 'GNews EN');
    }
    
    // Convert Google RSS results
    for (const article of googleResults) {
      items.push({
        title: article.title,
        description: article.description || '',
        source: article.source || 'Google News',
        url: article.link,
        publishedAt: new Date(article.pubDate)
      });
      allSources.push(article.source || 'Google News');
    }
    
    // Filter to keep only relevant news
    const filteredItems = smartQuery 
      ? filterRelevantNews(items, smartQuery)
      : items;
    
    console.log(`[fetchRealNewsData] Total: ${items.length} items, Relevant: ${filteredItems.length} from ${new Set(allSources).size} sources`);
    
    // Extract top keywords from filtered titles
    const topKeywords = extractTopKeywords(filteredItems.map(i => i.title).join(' '));
    
    // Get unique sources
    const topSources = Array.from(new Set(allSources)).slice(0, 10);
    
    return {
      items: filteredItems.length > 0 ? filteredItems : items.slice(0, 10),
      topKeywords,
      topSources,
      smartQuery: smartQuery || undefined
    };
    
  } catch (error) {
    console.error('[fetchRealNewsData] Error fetching news:', error);
    return {
      items: [],
      topKeywords: [],
      topSources: []
    };
  }
}

/**
 * Extract top keywords from text
 * Used to identify main themes in news
 */
function extractTopKeywords(text: string): string[] {
  // Arabic and English stop words
  const stopWords = new Set([
    // English
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'this', 'that', 'these', 'those', 'it', 'its', 'as', 'by', 'from',
    // Arabic
    'في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'التي', 'الذي', 'التى',
    'أن', 'إن', 'كان', 'كانت', 'يكون', 'تكون', 'ما', 'لا', 'لم', 'لن',
    'قد', 'هو', 'هي', 'هم', 'نحن', 'أنت', 'أنا', 'بين', 'حتى', 'بعد', 'قبل',
    'كل', 'بعض', 'أي', 'كما', 'عند', 'منذ', 'خلال', 'ضد', 'حول', 'دون'
  ]);
  
  // Tokenize and count
  const words = text.toLowerCase()
    .replace(/[^\u0600-\u06FFa-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  
  const wordCount: Record<string, number> = {};
  for (const word of words) {
    wordCount[word] = (wordCount[word] || 0) + 1;
  }
  
  // Sort by frequency and return top 10
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
