/**
 * Layer 11: Clarification Check Layer
 * 
 * This layer analyzes the user's question to determine if it is ambiguous,
 * missing context, or too broad. If ambiguity is detected, it generates
 * clarification questions to ask the user.
 */

import { DeepQuestion, extractTopic } from './questionUnderstanding';

export interface ClarificationResult {
  isAmbiguous: boolean;
  ambiguityScore: number; // 0 to 1 (1 being extremely ambiguous)
  missingElements: string[];
  clarificationQuestions: string[];
}

/**
 * Evaluates the ambiguity of a question and generates clarification questions if needed.
 */
export function evaluateAmbiguity(
  question: string,
  deepUnderstanding: DeepQuestion
): ClarificationResult {
  // 0. Immediate bypass for greetings
  if (deepUnderstanding.surface.questionType === 'greeting') {
    return {
      isAmbiguous: false,
      ambiguityScore: 0,
      missingElements: [],
      clarificationQuestions: []
    };
  }

  let ambiguityScore = 0;
  const missingElements: string[] = [];
  const clarificationQuestions: string[] = [];
  const language = deepUnderstanding.context.language;

  // 1. Check for lack of specific topic
  if (deepUnderstanding.surface.topic === 'موضوع عام' || deepUnderstanding.surface.topic.length < 2) {
    ambiguityScore += 0.4;
    missingElements.push('Topic');
    clarificationQuestions.push(
      language === 'ar' 
        ? 'عن أي موضوع أو قطاع بالتحديد تسأل؟ (مثال: الذهب، النفط، الاقتصاد)'
        : 'Which specific topic or sector are you asking about? (e.g., Gold, Oil, Economy)'
    );
  }

  // 2. Check for broad timeframe in prediction or analysis questions
  const needsTimeframe = ['will', 'when', 'compare', 'why'].includes(deepUnderstanding.surface.questionType);
  const hasTimeframe = /(اليوم|غداً|أمس|شهر|سنة|عام|أسبوع|مستقبل|ماضي|today|tomorrow|yesterday|month|year|week|future|past)/i.test(question);
  
  if (needsTimeframe && !hasTimeframe) {
    ambiguityScore += 0.2;
    missingElements.push('Timeframe');
    clarificationQuestions.push(
      language === 'ar'
        ? 'هل تقصد المدى القصير (أيام) أم المدى الطويل (أشهر/سنوات)؟'
        : 'Do you mean the short-term (days) or long-term (months/years)?'
    );
  }

  // 3. Check for lack of clear geographic or domain context
  const hasGeographicContext = /(عالم|دولي|محلي|بلد|دولة|منطقة|شرق الأوسط|أوروبا|أمريكا|global|local|country|region|middle east|europe|america)/i.test(question) || deepUnderstanding.surface.topic.includes('أمريكا') || deepUnderstanding.surface.topic.includes('السعودية');
  
  if (!hasGeographicContext && ['make_decision', 'assess_risk', 'understand_cause'].includes(deepUnderstanding.deep.realIntent)) {
    ambiguityScore += 0.2;
    missingElements.push('Geographic Context');
    clarificationQuestions.push(
      language === 'ar'
        ? 'هل تسأل عن التأثير المحلي أم العالمي؟'
        : 'Are you asking about the local or global impact?'
    );
  }

  // 4. Decision questions without specific assets
  if (deepUnderstanding.deep.realIntent === 'make_decision' && missingElements.includes('Topic')) {
    ambiguityScore += 0.3; // Very ambiguous decision
    clarificationQuestions.push(
      language === 'ar'
        ? 'ما هو الأصل أو الاستثمار الذي تفكر فيه؟'
        : 'What specific asset or investment are you considering?'
    );
  }

  // 5. Unclear "What-If" scenario
  if (deepUnderstanding.surface.questionType === 'what_if' && question.length < 15) {
    ambiguityScore += 0.5;
    missingElements.push('Scenario Details');
    clarificationQuestions.push(
      language === 'ar'
        ? 'يرجى توضيح السيناريو أكثر. ماذا تفترض أن يحدث؟'
        : 'Please clarify the scenario. What are you assuming will happen?'
    );
  }

  // Normalize score
  ambiguityScore = Math.min(1.0, ambiguityScore);
  const isAmbiguous = ambiguityScore >= 0.5;

  // Filter unique questions just in case
  const uniqueQuestions = [...new Set(clarificationQuestions)];

  return {
    isAmbiguous,
    ambiguityScore,
    missingElements,
    clarificationQuestions: isAmbiguous ? uniqueQuestions : [] // Only return questions if it's actually ambiguous
  };
}

/**
 * Formats the clarification response if the question is too ambiguous.
 */
export function formatClarificationResponse(result: ClarificationResult, language: 'ar' | 'en' = 'ar'): string {
  if (!result.isAmbiguous || result.clarificationQuestions.length === 0) {
    return '';
  }

  if (language === 'ar') {
    return `سؤالك مثير للاهتمام، لكن لكي أعطيك تحليلاً دقيقاً من (AmalSense)، أحتاج إلى بعض التوضيح:\n\n` + 
           result.clarificationQuestions.map(q => `- ${q}`).join('\n');
  } else {
    return `Your question is interesting, but to give you an accurate analysis from AmalSense, I need some clarification:\n\n` + 
           result.clarificationQuestions.map(q => `- ${q}`).join('\n');
  }
}
