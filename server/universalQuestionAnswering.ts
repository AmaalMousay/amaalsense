/**
 * Universal Question Answering System
 * 
 * Answers universal human questions that everyone cares about:
 * - Is the world becoming more dangerous?
 * - Are we becoming more divided?
 * - Is there hope for the future?
 */

import { EventVector, calculateCFI, calculateHRI } from './eventVectorModel';

export type UniversalQuestion = 
  | 'is_world_dangerous'
  | 'are_we_divided'
  | 'is_there_hope'
  | 'is_economy_stable'
  | 'are_conflicts_increasing'
  | 'is_climate_crisis_worsening';

export type AnswerLevel = 'stable' | 'rising_tension' | 'high_fear' | 'critical';

export interface UniversalAnswer {
  question: UniversalQuestion;
  questionText: string;
  questionTextArabic: string;
  answer: AnswerLevel;
  answerLabel: string;
  answerLabelArabic: string;
  confidence: number; // 0-100
  emoji: string;
  color: string;
  explanation: string;
  explanationArabic: string;
  supportingData: {
    metric: string;
    value: number;
    trend: 'improving' | 'stable' | 'worsening';
  }[];
  recommendation: string;
  recommendationArabic: string;
}

/**
 * Map of universal questions
 */
const UNIVERSAL_QUESTIONS: Record<UniversalQuestion, { text: string; textArabic: string }> = {
  is_world_dangerous: {
    text: 'Is the world becoming more dangerous?',
    textArabic: 'هل العالم يصبح أكثر خطورة؟',
  },
  are_we_divided: {
    text: 'Are we becoming more divided?',
    textArabic: 'هل نصبح أكثر انقسامًا؟',
  },
  is_there_hope: {
    text: 'Is there hope for the future?',
    textArabic: 'هل هناك أمل للمستقبل؟',
  },
  is_economy_stable: {
    text: 'Is the global economy stable?',
    textArabic: 'هل الاقتصاد العالمي مستقر؟',
  },
  are_conflicts_increasing: {
    text: 'Are conflicts increasing worldwide?',
    textArabic: 'هل تتزايد الصراعات عالميًا؟',
  },
  is_climate_crisis_worsening: {
    text: 'Is the climate crisis worsening?',
    textArabic: 'هل أزمة المناخ تتفاقم؟',
  },
};

/**
 * Determine answer level based on metrics
 */
function determineAnswerLevel(cfi: number, hri: number, polarity: number): AnswerLevel {
  // If fear is very high and hope is low
  if (cfi > 75 && hri < 30) return 'critical';
  
  // If fear is high
  if (cfi > 60) return 'high_fear';
  
  // If fear is moderate and rising
  if (cfi > 40 && polarity < -0.2) return 'rising_tension';
  
  // Otherwise stable
  return 'stable';
}

/**
 * Get label for answer level
 */
function getAnswerLabel(level: AnswerLevel): { label: string; labelArabic: string; emoji: string; color: string } {
  switch (level) {
    case 'stable':
      return {
        label: 'Stable',
        labelArabic: 'مستقر',
        emoji: '🟢',
        color: '#4CAF50',
      };
    case 'rising_tension':
      return {
        label: 'Rising Tension',
        labelArabic: 'تصاعد التوتر',
        emoji: '🟡',
        color: '#FFC107',
      };
    case 'high_fear':
      return {
        label: 'High Fear',
        labelArabic: 'خوف عالي',
        emoji: '🟠',
        color: '#FF9800',
      };
    case 'critical':
      return {
        label: 'Critical',
        labelArabic: 'حرج',
        emoji: '🔴',
        color: '#F44336',
      };
  }
}

/**
 * Answer: Is the world becoming more dangerous?
 */
