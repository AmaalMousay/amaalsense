import { t } from "../_core/i18n";

/**
 * Dynamic Emotion Fallback System
 * 
 * Replaces static fallback values with intelligent, context-aware emotion scores
 * based on:
 * 1. Question type (emotional_analysis, prediction, factual, etc.)
 * 2. Keywords detected in the question
 * 3. Severity classification
 */

export interface DynamicEmotionFallback {
  joy: number;
  hope: number;
  sadness: number;
  anger: number;
  fear: number;
  curiosity: number;
  confidence: number;
}

/**
 * Death-related keywords that trigger high sadness
 */
const DEATH_KEYWORDS = [
  t('auto.utils_dynamicEmotionFallback.41.ba42d7b3', 'ar'), t('auto.utils_dynamicEmotionFallback.40.158c325c', 'ar'), t('auto.utils_dynamicEmotionFallback.39.c8e9ec22', 'ar'), t('auto.utils_dynamicEmotionFallback.38.bd80ed20', 'ar'), t('auto.utils_dynamicEmotionFallback.37.d61537f7', 'ar'), t('auto.utils_dynamicEmotionFallback.36.4e553f51', 'ar'), t('auto.utils_dynamicEmotionFallback.35.753afcfd', 'ar'), t('auto.utils_dynamicEmotionFallback.34.9269ef95', 'ar'),
  'death', 'died', 'killed', 'assassination', 'murder'
];

/**
 * Crisis/disaster keywords that trigger high fear
 */
const CRISIS_KEYWORDS = [
  t('auto.utils_dynamicEmotionFallback.33.38a8a76e', 'ar'), t('auto.utils_dynamicEmotionFallback.32.676d2f53', 'ar'), t('auto.utils_dynamicEmotionFallback.31.a2e97c7e', 'ar'), t('auto.utils_dynamicEmotionFallback.30.eb079783', 'ar'), t('auto.utils_dynamicEmotionFallback.29.b2155e1c', 'ar'), t('auto.utils_dynamicEmotionFallback.28.393955e1', 'ar'), t('auto.utils_dynamicEmotionFallback.27.417cc6aa', 'ar'), t('auto.utils_dynamicEmotionFallback.26.0bc287b7', 'ar'),
  'crisis', 'disaster', 'catastrophe', 'war', 'collapse', 'emergency'
];

/**
 * Positive/hopeful keywords that trigger high hope
 */
const HOPE_KEYWORDS = [
  t('auto.utils_dynamicEmotionFallback.25.60cd6c3d', 'ar'), t('auto.utils_dynamicEmotionFallback.24.1a5aec5a', 'ar'), t('auto.utils_dynamicEmotionFallback.23.3c9380a2', 'ar'), t('auto.utils_dynamicEmotionFallback.22.2eb748dc', 'ar'), t('auto.utils_dynamicEmotionFallback.21.ab4c7e3d', 'ar'), t('auto.utils_dynamicEmotionFallback.20.c81718df', 'ar'), t('auto.utils_dynamicEmotionFallback.19.3f289306', 'ar'), t('auto.utils_dynamicEmotionFallback.18.b5d1b567', 'ar'),
  'hope', 'positive', 'success', 'improvement', 'opportunity', 'progress'
];

/**
 * Conflict/anger keywords that trigger high anger
 */
const ANGER_KEYWORDS = [
  t('auto.utils_dynamicEmotionFallback.17.8e7bd750', 'ar'), t('auto.utils_dynamicEmotionFallback.16.4621602f', 'ar'), t('auto.utils_dynamicEmotionFallback.15.79dd638b', 'ar'), t('auto.utils_dynamicEmotionFallback.14.1c7749a1', 'ar'), t('auto.utils_dynamicEmotionFallback.13.d1b26335', 'ar'), t('auto.utils_dynamicEmotionFallback.12.f2ea6238', 'ar'), t('auto.utils_dynamicEmotionFallback.11.fdd11640', 'ar'), t('auto.utils_dynamicEmotionFallback.10.e5f07bb2', 'ar'),
  'anger', 'outrage', 'injustice', 'violence', 'discrimination'
];

