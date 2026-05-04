// @ts-nocheck
/**
 * Intelligent Narrator (v2 - AI-Powered)
 * الراوي الذكي - يستخدم Ollama/Groq لإنتاج تحليل طبيعي من البيانات الحقيقية
 *
 * بدلاً من قوالب نصية جامدة، يأخذ هذا المكوّن:
 * 1. حزمة البيانات الحقيقية (الأسعار، الأخبار، المؤشرات)
 * 2. فهم عميق للسؤال (DeepQuestion)
 * ثم يرسلها إلى Ollama/Groq ليكتب تحليلاً سردياً طبيعياً وذكياً
 */

import { smartInvokeLLM } from '../smartLLM';
import type { DeepQuestion } from './questionUnderstanding';

/**
 * حزمة البيانات الحقيقية التي يجمعها المحرك الموحد
 */
export interface KnowledgePacket {
  question: string;
  questionAnalysis: DeepQuestion;

  economicData?: {
    goldPrice?: number;
    goldChange?: number;
    oilPrice?: number;
    oilChange?: number;
    usdToLYD?: number;
    usdToEGP?: number;
    usdToEUR?: number;
    lastUpdated?: string;
  };

  emotionalIndicators?: {
    gmi?: number;
    cfi?: number;
    hri?: number;
    trend?: string;
  };

  recentNews?: Array<{
    title: string;
    source?: string;
    publishedAt?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
  }>;

  historicalContext?: string;
  conversationContext?: string;
}

// Kept for backward compatibility with old contextBuilder-based code
export interface NarratedResponse {
  text: string;
  sections: {
    opening: string;
    body: string;
    decision: string;
    closing: string;
  };
  metadata: {
    style: string;
    wordCount: number;
    readingTime: string;
  };
}

/**
 * بناء الـ System Prompt الذي يُرسل للذكاء الاصطناعي
 */
function buildSystemPrompt(packet: KnowledgePacket): string {
  const { questionAnalysis } = packet;
  const intent = questionAnalysis.deep.realIntent;
  const tone = questionAnalysis.responseStrategy.tone;
  const depth = questionAnalysis.responseStrategy.depth;
  const emotionalNeed = questionAnalysis.deep.emotionalNeed;

  let intentGuidance = '';
  switch (intent) {
    case 'make_decision':
      intentGuidance = 'قدّم تحليلاً يساعده على اتخاذ قرار واضح. اذكر التوصية بصراحة مع المخاطر.';
      break;
    case 'understand_cause':
      intentGuidance = 'اشرح الأسباب الحقيقية مستنداً للبيانات المعطاة، ليس أسباباً عامة.';
      break;
    case 'predict_future':
      intentGuidance = 'قدّم توقعاً محدداً مع العوامل التي قد تغيّره.';
      break;
    case 'assess_risk':
      intentGuidance = 'ركّز على المخاطر الحقيقية وكيف يمكن التعامل معها.';
      break;
    case 'find_opportunity':
      intentGuidance = 'ابحث في البيانات عن فرصة حقيقية وقدّمها مع شروطها.';
      break;
    case 'learn_concept':
      intentGuidance = 'اشرح بأسلوب بسيط مع ربط الموضوع بالبيانات الحالية.';
      break;
    case 'socialize':
      intentGuidance = 'ردّ بأسلوب ودّي وطبيعي وقصير.';
      break;
    default:
      intentGuidance = 'أجب بشكل شامل مستنداً للبيانات المتاحة.';
  }

  const emotionalGuidance = emotionalNeed === 'anxious'
    ? 'المستخدم قلق - ابدأ بالطمأنينة ثم قدّم التحليل الموضوعي.'
    : emotionalNeed === 'hopeful'
      ? 'المستخدم متفائل - أكّد الإيجابيات مع ذكر التحفظات.'
      : emotionalNeed === 'confused'
        ? 'المستخدم محتار - استخدم لغة بسيطة جداً وأمثلة واضحة.'
        : 'كن محايداً ومهنياً.';

  const depthGuidance = depth === 'brief'
    ? 'اجعل الرد موجزاً (3-4 جمل فقط).'
    : depth === 'comprehensive'
      ? 'قدّم رداً مفصّلاً وشاملاً مع أقسام واضحة.'
      : 'رد مفيد ومتوازن (5-8 جمل).';

  const tonePhrasing = tone === 'formal'
    ? 'رسمي ومهني'
    : tone === 'urgent'
      ? 'مباشر وعاجل'
      : 'محادثي وودود لكن احترافي';

  return `أنت "أمال"، المحلل المالي والاجتماعي الذكي لمنصة AmalSense.
مهمتك: كتابة تحليل ذكي ومفيد باللغة العربية بأسلوب بشري طبيعي.

**قواعد أساسية لا تتجاوزها:**
1. استخدم الأرقام والبيانات المعطاة لك حرفياً - لا تخترع أرقاماً.
2. إذا لم تكن البيانات كافية لموضوع معين، قل ذلك بصراحة.
3. تجنّب تماماً الجمل الجاهزة مثل "الحذر مطلوب" أو "المراقبة أفضل" بدون سياق.
4. اربط المعلومات ببعضها منطقياً ومتسلسلاً.
5. **القصد الحقيقي من السؤال:** ${intentGuidance}
6. **الحالة العاطفية للمستخدم:** ${emotionalGuidance}
7. **عمق الرد:** ${depthGuidance}
8. **أسلوب الرد:** ${tonePhrasing}.`;
}

