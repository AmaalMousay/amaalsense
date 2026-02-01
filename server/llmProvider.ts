/**
 * LLM Provider Abstraction Layer
 * 
 * This layer allows switching between different LLM providers:
 * - Manus Built-in API (default for development)
 * - Groq Cloud with Qwen (open-source, portable)
 * 
 * The system automatically selects the best available provider.
 */

import { invokeLLM } from './_core/llm';
import { invokeGroq, isGroqConfigured, GROQ_MODELS, type GroqMessage } from './groqService';

// Provider types
export type LLMProvider = 'manus' | 'groq';

// Unified message type
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMCompletionOptions {
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
  provider?: LLMProvider; // Force specific provider
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

/**
 * Get the currently active LLM provider
 * Priority: Manus (default for development) > Groq (for external hosting)
 * 
 * To force Groq, set USE_GROQ=true in environment
 */
export function getActiveProvider(): LLMProvider {
  // Check if we should force Groq (for external hosting)
  const forceGroq = process.env.USE_GROQ === 'true';
  
  if (forceGroq && isGroqConfigured()) {
    return 'groq';
  }
  
  // Default to Manus for development
  return 'manus';
}

/**
 * Check which providers are available
 */
export function getAvailableProviders(): { provider: LLMProvider; available: boolean; reason?: string }[] {
  return [
    {
      provider: 'groq',
      available: isGroqConfigured(),
      reason: isGroqConfigured() ? undefined : 'GROQ_API_KEY not configured',
    },
    {
      provider: 'manus',
      available: true, // Always available in Manus environment
    },
  ];
}

/**
 * Invoke LLM using the best available provider
 */
export async function invokeLLMProvider(options: LLMCompletionOptions): Promise<LLMResponse> {
  const provider = options.provider || getActiveProvider();
  
  if (provider === 'groq' && isGroqConfigured()) {
    return invokeGroqProvider(options);
  }
  
  return invokeManusProvider(options);
}

/**
 * Invoke Groq provider
 */
async function invokeGroqProvider(options: LLMCompletionOptions): Promise<LLMResponse> {
  const groqMessages: GroqMessage[] = options.messages.map(m => ({
    role: m.role,
    content: m.content,
  }));
  
  const response = await invokeGroq({
    messages: groqMessages,
    model: GROQ_MODELS.DEFAULT, // Qwen 2.5 32B
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 1024,
  });
  
  return {
    content: response.choices[0]?.message?.content || '',
    provider: 'groq',
    model: GROQ_MODELS.DEFAULT,
    tokens: {
      prompt: response.usage?.prompt_tokens || 0,
      completion: response.usage?.completion_tokens || 0,
      total: response.usage?.total_tokens || 0,
    },
  };
}

/**
 * Invoke Manus provider
 */
async function invokeManusProvider(options: LLMCompletionOptions): Promise<LLMResponse> {
  const response = await invokeLLM({
    messages: options.messages.map(m => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    })),
  });
  
  const messageContent = response.choices[0]?.message?.content;
  const content = typeof messageContent === 'string' 
    ? messageContent 
    : Array.isArray(messageContent) 
      ? messageContent.map((c: any) => c.type === 'text' ? c.text : '').join('')
      : '';
  
  return {
    content,
    provider: 'manus',
    model: 'manus-default',
    tokens: {
      prompt: response.usage?.prompt_tokens || 0,
      completion: response.usage?.completion_tokens || 0,
      total: response.usage?.total_tokens || 0,
    },
  };
}

/**
 * Simple chat helper
 */
export async function chat(
  systemPrompt: string,
  userMessage: string,
  options?: { provider?: LLMProvider; temperature?: number }
): Promise<string> {
  const response = await invokeLLMProvider({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    provider: options?.provider,
    temperature: options?.temperature,
  });
  
  return response.content;
}

/**
 * Multi-turn conversation helper
 */
export async function conversation(
  systemPrompt: string,
  history: LLMMessage[],
  options?: { provider?: LLMProvider; temperature?: number }
): Promise<LLMResponse> {
  return invokeLLMProvider({
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
    ],
    provider: options?.provider,
    temperature: options?.temperature,
  });
}

/**
 * Get provider info for display
 */
export function getProviderInfo(provider: LLMProvider): {
  name: string;
  description: string;
  model: string;
  isOpenSource: boolean;
  isFree: boolean;
} {
  switch (provider) {
    case 'groq':
      return {
        name: 'Groq Cloud',
        description: 'Ultra-fast inference with Qwen 2.5 (open-source)',
        model: 'Qwen 2.5 32B',
        isOpenSource: true,
        isFree: true,
      };
    case 'manus':
      return {
        name: 'Manus AI',
        description: 'Built-in AI service',
        model: 'Manus Default',
        isOpenSource: false,
        isFree: true, // Free within Manus platform
      };
  }
}
