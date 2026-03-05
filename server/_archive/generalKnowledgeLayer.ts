/**
 * General Knowledge Layer (Layer 13)
 * 
 * معرفة عامة عن الحقائق والأحداث والمعلومات
 * تعزيز الإجابات بمعلومات موثوقة
 */

import { invokeGroqLLM } from './groqIntegration';

/**
 * مصدر المعرفة
 */
export interface KnowledgeSource {
  type: 'factual' | 'historical' | 'statistical' | 'current_event' | 'definition';
  title: string;
  content: string;
  confidence: number; // 0-100
  lastUpdated?: Date;
  sources?: string[];
}

/**
 * قاعدة معرفة
 */
export interface KnowledgeBase {
  query: string;
  sources: KnowledgeSource[];
  summary: string;
  relatedTopics: string[];
  confidence: number;
}

/**
 * البحث عن معرفة عامة
 */
export async function searchGeneralKnowledge(
  query: string,
  language: 'ar' | 'en' = 'ar'
): Promise<KnowledgeBase> {
  try {
    const systemPrompt = language === 'ar'
      ? `أنت خبير معرفة عامة. أجب على الأسئلة بمعلومات دقيقة وموثوقة.
قدم الإجابة بصيغة JSON مع المصادر والثقة.`
      : `You are a general knowledge expert. Answer questions with accurate and reliable information.
Provide the answer in JSON format with sources and confidence.`;

    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: language === 'ar'
            ? `ابحث عن معلومات عن: "${query}"\nأرجع JSON بهذا الشكل:
{
  "sources": [
    {"type": "factual|historical|statistical|current_event|definition", "title": "العنوان", "content": "المحتوى", "confidence": 85}
  ],
  "summary": "ملخص المعلومات",
  "relatedTopics": ["موضوع1", "موضوع2"],
  "confidence": 80
}`
            : `Search for information about: "${query}"\nReturn JSON in this format:
{
  "sources": [
    {"type": "factual|historical|statistical|current_event|definition", "title": "Title", "content": "Content", "confidence": 85}
  ],
  "summary": "Summary of information",
  "relatedTopics": ["topic1", "topic2"],
  "confidence": 80
}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 1000,
      model: 'llama-3.1-8b-instant',
    });

    const content = response.content || response.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        query,
        sources: parsed.sources || [],
        summary: parsed.summary || '',
        relatedTopics: parsed.relatedTopics || [],
        confidence: parsed.confidence || 50,
      };
    }

    return {
      query,
      sources: [],
      summary: 'لم يتمكن من العثور على معلومات',
      relatedTopics: [],
      confidence: 0,
    };
  } catch (error) {
    console.error('[GeneralKnowledge] Error searching:', error);
    return {
      query,
      sources: [],
      summary: 'خطأ في البحث عن المعلومات',
      relatedTopics: [],
      confidence: 0,
    };
  }
}

/**
 * التحقق من صحة المعلومات
 */
export async function verifyFact(
  claim: string,
  language: 'ar' | 'en' = 'ar'
): Promise<{
  isTrue: boolean;
  confidence: number;
  explanation: string;
  sources: string[];
}> {
  try {
    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: language === 'ar'
            ? 'أنت خبير التحقق من الحقائق. تحقق من صحة الادعاءات.'
            : 'You are a fact-checking expert. Verify the accuracy of claims.',
        },
        {
          role: 'user',
          content: language === 'ar'
            ? `تحقق من صحة هذا الادعاء: "${claim}"\nأرجع JSON:
{
  "isTrue": true/false,
  "confidence": 85,
  "explanation": "التفسير",
  "sources": ["مصدر1", "مصدر2"]
}`
            : `Verify this claim: "${claim}"\nReturn JSON:
{
  "isTrue": true/false,
  "confidence": 85,
  "explanation": "Explanation",
  "sources": ["source1", "source2"]
}`,
        },
      ],
      temperature: 0.2,
      maxTokens: 500,
      model: 'llama-3.1-8b-instant',
    });

    const content = response.content || response.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        isTrue: parsed.isTrue || false,
        confidence: parsed.confidence || 50,
        explanation: parsed.explanation || '',
        sources: parsed.sources || [],
      };
    }

    return {
      isTrue: false,
      confidence: 0,
      explanation: 'لم يتمكن من التحقق',
      sources: [],
    };
  } catch (error) {
    console.error('[GeneralKnowledge] Error verifying fact:', error);
    return {
      isTrue: false,
      confidence: 0,
      explanation: 'خطأ في التحقق',
      sources: [],
    };
  }
}

/**
 * الحصول على معلومات عن شخصية
 */
export async function getPersonInfo(
  name: string,
  language: 'ar' | 'en' = 'ar'
): Promise<{
  name: string;
  description: string;
  notableFacts: string[];
  fields: string[];
  confidence: number;
}> {
  try {
    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: language === 'ar'
            ? 'أنت خبير السير الذاتية. قدم معلومات دقيقة عن الشخصيات.'
            : 'You are a biography expert. Provide accurate information about people.',
        },
        {
          role: 'user',
          content: language === 'ar'
            ? `أخبرني عن: "${name}"\nأرجع JSON:
{
  "description": "وصف قصير",
  "notableFacts": ["حقيقة1", "حقيقة2"],
  "fields": ["المجال1", "المجال2"],
  "confidence": 85
}`
            : `Tell me about: "${name}"\nReturn JSON:
{
  "description": "Brief description",
  "notableFacts": ["fact1", "fact2"],
  "fields": ["field1", "field2"],
  "confidence": 85
}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 500,
      model: 'llama-3.1-8b-instant',
    });

    const content = response.content || response.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        name,
        description: parsed.description || '',
        notableFacts: parsed.notableFacts || [],
        fields: parsed.fields || [],
        confidence: parsed.confidence || 50,
      };
    }

    return {
      name,
      description: 'لم يتمكن من العثور على معلومات',
      notableFacts: [],
      fields: [],
      confidence: 0,
    };
  } catch (error) {
    console.error('[GeneralKnowledge] Error getting person info:', error);
    return {
      name,
      description: 'خطأ في جلب المعلومات',
      notableFacts: [],
      fields: [],
      confidence: 0,
    };
  }
}