/**
 * بناء رسالة المستخدم (User Message) مع البيانات
 */
function buildUserMessage(packet: KnowledgePacket): string {
  const { economicData, emotionalIndicators, recentNews, question, historicalContext, conversationContext } = packet;

  let dataSection = '';

  if (economicData) {
    dataSection += '\n📊 **البيانات الاقتصادية الحالية:**\n';
    if (economicData.goldPrice !== undefined) {
      const dir = (economicData.goldChange ?? 0) >= 0 ? '↑' : '↓';
      dataSection += `- الذهب: $${economicData.goldPrice.toFixed(0)} (${dir}${Math.abs(economicData.goldChange ?? 0).toFixed(2)}% اليوم)\n`;
    }
    if (economicData.oilPrice !== undefined) {
      const dir = (economicData.oilChange ?? 0) >= 0 ? '↑' : '↓';
      dataSection += `- نفط برنت: $${economicData.oilPrice.toFixed(0)} (${dir}${Math.abs(economicData.oilChange ?? 0).toFixed(2)}%)\n`;
    }
    if (economicData.usdToLYD !== undefined) dataSection += `- الدولار/الدينار الليبي: ${economicData.usdToLYD.toFixed(3)}\n`;
    if (economicData.usdToEGP !== undefined) dataSection += `- الدولار/الجنيه المصري: ${economicData.usdToEGP.toFixed(2)}\n`;
    if (economicData.usdToEUR !== undefined) dataSection += `- اليورو/الدولار: ${economicData.usdToEUR.toFixed(4)}\n`;
    if (economicData.lastUpdated) dataSection += `- آخر تحديث: ${economicData.lastUpdated}\n`;
  }

  if (emotionalIndicators) {
    dataSection += '\n🧠 **مؤشرات المزاج الجماعي:**\n';
    if (emotionalIndicators.gmi !== undefined) dataSection += `- مؤشر المزاج العام (GMI): ${emotionalIndicators.gmi}/100\n`;
    if (emotionalIndicators.cfi !== undefined) dataSection += `- مؤشر الخوف (CFI): ${emotionalIndicators.cfi}%\n`;
    if (emotionalIndicators.hri !== undefined) dataSection += `- مؤشر الأمل (HRI): ${emotionalIndicators.hri}%\n`;
    if (emotionalIndicators.trend) dataSection += `- الاتجاه: ${emotionalIndicators.trend}\n`;
  }

  if (recentNews && recentNews.length > 0) {
    dataSection += '\n📰 **أحدث الأخبار المتعلقة:**\n';
    recentNews.slice(0, 4).forEach(news => {
      const emoji = news.sentiment === 'positive' ? '🟢' : news.sentiment === 'negative' ? '🔴' : '⚪';
      dataSection += `${emoji} ${news.title}${news.source ? ` (${news.source})` : ''}\n`;
    });
  }

  return `**السؤال:** ${question}
**الموضوع:** ${packet.questionAnalysis.surface.topic}
${dataSection}${historicalContext ? `\n📅 **السياق التاريخي:** ${historicalContext}` : ''}${conversationContext ? `\n💬 **سياق المحادثة:** ${conversationContext}` : ''}

اكتب التحليل الآن:`;
}

