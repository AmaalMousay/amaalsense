/**
 * Dynamic Template Builder
 * 
 * يبني الهيكل ديناميكياً حسب السياق
 * 
 * المتغيرات الثلاثة:
 * 1. userLevel - مستوى المستخدم (مبتدئ/خبير)
 * 2. conversationDepth - عمق الحوار (أول رسالة/حوار مستمر)
 * 3. emotionalState - الحالة العاطفية (هادئ/قلق/عاجل)
 * 
 * الفرق:
 * - Template ثابت = روبوت يكرر نفسه
 * - Dynamic Template = عقل مرن يتكيف مع السياق
 */

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';
export type ConversationDepth = 'first_turn' | 'follow_up' | 'deep_conversation';
export type EmotionalState = 'calm' | 'curious' | 'anxious' | 'urgent';

export interface TemplateContext {
  userLevel: UserLevel;
  conversationDepth: ConversationDepth;
  emotionalState: EmotionalState;
  previousTopics: string[];
  turnCount: number;
  lastResponseTime?: number;
}

export interface TemplateStyle {
  // طول الرد
  responseLength: 'short' | 'medium' | 'detailed';
  // مستوى التفصيل
  detailLevel: 'minimal' | 'standard' | 'comprehensive';
  // نبرة الرد
  tone: 'direct' | 'explanatory' | 'reassuring' | 'urgent';
  // تضمين الأرقام
  includeNumbers: boolean;
  // تضمين الشرح
  includeExplanation: boolean;
  // تضمين السياق السابق
  referencePreviousContext: boolean;
  // تضمين المصطلحات التقنية
  useTechnicalTerms: boolean;
}

/**
 * اكتشاف مستوى المستخدم من تاريخ المحادثة
 */
export function detectUserLevel(
  turnCount: number,
  questionsAsked: string[],
  previousTopics: string[]
): UserLevel {
  // مؤشرات المستخدم الخبير
  const advancedIndicators = [
    'GMI', 'CFI', 'HRI', 'مؤشر', 'تحليل', 'سيناريو', 'توقع',
    'correlation', 'trend', 'sentiment', 'analysis'
  ];
  
  // التحقق من استخدام مصطلحات متقدمة
  const allText = questionsAsked.join(' ').toLowerCase();
  const advancedTermsUsed = advancedIndicators.filter(term => 
    allText.includes(term.toLowerCase())
  ).length;
  
  // المستخدم الخبير: استخدم 3+ مصطلحات متقدمة أو 10+ رسائل
  if (advancedTermsUsed >= 3 || turnCount >= 10) {
    return 'advanced';
  }
  
  // المستخدم المتوسط: 2+ رسائل أو مصطلح متقدم واحد
  if (turnCount >= 2 || advancedTermsUsed >= 1) {
    return 'intermediate';
  }
  
  return 'beginner';
}

/**
 * تحديد عمق المحادثة
 */
export function determineConversationDepth(
  turnCount: number,
  previousTopics: string[],
  currentTopic: string
): ConversationDepth {
  // أول رسالة
  if (turnCount <= 1) {
    return 'first_turn';
  }
  
  // التحقق من استمرار نفس الموضوع
  const sameTopic = previousTopics.some(topic => 
    topic.toLowerCase().includes(currentTopic.toLowerCase()) ||
    currentTopic.toLowerCase().includes(topic.toLowerCase())
  );
  
  // حوار عميق: 5+ رسائل في نفس الموضوع
  if (turnCount >= 5 && sameTopic) {
    return 'deep_conversation';
  }
  
  return 'follow_up';
}

/**
 * تحديد الحالة العاطفية من المؤشرات
 */
export function determineEmotionalState(
  cfi: number,
  gmi: number,
  userQuestion?: string
): EmotionalState {
  // كلمات تدل على الاستعجال
  const urgentWords = ['عاجل', 'فوري', 'الآن', 'سريع', 'خطر', 'urgent', 'immediately', 'now'];
  const anxiousWords = ['قلق', 'خائف', 'مخاوف', 'worried', 'concerned', 'afraid'];
  
  if (userQuestion) {
    const lowerQuestion = userQuestion.toLowerCase();
    
    if (urgentWords.some(w => lowerQuestion.includes(w))) {
      return 'urgent';
    }
    
    if (anxiousWords.some(w => lowerQuestion.includes(w))) {
      return 'anxious';
    }
  }
  
  // بناءً على المؤشرات
  if (cfi > 70) {
    return 'anxious';
  }
  
  if (cfi > 50 && gmi < -20) {
    return 'anxious';
  }
  
  if (Math.abs(gmi) < 20 && cfi < 50) {
    return 'calm';
  }
  
  return 'curious';
}

