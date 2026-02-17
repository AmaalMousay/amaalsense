/**
 * Language Enforcement Layer (Layer 15)
 * 
 * تطبيق اللغة على الإجابات
 * يضمن أن الإجابة بنفس لغة السؤال حتى في نفس الدردشة
 */

import { invokeGroqLLM } from './groqIntegration';

export type SupportedLanguage = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja';

export interface LanguageEnforcementResult {
  originalLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  originalResponse: string;
  enforcedResponse: string;
  translationNeeded: boolean;
  confidence: number;
  processingTimeMs: number;
}

/**
 * كشف لغة النص بسرعة
 */
export function quickDetectLanguage(text: string): SupportedLanguage {
  // تحليل الأحرف العربية
  const arabicRegex = /[\u0600-\u06FF]/g;
  const arabicCount = (text.match(arabicRegex) || []).length;
  const arabicRatio = arabicCount / text.length;

  if (arabicRatio > 0.3) {
    return 'ar';
  }

  // الافتراضي: إنجليزي
  return 'en';
}

/**
 * ترجمة الإجابة إلى لغة محددة
 */
export async function translateResponse(
  response: string,
  targetLanguage: SupportedLanguage
): Promise<string> {
  try {
    const languageNames: Record<SupportedLanguage, string> = {
      ar: 'Arabic',
      en: 'English',
      fr: 'French',
      es: 'Spanish',
      de: 'German',
      zh: 'Chinese',
      ja: 'Japanese',
    };

    const translationResponse = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${languageNames[targetLanguage]}. 
          Maintain the exact meaning and tone. Respond with ONLY the translated text.`,
        },
        {
          role: 'user',
          content: response,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      maxTokens: 2048,
    });

    const translatedText = (translationResponse.content || translationResponse.text || '').trim();
    return translatedText || response;
  } catch (error) {
    console.error('[LanguageEnforcement] Translation error:', error);
    return response;
  }
}

/**
 * فرض اللغة على الإجابة
 */
export async function enforceLanguage(
  question: string,
  response: string
): Promise<LanguageEnforcementResult> {
  const startTime = Date.now();

  try {
    // كشف لغة السؤال
    const questionLanguage = quickDetectLanguage(question);
    console.log('[LanguageEnforcement] Question language:', questionLanguage);

    // كشف لغة الإجابة الحالية
    const responseLanguage = quickDetectLanguage(response);
    console.log('[LanguageEnforcement] Response language:', responseLanguage);

    // إذا كانت اللغات مختلفة، ترجم الإجابة
    let enforcedResponse = response;
    let translationNeeded = false;

    if (questionLanguage !== responseLanguage) {
      console.log('[LanguageEnforcement] Translation needed:', {
        from: responseLanguage,
        to: questionLanguage,
      });

      translationNeeded = true;
      enforcedResponse = await translateResponse(response, questionLanguage);
    }

    const processingTime = Date.now() - startTime;

    return {
      originalLanguage: responseLanguage,
      targetLanguage: questionLanguage,
      originalResponse: response,
      enforcedResponse,
      translationNeeded,
      confidence: 95,
      processingTimeMs: processingTime,
    };
  } catch (error) {
    console.error('[LanguageEnforcement] Error enforcing language:', error);

    return {
      originalLanguage: 'en',
      targetLanguage: 'ar',
      originalResponse: response,
      enforcedResponse: response,
      translationNeeded: false,
      confidence: 0,
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * معالج شامل للإجابات
 */
export async function processResponseWithLanguageEnforcement(
  question: string,
  response: string,
  debugMode: boolean = false
): Promise<{
  finalResponse: string;
  language: SupportedLanguage;
  wasTranslated: boolean;
}> {
  const result = await enforceLanguage(question, response);

  if (debugMode) {
    console.log('[LanguageEnforcement] Result:', {
      questionLanguage: result.targetLanguage,
      responseLanguage: result.originalLanguage,
      wasTranslated: result.translationNeeded,
      processingTime: result.processingTimeMs,
    });
  }

  return {
    finalResponse: result.enforcedResponse,
    language: result.targetLanguage,
    wasTranslated: result.translationNeeded,
  };
}
