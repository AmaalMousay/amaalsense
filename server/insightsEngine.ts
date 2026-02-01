/**
 * Insights Engine - محرك الرؤى والتنبيهات
 * 
 * يحول الأرقام إلى:
 * - رؤى قابلة للتنفيذ (Actionable Insights)
 * - تنبيهات ذكية (Smart Alerts)
 * - توصيات (Recommendations)
 * - تنبؤات (Predictions)
 */

export type AlertLevel = 'critical' | 'warning' | 'info' | 'positive';
export type InsightCategory = 'crisis' | 'opportunity' | 'trend' | 'stability' | 'volatility';

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  confidence: number; // 0-100
  timeframe?: string;
  actionable: boolean;
}

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: Date;
  expiresAt?: Date;
  actionRequired: boolean;
  suggestedActions?: string[];
  suggestedActionsAr?: string[];
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  targetAudience: string[];
  expectedImpact: string;
  expectedImpactAr: string;
}

export interface Prediction {
  id: string;
  type: 'crisis' | 'recovery' | 'escalation' | 'stabilization';
  probability: number; // 0-100
  timeframe: string;
  description: string;
  descriptionAr: string;
  basedOn: string[];
  confidence: number;
}

export interface AnalysisInsights {
  insights: Insight[];
  alerts: Alert[];
  recommendations: Recommendation[];
  predictions: Prediction[];
  summary: {
    overallSentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
    overallSentimentAr: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
    riskLevelAr: string;
    opportunityLevel: 'high' | 'medium' | 'low' | 'none';
    opportunityLevelAr: string;
    keyMessage: string;
    keyMessageAr: string;
  };
}

interface AnalysisData {
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity?: number;
    calm?: number;
  };
  indices: {
    gmi: number;  // مؤشر المزاج العام
    cfi: number;  // مؤشر الخوف الجماعي
    hri: number;  // مؤشر الأمل والمرونة
    spi?: number; // مؤشر الاستقطاب
    evi?: number; // مؤشر التقلب
  };
  context?: {
    eventType: string;
    region: string;
    sensitivity: string;
  };
}

/**
 * توليد الرؤى من بيانات التحليل
 */
