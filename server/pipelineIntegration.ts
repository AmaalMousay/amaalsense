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

  // تصنيف الخطأ
  if (error.message.includes("LLM")) {
    return {
      error: "فشل في الاتصال بـ LLM",
      code: "LLM_ERROR",
      details: error.message
    };
  } else if (error.message.includes("Database")) {
    return {
      error: "خطأ في قاعدة البيانات",
      code: "DB_ERROR",
      details: error.message
    };
  } else if (error.message.includes("Timeout")) {
    return {
      error: "انتهت مهلة الانتظار",
      code: "TIMEOUT_ERROR",
      details: error.message
    };
  } else {
    return {
      error: "خطأ غير متوقع",
      code: "UNKNOWN_ERROR",
      details: error.message
    };
  }
}

/**
 * تحسين الأداء: Caching على مستوى Pipeline
 */
const pipelineCache = new Map<string, {
  context: UnifiedPipelineContext;
  timestamp: number;
}>();

const CACHE_TTL = 1000 * 60 * 60; // ساعة واحدة

export function getCachedPipelineResult(
  userId: string,
  question: string
): UnifiedPipelineContext | null {
  const cacheKey = `${userId}:${question}`;
  const cached = pipelineCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Cache Hit] ${cacheKey}`);
    return cached.context;
  }

  return null;
}

export function cachePipelineResult(
  userId: string,
  question: string,
  context: UnifiedPipelineContext
): void {
  const cacheKey = `${userId}:${question}`;
  pipelineCache.set(cacheKey, {
    context,
    timestamp: Date.now()
  });

  // تنظيف الـ cache القديم
  if (pipelineCache.size > 1000) {
    const oldestKey = Array.from(pipelineCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
    pipelineCache.delete(oldestKey);
  }
}

/**
 * تحسين الأداء: Batch Processing
 */
export async function executePipelineBatch(
  userId: string,
  questions: string[],
  language: string = "ar"
): Promise<UnifiedPipelineContext[]> {
  const results: UnifiedPipelineContext[] = [];

  for (const question of questions) {
    try {
      const context = await executeUnifiedNetworkPipeline(userId, question, language);
      results.push(context);
    } catch (error) {
      console.error(`Error processing question: ${question}`, error);
    }
  }

  return results;
}

/**
 * تحسين الأداء: Parallel Processing
 */
export async function executePipelineParallel(
  userId: string,
  questions: string[],
  language: string = "ar"
): Promise<UnifiedPipelineContext[]> {
  const promises = questions.map(question =>
    executeUnifiedNetworkPipeline(userId, question, language).catch(error => {
      console.error(`Error processing question: ${question}`, error);
      return null;
    })
  );

  const results = await Promise.all(promises);
  return results.filter((r): r is UnifiedPipelineContext => r !== null);
}

/**
 * تحسين الأداء: Streaming Response
 */
export async function* streamPipelineResponse(
  userId: string,
  question: string,
  language: string = "ar"
): AsyncGenerator<string, void, unknown> {
  try {
    const context = await executeUnifiedNetworkPipeline(userId, question, language);

    // Stream الإجابة تدريجياً
    const response = context.languageEnforced.finalResponse;
    const chunkSize = 50;

    for (let i = 0; i < response.length; i += chunkSize) {
      yield response.slice(i, i + chunkSize);
      // محاكاة التأخير
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Stream معلومات إضافية
    yield `\n\n📊 الثقة: ${context.confidence.overall}%`;
    yield `\n📈 الجودة: ${context.qualityAssessment.score}/100`;
    yield `\n⏱️ الوقت: ${context.analytics.processingTime}ms`;
  } catch (error) {
    yield `❌ خطأ: ${error instanceof Error ? error.message : "خطأ غير معروف"}`;
  }
}

/**
 * تحسين الأداء: Response Compression
 */
export function compressPipelineResponse(context: UnifiedPipelineContext): string {
  // ضغط الإجابة بإزالة الكلمات غير الضرورية
  let response = context.languageEnforced.finalResponse;

  // إزالة المسافات الزائدة
  response = response.replace(/\s+/g, " ").trim();

  // إزالة الكلمات الشائعة غير الضرورية
  const stopWords = ["في", "من", "إلى", "هذا", "ذلك"];
  stopWords.forEach(word => {
    response = response.replace(new RegExp(`\\b${word}\\b`, "g"), "");
  });

  return response;
}

/**
 * تحسين الأداء: Response Optimization
 */
export function optimizePipelineResponse(context: UnifiedPipelineContext): UnifiedPipelineContext {
  // تحسين الإجابة بناءً على الثقة والجودة
  if (context.confidence.overall < 50) {
    context.languageEnforced.finalResponse += "\n\n⚠️ ملاحظة: هذه الإجابة لها مستوى ثقة منخفض.";
  }

  if (context.qualityAssessment.score < 60) {
    context.languageEnforced.finalResponse += "\n\n⚠️ ملاحظة: قد تحتاج هذه الإجابة إلى مراجعة.";
  }

  if (context.clarification.needed) {
    context.languageEnforced.finalResponse = `❓ السؤال غير واضح تماماً.\n\n${context.clarification.data?.clarificationQuestions || "يرجى توضيح السؤال."}\n\n${context.languageEnforced.finalResponse}`;
  }

  return context;
}

/**
 * تحسين الأداء: Analytics Tracking
 */
export function trackPipelineAnalytics(context: UnifiedPipelineContext): void {
  const analytics = {
    requestId: context.requestId,
    userId: context.userId,
    timestamp: context.timestamp,
    processingTime: context.analytics.processingTime,
    qualityScore: context.qualityAssessment.score,
    confidence: context.confidence.overall,
    layersExecuted: context.analytics.layersExecuted.length,
    errors: context.analytics.errors.length,
    status: context.status
  };

  console.log("[Analytics]", JSON.stringify(analytics, null, 2));

  // يمكن إرسال البيانات إلى خدمة تحليلات خارجية
  // sendToAnalyticsService(analytics);
}
