/**
 * Intelligent Narrator
 * 
 * This is the final layer - it transforms knowledge into human language.
 * It doesn't just report facts, it EXPLAINS like a wise consultant.
 * 
 * Philosophy:
 * - Speak like a human, not a robot
 * - Explain WHY, not just WHAT
 * - Adapt to the user's emotional state
 * - Make complex things simple
 * - Every response should feel like "a mind is talking"
 */

import { type DeepQuestion } from './questionUnderstanding';
import { type KnowledgePacket } from './contextBuilder';

// The final response
export interface NarratedResponse {
  text: string;           // The full response text
  sections: {
    opening: string;      // The hook/summary
    body: string;         // Main content
    decision: string;     // Decision signal
    closing: string;      // Follow-up question
  };
  metadata: {
    style: string;
    wordCount: number;
    readingTime: string;
  };
}

/**
 * Narrate the response - transform knowledge into human language
 */
export function narrateResponse(
  question: DeepQuestion,
  knowledge: KnowledgePacket
): NarratedResponse {
  const { responseStrategy } = question;
  const { core, currentState, causes, implications, decision, scenarios, comparison, followUp } = knowledge;
  
  // Build each section
  const opening = buildOpening(core, currentState, responseStrategy.style);
  const body = buildBody(core, causes, implications, decision, scenarios, comparison, responseStrategy);
  const decisionSection = buildDecisionSection(decision, responseStrategy.style);
  const closing = buildClosing(followUp, core.topic);
  
  // Combine into full response
  const text = [opening, body, decisionSection, closing].filter(Boolean).join('\n\n');
  
  return {
    text,
    sections: {
      opening,
      body,
      decision: decisionSection,
      closing
    },
    metadata: {
      style: responseStrategy.style,
      wordCount: text.split(/\s+/).length,
      readingTime: `${Math.ceil(text.split(/\s+/).length / 200)} دقيقة`
    }
  };
}

/**
 * Build the opening - hook the reader immediately
 */
function buildOpening(
  core: KnowledgePacket['core'],
  currentState: KnowledgePacket['currentState'],
  style: string
): string {
  const { topic, realIntent, emotionalNeed } = core;
  
  // Different openings based on emotional need
  let opening: string;
  
  switch (emotionalNeed) {
    case 'anxious':
      opening = `دعني أوضح لك الصورة الكاملة حول ${topic}. ${currentState.summary}، لكن هذا لا يعني بالضرورة ما قد تتوقعه.`;
      break;
      
    case 'urgent':
      opening = `باختصار: ${currentState.summary}. ${currentState.trend}.`;
      break;
      
    case 'curious':
      opening = `سؤال مهم! ${currentState.summary}. دعني أشرح لك ما يحدث بالضبط.`;
      break;
      
    case 'decisive':
      opening = `إذا كنت تفكر في اتخاذ قرار بشأن ${topic}، إليك ما تحتاج معرفته: ${currentState.summary}.`;
      break;
      
    case 'confused':
      opening = `دعني أبسط لك الموضوع. ${currentState.summary}. سأشرح لك خطوة بخطوة.`;
      break;
      
    default:
      opening = `${currentState.summary}. ${currentState.moodDescription}.`;
  }
  
  return `**الخلاصة:**\n${opening}`;
}

/**
 * Build the body - the main explanation
 */
function buildBody(
  core: KnowledgePacket['core'],
  causes: KnowledgePacket['causes'],
  implications: KnowledgePacket['implications'],
  decision: KnowledgePacket['decision'],
  scenarios: KnowledgePacket['scenarios'] | undefined,
  comparison: KnowledgePacket['comparison'] | undefined,
  strategy: DeepQuestion['responseStrategy']
): string {
  const parts: string[] = [];
  
  // Add causes section - the WHY
  if (causes.primary.length > 0) {
    parts.push(buildCausesNarrative(causes, core.topic));
  }
  
  // Add implications section - what this means
  if (strategy.depth !== 'brief') {
    parts.push(buildImplicationsNarrative(implications, core.realIntent));
  }
  
  // Add scenarios if applicable
  if (scenarios && strategy.includeScenarios) {
    parts.push(buildScenariosNarrative(scenarios));
  }
  
  // Add comparison if applicable
  if (comparison && comparison.items.length > 0) {
    parts.push(buildComparisonNarrative(comparison));
  }
  
  // Add risks and opportunities
  if (strategy.includeRecommendation) {
    parts.push(buildRisksOpportunitiesNarrative(decision));
  }
  
  return parts.join('\n\n');
}

/**
 * Build causes narrative - explain WHY this is happening
 */
function buildCausesNarrative(
  causes: KnowledgePacket['causes'],
  topic: string
): string {
  const lines: string[] = ['**لماذا هذا الوضع؟**'];
  
  lines.push(`هذا الوضع في ${topic} ليس عشوائياً، بل نتيجة عوامل محددة:`);
  lines.push('');
  
  // Primary causes with explanations
  for (let i = 0; i < Math.min(causes.primary.length, 3); i++) {
    const cause = causes.primary[i];
    lines.push(`${i + 1}. **${cause.cause}**`);
    lines.push(`   ${cause.explanation}`);
    if (cause.effect !== 'تأثير على القرارات والتوقعات') {
      lines.push(`   النتيجة: ${cause.effect}`);
    }
    lines.push('');
  }
  
  // Add secondary causes briefly
  if (causes.secondary.length > 0) {
    const secondaryList = causes.secondary.slice(0, 2).map(c => c.cause).join('، ');
    lines.push(`بالإضافة إلى عوامل ثانوية مثل: ${secondaryList}.`);
  }
  
  return lines.join('\n');
}

