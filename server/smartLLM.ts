/**
 * SMART LLM PROVIDER
 * 
 * نظام ذكي لإدارة مزودي LLM مع Fallback تلقائي
 * 
 * الاستراتيجية:
 * 1. Groq (أساسي) - مجاني، سريع، 14,400+ طلب/يوم
 *    - Llama 3.1 8B: للمهام البسيطة (فهم السؤال، ترجمة، اقتراحات)
 *    - Llama 3.3 70B: للمهام المعقدة (توليد الإجابة الرئيسية)
 * 2. Forge/Manus (احتياطي) - عند فشل Groq
 */

import { ENV } from './_core/env';
import { invokeLLM, type InvokeParams, type InvokeResult } from './_core/llm';

// ============================================
// CONFIGURATION
// ============================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/** نماذج Groq المتاحة مع أدوارها */
export const SMART_MODELS = {
  // للمهام البسيطة: فهم السؤال، تصنيف، ترجمة (14,400 طلب/يوم)
  FAST: 'llama-3.1-8b-instant',
  // للمهام المعقدة: توليد الإجابة الرئيسية (1,000 طلب/يوم)
  POWERFUL: 'llama-3.3-70b-versatile',
  // للمهام العربية المتخصصة (1,000 طلب/يوم)
  ARABIC: 'qwen/qwen3-32b',
} as const;

/** أنواع المهام وتوجيه النماذج */
export type TaskType = 
  | 'question_understanding'  // Layer 1: فهم السؤال → FAST
  | 'response_generation'     // Layer 16: توليد الإجابة → POWERFUL
  | 'translation'             // Layer 18: ترجمة → FAST
  | 'suggestions'             // اقتراحات المتابعة → FAST
  | 'emotion_analysis'        // تحليل المشاعر → FAST
  | 'general';                // عام → POWERFUL

/** خريطة توجيه المهام للنماذج */
const TASK_MODEL_MAP: Record<TaskType, string> = {
  question_understanding: SMART_MODELS.FAST,
  response_generation: SMART_MODELS.POWERFUL,
  translation: SMART_MODELS.FAST,
  suggestions: SMART_MODELS.FAST,
  emotion_analysis: SMART_MODELS.FAST,
  general: SMART_MODELS.POWERFUL,
};

// ============================================
// USAGE TRACKING
// ============================================

interface UsageStats {
  groqCalls: number;
  forgeCalls: number;
  groqErrors: number;
  forgeErrors: number;
  lastGroqError: string | null;
  lastForgeError: string | null;
  lastReset: number;
}

const usage: UsageStats = {
  groqCalls: 0,
  forgeCalls: 0,
  groqErrors: 0,
  forgeErrors: 0,
  lastGroqError: null,
  lastForgeError: null,
  lastReset: Date.now(),
};

/** إعادة تعيين الإحصائيات يومياً */
function resetDailyStats() {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  if (now - usage.lastReset > oneDayMs) {
    usage.groqCalls = 0;
    usage.forgeCalls = 0;
    usage.groqErrors = 0;
    usage.forgeErrors = 0;
    usage.lastGroqError = null;
    usage.lastForgeError = null;
    usage.lastReset = now;
  }
}

/** الحصول على إحصائيات الاستخدام */
export function getSmartLLMStats(): UsageStats & { provider: string } {
  resetDailyStats();
  return {
    ...usage,
    provider: isGroqAvailable() ? 'groq' : 'forge',
  };
}

// ============================================
// GROQ API CALL
// ============================================

function isGroqAvailable(): boolean {
  return !!(ENV.groqApiKey && ENV.groqApiKey.length > 0);
}

interface GroqCallOptions {
  messages: Array<{ role: string; content: string }>;
  model: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string } | { type: string; json_schema: any };
}

