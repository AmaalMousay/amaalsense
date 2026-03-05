// @ts-nocheck
/**
 * Enhanced Emotion Analyzer - محلل العواطف المحسّن
 * يوفر:
 * - تحسين دقة كشف العاطفة
 * - emotion intensity levels (1-10)
 * - emotion confidence scores (0-100)
 * - emotion vectors (تمثيل متجهي للعواطف)
 */

import { invokeLLM } from './_core/llm';

/**
 * تعريف نوع العاطفة المحسّن
 */
export interface EnhancedEmotion {
  emotion: string; // اسم العاطفة
  intensity: number; // 1-10
  confidence: number; // 0-100
  vector: number[]; // تمثيل متجهي
  subEmotions: {
    emotion: string;
    weight: number;
  }[];
  triggers: string[]; // ما الذي يثير هذه العاطفة
  context: string; // السياق الذي تظهر فيه
}

/**
 * قاموس العواطف الأساسية مع متجهاتها
 */
const emotionVectors: { [key: string]: number[] } = {
  joy: [0.9, 0.8, 0.7, 0.2, 0.1],
  sadness: [0.1, 0.2, 0.3, 0.8, 0.7],
  anger: [0.8, 0.9, 0.2, 0.1, 0.3],
  fear: [0.3, 0.2, 0.8, 0.9, 0.6],
  surprise: [0.7, 0.6, 0.4, 0.3, 0.5],
  disgust: [0.2, 0.3, 0.7, 0.8, 0.4],
  trust: [0.8, 0.7, 0.2, 0.1, 0.9],
  anticipation: [0.7, 0.8, 0.3, 0.2, 0.8],
  hope: [0.9, 0.7, 0.3, 0.2, 0.8],
  anxiety: [0.4, 0.3, 0.8, 0.9, 0.7]
};

/**
 * كشف العاطفة المحسّن مع الدقة العالية
 */
export async function analyzeEmotionEnhanced(
  text: string,
  context?: string
): Promise<EnhancedEmotion[]> {
  try {
    console.log('[EmotionAnalyzer] Starting enhanced emotion analysis...');

    // الخطوة 1: استخراج العواطف الأساسية
    const primaryEmotions = await extractPrimaryEmotions(text);

    // الخطوة 2: حساب الشدة والثقة
    const emotionsWithIntensity = await calculateIntensityAndConfidence(
      text,
      primaryEmotions
    );

    // الخطوة 3: إضافة المتجهات والعواطف الفرعية
    const emotionsWithVectors = emotionsWithIntensity.map(emotion => ({
      ...emotion,
      vector: emotionVectors[emotion.emotion.toLowerCase()] || generateVector(),
      subEmotions: getSubEmotions(emotion.emotion),
      triggers: extractTriggers(text, emotion.emotion),
      context: context || extractContext(text)
    }));

    // الخطوة 4: ترتيب حسب الثقة
    const sortedEmotions = emotionsWithVectors.sort(
      (a, b) => b.confidence - a.confidence
    );

    console.log(
      '[EmotionAnalyzer] Analysis complete. Found',
      sortedEmotions.length,
      'emotions'
    );

    return sortedEmotions;
  } catch (error) {
    console.error('[EmotionAnalyzer] Error in analyzeEmotionEnhanced:', error);
    return [];
  }
}

/**
 * استخراج العواطف الأساسية من النص
 */
