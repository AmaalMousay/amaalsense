/**
 * OpenAI API Integration Layer
 * خيار ثالث للنماذج اللغوية (بعد Groq و TinyLlama)
 */

// Message type definition
type Message = {
  role: "system" | "user" | "assistant" | "tool" | "function";
  content: string | any;
};

interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * إعدادات OpenAI الافتراضية
 */
const defaultConfig: OpenAIConfig = {
  apiKey: process.env.OPENAI_API_KEY || "",
  model: "gpt-4-turbo-preview",
  temperature: 0.7,
  maxTokens: 2000
};

/**
 * التحقق من توفر OpenAI API
 */
export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * استدعاء OpenAI API
 */
export async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  config: Partial<OpenAIConfig> = {}
): Promise<OpenAIResponse> {
  const finalConfig = { ...defaultConfig, ...config };

  if (!finalConfig.apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${finalConfig.apiKey}`
      },
      body: JSON.stringify({
        model: finalConfig.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: finalConfig.temperature,
        max_tokens: finalConfig.maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = (await response.json()) as OpenAIResponse;
    return data;

  } catch (error) {
    console.error("[OpenAI] API call failed:", error);
    throw error;
  }
}

/**
 * استخراج النص من استجابة OpenAI
 */
export function extractText(response: OpenAIResponse): string {
  if (response.choices && response.choices.length > 0) {
    return response.choices[0].message.content;
  }
  throw new Error("No response content from OpenAI");
}

/**
 * حساب تكلفة الطلب
 */
export function calculateCost(usage: {
  prompt_tokens: number;
  completion_tokens: number;
}): number {
  // أسعار GPT-4 Turbo (يناير 2024)
  const promptCost = usage.prompt_tokens * 0.01 / 1000; // $0.01 per 1K tokens
  const completionCost = usage.completion_tokens * 0.03 / 1000; // $0.03 per 1K tokens
  return promptCost + completionCost;
}

/**
 * نموذج الاختيار الذكي بين OpenAI و Groq
 */
export async function smartModelSelection(
  question: string,
  options: {
    preferOpenAI?: boolean;
    maxCost?: number;
    prioritySpeed?: boolean;
  } = {}
): Promise<{
  selectedModel: "openai" | "groq" | "tinyllama";
  reason: string;
  estimatedCost?: number;
  estimatedTime?: number;
}> {
  // إذا كان السؤال معقداً جداً، استخدم OpenAI
  if (question.length > 500 || question.split(" ").length > 100) {
    if (isOpenAIAvailable() && (!options.maxCost || options.maxCost > 0.1)) {
      return {
        selectedModel: "openai",
        reason: "Complex question requires advanced model",
        estimatedCost: 0.05,
        estimatedTime: 2000
      };
    }
  }

  // إذا كان المستخدم يفضل السرعة، استخدم Groq
  if (options.prioritySpeed) {
    return {
      selectedModel: "groq",
      reason: "Speed priority selected",
      estimatedCost: 0,
      estimatedTime: 500
    };
  }

  // إذا كان المستخدم يفضل OpenAI وكان متوفراً
  if (options.preferOpenAI && isOpenAIAvailable()) {
    return {
      selectedModel: "openai",
      reason: "User preference for OpenAI",
      estimatedCost: 0.03,
      estimatedTime: 1500
    };
  }

  // الخيار الافتراضي: Groq
  return {
    selectedModel: "groq",
    reason: "Default selection (fast and free)",
    estimatedCost: 0,
    estimatedTime: 500
  };
}

/**
 * معالج الأخطاء والانتقال بين النماذج
 */
export async function robustLLMCall(
  messages: Array<{ role: string; content: string }>,
  options: {
    preferredModel?: "openai" | "groq" | "tinyllama";
    fallbackOrder?: ("openai" | "groq" | "tinyllama")[];
    timeout?: number;
  } = {}
): Promise<{
  content: string;
  model: string;
  cost?: number;
  processingTime: number;
}> {
  const startTime = Date.now();
  const fallbackOrder = options.fallbackOrder || ["groq", "openai", "tinyllama"];

  for (const model of fallbackOrder) {
    try {
      console.log(`[LLM] Attempting ${model}...`);

      let response: any;
      let cost = 0;

      if (model === "openai" && isOpenAIAvailable()) {
        response = await callOpenAI(messages);
        cost = calculateCost(response.usage);
      } else if (model === "groq") {
        // استخدام Groq (موجود بالفعل)
        response = await callGroq(messages);
      } else if (model === "tinyllama") {
        // استخدام TinyLlama المحلي
        response = await callTinyLlama(messages);
      }

      const processingTime = Date.now() - startTime;
      return {
        content: extractResponseContent(response, model),
        model,
        cost,
        processingTime
      };

    } catch (error) {
      console.warn(`[LLM] ${model} failed:`, error);
      continue;
    }
  }

  throw new Error("All LLM models failed");
}

/**
 * استخراج محتوى الاستجابة حسب نوع النموذج
 */
function extractResponseContent(response: any, model: string): string {
  if (model === "openai") {
    return response.choices[0].message.content;
  } else if (model === "groq") {
    return response.choices[0].message.content;
  } else if (model === "tinyllama") {
    return response.content || response.text;
  }
  return "";
}

/**
 * دوال مساعدة (يجب استيرادها من الملفات الموجودة)
 */
async function callGroq(messages: Array<{ role: string; content: string }>): Promise<any> {
  // استدعاء Groq API
  throw new Error("Groq not available");
}

async function callTinyLlama(messages: Array<{ role: string; content: string }>): Promise<any> {
  // استدعاء TinyLlama المحلي
  throw new Error("TinyLlama not available");
}

/**
 * تصدير الدوال
 */
export const openaiIntegration = {
  isOpenAIAvailable,
  callOpenAI,
  extractText,
  calculateCost,
  smartModelSelection,
  robustLLMCall
};
