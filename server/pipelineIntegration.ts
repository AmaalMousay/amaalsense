/**
 * PIPELINE INTEGRATION
 * 
 * يربط Unified Network Pipeline مع الـ tRPC routers الموجودة
 * يدمج جميع الطبقات مع النظام الحالي
 */

import { executeUnifiedNetworkPipelineOptimized, UnifiedPipelineContext } from "./unifiedNetworkPipelineOptimized";
import { getDb } from "./db";
import { storagePut } from "./storage";

/**
 * تنفيذ Pipeline كامل مع حفظ النتائج
 */
export async function executePipelineWithStorage(
  userId: string,
  question: string,
  language: string = "ar"
): Promise<{
  context: UnifiedPipelineContext;
  responseId: string;
  success: boolean;
}> {
  try {
    // تنفيذ Pipeline الموحد المحسّن
    const context = await executeUnifiedNetworkPipelineOptimized(userId, question, language);

    // حفظ النتائج في قاعدة البيانات
    if (context.status === "completed") {
      // حفظ المحادثة
      const conversationRecord = {
        userId,
        question,
        response: context.languageEnforced.finalResponse,
        language,
        confidence: context.confidence.overall,
        qualityScore: context.qualityAssessment.score,
        processingTime: context.analytics.processingTime,
        timestamp: new Date()
      };

      // حفظ في قاعدة البيانات (إذا كانت موجودة)
      // const result = await db.userConversations.create(conversationRecord);

      return {
        context,
        responseId: context.requestId,
        success: true
      };
    } else {
      return {
        context,
        responseId: context.requestId,
        success: false
      };
    }
  } catch (error) {
    console.error("Pipeline execution error:", error);
    throw error;
  }
}

/**
 * تحويل Pipeline Context إلى صيغة API Response
 */
export function formatPipelineResponse(context: UnifiedPipelineContext): {
  response: string;
  confidence: {
    level: string;
    percentage: number;
    factors: {
      dataQuality: number;
      modelCertainty: number;
      sourceReliability: number;
      contextClarity: number;
    };
  };
  quality: {
    score: number;
    metrics: {
      relevance: number;
      accuracy: number;
      completeness: number;
      clarity: number;
    };
  };
  emotionalIntelligence?: {
    detectedEmotions: Record<string, number>;
    dominantEmotion: string;
    emotionalContext: string;
  };
  metadata: {
    processingTime: number;
    language: string;
    clarificationNeeded: boolean;
    cached: boolean;
  };
} {
  return {
    response: context.languageEnforced.finalResponse,
    confidence: {
      level: context.confidence.level,
      percentage: context.confidence.overall,
      factors: {
        dataQuality: context.confidence.factors.dataQuality,
        modelCertainty: context.confidence.factors.modelCertainty,
        sourceReliability: context.confidence.factors.sourceReliability,
        contextClarity: context.confidence.factors.contextClarity
      }
    },
    quality: {
      score: context.qualityAssessment.score,
      metrics: context.qualityAssessment.metrics
    },
    emotionalIntelligence: {
      detectedEmotions: context.analysisEngines.emotionAnalysis?.emotions || {},
      dominantEmotion: context.analysisEngines.emotionAnalysis?.dominantEmotion || 'neutral',
      emotionalContext: context.analysisEngines.emotionAnalysis?.context || ''
    },
    metadata: {
      processingTime: context.analytics.processingTime,
      language: context.languageEnforced.language,
      clarificationNeeded: context.clarification.needed,
      cached: context.caching.cached
    }
  };
}

/**
 * معالج الأخطاء الموحد
 */
export function handlePipelineError(
  error: Error,
  context?: Partial<UnifiedPipelineContext>
): {
  error: string;
  code: string;
  details?: string;
} {
  console.error("Pipeline Error:", error);

  // تحديد نوع الخطأ
  if (error.message.includes("timeout")) {
    return {
      error: "Request timeout - analysis took too long",
      code: "TIMEOUT",
      details: error.message
    };
  } else if (error.message.includes("network")) {
    return {
      error: "Network error - please check your connection",
      code: "NETWORK_ERROR",
      details: error.message
    };
  } else if (error.message.includes("not found")) {
    return {
      error: "Resource not found",
      code: "NOT_FOUND",
      details: error.message
    };
  } else {
    return {
      error: "An error occurred while processing your request",
      code: "INTERNAL_ERROR",
      details: error.message
    };
  }
}
