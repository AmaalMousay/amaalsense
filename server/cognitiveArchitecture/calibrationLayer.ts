import { t } from "../_core/i18n";
/**
 * Calibration Layer
 *   -   
 * 
 * :
 * - AmalSense     (   )
 * -     (  )
 * 
 * :
 * -  :     vs   
 * -  :    
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
  fearGap: number;      //  =    =  
  hopeGap: number;
  angerGap: number;
  interpretation: string;
}

/**
 *     
 */
export async function generateSmartSurvey(
  topic: string,
  domain: string,
  country?: string
): Promise<Survey> {
  const surveyId = `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  //    
  const questions = await generateSurveyQuestions(topic, domain, country);
  
  return {
    id: surveyId,
    topic,
    domain,
    country,
    questions,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 
  };
}

/**
 *     LLM
 */
async function generateSurveyQuestions(
  topic: string,
  domain: string,
  country?: string
): Promise<SurveyQuestion[]> {
  const countryContext = country ? `  ${country}` : '';
  
  const prompt = `    .    (5  )    :
: ${topic}${countryContext}
: ${domain}

   :
1.   (1-5)   
2.       
3.     
4.     
5.   

  JSON :
{
  "questions": [
    {
      "id": "q1",
      "text": " ",
      "type": "scale|choice|open",
      "options": ["1", "2"] //  
    }
  ]
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: t('auto.cognitiveArchitecture_calibrationLayer.43.d1a2bba9', 'ar') },
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
 *     
 */
function getDefaultQuestions(topic: string, domain: string): SurveyQuestion[] {
  return [
    {
      id: 'q1',
      text: `     ${topic}`,
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: t('auto.cognitiveArchitecture_calibrationLayer.42.d40a44ce', 'ar'), max: t('auto.cognitiveArchitecture_calibrationLayer.41.8f51596b', 'ar') },
    },
    {
      id: 'q2',
      text: t('auto.cognitiveArchitecture_calibrationLayer.40.1a927e2a', 'ar'),
      type: 'choice',
      options: [
        t('auto.cognitiveArchitecture_calibrationLayer.39.47d5edbb', 'ar'),
        t('auto.cognitiveArchitecture_calibrationLayer.38.dbe74435', 'ar'),
        t('auto.cognitiveArchitecture_calibrationLayer.37.2aeb5b3d', 'ar'),
        t('auto.cognitiveArchitecture_calibrationLayer.36.91459477', 'ar'),
        t('auto.cognitiveArchitecture_calibrationLayer.35.b6f7fec5', 'ar'),
      ],
    },
    {
      id: 'q3',
      text: t('auto.cognitiveArchitecture_calibrationLayer.34.e9cb30d1', 'ar'),
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: t('auto.cognitiveArchitecture_calibrationLayer.33.74e51c8a', 'ar'), max: t('auto.cognitiveArchitecture_calibrationLayer.32.aeef8149', 'ar') },
    },
    {
      id: 'q4',
      text: t('auto.cognitiveArchitecture_calibrationLayer.31.361cc29e', 'ar'),
      type: 'choice',
      options: [
        t('auto.cognitiveArchitecture_calibrationLayer.30.018ee7f0', 'ar'),
        t('auto.cognitiveArchitecture_calibrationLayer.29.47eaecee', 'ar'),
        t('auto.cognitiveArchitecture_calibrationLayer.28.a99b2730', 'ar'),
        t('auto.cognitiveArchitecture_calibrationLayer.27.aa7554dd', 'ar'),
        t('auto.cognitiveArchitecture_calibrationLayer.26.53b9a789', 'ar'),
      ],
    },
    {
      id: 'q5',
      text: t('auto.cognitiveArchitecture_calibrationLayer.25.fa561b29', 'ar'),
      type: 'open',
    },
  ];
}

/**
 *   
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
      //   
      if (typeof answer.value === 'number') {
        const normalized = (answer.value - 1) / 4; // 0 to 1
        
        if (answer.questionId === 'q1') {
          //  : 1= 5=
          totalFear += (1 - normalized);
          totalHope += normalized;
        } else if (answer.questionId === 'q3') {
          //  
          totalFear += normalized;
        }
      }
      
      //  
      if (answer.questionId === 'q4' && typeof answer.value === 'string') {
        if (answer.value.includes(t('auto.cognitiveArchitecture_calibrationLayer.24.ab4c7e3d', 'ar'))) totalHope += 1;
        else if (answer.value.includes(t('auto.cognitiveArchitecture_calibrationLayer.23.98df46fb', 'ar'))) totalFear += 0.5;
        else totalAcceptance += 0.5;
      }
      
      //     
      if (answer.sentiment !== undefined) {
        if (answer.sentiment < -0.3) totalAnger += Math.abs(answer.sentiment);
        else if (answer.sentiment > 0.3) totalHope += answer.sentiment;
        else totalConfusion += 0.5;
      }
    }
  }
  
  const count = responses.length;
  
  //  
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
 *   
 *        
 */
