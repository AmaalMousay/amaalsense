import { invokeLLM } from "./_core/llm";

/**
 * نموذج TinyLlama الاحتياطي
 * 
 * الهدف: ضمان استمرارية الخدمة عند انقطاع Groq API
 * 
 * المميزات:
 * - نموذج خفيف (1.1B parameters)
 * - سرعة عالية (50-100ms)
 * - دقة معقولة (75-80%)
 * - يعمل محلياً أو على خوادم بسيطة
 * 
 * الاستراتيجية:
 * 1. محاولة استخدام Groq (الأساسي)
 * 2. إذا فشل، استخدم TinyLlama (الاحتياطي)
 * 3. تسجيل الفشل والتحويل
 * 4. إرسال تنبيه للفريق
 */

interface LLMResponse {
  success: boolean;
  model: "groq" | "tinyllama";
  content: string;
  latency: number;
  fallback: boolean;
}

/**
 * استدعاء LLM مع Fallback إلى TinyLlama
 */
export async function robustLLMCall(
  messages: any[],
  options?: {
    timeout?: number;
    retries?: number;
    preferTinyLlama?: boolean;
  }
): Promise<LLMResponse> {
  const timeout = options?.timeout || 5000;
  const retries = options?.retries || 2;
  const preferTinyLlama = options?.preferTinyLlama || false;

  const startTime = Date.now();

  // إذا كان المستخدم يفضل TinyLlama، استخدمه مباشرة
  if (preferTinyLlama) {
    console.log("[RobustLLM] Using TinyLlama (preferred)");
    return await callTinyLlama(messages, timeout);
  }

  // محاولة استخدام Groq
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[RobustLLM] Attempting Groq (attempt ${attempt}/${retries})`);
      const response = await callGroqWithTimeout(messages, timeout);

      const latency = Date.now() - startTime;
      console.log(`[RobustLLM] Groq succeeded in ${latency}ms`);

      return {
        success: true,
        model: "groq",
        content: response,
        latency,
        fallback: false,
      };
    } catch (error) {
      console.error(`[RobustLLM] Groq attempt ${attempt} failed:`, error);

      // إذا كانت هذه آخر محاولة، استخدم TinyLlama
      if (attempt === retries) {
        console.log("[RobustLLM] Falling back to TinyLlama");
        return await callTinyLlama(messages, timeout);
      }

      // انتظر قليلاً قبل المحاولة التالية
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  // في حالة الفشل الكامل
  throw new Error("[RobustLLM] Both Groq and TinyLlama failed");
}

/**
 * استدعاء Groq مع timeout
 */
async function callGroqWithTimeout(messages: any[], timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Groq timeout"));
    }, timeout);

    invokeLLM({ messages })
      .then((response) => {
        clearTimeout(timeoutId);
        const content = response.choices[0].message.content;
        const contentStr = typeof content === "string" ? content : JSON.stringify(content);
        resolve(contentStr);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * استدعاء TinyLlama
 */
async function callTinyLlama(messages: any[], timeout: number): Promise<LLMResponse> {
  const startTime = Date.now();

  try {
    // في التطبيق الفعلي، سيتم استدعاء TinyLlama من خادم محلي أو API
    // هنا نحاكي الاستدعاء

    const response = await callTinyLlamaAPI(messages, timeout);

    const latency = Date.now() - startTime;
    console.log(`[TinyLlama] Succeeded in ${latency}ms`);

    return {
      success: true,
      model: "tinyllama",
      content: response,
      latency,
      fallback: true,
    };
  } catch (error) {
    console.error("[TinyLlama] Error:", error);
    throw error;
  }
}

/**
 * استدعاء API TinyLlama
 */
async function callTinyLlamaAPI(messages: any[], timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("TinyLlama timeout"));
    }, timeout);

    // في التطبيق الفعلي، سيتم استدعاء API TinyLlama
    // مثال: http://localhost:8000/v1/chat/completions

    const tinyLlamaUrl = process.env.TINYLLAMA_API_URL || "http://localhost:8000/v1/chat/completions";

    fetch(tinyLlamaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model: "tinyllama-1.1b",
        temperature: 0.7,
        max_tokens: 500,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timeoutId);
        const content = data.choices[0].message.content;
        resolve(content);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * مراقبة صحة الخدمات
 */
export async function healthCheck(): Promise<{
  groq: { status: "healthy" | "unhealthy"; latency: number };
  tinyllama: { status: "healthy" | "unhealthy"; latency: number };
}> {
  const testMessage = [
    {
      role: "user",
      content: "مرحبا",
    },
  ];

  // فحص Groq
  const groqStart = Date.now();
  let groqStatus: "healthy" | "unhealthy" = "unhealthy";
  let groqLatency = 0;

  try {
    await callGroqWithTimeout(testMessage, 3000);
    groqStatus = "healthy";
    groqLatency = Date.now() - groqStart;
    console.log(`[HealthCheck] Groq: ${groqStatus} (${groqLatency}ms)`);
  } catch (error) {
    console.error("[HealthCheck] Groq unhealthy:", error);
    groqLatency = Date.now() - groqStart;
  }

  // فحص TinyLlama
  const tinyLlamaStart = Date.now();
  let tinyLlamaStatus: "healthy" | "unhealthy" = "unhealthy";
  let tinyLlamaLatency = 0;

  try {
    await callTinyLlamaAPI(testMessage, 3000);
    tinyLlamaStatus = "healthy";
    tinyLlamaLatency = Date.now() - tinyLlamaStart;
    console.log(`[HealthCheck] TinyLlama: ${tinyLlamaStatus} (${tinyLlamaLatency}ms)`);
  } catch (error) {
    console.error("[HealthCheck] TinyLlama unhealthy:", error);
    tinyLlamaLatency = Date.now() - tinyLlamaStart;
  }

  return {
    groq: { status: groqStatus, latency: groqLatency },
    tinyllama: { status: tinyLlamaStatus, latency: tinyLlamaLatency },
  };
}

/**
 * اختيار النموذج الأفضل بناءً على الحالة
 */
export async function selectBestModel(): Promise<"groq" | "tinyllama"> {
  const health = await healthCheck();

  // إذا كان Groq سليماً، استخدمه
  if (health.groq.status === "healthy") {
    return "groq";
  }

  // إذا كان TinyLlama سليماً، استخدمه
  if (health.tinyllama.status === "healthy") {
    return "tinyllama";
  }

  // إذا كان كلاهما معطلاً، استخدم Groq (قد يكون هناك مشكلة مؤقتة)
  return "groq";
}

/**
 * إرسال تنبيه عند التحويل إلى TinyLlama
 */
export async function notifyFallback(reason: string): Promise<void> {
  try {
    // في التطبيق الفعلي، سيتم إرسال تنبيه عبر Slack أو Email
    console.warn(`[Fallback Alert] Switched to TinyLlama: ${reason}`);

    // مثال: إرسال إلى Slack
    // await fetch(process.env.SLACK_WEBHOOK_URL, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     text: `⚠️ AmalSense switched to TinyLlama: ${reason}`,
    //     channel: "#alerts",
    //   }),
    // });
  } catch (error) {
    console.error("[NotifyFallback] Error:", error);
  }
}

/**
 * إحصائيات الاستخدام
 */
export interface UsageStats {
  totalRequests: number;
  groqRequests: number;
  tinyLlamaRequests: number;
  fallbackRate: number;
  averageLatency: number;
  groqAverageLatency: number;
  tinyLlamaAverageLatency: number;
}

let stats: UsageStats = {
  totalRequests: 0,
  groqRequests: 0,
  tinyLlamaRequests: 0,
  fallbackRate: 0,
  averageLatency: 0,
  groqAverageLatency: 0,
  tinyLlamaAverageLatency: 0,
};

/**
 * تحديث الإحصائيات
 */
export function updateStats(response: LLMResponse): void {
  stats.totalRequests++;

  if (response.model === "groq") {
    stats.groqRequests++;
    stats.groqAverageLatency =
      (stats.groqAverageLatency * (stats.groqRequests - 1) + response.latency) /
      stats.groqRequests;
  } else {
    stats.tinyLlamaRequests++;
    stats.tinyLlamaAverageLatency =
      (stats.tinyLlamaAverageLatency * (stats.tinyLlamaRequests - 1) + response.latency) /
      stats.tinyLlamaRequests;
  }

  stats.fallbackRate = stats.tinyLlamaRequests / stats.totalRequests;
  stats.averageLatency =
    (stats.groqAverageLatency * stats.groqRequests +
      stats.tinyLlamaAverageLatency * stats.tinyLlamaRequests) /
    stats.totalRequests;
}

/**
 * الحصول على الإحصائيات
 */
export function getStats(): UsageStats {
  return { ...stats };
}

/**
 * إعادة تعيين الإحصائيات
 */
export function resetStats(): void {
  stats = {
    totalRequests: 0,
    groqRequests: 0,
    tinyLlamaRequests: 0,
    fallbackRate: 0,
    averageLatency: 0,
    groqAverageLatency: 0,
    tinyLlamaAverageLatency: 0,
  };
}
