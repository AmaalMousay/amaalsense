/**
 * Calibration Layer
 * طبقة المعايرة - الاستبيانات كمصدر داخلي
 * 
 * الفكرة:
 * - AmalSense لا يقرأ فقط الأخبار (ماذا يُقال عن الناس)
 * - بل يسأل الناس مباشرة (ماذا يشعرون فعلاً)
 * 
 * الفائدة:
 * - معايرة الوعي: مقارنة ما يقوله الإعلام vs ما يشعره الناس
 * - بيانات أولية: مشاعر حقيقية من المصدر
 */

import { invokeLLM } from '../_core/llm';

export interface Survey {
  id: string;
  topic: string;
  domain: string;
  country?: string;
  questions: SurveyQuestion[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'scale' | 'choice' | 'open';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
}

export interface SurveyResponse {
  surveyId: string;
  respondentId?: string;
  answers: SurveyAnswer[];
  submittedAt: Date;
  metadata?: {
    country?: string;
    age_group?: string;
    gender?: string;
  };
}

export interface SurveyAnswer {
  questionId: string;
  value: string | number;
  sentiment?: number; // -1 to 1
}

export interface CalibrationReport {
  topic: string;
  mediaPerception: EmotionBreakdown;
  publicPerception: EmotionBreakdown;
  gap: EmotionGap;
  insights: string[];
  sampleSize: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface EmotionBreakdown {
  fear: number;
  hope: number;
  anger: number;
  confusion: number;
  acceptance: number;
}

export interface EmotionGap {
  fearGap: number;      // إيجابي = الإعلام يبالغ، سلبي = الإعلام يقلل
  hopeGap: number;
  angerGap: number;
  interpretation: string;
}

/**
 * توليد استبيان ذكي حسب الموضوع
 */
export async function generateSmartSurvey(
  topic: string,
  domain: string,
  country?: string
): Promise<Survey> {
  const surveyId = `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // توليد أسئلة مخصصة للموضوع
  const questions = await generateSurveyQuestions(topic, domain, country);
  
  return {
    id: surveyId,
    topic,
    domain,
    country,
    questions,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // أسبوع
  };
}

/**
 * توليد أسئلة الاستبيان باستخدام LLM
 */
async function generateSurveyQuestions(
  topic: string,
  domain: string,
  country?: string
): Promise<SurveyQuestion[]> {
  const countryContext = country ? ` في ${country}` : '';
  
  const prompt = `أنت خبير في تصميم الاستبيانات. أريد استبياناً قصيراً (5 أسئلة فقط) لقياس مشاعر الناس تجاه:
الموضوع: ${topic}${countryContext}
المجال: ${domain}

الأسئلة يجب أن تكون:
1. سؤال مقياس (1-5) عن الشعور العام
2. سؤال اختيار متعدد عن السبب الرئيسي للشعور
3. سؤال مقياس عن مستوى القلق
4. سؤال اختيار عن التوقعات المستقبلية
5. سؤال مفتوح قصير

أجب بصيغة JSON فقط:
{
  "questions": [
    {
      "id": "q1",
      "text": "نص السؤال",
      "type": "scale|choice|open",
      "options": ["خيار1", "خيار2"] // للاختيار فقط
    }
  ]
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'أنت مساعد يولد استبيانات بصيغة JSON فقط.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const rawContent = response.choices[0]?.message?.content || '{}';
    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent);
    const parsed = JSON.parse(content);
    
    return parsed.questions || getDefaultQuestions(topic, domain);
  } catch (error) {
    console.error('Error generating survey questions:', error);
    return getDefaultQuestions(topic, domain);
  }
}

/**
 * أسئلة افتراضية إذا فشل التوليد
 */
function getDefaultQuestions(topic: string, domain: string): SurveyQuestion[] {
  return [
    {
      id: 'q1',
      text: `كيف تصف شعورك العام تجاه ${topic}؟`,
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'قلق جداً', max: 'متفائل جداً' },
    },
    {
      id: 'q2',
      text: 'ما السبب الرئيسي لهذا الشعور؟',
      type: 'choice',
      options: [
        'الأخبار والإعلام',
        'تجربة شخصية',
        'آراء المحيطين',
        'تحليل منطقي',
        'حدس وشعور',
      ],
    },
    {
      id: 'q3',
      text: 'ما مستوى قلقك من التطورات القادمة؟',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'لا قلق', max: 'قلق شديد' },
    },
    {
      id: 'q4',
      text: 'ما توقعاتك للأشهر القادمة؟',
      type: 'choice',
      options: [
        'تحسن كبير',
        'تحسن طفيف',
        'استقرار',
        'تراجع طفيف',
        'تراجع كبير',
      ],
    },
    {
      id: 'q5',
      text: 'ما الشيء الذي يشغل بالك أكثر في هذا الموضوع؟',
      type: 'open',
    },
  ];
}

