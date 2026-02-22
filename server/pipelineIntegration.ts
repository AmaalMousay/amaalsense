/**
 * PIPELINE INTEGRATION
 * 
 * يربط Unified Network Pipeline مع الـ tRPC routers الموجودة
 * يستخدم TinyLlama 1.1B المحلي بدون حد استخدام
 */

import { runUnifiedPipelineWithTinyLlama, PipelineOutput } from "./unifiedNetworkPipelineWithTinyLlama";

/**
 * تنفيذ Pipeline كامل مع TinyLlama
 */
export async function executePipelineWithTinyLlama(
  userId: string,
  question: string,
  language: "ar" | "en" = "ar"
): Promise<{
  output: PipelineOutput;
  success: boolean;
  error?: string;
}> {
  try {
    console.log(`[Pipeline Integration] Processing question for user ${userId}`);
    
    const output = await runUnifiedPipelineWithTinyLlama({
      question,
      language,
      userId,
      conversationId: `conv-${Date.now()}`
    });

    return {
      output,
      success: true
    };
  } catch (error) {
    console.error("[Pipeline Integration] Error:", error);
    return {
      output: {} as PipelineOutput,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * تحويل Pipeline Output إلى صيغة API Response
 */
export function formatPipelineResponse(output: PipelineOutput): {
  response: string;
  confidence: {
    level: string;
    percentage: number;
  };
  emotionalIntelligence: {
    dominant: string;
    secondary: string[];
    intensity: number;
  };
  followUpQuestions: string[];
  metadata: {
    processingTime: number;
    model: string;
    cached: boolean;
  };
} {
  // تحديد مستوى الثقة
  let confidenceLevel = "low";
  if (output.confidence >= 80) confidenceLevel = "high";
  else if (output.confidence >= 60) confidenceLevel = "medium";

  return {
    response: output.response,
    confidence: {
      level: confidenceLevel,
      percentage: output.confidence
    },
    emotionalIntelligence: output.emotionalIntelligence,
    followUpQuestions: output.followUpQuestions,
    metadata: {
      processingTime: output.processingTime,
      model: "tinyllama:1.1b",
      cached: output.cached
    }
  };
}

/**
 * معالج الأخطاء الموحد
 */
export function handlePipelineError(error: Error): {
  error: string;
  code: string;
  details?: string;
} {
  console.error("[Pipeline Error]:", error);

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
  } else if (error.message.includes("model")) {
    return {
      error: "Model error - TinyLlama is not available",
      code: "MODEL_ERROR",
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
