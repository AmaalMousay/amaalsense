/**
 * Personal Voice Layer (Layer 14)
 * 
 * تخصيص أسلوب الرد بناءً على شخصية المستخدم
 * تكييف اللغة والنبرة والأسلوب
 */

import { invokeGroqLLM } from './groqIntegration';

/**
 * ملف الصوت الشخصي
 */
export interface PersonalVoiceProfile {
  userId: string;
  tone: 'formal' | 'casual' | 'professional' | 'friendly' | 'academic';
  language: 'ar' | 'en';
  dialect?: string;
  vocabulary: 'simple' | 'moderate' | 'advanced';
  responseLength: 'brief' | 'moderate' | 'detailed';
  useEmojis: boolean;
  useExamples: boolean;
  useAnalogies: boolean;
  culturalContext: string[];
  personalityTraits: string[];
}

/**
 * بناء ملف الصوت من السلوك السابق
 */
export async function buildVoiceProfile(
  userId: string,
  conversationHistory: Array<{
    userQuestion: string;
    userLanguage: 'ar' | 'en';
    responseLength: number;
  }> = []
): Promise<PersonalVoiceProfile> {
  try {
    // تحليل السلوك السابق
    let tone: PersonalVoiceProfile['tone'] = 'friendly';
    let vocabulary: PersonalVoiceProfile['vocabulary'] = 'moderate';
    let responseLength: PersonalVoiceProfile['responseLength'] = 'moderate';
    let language: 'ar' | 'en' = 'ar';

    if (conversationHistory.length > 0) {
      // تحديد اللغة المفضلة
      const arCount = conversationHistory.filter(c => c.userLanguage === 'ar').length;
      const enCount = conversationHistory.filter(c => c.userLanguage === 'en').length;
      language = arCount >= enCount ? 'ar' : 'en';

      // تحديد طول الإجابة المفضل
      const avgLength = conversationHistory.reduce((a, b) => a + b.responseLength, 0) / conversationHistory.length;
      if (avgLength < 100) {
        responseLength = 'brief';
      } else if (avgLength > 500) {
        responseLength = 'detailed';
      }
    }

    const profile: PersonalVoiceProfile = {
      userId,
      tone,
      language,
      vocabulary,
      responseLength,
      useEmojis: false,
      useExamples: true,
      useAnalogies: true,
      culturalContext: [],
      personalityTraits: [],
    };

    console.log('[PersonalVoice] Voice profile built:', {
      userId,
      tone: profile.tone,
      language: profile.language,
      vocabulary: profile.vocabulary,
    });

    return profile;
  } catch (error) {
    console.error('[PersonalVoice] Error building voice profile:', error);
    
    return {
      userId,
      tone: 'friendly',
      language: 'ar',
      vocabulary: 'moderate',
      responseLength: 'moderate',
      useEmojis: false,
      useExamples: true,
      useAnalogies: true,
      culturalContext: [],
      personalityTraits: [],
    };
  }
}

/**
 * تكييف النص بناءً على الصوت الشخصي
 */
export async function adaptTextToVoice(
  text: string,
  voiceProfile: PersonalVoiceProfile
): Promise<{
  adaptedText: string;
  adaptations: string[];
}> {
  try {
    const systemPrompt = voiceProfile.language === 'ar'
      ? `أنت مساعد متخصص في تكييف النصوص. قم بتعديل النص التالي ليتناسب مع الملف الشخصي:
- النبرة: ${voiceProfile.tone}
- مستوى المفردات: ${voiceProfile.vocabulary}
- طول الإجابة: ${voiceProfile.responseLength}
- استخدام أمثلة: ${voiceProfile.useExamples}
- استخدام تشبيهات: ${voiceProfile.useAnalogies}`
      : `You are a text adaptation specialist. Modify the following text to match the personal profile:
- Tone: ${voiceProfile.tone}
- Vocabulary level: ${voiceProfile.vocabulary}
- Response length: ${voiceProfile.responseLength}
- Use examples: ${voiceProfile.useExamples}
- Use analogies: ${voiceProfile.useAnalogies}`;

    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: voiceProfile.language === 'ar'
            ? `كيّف هذا النص:\n\n${text}`
            : `Adapt this text:\n\n${text}`,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
      model: 'llama-3.1-8b-instant',
    });

    const adaptedText = response.content || response.text || text;
    const adaptations = [
      `تم تطبيق النبرة: ${voiceProfile.tone}`,
      `تم تطبيق مستوى المفردات: ${voiceProfile.vocabulary}`,
      `تم تطبيق طول الإجابة: ${voiceProfile.responseLength}`,
    ];

    console.log('[PersonalVoice] Text adapted:', {
      originalLength: text.length,
      adaptedLength: adaptedText.length,
      tone: voiceProfile.tone,
    });

    return {
      adaptedText,
      adaptations,
    };
  } catch (error) {
    console.error('[PersonalVoice] Error adapting text:', error);
    return {
      adaptedText: text,
      adaptations: [],
    };
  }
}

