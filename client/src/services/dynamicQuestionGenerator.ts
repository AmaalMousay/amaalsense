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
        text: `ما هي التداعيات المباشرة على الاستقرار الاجتماعي والاقتصادي؟`,
        category: 'impact',
        relevance: 95,
        reasoning: 'مستوى الخوف مرتفع جداً، يتطلب فهم التأثيرات العملية',
      });
    }

    if ((emotionData?.emotions.hope ?? 0) > 50) {
      questions.push({
        text: `ما هي الفرص الإيجابية التي يمكن استغلالها من هذا الوضع؟`,
        category: 'impact',
        relevance: 85,
        reasoning: 'وجود مستوى أمل معقول يشير إلى فرص محتملة',
      });
    }

    // 2. Future-oriented questions
    if (intelligentResponse && intelligentResponse.length > 500) {
      questions.push({
        text: `ما هي السيناريوهات المحتملة للأسابيع القادمة؟`,
        category: 'future',
        relevance: 90,
        reasoning: 'التحليل شامل يسمح بتوقعات مستقبلية دقيقة',
      });

      questions.push({
        text: `كيف قد يتطور الوضع إذا استمرت الاتجاهات الحالية؟`,
        category: 'scenarios',
        relevance: 88,
        reasoning: 'فهم عميق للديناميكيات الحالية يمكن أن يساعد في التنبؤ',
      });
    }

    // 3. Solutions-oriented questions
    if ((emotionData?.emotions.anger ?? 0) > 40 || (emotionData?.emotions.fear ?? 0) > 70) {
      questions.push({
        text: `ما هي الخطوات العملية التي يمكن اتخاذها لتحسين الوضع؟`,
        category: 'solutions',
        relevance: 92,
        reasoning: 'مستويات عالية من المشاعر السلبية تتطلب حلولاً عملية',
      });
    }

    // 4. Risk assessment questions
    if ((pipelineMetadata?.confidence ?? 100) < 70) {
      questions.push({
        text: `ما هي المخاطر المحتملة من سوء التقدير أو عدم اليقين؟`,
        category: 'risks',
        relevance: 80,
        reasoning: 'مستوى الثقة أقل من المثالي، يتطلب تقييم المخاطر',
      });
    }

    // 5. Recommendation questions
    if ((emotionData?.emotions.curiosity ?? 0) > 50) {
      questions.push({
        text: `ما هي أفضل الممارسات الدولية في التعامل مع حالات مماثلة؟`,
        category: 'recommendations',
        relevance: 85,
        reasoning: 'مستوى فضول مرتفع يشير إلى اهتمام بالتعلم والمقارنة',
      });
    }

    // 6. Clarification questions based on analysis gaps
    if (!intelligentResponse || intelligentResponse.length < 300) {
      questions.push({
        text: `هل هناك جوانب محددة تود التعمق فيها أكثر؟`,
        category: 'clarification',
        relevance: 75,
        reasoning: 'التحليل قد يحتاج إلى توضيحات إضافية',
      });
    }

    // 7. Context-specific questions
    const lowerResponse = intelligentResponse?.toLowerCase() || '';
    
    if (lowerResponse.includes('مصالحة') || lowerResponse.includes('توافق')) {
      questions.push({
        text: `كيف يمكن تعزيز الحوار والتفاهم بين الأطراف المختلفة؟`,
        category: 'solutions',
        relevance: 88,
        reasoning: 'الرد يركز على المصالحة والتوافق',
      });
    }

    if (lowerResponse.includes('قانون') || lowerResponse.includes('عدالة')) {
      questions.push({
        text: `ما دور المؤسسات القانونية والدولية في هذا السياق؟`,
        category: 'impact',
        relevance: 86,
        reasoning: 'الرد يشير إلى أهمية العدالة والقانون',
      });
    }

    if (lowerResponse.includes('دولي') || lowerResponse.includes('عالمي')) {
      questions.push({
        text: `ما هي المواقف والضغوط الدولية المؤثرة على الوضع؟`,
        category: 'impact',
        relevance: 84,
        reasoning: 'الرد يتضمن عناصر دولية مهمة',
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
        question: `ما هي الإجراءات الوقائية التي يمكن اتخاذها لتقليل المخاطر؟`,
        category: 'solutions',
      },
      hope: {
        question: `كيف يمكن تعزيز هذا الشعور بالأمل وتحويله إلى إجراءات فعلية؟`,
        category: 'recommendations',
      },
      anger: {
        question: `ما هي الطرق البناءة للتعبير عن الاستياء وتحقيق التغيير؟`,
        category: 'solutions',
      },
      sadness: {
        question: `كيف يمكن تحويل هذا الشعور إلى دافع للإصلاح والتحسين؟`,
        category: 'solutions',
      },
      joy: {
        question: `كيف يمكن الحفاظ على هذا الزخم الإيجابي وتعميمه؟`,
        category: 'recommendations',
      },
      curiosity: {
        question: `ما هي الجوانب الأخرى التي تستحق الاستكشاف والتعمق؟`,
        category: 'clarification',
      },
    };

    const emotionQuestion = emotionMap[emotion.toLowerCase()] || {
      question: `ما هي الخطوات التالية المقترحة؟`,
      category: 'recommendations',
    };

    return {
      text: emotionQuestion.question,
      category: emotionQuestion.category,
      relevance: 85,
      reasoning: `السؤال مستوحى من المشاعر السائدة (${emotion}) والموضوع (${topic})`,
    };
  }

  /**
   * Generate "what if" scenario questions
   */
  static generateScenarioQuestions(topic: string, currentState: string): DynamicQuestion[] {
    const scenarios: DynamicQuestion[] = [
      {
        text: `ماذا لو تطورت الأحداث بشكل أسرع من المتوقع؟`,
        category: 'scenarios',
        relevance: 80,
        reasoning: 'استكشاف السيناريوهات السريعة',
      },
      {
        text: `ماذا لو تدخلت أطراف خارجية إضافية؟`,
        category: 'scenarios',
        relevance: 78,
        reasoning: 'استكشاف تأثير العوامل الخارجية',
      },
      {
        text: `ماذا لو لم يتم اتخاذ أي إجراء فوري؟`,
        category: 'scenarios',
        relevance: 82,
        reasoning: 'استكشاف السيناريو الأسوأ',
      },
      {
        text: `ماذا لو تعاون جميع الأطراف بشكل كامل؟`,
        category: 'scenarios',
        relevance: 85,
        reasoning: 'استكشاف السيناريو الأفضل',
      },
    ];

    return scenarios.slice(0, 3);
  }
}
