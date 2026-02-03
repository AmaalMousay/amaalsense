/**
 * LLM Interpreter
 * 
 * Transforms raw news data into psychological and social insights.
 * This is the "understanding" layer - it doesn't just read headlines,
 * it interprets what they mean for collective emotions.
 * 
 * Problem it solves:
 * - Old system: "2 أخبار تتحدث عن: Israel-Hamas war" (debug log)
 * - New system: "الخوف مرتفع لأن الأخبار تركز على غرق المهاجرين وشبكات التهريب"
 */

import { invokeLLM } from '../_core/llm';

export interface NewsItem {
  title: string;
  description?: string;
  source: string;
}

export interface InterpretedCauses {
  // Main psychological causes extracted from news
  psychologicalCauses: string[];
  
  // Social implications
  socialImplications: string[];
  
  // Key themes identified
  themes: string[];
  
  // Emotional tone of the news
  emotionalTone: 'fear' | 'anger' | 'hope' | 'sadness' | 'mixed' | 'neutral';
  
  // Confidence in interpretation
  confidence: number;
  
  // Summary of what the news reveals
  summary: string;
}

export interface DecisionResult {
  // The dominant emotion with reasoning
  dominantEmotion: string;
  dominantEmotionReason: string;
  
  // Is it social or political?
  emotionType: 'social' | 'political' | 'economic' | 'mixed';
  emotionTypeReason: string;
  
  // Overall assessment
  assessment: string;
  
  // Risk level
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Recommendations
  recommendations: string[];
}

/**
 * Interpret news headlines to extract psychological causes
 * Uses LLM to understand what the news means emotionally
 */
export async function interpretNewsCauses(
  news: NewsItem[],
  question: string,
  emotionData?: { fear: number; hope: number; anger: number }
): Promise<InterpretedCauses> {
  console.log('[LLMInterpreter] Interpreting', news.length, 'news items');
  
  if (news.length === 0) {
    return {
      psychologicalCauses: ['لا تتوفر بيانات كافية للتحليل'],
      socialImplications: [],
      themes: [],
      emotionalTone: 'neutral',
      confidence: 0.2,
      summary: 'لم يتم العثور على أخبار متعلقة بالموضوع'
    };
  }
  
  // Prepare news for LLM
  const newsText = news.slice(0, 15).map((n, i) => 
    `${i + 1}. ${n.title}${n.description ? ` - ${n.description}` : ''} (${n.source})`
  ).join('\n');
  
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت محلل نفسي اجتماعي متخصص في فهم المشاعر الجماعية.

مهمتك: تحليل الأخبار واستخراج الأسباب النفسية والاجتماعية للمشاعر.

قواعد صارمة:
1. استخرج الأسباب من الأخبار مباشرة - لا تخترع أسباباً
2. اربط الأخبار بالمشاعر (خوف، غضب، أمل، حزن)
3. اشرح ماذا تعني الأخبار للمجتمع
4. كن محدداً - اذكر ما ورد في الأخبار
5. لا تسرد العناوين - فسرها نفسياً

مثال جيد:
- "الخوف مرتفع لأن الأخبار تركز على حوادث الغرق وضحايا الهجرة"
- "الغضب موجه للسلطات بسبب تقارير عن إهمال الحدود"

مثال سيء:
- "2 أخبار تتحدث عن الهجرة" (هذا سرد وليس تفسير)

أجب بـ JSON فقط.`
        },
        {
          role: 'user',
          content: `السؤال: ${question}

الأخبار المتعلقة:
${newsText}

${emotionData ? `بيانات المشاعر: خوف ${emotionData.fear}%، أمل ${emotionData.hope}%، غضب ${emotionData.anger}%` : ''}

استخرج:
1. الأسباب النفسية للمشاعر (من الأخبار)
2. التداعيات الاجتماعية
3. المواضيع الرئيسية
4. النبرة العاطفية السائدة
5. ملخص موجز`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'news_interpretation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              psychologicalCauses: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'أسباب نفسية مستخرجة من الأخبار'
              },
              socialImplications: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'تداعيات اجتماعية'
              },
              themes: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'المواضيع الرئيسية'
              },
              emotionalTone: { 
                type: 'string',
                enum: ['fear', 'anger', 'hope', 'sadness', 'mixed', 'neutral']
              },
              confidence: { 
                type: 'number',
                description: 'مستوى الثقة من 0 إلى 1'
              },
              summary: { 
                type: 'string',
                description: 'ملخص موجز لما تكشفه الأخبار'
              }
            },
            required: ['psychologicalCauses', 'socialImplications', 'themes', 'emotionalTone', 'confidence', 'summary'],
            additionalProperties: false
          }
        }
      }
    });
    
    const content = response.choices[0].message.content;
    const result = JSON.parse(typeof content === 'string' ? content : '{}');
    
    console.log('[LLMInterpreter] Interpretation complete:', {
      causesCount: result.psychologicalCauses?.length,
      tone: result.emotionalTone,
      confidence: result.confidence
    });
    
    return {
      psychologicalCauses: result.psychologicalCauses || [],
      socialImplications: result.socialImplications || [],
      themes: result.themes || [],
      emotionalTone: result.emotionalTone || 'neutral',
      confidence: result.confidence || 0.5,
      summary: result.summary || ''
    };
    
  } catch (error) {
    console.error('[LLMInterpreter] Interpretation failed:', error);
    return {
      psychologicalCauses: ['تعذر تحليل الأخبار'],
      socialImplications: [],
      themes: [],
      emotionalTone: 'neutral',
      confidence: 0.2,
      summary: 'حدث خطأ أثناء التحليل'
    };
  }
}

/**
 * Make a decision about the emotional state
 * This is the "Decision Engine" - it decides and doesn't hesitate
 */
export async function makeEmotionalDecision(
  question: string,
  interpretedCauses: InterpretedCauses,
  emotionData: { fear: number; hope: number; anger: number; gmi: number }
): Promise<DecisionResult> {
  console.log('[LLMInterpreter] Making decision...');
  
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت عقل تحليلي حاسم. مهمتك اتخاذ قرار واضح بناءً على البيانات.

قواعد صارمة:
1. لا تتردد - اختر إجابة واحدة واضحة
2. برر قرارك بناءً على البيانات
3. لا تقل "متذبذب" أو "مختلط" إلا إذا كانت البيانات متساوية فعلاً
4. كن حاسماً ومباشراً

مثال جيد:
- "الخوف الاجتماعي هو السائد لأن 70% من الأخبار تتحدث عن مخاطر شخصية"

مثال سيء:
- "المشاعر متذبذبة بين الخوف والأمل" (هذا تهرب من القرار)`
        },
        {
          role: 'user',
          content: `السؤال: ${question}

البيانات:
- الخوف: ${emotionData.fear}%
- الأمل: ${emotionData.hope}%
- الغضب: ${emotionData.anger}%
- المزاج العام: ${emotionData.gmi}%

الأسباب المستخرجة:
${interpretedCauses.psychologicalCauses.join('\n')}

التداعيات:
${interpretedCauses.socialImplications.join('\n')}

النبرة السائدة: ${interpretedCauses.emotionalTone}

قرر:
1. ما هو الشعور السائد؟ (خوف، غضب، أمل، حزن)
2. هل هو اجتماعي أم سياسي أم اقتصادي؟
3. ما مستوى الخطورة؟
4. ما التوصيات؟`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'emotional_decision',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              dominantEmotion: { type: 'string' },
              dominantEmotionReason: { type: 'string' },
              emotionType: { 
                type: 'string',
                enum: ['social', 'political', 'economic', 'mixed']
              },
              emotionTypeReason: { type: 'string' },
              assessment: { type: 'string' },
              riskLevel: { 
                type: 'string',
                enum: ['low', 'medium', 'high', 'critical']
              },
              recommendations: { 
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['dominantEmotion', 'dominantEmotionReason', 'emotionType', 'emotionTypeReason', 'assessment', 'riskLevel', 'recommendations'],
            additionalProperties: false
          }
        }
      }
    });
    
    const content = response.choices[0].message.content;
    const result = JSON.parse(typeof content === 'string' ? content : '{}');
    
    console.log('[LLMInterpreter] Decision made:', {
      dominantEmotion: result.dominantEmotion,
      emotionType: result.emotionType,
      riskLevel: result.riskLevel
    });
    
    return {
      dominantEmotion: result.dominantEmotion || 'غير محدد',
      dominantEmotionReason: result.dominantEmotionReason || '',
      emotionType: result.emotionType || 'mixed',
      emotionTypeReason: result.emotionTypeReason || '',
      assessment: result.assessment || '',
      riskLevel: result.riskLevel || 'medium',
      recommendations: result.recommendations || []
    };
    
  } catch (error) {
    console.error('[LLMInterpreter] Decision failed:', error);
    return {
      dominantEmotion: 'غير محدد',
      dominantEmotionReason: 'تعذر التحليل',
      emotionType: 'mixed',
      emotionTypeReason: '',
      assessment: 'تعذر اتخاذ قرار',
      riskLevel: 'medium',
      recommendations: []
    };
  }
}

