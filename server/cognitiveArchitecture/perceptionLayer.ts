/**
 * Perception Layer - طبقة الإدراك
 * 
 * تضيف طبقة إدراك عميقة للفهم الحقيقي للسياق والعاطفة
 * بدلاً من استخدام قوالب ثابتة
 */

export interface PerceptionContext {
  topic: string;
  primaryEmotion: string;
  secondaryEmotions: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  affectedGroups: string[];
  rootCause: string;
  collectiveConsciousness: string;
  awarenessLevel: 'surface' | 'moderate' | 'deep';
}

export interface ResponseDirective {
  focus: 'solution' | 'explanation' | 'warning' | 'hope' | 'action';
  depth: 'brief' | 'moderate' | 'deep';
  tone: 'urgent' | 'analytical' | 'empathetic' | 'advisory';
  shouldAvoidTemplate: boolean;
  contextValidation: string[];
}

/**
 * تحليل السياق الحقيقي للسؤال
 * بدلاً من تطبيق قالب ثابت
 */
export function analyzePerception(
  question: string,
  previousContext: string,
  analysisData: any
): PerceptionContext {
  // استخراج الموضوع الأساسي
  const topic = extractTopic(question, previousContext);
  
  // تحديد العاطفة الأساسية من البيانات
  const emotions = analysisData.emotions || {};
  const primaryEmotion = Object.entries(emotions).sort((a, b) => (b as any)[1] - (a as any)[1])[0]?.[0] || 'neutral';
  const secondaryEmotions = Object.entries(emotions)
    .sort((a, b) => (b as any)[1] - (a as any)[1])
    .slice(1, 3)
    .map(e => e[0]);
  
  // تحديد الاستعجالية
  const urgency = determineUrgency(primaryEmotion, analysisData);
  
  // تحديد المجموعات المتأثرة
  const affectedGroups = identifyAffectedGroups(analysisData);
  
  // تحديد السبب الجذري
  const rootCause = identifyRootCause(question, analysisData);
  
  // فهم الوعي الجمعي
  const collectiveConsciousness = analyzeCollectiveConsciousness(analysisData);
  
  // مستوى الوعي
  const awarenessLevel = determineAwarenessLevel(analysisData);
  
  return {
    topic,
    primaryEmotion,
    secondaryEmotions,
    urgency,
    affectedGroups,
    rootCause,
    collectiveConsciousness,
    awarenessLevel,
  };
}

/**
 * تحديد التوجيه المناسب للرد
 * بدلاً من استخدام قالب ثابت
 */
export function determineResponseDirective(
  perception: PerceptionContext,
  question: string,
  isFollowUp: boolean
): ResponseDirective {
  // تحليل نوع السؤال
  const questionType = classifyQuestion(question);
  
  // تحديد التركيز
  let focus: 'solution' | 'explanation' | 'warning' | 'hope' | 'action' = 'explanation';
  
  if (questionType === 'how' || questionType === 'solution') {
    focus = 'solution';
  } else if (questionType === 'what-if') {
    focus = 'warning';
  } else if (questionType === 'impact') {
    focus = 'action';
  } else if (perception.urgency === 'critical') {
    focus = 'warning';
  }
  
  // تحديد العمق
  let depth: 'brief' | 'moderate' | 'deep' = 'moderate';
  if (isFollowUp) {
    depth = 'brief';
  } else if (perception.awarenessLevel === 'surface') {
    depth = 'deep';
  }
  
  // تحديد النبرة
  let tone: 'urgent' | 'analytical' | 'empathetic' | 'advisory' = 'analytical';
  if (perception.urgency === 'critical') {
    tone = 'urgent';
  } else if (perception.primaryEmotion === 'fear' || perception.primaryEmotion === 'sadness') {
    tone = 'empathetic';
  } else if (focus === 'solution') {
    tone = 'advisory';
  }
  
  // التحقق من السياق
  const contextValidation = validateContext(perception, question);
  
  return {
    focus,
    depth,
    tone,
    shouldAvoidTemplate: true, // دائماً تجنب القالب الثابت
    contextValidation,
  };
}

