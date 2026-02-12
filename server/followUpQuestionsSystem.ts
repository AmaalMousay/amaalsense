/**
 * Follow-Up Questions System
 * Enables users to ask specific follow-up questions about predictions, recommendations, and what-if scenarios
 */

import { answerFollowUpQuestion } from './structuredAIResponse';

export interface FollowUpQuestion {
  id: string;
  category: 'predictions' | 'recommendations' | 'whatIf';
  question: string;
  answer?: string;
  answered: boolean;
  timestamp: Date;
}

export interface FollowUpQuestionsSet {
  analysisId: string;
  topic: string;
  country: string;
  questions: {
    predictions: FollowUpQuestion[];
    recommendations: FollowUpQuestion[];
    whatIf: FollowUpQuestion[];
  };
}

/**
 * Pre-defined follow-up questions for each category
 */
export const PREDEFINED_FOLLOWUP_QUESTIONS = {
  predictions: [
    'What specific economic indicators will change in the next month?',
    'How will this situation affect neighboring countries?',
    'What is the probability of escalation in the next 3 months?',
    'Which demographic groups will be most affected?',
    'What external factors could change this trajectory?',
  ],
  recommendations: [
    'What immediate actions should the government take?',
    'Which international organizations should get involved?',
    'What role can civil society play in addressing this?',
    'What private sector initiatives would be most effective?',
    'How can we prevent negative outcomes?',
  ],
  whatIf: [
    'What if international support increases significantly?',
    'What if the regional situation deteriorates further?',
    'What if new leadership takes power?',
    'What if economic sanctions are imposed?',
    'What if a major external event occurs?',
  ],
};

/**
 * Create a new follow-up questions set
 */
export function createFollowUpQuestionsSet(
  analysisId: string,
  topic: string,
  country: string,
  customQuestions?: {
    predictions?: string[];
    recommendations?: string[];
    whatIf?: string[];
  }
): FollowUpQuestionsSet {
  const predictions = (customQuestions?.predictions || PREDEFINED_FOLLOWUP_QUESTIONS.predictions).map(
    (q, i) => ({
      id: `pred-${i}`,
      category: 'predictions' as const,
      question: q,
      answered: false,
      timestamp: new Date(),
    })
  );

  const recommendations = (customQuestions?.recommendations || PREDEFINED_FOLLOWUP_QUESTIONS.recommendations).map(
    (q, i) => ({
      id: `rec-${i}`,
      category: 'recommendations' as const,
      question: q,
      answered: false,
      timestamp: new Date(),
    })
  );

  const whatIf = (customQuestions?.whatIf || PREDEFINED_FOLLOWUP_QUESTIONS.whatIf).map((q, i) => ({
    id: `whatif-${i}`,
    category: 'whatIf' as const,
    question: q,
    answered: false,
    timestamp: new Date(),
  }));

  return {
    analysisId,
    topic,
    country,
    questions: {
      predictions,
      recommendations,
      whatIf,
    },
  };
}

/**
 * Answer a specific follow-up question
 */
export async function answerQuestion(
  questionId: string,
  question: string,
  topic: string,
  country: string,
  analysisContext: string
): Promise<{
  questionId: string;
  question: string;
  answer: string;
  timestamp: Date;
}> {
  const answer = await answerFollowUpQuestion(question, topic, country, analysisContext);

  return {
    questionId,
    question,
    answer,
    timestamp: new Date(),
  };
}

/**
 * Get all unanswered questions
 */
