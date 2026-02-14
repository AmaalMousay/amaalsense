import { z } from 'zod';

/**
 * Payload Validator
 * Prevents "Payload Too Large" errors by validating and chunking data
 */

interface PayloadValidationResult {
  valid: boolean;
  estimatedTokens: number;
  maxTokens: number;
  percentageUsed: number;
  errors: string[];
  warnings: string[];
}

interface ChunkedPayload {
  chunks: string[];
  totalChunks: number;
  tokensPerChunk: number;
}

const TOKEN_ESTIMATION_RATIO = 4; // 1 token ≈ 4 characters
const MAX_TOKENS_GROQ = 6000;
const SAFE_MARGIN = 0.8; // Use only 80% of max tokens

/**
 * Estimate token count from text
 */
export const estimateTokens = (text: string): number => {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / TOKEN_ESTIMATION_RATIO);
};

/**
 * Validate payload size
 */
export const validatePayload = (
  payload: string,
  maxTokens: number = MAX_TOKENS_GROQ
): PayloadValidationResult => {
  const estimatedTokens = estimateTokens(payload);
  const safeMaxTokens = maxTokens * SAFE_MARGIN;
  const percentageUsed = (estimatedTokens / safeMaxTokens) * 100;
  
  const result: PayloadValidationResult = {
    valid: estimatedTokens <= safeMaxTokens,
    estimatedTokens,
    maxTokens: Math.floor(safeMaxTokens),
    percentageUsed: Math.round(percentageUsed),
    errors: [],
    warnings: [],
  };
  
  if (estimatedTokens > maxTokens) {
    result.errors.push(`Payload exceeds hard limit: ${estimatedTokens} > ${maxTokens} tokens`);
  }
  
  if (estimatedTokens > safeMaxTokens) {
    result.errors.push(`Payload exceeds safe limit: ${estimatedTokens} > ${Math.floor(safeMaxTokens)} tokens`);
  }
  
  if (percentageUsed > 90) {
    result.warnings.push('Payload is using over 90% of safe token limit');
  }
  
  if (percentageUsed > 70) {
    result.warnings.push('Payload is using over 70% of safe token limit');
  }
  
  return result;
};

/**
 * Chunk payload into smaller pieces
 */
export const chunkPayload = (
  payload: string,
  maxTokensPerChunk: number = 4000
): ChunkedPayload => {
  const maxCharsPerChunk = maxTokensPerChunk * TOKEN_ESTIMATION_RATIO;
  const chunks: string[] = [];
  
  let remaining = payload;
  while (remaining.length > 0) {
    let chunk = remaining.substring(0, maxCharsPerChunk);
    
    // Try to break at sentence boundary
    const lastPeriod = chunk.lastIndexOf('.');
    const lastNewline = chunk.lastIndexOf('\n');
    const breakPoint = Math.max(lastPeriod, lastNewline);
    
    if (breakPoint > maxCharsPerChunk * 0.8) {
      chunk = chunk.substring(0, breakPoint + 1);
    }
    
    chunks.push(chunk.trim());
    remaining = remaining.substring(chunk.length).trim();
  }
  
  return {
    chunks,
    totalChunks: chunks.length,
    tokensPerChunk: maxTokensPerChunk,
  };
};

/**
 * Compress payload by removing redundancy
 */
export const compressPayload = (payload: string, targetTokens: number): string => {
  const currentTokens = estimateTokens(payload);
  
  if (currentTokens <= targetTokens) {
    return payload;
  }
  
  // Calculate compression ratio needed
  const compressionRatio = targetTokens / currentTokens;
  
  // Remove extra whitespace
  let compressed = payload.replace(/\s+/g, ' ').trim();
  
  if (estimateTokens(compressed) <= targetTokens) {
    return compressed;
  }
  
  // Remove less important content (keep first 80%, remove last 20%)
  const targetLength = Math.floor(compressed.length * compressionRatio);
  compressed = compressed.substring(0, targetLength);
  
  // Ensure we end at a word boundary
  const lastSpace = compressed.lastIndexOf(' ');
  if (lastSpace > targetLength * 0.9) {
    compressed = compressed.substring(0, lastSpace);
  }
  
  return compressed + '...';
};

/**
 * Summarize text to reduce token count
 */
export const summarizeForTokenLimit = (
  text: string,
  targetTokens: number
): string => {
  const currentTokens = estimateTokens(text);
  
  if (currentTokens <= targetTokens) {
    return text;
  }
  
  // Extract key sentences (first + last + some middle)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  if (sentences.length <= 2) {
    return compressPayload(text, targetTokens);
  }
  
  const summaryLength = Math.ceil(sentences.length * (targetTokens / currentTokens));
  const summary: string[] = [];
  
  // Add first sentence
  summary.push(sentences[0]);
  
  // Add some middle sentences
  const step = Math.floor(sentences.length / (summaryLength - 2));
  for (let i = step; i < sentences.length - 1; i += step) {
    if (summary.length < summaryLength - 1) {
      summary.push(sentences[i]);
    }
  }
  
  // Add last sentence
  if (summary.length < summaryLength) {
    summary.push(sentences[sentences.length - 1]);
  }
  
  return summary.join(' ').trim();
};

/**
 * Validate and fix payload
 */
export const validateAndFixPayload = (
  payload: string,
  maxTokens: number = MAX_TOKENS_GROQ
): { payload: string; validation: PayloadValidationResult } => {
  const validation = validatePayload(payload, maxTokens);
  
  if (validation.valid) {
    return { payload, validation };
  }
  
  // Try compression first
  const safeMaxTokens = Math.floor(maxTokens * SAFE_MARGIN);
  let fixed = compressPayload(payload, safeMaxTokens);
  
  // If still too large, try summarization
  if (estimateTokens(fixed) > safeMaxTokens) {
    fixed = summarizeForTokenLimit(payload, safeMaxTokens);
  }
  
  // Revalidate
  const newValidation = validatePayload(fixed, maxTokens);
  
  return { payload: fixed, validation: newValidation };
};

/**
 * Add JSON instruction to prompt
 */
export const addJsonInstruction = (prompt: string): string => {
  const jsonInstruction = 'Respond in JSON format only. ';
  
  // Check if instruction already exists
  if (prompt.toLowerCase().includes('respond in json') ||
      prompt.toLowerCase().includes('json format')) {
    return prompt;
  }
  
  // Add to beginning if it's a system prompt
  if (prompt.startsWith('You are') || prompt.startsWith('You\'re')) {
    return prompt + '\n\n' + jsonInstruction;
  }
  
  return jsonInstruction + prompt;
};

/**
 * Validate JSON response
 */
export const validateJsonResponse = (response: string): { valid: boolean; error?: string; data?: any } => {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { valid: false, error: 'No JSON object found in response' };
    }
    
    const data = JSON.parse(jsonMatch[0]);
    return { valid: true, data };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Invalid JSON' };
  }
};

export const payloadValidatorRouter = {
  estimateTokens,
  validatePayload,
  chunkPayload,
  compressPayload,
  summarizeForTokenLimit,
  validateAndFixPayload,
  addJsonInstruction,
  validateJsonResponse,
};
