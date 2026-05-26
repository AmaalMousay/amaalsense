/**
 * LLM Module
 *
 * Re-exports from the llm/ folder so all existing imports still work.
 * The module was split from one 1000-line file into:
 *   - types.ts       — type definitions (~130 lines)
 *   - invoke.ts      — low-level Manus API call (~70 lines)
 *   - provider.ts    — multi-provider abstraction (OpenRouter, Pollinations, Ollama) (~190 lines)
 *   - sanitization.ts— retry + JSON sanitization pipeline (~110 lines)
 */

export type {
  Role, TextContent, ImageContent, FileContent, MessageContent, Message,
  Tool, ToolChoice, ToolChoicePrimitive, ToolChoiceByName, ToolChoiceExplicit,
  InvokeParams, ToolCall, InvokeResult,
  JsonSchema, OutputSchema, ResponseFormat,
  TaskType, LLMProvider, LLMMessage, LLMCompletionOptions, LLMResponse,
  LLMCallOptions, LLMCallResult,
} from './llm/types';

export { invokeLLM } from './llm/invoke';

export {
  smartInvokeLLM, smartChat, smartJsonChat,
  getActiveProvider, getAvailableProviders,
  invokeLLMProvider, getProviderInfo,
  chat, conversation,
} from './llm/provider';

export {
  invokeLLMWithSanitization, invokeLLMForJSON,
  batchInvokeLLM, streamLLMWithSanitization,
  llmPipelineStats,
} from './llm/sanitization';
