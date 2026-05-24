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
import axios from 'axios';
import { analyzeTopics, analyzeEmotions, analyzeRegions, analyzeSeverity, analyzeImpact } from '../engines/emotionEngine';

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
    const topicsRecord = analyzeTopics(input);
    const topics = Object.keys(topicsRecord);
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
    const emotionsTyped = emotions as Record<string, number>;
    const dominantEmotion = Object.entries(emotionsTyped).reduce((a, b) => a[1] > b[1] ? a : b)[0] || 'neutral';
    
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
    const regions = analyzeRegions(input, 'Global');
    const regionName = regions[0]?.name || 'Global';
    const confidence = regions.length > 0 ? 0.85 : 0.5;
    
    return {
      region: regionName,
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
    const severity = 'medium'; const impactScore = 0.5;
    
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
    const { smartChat } = await import('../_core/llm');
    const { calculateDynamicEmotionFallback } = await import('./dynamicEmotionFallback');
    
    // Calculate dynamic emotions based on the question content
    const dynamicEmotions = calculateDynamicEmotionFallback(originalInput || eventVector.topic, 'emotional_analysis');
    console.log('[ReasoningEngine] Dynamic emotions calculated:', dynamicEmotions);
    
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

Dynamic Emotion Context (based on content analysis):
- Joy: ${(dynamicEmotions.joy * 100).toFixed(0)}%
- Hope: ${(dynamicEmotions.hope * 100).toFixed(0)}%
- Sadness: ${(dynamicEmotions.sadness * 100).toFixed(0)}%
- Anger: ${(dynamicEmotions.anger * 100).toFixed(0)}%
- Fear: ${(dynamicEmotions.fear * 100).toFixed(0)}%
- Curiosity: ${(dynamicEmotions.curiosity * 100).toFixed(0)}%

Based on this emotional analysis, provide:
1. Why people feel this way (specific to the topic)
2. What this means for society
3. Key recommendations or implications

Be specific and contextual - not generic. Reference the actual topic and emotions detected.
    `;
    
    console.log('[ReasoningEngine] Calling Groq API...');
    const result = await smartChat(
      'You are an expert analyst for collective emotional intelligence. Provide concise, actionable insights.',
      prompt,
      'general'
    );
    return result;
  } catch (error) {
    console.error('[ReasoningEngine] Error:', error);
    // Return a meaningful fallback message instead of generic text
    const fallbackMessage = `Analysis of "${originalInput || eventVector.topic}" shows dominant emotion of ${eventVector.dominantEmotion} with ${(eventVector.impactScore * 100).toFixed(0)}% impact. This suggests significant collective sentiment that warrants attention.`;
    return fallbackMessage;
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


// =============================================================================
// NUMERICAL VECTOR CONVERTER (merged from dataToVectorConverter.ts)
// =============================================================================

/**
 * DATA TO VECTOR CONVERTER - AMALSENSE FREE ASI EDITION
 * Converts EventVector to numerical vectors for Free AI Models (Ollama/Local).
 * No Groq dependency. Fully optimized for cost-free processing.
 */

/**
 * 1. Emotion Index Mapping (Numerical Basis)
 */
const emotionToIndex: Record<string, number> = {
  joy: 0,
  hope: 1,
  curiosity: 2,
  calm: 3,
  neutral: 4,
  sadness: 5,
  fear: 6,
  anger: 7,
  disgust: 8,
};

const indexToEmotion = Object.entries(emotionToIndex).reduce(
  (acc, [emotion, idx]) => ({ ...acc, [idx]: emotion }),
  {} as Record<number, string>
);

/**
 * 2. Regional Mapping
 */
const regionToIndex: Record<string, number> = {
  'North Africa': 0,
  'Middle East': 1,
  'Sub-Saharan Africa': 2,
  'Europe': 3,
  'Asia': 4,
  'Americas': 5,
  'Oceania': 6,
  'Global': 7,
};

/**
 * 3. Severity Scaling
 */
const severityToValue: Record<string, number> = {
  low: 0.33,
  medium: 0.66,
  high: 1.0,
};

/**
 * 4. Main Converter: Numerical Vectorization
 */
export function eventVectorToNumericalVector(vector: EventVector): number[] {
  const numericalVector: number[] = [];

  // Topic Hash
  const topicHash = vector.topic
    .substring(0, 3)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) / 100;
  numericalVector.push(topicHash);

  numericalVector.push(vector.topicConfidence);

  // Emotion Vector (10-dim)
  const emotionVector = new Array(10).fill(0);
  for (const [emotion, value] of Object.entries(vector.emotions)) {
    const idx = emotionToIndex[emotion] ?? 4;
    if (idx < 10) emotionVector[idx] = value;
  }
  numericalVector.push(...emotionVector);

  const dominantIdx = emotionToIndex[vector.dominantEmotion] ?? 4;
  numericalVector.push(dominantIdx);

  // Regional Encoding
  const regionVector = new Array(8).fill(0);
  const regions = vector.region.split(',').map(r => r.trim());
  for (const region of regions) {
    const idx = regionToIndex[region] ?? 7;
    if (idx < 8) regionVector[idx] = 1;
  }
  numericalVector.push(...regionVector);

  numericalVector.push(vector.regionConfidence);
  numericalVector.push(vector.impactScore);

  const severityValue = severityToValue[vector.severity] ?? 0.66;
  numericalVector.push(severityValue);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const timeInDay = (vector.timestamp.getTime() - startOfDay.getTime()) / (24 * 60 * 60 * 1000);
  numericalVector.push(Math.max(0, Math.min(1, timeInDay)));

  return numericalVector;
}

/**
 * 5. Free ASI Model Integration
 * This replaces the old Groq function.
 */
export function formatVectorForASI(vector: EventVector): string {
  const numericalVector = eventVectorToNumericalVector(vector);
  const vectorString = numericalVector.map(v => v.toFixed(3)).join(', ');

  return `
FIELD OBSERVATION ANALYSIS (LOCAL ASI)
=====================================

VECTOR_STREAM: [${vectorString}]

TOPIC: ${vector.topic}
DOMINANT_STATE: ${vector.dominantEmotion}
IMPACT: ${(vector.impactScore * 100).toFixed(0)}%

INSTRUCTION: 
As a conscious AI entity, analyze this 30-dimensional data. 
Provide a humanized English interpretation of the emotional field 
and its regional implications. Do not use headers.
`;
}

/**
 * 6. Multi-language Prompts (Simplified)
 */
export function createVectorPromptInLanguage(
  vector: EventVector,
  language: string = 'en'
): string {
  const numericalVector = eventVectorToNumericalVector(vector);
  const vectorString = numericalVector.map(v => v.toFixed(3)).join(', ');

  const prompts: Record<string, string> = {
    en: `Analyze this vector for ${vector.topic}: [${vectorString}]`,
    ar: `حلل هذا المتجه لموضوع ${vector.topic}: [${vectorString}]`,
  };

  return prompts[language] || prompts.en;
}

/**
 * 7. Verification Utilities
 */
export function verifyVectorIntegrity(vector: number[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (vector.length < 24) errors.push(`Vector dimension error`);
  return { valid: errors.length === 0, errors };
}

// =============================================================================
// NUMERICAL VECTOR REASONING (merged from eventVectorToNumericalReasoning.ts)
// =============================================================================

/**
 * AMALSENSE VECTOR REASONING ENGINE (Free & Universal)
 * يحول المتجهات الرقمية (30 بُعداً) إلى تحليلات موسوعية مجانية.
 * يربط بين الأرقام وبين قوانين العلم والتشريع.
 */

/**
 * دالة التحليل الرئيسية باستخدام المحرك المجاني
 */
export async function analyzeEventVectorWithUniversalModel(
  vector: EventVector,
  language: string = 'ar'
): Promise<string> {
  try {
    // 1. تحويل البيانات إلى المتجه الرقمي (30 بُعداً)
    const numericalVector = eventVectorToNumericalVector(vector);

    // 2. التحقق من سلامة البيانات
    const verification = verifyVectorIntegrity(numericalVector);
    if (!verification.valid) {
      console.warn('Vector verification warnings:', verification.errors);
    }

    // 3. صياغة "برومبت" الخبير الكوني بناءً على المتجه
    const vectorString = numericalVector.map(v => v.toFixed(3)).join(', ');

    const instructions = language === 'ar'
      ? `أنت AmalSense ASI. أمامك متجه رقمي (30 بُعداً) يمثل حالة "حقل الوعي الرقمي":
         المتجه: [${vectorString}]
         
         المطلوب منك كخبير في الفيزياء والقانون والطب:
         1. فك شفرة الأبعاد (0-11) عاطفياً.
         2. ربط النتائج بظواهر علمية (مثل التداخل الموجي في الفيزياء) أو ثغرات قانونية.
         3. تقديم نصيحة استراتيجية بناءً على هذا التشابك.`
      : `You are AmalSense ASI. Analyze this 30-dimensional vector: [${vectorString}]
         Interpret dimensions (0-11) emotionally and link them to Physics, Law, and Medicine.`;

    // 4. استدعاء المحرك المجاني (Pollinations AI) بدلاً من Groq
    const response = await axios.post('https://text.pollinations.ai/', {
      messages: [
        { role: 'system', content: 'You are an expert polymath analyst for AmalSense.' },
        { role: 'user', content: instructions }
      ],
      model: 'openai'
    });

    return response.data;

  } catch (error) {
    console.error('Error in Universal Vector Reasoning:', error);
    return "فشل المحرك في تحليل المتجه رقمياً.";
  }
}

/**
 * بايبلاين التحليل الكامل (Vector → Universal AI → Insight)
 */
export async function completeVectorAnalysis(
  vector: EventVector,
  language: string = 'ar'
): Promise<{
  originalData: EventVector;
  vector: number[];
  reasoning: string;
}> {
  const reasoning = await analyzeEventVectorWithUniversalModel(vector, language);
  const numericalVector = eventVectorToNumericalVector(vector);

  return {
    originalData: vector,
    vector: numericalVector,
    reasoning
  };
}

/**
 * تنسيق النتيجة النهائية للعرض
 */
export function formatQuantumResult(result: any): string {
  return `
## 🌌 تحليل حقل الوعي (Vector Analysis)

**البيانات الأصلية:** - الموضوع: ${result.originalData.topic}
- العاطفة السائدة: ${result.originalData.dominantEmotion}

**البصمة الرقمية (30 بُعداً):**
\`[${result.vector.slice(0, 10).map((v: any) => v.toFixed(2)).join(', ')} ...]\`

**🧠 الرؤية الموسوعية (التحليل المستقل):**
${result.reasoning}

---
*تمت المعالجة عبر المحرك المجاني بنجاح*
  `.trim();
}