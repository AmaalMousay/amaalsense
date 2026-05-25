import { t } from "../_core/i18n";

/**
 * Source Weighting System -   
 * 
 *        :
 * -   :  
 * -   :  
 * -    :  
 */

export type SourceType = 
  | 'reuters' | 'bbc' | 'cnn' | 'aljazeera' | 'ap' | 'afp'  //  
  | 'nytimes' | 'guardian' | 'washpost' | 'economist'       //  
  | 'twitter' | 'x'                                          // /X
  | 'reddit'                                                 // 
  | 'telegram'                                               // 
  | 'mastodon'                                               // 
  | 'bluesky'                                                // 
  | 'youtube'                                                // 
  | 'facebook' | 'instagram'                                 // 
  | 'tiktok'                                                 //  
  | 'blog' | 'medium' | 'substack'                          // 
  | 'news_api' | 'gnews'                                     // APIs
  | 'unknown';                                               //  

export interface SourceWeight {
  source: SourceType;
  weight: number;           // 0.0 - 1.0
  credibilityScore: number; // 0-100
  category: 'news_agency' | 'major_newspaper' | 'social_media' | 'blog' | 'api' | 'unknown';
  description: string;
  biasLevel: 'low' | 'medium' | 'high';
}

//   
export const SOURCE_WEIGHTS: Record<SourceType, SourceWeight> = {
  //    -  
  reuters: {
    source: 'reuters',
    weight: 1.0,
    credibilityScore: 98,
    category: 'news_agency',
    description: t('auto.engines_sourceWeighting.26.7116cfdf', 'ar'),
    biasLevel: 'low',
  },
  bbc: {
    source: 'bbc',
    weight: 0.95,
    credibilityScore: 95,
    category: 'news_agency',
    description: t('auto.engines_sourceWeighting.25.d51b7ee1', 'ar'),
    biasLevel: 'low',
  },
  ap: {
    source: 'ap',
    weight: 1.0,
    credibilityScore: 98,
    category: 'news_agency',
    description: t('auto.engines_sourceWeighting.24.da1eb09e', 'ar'),
    biasLevel: 'low',
  },
  afp: {
    source: 'afp',
    weight: 0.95,
    credibilityScore: 95,
    category: 'news_agency',
    description: t('auto.engines_sourceWeighting.23.db91c1e4', 'ar'),
    biasLevel: 'low',
  },
  aljazeera: {
    source: 'aljazeera',
    weight: 0.85,
    credibilityScore: 85,
    category: 'news_agency',
    description: t('auto.engines_sourceWeighting.22.334ed18d', 'ar'),
    biasLevel: 'medium',
  },
  cnn: {
    source: 'cnn',
    weight: 0.85,
    credibilityScore: 85,
    category: 'news_agency',
    description: t('auto.engines_sourceWeighting.21.fb75a576', 'ar'),
    biasLevel: 'medium',
  },
  
  //  
  nytimes: {
    source: 'nytimes',
    weight: 0.90,
    credibilityScore: 90,
    category: 'major_newspaper',
    description: t('auto.engines_sourceWeighting.20.47341cdf', 'ar'),
    biasLevel: 'medium',
  },
  guardian: {
    source: 'guardian',
    weight: 0.88,
    credibilityScore: 88,
    category: 'major_newspaper',
    description: t('auto.engines_sourceWeighting.19.24857720', 'ar'),
    biasLevel: 'medium',
  },
  washpost: {
    source: 'washpost',
    weight: 0.88,
    credibilityScore: 88,
    category: 'major_newspaper',
    description: t('auto.engines_sourceWeighting.18.9266be7e', 'ar'),
    biasLevel: 'medium',
  },
  economist: {
    source: 'economist',
    weight: 0.92,
    credibilityScore: 92,
    category: 'major_newspaper',
    description: t('auto.engines_sourceWeighting.17.ae024e37', 'ar'),
    biasLevel: 'low',
  },
  
  //   
  twitter: {
    source: 'twitter',
    weight: 0.70,
    credibilityScore: 60,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.16.86782a99', 'ar'),
    biasLevel: 'high',
  },
  x: {
    source: 'x',
    weight: 0.70,
    credibilityScore: 60,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.15.b101fc4e', 'ar'),
    biasLevel: 'high',
  },
  reddit: {
    source: 'reddit',
    weight: 0.80,
    credibilityScore: 70,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.14.70a85547', 'ar'),
    biasLevel: 'medium',
  },
  telegram: {
    source: 'telegram',
    weight: 0.60,
    credibilityScore: 50,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.13.af7cc9e6', 'ar'),
    biasLevel: 'high',
  },
  mastodon: {
    source: 'mastodon',
    weight: 0.65,
    credibilityScore: 55,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.12.bdb7828d', 'ar'),
    biasLevel: 'medium',
  },
  bluesky: {
    source: 'bluesky',
    weight: 0.65,
    credibilityScore: 55,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.11.49bb4d59', 'ar'),
    biasLevel: 'medium',
  },
  youtube: {
    source: 'youtube',
    weight: 0.65,
    credibilityScore: 55,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.10.8f9b40a0', 'ar'),
    biasLevel: 'high',
  },
  facebook: {
    source: 'facebook',
    weight: 0.55,
    credibilityScore: 45,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.9.ac86ec8e', 'ar'),
    biasLevel: 'high',
  },
  instagram: {
    source: 'instagram',
    weight: 0.50,
    credibilityScore: 40,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.8.b0e4e3f0', 'ar'),
    biasLevel: 'high',
  },
  tiktok: {
    source: 'tiktok',
    weight: 0.45,
    credibilityScore: 35,
    category: 'social_media',
    description: t('auto.engines_sourceWeighting.7.5f19dfe1', 'ar'),
    biasLevel: 'high',
  },
  
  // 
  blog: {
    source: 'blog',
    weight: 0.40,
    credibilityScore: 30,
    category: 'blog',
    description: t('auto.engines_sourceWeighting.6.6c48d1c3', 'ar'),
    biasLevel: 'high',
  },
  medium: {
    source: 'medium',
    weight: 0.50,
    credibilityScore: 45,
    category: 'blog',
    description: t('auto.engines_sourceWeighting.5.d09d963c', 'ar'),
    biasLevel: 'medium',
  },
  substack: {
    source: 'substack',
    weight: 0.55,
    credibilityScore: 50,
    category: 'blog',
    description: t('auto.engines_sourceWeighting.4.4edad830', 'ar'),
    biasLevel: 'medium',
  },
  
  // APIs
  news_api: {
    source: 'news_api',
    weight: 0.75,
    credibilityScore: 70,
    category: 'api',
    description: t('auto.engines_sourceWeighting.3.de58b8bc', 'ar'),
    biasLevel: 'low',
  },
  gnews: {
    source: 'gnews',
    weight: 0.75,
    credibilityScore: 70,
    category: 'api',
    description: t('auto.engines_sourceWeighting.2.764366f0', 'ar'),
    biasLevel: 'low',
  },
  
  //  
  unknown: {
    source: 'unknown',
    weight: 0.30,
    credibilityScore: 20,
    category: 'unknown',
    description: t('auto.engines_sourceWeighting.1.67a55b92', 'ar'),
    biasLevel: 'high',
  },
};