export function generateInsights(data: AnalysisData): AnalysisInsights {
  const insights: Insight[] = [];
  const alerts: Alert[] = [];
  const recommendations: Recommendation[] = [];
  const predictions: Prediction[] = [];
  
  const { emotions, indices, context } = data;
  
  // === تحليل المشاعر وتوليد الرؤى ===
  
  // 1. تحليل الخوف المرتفع
  if (emotions.fear > 70) {
    insights.push({
      id: 'high_fear',
      category: 'crisis',
      title: 'Elevated Fear Levels Detected',
      titleAr: 'مستويات خوف مرتفعة',
      description: `Fear levels at ${emotions.fear.toFixed(0)}% indicate significant public anxiety about this topic.`,
      descriptionAr: `مستوى الخوف عند ${emotions.fear.toFixed(0)}% يشير إلى قلق عام كبير حول هذا الموضوع.`,
      confidence: 85,
      actionable: true,
    });
    
    alerts.push({
      id: 'fear_alert',
      level: emotions.fear > 85 ? 'critical' : 'warning',
      title: 'High Fear Alert',
      titleAr: 'تنبيه: خوف مرتفع',
      message: `Public fear is at ${emotions.fear.toFixed(0)}%. Consider crisis communication strategies.`,
      messageAr: `الخوف العام عند ${emotions.fear.toFixed(0)}%. يُنصح بتطبيق استراتيجيات التواصل في الأزمات.`,
      timestamp: new Date(),
      actionRequired: true,
      suggestedActions: [
        'Issue calming public statements',
        'Provide factual information',
        'Address rumors proactively',
      ],
      suggestedActionsAr: [
        'إصدار بيانات مطمئنة للجمهور',
        'تقديم معلومات واقعية',
        'معالجة الشائعات بشكل استباقي',
      ],
    });
  }
  
  // 2. تحليل الغضب المرتفع
  if (emotions.anger > 65) {
    insights.push({
      id: 'high_anger',
      category: 'crisis',
      title: 'Public Anger Rising',
      titleAr: 'ارتفاع الغضب العام',
      description: `Anger at ${emotions.anger.toFixed(0)}% suggests growing frustration that may lead to protests or backlash.`,
      descriptionAr: `الغضب عند ${emotions.anger.toFixed(0)}% يشير إلى إحباط متزايد قد يؤدي إلى احتجاجات أو ردود فعل سلبية.`,
      confidence: 80,
      actionable: true,
    });
    
    predictions.push({
      id: 'anger_prediction',
      type: 'escalation',
      probability: Math.min(95, emotions.anger + 10),
      timeframe: '24-72 hours',
      description: 'Risk of public demonstrations or social media backlash',
      descriptionAr: 'خطر حدوث مظاهرات أو ردود فعل سلبية على وسائل التواصل',
      basedOn: ['High anger levels', 'Historical patterns'],
      confidence: 75,
    });
  }
  
  // 3. تحليل الحزن المرتفع
  if (emotions.sadness > 70) {
    insights.push({
      id: 'high_sadness',
      category: 'crisis',
      title: 'Collective Grief Detected',
      titleAr: 'حزن جماعي',
      description: `Sadness at ${emotions.sadness.toFixed(0)}% indicates a period of collective mourning or disappointment.`,
      descriptionAr: `الحزن عند ${emotions.sadness.toFixed(0)}% يشير إلى فترة حداد جماعي أو خيبة أمل.`,
      confidence: 85,
      actionable: false,
    });
    
    recommendations.push({
      id: 'sadness_rec',
      priority: 'high',
      title: 'Empathetic Communication',
      titleAr: 'تواصل متعاطف',
      description: 'Focus on empathetic messaging and support resources.',
      descriptionAr: 'التركيز على رسائل متعاطفة وموارد الدعم.',
      targetAudience: ['PR Teams', 'Community Managers'],
      expectedImpact: 'Improved public perception and trust',
      expectedImpactAr: 'تحسين الصورة العامة والثقة',
    });
  }
  
  // 4. تحليل الفرح والأمل المرتفع
  if (emotions.joy > 60 && emotions.hope > 60) {
    insights.push({
      id: 'positive_sentiment',
      category: 'opportunity',
      title: 'Positive Public Sentiment',
      titleAr: 'مشاعر إيجابية عامة',
      description: `Joy (${emotions.joy.toFixed(0)}%) and Hope (${emotions.hope.toFixed(0)}%) indicate favorable conditions for engagement.`,
      descriptionAr: `الفرح (${emotions.joy.toFixed(0)}%) والأمل (${emotions.hope.toFixed(0)}%) يشيران إلى ظروف مواتية للتفاعل.`,
      confidence: 90,
      actionable: true,
    });
    
    recommendations.push({
      id: 'opportunity_rec',
      priority: 'high',
      title: 'Capitalize on Positive Momentum',
      titleAr: 'استغلال الزخم الإيجابي',
      description: 'Ideal time for announcements, launches, or community engagement.',
      descriptionAr: 'وقت مثالي للإعلانات أو الإطلاقات أو التفاعل المجتمعي.',
      targetAudience: ['Marketing Teams', 'Leadership'],
      expectedImpact: 'Higher engagement and positive reception',
      expectedImpactAr: 'تفاعل أعلى واستقبال إيجابي',
    });
  }
  
  // === تحليل المؤشرات ===
  
  // 5. مؤشر الخوف الجماعي (CFI)
  if (indices.cfi > 70) {
    alerts.push({
      id: 'cfi_critical',
      level: 'critical',
      title: 'Collective Fear Index Critical',
      titleAr: 'مؤشر الخوف الجماعي حرج',
      message: `CFI at ${indices.cfi.toFixed(1)}/100 - Potential social crisis within 72 hours`,
      messageAr: `مؤشر الخوف عند ${indices.cfi.toFixed(1)}/100 - احتمالية أزمة اجتماعية خلال 72 ساعة`,
      timestamp: new Date(),
      actionRequired: true,
      suggestedActions: [
        'Activate crisis management team',
        'Prepare official statements',
        'Monitor social media closely',
      ],
      suggestedActionsAr: [
        'تفعيل فريق إدارة الأزمات',
        'إعداد بيانات رسمية',
        'مراقبة وسائل التواصل عن كثب',
      ],
    });
    
    predictions.push({
      id: 'crisis_prediction',
      type: 'crisis',
      probability: Math.min(95, indices.cfi + 5),
      timeframe: '24-72 hours',
      description: 'High probability of social unrest or crisis escalation',
      descriptionAr: 'احتمالية عالية لاضطرابات اجتماعية أو تصاعد الأزمة',
      basedOn: ['CFI > 70', 'Fear + Anger combination'],
      confidence: 80,
    });
  }
  
  // 6. مؤشر الأمل والمرونة (HRI)
  if (indices.hri > 60) {
    insights.push({
      id: 'high_resilience',
      category: 'stability',
      title: 'Strong Community Resilience',
      titleAr: 'مرونة مجتمعية قوية',
      description: `HRI at ${indices.hri.toFixed(1)}/100 indicates the community is coping well and maintaining hope.`,
      descriptionAr: `مؤشر المرونة عند ${indices.hri.toFixed(1)}/100 يشير إلى تأقلم جيد وحفاظ على الأمل.`,
      confidence: 85,
      actionable: false,
    });
    
    predictions.push({
      id: 'recovery_prediction',
      type: 'recovery',
      probability: indices.hri,
      timeframe: '1-2 weeks',
      description: 'Community likely to recover and stabilize',
      descriptionAr: 'من المرجح أن يتعافى المجتمع ويستقر',
      basedOn: ['High HRI', 'Hope levels'],
      confidence: 75,
    });
  }
  
  // 7. مؤشر المزاج العام (GMI)
  if (indices.gmi < -30) {
    insights.push({
      id: 'negative_mood',
      category: 'crisis',
      title: 'Severely Negative Public Mood',
      titleAr: 'مزاج عام سلبي للغاية',
      description: `GMI at ${indices.gmi.toFixed(1)}/100 indicates widespread negativity requiring immediate attention.`,
      descriptionAr: `مؤشر المزاج عند ${indices.gmi.toFixed(1)}/100 يشير إلى سلبية واسعة تتطلب اهتماماً فورياً.`,
      confidence: 90,
      actionable: true,
    });
  } else if (indices.gmi > 30) {
    insights.push({
      id: 'positive_mood',
      category: 'opportunity',
      title: 'Positive Public Mood',
      titleAr: 'مزاج عام إيجابي',
      description: `GMI at ${indices.gmi.toFixed(1)}/100 indicates favorable public sentiment.`,
      descriptionAr: `مؤشر المزاج عند ${indices.gmi.toFixed(1)}/100 يشير إلى مشاعر عامة إيجابية.`,
      confidence: 85,
      actionable: true,
    });
  }
  
  // === توليد الملخص ===
  const summary = generateSummary(data, insights, alerts);
  
  return {
    insights,
    alerts,
    recommendations,
    predictions,
    summary,
  };
}

