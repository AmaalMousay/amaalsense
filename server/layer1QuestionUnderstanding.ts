/**
 * LAYER 1: Question Understanding
 * 
 * الطبقة الأولى - فهم السؤال فقط
 * الوظيفة الوحيدة: فهم السؤال وإرساله للمحرك الموحد
 * 
 * لا تقوم بـ:
 * - تحليل العواطف
 * - توليد الإجابات
 * - أي معالجة أخرى
 * 
 * فقط تفهم السؤال وتستخرج المعلومات الأساسية
 */

import { smartInvokeLLM } from "./smartLLM";

export interface Layer1Output {
  // المعلومات الأساسية
  originalQuestion: string;
  language: string;
  questionType: QuestionType;
  
  // الكيانات المستخرجة
  entities: {
    topics: string[];
    people: string[];
    locations: string[];
    organizations: string[];
  };
  
  // فحوصات أساسية
  hasFactualError: boolean;
  factualErrorDescription?: string;
  
  // حالة السؤال
  clarificationNeeded: boolean;
  clarificationReason?: string;
  
  // معلومات الثقة
  confidence: number; // 0-100
  
  // معلومات إضافية
  timeContext?: string; // "past", "present", "future"
  geographicContext?: string;
  isComparative: boolean;
  isOpinionBased: boolean;
  
  // للمحرك الموحد
  readyForAnalysis: boolean;
  suggestedAnalysisType?: AnalysisType;
}

export type QuestionType = 
  | "sentiment" // رأي الناس
  | "factual" // حقيقة معينة
  | "opinion" // رأي شخصي
  | "trend" // اتجاه عام
  | "comparison" // مقارنة
  | "explanation" // شرح
  | "prediction" // توقع
  | "recommendation" // توصية
  | "other";

export type AnalysisType =
  | "emotion_analysis"
  | "trend_detection"
  | "sentiment_analysis"
  | "fact_checking"
  | "comparison_analysis"
  | "direct_answer";

/**
 * Layer 1: فهم السؤال فقط
 * 
 * الإدخال: السؤال من المستخدم
 * الإخراج: معلومات مفصلة عن السؤال
 * 
 * لا تقوم بـ:
 * - تحليل العواطف
 * - توليد الإجابات
 * - استدعاء طبقات أخرى
 */
export async function layer1QuestionUnderstanding(
  question: string,
  language: string = "ar"
): Promise<Layer1Output> {
  try {
    // استخدم LLM لفهم السؤال فقط
    const response = await smartInvokeLLM({
      messages: [
        {
          role: "system",
          content: `أنت محلل أسئلة متخصص. وظيفتك الوحيدة هي فهم السؤال واستخراج المعلومات الأساسية.
          
لا تقوم بـ:
- تحليل العواطف
- توليد الإجابات
- أي معالجة أخرى

فقط افهم السؤال واستخرج:
1. نوع السؤال (questionType): أحد هذه القيم: sentiment, factual, opinion, trend, comparison, explanation, prediction, recommendation, other
2. الكيانات (entities): كائن يحتوي على topics, people, locations, organizations (كل منها مصفوفة نصوص)
3. hasFactualError: هل يحتوي على خطأ معلوماتي؟ (true/false)
4. factualErrorDescription: وصف الخطأ (نص فارغ إذا لا يوجد)
5. clarificationNeeded: هل يحتاج توضيح؟ (true/false)
6. clarificationReason: سبب التوضيح (نص فارغ إذا لا يحتاج)
7. timeContext: السياق الزمني (past/present/future)
8. geographicContext: السياق الجغرافي
9. isComparative: هل مقارنة؟ (true/false)
10. isOpinionBased: هل رأي؟ (true/false)
11. confidence: نسبة الثقة (0-100)

أجب بـ JSON فقط بدون أي نص إضافي.`
        },
        {
          role: "user",
          content: `السؤال: "${question}"
اللغة: ${language}

استخرج المعلومات الأساسية عن هذا السؤال فقط. أجب بـ JSON.`
        }
      ],
      response_format: { type: "json_object" } as any
    }, 'question_understanding');

    // استخرج النتيجة من الرد
    const content = response.choices[0].message.content;
    let analysisData;
    
    if (typeof content === "string") {
      analysisData = JSON.parse(content);
    } else {
      analysisData = content;
    }

    // حدد نوع التحليل المقترح
    const suggestedAnalysisType = determineSuggestedAnalysisType(
      analysisData.questionType,
      analysisData.isOpinionBased
    );

    // تحقق من الاستعداد للتحليل
    const readyForAnalysis = !analysisData.clarificationNeeded && !analysisData.hasFactualError;

    return {
      originalQuestion: question,
      language,
      questionType: analysisData.questionType,
      entities: analysisData.entities,
      hasFactualError: analysisData.hasFactualError,
      factualErrorDescription: analysisData.factualErrorDescription,
      clarificationNeeded: analysisData.clarificationNeeded,
      clarificationReason: analysisData.clarificationReason,
      confidence: Math.round(analysisData.confidence * 100) / 100,
      timeContext: analysisData.timeContext,
      geographicContext: analysisData.geographicContext,
      isComparative: analysisData.isComparative,
      isOpinionBased: analysisData.isOpinionBased,
      readyForAnalysis,
      suggestedAnalysisType
    };
  } catch (error) {
    console.error("Layer 1 Error:", error);
    
    // إذا فشل LLM، استخدم fallback بسيط
    return getLayer1Fallback(question, language);
  }
}

