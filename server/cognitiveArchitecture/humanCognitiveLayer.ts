/**
 * Human Cognitive Layer
 * 
 * This layer answers: "How does a human THINK about this situation?"
 * Not just "What do they feel?" but "What cognitive pattern are they in?"
 * 
 * The difference:
 * - Fluent Response Builder = How to SAY it (linguistic output)
 * - Human Cognitive Layer = How to THINK about it (cognitive pattern)
 * 
 * Key insight:
 * "I want AmalSense to THINK like a human before it SPEAKS"
 * This is the difference between AI Product and Artificial Mind.
 * 
 * Architecture position:
 * Reality Data → Emotion Engine → Decision Engine → Human Cognitive Layer → Response
 */

import { invokeLLM } from '../_core/llm';
import { type InterpretedCauses, type DecisionResult } from './llmInterpreter';

/**
 * Human Cognitive Patterns
 * These are not just emotions - they are WAYS OF THINKING
 */
export type CognitivePattern = 
  | 'existential_anxiety'    // قلق وجودي - "ماذا سيحدث لنا؟"
  | 'moral_outrage'          // غضب أخلاقي - "هذا ظلم!"
  | 'realistic_hope'         // أمل واقعي - "يمكننا تجاوز هذا"
  | 'collective_denial'      // إنكار جماعي - "ليس بهذا السوء"
  | 'cognitive_confusion'    // حيرة معرفية - "لا نفهم ما يحدث"
  | 'cautious_anticipation'  // ترقب حذر - "ننتظر ونرى"
  | 'suppressed_despair'     // يأس مكتوم - "لا فائدة"
  | 'defensive_rationalization' // تبرير دفاعي - "هناك سبب وجيه"
  | 'collective_mobilization'   // تعبئة جماعية - "يجب أن نتحرك"
  | 'resigned_acceptance';      // قبول مستسلم - "هذا قدرنا"

/**
 * Detailed description of each cognitive pattern
 */
