/**
 * Multi-provider LLM abstraction layer.
 *
 * Provider priority:
 *   1. OpenRouter (when provider=openrouter + API key)
 *   2. Pollinations (free hosted, default)
 *   3. Ollama (local, when explicitly enabled)
 *   4. Manus API (paid fallback, when ALLOW_PAID_LLM=true)
 */

import { t } from '../i18n';
import { invokeLLM } from './invoke';
import type {
  InvokeParams, InvokeResult, TaskType,
  LLMProvider, LLMMessage, LLMCompletionOptions, LLMResponse,
} from './types';

// ---------------------------------------------------------------------------
// Smart Invoke (multi-provider)
// ---------------------------------------------------------------------------

function formatToInvokeResult(content: string, modelName: string): InvokeResult {
  return {
    id: `as-${Date.now()}`,
    created: Date.now(),
    model: modelName,
    choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
  };
}

export async function smartInvokeLLM(params: InvokeParams, _taskType: TaskType = 'general'): Promise<InvokeResult> {
  const unifiedMessages = params.messages.map((m) => {
    let content = '';
    if (typeof m.content === 'string') content = m.content;
    else if (Array.isArray(m.content)) content = m.content.map((c: any) => (c.type === 'text' ? c.text : JSON.stringify(c))).join('\n');
    else content = String(m.content);
    return { role: m.role as string, content };
  });

  const prompt = unifiedMessages.map((m) => `${m.role}: ${m.content}`).join('\n');
  const pref = (process.env.LLM_PROVIDER || 'pollinations').toLowerCase();
  const allowLocal = process.env.ENABLE_LOCAL_LLM === 'true' || pref === 'ollama';
  const allowFreeHosted = process.env.ALLOW_FREE_HOSTED_LLM !== 'false';
  const allowPaid = process.env.ALLOW_PAID_LLM === 'true';

  // 1) OpenRouter
  if (pref === 'openrouter' && process.env.OPENROUTER_API_KEY) {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), Number(process.env.LLM_TIMEOUT_MS || 20000));
      const res = await fetch(process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.APP_PUBLIC_URL || 'http://localhost:3000',
          'X-Title': process.env.APP_NAME || 'AmalSense',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free',
          messages: unifiedMessages.map((m) => ({ role: m.role, content: m.content })),
          temperature: 0.45,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content || '';
        if (content) return formatToInvokeResult(content, `openrouter:${process.env.OPENROUTER_MODEL || 'deepseek'}`);
      }
    } catch { /* fall through */ }
  }

  // 2) Pollinations (free hosted)
  if (allowFreeHosted && pref !== 'ollama') {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), Number(process.env.LLM_TIMEOUT_MS || 15000));
      const res = await fetch(process.env.POLLINATIONS_BASE_URL || 'https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: unifiedMessages, model: process.env.POLLINATIONS_MODEL || 'openai', seed: 42 }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      if (res.ok) return formatToInvokeResult(await res.text(), `pollinations:${process.env.POLLINATIONS_MODEL || 'openai'}`);
    } catch { /* fall through */ }
  }

  // 3) Ollama (local)
  if (allowLocal) {
    try {
      const res = await fetch(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: process.env.OLLAMA_MODEL || 'qwen2.5:7b', prompt, stream: false }),
      });
      if (res.ok) {
        const data = await res.json();
        return formatToInvokeResult(data.response, `ollama:${process.env.OLLAMA_MODEL || 'qwen2.5:7b'}`);
      }
    } catch { /* fall through */ }
  }

  // 4) Manus API (paid fallback)
  if (allowPaid) {
    try { return await invokeLLM(params); } catch { /* fall through */ }
  }

  return formatToInvokeResult(t('llmProviderUnavailable', 'ar'), 'llm-disabled-or-unavailable');
}

export async function smartChat(system: string, user: string, task: TaskType = 'general'): Promise<string> {
  const res = await smartInvokeLLM(
    { messages: [{ role: 'system', content: system }, { role: 'user', content: user }] },
    task,
  );
  const c = res.choices[0]?.message?.content;
  return typeof c === 'string' ? c : JSON.stringify(c);
}

export async function smartJsonChat(system: string, user: string, task: TaskType = 'general'): Promise<any> {
  const res = await smartChat(system + ' Respond in valid JSON only.', user, task);
  try { return JSON.parse(res); } catch { return { result: res }; }
}

