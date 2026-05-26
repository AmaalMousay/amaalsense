/**
 * LLM Sanitization Pipeline
 *
 * Wraps LLM calls with automatic response sanitization to eliminate
 * JSON parsing failures in production.
 */

import { sanitizeResponse, parseJSONSafely, getSanitizationReport } from '../../engines/responseSanitizationLayer';
import { invokeLLM } from './invoke';
import type { LLMCallOptions, LLMCallResult } from './types';

export async function invokeLLMWithSanitization(options: LLMCallOptions): Promise<LLMCallResult> {
  const startTime = Date.now();
  const maxRetries = options.retryCount || 3;

  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      const response = await invokeLLM({ messages: options.messages });
      let content = '';
      const mc = response.choices[0]?.message?.content;
      if (typeof mc === 'string') content = mc;
      else if (Array.isArray(mc)) content = mc.map((c: any) => (c.type === 'text' ? c.text : '')).join('');

      const sanitized = sanitizeResponse(content);
      if (options.logSanitization && !sanitized.success) console.warn('[LLM] Sanitization warnings:', sanitized.warnings);

      return {
        success: true,
        content: sanitized.sanitized,
        sanitized: sanitized.sanitized !== content,
        sanitizationReport: options.logSanitization ? getSanitizationReport(content) : undefined,
        retries,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      if (retries >= maxRetries - 1) {
        return {
          success: false, content: '', sanitized: false,
          parseError: error instanceof Error ? error.message : 'Unknown error',
          retries, duration: Date.now() - startTime,
        };
      }
      await new Promise((r) => setTimeout(r, Math.pow(2, retries) * 1000));
    }
  }

  return { success: false, content: '', sanitized: false, parseError: 'Max retries exceeded', retries: maxRetries, duration: Date.now() - startTime };
}

export async function invokeLLMForJSON<T = any>(options: LLMCallOptions): Promise<{ success: boolean; data?: T; error?: string; retries: number; duration: number }> {
  const startTime = Date.now();
  const maxRetries = options.retryCount || 3;

  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      const response = await invokeLLM({ messages: options.messages });
      let content = '';
      const mc = response.choices[0]?.message?.content;
      if (typeof mc === 'string') content = mc;
      else if (Array.isArray(mc)) content = mc.map((c: any) => (c.type === 'text' ? c.text : '')).join('');

      const parsed = parseJSONSafely<T>(content);
      if (parsed.success) return { success: true, data: parsed.data, retries, duration: Date.now() - startTime };

      if (retries >= maxRetries - 1) return { success: false, error: parsed.error, retries, duration: Date.now() - startTime };
      await new Promise((r) => setTimeout(r, Math.pow(2, retries) * 1000));
    } catch (error) {
      if (retries >= maxRetries - 1) return { success: false, error: error instanceof Error ? error.message : 'Unknown error', retries, duration: Date.now() - startTime };
      await new Promise((r) => setTimeout(r, Math.pow(2, retries) * 1000));
    }
  }

  return { success: false, error: 'Max retries exceeded', retries: maxRetries, duration: Date.now() - startTime };
}

export async function batchInvokeLLM(prompts: string[], systemPrompt = 'You are a helpful assistant.') {
  const results: Array<{ success: boolean; content: string; error?: string }> = [];
  for (const prompt of prompts) {
    const r = await invokeLLMWithSanitization({ messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }] });
    results.push({ success: r.success, content: r.content, error: r.parseError });
  }
  return results;
}

export async function* streamLLMWithSanitization(options: LLMCallOptions): AsyncGenerator<string, void> {
  const result = await invokeLLMWithSanitization(options);
  if (result.success) yield result.content;
  else throw new Error(result.parseError || 'LLM call failed');
}

export const llmPipelineStats = {
  totalCalls: 0, successfulCalls: 0, failedCalls: 0, totalRetries: 0, totalDuration: 0, sanitizedResponses: 0,
  record(result: LLMCallResult) {
    this.totalCalls++;
    if (result.success) this.successfulCalls++; else this.failedCalls++;
    this.totalRetries += result.retries;
    this.totalDuration += result.duration;
    if (result.sanitized) this.sanitizedResponses++;
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
    this.totalCalls = 0; this.successfulCalls = 0; this.failedCalls = 0;
    this.totalRetries = 0; this.totalDuration = 0; this.sanitizedResponses = 0;
  },
};