/**
 * توليد ملخص التحليل
 */
function generateSummary(
  data: AnalysisData,
  insights: Insight[],
  alerts: Alert[]
): AnalysisInsights['summary'] {
  const { emotions, indices } = data;
  
  // تحديد المشاعر العامة
  let overallSentiment: AnalysisInsights['summary']['overallSentiment'] = 'neutral';
  let overallSentimentAr = 'محايد';
  
  if (indices.gmi < -50) {
    overallSentiment = 'very_negative';
    overallSentimentAr = 'سلبي جداً';
  } else if (indices.gmi < -20) {
    overallSentiment = 'negative';
    overallSentimentAr = 'سلبي';
  } else if (indices.gmi > 50) {
    overallSentiment = 'very_positive';
    overallSentimentAr = 'إيجابي جداً';
  } else if (indices.gmi > 20) {
    overallSentiment = 'positive';
    overallSentimentAr = 'إيجابي';
  }
  
  // تحديد مستوى المخاطر
  let riskLevel: AnalysisInsights['summary']['riskLevel'] = 'low';
  let riskLevelAr = 'منخفض';
  
  const criticalAlerts = alerts.filter(a => a.level === 'critical').length;
  const warningAlerts = alerts.filter(a => a.level === 'warning').length;
  
  if (criticalAlerts > 0 || indices.cfi > 80) {
    riskLevel = 'critical';
    riskLevelAr = 'حرج';
  } else if (warningAlerts > 0 || indices.cfi > 60) {
    riskLevel = 'high';
    riskLevelAr = 'مرتفع';
  } else if (indices.cfi > 40) {
    riskLevel = 'medium';
    riskLevelAr = 'متوسط';
  } else if (indices.cfi < 20) {
    riskLevel = 'minimal';
    riskLevelAr = 'ضئيل';
  }
  
  // تحديد مستوى الفرص
  let opportunityLevel: AnalysisInsights['summary']['opportunityLevel'] = 'none';
  let opportunityLevelAr = 'لا يوجد';
  
  if (emotions.joy > 70 && emotions.hope > 70) {
    opportunityLevel = 'high';
    opportunityLevelAr = 'مرتفع';
  } else if (emotions.joy > 50 || emotions.hope > 50) {
    opportunityLevel = 'medium';
    opportunityLevelAr = 'متوسط';
  } else if (emotions.joy > 30 || emotions.hope > 30) {
    opportunityLevel = 'low';
    opportunityLevelAr = 'منخفض';
  }
  
  // توليد الرسالة الرئيسية
  let keyMessage = '';
  let keyMessageAr = '';
  
  if (riskLevel === 'critical') {
    keyMessage = `⚠️ CRITICAL: Community in crisis state. Immediate intervention recommended. ${criticalAlerts} critical alert(s) active.`;
    keyMessageAr = `⚠️ حرج: المجتمع في حالة أزمة. يُنصح بالتدخل الفوري. ${criticalAlerts} تنبيه(ات) حرجة نشطة.`;
  } else if (riskLevel === 'high') {
    keyMessage = `⚡ WARNING: Elevated risk levels detected. Monitor closely and prepare response strategies.`;
    keyMessageAr = `⚡ تحذير: مستويات مخاطر مرتفعة. راقب عن كثب وجهز استراتيجيات الاستجابة.`;
  } else if (opportunityLevel === 'high') {
    keyMessage = `✨ OPPORTUNITY: Highly positive sentiment detected. Ideal conditions for engagement and announcements.`;
    keyMessageAr = `✨ فرصة: مشاعر إيجابية عالية. ظروف مثالية للتفاعل والإعلانات.`;
  } else if (overallSentiment === 'neutral') {
    keyMessage = `📊 STABLE: Community sentiment is balanced. Continue monitoring for changes.`;
    keyMessageAr = `📊 مستقر: مشاعر المجتمع متوازنة. استمر في المراقبة للتغييرات.`;
  } else {
    keyMessage = `📈 ${overallSentiment.toUpperCase()}: Current sentiment is ${overallSentiment}. ${insights.length} insight(s) generated.`;
    keyMessageAr = `📈 ${overallSentimentAr}: المشاعر الحالية ${overallSentimentAr}. تم توليد ${insights.length} رؤية.`;
  }
  
  return {
    overallSentiment,
    overallSentimentAr,
    riskLevel,
    riskLevelAr,
    opportunityLevel,
    opportunityLevelAr,
    keyMessage,
    keyMessageAr,
  };
}

/**
 * تنسيق التنبيه للعرض
 */
export function formatAlert(alert: Alert, language: 'en' | 'ar' = 'ar'): string {
  const levelEmoji = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
    positive: '✅',
  };
  
  if (language === 'ar') {
    return `${levelEmoji[alert.level]} ${alert.titleAr}\n${alert.messageAr}`;
  }
  return `${levelEmoji[alert.level]} ${alert.title}\n${alert.message}`;
}

/**
 * تنسيق التنبؤ للعرض
 */
export function formatPrediction(prediction: Prediction, language: 'en' | 'ar' = 'ar'): string {
  const typeEmoji = {
    crisis: '🔴',
    recovery: '🟢',
    escalation: '🟠',
    stabilization: '🟡',
  };
  
  if (language === 'ar') {
    return `${typeEmoji[prediction.type]} ${prediction.descriptionAr}\n📊 الاحتمالية: ${prediction.probability}% | ⏱️ الإطار الزمني: ${prediction.timeframe}`;
  }
  return `${typeEmoji[prediction.type]} ${prediction.description}\n📊 Probability: ${prediction.probability}% | ⏱️ Timeframe: ${prediction.timeframe}`;
}
