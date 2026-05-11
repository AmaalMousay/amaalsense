/**
 * Source Attribution System
 * 
 * Tracks and displays all news sources used in analysis
 * Shows credibility scores and data provenance
 */

export interface SourceInfo {
  name: string;
  url: string;
  credibilityScore: number;
  articleCount: number;
  lastUpdated: Date;
  category: 'major_news' | 'regional_news' | 'national_news' | 'social_media' | 'blog' | 'other';
  language: 'ar' | 'en' | 'mixed';
}

export interface AttributedStatistic {
  statistic: string;
  value: string | number;
  sources: SourceInfo[];
  confidence: number;
  timestamp: Date;
}

export interface SourceAttribution {
  sources: SourceInfo[];
  statistics: AttributedStatistic[];
  totalArticles: number;
  averageCredibility: number;
  dataCollectionPeriod: {
    start: Date;
    end: Date;
  };
  disclaimer: string;
}

/**
 * Categorize source by name
 */
function categorizeSource(sourceName: string): 'major_news' | 'regional_news' | 'national_news' | 'social_media' | 'blog' | 'other' {
  const lower = sourceName.toLowerCase();
  
  // Major international news
  if (lower.includes('reuters') || lower.includes('ap') || lower.includes('bbc') || 
      lower.includes('cnn') || lower.includes('nyt') || lower.includes('guardian')) {
    return 'major_news';
  }
  
  // Regional news
  if (lower.includes('aljazeera') || lower.includes('france24') || lower.includes('dw') ||
      lower.includes('euronews') || lower.includes('rfi')) {
    return 'regional_news';
  }
  
  // National news
  if (lower.includes('news') || lower.includes('times') || lower.includes('post') ||
      lower.includes('tribune') || lower.includes('gazette')) {
    return 'national_news';
  }
  
  // Social media
  if (lower.includes('twitter') || lower.includes('facebook') || lower.includes('instagram') ||
      lower.includes('tiktok') || lower.includes('youtube')) {
    return 'social_media';
  }
  
  // Blogs
  if (lower.includes('blog') || lower.includes('medium') || lower.includes('substack')) {
    return 'blog';
  }
  
  return 'other';
}

/**
 * Detect language of source
 */
function detectSourceLanguage(sourceName: string): 'ar' | 'en' | 'mixed' {
  const arabicSources = ['الجزيرة', 'العربية', 'سكاي', 'مصراوي', 'اليوم', 'الوطن', 'الأهرام'];
  const lower = sourceName.toLowerCase();
  
  const hasArabic = arabicSources.some(source => lower.includes(source.toLowerCase()));
  const hasEnglish = /bbc|reuters|cnn|ap|guardian|times/i.test(sourceName);
  
  if (hasArabic && hasEnglish) return 'mixed';
  if (hasArabic) return 'ar';
  if (hasEnglish) return 'en';
  
  return 'en'; // Default to English
}

/**
 * Create source info from article data
 */
export function createSourceInfo(
  sourceName: string,
  sourceUrl: string,
  credibilityScore: number,
  articleCount: number = 1
): SourceInfo {
  return {
    name: sourceName,
    url: sourceUrl,
    credibilityScore: Math.max(0, Math.min(1, credibilityScore)),
    articleCount,
    lastUpdated: new Date(),
    category: categorizeSource(sourceName),
    language: detectSourceLanguage(sourceName),
  };
}

/**
 * Merge duplicate sources
 */
export function mergeSources(sources: SourceInfo[]): SourceInfo[] {
  const merged: Record<string, SourceInfo> = {};
  
  for (const source of sources) {
    const key = source.name.toLowerCase();
    
    if (merged[key]) {
      merged[key].articleCount += source.articleCount;
      merged[key].credibilityScore = (merged[key].credibilityScore + source.credibilityScore) / 2;
      merged[key].lastUpdated = new Date(Math.max(
        merged[key].lastUpdated.getTime(),
        source.lastUpdated.getTime()
      ));
    } else {
      merged[key] = { ...source };
    }
  }
  
  return Object.values(merged);
}

/**
 * Sort sources by credibility
 */
export function sortSourcesByCredibility(sources: SourceInfo[]): SourceInfo[] {
  return [...sources].sort((a, b) => b.credibilityScore - a.credibilityScore);
}

/**
 * Sort sources by article count
 */
