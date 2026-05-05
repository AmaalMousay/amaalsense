/**
 * Knowledge/Fact Engine - Accumulative ASI Edition
 * * Purpose: 
 * 1. Humanized responses in English.
 * 2. Retrieves facts from the "Accumulative Learning Store" (The deep memory).
 * 3. Admits ignorance gracefully but looks into learned vectors first.
 */

import { invokeLLM } from "../_core/llm";
import { getCumulativeInsight } from "../engines/learningStore"; // الربط بالذاكرة التراكمية

export interface FactualQuery {
  question: string;
  context?: string;
  domain?: string;
  topic?: string; // أضفنا الموضوع للبحث في الذاكرة
}

export interface FactualResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  sources?: string[];
  admitsIgnorance: boolean;
  cumulativeContext?: any; // تفاصيل من الذاكرة التراكمية
}

class KnowledgeEngineClass {
  /**
   * Answer a factual question by consulting deep memory first
   */
  async answerFactualQuestion(query: FactualQuery): Promise<FactualResponse> {
    const { question, context, domain, topic } = query;

    // 1. البحث في الذاكرة التراكمية أولاً (The Self-Learning Check)
    const memoryInsight = topic ? getCumulativeInsight(topic) : null;

    // 2. بناء سياق مطور للـ LLM يحتوي على ما تعلمه النظام ذاتياً
    const memoryContext = memoryInsight && typeof memoryInsight !== 'string'
      ? `System Deep Memory: I have observed this topic ${memoryInsight.observationsCount} times. Average intensity: ${memoryInsight.totalIntensity}.`
      : "No prior cumulative memory on this specific vector.";

    const prompt = this.buildFactualPrompt(question, `${context || ''}\n${memoryContext}`, domain);

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: `You are the AmalSense Fact Engine (ASI). 
            Your goal is to provide sophisticated, humanized English responses.
            
            RULES:
            1. Use the provided "System Deep Memory" to inform your answer. 
            2. If memory exists, speak as someone who has "observed" the data over time.
            3. English ONLY. Professional yet conscious tone.
            4. If unknown, say: "My current cognitive field does not have enough verified vectors for this."
            5. Keep it concise (1-3 sentences).`,
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
          answer: 'My cognitive field is currently unresponsive to this query.',
          confidence: 'unknown',
          admitsIgnorance: true,
        };
      }

      const admitsIgnorance = this.detectIgnorance(answer);
      const confidence = this.estimateConfidence(answer, admitsIgnorance);

      return {
        answer,
        confidence,
        admitsIgnorance,
        cumulativeContext: memoryInsight
      };
    } catch (error) {
      console.error('Knowledge Engine error:', error);
      return {
        answer: 'I am experiencing a temporary disconnection from my factual repository.',
        confidence: 'unknown',
        admitsIgnorance: true,
      };
    }
  }

  private buildFactualPrompt(question: string, context?: string, domain?: string): string {
    return `Query: ${question}\nContext: ${context || 'None'}\nDomain: ${domain || 'General'}`;
  }

  private detectIgnorance(answer: string): boolean {
    const ignorancePatterns = [/don't have/i, /not enough/i, /unclear/i, /unknown/i, /no information/i];
    return ignorancePatterns.some(pattern => pattern.test(answer));
  }

  private estimateConfidence(answer: string, admitsIgnorance: boolean): 'high' | 'medium' | 'low' | 'unknown' {
    if (admitsIgnorance) return 'unknown';
    if (/verified|officially|confirmed|statistically/i.test(answer)) return 'high';
    if (/perhaps|likely|seems/i.test(answer)) return 'medium';
    return 'medium';
  }

  isSuitableForKnowledgeEngine(question: string): boolean {
    const factualPatterns = [/who/i, /when/i, /where/i, /how many/i, /what is/i, /tell me about/i];
    return factualPatterns.some(pattern => pattern.test(question.trim().toLowerCase()));
  }
}

export const KnowledgeEngine = new KnowledgeEngineClass();