/**
 * Curiosity/question keywords
 */
const CURIOSITY_KEYWORDS = [
  t('auto.utils_dynamicEmotionFallback.9.dc0f9a10', 'ar'), t('auto.utils_dynamicEmotionFallback.8.daa59aa1', 'ar'), t('auto.utils_dynamicEmotionFallback.7.a62caa1e', 'ar'), t('auto.utils_dynamicEmotionFallback.6.2500c161', 'ar'), t('auto.utils_dynamicEmotionFallback.5.861d9c3d', 'ar'), t('auto.utils_dynamicEmotionFallback.4.d87c6b36', 'ar'), t('auto.utils_dynamicEmotionFallback.3.aa7099e2', 'ar'), t('auto.utils_dynamicEmotionFallback.2.b4b22782', 'ar'), t('auto.utils_dynamicEmotionFallback.1.e1b8900c', 'ar'),
  'why', 'how', 'what', 'where', 'when', 'who', 'question'
];

/**
 * Analyze question content and return dynamic emotion fallback
 * 
 * @param question - The user's question or input
 * @param questionType - Type of question (emotional_analysis, prediction, factual, etc.)
 * @returns Dynamic emotion scores based on content
 */
export function calculateDynamicEmotionFallback(
  question: string,
  questionType: string = 'general'
): DynamicEmotionFallback {
  const lowerQuestion = question.toLowerCase();
  
  // Initialize all emotions to 0
  let emotions: DynamicEmotionFallback = {
    joy: 0,
    hope: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    curiosity: 0,
    confidence: 0.6, // Default confidence
  };

  // Count keyword matches for each emotion category
  let deathCount = 0;
  let crisisCount = 0;
  let hopeCount = 0;
  let angerCount = 0;
  let curiosityCount = 0;

  // Check for death-related keywords
  for (const keyword of DEATH_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) {
      deathCount++;
    }
  }

  // Check for crisis keywords
  for (const keyword of CRISIS_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) {
      crisisCount++;
    }
  }

  // Check for hope keywords
  for (const keyword of HOPE_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) {
      hopeCount++;
    }
  }

  // Check for anger keywords
  for (const keyword of ANGER_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) {
      angerCount++;
    }
  }

  // Check for curiosity keywords
  for (const keyword of CURIOSITY_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) {
      curiosityCount++;
    }
  }

  // Calculate emotion scores based on keyword matches
  // Death events: high sadness, moderate fear
  if (deathCount > 0) {
    emotions.sadness = Math.min(0.7 + (deathCount * 0.05), 1.0);
    emotions.fear = Math.min(0.4 + (deathCount * 0.03), 0.8);
    emotions.joy = Math.max(0.05 - (deathCount * 0.02), 0);
    emotions.hope = Math.max(0.2 - (deathCount * 0.03), 0.05);
    emotions.confidence = 0.85; // High confidence for death-related
  }

  // Crisis events: high fear, moderate anger
  if (crisisCount > 0) {
    emotions.fear = Math.min(emotions.fear + 0.5 + (crisisCount * 0.05), 1.0);
    emotions.anger = Math.min(emotions.anger + 0.3 + (crisisCount * 0.03), 0.8);
    emotions.sadness = Math.min(emotions.sadness + 0.2, 0.8);
    emotions.hope = Math.max(emotions.hope - 0.2, 0.1);
    emotions.confidence = 0.8; // High confidence for crisis
  }

  // Hope events: high hope, moderate joy
  if (hopeCount > 0) {
    emotions.hope = Math.min(0.6 + (hopeCount * 0.08), 1.0);
    emotions.joy = Math.min(0.4 + (hopeCount * 0.05), 0.9);
    emotions.sadness = Math.max(emotions.sadness - 0.2, 0.05);
    emotions.fear = Math.max(emotions.fear - 0.2, 0.05);
    emotions.confidence = 0.8;
  }

  // Anger events: high anger, moderate fear
  if (angerCount > 0) {
    emotions.anger = Math.min(emotions.anger + 0.5 + (angerCount * 0.05), 1.0);
    emotions.fear = Math.min(emotions.fear + 0.2, 0.7);
    emotions.sadness = Math.min(emotions.sadness + 0.15, 0.6);
    emotions.joy = Math.max(emotions.joy - 0.2, 0);
    emotions.confidence = 0.75;
  }

  // Curiosity-driven questions: high curiosity
  if (curiosityCount > 0) {
    emotions.curiosity = Math.min(0.5 + (curiosityCount * 0.08), 1.0);
    emotions.confidence = 0.7; // Moderate confidence for factual questions
  }

  // If no keywords matched, use question type to determine emotions
  const totalKeywords = deathCount + crisisCount + hopeCount + angerCount + curiosityCount;
  if (totalKeywords === 0) {
    emotions = getEmotionsByQuestionType(questionType);
  }

  // Normalize emotions to ensure they sum to approximately 1.0
  const nonConfidenceEmotions = [
    emotions.joy,
    emotions.hope,
    emotions.sadness,
    emotions.anger,
    emotions.fear,
    emotions.curiosity,
  ];

  const maxEmotion = Math.max(...nonConfidenceEmotions);
  if (maxEmotion > 1.0) {
    // Scale down proportionally
    const scale = 1.0 / maxEmotion;
    emotions.joy *= scale;
    emotions.hope *= scale;
    emotions.sadness *= scale;
    emotions.anger *= scale;
    emotions.fear *= scale;
    emotions.curiosity *= scale;
  }

  // Ensure minimum values for all emotions
  emotions.joy = Math.max(emotions.joy, 0.05);
  emotions.hope = Math.max(emotions.hope, 0.05);
  emotions.sadness = Math.max(emotions.sadness, 0.05);
  emotions.anger = Math.max(emotions.anger, 0.05);
  emotions.fear = Math.max(emotions.fear, 0.05);
  emotions.curiosity = Math.max(emotions.curiosity, 0.05);

  // Round to 2 decimal places
  emotions.joy = Math.round(emotions.joy * 100) / 100;
  emotions.hope = Math.round(emotions.hope * 100) / 100;
  emotions.sadness = Math.round(emotions.sadness * 100) / 100;
  emotions.anger = Math.round(emotions.anger * 100) / 100;
  emotions.fear = Math.round(emotions.fear * 100) / 100;
  emotions.curiosity = Math.round(emotions.curiosity * 100) / 100;
  emotions.confidence = Math.round(emotions.confidence * 100) / 100;

  return emotions;
}

