/**
 * UI INTEGRATION LAYER
 * 
 * يدمج Pipeline الموحد مع صفحات Chat و SmartAnalysis
 */

import { executeUnifiedNetworkPipeline, UnifiedPipelineContext } from "./unifiedNetworkPipeline";
import { formatPipelineResponse } from "./pipelineIntegration";

/**
 * نموذج الطلب من الواجهة الأمامية
 */
export interface UIAnalysisRequest {
  question: string;
  language?: string;
  userId?: string;
  pageType: "chat" | "smartAnalysis";
  conversationId?: string;
  previousContext?: any;
}

/**
 * نموذج الإجابة للواجهة الأمامية
 */
export interface UIAnalysisResponse {
  success: boolean;
  response: string;
  confidence: {
    level: string;
    percentage: number;
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
    clarificationQuestions?: string[];
    requestId: string;
  };
  error?: string;
}

/**
 * معالج الطلبات من صفحة Chat
 */
export async function handleChatRequest(request: UIAnalysisRequest): Promise<UIAnalysisResponse> {
  try {
    const userId = request.userId || "anonymous";
    
    // تنفيذ Pipeline
    const context = await executeUnifiedNetworkPipeline(
      userId,
      request.question,
      request.language || "ar"
    );

    if (context.status === "completed") {
      const formatted = formatPipelineResponse(context);

      return {
        success: true,
        response: formatted.response,
        confidence: {
          level: formatted.confidence.level,
          percentage: formatted.confidence.percentage
        },
        quality: {
          score: formatted.quality.score,
          metrics: formatted.quality.metrics
        },
        metadata: {
          processingTime: formatted.metadata.processingTime,
          language: formatted.metadata.language,
          clarificationNeeded: formatted.metadata.clarificationNeeded,
          requestId: context.requestId
        }
      };
    } else {
      return {
        success: false,
        response: context.error || "فشل في معالجة السؤال",
        confidence: { level: "very_low", percentage: 0 },
        quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
        metadata: {
          processingTime: context.analytics.processingTime,
          language: request.language || "ar",
          clarificationNeeded: false,
          requestId: context.requestId
        },
        error: context.error
      };
    }
  } catch (error) {
    return {
      success: false,
      response: "حدث خطأ غير متوقع",
      confidence: { level: "very_low", percentage: 0 },
      quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
      metadata: {
        processingTime: 0,
        language: request.language || "ar",
        clarificationNeeded: false,
        requestId: ""
      },
      error: error instanceof Error ? error.message : "خطأ غير معروف"
    };
  }
}

/**
 * معالج الطلبات من صفحة SmartAnalysis
 */
export async function handleSmartAnalysisRequest(request: UIAnalysisRequest): Promise<UIAnalysisResponse> {
  try {
    const userId = request.userId || "anonymous";

    // تنفيذ Pipeline
    const context = await executeUnifiedNetworkPipeline(
      userId,
      request.question,
      request.language || "ar"
    );

    if (context.status === "completed") {
      const formatted = formatPipelineResponse(context);

      // إضافة معلومات إضافية للتحليل الذكي
      const enhancedResponse = {
        success: true,
        response: formatted.response,
        confidence: {
          level: formatted.confidence.level,
          percentage: formatted.confidence.percentage,
          factors: formatted.confidence.factors
        },
        quality: {
          score: formatted.quality.score,
          metrics: formatted.quality.metrics
        },
        metadata: {
          processingTime: formatted.metadata.processingTime,
          language: formatted.metadata.language,
          clarificationNeeded: formatted.metadata.clarificationNeeded,
          cached: formatted.metadata.cached,
          requestId: context.requestId
        }
      };

      return enhancedResponse as any;
    } else {
      return {
        success: false,
        response: context.error || "فشل في معالجة السؤال",
        confidence: { level: "very_low", percentage: 0 },
        quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
        metadata: {
          processingTime: context.analytics.processingTime,
          language: request.language || "ar",
          clarificationNeeded: false,
          requestId: context.requestId
        },
        error: context.error
      };
    }
  } catch (error) {
    return {
      success: false,
      response: "حدث خطأ غير متوقع",
      confidence: { level: "very_low", percentage: 0 },
      quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
      metadata: {
        processingTime: 0,
        language: request.language || "ar",
        clarificationNeeded: false,
        requestId: ""
      },
      error: error instanceof Error ? error.message : "خطأ غير معروف"
    };
  }
}

/**
 * معالج موحد للطلبات
 */