export function sortSourcesByArticleCount(sources: SourceInfo[]): SourceInfo[] {
  return [...sources].sort((a, b) => b.articleCount - a.articleCount);
}

/**
 * Get sources by category
 */
export function getSourcesByCategory(
  sources: SourceInfo[],
  category: 'major_news' | 'regional_news' | 'national_news' | 'social_media' | 'blog' | 'other'
): SourceInfo[] {
  return sources.filter(s => s.category === category);
}

/**
 * Calculate source diversity score
 */
export function calculateSourceDiversity(sources: SourceInfo[]): number {
  if (sources.length === 0) return 0;
  
  const categories = new Set(sources.map(s => s.category));
  const languages = new Set(sources.map(s => s.language));
  
  // Diversity score: 0-1
  // Based on number of categories and languages
  const categoryDiversity = Math.min(1, categories.size / 6); // 6 categories max
  const languageDiversity = Math.min(1, languages.size / 3); // 3 languages max
  
  return (categoryDiversity * 0.6 + languageDiversity * 0.4);
}

/**
 * Generate source attribution report
 */
export function generateSourceAttribution(
  sources: SourceInfo[],
  statistics: AttributedStatistic[],
  startDate: Date,
  endDate: Date
): SourceAttribution {
  const mergedSources = mergeSources(sources);
  const totalArticles = mergedSources.reduce((sum, s) => sum + s.articleCount, 0);
  const averageCredibility = mergedSources.reduce((sum, s) => sum + s.credibilityScore, 0) / mergedSources.length;
  
  const disclaimer = `This analysis is based on ${totalArticles} articles from ${mergedSources.length} sources ` +
    `collected between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}. ` +
    `Average source credibility: ${(averageCredibility * 100).toFixed(0)}%. ` +
    `Source diversity score: ${(calculateSourceDiversity(mergedSources) * 100).toFixed(0)}%.`;
  
  return {
    sources: sortSourcesByCredibility(mergedSources),
    statistics,
    totalArticles,
    averageCredibility: Math.round(averageCredibility * 100) / 100,
    dataCollectionPeriod: {
      start: startDate,
      end: endDate,
    },
    disclaimer,
  };
}

/**
 * Create attributed statistic
 */
export function createAttributedStatistic(
  statistic: string,
  value: string | number,
  sources: SourceInfo[],
  confidence: number = 0.8
): AttributedStatistic {
  return {
    statistic,
    value,
    sources: sortSourcesByCredibility(sources),
    confidence: Math.max(0, Math.min(1, confidence)),
    timestamp: new Date(),
  };
}

/**
 * Format source attribution for display
 */
export function formatSourceAttribution(attribution: SourceAttribution): {
  ar: string;
  en: string;
} {
  const sourceList = attribution.sources
    .map(s => `${s.name} (${(s.credibilityScore * 100).toFixed(0)}% credibility, ${s.articleCount} articles)`)
    .join('\n');
  
  const categoryBreakdown = attribution.sources
    .reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const categoryText = Object.entries(categoryBreakdown)
    .map(([cat, count]) => `${cat}: ${count}`)
    .join(', ');
  
  const ar = `
## مصادر البيانات

**إجمالي المقالات:** ${attribution.totalArticles}
**عدد المصادر:** ${attribution.sources.length}
**متوسط المصداقية:** ${(attribution.averageCredibility * 100).toFixed(0)}%
**فترة جمع البيانات:** ${attribution.dataCollectionPeriod.start.toLocaleDateString('ar-SA')} - ${attribution.dataCollectionPeriod.end.toLocaleDateString('ar-SA')}

**توزيع المصادر:**
${categoryText}

**المصادر الرئيسية:**
${sourceList}

**إخلاء المسؤولية:**
${attribution.disclaimer}
  `;
  
  const en = `
## Data Sources

**Total Articles:** ${attribution.totalArticles}
**Number of Sources:** ${attribution.sources.length}
**Average Credibility:** ${(attribution.averageCredibility * 100).toFixed(0)}%
**Data Collection Period:** ${attribution.dataCollectionPeriod.start.toLocaleDateString('en-US')} - ${attribution.dataCollectionPeriod.end.toLocaleDateString('en-US')}

**Source Distribution:**
${categoryText}

**Primary Sources:**
${sourceList}

**Disclaimer:**
${attribution.disclaimer}
  `;
  
  return { ar, en };
}
