/**
 * AI Sentiment Analyzer - Uses LLM for real emotion analysis
 * Analyzes news headlines and extracts emotion vectors using AI
 */

import { invokeLLM } from './_core/llm';

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
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are an expert emotion analyst. Analyze the given text and extract emotion scores.
          
Return a JSON object with these exact fields:
- joy: number (0-100) - happiness, celebration, success
- fear: number (0-100) - anxiety, worry, threat
- anger: number (0-100) - frustration, outrage, conflict
- sadness: number (0-100) - loss, grief, disappointment
- hope: number (0-100) - optimism, future potential, solutions
- curiosity: number (0-100) - interest, discovery, questions
- dominantEmotion: string - the strongest emotion
- sentiment: "positive" | "negative" | "neutral"
- confidence: number (0-100) - how confident you are in this analysis

Be accurate and consider cultural context. News headlines often have subtle emotional undertones.`,
        },
        {
          role: 'user',
          content: `Analyze the emotions in this text: "${text}"`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'emotion_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              joy: { type: 'number', description: 'Joy score 0-100' },
              fear: { type: 'number', description: 'Fear score 0-100' },
              anger: { type: 'number', description: 'Anger score 0-100' },
              sadness: { type: 'number', description: 'Sadness score 0-100' },
              hope: { type: 'number', description: 'Hope score 0-100' },
              curiosity: { type: 'number', description: 'Curiosity score 0-100' },
              dominantEmotion: { type: 'string', description: 'The dominant emotion' },
              sentiment: { type: 'string', description: 'Overall sentiment' },
              confidence: { type: 'number', description: 'Confidence score 0-100' },
            },
            required: ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity', 'dominantEmotion', 'sentiment', 'confidence'],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('No response from AI');
    }

    const analysis = JSON.parse(content);
    
    // Calculate indices
    const emotions: EmotionVector = {
      joy: Math.min(100, Math.max(0, analysis.joy)),
      fear: Math.min(100, Math.max(0, analysis.fear)),
      anger: Math.min(100, Math.max(0, analysis.anger)),
      sadness: Math.min(100, Math.max(0, analysis.sadness)),
      hope: Math.min(100, Math.max(0, analysis.hope)),
      curiosity: Math.min(100, Math.max(0, analysis.curiosity)),
    };

    const gmi = calculateGMI(emotions);
    const cfi = calculateCFI(emotions);
    const hri = calculateHRI(emotions);

    return {
      text,
      emotions,
      dominantEmotion: analysis.dominantEmotion,
      sentiment: analysis.sentiment,
      confidence: Math.min(100, Math.max(0, analysis.confidence)),
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
  // Simple keyword-based fallback
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['success', 'growth', 'win', 'celebrate', 'achieve', 'improve', 'hope', 'peace', 'progress'];
  const negativeWords = ['crisis', 'war', 'death', 'fail', 'crash', 'attack', 'fear', 'threat', 'disaster'];
  const fearWords = ['fear', 'threat', 'danger', 'crisis', 'emergency', 'warning', 'risk'];
  const hopeWords = ['hope', 'future', 'plan', 'develop', 'invest', 'build', 'grow', 'improve'];

  let positiveScore = 0, negativeScore = 0, fearScore = 0, hopeScore = 0;

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

  const emotions: EmotionVector = {
    joy: Math.min(100, positiveScore + 20),
    fear: Math.min(100, fearScore + negativeScore * 0.5 + 15),
    anger: Math.min(100, negativeScore * 0.3 + 10),
    sadness: Math.min(100, negativeScore * 0.4 + 10),
    hope: Math.min(100, hopeScore + positiveScore * 0.5 + 25),
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
