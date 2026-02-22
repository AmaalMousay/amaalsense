/**
 * UNIFIED NETWORK PIPELINE WITH TINYLLAMA
 * 
 * Pipeline متكامل يستخدم TinyLlama 1.1B محلياً بدون حد استخدام
 */

import { generateResponseWithMistral, analyzeEmotionsWithMistral } from "./mistralModelIntegration";
import { formatPipelineResponse } from "./pipelineIntegration";

export interface PipelineInput {
  question: string;
  language: "ar" | "en";
  userId?: string;
  conversationId?: string;
}

export interface PipelineOutput {
  response: string;
  confidence: number;
  emotionalIntelligence: {
    dominant: string;
    secondary: string[];
    intensity: number;
  };
  followUpQuestions: string[];
  processingTime: number;
  cached: boolean;
}

/**
 * تشغيل Pipeline الكامل مع TinyLlama
 */
export async function runUnifiedPipelineWithTinyLlama(
  input: PipelineInput
): Promise<PipelineOutput> {
  const startTime = Date.now();
  
  try {
    console.log(`[Pipeline TinyLlama] Processing: "${input.question}"`);
    
    // Layer 1: Question Understanding (محلي - بدون LLM)
    const questionType = detectQuestionType(input.question);
    console.log(`[Pipeline TinyLlama] Question Type: ${questionType}`);
    
    // Layer 16: Response Generation (مع TinyLlama)
    const response = await generateResponseWithMistral(input.question, input.language);
    console.log(`[Pipeline TinyLlama] Generated response: ${response.substring(0, 100)}...`);
    
    // Layer 15: Confidence Scoring (محلي)
    const confidence = calculateConfidenceScore(input.question, response);
    console.log(`[Pipeline TinyLlama] Confidence: ${confidence}%`);
    
    // Emotion Analysis (محلي - بدون LLM)
    const emotions = analyzeEmotionsLocally(input.question);
    console.log(`[Pipeline TinyLlama] Emotions: ${JSON.stringify(emotions)}`);
    
    // Follow-up Questions (محلي)
    const followUpQuestions = generateFollowUpQuestionsLocally(input.question, questionType);
    
    const processingTime = Date.now() - startTime;
    
    return {
      response,
      confidence,
      emotionalIntelligence: {
        dominant: emotions.dominant,
        secondary: emotions.secondary,
        intensity: emotions.intensity
      },
      followUpQuestions,
      processingTime,
      cached: false
    };
  } catch (error) {
    console.error("[Pipeline TinyLlama] Error:", error);
    throw error;
  }
}

/**
 * الكشف عن نوع السؤال (محلي - بدون LLM)
 */
function detectQuestionType(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes("ماذا") || q.includes("what") || q.includes("كيف") || q.includes("how")) {
    return "explanatory";
  } else if (q.includes("هل") || q.includes("is") || q.includes("are")) {
    return "yes_no";
  } else if (q.includes("لماذا") || q.includes("why")) {
    return "reason";
  } else if (q.includes("متى") || q.includes("when")) {
    return "temporal";
  } else if (q.includes("أين") || q.includes("where")) {
    return "location";
  } else {
    return "general";
  }
}

/**
 * حساب درجة الثقة (محلي)
 */
function calculateConfidenceScore(question: string, response: string): number {
  // عوامل تؤثر على الثقة
  let confidence = 70; // قاعدة أساسية
  
  // إذا كان السؤال واضحاً
  if (question.length > 10 && question.length < 200) {
    confidence += 5;
  }
  
  // إذا كانت الإجابة طويلة كفاية
  if (response.length > 50) {
    confidence += 10;
  }
  
  // إذا كانت الإجابة تحتوي على كلمات مفيدة
  const helpfulWords = ["يعكس", "يثير", "يؤثر", "يعني", "يشير", "reflects", "indicates", "shows"];
  const hasHelpfulWords = helpfulWords.some(word => response.toLowerCase().includes(word));
  if (hasHelpfulWords) {
    confidence += 5;
  }
  
  return Math.min(confidence, 95); // الحد الأقصى 95%
}

/**
 * تحليل المشاعر محلياً (بدون LLM)
 */
function analyzeEmotionsLocally(question: string): {
  dominant: string;
  secondary: string[];
  intensity: number;
} {
  const q = question.toLowerCase();
  
  // قاموس الكلمات المرتبطة بالمشاعر
  const emotionKeywords = {
    excitement: ["تكنولوجيا", "جديد", "innovation", "exciting", "amazing"],
    concern: ["قلق", "خوف", "مشكلة", "concern", "worry", "problem"],
    hope: ["أمل", "مستقبل", "حل", "hope", "solution", "future"],
    sadness: ["حزن", "فقدان", "sad", "loss", "grief"],
    anger: ["غضب", "غاضب", "angry", "furious", "outrage"],
    curiosity: ["فضول", "سؤال", "curious", "wonder", "question"]
  };
  
  // حساب درجات المشاعر
  const emotionScores: Record<string, number> = {};
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    emotionScores[emotion] = keywords.filter(kw => q.includes(kw)).length;
  }
  
  // العثور على المشاعر المهيمنة
  const sortedEmotions = Object.entries(emotionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([emotion]) => emotion);
  
  const dominant = sortedEmotions[0] || "neutral";
  const secondary = sortedEmotions.slice(1, 3);
  const intensity = Math.min(50 + Object.values(emotionScores).reduce((a, b) => a + b, 0) * 10, 100);
  
  return { dominant, secondary, intensity };
}

/**
 * توليد أسئلة متابعة محلياً (بدون LLM)
 */
function generateFollowUpQuestionsLocally(question: string, questionType: string): string[] {
  const q = question.toLowerCase();
  const followUps: string[] = [];
  
  // أسئلة متابعة حسب نوع السؤال
  if (questionType === "explanatory") {
    followUps.push("ما التوصيات المقترحة؟");
    followUps.push("ما المخاطر المحتملة؟");
    followUps.push("ما التوقعات المستقبلية؟");
  } else if (questionType === "reason") {
    followUps.push("هل هناك عوامل أخرى؟");
    followUps.push("ما التأثيرات طويلة الأجل؟");
    followUps.push("كيف يمكن التعامل معها؟");
  } else if (questionType === "temporal") {
    followUps.push("ما التطورات المتوقعة؟");
    followUps.push("ما الدروس المستفادة؟");
    followUps.push("كيف نستعد للمستقبل؟");
  } else {
    followUps.push("ما التفاصيل الإضافية؟");
    followUps.push("ما الآثار المترتبة؟");
    followUps.push("ما الحلول المقترحة؟");
  }
  
  return followUps;
}

/**
 * تنسيق النتيجة النهائية
 */
export function formatTinyLlamaResponse(output: PipelineOutput): string {
  return JSON.stringify({
    success: true,
    data: {
      response: output.response,
      confidence: `${output.confidence}%`,
      emotionalIntelligence: output.emotionalIntelligence,
      followUpQuestions: output.followUpQuestions,
      metadata: {
        processingTime: `${output.processingTime}ms`,
        model: "tinyllama:1.1b",
        cached: output.cached
      }
    }
  }, null, 2);
}
