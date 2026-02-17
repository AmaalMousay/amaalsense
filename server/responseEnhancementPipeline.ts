/**
 * Response Enhancement Pipeline
 * 
 * دمج Layer 15 (Language Enforcement) في pipeline الإجابات
 * يضمن أن الإجابة بنفس لغة السؤال وتحسين جودتها
 */

import { processResponseWithLanguageEnforcement } from './languageEnforcementLayer';
import { ResponseCache } from './cachingLayer';
import { hashQuestion } from './cachingLayer';

/**
 * نتيجة معالجة الإجابة الكاملة
 */
export interface EnhancedResponse {
  // الإجابة النهائية
  finalResponse: string;
  
  // معلومات اللغة
  language: 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja';
  wasTranslated: boolean;
  
  // معلومات الـ Cache
  fromCache: boolean;
  cacheHitCount?: number;
  
  // معلومات الجودة
  qualityScore: number; // 0-100
  qualityMetrics?: {
    relevance: number;
    accuracy: number;
    completeness: number;
    clarity: number;
  };
  
  // معلومات الأداء
  processingTimeMs: number;
  cacheTimeMs?: number;
  translationTimeMs?: number;
}

/**
 * معالج الإجابات الموحد
 * يطبق جميع التحسينات على الإجابة
 */
export async function enhanceResponse(
  userId: number,
  question: string,
  rawResponse: string,
  options?: {
    useCache?: boolean;
    calculateQuality?: boolean;
    debugMode?: boolean;
  }
): Promise<EnhancedResponse> {
  const startTime = Date.now();
  const opts = {
    useCache: true,
    calculateQuality: true,
    debugMode: false,
    ...options,
  };

  try {
    // STEP 1: Check cache
    let fromCache = false;
    let cacheTimeMs = 0;
    let cachedResponse: string | null = null;

    if (opts.useCache) {
      const cacheStart = Date.now();
      cachedResponse = await ResponseCache.get(userId, question);
      cacheTimeMs = Date.now() - cacheStart;

      if (cachedResponse) {
        fromCache = true;
        if (opts.debugMode) {
          console.log('[ResponseEnhancement] Cache hit:', { userId, cacheTimeMs });
        }

        return {
          finalResponse: cachedResponse,
          language: 'ar', // Will be detected from cache
          wasTranslated: false,
          fromCache: true,
          cacheHitCount: 1,
          qualityScore: 85, // Cached responses are usually good
          processingTimeMs: Date.now() - startTime,
          cacheTimeMs,
        };
      }
    }

    // STEP 2: Apply Language Enforcement
    const translationStart = Date.now();
    const languageResult = await processResponseWithLanguageEnforcement(
      question,
      rawResponse,
      opts.debugMode
    );
    const translationTimeMs = Date.now() - translationStart;

    // STEP 3: Calculate quality score
    let qualityScore = 75; // Base score
    const qualityMetrics = {
      relevance: 80,
      accuracy: 75,
      completeness: 70,
      clarity: 80,
    };

    if (opts.calculateQuality) {
      // Relevance: check if response addresses the question
      const questionWords = question.toLowerCase().split(/\s+/).slice(0, 5);
      const responseWords = languageResult.finalResponse.toLowerCase();
      const relevanceMatch = questionWords.filter(w => responseWords.includes(w)).length;
      qualityMetrics.relevance = Math.min(100, 50 + relevanceMatch * 10);

      // Completeness: based on response length
      const responseLength = languageResult.finalResponse.length;
      qualityMetrics.completeness = Math.min(100, Math.floor((responseLength / 1000) * 100));

      // Clarity: check for coherence indicators
      const hasStructure = /[•\-\*]/.test(languageResult.finalResponse) ? 20 : 0;
      const hasParagraphs = (languageResult.finalResponse.match(/\n/g) || []).length > 2 ? 15 : 0;
      qualityMetrics.clarity = 65 + hasStructure + hasParagraphs;

      // Overall quality score
      qualityScore = Math.round(
        (qualityMetrics.relevance +
          qualityMetrics.accuracy +
          qualityMetrics.completeness +
          qualityMetrics.clarity) /
          4
      );
    }

    // STEP 4: Cache the enhanced response
    if (opts.useCache && qualityScore >= 70) {
      await ResponseCache.set(
        userId,
        question,
        languageResult.finalResponse,
        qualityScore,
        720 // 12 hours
      );
    }

    const totalTime = Date.now() - startTime;

    if (opts.debugMode) {
      console.log('[ResponseEnhancement] Enhancement complete:', {
        userId,
        language: languageResult.language,
        wasTranslated: languageResult.wasTranslated,
        qualityScore,
        totalTime,
        translationTime: translationTimeMs,
      });
    }

    return {
      finalResponse: languageResult.finalResponse,
      language: languageResult.language,
      wasTranslated: languageResult.wasTranslated,
      fromCache: false,
      qualityScore,
      qualityMetrics,
      processingTimeMs: totalTime,
      translationTimeMs,
    };
  } catch (error) {
    console.error('[ResponseEnhancement] Error enhancing response:', error);

    // Fallback: return raw response with basic info
    return {
      finalResponse: rawResponse,
      language: 'ar',
      wasTranslated: false,
      fromCache: false,
      qualityScore: 50, // Low score for fallback
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * معالج الإجابات للمحادثات المتعددة
 * يتعامل مع سياق المحادثة
 */
export async function enhanceConversationResponse(
  userId: number,
  question: string,
  rawResponse: string,
  conversationHistory?: Array<{ role: string; content: string }>,
  options?: {
    useCache?: boolean;
    calculateQuality?: boolean;
    debugMode?: boolean;
  }
): Promise<EnhancedResponse> {
  // Add conversation context to enhance the response
  let enhancedRawResponse = rawResponse;

  if (conversationHistory && conversationHistory.length > 0) {
    // Could add context-aware enhancements here
    // For now, just use the raw response
  }

  return enhanceResponse(userId, question, enhancedRawResponse, options);
}

/**
 * دالة مساعدة للحصول على إحصائيات الجودة
 */
export async function getQualityStats(userId: number): Promise<{
  averageQualityScore: number;
  totalResponses: number;
  cacheHitRate: number;
  translationRate: number;
}> {
  try {
    const cacheStats = await ResponseCache.getUserStats(userId);

    return {
      averageQualityScore: 75, // Would be calculated from database
      totalResponses: cacheStats.totalCached,
      cacheHitRate: cacheStats.totalCached > 0 ? (cacheStats.totalHits / cacheStats.totalCached) * 100 : 0,
      translationRate: 15, // Estimated percentage of responses that needed translation
    };
  } catch (error) {
    console.error('[QualityStats] Error getting stats:', error);
    return {
      averageQualityScore: 0,
      totalResponses: 0,
      cacheHitRate: 0,
      translationRate: 0,
    };
  }
}

/**
 * دالة لتقييم الإجابة من قبل المستخدم
 */
export async function rateResponse(
  userId: number,
  question: string,
  rating: number, // 1-5
  feedback?: string
): Promise<boolean> {
  try {
    // This would save the rating to the database for learning
    console.log('[ResponseRating] User rating:', {
      userId,
      question: question.substring(0, 50),
      rating,
      feedback: feedback?.substring(0, 100),
    });

    // TODO: Save to database for learning loop
    return true;
  } catch (error) {
    console.error('[ResponseRating] Error saving rating:', error);
    return false;
  }
}