/**
 * إضافة لمسات شخصية للإجابة
 */
export async function addPersonalTouches(
  answer: string,
  voiceProfile: PersonalVoiceProfile,
  userContext?: {
    name?: string;
    interests?: string[];
    previousTopics?: string[];
  }
): Promise<{
  personalizedAnswer: string;
  touches: string[];
}> {
  try {
    let personalizedAnswer = answer;
    const touches: string[] = [];

    // إضافة تحية شخصية
    if (userContext?.name) {
      const greeting = voiceProfile.language === 'ar'
        ? `مرحباً ${userContext.name}،\n\n`
        : `Hello ${userContext.name},\n\n`;
      personalizedAnswer = greeting + personalizedAnswer;
      touches.push('تم إضافة تحية شخصية');
    }

    // إضافة ربط مع الاهتمامات السابقة
    if (userContext?.previousTopics && userContext.previousTopics.length > 0) {
      const connection = voiceProfile.language === 'ar'
        ? `\n\nبناءً على اهتمامك السابق بـ ${userContext.previousTopics[0]}، قد تجد هذا مفيداً:`
        : `\n\nBased on your previous interest in ${userContext.previousTopics[0]}, you might find this helpful:`;
      personalizedAnswer += connection;
      touches.push('تم إضافة ربط مع الاهتمامات السابقة');
    }

    // إضافة استدعاء للعمل
    if (voiceProfile.tone === 'friendly') {
      const cta = voiceProfile.language === 'ar'
        ? '\n\nهل تريد معرفة المزيد؟'
        : '\n\nWould you like to know more?';
      personalizedAnswer += cta;
      touches.push('تم إضافة استدعاء للعمل');
    }

    console.log('[PersonalVoice] Personal touches added:', {
      touchesCount: touches.length,
      tone: voiceProfile.tone,
    });

    return {
      personalizedAnswer,
      touches,
    };
  } catch (error) {
    console.error('[PersonalVoice] Error adding personal touches:', error);
    return {
      personalizedAnswer: answer,
      touches: [],
    };
  }
}

/**
 * اختيار أسلوب الشرح بناءً على الملف الشخصي
 */
export async function selectExplanationStyle(
  concept: string,
  voiceProfile: PersonalVoiceProfile
): Promise<{
  style: 'analogy' | 'example' | 'definition' | 'story' | 'comparison';
  explanation: string;
  reasoning: string;
}> {
  try {
    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: voiceProfile.language === 'ar'
            ? 'أنت خبير في اختيار أسلوب الشرح المناسب للمتعلم.'
            : 'You are an expert in selecting the appropriate explanation style for the learner.',
        },
        {
          role: 'user',
          content: voiceProfile.language === 'ar'
            ? `اختر أفضل أسلوب لشرح "${concept}" لشخص يفضل:
- استخدام التشبيهات: ${voiceProfile.useAnalogies}
- استخدام الأمثلة: ${voiceProfile.useExamples}
- مستوى المفردات: ${voiceProfile.vocabulary}

أرجع JSON:
{
  "style": "analogy|example|definition|story|comparison",
  "explanation": "الشرح",
  "reasoning": "السبب"
}`
            : `Choose the best style to explain "${concept}" for someone who prefers:
- Using analogies: ${voiceProfile.useAnalogies}
- Using examples: ${voiceProfile.useExamples}
- Vocabulary level: ${voiceProfile.vocabulary}

Return JSON:
{
  "style": "analogy|example|definition|story|comparison",
  "explanation": "The explanation",
  "reasoning": "The reason"
}`,
        },
      ],
      temperature: 0.7,
      maxTokens: 500,
      model: 'llama-3.1-8b-instant',
    });

    const content = response.content || response.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        style: parsed.style || 'definition',
        explanation: parsed.explanation || '',
        reasoning: parsed.reasoning || '',
      };
    }

    return {
      style: voiceProfile.useAnalogies ? 'analogy' : 'example',
      explanation: '',
      reasoning: 'Default selection',
    };
  } catch (error) {
    console.error('[PersonalVoice] Error selecting explanation style:', error);
    return {
      style: 'definition',
      explanation: '',
      reasoning: 'Error in selection',
    };
  }
}

