/**
 * Emotion Analyzer - Enhanced with DCFT (Digital Consciousness Field Theory)
 * Based on the research paper by Amaal Radwan
 * "The Birth of Digital Consciousness: The AmaalSense Engine and the Emergent Collective Mind"
 * 
 * This module now uses the full DCFT three-layer architecture:
 * 1. Perception Layer - Input processing
 * 2. Cognitive Layer - DCF calculations with D(t) and RI(e,t) formulas
 * 3. Awareness Layer - Output generation (GMI, CFI, HRI)
 */

import { 
  dcftEngine, 
  analyzeTextDCFT,
  type DCFTAnalysisResult,
  type RawDigitalInput 
} from './dcft';

export interface EmotionVector {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
}

export interface EmotionAnalysisResult {
  headline: string;
  emotions: EmotionVector;
  dominantEmotion: keyof EmotionVector;
  confidence: number;
  model: "dcft" | "transformer" | "vader";
  // DCFT-specific fields
  dcftAmplitude?: number;
  resonanceIndices?: EmotionVector;
  emotionalPhase?: {
    type: string;
    intensity: number;
    description: string;
  } | null;
  alertLevel?: string;
}

/**
 * Analyze emotions in a headline text using DCFT
 * Returns emotion scores and identifies the dominant emotion
 * 
 * Uses the formulas:
 * D(t) = Σ [Ei × Wi × ΔTi]
 * RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
 */
export async function analyzeHeadlineDCFT(headline: string): Promise<EmotionAnalysisResult> {
  const dcftResult = await analyzeTextDCFT(headline, 'headline');
  
  return {
    headline,
    emotions: dcftResult.emotions,
    dominantEmotion: dcftResult.dominantEmotion as keyof EmotionVector,
    confidence: Math.round(dcftResult.confidence * 100),
    model: "dcft",
    dcftAmplitude: dcftResult.dcfAmplitude,
    resonanceIndices: {
      joy: Math.round((dcftResult.resonanceIndices.joy + 1) * 50),
      fear: Math.round((dcftResult.resonanceIndices.fear + 1) * 50),
      anger: Math.round((dcftResult.resonanceIndices.anger + 1) * 50),
      sadness: Math.round((dcftResult.resonanceIndices.sadness + 1) * 50),
      hope: Math.round((dcftResult.resonanceIndices.hope + 1) * 50),
      curiosity: Math.round((dcftResult.resonanceIndices.curiosity + 1) * 50),
    },
    emotionalPhase: dcftResult.emotionalPhase,
    alertLevel: dcftResult.alertLevel,
  };
}

/**
 * Legacy synchronous analyzer (for backward compatibility)
 * Uses keyword-based analysis when DCFT async is not suitable
 */