/**
 * استخراج الموضوع الأساسي
 */
function extractTopic(question: string, previousContext: string): string {
  // إذا كان هناك سياق سابق، استخدمه
  if (previousContext) {
    const topicMatch = previousContext.match(/موضوع:\s*([^\n]+)/);
    if (topicMatch) return topicMatch[1];
  }
  
  // استخراج من السؤال
  const words = question.split(' ');
  return words.slice(0, 5).join(' ');
}

/**
 * تحديد استعجالية الموقف
 */
function determineUrgency(emotion: string, data: any): 'critical' | 'high' | 'medium' | 'low' {
  if (emotion === 'fear' || emotion === 'anger') {
    return data.gmi < -50 ? 'critical' : 'high';
  }
  if (emotion === 'sadness') {
    return 'medium';
  }
  return 'low';
}

/**
 * تحديد المجموعات المتأثرة
 */
function identifyAffectedGroups(data: any): string[] {
  const groups: string[] = [];
  
  if (data.demographics) {
    data.demographics.forEach((demo: any) => {
      if (demo.opposition > 60) {
        groups.push(`${demo.label} (${demo.opposition}% معارضة)`);
      }
    });
  }
  
  return groups;
}

/**
 * تحديد السبب الجذري
 */
function identifyRootCause(question: string, data: any): string {
  // تحليل السؤال والبيانات لتحديد السبب الحقيقي
  if (question.toLowerCase().includes('غضب') || question.toLowerCase().includes('غضب')) {
    return 'تدهور الظروف المعيشية والشعور بالظلم';
  }
  
  if (question.toLowerCase().includes('خوف')) {
    return 'عدم اليقين والتهديدات الوجودية';
  }
  
  return 'عوامل متعددة معقدة';
}

/**
 * تحليل الوعي الجمعي
 */
function analyzeCollectiveConsciousness(data: any): string {
  const gmi = data.gmi || 0;
  const cfi = data.cfi || 50;
  const hri = data.hri || 50;
  
  if (gmi < -50) {
    return 'وعي جمعي متشائم يسيطر عليه الخوف والغضب';
  }
  
  if (gmi > 50) {
    return 'وعي جمعي متفائل يسيطر عليه الأمل والرغبة في التغيير';
  }
  
  return 'وعي جمعي متوازن بين التفاؤل والتشاؤم';
}

/**
 * تحديد مستوى الوعي
 */
function determineAwarenessLevel(data: any): 'surface' | 'moderate' | 'deep' {
  const confidence = data.confidence || 0;
  
  if (confidence > 80) {
    return 'deep';
  }
  
  if (confidence > 60) {
    return 'moderate';
  }
  
  return 'surface';
}

/**
 * تصنيف نوع السؤال
 */
function classifyQuestion(question: string): string {
  if (question.toLowerCase().includes('كيف')) {
    return 'how';
  }
  
  if (question.toLowerCase().includes('ماذا لو') || question.toLowerCase().includes('ماذا لو')) {
    return 'what-if';
  }
  
  if (question.toLowerCase().includes('تأثير') || question.toLowerCase().includes('تأثير')) {
    return 'impact';
  }
  
  if (question.toLowerCase().includes('حل') || question.toLowerCase().includes('حل')) {
    return 'solution';
  }
  
  return 'general';
}

/**
 * التحقق من صحة السياق
 */
function validateContext(perception: PerceptionContext, question: string): string[] {
  const validations: string[] = [];
  
  // التأكد من أن الموضوع لم يتغير
  if (!question.toLowerCase().includes(perception.topic.toLowerCase())) {
    validations.push(`تحذير: قد يكون الموضوع قد تغير من "${perception.topic}"`);
  }
  
  // التأكد من أن العاطفة الأساسية واضحة
  if (perception.primaryEmotion === 'neutral') {
    validations.push('تحذير: العاطفة الأساسية غير واضحة');
  }
  
  return validations;
}
