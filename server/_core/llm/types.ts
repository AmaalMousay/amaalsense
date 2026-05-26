/**
 * LLM Type Definitions
 */

export type Role = 'system' | 'user' | 'assistant' | 'tool' | 'function';

export type TextContent = { type: 'text'; text: string };
export type ImageContent = { type: 'image_url'; image_url: { url: string; detail?: 'auto' | 'low' | 'high' } };
export type FileContent = { type: 'file_url'; file_url: { url: string; mime_type?: 'audio/mpeg' | 'audio/wav' | 'application/pdf' | 'audio/mp4' | 'video/mp4' } };
export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: 'function';
  function: { name: string; description?: string; parameters?: Record<string, unknown> };
};

export type ToolChoicePrimitive = 'none' | 'auto' | 'required';
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = { type: 'function'; function: { name: string } };
export type ToolChoice = ToolChoicePrimitive | ToolChoiceByName | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } };

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: Role; content: string | Array<TextContent | ImageContent | FileContent>; tool_calls?: ToolCall[] };
    finish_reason: string | null;
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
};

export type JsonSchema = { name: string; schema: Record<string, unknown>; strict?: boolean };
export type OutputSchema = JsonSchema;
export type ResponseFormat = { type: 'text' } | { type: 'json_object' } | { type: 'json_schema'; json_schema: JsonSchema };

export type TaskType =
  | 'question_understanding'
  | 'response_generation'
  | 'translation'
  | 'suggestions'
  | 'emotion_analysis'
  | 'greeting_response'
  | 'general';

export type LLMProvider = 'free_hosted' | 'openrouter' | 'ollama' | 'manus' | 'disabled';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMCompletionOptions {
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
  provider?: LLMProvider;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  tokens?: { prompt: number; completion: number; total: number };
}

export interface LLMCallOptions {
  messages: Array<{ role: 'system' | 'user' | 'assistant' | 'tool'; content: string | any[] }>;
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