/**
 * الدالة الرئيسية: الراوي الذكي (AI-Powered)
 */
export async function narrateAnalysis(packet: KnowledgePacket): Promise<string> {
  const systemPrompt = buildSystemPrompt(packet);
  const userMessage = buildUserMessage(packet);

  try {
    const response = await smartInvokeLLM(systemPrompt, userMessage, 'intelligent_narrator');

    if (!response || response.trim().length < 10) {
      throw new Error('Empty or too short response from LLM');
    }

    return response.trim();
  } catch (error) {
    console.error('[IntelligentNarrator] LLM call failed, using data-based fallback:', error);
    return buildFallbackNarration(packet);
  }
}

/**
 * رد احتياطي يستخدم البيانات الحقيقية بدلاً من نصوص مثبّتة
 */
function buildFallbackNarration(packet: KnowledgePacket): string {
  const { economicData, emotionalIndicators, recentNews, question } = packet;
  const parts: string[] = [`بخصوص سؤالك عن "${packet.questionAnalysis.surface.topic}":`];

  if (economicData?.goldPrice !== undefined) {
    const dir = (economicData.goldChange ?? 0) >= 0 ? 'مرتفعاً' : 'منخفضاً';
    parts.push(`سعر الذهب حالياً $${economicData.goldPrice.toFixed(0)} وهو ${dir} بنسبة ${Math.abs(economicData.goldChange ?? 0).toFixed(2)}%.`);
  }
  if (economicData?.oilPrice !== undefined) {
    parts.push(`نفط برنت يتداول عند $${economicData.oilPrice.toFixed(0)}.`);
  }
  if (economicData?.usdToLYD !== undefined) {
    parts.push(`سعر الدولار مقابل الدينار الليبي: ${economicData.usdToLYD.toFixed(3)}.`);
  }
  if (emotionalIndicators?.gmi !== undefined) {
    const desc = emotionalIndicators.gmi > 50 ? 'إيجابي' : emotionalIndicators.gmi < 30 ? 'سلبي ومتشائم' : 'متردد';
    parts.push(`مزاج السوق الجماعي ${desc} حالياً (GMI: ${emotionalIndicators.gmi}/100).`);
  }
  if (recentNews && recentNews.length > 0) {
    parts.push(`أبرز خبر: "${recentNews[0].title}"`);
  }

  if (parts.length === 1) {
    parts.push('تعذّر الاتصال بمحرك التحليل حالياً. يرجى المحاولة مرة أخرى.');
  } else {
    parts.push('(ملاحظة: محرك التحليل الذكي غير متاح حالياً، هذه بيانات مباشرة بدون تحليل مُعمَّق)');
  }

  return parts.join(' ');
}

/**
 * Adapter for old contextBuilder-based code (backward compatibility)
 */
export function narrateResponse(
  question: DeepQuestion,
  knowledge: any
): NarratedResponse {
  // محاولة بناء KnowledgePacket من الهيكل القديم
  const text = knowledge?.currentState?.summary || 'البيانات غير متوفرة حالياً.';
  return {
    text,
    sections: { opening: text, body: '', decision: '', closing: '' },
    metadata: { style: 'analytical', wordCount: text.split(/\s+/).length, readingTime: '1 دقيقة' }
  };
}

export function adaptToExpertise(text: string, expertise: 'beginner' | 'intermediate' | 'expert'): string {
  if (expertise === 'beginner') {
    return text
      .replace(/مؤشر الخوف الجماعي/g, 'مستوى القلق العام')
      .replace(/مؤشر الأمل والمرونة/g, 'مستوى التفاؤل')
      .replace(/GMI/g, 'المزاج العام')
      .replace(/CFI/g, 'مستوى القلق')
      .replace(/HRI/g, 'مستوى الأمل');
  }
  return text;
}

export function addEmotionalSupport(text: string, emotionalNeed: string): string {
  if (emotionalNeed === 'anxious') {
    return text + '\n\n**تذكر:** القلق طبيعي، لكن القرارات المدروسة أفضل من المتسرعة.';
  }
  if (emotionalNeed === 'hopeful') {
    return text + '\n\n**تذكر:** التفاؤل جيد، لكن الحذر المعقول يحمي من المفاجآت.';
  }
  return text;
}