/**
 * تقييم ملاءمة الإجابة للملف الشخصي
 */
export async function assessAnswerFit(
  answer: string,
  voiceProfile: PersonalVoiceProfile
): Promise<{
  fitScore: number; // 0-100
  suggestions: string[];
  strengths: string[];
}> {
  try {
    // تقييم بسيط بناءً على الخصائص
    let fitScore = 50;
    const suggestions: string[] = [];
    const strengths: string[] = [];

    // تقييم طول الإجابة
    const wordCount = answer.split(' ').length;
    if (voiceProfile.responseLength === 'brief' && wordCount < 100) {
      fitScore += 15;
      strengths.push('طول الإجابة مناسب');
    } else if (voiceProfile.responseLength === 'detailed' && wordCount > 300) {
      fitScore += 15;
      strengths.push('الإجابة تفصيلية كما هو مفضل');
    } else if (voiceProfile.responseLength === 'moderate' && wordCount > 100 && wordCount < 300) {
      fitScore += 15;
      strengths.push('طول الإجابة متوازن');
    } else {
      suggestions.push(`اجعل الإجابة ${voiceProfile.responseLength}`);
    }

    // تقييم استخدام الأمثلة
    if (voiceProfile.useExamples && answer.includes('مثال')) {
      fitScore += 10;
      strengths.push('تم استخدام أمثلة');
    } else if (voiceProfile.useExamples) {
      suggestions.push('أضف أمثلة توضيحية');
    }

    // تقييم استخدام التشبيهات
    if (voiceProfile.useAnalogies && (answer.includes('مثل') || answer.includes('يشبه'))) {
      fitScore += 10;
      strengths.push('تم استخدام تشبيهات');
    } else if (voiceProfile.useAnalogies) {
      suggestions.push('استخدم تشبيهات لتوضيح المفاهيم');
    }

    // تقييم النبرة
    if (voiceProfile.tone === 'friendly' && !answer.includes('للأسف')) {
      fitScore += 10;
      strengths.push('النبرة ودية');
    }

    console.log('[PersonalVoice] Answer fit assessed:', {
      fitScore,
      suggestionsCount: suggestions.length,
      strengthsCount: strengths.length,
    });

    return {
      fitScore: Math.min(fitScore, 100),
      suggestions,
      strengths,
    };
  } catch (error) {
    console.error('[PersonalVoice] Error assessing answer fit:', error);
    return {
      fitScore: 50,
      suggestions: [],
      strengths: [],
    };
  }
}

/**
 * تطبيق الصوت الشخصي على الإجابة الكاملة
 */
export async function applyPersonalVoice(
  baseAnswer: string,
  voiceProfile: PersonalVoiceProfile,
  userContext?: {
    name?: string;
    interests?: string[];
    previousTopics?: string[];
  }
): Promise<{
  finalAnswer: string;
  voiceApplied: boolean;
  adaptations: string[];
  fitScore: number;
}> {
  try {
    // تكييف النص
    const { adaptedText, adaptations: textAdaptations } = await adaptTextToVoice(
      baseAnswer,
      voiceProfile
    );

    // إضافة لمسات شخصية
    const { personalizedAnswer, touches } = await addPersonalTouches(
      adaptedText,
      voiceProfile,
      userContext
    );

    // تقييم الملاءمة
    const { fitScore } = await assessAnswerFit(personalizedAnswer, voiceProfile);

    const allAdaptations = [
      ...textAdaptations,
      ...touches,
      `النبرة: ${voiceProfile.tone}`,
      `مستوى المفردات: ${voiceProfile.vocabulary}`,
    ];

    console.log('[PersonalVoice] Personal voice applied:', {
      originalLength: baseAnswer.length,
      finalLength: personalizedAnswer.length,
      fitScore,
      adaptationsCount: allAdaptations.length,
    });

    return {
      finalAnswer: personalizedAnswer,
      voiceApplied: true,
      adaptations: allAdaptations,
      fitScore,
    };
  } catch (error) {
    console.error('[PersonalVoice] Error applying personal voice:', error);
    return {
      finalAnswer: baseAnswer,
      voiceApplied: false,
      adaptations: [],
      fitScore: 0,
    };
  }
}
