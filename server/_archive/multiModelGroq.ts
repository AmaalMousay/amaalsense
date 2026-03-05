/**
 * Multi-Model Groq Strategy
 * 
 * Uses specialized Groq models for different tasks:
 * - Emotion Analysis: llama-3.1-8b-instant (fast, efficient)
 * - Query Building: llama-3.1-8b-instant (fast, efficient)
 * - Decision Making: llama-3.1-8b-instant (fast, efficient)
 * - Final Explanation: llama-3.1-70b-versatile (powerful, accurate)
 * 
 * This approach is more cost-effective and faster than using 70B for everything
 */

import type { Message } from './groqIntegration';

export type ModelType = 'emotion' | 'query' | 'decision' | 'explanation';

interface ModelConfig {
  name: string;
  model: string;
  temperature: number;
  maxTokens: number;
  description: string;
}

// Model configurations optimized for each task
const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  emotion: {
    name: 'Emotion Analysis',
    model: 'llama-3.1-8b-instant',
    temperature: 0.3,
    maxTokens: 512,
    description: 'Fast emotion detection and sentiment analysis',
  },
  query: {
    name: 'Query Building',
    model: 'llama-3.1-8b-instant',
    temperature: 0.2,
    maxTokens: 256,
    description: 'Structured query generation and parsing',
  },
  decision: {
    name: 'Decision Making',
    model: 'llama-3.1-8b-instant',
    temperature: 0.4,
    maxTokens: 512,
    description: 'Quick decision support and recommendations',
  },
  explanation: {
    name: 'Final Explanation',
    model: 'llama-3.1-70b-versatile',
    temperature: 0.5,
    maxTokens: 2048,
    description: 'Comprehensive analysis and detailed insights',
  },
};

/**
 * Invoke specialized Groq model for specific task
 */
export async function invokeSpecializedModel(
  modelType: ModelType,
  messages: Message[]
): Promise<string> {
  try {
    const config = MODEL_CONFIGS[modelType];
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable not set');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error(`${MODEL_CONFIGS[modelType].name} Error:`, error);
    throw error;
  }
}

/**
 * Analyze emotions using fast 8B model
 */
export async function analyzeEmotionsWithModel(text: string): Promise<Record<string, number>> {
  try {
    const prompt = `Analyze the emotional content of this text and return emotions as JSON.
Text: "${text}"

Return JSON with emotions and confidence scores (0-1):
{"joy": 0.0, "sadness": 0.0, "anger": 0.0, "fear": 0.0, "surprise": 0.0, "disgust": 0.0, "neutral": 0.0}`;

    const content = await invokeSpecializedModel('emotion', [
      { role: 'system', content: 'You are an emotion detection expert. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ]);

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { neutral: 1 };
    }

    const emotions = JSON.parse(jsonMatch[0]);
    
    // Normalize to sum to 1
    const total = Object.values(emotions).reduce((a: number, b: any) => a + b, 0);
    if (total > 0) {
      Object.keys(emotions).forEach(key => {
        emotions[key] = (emotions[key] as number) / total;
      });
    }

    return emotions;
  } catch (error) {
    console.error('Emotion Analysis Error:', error);
    return { neutral: 1 };
  }
}

/**
 * Build structured query using fast 8B model
 */
export async function buildQueryWithModel(userInput: string): Promise<{
  intent: string;
  entities: string[];
  filters: Record<string, string>;
}> {
  try {
    const prompt = `Parse this user query and extract structure.
Query: "${userInput}"

Return JSON with: intent, entities (array), filters (object)`;

    const content = await invokeSpecializedModel('query', [
      { role: 'system', content: 'You are a query parsing expert. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ]);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        intent: 'unknown',
        entities: [],
        filters: {},
      };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Query Building Error:', error);
    return {
      intent: 'unknown',
      entities: [],
      filters: {},
    };
  }
}

/**
 * Make decision using fast 8B model
 */
export async function makeDecisionWithModel(
  context: string,
  options: string[]
): Promise<{
  recommendation: string;
  reasoning: string;
  confidence: number;
}> {
  try {
    const prompt = `Given this context and options, recommend the best choice.
Context: ${context}
Options: ${options.join(', ')}

Return JSON with: recommendation (string), reasoning (string), confidence (0-1)`;

    const content = await invokeSpecializedModel('decision', [
      { role: 'system', content: 'You are a decision support expert. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ]);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        recommendation: options[0] || 'unknown',
        reasoning: 'Unable to analyze',
        confidence: 0,
      };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Decision Making Error:', error);
    return {
      recommendation: options[0] || 'unknown',
      reasoning: 'Error in decision making',
      confidence: 0,
    };
  }
}

/**
 * Generate final comprehensive explanation using powerful 70B model
 */
export async function generateFinalExplanationWithModel(
  summary: string,
  insights: string[],
  context: Record<string, any>
): Promise<string> {
  try {
    const prompt = `Generate a comprehensive final explanation based on:
Summary: ${summary}
Key Insights: ${insights.join('\n- ')}
Context: ${JSON.stringify(context, null, 2)}

Provide a detailed, well-structured analysis with actionable recommendations.`;

    const content = await invokeSpecializedModel('explanation', [
      {
        role: 'system',
        content: 'You are an expert analyst providing comprehensive insights. Be thorough and actionable.',
      },
      { role: 'user', content: prompt },
    ]);

    return content;
  } catch (error) {
    console.error('Final Explanation Error:', error);
    return 'Unable to generate final explanation at this time.';
  }
}

/**
 * Get model configuration for a specific task
 */
export function getModelConfig(modelType: ModelType): ModelConfig {
  return MODEL_CONFIGS[modelType];
}

/**
 * Get all available models and their specs
 */
export function getAllModelConfigs(): Record<ModelType, ModelConfig> {
  return MODEL_CONFIGS;
}

/**
 * Estimate cost savings compared to using 70B for everything
 * Assumes: 8B = 1 unit cost, 70B = 8 units cost
 */
export function estimateCostSavings(
  emotionCalls: number = 100,
  queryCalls: number = 100,
  decisionCalls: number = 50,
  explanationCalls: number = 50
): {
  multiModelCost: number;
  singleModelCost: number;
  savings: number;
  savingsPercent: number;
} {
  // Cost per call (relative units)
  const cost8B = 1;
  const cost70B = 8;

  // Multi-model approach
  const multiModelCost =
    emotionCalls * cost8B +
    queryCalls * cost8B +
    decisionCalls * cost8B +
    explanationCalls * cost70B;

  // Single 70B model approach (using 70B for everything)
  const totalCalls = emotionCalls + queryCalls + decisionCalls + explanationCalls;
  const singleModelCost = totalCalls * cost70B;

  const savings = singleModelCost - multiModelCost;
  const savingsPercent = (savings / singleModelCost) * 100;

  return {
    multiModelCost,
    singleModelCost,
    savings,
    savingsPercent,
  };
}
