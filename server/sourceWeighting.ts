/**
 * Source Weighting System - نظام وزن المصادر
 * 
 * يعطي وزن لكل مصدر بناءً على مصداقيته وجودته:
 * - مصادر إخبارية موثوقة: وزن عالي
 * - منصات تواصل اجتماعي: وزن متوسط
 * - مدونات ومصادر غير موثقة: وزن منخفض
 */

export type SourceType = 
  | 'reuters' | 'bbc' | 'cnn' | 'aljazeera' | 'ap' | 'afp'  // وكالات أنباء
  | 'nytimes' | 'guardian' | 'washpost' | 'economist'       // صحف كبرى
  | 'twitter' | 'x'                                          // تويتر/X
  | 'reddit'                                                 // ريديت
  | 'telegram'                                               // تيليجرام
  | 'mastodon'                                               // ماستودون
  | 'bluesky'                                                // بلوسكاي
  | 'youtube'                                                // يوتيوب
  | 'facebook' | 'instagram'                                 // ميتا
  | 'tiktok'                                                 // تيك توك
  | 'blog' | 'medium' | 'substack'                          // مدونات
  | 'news_api' | 'gnews'                                     // APIs
  | 'unknown';                                               // غير معروف

export interface SourceWeight {
  source: SourceType;
  weight: number;           // 0.0 - 1.0
  credibilityScore: number; // 0-100
  category: 'news_agency' | 'major_newspaper' | 'social_media' | 'blog' | 'api' | 'unknown';
  description: string;
  biasLevel: 'low' | 'medium' | 'high';
}

// جدول أوزان المصادر
export const SOURCE_WEIGHTS: Record<SourceType, SourceWeight> = {
  // وكالات أنباء عالمية - أعلى مصداقية
  reuters: {
    source: 'reuters',
    weight: 1.0,
    credibilityScore: 98,
    category: 'news_agency',
    description: 'وكالة رويترز - أكبر وكالة أنباء عالمية',
    biasLevel: 'low',
  },
  bbc: {
    source: 'bbc',
    weight: 0.95,
    credibilityScore: 95,
    category: 'news_agency',
    description: 'هيئة الإذاعة البريطانية',
    biasLevel: 'low',
  },
  ap: {
    source: 'ap',
    weight: 1.0,
    credibilityScore: 98,
    category: 'news_agency',
    description: 'وكالة أسوشيتد برس',
    biasLevel: 'low',
  },
  afp: {
    source: 'afp',
    weight: 0.95,
    credibilityScore: 95,
    category: 'news_agency',
    description: 'وكالة فرانس برس',
    biasLevel: 'low',
  },
  aljazeera: {
    source: 'aljazeera',
    weight: 0.85,
    credibilityScore: 85,
    category: 'news_agency',
    description: 'قناة الجزيرة',
    biasLevel: 'medium',
  },
  cnn: {
    source: 'cnn',
    weight: 0.85,
    credibilityScore: 85,
    category: 'news_agency',
    description: 'شبكة CNN',
    biasLevel: 'medium',
  },
  
  // صحف كبرى
  nytimes: {
    source: 'nytimes',
    weight: 0.90,
    credibilityScore: 90,
    category: 'major_newspaper',
    description: 'نيويورك تايمز',
    biasLevel: 'medium',
  },
  guardian: {
    source: 'guardian',
    weight: 0.88,
    credibilityScore: 88,
    category: 'major_newspaper',
    description: 'الجارديان',
    biasLevel: 'medium',
  },
  washpost: {
    source: 'washpost',
    weight: 0.88,
    credibilityScore: 88,
    category: 'major_newspaper',
    description: 'واشنطن بوست',
    biasLevel: 'medium',
  },
  economist: {
    source: 'economist',
    weight: 0.92,
    credibilityScore: 92,
    category: 'major_newspaper',
    description: 'الإيكونوميست',
    biasLevel: 'low',
  },
  
  // منصات تواصل اجتماعي
  twitter: {
    source: 'twitter',
    weight: 0.70,
    credibilityScore: 60,
    category: 'social_media',
    description: 'تويتر - منصة تواصل اجتماعي',
    biasLevel: 'high',
  },
  x: {
    source: 'x',
    weight: 0.70,
    credibilityScore: 60,
    category: 'social_media',
    description: 'X (تويتر سابقاً)',
    biasLevel: 'high',
  },
  reddit: {
    source: 'reddit',
    weight: 0.80,
    credibilityScore: 70,
    category: 'social_media',
    description: 'ريديت - منتديات نقاش',
    biasLevel: 'medium',
  },
  telegram: {
    source: 'telegram',
    weight: 0.60,
    credibilityScore: 50,
    category: 'social_media',
    description: 'تيليجرام - قنوات ومجموعات',
    biasLevel: 'high',
  },
  mastodon: {
    source: 'mastodon',
    weight: 0.65,
    credibilityScore: 55,
    category: 'social_media',
    description: 'ماستودون - شبكة لامركزية',
    biasLevel: 'medium',
  },
  bluesky: {
    source: 'bluesky',
    weight: 0.65,
    credibilityScore: 55,
    category: 'social_media',
    description: 'بلوسكاي - شبكة اجتماعية',
    biasLevel: 'medium',
  },
  youtube: {
    source: 'youtube',
    weight: 0.65,
    credibilityScore: 55,
    category: 'social_media',
    description: 'يوتيوب - تعليقات الفيديوهات',
    biasLevel: 'high',
  },
  facebook: {
    source: 'facebook',
    weight: 0.55,
    credibilityScore: 45,
    category: 'social_media',
    description: 'فيسبوك',
    biasLevel: 'high',
  },
  instagram: {
    source: 'instagram',
    weight: 0.50,
    credibilityScore: 40,
    category: 'social_media',
    description: 'إنستجرام',
    biasLevel: 'high',
  },
  tiktok: {
    source: 'tiktok',
    weight: 0.45,
    credibilityScore: 35,
    category: 'social_media',
    description: 'تيك توك',
    biasLevel: 'high',
  },
  
  // مدونات
  blog: {
    source: 'blog',
    weight: 0.40,
    credibilityScore: 30,
    category: 'blog',
    description: 'مدونات عامة',
    biasLevel: 'high',
  },
  medium: {
    source: 'medium',
    weight: 0.50,
    credibilityScore: 45,
    category: 'blog',
    description: 'منصة Medium',
    biasLevel: 'medium',
  },
  substack: {
    source: 'substack',
    weight: 0.55,
    credibilityScore: 50,
    category: 'blog',
    description: 'منصة Substack',
    biasLevel: 'medium',
  },
  
  // APIs
  news_api: {
    source: 'news_api',
    weight: 0.75,
    credibilityScore: 70,
    category: 'api',
    description: 'News API - مجمع أخبار',
    biasLevel: 'low',
  },
  gnews: {
    source: 'gnews',
    weight: 0.75,
    credibilityScore: 70,
    category: 'api',
    description: 'GNews API - مجمع أخبار',
    biasLevel: 'low',
  },
  
  // غير معروف
  unknown: {
    source: 'unknown',
    weight: 0.30,
    credibilityScore: 20,
    category: 'unknown',
    description: 'مصدر غير معروف',
    biasLevel: 'high',
  },
};