export const COGNITIVE_PATTERNS: Record<CognitivePattern, {
  nameAr: string;
  nameEn: string;
  description: string;
  innerQuestion: string;      // السؤال الداخلي الذي يسأله الإنسان
  thinkingStyle: string;      // أسلوب التفكير
  typicalResponses: string[]; // ردود الفعل النموذجية
  communicationTone: string;  // نبرة التواصل المناسبة
}> = {
  existential_anxiety: {
    nameAr: 'قلق وجودي',
    nameEn: 'Existential Anxiety',
    description: 'الناس يفكرون في المستقبل بقلق عميق، يتساءلون عن مصيرهم ومصير أطفالهم',
    innerQuestion: 'ماذا سيحدث لنا؟ هل سنكون بخير؟',
    thinkingStyle: 'تفكير مستقبلي، عدم يقين، بحث عن ضمانات',
    typicalResponses: ['تخزين الموارد', 'البحث عن بدائل', 'التخطيط للهجرة'],
    communicationTone: 'طمأنة مع واقعية، تقديم معلومات عن المستقبل'
  },
  moral_outrage: {
    nameAr: 'غضب أخلاقي',
    nameEn: 'Moral Outrage',
    description: 'الناس يشعرون بالظلم ويبحثون عن المسؤول، يريدون العدالة والمحاسبة',
    innerQuestion: 'من المسؤول عن هذا؟ لماذا لا يُحاسب أحد؟',
    thinkingStyle: 'تفكير في العدالة، تحديد المسؤولية، مطالبة بالتغيير',
    typicalResponses: ['احتجاجات', 'مطالبات', 'نقد السلطات'],
    communicationTone: 'تصديق الغضب، توجيهه نحو حلول بناءة'
  },
  realistic_hope: {
    nameAr: 'أمل واقعي',
    nameEn: 'Realistic Hope',
    description: 'الناس يرون إمكانية للتحسن ويبحثون عن طرق للمساهمة',
    innerQuestion: 'كيف يمكننا تحسين الوضع؟ ما الذي يمكنني فعله؟',
    thinkingStyle: 'تفكير حلولي، تفاؤل مشروط، بحث عن فرص',
    typicalResponses: ['مبادرات مجتمعية', 'تعاون', 'استثمار في المستقبل'],
    communicationTone: 'تشجيع مع خطوات عملية، تعزيز الإيجابية'
  },
  collective_denial: {
    nameAr: 'إنكار جماعي',
    nameEn: 'Collective Denial',
    description: 'الناس يقللون من خطورة الموقف كآلية دفاع نفسي',
    innerQuestion: 'هل الأمور فعلاً بهذا السوء؟ ربما نبالغ؟',
    thinkingStyle: 'تفكير دفاعي، تقليل المخاطر، مقارنة بالأسوأ',
    typicalResponses: ['تجاهل الأخبار', 'التركيز على الإيجابيات', 'مقارنة بدول أخرى'],
    communicationTone: 'لطيف لكن صادق، تقديم الحقائق تدريجياً'
  },
  cognitive_confusion: {
    nameAr: 'حيرة معرفية',
    nameEn: 'Cognitive Confusion',
    description: 'الناس لا يفهمون ما يحدث، معلومات متضاربة وغياب الوضوح',
    innerQuestion: 'ما الذي يحدث فعلاً؟ من نصدق؟',
    thinkingStyle: 'تفكير مشتت، بحث عن مصادر موثوقة، صعوبة اتخاذ قرار',
    typicalResponses: ['متابعة أخبار متعددة', 'سؤال الآخرين', 'تأجيل القرارات'],
    communicationTone: 'توضيح وتبسيط، تقديم معلومات منظمة'
  },
  cautious_anticipation: {
    nameAr: 'ترقب حذر',
    nameEn: 'Cautious Anticipation',
    description: 'الناس ينتظرون ليروا كيف ستتطور الأمور قبل اتخاذ موقف',
    innerQuestion: 'ماذا سيحدث بعد ذلك؟ هل يجب أن أتصرف الآن؟',
    thinkingStyle: 'تفكير تحليلي، انتظار مؤشرات، تجنب المخاطرة',
    typicalResponses: ['مراقبة الأحداث', 'تأجيل القرارات الكبيرة', 'الاستعداد للسيناريوهات'],
    communicationTone: 'تقديم سيناريوهات، مساعدة في التخطيط'
  },
  suppressed_despair: {
    nameAr: 'يأس مكتوم',
    nameEn: 'Suppressed Despair',
    description: 'الناس فقدوا الأمل لكنهم لا يعبرون عن ذلك علناً',
    innerQuestion: 'هل هناك فائدة من المحاولة؟ لماذا نهتم؟',
    thinkingStyle: 'تفكير سلبي مخفي، انسحاب، فقدان الدافع',
    typicalResponses: ['عدم المشاركة', 'سخرية', 'هجرة صامتة'],
    communicationTone: 'تعاطف عميق، تقديم أمل واقعي، عدم التقليل من المشاعر'
  },
  defensive_rationalization: {
    nameAr: 'تبرير دفاعي',
    nameEn: 'Defensive Rationalization',
    description: 'الناس يبحثون عن تفسيرات تبرر الوضع الحالي',
    innerQuestion: 'ربما هناك سبب وجيه لهذا؟ ربما لا نفهم الصورة الكاملة؟',
    thinkingStyle: 'تفكير تبريري، بحث عن أعذار، تجنب المواجهة',
    typicalResponses: ['دعم السلطات', 'تبرير القرارات', 'لوم عوامل خارجية'],
    communicationTone: 'احترام وجهة النظر مع تقديم معلومات إضافية'
  },
  collective_mobilization: {
    nameAr: 'تعبئة جماعية',
    nameEn: 'Collective Mobilization',
    description: 'الناس يشعرون بالحاجة للتحرك الجماعي والتغيير',
    innerQuestion: 'ماذا يمكننا أن نفعل معاً؟ كيف نغير هذا الواقع؟',
    thinkingStyle: 'تفكير جماعي، بحث عن حلفاء، تخطيط للعمل',
    typicalResponses: ['تنظيم مجتمعي', 'حملات', 'مبادرات جماعية'],
    communicationTone: 'تشجيع العمل الجماعي، تقديم خطوات عملية'
  },
  resigned_acceptance: {
    nameAr: 'قبول مستسلم',
    nameEn: 'Resigned Acceptance',
    description: 'الناس قبلوا الوضع كواقع لا يمكن تغييره',
    innerQuestion: 'هذا قدرنا، ماذا يمكننا أن نفعل؟',
    thinkingStyle: 'تفكير قدري، تكيف، تركيز على البقاء',
    typicalResponses: ['التكيف مع الوضع', 'تقليل التوقعات', 'التركيز على الحياة اليومية'],
    communicationTone: 'تفهم مع تقديم أمثلة على التغيير الممكن'
  }
};

