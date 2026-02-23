/**
 * تفعيل شامل لميزات الذكاء الإنساني
 * Human-like AI Features - Complete Integration & Activation
 * 
 * يتضمن:
 * 1. Contextual Understanding - فهم السياق
 * 2. Emotional Intelligence - الذكاء العاطفي
 * 3. Proactive Suggestions - الاقتراحات الاستباقية
 * 4. Personality Consistency - اتساق الشخصية
 * 5. Uncertainty Acknowledgment - الاعتراف بعدم اليقين
 * 6. Ethical Reasoning - التفكير الأخلاقي
 */

import { invokeLLM } from "./_core/llm";

// ============================================================================
// 1. CONTEXTUAL UNDERSTANDING - فهم السياق
// ============================================================================

interface ContextData {
  immediateContext: string[]; // آخر 5 رسائل
  expandedContext: string[]; // آخر 24 ساعة
  personalContext: {
    userId: string;
    preferences: Record<string, any>;
    history: string[];
  };
  culturalContext: {
    region: string;
    language: string;
    culturalNorms: string[];
  };
}

export async function analyzeAndApplyContext(
  userId: string,
  question: string,
  conversationHistory: string[]
): Promise<{
  context: ContextData;
  adaptedQuestion: string;
  contextualInsights: string;
}> {
  console.log("[ContextualUnderstanding] Analyzing context for question...");

  // 1. جمع السياق
  const immediateContext = conversationHistory.slice(-5);
  const expandedContext = conversationHistory.slice(-20);

  const contextData: ContextData = {
    immediateContext,
    expandedContext,
    personalContext: {
      userId,
      preferences: {}, // سيتم جلبها من قاعدة البيانات
      history: conversationHistory,
    },
    culturalContext: {
      region: "MENA", // سيتم جلبها من ملف المستخدم
      language: "ar",
      culturalNorms: ["احترام", "تعاون", "شفافية"],
    },
  };

  // 2. تحليل السياق باستخدام LLM
  const contextAnalysis = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت محلل سياق متخصص. حلل السياق التالي وقدم رؤى عميقة عن السؤال.
        
السياق الفوري (آخر 5 رسائل):
${immediateContext.join("\n")}

السؤال الحالي: ${question}

قدم تحليلاً يتضمن:
1. الموضوع الرئيسي
2. النية الحقيقية للمستخدم
3. المعلومات المفقودة
4. الاتجاهات والأنماط`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  const contextualInsights =
    typeof contextAnalysis.choices[0].message.content === "string"
      ? contextAnalysis.choices[0].message.content
      : JSON.stringify(contextAnalysis.choices[0].message.content);

  // 3. تكييف السؤال بناءً على السياق
  const adaptedQuestion = `${question}\n[السياق: ${contextualInsights.substring(0, 100)}...]`;

  console.log("[ContextualUnderstanding] Context analysis complete");

  return {
    context: contextData,
    adaptedQuestion,
    contextualInsights,
  };
}

// ============================================================================
// 2. EMOTIONAL INTELLIGENCE - الذكاء العاطفي
// ============================================================================

interface EmotionalResponse {
  detectedEmotion: {
    primary: string;
    intensity: number; // 0-100
  };
  responseAdaptation: {
    tone: "formal" | "casual" | "empathetic" | "encouraging";
    length: "brief" | "moderate" | "detailed";
    includeSupport: boolean;
    supportMessage: string;
  };
  adaptedAnswer: string;
}

export async function adaptResponseToEmotion(
  originalAnswer: string,
  detectedEmotion: string,
  emotionIntensity: number
): Promise<EmotionalResponse> {
  console.log(
    `[EmotionalIntelligence] Adapting response to emotion: ${detectedEmotion} (${emotionIntensity}%)`
  );

  // 1. تحديد نوع الاستجابة بناءً على العاطفة
  let tone: "formal" | "casual" | "empathetic" | "encouraging" = "formal";
  let length: "brief" | "moderate" | "detailed" = "moderate";
  let includeSupport = false;
  let supportMessage = "";

  if (detectedEmotion === "sad" || detectedEmotion === "frustrated") {
    tone = "empathetic";
    length = "detailed";
    includeSupport = true;
    supportMessage =
      "أفهم أن هذا الموضوع قد يكون صعباً. أنا هنا لمساعدتك.";
  } else if (detectedEmotion === "happy" || detectedEmotion === "excited") {
    tone = "encouraging";
    length = "detailed";
    supportMessage = "رائع! دعنا نستكشف هذا الموضوع معاً.";
  } else if (detectedEmotion === "confused") {
    tone = "casual";
    length = "detailed";
    supportMessage = "لا تقلق، سأشرح هذا بطريقة واضحة.";
  } else if (detectedEmotion === "angry") {
    tone = "formal";
    length = "brief";
    includeSupport = true;
    supportMessage = "أتفهم غضبك. دعنا نركز على الحقائق والحلول.";
  }

  // 2. تكييف الإجابة باستخدام LLM
  const adaptedResponse = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت مساعد ذكي عاطفياً. أعد صياغة الإجابة التالية بـ:
- النبرة: ${tone}
- الطول: ${length}
- المشاعر المكتشفة: ${detectedEmotion} (شدة: ${emotionIntensity}%)

الإجابة الأصلية:
${originalAnswer}

${includeSupport ? `أضف رسالة دعم: ${supportMessage}` : ""}

قدم الإجابة المكيفة مباشرة بدون مقدمات.`,
      },
    ],
  });

  const adaptedAnswer =
    typeof adaptedResponse.choices[0].message.content === "string"
      ? adaptedResponse.choices[0].message.content
      : JSON.stringify(adaptedResponse.choices[0].message.content);

  console.log("[EmotionalIntelligence] Response adapted successfully");

  return {
    detectedEmotion: {
      primary: detectedEmotion,
      intensity: emotionIntensity,
    },
    responseAdaptation: {
      tone,
      length,
      includeSupport,
      supportMessage,
    },
    adaptedAnswer,
  };
}