/**
 * بناء أسلوب القالب بناءً على السياق
 */
export function buildTemplateStyle(context: TemplateContext): TemplateStyle {
  const { userLevel, conversationDepth, emotionalState } = context;
  
  // الإعدادات الافتراضية
  let style: TemplateStyle = {
    responseLength: 'medium',
    detailLevel: 'standard',
    tone: 'explanatory',
    includeNumbers: true,
    includeExplanation: true,
    referencePreviousContext: false,
    useTechnicalTerms: false
  };
  
  // تعديل حسب مستوى المستخدم
  switch (userLevel) {
    case 'beginner':
      style.detailLevel = 'comprehensive';
      style.includeExplanation = true;
      style.useTechnicalTerms = false;
      style.responseLength = 'detailed';
      break;
    case 'intermediate':
      style.detailLevel = 'standard';
      style.includeExplanation = true;
      style.useTechnicalTerms = false;
      break;
    case 'advanced':
      style.detailLevel = 'minimal';
      style.includeExplanation = false;
      style.useTechnicalTerms = true;
      style.responseLength = 'short';
      style.includeNumbers = true;
      break;
  }
  
  // تعديل حسب عمق المحادثة
  switch (conversationDepth) {
    case 'first_turn':
      style.referencePreviousContext = false;
      style.includeExplanation = true;
      break;
    case 'follow_up':
      style.referencePreviousContext = true;
      style.responseLength = 'medium';
      break;
    case 'deep_conversation':
      style.referencePreviousContext = true;
      style.responseLength = 'short';
      style.detailLevel = 'minimal';
      break;
  }
  
  // تعديل حسب الحالة العاطفية
  switch (emotionalState) {
    case 'calm':
      style.tone = 'explanatory';
      break;
    case 'curious':
      style.tone = 'explanatory';
      style.includeExplanation = true;
      break;
    case 'anxious':
      style.tone = 'reassuring';
      style.responseLength = 'medium';
      break;
    case 'urgent':
      style.tone = 'direct';
      style.responseLength = 'short';
      style.detailLevel = 'minimal';
      style.includeExplanation = false;
      break;
  }
  
  return style;
}

/**
 * توليد مقدمة ديناميكية حسب السياق
 */
export function generateDynamicIntro(
  context: TemplateContext,
  topic: string
): string {
  const { conversationDepth, previousTopics, emotionalState } = context;
  
  // أول رسالة
  if (conversationDepth === 'first_turn') {
    return '';  // لا مقدمة، نبدأ بالخلاصة مباشرة
  }
  
  // متابعة في نفس الموضوع
  if (conversationDepth === 'follow_up' && previousTopics.length > 0) {
    const lastTopic = previousTopics[previousTopics.length - 1];
    if (lastTopic.toLowerCase().includes(topic.toLowerCase())) {
      return 'استكمالاً لما ناقشناه، ';
    }
    return 'بخصوص سؤالك الجديد، ';
  }
  
  // حوار عميق
  if (conversationDepth === 'deep_conversation') {
    if (emotionalState === 'anxious') {
      return 'أفهم قلقك. ';
    }
    return 'بناءً على حوارنا، ';
  }
  
  return '';
}

/**
 * توليد خاتمة ديناميكية حسب السياق
 */
