/**
 * Manus API invoke — the low-level LLM call used as the paid/platform fallback.
 */

import { ENV } from '../env';
import type { InvokeParams, InvokeResult, Message, MessageContent, ToolChoice, Tool } from './types';

function ensureArray(value: MessageContent | MessageContent[]): MessageContent[] {
  return Array.isArray(value) ? value : [value];
}

function normalizeContentPart(part: MessageContent) {
  if (typeof part === 'string') return { type: 'text' as const, text: part };
  return part;
}

function normalizeMessage(message: Message) {
  const { role, name, tool_call_id } = message;
  if (role === 'tool' || role === 'function') {
    const content = ensureArray(message.content)
      .map((p) => (typeof p === 'string' ? p : JSON.stringify(p)))
      .join('\n');
    return { role, name, tool_call_id, content };
  }
  const parts = ensureArray(message.content).map(normalizeContentPart);
  if (parts.length === 1 && parts[0].type === 'text') {
    return { role, name, content: parts[0].text };
  }
  return { role, name, content: parts };
}

function normalizeToolChoice(toolChoice: ToolChoice | undefined, tools: Tool[] | undefined) {
  if (!toolChoice) return undefined;
  if (toolChoice === 'none' || toolChoice === 'auto') return toolChoice;
  if (toolChoice === 'required') {
    if (!tools || tools.length === 0) throw new Error("tool_choice 'required' with no tools");
    if (tools.length > 1) throw new Error("tool_choice 'required' needs a single tool");
    return { type: 'function' as const, function: { name: tools[0].function.name } };
  }
  if ('name' in toolChoice) return { type: 'function' as const, function: { name: toolChoice.name } };
  return toolChoice;
}

function resolveApiUrl() {
  return ENV.forgeApiUrl?.trim()
    ? `${ENV.forgeApiUrl.replace(/\/$/, '')}/v1/chat/completions`
    : 'https://forge.manus.im/v1/chat/completions';
}

function assertApiKey() {
  if (!ENV.forgeApiKey) throw new Error('LLM API key is not configured');
}

function normalizeResponseFormat({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: any;
  response_format?: any;
  outputSchema?: any;
  output_schema?: any;
}) {
  const explicit = responseFormat || response_format;
  if (explicit) return explicit;
  const schema = outputSchema || output_schema;
  if (!schema?.name || !schema?.schema) return undefined;
  return { type: 'json_schema' as const, json_schema: { name: schema.name, schema: schema.schema, ...(typeof schema.strict === 'boolean' ? { strict: schema.strict } : {}) } };
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  assertApiKey();

  const payload: Record<string, unknown> = {
    model: 'mixtral-8x7b-32768',
    messages: params.messages.map(normalizeMessage),
  };

  if (params.tools?.length) payload.tools = params.tools;
  const tc = normalizeToolChoice(params.toolChoice || params.tool_choice, params.tools);
  if (tc) payload.tool_choice = tc;
  payload.max_tokens = 8192;

  const fmt = normalizeResponseFormat(params);
  if (fmt) payload.response_format = fmt;

  const response = await fetch(resolveApiUrl(), {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${ENV.forgeApiKey}` },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`LLM invoke failed: ${response.status} ${response.statusText} – ${await response.text()}`);
  return response.json() as Promise<InvokeResult>;
}