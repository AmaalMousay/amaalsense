/**
 * AMALSENSE SOVEREIGN LLM PROVIDER (Autonomous Edition)
 * المحرك المستقل: يعتمد على الذكاء المحلي والمصادر المفتوحة مجاناً وبالكامل.
 */

import { InvokeParams, InvokeResult } from '../_core/llm';

export type TaskType =
  | 'question_understanding'
  | 'response_generation'
  | 'translation'
  | 'suggestions'
  | 'emotion_analysis'
  | 'greeting_response'
  | 'general';

/**
 * دالة الاستدعاء الذكي: المحرك الرئيسي لإدارة الحوار مع منطق التراجع (Fallback)
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

  // --- الاستراتيجية 1: Pollinations AI (مجاني، بدون مفتاح، بدون حدود) ---
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 
    
    const response = await fetch(`https://text.pollinations.ai/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: unifiedMessages,
        model: 'openai', // يستخدم نموذج قوي متاح مجاناً
        seed: 42
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const text = await response.text();
      return formatToInvokeResult(text, 'free-sovereign-ai');
    }
  } catch (error) {
    console.log("[SmartLLM] Free Web AI failed. Trying Local Ollama...");
  }

  // --- الاستراتيجية 2: Ollama (محلي، مجاني للأبد، لا يحتاج إنترنت) ---
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        stream: false
      })
    });
    if (response.ok) {
      const data = await response.json();
      return formatToInvokeResult(data.response, 'ollama-local');
    }
  } catch (e) {
    console.log("[SmartLLM] Local Ollama not found.");
  }

  // --- الاستراتيجية 3: DuckDuckGo AI (واجهة مجانية بديلة) ---
  try {
     // يمكن إضافة دعم DuckDuckGo هنا كخيار ثالث مجاني
  } catch (e) {}

  // --- الملاذ الأخير: المحرك الأساسي (فقط إذا فشل كل ما سبق) ---
  try {
    const { invokeLLM } = await import('../_core/llm');
    return await invokeLLM(params);
  } catch (error) {
    console.error("[SmartLLM] All engines failed.");
    return formatToInvokeResult("عذراً، المحرك حالياً في حالة صيانة عاطفية. يرجى المحاولة لاحقاً.", 'error-fallback');
  }
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
