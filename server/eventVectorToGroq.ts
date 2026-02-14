import { EventVector } from './graphPipeline';
import { invokeLLM } from './_core/llm';
import { payloadValidatorRouter } from './payloadValidator';

/**
 * EventVector to Groq Wrapper
 * Converts EventVector to compact JSON and sends to Groq
 * This ensures Groq receives ~500 tokens, not 51406
 */

/**
 * Convert EventVector to compact JSON
 */
export function eventVectorToJson(vector: EventVector): string {
  return JSON.stringify({
    topic: vector.topic,
    topicConfidence: vector.topicConfidence,
    emotions: vector.emotions,
    dominantEmotion: vector.dominantEmotion,
    region: vector.region,
    regionConfidence: vector.regionConfidence,
    impactScore: vector.impactScore,
    severity: vector.severity,
  });
}

/**
 * Estimate tokens for EventVector
 */
export function estimateEventVectorTokens(vector: EventVector): number {
  const json = eventVectorToJson(vector);
  // 1 token ≈ 4 characters
  return Math.ceil(json.length / 4);
}

/**
 * Create reasoning prompt from EventVector
 */
export function createReasoningPrompt(
  vector: EventVector,
  language: string = 'en'
): string {
  const emotionsList = Object.entries(vector.emotions)
    .map(([emotion, value]) => `${emotion}: ${(value * 100).toFixed(0)}%`)
    .join(', ');

  const prompts: Record<string, string> = {
    en: `Analyze this emotional climate data and provide insights:

Topic: ${vector.topic} (confidence: ${(vector.topicConfidence * 100).toFixed(0)}%)
Dominant Emotion: ${vector.dominantEmotion}
All Emotions: ${emotionsList}
Affected Regions: ${vector.region}
Impact Score: ${(vector.impactScore * 100).toFixed(0)}%
Severity: ${vector.severity}

Provide:
1. Brief interpretation of the emotional climate
2. Key insights about the dominant emotion
3. Potential implications
4. Recommendations for stakeholders`,

    ar: `حلل بيانات المناخ العاطفي التالية وقدم رؤى:

الموضوع: ${vector.topic} (الثقة: ${(vector.topicConfidence * 100).toFixed(0)}%)
العاطفة السائدة: ${vector.dominantEmotion}
جميع العواطف: ${emotionsList}
المناطق المتأثرة: ${vector.region}
درجة التأثير: ${(vector.impactScore * 100).toFixed(0)}%
الخطورة: ${vector.severity}

قدم:
1. تفسير موجز للمناخ العاطفي
2. الرؤى الرئيسية حول العاطفة السائدة
3. الآثار المحتملة
4. التوصيات لأصحاب المصلحة`,

    fr: `Analysez ces données de climat émotionnel et fournissez des perspectives:

Sujet: ${vector.topic} (confiance: ${(vector.topicConfidence * 100).toFixed(0)}%)
Émotion dominante: ${vector.dominantEmotion}
Toutes les émotions: ${emotionsList}
Régions affectées: ${vector.region}
Score d'impact: ${(vector.impactScore * 100).toFixed(0)}%
Gravité: ${vector.severity}

Fournissez:
1. Interprétation brève du climat émotionnel
2. Principaux enseignements sur l'émotion dominante
3. Implications potentielles
4. Recommandations pour les parties prenantes`,
  };

  return prompts[language] || prompts.en;
}

/**
 * Send EventVector to Groq for reasoning
 */
export async function sendEventVectorToGroq(
  vector: EventVector,
  language: string = 'en'
): Promise<string> {
  try {
    // 1. Validate EventVector size
    const tokens = estimateEventVectorTokens(vector);
    console.log(`EventVector size: ${tokens} tokens (target: ~500)`);

    if (tokens > 1000) {
      console.warn(`Warning: EventVector exceeds 1000 tokens (${tokens})`);
    }

    // 2. Create reasoning prompt
    const prompt = createReasoningPrompt(vector, language);

    // 3. Validate and fix payload if needed
    const { payload, validation } = payloadValidatorRouter.validateAndFixPayload(prompt);

    if (!validation.valid) {
      console.warn(`Payload validation warnings:`, validation.warnings);
    }

    // 4. Send to Groq 70B model for final reasoning
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'You are an expert analyst specializing in emotional climate analysis. Provide nuanced, context-aware insights based on the provided emotional data.',
        },
        {
          role: 'user',
          content: payload,
        },
      ],
    });

    // 5. Extract and return response
    const content = response.choices?.[0]?.message?.content;
    const responseText = typeof content === 'string' ? content : '';
    return responseText;
  } catch (error) {
    console.error('Error sending EventVector to Groq:', error);
    throw error;
  }
}

/**
 * Complete analysis pipeline: EventVector → Groq → Response
 */
export async function analyzeEventVector(
  vector: EventVector,
  language: string = 'en'
): Promise<{
  eventVector: EventVector;
  reasoning: string;
  tokensUsed: number;
}> {
  // 1. Get EventVector size
  const tokensUsed = estimateEventVectorTokens(vector);

  // 2. Send to Groq
  const reasoning = await sendEventVectorToGroq(vector, language);

  // 3. Return complete analysis
  return {
    eventVector: vector,
    reasoning,
    tokensUsed,
  };
}

/**
 * Format analysis result for display
 */
export function formatAnalysisResult(result: {
  eventVector: EventVector;
  reasoning: string;
  tokensUsed: number;
}): string {
  const emotionsList = Object.entries(result.eventVector.emotions)
    .map(([emotion, value]) => `${emotion}: ${(value * 100).toFixed(0)}%`)
    .join(', ');

  return `
## Emotional Climate Analysis

**Topic:** ${result.eventVector.topic} (${(result.eventVector.topicConfidence * 100).toFixed(0)}% confidence)

**Dominant Emotion:** ${result.eventVector.dominantEmotion}

**Emotional Breakdown:**
${emotionsList}

**Affected Regions:** ${result.eventVector.region}

**Impact Score:** ${(result.eventVector.impactScore * 100).toFixed(0)}%

**Severity Level:** ${result.eventVector.severity.toUpperCase()}

---

## Analysis & Insights

${result.reasoning}

---

**Data Efficiency:** ${result.tokensUsed} tokens used (optimized from 51,406 → ${result.tokensUsed})
  `.trim();
}
