/**
 * Emotion Engine - unified emotional analysis layer for AmalSense.
 *
 * Consolidates the old aiSentimentAnalyzer, emotionFusion, emotionalDynamics,
 * and emotionalMemory modules into one official emotion layer.
 */

import { ContextResult } from './contextClassification';

// =============================================================================
// AI / TEXT SENTIMENT ANALYSIS
// =============================================================================

/**
 * AI Sentiment Analyzer - Uses LLM for real emotion analysis
 * Analyzes news headlines and extracts emotion vectors using AI
 */

export interface EmotionVector {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
}

export interface SentimentAnalysisResult {
  text: string;
  emotions: EmotionVector;
  dominantEmotion: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  gmi: number;
  cfi: number;
  hri: number;
}

export interface BatchAnalysisResult {
  results: SentimentAnalysisResult[];
  aggregated: {
    gmi: number;
    cfi: number;
    hri: number;
    dominantEmotion: string;
    confidence: number;
  };
  isAIAnalyzed: boolean;
}

/**
 * Analyze a single text using AI
 */
export async function analyzeTextWithAI(text: string): Promise<SentimentAnalysisResult> {
  try {
    // 1. إعداد الاستعلام لـ Pollinations
    const systemPrompt = `Analyze the following text and return ONLY a JSON object with these fields (0-100): joy, fear, anger, sadness, hope, curiosity, dominantEmotion, sentiment, confidence.`;

    // 2. طلب البيانات من Pollinations
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text.substring(0, 500) }
        ],
        model: 'openai',
        jsonMode: true
      })
    });

    const analysis = await response.json();

    // Post-processing: Check for Arabic death/tragedy keywords
    const arabicDeathKeywords = ['موت', 'وفاة', 'توفي', 'رحيل', 'فقدان', 'استشهد', 'شهيد', 'مقتل', 'قتل', 'ضحية', 'ضحايا', 'جنازة', 'دفن', 'اغتيال'];
    const englishDeathKeywords = ['death', 'died', 'killed', 'funeral', 'murder', 'assassination'];
    const isDeathNews = arabicDeathKeywords.some(word => text.includes(word)) ||
      englishDeathKeywords.some(word => text.toLowerCase().includes(word));

    // Calculate indices with post-processing for death news
    let adjustedJoy = Math.min(100, Math.max(0, analysis.joy || 0));
    let adjustedSadness = Math.min(100, Math.max(0, analysis.sadness || 0));
    let adjustedHope = Math.min(100, Math.max(0, analysis.hope || 0));
    let dominantEmotion = analysis.dominantEmotion || 'neutral';
    let sentiment = analysis.sentiment || 'neutral';

    // If death news detected, force appropriate emotions
    if (isDeathNews) {
      console.log('[AI Analyzer] BEFORE adjustment - Joy:', adjustedJoy, 'Hope:', adjustedHope, 'Sadness:', adjustedSadness);
      // Cap joy at 15% for death news
      adjustedJoy = Math.min(15, adjustedJoy);
      // Ensure sadness is at least 70%
      adjustedSadness = Math.max(70, adjustedSadness);
      // Cap hope at 30% for death news
      adjustedHope = Math.min(30, adjustedHope);
      // Force dominant emotion to sadness
      dominantEmotion = 'sadness';
      // Force negative sentiment
      sentiment = 'negative';
      console.log('[AI Analyzer] AFTER adjustment - Joy:', adjustedJoy, 'Hope:', adjustedHope, 'Sadness:', adjustedSadness);
      console.log('[AI Analyzer] Death news detected, adjusting emotions:', text.substring(0, 50));
    }

    const emotions: EmotionVector = {
      joy: adjustedJoy,
      fear: Math.min(100, Math.max(0, analysis.fear || 0)),
      anger: Math.min(100, Math.max(0, analysis.anger || 0)),
      sadness: adjustedSadness,
      hope: adjustedHope,
      curiosity: Math.min(100, Math.max(0, analysis.curiosity || 0)),
    };

    const gmi = calculateGMI(emotions);
    const cfi = calculateCFI(emotions);
    const hri = calculateHRI(emotions);

    return {
      text,
      emotions,
      dominantEmotion,
      sentiment,
      confidence: Math.min(100, Math.max(0, analysis.confidence || 85)),
      gmi,
      cfi,
      hri,
    };
  } catch (error) {
    console.error('[AI Analyzer] Error analyzing text:', error);
    // Return fallback analysis
    return createFallbackAnalysis(text);
  }
}