/**
 * حدد نوع التحليل المقترح بناءً على نوع السؤال
 */
function determineSuggestedAnalysisType(
  questionType: QuestionType,
  isOpinionBased: boolean
): AnalysisType {
  if (questionType === "sentiment" || isOpinionBased) {
    return "emotion_analysis";
  } else if (questionType === "trend") {
    return "trend_detection";
  } else if (questionType === "factual") {
    return "fact_checking";
  } else if (questionType === "comparison") {
    return "comparison_analysis";
  } else if (questionType === "opinion") {
    return "sentiment_analysis";
  } else {
    return "direct_answer";
  }
}

/**
 * Fallback بسيط إذا فشل LLM
 */
function getLayer1Fallback(
  question: string,
  language: string
): Layer1Output {
  const isArabic = language === "ar";
  
  // كشف بسيط لنوع السؤال
  let questionType: QuestionType = "other";
  if (question.includes("رأي") || question.includes("يشعر") || question.includes("opinion")) {
    questionType = "sentiment";
  } else if (question.includes("هل") || question.includes("is")) {
    questionType = "factual";
  } else if (question.includes("لماذا") || question.includes("why")) {
    questionType = "explanation";
  }

  return {
    isOpinionBased: questionType === "sentiment",
    originalQuestion: question,
    language,
    questionType,
    entities: {
      topics: [],
      people: [],
      locations: [],
      organizations: []
    },
    hasFactualError: false,
    clarificationNeeded: false,
    confidence: 60,
    isComparative: false,
    readyForAnalysis: true,
    suggestedAnalysisType: determineSuggestedAnalysisType(questionType, false)
  };
}

/**
 * تحقق من جودة السؤال
 */
export function validateQuestionQuality(output: Layer1Output): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (output.hasFactualError) {
    issues.push(`خطأ معلوماتي: ${output.factualErrorDescription || "غير محدد"}`);
  }

  if (output.clarificationNeeded) {
    issues.push(`يحتاج توضيح: ${output.clarificationReason || "السؤال غير واضح"}`);
  }

  if (output.confidence < 50) {
    issues.push(`ثقة منخفضة: ${output.confidence}%`);
  }

  if (!output.entities.topics || output.entities.topics.length === 0) {
    issues.push("لم يتم استخراج مواضيع من السؤال");
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * تحويل Layer 1 Output إلى صيغة قابلة للقراءة
 */
export function formatLayer1Output(output: Layer1Output): string {
  const lines: string[] = [];

  lines.push("📋 تحليل السؤال (Layer 1):");
  lines.push(`السؤال: ${output.originalQuestion}`);
  lines.push(`اللغة: ${output.language}`);
  lines.push(`نوع السؤال: ${output.questionType}`);
  lines.push(`الثقة: ${output.confidence}%`);

  if (output.entities.topics.length > 0) {
    lines.push(`المواضيع: ${output.entities.topics.join(", ")}`);
  }

  if (output.entities.people.length > 0) {
    lines.push(`الأشخاص: ${output.entities.people.join(", ")}`);
  }

  if (output.entities.locations.length > 0) {
    lines.push(`الأماكن: ${output.entities.locations.join(", ")}`);
  }

  if (output.hasFactualError) {
    lines.push(`⚠️ خطأ معلوماتي: ${output.factualErrorDescription}`);
  }

  if (output.clarificationNeeded) {
    lines.push(`❓ يحتاج توضيح: ${output.clarificationReason}`);
  }

  lines.push(`جاهز للتحليل: ${output.readyForAnalysis ? "✅" : "❌"}`);
  lines.push(`نوع التحليل المقترح: ${output.suggestedAnalysisType}`);

  return lines.join("\n");
}