/**
 * Get default emotions based on question type
 */
function getEmotionsByQuestionType(questionType: string): DynamicEmotionFallback {
  const typePatterns: Record<string, DynamicEmotionFallback> = {
    emotional_analysis: {
      joy: 0.15,
      hope: 0.25,
      sadness: 0.35,
      anger: 0.15,
      fear: 0.05,
      curiosity: 0.05,
      confidence: 0.65,
    },
    prediction: {
      joy: 0.2,
      hope: 0.3,
      sadness: 0.15,
      anger: 0.1,
      fear: 0.15,
      curiosity: 0.1,
      confidence: 0.6,
    },
    factual: {
      joy: 0.1,
      hope: 0.15,
      sadness: 0.1,
      anger: 0.1,
      fear: 0.1,
      curiosity: 0.45,
      confidence: 0.75,
    },
    general: {
      joy: 0.2,
      hope: 0.25,
      sadness: 0.2,
      anger: 0.1,
      fear: 0.1,
      curiosity: 0.15,
      confidence: 0.6,
    },
  };

  return typePatterns[questionType] || typePatterns.general;
}

/**
 * Convert dynamic emotion fallback to the format expected by the system
 * Returns emotions in 0-100 scale for compatibility
 */
export function convertToSystemFormat(fallback: DynamicEmotionFallback): Record<string, number> {
  return {
    joy: Math.round(fallback.joy * 100),
    hope: Math.round(fallback.hope * 100),
    sadness: Math.round(fallback.sadness * 100),
    anger: Math.round(fallback.anger * 100),
    fear: Math.round(fallback.fear * 100),
    curiosity: Math.round(fallback.curiosity * 100),
  };
}
