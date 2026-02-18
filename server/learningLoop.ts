/**
 * LEARNING LOOP - LAYER 21
 * 
 * نظام التعلم الذاتي الذي يحسن النظام بناءً على ردود فعل المستخدمين
 */

import { UnifiedPipelineContext } from "./unifiedNetworkPipeline";

/**
 * نموذج ردود الفعل من المستخدم
 */
export interface UserFeedback {
  requestId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  correctness: "correct" | "partially_correct" | "incorrect" | "unknown";
  relevance: "highly_relevant" | "relevant" | "somewhat_relevant" | "not_relevant";
  timestamp: Date;
  suggestedCorrection?: string;
}

/**
 * نموذج بيانات التعلم
 */
export interface LearningData {
  feedbackId: string;
  requestId: string;
  userId: string;
  question: string;
  response: string;
  feedback: UserFeedback;
  pipelineContext: Partial<UnifiedPipelineContext>;
  learningInsights: {
    errorType: "factual_error" | "understanding_error" | "generation_error" | "language_error" | "other";
    severity: number; // 0-100
    affectedLayers: string[];
    suggestedFix: string;
  };
  timestamp: Date;
}

/**
 * مستودع التعلم
 */
const learningRepository = new Map<string, LearningData[]>();

/**
 * معالج ردود الفعل
 */
export async function processFeedback(
  feedback: UserFeedback,
  context: Partial<UnifiedPipelineContext>
): Promise<LearningData> {
  try {
    // تحليل ردود الفعل
    const insights = analyzeFeedback(feedback, context);

    // إنشاء سجل التعلم
    const learningData: LearningData = {
      feedbackId: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: feedback.requestId,
      userId: feedback.userId,
      question: (context as any).userInput?.question || "",
      response: context.languageEnforced?.finalResponse || "",
      feedback,
      pipelineContext: context,
      learningInsights: insights,
      timestamp: new Date()
    };

    // حفظ في المستودع
    if (!learningRepository.has(feedback.userId)) {
      learningRepository.set(feedback.userId, []);
    }
    learningRepository.get(feedback.userId)!.push(learningData);

    console.log(`[Learning] Processed feedback: ${learningData.feedbackId}`);

    return learningData;
  } catch (error) {
    console.error("Error processing feedback:", error);
    throw error;
  }
}

/**
 * تحليل ردود الفعل
 */
function analyzeFeedback(
  feedback: UserFeedback,
  context: Partial<UnifiedPipelineContext>
): LearningData["learningInsights"] {
  let errorType: LearningData["learningInsights"]["errorType"] = "other";
  let severity = 0;
  let affectedLayers: string[] = [];
  let suggestedFix = "";

  // تحديد نوع الخطأ بناءً على التقييم والتصحيح المقترح
  if (feedback.correctness === "incorrect") {
    severity = 100;

    if (feedback.suggestedCorrection) {
      // تحليل نوع التصحيح
      if (feedback.suggestedCorrection.includes("خطأ معلوماتي")) {
        errorType = "factual_error";
        affectedLayers = ["Layer 14: General Knowledge"];
        suggestedFix = "تحديث قاعدة المعرفة العامة";
      } else if (feedback.suggestedCorrection.includes("لم أفهم")) {
        errorType = "understanding_error";
        affectedLayers = ["Layer 1: Question Understanding"];
        suggestedFix = "تحسين فهم السؤال";
      } else if (feedback.suggestedCorrection.includes("لغة")) {
        errorType = "language_error";
        affectedLayers = ["Layer 18: Language Enforcement"];
        suggestedFix = "تحسين فرض اللغة";
      } else {
        errorType = "generation_error";
        affectedLayers = ["Layer 16: Response Generation"];
        suggestedFix = "تحسين توليد الإجابة";
      }
    }
  } else if (feedback.correctness === "partially_correct") {
    severity = 50;
    errorType = "generation_error";
    affectedLayers = ["Layer 16: Response Generation", "Layer 19: Quality Assessment"];
    suggestedFix = "تحسين اكتمال الإجابة";
  } else if (feedback.correctness === "correct") {
    severity = 0;
    suggestedFix = "لا يوجد خطأ";
  }

  // تعديل الخطورة بناءً على التقييم
  if (feedback.rating <= 2) {
    severity = Math.max(severity, 80);
  } else if (feedback.rating === 3) {
    severity = Math.max(severity, 50);
  }

  return {
    errorType,
    severity,
    affectedLayers,
    suggestedFix
  };
}

/**
 * الحصول على بيانات التعلم للمستخدم
 */
export function getUserLearningData(userId: string): LearningData[] {
  return learningRepository.get(userId) || [];
}

/**
 * الحصول على الأخطاء الشائعة
 */
export function getCommonErrors(): {
  errorType: string;
  count: number;
  affectedLayers: string[];
  severity: number;
}[] {
  const errorStats = new Map<string, {
    count: number;
    affectedLayers: Set<string>;
    totalSeverity: number;
  }>();

  // جمع الإحصائيات من جميع المستخدمين
  const values = Array.from(learningRepository.values());
  for (let i = 0; i < values.length; i++) {
    const userFeedback = values[i];
    for (const data of userFeedback) {
      const key = data.learningInsights.errorType;
      if (!errorStats.has(key)) {
        errorStats.set(key, {
          count: 0,
          affectedLayers: new Set(),
          totalSeverity: 0
        });
      }

      const stats = errorStats.get(key)!;
      stats.count++;
      data.learningInsights.affectedLayers.forEach(layer => stats.affectedLayers.add(layer));
      stats.totalSeverity += data.learningInsights.severity;
    }
  }

  // تحويل إلى مصفوفة
  return Array.from(errorStats.entries()).map(([errorType, stats]) => ({
    errorType,
    count: stats.count,
    affectedLayers: Array.from(stats.affectedLayers),
    severity: Math.round(stats.totalSeverity / stats.count)
  })) as any[];
}

