import { t } from "../_core/i18n";
/**
 * Human Cognitive Layer
 * 
 * This layer answers: "How does a human THINK about this situation?"
 * Not just "What do they feel?" but "What cognitive pattern are they in?"
 * 
 * The difference:
 * - Fluent Response Builder = How to SAY it (linguistic output)
 * - Human Cognitive Layer = How to THINK about it (cognitive pattern)
 * 
 * Key insight:
 * "I want AmalSense to THINK like a human before it SPEAKS"
 * This is the difference between AI Product and Artificial Mind.
 * 
 * Architecture position:
 * Reality Data → Emotion Engine → Decision Engine → Human Cognitive Layer → Response
 */

import { invokeLLM } from '../_core/llm';


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

/**
 * Human Cognitive Patterns
 * These are not just emotions - they are WAYS OF THINKING
 */
export type CognitivePattern = 
  | 'existential_anxiety'    //   - "  "
  | 'moral_outrage'          //   - " !"
  | 'realistic_hope'         //   - "  "
  | 'collective_denial'      //   - "  "
  | 'cognitive_confusion'    //   - "   "
  | 'cautious_anticipation'  //   - " "
  | 'suppressed_despair'     //   - " "
  | 'defensive_rationalization' //   - "  "
  | 'collective_mobilization'   //   - "  "
  | 'resigned_acceptance';      //   - " "

/**
 * Detailed description of each cognitive pattern
 */
