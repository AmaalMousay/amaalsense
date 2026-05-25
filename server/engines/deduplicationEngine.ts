import { t } from "../_core/i18n";

/**
 * Deduplication Engine - Prevents duplicate data and ensures unique indices per topic
 * 
 * This system:
 * 1. Tracks previously analyzed topics to prevent duplicate results
 * 2. Generates topic-specific variations to ensure different indices
 * 3. Manages cache invalidation for stale data
 * 4. Provides deduplication detection and reporting
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

interface DeduplicationReport {
  isDuplicate: boolean;
  similarity: number; // 0-1
  previousAnalysisTime?: number;
  suggestedAction: 'use_cache' | 'generate_new' | 'invalidate_cache';
}

// In-memory cache for analysis results
const analysisCache = new Map<string, CachedAnalysis>();

// Track topic-specific keywords to generate unique data
const topicKeywords: Record<string, string[]> = {
  'vision 2030': ['vision', 'reform', 'investment', 'development', 'strategy'],
  economy: ['economy', 'market', 'inflation', 'currency', 'growth'],
  politics: ['government', 'election', 'policy', 'parliament', 'diplomacy'],
  conflict: ['conflict', 'security', 'military', 'ceasefire', 'risk'],
  society: ['society', 'community', 'public', 'services', 'living conditions'],
  health: ['health', 'hospital', 'medicine', 'disease', 'public health'],
  technology: ['technology', 'ai', 'software', 'digital', 'innovation'],
  energy: ['oil', 'gas', 'electricity', 'renewable', 'energy'],
};

/**
 * Generate a hash for analysis data to detect duplicates
 */