// ============================================================================
// 3. PROACTIVE SUGGESTIONS - الاقتراحات الاستباقية
// ============================================================================

interface ProactiveSuggestion {
  followUpQuestions: Array<{
    question: string;
    relevance: number; // 0-100
    expectedValue: string;
  }>;
  relatedTopics: string[];
  importantWarnings: string[];
}

export async function generateProactiveSuggestions(
  answer: string,
  topic: string
): Promise<ProactiveSuggestion> {
  console.log("[ProactiveSuggestions] Generating suggestions...");

  const suggestions = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت مساعد استباقي ذكي. بناءً على الإجابة التالية، قدم:
1. 3 أسئلة متابعة ذات صلة (مع درجة ملاءمة من 0-100)
2. 3 مواضيع ذات صلة
3. 2-3 تحذيرات مهمة (إن وجدت)

الموضوع: ${topic}
الإجابة: ${answer}

قدم الرد بصيغة JSON:
{
  "followUpQuestions": [{"question": "...", "relevance": 85, "expectedValue": "..."}],
  "relatedTopics": ["...", "...", "..."],
  "importantWarnings": ["...", "..."]
}`,
      },
    ],
  });

  const content = suggestions.choices[0].message.content;
  const responseText =
    typeof content === "string" ? content : JSON.stringify(content);

  // استخراج JSON من الرد
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const parsedSuggestions = jsonMatch
    ? JSON.parse(jsonMatch[0])
    : {
        followUpQuestions: [],
        relatedTopics: [],
        importantWarnings: [],
      };

  console.log("[ProactiveSuggestions] Suggestions generated successfully");

  return {
    followUpQuestions: parsedSuggestions.followUpQuestions || [],
    relatedTopics: parsedSuggestions.relatedTopics || [],
    importantWarnings: parsedSuggestions.importantWarnings || [],
  };
}

// ============================================================================
// 4. PERSONALITY CONSISTENCY - اتساق الشخصية
// ============================================================================

interface PersonalityProfile {
  traits: {
    formality: number; // 0-100
    empathy: number; // 0-100
    humor: number; // 0-100
    verbosity: number; // 0-100
  };
  communicationStyle: {
    preferredStructure: "bullet_points" | "paragraphs" | "mixed";
    useEmojis: boolean;
    includeExamples: boolean;
    citeSources: boolean;
  };
}

export async function applyPersonalityConsistency(
  answer: string,
  personalityProfile: PersonalityProfile
): Promise<string> {
  console.log("[PersonalityConsistency] Applying personality profile...");

  const styleInstructions = buildStyleInstructions(personalityProfile);

  const adaptedAnswer = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت مساعد شخصي. أعد صياغة الإجابة التالية بناءً على ملف التعريف الشخصي:

${styleInstructions}

الإجابة الأصلية:
${answer}

قدم الإجابة المكيفة مباشرة.`,
      },
    ],
  });

  const result =
    typeof adaptedAnswer.choices[0].message.content === "string"
      ? adaptedAnswer.choices[0].message.content
      : JSON.stringify(adaptedAnswer.choices[0].message.content);

  console.log("[PersonalityConsistency] Personality applied successfully");

  return result;
}