async function extractPrimaryEmotions(text: string): Promise<string[]> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are an expert emotion detection system. Analyze the text and identify primary emotions from this list: joy, sadness, anger, fear, surprise, disgust, trust, anticipation, hope, anxiety. Return only the emotion names, comma-separated.` as any
        },
        {
          role: 'user',
          content: `Analyze this text for emotions:\n"${text}"` as any
        }
      ]
    });

    const emotionsText = response.choices[0].message.content as any;
    const emotions = typeof emotionsText === 'string'
      ? emotionsText.split(',').map((e: string) => e.trim().toLowerCase())
      : [];

    return emotions.filter((e: string) =>
      Object.keys(emotionVectors).includes(e)
    );
  } catch (error) {
    console.error('[EmotionAnalyzer] Error extracting primary emotions:', error);
    return [];
  }
}

/**
 * حساب شدة العاطفة والثقة
 */
async function calculateIntensityAndConfidence(
  text: string,
  emotions: string[]
): Promise<
  Array<{
    emotion: string;
    intensity: number;
    confidence: number;
  }>
> {
  try {
    const results = [];

    for (const emotion of emotions) {
      // حساب الشدة بناءً على تكرار الكلمات المرتبطة
      const intensity = calculateEmotionIntensity(text, emotion);

      // حساب الثقة بناءً على وضوح العاطفة
      const confidence = calculateEmotionConfidence(text, emotion);

      results.push({
        emotion,
        intensity: Math.min(10, Math.max(1, intensity)),
        confidence: Math.min(100, Math.max(0, confidence))
      });
    }

    return results;
  } catch (error) {
    console.error(
      '[EmotionAnalyzer] Error calculating intensity and confidence:',
      error
    );
    return [];
  }
}

/**
 * حساب شدة العاطفة (1-10)
 */
function calculateEmotionIntensity(text: string, emotion: string): number {
  const emotionKeywords: { [key: string]: string[] } = {
    joy: ['happy', 'joyful', 'delighted', 'thrilled', 'wonderful', 'amazing'],
    sadness: ['sad', 'unhappy', 'depressed', 'miserable', 'sorrowful'],
    anger: ['angry', 'furious', 'enraged', 'mad', 'outraged'],
    fear: ['afraid', 'scared', 'terrified', 'anxious', 'worried'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished'],
    disgust: ['disgusted', 'repulsed', 'revolted', 'appalled'],
    trust: ['trust', 'confident', 'assured', 'certain'],
    anticipation: ['anticipate', 'expect', 'looking forward', 'excited'],
    hope: ['hope', 'hopeful', 'optimistic', 'promising'],
    anxiety: ['anxious', 'nervous', 'tense', 'worried']
  };

  const keywords = emotionKeywords[emotion] || [];
  const lowerText = text.toLowerCase();

  let count = 0;
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = lowerText.match(regex);
    count += matches ? matches.length : 0;
  });

  // تحويل العدد إلى نطاق 1-10
  return Math.min(10, Math.max(1, count + 3));
}

/**
 * حساب ثقة العاطفة (0-100)
 */
function calculateEmotionConfidence(text: string, emotion: string): number {
  // عوامل الثقة
  let confidence = 50; // القيمة الأساسية

  // عامل طول النص
  if (text.length > 100) confidence += 10;
  if (text.length > 500) confidence += 10;

  // عامل الكلمات الدالة
  const emotionIndicators: { [key: string]: string[] } = {
    joy: ['!', 'love', 'amazing', 'wonderful'],
    sadness: [':(', 'cry', 'heartbroken'],
    anger: ['!!!', 'hate', 'furious'],
    fear: ['?', 'scared', 'terrified'],
    hope: ['will', 'can', 'possible']
  };

  const indicators = emotionIndicators[emotion] || [];
  const matchCount = indicators.filter(ind =>
    text.toLowerCase().includes(ind.toLowerCase())
  ).length;

  confidence += matchCount * 5;

  return Math.min(100, Math.max(0, confidence));
}

/**
 * الحصول على العواطف الفرعية
 */
function getSubEmotions(
  emotion: string
): Array<{ emotion: string; weight: number }> {
  const subEmotionMap: { [key: string]: Array<{ emotion: string; weight: number }> } = {
    joy: [
      { emotion: 'happiness', weight: 0.9 },
      { emotion: 'contentment', weight: 0.7 },
      { emotion: 'excitement', weight: 0.6 }
    ],
    sadness: [
      { emotion: 'grief', weight: 0.8 },
      { emotion: 'disappointment', weight: 0.7 },
      { emotion: 'loneliness', weight: 0.6 }
    ],
    anger: [
      { emotion: 'frustration', weight: 0.8 },
      { emotion: 'irritation', weight: 0.7 },
      { emotion: 'resentment', weight: 0.6 }
    ],
    fear: [
      { emotion: 'panic', weight: 0.8 },
      { emotion: 'dread', weight: 0.7 },
      { emotion: 'nervousness', weight: 0.6 }
    ]
  };

  return subEmotionMap[emotion.toLowerCase()] || [];
}

/**
 * استخراج محفزات العاطفة
 */
function extractTriggers(text: string, emotion: string): string[] {
  // استخراج الكلمات الرئيسية كمحفزات
  const words = text.split(/\s+/).filter(w => w.length > 3);
  return words.slice(0, 3); // أول 3 كلمات كمحفزات
}

/**
 * استخراج السياق
 */
function extractContext(text: string): string {
  // استخراج الجملة الأولى كسياق
  const sentences = text.split(/[.!?]+/);
  return sentences[0] || text.substring(0, 50);
}

/**
 * توليد متجه عشوائي للعواطف غير المعروفة
 */
function generateVector(): number[] {
  return Array(5)
    .fill(0)
    .map(() => Math.random());
}

/**
 * حساب التشابه بين متجهات العواطف
 */
export function calculateEmotionSimilarity(
  vector1: number[],
  vector2: number[]
): number {
  if (vector1.length !== vector2.length) return 0;

  const dotProduct = vector1.reduce((sum, v, i) => sum + v * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, v) => sum + v * v, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, v) => sum + v * v, 0));

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * دمج العواطف المتشابهة
 */
export function mergeEmotions(emotions: EnhancedEmotion[]): EnhancedEmotion[] {
  if (emotions.length <= 1) return emotions;

  const merged: EnhancedEmotion[] = [];
  const processed = new Set<number>();

  for (let i = 0; i < emotions.length; i++) {
    if (processed.has(i)) continue;

    let current = emotions[i];
    processed.add(i);

    // البحث عن عواطف متشابهة
    for (let j = i + 1; j < emotions.length; j++) {
      if (processed.has(j)) continue;

      const similarity = calculateEmotionSimilarity(
        current.vector,
        emotions[j].vector
      );

      if (similarity > 0.7) {
        // دمج العواطف
        current = {
          ...current,
          intensity: (current.intensity + emotions[j].intensity) / 2,
          confidence: (current.confidence + emotions[j].confidence) / 2,
          subEmotions: [
            ...current.subEmotions,
            ...emotions[j].subEmotions
          ]
        };
        processed.add(j);
      }
    }

    merged.push(current);
  }

  return merged;
}

/**
 * تقييم الحالة العاطفية الشاملة
 */
export function assessOverallEmotionalState(
  emotions: EnhancedEmotion[]
): {
  dominantEmotion: string;
  overallIntensity: number;
  overallConfidence: number;
  emotionalBalance: string;
} {
  if (emotions.length === 0) {
    return {
      dominantEmotion: 'neutral',
      overallIntensity: 0,
      overallConfidence: 0,
      emotionalBalance: 'neutral'
    };
  }

  const dominantEmotion = emotions[0].emotion;
  const overallIntensity =
    emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length;
  const overallConfidence =
    emotions.reduce((sum, e) => sum + e.confidence, 0) / emotions.length;

  // تقييم التوازن العاطفي
  const positiveEmotions = ['joy', 'trust', 'hope', 'anticipation'];
  const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust'];

  const positiveScore = emotions
    .filter(e => positiveEmotions.includes(e.emotion))
    .reduce((sum, e) => sum + e.confidence, 0);

  const negativeScore = emotions
    .filter(e => negativeEmotions.includes(e.emotion))
    .reduce((sum, e) => sum + e.confidence, 0);

  let emotionalBalance = 'balanced';
  if (positiveScore > negativeScore * 1.5) emotionalBalance = 'positive';
  if (negativeScore > positiveScore * 1.5) emotionalBalance = 'negative';

  return {
    dominantEmotion,
    overallIntensity: Math.round(overallIntensity * 10) / 10,
    overallConfidence: Math.round(overallConfidence),
    emotionalBalance
  };
}