// ---------------------------------------------------------------------------
// Provider selection helpers
// ---------------------------------------------------------------------------

export function getActiveProvider(): LLMProvider {
  const p = (process.env.LLM_PROVIDER || 'free_hosted').toLowerCase();
  if (p === 'openrouter') return process.env.OPENROUTER_API_KEY ? 'openrouter' : 'free_hosted';
  if (p === 'ollama') return 'ollama';
  if (p === 'manus') return process.env.ALLOW_PAID_LLM === 'true' ? 'manus' : 'free_hosted';
  if (p === 'disabled') return 'disabled';
  return 'free_hosted';
}

export function getAvailableProviders() {
  return [
    { provider: 'free_hosted' as const, available: process.env.ALLOW_FREE_HOSTED_LLM !== 'false', reason: 'Pollinations hosted free provider' },
    { provider: 'openrouter' as const, available: !!process.env.OPENROUTER_API_KEY, reason: 'OpenRouter API key' },
    { provider: 'ollama' as const, available: process.env.ENABLE_LOCAL_LLM === 'true', reason: 'Optional local Ollama' },
    { provider: 'manus' as const, available: process.env.ALLOW_PAID_LLM === 'true', reason: 'Paid Manus API (disabled by default)' },
    { provider: 'disabled' as const, available: true, reason: 'No LLM text generation' },
  ];
}

export async function invokeLLMProvider(options: LLMCompletionOptions): Promise<LLMResponse> {
  const provider = options.provider || getActiveProvider();
  if (provider === 'disabled') return { content: '', provider: 'disabled', model: 'none' };
  if (provider === 'manus') return invokeManusProvider(options);
  return invokeFreeHostedProvider(options);
}

export function getProviderInfo(provider: LLMProvider) {
  const m = process.env.POLLINATIONS_MODEL || 'openai';
  const defaults: Record<string, { name: string; description: string; model: string; isOpenSource: boolean; isFree: boolean }> = {
    free_hosted: { name: 'Free Hosted LLM', description: 'Hosted free model', model: m, isOpenSource: true, isFree: true },
    openrouter: { name: 'OpenRouter Free Model', description: 'Routes to free DeepSeek models', model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free', isOpenSource: true, isFree: true },
    ollama: { name: 'Ollama Local', description: 'Local model provider', model: process.env.OLLAMA_MODEL || 'qwen2.5:7b', isOpenSource: true, isFree: true },
    manus: { name: 'Manus AI', description: 'Built-in AI service', model: 'Manus Default', isOpenSource: false, isFree: false },
    disabled: { name: 'Disabled', description: 'No LLM enabled', model: 'none', isOpenSource: true, isFree: true },
  };
  return defaults[provider] || defaults.disabled;
}

async function invokeFreeHostedProvider(options: LLMCompletionOptions): Promise<LLMResponse> {
  const r = await smartInvokeLLM({ messages: options.messages.map((m) => ({ role: m.role as any, content: m.content })) }, 'general');
  return {
    content: typeof r.choices[0]?.message?.content === 'string' ? r.choices[0].message.content : '',
    provider: r.model?.startsWith('openrouter:') ? 'openrouter' : getActiveProvider() === 'ollama' ? 'ollama' : 'free_hosted',
    model: r.model || 'pollinations',
  };
}

async function invokeManusProvider(options: LLMCompletionOptions): Promise<LLMResponse> {
  const r = await invokeLLM({ messages: options.messages.map((m) => ({ role: m.role as any, content: m.content })) });
  const c = r.choices[0]?.message?.content;
  return {
    content: typeof c === 'string' ? c : Array.isArray(c) ? c.map((x: any) => x.text ?? '').join('') : '',
    provider: 'manus',
    model: 'manus-default',
    tokens: { prompt: r.usage?.prompt_tokens || 0, completion: r.usage?.completion_tokens || 0, total: r.usage?.total_tokens || 0 },
  };
}

export async function chat(systemPrompt: string, userMessage: string, options?: { provider?: LLMProvider; temperature?: number }): Promise<string> {
  const r = await invokeLLMProvider({ messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }], ...options });
  return r.content;
}

export async function conversation(systemPrompt: string, history: LLMMessage[], options?: { provider?: LLMProvider; temperature?: number }): Promise<LLMResponse> {
  return invokeLLMProvider({ messages: [{ role: 'system', content: systemPrompt }, ...history], ...options });
}