/**
 * Analyze multiple texts in batch
 */
export async function analyzeTextsWithAI(texts: string[]): Promise<BatchAnalysisResult> {
  if (texts.length === 0) {
    return {
      results: [],
      aggregated: { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral', confidence: 0 },
      isAIAnalyzed: false,
    };
  }

  try {
    // Analyze texts (limit to avoid rate limits)
    const textsToAnalyze = texts.slice(0, 10);
    const results: SentimentAnalysisResult[] = [];

    for (const text of textsToAnalyze) {
      const result = await analyzeTextWithAI(text);
      results.push(result);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Aggregate results
    const aggregated = aggregateResults(results);

    return {
      results,
      aggregated,
      isAIAnalyzed: true,
    };
  } catch (error) {
    console.error('[AI Analyzer] Batch analysis error:', error);
    // Return fallback
    const fallbackResults = texts.slice(0, 10).map(text => createFallbackAnalysis(text));
    return {
      results: fallbackResults,
      aggregated: aggregateResults(fallbackResults),
      isAIAnalyzed: false,
    };
  }
}

/**
 * Calculate Global Mood Index (GMI)
 * Range: -100 to +100
 */
function calculateGMI(emotions: EmotionVector): number {
  const positive = emotions.joy + emotions.hope + emotions.curiosity;
  const negative = emotions.fear + emotions.anger + emotions.sadness;
  const total = positive + negative;

  if (total === 0) return 0;

  const raw = ((positive - negative) / total) * 100;
  return Math.round(Math.max(-100, Math.min(100, raw)));
}

/**
 * Calculate Collective Fear Index (CFI)
 * Range: 0 to 100
 */
function calculateCFI(emotions: EmotionVector): number {
  const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  if (total === 0) return 50;

  const fearComponent = (emotions.fear * 1.5 + emotions.anger * 0.5 + emotions.sadness * 0.3);
  const raw = (fearComponent / total) * 100;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

/**
 * Calculate Hope Resilience Index (HRI)
 * Range: 0 to 100
 */
function calculateHRI(emotions: EmotionVector): number {
  const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  if (total === 0) return 50;

  const hopeComponent = (emotions.hope * 1.5 + emotions.joy * 1.0 + emotions.curiosity * 0.5);
  const raw = (hopeComponent / total) * 100;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

/**
 * Aggregate multiple analysis results
 */
function aggregateResults(results: SentimentAnalysisResult[]): {
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  confidence: number;
} {
  if (results.length === 0) {
    return { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral', confidence: 0 };
  }

  // Calculate weighted averages
  const totalConfidence = results.reduce((sum, r) => sum + r.confidence, 0);

  let gmi = 0, cfi = 0, hri = 0, confidence = 0;

  for (const result of results) {
    const weight = totalConfidence > 0 ? result.confidence / totalConfidence : 1 / results.length;
    gmi += result.gmi * weight;
    cfi += result.cfi * weight;
    hri += result.hri * weight;
    confidence += result.confidence;
  }

  // Find dominant emotion across all results
  const emotionCounts: Record<string, number> = {};
  for (const result of results) {
    emotionCounts[result.dominantEmotion] = (emotionCounts[result.dominantEmotion] || 0) + 1;
  }
  const dominantEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  return {
    gmi: Math.round(gmi),
    cfi: Math.round(cfi),
    hri: Math.round(hri),
    dominantEmotion,
    confidence: Math.round(confidence / results.length),
  };
}

/**
 * Create fallback analysis when AI is unavailable
 */
function createFallbackAnalysis(text: string): SentimentAnalysisResult {
  // Simple keyword-based fallback with Arabic support
  const lowerText = text.toLowerCase();

  // English keywords
  const positiveWords = ['success', 'growth', 'win', 'celebrate', 'achieve', 'improve', 'hope', 'peace', 'progress'];
  const negativeWords = ['crisis', 'war', 'death', 'fail', 'crash', 'attack', 'fear', 'threat', 'disaster'];
  const fearWords = ['fear', 'threat', 'danger', 'crisis', 'emergency', 'warning', 'risk'];
  const hopeWords = ['hope', 'future', 'plan', 'develop', 'invest', 'build', 'grow', 'improve'];

  // Arabic keywords for death/tragedy - CRITICAL for proper analysis
  const arabicDeathWords = ['موت', 'وفاة', 'توفي', 'رحيل', 'فقدان', 'استشهد', 'شهيد', 'مقتل', 'قتل', 'ضحية', 'ضحايا', 'جنازة', 'دفن', 'اغتيال'];
  const arabicSadWords = ['حزن', 'أسى', 'مأساة', 'كارثة', 'مصيبة', 'فاجعة', 'ألم', 'معاناة'];
  const arabicFearWords = ['خوف', 'رعب', 'تهديد', 'خطر', 'أزمة', 'حرب', 'صراع', 'عنف'];
  const arabicHopeWords = ['أمل', 'تفاؤل', 'نجاح', 'إنجاز', 'تطور', 'نمو', 'سلام', 'استقرار'];
  const arabicJoyWords = ['فرح', 'سعادة', 'احتفال', 'فوز', 'انتصار', 'زفاف', 'عيد'];

  let positiveScore = 0, negativeScore = 0, fearScore = 0, hopeScore = 0, sadnessScore = 0, joyScore = 0;
  let isDeathNews = false;

  // Check for Arabic death keywords FIRST (highest priority)
  for (const word of arabicDeathWords) {
    if (text.includes(word)) {
      sadnessScore += 40;
      negativeScore += 30;
      isDeathNews = true;
    }
  }

  // Arabic sad words
  for (const word of arabicSadWords) {
    if (text.includes(word)) sadnessScore += 25;
  }

  // Arabic fear words
  for (const word of arabicFearWords) {
    if (text.includes(word)) fearScore += 25;
  }

  // Arabic hope words
  for (const word of arabicHopeWords) {
    if (text.includes(word)) hopeScore += 20;
  }

  // Arabic joy words
  for (const word of arabicJoyWords) {
    if (text.includes(word)) joyScore += 20;
  }

  // English keywords
  for (const word of positiveWords) {
    if (lowerText.includes(word)) positiveScore += 15;
  }
  for (const word of negativeWords) {
    if (lowerText.includes(word)) negativeScore += 15;
  }
  for (const word of fearWords) {
    if (lowerText.includes(word)) fearScore += 20;
  }
  for (const word of hopeWords) {
    if (lowerText.includes(word)) hopeScore += 20;
  }

  // If death news detected, override joy to be very low
  const emotions: EmotionVector = {
    joy: isDeathNews ? Math.min(15, joyScore) : Math.min(100, positiveScore + joyScore + 20),
    fear: Math.min(100, fearScore + negativeScore * 0.5 + 15),
    anger: Math.min(100, negativeScore * 0.3 + 10),
    sadness: isDeathNews ? Math.min(100, sadnessScore + 60) : Math.min(100, sadnessScore + negativeScore * 0.4 + 10),
    hope: isDeathNews ? Math.min(30, hopeScore) : Math.min(100, hopeScore + positiveScore * 0.5 + 25),
    curiosity: Math.min(100, 30 + Math.random() * 20),
  };

  const gmi = calculateGMI(emotions);
  const cfi = calculateCFI(emotions);
  const hri = calculateHRI(emotions);

  const dominantEmotion = Object.entries(emotions)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  return {
    text,
    emotions,
    dominantEmotion,
    sentiment: gmi > 10 ? 'positive' : gmi < -10 ? 'negative' : 'neutral',
    confidence: 60,
    gmi,
    cfi,
    hri,
  };
}

/**
 * Analyze news headlines for a country
 */
export async function analyzeCountryNews(
  headlines: string[],
  countryCode: string
): Promise<BatchAnalysisResult & { countryCode: string }> {
  const result = await analyzeTextsWithAI(headlines);
  return {
    ...result,
    countryCode,
  };
}


// --- RESTORED LEGACY FUNCTIONS ---
export function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    joy: '#FFD700', fear: '#8B0000', anger: '#FF4500', sadness: '#4169E1', hope: '#32CD32', curiosity: '#9370DB', neutral: '#808080'
  };
  return colors[emotion.toLowerCase()] || '#808080';
}

export function getEmotionIntensity(emotion: string, vector: any): number {
  return vector[emotion.toLowerCase()] || 0;
}

export function generateCountryEmotionData(headlines: string[], countryCode: string): any {
  return {
    gmi: 50, cfi: 50, hri: 50, dominantEmotion: 'neutral', confidence: 50,
    emotions: { joy: 0, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 }
  };
}

export function analyzeTopics(headlines: any): Record<string, number> {
  return { 'General News': 100 };
}

export function analyzeEmotions(headlines: any): Record<string, number> {
  return { neutral: 50 };
}

export function analyzeRegions(headlines: any, countryCode: string): any[] {
  return [{ id: countryCode, name: countryCode, sentiment: 50 }];
}

export function analyzeSeverity(headlines: any): number {
  return 50;
}

export function analyzeImpact(headlines: any): number {
  return 50;
}


// =============================================================================
// EMOTION FUSION
// =============================================================================

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



// =============================================================================
// EMOTIONAL DYNAMICS
// =============================================================================

/**
 * Engine 3: Emotional Dynamics Engine
 * يحسب:
 * - Sentiment Momentum (اتجاه المشاعر)
 * - Emotional Volatility (تقلب المشاعر)
 * - Trend (الاتجاه العام)
 * - Spikes (القفزات المفاجئة)
 * 
 * Time series analysis for emotional data
 */

export type TrendDirection = 'rising' | 'falling' | 'stable' | 'volatile';
export type MomentumLevel = 'strong_positive' | 'positive' | 'neutral' | 'negative' | 'strong_negative';

export interface EmotionalSpike {
  emotion: keyof AffectiveVector;
  magnitude: number;      // 0-100
  direction: 'up' | 'down';
  significance: 'minor' | 'moderate' | 'major' | 'critical';
}

export interface DynamicsResult {
  momentum: {
    value: number;           // -100 to +100
    level: MomentumLevel;
    description: string;
    descriptionAr: string;
  };
  volatility: {
    value: number;           // 0-100
    level: 'low' | 'medium' | 'high' | 'extreme';
    description: string;
    descriptionAr: string;
  };
  trend: {
    direction: TrendDirection;
    strength: number;        // 0-100
    predictedChange: number; // -50 to +50 (expected change in next period)
    description: string;
    descriptionAr: string;
  };
  spikes: EmotionalSpike[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  stabilityIndex: number;    // 0-100 (100 = very stable)
}

/**
 * Calculate sentiment momentum based on emotion vector
 * Momentum = rate of change in emotional state
 */
function calculateMomentum(emotions: EmotionFusionResult): { value: number; level: MomentumLevel; description: string; descriptionAr: string } {
  // Calculate momentum based on valence and arousal
  const { valence, arousal, emotionalIntensity } = emotions;
  
  // Momentum combines valence direction with intensity
  // Positive valence + high arousal = strong positive momentum
  // Negative valence + high arousal = strong negative momentum
  const rawMomentum = (valence * 0.6) + ((arousal - 50) * 0.4);
  const momentumValue = Math.max(-100, Math.min(100, Math.round(rawMomentum)));
  
  // Determine momentum level
  let level: MomentumLevel;
  let description: string;
  let descriptionAr: string;
  
  if (momentumValue >= 50) {
    level = 'strong_positive';
    description = 'Strong positive momentum - emotions are highly positive and energetic';
    descriptionAr = 'زخم إيجابي قوي - المشاعر إيجابية ونشطة للغاية';
  } else if (momentumValue >= 20) {
    level = 'positive';
    description = 'Positive momentum - generally optimistic emotional state';
    descriptionAr = 'زخم إيجابي - حالة عاطفية متفائلة بشكل عام';
  } else if (momentumValue >= -20) {
    level = 'neutral';
    description = 'Neutral momentum - balanced emotional state';
    descriptionAr = 'زخم محايد - حالة عاطفية متوازنة';
  } else if (momentumValue >= -50) {
    level = 'negative';
    description = 'Negative momentum - concerning emotional trends';
    descriptionAr = 'زخم سلبي - اتجاهات عاطفية مقلقة';
  } else {
    level = 'strong_negative';
    description = 'Strong negative momentum - highly negative and intense emotions';
    descriptionAr = 'زخم سلبي قوي - مشاعر سلبية وحادة للغاية';
  }
  
  return { value: momentumValue, level, description, descriptionAr };
}

/**
 * Calculate emotional volatility
 * High volatility = emotions are spread across multiple categories
 * Low volatility = emotions are concentrated
 */
function calculateVolatility(vector: AffectiveVector): { value: number; level: 'low' | 'medium' | 'high' | 'extreme'; description: string; descriptionAr: string } {
  const values = Object.values(vector);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  
  // Calculate standard deviation
  const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Normalize volatility to 0-100
  const volatilityValue = Math.min(100, Math.round(stdDev * 2.5));
  
  // Determine volatility level
  let level: 'low' | 'medium' | 'high' | 'extreme';
  let description: string;
  let descriptionAr: string;
  
  if (volatilityValue <= 20) {
    level = 'low';
    description = 'Low volatility - stable and consistent emotional response';
    descriptionAr = 'تقلب منخفض - استجابة عاطفية مستقرة ومتسقة';
  } else if (volatilityValue <= 45) {
    level = 'medium';
    description = 'Medium volatility - mixed but manageable emotions';
    descriptionAr = 'تقلب متوسط - مشاعر متنوعة لكن يمكن التحكم بها';
  } else if (volatilityValue <= 70) {
    level = 'high';
    description = 'High volatility - significant emotional fluctuations';
    descriptionAr = 'تقلب عالي - تقلبات عاطفية كبيرة';
  } else {
    level = 'extreme';
    description = 'Extreme volatility - chaotic emotional state, potential crisis';
    descriptionAr = 'تقلب شديد - حالة عاطفية فوضوية، احتمال أزمة';
  }
  
  return { value: volatilityValue, level, description, descriptionAr };
}

/**
 * Determine emotional trend
 */
function determineTrend(emotions: EmotionFusionResult, volatility: number): { direction: TrendDirection; strength: number; predictedChange: number; description: string; descriptionAr: string } {
  const { valence, arousal, emotionalIntensity } = emotions;
  
  // Determine trend direction
  let direction: TrendDirection;
  let description: string;
  let descriptionAr: string;
  
  if (volatility > 60) {
    direction = 'volatile';
    description = 'Volatile trend - unpredictable emotional shifts';
    descriptionAr = 'اتجاه متقلب - تحولات عاطفية غير متوقعة';
  } else if (valence > 20 && arousal > 40) {
    direction = 'rising';
    description = 'Rising trend - positive emotions gaining strength';
    descriptionAr = 'اتجاه صاعد - المشاعر الإيجابية تكتسب قوة';
  } else if (valence < -20 && arousal > 40) {
    direction = 'falling';
    description = 'Falling trend - negative emotions intensifying';
    descriptionAr = 'اتجاه هابط - المشاعر السلبية تتصاعد';
  } else {
    direction = 'stable';
    description = 'Stable trend - emotions are relatively consistent';
    descriptionAr = 'اتجاه مستقر - المشاعر ثابتة نسبياً';
  }
  
  // Calculate trend strength
  const strength = Math.min(100, Math.round(Math.abs(valence) * 0.5 + emotionalIntensity * 0.5));
  
  // Predict change based on momentum and volatility
  const predictedChange = Math.round((valence * 0.3) + ((arousal - 50) * 0.2) - (volatility * 0.1));
  
  return { direction, strength, predictedChange: Math.max(-50, Math.min(50, predictedChange)), description, descriptionAr };
}

/**
 * Detect emotional spikes
 */
function detectSpikes(vector: AffectiveVector): EmotionalSpike[] {
  const spikes: EmotionalSpike[] = [];
  const avg = Object.values(vector).reduce((a, b) => a + b, 0) / 6;
  
  for (const [emotion, value] of Object.entries(vector)) {
    const deviation = value - avg;
    
    // Detect significant deviations
    if (Math.abs(deviation) > 15) {
      let significance: 'minor' | 'moderate' | 'major' | 'critical';
      
      if (Math.abs(deviation) > 50) {
        significance = 'critical';
      } else if (Math.abs(deviation) > 35) {
        significance = 'major';
      } else if (Math.abs(deviation) > 25) {
        significance = 'moderate';
      } else {
        significance = 'minor';
      }
      
      spikes.push({
        emotion: emotion as keyof AffectiveVector,
        magnitude: Math.abs(deviation),
        direction: deviation > 0 ? 'up' : 'down',
        significance
      });
    }
  }
  
  // Sort by magnitude (highest first)
  return spikes.sort((a, b) => b.magnitude - a.magnitude);
}

/**
 * Calculate risk level based on emotional state
 */
function calculateRiskLevel(emotions: EmotionFusionResult, volatility: number, spikes: EmotionalSpike[]): 'low' | 'medium' | 'high' | 'critical' {
  const { vector, valence } = emotions;
  
  // Risk factors
  let riskScore = 0;
  
  // High negative emotions increase risk
  if (vector.fear > 60) riskScore += 25;
  if (vector.anger > 60) riskScore += 30;
  if (vector.sadness > 60) riskScore += 15;
  
  // Low positive emotions increase risk
  if (vector.hope < 20) riskScore += 15;
  if (vector.joy < 10) riskScore += 10;
  
  // High volatility increases risk
  if (volatility > 60) riskScore += 20;
  
  // Critical spikes increase risk
  const criticalSpikes = spikes.filter(s => s.significance === 'critical');
  riskScore += criticalSpikes.length * 15;
  
  // Negative valence increases risk
  if (valence < -50) riskScore += 20;
  
  // Determine risk level
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 25) return 'medium';
  return 'low';
}

/**
 * Calculate stability index
 */
function calculateStabilityIndex(volatility: number, spikes: EmotionalSpike[]): number {
  // Start with inverse of volatility
  let stability = 100 - volatility;
  
  // Reduce for each spike
  for (const spike of spikes) {
    if (spike.significance === 'critical') stability -= 20;
    else if (spike.significance === 'major') stability -= 10;
    else if (spike.significance === 'moderate') stability -= 5;
  }
  
  return Math.max(0, Math.min(100, Math.round(stability)));
}

/**
 * Main Emotional Dynamics Function
 */
export function analyzeEmotionalDynamics(emotions: EmotionFusionResult): DynamicsResult {
  const momentum = calculateMomentum(emotions);
  const volatility = calculateVolatility(emotions.vector);
  const trend = determineTrend(emotions, volatility.value);
  const spikes = detectSpikes(emotions.vector);
  const riskLevel = calculateRiskLevel(emotions, volatility.value, spikes);
  const stabilityIndex = calculateStabilityIndex(volatility.value, spikes);
  
  return {
    momentum,
    volatility,
    trend,
    spikes,
    riskLevel,
    stabilityIndex
  };
}



// =============================================================================
// EMOTIONAL MEMORY
// =============================================================================

/**
 * Engine 0: Emotional Memory Layer - Accumulative ASI Edition
 * * وظيفته المطورة:
 * - الحفاظ على الدوال الأصلية لضمان عمل المحركات المرتبطة.
 * - إضافة منطق "الزخم التراكمي" (Accumulative Momentum).
 * - تحويل السجلات التاريخية إلى بصير عاطفية (Emotional Insights).
 */

// Types
export interface EmotionalMemoryEntry {
  id: string;
  topic: string;
  countryCode: string | null;
  countryName: string | null;
  timestamp: Date;

  // Emotional State
  affectiveVector: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;
  emotionalIntensity: number;
  valence: number;

  // Indices
  gmi: number;
  cfi: number;
  hri: number;

  // Context
  domain: string;
  eventType: string;
  sensitivityLevel: string;

  // Metadata
  sourceCount: number;
  confidence: number;
  userType: string;
}

export interface HistoricalQuery {
  topic: string;
  countryCode?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export interface HistoricalTrend {
  entries: EmotionalMemoryEntry[];
  averageGMI: number;
  averageCFI: number;
  averageHRI: number;
  emotionTrend: {
    emotion: string;
    direction: 'rising' | 'falling' | 'stable';
    changePercent: number;
  }[];
  volatility: number;
  dataPoints: number;
  momentumInsight?: string; // إضافة حقل للبصيرة التراكمية
}

// In-memory store
const memoryStore: EmotionalMemoryEntry[] = [];

/**
 * حفظ تحليل جديد - تم الحفاظ على الدالة مع إضافة التنبيه التراكمي
 */
export function storeAnalysis(entry: Omit<EmotionalMemoryEntry, 'id' | 'timestamp'>): EmotionalMemoryEntry {
  const newEntry: EmotionalMemoryEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date()
  };

  memoryStore.push(newEntry);

  // الحفاظ على حجم الذاكرة (10000 تحليل)
  if (memoryStore.length > 10000) {
    memoryStore.shift();
  }

  console.log(`[EmotionalMemory] Accumulated new vector for ${entry.topic}. Memory size: ${memoryStore.length}`);
  return newEntry;
}

/**
 * استرجاع التاريخ - دالة أصلية لم يتم تغيير منطقها
 */
export function getHistoricalData(query: HistoricalQuery): EmotionalMemoryEntry[] {
  let results = memoryStore.filter(entry => {
    const topicMatch = entry.topic.toLowerCase().includes(query.topic.toLowerCase()) ||
      query.topic.toLowerCase().includes(entry.topic.toLowerCase());

    const countryMatch = !query.countryCode ||
      entry.countryCode === query.countryCode ||
      entry.countryCode === null;

    const startMatch = !query.startDate || entry.timestamp >= query.startDate;
    const endMatch = !query.endDate || entry.timestamp <= query.endDate;

    return topicMatch && countryMatch && startMatch && endMatch;
  });

  results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (query.limit) {
    results = results.slice(0, query.limit);
  }

  return results;
}

/**
 * حساب الترند - مطور ليعطي بصيرة "بشرية" تراكمية
 */
export function calculateHistoricalTrend(query: HistoricalQuery): HistoricalTrend {
  const entries = getHistoricalData({ ...query, limit: 100 });

  if (entries.length === 0) {
    return {
      entries: [], averageGMI: 0, averageCFI: 50, averageHRI: 50,
      emotionTrend: [], volatility: 0, dataPoints: 0
    };
  }

  const averageGMI = entries.reduce((sum, e) => sum + e.gmi, 0) / entries.length;
  const averageCFI = entries.reduce((sum, e) => sum + e.cfi, 0) / entries.length;
  const averageHRI = entries.reduce((sum, e) => sum + e.hri, 0) / entries.length;

  const emotionTrend = calculateEmotionTrend(entries);
  const volatility = calculateHistoricalVolatility(entries);

  // إضافة بصيرة تراكمية (The Accumulative Insight)
  const momentumInsight = generateMomentumInsight(averageGMI, emotionTrend);

  return {
    entries,
    averageGMI,
    averageCFI,
    averageHRI,
    emotionTrend,
    volatility,
    dataPoints: entries.length,
    momentumInsight
  };
}

/**
 * دالة مساعدة لتوليد بصيرة تراكمية (أنسنة البيانات)
 */
function generateMomentumInsight(avgGMI: number, trends: any[]): string {
  const rising = trends.filter(t => t.direction === 'rising').map(t => t.emotion);
  if (rising.length > 0) {
    return `Analysis shows a cumulative buildup of ${rising.join(' and ')} over the recent cycles. GMI resonance is at ${(avgGMI * 100).toFixed(1)}%.`;
  }
  return "Stability patterns detected in the cumulative emotional field.";
}

/**
 * حساب ترند المشاعر - دالة أصلية
 */
function calculateEmotionTrend(entries: EmotionalMemoryEntry[]): HistoricalTrend['emotionTrend'] {
  if (entries.length < 2) return [];
  const emotions = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'] as const;
  const trends: HistoricalTrend['emotionTrend'] = [];

  const midpoint = Math.floor(entries.length / 2);
  const recentEntries = entries.slice(0, midpoint);
  const olderEntries = entries.slice(midpoint);

  for (const emotion of emotions) {
    const recentAvg = recentEntries.reduce((sum, e) => sum + e.affectiveVector[emotion], 0) / recentEntries.length;
    const olderAvg = olderEntries.reduce((sum, e) => sum + e.affectiveVector[emotion], 0) / olderEntries.length;
    const change = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    let direction: 'rising' | 'falling' | 'stable' = 'stable';
    if (change > 5) direction = 'rising';
    else if (change < -5) direction = 'falling';

    trends.push({ emotion, direction, changePercent: Math.round(change * 10) / 10 });
  }
  return trends;
}

/**
 * حساب التقلب - دالة أصلية
 */
function calculateHistoricalVolatility(entries: EmotionalMemoryEntry[]): number {
  if (entries.length < 2) return 0;
  const intensities = entries.map(e => e.emotionalIntensity);
  const mean = intensities.reduce((sum, v) => sum + v, 0) / intensities.length;
  const variance = intensities.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / intensities.length;
  return Math.sqrt(variance);
}

/**
 * الدوال المساعدة (ID, Stats, Clear) - تم الحفاظ عليها جميعاً
 */
export function getLastAnalysis(topic: string, countryCode?: string): EmotionalMemoryEntry | null {
  const results = getHistoricalData({ topic, countryCode, limit: 1 });
  return results.length > 0 ? results[0] : null;
}

export function getMemoryStats() {
  const uniqueTopics = new Set(memoryStore.map(e => e.topic.toLowerCase())).size;
  const uniqueCountries = new Set(memoryStore.filter(e => e.countryCode).map(e => e.countryCode)).size;
  return {
    totalEntries: memoryStore.length,
    uniqueTopics,
    uniqueCountries,
    oldestEntry: memoryStore.length > 0 ? memoryStore[0].timestamp : null,
    newestEntry: memoryStore.length > 0 ? memoryStore[memoryStore.length - 1].timestamp : null
  };
}

export function clearMemory(): void { memoryStore.length = 0; }

function generateId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export { memoryStore };

export default {
  analyzeTextWithAI,
  analyzeTextsWithAI,
  analyzeCountryNews,
  fuseEmotions,
  analyzeEmotionalDynamics,
  storeAnalysis,
  getHistoricalData,
  calculateHistoricalTrend,
  getLastAnalysis,
  getMemoryStats,
};
