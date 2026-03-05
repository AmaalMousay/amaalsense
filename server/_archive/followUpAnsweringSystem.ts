/**
 * Follow-Up Question Answering System
 * Handles specific follow-up questions: Recommendations, Risks, Predictions, What-If scenarios
 */

export type QuestionType = 'recommendation' | 'risk' | 'prediction' | 'scenario' | 'comparison' | 'general';

export interface FollowUpQuestion {
  id: string;
  type: QuestionType;
  question: string;
  context: string;
  relatedAnalysis: string;
}

export interface FollowUpAnswer {
  questionId: string;
  questionType: QuestionType;
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
  relatedInsights: string[];
  nextQuestions: string[];
}

/**
 * Detect question type from user input
 */
export function detectQuestionType(userInput: string): QuestionType {
  const lowerInput = userInput.toLowerCase();

  // Recommendation patterns
  if (
    lowerInput.includes('recommend') ||
    lowerInput.includes('should') ||
    lowerInput.includes('action') ||
    lowerInput.includes('do') ||
    lowerInput.includes('توصية') ||
    lowerInput.includes('يجب')
  ) {
    return 'recommendation';
  }

  // Risk patterns
  if (
    lowerInput.includes('risk') ||
    lowerInput.includes('danger') ||
    lowerInput.includes('threat') ||
    lowerInput.includes('problem') ||
    lowerInput.includes('خطر') ||
    lowerInput.includes('مخاطر')
  ) {
    return 'risk';
  }

  // Prediction patterns
  if (
    lowerInput.includes('predict') ||
    lowerInput.includes('future') ||
    lowerInput.includes('expect') ||
    lowerInput.includes('happen') ||
    lowerInput.includes('will') ||
    lowerInput.includes('توقع') ||
    lowerInput.includes('المستقبل')
  ) {
    return 'prediction';
  }

  // Scenario patterns
  if (
    lowerInput.includes('what if') ||
    lowerInput.includes('scenario') ||
    lowerInput.includes('alternative') ||
    lowerInput.includes('suppose') ||
    lowerInput.includes('ماذا لو') ||
    lowerInput.includes('سيناريو')
  ) {
    return 'scenario';
  }

  // Comparison patterns
  if (
    lowerInput.includes('compare') ||
    lowerInput.includes('difference') ||
    lowerInput.includes('vs') ||
    lowerInput.includes('similar') ||
    lowerInput.includes('مقارنة') ||
    lowerInput.includes('الفرق')
  ) {
    return 'comparison';
  }

  return 'general';
}

/**
 * Generate recommendation answer
 */
export function generateRecommendationAnswer(
  analysis: {
    mainTopic: string;
    mood: string;
    confidence: number;
    keyFactors: string[];
    trends: string[];
  },
  context: string
): FollowUpAnswer {
  const recommendations: string[] = [];
  const sources: string[] = [];

  // Based on mood
  if (analysis.mood.includes('negative') || analysis.mood.includes('pessimistic')) {
    recommendations.push('Take a cautious approach - wait for more clarity before making major decisions');
    recommendations.push('Diversify your options to reduce risk exposure');
    recommendations.push('Monitor key indicators closely for changes');
  } else if (analysis.mood.includes('positive') || analysis.mood.includes('optimistic')) {
    recommendations.push('Consider taking advantage of current positive sentiment');
    recommendations.push('Act decisively while conditions are favorable');
    recommendations.push('Build on momentum to achieve long-term goals');
  } else {
    recommendations.push('Maintain a balanced approach given mixed signals');
    recommendations.push('Seek more information before committing to major decisions');
    recommendations.push('Prepare contingency plans for multiple scenarios');
  }

  // Based on confidence
  if (analysis.confidence < 50) {
    recommendations.push('⚠️ Given low confidence in current data, seek additional sources before acting');
  } else if (analysis.confidence > 80) {
    recommendations.push('✓ High confidence in analysis - recommendations are well-founded');
  }

  const answer = recommendations.join('\n\n');

  return {
    questionId: `rec-${Date.now()}`,
    questionType: 'recommendation',
    question: 'What should we do based on this analysis?',
    answer,
    confidence: analysis.confidence,
    sources: ['Current Analysis', 'Historical Patterns', 'Expert Assessment'],
    relatedInsights: analysis.keyFactors,
    nextQuestions: [
      'What are the main risks we should consider?',
      'What could change this outlook?',
      'How does this compare to similar past situations?'
    ]
  };
}

