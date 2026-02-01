/**
 * Groq API Service with Qwen Model Support
 * 
 * This service provides access to open-source LLMs via Groq Cloud
 * - Free tier: 14,400 requests/day
 * - Supports: Qwen, Llama, Mistral
 * - Portable: Works on any hosting platform
 */

import { ENV } from './_core/env';

// Groq API Configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Available models on Groq
export const GROQ_MODELS = {
  // Qwen models - Best for Arabic
  QWEN_32B: 'qwen-2.5-32b',
  QWEN_CODER: 'qwen-2.5-coder-32b',
  
  // Llama models
  LLAMA_70B: 'llama-3.3-70b-versatile',
  LLAMA_8B: 'llama-3.1-8b-instant',
  
  // Mistral models
  MISTRAL_SABA: 'mistral-saba-24b',
  
  // Default model for AmalSense
  DEFAULT: 'qwen-2.5-32b', // Best Arabic support
} as const;

export type GroqModel = typeof GROQ_MODELS[keyof typeof GROQ_MODELS];

// Message types (OpenAI compatible)
export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqCompletionOptions {
  messages: GroqMessage[];
  model?: GroqModel;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Check if Groq API is configured
 */
export function isGroqConfigured(): boolean {
  return !!(ENV.groqApiKey && ENV.groqApiKey.length > 0);
}

/**
 * Get the Groq API key
 */
function getGroqApiKey(): string {
  const key = ENV.groqApiKey;
  if (!key) {
    throw new Error('GROQ_API_KEY is not configured. Please add it to your environment variables.');
  }
  return key;
}

/**
 * Invoke Groq API for chat completion
 */
export async function invokeGroq(options: GroqCompletionOptions): Promise<GroqResponse> {
  const apiKey = getGroqApiKey();
  
  const requestBody = {
    model: options.model || GROQ_MODELS.DEFAULT,
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 1024,
    top_p: options.top_p ?? 1,
    stream: false,
  };
  
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json() as GroqResponse;
    return data;
  } catch (error) {
    console.error('[Groq] API call failed:', error);
    throw error;
  }
}

/**
 * Simple chat completion helper
 */
export async function groqChat(
  systemPrompt: string,
  userMessage: string,
  model?: GroqModel
): Promise<string> {
  const response = await invokeGroq({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    model,
  });
  
  return response.choices[0]?.message?.content || '';
}

/**
 * Multi-turn conversation helper
 */
export async function groqConversation(
  systemPrompt: string,
  conversationHistory: GroqMessage[],
  model?: GroqModel
): Promise<string> {
  const messages: GroqMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
  ];
  
  const response = await invokeGroq({
    messages,
    model,
  });
  
  return response.choices[0]?.message?.content || '';
}

/**
 * Test Groq connection
 */
export async function testGroqConnection(): Promise<{ success: boolean; model: string; message: string }> {
  try {
    const response = await groqChat(
      'You are a helpful assistant.',
      'Say "Hello from Groq!" in one short sentence.',
      GROQ_MODELS.LLAMA_8B // Use fast model for testing
    );
    
    return {
      success: true,
      model: GROQ_MODELS.LLAMA_8B,
      message: response,
    };
  } catch (error) {
    return {
      success: false,
      model: '',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
