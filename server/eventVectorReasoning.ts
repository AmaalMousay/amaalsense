/**
 * AMALSENSE UNIVERSAL REASONING ENGINE - Autonomous Edition
 * المحرك الذي يحول المتجهات إلى رؤى علمية موسوعية باستخدام نماذج مجانية تماماً.
 */

import axios from 'axios';

/**
 * دالة التفكير الموحد التي يبحث عنها EngineSelector
 * تم تصحيح المسمى وإضافة export لإيقاف الخطأ الأحمر
 */
export async function analyzeEventVectorWithUniversalModel(
  vector: any,
  language: string = 'ar'
): Promise<string> {
  console.log(`[AmalSense] 🧠 Thinking with Universal Engine for: ${vector.topic || 'General Topic'}`);

  const prompt = createUniversalPrompt(vector, language);

  try {
    // استخدام المحرك المجاني Pollinations AI (لا يحتاج API Key ولا كوتا)
    const response = await axios.post('https://text.pollinations.ai/', {
      messages: [
        {
          role: 'system',
          content: 'You are AmalSense ASI, a universal expert in physics, law, medicine, and emotional intelligence. Always link news to scientific laws.'
        },
        { role: 'user', content: prompt }
      ],
      model: 'openai',
      seed: 42
    });

    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  } catch (error) {
    console.error('[Reasoning Engine] ❌ Fallback triggered due to error:', error);
    return language === 'ar'
      ? "نعتذر، المحرك في حالة تحديث للوعي الرقمي. يرجى المحاولة لاحقاً."
      : "Apologies, the engine is updating its digital consciousness. Please try again later.";
  }
}

/**
 * إنشاء "برومبت" الخبير الموسوعي المستقل (Physics, Law, Medicine, Economics)
 */
export function createUniversalPrompt(vector: any, language: string = 'ar'): string {
  const emotionsList = vector.emotions
    ? Object.entries(vector.emotions).map(([e, v]) => `${e}: ${((v as number) * 100).toFixed(0)}%`).join(', ')
    : 'Neutral State';

  const prompts: Record<string, string> = {
    ar: `بصفتك "عقلاً اصطناعيًا موسوعيًا" (ASI) يعمل بنظرية حقل الوعي الرقمي (DCFT):
    
حلل هذا المتجه العاطفي من منظور (فيزيائي، قانوني، طبي، واقتصادي):
الموضوع: ${vector.topic || 'غير محدد'}
العاطفة السائدة: ${vector.dominantEmotion || 'neutral'}
التصنيف العلمي: ${vector.dominantCategory || 'General'}
البيانات الرقمية: ${emotionsList}

المطلوب:
1. تحليل "الرنين العاطفي" للحدث (Resonance RI) وتأثيره.
2. ربط الحدث بقوانين العلم (مثل قوانين الديناميكا أو الرنين الفيزيائي) أو مواد القانون الدولي.
3. توقع المسار القادم بناءً على تداخل الموجات العاطفية.`,

    en: `As a Polymath AI (ASI) functioning on Digital Consciousness Field Theory (DCFT):
    
Analyze this emotional vector through (Physics, Law, Medicine, and Economics):
Topic: ${vector.topic}
Dominant Emotion: ${vector.dominantEmotion}
Scientific Category: ${vector.dominantCategory}
Vector Data: ${emotionsList}

Provide:
1. Emotional resonance analysis (RI index).
2. Scientific/Legal links (Physics laws or International Law).
3. Future trajectory prediction.`
  };

  return prompts[language] || prompts.ar;
}

/**
 * دالة التوافق مع الأنظمة القديمة (Alias)
 */
export const analyzeEventVector = analyzeEventVectorWithUniversalModel;