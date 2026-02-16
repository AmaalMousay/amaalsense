/**
 * Graph Pipeline Architecture
 * 
 * Replaces linear pipeline with parallel processing:
 * - Multiple engines work simultaneously
 * - Results are collected into EventVector
 * - Single LLM pass for reasoning
 * 
 * Structure:
 * Input → [Topic Engine, Emotion Engine, Region Engine, Impact Engine] → EventVector → LLM → Response
 */

import { z } from 'zod';
import { analyzeTopics, analyzeEmotions, analyzeRegions, analyzeSeverity, analyzeImpact } from './realTextAnalyzer';

// Define the shape of partial results from each engine
export const PartialEventVectorSchema = z.object({
  topic: z.string().optional(),
  topicConfidence: z.number().optional(),
  emotions: z.record(z.string(), z.number()).optional(),
  dominantEmotion: z.string().optional(),
  region: z.string().optional(),
  regionConfidence: z.number().optional(),
  impactScore: z.number().optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

export type PartialEventVector = z.infer<typeof PartialEventVectorSchema>;

// Final EventVector combines all partial results
export const EventVectorSchema = z.object({
  topic: z.string(),
  topicConfidence: z.number(),
  emotions: z.record(z.string(), z.number()),
  dominantEmotion: z.string(),
  region: z.string(),
  regionConfidence: z.number(),
  impactScore: z.number(),
  severity: z.enum(['low', 'medium', 'high']),
  timestamp: z.date(),
  sourceId: z.string(),
});

export type EventVector = z.infer<typeof EventVectorSchema>;

/**
 * Topic Engine - Extracts and identifies the main topic
 * Uses real text analysis
 */
export async function topicEngine(input: string): Promise<PartialEventVector> {
  try {
    const topics = analyzeTopics(input);
    const topic = topics[0] || 'General';
    const confidence = topics.length > 0 ? 0.85 : 0.5;
    
    return {
      topic,
      topicConfidence: confidence,
    };
  } catch (error) {
    console.error('Topic Engine Error:', error);
    return {
      topic: 'General',
      topicConfidence: 0.5,
    };
  }
}

/**
 * Emotion Engine - Analyzes emotional content
 * Uses real sentiment analysis
 */
export async function emotionEngine(input: string): Promise<PartialEventVector> {
  try {
    const emotions = analyzeEmotions(input);
    const dominantEmotion = Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0] || 'neutral';
    
    return {
      emotions,
      dominantEmotion,
    };
  } catch (error) {
    console.error('Emotion Engine Error:', error);
    return {
      emotions: { fear: 0.3, anger: 0.2, hope: 0.2, sadness: 0.15, joy: 0.1, curiosity: 0.05 },
      dominantEmotion: 'neutral',
    };
  }
}

/**
 * Region Engine - Detects geographic context
 * Uses real region extraction
 */
export async function regionEngine(input: string): Promise<PartialEventVector> {
  try {
    const regions = analyzeRegions(input);
    const region = regions[0] || 'Global';
    const confidence = regions.length > 0 ? 0.85 : 0.5;
    
    return {
      region,
      regionConfidence: confidence,
    };
  } catch (error) {
    console.error('Region Engine Error:', error);
    return {
      region: 'Global',
      regionConfidence: 0.5,
    };
  }
}

/**
 * Impact Engine - Estimates impact and severity
 * Uses real impact analysis
 */
export async function impactEngine(input: string): Promise<PartialEventVector> {
  try {
    const emotions = analyzeEmotions(input);
    const severity = analyzeSeverity(input, emotions);
    const impactScore = analyzeImpact(input, emotions);
    
    return {
      impactScore,
      severity: severity as 'low' | 'medium' | 'high',
    };
  } catch (error) {
    console.error('Impact Engine Error:', error);
    return {
      impactScore: 0.5,
      severity: 'medium',
    };
  }
}

/**
 * Fusion Engine - Combines all partial results into unified EventVector
 * Properly merges emotions, topics, regions, and impact scores
 */
export async function fusionEngine(
  input: string,
  partialResults: PartialEventVector[]
): Promise<EventVector> {
  if (partialResults.length === 0) {
    throw new Error('No partial results to fuse');
  }
  
  // 1. MERGE EMOTIONS WITH AVERAGING
  const emotionMap: Record<string, number[]> = {};
  
  for (const partial of partialResults) {
    if (partial.emotions) {
      for (const [emotion, value] of Object.entries(partial.emotions)) {
        if (!emotionMap[emotion]) {
          emotionMap[emotion] = [];
        }
        emotionMap[emotion].push(value);
      }
    }
  }
  
  // Calculate average emotions
  const mergedEmotions: Record<string, number> = {};
  for (const [emotion, values] of Object.entries(emotionMap)) {
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    mergedEmotions[emotion] = Math.round(average * 100) / 100;
  }
  
  // 2. SELECT DOMINANT EMOTION
  let dominantEmotion = 'neutral';
  let maxValue = 0;
  for (const [emotion, value] of Object.entries(mergedEmotions)) {
    if (value > maxValue) {
      maxValue = value;
      dominantEmotion = emotion;
    }
  }
  
  // 3. SELECT STRONGEST TOPIC
  let topic = 'General';
  let topicConfidence = 0.5;
  for (const partial of partialResults) {
    if (partial.topic && (partial.topicConfidence || 0) > topicConfidence) {
      topic = partial.topic;
      topicConfidence = partial.topicConfidence || 0.5;
    }
  }
  
  // 4. MERGE REGIONS
  const regions = new Set<string>();
  let regionConfidence = 0;
  for (const partial of partialResults) {
    if (partial.region) {
      regions.add(partial.region);
    }
    if (partial.regionConfidence) {
      regionConfidence = Math.max(regionConfidence, partial.regionConfidence);
    }
  }
  const mergedRegion = Array.from(regions).join(', ') || 'Global';
  
  // 5. CALCULATE IMPACT SCORE
  let impactScore = 0;
  let impactCount = 0;
  for (const partial of partialResults) {
    if (partial.impactScore !== undefined) {
      impactScore += partial.impactScore;
      impactCount++;
    }
  }
  impactScore = impactCount > 0 ? impactScore / impactCount : 0.5;
  impactScore = Math.round(impactScore * 100) / 100;
  
  // 6. DETERMINE SEVERITY
  let severity: 'low' | 'medium' | 'high' = 'medium';
  if (impactScore < 0.33) {
    severity = 'low';
  } else if (impactScore > 0.66) {
    severity = 'high';
  }
  
  // 7. CREATE UNIFIED EVENTVECTOR
  const eventVector: EventVector = {
    topic,
    topicConfidence,
    emotions: mergedEmotions,
    dominantEmotion,
    region: mergedRegion,
    regionConfidence,
    impactScore,
    severity,
    timestamp: new Date(),
    sourceId: `event-${Date.now()}`,
  };
  
  return eventVector;
}

/**
 * Graph Pipeline Orchestrator
 * Runs all engines in parallel, then fuses results
 * 
 * This is the main entry point that replaces the old linear pipeline
 */
export async function graphPipeline(input: string): Promise<EventVector> {
  try {
    // Run all engines in parallel (not sequentially)
    const [topicResult, emotionResult, regionResult, impactResult] = await Promise.all([
      topicEngine(input),
      emotionEngine(input),
      regionEngine(input),
      impactEngine(input),
    ]);
    
    // Fuse all results into single EventVector
    const eventVector = await fusionEngine(input, [
      topicResult,
      emotionResult,
      regionResult,
      impactResult,
    ]);
    
    return eventVector;
  } catch (error) {
    console.error('Graph Pipeline Error:', error);
    
    // Return default EventVector on error
    return {
      topic: 'General',
      topicConfidence: 0,
      emotions: { 'neutral': 1 },
      dominantEmotion: 'neutral',
      region: 'Global',
      regionConfidence: 0,
      impactScore: 0.5,
      severity: 'medium',
      timestamp: new Date(),
      sourceId: `event-error-${Date.now()}`,
    };
  }
}

/**
 * Reasoning Engine - Single LLM pass using Groq
 * Takes EventVector and generates final response
 * This replaces the old "LLM everywhere" approach
 */
export async function reasoningEngine(eventVector: EventVector, originalInput?: string): Promise<string> {
  try {
    console.log('[ReasoningEngine] Starting Groq reasoning for topic:', eventVector.topic);
    const { invokeGroqLLM } = await import('./groqIntegration');
    
    const prompt = `
You are analyzing collective emotional sentiment about: "${originalInput || eventVector.topic}"

Analysis Results:
- Topic: ${eventVector.topic} (confidence: ${(eventVector.topicConfidence * 100).toFixed(0)}%)
- Emotions: ${Object.entries(eventVector.emotions)
  .map(([e, v]) => `${e}: ${((v as number) * 100).toFixed(0)}%`)
  .join(', ')}
- Dominant Emotion: ${eventVector.dominantEmotion}
- Region: ${eventVector.region} (confidence: ${(eventVector.regionConfidence * 100).toFixed(0)}%)
- Impact Score: ${(eventVector.impactScore * 100).toFixed(0)}%
- Severity: ${eventVector.severity}

Based on this emotional analysis, provide:
1. Why people feel this way (specific to the topic)
2. What this means for society
3. Key recommendations or implications

Be specific and contextual - not generic. Reference the actual topic and emotions detected.
    `;
    
    console.log('[ReasoningEngine] Calling Groq API...');
    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: 'You are an expert analyst for collective emotional intelligence. Provide concise, actionable insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    
    console.log('[ReasoningEngine] Groq response received');
    const result = response.content || response.text || 'Analysis complete';
    return result;
  } catch (error) {
    console.error('[ReasoningEngine] Error:', error);
    return 'Unable to generate analysis at this time';
  }
}

/**
 * Complete Pipeline: Graph → Reasoning
 * Input → EventVector → Analysis
 */
export async function completePipeline(input: string): Promise<{
  eventVector: EventVector;
  analysis: string;
}> {
  // Step 1: Run graph pipeline to get EventVector
  const eventVector = await graphPipeline(input);
  
  // Step 2: Run reasoning engine (single LLM pass) with original input
  const analysis = await reasoningEngine(eventVector, input);
  
  return {
    eventVector,
    analysis,
  };
}