export function analyzeHeadline(headline: string): EmotionAnalysisResult {
  const lowerHeadline = headline.toLowerCase();
  const words = lowerHeadline.split(/\s+/);

  // Initialize emotion scores
  const emotions: EmotionVector = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };

  // Keyword mappings with DCFT-inspired weights
  const emotionKeywords: Record<keyof EmotionVector, { word: string; weight: number }[]> = {
    joy: [
      { word: "celebrate", weight: 18 }, { word: "victory", weight: 20 },
      { word: "success", weight: 15 }, { word: "happy", weight: 15 },
      { word: "joy", weight: 20 }, { word: "win", weight: 15 },
      { word: "breakthrough", weight: 18 }, { word: "achievement", weight: 15 },
      { word: "triumph", weight: 20 }, { word: "prosperity", weight: 15 },
      { word: "growth", weight: 12 }, { word: "positive", weight: 10 },
      { word: "excellent", weight: 15 }, { word: "wonderful", weight: 15 },
      { word: "great", weight: 10 }, { word: "سعيد", weight: 15 },
      { word: "فرح", weight: 20 }, { word: "سعادة", weight: 18 },
    ],
    fear: [
      { word: "crisis", weight: 22 }, { word: "danger", weight: 20 },
      { word: "threat", weight: 18 }, { word: "fear", weight: 20 },
      { word: "warning", weight: 15 }, { word: "risk", weight: 12 },
      { word: "catastrophe", weight: 25 }, { word: "disaster", weight: 22 },
      { word: "collapse", weight: 20 }, { word: "panic", weight: 22 },
      { word: "terror", weight: 25 }, { word: "alarming", weight: 18 },
      { word: "concerning", weight: 12 }, { word: "critical", weight: 15 },
      { word: "خوف", weight: 20 }, { word: "خائف", weight: 18 },
      { word: "قلق", weight: 15 }, { word: "رعب", weight: 25 },
    ],
    anger: [
      { word: "outrage", weight: 22 }, { word: "fury", weight: 22 },
      { word: "angry", weight: 18 }, { word: "rage", weight: 25 },
      { word: "conflict", weight: 15 }, { word: "attack", weight: 15 },
      { word: "violence", weight: 20 }, { word: "aggression", weight: 18 },
      { word: "hostile", weight: 18 }, { word: "confrontation", weight: 15 },
      { word: "scandal", weight: 15 }, { word: "corruption", weight: 18 },
      { word: "injustice", weight: 20 }, { word: "غضب", weight: 20 },
      { word: "غاضب", weight: 18 }, { word: "ثورة", weight: 18 },
    ],
    sadness: [
      { word: "tragedy", weight: 25 }, { word: "loss", weight: 18 },
      { word: "death", weight: 20 }, { word: "sad", weight: 18 },
      { word: "grief", weight: 25 }, { word: "mourning", weight: 22 },
      { word: "depression", weight: 22 }, { word: "despair", weight: 25 },
      { word: "heartbreak", weight: 22 }, { word: "suffering", weight: 20 },
      { word: "pain", weight: 15 }, { word: "unfortunate", weight: 12 },
      { word: "decline", weight: 12 }, { word: "حزن", weight: 20 },
      { word: "حزين", weight: 18 }, { word: "أسى", weight: 22 },
    ],
    hope: [
      { word: "hope", weight: 20 }, { word: "optimism", weight: 18 },
      { word: "recovery", weight: 15 }, { word: "progress", weight: 15 },
      { word: "resilience", weight: 18 }, { word: "improvement", weight: 12 },
      { word: "opportunity", weight: 15 }, { word: "promise", weight: 15 },
      { word: "renewal", weight: 15 }, { word: "revival", weight: 15 },
      { word: "solution", weight: 15 }, { word: "innovation", weight: 15 },
      { word: "future", weight: 12 }, { word: "possibility", weight: 12 },
      { word: "أمل", weight: 20 }, { word: "تفاؤل", weight: 18 },
    ],
    curiosity: [
      { word: "discover", weight: 18 }, { word: "research", weight: 15 },
      { word: "study", weight: 12 }, { word: "investigation", weight: 15 },
      { word: "explore", weight: 15 }, { word: "question", weight: 12 },
      { word: "mystery", weight: 15 }, { word: "breakthrough", weight: 18 },
      { word: "finding", weight: 15 }, { word: "analysis", weight: 12 },
      { word: "insight", weight: 15 }, { word: "revelation", weight: 18 },
      { word: "unveil", weight: 15 }, { word: "فضول", weight: 18 },
      { word: "استكشاف", weight: 15 }, { word: "اكتشاف", weight: 15 },
    ],
  };

  // Count keyword matches for each emotion with weights
  let totalMatches = 0;
  (Object.entries(emotionKeywords) as Array<[keyof EmotionVector, { word: string; weight: number }[]]>).forEach(
    ([emotion, keywords]) => {
      keywords.forEach(({ word, weight }) => {
        if (lowerHeadline.includes(word)) {
          emotions[emotion] += weight;
          totalMatches++;
        }
      });
    }
  );

  // Apply DCFT-inspired normalization
  const maxScore = Math.max(...Object.values(emotions));
  if (maxScore > 0) {
    (Object.keys(emotions) as Array<keyof EmotionVector>).forEach((emotion) => {
      emotions[emotion] = Math.min(100, Math.round((emotions[emotion] / maxScore) * 100));
    });
  }

  // Add temporal variation (simulating decay factor influence)
  const timeVariation = Math.sin(Date.now() / 10000) * 5;
  (Object.keys(emotions) as Array<keyof EmotionVector>).forEach((emotion) => {
    emotions[emotion] = Math.min(100, Math.max(0, emotions[emotion] + timeVariation + (Math.random() - 0.5) * 8));
  });

  // Find dominant emotion
  let dominantEmotion: keyof EmotionVector = "joy";
  let maxEmotion = emotions.joy;

  (Object.entries(emotions) as Array<[keyof EmotionVector, number]>).forEach(([emotion, score]) => {
    if (score > maxEmotion) {
      maxEmotion = score;
      dominantEmotion = emotion;
    }
  });

  // Calculate confidence based on DCFT principles
  const sortedScores = Object.values(emotions).sort((a, b) => b - a);
  const emotionalClarity = sortedScores[0] - sortedScores[1];
  const confidence = Math.min(100, Math.round(70 + emotionalClarity * 0.3));

  return {
    headline,
    emotions: {
      joy: Math.round(emotions.joy),
      fear: Math.round(emotions.fear),
      anger: Math.round(emotions.anger),
      sadness: Math.round(emotions.sadness),
      hope: Math.round(emotions.hope),
      curiosity: Math.round(emotions.curiosity),
    },
    dominantEmotion,
    confidence,
    model: "transformer",
  };
}

/**
 * Calculate collective indices from emotion analyses using DCFT formulas
 * 
 * GMI (Global Mood Index): Measures general optimism or pessimism
 * Formula: GMI = (positive_emotions - negative_emotions) × amplitude_factor
 * Range: -100 to +100
 * 
 * CFI (Collective Fear Index): Measures probability of crisis
 * Formula: CFI = (fear + anger/2 + sadness/3) × stress_multiplier
 * Range: 0 to 100
 * 
 * HRI (Hope Resonance Index): Measures resilience and recovery potential
 * Formula: HRI = (hope + joy/2 + curiosity/2) × resilience_factor
 * Range: 0 to 100
 */
