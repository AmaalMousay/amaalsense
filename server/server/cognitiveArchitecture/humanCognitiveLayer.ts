/**
 * Human Cognitive Layer
 *
 * Detects how a crowd is thinking, not only what it feels. This is a structured
 * cognitive-pattern layer. It produces metadata for the central engine and the
 * natural response composer; it does not write final answers.
 */

export interface InterpretedCauses {
  psychologicalCauses?: string[];
  socialImplications?: string[];
  confidence?: number;
  summary?: string;
  [key: string]: any;
}

export interface DecisionResult {
  dominantEmotion?: string;
  dominantEmotionReason?: string;
  emotionType?: string;
  confidence?: number;
  [key: string]: any;
}

export type CognitivePattern =
  | 'existential_anxiety'
  | 'moral_outrage'
  | 'realistic_hope'
  | 'collective_denial'
  | 'cognitive_confusion'
  | 'cautious_anticipation'
  | 'suppressed_despair'
  | 'defensive_rationalization'
  | 'collective_mobilization'
  | 'resigned_acceptance';

export const COGNITIVE_PATTERNS: Record<CognitivePattern, {
  nameAr: string;
  nameEn: string;
  description: string;
  innerQuestion: string;
  thinkingStyle: string;
  typicalResponses: string[];
  communicationTone: string;
}> = {
  existential_anxiety: { nameAr: 'Existential Anxiety', nameEn: 'Existential Anxiety', description: 'The crowd is focused on survival, safety and future uncertainty.', innerQuestion: 'What happens to us next?', thinkingStyle: 'future-oriented risk scanning', typicalResponses: ['resource hoarding', 'migration planning', 'searching for safety'], communicationTone: 'calm and realistic' },
  moral_outrage: { nameAr: 'Moral Outrage', nameEn: 'Moral Outrage', description: 'The crowd frames the event as unfair or unjust.', innerQuestion: 'Who is responsible?', thinkingStyle: 'accountability and justice framing', typicalResponses: ['protest', 'criticism', 'pressure for accountability'], communicationTone: 'validating but constructive' },
  realistic_hope: { nameAr: 'Realistic Hope', nameEn: 'Realistic Hope', description: 'The crowd sees a possible path to improvement.', innerQuestion: 'What can improve from here?', thinkingStyle: 'solution-oriented optimism', typicalResponses: ['cooperation', 'planning', 'support for reform'], communicationTone: 'encouraging and practical' },
  collective_denial: { nameAr: 'Collective Denial', nameEn: 'Collective Denial', description: 'The crowd minimizes risk as a defensive reaction.', innerQuestion: 'Is it really that bad?', thinkingStyle: 'defensive minimization', typicalResponses: ['ignoring warnings', 'focusing on positives', 'downplaying risk'], communicationTone: 'gentle but evidence-based' },
  cognitive_confusion: { nameAr: 'Cognitive Confusion', nameEn: 'Cognitive Confusion', description: 'The crowd is receiving conflicting signals and lacks clarity.', innerQuestion: 'What is actually happening?', thinkingStyle: 'information-seeking under ambiguity', typicalResponses: ['checking multiple sources', 'delaying decisions', 'asking peers'], communicationTone: 'clear and structured' },
  cautious_anticipation: { nameAr: 'Cautious Anticipation', nameEn: 'Cautious Anticipation', description: 'The crowd is waiting for confirmation before acting.', innerQuestion: 'Should I act now or wait?', thinkingStyle: 'watchful scenario planning', typicalResponses: ['monitoring', 'hedging', 'waiting'], communicationTone: 'scenario-aware' },
  suppressed_despair: { nameAr: 'Suppressed Despair', nameEn: 'Suppressed Despair', description: 'The crowd shows low hope and muted withdrawal.', innerQuestion: 'Is there any point in trying?', thinkingStyle: 'low-agency resignation', typicalResponses: ['withdrawal', 'cynicism', 'apathy'], communicationTone: 'empathetic and grounded' },
  defensive_rationalization: { nameAr: 'Defensive Rationalization', nameEn: 'Defensive Rationalization', description: 'The crowd explains away the event to reduce discomfort.', innerQuestion: 'Maybe there is a reason for this?', thinkingStyle: 'justification and selective framing', typicalResponses: ['excusing actors', 'blaming external factors', 'avoiding confrontation'], communicationTone: 'respectful and clarifying' },
  collective_mobilization: { nameAr: 'Collective Mobilization', nameEn: 'Collective Mobilization', description: 'The crowd is ready for coordinated action.', innerQuestion: 'What can we do together?', thinkingStyle: 'collective action orientation', typicalResponses: ['campaigns', 'organizing', 'public pressure'], communicationTone: 'action-oriented' },
  resigned_acceptance: { nameAr: 'Resigned Acceptance', nameEn: 'Resigned Acceptance', description: 'The crowd adapts to the situation as if change is unlikely.', innerQuestion: 'How do we live with this?', thinkingStyle: 'adaptation under low control', typicalResponses: ['lowering expectations', 'daily coping', 'reduced engagement'], communicationTone: 'practical and realistic' },
};

