/**
 * Source Weighting System
 * 
 * وظيفته:
 * - تحديد وزن كل مصدر بيانات
 * - المصادر الموثوقة (Reuters, BBC) تحصل على وزن أعلى
 * - المصادر الاجتماعية تحصل على وزن أقل
 */

// أنواع المصادر
export type SourceType = 'news' | 'social' | 'forum' | 'official' | 'academic';

// تعريف المصدر
export interface Source {
  name: string;
  type: SourceType;
  baseWeight: number;
  reliability: number; // 0-1
  reach: number; // 0-1 (مدى الانتشار)
}

// قاعدة بيانات المصادر المعروفة
export const knownSources: Record<string, Source> = {
  // مصادر إخبارية موثوقة (وزن عالي)
  'reuters': { name: 'Reuters', type: 'news', baseWeight: 1.0, reliability: 0.95, reach: 0.9 },
  'bbc': { name: 'BBC', type: 'news', baseWeight: 1.0, reliability: 0.92, reach: 0.95 },
  'aljazeera': { name: 'Al Jazeera', type: 'news', baseWeight: 0.95, reliability: 0.88, reach: 0.85 },
  'cnn': { name: 'CNN', type: 'news', baseWeight: 0.9, reliability: 0.85, reach: 0.9 },
  'ap': { name: 'Associated Press', type: 'news', baseWeight: 1.0, reliability: 0.95, reach: 0.85 },
  'afp': { name: 'AFP', type: 'news', baseWeight: 0.95, reliability: 0.92, reach: 0.8 },
  'guardian': { name: 'The Guardian', type: 'news', baseWeight: 0.9, reliability: 0.88, reach: 0.75 },
  'nytimes': { name: 'New York Times', type: 'news', baseWeight: 0.9, reliability: 0.88, reach: 0.8 },
  
  // مصادر إخبارية عربية
  'alarabiya': { name: 'Al Arabiya', type: 'news', baseWeight: 0.85, reliability: 0.82, reach: 0.7 },
  'skynews_arabia': { name: 'Sky News Arabia', type: 'news', baseWeight: 0.85, reliability: 0.82, reach: 0.65 },
  
  // منصات اجتماعية (وزن متوسط)
  'twitter': { name: 'Twitter/X', type: 'social', baseWeight: 0.7, reliability: 0.5, reach: 0.95 },
  'reddit': { name: 'Reddit', type: 'social', baseWeight: 0.65, reliability: 0.55, reach: 0.7 },
  'facebook': { name: 'Facebook', type: 'social', baseWeight: 0.6, reliability: 0.45, reach: 0.9 },
  'instagram': { name: 'Instagram', type: 'social', baseWeight: 0.55, reliability: 0.4, reach: 0.85 },
  'tiktok': { name: 'TikTok', type: 'social', baseWeight: 0.5, reliability: 0.35, reach: 0.8 },
  'youtube': { name: 'YouTube', type: 'social', baseWeight: 0.7, reliability: 0.6, reach: 0.95 },
  'telegram': { name: 'Telegram', type: 'social', baseWeight: 0.6, reliability: 0.5, reach: 0.6 },
  'mastodon': { name: 'Mastodon', type: 'social', baseWeight: 0.6, reliability: 0.55, reach: 0.3 },
  'bluesky': { name: 'Bluesky', type: 'social', baseWeight: 0.6, reliability: 0.55, reach: 0.25 },
  
  // منتديات (وزن منخفض)
  'forum': { name: 'Generic Forum', type: 'forum', baseWeight: 0.5, reliability: 0.4, reach: 0.3 },
  'blog': { name: 'Blog', type: 'forum', baseWeight: 0.45, reliability: 0.35, reach: 0.2 },
  
  // مصادر رسمية (وزن عالي جداً)
  'government': { name: 'Government', type: 'official', baseWeight: 1.0, reliability: 0.9, reach: 0.7 },
  'un': { name: 'United Nations', type: 'official', baseWeight: 1.0, reliability: 0.95, reach: 0.8 },
  'who': { name: 'WHO', type: 'official', baseWeight: 1.0, reliability: 0.95, reach: 0.75 },
  
  // مصادر أكاديمية
  'academic': { name: 'Academic', type: 'academic', baseWeight: 0.9, reliability: 0.9, reach: 0.3 },
  'research': { name: 'Research Paper', type: 'academic', baseWeight: 0.95, reliability: 0.92, reach: 0.25 },
};

// أوزان افتراضية حسب نوع المصدر
export const defaultWeightsByType: Record<SourceType, number> = {
  news: 1.0,
  official: 1.0,
  academic: 0.9,
  social: 0.7,
  forum: 0.5,
};

/**
 * الحصول على وزن مصدر معين
 */
export function getSourceWeight(sourceName: string): number {
  const normalizedName = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // البحث في المصادر المعروفة
  for (const [key, source] of Object.entries(knownSources)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return source.baseWeight;
    }
  }
  
  // تخمين النوع من الاسم
  if (normalizedName.includes('news') || normalizedName.includes('times') || normalizedName.includes('post')) {
    return defaultWeightsByType.news;
  }
  if (normalizedName.includes('gov') || normalizedName.includes('official')) {
    return defaultWeightsByType.official;
  }
  if (normalizedName.includes('reddit') || normalizedName.includes('twitter') || normalizedName.includes('facebook')) {
    return defaultWeightsByType.social;
  }
  if (normalizedName.includes('forum') || normalizedName.includes('blog')) {
    return defaultWeightsByType.forum;
  }
  
  // وزن افتراضي
  return 0.6;
}

/**
 * الحصول على معلومات المصدر الكاملة
 */
export function getSourceInfo(sourceName: string): Source {
  const normalizedName = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const [key, source] of Object.entries(knownSources)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return source;
    }
  }
  
  // مصدر غير معروف
  return {
    name: sourceName,
    type: 'forum',
    baseWeight: 0.5,
    reliability: 0.4,
    reach: 0.3
  };
}

/**
 * حساب الوزن المركب (يأخذ في الاعتبار الموثوقية والانتشار)
 */
export function calculateCompositeWeight(sourceName: string): number {
  const source = getSourceInfo(sourceName);
  
  // الوزن المركب = الوزن الأساسي × الموثوقية × (0.5 + 0.5 × الانتشار)
  const compositeWeight = source.baseWeight * source.reliability * (0.5 + 0.5 * source.reach);
  
  return Math.round(compositeWeight * 100) / 100;
}

/**
 * حساب الوزن الإجمالي لمجموعة مصادر
 */
export function calculateAggregateWeight(sources: string[]): {
  totalWeight: number;
  averageWeight: number;
  weightedSources: { name: string; weight: number }[];
} {
  if (sources.length === 0) {
    return { totalWeight: 0, averageWeight: 0, weightedSources: [] };
  }
  
  const weightedSources = sources.map(name => ({
    name,
    weight: calculateCompositeWeight(name)
  }));
  
  const totalWeight = weightedSources.reduce((sum, s) => sum + s.weight, 0);
  const averageWeight = totalWeight / sources.length;
  
  return {
    totalWeight: Math.round(totalWeight * 100) / 100,
    averageWeight: Math.round(averageWeight * 100) / 100,
    weightedSources
  };
}

/**
 * تطبيق الأوزان على نتائج التحليل
 */
export function applySourceWeighting(
  results: { source: string; value: number }[]
): number {
  if (results.length === 0) return 0;
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const result of results) {
    const weight = calculateCompositeWeight(result.source);
    weightedSum += result.value * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
