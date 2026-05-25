/**
 * Source Weighting System
 *
 * Assigns credibility weights to sources. This supports EventVector confidence,
 * RAG grounding and market-event interpretation.
 */

export type SourceType =
  | 'reuters' | 'bbc' | 'cnn' | 'aljazeera' | 'ap' | 'afp'
  | 'nytimes' | 'guardian' | 'washpost' | 'economist'
  | 'twitter' | 'x' | 'reddit' | 'telegram' | 'mastodon' | 'bluesky' | 'youtube' | 'facebook' | 'instagram' | 'tiktok'
  | 'blog' | 'medium' | 'substack'
  | 'news_api' | 'gnews'
  | 'unknown';

export interface SourceWeight {
  source: SourceType;
  weight: number;
  credibilityScore: number;
  category: 'news_agency' | 'major_newspaper' | 'social_media' | 'blog' | 'api' | 'unknown';
  description: string;
  biasLevel: 'low' | 'medium' | 'high';
}

export interface WeightedContent {
  content: string;
  source: string;
  weight: number;
  weightedScore: number;
  metadata?: Record<string, unknown>;
}

export const SOURCE_WEIGHTS: Record<SourceType, SourceWeight> = {
  reuters: { source: 'reuters', weight: 1, credibilityScore: 98, category: 'news_agency', description: 'Global news agency with strong editorial standards.', biasLevel: 'low' },
  ap: { source: 'ap', weight: 0.98, credibilityScore: 97, category: 'news_agency', description: 'Associated Press wire service.', biasLevel: 'low' },
  afp: { source: 'afp', weight: 0.96, credibilityScore: 95, category: 'news_agency', description: 'Agence France-Presse wire service.', biasLevel: 'low' },
  bbc: { source: 'bbc', weight: 0.92, credibilityScore: 90, category: 'major_newspaper', description: 'Major international broadcaster.', biasLevel: 'medium' },
  cnn: { source: 'cnn', weight: 0.82, credibilityScore: 82, category: 'major_newspaper', description: 'Major international broadcaster.', biasLevel: 'medium' },
  aljazeera: { source: 'aljazeera', weight: 0.86, credibilityScore: 85, category: 'major_newspaper', description: 'Major international broadcaster with regional strength.', biasLevel: 'medium' },
  nytimes: { source: 'nytimes', weight: 0.88, credibilityScore: 88, category: 'major_newspaper', description: 'Major newspaper.', biasLevel: 'medium' },
  guardian: { source: 'guardian', weight: 0.84, credibilityScore: 84, category: 'major_newspaper', description: 'Major newspaper.', biasLevel: 'medium' },
  washpost: { source: 'washpost', weight: 0.84, credibilityScore: 84, category: 'major_newspaper', description: 'Major newspaper.', biasLevel: 'medium' },
  economist: { source: 'economist', weight: 0.9, credibilityScore: 90, category: 'major_newspaper', description: 'Analysis-oriented publication.', biasLevel: 'medium' },
  news_api: { source: 'news_api', weight: 0.75, credibilityScore: 75, category: 'api', description: 'Aggregated news API.', biasLevel: 'medium' },
  gnews: { source: 'gnews', weight: 0.72, credibilityScore: 72, category: 'api', description: 'Aggregated news provider.', biasLevel: 'medium' },
  reddit: { source: 'reddit', weight: 0.45, credibilityScore: 45, category: 'social_media', description: 'Social discussion signal.', biasLevel: 'high' },
  twitter: { source: 'twitter', weight: 0.42, credibilityScore: 42, category: 'social_media', description: 'Fast social signal.', biasLevel: 'high' },
  x: { source: 'x', weight: 0.42, credibilityScore: 42, category: 'social_media', description: 'Fast social signal.', biasLevel: 'high' },
  telegram: { source: 'telegram', weight: 0.38, credibilityScore: 38, category: 'social_media', description: 'Channel-based social signal.', biasLevel: 'high' },
  mastodon: { source: 'mastodon', weight: 0.4, credibilityScore: 40, category: 'social_media', description: 'Federated social signal.', biasLevel: 'high' },
  bluesky: { source: 'bluesky', weight: 0.4, credibilityScore: 40, category: 'social_media', description: 'Social signal.', biasLevel: 'high' },
  youtube: { source: 'youtube', weight: 0.35, credibilityScore: 35, category: 'social_media', description: 'Video and comment signal.', biasLevel: 'high' },
  facebook: { source: 'facebook', weight: 0.32, credibilityScore: 32, category: 'social_media', description: 'Social network signal.', biasLevel: 'high' },
  instagram: { source: 'instagram', weight: 0.3, credibilityScore: 30, category: 'social_media', description: 'Visual social signal.', biasLevel: 'high' },
  tiktok: { source: 'tiktok', weight: 0.28, credibilityScore: 28, category: 'social_media', description: 'Short-form social signal.', biasLevel: 'high' },
  blog: { source: 'blog', weight: 0.25, credibilityScore: 25, category: 'blog', description: 'Unverified blog source.', biasLevel: 'high' },
  medium: { source: 'medium', weight: 0.28, credibilityScore: 28, category: 'blog', description: 'Publishing platform source.', biasLevel: 'high' },
  substack: { source: 'substack', weight: 0.28, credibilityScore: 28, category: 'blog', description: 'Newsletter source.', biasLevel: 'high' },
  unknown: { source: 'unknown', weight: 0.2, credibilityScore: 20, category: 'unknown', description: 'Unknown source.', biasLevel: 'high' },
};

