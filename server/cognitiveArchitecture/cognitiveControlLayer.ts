/**
 * Cognitive Control Layer
 * 
 * Purpose: Decides how to think about a question before answering
 * - Classifies question type (informational, analytical, scenario, opinion)
 * - Determines which cognitive pathway to use
 * - Routes to appropriate processing module
 */

export type QuestionType =
  | 'factual'        // من/متى/كم/أين - Direct factual questions
  | 'analytical'     // لماذا/كيف - Requires analysis
  | 'scenario'       // ماذا لو - Hypothetical scenarios
  | 'opinion'        // ما رأيك/ما توصيتك - Requires judgment
  | 'comparison'     // الفرق بين/مقارنة - Comparison questions
  | 'clarification'; // توضيح/شرح - Explanation requests

export type CognitivePathway =
  | 'knowledge_engine'      // Direct fact retrieval
  | 'analysis_pipeline'     // Full DCFT analysis
  | 'reasoning_only'        // Reasoning without new data
  | 'scenario_simulation'   // Hypothetical scenario modeling
  | 'opinion_synthesis';    // Opinion formation

export interface QuestionClassification {
  type: QuestionType;
  pathway: CognitivePathway;
  confidence: number;
  reasoning: string;
  requiresNewData: boolean;
  requiresAnalysis: boolean;
}

class CognitiveControlLayerClass {
  /**
   * Classify a question and determine the cognitive pathway
   */
  classifyQuestion(question: string, conversationHistory?: Array<{ role: string; content: string }>): QuestionClassification {
    const lowerQuestion = question.toLowerCase().trim();

    // Check for factual questions (who/when/where/how many)
    if (this.isFactualQuestion(lowerQuestion)) {
      return {
        type: 'factual',
        pathway: 'knowledge_engine',
        confidence: 0.9,
        reasoning: 'Question asks for specific facts (who/when/where/how many)',
        requiresNewData: false,
        requiresAnalysis: false,
      };
    }

    // Check for scenario questions (what if)
    if (this.isScenarioQuestion(lowerQuestion)) {
      return {
        type: 'scenario',
        pathway: 'scenario_simulation',
        confidence: 0.85,
        reasoning: 'Question explores hypothetical scenarios',
        requiresNewData: false,
        requiresAnalysis: true,
      };
    }

    // Check for opinion/recommendation questions
    if (this.isOpinionQuestion(lowerQuestion)) {
      return {
        type: 'opinion',
        pathway: 'opinion_synthesis',
        confidence: 0.8,
        reasoning: 'Question asks for opinion or recommendation',
        requiresNewData: false,
        requiresAnalysis: true,
      };
    }

    // Check for comparison questions
    if (this.isComparisonQuestion(lowerQuestion)) {
      return {
        type: 'comparison',
        pathway: 'reasoning_only',
        confidence: 0.85,
        reasoning: 'Question asks for comparison between entities',
        requiresNewData: false,
        requiresAnalysis: true,
      };
    }

    // Check for clarification questions
    if (this.isClarificationQuestion(lowerQuestion, conversationHistory)) {
      return {
        type: 'clarification',
        pathway: 'reasoning_only',
        confidence: 0.9,
        reasoning: 'Question asks for clarification of previous response',
        requiresNewData: false,
        requiresAnalysis: false,
      };
    }

    // Check for analytical questions (why/how)
    if (this.isAnalyticalQuestion(lowerQuestion)) {
      // Determine if we need new data or can reason from existing context
      const hasContext = conversationHistory && conversationHistory.length > 0;
      
      return {
        type: 'analytical',
        pathway: hasContext ? 'reasoning_only' : 'analysis_pipeline',
        confidence: 0.8,
        reasoning: hasContext 
          ? 'Analytical question with existing context - reason from previous analysis'
          : 'Analytical question requires new data analysis',
        requiresNewData: !hasContext,
        requiresAnalysis: true,
      };
    }

    // Default: treat as analytical question requiring full analysis
    return {
      type: 'analytical',
      pathway: 'analysis_pipeline',
      confidence: 0.6,
      reasoning: 'Default classification - requires full analysis',
      requiresNewData: true,
      requiresAnalysis: true,
    };
  }

