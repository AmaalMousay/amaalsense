import { z } from 'zod';

/**
 * Language Detection and Response Handler
 * Ensures responses are in the same language as the input
 */

export const detectLanguage = (text: string): string => {
  // Arabic detection
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  
  // French detection (common French words and accents)
  if (/\b(le|la|les|de|du|et|est|que|pour|avec|par)\b/i.test(text) ||
      /[àâäéèêëïîôöùûüœæç]/i.test(text)) return 'fr';
  
  // Spanish detection
  if (/\b(el|la|los|las|de|y|es|que|para|con|por)\b/i.test(text) ||
      /[áéíóúñüü¿¡]/i.test(text)) return 'es';
  
  // German detection
  if (/\b(der|die|das|und|ist|ein|eine|zu|von|mit)\b/i.test(text) ||
      /[äöüß]/i.test(text)) return 'de';
  
  // Chinese detection
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  
  // Japanese detection
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  
  // Default to English
  return 'en';
};

export const getLanguageSystemPrompt = (language: string): string => {
  const prompts: Record<string, string> = {
    ar: `أنت محلل عاطفي متخصص. تحليلك يجب أن يكون باللغة العربية فقط. 
    أرجع النتيجة بصيغة JSON. تأكد أن جميع الحقول والشروحات بالعربية.`,
    
    fr: `Vous êtes un analyste émotionnel spécialisé. Votre analyse doit être entièrement en français.
    Répondez en format JSON. Assurez-vous que tous les champs et explications sont en français.`,
    
    es: `Eres un analista emocional especializado. Tu análisis debe ser completamente en español.
    Responde en formato JSON. Asegúrate de que todos los campos y explicaciones estén en español.`,
    
    de: `Du bist ein spezialisierter Emotionsanalyst. Deine Analyse muss vollständig auf Deutsch sein.
    Antworte im JSON-Format. Stelle sicher, dass alle Felder und Erklärungen auf Deutsch sind.`,
    
    zh: `你是一位专业的情感分析师。你的分析必须完全用中文进行。
    以JSON格式回复。确保所有字段和解释都是中文。`,
    
    ja: `あなたは専門的な感情分析者です。あなたの分析は完全に日本語である必要があります。
    JSON形式で応答してください。すべてのフィールドと説明が日本語であることを確認してください。`,
    
    en: `You are a specialized emotional analyst. Your analysis must be entirely in English.
    Respond in JSON format. Ensure all fields and explanations are in English.`,
  };
  
  return prompts[language] || prompts['en'];
};

export const getLanguageSpecificPrompt = (language: string, basePrompt: string): string => {
  const languageInstructions: Record<string, string> = {
    ar: `\n\nملاحظة مهمة: أجب باللغة العربية فقط. جميع الشروحات والتحليلات يجب أن تكون بالعربية.`,
    fr: `\n\nRemarque importante: Répondez uniquement en français. Toutes les explications et analyses doivent être en français.`,
    es: `\n\nNota importante: Responde solo en español. Todas las explicaciones y análisis deben estar en español.`,
    de: `\n\nWichtiger Hinweis: Antworten Sie nur auf Deutsch. Alle Erklärungen und Analysen müssen auf Deutsch sein.`,
    zh: `\n\n重要提示：仅用中文回复。所有解释和分析必须用中文进行。`,
    ja: `\n\n重要な注意：日本語でのみ回答してください。すべての説明と分析は日本語である必要があります。`,
    en: `\n\nImportant note: Respond only in English. All explanations and analyses must be in English.`,
  };
  
  return basePrompt + (languageInstructions[language] || languageInstructions['en']);
};

export const validateLanguageResponse = (response: string, expectedLanguage: string): boolean => {
  // Simple validation - check if response contains expected language patterns
  const languagePatterns: Record<string, RegExp> = {
    ar: /[\u0600-\u06FF]/,
    fr: /\b(le|la|les|de|du|et|est|que|pour|avec|par)\b/i,
    es: /\b(el|la|los|las|de|y|es|que|para|con|por)\b/i,
    de: /\b(der|die|das|und|ist|ein|eine|zu|von|mit)\b/i,
    zh: /[\u4E00-\u9FFF]/,
    ja: /[\u3040-\u309F\u30A0-\u30FF]/,
    en: /[a-zA-Z]{3,}/,
  };
  
  const pattern = languagePatterns[expectedLanguage];
  return pattern ? pattern.test(response) : true;
};

export const languageAwareRouter = {
  detectLanguage,
  getLanguageSystemPrompt,
  getLanguageSpecificPrompt,
  validateLanguageResponse,
};