export const COGNITIVE_PATTERNS: Record<CognitivePattern, {
  nameAr: string;
  nameEn: string;
  description: string;
  innerQuestion: string;      //     
  thinkingStyle: string;      //  
  typicalResponses: string[]; //   
  communicationTone: string;  //   
}> = {
  existential_anxiety: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.81.5a26bd5e', 'ar'),
    nameEn: 'Existential Anxiety',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.80.04691190', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.79.cc091c3c', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.78.86bec50a', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.77.15adc9e1', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.76.4575b90a', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.75.e0cb6af6', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.74.1dab4433', 'ar')
  },
  moral_outrage: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.73.977194bb', 'ar'),
    nameEn: 'Moral Outrage',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.72.9123150d', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.71.80387d08', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.70.a0f87f21', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.69.61c1f92c', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.68.9667905a', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.67.7030f66e', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.66.ad7a31ea', 'ar')
  },
  realistic_hope: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.65.fb1691ed', 'ar'),
    nameEn: 'Realistic Hope',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.64.e8a23990', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.63.4b205b71', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.62.3e1f631d', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.61.d3a1e160', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.60.6518d363', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.59.a675161d', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.58.a07cdfdd', 'ar')
  },
  collective_denial: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.57.467ca250', 'ar'),
    nameEn: 'Collective Denial',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.56.0b930098', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.55.031d8253', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.54.b2e98e64', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.53.7ba22066', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.52.e94d7dcb', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.51.a901ff46', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.50.f5d12f02', 'ar')
  },
  cognitive_confusion: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.49.df7b1c16', 'ar'),
    nameEn: 'Cognitive Confusion',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.48.8a426b67', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.47.89d0f6c3', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.46.df372b41', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.45.fd939c48', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.44.91bdd18c', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.43.8241e66a', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.42.e2f8014c', 'ar')
  },
  cautious_anticipation: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.41.a154c730', 'ar'),
    nameEn: 'Cautious Anticipation',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.40.edd95337', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.39.6570d753', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.38.9df869ee', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.37.799f3009', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.36.06241f9b', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.35.bbdc892a', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.34.a49db155', 'ar')
  },
  suppressed_despair: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.33.30fd1949', 'ar'),
    nameEn: 'Suppressed Despair',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.32.30cd212f', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.31.432a7c78', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.30.039b714c', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.29.eab345b6', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.28.13e1777f', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.27.7bbe55e5', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.26.5012b4d6', 'ar')
  },
  defensive_rationalization: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.25.45feca28', 'ar'),
    nameEn: 'Defensive Rationalization',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.24.351b345a', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.23.8908cb05', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.22.a0b22aa9', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.21.15d870ee', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.20.b99a4811', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.19.38062e9a', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.18.51e79037', 'ar')
  },
  collective_mobilization: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.17.12e7f2c2', 'ar'),
    nameEn: 'Collective Mobilization',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.16.9b1a8f82', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.15.1daf7a9e', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.14.d39be039', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.13.565f39e7', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.12.025ff42d', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.11.7ae7c0aa', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.10.af026375', 'ar')
  },
  resigned_acceptance: {
    nameAr: t('auto.cognitiveArchitecture_humanCognitiveLayer.9.421139c0', 'ar'),
    nameEn: 'Resigned Acceptance',
    description: t('auto.cognitiveArchitecture_humanCognitiveLayer.8.5de71123', 'ar'),
    innerQuestion: t('auto.cognitiveArchitecture_humanCognitiveLayer.7.2daf70e6', 'ar'),
    thinkingStyle: t('auto.cognitiveArchitecture_humanCognitiveLayer.6.32a0dc02', 'ar'),
    typicalResponses: [t('auto.cognitiveArchitecture_humanCognitiveLayer.5.4ea60444', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.4.ca3c85eb', 'ar'), t('auto.cognitiveArchitecture_humanCognitiveLayer.3.edf47a08', 'ar')],
    communicationTone: t('auto.cognitiveArchitecture_humanCognitiveLayer.2.f89282bb', 'ar')
  }
};

/**
 * Input for cognitive pattern detection
 */
export interface CognitiveInput {
  question: string;
  interpretation: InterpretedCauses;
  decision: DecisionResult;
  emotionData: {
    fear: number;
    hope: number;
    anger: number;
    gmi: number;
  };
}

/**
 * Output of cognitive pattern detection
 */
export interface CognitiveOutput {
  // Primary cognitive pattern
  primaryPattern: CognitivePattern;
  
  // Secondary pattern (if mixed)
  secondaryPattern?: CognitivePattern;
  
  // Confidence in detection
  confidence: number;
  
  // The inner question people are asking
  innerQuestion: string;
  
  // How to frame the response
  responseFraming: {
    tone: string;
    approach: string;
    keyMessage: string;
  };
  
  // Human reasoning explanation
  humanReasoning: string;
}

/**
 * Detect the cognitive pattern from the data
 * This is the core function - it determines HOW people are THINKING
 */
export async function detectCognitivePattern(input: CognitiveInput): Promise<CognitiveOutput> {
  console.log('[HumanCognitiveLayer] Detecting cognitive pattern...');
  
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: t('auto.cognitiveArchitecture_humanCognitiveLayer.1.c3e33852', 'ar')
        },
        {
          role: 'user',
          content: `: ${input.question}

 :
- : ${input.emotionData.fear}%
- : ${input.emotionData.hope}%
- : ${input.emotionData.anger}%
-  : ${input.emotionData.gmi}%

:
-  : ${input.decision.dominantEmotion}
- : ${input.decision.dominantEmotionReason}
- : ${input.decision.emotionType}
- : ${input.decision.assessment}

 :
${(input.interpretation.psychologicalCauses || []).join('\n')}

:
1.   
2.     
3.     `
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'cognitive_pattern',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              primaryPattern: { 
                type: 'string',
                enum: ['existential_anxiety', 'moral_outrage', 'realistic_hope', 'collective_denial', 'cognitive_confusion', 'cautious_anticipation', 'suppressed_despair', 'defensive_rationalization', 'collective_mobilization', 'resigned_acceptance']
              },
              secondaryPattern: { 
                type: 'string',
                enum: ['existential_anxiety', 'moral_outrage', 'realistic_hope', 'collective_denial', 'cognitive_confusion', 'cautious_anticipation', 'suppressed_despair', 'defensive_rationalization', 'collective_mobilization', 'resigned_acceptance', 'none']
              },
              confidence: { type: 'number' },
              innerQuestion: { type: 'string' },
              responseTone: { type: 'string' },
              responseApproach: { type: 'string' },
              keyMessage: { type: 'string' },
              humanReasoning: { type: 'string' }
            },
            required: ['primaryPattern', 'secondaryPattern', 'confidence', 'innerQuestion', 'responseTone', 'responseApproach', 'keyMessage', 'humanReasoning'],
            additionalProperties: false
          }
        }
      }
    });
    
    const content = response.choices[0].message.content;
    const result = JSON.parse(typeof content === 'string' ? content : '{}');
    
    const primaryPattern = result.primaryPattern as CognitivePattern;
    const patternInfo = COGNITIVE_PATTERNS[primaryPattern];
    
    console.log('[HumanCognitiveLayer] Pattern detected:', {
      primary: primaryPattern,
      secondary: result.secondaryPattern,
      confidence: result.confidence
    });
    
    return {
      primaryPattern,
      secondaryPattern: result.secondaryPattern !== 'none' ? result.secondaryPattern as CognitivePattern : undefined,
      confidence: result.confidence || 0.7,
      innerQuestion: result.innerQuestion || patternInfo?.innerQuestion || '',
      responseFraming: {
        tone: result.responseTone || patternInfo?.communicationTone || '',
        approach: result.responseApproach || '',
        keyMessage: result.keyMessage || ''
      },
      humanReasoning: result.humanReasoning || ''
    };
    
  } catch (error) {
    console.error('[HumanCognitiveLayer] Detection failed:', error);
    
    // Fallback based on emotion data
    return detectPatternFromEmotions(input.emotionData);
  }
}

