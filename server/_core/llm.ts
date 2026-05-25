import { ENV } from "./env";
import { sanitizeResponse, parseJSONSafely, getSanitizationReport } from "../engines/responseSanitizationLayer";
import { t } from "./i18n";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4" ;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

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

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

const resolveApiUrl = () =>
  ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
    ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
    : "https://forge.manus.im/v1/chat/completions";

const assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  assertApiKey();

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
  } = params;

  const payload: Record<string, unknown> = {
    model: "mixtral-8x7b-32768",
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  payload.max_tokens = 8192

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }

  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  return (await response.json()) as InvokeResult;
}


// =============================================================================
// SMART / SOVEREIGN LLM PROVIDER (merged from engines/smartLLM.ts)
// =============================================================================

/**
 * AMALSENSE SOVEREIGN LLM PROVIDER (Autonomous Edition)
 *  :        .
 */

export type TaskType =
  | 'question_understanding'
  | 'response_generation'
  | 'translation'
  | 'suggestions'
  | 'emotion_analysis'
  | 'greeting_response'
  | 'general';

/**
 *   :        (Fallback)
 */
export async function smartInvokeLLM(
  params: InvokeParams,
  taskType: TaskType = 'general'
): Promise<InvokeResult> {

  const unifiedMessages = params.messages.map(m => {
    let finalContent: string = '';
    if (typeof m.content === 'string') {
      finalContent = m.content;
    } else if (Array.isArray(m.content)) {
      finalContent = m.content.map((item: any) => {
        if (item.type === 'text') return item.text;
        return JSON.stringify(item);
      }).join('\n');
    } else {
      finalContent = String(m.content);
    }
    return { role: m.role as string, content: finalContent };
  });

  const prompt = unifiedMessages.map(m => `${m.role}: ${m.content}`).join('\n');

  const providerPreference = (process.env.LLM_PROVIDER || 'pollinations').toLowerCase();
  const allowLocal = process.env.ENABLE_LOCAL_LLM === 'true' || providerPreference === 'ollama';
  const allowFreeHosted = process.env.ALLOW_FREE_HOSTED_LLM !== 'false';
  const allowPaidFallback = process.env.ALLOW_PAID_LLM === 'true';
  const pollinationsModel = process.env.POLLINATIONS_MODEL || 'openai';
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const openRouterModel = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free';
  const openRouterBaseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

  // Optional free OpenRouter models (for example DeepSeek :free). Requires API key but can use free models.
  if (providerPreference === 'openrouter' && openRouterApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Number(process.env.LLM_TIMEOUT_MS || 20000));
      const response = await fetch(openRouterBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': process.env.APP_PUBLIC_URL || 'http://localhost:3000',
          'X-Title': process.env.APP_NAME || 'AmalSense',
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: unifiedMessages.map(m => ({
            role: ['system', 'user', 'assistant'].includes(m.role) ? m.role : 'user',
            content: m.content,
          })),
          temperature: 0.45,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || '';
        if (content) return formatToInvokeResult(content, `openrouter:${openRouterModel}`);
      } else {
        console.warn(`[SmartLLM] OpenRouter failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log('[SmartLLM] OpenRouter provider failed. Falling back to free hosted provider.');
    }
  }

  // Free hosted model first by default: no local GPU and no paid quota required.
  if (allowFreeHosted && providerPreference !== 'ollama') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Number(process.env.LLM_TIMEOUT_MS || 15000));
      const response = await fetch(`${process.env.POLLINATIONS_BASE_URL || 'https://text.pollinations.ai/'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: unifiedMessages, model: pollinationsModel, seed: 42 }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const text = await response.text();
        return formatToInvokeResult(text, `pollinations:${pollinationsModel}`);
      }
    } catch (error) {
      console.log('[SmartLLM] Free hosted Pollinations provider failed.');
    }
  }

  // Optional local model for users/servers that explicitly enable it.
  if (allowLocal) {
    try {
      const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: ollamaModel, prompt, stream: false })
      });
      if (response.ok) {
        const data = await response.json();
        return formatToInvokeResult(data.response, `ollama:${ollamaModel}`);
      }
    } catch (e) {
      console.log('[SmartLLM] Optional local Ollama provider not available.');
    }
  }

  // Paid/platform fallback is disabled by default to avoid surprise costs.
  if (allowPaidFallback) {
    try {
      return await invokeLLM(params);
    } catch (error) {
      console.error('[SmartLLM] Paid/platform fallback failed.');
    }
  }

  return formatToInvokeResult(
    t('llmProviderUnavailable', 'ar'),
    'llm-disabled-or-unavailable'
  );
}

function formatToInvokeResult(content: string, modelName: string): InvokeResult {
  return {
    id: `as-${Date.now()}`,
    created: Date.now(),
    model: modelName,
    choices: [{
      index: 0,
      message: { role: 'assistant', content: content },
      finish_reason: 'stop'
    }]
  };
}

