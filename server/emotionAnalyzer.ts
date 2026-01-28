/**
 * Emotion Analyzer - Simulates emotion analysis using VADER-like scoring
 * This is a mock implementation that simulates the behavior of Transformers + VADER
 */

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
  model: "transformer" | "vader";
}

// Keyword mappings for emotion detection
const emotionKeywords = {
  joy: [
    "celebrate",
    "victory",
    "success",
    "happy",
    "joy",
    "win",
    "breakthrough",
    "achievement",
    "triumph",
    "prosperity",
    "growth",
    "positive",
    "excellent",
    "wonderful",
    "great",
  ],
  fear: [
    "crisis",
    "danger",
    "threat",
    "fear",
    "warning",
    "risk",
    "catastrophe",
    "disaster",
    "collapse",
    "panic",
    "terror",
    "alarming",
    "concerning",
    "critical",
  ],
  anger: [
    "outrage",
    "fury",
    "angry",
    "rage",
    "conflict",
    "attack",
    "violence",
    "aggression",
    "hostile",
    "confrontation",
    "scandal",
    "corruption",
    "injustice",
  ],
  sadness: [
    "tragedy",
    "loss",
    "death",
    "sad",
    "grief",
    "mourning",
    "depression",
    "despair",
    "heartbreak",
    "suffering",
    "pain",
    "unfortunate",
    "decline",
  ],
  hope: [
    "hope",
    "optimism",
    "recovery",
    "progress",
    "resilience",
    "improvement",
    "opportunity",
    "promise",
    "renewal",
    "revival",
    "solution",
    "innovation",
    "future",
    "possibility",
  ],
  curiosity: [
    "discover",
    "research",
    "study",
    "investigation",
    "explore",
    "question",
    "mystery",
    "breakthrough",
    "finding",
    "analysis",
    "insight",
    "revelation",
    "unveil",
  ],
};

/**
 * Analyze emotions in a headline text
 * Returns emotion scores and identifies the dominant emotion
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

  // Count keyword matches for each emotion
  let totalMatches = 0;

  (Object.entries(emotionKeywords) as Array<[keyof EmotionVector, string[]]>).forEach(
    ([emotion, keywords]) => {
      keywords.forEach((keyword) => {
        const matches = words.filter((word) => word.includes(keyword)).length;
        emotions[emotion] += matches * 15; // Weight each match
        totalMatches += matches;
      });
    }
  );

  // Normalize scores to 0-100 range
  const maxScore = Math.max(...Object.values(emotions));
  if (maxScore > 0) {
    (Object.keys(emotions) as Array<keyof EmotionVector>).forEach((emotion) => {
      emotions[emotion] = Math.min(100, Math.round((emotions[emotion] / maxScore) * 100));
    });
  }

  // Add some base randomness for realism (5-15 points)
  const randomVariation = Math.random() * 10 + 5;
  (Object.keys(emotions) as Array<keyof EmotionVector>).forEach((emotion) => {
    emotions[emotion] = Math.min(100, Math.max(0, emotions[emotion] + (Math.random() - 0.5) * randomVariation));
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

  // Calculate confidence based on how clear the dominant emotion is
  const sortedScores = Object.values(emotions).sort((a, b) => b - a);
  const confidence = Math.min(
    100,
    Math.round(75 + (sortedScores[0] - sortedScores[1]) * 0.2)
  );

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
 * Calculate collective indices from emotion analyses
 * GMI: Global Mood Index (-100 to +100)
 * CFI: Collective Fear Index (0 to 100)
 * HRI: Hope Resilience Index (0 to 100)
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

  // Calculate averages
  let avgJoy = 0,
    avgFear = 0,
    avgAnger = 0,
    avgSadness = 0,
    avgHope = 0,
    avgCuriosity = 0;
  let totalConfidence = 0;

  analyses.forEach((analysis) => {
    avgJoy += analysis.emotions.joy;
    avgFear += analysis.emotions.fear;
    avgAnger += analysis.emotions.anger;
    avgSadness += analysis.emotions.sadness;
    avgHope += analysis.emotions.hope;
    avgCuriosity += analysis.emotions.curiosity;
    totalConfidence += analysis.confidence;
  });

  const count = analyses.length;
  avgJoy /= count;
  avgFear /= count;
  avgAnger /= count;
  avgSadness /= count;
  avgHope /= count;
  avgCuriosity /= count;
  totalConfidence /= count;

  // GMI: Global Mood Index (positive emotions - negative emotions)
  const positiveScore = (avgJoy + avgHope + avgCuriosity) / 3;
  const negativeScore = (avgFear + avgAnger + avgSadness) / 3;
  const gmi = Math.round((positiveScore - negativeScore) * 2); // Scale to -100 to +100

  // CFI: Collective Fear Index
  const cfi = Math.round(avgFear);

  // HRI: Hope Resilience Index (hope + curiosity - sadness)
  const hri = Math.round((avgHope + avgCuriosity) / 2 - avgSadness / 3);

  return {
    gmi: Math.max(-100, Math.min(100, gmi)),
    cfi: Math.max(0, Math.min(100, cfi)),
    hri: Math.max(0, Math.min(100, hri)),
    confidence: Math.round(totalConfidence),
  };
}

/**
 * Generate mock historical data for demonstration
 */
export function generateMockHistoricalData(
  hoursBack: number = 24
): Array<{ timestamp: Date; gmi: number; cfi: number; hri: number }> {
  const data = [];
  const now = Date.now();

  for (let i = hoursBack; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);

    // Create realistic trends with some randomness
    const timeProgress = (hoursBack - i) / hoursBack;
    const trendVariation = Math.sin(timeProgress * Math.PI * 2) * 20;

    const gmi = Math.round(10 + trendVariation + (Math.random() - 0.5) * 30);
    const cfi = Math.round(45 + Math.sin(timeProgress * Math.PI) * 25 + (Math.random() - 0.5) * 15);
    const hri = Math.round(55 - Math.sin(timeProgress * Math.PI) * 20 + (Math.random() - 0.5) * 15);

    data.push({
      timestamp,
      gmi: Math.max(-100, Math.min(100, gmi)),
      cfi: Math.max(0, Math.min(100, cfi)),
      hri: Math.max(0, Math.min(100, hri)),
    });
  }

  return data;
}