export function getUnansweredQuestions(questionsSet: FollowUpQuestionsSet): FollowUpQuestion[] {
  const allQuestions = [
    ...questionsSet.questions.predictions,
    ...questionsSet.questions.recommendations,
    ...questionsSet.questions.whatIf,
  ];

  return allQuestions.filter((q) => !q.answered);
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(
  questionsSet: FollowUpQuestionsSet,
  category: 'predictions' | 'recommendations' | 'whatIf'
): FollowUpQuestion[] {
  return questionsSet.questions[category];
}

/**
 * Mark question as answered
 */
export function markQuestionAnswered(
  questionsSet: FollowUpQuestionsSet,
  questionId: string,
  answer: string
): FollowUpQuestionsSet {
  const updated = { ...questionsSet };

  // Find and update the question
  for (const category of ['predictions', 'recommendations', 'whatIf'] as const) {
    const question = updated.questions[category].find((q) => q.id === questionId);
    if (question) {
      question.answered = true;
      question.answer = answer;
      break;
    }
  }

  return updated;
}

/**
 * Generate custom follow-up questions based on analysis
 */
export async function generateCustomFollowUpQuestions(
  topic: string,
  country: string,
  analysisContext: string
): Promise<{
  predictions: string[];
  recommendations: string[];
  whatIf: string[];
}> {
  const prompt = `
Based on this analysis of ${topic} in ${country}:

${analysisContext}

Generate 5 specific, actionable follow-up questions for each category:

1. PREDICTIONS (What will happen?)
- Ask about specific, measurable outcomes
- Ask about timing and probability
- Ask about cascading effects

2. RECOMMENDATIONS (What should be done?)
- Ask about specific, implementable actions
- Ask about stakeholder roles
- Ask about resource requirements

3. WHAT-IF SCENARIOS (What if X happens?)
- Ask about realistic alternative scenarios
- Ask about prevention strategies
- Ask about contingency plans

Return as JSON:
{
  "predictions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
  "recommendations": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
  "whatIf": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
}
`;

  // This would call the LLM to generate custom questions
  // For now, return predefined questions
  return PREDEFINED_FOLLOWUP_QUESTIONS;
}

/**
 * Get question suggestions based on user's previous questions
 */
export function getSuggestedNextQuestions(
  questionsSet: FollowUpQuestionsSet,
  answeredQuestionId: string
): FollowUpQuestion[] {
  const answeredQuestion = [
    ...questionsSet.questions.predictions,
    ...questionsSet.questions.recommendations,
    ...questionsSet.questions.whatIf,
  ].find((q) => q.id === answeredQuestionId);

  if (!answeredQuestion) {
    return [];
  }

  // Suggest questions from other categories
  const suggestions: FollowUpQuestion[] = [];

  if (answeredQuestion.category === 'predictions') {
    // If user asked about predictions, suggest recommendations
    suggestions.push(...questionsSet.questions.recommendations.filter((q) => !q.answered).slice(0, 2));
  } else if (answeredQuestion.category === 'recommendations') {
    // If user asked about recommendations, suggest what-if scenarios
    suggestions.push(...questionsSet.questions.whatIf.filter((q) => !q.answered).slice(0, 2));
  } else if (answeredQuestion.category === 'whatIf') {
    // If user asked about what-if, suggest predictions
    suggestions.push(...questionsSet.questions.predictions.filter((q) => !q.answered).slice(0, 2));
  }

  return suggestions;
}

/**
 * Export questions and answers as report
 */
export function exportQuestionsAsReport(questionsSet: FollowUpQuestionsSet): string {
  let report = `# Follow-Up Questions Report\n\n`;
  report += `**Topic:** ${questionsSet.topic}\n`;
  report += `**Country:** ${questionsSet.country}\n\n`;

  // Predictions
  report += `## Predictions\n\n`;
  questionsSet.questions.predictions.forEach((q, i) => {
    report += `### ${i + 1}. ${q.question}\n`;
    if (q.answer) {
      report += `**Answer:** ${q.answer}\n\n`;
    } else {
      report += `*Not yet answered*\n\n`;
    }
  });

  // Recommendations
  report += `## Recommendations\n\n`;
  questionsSet.questions.recommendations.forEach((q, i) => {
    report += `### ${i + 1}. ${q.question}\n`;
    if (q.answer) {
      report += `**Answer:** ${q.answer}\n\n`;
    } else {
      report += `*Not yet answered*\n\n`;
    }
  });

  // What-If Scenarios
  report += `## What-If Scenarios\n\n`;
  questionsSet.questions.whatIf.forEach((q, i) => {
    report += `### ${i + 1}. ${q.question}\n`;
    if (q.answer) {
      report += `**Answer:** ${q.answer}\n\n`;
    } else {
      report += `*Not yet answered*\n\n`;
    }
  });

  return report;
}