/**
 *     
 */
export function getSourceWeight(source: string): SourceWeight {
  const normalizedSource = source.toLowerCase().trim() as SourceType;
  
  //    
  if (SOURCE_WEIGHTS[normalizedSource]) {
    return SOURCE_WEIGHTS[normalizedSource];
  }
  
  //     
  const sourceKeywords: Record<string, SourceType> = {
    'reuters': 'reuters',
    'bbc': 'bbc',
    'cnn': 'cnn',
    'aljazeera': 'aljazeera',
    'ap news': 'ap',
    'associated press': 'ap',
    'afp': 'afp',
    'france presse': 'afp',
    'new york times': 'nytimes',
    'nyt': 'nytimes',
    'guardian': 'guardian',
    'washington post': 'washpost',
    'economist': 'economist',
    'twitter': 'twitter',
    'x.com': 'x',
    'reddit': 'reddit',
    'telegram': 'telegram',
    'mastodon': 'mastodon',
    'bluesky': 'bluesky',
    'youtube': 'youtube',
    'facebook': 'facebook',
    'instagram': 'instagram',
    'tiktok': 'tiktok',
    ' ': 'tiktok',
    'medium': 'medium',
    'substack': 'substack',
    'newsapi': 'news_api',
    'gnews': 'gnews',
  };
  
  for (const [keyword, sourceType] of Object.entries(sourceKeywords)) {
    if (source.toLowerCase().includes(keyword)) {
      return SOURCE_WEIGHTS[sourceType];
    }
  }
  
  return SOURCE_WEIGHTS.unknown;
}

/**
 *     URL
 */
