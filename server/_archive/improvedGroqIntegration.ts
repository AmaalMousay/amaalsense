import { invokeLLM } from './_core/llm';
import { EventVector } from './graphPipeline';
import { createContextAwarePrompt, ConversationContext } from './conversationMemory';

/**
 * Improved Groq Integration
 * Uses EventVector as INPUT to Groq (not output)
 * Groq reasons over the vector to produce intelligent analysis
 */

/**
 * Convert EventVector to compact numerical representation
 * This is what Groq receives as input
 */
export function eventVectorToNumericInput(eventVector: EventVector): string {
  const emotionVector = [
    eventVector.emotions.hope,
    eventVector.emotions.fear,
    eventVector.emotions.anger,
    eventVector.emotions.sadness,
    eventVector.emotions.trust,
    eventVector.emotions.surprise,
  ];

  const vectorString = `
Vector Input for Analysis:
Topic: ${eventVector.topic} (confidence: ${eventVector.topicConfidence}%)
Emotions: [${emotionVector.map((e) => e.toFixed(2)).join(', ')}]
Region: ${eventVector.region}
Impact Score: ${eventVector.impactScore}
Severity: ${eventVector.severity}
Timestamp: ${eventVector.timestamp}

Interpretation Guide:
- Emotion values range from 0 to 1
- Impact score: 0-100 (higher = more significant)
- Severity levels: low, medium, high
`;

  return vectorString;
}

/**
 * Main Groq reasoning function
 * Receives EventVector and produces intelligent analysis
 */
export async function reasonWithEventVector(
  userQuery: string,
  eventVector: EventVector,
  conversationContext?: ConversationContext
): Promise<string> {
  try {
    // Build the prompt with context
    const contextAwarePrompt = createContextAwarePrompt(userQuery, eventVector, conversationContext);

    // Convert EventVector to numeric input for Groq
    const vectorInput = eventVectorToNumericInput(eventVector);

    // Create the full prompt for Groq
    const fullPrompt = `${contextAwarePrompt}

${vectorInput}

الآن قم بتحليل هذا الموقف بناءً على البيانات المقدمة أعلاه.`;

    // Call Groq 70B for final reasoning
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت محلل متخصص في المشاعر الجماعية والأنماط الاجتماعية.
          
تحليلك يجب أن يكون:
1. مستند إلى البيانات المقدمة (EventVector)
2. محدد وواقعي
3. يتضمن أسباب جذرية وتأثيرات محتملة
4. يقدم توصيات عملية
5. يتوقع التطورات المستقبلية

لا تستخدم قوالب عامة - استخدم البيانات الفعلية فقط.`,
        },
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    });

    // Extract text from response
    const content = response.choices?.[0]?.message?.content;
    const analysisText = typeof content === 'string' ? content : 'Unable to generate analysis';

    return analysisText;
  } catch (error) {
    console.error('Error in reasonWithEventVector:', error);
    throw error;
  }
}

/**
 * Generate specific follow-up analysis
 * For "ماذا لو" questions
 */
export async function generateScenarioAnalysis(
  scenario: string,
  eventVector: EventVector,
  conversationContext: ConversationContext
): Promise<string> {
  try {
    const prompt = `
السيناريو المقترح: ${scenario}

البيانات الحالية:
${eventVectorToNumericInput(eventVector)}

السياق السابق:
الموضوع: ${conversationContext.currentTopic}
المشاعر السائدة: ${conversationContext.emotionalContext.dominantEmotion}

المطلوب:
1. تحليل تأثير هذا السيناريو على المشاعر الجماعية
2. كيف ستتغير مؤشرات الخوف والأمل والغضب؟
3. ما هي الاحتمالات المختلفة؟
4. كيف يمكن التعامل مع هذا السيناريو؟

قدم تحليلاً مفصلاً ومحدداً.`;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت محلل سيناريوهات متخصص في المشاعر الجماعية.
          قدم تحليلات دقيقة ومحددة بناءً على البيانات المقدمة.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : 'Unable to generate scenario analysis';
  } catch (error) {
    console.error('Error in generateScenarioAnalysis:', error);
    throw error;
  }
}

/**
 * Generate recommendations based on EventVector
 */
export async function generateRecommendations(
  eventVector: EventVector,
  conversationContext: ConversationContext
): Promise<string> {
  try {
    const vectorInput = eventVectorToNumericInput(eventVector);

    const prompt = `
بناءً على البيانات التالية:
${vectorInput}

والسياق:
الموضوع: ${conversationContext.currentTopic}
المناطق: ${conversationContext.regionContext.join(', ')}

قدم التوصيات التالية:
1. إجراءات فورية يجب اتخاذها
2. استراتيجيات طويلة الأجل
3. كيفية تحسين المشاعر الإيجابية
4. كيفية تقليل المشاعر السلبية
5. مؤشرات النجاح

كن محدداً وعملياً.`;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت مستشار استراتيجي متخصص في إدارة المشاعر الجماعية.
          قدم توصيات عملية وقابلة للتنفيذ.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : 'Unable to generate recommendations';
  } catch (error) {
    console.error('Error in generateRecommendations:', error);
    throw error;
  }
}

/**
 * Compare EventVectors across time
 */
export async function compareEventVectors(
  currentVector: EventVector,
  previousVector: EventVector,
  topic: string
): Promise<string> {
  try {
    const currentInput = eventVectorToNumericInput(currentVector);
    const previousInput = eventVectorToNumericInput(previousVector);

    const prompt = `
موضوع التحليل: ${topic}

البيانات السابقة:
${previousInput}

البيانات الحالية:
${currentInput}

قارن بين الحالتين وحدد:
1. التغييرات الرئيسية في المشاعر
2. الأسباب المحتملة للتغيير
3. الاتجاهات والأنماط
4. التوقعات للفترة القادمة

كن تحليلياً ومحدداً.`;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `أنت محلل اتجاهات متخصص في المشاعر الجماعية.
          قدم مقارنات دقيقة وتحليلات معمقة.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : 'Unable to compare vectors';
  } catch (error) {
    console.error('Error in compareEventVectors:', error);
    throw error;
  }
}
