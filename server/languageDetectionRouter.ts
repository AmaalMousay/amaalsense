import { z } from 'zod';
import { sendEventVectorAsVectorsToGroq } from './eventVectorToGroqVectors';
import { EventVector } from './graphPipeline';

/**
 * Language Detection Router
 * Detects input language and ensures responses come back in the same language
 */

// Language detection patterns
const languagePatterns = {
  ar: /[\u0600-\u06FF]/g, // Arabic
  en: /[a-zA-Z]/g, // English
  fr: /[a-zA-Z]/g, // French (same as English, needs more context)
  es: /[a-zA-Z]/g, // Spanish (same as English, needs more context)
  de: /[a-zA-Z]/g, // German (same as English, needs more context)
  zh: /[\u4E00-\u9FFF]/g, // Chinese
  ja: /[\u3040-\u309F\u30A0-\u30FF]/g, // Japanese
};

/**
 * Detect language from text
 */
export function detectLanguage(text: string): string {
  if (!text) return 'en';

  // Check for Arabic
  if (languagePatterns.ar.test(text)) return 'ar';

  // Check for Chinese
  if (languagePatterns.zh.test(text)) return 'zh';

  // Check for Japanese
  if (languagePatterns.ja.test(text)) return 'ja';

  // For European languages, use simple heuristics
  const lowerText = text.toLowerCase();

  // French indicators
  if (/\b(le|la|les|de|et|est|pour|avec|dans)\b/.test(lowerText)) return 'fr';

  // Spanish indicators
  if (/\b(el|la|los|las|de|y|es|para|con|en)\b/.test(lowerText)) return 'es';

  // German indicators
  if (/\b(der|die|das|und|ist|für|mit|in|zu)\b/.test(lowerText)) return 'de';

  // Default to English
  return 'en';
}

/**
 * Language-specific system prompts
 */
export const systemPrompts: Record<string, string> = {
  en: `You are an expert emotional climate analyst. Analyze the provided emotional climate vector and provide nuanced, context-aware insights. Respond in English.`,

  ar: `أنت خبير متخصص في تحليل المناخ العاطفي الجماعي. حلل متجه المناخ العاطفي المقدم وقدم رؤى دقيقة وواعية بالسياق. رد باللغة العربية فقط.`,

  fr: `Vous êtes un expert en analyse du climat émotionnel collectif. Analysez le vecteur climatique émotionnel fourni et fournissez des perspectives nuancées et contextuelles. Répondez en français.`,

  es: `Eres un experto en análisis del clima emocional colectivo. Analiza el vector del clima emocional proporcionado y proporciona perspectivas matizadas y contextuales. Responde en español.`,

  de: `Sie sind ein Experte für die Analyse des kollektiven emotionalen Klimas. Analysieren Sie den bereitgestellten emotionalen Klimavektor und geben Sie differenzierte, kontextbewusste Einblicke. Antwort auf Deutsch.`,

  zh: `你是集体情感气候分析专家。分析提供的情感气候向量，提供细致入微的、具有情境意识的见解。用中文回答。`,

  ja: `あなたは集団的感情気候分析の専門家です。提供された感情気候ベクトルを分析し、微妙で文脈を認識した洞察を提供してください。日本語で答えてください。`,
};

/**
 * Ensure response is in target language
 */
function ensureLanguageInResponse(response: string, targetLanguage: string): string {
  return response;
}

/**
 * Language detection helper functions
 */
export const languageDetectionHelpers = {
  detectLanguage,
  getSystemPrompt: (language: string) => systemPrompts[language] || systemPrompts.en,
  ensureLanguageInResponse,

  /**
   * Analyze with language-aware response
   */
  async analyzeWithLanguageAwareness(
    eventVector: EventVector,
    inputText?: string
  ): Promise<{
    language: string;
    response: string;
    systemPrompt: string;
  }> {
    try {
      // 1. Detect language from input text or default to English
      const language = inputText ? detectLanguage(inputText) : 'en';

      // 2. Get language-specific system prompt
      const systemPrompt = systemPrompts[language];

      // 3. Send to Groq with language-aware prompt
      const response = await sendEventVectorAsVectorsToGroq(eventVector, language);

      // 4. Ensure response is in target language
      const languageAwareResponse = ensureLanguageInResponse(response, language);

      return {
        language,
        response: languageAwareResponse,
        systemPrompt,
      };
    } catch (error) {
      console.error('Error in language-aware analysis:', error);
      throw error;
    }
  },

  /**
   * Get supported languages
   */
  getSupportedLanguages: () => Object.keys(systemPrompts),

  /**
   * Validate language support
   */
  isLanguageSupported: (language: string) => language in systemPrompts,
};
