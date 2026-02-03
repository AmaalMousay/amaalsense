/**
 * Fluent Response Builder
 * 
 * Generates natural, flowing responses without templates.
 * This is the "voice" of AmalSense - it speaks like a wise analyst, not a robot.
 * 
 * Problem it solves:
 * - Old system: "المزاج متذبذب بين الخوف والأمل" (template)
 * - New system: Natural, specific response based on actual data
 */

import { invokeLLM } from '../_core/llm';
import { 
  type InterpretedCauses, 
  type DecisionResult,
  generateFollowUpQuestions 
} from './llmInterpreter';
import {
  type CognitiveOutput,
  COGNITIVE_PATTERNS
} from './humanCognitiveLayer';

export interface FluentResponseInput {
  question: string;
  interpretedCauses: InterpretedCauses;
  decision: DecisionResult;
  emotionData: {
    fear: number;
    hope: number;
    anger: number;
    gmi: number;
    cfi: number;
    hri: number;
  };
  newsCount: number;
  sourcesCount: number;
  cognitivePattern?: CognitiveOutput;  // Human cognitive pattern
  // Phase 54 - المعلمات الجديدة للرد الديناميكي
  isFollowUp?: boolean;
  questionNumber?: number;
  responseStructure?: {
    format: string;
    maxLength: 'short' | 'medium' | 'long';
    sections: Array<{ name: string; required: boolean; order: number }>;
  };
  sessionContext?: {
    country: string;
    domain: string;
    topic: string;
  };
}

export interface FluentResponse {
  // Main response sections
  summary: string;           // الخلاصة
  whySection: string;        // لماذا هذا المزاج؟
  causesSection: string;     // الأسباب الرئيسية
  meaningSection: string;    // ماذا يعني للمجتمع؟
  recommendationSection: string;  // التوصية
  
  // NEW: Human cognitive insight
  cognitiveInsight?: string;  // كيف يفكر الناس
  innerQuestion?: string;     // السؤال الداخلي
  cognitivePattern?: string;  // النمط المعرفي
  
  // Follow-up questions (3 specific ones)
  followUpQuestions: string[];
  
  // Metadata
  confidence: number;
  dominantEmotion: string;
  emotionType: string;
}

/**
 * Build a fluent, natural response
 * Uses LLM to generate the entire response - no templates!
 */
