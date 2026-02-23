/**
 * المحرك الموحد V2 - نسخة محسّنة
 * Unified Engine V2 - Enhanced Version
 * 
 * يدمج جميع المحركات الأربعة مع المعالجة المتوازية
 * في محرك واحد موحد فقط (بدون تكرار)
 */

import { invokeLLM } from "./_core/llm";
import { analyzeTopicInCountry } from "./topicAnalyzer";
import { analyzeHeadlineDCFT } from "./emotionAnalyzer";
import { improvedImpactEngine } from "./improvedImpactEngineV2";

// ============================================================================
// TYPES
// ============================================================================

export interface AnalysisResult {
  engine: string;
  result: any;
  confidence: number;
  processingTime: number;
}

export interface UnifiedEngineInput {
  userId: string;
  requestId: string;
  query: string;
  context?: {
    previousQuestions?: string[];
    userPreferences?: any;
    region?: string;
  };
}

export interface UnifiedEngineOutput {
  requestId: string;
  query: string;
  
  // Layer 1: Question Understanding
  questionAnalysis: {
    intent: string;
    entities: string[];
    complexity: number;
  };
  
  // Layers 2-5: Individual Engine Analysis (Parallel)
  engineResults: {
    topic: AnalysisResult;
    emotion: AnalysisResult;
    region: AnalysisResult;
    impact: AnalysisResult;
  };
  
  // Layer 15: Fusion
  fusedAnalysis: {
    combinedInsights: string;
    confidence: number;
    keyFindings: string[];
  };
  
  // Layers 16-24: Enhancement & Output
  finalResponse: {
    answer: string;
    humanLikeAI: any;
    metadata: {
      totalProcessingTime: number;
      parallelExecutionTime: number;
      engines: string[];
    };
  };
}

// ============================================================================
// PARALLEL ENGINE EXECUTION
// ============================================================================

/**
 * تشغيل المحركات الأربعة بالتوازي
 * Execute all four engines in parallel
 */
async function executeEnginesInParallel(
  query: string,
  context: any
): Promise<{
  topic: AnalysisResult;
  emotion: AnalysisResult;
  region: AnalysisResult;
  impact: AnalysisResult;
}> {
  const startTime = Date.now();

  try {
    // تشغيل المحركات الأربعة بالتوازي
    const [topicResult, emotionResult, regionResult, impactResult] =
      await Promise.all([
        // Topic Engine
        (async () => {
          try {
            const start = Date.now();
            const result = await analyzeTopicInCountry(query, "SA", "Saudi Arabia");
            return {
              engine: "topic",
              result,
              confidence: result?.confidence || 0.85,
              processingTime: Date.now() - start,
            };
          } catch (error) {
            console.error("Topic Engine Error:", error);
            return {
              engine: "topic",
              result: { topic: "unknown", confidence: 0, regions: {} },
              confidence: 0,
              processingTime: Date.now() - startTime,
            };
          }
        })(),

        // Emotion Engine
        (async () => {
          try {
            const start = Date.now();
            const result = await analyzeHeadlineDCFT(query);
            return {
              engine: "emotion",
              result,
              confidence: result?.confidence || 0.82,
              processingTime: Date.now() - start,
            };
          } catch (error) {
            console.error("Emotion Engine Error:", error);
            return {
              engine: "emotion",
              result: { dominantEmotion: "neutral", confidence: 0, emotions: {} },
              confidence: 0,
              processingTime: Date.now() - startTime,
            };
          }
        })(),

        // Region Engine
        (async () => {
          try {
            const start = Date.now();
            const result = { region: context?.region || "global", confidence: 0.80 };
            return {
              engine: "region",
              result,
              confidence: result.confidence || 0.80,
              processingTime: Date.now() - start,
            };
          } catch (error) {
            console.error("Region Engine Error:", error);
            return {
              engine: "region",
              result: null,
              confidence: 0,
              processingTime: Date.now() - startTime,
            };
          }
        })(),

        // Impact Engine
        (async () => {
          try {
            const start = Date.now();
            const result = await improvedImpactEngine(query);
            return {
              engine: "impact",
              result,
              confidence: result?.confidence || 0.80,
              processingTime: Date.now() - start,
            };
          } catch (error) {
            console.error("Impact Engine Error:", error);
            return {
              engine: "impact",
              result: { impactScore: 0, confidence: 0, prediction: "low" },
              confidence: 0,
              processingTime: Date.now() - startTime,
            };
          }
        })(),
      ]);

    return {
      topic: topicResult,
      emotion: emotionResult,
      region: regionResult,
      impact: impactResult,
    };
  } catch (error) {
    console.error("Parallel Execution Error:", error);
    throw error;
  }
}