export interface CognitiveInput {
  question: string;
  interpretation: InterpretedCauses;
  decision: DecisionResult;
  emotionData: { fear: number; hope: number; anger: number; gmi: number };
}

export interface CognitiveOutput {
  primaryPattern: CognitivePattern;
  secondaryPattern?: CognitivePattern;
  confidence: number;
  innerQuestion: string;
  responseFraming: { tone: string; approach: string; keyMessage: string };
  humanReasoning: string;
}

function scorePattern(input: CognitiveInput): Record<CognitivePattern, number> {
  const { fear = 0, hope = 0, anger = 0, gmi = 0 } = input.emotionData;
  const text = `${input.question} ${input.interpretation.summary || ''} ${(input.interpretation.psychologicalCauses || []).join(' ')}`.toLowerCase();
  return {
    existential_anxiety: fear * 0.7 + (hope < 35 ? 25 : 0) + (/future|survival|safe|risk/.test(text) ? 20 : 0),
    moral_outrage: anger * 0.8 + (/justice|unfair|corruption|responsible/.test(text) ? 25 : 0),
    realistic_hope: hope * 0.8 + (gmi > 20 ? 15 : 0) + (/solution|recovery|improve|peace/.test(text) ? 20 : 0),
    collective_denial: hope > 55 && fear > 45 ? 45 : 10,
    cognitive_confusion: (/unclear|confusing|conflict|mixed|why/.test(text) ? 45 : 10) + Math.abs(fear - hope) < 10 ? 15 : 0,
    cautious_anticipation: fear > 40 && hope > 40 ? 55 : 20,
    suppressed_despair: hope < 30 && gmi < -20 ? 70 : 10,
    defensive_rationalization: /maybe|because|excuse|justify/.test(text) ? 45 : 10,
    collective_mobilization: anger > 55 && hope > 35 ? 65 : 10,
    resigned_acceptance: hope < 35 && fear < 50 && gmi < 0 ? 50 : 10,
  };
}

export async function detectCognitivePattern(input: CognitiveInput): Promise<CognitiveOutput> {
  const scores = scorePattern(input);
  const ranked = (Object.entries(scores) as Array<[CognitivePattern, number]>).sort((a, b) => b[1] - a[1]);
  const primaryPattern = ranked[0][0];
  const secondaryPattern = ranked[1] && ranked[1][1] > ranked[0][1] * 0.75 ? ranked[1][0] : undefined;
  const info = COGNITIVE_PATTERNS[primaryPattern];
  const confidence = Math.min(100, Math.max(45, Math.round(ranked[0][1])));
  return {
    primaryPattern,
    secondaryPattern,
    confidence,
    innerQuestion: info.innerQuestion,
    responseFraming: { tone: info.communicationTone, approach: info.thinkingStyle, keyMessage: info.description },
    humanReasoning: `Pattern ${info.nameEn} selected from fear=${input.emotionData.fear}, hope=${input.emotionData.hope}, anger=${input.emotionData.anger}, gmi=${input.emotionData.gmi}.`,
  };
}

export function getPatternInfo(pattern: CognitivePattern) {
  return COGNITIVE_PATTERNS[pattern];
}

export function formatCognitiveInsight(output: CognitiveOutput): string {
  const info = COGNITIVE_PATTERNS[output.primaryPattern];
  return `${info.nameEn}: ${output.humanReasoning}`;
}
