/**
 * AmalSense Cognitive Architecture Registry
 *
 * This file intentionally keeps the 24-layer map lightweight. Runtime response
 * composition is handled by server/engines/responseBuilder.ts via
 * composeNaturalAnswer(), not by fixed response templates.
 */

export * from './layer2_attention';
export * from './layer3_encoding';
export * from './layer5_workingMemory';
export * from './layer6_knowledgeBase';
export * from './contextualBinding';
export * from './causalInference';
export * from './cognitiveAnswerGate';
export * from './cognitiveConsistencyCheck';
export * from './dialogicalConsciousness';
export * from './evidenceGrounding';
export * from './humanCognitiveLayer';
export * from './metacognition';
export * from './metaLearning';
export * from './unifiedPipeline';

export interface AmalSenseCognitiveLayerDefinition {
  layer: number;
  name: string;
  currentModule: string;
  responsibility: string;
  status: 'implemented' | 'partial' | 'consolidation_needed';
}

export const AMALSENSE_24_LAYER_MAP: AmalSenseCognitiveLayerDefinition[] = [
  { layer: 1, name: 'Perception Engine', currentModule: 'server/dcft/perceptionLayer.ts', responsibility: 'Input sensing and initial affective-vector extraction from raw text/signals.', status: 'implemented' },
  { layer: 2, name: 'Attention Filter', currentModule: 'server/cognitiveArchitecture/layer2_attention.ts', responsibility: 'Noise filtering and prioritization of important signals.', status: 'implemented' },
  { layer: 3, name: 'Language Encoding', currentModule: 'server/cognitiveArchitecture/layer3_encoding.ts', responsibility: 'Language/dialect detection, entity extraction, and keyword encoding.', status: 'implemented' },
  { layer: 4, name: 'Question Understanding', currentModule: 'server/cognitiveEngine/questionUnderstanding.ts', responsibility: 'Deep intent, hidden need, and emotional request understanding.', status: 'implemented' },
  { layer: 5, name: 'Session Memory', currentModule: 'server/cognitiveArchitecture/layer5_workingMemory.ts', responsibility: 'Short-term working memory for the active conversation/session.', status: 'implemented' },
  { layer: 6, name: 'Knowledge Engine', currentModule: 'server/cognitiveArchitecture/layer6_knowledgeBase.ts', responsibility: 'Live knowledge retrieval, expert rules, and database/RAG grounding.', status: 'implemented' },
  { layer: 7, name: 'Contextual Binding', currentModule: 'server/cognitiveArchitecture/contextualBinding.ts', responsibility: 'Geographic, cultural, temporal, and situational binding.', status: 'implemented' },
  { layer: 8, name: 'Temporal Analysis', currentModule: 'server/engines/temporalAnalysisEngine.ts', responsibility: 'Historical comparison, trend detection, and momentum estimation.', status: 'implemented' },
  { layer: 9, name: 'Causal Inference', currentModule: 'server/cognitiveArchitecture/causalInference.ts', responsibility: 'Cause-effect chains and explanatory reasoning.', status: 'implemented' },
  { layer: 10, name: 'Meta Decision Engine', currentModule: 'server/engines/metaDecisionEngine.ts', responsibility: 'Risk evaluation and digital-response decision signals.', status: 'implemented' },
  { layer: 11, name: 'Cognitive Answer Gate', currentModule: 'server/cognitiveArchitecture/cognitiveAnswerGate.ts', responsibility: 'Anti-hallucination gate and honest uncertainty handling.', status: 'implemented' },
  { layer: 12, name: 'Consistency Check', currentModule: 'server/cognitiveArchitecture/cognitiveConsistencyCheck.ts', responsibility: 'Prevent contradictions inside the same conversation/analysis.', status: 'implemented' },
  { layer: 13, name: 'Dialogical Consciousness', currentModule: 'server/cognitiveArchitecture/dialogicalConsciousness.ts', responsibility: 'Continuous human-like dialogue state management.', status: 'implemented' },
  { layer: 14, name: 'Evidence Grounding', currentModule: 'server/cognitiveArchitecture/evidenceGrounding.ts', responsibility: 'Ground conclusions in real headlines/sources/evidence.', status: 'implemented' },
  { layer: 15, name: 'Language Enforcement', currentModule: 'server/engines/languageEnforcementLayer.ts', responsibility: 'Force response language to match the user language.', status: 'implemented' },
  { layer: 16, name: 'Personal Voice', currentModule: 'server/cognitiveEngine/personalVoice.ts', responsibility: 'Adapt tone and voice to user preference and context.', status: 'implemented' },
  { layer: 17, name: 'Human Cognitive Layer', currentModule: 'server/cognitiveArchitecture/humanCognitiveLayer.ts', responsibility: 'Detect crowd cognition patterns such as fear, denial, and confusion.', status: 'implemented' },
  { layer: 18, name: 'Metacognition Engine', currentModule: 'server/cognitiveArchitecture/metacognition.ts', responsibility: 'Self-evaluation, confidence calibration, and weakness detection.', status: 'implemented' },
  { layer: 19, name: 'Learning Store', currentModule: 'server/engines/learningStore.ts', responsibility: 'Accumulative analysis memory and self-learning records.', status: 'implemented' },
  { layer: 20, name: 'Vector Store', currentModule: 'server/knowledge/vectorStore.ts', responsibility: 'Vector storage and similarity retrieval.', status: 'implemented' },
  { layer: 21, name: 'RAG System', currentModule: 'server/knowledge/ragSystem.ts', responsibility: 'Retrieval-augmented knowledge context for answers and agents.', status: 'implemented' },
  { layer: 22, name: 'Autonomous Researcher', currentModule: 'server/knowledge/autonomousResearcher.ts', responsibility: 'Active knowledge discovery and gap-filling research.', status: 'implemented' },
  { layer: 23, name: 'Multi-Agent Synchronization', currentModule: 'server/agents/multiAgentSystem.ts', responsibility: 'Agent coordination, monitoring, validation, and action loops.', status: 'implemented' },
  { layer: 24, name: 'Meta Learning', currentModule: 'server/cognitiveArchitecture/metaLearning.ts', responsibility: 'Higher-order rule adaptation and weekly/self-learning reports.', status: 'implemented' },
];

export function getCognitiveLayerDefinition(layer: number): AmalSenseCognitiveLayerDefinition | undefined {
  return AMALSENSE_24_LAYER_MAP.find(definition => definition.layer === layer);
}
