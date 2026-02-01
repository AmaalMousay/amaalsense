/**
 * Engine 2: Emotion Fusion Model
 * يدمج 3 مصادر للتحليل العاطفي:
 * - Rule-based analysis
 * - AI model analysis
 * - DCFT (Digital Collective Feeling Theory)
 * 
 * ويخرج: Affective Vector موحد
 * { joy, fear, anger, sadness, hope, curiosity }
 */

import { ContextResult } from './contextClassification';

export interface AffectiveVector {
  joy: number;      // 0-100
  fear: number;     // 0-100
  anger: number;    // 0-100
  sadness: number;  // 0-100
  hope: number;     // 0-100
  curiosity: number; // 0-100
}

export interface EmotionFusionResult {
  vector: AffectiveVector;
  dominantEmotion: keyof AffectiveVector;
  emotionalIntensity: number;  // 0-100 overall intensity
  valence: number;             // -100 to +100 (negative to positive)
  arousal: number;             // 0-100 (calm to excited)
  confidence: number;          // 0-100
  sources: {
    ruleBased: AffectiveVector;
    dcft: AffectiveVector;
    weights: { ruleBased: number; dcft: number };
  };
}

// Emotion keywords for rule-based analysis
const EMOTION_KEYWORDS: Record<keyof AffectiveVector, { en: string[], ar: string[], weight: number }> = {
  joy: {
    en: ['happy', 'joy', 'celebrate', 'success', 'victory', 'win', 'excellent', 'wonderful', 'great', 'amazing', 'fantastic', 'delighted', 'pleased', 'thrilled', 'excited', 'proud', 'achievement', 'triumph', 'congratulations'],
    ar: ['سعادة', 'فرح', 'احتفال', 'نجاح', 'انتصار', 'فوز', 'ممتاز', 'رائع', 'عظيم', 'مذهل', 'سعيد', 'فخور', 'إنجاز', 'تهنئة', 'مبروك', 'بهجة'],
    weight: 1.0
  },
  fear: {
    en: ['fear', 'afraid', 'scared', 'terror', 'panic', 'worry', 'anxious', 'threat', 'danger', 'risk', 'warning', 'alarm', 'horror', 'dread', 'nervous', 'concerned', 'uncertain', 'crisis'],
    ar: ['خوف', 'خائف', 'رعب', 'ذعر', 'قلق', 'تهديد', 'خطر', 'تحذير', 'إنذار', 'أزمة', 'مخاوف', 'قلقون', 'مرعب', 'مخيف'],
    weight: 1.2
  },
  anger: {
    en: ['angry', 'rage', 'furious', 'outrage', 'protest', 'condemn', 'denounce', 'attack', 'violence', 'conflict', 'fight', 'hate', 'hostile', 'aggressive', 'frustrated', 'irritated', 'resentment'],
    ar: ['غضب', 'غاضب', 'سخط', 'احتجاج', 'إدانة', 'استنكار', 'هجوم', 'عنف', 'صراع', 'كراهية', 'عدائي', 'عدوان', 'إحباط', 'استياء', 'ثورة'],
    weight: 1.3
  },
  sadness: {
    en: ['sad', 'grief', 'sorrow', 'tragic', 'death', 'loss', 'mourning', 'tears', 'heartbreak', 'devastating', 'painful', 'suffering', 'misery', 'despair', 'depression', 'funeral'],
    ar: ['حزن', 'حزين', 'أسى', 'مأساة', 'وفاة', 'فقدان', 'حداد', 'دموع', 'ألم', 'معاناة', 'بؤس', 'يأس', 'اكتئاب', 'جنازة', 'مؤلم'],
    weight: 1.1
  },
  hope: {
    en: ['hope', 'optimism', 'future', 'promise', 'potential', 'opportunity', 'progress', 'improvement', 'recovery', 'solution', 'peace', 'dream', 'aspiration', 'positive', 'bright'],
    ar: ['أمل', 'تفاؤل', 'مستقبل', 'وعد', 'فرصة', 'تقدم', 'تحسن', 'تعافي', 'حل', 'سلام', 'حلم', 'طموح', 'إيجابي', 'مشرق'],
    weight: 1.0
  },
  curiosity: {
    en: ['discover', 'research', 'study', 'investigate', 'explore', 'question', 'mystery', 'secret', 'reveal', 'find', 'learn', 'understand', 'analyze', 'examine', 'interesting', 'surprising'],
    ar: ['اكتشاف', 'بحث', 'دراسة', 'تحقيق', 'استكشاف', 'سؤال', 'غموض', 'سر', 'كشف', 'تعلم', 'فهم', 'تحليل', 'مثير', 'مفاجئ'],
    weight: 0.8
  }
};