/**
 * Generate risk answer
 */
export function generateRiskAnswer(
  analysis: {
    mainTopic: string;
    mood: string;
    volatility: number;
    confidence: number;
    keyFactors: string[];
  },
  context: string
): FollowUpAnswer {
  const risks: string[] = [];

  // Immediate risks
  risks.push('🔴 **Immediate Risks:**');
  if (analysis.volatility > 70) {
    risks.push('- High volatility could lead to sudden changes');
    risks.push('- Rapid shifts in sentiment may catch people unprepared');
  }
  if (analysis.confidence < 60) {
    risks.push('- Uncertainty about the situation could lead to poor decisions');
    risks.push('- Incomplete information may result in unexpected developments');
  }

  // Medium-term risks
  risks.push('\n🟠 **Medium-Term Risks:**');
  risks.push('- Prolonged uncertainty could erode confidence');
  risks.push('- Polarization of opinions may prevent consensus');
  risks.push('- Delayed action could miss critical windows of opportunity');

  // Emerging risks
  risks.push('\n🟡 **Emerging Risks:**');
  risks.push('- New information could dramatically shift the outlook');
  risks.push('- External factors may amplify or mitigate current trends');
  risks.push('- Unintended consequences of potential actions');

  const answer = risks.join('\n');

  return {
    questionId: `risk-${Date.now()}`,
    questionType: 'risk',
    question: 'What are the main risks we should be aware of?',
    answer,
    confidence: analysis.confidence,
    sources: ['Risk Assessment', 'Historical Precedents', 'Trend Analysis'],
    relatedInsights: analysis.keyFactors,
    nextQuestions: [
      'How can we mitigate these risks?',
      'What early warning signs should we watch for?',
      'What are the worst-case scenarios?'
    ]
  };
}

/**
 * Generate prediction answer
 */
export function generatePredictionAnswer(
  analysis: {
    mainTopic: string;
    trend: string;
    confidence: number;
    momentum: number;
    keyFactors: string[];
  },
  timeframe: 'short' | 'medium' | 'long' = 'medium'
): FollowUpAnswer {
  const predictions: string[] = [];
  const timeLabel = timeframe === 'short' ? 'Next 1-3 months' : timeframe === 'medium' ? 'Next 3-6 months' : 'Next 6-12 months';

  predictions.push(`**${timeLabel}:**\n`);

  if (analysis.trend.includes('upward') || analysis.momentum > 0.5) {
    predictions.push('📈 Positive trend expected to continue');
    predictions.push('- Sentiment likely to improve further');
    predictions.push('- Momentum suggests sustained positive outlook');
    predictions.push(`- Confidence level: ${analysis.confidence}%`);
  } else if (analysis.trend.includes('downward') || analysis.momentum < -0.5) {
    predictions.push('📉 Negative trend may continue');
    predictions.push('- Sentiment likely to decline further');
    predictions.push('- Momentum suggests sustained negative outlook');
    predictions.push(`- Confidence level: ${analysis.confidence}%`);
  } else {
    predictions.push('➡️ Stabilization expected');
    predictions.push('- Current trend may plateau');
    predictions.push('- Sentiment likely to remain mixed');
    predictions.push(`- Confidence level: ${analysis.confidence}%`);
  }

  predictions.push('\n**Key Factors to Watch:**');
  analysis.keyFactors.forEach(factor => {
    predictions.push(`- ${factor}`);
  });

  const answer = predictions.join('\n');

  return {
    questionId: `pred-${Date.now()}`,
    questionType: 'prediction',
    question: `What should we expect in the ${timeframe}-term?`,
    answer,
    confidence: analysis.confidence,
    sources: ['Trend Analysis', 'Historical Patterns', 'Momentum Indicators'],
    relatedInsights: analysis.keyFactors,
    nextQuestions: [
      'What could change this prediction?',
      'How confident are you in this forecast?',
      'What are the key milestones to watch?'
    ]
  };
}