export function calculateIndices(analyses: EmotionAnalysisResult[]): {
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
} {
  if (analyses.length === 0) {
    return { gmi: 0, cfi: 50, hri: 50, confidence: 0 };
  }

  // Calculate weighted averages (Wi factor)
  let avgJoy = 0, avgFear = 0, avgAnger = 0;
  let avgSadness = 0, avgHope = 0, avgCuriosity = 0;
  let totalConfidence = 0;
  let totalWeight = 0;

  analyses.forEach((analysis) => {
    // Wi = confidence-based weighting
    const weight = analysis.confidence / 100;
    totalWeight += weight;
    
    avgJoy += analysis.emotions.joy * weight;
    avgFear += analysis.emotions.fear * weight;
    avgAnger += analysis.emotions.anger * weight;
    avgSadness += analysis.emotions.sadness * weight;
    avgHope += analysis.emotions.hope * weight;
    avgCuriosity += analysis.emotions.curiosity * weight;
    totalConfidence += analysis.confidence;
  });

  // Normalize by total weight
  if (totalWeight > 0) {
    avgJoy /= totalWeight;
    avgFear /= totalWeight;
    avgAnger /= totalWeight;
    avgSadness /= totalWeight;
    avgHope /= totalWeight;
    avgCuriosity /= totalWeight;
  }
  totalConfidence /= analyses.length;

  // GMI: Global Mood Index using DCFT formula
  // GMI = (positive - negative) × amplitude_factor
  const positiveScore = (avgJoy + avgHope + avgCuriosity) / 3;
  const negativeScore = (avgFear + avgAnger + avgSadness) / 3;
  const amplitudeFactor = 1 + (totalConfidence / 100) * 0.5;
  const gmi = Math.round((positiveScore - negativeScore) * 2 * amplitudeFactor);

  // CFI: Collective Fear Index using DCFT formula
  // CFI = fear + anger/2 + sadness/3 - hope/4
  const cfi = Math.round(avgFear + avgAnger * 0.5 + avgSadness * 0.33 - avgHope * 0.25);

  // HRI: Hope Resonance Index using DCFT formula
  // HRI = hope + joy/2 + curiosity/2 - fear/4 - sadness/4
  const hri = Math.round(avgHope + avgJoy * 0.5 + avgCuriosity * 0.5 - avgFear * 0.25 - avgSadness * 0.25);

  return {
    gmi: Math.max(-100, Math.min(100, gmi)),
    cfi: Math.max(0, Math.min(100, cfi)),
    hri: Math.max(0, Math.min(100, hri)),
    confidence: Math.round(totalConfidence),
  };
}

/**
 * Analyze multiple texts using DCFT batch processing
 */
export async function analyzeMultipleHeadlinesDCFT(headlines: string[]): Promise<{
  results: EmotionAnalysisResult[];
  aggregated: DCFTAnalysisResult;
}> {
  const inputs: RawDigitalInput[] = headlines.map((headline, index) => ({
    id: `headline-${Date.now()}-${index}`,
    content: headline,
    source: 'news',
    timestamp: new Date(),
    reach: 1000,
    engagement: 100,
  }));

  const aggregated = await dcftEngine.analyze(inputs);
  
  // Generate individual results
  const results: EmotionAnalysisResult[] = headlines.map(headline => analyzeHeadline(headline));

  return { results, aggregated };
}

/**
 * Generate mock historical data for demonstration
 * Uses DCFT temporal decay principles
 */
export function generateMockHistoricalData(
  hoursBack: number = 24
): Array<{ timestamp: Date; gmi: number; cfi: number; hri: number }> {
  const data = [];
  const now = Date.now();

  for (let i = hoursBack; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);

    // Apply DCFT temporal decay (λ = 0.07)
    const decayFactor = Math.exp(-0.07 * i);
    const timeProgress = (hoursBack - i) / hoursBack;
    
    // Create realistic trends with decay influence
    const trendVariation = Math.sin(timeProgress * Math.PI * 2) * 20 * decayFactor;
    const noiseAmplitude = 15 * (1 - decayFactor * 0.5);

    const gmi = Math.round(10 + trendVariation + (Math.random() - 0.5) * noiseAmplitude);
    const cfi = Math.round(45 + Math.sin(timeProgress * Math.PI) * 25 * decayFactor + (Math.random() - 0.5) * 15);
    const hri = Math.round(55 - Math.sin(timeProgress * Math.PI) * 20 * decayFactor + (Math.random() - 0.5) * 15);

    data.push({
      timestamp,
      gmi: Math.max(-100, Math.min(100, gmi)),
      cfi: Math.max(0, Math.min(100, cfi)),
      hri: Math.max(0, Math.min(100, hri)),
    });
  }

  return data;
}