/**
 * Input for cognitive pattern detection
 */
export interface CognitiveInput {
  question: string;
  interpretation: InterpretedCauses;
  decision: DecisionResult;
  emotionData: {
    fear: number;
    hope: number;
    anger: number;
    gmi: number;
  };
}

/**
 * Output of cognitive pattern detection
 */
export interface CognitiveOutput {
  // Primary cognitive pattern
  primaryPattern: CognitivePattern;
  
  // Secondary pattern (if mixed)
  secondaryPattern?: CognitivePattern;
  
  // Confidence in detection
  confidence: number;
  
  // The inner question people are asking
  innerQuestion: string;
  
  // How to frame the response
  responseFraming: {
    tone: string;
    approach: string;
    keyMessage: string;
  };
  
  // Human reasoning explanation
  humanReasoning: string;
}

/**
 * Detect the cognitive pattern from the data
 * This is the core function - it determines HOW people are THINKING
 */
export async function detectCognitivePattern(input: CognitiveInput): Promise<CognitiveOutput> {
  console.log('[HumanCognitiveLayer] Detecting cognitive pattern...');
  
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت عالم نفس اجتماعي متخصص في فهم الأنماط المعرفية البشرية.

مهمتك: تحديد كيف يُفكر الناس (وليس فقط ماذا يشعرون).

الأنماط المعرفية المتاحة:
1. existential_anxiety (قلق وجودي) - "ماذا سيحدث لنا؟"
2. moral_outrage (غضب أخلاقي) - "هذا ظلم!"
3. realistic_hope (أمل واقعي) - "يمكننا تجاوز هذا"
4. collective_denial (إنكار جماعي) - "ليس بهذا السوء"
5. cognitive_confusion (حيرة معرفية) - "لا نفهم ما يحدث"
6. cautious_anticipation (ترقب حذر) - "ننتظر ونرى"
7. suppressed_despair (يأس مكتوم) - "لا فائدة"
8. defensive_rationalization (تبرير دفاعي) - "هناك سبب وجيه"
9. collective_mobilization (تعبئة جماعية) - "يجب أن نتحرك"
10. resigned_acceptance (قبول مستسلم) - "هذا قدرنا"

قواعد التحديد:
- الخوف العالي + عدم يقين = قلق وجودي
- الغضب العالي + ظلم = غضب أخلاقي
- الأمل العالي + حلول = أمل واقعي
- الخوف المنخفض رغم الأزمة = إنكار جماعي
- معلومات متضاربة = حيرة معرفية
- انتظار + حذر = ترقب حذر
- أمل منخفض جداً = يأس مكتوم
- دعم السلطات رغم المشاكل = تبرير دفاعي
- دعوات للعمل = تعبئة جماعية
- قبول الوضع = قبول مستسلم

أجب بـ JSON فقط.`
        },
        {
          role: 'user',
          content: `السؤال: ${input.question}

البيانات العاطفية:
- الخوف: ${input.emotionData.fear}%
- الأمل: ${input.emotionData.hope}%
- الغضب: ${input.emotionData.anger}%
- المزاج العام: ${input.emotionData.gmi}%

التحليل:
- الشعور السائد: ${input.decision.dominantEmotion}
- السبب: ${input.decision.dominantEmotionReason}
- النوع: ${input.decision.emotionType}
- التقييم: ${input.decision.assessment}

الأسباب النفسية:
${input.interpretation.psychologicalCauses.join('\n')}

حدد:
1. النمط المعرفي الأساسي
2. السؤال الداخلي الذي يسأله الناس
3. كيف يجب أن نصيغ الرد`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'cognitive_pattern',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              primaryPattern: { 
                type: 'string',
                enum: ['existential_anxiety', 'moral_outrage', 'realistic_hope', 'collective_denial', 'cognitive_confusion', 'cautious_anticipation', 'suppressed_despair', 'defensive_rationalization', 'collective_mobilization', 'resigned_acceptance']
              },
              secondaryPattern: { 
                type: 'string',
                enum: ['existential_anxiety', 'moral_outrage', 'realistic_hope', 'collective_denial', 'cognitive_confusion', 'cautious_anticipation', 'suppressed_despair', 'defensive_rationalization', 'collective_mobilization', 'resigned_acceptance', 'none']
              },
              confidence: { type: 'number' },
              innerQuestion: { type: 'string' },
              responseTone: { type: 'string' },
              responseApproach: { type: 'string' },
              keyMessage: { type: 'string' },
              humanReasoning: { type: 'string' }
            },
            required: ['primaryPattern', 'secondaryPattern', 'confidence', 'innerQuestion', 'responseTone', 'responseApproach', 'keyMessage', 'humanReasoning'],
            additionalProperties: false
          }
        }
      }
    });
    
    const content = response.choices[0].message.content;
    const result = JSON.parse(typeof content === 'string' ? content : '{}');
    
    const primaryPattern = result.primaryPattern as CognitivePattern;
    const patternInfo = COGNITIVE_PATTERNS[primaryPattern];
    
    console.log('[HumanCognitiveLayer] Pattern detected:', {
      primary: primaryPattern,
      secondary: result.secondaryPattern,
      confidence: result.confidence
    });
    
    return {
      primaryPattern,
      secondaryPattern: result.secondaryPattern !== 'none' ? result.secondaryPattern as CognitivePattern : undefined,
      confidence: result.confidence || 0.7,
      innerQuestion: result.innerQuestion || patternInfo?.innerQuestion || '',
      responseFraming: {
        tone: result.responseTone || patternInfo?.communicationTone || '',
        approach: result.responseApproach || '',
        keyMessage: result.keyMessage || ''
      },
      humanReasoning: result.humanReasoning || ''
    };
    
  } catch (error) {
    console.error('[HumanCognitiveLayer] Detection failed:', error);
    
    // Fallback based on emotion data
    return detectPatternFromEmotions(input.emotionData);
  }
}

/**
 * Fallback: Detect pattern from emotion data alone
 */
function detectPatternFromEmotions(emotionData: { fear: number; hope: number; anger: number; gmi: number }): CognitiveOutput {
  let pattern: CognitivePattern = 'cognitive_confusion';
  
  // High fear + low hope = existential anxiety
  if (emotionData.fear > 60 && emotionData.hope < 40) {
    pattern = 'existential_anxiety';
  }
  // High anger = moral outrage
  else if (emotionData.anger > 60) {
    pattern = 'moral_outrage';
  }
  // High hope = realistic hope
  else if (emotionData.hope > 60) {
    pattern = 'realistic_hope';
  }
  // Low fear despite negative GMI = denial
  else if (emotionData.fear < 30 && emotionData.gmi < -20) {
    pattern = 'collective_denial';
  }
  // Very low hope = suppressed despair
  else if (emotionData.hope < 20 && emotionData.gmi < -30) {
    pattern = 'suppressed_despair';
  }
  // Balanced = cautious anticipation
  else if (Math.abs(emotionData.fear - emotionData.hope) < 20) {
    pattern = 'cautious_anticipation';
  }
  
  const patternInfo = COGNITIVE_PATTERNS[pattern];
  
  return {
    primaryPattern: pattern,
    confidence: 0.5,
    innerQuestion: patternInfo.innerQuestion,
    responseFraming: {
      tone: patternInfo.communicationTone,
      approach: patternInfo.thinkingStyle,
      keyMessage: patternInfo.description
    },
    humanReasoning: `بناءً على البيانات العاطفية، يبدو أن الناس في حالة ${patternInfo.nameAr}`
  };
}

/**
 * Get the pattern info for display
 */
export function getPatternInfo(pattern: CognitivePattern) {
  return COGNITIVE_PATTERNS[pattern];
}

/**
 * Format cognitive insight for the response
 */
export function formatCognitiveInsight(output: CognitiveOutput): string {
  const patternInfo = COGNITIVE_PATTERNS[output.primaryPattern];
  
  let insight = `**النمط المعرفي السائد:** ${patternInfo.nameAr}\n\n`;
  insight += `**السؤال الذي يسأله الناس:** "${output.innerQuestion}"\n\n`;
  insight += `**كيف يفكرون:** ${output.humanReasoning}`;
  
  if (output.secondaryPattern) {
    const secondaryInfo = COGNITIVE_PATTERNS[output.secondaryPattern];
    insight += `\n\n**نمط ثانوي:** ${secondaryInfo.nameAr}`;
  }
  
  return insight;
}