// Context-based emotion modifiers
const CONTEXT_EMOTION_MODIFIERS: Record<string, Partial<Record<keyof AffectiveVector, number>>> = {
  // Domain modifiers
  'war': { fear: 1.5, anger: 1.4, sadness: 1.3, hope: 0.7 },
  'politics': { anger: 1.3, fear: 1.2, hope: 1.1 },
  'economy': { fear: 1.3, hope: 1.2, curiosity: 1.1 },
  'health': { fear: 1.4, hope: 1.3, sadness: 1.2 },
  'sports': { joy: 1.5, hope: 1.3, anger: 0.8 },
  'entertainment': { joy: 1.4, curiosity: 1.2, anger: 0.7 },
  'technology': { curiosity: 1.4, hope: 1.3, fear: 1.1 },
  'environment': { fear: 1.3, sadness: 1.2, hope: 1.1 },
  
  // Event type modifiers
  'crisis': { fear: 1.6, anger: 1.3, sadness: 1.2, hope: 0.6 },
  'death': { sadness: 1.8, fear: 1.2, anger: 1.1, joy: 0.2 },
  'celebration': { joy: 1.8, hope: 1.4, sadness: 0.3, fear: 0.3 },
  'conflict': { anger: 1.6, fear: 1.4, sadness: 1.2, hope: 0.5 },
  'disaster': { fear: 1.7, sadness: 1.5, anger: 1.2, hope: 0.4 },
  'achievement': { joy: 1.6, hope: 1.5, curiosity: 1.2 },
  'discovery': { curiosity: 1.7, hope: 1.4, joy: 1.2 }
};

/**
 * Rule-based emotion analysis
 */
function analyzeRuleBased(text: string): AffectiveVector {
  const lowerText = text.toLowerCase();
  const scores: AffectiveVector = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0
  };
  
  // Count keyword matches for each emotion
  for (const [emotion, config] of Object.entries(EMOTION_KEYWORDS)) {
    const allKeywords = [...config.en, ...config.ar];
    let matchCount = 0;
    
    for (const keyword of allKeywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    
    // Calculate score with weight
    scores[emotion as keyof AffectiveVector] = Math.min(100, matchCount * 15 * config.weight);
  }
  
  // Normalize if total exceeds reasonable bounds
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  if (total > 300) {
    const factor = 300 / total;
    for (const key of Object.keys(scores) as (keyof AffectiveVector)[]) {
      scores[key] = Math.round(scores[key] * factor);
    }
  }
  
  return scores;
}

/**
 * DCFT-based emotion analysis
 * Digital Collective Feeling Theory implementation
 */
function analyzeDCFT(text: string, context: ContextResult): AffectiveVector {
  // Start with rule-based as foundation
  const baseScores = analyzeRuleBased(text);
  
  // Apply context modifiers
  const domainModifier = CONTEXT_EMOTION_MODIFIERS[context.domain] || {};
  const eventModifier = CONTEXT_EMOTION_MODIFIERS[context.eventType] || {};
  
  const dcftScores: AffectiveVector = { ...baseScores };
  
  // Apply domain modifiers
  for (const [emotion, modifier] of Object.entries(domainModifier)) {
    dcftScores[emotion as keyof AffectiveVector] = Math.min(100, 
      Math.round(dcftScores[emotion as keyof AffectiveVector] * (modifier as number))
    );
  }
  
  // Apply event type modifiers
  for (const [emotion, modifier] of Object.entries(eventModifier)) {
    dcftScores[emotion as keyof AffectiveVector] = Math.min(100,
      Math.round(dcftScores[emotion as keyof AffectiveVector] * (modifier as number))
    );
  }
  
  // Apply sensitivity boost
  const sensitivityMultiplier = {
    'low': 0.8,
    'medium': 1.0,
    'high': 1.2,
    'critical': 1.4
  }[context.sensitivity];
  
  // Boost negative emotions for high sensitivity content
  if (context.sensitivity === 'high' || context.sensitivity === 'critical') {
    dcftScores.fear = Math.min(100, Math.round(dcftScores.fear * sensitivityMultiplier));
    dcftScores.anger = Math.min(100, Math.round(dcftScores.anger * sensitivityMultiplier));
    dcftScores.sadness = Math.min(100, Math.round(dcftScores.sadness * sensitivityMultiplier));
  }
  
  return dcftScores;
}

