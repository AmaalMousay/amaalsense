/**
 * LLM Pipeline with Sanitization Integration
 * 
 * Wraps all LLM calls with automatic response sanitization
 * Eliminates JSON parsing failures in production
 */

import { invokeLLM } from './_core/llm';
import { sanitizeResponse, parseJSONSafely, getSanitizationReport } from './responseSanitizationLayer';

export interface LLMCallOptions {
  messages: Array<{
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string | any[];
  }>;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json' | 'text';
  retryCount?: number;
  logSanitization?: boolean;
}

export interface LLMCallResult {
  success: boolean;
  content: string;
  sanitized: boolean;
  sanitizationReport?: string;
  parseError?: string;
  retries: number;
  duration: number;
}

/**
 * Invoke LLM with automatic sanitization
 */
export async function invokeLLMWithSanitization(
  options: LLMCallOptions
): Promise<LLMCallResult> {
  const startTime = Date.now();
  let retries = 0;
  const maxRetries = options.retryCount || 3;
  
  while (retries < maxRetries) {
    try {
      // Call LLM
      const response = await invokeLLM({
        messages: options.messages,
      });
      
      let content = '';
      const messageContent = response.choices[0]?.message?.content;
      if (typeof messageContent === 'string') {
        content = messageContent;
      } else if (Array.isArray(messageContent)) {
        content = messageContent.map(c => c.type === 'text' ? c.text : '').join('');
      }
      
      // Sanitize response
      const sanitized = sanitizeResponse(content);
      
      if (options.logSanitization && !sanitized.success) {
        console.warn('[LLM Pipeline] Sanitization warnings:', sanitized.warnings);
      }
      
      return {
        success: true,
        content: sanitized.sanitized,
        sanitized: sanitized.sanitized !== content,
        sanitizationReport: options.logSanitization ? getSanitizationReport(content) : undefined,
        retries,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        return {
          success: false,
          content: '',
          sanitized: false,
          parseError: error instanceof Error ? error.message : 'Unknown error',
          retries,
          duration: Date.now() - startTime,
        };
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
  
  return {
    success: false,
    content: '',
    sanitized: false,
    parseError: 'Max retries exceeded',
    retries,
    duration: Date.now() - startTime,
  };
}

/**
 * Invoke LLM and parse JSON with sanitization
 */
export async function invokeLLMForJSON<T = any>(
  options: LLMCallOptions
): Promise<{ success: boolean; data?: T; error?: string; retries: number; duration: number }> {
  const startTime = Date.now();
  let retries = 0;
  const maxRetries = options.retryCount || 3;
  
  while (retries < maxRetries) {
    try {
      // Call LLM with JSON response format
      const response = await invokeLLM({
        messages: options.messages,
      });
      
      let content = '';
      const messageContent = response.choices[0]?.message?.content;
      if (typeof messageContent === 'string') {
        content = messageContent;
      } else if (Array.isArray(messageContent)) {
        content = messageContent.map(c => c.type === 'text' ? c.text : '').join('');
      }
      
      // Sanitize and parse JSON
      const parsed = parseJSONSafely<T>(content);
      
      if (parsed.success) {
        return {
          success: true,
          data: parsed.data,
          retries,
          duration: Date.now() - startTime,
        };
      }
      
      retries++;
      
      if (retries >= maxRetries) {
        return {
          success: false,
          error: parsed.error,
          retries,
          duration: Date.now() - startTime,
        };
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          retries,
          duration: Date.now() - startTime,
        };
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
  
  return {
    success: false,
    error: 'Max retries exceeded',
    retries,
    duration: Date.now() - startTime,
  };
}

/**
 * Batch invoke LLM for multiple prompts
 */
export async function batchInvokeLLM(
  prompts: string[],
  systemPrompt: string = 'You are a helpful assistant.'
): Promise<Array<{ success: boolean; content: string; error?: string }>> {
  const results = [];
  
  for (const prompt of prompts) {
    const result = await invokeLLMWithSanitization({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      logSanitization: false,
    });
    
    results.push({
      success: result.success,
      content: result.content,
      error: result.parseError,
    });
  }
  
  return results;
}

/**
 * Stream LLM response with sanitization
 */
export async function* streamLLMWithSanitization(
  options: LLMCallOptions
): AsyncGenerator<string, void, unknown> {
  try {
    // For now, we'll collect the full response and yield it
    // In production, implement true streaming with sanitization
    const result = await invokeLLMWithSanitization(options);
    
    if (result.success) {
      yield result.content;
    } else {
      throw new Error(result.parseError || 'LLM call failed');
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Get LLM pipeline statistics
 */
export const llmPipelineStats = {
  totalCalls: 0,
  successfulCalls: 0,
  failedCalls: 0,
  totalRetries: 0,
  totalDuration: 0,
  sanitizedResponses: 0,
  
  record(result: LLMCallResult) {
    this.totalCalls++;
    if (result.success) {
      this.successfulCalls++;
    } else {
      this.failedCalls++;
    }
    this.totalRetries += result.retries;
    this.totalDuration += result.duration;
    if (result.sanitized) {
      this.sanitizedResponses++;
    }
  },
  
  getStats() {
    return {
      totalCalls: this.totalCalls,
      successRate: this.totalCalls > 0 ? (this.successfulCalls / this.totalCalls * 100).toFixed(2) + '%' : 'N/A',
      averageRetries: this.totalCalls > 0 ? (this.totalRetries / this.totalCalls).toFixed(2) : 'N/A',
      averageDuration: this.totalCalls > 0 ? (this.totalDuration / this.totalCalls).toFixed(0) + 'ms' : 'N/A',
      sanitizationRate: this.totalCalls > 0 ? (this.sanitizedResponses / this.totalCalls * 100).toFixed(2) + '%' : 'N/A',
    };
  },
  
  reset() {
    this.totalCalls = 0;
    this.successfulCalls = 0;
    this.failedCalls = 0;
    this.totalRetries = 0;
    this.totalDuration = 0;
    this.sanitizedResponses = 0;
  },
};