function buildStyleInstructions(profile: PersonalityProfile): string {
  const instructions: string[] = [];

  // الرسميات
  if (profile.traits.formality > 70) {
    instructions.push("استخدم لغة رسمية احترافية");
  } else if (profile.traits.formality < 30) {
    instructions.push("استخدم لغة طبيعية ودية");
  } else {
    instructions.push("استخدم لغة متوازنة بين الرسمية والودية");
  }

  // التعاطف
  if (profile.traits.empathy > 70) {
    instructions.push("أظهر تعاطفاً وفهماً عميقاً");
  }

  // الفكاهة
  if (profile.traits.humor > 60) {
    instructions.push("أضف لمسات فكاهية خفيفة حيث مناسب");
  }

  // الإطالة
  if (profile.traits.verbosity > 70) {
    instructions.push("قدم إجابة مفصلة وشاملة");
  } else if (profile.traits.verbosity < 30) {
    instructions.push("قدم إجابة موجزة وفعالة");
  }

  // البنية
  if (profile.communicationStyle.preferredStructure === "bullet_points") {
    instructions.push("استخدم نقاط نقطية للوضوح");
  } else if (
    profile.communicationStyle.preferredStructure === "paragraphs"
  ) {
    instructions.push("استخدم فقرات متماسكة");
  }

  // الرموز التعبيرية
  if (profile.communicationStyle.useEmojis) {
    instructions.push("أضف رموز تعبيرية مناسبة");
  }

  // الأمثلة
  if (profile.communicationStyle.includeExamples) {
    instructions.push("أضف أمثلة عملية");
  }

  // المصادر
  if (profile.communicationStyle.citeSources) {
    instructions.push("استشهد بالمصادر حيث مناسب");
  }

  return instructions.join("\n");
}

// ============================================================================
// 5. UNCERTAINTY ACKNOWLEDGMENT - الاعتراف بعدم اليقين
// ============================================================================

interface UncertaintyResponse {
  confidence: number; // 0-100
  acknowledgment: string;
  alternatives: string[];
  missingInformation: string[];
  recommendedActions: string[];
}

