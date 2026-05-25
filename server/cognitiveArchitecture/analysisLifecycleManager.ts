import { t } from "../_core/i18n";

/**
 * Analysis Lifecycle Manager
 * 
 * Purpose: Decides whether to fetch new data, re-interpret existing data, or reason without analysis
 * - Manages the lifecycle of analysis operations
 * - Prevents unnecessary data fetching
 * - Optimizes resource usage
 */

export type AnalysisAction =
  | 'fetch_and_analyze'     // Fetch new data and perform full analysis
  | 'reinterpret_existing'  // Re-interpret existing data with new perspective
  | 'reason_only'           // Reason from existing context without new analysis
  | 'use_cached';           // Use cached analysis results

export interface AnalysisDecision {
  action: AnalysisAction;
  reasoning: string;
  estimatedCost: 'low' | 'medium' | 'high';
  cacheKey?: string;
}

export interface AnalysisContext {
  question: string;
  isFollowUp: boolean;
  previousAnalysis?: {
    timestamp: Date;
    topic: string;
    country: string;
    results: any;
  };
  questionType: 'factual' | 'analytical' | 'scenario' | 'opinion' | 'comparison' | 'clarification';
  dataAge?: number; // in minutes
}

class AnalysisLifecycleManagerClass {
  private readonly CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  private analysisCache: Map<string, { timestamp: Date; results: any }> = new Map();

  /**
   * Decide what type of analysis operation to perform
   */
  decideAnalysisAction(context: AnalysisContext): AnalysisDecision {
    const { question, isFollowUp, previousAnalysis, questionType, dataAge } = context;

    // For factual questions - no analysis needed
    if (questionType === 'factual') {
      return {
        action: 'reason_only',
        reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.10.d9aa324a', 'ar'),
        estimatedCost: 'low',
      };
    }

    // For clarification questions - use existing context
    if (questionType === 'clarification' && previousAnalysis) {
      return {
        action: 'reinterpret_existing',
        reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.9.d4852a81', 'ar'),
        estimatedCost: 'low',
      };
    }

    // Check cache for recent analysis
    const cacheKey = this.generateCacheKey(context);
    const cached = this.analysisCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return {
        action: 'use_cached',
        reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.8.89ba8a8f', 'ar'),
        estimatedCost: 'low',
        cacheKey,
      };
    }

    // For follow-up questions with recent analysis
    if (isFollowUp && previousAnalysis && this.isAnalysisRecent(previousAnalysis.timestamp)) {
      // Check if question requires new perspective on same data
      if (questionType === 'scenario' || questionType === 'opinion') {
        return {
          action: 'reinterpret_existing',
          reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.7.c9ad3785', 'ar'),
          estimatedCost: 'medium',
        };
      }

      // For comparison questions, might need new data
      if (questionType === 'comparison') {
        return {
          action: 'fetch_and_analyze',
          reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.6.5e9d090b', 'ar'),
          estimatedCost: 'high',
        };
      }

      // Default for follow-ups: reason from existing analysis
      return {
        action: 'reason_only',
        reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.5.4a9685f3', 'ar'),
        estimatedCost: 'low',
      };
    }

    // For analytical questions without recent analysis - fetch new data
    if (questionType === 'analytical') {
      // Check if data is stale
      if (dataAge && dataAge > 60) {
        return {
          action: 'fetch_and_analyze',
          reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.4.64263185', 'ar'),
          estimatedCost: 'high',
        };
      }

      return {
        action: 'fetch_and_analyze',
        reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.3.56e34e22', 'ar'),
        estimatedCost: 'high',
      };
    }

    // For scenario questions - reason from existing knowledge
    if (questionType === 'scenario') {
      return {
        action: 'reason_only',
        reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.2.d73d42c1', 'ar'),
        estimatedCost: 'medium',
      };
    }

    // Default: fetch and analyze
    return {
      action: 'fetch_and_analyze',
      reasoning: t('auto.cognitiveArchitecture_analysisLifecycleManager.1.a5fae542', 'ar'),
      estimatedCost: 'high',
    };
  }

  /**
   * Cache analysis results
   */
  cacheAnalysis(context: AnalysisContext, results: any): void {
    const cacheKey = this.generateCacheKey(context);
    this.analysisCache.set(cacheKey, {
      timestamp: new Date(),
      results,
    });

    // Clean old cache entries
    this.cleanOldCache();
  }

  /**
   * Get cached analysis
   */
  getCachedAnalysis(context: AnalysisContext): any | null {
    const cacheKey = this.generateCacheKey(context);
    const cached = this.analysisCache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.results;
    }

    return null;
  }

  /**
   * Generate cache key from context
   */
  private generateCacheKey(context: AnalysisContext): string {
    const { question, previousAnalysis } = context;
    
    // Simple key: normalize question + topic + country
    const normalizedQuestion = question.toLowerCase().trim().replace(/\s+/g, '_');
    const topic = previousAnalysis?.topic || 'general';
    const country = previousAnalysis?.country || 'global';

    return `${country}_${topic}_${normalizedQuestion.substring(0, 50)}`;
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(timestamp: Date): boolean {
    const now = new Date();
    const age = now.getTime() - timestamp.getTime();
    return age < this.CACHE_DURATION_MS;
  }

  /**
   * Check if analysis is recent enough to reuse
   */
  private isAnalysisRecent(timestamp: Date): boolean {
    const now = new Date();
    const age = now.getTime() - timestamp.getTime();
    return age < 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Clean old cache entries
   */
  private cleanOldCache(): void {
    const now = new Date();
    const keysToDelete: string[] = [];
    this.analysisCache.forEach((value, key) => {
      if (!this.isCacheValid(value.timestamp)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.analysisCache.delete(key));
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.analysisCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
  } {
    if (this.analysisCache.size === 0) {
      return { size: 0, oldestEntry: null, newestEntry: null };
    }

    const timestamps = Array.from(this.analysisCache.values()).map(v => v.timestamp);
    const oldest = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const newest = new Date(Math.max(...timestamps.map(t => t.getTime())));

    return {
      size: this.analysisCache.size,
      oldestEntry: oldest,
      newestEntry: newest,
    };
  }
}

export const AnalysisLifecycleManager = new AnalysisLifecycleManagerClass();