/**
 * تحليل إجابات الاستبيان
 */
export function analyzeSurveyResponses(responses: SurveyResponse[]): EmotionBreakdown {
  if (responses.length === 0) {
    return { fear: 0, hope: 0, anger: 0, confusion: 0, acceptance: 0 };
  }
  
  let totalFear = 0;
  let totalHope = 0;
  let totalAnger = 0;
  let totalConfusion = 0;
  let totalAcceptance = 0;
  
  for (const response of responses) {
    for (const answer of response.answers) {
      // تحليل إجابات المقياس
      if (typeof answer.value === 'number') {
        const normalized = (answer.value - 1) / 4; // 0 to 1
        
        if (answer.questionId === 'q1') {
          // الشعور العام: 1=قلق، 5=تفاؤل
          totalFear += (1 - normalized);
          totalHope += normalized;
        } else if (answer.questionId === 'q3') {
          // مستوى القلق
          totalFear += normalized;
        }
      }
      
      // تحليل الاختيارات
      if (answer.questionId === 'q4' && typeof answer.value === 'string') {
        if (answer.value.includes('تحسن')) totalHope += 1;
        else if (answer.value.includes('تراجع')) totalFear += 0.5;
        else totalAcceptance += 0.5;
      }
      
      // تحليل المشاعر من النص المفتوح
      if (answer.sentiment !== undefined) {
        if (answer.sentiment < -0.3) totalAnger += Math.abs(answer.sentiment);
        else if (answer.sentiment > 0.3) totalHope += answer.sentiment;
        else totalConfusion += 0.5;
      }
    }
  }
  
  const count = responses.length;
  
  // تطبيع النتائج
  const total = totalFear + totalHope + totalAnger + totalConfusion + totalAcceptance;
  if (total === 0) {
    return { fear: 20, hope: 20, anger: 20, confusion: 20, acceptance: 20 };
  }
  
  return {
    fear: Math.round((totalFear / total) * 100),
    hope: Math.round((totalHope / total) * 100),
    anger: Math.round((totalAnger / total) * 100),
    confusion: Math.round((totalConfusion / total) * 100),
    acceptance: Math.round((totalAcceptance / total) * 100),
  };
}

/**
 * إنتاج تقرير معايرة
 * مقارنة بين ما يقوله الإعلام وما يشعره الناس
 */
export function generateCalibrationReport(
  topic: string,
  mediaPerception: EmotionBreakdown,
  surveyResponses: SurveyResponse[]
): CalibrationReport {
  const publicPerception = analyzeSurveyResponses(surveyResponses);
  
  // حساب الفجوة
  const gap: EmotionGap = {
    fearGap: mediaPerception.fear - publicPerception.fear,
    hopeGap: mediaPerception.hope - publicPerception.hope,
    angerGap: mediaPerception.anger - publicPerception.anger,
    interpretation: '',
  };
  
  // تفسير الفجوة
  const interpretations: string[] = [];
  
  if (gap.fearGap > 15) {
    interpretations.push('الإعلام يبالغ في تصوير الخوف مقارنة بما يشعره الناس فعلاً');
  } else if (gap.fearGap < -15) {
    interpretations.push('الناس أكثر قلقاً مما يظهره الإعلام');
  }
  
  if (gap.hopeGap > 15) {
    interpretations.push('الإعلام أكثر تفاؤلاً من الشارع');
  } else if (gap.hopeGap < -15) {
    interpretations.push('الناس أكثر تفاؤلاً مما ينقله الإعلام');
  }
  
  if (gap.angerGap > 15) {
    interpretations.push('الإعلام يركز على الغضب أكثر من الواقع');
  } else if (gap.angerGap < -15) {
    interpretations.push('هناك غضب شعبي لا يظهر في الإعلام');
  }
  
  gap.interpretation = interpretations.join('. ') || 'الإعلام يعكس مشاعر الناس بشكل متوازن';
  
  // توليد رؤى
  const insights = generateCalibrationInsights(mediaPerception, publicPerception, gap);
  
  // تحديد مستوى الثقة
  const confidence = surveyResponses.length >= 50 ? 'high' :
                     surveyResponses.length >= 20 ? 'medium' : 'low';
  
  return {
    topic,
    mediaPerception,
    publicPerception,
    gap,
    insights,
    sampleSize: surveyResponses.length,
    confidence,
  };
}

