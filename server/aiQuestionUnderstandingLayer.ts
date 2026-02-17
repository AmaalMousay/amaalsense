/**
 * AI-Powered Question Understanding Layer (Layer 11)
 * 
 * استبدال القواعس بنموذج AI ذكي (Groq 8B)
 * يفهم السؤال بعمق ويكتشف الأخطاء والسياق
 */

import { invokeGroqLLM } from './groqIntegration';
import { z } from 'zod';

/**
 * نتيجة فهم السؤال بـ AI
 */
export interface AIQuestionUnderstanding {
  // نوع السؤال
  primaryType: 'factual' | 'causal' | 'predictive' | 'comparative' | 
              'emotional' | 'recommendation' | 'opinion' | 'definition' | 'complex';
  secondaryType?: string;
  
  // الثقة
  confidence: number; // 0-100
  
  // الأخطاء المعلوماتية
  hasFactualError: boolean;
  errorDescription?: string;
  correctFacts?: string;
  
  // المحتوى
  topic: string;
  entities: {
    countries: string[];
    topics: string[];
    people: string[];
    organizations: string[];
  };
  
  // اللغة
  language: 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja';
  dialect?: 'egyptian' | 'saudi' | 'libyan' | 'moroccan' | 'general' | 'none';
  responseLanguage: 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja';
  
  // التعقيد
  complexity: 'simple' | 'medium' | 'complex';
  subQuestions?: string[]; // إذا كان complex
  
  // استراتيجية المعالجة
  strategy: {
    useDCFT: boolean;
    useEngines: ('topic' | 'emotion' | 'region' | 'impact')[];
    useGroq70B: boolean;
    correctFirst: boolean;
    priority: 'speed' | 'accuracy';
  };
  
  // شرح الفهم
  reasoning: string;
}

/**
 * System prompt للنموذج
 */
const SYSTEM_PROMPT = `أنت خبير في فهم الأسئلة وتحليلها في منصة AmalSense.
مهمتك: تحليل السؤال وإرجاع JSON فقط - لا شيء آخر.

تعليمات صارمة:
1. لا تحلل السؤال، فقط افهمه
2. اكتشف الأخطاء المعلوماتية (مثل: "سيف الإسلام اغتيل" - هذا خطأ)
3. حدد نوع السؤال من القائمة
4. استخرج الكيانات (دول، مواضيع، أشخاص، منظمات)
5. حدد اللغة واللهجة
6. اقترح استراتيجية المعالجة

أنواع الأسئلة:
- factual: سؤال عن حقيقة (متى، أين، كم)
- causal: سؤال عن سبب (ليش، لماذا)
- predictive: سؤال عن توقع (ماذا سيحدث)
- comparative: سؤال عن مقارنة (الفرق بين)
- emotional: سؤال عن مشاعر (كيف يشعر)
- recommendation: سؤال عن نصيحة (ماذا أفعل)
- opinion: سؤال عن رأي (ما رأيك)
- definition: سؤال عن تعريف (ما معنى)
- complex: سؤال مركب (أكثر من نوع)

أرجع JSON فقط - بدون نص إضافي.`;

/**
 * Groq 8B للفهم السريع والدقيق
 */
export async function understandQuestionWithAI(question: string): Promise<AIQuestionUnderstanding> {
  try {
    console.log('[AIQuestionUnderstanding] Processing:', question);
    
    const prompt = `السؤال: "${question}"

حلل هذا السؤال وأرجع JSON بهذا الشكل فقط (بدون أي نص إضافي):
{
  "primaryType": "emotional|factual|causal|predictive|comparative|recommendation|opinion|definition|complex",
  "secondaryType": "optional",
  "confidence": 85,
  "hasFactualError": false,
  "errorDescription": "optional",
  "correctFacts": "optional",
  "topic": "الموضوع الرئيسي",
  "entities": {
    "countries": ["مصر", "السعودية"],
    "topics": ["الاقتصاد", "السياسة"],
    "people": ["سيف الإسلام"],
    "organizations": ["البنك المركزي"]
  },
  "language": "ar|en|fr|es|de|zh|ja",
  "dialect": "egyptian|saudi|libyan|moroccan|general|none",
  "responseLanguage": "ar|en",
  "complexity": "simple|medium|complex",
  "subQuestions": ["optional"],
  "strategy": {
    "useDCFT": true,
    "useEngines": ["emotion", "topic"],
    "useGroq70B": true,
    "correctFirst": false,
    "priority": "accuracy"
  },
  "reasoning": "شرح قصير للفهم"
}`;

    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // منخفضة للدقة
      maxTokens: 1000,
      model: 'llama-3.1-8b-instant', // النموذج السريع
    });

    const content = response.content || response.text || '';
    console.log('[AIQuestionUnderstanding] Raw response:', content);

    // استخراج JSON من الرد
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[AIQuestionUnderstanding] No JSON found in response');
      return getDefaultUnderstanding(question);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // تحقق من الحقول المطلوبة
    const understanding: AIQuestionUnderstanding = {
      primaryType: parsed.primaryType || 'emotional',
      secondaryType: parsed.secondaryType,
      confidence: Math.min(parsed.confidence || 70, 100),
      hasFactualError: parsed.hasFactualError || false,
      errorDescription: parsed.errorDescription,
      correctFacts: parsed.correctFacts,
      topic: parsed.topic || 'General',
      entities: {
        countries: parsed.entities?.countries || [],
        topics: parsed.entities?.topics || [],
        people: parsed.entities?.people || [],
        organizations: parsed.entities?.organizations || [],
      },
      language: parsed.language || 'ar',
      dialect: parsed.dialect,
      responseLanguage: parsed.responseLanguage || parsed.language || 'ar',
      complexity: parsed.complexity || 'simple',
      subQuestions: parsed.subQuestions,
      strategy: {
        useDCFT: parsed.strategy?.useDCFT !== false,
        useEngines: parsed.strategy?.useEngines || ['emotion', 'topic'],
        useGroq70B: parsed.strategy?.useGroq70B !== false,
        correctFirst: parsed.strategy?.correctFirst || false,
        priority: parsed.strategy?.priority || 'accuracy',
      },
      reasoning: parsed.reasoning || 'AI-powered understanding',
    };

    console.log('[AIQuestionUnderstanding] Result:', {
      type: understanding.primaryType,
      confidence: understanding.confidence,
      hasError: understanding.hasFactualError,
      language: understanding.language,
    });

    return understanding;
  } catch (error) {
    console.error('[AIQuestionUnderstanding] Error:', error);
    return getDefaultUnderstanding(question);
  }
}

