/**
 * Survey Calibration Layer - Enable Disabled Layer #5
 * 
 * Calibrates survey questions and responses for better accuracy
 */

export interface SurveyQuestion {
  id: string;
  text: string;
  language: 'ar' | 'en';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  calibrationScore: number; // 0-100
  responseCount: number;
  averageTime: number; // milliseconds
}

export interface SurveyResponse {
  questionId: string;
  respondentId: string;
  response: string;
  confidence: number;
  responseTime: number;
  timestamp: number;
}

export interface CalibrationMetrics {
  questionId: string;
  clarity: number; // 0-100
  relevance: number; // 0-100
  discrimination: number; // 0-100
  difficulty: number; // 0-100
  reliability: number; // 0-100
  overallCalibration: number; // 0-100
}

/**
 * Calibrate survey questions
 */
export function calibrateSurveyQuestions(
  questions: SurveyQuestion[],
  responses: SurveyResponse[]
): Record<string, CalibrationMetrics> {
  const metrics: Record<string, CalibrationMetrics> = {};

  for (const question of questions) {
    const questionResponses = responses.filter(r => r.questionId === question.id);

    if (questionResponses.length === 0) {
      metrics[question.id] = {
        questionId: question.id,
        clarity: 50,
        relevance: 50,
        discrimination: 50,
        difficulty: 50,
        reliability: 50,
        overallCalibration: 50,
      };
      continue;
    }

    // Calculate clarity: based on response consistency
    const responseVariance = calculateResponseVariance(questionResponses);
    const clarity = Math.max(0, 100 - responseVariance * 10);

    // Calculate relevance: based on response correlation with other questions
    const relevance = 75; // Placeholder

    // Calculate discrimination: ability to differentiate between respondents
    const discrimination = calculateDiscrimination(questionResponses);

    // Calculate difficulty: based on average response time and error rate
    const avgTime = questionResponses.reduce((sum, r) => sum + r.responseTime, 0) / questionResponses.length;
    const difficulty = Math.min(100, (avgTime / 5000) * 100);

    // Calculate reliability: based on response consistency over time
    const reliability = calculateReliability(questionResponses);

    // Overall calibration
    const overallCalibration = (clarity + relevance + discrimination + (100 - difficulty) + reliability) / 5;

    metrics[question.id] = {
      questionId: question.id,
      clarity: Math.round(clarity),
      relevance: Math.round(relevance),
      discrimination: Math.round(discrimination),
      difficulty: Math.round(difficulty),
      reliability: Math.round(reliability),
      overallCalibration: Math.round(overallCalibration),
    };
  }

  return metrics;
}

/**
 * Calculate response variance
 */
function calculateResponseVariance(responses: SurveyResponse[]): number {
  if (responses.length === 0) return 0;

  const confidences = responses.map(r => r.confidence);
  const mean = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
  const variance = confidences.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / confidences.length;

  return Math.sqrt(variance) / 100; // Normalize to 0-1
}

/**
 * Calculate discrimination ability
 */
function calculateDiscrimination(responses: SurveyResponse[]): number {
  if (responses.length < 2) return 50;

  // Group responses by confidence level
  const highConfidence = responses.filter(r => r.confidence > 70).length;
  const lowConfidence = responses.filter(r => r.confidence < 30).length;
  const total = responses.length;

  // Discrimination is high if there's clear separation
  const discrimination = ((highConfidence + lowConfidence) / total) * 100;

  return Math.min(100, discrimination);
}

/**
 * Calculate reliability
 */
function calculateReliability(responses: SurveyResponse[]): number {
  if (responses.length < 2) return 50;

  // Sort responses by timestamp
  const sorted = [...responses].sort((a, b) => a.timestamp - b.timestamp);

  // Calculate consistency between consecutive responses
  let consistencyScore = 0;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.abs(sorted[i].confidence - sorted[i - 1].confidence);
    consistencyScore += Math.max(0, 100 - diff);
  }

  const reliability = consistencyScore / (sorted.length - 1);

  return Math.min(100, reliability);
}

/**
 * Recommend question improvements
 */
export function recommendQuestionImprovements(metrics: CalibrationMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.clarity < 60) {
    recommendations.push('Improve question clarity - responses are inconsistent');
  }

  if (metrics.relevance < 60) {
    recommendations.push('Review question relevance - may not correlate with other questions');
  }

  if (metrics.discrimination < 40) {
    recommendations.push('Improve question discrimination - cannot differentiate between respondents');
  }

  if (metrics.difficulty > 80) {
    recommendations.push('Simplify question - too difficult for respondents');
  }

  if (metrics.reliability < 60) {
    recommendations.push('Improve question reliability - responses are inconsistent over time');
  }

  if (metrics.overallCalibration < 60) {
    recommendations.push('Consider removing or redesigning this question');
  }

  return recommendations;
}