export async function smartChat(system: string, user: string, task: TaskType = 'general'): Promise<string> {
  const res = await smartInvokeLLM({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ]
  }, task);

  const content = res.choices[0].message.content;
  return typeof content === 'string' ? content : JSON.stringify(content);
}

export async function smartJsonChat(system: string, user: string, task: TaskType = 'general'): Promise<any> {
  const res = await smartChat(system + " Respond in valid JSON only.", user, task);
  try {
    return JSON.parse(res);
  } catch {
    return { result: res };
  }
}


// =============================================================================
// LLM PROVIDER ABSTRACTION (merged from engines/llmProvider.ts)
// =============================================================================

/**
 * LLM Provider Abstraction Layer
 * 
 * This layer allows switching between different LLM providers:
 * - Manus Built-in API (default for development)
 * - Groq Cloud with Qwen (open-source, portable)
 * 
 * The system automatically selects the best available provider.
 */

// Provider types
export type LLMProvider = 'free_hosted' | 'openrouter' | 'ollama' | 'manus' | 'disabled';

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
  const provider = (process.env.LLM_PROVIDER || 'free_hosted').toLowerCase();
  if (provider === 'openrouter') return process.env.OPENROUTER_API_KEY ? 'openrouter' : 'free_hosted';
  if (provider === 'ollama') return 'ollama';
  if (provider === 'manus') return process.env.ALLOW_PAID_LLM === 'true' ? 'manus' : 'free_hosted';
  if (provider === 'disabled') return 'disabled';
  return 'free_hosted';
}

/**
 * Check which providers are available
 */
export function getAvailableProviders(): { provider: LLMProvider; available: boolean; reason?: string }[] {
  return [
    { provider: 'free_hosted', available: process.env.ALLOW_FREE_HOSTED_LLM !== 'false', reason: 'Pollinations hosted free provider' },
    { provider: 'openrouter', available: !!process.env.OPENROUTER_API_KEY, reason: 'OpenRouter API key; can use free DeepSeek models such as deepseek/deepseek-r1:free' },
    { provider: 'ollama', available: process.env.ENABLE_LOCAL_LLM === 'true', reason: 'Optional local Ollama provider' },
    { provider: 'manus', available: process.env.ALLOW_PAID_LLM === 'true', reason: 'Disabled by default to avoid paid/API quota usage' },
    { provider: 'disabled', available: true, reason: 'No LLM text generation' },
  ];
}

/**
 * Invoke LLM using the best available provider
 */
export async function invokeLLMProvider(options: LLMCompletionOptions): Promise<LLMResponse> {
  const provider = options.provider || getActiveProvider();
  
  if (provider === 'disabled') {
    return { content: '', provider: 'disabled', model: 'none' };
  }
  if (provider === 'manus') {
    return invokeManusProvider(options);
  }
  return invokeFreeHostedProvider(options);
}

/**
 * Invoke Smart provider
 */
async function invokeFreeHostedProvider(options: LLMCompletionOptions): Promise<LLMResponse> {
  const response = await smartInvokeLLM({
    messages: options.messages.map(m => ({ role: m.role, content: m.content }))
  }, 'general');
  return {
    content: typeof response.choices[0]?.message?.content === 'string' ? response.choices[0].message.content : '',
    provider: response.model?.startsWith('openrouter:') ? 'openrouter' : getActiveProvider() === 'ollama' ? 'ollama' : 'free_hosted',
    model: response.model || 'pollinations',
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
    case 'free_hosted':
      return {
        name: 'Free Hosted LLM',
        description: 'Hosted free model provider, no local GPU required',
        model: process.env.POLLINATIONS_MODEL || 'openai',
        isOpenSource: true,
        isFree: true,
      };
    case 'openrouter':
      return {
        name: 'OpenRouter Free Model',
        description: 'Hosted API that can route to free DeepSeek models when available',
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free',
        isOpenSource: true,
        isFree: true,
      };
    case 'ollama':
      return {
        name: 'Ollama Local',
        description: 'Optional local model provider',
        model: process.env.OLLAMA_MODEL || 'qwen2.5:7b',
        isOpenSource: true,
        isFree: true,
      };
    case 'manus':
      return {
        name: 'Manus AI',
        description: 'Built-in AI service; disabled unless ALLOW_PAID_LLM=true',
        model: 'Manus Default',
        isOpenSource: false,
        isFree: false,
      };
    case 'disabled':
      return {
        name: 'Disabled',
        description: 'No LLM text generation enabled',
        model: 'none',
        isOpenSource: true,
        isFree: true,
      };
  }
}


// =============================================================================
// LLM SANITIZATION PIPELINE (merged from engines/llmPipelineWithSanitization.ts)
// =============================================================================

/**
 * LLM Pipeline with Sanitization Integration
 * 
 * Wraps all LLM calls with automatic response sanitization
 * Eliminates JSON parsing failures in production
 */

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
  const results: Array<{ success: boolean; content: string; error?: string }> = [];
  
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
