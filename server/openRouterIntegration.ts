/**
 * OPENROUTER INTEGRATION
 * 
 * تكامل مع OpenRouter API للحصول على LLM مجاني بدون حد استخدام
 */

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      content: string;
      role: string;
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
 * استدعاء OpenRouter API
 */
export async function invokeOpenRouter(
  messages: OpenRouterMessage[],
  model: string = "meta-llama/llama-2-7b-chat"
): Promise<OpenRouterResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://amalsense.manus.space",
        "X-Title": "AmalSense"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data as OpenRouterResponse;
  } catch (error) {
    console.error("OpenRouter API call failed:", error);
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
      ? "أنت مساعد ذكي متخصص في تحليل المشاعر الجماعية. قدم تحليلاً دقيقاً وموجزاً للموضوع المطروح. ركز على المشاعر والاتجاهات الشائعة."
      : "You are an intelligent assistant specialized in collective emotion analysis. Provide an accurate and concise analysis of the topic. Focus on common emotions and trends.";

    const response = await invokeOpenRouter(
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
      "meta-llama/llama-2-7b-chat" // نموذج مجاني
    );

    return response.choices[0].message.content;
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
      ? "بناءً على السؤال والإجابة، اقترح 3 أسئلة متابعة ذكية. أرجع النتيجة كـ JSON array من النصوص."
      : "Based on the question and response, suggest 3 intelligent follow-up questions. Return the result as a JSON array of strings.";

    const response_obj = await invokeOpenRouter(
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
      "meta-llama/llama-2-7b-chat"
    );

    const content = response_obj.choices[0].message.content;
    
    try {
      // محاولة استخراج JSON من الإجابة
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
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
      ? "حلل المشاعر في النص التالي. أرجع نتيجة JSON بصيغة: {emotion: score} حيث score من 0 إلى 100. المشاعر الأساسية: happiness, sadness, anger, fear, surprise, neutral"
      : "Analyze the emotions in the following text. Return a JSON result in the format: {emotion: score} where score is from 0 to 100. Basic emotions: happiness, sadness, anger, fear, surprise, neutral";

    const response = await invokeOpenRouter(
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
      "meta-llama/llama-2-7b-chat"
    );

    const content = response.choices[0].message.content;
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
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