const SOURCE_KEYWORDS: Record<string, SourceType> = {
  reuters: 'reuters', bbc: 'bbc', cnn: 'cnn', aljazeera: 'aljazeera', 'al jazeera': 'aljazeera',
  'ap news': 'ap', 'associated press': 'ap', afp: 'afp', 'france presse': 'afp',
  'new york times': 'nytimes', nyt: 'nytimes', guardian: 'guardian', 'washington post': 'washpost', economist: 'economist',
  twitter: 'twitter', 'x.com': 'x', reddit: 'reddit', telegram: 'telegram', mastodon: 'mastodon', bluesky: 'bluesky', youtube: 'youtube',
  facebook: 'facebook', instagram: 'instagram', tiktok: 'tiktok', medium: 'medium', substack: 'substack', newsapi: 'news_api', gnews: 'gnews',
};

export function getSourceWeight(source: string): SourceWeight {
  const normalized = source.toLowerCase().trim();
  if ((SOURCE_WEIGHTS as Record<string, SourceWeight>)[normalized]) return (SOURCE_WEIGHTS as Record<string, SourceWeight>)[normalized];
  for (const [keyword, type] of Object.entries(SOURCE_KEYWORDS)) {
    if (normalized.includes(keyword)) return SOURCE_WEIGHTS[type];
  }
  return SOURCE_WEIGHTS.unknown;
}

export function detectSourceFromUrl(url: string): SourceType {
  const lower = url.toLowerCase();
  for (const [keyword, source] of Object.entries(SOURCE_KEYWORDS)) {
    if (lower.includes(keyword.replace(' ', ''))) return source;
  }
  if (lower.includes('blog')) return 'blog';
  return 'unknown';
}

export function applySourceWeights(contents: Array<{ content: string; source: string; score?: number; metadata?: Record<string, unknown> }>): WeightedContent[] {
  return contents.map(item => {
    const sourceWeight = getSourceWeight(item.source);
    const baseScore = item.score ?? 1;
    return { content: item.content, source: item.source, weight: sourceWeight.weight, weightedScore: baseScore * sourceWeight.weight, metadata: item.metadata };
  });
}

export function calculateWeightedAverage(values: number[], weights: number[]): number {
  if (values.length === 0 || values.length !== weights.length) return 0;
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  if (totalWeight === 0) return 0;
  return values.reduce((sum, value, index) => sum + value * weights[index], 0) / totalWeight;
}

export function calculateWeightedEmotions(emotionsBySource: Array<{ source: SourceType; emotions: Record<string, number> }>): Record<string, number> {
  const allEmotions = new Set(emotionsBySource.flatMap(item => Object.keys(item.emotions)));
  const result: Record<string, number> = {};
  for (const emotion of allEmotions) {
    const values = emotionsBySource.map(item => item.emotions[emotion] ?? 0);
    const weights = emotionsBySource.map(item => SOURCE_WEIGHTS[item.source]?.weight ?? SOURCE_WEIGHTS.unknown.weight);
    result[emotion] = calculateWeightedAverage(values, weights);
  }
  return result;
}

export function getSourcesSummary(sources: SourceType[]): { totalSources: number; averageCredibility: number; byCategory: Record<string, number>; highCredibilityCount: number } {
  const byCategory: Record<string, number> = {};
  let credibilitySum = 0;
  let highCredibilityCount = 0;
  for (const source of sources) {
    const info = SOURCE_WEIGHTS[source] || SOURCE_WEIGHTS.unknown;
    byCategory[info.category] = (byCategory[info.category] || 0) + 1;
    credibilitySum += info.credibilityScore;
    if (info.credibilityScore >= 80) highCredibilityCount += 1;
  }
  return { totalSources: sources.length, averageCredibility: sources.length ? credibilitySum / sources.length : 0, byCategory, highCredibilityCount };
}
