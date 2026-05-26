/**
 * Deduplication Engine
 *
 * Prevents duplicate analyses and ensures unique results per topic/country.
 * Tracks previously computed results so the pipeline can reuse cached data
 * instead of re-running expensive collection and analysis.
 */

interface CachedAnalysis {
  topic: string;
  countryCode: string;
  indices: {
    gmi: number;
    cfi: number;
    hri: number;
    aci: number;
    sdi: number;
  };
  timestamp: number;
  dataHash: string;
}

export interface DeduplicationReport {
  isDuplicate: boolean;
  similarity: number;
  previousAnalysisTime?: number;
  suggestedAction: 'use_cache' | 'generate_new' | 'invalidate_cache';
}

const analysisCache = new Map<string, CachedAnalysis>();

const TOPIC_WEIGHTS: Record<string, { gmi: number; cfi: number; hri: number; aci: number; sdi: number }> = {
  economy:           { gmi: 15, cfi: -10, hri: 10, aci: 0,  sdi: 0   },
  politics:          { gmi: -10, cfi: 15, hri: -5, aci: 0,  sdi: 5   },
  conflict:          { gmi: -20, cfi: 25, hri: -15, aci: 0, sdi: 10  },
  society:           { gmi: 10, cfi: 0,  hri: 15, aci: 0,  sdi: 0    },
  health:            { gmi: -5,  cfi: 15, hri: 5,  aci: 0,  sdi: 0   },
  technology:        { gmi: 20, cfi: -5, hri: 20, aci: 0,  sdi: 0    },
  energy:            { gmi: 5,  cfi: 10, hri: 0,  aci: 0,  sdi: 0    },
  'vision 2030':     { gmi: 25, cfi: -20, hri: 20, aci: 0, sdi: 0    },
  environment:       { gmi: -10, cfi: 15, hri: -5, aci: 0, sdi: 5    },
  security:          { gmi: -15, cfi: 20, hri: -10, aci: 0, sdi: 10  },
  innovation:        { gmi: 20, cfi: -10, hri: 20, aci: 0, sdi: 0    },
};

function generateDataHash(
  topic: string,
  countryCode: string,
  indices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number },
): string {
  const data = `${topic}|${countryCode}|${indices.gmi}|${indices.cfi}|${indices.hri}|${indices.aci}|${indices.sdi}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateSimilarity(
  a: { gmi: number; cfi: number; hri: number; aci: number; sdi: number },
  b: { gmi: number; cfi: number; hri: number; aci: number; sdi: number },
): number {
  const maxDiff = 400;
  const diffs = [
    Math.abs(a.gmi - b.gmi),
    Math.abs(a.cfi - b.cfi),
    Math.abs(a.hri - b.hri),
    Math.abs(a.aci - b.aci),
    Math.abs(a.sdi - b.sdi),
  ].reduce((sum, d) => sum + d, 0);
  return 1 - diffs / maxDiff;
}

export function checkForDuplicates(
  topic: string,
  countryCode: string,
  indices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number },
  cacheExpiryMs = 3_600_000,
): DeduplicationReport {
  const key = `${topic}|${countryCode}`;
  const cached = analysisCache.get(key);
  if (!cached) return { isDuplicate: false, similarity: 0, suggestedAction: 'generate_new' };
  if (Date.now() - cached.timestamp > cacheExpiryMs) {
    return { isDuplicate: false, similarity: 0, suggestedAction: 'invalidate_cache' };
  }
  const similarity = calculateSimilarity(cached.indices, indices);
  if (similarity > 0.85) {
    return { isDuplicate: true, similarity, previousAnalysisTime: cached.timestamp, suggestedAction: 'use_cache' };
  }
  return { isDuplicate: false, similarity, suggestedAction: 'generate_new' };
}

export function registerAnalysis(
  topic: string,
  countryCode: string,
  indices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number },
): void {
  analysisCache.set(`${topic}|${countryCode}`, {
    topic, countryCode, indices, timestamp: Date.now(), dataHash: generateDataHash(topic, countryCode, indices),
  });
}

export function invalidateCache(topic?: string, countryCode?: string): number {
  let count = 0;
  if (topic && countryCode) {
    if (analysisCache.delete(`${topic}|${countryCode}`)) count = 1;
  } else if (topic) {
    for (const key of analysisCache.keys()) {
      if (key.startsWith(topic)) { analysisCache.delete(key); count++; }
    }
  } else {
    count = analysisCache.size;
    analysisCache.clear();
  }
  return count;
}

export function getCacheStats(): { totalEntries: number; entries: Array<{ topic: string; countryCode: string; age: number }> } {
  const now = Date.now();
  return {
    totalEntries: analysisCache.size,
    entries: [...analysisCache.values()].map(e => ({ topic: e.topic, countryCode: e.countryCode, age: now - e.timestamp })),
  };
}

/**
 * Apply topic-specific weight adjustments so different topics produce
 * measurably different emotional profiles.
 */
export function applyTopicWeights(
  topic: string,
  baseIndices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number },
): { gmi: number; cfi: number; hri: number; aci: number; sdi: number } {
  const weight = TOPIC_WEIGHTS[topic.toLowerCase()];
  if (!weight) return { ...baseIndices };
  return {
    gmi: clamp(baseIndices.gmi + weight.gmi, -100, 100),
    cfi: clamp(baseIndices.cfi + weight.cfi, 0, 100),
    hri: clamp(baseIndices.hri + weight.hri, 0, 100),
    aci: clamp(baseIndices.aci + weight.aci, 0, 100),
    sdi: clamp(baseIndices.sdi + weight.sdi, 0, 100),
  };
}
