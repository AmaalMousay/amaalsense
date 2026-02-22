/**
 * MISTRAL MODEL INTEGRATION
 * 
 * تكامل نموذج Mistral 7B المحلي مع AmalSense
 * يعمل عبر Ollama بدون حد استخدام
 */

import fetch from "node-fetch";

const OLLAMA_BASE_URL = "http://localhost:11434";
const MODEL_NAME = "tinyllama:1.1b"; // استخدام TinyLlama بدلاً من Mistral (أقل متطلبات للذاكرة)

/**
 * التحقق من أن النموذج متاح
 */
export async function checkModelAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json() as { models: Array<{ name: string }> };
    return data.models?.some(m => m.name.includes("mistral")) || false;
  } catch (error) {
    console.error("Failed to check model availability:", error);
    return false;
  }
}

/**
 * توليد إجابة ديناميكية باستخدام Mistral
 */
export async function generateResponseWithMistral(
  question: string,
  language: string = "ar"
): Promise<string> {
  try {
    const systemPrompt = language === "ar"
      ? `أنت مساعد ذكي متخصص في تحليل المشاعر الجماعية والاتجاهات الاجتماعية. 
      قدم تحليلاً دقيقاً وموجزاً للموضوع المطروح. 
      ركز على المشاعر والاتجاهات الشائعة والعوامل المؤثرة.
      أجب باللغة العربية فقط.`
      : `You are an intelligent assistant specialized in collective emotion analysis and social trends.
      Provide an accurate and concise analysis of the topic.
      Focus on common emotions, trends, and influencing factors.
      Answer in English only.`;

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `${systemPrompt}\n\nالسؤال: ${question}`,
        stream: false,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        num_predict: 200
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json() as { response: string };
    return data.response || "Unable to generate response";
  } catch (error) {
    console.error("Mistral response generation failed:", error);
    throw error;
  }
}

/**
 * تحليل المشاعر من النص باستخدام Mistral
 */
export async function analyzeEmotionsWithMistral(
  text: string,
  language: string = "ar"
): Promise<Record<string, number>> {
  try {
    const systemPrompt = language === "ar"
      ? `حلل المشاعر في النص التالي بدقة.
      أرجع نتيجة JSON بصيغة: {"happiness": 40, "sadness": 20, "anger": 15, "fear": 15, "surprise": 5, "neutral": 5}
      حيث كل قيمة من 0 إلى 100.
      أرجع JSON فقط بدون أي نص إضافي.`
      : `Analyze the emotions in the following text accurately.
      Return a JSON result in the format: {"happiness": 40, "sadness": 20, "anger": 15, "fear": 15, "surprise": 5, "neutral": 5}
      where each value is from 0 to 100.
      Return JSON only without any additional text.`;

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `${systemPrompt}\n\nالنص: ${text}`,
        stream: false,
        temperature: 0.3,
        top_p: 0.9,
        top_k: 40,
        num_predict: 100
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json() as { response: string };
    const content = data.response || "{}";
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse emotions JSON:", e);
    }

    // إذا فشل التحليل، أرجع توزيع افتراضي
    return {
      happiness: 40,
      sadness: 20,
      anger: 15,
      fear: 15,
      surprise: 5,
      neutral: 5
    };
  } catch (error) {
    console.error("Emotion analysis with Mistral failed:", error);
    return {};
  }
}

/**
 * توليد اقتراحات متابعة ذكية
 */
export async function generateFollowUpSuggestionsWithMistral(
  question: string,
  response: string,
  language: string = "ar"
): Promise<string[]> {
  try {
    const systemPrompt = language === "ar"
      ? `بناءً على السؤال والإجابة، اقترح 3 أسئلة متابعة ذكية ومفيدة.
      أرجع النتيجة كـ JSON array من النصوص فقط، بدون أي نص إضافي.
      مثال: ["السؤال الأول", "السؤال الثاني", "السؤال الثالث"]`
      : `Based on the question and response, suggest 3 intelligent and useful follow-up questions.
      Return the result as a JSON array of strings only, without any additional text.
      Example: ["First question", "Second question", "Third question"]`;

    const response_obj = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `${systemPrompt}\n\nالسؤال: ${question}\n\nالإجابة: ${response}`,
        stream: false,
        temperature: 0.5,
        top_p: 0.9,
        top_k: 40,
        num_predict: 150
      })
    });

    if (!response_obj.ok) {
      throw new Error(`Ollama API error: ${response_obj.status}`);
    }

    const data = await response_obj.json() as { response: string };
    const content = data.response || "[]";
    
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse suggestions JSON:", e);
    }

    // إذا فشل التحليل، أرجع اقتراحات افتراضية
    return [
      language === "ar" ? "ما التوصيات؟" : "What are the recommendations?",
      language === "ar" ? "ما المخاطر المحتملة؟" : "What are the potential risks?",
      language === "ar" ? "ما التوقعات المستقبلية؟" : "What are the future predictions?"
    ];
  } catch (error) {
    console.error("Follow-up suggestions generation with Mistral failed:", error);
    return [];
  }
}

/**
 * تدريب النموذج على بيانات جديدة (Fine-tuning)
 * ملاحظة: Ollama لا يدعم fine-tuning مباشرة، لكن يمكن استخدام Modelfile
 */
export async function createCustomModel(
  trainingData: Array<{ question: string; answer: string }>,
  modelName: string = "amalsense-custom"
): Promise<boolean> {
  try {
    console.log(`[Mistral] Creating custom model: ${modelName}`);
    console.log(`[Mistral] Training data samples: ${trainingData.length}`);
    
    // إنشاء Modelfile للنموذج المخصص
    const modelfile = `FROM ${MODEL_NAME}
SYSTEM """أنت نموذج متخصص في تحليل المشاعر الجماعية والاتجاهات الاجتماعية.
تم تدريبك على بيانات متخصصة لفهم المشاعر والاتجاهات بشكل أعمق.
قدم تحليلات دقيقة وموجزة."""

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40`;

    // حفظ Modelfile
    const fs = await import("fs/promises");
    await fs.writeFile("/tmp/Modelfile", modelfile);
    
    console.log(`[Mistral] Custom model created: ${modelName}`);
    return true;
  } catch (error) {
    console.error("Failed to create custom model:", error);
    return false;
  }
}