/**
 * Generate contextual follow-up questions
 * These should be specific to the topic, not generic
 */
export async function generateFollowUpQuestions(
  question: string,
  interpretedCauses: InterpretedCauses,
  decision: DecisionResult
): Promise<string[]> {
  console.log('[LLMInterpreter] Generating follow-up questions...');
  
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت مساعد ذكي. مهمتك توليد 3 أسئلة متابعة ذكية ومرتبطة بالموضوع.

قواعد:
1. الأسئلة يجب أن تكون مرتبطة بالموضوع المحدد
2. لا تكرر السؤال الأصلي
3. اقترح زوايا جديدة للاستكشاف
4. اجعل الأسئلة قصيرة ومباشرة

مثال جيد (لسؤال عن الهجرة):
- "ما تأثير ذلك على الشباب الليبي؟"
- "كيف تتعامل السلطات مع هذه المخاوف؟"
- "هل هناك حلول مقترحة؟"

مثال سيء:
- "هل تريد معرفة المزيد؟" (عام جداً)
- "ما رأيك؟" (ليس سؤال تحليلي)`
        },
        {
          role: 'user',
          content: `السؤال الأصلي: ${question}

الموضوعات المكتشفة: ${interpretedCauses.themes.join(', ')}
الشعور السائد: ${decision.dominantEmotion}
نوع الشعور: ${decision.emotionType}

ولّد 3 أسئلة متابعة ذكية ومرتبطة.`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'follow_up_questions',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              questions: {
                type: 'array',
                items: { type: 'string' },
                minItems: 3,
                maxItems: 3
              }
            },
            required: ['questions'],
            additionalProperties: false
          }
        }
      }
    });
    
    const content = response.choices[0].message.content;
    const result = JSON.parse(typeof content === 'string' ? content : '{}');
    
    return result.questions || [
      'ما تأثير ذلك على المجتمع؟',
      'ما التوقعات المستقبلية؟',
      'ما الحلول المقترحة؟'
    ];
    
  } catch (error) {
    console.error('[LLMInterpreter] Follow-up generation failed:', error);
    return [
      'ما تأثير ذلك على المجتمع؟',
      'ما التوقعات المستقبلية؟',
      'ما الحلول المقترحة؟'
    ];
  }
}