/**
 * الحصول على معلومات عن دولة
 */
export async function getCountryInfo(
  country: string,
  language: 'ar' | 'en' = 'ar'
): Promise<{
  country: string;
  capital: string;
  population: string;
  region: string;
  keyFacts: string[];
  confidence: number;
}> {
  try {
    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: language === 'ar'
            ? 'أنت خبير الجغرافيا والدول. قدم معلومات دقيقة عن الدول.'
            : 'You are a geography expert. Provide accurate information about countries.',
        },
        {
          role: 'user',
          content: language === 'ar'
            ? `أخبرني عن دولة: "${country}"\nأرجع JSON:
{
  "capital": "العاصمة",
  "population": "السكان",
  "region": "المنطقة",
  "keyFacts": ["حقيقة1", "حقيقة2"],
  "confidence": 85
}`
            : `Tell me about country: "${country}"\nReturn JSON:
{
  "capital": "Capital",
  "population": "Population",
  "region": "Region",
  "keyFacts": ["fact1", "fact2"],
  "confidence": 85
}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 500,
      model: 'llama-3.1-8b-instant',
    });

    const content = response.content || response.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        country,
        capital: parsed.capital || '',
        population: parsed.population || '',
        region: parsed.region || '',
        keyFacts: parsed.keyFacts || [],
        confidence: parsed.confidence || 50,
      };
    }

    return {
      country,
      capital: '',
      population: '',
      region: '',
      keyFacts: [],
      confidence: 0,
    };
  } catch (error) {
    console.error('[GeneralKnowledge] Error getting country info:', error);
    return {
      country,
      capital: '',
      population: '',
      region: '',
      keyFacts: [],
      confidence: 0,
    };
  }
}

/**
 * الحصول على معلومات عن موضوع
 */
export async function getTopicInfo(
  topic: string,
  language: 'ar' | 'en' = 'ar'
): Promise<{
  topic: string;
  definition: string;
  keyPoints: string[];
  relatedTopics: string[];
  confidence: number;
}> {
  try {
    const response = await invokeGroqLLM({
      messages: [
        {
          role: 'system',
          content: language === 'ar'
            ? 'أنت خبير متعدد المجالات. قدم معلومات دقيقة عن المواضيع.'
            : 'You are a multidisciplinary expert. Provide accurate information about topics.',
        },
        {
          role: 'user',
          content: language === 'ar'
            ? `شرح موضوع: "${topic}"\nأرجع JSON:
{
  "definition": "التعريف",
  "keyPoints": ["نقطة1", "نقطة2"],
  "relatedTopics": ["موضوع1", "موضوع2"],
  "confidence": 85
}`
            : `Explain topic: "${topic}"\nReturn JSON:
{
  "definition": "Definition",
  "keyPoints": ["point1", "point2"],
  "relatedTopics": ["topic1", "topic2"],
  "confidence": 85
}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 500,
      model: 'llama-3.1-8b-instant',
    });

    const content = response.content || response.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        topic,
        definition: parsed.definition || '',
        keyPoints: parsed.keyPoints || [],
        relatedTopics: parsed.relatedTopics || [],
        confidence: parsed.confidence || 50,
      };
    }

    return {
      topic,
      definition: 'لم يتمكن من العثور على معلومات',
      keyPoints: [],
      relatedTopics: [],
      confidence: 0,
    };
  } catch (error) {
    console.error('[GeneralKnowledge] Error getting topic info:', error);
    return {
      topic,
      definition: 'خطأ في جلب المعلومات',
      keyPoints: [],
      relatedTopics: [],
      confidence: 0,
    };
  }
}

