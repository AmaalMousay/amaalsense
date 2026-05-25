import { t } from "../_core/i18n";
/**
 * AMALSENSE SUPPORT & KNOWLEDGE AGENT - Autonomous Counselor
 *               .
 */

import { notifyOwner } from "../_core/notification";
import { buildRAGContext } from "../knowledge/ragSystem"; //    

export class SupportAgent {
  private baseFaq = [
    { q: t('auto.agents_SupportAgent.5.532982e8', 'ar'), a: t('auto.agents_SupportAgent.4.a9d2f4fc', 'ar') },
    { q: t('auto.agents_SupportAgent.3.8080ee6f', 'ar'), a: t('auto.agents_SupportAgent.2.d238d766', 'ar') }
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
      response = t('auto.agents_SupportAgent.1.c30565c1', 'ar');

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