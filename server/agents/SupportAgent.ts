/**
 * AMALSENSE SUPPORT & KNOWLEDGE AGENT - Autonomous Counselor
 *               .
 */

import { notifyOwner } from "../_core/notification";
import { buildRAGContext } from "../knowledge/ragSystem"; //    

export class SupportAgent {
  private baseFaq = [
    { q: `ما هو AmalSense؟`, a: `هو محرك ذكاء اصطناعي موسوعي يحلل الوعي الرقمي عبر 24 طبقة معرفية تعتمد على نظرية DCFT.` },
    { q: `اللغة العربية`, a: `نعم، النظام يمتلك وعياً دلالياً عميقاً باللغة العربية وسياقاتها الثقافية.` }
  ];

  /**
   *       (RAG)
   */
  async handleQuery(query: string, userEmail: string): Promise<string> {
    console.log(`[SupportAgent] 🧠 Analyzing query from ${userEmail}...`);

    // 1.      
    const matchedFaq = this.baseFaq.find(faq => query.includes(faq.q) || faq.q.includes(query));
    if (matchedFaq) return matchedFaq.a;

    // 2.         RAG (  )
    console.log(`[SupportAgent] 🔎 Searching Knowledge Base for expert answer...`);
    const ragContext = buildRAGContext(query, { maxResults: 3 });

    let response: string;

    if (ragContext.scientificKnowledge.length > 0) {
      //      (  )
      const topFact = ragContext.scientificKnowledge[0];
      response = `    AmalSense   (${topFact.domain}):\n${topFact.content}\n\n         `;
    } else {
      response = `شكراً لتواصلك. استفسارك يقع في منطقة 'عدم يقين' حالياً. سأقوم بتفعيل الوكيل الباحث (Observer) لجلب إجابة دقيقة والرد عليك عبر البريد.`;

      //         
      await notifyOwner({
        title: `Knowledge Gap Found: ${userEmail}`,
        content: `User asked about: ${query}. No specific scientific data found.`
      });
    }

    return response;
  }

  /**
   *    (       )
   */
  async sendProactiveAlert(email: string, topic: string, severity: string): Promise<boolean> {
    const subject = `⚠️   : ${topic}`;
    const message = `      (${severity})  .       .`;

    console.log(`[SupportAgent] Sending proactive alert to ${email}`);
    return await notifyOwner({
      title: `Outgoing Proactive Alert to ${email}`,
      content: message
    });
  }

  /**
   *    
   */
  async sendUserEmail(email: string, subject: string, message: string): Promise<boolean> {
    console.log(`[SupportAgent] Sending email to ${email}: ${subject}`);
    //        
    return await notifyOwner({
      title: `Support Email to ${email}: ${subject}`,
      content: message
    });
  }
}

export const supportAgent = new SupportAgent();