function answerIsDangerousQuestion(eventVectors: EventVector[]): UniversalAnswer {
  const cfi = calculateCFI(eventVectors);
  const avgPolarity = eventVectors.reduce((sum, ev) => sum + ev.polarity, 0) / (eventVectors.length || 1);
  
  // Check trend
  const recentEvents = eventVectors.slice(-10);
  const olderEvents = eventVectors.slice(0, Math.max(10, eventVectors.length - 10));
  const recentCFI = calculateCFI(recentEvents);
  const olderCFI = calculateCFI(olderEvents);
  const trend = recentCFI > olderCFI ? 'worsening' : recentCFI < olderCFI ? 'improving' : 'stable';
  
  const level = determineAnswerLevel(cfi, 50, avgPolarity);
  const { label, labelArabic, emoji, color } = getAnswerLabel(level);
  
  let explanation = '';
  let explanationArabic = '';
  
  switch (level) {
    case 'stable':
      explanation = 'Global fear levels remain within normal ranges. While challenges exist, overall security concerns are manageable.';
      explanationArabic = 'تبقى مستويات الخوف العالمية ضمن النطاقات الطبيعية. بينما توجد تحديات، فإن المخاوف الأمنية الإجمالية قابلة للإدارة.';
      break;
    case 'rising_tension':
      explanation = 'Fear levels are increasing. Multiple regions are experiencing rising tensions, though not yet critical.';
      explanationArabic = 'مستويات الخوف آخذة في الارتفاع. تشهد مناطق متعددة توترات متزايدة، لكنها ليست حرجة بعد.';
      break;
    case 'high_fear':
      explanation = 'Fear levels are significantly elevated. Multiple crises are occurring simultaneously, creating a dangerous environment.';
      explanationArabic = 'مستويات الخوف مرتفعة بشكل كبير. تحدث أزمات متعددة في نفس الوقت، مما يخلق بيئة خطرة.';
      break;
    case 'critical':
      explanation = 'The world is experiencing critical fear levels. Immediate intervention and stabilization efforts are needed.';
      explanationArabic = 'العالم يشهد مستويات خوف حرجة. هناك حاجة لتدخل فوري وجهود استقرار.';
      break;
  }
  
  return {
    question: 'is_world_dangerous',
    questionText: UNIVERSAL_QUESTIONS.is_world_dangerous.text,
    questionTextArabic: UNIVERSAL_QUESTIONS.is_world_dangerous.textArabic,
    answer: level,
    answerLabel: label,
    answerLabelArabic: labelArabic,
    confidence: Math.round(Math.min(100, cfi + 20)),
    emoji,
    color,
    explanation,
    explanationArabic,
    supportingData: [
      { metric: 'Collective Fear Index', value: Math.round(cfi), trend },
      { metric: 'Global Polarity', value: Math.round((avgPolarity + 1) / 2 * 100), trend: avgPolarity > 0 ? 'improving' : 'worsening' },
      { metric: 'Conflict Events', value: eventVectors.filter(ev => ev.topic === 'conflict').length, trend },
    ],
    recommendation: trend === 'worsening' ? 'Monitor developments closely and support conflict resolution efforts.' : 'Continue monitoring while supporting stability initiatives.',
    recommendationArabic: trend === 'worsening' ? 'راقب التطورات عن كثب وادعم جهود حل النزاعات.' : 'استمر في المراقبة مع دعم مبادرات الاستقرار.',
  };
}

/**
 * Answer: Are we becoming more divided?
 */
function answerAreDividedQuestion(eventVectors: EventVector[]): UniversalAnswer {
  const conflictEvents = eventVectors.filter(ev => ev.topic === 'conflict' || ev.topic === 'politics');
  const divisionScore = (conflictEvents.length / eventVectors.length) * 100;
  
  const avgPolarity = eventVectors.reduce((sum, ev) => sum + ev.polarity, 0) / (eventVectors.length || 1);
  const level = avgPolarity < -0.3 ? 'high_fear' : avgPolarity < 0 ? 'rising_tension' : 'stable';
  
  const { label, labelArabic, emoji, color } = getAnswerLabel(level);
  
  let explanation = '';
  let explanationArabic = '';
  
  if (divisionScore > 60) {
    explanation = 'Yes, division is increasing. Conflict and political tensions are rising globally.';
    explanationArabic = 'نعم، الانقسام آخذ في الزيادة. الصراعات والتوترات السياسية تتصاعد عالميًا.';
  } else if (divisionScore > 40) {
    explanation = 'Moderate division exists. Some regions show increasing polarization.';
    explanationArabic = 'يوجد انقسام معتدل. تظهر بعض المناطق استقطابًا متزايدًا.';
  } else {
    explanation = 'Division levels are relatively stable. Most regions maintain cooperative relationships.';
    explanationArabic = 'مستويات الانقسام مستقرة نسبيًا. تحافظ معظم المناطق على علاقات تعاونية.';
  }
  
  return {
    question: 'are_we_divided',
    questionText: UNIVERSAL_QUESTIONS.are_we_divided.text,
    questionTextArabic: UNIVERSAL_QUESTIONS.are_we_divided.textArabic,
    answer: level,
    answerLabel: label,
    answerLabelArabic: labelArabic,
    confidence: Math.round(Math.min(100, divisionScore + 20)),
    emoji,
    color,
    explanation,
    explanationArabic,
    supportingData: [
      { metric: 'Conflict Events', value: conflictEvents.length, trend: 'worsening' },
      { metric: 'Division Score', value: Math.round(divisionScore), trend: divisionScore > 50 ? 'worsening' : 'stable' },
      { metric: 'Global Polarity', value: Math.round((avgPolarity + 1) / 2 * 100), trend: avgPolarity < 0 ? 'worsening' : 'improving' },
    ],
    recommendation: divisionScore > 50 ? 'Promote dialogue and understanding between different groups.' : 'Continue building bridges and fostering cooperation.',
    recommendationArabic: divisionScore > 50 ? 'عزز الحوار والتفاهم بين المجموعات المختلفة.' : 'استمر في بناء الجسور وتعزيز التعاون.',
  };
}