/**
 * Fallback: Detect pattern from emotion data alone
 */
function detectPatternFromEmotions(emotionData: { fear: number; hope: number; anger: number; gmi: number }): CognitiveOutput {
  let pattern: CognitivePattern = 'cognitive_confusion';
  
  // High fear + low hope = existential anxiety
  if (emotionData.fear > 60 && emotionData.hope < 40) {
    pattern = 'existential_anxiety';
  }
  // High anger = moral outrage
  else if (emotionData.anger > 60) {
    pattern = 'moral_outrage';
  }
  // High hope = realistic hope
  else if (emotionData.hope > 60) {
    pattern = 'realistic_hope';
  }
  // Low fear despite negative GMI = denial
  else if (emotionData.fear < 30 && emotionData.gmi < -20) {
    pattern = 'collective_denial';
  }
  // Very low hope = suppressed despair
  else if (emotionData.hope < 20 && emotionData.gmi < -30) {
    pattern = 'suppressed_despair';
  }
  // Balanced = cautious anticipation
  else if (Math.abs(emotionData.fear - emotionData.hope) < 20) {
    pattern = 'cautious_anticipation';
  }
  
  const patternInfo = COGNITIVE_PATTERNS[pattern];
  
  return {
    primaryPattern: pattern,
    confidence: 0.5,
    innerQuestion: patternInfo.innerQuestion,
    responseFraming: {
      tone: patternInfo.communicationTone,
      approach: patternInfo.thinkingStyle,
      keyMessage: patternInfo.description
    },
    humanReasoning: `         ${patternInfo.nameAr}`
  };
}

/**
 * Get the pattern info for display
 */
export function getPatternInfo(pattern: CognitivePattern) {
  return COGNITIVE_PATTERNS[pattern];
}

/**
 * Format cognitive insight for the response
 */
export function formatCognitiveInsight(output: CognitiveOutput): string {
  const patternInfo = COGNITIVE_PATTERNS[output.primaryPattern];
  
  let insight = `**  :** ${patternInfo.nameAr}\n\n`;
  insight += `**   :** "${output.innerQuestion}"\n\n`;
  insight += `** :** ${output.humanReasoning}`;
  
  if (output.secondaryPattern) {
    const secondaryInfo = COGNITIVE_PATTERNS[output.secondaryPattern];
    insight += `\n\n** :** ${secondaryInfo.nameAr}`;
  }
  
  return insight;
}
