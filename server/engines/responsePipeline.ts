/**
 * Response Pipeline
 *
 * Post-analysis interpretation + response quality checks.
 *
 * Pipeline flow:
 *   analysis results + DCFT indices
 *   → humanCognitiveLayer (detect cognitive patterns)
 *   → evidenceGrounding (verify conclusions)
 *   → composeNaturalAnswer (LLM response)
 *   → languageEnforcementLayer (match user language)
 *   → cognitiveConsistencyCheck (check contradictions)
 *   → contextualBinding (cultural/temporal/situational)
 *   → metacognition (self-assessment)
 *   → longTermMemory (archive for future reference)
 */

import { CognitiveConsistencyCheck } from '../cognitiveArchitecture/cognitiveConsistencyCheck';
import { assessAnalysis } from '../cognitiveArchitecture/metacognition';
import { bindContexts, getContextualRecommendations } from '../cognitiveArchitecture/contextualBinding';
import { detectCognitivePattern, type CognitiveInput, type CognitivePattern, type CognitiveOutput } from '../cognitiveArchitecture/humanCognitiveLayer';
import { EvidenceGrounding, type Evidence, type GroundingReport } from '../cognitiveArchitecture/evidenceGrounding';
import { enforceLanguage } from '../engines/languageEnforcementLayer';
import { addToLongTermMemory, retrieveFromLongTermMemory, initLongTermMemory, type LongTermMemoryState } from '../cognitiveArchitecture/longTermMemory';
import { searchAllKnowledge } from '../services/researchService';

export interface ResponseQualityReport {
  consistencyResult: ReturnType<typeof CognitiveConsistencyCheck.checkConsistency>;
  metacognitiveAssessment: ReturnType<typeof assessAnalysis>;
  boundContext: ReturnType<typeof bindContexts>;
  contextualRecommendations: string[];
  cognitivePattern?: CognitivePattern;
  cognitiveOutput?: CognitiveOutput;
  groundingReport?: GroundingReport;
  languageEnforced: boolean;
  knowledgePapers: Array<{ title: string; source: string; url: string; summary: string }>;
  errors: string[];
  qualityScores: {
    score: number;
    relevance: number;
    accuracy: number;
    completeness: number;
    clarity: number;
  };
}

// Long-term memory is stored as a singleton across the process lifetime
let longTermMemory = initLongTermMemory();

export function getLongTermMemory() {
  return longTermMemory;
}