  /**
   * Check if question is factual (who/when/where/how many)
   */
  private isFactualQuestion(question: string): boolean {
    const factualPatterns = [
      /^(who|من|مين)/i,
      /^(when|متى|وقت)/i,
      /^(where|أين|وين)/i,
      /^(how many|كم عدد|كم)/i,
      /^(how much|كم|بكم)/i,
      /^(what is|ما هو|ما هي|شنو)/i,
    ];

    return factualPatterns.some(pattern => pattern.test(question));
  }

  /**
   * Check if question is scenario-based (what if)
   */
  private isScenarioQuestion(question: string): boolean {
    const scenarioPatterns = [
      /^(what if|ماذا لو|لو|إذا)/i,
      /(suppose|افترض|لنفترض)/i,
      /(imagine|تخيل|تصور)/i,
    ];

    return scenarioPatterns.some(pattern => pattern.test(question));
  }

  /**
   * Check if question asks for opinion/recommendation
   */
  private isOpinionQuestion(question: string): boolean {
    const opinionPatterns = [
      /(what do you think|ما رأيك|رأيك)/i,
      /(recommend|توصي|توصية|اقتراح)/i,
      /(should|يجب|ينبغي|لازم)/i,
      /(advice|نصيحة|مشورة)/i,
      /(suggest|اقترح|اقتراح)/i,
      /(الحل|solution|حل)/i,
    ];

    return opinionPatterns.some(pattern => pattern.test(question));
  }

  /**
   * Check if question asks for comparison
   */
  private isComparisonQuestion(question: string): boolean {
    const comparisonPatterns = [
      /(compare|قارن|مقارنة)/i,
      /(difference|فرق|الفرق)/i,
      /(versus|vs|مقابل)/i,
      /(better|أفضل|أحسن)/i,
      /(worse|أسوأ)/i,
    ];

    return comparisonPatterns.some(pattern => pattern.test(question));
  }

  /**
   * Check if question asks for clarification
   */
  private isClarificationQuestion(question: string, conversationHistory?: Array<{ role: string; content: string }>): boolean {
    if (!conversationHistory || conversationHistory.length === 0) {
      return false;
    }

    const clarificationPatterns = [
      /^(explain|اشرح|وضح)/i,
      /^(what do you mean|ماذا تعني|شنو تقصد)/i,
      /^(clarify|وضح|بين)/i,
      /(more details|تفاصيل أكثر|زيادة تفاصيل)/i,
      /(elaborate|فصّل|تفصيل)/i,
    ];

    return clarificationPatterns.some(pattern => pattern.test(question));
  }

  /**
   * Check if question is analytical (why/how)
   */
  private isAnalyticalQuestion(question: string): boolean {
    const analyticalPatterns = [
      /^(why|لماذا|ليش|لأي)/i,
      /^(how|كيف|كيفية)/i,
      /(cause|سبب|أسباب)/i,
      /(reason|سبب|مبرر)/i,
      /(impact|تأثير|أثر)/i,
      /(effect|تأثير|نتيجة)/i,
    ];

    return analyticalPatterns.some(pattern => pattern.test(question));
  }

  /**
   * Get recommended response structure based on question type
   */
  getResponseStructure(classification: QuestionClassification): {
    format: 'direct' | 'structured' | 'narrative';
    maxLength: 'short' | 'medium' | 'long';
    includeEvidence: boolean;
  } {
    switch (classification.type) {
      case 'factual':
        return {
          format: 'direct',
          maxLength: 'short',
          includeEvidence: true,
        };
      
      case 'clarification':
        return {
          format: 'direct',
          maxLength: 'medium',
          includeEvidence: false,
        };
      
      case 'opinion':
        return {
          format: 'structured',
          maxLength: 'medium',
          includeEvidence: true,
        };
      
      case 'comparison':
        return {
          format: 'structured',
          maxLength: 'medium',
          includeEvidence: true,
        };
      
      case 'scenario':
        return {
          format: 'narrative',
          maxLength: 'long',
          includeEvidence: false,
        };
      
      case 'analytical':
      default:
        return {
          format: 'structured',
          maxLength: 'long',
          includeEvidence: true,
        };
    }
  }
}

export const CognitiveControlLayer = new CognitiveControlLayerClass();
