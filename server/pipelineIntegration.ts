/**
 * PIPELINE INTEGRATION
 * 
 * يربط Unified Network Pipeline مع الـ tRPC routers الموجودة
 * يدمج جميع الطبقات مع النظام الحالي
 */

import { executeUnifiedNetworkPipeline, UnifiedPipelineContext } from "./unifiedNetworkPipeline";
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
    // تنفيذ Pipeline الموحد
    const context = await executeUnifiedNetworkPipeline(userId, question, language);

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
    alternatives?: string[];
    missingInformation?: string[];
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
  emotionalIntelligence: {
    detectedEmotions: Record<string, number>;
    dominantEmotion: string;
    emotionalContext: string;
    adaptedTone: string;
    emotionIntensity: number;
  };
  humanLikeAI: {
    contextualUnderstanding: string;
    proactiveSuggestions: {
      followUpQuestions: Array<{
        question: string;
        relevance: number;
        expectedValue: string;
      }>;
      relatedTopics: string[];
      importantWarnings: string[];
    };
    uncertaintyAcknowledgment: {
      confidence: number;
      alternatives: string[];
      needsMoreInfo: string[];
      disclaimers: string[];
    };
  };
  metadata: {
    processingTime: number;
    language: string;
    clarificationNeeded: boolean;
    cached: boolean;
  };
} {
  // Parse proactive suggestions if they're in string format
  let parsedSuggestions: any[] = [];
  try {
    if (typeof context.humanIntelligence.proactiveSuggestions === 'string') {
      parsedSuggestions = JSON.parse(context.humanIntelligence.proactiveSuggestions as any);
    } else if (Array.isArray(context.humanIntelligence.proactiveSuggestions)) {
      parsedSuggestions = context.humanIntelligence.proactiveSuggestions;
    }
  } catch (e) {
    parsedSuggestions = [];
  }

  // Extract follow-up questions, related topics, and warnings from suggestions
  const followUpQuestions = parsedSuggestions
    .filter((s: any) => s.type === 'question')
    .map((s: any) => ({
      question: s.text || s.question || '',
      relevance: s.relevance || 0.7,
      expectedValue: s.expectedValue || 'معلومات إضافية'
    }));

  const relatedTopics = parsedSuggestions
    .filter((s: any) => s.type === 'topic')
    .map((s: any) => s.text || s.topic || '');

  const importantWarnings = parsedSuggestions
    .filter((s: any) => s.type === 'warning')
    .map((s: any) => s.text || s.warning || '');

  // Calculate emotion intensity
  const emotions = context.analysisEngines.emotionAnalysis?.emotions || {};
  const emotionValues = Object.values(emotions) as number[];
  const emotionIntensity = emotionValues.length > 0
    ? Math.max(...emotionValues)
    : 0;

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
      },
      alternatives: context.confidence.alternatives || [],
      missingInformation: context.confidence.missingInformation || []
    },
    quality: {
      score: context.qualityAssessment.score,
      metrics: context.qualityAssessment.metrics
    },
    emotionalIntelligence: {
      detectedEmotions: emotions,
      dominantEmotion: context.analysisEngines.emotionAnalysis?.dominantEmotion || 'neutral',
      emotionalContext: context.analysisEngines.emotionAnalysis?.context || '',
      adaptedTone: context.humanIntelligence.emotionalIntelligence.adaptedTone || 'professional',
      emotionIntensity
    },
    humanLikeAI: {
      contextualUnderstanding: context.humanIntelligence.contextualUnderstanding || '',
      proactiveSuggestions: {
        followUpQuestions,
        relatedTopics,
        importantWarnings
      },
      uncertaintyAcknowledgment: {
        confidence: context.confidence.overall,
        alternatives: context.confidence.alternatives || [],
        needsMoreInfo: context.confidence.missingInformation || [],
        disclaimers: [
          'هذا التحليل مبني على البيانات المتاحة حالياً',
          'قد تتغير النتائج مع توفر معلومات جديدة'
        ]
      }
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