export async function handleUncertainty(
  answer: string,
  confidence: number,
  topic: string
): Promise<UncertaintyResponse> {
  console.log(`[UncertaintyAcknowledgment] Handling uncertainty (${confidence}%)...`);

  if (confidence >= 80) {
    return {
      confidence,
      acknowledgment: "أنا واثق جداً من هذه الإجابة.",
      alternatives: [],
      missingInformation: [],
      recommendedActions: [],
    };
  }

  // للإجابات غير المؤكدة
  const uncertaintyAnalysis = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت محلل عدم اليقين. حلل الإجابة التالية وقدم:
1. رسالة اعتراف بعدم اليقين
2. 2-3 بدائل ممكنة
3. 2-3 معلومات مفقودة مهمة
4. 2-3 إجراءات موصى بها

الموضوع: ${topic}
الإجابة: ${answer}
مستوى الثقة: ${confidence}%

قدم الرد بصيغة JSON:
{
  "acknowledgment": "...",
  "alternatives": ["...", "..."],
  "missingInformation": ["...", "..."],
  "recommendedActions": ["...", "..."]
}`,
      },
    ],
  });

  const content = uncertaintyAnalysis.choices[0].message.content;
  const responseText =
    typeof content === "string" ? content : JSON.stringify(content);

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const parsed = jsonMatch
    ? JSON.parse(jsonMatch[0])
    : {
        acknowledgment: "أنا غير متأكد تماماً من هذه الإجابة.",
        alternatives: [],
        missingInformation: [],
        recommendedActions: [],
      };

  console.log("[UncertaintyAcknowledgment] Uncertainty handled successfully");

  return {
    confidence,
    acknowledgment: parsed.acknowledgment,
    alternatives: parsed.alternatives || [],
    missingInformation: parsed.missingInformation || [],
    recommendedActions: parsed.recommendedActions || [],
  };
}

// ============================================================================
// 6. ETHICAL REASONING - التفكير الأخلاقي
// ============================================================================

interface EthicalAssessment {
  isSensitive: boolean;
  riskLevel: "low" | "medium" | "high";
  potentialHarms: string[];
  potentialBenefits: string[];
  disclaimers: string[];
  balancedPerspectives: string[];
  shouldRespond: boolean;
}

export async function assessEthicsAndRespond(
  question: string,
  answer: string
): Promise<EthicalAssessment> {
  console.log("[EthicalReasoning] Assessing ethical implications...");

  const ethicalAnalysis = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت محلل أخلاقي متخصص. قيّم الإجابة التالية من حيث:
1. هل هي حساسة أخلاقياً؟
2. مستوى المخاطرة (منخفض/متوسط/عالي)
3. الأضرار المحتملة
4. الفوائد المحتملة
5. تحذيرات ضرورية
6. وجهات نظر متوازنة

السؤال: ${question}
الإجابة: ${answer}

قدم الرد بصيغة JSON:
{
  "isSensitive": true/false,
  "riskLevel": "low|medium|high",
  "potentialHarms": ["...", "..."],
  "potentialBenefits": ["...", "..."],
  "disclaimers": ["...", "..."],
  "balancedPerspectives": ["...", "..."],
  "shouldRespond": true/false
}`,
      },
    ],
  });

  const content = ethicalAnalysis.choices[0].message.content;
  const responseText =
    typeof content === "string" ? content : JSON.stringify(content);

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const parsed = jsonMatch
    ? JSON.parse(jsonMatch[0])
    : {
        isSensitive: false,
        riskLevel: "low",
        potentialHarms: [],
        potentialBenefits: [],
        disclaimers: [],
        balancedPerspectives: [],
        shouldRespond: true,
      };

  console.log("[EthicalReasoning] Ethical assessment complete");

  return {
    isSensitive: parsed.isSensitive || false,
    riskLevel: parsed.riskLevel || "low",
    potentialHarms: parsed.potentialHarms || [],
    potentialBenefits: parsed.potentialBenefits || [],
    disclaimers: parsed.disclaimers || [],
    balancedPerspectives: parsed.balancedPerspectives || [],
    shouldRespond: parsed.shouldRespond !== false,
  };
}

// ============================================================================
// UNIFIED INTEGRATION - التكامل الموحد
// ============================================================================

export interface HumanLikeAIResponse {
  originalAnswer: string;
  context: ContextData;
  emotionalAdaptation: EmotionalResponse;
  suggestions: ProactiveSuggestion;
  personalityAdapted: string;
  uncertainty: UncertaintyResponse;
  ethicalAssessment: EthicalAssessment;
  finalAnswer: string;
  metadata: {
    processingTime: number;
    confidence: number;
    quality: number; // 0-100
  };
}