export function generateCalibrationReport(
  topic: string,
  mediaPerception: EmotionBreakdown,
  surveyResponses: SurveyResponse[]
): CalibrationReport {
  const publicPerception = analyzeSurveyResponses(surveyResponses);
  
  //  
  const gap: EmotionGap = {
    fearGap: mediaPerception.fear - publicPerception.fear,
    hopeGap: mediaPerception.hope - publicPerception.hope,
    angerGap: mediaPerception.anger - publicPerception.anger,
    interpretation: '',
  };
  
  //  
  const interpretations: string[] = [];
  
  if (gap.fearGap > 15) {
    interpretations.push(t('auto.cognitiveArchitecture_calibrationLayer.22.afa0df06', 'ar'));
  } else if (gap.fearGap < -15) {
    interpretations.push(t('auto.cognitiveArchitecture_calibrationLayer.21.ffe652e6', 'ar'));
  }
  
  if (gap.hopeGap > 15) {
    interpretations.push(t('auto.cognitiveArchitecture_calibrationLayer.20.f1e9556a', 'ar'));
  } else if (gap.hopeGap < -15) {
    interpretations.push(t('auto.cognitiveArchitecture_calibrationLayer.19.0e9aa370', 'ar'));
  }
  
  if (gap.angerGap > 15) {
    interpretations.push(t('auto.cognitiveArchitecture_calibrationLayer.18.73cef36c', 'ar'));
  } else if (gap.angerGap < -15) {
    interpretations.push(t('auto.cognitiveArchitecture_calibrationLayer.17.408f4cb3', 'ar'));
  }
  
  gap.interpretation = interpretations.join('. ') || t('auto.cognitiveArchitecture_calibrationLayer.16.8b086817', 'ar');
  
  //  
  const insights = generateCalibrationInsights(mediaPerception, publicPerception, gap);
  
  //   
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
 *     
 */
function generateCalibrationInsights(
  media: EmotionBreakdown,
  public_: EmotionBreakdown,
  gap: EmotionGap
): string[] {
  const insights: string[] = [];
  
  //    
  const maxGap = Math.max(Math.abs(gap.fearGap), Math.abs(gap.hopeGap), Math.abs(gap.angerGap));
  
  if (maxGap > 20) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.15.f354f97a', 'ar'));
  }
  
  //    
  const dominantMedia = Object.entries(media).sort((a, b) => b[1] - a[1])[0];
  const dominantPublic = Object.entries(public_).sort((a, b) => b[1] - a[1])[0];
  
  if (dominantMedia[0] !== dominantPublic[0]) {
    insights.push(`   ${translateEmotion(dominantMedia[0])}     ${translateEmotion(dominantPublic[0])}`);
  }
  
  //   
  if (public_.confusion > 30) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.14.bd7e0591', 'ar'));
  }
  
  if (public_.acceptance > 40) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.13.5fde84e1', 'ar'));
  }
  
  return insights;
}

/**
 *   
 */
function translateEmotion(emotion: string): string {
  const translations: Record<string, string> = {
    fear: t('auto.cognitiveArchitecture_calibrationLayer.12.b4cbc50d', 'ar'),
    hope: t('auto.cognitiveArchitecture_calibrationLayer.11.05554470', 'ar'),
    anger: t('auto.cognitiveArchitecture_calibrationLayer.10.0a67288b', 'ar'),
    confusion: t('auto.cognitiveArchitecture_calibrationLayer.9.30b8e235', 'ar'),
    acceptance: t('auto.cognitiveArchitecture_calibrationLayer.8.7377ae7d', 'ar'),
  };
  return translations[emotion] || emotion;
}

/**
 *   
 */
export function calculateCalibrationGap(
  mediaData: { fear: number; hope: number; anger: number },
  surveyData: { fear: number; hope: number; anger: number }
): { fear: number; hope: number; anger: number } {
  return {
    fear: surveyData.fear - mediaData.fear,  //  =  
    hope: surveyData.hope - mediaData.hope,  //  =  
    anger: surveyData.anger - mediaData.anger,
  };
}

/**
 *    
 */
export function generateCalibrationInsight(gap: { fear: number; hope: number; anger: number }): string {
  const insights: string[] = [];
  
  //   
  if (gap.fear < -20) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.7.ef12ef07', 'ar'));
  } else if (gap.fear > 20) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.6.792155e9', 'ar'));
  }
  
  //   
  if (gap.hope > 20) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.5.0e9aa370', 'ar'));
  } else if (gap.hope < -20) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.4.b18ec2dd', 'ar'));
  }
  
  //   
  if (gap.anger < -20) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.3.73cef36c', 'ar'));
  } else if (gap.anger > 20) {
    insights.push(t('auto.cognitiveArchitecture_calibrationLayer.2.8bb3231e', 'ar'));
  }
  
  if (insights.length === 0) {
    return t('auto.cognitiveArchitecture_calibrationLayer.1.fec2281e', 'ar');
  }
  
  return insights.join('. ');
}

/**
 *  
 */
export const CalibrationLayer = {
  generateSmartSurvey,
  analyzeSurveyResponses,
  generateCalibrationReport,
  calculateGap: calculateCalibrationGap,
  generateInsight: generateCalibrationInsight,
};