/**
 * دمج المعرفة العامة مع الإجابة
 */
export async function enrichAnswerWithKnowledge(
  question: string,
  baseAnswer: string,
  topics: string[],
  language: 'ar' | 'en' = 'ar'
): Promise<{
  enrichedAnswer: string;
  addedKnowledge: KnowledgeSource[];
  confidence: number;
}> {
  try {
    // جمع المعرفة عن كل موضوع
    const knowledgePieces: KnowledgeSource[] = [];

    for (const topic of topics) {
      const topicInfo = await getTopicInfo(topic, language);
      if (topicInfo.confidence > 30) {
        knowledgePieces.push({
          type: 'definition',
          title: topic,
          content: topicInfo.definition,
          confidence: topicInfo.confidence,
        });
      }
    }

    // دمج المعرفة مع الإجابة
    let enrichedAnswer = baseAnswer;
    if (knowledgePieces.length > 0) {
      const knowledgeSection = language === 'ar'
        ? '\n\n**معلومات إضافية:**\n'
        : '\n\n**Additional Information:**\n';

      enrichedAnswer += knowledgeSection;
      for (const piece of knowledgePieces) {
        enrichedAnswer += `- ${piece.title}: ${piece.content}\n`;
      }
    }

    const avgConfidence = knowledgePieces.length > 0
      ? knowledgePieces.reduce((a, b) => a + b.confidence, 0) / knowledgePieces.length
      : 0;

    console.log('[GeneralKnowledge] Answer enriched with knowledge:', {
      topicsCount: topics.length,
      knowledgePieces: knowledgePieces.length,
      confidence: avgConfidence,
    });

    return {
      enrichedAnswer,
      addedKnowledge: knowledgePieces,
      confidence: avgConfidence,
    };
  } catch (error) {
    console.error('[GeneralKnowledge] Error enriching answer:', error);
    return {
      enrichedAnswer: baseAnswer,
      addedKnowledge: [],
      confidence: 0,
    };
  }
}