/**
 * الحصول على وزن مصدر معين
 */
export function getSourceWeight(source: string): SourceWeight {
  const normalizedSource = source.toLowerCase().trim() as SourceType;
  
  // البحث عن المصدر بالاسم
  if (SOURCE_WEIGHTS[normalizedSource]) {
    return SOURCE_WEIGHTS[normalizedSource];
  }
  
  // البحث عن المصدر بالكلمات المفتاحية
  const sourceKeywords: Record<string, SourceType> = {
    'reuters': 'reuters',
    'bbc': 'bbc',
    'cnn': 'cnn',
    'aljazeera': 'aljazeera',
    'الجزيرة': 'aljazeera',
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
    'تيليجرام': 'telegram',
    'mastodon': 'mastodon',
    'bluesky': 'bluesky',
    'youtube': 'youtube',
    'يوتيوب': 'youtube',
    'facebook': 'facebook',
    'فيسبوك': 'facebook',
    'instagram': 'instagram',
    'انستجرام': 'instagram',
    'tiktok': 'tiktok',
    'تيك توك': 'tiktok',
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
 * تحديد نوع المصدر من URL
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
  originalWeight?: number; // الوزن الأصلي قبل التعديل
}

/**
 * تطبيق الأوزان على مجموعة من النصوص
 */
export function applySourceWeights(
  contents: Array<{ text: string; source: string; url?: string }>
): WeightedContent[] {
  return contents.map(content => {
    // تحديد المصدر من URL إذا كان متاحاً
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
 * حساب المتوسط الموزون للمشاعر
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
 * حساب المشاعر الموزونة من مصادر متعددة
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
 * الحصول على ملخص المصادر
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