function generateDataHash(
  topic: string,
  countryCode: string,
  indices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number }
): string {
  const data = `${topic}|${countryCode}|${indices.gmi}|${indices.cfi}|${indices.hri}|${indices.aci}|${indices.sdi}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Calculate similarity between two sets of indices (0-1)
 */
function calculateSimilarity(
  indices1: { gmi: number; cfi: number; hri: number; aci: number; sdi: number },
  indices2: { gmi: number; cfi: number; hri: number; aci: number; sdi: number }
): number {
  const maxDiff = 400; // Max possible difference (5 indices * 100 range)
  const differences = [
    Math.abs(indices1.gmi - indices2.gmi),
    Math.abs(indices1.cfi - indices2.cfi),
    Math.abs(indices1.hri - indices2.hri),
    Math.abs(indices1.aci - indices2.aci),
    Math.abs(indices1.sdi - indices2.sdi),
  ];
  const totalDiff = differences.reduce((a, b) => a + b, 0);
  return 1 - (totalDiff / maxDiff);
}

/**
 * Check if an analysis is a duplicate of a previous one
 */
export function checkForDuplicates(
  topic: string,
  countryCode: string,
  indices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number },
  cacheExpiryMs: number = 3600000 // 1 hour default
): DeduplicationReport {
  const cacheKey = `${topic}|${countryCode}`;
  const now = Date.now();
  
  // Check if we have a cached analysis
  const cached = analysisCache.get(cacheKey);
  
  if (cached) {
    // Check if cache is expired
    if (now - cached.timestamp > cacheExpiryMs) {
      return {
        isDuplicate: false,
        similarity: 0,
        suggestedAction: 'invalidate_cache',
      };
    }
    
    // Calculate similarity
    const similarity = calculateSimilarity(cached.indices, indices);
    
    // Consider it a duplicate if similarity > 0.85 (85%)
    if (similarity > 0.85) {
      return {
        isDuplicate: true,
        similarity,
        previousAnalysisTime: cached.timestamp,
        suggestedAction: 'use_cache',
      };
    }
  }
  
  return {
    isDuplicate: false,
    similarity: cached ? calculateSimilarity(cached.indices, indices) : 0,
    suggestedAction: 'generate_new',
  };
}

/**
 * Register an analysis result in the cache
 */
export function registerAnalysis(
  topic: string,
  countryCode: string,
  indices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number }
): void {
  const cacheKey = `${topic}|${countryCode}`;
  const dataHash = generateDataHash(topic, countryCode, indices);
  
  analysisCache.set(cacheKey, {
    topic,
    countryCode,
    indices,
    timestamp: Date.now(),
    dataHash,
  });
}

/**
 * Invalidate cache for a specific topic/country
 */
export function invalidateCache(topic?: string, countryCode?: string): number {
  let invalidatedCount = 0;
  
  if (topic && countryCode) {
    const cacheKey = `${topic}|${countryCode}`;
    if (analysisCache.has(cacheKey)) {
      analysisCache.delete(cacheKey);
      invalidatedCount = 1;
    }
  } else if (topic) {
    // Invalidate all entries for a topic
    const keysToDelete: string[] = [];
    analysisCache.forEach((_, key) => {
      if (key.startsWith(topic)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => {
      analysisCache.delete(key);
      invalidatedCount++;
    });
  } else {
    // Clear entire cache
    invalidatedCount = analysisCache.size;
    analysisCache.clear();
  }
  
  return invalidatedCount;
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  totalEntries: number;
  entries: Array<{ topic: string; countryCode: string; age: number }>;
} {
  const now = Date.now();
  const entries = Array.from(analysisCache.values()).map(entry => ({
    topic: entry.topic,
    countryCode: entry.countryCode,
    age: now - entry.timestamp,
  }));
  
  return {
    totalEntries: analysisCache.size,
    entries,
  };
}

/**
 * Generate topic-specific emotion variations
 * Ensures different topics produce different emotional profiles
 */
export function generateTopicSpecificVariations(
  topic: string,
  baseIndices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number }
): { gmi: number; cfi: number; hri: number; aci: number; sdi: number } {
  // Get keywords for this topic
  const keywords = topicKeywords[topic] || [];
  
  // Calculate topic-specific adjustments based on keywords
  let gmiAdjust = 0;
  let cfiAdjust = 0;
  let hriAdjust = 0;
  let aciAdjust = 0;
  let sdiAdjust = 0;
  
  // Analyze keywords to adjust indices
  keywords.forEach(keyword => {
    switch (keyword) {
      case t('auto.engines_deduplicationEngine.17.6d38c2ea', 'ar'):
      case t('auto.engines_deduplicationEngine.16.16c73be6', 'ar'):
      case t('auto.engines_deduplicationEngine.15.2efcd729', 'ar'):
        gmiAdjust += 15;
        cfiAdjust -= 10;
        break;
      case t('auto.engines_deduplicationEngine.14.450897a5', 'ar'):
      case t('auto.engines_deduplicationEngine.13.ace42128', 'ar'):
        cfiAdjust -= 20;
        hriAdjust += 15;
        break;
      case t('auto.engines_deduplicationEngine.12.dcdf69b3', 'ar'):
      case t('auto.engines_deduplicationEngine.11.a24a5460', 'ar'):
        cfiAdjust += 20;
        hriAdjust -= 10;
        break;
      case t('auto.engines_deduplicationEngine.10.c81718df', 'ar'):
      case t('auto.engines_deduplicationEngine.9.e87473b0', 'ar'):
        hriAdjust += 20;
        gmiAdjust += 10;
        break;
      case t('auto.engines_deduplicationEngine.8.51f4011d', 'ar'):
      case t('auto.engines_deduplicationEngine.7.aae445ae', 'ar'):
        cfiAdjust += 25;
        gmiAdjust -= 20;
        break;
      case t('auto.engines_deduplicationEngine.6.5c61c8a0', 'ar'):
      case t('auto.engines_deduplicationEngine.5.44e1d7f4', 'ar'):
        hriAdjust += 15;
        gmiAdjust += 15;
        break;
      case t('auto.engines_deduplicationEngine.4.837787a2', 'ar'):
      case t('auto.engines_deduplicationEngine.3.01146ccf', 'ar'):
        gmiAdjust += 25;
        hriAdjust += 20;
        break;
      case t('auto.engines_deduplicationEngine.2.ac19a8d6', 'ar'):
      case t('auto.engines_deduplicationEngine.1.1f88a5b2', 'ar'):
        cfiAdjust += 15;
        aciAdjust += 10;
        break;
    }
  });
  
  // Apply adjustments with bounds
  return {
    gmi: Math.max(-100, Math.min(100, baseIndices.gmi + gmiAdjust)),
    cfi: Math.max(0, Math.min(100, baseIndices.cfi + cfiAdjust)),
    hri: Math.max(0, Math.min(100, baseIndices.hri + hriAdjust)),
    aci: Math.max(0, Math.min(100, baseIndices.aci + aciAdjust)),
    sdi: Math.max(0, Math.min(100, baseIndices.sdi + sdiAdjust)),
  };
}

/**
 * Add a new topic with its keywords
 */
export function registerTopicKeywords(topic: string, keywords: string[]): void {
  topicKeywords[topic] = keywords;
}

/**
 * Get all registered topics
 */
export function getRegisteredTopics(): string[] {
  return Object.keys(topicKeywords);
}
