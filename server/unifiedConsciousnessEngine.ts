/**
 * Unified Consciousness Engine
 * 
 * محرك موحد واحد يجمع:
 * 1. Hybrid DCFT-AI (للدقة العلمية)
 * 2. Graph Pipeline (للسرعة)
 * 3. Question Understanding Layer (للذكاء)
 * 
 * الهدف: محرك واحد موحد يفهم السؤال ويختار الطريقة الأفضل
 */

import { z } from 'zod';
import { 
  understandQuestion, 
  DeepQuestion,
} from './cognitiveEngine/questionUnderstanding';
import { analyzeHybrid, HybridAnalysisResult } from './hybridAnalyzer';
import { graphPipeline, reasoningEngine, EventVector } from './graphPipeline';
import { AffectiveVector } from './dcft/affectiveVector';

/**
 * نتيجة المحرك الموحد
 */
export interface UnifiedAnalysisResult {
  // معلومات السؤال
  questionUnderstanding: DeepQuestion;
  
  // الإجابة المباشرة (إن وجدت)
  directAnswer?: string;
  
  // نتائج التحليل (إن لزم الأمر)
  analysis?: {
    // من DCFT
    emotions?: AffectiveVector;
    indices?: {
      gmi: number;
      cfi: number;
      hri: number;
    };
    dcftData?: HybridAnalysisResult;
    
    // من Graph Pipeline
    eventVector?: EventVector;
    
    // من Groq
    reasoning?: string;
  };
  
  // الأداء والمراقبة
  performance: {
    totalProcessingTime: number;      // الوقت الكلي
    questionUnderstandingTime: number; // وقت فهم السؤال
    analysisTime?: number;             // وقت التحليل
    
    // ما الذي تم تشغيله؟
    systemsUsed: {
      questionUnderstanding: boolean;
      directAnswer: boolean;
      hybridDCFT: boolean;
      graphPipeline: boolean;
      groq: boolean;
    };
  };
  
  // البيانات الوصفية
  metadata: {
    timestamp: Date;
    language: 'ar' | 'en';
    confidence: number;
    processingStrategy: string; // شرح الاستراتيجية المستخدمة
  };
}

/**
 * الدالة الرئيسية: التحليل الموحد
 */
export async function unifiedAnalyze(
  question: string,
  context?: {
    topic?: string;
    country?: string;
    previousMessages?: any[];
  }
): Promise<UnifiedAnalysisResult> {
  const startTime = Date.now();
  let questionUnderstandingTime = 0;
  let analysisTime = 0;
  
  // ============================================
  // Step 1: فهم السؤال (AI Driven)
  // ============================================
  const step1Start = Date.now();
  const questionUnderstanding = await understandQuestion(question, context?.previousMessages);
  questionUnderstandingTime = Date.now() - step1Start;
  
  console.log(`[UnifiedEngine] Topic: ${questionUnderstanding.surface.topic}`);
  console.log(`[UnifiedEngine] Intent: ${questionUnderstanding.deep.realIntent}`);
  console.log(`[UnifiedEngine] Language: ${questionUnderstanding.context.language}`);
  
  // ============================================
  // Step 2: هل يحتاج تحليل؟
  // ============================================
  // Note: All questions now go through LLM, but some might be identified as simple greetings/social
  const needsAnalysis = questionUnderstanding.surface.questionType !== 'greeting' && 
                        questionUnderstanding.deep.realIntent !== 'socialize';
  
  if (!needsAnalysis) {
    console.log(`[UnifiedEngine] Question identified as social/greeting - simple response sufficient`);
    
    return {
      questionUnderstanding,
      performance: {
        totalProcessingTime: Date.now() - startTime,
        questionUnderstandingTime,
        systemsUsed: {
          questionUnderstanding: true,
          directAnswer: false,
          hybridDCFT: false,
          graphPipeline: false,
          groq: false,
        },
      },
      metadata: {
        timestamp: new Date(),
        language: questionUnderstanding.context.language,
        confidence: 1.0,
        processingStrategy: 'Social/Greeting Handling',
      },
    };
  }
  
  // ============================================
  // Step 4: تشغيل التحليل الموحد
  // ============================================
  const step4Start = Date.now();
  const analysis: UnifiedAnalysisResult['analysis'] = {};
  
  const systemsUsed = {
    questionUnderstanding: true,
    directAnswer: false,
    hybridDCFT: false,
    graphPipeline: false,
    groq: false,
  };
  
  try {
    // ============================================
    // 4.1: DCFT Analysis (دائماً للدقة)
    // ============================================
    const requiredSources = questionUnderstanding.requiredSources;
    if (requiredSources.includes('emotion_indicators') || requiredSources.includes('economic_data')) {
      console.log(`[UnifiedEngine] Running Hybrid DCFT-AI Analysis...`);
      
      const hybridResult = await analyzeHybrid(
        question,
        context?.topic ? 'user' : 'news',
        {
          topic: context?.topic,
          country: context?.country,
        }
      );
      
      analysis.emotions = {
        joy: (hybridResult.emotions.joy + 1) / 2,
        fear: (hybridResult.emotions.fear + 1) / 2,
        anger: (hybridResult.emotions.anger + 1) / 2,
        sadness: (hybridResult.emotions.sadness + 1) / 2,
        hope: (hybridResult.emotions.hope + 1) / 2,
        curiosity: (hybridResult.emotions.curiosity + 1) / 2,
      };
      
      analysis.indices = hybridResult.indices;
      analysis.dcftData = hybridResult;
      systemsUsed.hybridDCFT = true;
      
      console.log(`[UnifiedEngine] DCFT Analysis Complete - GMI: ${hybridResult.indices.gmi}`);
    }
    
    // ============================================
    // 4.2: Graph Pipeline (للسرعة والتفاصيل)
    // ============================================
    if (requiredSources.includes('news') || requiredSources.includes('historical')) {
      console.log(`[UnifiedEngine] Running Graph Pipeline...`);
      
      const eventVector = await graphPipeline(question);
      analysis.eventVector = eventVector;
      systemsUsed.graphPipeline = true;
      
      console.log(`[UnifiedEngine] Graph Pipeline Complete - Topic: ${eventVector.topic}`);
    }
    
    // ============================================
    // 4.3: Groq Reasoning (للتحليل الذكي)
    // ============================================
    if (analysis.eventVector) {
      console.log(`[UnifiedEngine] Running Groq Reasoning...`);
      
      const reasoning = await reasoningEngine(analysis.eventVector, question);
      analysis.reasoning = reasoning;
      systemsUsed.groq = true;
      
      console.log(`[UnifiedEngine] Groq Reasoning Complete`);
    }
    
    analysisTime = Date.now() - step4Start;
    
  } catch (error) {
    console.error(`[UnifiedEngine] Analysis Error:`, error);
    // Return a safe result with what we have so far
    analysisTime = Date.now() - step4Start;
    return {
      questionUnderstanding,
      analysis: analysis || {},
      performance: {
        totalProcessingTime: Date.now() - startTime,
        questionUnderstandingTime,
        analysisTime: analysisTime > 0 ? analysisTime : undefined,
        systemsUsed,
      },
      metadata: {
        timestamp: new Date(),
        language: questionUnderstanding.context.language,
        confidence: 1.0,
        processingStrategy: 'Partial Analysis - Some Systems Failed',
      },
    };
  }
  
  // ============================================
  // Step 5: إرجاع النتيجة الموحدة
  // ============================================
  const totalTime = Date.now() - startTime;
  
  return {
    questionUnderstanding,
    analysis,
    performance: {
      totalProcessingTime: totalTime,
      questionUnderstandingTime,
      analysisTime: analysisTime > 0 ? analysisTime : undefined,
      systemsUsed,
    },
    metadata: {
      timestamp: new Date(),
      language: questionUnderstanding.context.language,
      confidence: 1.0,
      processingStrategy: generateStrategy(questionUnderstanding, systemsUsed),
    },
  };
}

