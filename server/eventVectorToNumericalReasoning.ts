/**
 * AMALSENSE VECTOR REASONING ENGINE (Free & Universal)
 * يحول المتجهات الرقمية (30 بُعداً) إلى تحليلات موسوعية مجانية.
 * يربط بين الأرقام وبين قوانين العلم والتشريع.
 */

import { EventVector } from './graphPipeline';
import axios from 'axios'; // لاستدعاء المحرك المجاني
import {
  eventVectorToNumericalVector,
  createVectorPromptInLanguage,
  verifyVectorIntegrity,
} from './dataToVectorConverter';

/**
 * دالة التحليل الرئيسية باستخدام المحرك المجاني
 */
export async function analyzeEventVectorWithUniversalModel(
  vector: EventVector,
  language: string = 'ar'
): Promise<string> {
  try {
    // 1. تحويل البيانات إلى المتجه الرقمي (30 بُعداً)
    const numericalVector = eventVectorToNumericalVector(vector);

    // 2. التحقق من سلامة البيانات
    const verification = verifyVectorIntegrity(numericalVector);
    if (!verification.valid) {
      console.warn('Vector verification warnings:', verification.errors);
    }

    // 3. صياغة "برومبت" الخبير الكوني بناءً على المتجه
    const vectorString = numericalVector.map(v => v.toFixed(3)).join(', ');

    const instructions = language === 'ar'
      ? `أنت AmalSense ASI. أمامك متجه رقمي (30 بُعداً) يمثل حالة "حقل الوعي الرقمي":
         المتجه: [${vectorString}]
         
         المطلوب منك كخبير في الفيزياء والقانون والطب:
         1. فك شفرة الأبعاد (0-11) عاطفياً.
         2. ربط النتائج بظواهر علمية (مثل التداخل الموجي في الفيزياء) أو ثغرات قانونية.
         3. تقديم نصيحة استراتيجية بناءً على هذا التشابك.`
      : `You are AmalSense ASI. Analyze this 30-dimensional vector: [${vectorString}]
         Interpret dimensions (0-11) emotionally and link them to Physics, Law, and Medicine.`;

    // 4. استدعاء المحرك المجاني (Pollinations AI) بدلاً من Groq
    const response = await axios.post('https://text.pollinations.ai/', {
      messages: [
        { role: 'system', content: 'You are an expert polymath analyst for AmalSense.' },
        { role: 'user', content: instructions }
      ],
      model: 'openai'
    });

    return response.data;

  } catch (error) {
    console.error('Error in Universal Vector Reasoning:', error);
    return "فشل المحرك في تحليل المتجه رقمياً.";
  }
}

/**
 * بايبلاين التحليل الكامل (Vector → Universal AI → Insight)
 */
export async function completeVectorAnalysis(
  vector: EventVector,
  language: string = 'ar'
): Promise<{
  originalData: EventVector;
  vector: number[];
  reasoning: string;
}> {
  const reasoning = await analyzeEventVectorWithUniversalModel(vector, language);
  const numericalVector = eventVectorToNumericalVector(vector);

  return {
    originalData: vector,
    vector: numericalVector,
    reasoning
  };
}

/**
 * تنسيق النتيجة النهائية للعرض
 */
export function formatQuantumResult(result: any): string {
  return `
## 🌌 تحليل حقل الوعي (Vector Analysis)

**البيانات الأصلية:** - الموضوع: ${result.originalData.topic}
- العاطفة السائدة: ${result.originalData.dominantEmotion}

**البصمة الرقمية (30 بُعداً):**
\`[${result.vector.slice(0, 10).map((v: any) => v.toFixed(2)).join(', ')} ...]\`

**🧠 الرؤية الموسوعية (التحليل المستقل):**
${result.reasoning}

---
*تمت المعالجة عبر المحرك المجاني بنجاح*
  `.trim();
}