export function generateDynamicClosing(
  context: TemplateContext,
  style: TemplateStyle
): string {
  const { userLevel, conversationDepth, emotionalState } = context;
  
  // للمستخدم القلق
  if (emotionalState === 'anxious') {
    return 'هل تحتاج توضيحاً إضافياً لأي نقطة؟';
  }
  
  // للمستخدم العاجل
  if (emotionalState === 'urgent') {
    return 'هل هناك شيء آخر تحتاجه الآن؟';
  }
  
  // للمستخدم الخبير
  if (userLevel === 'advanced') {
    return 'هل تريد تحليلاً أعمق لجانب معين؟';
  }
  
  // للحوار العميق
  if (conversationDepth === 'deep_conversation') {
    return 'هل نستكشف سيناريو محدد؟';
  }
  
  // الافتراضي
  const questions = [
    'هل تحب أحاكي سيناريو معين؟',
    'هل نركز على جانب محدد؟',
    'هل تريد مقارنة بفترة سابقة؟'
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * تعديل طول الفقرات حسب الأسلوب
 */
export function adjustContentLength(
  content: string,
  style: TemplateStyle
): string {
  const sentences = content.split(/[.،!؟]/g).filter(s => s.trim().length > 0);
  
  switch (style.responseLength) {
    case 'short':
      // أول 2 جمل فقط
      return sentences.slice(0, 2).join('. ') + '.';
    case 'medium':
      // أول 4 جمل
      return sentences.slice(0, 4).join('. ') + '.';
    case 'detailed':
      // كل المحتوى
      return content;
    default:
      return content;
  }
}

/**
 * تعديل الأرقام حسب مستوى المستخدم
 */
export function formatNumbers(
  text: string,
  style: TemplateStyle
): string {
  if (!style.includeNumbers) {
    // إزالة الأرقام وتحويلها لوصف
    return text
      .replace(/(\d+)%/g, (match, num) => {
        const n = parseInt(num);
        if (n > 70) return 'مرتفع جداً';
        if (n > 50) return 'مرتفع';
        if (n > 30) return 'متوسط';
        return 'منخفض';
      });
  }
  return text;
}

/**
 * بناء السياق الكامل
 */
export function buildTemplateContext(
  turnCount: number,
  previousTopics: string[],
  currentTopic: string,
  questionsAsked: string[],
  cfi: number,
  gmi: number,
  userQuestion?: string,
  savedUserLevel?: UserLevel  // مستوى المستخدم المحفوظ من قاعدة البيانات
): TemplateContext {
  // إذا كان المستوى محفوظاً، نستخدمه مباشرة
  // وإلا نكتشفه من السياق
  const userLevel = savedUserLevel || detectUserLevel(turnCount, questionsAsked, previousTopics);
  
  return {
    userLevel,
    conversationDepth: determineConversationDepth(turnCount, previousTopics, currentTopic),
    emotionalState: determineEmotionalState(cfi, gmi, userQuestion),
    previousTopics,
    turnCount
  };
}

/**
 * بناء السياق مع بروفايل المستخدم المحفوظ
 */
export interface UserProfileContext {
  userLevel: UserLevel;
  conversationCount: number;
  messageCount: number;
  preferredTopics: string[];
  preferredResponseLength: 'short' | 'medium' | 'detailed';
}

export function buildTemplateContextWithProfile(
  turnCount: number,
  previousTopics: string[],
  currentTopic: string,
  questionsAsked: string[],
  cfi: number,
  gmi: number,
  userQuestion: string | undefined,
  userProfile: UserProfileContext
): TemplateContext {
  // استخدام المستوى المحفوظ من البروفايل
  // مع إمكانية الترقية إذا أظهر المستخدم مستوى أعلى في هذه الجلسة
  const detectedLevel = detectUserLevel(turnCount, questionsAsked, previousTopics);
  
  // اختيار المستوى الأعلى بين المحفوظ والمكتشف
  const levelOrder: UserLevel[] = ['beginner', 'intermediate', 'advanced'];
  const savedIndex = levelOrder.indexOf(userProfile.userLevel);
  const detectedIndex = levelOrder.indexOf(detectedLevel);
  const userLevel = levelOrder[Math.max(savedIndex, detectedIndex)];
  
  // تعديل عمق المحادثة بناءً على تاريخ المستخدم
  let conversationDepth = determineConversationDepth(turnCount, previousTopics, currentTopic);
  
  // إذا كان المستخدم لديه تاريخ طويل، نعتبره في حوار عميق
  if (userProfile.conversationCount >= 5 && turnCount >= 2) {
    conversationDepth = 'deep_conversation';
  }
  
  return {
    userLevel,
    conversationDepth,
    emotionalState: determineEmotionalState(cfi, gmi, userQuestion),
    previousTopics: [...userProfile.preferredTopics.slice(0, 5), ...previousTopics],
    turnCount: turnCount + userProfile.messageCount  // إجمالي الرسائل
  };
}

export default {
  detectUserLevel,
  determineConversationDepth,
  buildTemplateContextWithProfile,
  determineEmotionalState,
  buildTemplateStyle,
  generateDynamicIntro,
  generateDynamicClosing,
  adjustContentLength,
  formatNumbers,
  buildTemplateContext
};