/**
 * توليد وصف الاستراتيجية المستخدمة
 */
function generateStrategy(
  understanding: DeepQuestion,
  systemsUsed: UnifiedAnalysisResult['performance']['systemsUsed']
): string {
  const parts: string[] = [];
  
  if (systemsUsed.directAnswer) {
    return 'Direct Answer - No Analysis Needed';
  }
  
  if (!systemsUsed.hybridDCFT && !systemsUsed.graphPipeline) {
    return 'Question Unclear - Requesting Clarification';
  }
  
  parts.push('Comprehensive Analysis:');
  
  if (systemsUsed.hybridDCFT) {
    parts.push('DCFT-AI (Scientific Foundation)');
  }
  
  if (systemsUsed.graphPipeline) {
    parts.push('Graph Pipeline (Fast Processing)');
  }
  
  if (systemsUsed.groq) {
    parts.push('Groq LLM (Intelligent Reasoning)');
  }
  
  return parts.join(' + ');
}

/**
 * دالة مساعدة: تنسيق النتيجة للعرض
 */
export function formatUnifiedResult(result: UnifiedAnalysisResult): {
  answer: string;
  details: any;
  performance: any;
} {
  const { language } = result.questionUnderstanding.context;
  
  // الإجابة الرئيسية
  let answer = '';
  
  if (result.directAnswer) {
    answer = result.directAnswer;
  } else if (result.analysis?.reasoning) {
    answer = result.analysis.reasoning;
  } else {
    answer = language === 'ar' 
      ? 'لم أتمكن من تحليل السؤال. يرجى إعادة الصياغة.'
      : 'Unable to analyze the question. Please rephrase.';
  }
  
  // التفاصيل
  const details = {
    questionType: result.questionUnderstanding.surface.questionType,
    detectedTopic: result.questionUnderstanding.surface.topic,
    detectedEntities: result.questionUnderstanding.surface.keywords,
    emotions: result.analysis?.emotions,
    indices: result.analysis?.indices,
    eventVector: result.analysis?.eventVector,
    confidence: 1.0,
  };
  
  // الأداء
  const performance = {
    totalTime: `${result.performance.totalProcessingTime}ms`,
    questionUnderstandingTime: `${result.performance.questionUnderstandingTime}ms`,
    analysisTime: result.performance.analysisTime 
      ? `${result.performance.analysisTime}ms`
      : 'N/A',
    systemsUsed: result.performance.systemsUsed,
  };
  
  return { answer, details, performance };
}

/**
 * دالة مساعدة: هل النتيجة جاهزة للعرض؟
 */
export function isResultReady(result: UnifiedAnalysisResult): boolean {
  return (
    result.directAnswer !== undefined ||
    result.analysis?.reasoning !== undefined ||
    result.analysis?.emotions !== undefined
  );
}

/**
 * دالة مساعدة: الحصول على رسالة الخطأ
 */
export function getErrorMessage(result: UnifiedAnalysisResult, language: 'ar' | 'en' = 'ar'): string | null {
  if (result.questionUnderstanding.surface.text.length < 3) {
    return language === 'ar'
      ? 'السؤال قصير جداً. يرجى التوضيح.'
      : 'Question is too short. Please clarify.';
  }
  
  if (!isResultReady(result)) {
    return language === 'ar'
      ? 'حدث خطأ في معالجة السؤال. يرجى المحاولة لاحقاً.'
      : 'An error occurred while processing the question. Please try again later.';
  }
  
  return null;
}
