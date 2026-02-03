/**
 * Enhanced Pipeline
 * دمج كل المكونات الجديدة في pipeline واحد متكامل
 * 
 * المكونات:
 * 1. Session Cognitive Context - ذاكرة السياق
 * 2. Dynamic Response Engine - الرد الديناميكي
 * 3. Narrative Style Engine - صوت المستشار
 * 4. Calibration Layer - الاستبيانات
 */

import { SessionContextManager, getFullContext } from './sessionContext';
import { DynamicResponseEngine, determineResponseStructure, generateFormattingInstructions } from './dynamicResponseEngine';
import { NarrativeStyleEngine, generateStyleInstructions, applyConsultantStyle, generateConsultantQuestions } from './narrativeStyleEngine';
import { invokeLLM } from '../_core/llm';

export interface EnhancedPipelineInput {
  sessionId: string;
  question: string;
  userRole?: string;
  analysisData?: {
    emotions: { fear: number; hope: number; anger: number };
    causes: string[];
    headlines: string[];
    sources: string[];
  };
}

export interface EnhancedPipelineOutput {
  response: string;
  followUpQuestions: string[];
  metadata: {
    sessionContext: {
      country: string;
      domain: string;
      topic: string;
      questionNumber: number;
      isFollowUp: boolean;
    };
    responseStructure: {
      format: string;
      maxLength: string;
    };
    cognitiveInsight?: string;
  };
}

/**
 * تنفيذ الـ Pipeline المحسّن
 */
export async function executeEnhancedPipeline(
  input: EnhancedPipelineInput
): Promise<EnhancedPipelineOutput> {
  const { sessionId, question, userRole = 'general', analysisData } = input;
  
  // 1. الحصول على السياق الكامل
  const { session, effectiveContext } = getFullContext(sessionId, question);
  
  // 2. تحديد هيكل الرد
  const lastIntent = session.questionHistory[session.questionHistory.length - 1]?.intent;
  const responseStructure = determineResponseStructure({
    questionIntent: lastIntent || { type: 'what', isFollowUp: false, requiresContext: false },
    questionNumber: effectiveContext.questionNumber,
    userRole,
    isFollowUp: effectiveContext.isFollowUp,
    hasContext: !!effectiveContext.topic,
  });
  
  // 3. توليد تعليمات الأسلوب
  const styleInstructions = generateStyleInstructions();
  const formatInstructions = generateFormattingInstructions(responseStructure);
  
  // 4. بناء الـ prompt المحسّن
  const enhancedPrompt = buildEnhancedPrompt({
    question,
    context: effectiveContext,
    analysisData,
    styleInstructions,
    formatInstructions,
    isFollowUp: effectiveContext.isFollowUp,
  });
  
  // 5. استدعاء LLM
  const llmResponse = await invokeLLM({
    messages: [
      { role: 'system', content: enhancedPrompt.systemPrompt },
      { role: 'user', content: enhancedPrompt.userPrompt },
    ],
  });
  
  // 6. معالجة الرد
  const rawContent = llmResponse.choices[0]?.message?.content || '';
  const responseText = typeof rawContent === 'string' ? rawContent : String(rawContent);
  const processedResponse = applyConsultantStyle(responseText);
  
  // 7. توليد أسئلة المتابعة
  const dominantEmotion = analysisData ? 
    getDominantEmotion(analysisData.emotions) : 'mixed';
  
  const followUpQuestions = generateConsultantQuestions(
    effectiveContext.topic,
    dominantEmotion,
    effectiveContext.country
  );
  
  return {
    response: processedResponse,
    followUpQuestions,
    metadata: {
      sessionContext: {
        country: effectiveContext.country,
        domain: effectiveContext.domain,
        topic: effectiveContext.topic,
        questionNumber: effectiveContext.questionNumber,
        isFollowUp: effectiveContext.isFollowUp,
      },
      responseStructure: {
        format: responseStructure.format,
        maxLength: responseStructure.maxLength,
      },
    },
  };
}

/**
 * بناء الـ prompt المحسّن
 */
function buildEnhancedPrompt(params: {
  question: string;
  context: { country: string; domain: string; topic: string; isFollowUp: boolean; questionNumber: number };
  analysisData?: EnhancedPipelineInput['analysisData'];
  styleInstructions: string;
  formatInstructions: string;
  isFollowUp: boolean;
}): { systemPrompt: string; userPrompt: string } {
  const { question, context, analysisData, styleInstructions, formatInstructions, isFollowUp } = params;
  
  // System prompt
  let systemPrompt = `${styleInstructions}

${formatInstructions}

السياق الحالي:
- الدولة: ${context.country}
- المجال: ${context.domain}
- الموضوع: ${context.topic}
- رقم السؤال في الجلسة: ${context.questionNumber}
`;

  if (isFollowUp) {
    systemPrompt += `
هذا سؤال متابعة. استخدم السياق السابق ولا تكرر المعلومات.
كن مختصراً ومباشراً.
`;
  }

  // User prompt
  let userPrompt = `السؤال: ${question}`;
  
  if (analysisData) {
    userPrompt += `

بيانات التحليل:
- المشاعر: خوف ${analysisData.emotions.fear}%، أمل ${analysisData.emotions.hope}%، غضب ${analysisData.emotions.anger}%
- الأسباب من البيانات: ${analysisData.causes.slice(0, 3).join('، ')}
- عدد المصادر: ${analysisData.sources.length}
`;
  }

  return { systemPrompt, userPrompt };
}

/**
 * تحديد المشاعر السائدة
 */
function getDominantEmotion(emotions: { fear: number; hope: number; anger: number }): string {
  const entries = Object.entries(emotions);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  
  const dominant = sorted[0][0];
  const second = sorted[1][0];
  
  // إذا كان الفرق صغيراً، نعتبره مختلطاً
  if (sorted[0][1] - sorted[1][1] < 15) {
    return 'mixed';
  }
  
  return dominant;
}

/**
 * إعادة تعيين جلسة المستخدم
 */
export function resetUserSession(sessionId: string): void {
  SessionContextManager.resetSession(sessionId);
}

/**
 * الحصول على ملخص الجلسة
 */
export function getUserSessionSummary(sessionId: string): string {
  return SessionContextManager.getSessionSummary(sessionId);
}

/**
 * تصدير الدوال
 */
export const EnhancedPipeline = {
  execute: executeEnhancedPipeline,
  resetSession: resetUserSession,
  getSessionSummary: getUserSessionSummary,
};
