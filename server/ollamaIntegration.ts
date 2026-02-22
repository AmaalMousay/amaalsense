/**
 * OLLAMA INTEGRATION
 * 
 * تكامل مع Ollama LLM المجاني بدون حد استخدام
 */

export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "phi";

/**
 * استدعاء Ollama API
 */
export async function invokeOllama(
  messages: OllamaMessage[],
  model: string = OLLAMA_MODEL
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json() as OllamaResponse;
    return data.message.content;
  } catch (error) {
    console.error("Ollama API call failed:", error);
    throw error;
  }
}

/**
 * توليد إجابة ديناميكية للسؤال
 */
export async function generateDynamicResponse(
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

    const response = await invokeOllama(
      [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: question
        }
      ],
      OLLAMA_MODEL
    );

    return response;
  } catch (error) {
    console.error("Dynamic response generation failed:", error);
    throw error;
  }
}

/**
 * توليد اقتراحات متابعة ذكية
 */
export async function generateFollowUpSuggestions(
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

    const response_obj = await invokeOllama(
      [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `السؤال: ${question}\n\nالإجابة: ${response}`
        }
      ],
      OLLAMA_MODEL
    );

    try {
      // محاولة استخراج JSON من الإجابة
      const jsonMatch = response_obj.match(/\[[\s\S]*\]/);
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
    console.error("Follow-up suggestions generation failed:", error);
    return [];
  }
}

/**
 * تحليل المشاعر من النص
 */
export async function analyzeEmotions(
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

    const response = await invokeOllama(
      [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: text
        }
      ],
      OLLAMA_MODEL
    );

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
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
    console.error("Emotion analysis failed:", error);
    return {};
  }
}

/**
 * اختبار الاتصال بـ Ollama
 */
export async function testOllamaConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
    return response.ok;
  } catch (error) {
    console.error("Ollama connection test failed:", error);
    return false;
  }
}