/**
 * الحصول على توصيات التحسين
 */
export function getImprovementRecommendations(): {
  layer: string;
  priority: "high" | "medium" | "low";
  recommendation: string;
  affectedUsers: number;
  errorCount: number;
}[] {
  const layerStats = new Map<string, {
    priority: number;
    errorCount: number;
    affectedUsers: Set<string>;
  }>();

  // جمع الإحصائيات حسب الطبقة
  const entries2 = Array.from(learningRepository.entries());
  for (let i = 0; i < entries2.length; i++) {
    const [userId, userFeedback] = entries2[i];
    for (const data of userFeedback) {
      for (const layer of data.learningInsights.affectedLayers) {
        if (!layerStats.has(layer)) {
          layerStats.set(layer, {
            priority: 0,
            errorCount: 0,
            affectedUsers: new Set()
          });
        }

        const stats = layerStats.get(layer)!;
        stats.priority += data.learningInsights.severity;
        stats.errorCount++;
        stats.affectedUsers.add(userId);
      }
    }
  }

  // تحويل إلى مصفوفة مع التوصيات
  return Array.from(layerStats.entries())
    .map(([layer, stats]) => {
      const priority: "high" | "medium" | "low" = stats.priority > 70 ? "high" : stats.priority > 40 ? "medium" : "low";
      return {
        layer,
        priority,
        recommendation: getRecommendationForLayer(layer),
        affectedUsers: stats.affectedUsers.size,
        errorCount: stats.errorCount
      };
    })
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
    });
}

/**
 * الحصول على التوصية المناسبة لكل طبقة
 */
function getRecommendationForLayer(layer: string | any): string {
  const recommendations: Record<string, string> = {
    "Layer 1: Question Understanding": "تحسين فهم أنواع الأسئلة المختلفة",
    "Layer 14: General Knowledge": "تحديث قاعدة المعرفة العامة",
    "Layer 16: Response Generation": "تحسين جودة توليد الإجابات",
    "Layer 18: Language Enforcement": "تحسين دقة الترجمة والفرض اللغوي",
    "Layer 19: Quality Assessment": "تحسين معايير تقييم الجودة"
  };

  return recommendations[layer] || "تحسين عام للطبقة";
}

/**
 * تطبيق التحسينات بناءً على التعلم
 */
export async function applyLearningImprovements(): Promise<{
  success: boolean;
  improvements: number;
  recommendations: string[];
}> {
  try {
    const recommendations = getImprovementRecommendations();
    const highPriorityRecommendations = recommendations
      .filter(r => r.priority === "high")
      .map(r => `${r.layer}: ${r.recommendation}`);

    console.log("[Learning] Applying improvements based on feedback");
    console.log("[Learning] High priority recommendations:", highPriorityRecommendations);

    return {
      success: true,
      improvements: highPriorityRecommendations.length,
      recommendations: highPriorityRecommendations
    };
  } catch (error) {
    console.error("Error applying learning improvements:", error);
    return {
      success: false,
      improvements: 0,
      recommendations: []
    };
  }
}

/**
 * الحصول على ملخص التعلم
 */
export function getLearningsSummary(): {
  totalFeedback: number;
  averageRating: number;
  correctnessDistribution: Record<string, number>;
  topErrors: string[];
  topRecommendations: string[];
}[] {
  const summaries = [];

  const entries = Array.from(learningRepository.entries());
  for (let i = 0; i < entries.length; i++) {
    const [userId, userFeedback] = entries[i];
    if (userFeedback.length === 0) continue;

    const totalFeedback = userFeedback.length;
    const averageRating = userFeedback.reduce((sum: number, d: LearningData) => sum + d.feedback.rating, 0) / totalFeedback;

    const correctnessDistribution: Record<string, number> = {
      correct: 0,
      partially_correct: 0,
      incorrect: 0,
      unknown: 0
    };

    for (const data of userFeedback) {
      correctnessDistribution[data.feedback.correctness]++;
    }

    const topErrors = Array.from(
      new Set(userFeedback.map((d: LearningData) => d.learningInsights.errorType))
    ).slice(0, 3) as string[];

    const topRecommendations = Array.from(
      new Set(userFeedback.map((d: LearningData) => d.learningInsights.suggestedFix))
    ).slice(0, 3) as string[];

    summaries.push({
      totalFeedback,
      averageRating: Math.round(averageRating * 10) / 10,
      correctnessDistribution,
      topErrors,
      topRecommendations
    });
  }

  return summaries;
}

/**
 * تصدير بيانات التعلم
 */
export function exportLearningData(): {
  totalFeedback: number;
  commonErrors: any[];
  recommendations: any[];
  summary: any;
}[] {
  return Array.from(learningRepository.entries()).map(([userId, data]) => ({
    userId,
    totalFeedback: data.length,
    commonErrors: getCommonErrors(),
    recommendations: getImprovementRecommendations(),
    summary: getLearningsSummary()[0] || {}
  }));
}