/**
 * Adjust survey based on calibration
 */
export function adjustSurveyBasedOnCalibration(
  questions: SurveyQuestion[],
  metrics: Record<string, CalibrationMetrics>
): SurveyQuestion[] {
  return questions.map(question => {
    const metric = metrics[question.id];

    if (!metric) return question;

    // Update calibration score
    const updatedQuestion = { ...question, calibrationScore: metric.overallCalibration };

    // Adjust difficulty based on metrics
    if (metric.difficulty > 80) {
      updatedQuestion.difficulty = 'easy';
    } else if (metric.difficulty > 50) {
      updatedQuestion.difficulty = 'medium';
    } else {
      updatedQuestion.difficulty = 'hard';
    }

    return updatedQuestion;
  });
}

/**
 * Generate calibration report
 */
export function generateCalibrationReport(
  questions: SurveyQuestion[],
  metrics: Record<string, CalibrationMetrics>
): string {
  let report = `# Survey Calibration Report\n\n`;

  report += `## Summary\n`;
  const avgCalibration =
    Object.values(metrics).reduce((sum, m) => sum + m.overallCalibration, 0) / Object.keys(metrics).length;
  report += `- **Average Calibration Score:** ${avgCalibration.toFixed(1)}/100\n`;
  report += `- **Total Questions:** ${questions.length}\n`;
  report += `- **Well-Calibrated Questions:** ${Object.values(metrics).filter(m => m.overallCalibration > 70).length}\n`;
  report += `- **Poorly-Calibrated Questions:** ${Object.values(metrics).filter(m => m.overallCalibration < 50).length}\n\n`;

  report += `## Question-by-Question Analysis\n`;
  for (const question of questions) {
    const metric = metrics[question.id];
    if (!metric) continue;

    report += `### ${question.text}\n`;
    report += `- **Clarity:** ${metric.clarity}/100\n`;
    report += `- **Relevance:** ${metric.relevance}/100\n`;
    report += `- **Discrimination:** ${metric.discrimination}/100\n`;
    report += `- **Difficulty:** ${metric.difficulty}/100\n`;
    report += `- **Reliability:** ${metric.reliability}/100\n`;
    report += `- **Overall Calibration:** ${metric.overallCalibration}/100\n`;

    const recommendations = recommendQuestionImprovements(metric);
    if (recommendations.length > 0) {
      report += `- **Recommendations:**\n`;
      for (const rec of recommendations) {
        report += `  - ${rec}\n`;
      }
    }
    report += '\n';
  }

  return report;
}

/**
 * Validate survey calibration
 */
export function validateSurveyCalibration(metrics: CalibrationMetrics): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (metrics.clarity < 0 || metrics.clarity > 100) {
    issues.push('Clarity score must be between 0 and 100');
  }

  if (metrics.relevance < 0 || metrics.relevance > 100) {
    issues.push('Relevance score must be between 0 and 100');
  }

  if (metrics.discrimination < 0 || metrics.discrimination > 100) {
    issues.push('Discrimination score must be between 0 and 100');
  }

  if (metrics.difficulty < 0 || metrics.difficulty > 100) {
    issues.push('Difficulty score must be between 0 and 100');
  }

  if (metrics.reliability < 0 || metrics.reliability > 100) {
    issues.push('Reliability score must be between 0 and 100');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Get calibration status
 */
export function getCalibrationStatus(metrics: Record<string, CalibrationMetrics>): {
  status: 'excellent' | 'good' | 'fair' | 'poor';
  score: number;
  message: string;
} {
  const scores = Object.values(metrics).map(m => m.overallCalibration);
  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  let status: 'excellent' | 'good' | 'fair' | 'poor';
  let message: string;

  if (avgScore >= 80) {
    status = 'excellent';
    message = 'Survey is well-calibrated and ready for use';
  } else if (avgScore >= 60) {
    status = 'good';
    message = 'Survey is reasonably calibrated with minor improvements needed';
  } else if (avgScore >= 40) {
    status = 'fair';
    message = 'Survey needs significant improvements before use';
  } else {
    status = 'poor';
    message = 'Survey requires major redesign';
  }

  return {
    status,
    score: Math.round(avgScore),
    message,
  };
}
