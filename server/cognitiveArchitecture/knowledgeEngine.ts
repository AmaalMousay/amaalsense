/**
 * Knowledge/Fact Engine
 * 
 * Purpose: Separate pathway for factual questions (who/when/where/how many)
 * - Retrieves facts from knowledge base
 * - Provides direct answers without full analysis
 * - Admits when information is not available
 */

import { invokeLLM } from "../_core/llm";

export interface FactualQuery {
  question: string;
  context?: string;
  domain?: string;
}

export interface FactualResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  sources?: string[];
  admitsIgnorance: boolean;
}

class KnowledgeEngineClass {
  /**
   * Answer a factual question directly
   */
  async answerFactualQuestion(query: FactualQuery): Promise<FactualResponse> {
    const { question, context, domain } = query;

    // Build prompt for factual question
    const prompt = this.buildFactualPrompt(question, context, domain);

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: `أنت محرك معرفة واقعية. مهمتك الإجابة على الأسئلة الواقعية بشكل مباشر ومختصر.

قواعد مهمة:
1. إذا كنت تعرف الإجابة بثقة عالية، أجب مباشرة
2. إذا كانت الإجابة غير مؤكدة، قل "المعلومات المتاحة تشير إلى..."
3. إذا لم تعرف الإجابة، قل بصراحة "لا أملك معلومات دقيقة عن هذا"
4. لا تخترع معلومات أو تخمن
5. أجب بجملة أو جملتين فقط، بدون مقدمات أو خلاصات

أمثلة:
- "من اغتال سيف الإسلام القذافي؟" → "لم يتم تحديد الفاعل رسمياً حتى الآن، والتحقيقات جارية"
- "متى حدث ذلك؟" → "وقع الحادث في [التاريخ المحدد]"
- "من صنع AmalSense؟" → "صنعتني أمال رضوان بشير، باحثة في الذكاء الاصطناعي من سبها، ليبيا"`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const messageContent = response.choices[0].message.content;
      const answer = typeof messageContent === 'string' ? messageContent : '';

      if (!answer) {
        return {
          answer: 'عذراً، لم أتمكن من الحصول على إجابة.',
          confidence: 'unknown',
          admitsIgnorance: true,
        };
      }

      // Detect if the answer admits ignorance
      const admitsIgnorance = this.detectIgnorance(answer);

      // Estimate confidence
      const confidence = this.estimateConfidence(answer, admitsIgnorance);

      return {
        answer,
        confidence,
        admitsIgnorance,
      };
    } catch (error) {
      console.error('Knowledge Engine error:', error);
      return {
        answer: 'عذراً، لا أستطيع الإجابة على هذا السؤال حالياً.',
        confidence: 'unknown',
        admitsIgnorance: true,
      };
    }
  }

  /**
   * Build prompt for factual question
   */
  private buildFactualPrompt(question: string, context?: string, domain?: string): string {
    let prompt = `السؤال: ${question}`;

    if (context) {
      prompt += `\n\nالسياق: ${context}`;
    }

    if (domain) {
      prompt += `\n\nالمجال: ${domain}`;
    }

    return prompt;
  }

  /**
   * Detect if the answer admits ignorance
   */
  private detectIgnorance(answer: string): boolean {
    const ignorancePatterns = [
      /لا أملك/i,
      /لا أعرف/i,
      /لا أستطيع/i,
      /غير متأكد/i,
      /غير واضح/i,
      /لا توجد معلومات/i,
      /لم يتم تحديد/i,
      /don't know/i,
      /not sure/i,
      /unclear/i,
      /no information/i,
    ];

    return ignorancePatterns.some(pattern => pattern.test(answer));
  }

  /**
   * Estimate confidence level from answer
   */
  private estimateConfidence(answer: string, admitsIgnorance: boolean): 'high' | 'medium' | 'low' | 'unknown' {
    if (admitsIgnorance) {
      return 'unknown';
    }

    // Check for uncertainty markers
    const uncertaintyMarkers = [
      /ربما/i,
      /قد/i,
      /محتمل/i,
      /يبدو/i,
      /على الأرجح/i,
      /possibly/i,
      /maybe/i,
      /likely/i,
      /seems/i,
    ];

    const hasUncertainty = uncertaintyMarkers.some(pattern => pattern.test(answer));

    if (hasUncertainty) {
      return 'medium';
    }

    // Check for high-confidence markers
    const confidenceMarkers = [
      /بالتأكيد/i,
      /بالفعل/i,
      /حقيقة/i,
      /رسمياً/i,
      /مؤكد/i,
      /definitely/i,
      /certainly/i,
      /confirmed/i,
      /officially/i,
    ];

    const hasConfidence = confidenceMarkers.some(pattern => pattern.test(answer));

    if (hasConfidence) {
      return 'high';
    }

    // Default to medium confidence
    return 'medium';
  }

  /**
   * Check if a question is suitable for the knowledge engine
   */
  isSuitableForKnowledgeEngine(question: string): boolean {
    const factualPatterns = [
      /^(who|من|مين)/i,
      /^(when|متى|وقت)/i,
      /^(where|أين|وين)/i,
      /^(how many|كم عدد|كم)/i,
      /^(how much|كم|بكم)/i,
      /^(what is|ما هو|ما هي|شنو)/i,
    ];

    return factualPatterns.some(pattern => pattern.test(question.trim()));
  }
}

export const KnowledgeEngine = new KnowledgeEngineClass();