export async function buildFluentResponse(input: FluentResponseInput): Promise<FluentResponse> {
  console.log('[FluentResponseBuilder] Building response for:', input.question.substring(0, 50));
  console.log('[FluentResponseBuilder] isFollowUp:', input.isFollowUp, 'questionNumber:', input.questionNumber);
  
  // تحديد هيكل الرد حسب نوع السؤال
  const isFollowUp = input.isFollowUp || false;
  const maxLength = input.responseStructure?.maxLength || 'long';
  
  // تعليمات مختلفة حسب نوع السؤال
  let structureInstructions = '';
  if (isFollowUp) {
    if (maxLength === 'short') {
      structureInstructions = `
هذا سؤال متابعة. كن مختصراً جداً:
- الخلاصة: جملة واحدة فقط
- التوصية: جملة واحدة فقط
لا تكرر المعلومات السابقة. أجب السؤال مباشرة.`;
    } else if (maxLength === 'medium') {
      structureInstructions = `
هذا سؤال متابعة. كن موجزاً:
- الخلاصة: جملة واحدة
- لماذا: فقرة قصيرة
- التوصية: جملة واحدة
لا تكرر المعلومات السابقة. ركز على الإجابة المباشرة.`;
    }
  } else {
    structureInstructions = `
هيكل الرد الكامل:
- الخلاصة: جملة واحدة حاسمة تجيب السؤال
- لماذا: تفسير نفسي موجز
- الأسباب: 2-3 أسباب محددة من البيانات
- المعنى: ماذا يعني للمجتمع
- كيف يفكرون: النمط المعرفي والسؤال الداخلي
- التوصية: نصيحة عملية واحدة`;
  }
  
  try {
    // Generate the main response
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت AmalSense، محلل الوعي الجمعي. تتحدث بطلاقة وحكمة.

أسلوبك:
1. مباشر وحاسم - لا تتردد
2. تستند للبيانات - اذكر الأرقام والمصادر
3. تفسر نفسياً - لا تسرد فقط
4. تقدم توصيات عملية
5. تتحدث بالعربية الفصحى السلسة
6. تفهم كيف يفكر الناس (النمط المعرفي)
${structureInstructions}

ممنوع:
- "متذبذب بين..." (إلا إذا البيانات متساوية فعلاً)
- "الحيرة طبيعية" (ليست توصية)
- سرد العناوين كما هي
- كلام عام ينطبق على أي موضوع`
        },
        {
          role: 'user',
          content: `السؤال: ${input.question}

البيانات:
- الخوف: ${input.emotionData.fear}%
- الأمل: ${input.emotionData.hope}%
- الغضب: ${input.emotionData.anger}%
- المزاج العام (GMI): ${input.emotionData.gmi}%
- تم تحليل ${input.newsCount} خبر من ${input.sourcesCount} مصدر

التحليل النفسي:
الشعور السائد: ${input.decision.dominantEmotion}
السبب: ${input.decision.dominantEmotionReason}
النوع: ${input.decision.emotionType === 'social' ? 'اجتماعي' : input.decision.emotionType === 'political' ? 'سياسي' : input.decision.emotionType === 'economic' ? 'اقتصادي' : 'مختلط'}
التبرير: ${input.decision.emotionTypeReason}

الأسباب المستخرجة من الأخبار:
${input.interpretedCauses.psychologicalCauses.join('\n')}

التداعيات الاجتماعية:
${input.interpretedCauses.socialImplications.join('\n')}

التقييم: ${input.decision.assessment}
مستوى الخطورة: ${input.decision.riskLevel}

التوصيات:
${input.decision.recommendations.join('\n')}

${input.cognitivePattern ? `النمط المعرفي: ${COGNITIVE_PATTERNS[input.cognitivePattern.primaryPattern]?.nameAr || ''}
السؤال الداخلي: ${input.cognitivePattern.innerQuestion}
كيف يفكرون: ${input.cognitivePattern.humanReasoning}` : ''}

اكتب رداً طبيعياً وحاسماً. اذكر النمط المعرفي والسؤال الداخلي الذي يسأله الناس.`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'fluent_response',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              summary: { 
                type: 'string',
                description: 'الخلاصة - جملة واحدة حاسمة'
              },
              whySection: { 
                type: 'string',
                description: 'لماذا هذا المزاج - تفسير موجز'
              },
              causesSection: { 
                type: 'string',
                description: 'الأسباب الرئيسية - 2-3 نقاط'
              },
              meaningSection: { 
                type: 'string',
                description: 'ماذا يعني للمجتمع'
              },
              recommendationSection: { 
                type: 'string',
                description: 'التوصية - نصيحة عملية'
              },
              cognitiveInsight: {
                type: 'string',
                description: 'كيف يفكر الناس - النمط المعرفي والسؤال الداخلي'
              }
            },
            required: ['summary', 'whySection', 'causesSection', 'meaningSection', 'recommendationSection', 'cognitiveInsight'],
            additionalProperties: false
          }
        }
      }
    });
    
    const content = response.choices[0].message.content;
    const result = JSON.parse(typeof content === 'string' ? content : '{}');
    
    // Generate follow-up questions
    const followUpQuestions = await generateFollowUpQuestions(
      input.question,
      input.interpretedCauses,
      input.decision
    );
    
    console.log('[FluentResponseBuilder] Response built successfully');
    
    // Get cognitive pattern info
    const patternInfo = input.cognitivePattern 
      ? COGNITIVE_PATTERNS[input.cognitivePattern.primaryPattern] 
      : null;
    
    return {
      summary: result.summary || '',
      whySection: result.whySection || '',
      causesSection: result.causesSection || '',
      meaningSection: result.meaningSection || '',
      recommendationSection: result.recommendationSection || '',
      cognitiveInsight: result.cognitiveInsight || input.cognitivePattern?.humanReasoning || '',
      innerQuestion: input.cognitivePattern?.innerQuestion || '',
      cognitivePattern: patternInfo?.nameAr || '',
      followUpQuestions,
      confidence: input.interpretedCauses.confidence,
      dominantEmotion: input.decision.dominantEmotion,
      emotionType: input.decision.emotionType
    };
    
  } catch (error) {
    console.error('[FluentResponseBuilder] Failed to build response:', error);
    
    // Fallback response
    return {
      summary: `تحليل ${input.question.substring(0, 30)}...`,
      whySection: input.decision.dominantEmotionReason || 'جاري التحليل',
      causesSection: input.interpretedCauses.psychologicalCauses.join('. ') || 'لا تتوفر بيانات كافية',
      meaningSection: input.interpretedCauses.socialImplications.join('. ') || '',
      recommendationSection: input.decision.recommendations[0] || 'راقب التطورات',
      followUpQuestions: [
        'ما تأثير ذلك على المجتمع؟',
        'ما التوقعات المستقبلية؟',
        'ما الحلول المقترحة؟'
      ],
      confidence: 0.3,
      dominantEmotion: input.decision.dominantEmotion,
      emotionType: input.decision.emotionType
    };
  }
}

/**
 * Format the fluent response for display
 */
export function formatFluentResponse(response: FluentResponse): string {
  const parts: string[] = [];
  
  // Summary
  parts.push(`**الخلاصة:** ${response.summary}`);
  
  // Why section
  if (response.whySection) {
    parts.push(`\n**لماذا هذا المزاج؟** ${response.whySection}`);
  }
  
  // Causes section
  if (response.causesSection) {
    parts.push(`\n**الأسباب الرئيسية:**\n${response.causesSection}`);
  }
  
  // Meaning section
  if (response.meaningSection) {
    parts.push(`\n**ماذا يعني هذا للمجتمع؟** ${response.meaningSection}`);
  }
  
  // NEW: Cognitive insight - How people THINK
  if (response.cognitiveInsight || response.cognitivePattern) {
    parts.push(`\n**كيف يفكر الناس؟**`);
    if (response.cognitivePattern) {
      parts.push(`النمط المعرفي: ${response.cognitivePattern}`);
    }
    if (response.innerQuestion) {
      parts.push(`السؤال الداخلي: "${response.innerQuestion}"`);
    }
    if (response.cognitiveInsight) {
      parts.push(response.cognitiveInsight);
    }
  }
  
  // Recommendation
  if (response.recommendationSection) {
    parts.push(`\n**التوصية:** ${response.recommendationSection}`);
  }
  
  // Follow-up questions
  if (response.followUpQuestions.length > 0) {
    parts.push(`\n---\n**أسئلة للاستكشاف:**`);
    response.followUpQuestions.forEach((q, i) => {
      parts.push(`${i + 1}. ${q}`);
    });
  }
  
  return parts.join('\n');
}