export function detectSourceFromUrl(url: string): SourceType {
  const urlLower = url.toLowerCase();
  
  const urlPatterns: [RegExp, SourceType][] = [
    [/reuters\.com/i, 'reuters'],
    [/bbc\.(com|co\.uk)/i, 'bbc'],
    [/cnn\.com/i, 'cnn'],
    [/aljazeera\.(com|net)/i, 'aljazeera'],
    [/apnews\.com/i, 'ap'],
    [/afp\.com/i, 'afp'],
    [/nytimes\.com/i, 'nytimes'],
    [/theguardian\.com/i, 'guardian'],
    [/washingtonpost\.com/i, 'washpost'],
    [/economist\.com/i, 'economist'],
    [/twitter\.com|x\.com/i, 'twitter'],
    [/reddit\.com/i, 'reddit'],
    [/t\.me|telegram\./i, 'telegram'],
    [/mastodon\./i, 'mastodon'],
    [/bsky\.app/i, 'bluesky'],
    [/youtube\.com|youtu\.be/i, 'youtube'],
    [/facebook\.com|fb\.com/i, 'facebook'],
    [/instagram\.com/i, 'instagram'],
    [/tiktok\.com/i, 'tiktok'],
    [/medium\.com/i, 'medium'],
    [/substack\.com/i, 'substack'],
  ];
  
  for (const [pattern, sourceType] of urlPatterns) {
    if (pattern.test(urlLower)) {
      return sourceType;
    }
  }
  
  return 'unknown';
}

export interface WeightedContent {
  text: string;
  source: SourceType;
  weight: number;
  credibilityScore: number;
  originalWeight?: number; //    
}

/**
 *      
 */
export function applySourceWeights(
  contents: Array<{ text: string; source: string; url?: string }>
): WeightedContent[] {
  return contents.map(content => {
    //    URL   
    let sourceType: SourceType = 'unknown';
    if (content.url) {
      sourceType = detectSourceFromUrl(content.url);
    }
    if (sourceType === 'unknown' && content.source) {
      sourceType = getSourceWeight(content.source).source;
    }
    
    const sourceWeight = SOURCE_WEIGHTS[sourceType] || SOURCE_WEIGHTS.unknown;
    
    return {
      text: content.text,
      source: sourceType,
      weight: sourceWeight.weight,
      credibilityScore: sourceWeight.credibilityScore,
    };
  });
}

/**
 *    
 */
export function calculateWeightedAverage(
  values: number[],
  weights: number[]
): number {
  if (values.length !== weights.length || values.length === 0) {
    return 0;
  }
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (let i = 0; i < values.length; i++) {
    weightedSum += values[i] * weights[i];
    totalWeight += weights[i];
  }
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 *      
 */
export function calculateWeightedEmotions(
  emotionsBySource: Array<{
    emotions: { joy: number; fear: number; anger: number; sadness: number; hope: number; curiosity: number };
    source: SourceType;
  }>
): { joy: number; fear: number; anger: number; sadness: number; hope: number; curiosity: number } {
  if (emotionsBySource.length === 0) {
    return { joy: 0, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 };
  }
  
  const weights = emotionsBySource.map(e => SOURCE_WEIGHTS[e.source]?.weight || 0.3);
  
  return {
    joy: calculateWeightedAverage(emotionsBySource.map(e => e.emotions.joy), weights),
    fear: calculateWeightedAverage(emotionsBySource.map(e => e.emotions.fear), weights),
    anger: calculateWeightedAverage(emotionsBySource.map(e => e.emotions.anger), weights),
    sadness: calculateWeightedAverage(emotionsBySource.map(e => e.emotions.sadness), weights),
    hope: calculateWeightedAverage(emotionsBySource.map(e => e.emotions.hope), weights),
    curiosity: calculateWeightedAverage(emotionsBySource.map(e => e.emotions.curiosity), weights),
  };
}

/**
 *    
 */
export function getSourcesSummary(sources: SourceType[]): {
  totalSources: number;
  byCategory: Record<string, number>;
  averageCredibility: number;
  averageWeight: number;
} {
  const byCategory: Record<string, number> = {};
  let totalCredibility = 0;
  let totalWeight = 0;
  
  for (const source of sources) {
    const info = SOURCE_WEIGHTS[source] || SOURCE_WEIGHTS.unknown;
    byCategory[info.category] = (byCategory[info.category] || 0) + 1;
    totalCredibility += info.credibilityScore;
    totalWeight += info.weight;
  }
  
  return {
    totalSources: sources.length,
    byCategory,
    averageCredibility: sources.length > 0 ? totalCredibility / sources.length : 0,
    averageWeight: sources.length > 0 ? totalWeight / sources.length : 0,
  };
}
