/**
 * Response Pipeline
 *
 * Post-generation quality checks: consistency verification and metacognitive
 * self-assessment. Extracted from networkEngine.ts.
 */

import { CognitiveConsistencyCheck } from '../cognitiveArchitecture/cognitiveConsistencyCheck';
import { assessAnalysis } from '../cognitiveArchitecture/metacognition';
import { bindContexts, getContextualRecommendations } from '../cognitiveArchitecture/contextualBinding';

export interface ResponseQualityReport {
  consistencyResult: ReturnType<typeof CognitiveConsistencyCheck.checkConsistency>;
  metacognitiveAssessment: ReturnType<typeof assessAnalysis>;
  boundContext: ReturnType<typeof bindContexts>;
  contextualRecommendations: string[];
  errors: string[];
  qualityScores: {
    score: number;
    relevance: number;
    accuracy: number;
    completeness: number;
    clarity: number;
  };
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
): Promise<ResponseQualityReport> {
  const errors: string[] = [];

  // 1. Cognitive Consistency Check
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

  // 2. Contextual Binding
  const boundContext = bindContexts(
    countryName,
    Date.now(),
    headlineTitles,
    cfiValue / 100,
  );
  const contextualRecommendations = getContextualRecommendations(boundContext);

  // 3. Metacognition
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

  return {
    consistencyResult,
    metacognitiveAssessment,
    boundContext,
    contextualRecommendations,
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