async function callGroq(options: GroqCallOptions): Promise<InvokeResult> {
  const apiKey = ENV.groqApiKey;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  // Groq لا يدعم json_schema، نحوّلها لـ json_object
  let responseFormat = options.response_format;
  if (responseFormat && (responseFormat as any).type === 'json_schema') {
    responseFormat = { type: 'json_object' };
  }

  const requestBody: any = {
    model: options.model,
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 4096,
    stream: false,
  };

  if (responseFormat) {
    requestBody.response_format = responseFormat;
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  // تحويل استجابة Groq لتتوافق مع InvokeResult
  return {
    id: data.id || `groq-${Date.now()}`,
    created: data.created || Math.floor(Date.now() / 1000),
    model: data.model || options.model,
    choices: data.choices.map((c: any) => ({
      index: c.index,
      message: {
        role: c.message.role,
        content: c.message.content || '',
      },
      finish_reason: c.finish_reason,
    })),
    usage: data.usage ? {
      prompt_tokens: data.usage.prompt_tokens || 0,
      completion_tokens: data.usage.completion_tokens || 0,
      total_tokens: data.usage.total_tokens || 0,
    } : undefined,
  };
}

// ============================================
// SMART INVOKE - Main Entry Point
// ============================================

/**
 * استدعاء LLM ذكي مع Fallback تلقائي
 * 
 * يحاول Groq أولاً (مجاني وسريع)، إذا فشل ينتقل لـ Forge
 * يختار النموذج المناسب بناءً على نوع المهمة
 * 
 * @param params - نفس معاملات invokeLLM الأصلية
 * @param taskType - نوع المهمة لتوجيه النموذج (اختياري)
 * @returns نفس نوع InvokeResult
 */
export async function smartInvokeLLM(
  params: InvokeParams,
  taskType: TaskType = 'general'
): Promise<InvokeResult> {
  resetDailyStats();
  
  const model = TASK_MODEL_MAP[taskType];
  
  // تحويل الرسائل لصيغة Groq
  const groqMessages = params.messages.map(m => ({
    role: m.role as string,
    content: typeof m.content === 'string' 
      ? m.content 
      : Array.isArray(m.content)
        ? m.content.map((c: any) => c.type === 'text' ? c.text : JSON.stringify(c)).join('\n')
        : String(m.content),
  }));

  // ============================================
  // محاولة 1: Groq (أساسي)
  // ============================================
  if (isGroqAvailable()) {
    try {
      console.log(`[SmartLLM] Calling Groq (${model}) for ${taskType}...`);
      
      const result = await callGroq({
        messages: groqMessages,
        model,
        temperature: 0.7,
        max_tokens: params.maxTokens || params.max_tokens || 4096,
        response_format: params.responseFormat || params.response_format as any,
      });
      
      usage.groqCalls++;
      console.log(`[SmartLLM] Groq success (${model}) - ${result.usage?.total_tokens || 0} tokens`);
      return result;
      
    } catch (error) {
      usage.groqErrors++;
      usage.lastGroqError = error instanceof Error ? error.message : String(error);
      console.warn(`[SmartLLM] Groq failed (${model}):`, usage.lastGroqError);
      
      // إذا كان النموذج الكبير فشل، جرب النموذج الصغير
      if (model !== SMART_MODELS.FAST) {
        try {
          console.log(`[SmartLLM] Retrying with fast model (${SMART_MODELS.FAST})...`);
          const result = await callGroq({
            messages: groqMessages,
            model: SMART_MODELS.FAST,
            temperature: 0.7,
            max_tokens: params.maxTokens || params.max_tokens || 4096,
            response_format: params.responseFormat || params.response_format as any,
          });
          
          usage.groqCalls++;
          console.log(`[SmartLLM] Groq fallback success (${SMART_MODELS.FAST})`);
          return result;
          
        } catch (fallbackError) {
          usage.groqErrors++;
          console.warn(`[SmartLLM] Groq fallback also failed:`, fallbackError);
        }
      }
    }
  }

  // ============================================
  // محاولة 2: Forge/Manus (احتياطي)
  // ============================================
  try {
    console.log(`[SmartLLM] Falling back to Forge API...`);
    const result = await invokeLLM(params);
    usage.forgeCalls++;
    console.log(`[SmartLLM] Forge success`);
    return result;
  } catch (forgeError) {
    usage.forgeErrors++;
    usage.lastForgeError = forgeError instanceof Error ? forgeError.message : String(forgeError);
    console.error(`[SmartLLM] All providers failed! Groq: ${usage.lastGroqError}, Forge: ${usage.lastForgeError}`);
    throw new Error(`All LLM providers failed. Groq: ${usage.lastGroqError || 'N/A'}. Forge: ${usage.lastForgeError}`);
  }
}

/**
 * اختصار: استدعاء سريع للمهام البسيطة
 */
export async function smartChat(
  systemPrompt: string,
  userMessage: string,
  taskType: TaskType = 'general'
): Promise<string> {
  const result = await smartInvokeLLM({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  }, taskType);
  
  const content = result.choices[0]?.message?.content;
  return typeof content === 'string' ? content : JSON.stringify(content) || '';
}

/**
 * اختصار: استدعاء مع JSON response
 */
export async function smartJsonChat(
  systemPrompt: string,
  userMessage: string,
  taskType: TaskType = 'general'
): Promise<any> {
  const result = await smartInvokeLLM({
    messages: [
      { role: 'system', content: systemPrompt + '\n\nRespond ONLY in valid JSON format.' },
      { role: 'user', content: userMessage },
    ],
    response_format: { type: 'json_object' } as any,
  }, taskType);
  
  const content = result.choices[0]?.message?.content;
  const text = typeof content === 'string' ? content : JSON.stringify(content) || '{}';
  
  try {
    return JSON.parse(text);
  } catch {
    console.warn('[SmartLLM] Failed to parse JSON response, returning raw text');
    return { raw: text };
  }
}