/**
 * قيم افتراضية آمنة عند فشل AI
 */
function getDefaultUnderstanding(question: string): AIQuestionUnderstanding {
  const isArabic = /[\u0600-\u06FF]/.test(question);
  const lowerQuestion = question.toLowerCase();
  
  // كشف بسيط للنوع
  let primaryType: AIQuestionUnderstanding['primaryType'] = 'emotional';
  if (lowerQuestion.includes('كم') || lowerQuestion.includes('how many')) {
    primaryType = 'factual';
  } else if (lowerQuestion.includes('لماذا') || lowerQuestion.includes('why')) {
    primaryType = 'causal';
  } else if (lowerQuestion.includes('ماذا سيحدث') || lowerQuestion.includes('will')) {
    primaryType = 'predictive';
  }

  return {
    primaryType,
    confidence: 50,
    hasFactualError: false,
    topic: 'General',
    entities: {
      countries: [],
      topics: [],
      people: [],
      organizations: [],
    },
    language: isArabic ? 'ar' : 'en',
    responseLanguage: isArabic ? 'ar' : 'en',
    complexity: 'simple',
    strategy: {
      useDCFT: true,
      useEngines: ['emotion', 'topic'],
      useGroq70B: true,
      correctFirst: false,
      priority: 'accuracy',
    },
    reasoning: 'Default understanding - AI failed',
  };
}

/**
 * تحسين الفهم بناءً على السياق السابق
 */
export async function enhanceUnderstandingWithContext(
  question: string,
  previousQuestions: string[] = []
): Promise<AIQuestionUnderstanding> {
  // إذا كان هناك أسئلة سابقة، استخدمها كسياق
  let contextPrompt = '';
  if (previousQuestions.length > 0) {
    contextPrompt = `\n\nالأسئلة السابقة للمستخدم:\n${previousQuestions.slice(-3).join('\n')}\n\nاستخدم هذا السياق لفهم أفضل للسؤال الحالي.`;
  }

  // استدعاء الفهم الأساسي
  const understanding = await understandQuestionWithAI(question + contextPrompt);
  
  return understanding;
}

/**
 * كشف الأخطاء المعلوماتية المحددة
 */
export async function detectFactualErrors(question: string): Promise<{
  hasError: boolean;
  errors: Array<{
    claim: string;
    status: 'false' | 'unverified' | 'true';
    explanation: string;
  }>;
}> {
  try {
    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: `أنت خبير في التحقق من الحقائق. حلل السؤال واكتشف أي ادعاءات خاطئة أو غير مؤكدة.
أرجع JSON فقط بهذا الشكل:
{
  "hasError": true/false,
  "errors": [
    {"claim": "الادعاء", "status": "false|unverified|true", "explanation": "التفسير"}
  ]
}`,
        },
        {
          role: 'user',
          content: `تحقق من الحقائق في هذا السؤال: "${question}"`,
        },
      ],
      temperature: 0.2,
      maxTokens: 500,
      model: 'llama-3.1-8b-instant',
    });

    const content = response.content || response.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { hasError: false, errors: [] };
  } catch (error) {
    console.error('[FactualErrorDetection] Error:', error);
    return { hasError: false, errors: [] };
  }
}
