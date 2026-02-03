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
}

export interface FluentResponse {
  // Main response sections
  summary: string;           // الخلاصة
  whySection: string;        // لماذا هذا المزاج؟
  causesSection: string;     // الأسباب الرئيسية
  meaningSection: string;    // ماذا يعني للمجتمع؟
  recommendationSection: string;  // التوصية
  
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

هيكل الرد:
- الخلاصة: جملة واحدة حاسمة تجيب السؤال
- لماذا: تفسير نفسي موجز
- الأسباب: 2-3 أسباب محددة من البيانات
- المعنى: ماذا يعني للمجتمع
- التوصية: نصيحة عملية واحدة

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

اكتب رداً طبيعياً وحاسماً.`
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
              }
            },
            required: ['summary', 'whySection', 'causesSection', 'meaningSection', 'recommendationSection'],
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
    
    return {
      summary: result.summary || '',
      whySection: result.whySection || '',
      causesSection: result.causesSection || '',
      meaningSection: result.meaningSection || '',
      recommendationSection: result.recommendationSection || '',
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
