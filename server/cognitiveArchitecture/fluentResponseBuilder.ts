/**
 * Fluent Response Builder - with Perception Layer (Phase 57)
 * 
 * Generates natural, flowing responses without fixed templates.
 * Uses deep perception analysis to understand context and emotion.
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
import {
  analyzePerception,
  determineResponseDirective,
  type PerceptionContext,
  type ResponseDirective
} from './perceptionLayer';

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
  cognitivePattern?: CognitiveOutput;
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
  previousContext?: string;
  analysisData?: any;
}

export interface FluentResponse {
  summary: string;
  whySection: string;
  causesSection: string;
  meaningSection: string;
  recommendationSection: string;
  cognitiveInsight?: string;
  innerQuestion?: string;
  cognitivePattern?: string;
  followUpQuestions: string[];
  confidence: number;
  dominantEmotion: string;
  emotionType: string;
}

/**
 * Build a fluent, natural response using Perception Layer
 * Phase 57: No more fixed templates - pure perception-driven responses
 */
export async function buildFluentResponse(input: FluentResponseInput): Promise<FluentResponse> {
  console.log('[FluentResponseBuilder] Building response for:', input.question.substring(0, 50));
  
  // Phase 57: Analyze perception instead of applying fixed template
  const perception = analyzePerception(
    input.question,
    input.previousContext || '',
    input.analysisData || input.decision
  );
  
  const directive = determineResponseDirective(
    perception,
    input.question,
    input.isFollowUp || false
  );
  
  console.log('[FluentResponseBuilder] Perception:', perception);
  console.log('[FluentResponseBuilder] Directive:', directive);
  
  // Validate context - ensure we're staying on the same topic
  if (directive.contextValidation.length > 0) {
    console.warn('[FluentResponseBuilder] Context warnings:', directive.contextValidation);
  }
  
  try {
    // Build dynamic instructions based on perception, not templates
    const dynamicInstructions = buildDynamicInstructions(perception, directive, input.isFollowUp || false);
    
    // Generate the response
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

${dynamicInstructions}

ممنوع:
- استخدام قوالب ثابتة مثل "متذبذب بين..."
- تكرار نفس الهيكل لكل سؤال
- الانتقال لموضوع مختلف عن السؤال الأصلي
- الكلام العام الذي ينطبق على أي موضوع`
        },
        {
          role: 'user',
          content: `السؤال: ${input.question}

الموضوع الأساسي: ${perception.topic}
العاطفة السائدة: ${perception.primaryEmotion}
الاستعجالية: ${perception.urgency}
مستوى الوعي: ${perception.awarenessLevel}

البيانات:
- الخوف: ${input.emotionData.fear}%
- الأمل: ${input.emotionData.hope}%
- الغضب: ${input.emotionData.anger}%
- المزاج العام (GMI): ${input.emotionData.gmi}%
- تم تحليل ${input.newsCount} خبر من ${input.sourcesCount} مصدر

التحليل النفسي:
الشعور السائد: ${input.decision.dominantEmotion}
السبب: ${input.decision.dominantEmotionReason}
النوع: ${input.decision.emotionType}

الأسباب المستخرجة:
${input.interpretedCauses.psychologicalCauses.join('\n')}

التداعيات الاجتماعية:
${input.interpretedCauses.socialImplications.join('\n')}

الوعي الجمعي: ${perception.collectiveConsciousness}
المجموعات المتأثرة: ${perception.affectedGroups.join(', ')}

اكتب رداً طبيعياً وحاسماً. ركز على: ${directive.focus}`
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
                description: 'لماذا هذا المزاج'
              },
              causesSection: { 
                type: 'string',
                description: 'الأسباب الرئيسية'
              },
              meaningSection: { 
                type: 'string',
                description: 'ماذا يعني للمجتمع'
              },
              recommendationSection: { 
                type: 'string',
                description: 'التوصية'
              },
              cognitiveInsight: {
                type: 'string',
                description: 'كيف يفكر الناس'
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
    
    return {
      summary: `تحليل ${perception.topic}: ${perception.primaryEmotion}`,
      whySection: perception.collectiveConsciousness,
      causesSection: perception.rootCause,
      meaningSection: `يؤثر على: ${perception.affectedGroups.join(', ')}`,
      recommendationSection: 'يتطلب تدخل عاجل',
      cognitiveInsight: input.cognitivePattern?.humanReasoning || '',
      innerQuestion: input.cognitivePattern?.innerQuestion || '',
      cognitivePattern: '',
      followUpQuestions: [],
      confidence: input.interpretedCauses.confidence,
      dominantEmotion: input.decision.dominantEmotion,
      emotionType: input.decision.emotionType
    };
  }
}

/**
 * Build dynamic instructions based on perception and directive
 * Not a fixed template - changes based on actual analysis
 */
function buildDynamicInstructions(
  perception: PerceptionContext,
  directive: ResponseDirective,
  isFollowUp: boolean
): string {
  let instructions = '';
  
  // Focus-based instructions
  switch (directive.focus) {
    case 'solution':
      instructions += `ركز على الحلول العملية والخطوات الملموسة.\n`;
      break;
    case 'warning':
      instructions += `اشرح المخاطر والتهديدات بوضوح.\n`;
      break;
    case 'hope':
      instructions += `ركز على الفرص والحلول الممكنة.\n`;
      break;
    case 'action':
      instructions += `اشرح ما يجب فعله الآن.\n`;
      break;
    default:
      instructions += `اشرح السياق بعمق.\n`;
  }
  
  // Tone-based instructions
  switch (directive.tone) {
    case 'urgent':
      instructions += `النبرة: عاجلة وحاسمة - هذا وضع حرج.\n`;
      break;
    case 'empathetic':
      instructions += `النبرة: متعاطفة وفاهمة للمشاعر.\n`;
      break;
    case 'advisory':
      instructions += `النبرة: استشارية وحكيمة.\n`;
      break;
    case 'analytical':
      instructions += `النبرة: تحليلية وموضوعية.\n`;
      break;
  }
  
  // Depth-based instructions
  if (directive.depth === 'brief') {
    instructions += `كن مختصراً جداً - جملتان كحد أقصى لكل قسم.\n`;
  } else if (directive.depth === 'moderate') {
    instructions += `كن موجزاً - فقرة واحدة لكل قسم.\n`;
  } else {
    instructions += `شرح عميق - فقرتان لكل قسم.\n`;
  }
  
  // Follow-up specific
  if (isFollowUp) {
    instructions += `هذا سؤال متابعة - لا تكرر المعلومات السابقة، ركز على الإجابة الجديدة.\n`;
  }
  
  // Context validation
  if (directive.contextValidation.length > 0) {
    instructions += `تحذيرات السياق:\n${directive.contextValidation.join('\n')}\n`;
  }
  
  return instructions;
}