/**
 * Answer: Is there hope for the future?
 */
function answerIsThereHopeQuestion(eventVectors: EventVector[]): UniversalAnswer {
  const hri = calculateHRI(eventVectors);
  const hopeEvents = eventVectors.filter(ev => ev.emotions.hope > 0.5);
  const hopePercentage = (hopeEvents.length / eventVectors.length) * 100;
  
  const level = hri > 70 ? 'stable' : hri > 50 ? 'rising_tension' : hri > 30 ? 'high_fear' : 'critical';
  const { label, labelArabic, emoji, color } = getAnswerLabel(level);
  
  let explanation = '';
  let explanationArabic = '';
  
  if (hri > 70) {
    explanation = 'Yes, there is strong hope. Many positive developments and opportunities exist for a better future.';
    explanationArabic = 'نعم، هناك أمل قوي. توجد العديد من التطورات الإيجابية والفرص لمستقبل أفضل.';
  } else if (hri > 50) {
    explanation = 'Moderate hope exists. While challenges persist, there are reasons for optimism.';
    explanationArabic = 'يوجد أمل معتدل. بينما تستمر التحديات، هناك أسباب للتفاؤل.';
  } else if (hri > 30) {
    explanation = 'Hope is limited. The future looks uncertain, but recovery is possible.';
    explanationArabic = 'الأمل محدود. المستقبل يبدو غير مؤكد، لكن التعافي ممكن.';
  } else {
    explanation = 'Hope is critically low. Immediate action is needed to restore confidence in the future.';
    explanationArabic = 'الأمل منخفض بشكل حرج. هناك حاجة لإجراء فوري لاستعادة الثقة بالمستقبل.';
  }
  
  return {
    question: 'is_there_hope',
    questionText: UNIVERSAL_QUESTIONS.is_there_hope.text,
    questionTextArabic: UNIVERSAL_QUESTIONS.is_there_hope.textArabic,
    answer: level,
    answerLabel: label,
    answerLabelArabic: labelArabic,
    confidence: Math.round(hri),
    emoji,
    color,
    explanation,
    explanationArabic,
    supportingData: [
      { metric: 'Hope Resilience Index', value: Math.round(hri), trend: hri > 50 ? 'improving' : 'worsening' },
      { metric: 'Hope Events', value: hopeEvents.length, trend: hopePercentage > 40 ? 'improving' : 'worsening' },
      { metric: 'Positive Sentiment', value: Math.round(hopePercentage), trend: hopePercentage > 40 ? 'improving' : 'worsening' },
    ],
    recommendation: hri < 50 ? 'Focus on positive developments and build momentum for change.' : 'Nurture hope and continue building on positive progress.',
    recommendationArabic: hri < 50 ? 'ركز على التطورات الإيجابية وبناء الزخم للتغيير.' : 'غذِّ الأمل واستمر في البناء على التقدم الإيجابي.',
  };
}

/**
 * Answer a universal question
 */
export function answerUniversalQuestion(
  question: UniversalQuestion,
  eventVectors: EventVector[]
): UniversalAnswer {
  switch (question) {
    case 'is_world_dangerous':
      return answerIsDangerousQuestion(eventVectors);
    case 'are_we_divided':
      return answerAreDividedQuestion(eventVectors);
    case 'is_there_hope':
      return answerIsThereHopeQuestion(eventVectors);
    default:
      throw new Error(`Unknown universal question: ${question}`);
  }
}

/**
 * Get all universal questions
 */
export function getAllUniversalQuestions(): Array<{ id: UniversalQuestion; text: string; textArabic: string }> {
  return Object.entries(UNIVERSAL_QUESTIONS).map(([id, { text, textArabic }]) => ({
    id: id as UniversalQuestion,
    text,
    textArabic,
  }));
}

/**
 * Format answer for display
 */
export function formatUniversalAnswer(answer: UniversalAnswer): string {
  return `
═══════════════════════════════════════════════════════════════
${answer.emoji} ${answer.answerLabel.toUpperCase()}
═══════════════════════════════════════════════════════════════

Question: ${answer.questionText}
Arabic: ${answer.questionTextArabic}

Answer: ${answer.answerLabel}
Confidence: ${answer.confidence}%

Explanation:
${answer.explanation}

Arabic:
${answer.explanationArabic}

Supporting Data:
${answer.supportingData.map(d => `  • ${d.metric}: ${d.value} (${d.trend})`).join('\n')}

Recommendation:
${answer.recommendation}

Arabic:
${answer.recommendationArabic}

═══════════════════════════════════════════════════════════════
  `.trim();
}