/**
 * Calculate valence (positive vs negative sentiment)
 */
function calculateValence(vector: AffectiveVector): number {
  const positive = vector.joy + vector.hope + (vector.curiosity * 0.5);
  const negative = vector.fear + vector.anger + vector.sadness;
  
  // Scale to -100 to +100
  const total = positive + negative;
  if (total === 0) return 0;
  
  return Math.round(((positive - negative) / total) * 100);
}

/**
 * Calculate arousal (emotional intensity/activation)
 */
function calculateArousal(vector: AffectiveVector): number {
  // High arousal emotions: anger, fear, joy
  // Low arousal emotions: sadness, hope
  const highArousal = vector.anger + vector.fear + vector.joy;
  const lowArousal = vector.sadness + vector.hope;
  
  const total = highArousal + lowArousal + vector.curiosity;
  if (total === 0) return 50;
  
  return Math.round((highArousal / total) * 100);
}

/**
 * Find dominant emotion
 */
function findDominantEmotion(vector: AffectiveVector): keyof AffectiveVector {
  let maxEmotion: keyof AffectiveVector = 'curiosity';
  let maxValue = 0;
  
  for (const [emotion, value] of Object.entries(vector)) {
    if (value > maxValue) {
      maxValue = value;
      maxEmotion = emotion as keyof AffectiveVector;
    }
  }
  
  return maxEmotion;
}

/**
 * Calculate overall emotional intensity
 */
function calculateIntensity(vector: AffectiveVector): number {
  const values = Object.values(vector);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  
  // Weighted combination of max and average
  return Math.round((max * 0.6) + (avg * 0.4));
}

/**
 * Main Emotion Fusion Function
 * Combines rule-based and DCFT analysis
 */
export function fuseEmotions(text: string, context: ContextResult): EmotionFusionResult {
  // Get analyses from both sources
  const ruleBased = analyzeRuleBased(text);
  const dcft = analyzeDCFT(text, context);
  
  // Fusion weights: DCFT gets more weight for context-aware analysis
  const weights = {
    ruleBased: 0.3,
    dcft: 0.7
  };
  
  // Fuse the vectors
  const fusedVector: AffectiveVector = {
    joy: Math.round(ruleBased.joy * weights.ruleBased + dcft.joy * weights.dcft),
    fear: Math.round(ruleBased.fear * weights.ruleBased + dcft.fear * weights.dcft),
    anger: Math.round(ruleBased.anger * weights.ruleBased + dcft.anger * weights.dcft),
    sadness: Math.round(ruleBased.sadness * weights.ruleBased + dcft.sadness * weights.dcft),
    hope: Math.round(ruleBased.hope * weights.ruleBased + dcft.hope * weights.dcft),
    curiosity: Math.round(ruleBased.curiosity * weights.ruleBased + dcft.curiosity * weights.dcft)
  };
  
  // Calculate derived metrics
  const dominantEmotion = findDominantEmotion(fusedVector);
  const emotionalIntensity = calculateIntensity(fusedVector);
  const valence = calculateValence(fusedVector);
  const arousal = calculateArousal(fusedVector);
  
  // Confidence based on context confidence and keyword matches
  const keywordConfidence = Object.values(fusedVector).filter(v => v > 20).length * 15;
  const confidence = Math.min(100, Math.round((context.confidence * 0.5) + (keywordConfidence * 0.5)));
  
  return {
    vector: fusedVector,
    dominantEmotion,
    emotionalIntensity,
    valence,
    arousal,
    confidence,
    sources: {
      ruleBased,
      dcft,
      weights
    }
  };
}

export default { fuseEmotions };
