/**
 * AmalSense Support & Communications Agent
 * Handles user queries, FAQs, and automates email communications.
 */
import { notifyOwner } from "../_core/notification";

export class SupportAgent {
  private faqData = [
    { q: "ما هو AmalSense؟", a: "AmalSense هو محرك ذكاء اصطناعي معرفي يقوم بتحليل العواطف الجماعية العالمية باستخدام نظرية DCFT." },
    { q: "كيف أحصل على مفتاح API؟", a: "يمكنك الحصول على مفتاح API من صفحة Developer API بعد الترقية لخطة Pro أو Enterprise." },
    { q: "هل يدعم اللغة العربية؟", a: "نعم، AmalSense مصمم خصيصاً لفهم السياقات الثقافية واللغوية العربية بدقة عالية." }
  ];

  /**
   * Responds to user queries using internal knowledge base
   */
  async handleQuery(query: string, userEmail: string): Promise<string> {
    console.log(`[SupportAgent] Processing query from ${userEmail}: ${query}`);
    
    // Simple FAQ matching logic
    const matchedFaq = this.faqData.find(faq => query.includes(faq.q) || faq.q.includes(query));
    
    let response: string;
    if (matchedFaq) {
      response = matchedFaq.a;
    } else {
      response = "شكراً لتواصلك معنا. استفسارك قيد المعالجة من قبل فريقنا التقني، وسنرد عليك عبر البريد الإلكتروني قريباً.";
    }

    // Automate email notification to the team
    await notifyOwner({
      title: `Support Request from ${userEmail}`,
      content: `User Query: ${query}\nAgent Response: ${response}`
    });

    return response;
  }

  /**
   * Sends proactive notification to a user
   */
  async sendUserEmail(email: string, subject: string, message: string): Promise<boolean> {
    console.log(`[SupportAgent] Sending email to ${email}: ${subject}`);
    
    // In production, this would use SendGrid/AWS SES. 
    // For now, we log it and notify owner to simulate the flow.
    return await notifyOwner({
      title: `Outgoing Email to ${email}: ${subject}`,
      content: message
    });
  }
}

export const supportAgent = new SupportAgent();
