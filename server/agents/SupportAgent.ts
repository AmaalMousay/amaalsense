/**
 * AMALSENSE SUPPORT & KNOWLEDGE AGENT - Autonomous Counselor
 * لا يكتفي بالرد على الأسئلة الشائعة، بل يغوص في قاعدة المعرفة العلمية لتقديم إجابات رصينة.
 */

import { notifyOwner } from "../_core/notification";
import { buildRAGContext } from "../knowledge/ragSystem"; // ربط مع الذاكرة الموسوعية

export class SupportAgent {
  private baseFaq = [
    { q: "ما هو AmalSense؟", a: "هو محرك ذكاء اصطناعي موسوعي يحلل الوعي الرقمي عبر 24 طبقة معرفية تعتمد على نظرية DCFT." },
    { q: "اللغة العربية", a: "نعم، النظام يمتلك وعياً دلالياً عميقاً باللغة العربية وسياقاتها الثقافية." }
  ];

  /**
   * معالجة استفسارات المستخدمين بربطها بالذاكرة الطويلة (RAG)
   */
  async handleQuery(query: string, userEmail: string): Promise<string> {
    console.log(`[SupportAgent] 🧠 Analyzing query from ${userEmail}...`);

    // 1. التحقق من الأسئلة الشائعة البسيطة أولاً
    const matchedFaq = this.baseFaq.find(faq => query.includes(faq.q) || faq.q.includes(query));
    if (matchedFaq) return matchedFaq.a;

    // 2. إذا كان السؤال علمياً أو عميقاً، استدعاء الـ RAG (الذكاء التوليدي المعزز)
    console.log(`[SupportAgent] 🔎 Searching Knowledge Base for expert answer...`);
    const ragContext = buildRAGContext(query, { maxResults: 3 });

    let response: string;

    if (ragContext.scientificKnowledge.length > 0) {
      // بناء رد مستند إلى العلم (فيزياء، قانون، طب)
      const topFact = ragContext.scientificKnowledge[0];
      response = `بناءً على قاعدة معرفة AmalSense في مجال (${topFact.domain}):\n${topFact.content}\n\nهل تود استكشاف المزيد حول هذا الموضوع من منظور عاطفي؟`;
    } else {
      response = "شكراً لتواصلك. استفسارك يقع في منطقة 'عدم يقين' حالياً. سأقوم بتفعيل الوكيل الباحث (Observer) لجلب إجابة دقيقة والرد عليك عبر البريد.";

      // تفعيل تنبيه للمالك بضرورة تحديث المعرفة في هذا الجانب
      await notifyOwner({
        title: `Knowledge Gap Found: ${userEmail}`,
        content: `User asked about: ${query}. No specific scientific data found.`
      });
    }

    return response;
  }

  /**
   * إرسال تنبيهات استباقية (مثل رصد رنين عاطفي حاد في منطقة المستخدم)
   */
  async sendProactiveAlert(email: string, topic: string, severity: string): Promise<boolean> {
    const subject = `⚠️ تنبيه وعي رقمي: ${topic}`;
    const message = `تم رصد نشاط عاطفي غير مستقر (${severity}) في منطقتك. ينصح بالاطلاع على التقرير المفصل عبر المنصة.`;

    console.log(`[SupportAgent] Sending proactive alert to ${email}`);
    return await notifyOwner({
      title: `Outgoing Proactive Alert to ${email}`,
      content: message
    });
  }
}

export const supportAgent = new SupportAgent();