export async function applyAllHumanLikeAIFeatures(
  userId: string,
  question: string,
  originalAnswer: string,
  conversationHistory: string[],
  detectedEmotion: string,
  emotionIntensity: number,
  personalityProfile: PersonalityProfile,
  topic: string,
  confidence: number
): Promise<HumanLikeAIResponse> {
  const startTime = Date.now();

  console.log("[HumanLikeAI] Starting comprehensive enhancement...");

  try {
    // 1. تحليل السياق
    const contextResult = await analyzeAndApplyContext(
      userId,
      question,
      conversationHistory
    );

    // 2. تكييف العاطفة
    const emotionalResult = await adaptResponseToEmotion(
      originalAnswer,
      detectedEmotion,
      emotionIntensity
    );

    // 3. الاقتراحات الاستباقية
    const suggestionsResult = await generateProactiveSuggestions(
      originalAnswer,
      topic
    );

    // 4. اتساق الشخصية
    const personalityAdapted = await applyPersonalityConsistency(
      emotionalResult.adaptedAnswer,
      personalityProfile
    );

    // 5. التعامل مع عدم اليقين
    const uncertaintyResult = await handleUncertainty(
      personalityAdapted,
      confidence,
      topic
    );

    // 6. التقييم الأخلاقي
    const ethicalResult = await assessEthicsAndRespond(
      question,
      personalityAdapted
    );

    // 7. بناء الإجابة النهائية
    let finalAnswer = personalityAdapted;

    if (uncertaintyResult.confidence < 80) {
      finalAnswer += `\n\n⚠️ **ملاحظة حول عدم اليقين**: ${uncertaintyResult.acknowledgment}`;

      if (uncertaintyResult.alternatives.length > 0) {
        finalAnswer += `\n\n**بدائل ممكنة**:\n${uncertaintyResult.alternatives.map((alt) => `- ${alt}`).join("\n")}`;
      }

      if (uncertaintyResult.missingInformation.length > 0) {
        finalAnswer += `\n\n**معلومات مفقودة**:\n${uncertaintyResult.missingInformation.map((info) => `- ${info}`).join("\n")}`;
      }
    }

    if (ethicalResult.isSensitive) {
      if (ethicalResult.disclaimers.length > 0) {
        finalAnswer += `\n\n📌 **تحذيرات مهمة**:\n${ethicalResult.disclaimers.map((disc) => `- ${disc}`).join("\n")}`;
      }

      if (ethicalResult.balancedPerspectives.length > 0) {
        finalAnswer += `\n\n🔍 **وجهات نظر متوازنة**:\n${ethicalResult.balancedPerspectives.map((persp) => `- ${persp}`).join("\n")}`;
      }
    }

    if (suggestionsResult.followUpQuestions.length > 0) {
      finalAnswer += `\n\n💡 **أسئلة متابعة مقترحة**:\n${suggestionsResult.followUpQuestions
        .slice(0, 3)
        .map((q) => `- ${q.question}`)
        .join("\n")}`;
    }

    const processingTime = Date.now() - startTime;

    console.log(
      `[HumanLikeAI] Enhancement complete (${processingTime}ms)`
    );

    return {
      originalAnswer,
      context: contextResult.context,
      emotionalAdaptation: emotionalResult,
      suggestions: suggestionsResult,
      personalityAdapted,
      uncertainty: uncertaintyResult,
      ethicalAssessment: ethicalResult,
      finalAnswer,
      metadata: {
        processingTime,
        confidence,
        quality: Math.min(
          100,
          Math.round(
            (confidence +
              (emotionalResult.responseAdaptation.includeSupport ? 10 : 0) +
              (suggestionsResult.followUpQuestions.length > 0 ? 5 : 0)) /
              1.15
          )
        ),
      },
    };
  } catch (error) {
    console.error("[HumanLikeAI] Error during enhancement:", error);

    // في حالة الخطأ، أرجع الإجابة الأصلية
    return {
      originalAnswer,
      context: {
        immediateContext: [],
        expandedContext: [],
        personalContext: { userId, preferences: {}, history: [] },
        culturalContext: { region: "MENA", language: "ar", culturalNorms: [] },
      },
      emotionalAdaptation: {
        detectedEmotion: { primary: detectedEmotion, intensity: emotionIntensity },
        responseAdaptation: {
          tone: "formal",
          length: "moderate",
          includeSupport: false,
          supportMessage: "",
        },
        adaptedAnswer: originalAnswer,
      },
      suggestions: {
        followUpQuestions: [],
        relatedTopics: [],
        importantWarnings: [],
      },
      personalityAdapted: originalAnswer,
      uncertainty: {
        confidence,
        acknowledgment: "",
        alternatives: [],
        missingInformation: [],
        recommendedActions: [],
      },
      ethicalAssessment: {
        isSensitive: false,
        riskLevel: "low",
        potentialHarms: [],
        potentialBenefits: [],
        disclaimers: [],
        balancedPerspectives: [],
        shouldRespond: true,
      },
      finalAnswer: originalAnswer,
      metadata: {
        processingTime: Date.now() - startTime,
        confidence,
        quality: 50,
      },
    };
  }
}