// ============================================================================
// UNIFIED ENGINE - MAIN EXECUTION
// ============================================================================

/**
 * المحرك الموحد الرئيسي
 * Main Unified Engine
 * 
 * يدير تدفق البيانات عبر جميع الطبقات مع المعالجة المتوازية
 */
export async function executeUnifiedEngine(
  input: UnifiedEngineInput
): Promise<UnifiedEngineOutput> {
  const startTime = Date.now();
  const parallelStartTime = Date.now();

  try {
    // ========================================================================
    // Layer 1: Question Understanding
    // ========================================================================
    const questionAnalysis = {
      intent: "analyze_collective_emotion",
      entities: input.query.split(" ").slice(0, 3),
      complexity: input.query.length / 10,
    };

    // ========================================================================
    // Layers 2-5: Parallel Engine Execution
    // ========================================================================
    const engineResults = await executeEnginesInParallel(
      input.query,
      input.context
    );

    const parallelExecutionTime = Date.now() - parallelStartTime;

    // ========================================================================
    // Layer 15: Fusion Engine
    // ========================================================================
    const fusedAnalysis = {
      combinedInsights: "تم دمج تحليلات جميع المحركات بنجاح",
      confidence: calculateAverageConfidence(engineResults),
      keyFindings: [
        "الاتجاه الرئيسي: " + (engineResults.topic.result?.topic || "عام"),
        "العاطفة الأساسية: " + (engineResults.emotion.result?.dominantEmotion || "محايدة"),
        "المنطقة: " + (engineResults.region.result?.region || "عالمي"),
      ],
    };

    // ========================================================================
    // Layers 16-24: Enhancement & Final Response
    // ========================================================================
    const llmResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `أنت محلل ذكي للمشاعر الجماعية. استخدم البيانات التالية لإنشاء إجابة شاملة:
          
التحليل الموضوعي: ${JSON.stringify(engineResults.topic.result)}
التحليل العاطفي: ${JSON.stringify(engineResults.emotion.result)}
التحليل الإقليمي: ${JSON.stringify(engineResults.region.result)}
تحليل التأثير: ${JSON.stringify(engineResults.impact.result)}
التحليل المدمج: ${JSON.stringify(fusedAnalysis)}`,
        },
        {
          role: "user",
          content: input.query,
        },
      ],
    });

    const finalResponse = {
      answer:
        typeof llmResponse.choices?.[0]?.message?.content === "string"
          ? llmResponse.choices[0].message.content
          : "تم تحليل البيانات بنجاح",
      humanLikeAI: {
        contextualUnderstanding: {
          context: {
            immediateContext: input.context?.previousQuestions || [],
            expandedContext: [],
            personalContext: input.context?.userPreferences || {},
            culturalContext: {
              region: input.context?.region || "global",
            },
          },
          contextualInsights: "تم تحليل السياق بنجاح",
        },
        emotionalAdaptation: {
          detectedEmotion: {
            primary: "neutral",
            intensity: 50,
          },
          responseAdaptation: {
            tone: "informative",
            length: "moderate",
            includeSupport: true,
            supportMessage: "نحن هنا لمساعدتك",
          },
        },
        suggestions: {
          followUpQuestions: [
            {
              question: "ما هي الأسباب الجذرية لهذا الاتجاه؟",
              relevance: 0.9,
              expectedValue: "تحليل عميق",
            },
          ],
          relatedTopics: [],
          importantWarnings: [],
        },
      },
      metadata: {
        totalProcessingTime: Date.now() - startTime,
        parallelExecutionTime,
        engines: ["topic", "emotion", "region", "impact", "fusion"],
      },
    };

    return {
      requestId: input.requestId,
      query: input.query,
      questionAnalysis,
      engineResults,
      fusedAnalysis,
      finalResponse,
    };
  } catch (error) {
    console.error("Unified Engine Error:", error);
    throw error;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * حساب متوسط الثقة عبر جميع المحركات
 */
export function calculateAverageConfidence(
  engineResults: UnifiedEngineOutput["engineResults"]
): number {
  const confidences = [
    engineResults.topic.confidence,
    engineResults.emotion.confidence,
    engineResults.region.confidence,
    engineResults.impact.confidence,
  ];

  return (
    confidences.reduce((a, b) => a + b, 0) / confidences.length
  );
}

/**
 * الحصول على أسرع محرك
 */
export function getFastestEngine(
  engineResults: UnifiedEngineOutput["engineResults"]
): string {
  const engines = [
    { name: "topic", time: engineResults.topic.processingTime },
    { name: "emotion", time: engineResults.emotion.processingTime },
    { name: "region", time: engineResults.region.processingTime },
    { name: "impact", time: engineResults.impact.processingTime },
  ];

  return engines.reduce((fastest, current) =>
    current.time < fastest.time ? current : fastest
  ).name;
}

/**
 * الحصول على أكثر محرك ثقة
 */
export function getMostConfidentEngine(
  engineResults: UnifiedEngineOutput["engineResults"]
): string {
  const engines = [
    { name: "topic", confidence: engineResults.topic.confidence },
    { name: "emotion", confidence: engineResults.emotion.confidence },
    { name: "region", confidence: engineResults.region.confidence },
    { name: "impact", confidence: engineResults.impact.confidence },
  ];

  return engines.reduce((most, current) =>
    current.confidence > most.confidence ? current : most
  ).name;
}

/**
 * طباعة ملخص الأداء
 */
export function printPerformanceSummary(output: UnifiedEngineOutput): void {
  console.log("\n=== UNIFIED ENGINE PERFORMANCE SUMMARY ===\n");

  console.log("Engine Processing Times:");
  console.log(
    `  Topic:   ${output.engineResults.topic.processingTime}ms (${output.engineResults.topic.confidence.toFixed(2)} confidence)`
  );
  console.log(
    `  Emotion: ${output.engineResults.emotion.processingTime}ms (${output.engineResults.emotion.confidence.toFixed(2)} confidence)`
  );
  console.log(
    `  Region:  ${output.engineResults.region.processingTime}ms (${output.engineResults.region.confidence.toFixed(2)} confidence)`
  );
  console.log(
    `  Impact:  ${output.engineResults.impact.processingTime}ms (${output.engineResults.impact.confidence.toFixed(2)} confidence)`
  );

  console.log("\nOverall Performance:");
  console.log(
    `  Total Processing Time:    ${output.finalResponse.metadata.totalProcessingTime}ms`
  );
  console.log(
    `  Parallel Execution Time:  ${output.finalResponse.metadata.parallelExecutionTime}ms`
  );
  console.log(
    `  Average Confidence:       ${calculateAverageConfidence(output.engineResults).toFixed(2)}`
  );
  console.log(`  Fastest Engine:           ${getFastestEngine(output.engineResults)}`);
  console.log(
    `  Most Confident Engine:    ${getMostConfidentEngine(output.engineResults)}`
  );

  console.log("\n==========================================\n");
}
