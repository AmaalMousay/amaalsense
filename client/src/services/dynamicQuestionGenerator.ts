export interface AnalysisResult {
  intelligentResponse?: string;
  emotionData?: {
    dominantEmotion?: string;
    emotions: Record<string, number>;
  };
  pipelineMetadata?: {
    confidence?: number;
    [key: string]: any;
  };
}

export interface DynamicQuestion {
  text: string;
  category: 'impact' | 'future' | 'solutions' | 'risks' | 'recommendations' | 'scenarios' | 'clarification';
  relevance: number; // 0-100
  reasoning: string;
}

export class DynamicQuestionGenerator {
  /**
   * Generate dynamic follow-up questions based on analysis results
   */
  static generateQuestions(analysis: AnalysisResult): DynamicQuestion[] {
    const questions: DynamicQuestion[] = [];

    // Extract key entities and themes from the response
    const { intelligentResponse, emotionData, pipelineMetadata } = analysis;

    // 1. Impact-based questions
    if (emotionData?.dominantEmotion === 'fear' || (emotionData?.emotions.fear ?? 0) > 60) {
      questions.push({
        text: `       `,
        category: 'impact',
        relevance: 95,
        reasoning: ' Fear     Impact ',
      });
    }

    if ((emotionData?.emotions.hope ?? 0) > 50) {
      questions.push({
        text: `         `,
        category: 'impact',
        relevance: 85,
        reasoning: '       ',
      });
    }

    // 2. Future-oriented questions
    if (intelligentResponse && intelligentResponse.length > 500) {
      questions.push({
        text: `     `,
        category: 'future',
        relevance: 90,
        reasoning: 'Analysis     ',
      });

      questions.push({
        text: `       `,
        category: 'scenarios',
        relevance: 88,
        reasoning: '        ',
      });
    }

    // 3. Solutions-oriented questions
    if ((emotionData?.emotions.anger ?? 0) > 40 || (emotionData?.emotions.fear ?? 0) > 70) {
      questions.push({
        text: `        `,
        category: 'solutions',
        relevance: 92,
        reasoning: '   Emotions    ',
      });
    }

    // 4. Risk assessment questions
    if ((pipelineMetadata?.confidence ?? 100) < 70) {
      questions.push({
        text: `         `,
        category: 'risks',
        relevance: 80,
        reasoning: ' Confidence      ',
      });
    }

    // 5. Recommendation questions
    if ((emotionData?.emotions.curiosity ?? 0) > 50) {
      questions.push({
        text: `         `,
        category: 'recommendations',
        relevance: 85,
        reasoning: '       ',
      });
    }

    // 6. Clarification questions based on analysis gaps
    if (!intelligentResponse || intelligentResponse.length < 300) {
      questions.push({
        text: `       `,
        category: 'clarification',
        relevance: 75,
        reasoning: 'Analysis     ',
      });
    }

    // 7. Context-specific questions
    const lowerResponse = intelligentResponse?.toLowerCase() || '';
    
    if (lowerResponse.includes('') || lowerResponse.includes('')) {
      questions.push({
        text: `       `,
        category: 'solutions',
        relevance: 88,
        reasoning: '    ',
      });
    }

    if (lowerResponse.includes('') || lowerResponse.includes('')) {
      questions.push({
        text: `       `,
        category: 'impact',
        relevance: 86,
        reasoning: '     ',
      });
    }

    if (lowerResponse.includes('') || lowerResponse.includes('')) {
      questions.push({
        text: `       `,
        category: 'impact',
        relevance: 84,
        reasoning: '    ',
      });
    }

    // Sort by relevance and return top 5-6 questions
    return questions
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 6);
  }

  /**
   * Generate a single contextual question based on emotion and topic
   */
  static generateContextualQuestion(
    emotion: string,
    topic: string,
    previousQuestion?: string
  ): DynamicQuestion {
    const emotionMap: Record<string, { question: string; category: DynamicQuestion['category'] }> = {
      fear: {
        question: `        `,
        category: 'solutions',
      },
      hope: {
        question: `         `,
        category: 'recommendations',
      },
      anger: {
        question: `        `,
        category: 'solutions',
      },
      sadness: {
        question: `        `,
        category: 'solutions',
      },
      joy: {
        question: `       `,
        category: 'recommendations',
      },
      curiosity: {
        question: `       `,
        category: 'clarification',
      },
    };

    const emotionQuestion = emotionMap[emotion.toLowerCase()] || {
      question: `    `,
      category: 'recommendations',
    };

    return {
      text: emotionQuestion.question,
      category: emotionQuestion.category,
      relevance: 85,
      reasoning: `   Emotions  (${emotion}) Topic (${topic})`,
    };
  }

  /**
   * Generate "what if" scenario questions
   */
  static generateScenarioQuestions(topic: string, currentState: string): DynamicQuestion[] {
    const scenarios: DynamicQuestion[] = [
      {
        text: `       `,
        category: 'scenarios',
        relevance: 80,
        reasoning: '  ',
      },
      {
        text: `     `,
        category: 'scenarios',
        relevance: 78,
        reasoning: '   ',
      },
      {
        text: `       `,
        category: 'scenarios',
        relevance: 82,
        reasoning: '  ',
      },
      {
        text: `      `,
        category: 'scenarios',
        relevance: 85,
        reasoning: '  ',
      },
    ];

    return scenarios.slice(0, 3);
  }
}
