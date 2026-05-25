import { t } from "../_core/i18n";
/**
 * AMALSENSE UNIVERSAL REASONING ENGINE - Autonomous Edition
 *            .
 */

import axios from 'axios';

/**
 *       EngineSelector
 *     export   
 */
export async function analyzeEventVectorWithUniversalModel(
  vector: any,
  language: string = 'ar'
): Promise<string> {
  console.log(`[AmalSense] 🧠 Thinking with Universal Engine for: ${vector.topic || 'General Topic'}`);

  const prompt = createUniversalPrompt(vector, language);

  try {
    //    Pollinations AI (  API Key  )
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
      ? t('auto.utils_eventVectorReasoning.2.dbf72a42', 'ar')
      : "Apologies, the engine is updating its digital consciousness. Please try again later.";
  }
}

/**
 *  ""    (Physics, Law, Medicine, Economics)
 */
export function createUniversalPrompt(vector: any, language: string = 'ar'): string {
  const emotionsList = vector.emotions
    ? Object.entries(vector.emotions).map(([e, v]) => `${e}: ${((v as number) * 100).toFixed(0)}%`).join(', ')
    : 'Neutral State';

  const prompts: Record<string, string> = {
    ar: ` "  " (ASI)      (DCFT):
    
      (   ):
: ${vector.topic || t('auto.utils_eventVectorReasoning.1.b2c702e7', 'ar')}
 : ${vector.dominantEmotion || 'neutral'}
 : ${vector.dominantCategory || 'General'}
 : ${emotionsList}

:
1.  " "  (Resonance RI) .
2.     (     )    .
3.        .`,

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
 *      (Alias)
 */
export const analyzeEventVector = analyzeEventVectorWithUniversalModel;