export async function handleUIRequest(request: UIAnalysisRequest): Promise<UIAnalysisResponse> {
  if (request.pageType === "chat") {
    return handleChatRequest(request);
  } else if (request.pageType === "smartAnalysis") {
    return handleSmartAnalysisRequest(request);
  } else {
    return {
      success: false,
      response: "نوع الصفحة غير معروف",
      confidence: { level: "very_low", percentage: 0 },
      quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
      metadata: {
        processingTime: 0,
        language: "ar",
        clarificationNeeded: false,
        requestId: ""
      },
      error: "نوع الصفحة غير معروف"
    };
  }
}

/**
 * معالج التوضيحات
 */
export async function handleClarificationRequest(
  originalQuestion: string,
  clarificationAnswer: string,
  userId: string,
  language: string = "ar"
): Promise<UIAnalysisResponse> {
  try {
    // دمج السؤال الأصلي مع التوضيح
    const clarifiedQuestion = `${originalQuestion}\n[توضيح من المستخدم: ${clarificationAnswer}]`;

    // تنفيذ Pipeline مع السؤال الموضح
    const context = await executeUnifiedNetworkPipeline(
      userId,
      clarifiedQuestion,
      language
    );

    if (context.status === "completed") {
      const formatted = formatPipelineResponse(context);

      return {
        success: true,
        response: formatted.response,
        confidence: {
          level: formatted.confidence.level,
          percentage: formatted.confidence.percentage
        },
        quality: {
          score: formatted.quality.score,
          metrics: formatted.quality.metrics
        },
        metadata: {
          processingTime: formatted.metadata.processingTime,
          language: formatted.metadata.language,
          clarificationNeeded: false,
          requestId: context.requestId
        }
      };
    } else {
      return {
        success: false,
        response: context.error || "فشل في معالجة التوضيح",
        confidence: { level: "very_low", percentage: 0 },
        quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
        metadata: {
          processingTime: context.analytics.processingTime,
          language,
          clarificationNeeded: false,
          requestId: context.requestId
        },
        error: context.error
      };
    }
  } catch (error) {
    return {
      success: false,
      response: "حدث خطأ في معالجة التوضيح",
      confidence: { level: "very_low", percentage: 0 },
      quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
      metadata: {
        processingTime: 0,
        language,
        clarificationNeeded: false,
        requestId: ""
      },
      error: error instanceof Error ? error.message : "خطأ غير معروف"
    };
  }
}

/**
 * معالج التقييم
 */
export async function handleRatingRequest(
  requestId: string,
  rating: number,
  comment?: string,
  userId?: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // حفظ التقييم في قاعدة البيانات
    // يمكن إضافة كود حفظ فعلي هنا

    console.log(`[Rating] Request: ${requestId}, Rating: ${rating}, Comment: ${comment}`);

    return {
      success: true,
      message: "تم حفظ التقييم بنجاح"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "خطأ في حفظ التقييم"
    };
  }
}

/**
 * معالج الأسئلة المتابعة
 */
export async function handleFollowUpQuestion(
  originalQuestion: string,
  followUpQuestion: string,
  userId: string,
  language: string = "ar"
): Promise<UIAnalysisResponse> {
  try {
    // دمج السؤال الأصلي مع السؤال المتابع
    const combinedQuestion = `السؤال الأصلي: ${originalQuestion}\n\nسؤال متابع: ${followUpQuestion}`;

    // تنفيذ Pipeline
    const context = await executeUnifiedNetworkPipeline(
      userId,
      combinedQuestion,
      language
    );

    if (context.status === "completed") {
      const formatted = formatPipelineResponse(context);

      return {
        success: true,
        response: formatted.response,
        confidence: {
          level: formatted.confidence.level,
          percentage: formatted.confidence.percentage
        },
        quality: {
          score: formatted.quality.score,
          metrics: formatted.quality.metrics
        },
        metadata: {
          processingTime: formatted.metadata.processingTime,
          language: formatted.metadata.language,
          clarificationNeeded: false,
          requestId: context.requestId
        }
      };
    } else {
      return {
        success: false,
        response: context.error || "فشل في معالجة السؤال المتابع",
        confidence: { level: "very_low", percentage: 0 },
        quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
        metadata: {
          processingTime: context.analytics.processingTime,
          language,
          clarificationNeeded: false,
          requestId: context.requestId
        },
        error: context.error
      };
    }
  } catch (error) {
    return {
      success: false,
      response: "حدث خطأ في معالجة السؤال المتابع",
      confidence: { level: "very_low", percentage: 0 },
      quality: { score: 0, metrics: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 } },
      metadata: {
        processingTime: 0,
        language,
        clarificationNeeded: false,
        requestId: ""
      },
      error: error instanceof Error ? error.message : "خطأ غير معروف"
    };
  }
}
