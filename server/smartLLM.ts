/**
 * AMALSENSE SOVEREIGN LLM PROVIDER (Autonomous Edition)
 * المحرك المستقل: يعتمد على الذكاء المحلي والمصادر المفتوحة مجاناً وبالكامل.
 * تم تعديله لإصلاح أخطاء توافق النصوص (String Assignment).
 */

import { InvokeParams, InvokeResult } from './_core/llm';

// تعريف أنواع المهام المتوافقة مع كافة أجزاء النظام
export type TaskType =
  | 'question_understanding'
  | 'response_generation'
  | 'translation'
  | 'suggestions'
  | 'emotion_analysis'
  | 'greeting_response'
  | 'general';

/**
 * دالة الاستدعاء الذكي: المحرك الرئيسي لإدارة الحوار
 */
export async function smartInvokeLLM(
  params: InvokeParams,
  taskType: TaskType = 'general'
): Promise<InvokeResult> {

  // --- إصلاح خطأ السطر 83: ضمان أن المحتوى نصي (String) دائماً ---
  const unifiedMessages = params.messages.map(m => {
    let finalContent: string = '';

    if (typeof m.content === 'string') {
      finalContent = m.content;
    } else if (Array.isArray(m.content)) {
      // معالجة المصفوفات المعقدة وتحويلها لنص مدمج
      finalContent = m.content.map((item: any) => {
        if (item.type === 'text') return item.text;
        return JSON.stringify(item);
      }).join('\n');
    } else {
      finalContent = String(m.content);
    }

    return {
      role: m.role as string,
      content: finalContent
    };
  });
  // ------------------------------------------------------------

  const prompt = unifiedMessages.map(m => `${m.role}: ${m.content}`).join('\n');

  // المحاولة 1: Ollama (الذكاء المحلي المستقل - مجاني للأبد)
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
    console.log("[SmartLLM] Local engine (Ollama) not found. Trying Open Web Provider...");
  }

  // المحاولة 2: المحرك المفتوح (Pollinations AI) - مجاني وبدون قيود
  try {
    const response = await fetch(`https://text.pollinations.ai/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: unifiedMessages,
        model: 'openai',
        seed: 42
      })
    });
    const text = await response.text();
    return formatToInvokeResult(text, 'web-sovereign-ai');
  } catch (error) {
    console.error("[SmartLLM] All free engines failed.");
    throw new Error("No available LLM engine.");
  }
}

/**
 * تنسيق المخرجات لتتوافق مع نظام AmalSense الداخلي
 */
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

/**
 * دالة استرجاع النص المباشر (تستخدم في معظم أجزاء المشروع)
 */
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

/**
 * دالة التعامل مع الـ JSON للردود المنظمة
 */
export async function smartJsonChat(system: string, user: string, task: TaskType = 'general'): Promise<any> {
  const res = await smartChat(system + " Respond in valid JSON only.", user, task);
  try {
    return JSON.parse(res);
  } catch {
    return { result: res };
  }
}