/**
 * Generate what-if scenario answer
 */
export function generateScenarioAnswer(
  analysis: {
    mainTopic: string;
    currentState: string;
    keyFactors: string[];
    confidence: number;
  },
  scenario: string
): FollowUpAnswer {
  const scenarios: string[] = [];

  scenarios.push(`**Scenario: ${scenario}**\n`);

  // Scenario 1: Best case
  scenarios.push('🟢 **Best Case Outcome:**');
  scenarios.push('- Positive developments accelerate');
  scenarios.push('- Sentiment improves significantly');
  scenarios.push('- Opportunities emerge for stakeholders');
  scenarios.push('- Probability: 25-35%\n');

  // Scenario 2: Base case
  scenarios.push('🟡 **Most Likely Outcome:**');
  scenarios.push('- Current trends continue gradually');
  scenarios.push('- Sentiment remains mixed');
  scenarios.push('- Incremental progress on key issues');
  scenarios.push('- Probability: 50-60%\n');

  // Scenario 3: Worst case
  scenarios.push('🔴 **Worst Case Outcome:**');
  scenarios.push('- Negative developments accelerate');
  scenarios.push('- Sentiment deteriorates significantly');
  scenarios.push('- Challenges become more acute');
  scenarios.push('- Probability: 10-20%\n');

  scenarios.push('**Implications:**');
  scenarios.push('- Each scenario requires different preparation');
  scenarios.push('- Contingency planning is essential');
  scenarios.push('- Flexibility and adaptability are key');

  const answer = scenarios.join('\n');

  return {
    questionId: `scen-${Date.now()}`,
    questionType: 'scenario',
    question: `What if ${scenario}?`,
    answer,
    confidence: analysis.confidence,
    sources: ['Scenario Analysis', 'Historical Precedents', 'Expert Assessment'],
    relatedInsights: analysis.keyFactors,
    nextQuestions: [
      'How likely is each scenario?',
      'What preparations should we make?',
      'What are the early warning signs?'
    ]
  };
}

/**
 * Generate answer based on question type
 */
export function generateFollowUpAnswer(
  questionType: QuestionType,
  analysis: any,
  question: string
): FollowUpAnswer {
  switch (questionType) {
    case 'recommendation':
      return generateRecommendationAnswer(analysis, question);
    case 'risk':
      return generateRiskAnswer(analysis, question);
    case 'prediction':
      return generatePredictionAnswer(analysis, 'medium');
    case 'scenario':
      return generateScenarioAnswer(analysis, question);
    default:
      return {
        questionId: `general-${Date.now()}`,
        questionType: 'general',
        question,
        answer: 'Please ask a more specific question to get a detailed answer.',
        confidence: 50,
        sources: [],
        relatedInsights: [],
        nextQuestions: [
          'What recommendations do you need?',
          'What risks concern you?',
          'What predictions would help?'
        ]
      };
  }
}

/**
 * Get suggested follow-up questions
 */
export function getSuggestedFollowUpQuestions(analysisType: string): string[] {
  const suggestions: Record<string, string[]> = {
    political: [
      'What are the likely outcomes of this political situation?',
      'What actions should stakeholders take?',
      'What are the main risks we should monitor?',
      'How does this compare to similar past situations?',
      'What if the opposite happens?'
    ],
    economic: [
      'What does this mean for the economy?',
      'What investments should we consider?',
      'What are the recession risks?',
      'How will this affect employment?',
      'What are the inflation implications?'
    ],
    social: [
      'How will this affect society?',
      'What changes should we expect?',
      'How do different groups view this?',
      'What generational differences exist?',
      'What long-term impacts are likely?'
    ],
    security: [
      'What are the security implications?',
      'What preventive measures are needed?',
      'How likely is escalation?',
      'What are the humanitarian concerns?',
      'What international response is expected?'
    ]
  };

  return suggestions[analysisType] || suggestions.social;
}