/**
 * Build implications narrative - what does this mean?
 */
function buildImplicationsNarrative(
  implications: KnowledgePacket['implications'],
  realIntent: string
): string {
  const lines: string[] = ['**ماذا يعني هذا؟**'];
  
  // Short term
  lines.push('على المدى القصير:');
  for (const imp of implications.shortTerm) {
    lines.push(`• ${imp}`);
  }
  
  // For user specifically
  lines.push('');
  lines.push(`**بالنسبة لك:** ${implications.forUser}`);
  
  return lines.join('\n');
}

/**
 * Build scenarios narrative
 */
function buildScenariosNarrative(
  scenarios: NonNullable<KnowledgePacket['scenarios']>
): string {
  const lines: string[] = ['**السيناريوهات المحتملة:**'];
  
  lines.push('');
  lines.push(`📈 **${scenarios.best.name}** (احتمالية ${Math.round(scenarios.best.probability * 100)}%)`);
  lines.push(`   ${scenarios.best.description}`);
  lines.push(`   المحفزات: ${scenarios.best.triggers.join('، ')}`);
  
  lines.push('');
  lines.push(`📉 **${scenarios.worst.name}** (احتمالية ${Math.round(scenarios.worst.probability * 100)}%)`);
  lines.push(`   ${scenarios.worst.description}`);
  lines.push(`   المحفزات: ${scenarios.worst.triggers.join('، ')}`);
  
  lines.push('');
  lines.push(`📊 **${scenarios.likely.name}** (احتمالية ${Math.round(scenarios.likely.probability * 100)}%)`);
  lines.push(`   ${scenarios.likely.description}`);
  
  return lines.join('\n');
}

/**
 * Build comparison narrative
 */
function buildComparisonNarrative(
  comparison: NonNullable<KnowledgePacket['comparison']>
): string {
  const lines: string[] = ['**المقارنة:**'];
  
  lines.push(`المقارنة بين: ${comparison.items.join(' و ')}`);
  lines.push('');
  lines.push(comparison.reasoning);
  
  if (comparison.winner) {
    lines.push('');
    lines.push(`**الخلاصة:** ${comparison.winner}`);
  }
  
  return lines.join('\n');
}

/**
 * Build risks and opportunities narrative
 */
function buildRisksOpportunitiesNarrative(
  decision: KnowledgePacket['decision']
): string {
  const lines: string[] = [];
  
  if (decision.risks.length > 0) {
    lines.push('**المخاطر المحتملة:**');
    for (const risk of decision.risks.slice(0, 3)) {
      lines.push(`• ${risk}`);
    }
    lines.push('');
  }
  
  if (decision.opportunities.length > 0) {
    lines.push('**الفرص المتاحة:**');
    for (const opp of decision.opportunities.slice(0, 3)) {
      lines.push(`• ${opp}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Build decision section - clear signal and recommendation
 */
function buildDecisionSection(
  decision: KnowledgePacket['decision'],
  style: string
): string {
  const signalEmoji = {
    positive: '✅',
    negative: '⚠️',
    neutral: '📊',
    caution: '🔶'
  };
  
  const lines: string[] = [];
  
  lines.push(`**إشارة القرار:** ${signalEmoji[decision.signal]} ${decision.recommendation}`);
  lines.push('');
  lines.push(`**السبب:** ${decision.reasoning}`);
  
  return lines.join('\n');
}

/**
 * Build closing - smart follow-up question
 */
function buildClosing(
  followUp: KnowledgePacket['followUp'],
  topic: string
): string {
  // Pick the most relevant follow-up question
  const question = followUp.suggestedQuestions[0] || `هل تريد التعمق أكثر في ${topic}؟`;
  
  // Add implicit answers if any
  let closing = '';
  
  if (followUp.implicitAnswers.length > 0) {
    closing += '**ملاحظة مهمة:** ';
    closing += followUp.implicitAnswers[0];
    closing += '\n\n';
  }
  
  closing += question;
  
  return closing;
}

/**
 * Adapt language to user expertise level
 */
export function adaptToExpertise(
  text: string,
  expertise: 'beginner' | 'intermediate' | 'expert'
): string {
  if (expertise === 'beginner') {
    // Simplify technical terms
    return text
      .replace(/مؤشر الخوف الجماعي/g, 'مستوى القلق العام')
      .replace(/مؤشر الأمل والمرونة/g, 'مستوى التفاؤل')
      .replace(/GMI/g, 'المزاج العام')
      .replace(/CFI/g, 'مستوى القلق')
      .replace(/HRI/g, 'مستوى الأمل');
  }
  
  return text;
}

/**
 * Add emotional support based on user's emotional need
 */
export function addEmotionalSupport(
  text: string,
  emotionalNeed: string
): string {
  if (emotionalNeed === 'anxious') {
    return text + '\n\n**تذكر:** القلق طبيعي في هذه الأوقات، لكن القرارات المدروسة أفضل من القرارات المتسرعة.';
  }
  
  if (emotionalNeed === 'hopeful') {
    return text + '\n\n**تذكر:** التفاؤل جيد، لكن الحذر المعقول يحمي من المفاجآت.';
  }
  
  return text;
}

export {
  buildOpening,
  buildBody,
  buildDecisionSection,
  buildClosing
};