/**
 * توليد رؤى من تقرير المعايرة
 */
function generateCalibrationInsights(
  media: EmotionBreakdown,
  public_: EmotionBreakdown,
  gap: EmotionGap
): string[] {
  const insights: string[] = [];
  
  // رؤية عن الفجوة الأكبر
  const maxGap = Math.max(Math.abs(gap.fearGap), Math.abs(gap.hopeGap), Math.abs(gap.angerGap));
  
  if (maxGap > 20) {
    insights.push('هناك فجوة كبيرة بين الصورة الإعلامية والواقع الشعبي');
  }
  
  // رؤية عن المشاعر السائدة
  const dominantMedia = Object.entries(media).sort((a, b) => b[1] - a[1])[0];
  const dominantPublic = Object.entries(public_).sort((a, b) => b[1] - a[1])[0];
  
  if (dominantMedia[0] !== dominantPublic[0]) {
    insights.push(`الإعلام يركز على ${translateEmotion(dominantMedia[0])} بينما الشعور السائد هو ${translateEmotion(dominantPublic[0])}`);
  }
  
  // رؤية عن التوازن
  if (public_.confusion > 30) {
    insights.push('هناك حيرة واضحة لدى الناس تحتاج توضيحاً');
  }
  
  if (public_.acceptance > 40) {
    insights.push('الناس في حالة قبول وتكيف مع الوضع');
  }
  
  return insights;
}

/**
 * ترجمة اسم المشاعر
 */
function translateEmotion(emotion: string): string {
  const translations: Record<string, string> = {
    fear: 'الخوف',
    hope: 'الأمل',
    anger: 'الغضب',
    confusion: 'الحيرة',
    acceptance: 'القبول',
  };
  return translations[emotion] || emotion;
}

/**
 * حساب فجوة المعايرة
 */
export function calculateCalibrationGap(
  mediaData: { fear: number; hope: number; anger: number },
  surveyData: { fear: number; hope: number; anger: number }
): { fear: number; hope: number; anger: number } {
  return {
    fear: surveyData.fear - mediaData.fear,  // سلبي = الإعلام يبالغ
    hope: surveyData.hope - mediaData.hope,  // إيجابي = الإعلام يقلل
    anger: surveyData.anger - mediaData.anger,
  };
}

/**
 * توليد رؤية من الفجوة
 */
export function generateCalibrationInsight(gap: { fear: number; hope: number; anger: number }): string {
  const insights: string[] = [];
  
  // تحليل فجوة الخوف
  if (gap.fear < -20) {
    insights.push('الإعلام يبالغ في تضخيم الخوف مقارنة بمشاعر الناس الحقيقية');
  } else if (gap.fear > 20) {
    insights.push('الإعلام يقلل من مستوى القلق الفعلي لدى الناس');
  }
  
  // تحليل فجوة الأمل
  if (gap.hope > 20) {
    insights.push('الناس أكثر تفاؤلاً مما ينقله الإعلام');
  } else if (gap.hope < -20) {
    insights.push('الإعلام يبالغ في التفاؤل مقارنة بالواقع');
  }
  
  // تحليل فجوة الغضب
  if (gap.anger < -20) {
    insights.push('الإعلام يركز على الغضب أكثر من الواقع');
  } else if (gap.anger > 20) {
    insights.push('هناك غضب شعبي لا يظهر في التغطية الإعلامية');
  }
  
  if (insights.length === 0) {
    return 'الإعلام يعكس مشاعر الناس بشكل متوازن نسبياً';
  }
  
  return insights.join('. ');
}

/**
 * تصدير الدوال
 */
export const CalibrationLayer = {
  generateSmartSurvey,
  analyzeSurveyResponses,
  generateCalibrationReport,
  calculateGap: calculateCalibrationGap,
  generateInsight: generateCalibrationInsight,
};
