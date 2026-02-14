import { EventVector } from './graphPipeline';
import { invokeLLM } from './_core/llm';
import {
  eventVectorToNumericalVector,
  createVectorPromptInLanguage,
  verifyVectorIntegrity,
} from './dataToVectorConverter';

/**
 * EventVector to Groq with Vectors
 * Converts EventVector to 30-dimensional numerical vector
 * Preserves ALL data while making it machine-readable
 * Groq processes the vectors, not raw data
 */

/**
 * Send EventVector as numerical vector to Groq
 * Groq receives vectors and performs reasoning
 */
export async function sendEventVectorAsVectorsToGroq(
  vector: EventVector,
  language: string = 'en'
): Promise<string> {
  try {
    // 1. Convert EventVector to 30-dimensional numerical vector
    const numericalVector = eventVectorToNumericalVector(vector);

    // 2. Verify vector integrity
    const verification = verifyVectorIntegrity(numericalVector);
    if (!verification.valid) {
      console.warn('Vector verification warnings:', verification.errors);
    }

    // 3. Create vector-based prompt for Groq
    const vectorPrompt = createVectorPromptInLanguage(vector, language);

    // 4. Send to Groq 70B model for reasoning
    // Groq receives the vector representation, not raw data
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are an expert emotional climate analyst. You receive 30-dimensional emotional climate vectors and provide nuanced, context-aware analysis. 

Vector Structure:
- Dimensions 0-1: Topic information
- Dimensions 2-11: Emotion values (10 emotions)
- Dimension 12: Dominant emotion
- Dimensions 13-20: Regional distribution
- Dimensions 21-24: Confidence and severity metrics

Always interpret the vectors holistically and provide actionable insights.`,
        },
        {
          role: 'user',
          content: vectorPrompt,
        },
      ],
    });

    // 5. Extract and return response
    const content = response.choices?.[0]?.message?.content;
    const responseText = typeof content === 'string' ? content : '';
    return responseText;
  } catch (error) {
    console.error('Error sending EventVector vectors to Groq:', error);
    throw error;
  }
}

/**
 * Complete analysis pipeline: EventVector → Vector → Groq → Response
 * All data preserved, only representation changed to vectors
 */
export async function analyzeEventVectorWithVectors(
  vector: EventVector,
  language: string = 'en'
): Promise<{
  eventVector: EventVector;
  numericalVector: number[];
  reasoning: string;
  vectorSize: number;
}> {
  // 1. Convert to numerical vector
  const numericalVector = eventVectorToNumericalVector(vector);

  // 2. Send vectors to Groq for reasoning
  const reasoning = await sendEventVectorAsVectorsToGroq(vector, language);

  // 3. Return complete analysis with all data preserved
  return {
    eventVector: vector, // Original data preserved
    numericalVector, // Vector representation for Groq
    reasoning,
    vectorSize: numericalVector.length,
  };
}

/**
 * Format analysis result with vectors
 */
export function formatAnalysisResultWithVectors(result: {
  eventVector: EventVector;
  numericalVector: number[];
  reasoning: string;
  vectorSize: number;
}): string {
  const emotionsList = Object.entries(result.eventVector.emotions)
    .map(([emotion, value]) => `${emotion}: ${(value * 100).toFixed(0)}%`)
    .join(', ');

  const vectorString = result.numericalVector.map(v => v.toFixed(3)).join(', ');

  return `
## Emotional Climate Analysis with Vector Processing

**Original EventVector Data (Preserved):**
- Topic: ${result.eventVector.topic} (${(result.eventVector.topicConfidence * 100).toFixed(0)}% confidence)
- Dominant Emotion: ${result.eventVector.dominantEmotion}
- Emotional Breakdown: ${emotionsList}
- Affected Regions: ${result.eventVector.region}
- Impact Score: ${(result.eventVector.impactScore * 100).toFixed(0)}%
- Severity Level: ${result.eventVector.severity.toUpperCase()}

**Numerical Vector Representation (30-dimensional):**
[${vectorString}]

**Groq Analysis & Insights:**
${result.reasoning}

---

**Data Efficiency:**
- Vector Dimensions: ${result.vectorSize}
- All original data preserved
- Machine-readable format for AI reasoning
  `.trim();
}

/**
 * Batch analysis with vectors
 */
export async function batchAnalyzeWithVectors(
  vectors: EventVector[],
  language: string = 'en'
): Promise<Array<{
  eventVector: EventVector;
  numericalVector: number[];
  reasoning: string;
}>> {
  const results = await Promise.all(
    vectors.map(vector => analyzeEventVectorWithVectors(vector, language))
  );

  return results.map(r => ({
    eventVector: r.eventVector,
    numericalVector: r.numericalVector,
    reasoning: r.reasoning,
  }));
}