export async function runResponseQualityCheck(
  conversationId: string,
  finalResponse: string,
  effectiveQuestion: string,
  countryName: string,
  headlineTitles: string[],
  cfiValue: number,
  sourceCount: number,
  totalItems: number,
  hasCausalSignal: boolean,
  hasEvidence: boolean,
  emotions?: Record<string, number>,
  dominantEmotion?: string,
  gmiValue?: number,
  hriValue?: number,
): Promise<ResponseQualityReport> {
  const errors: string[] = [];

  // ================================================================
  // 1. Human Cognitive Pattern Detection
  // ================================================================
  let cognitivePattern: CognitivePattern | undefined;
  let cognitiveOutput: CognitiveOutput | undefined;

  if (emotions && dominantEmotion) {
    try {
      const input: CognitiveInput = {
        question: effectiveQuestion,
        interpretation: {},
        decision: { dominantEmotion },
        emotionData: {
          fear: emotions.fear ?? 0,
          hope: emotions.hope ?? 0,
          anger: emotions.anger ?? 0,
          gmi: gmiValue ?? 0
        }
      };
      const result = await detectCognitivePattern(input);
      cognitivePattern = result.primaryPattern;
      cognitiveOutput = result;
    } catch {
      // Non-critical; skip pattern detection on failure
    }
  }

  // ================================================================
  // 2. Evidence Grounding Verification
  // ================================================================
  let groundingReport: GroundingReport | undefined;
  try {
    const evidenceList: Evidence[] = headlineTitles.map((title) => ({
      type: 'news_headline',
      content: title,
      source: 'news',
      timestamp: new Date(),
      relevance: 0.8,
    }));

    const result = EvidenceGrounding.groundResponse(
      finalResponse,
      evidenceList
    );
    groundingReport = result.groundingReport;

    if (groundingReport.groundingScore < 0.5) {
      for (const issue of groundingReport.weaklyGroundedClaims.slice(0, 2)) {
        errors.push(`[Evidence] Weakly grounded: ${issue}`);
      }
    }
  } catch {
    // Non-critical
  }

  // ================================================================
  // 3. Language Enforcement
  // ================================================================
  let languageEnforced = false;
  try {
    const enforced = await enforceLanguage(effectiveQuestion, finalResponse);
    languageEnforced = enforced.translationNeeded;
  } catch {
    // Non-critical; response already in correct language most of the time
  }

  // ================================================================
  // 4. Cognitive Consistency Check
  // ================================================================
  const consistencyResult = CognitiveConsistencyCheck.checkConsistency(
    conversationId,
    finalResponse,
    [],
    effectiveQuestion,
  );

  if (!consistencyResult.isConsistent) {
    for (const v of consistencyResult.violations) {
      errors.push(`[Consistency] ${v.description}`);
    }
  }

  // ================================================================
  // 5. Contextual Binding
  // ================================================================
  const boundContext = bindContexts(
    countryName,
    Date.now(),
    headlineTitles,
    Math.min(1, cfiValue / 100),
  );
  const contextualRecommendations = getContextualRecommendations(boundContext);

  // ================================================================
  // 6. Metacognition (Self-Assessment)
  // ================================================================
  const metacognitiveAssessment = assessAnalysis({
    dataSourcesCount: sourceCount,
    relevantHeadlinesCount: totalItems,
    hasCausalChain: hasCausalSignal,
    hasEvidence,
    acknowledgesUncertainty: consistencyResult.confidenceScore < 0.9,
    alternativesConsidered: true,
  });

  if (metacognitiveAssessment.overallConfidence < 0.5) {
    errors.push(`[Metacognition] Low confidence: ${metacognitiveAssessment.selfCritique}`);
  }

  // ================================================================
  // 7. Long-Term Memory Storage
  // ================================================================
  try {
    longTermMemory = addToLongTermMemory(longTermMemory, {
      domain: countryName,
      content: finalResponse.slice(0, 500),
      emotionalVector: {
        fear: emotions?.fear || 0,
        hope: emotions?.hope || 0,
        anger: emotions?.anger || 0,
        mood: gmiValue || 0,
      },
      timestamp: Date.now(),
      metadata: {
        topic: effectiveQuestion,
        confidence: metacognitiveAssessment.overallConfidence,
        tags: [dominantEmotion || 'neutral']
      },
    });
  } catch {
    // Non-critical
  }

  // ================================================================
  // 8. Knowledge Enrichment (fetch relevant research)
  // ================================================================
  let knowledgePapers: any[] = [];
  try {
    const papers = await searchAllKnowledge(effectiveQuestion, 3);
    knowledgePapers = papers.map((p) => ({
      title: p.title,
      source: p.source,
      url: p.url,
      summary: p.summary.slice(0, 300),
    }));
  } catch {
    // Non-critical
  }

  // ================================================================
  // Return
  // ================================================================
  return {
    consistencyResult,
    metacognitiveAssessment,
    boundContext,
    contextualRecommendations,
    cognitivePattern,
    cognitiveOutput,
    groundingReport,
    languageEnforced,
    knowledgePapers,
    errors,
    qualityScores: {
      score: Math.round(metacognitiveAssessment.overallConfidence * 100),
      relevance: 98,
      accuracy: Math.round(metacognitiveAssessment.overallConfidence * 100),
      completeness: consistencyResult.confidenceScore < 0.7 ? 75 : 90,
      clarity: boundContext.confidence > 0.7 ? 95 : 80,
    },
  };
}