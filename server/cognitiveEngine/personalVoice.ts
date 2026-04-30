/**
 * Layer 17: Personal Voice Layer
 * 
 * Adjusts the response tone, formatting, and stylistic elements
 * based on user preferences and the emotional context of the topic.
 */

import { UserPreferences } from './personalMemory';

export interface VoiceInstruction {
  promptModifier: string;
  formattingRules: string[];
}

/**
 * Generates specific instructions for the LLM to adopt the correct "Voice".
 */
export function generateVoiceInstructions(
  preferences: UserPreferences,
  emotionalIntensity: number,
  dominantEmotion: string
): VoiceInstruction {
  
  let promptModifier = "";
  const formattingRules: string[] = [];

  const lang = preferences.language;

  // 1. Tone Adjustment based on preference
  if (preferences.tone === 'formal') {
    promptModifier += lang === 'ar' 
      ? "استخدم لغة عربية فصحى رسمية وموضوعية جداً كأنك خبير استراتيجي دولي. تجنب العاطفة في أسلوبك. " 
      : "Use highly formal, objective language like an international strategic expert. Avoid emotional styling. ";
  } else if (preferences.tone === 'casual') {
    promptModifier += lang === 'ar'
      ? "استخدم لغة بسيطة وسهلة الفهم كأنك مستشار صديق يشرح الموضوع ببساطة. "
      : "Use simple, conversational language like a friendly advisor explaining a topic simply. ";
  } else {
    // Analytical default
    promptModifier += lang === 'ar'
      ? "استخدم لغة تحليلية دقيقة مدعومة بالأرقام والاستنتاجات المنطقية. "
      : "Use precise analytical language backed by numbers and logical deductions. ";
  }

  // 2. Adjust based on Emotional Intensity (Override preferences if crisis detected)
  if (emotionalIntensity > 0.8 && ['fear', 'anger'].includes(dominantEmotion)) {
    promptModifier += lang === 'ar'
      ? "ملاحظة هامة: الموضوع حساس جداً والمخاطر عالية. كن حذراً وموضوعياً وقدم تطمينات إن وجدت. "
      : "IMPORTANT: The topic is highly sensitive with high risks. Be cautious, objective, and provide reassurances if available. ";
  }

  // 3. Formatting Rules
  if (preferences.detailLevel === 'brief') {
    formattingRules.push(lang === 'ar' ? "اجعل الإجابة قصيرة جداً ومباشرة في نقاط." : "Keep the answer very short and direct using bullet points.");
  } else if (preferences.detailLevel === 'comprehensive') {
    formattingRules.push(lang === 'ar' ? "قدم تقريراً شاملاً مقسماً إلى فقرات وعناوين فرعية." : "Provide a comprehensive report divided into paragraphs and subheadings.");
  }

  if (preferences.wantsData) {
    formattingRules.push(lang === 'ar' ? "يجب إدراج مؤشرات البيانات (GMI, CFI, HRI) في التحليل بوضوح." : "You must explicitly include data indices (GMI, CFI, HRI) in the analysis.");
  }

  return {
    promptModifier,
    formattingRules
  };
}

/**
 * Formats the Voice instructions for the system prompt.
 */
export function formatVoiceForPrompt(instructions: VoiceInstruction, language: 'ar' | 'en' = 'ar'): string {
  const header = language === 'ar' ? "قواعد النبرة والأسلوب المخصصة:" : "Custom Tone and Style Rules:";
  
  let formatted = `\n${header}\n- ${instructions.promptModifier}\n`;
  if (instructions.formattingRules.length > 0) {
    formatted += instructions.formattingRules.map(rule => `- ${rule}`).join('\n') + '\n';
  }
  
  return formatted;
}
