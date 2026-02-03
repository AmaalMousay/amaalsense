/**
 * Question Understanding Engine
 * 
 * This is the first layer of the Cognitive Architecture.
 * It doesn't just extract keywords - it UNDERSTANDS what the user really wants to know.
 * 
 * Philosophy:
 * - Every question has a surface meaning and a deep meaning
 * - "لماذا انخفض الذهب؟" → Surface: causes of gold drop
 *                        → Deep: Should I buy/sell? Is this temporary?
 * - We answer BOTH the asked and unasked questions
 */

// What the user is really asking
export interface DeepQuestion {
  // The literal question
  surface: {
    text: string;           // Original question text
    topic: string;          // Main topic (ذهب، دولار، تعليم...)
    questionType: QuestionType;
    keywords: string[];
  };
  
  // What they really want to know
  deep: {
    realIntent: RealIntent;      // What they actually want
    implicitQuestions: string[]; // Questions they didn't ask but need answered
    emotionalNeed: EmotionalNeed; // Are they worried? Curious? Deciding?
    urgency: 'immediate' | 'planning' | 'learning';
  };
  
  // Context clues
  context: {
    isFollowUp: boolean;         // Part of a conversation?
    previousTopic?: string;      // What were we talking about?
    userExpertise: 'beginner' | 'intermediate' | 'expert';
    language: 'ar' | 'en';
  };
  
  // What sources we need
  requiredSources: SourceType[];
  
  // How to respond
  responseStrategy: ResponseStrategy;
}

// Types of questions
export type QuestionType = 
  | 'why'           // لماذا - seeking causes
  | 'what'          // ما/ماذا - seeking information
  | 'how'           // كيف - seeking process/method
  | 'should'        // هل يجب - seeking recommendation
  | 'will'          // هل سيحدث - seeking prediction
  | 'compare'       // مقارنة - seeking comparison
  | 'what_if'       // ماذا لو - seeking scenario
  | 'when'          // متى - seeking timing
  | 'who'           // من - seeking actors
  | 'explain'       // اشرح - seeking explanation
  | 'general';      // General inquiry

// What the user really wants
export type RealIntent = 
  | 'make_decision'     // They need to decide something
  | 'understand_cause'  // They want to understand why
  | 'predict_future'    // They want to know what will happen
  | 'assess_risk'       // They want to know the risks
  | 'find_opportunity'  // They're looking for opportunities
  | 'validate_belief'   // They want confirmation of their belief
  | 'learn_concept'     // They want to learn/understand
  | 'compare_options'   // They're comparing choices
  | 'get_reassurance'   // They're worried and need comfort
  | 'explore_scenario'; // They're exploring possibilities

// Emotional state of the asker
export type EmotionalNeed = 
  | 'anxious'       // Worried, needs reassurance
  | 'curious'       // Just curious, wants to learn
  | 'urgent'        // Needs answer NOW
  | 'skeptical'     // Doubting, needs proof
  | 'hopeful'       // Looking for good news
  | 'confused'      // Doesn't understand, needs clarity
  | 'decisive'      // Ready to act, needs direction
  | 'neutral';      // No strong emotion

// Types of data sources
export type SourceType = 
  | 'emotion_indicators'  // GMI, CFI, HRI
  | 'economic_data'       // Currencies, commodities
  | 'news'                // Recent news
  | 'historical'          // Past data/trends
  | 'expert_knowledge'    // Domain knowledge
  | 'comparison_data'     // Data for comparison
  | 'scenario_models';    // What-if models

// How to structure the response
export interface ResponseStrategy {
  style: 'analytical' | 'advisory' | 'educational' | 'reassuring' | 'comparative';
  depth: 'brief' | 'detailed' | 'comprehensive';
  includeData: boolean;
  includeRecommendation: boolean;
  includeScenarios: boolean;
  tone: 'formal' | 'conversational' | 'urgent';
}

/**
 * Understand a question deeply
 */
export function understandQuestion(
  question: string,
  conversationHistory?: Array<{ role: string; content: string }>
): DeepQuestion {
  const cleanQuestion = question.trim();
  
  // Step 1: Extract surface information
  const surface = extractSurface(cleanQuestion);
  
  // Step 2: Understand deep intent
  const deep = extractDeepIntent(cleanQuestion, surface);
  
  // Step 3: Analyze context
  const context = analyzeContext(cleanQuestion, conversationHistory);
  
  // Step 4: Determine required sources
  const requiredSources = determineRequiredSources(surface, deep);
  
  // Step 5: Plan response strategy
  const responseStrategy = planResponseStrategy(surface, deep, context);
  
  return {
    surface,
    deep,
    context,
    requiredSources,
    responseStrategy
  };
}

/**
 * Extract surface-level information from question
 */
function extractSurface(question: string): DeepQuestion['surface'] {
  const lowerQ = question.toLowerCase();
  
  // Detect question type
  const questionType = detectQuestionType(question);
  
  // Extract topic
  const topic = extractTopic(question);
  
  // Extract keywords
  const keywords = extractKeywords(question);
  
  return {
    text: question,
    topic,
    questionType,
    keywords
  };
}

/**
 * Detect the type of question
 */
function detectQuestionType(question: string): QuestionType {
  const patterns: Array<{ type: QuestionType; patterns: RegExp[] }> = [
    {
      type: 'why',
      patterns: [/لماذا/i, /ليش/i, /لمذا/i, /سبب/i, /why/i, /ما السبب/i, /شن السبب/i]
    },
    {
      type: 'should',
      patterns: [/هل يجب/i, /هل أ/i, /هل ن/i, /should/i, /أشتري/i, /أبيع/i, /أستثمر/i, /نشتري/i, /نبيع/i]
    },
    {
      type: 'will',
      patterns: [/هل سي/i, /هل ست/i, /سيرتفع/i, /سينخفض/i, /will/i, /سيحدث/i, /ستتحسن/i]
    },
    {
      type: 'compare',
      patterns: [/أفضل/i, /أحسن/i, /مقارنة/i, /الفرق/i, /أم/i, /أو/i, /better/i, /compare/i, /versus/i]
    },
    {
      type: 'what_if',
      patterns: [/ماذا لو/i, /لو أن/i, /إذا/i, /what if/i, /لو حدث/i, /لو ارتفع/i, /لو انخفض/i]
    },
    {
      type: 'when',
      patterns: [/متى/i, /when/i, /كم سيستمر/i, /إلى متى/i, /حتى متى/i]
    },
    {
      type: 'how',
      patterns: [/كيف/i, /how/i, /بأي طريقة/i, /ما الطريقة/i]
    },
    {
      type: 'what',
      patterns: [/ما هو/i, /ما هي/i, /ماذا/i, /what/i, /شن/i, /شنو/i]
    },
    {
      type: 'explain',
      patterns: [/اشرح/i, /فسر/i, /وضح/i, /explain/i, /حلل/i]
    }
  ];
  
  for (const { type, patterns: typePatterns } of patterns) {
    for (const pattern of typePatterns) {
      if (pattern.test(question)) {
        return type;
      }
    }
  }
  
  // Check if it's a yes/no question (starts with هل)
  if (/^هل\s/i.test(question)) {
    return 'should'; // Most هل questions are seeking advice
  }
  
  return 'general';
}

/**
 * Extract the main topic from the question
 */
function extractTopic(question: string): string {
  // Topic patterns with their canonical names
  const topicPatterns: Array<{ pattern: RegExp; topic: string }> = [
    // Economic topics
    { pattern: /الذهب|ذهب|gold/i, topic: 'الذهب' },
    { pattern: /الفضة|فضة|silver/i, topic: 'الفضة' },
    { pattern: /الدولار|دولار|dollar|\$/i, topic: 'الدولار' },
    { pattern: /اليورو|يورو|euro|€/i, topic: 'اليورو' },
    { pattern: /النفط|نفط|بترول|oil|petroleum/i, topic: 'النفط' },
    { pattern: /العملات|عملات|currencies/i, topic: 'العملات' },
    { pattern: /البورصة|بورصة|الأسهم|أسهم|stock/i, topic: 'الأسهم' },
    { pattern: /العقارات|عقارات|real estate/i, topic: 'العقارات' },
    { pattern: /البيتكوين|بتكوين|bitcoin|crypto/i, topic: 'العملات الرقمية' },
    
    // Social topics
    { pattern: /التعليم|تعليم|education|مدارس|جامعات/i, topic: 'التعليم' },
    { pattern: /الصحة|صحة|health|طب|مستشفيات/i, topic: 'الصحة' },
    { pattern: /البطالة|بطالة|unemployment|توظيف/i, topic: 'البطالة' },
    { pattern: /الإعلام|إعلام|media|صحافة|أخبار/i, topic: 'الإعلام' },
    
    // Political topics
    { pattern: /الانتخابات|انتخابات|election/i, topic: 'الانتخابات' },
    { pattern: /الحكومة|حكومة|government/i, topic: 'الحكومة' },
    { pattern: /السياسة|سياسة|politics/i, topic: 'السياسة' },
    
    // Countries
    { pattern: /ليبيا|libya/i, topic: 'ليبيا' },
    { pattern: /مصر|egypt/i, topic: 'مصر' },
    { pattern: /السعودية|saudi/i, topic: 'السعودية' },
    { pattern: /أمريكا|america|usa/i, topic: 'أمريكا' },
  ];
  
  for (const { pattern, topic } of topicPatterns) {
    if (pattern.test(question)) {
      return topic;
    }
  }
  
  // If no specific topic found, extract the main noun
  // Remove question words and extract what's left
  const cleaned = question
    .replace(/^(لماذا|ليش|هل|ما|ماذا|كيف|متى|أين|من)\s*/i, '')
    .replace(/\?|؟/g, '')
    .trim();
  
  // Take first meaningful phrase
  const words = cleaned.split(/\s+/);
  if (words.length > 0) {
    return words.slice(0, 3).join(' ');
  }
  
  return 'موضوع عام';
}

/**
 * Extract keywords from the question
 */
function extractKeywords(question: string): string[] {
  const keywords: string[] = [];
  
  // Action keywords
  const actionPatterns = [
    { pattern: /ارتفع|ارتفاع|يرتفع/i, keyword: 'ارتفاع' },
    { pattern: /انخفض|انخفاض|ينخفض/i, keyword: 'انخفاض' },
    { pattern: /استقر|استقرار|يستقر/i, keyword: 'استقرار' },
    { pattern: /تغير|تغيير|يتغير/i, keyword: 'تغيير' },
    { pattern: /أثر|تأثير|يؤثر/i, keyword: 'تأثير' },
    { pattern: /خطر|مخاطر|خطير/i, keyword: 'مخاطر' },
    { pattern: /فرصة|فرص/i, keyword: 'فرصة' },
    { pattern: /شراء|أشتري|نشتري/i, keyword: 'شراء' },
    { pattern: /بيع|أبيع|نبيع/i, keyword: 'بيع' },
    { pattern: /استثمار|أستثمر|نستثمر/i, keyword: 'استثمار' },
  ];
  
  for (const { pattern, keyword } of actionPatterns) {
    if (pattern.test(question)) {
      keywords.push(keyword);
    }
  }
  
  return keywords;
}

/**
 * Extract the deep intent - what the user really wants to know
 */
function extractDeepIntent(question: string, surface: DeepQuestion['surface']): DeepQuestion['deep'] {
  // Determine real intent based on question type and keywords
  const realIntent = determineRealIntent(surface);
  
  // Generate implicit questions - what they didn't ask but need
  const implicitQuestions = generateImplicitQuestions(surface, realIntent);
  
  // Detect emotional need
  const emotionalNeed = detectEmotionalNeed(question, surface);
  
  // Determine urgency
  const urgency = determineUrgency(question, surface);
  
  return {
    realIntent,
    implicitQuestions,
    emotionalNeed,
    urgency
  };
}

/**
 * Determine what the user really wants
 */
function determineRealIntent(surface: DeepQuestion['surface']): RealIntent {
  const { questionType, keywords, topic } = surface;
  
  // Decision-related topics
  const decisionTopics = ['الذهب', 'الفضة', 'الدولار', 'النفط', 'الأسهم', 'العقارات', 'العملات الرقمية'];
  const isDecisionTopic = decisionTopics.some(t => topic.includes(t));
  
  // Keywords that indicate decision-making
  const decisionKeywords = ['شراء', 'بيع', 'استثمار', 'فرصة'];
  const hasDecisionKeyword = keywords.some(k => decisionKeywords.includes(k));
  
  if (questionType === 'should' || hasDecisionKeyword) {
    return 'make_decision';
  }
  
  if (questionType === 'why') {
    return 'understand_cause';
  }
  
  if (questionType === 'will' || questionType === 'when') {
    return 'predict_future';
  }
  
  if (questionType === 'what_if') {
    return 'explore_scenario';
  }
  
  if (questionType === 'compare') {
    return 'compare_options';
  }
  
  if (keywords.includes('مخاطر')) {
    return 'assess_risk';
  }
  
  if (keywords.includes('فرصة')) {
    return 'find_opportunity';
  }
  
  if (questionType === 'explain' || questionType === 'what' || questionType === 'how') {
    return 'learn_concept';
  }
  
  // If economic topic but general question, they probably want to make a decision
  if (isDecisionTopic) {
    return 'make_decision';
  }
  
  return 'learn_concept';
}

/**
 * Generate implicit questions - what they didn't ask but need answered
 */
function generateImplicitQuestions(surface: DeepQuestion['surface'], realIntent: RealIntent): string[] {
  const implicit: string[] = [];
  const { topic, questionType } = surface;
  
  // Based on real intent, add implicit questions
  switch (realIntent) {
    case 'make_decision':
      implicit.push(`ما هو الوقت المناسب للتحرك في ${topic}؟`);
      implicit.push(`ما هي المخاطر المحتملة؟`);
      implicit.push(`ما هو السيناريو الأسوأ؟`);
      break;
      
    case 'understand_cause':
      implicit.push(`هل هذا الوضع مؤقت أم دائم؟`);
      implicit.push(`ما هي العوامل المؤثرة؟`);
      implicit.push(`ماذا يعني هذا للمستقبل؟`);
      break;
      
    case 'predict_future':
      implicit.push(`ما مدى موثوقية هذا التوقع؟`);
      implicit.push(`ما الذي قد يغير هذا التوقع؟`);
      implicit.push(`كيف أستعد لكل سيناريو؟`);
      break;
      
    case 'assess_risk':
      implicit.push(`ما هو أسوأ سيناريو؟`);
      implicit.push(`كيف أحمي نفسي؟`);
      implicit.push(`ما هي علامات الخطر؟`);
      break;
      
    case 'compare_options':
      implicit.push(`ما هو الخيار الأفضل لوضعي؟`);
      implicit.push(`ما هي مزايا وعيوب كل خيار؟`);
      break;
      
    case 'explore_scenario':
      implicit.push(`ما احتمالية حدوث هذا السيناريو؟`);
      implicit.push(`كيف أستعد إذا حدث؟`);
      break;
  }
  
  return implicit;
}

/**
 * Detect the emotional state of the asker
 */
function detectEmotionalNeed(question: string, surface: DeepQuestion['surface']): EmotionalNeed {
  const { keywords, questionType } = surface;
  
  // Anxiety indicators
  if (keywords.includes('مخاطر') || /خطر|خسارة|قلق|خوف/i.test(question)) {
    return 'anxious';
  }
  
  // Urgency indicators
  if (/الآن|فوراً|بسرعة|عاجل/i.test(question)) {
    return 'urgent';
  }
  
  // Hope indicators
  if (keywords.includes('فرصة') || /فرصة|ربح|مكسب|أمل/i.test(question)) {
    return 'hopeful';
  }
  
  // Confusion indicators
  if (/لا أفهم|مش فاهم|محتار|confused/i.test(question)) {
    return 'confused';
  }
  
  // Decision indicators
  if (questionType === 'should' || keywords.includes('شراء') || keywords.includes('بيع')) {
    return 'decisive';
  }
  
  // Learning indicators
  if (questionType === 'explain' || questionType === 'what' || questionType === 'how') {
    return 'curious';
  }
  
  return 'neutral';
}

/**
 * Determine how urgent the question is
 */
function determineUrgency(question: string, surface: DeepQuestion['surface']): 'immediate' | 'planning' | 'learning' {
  const { questionType, keywords } = surface;
  
  // Immediate urgency
  if (/الآن|فوراً|اليوم|هذه اللحظة/i.test(question)) {
    return 'immediate';
  }
  
  if (keywords.includes('شراء') || keywords.includes('بيع')) {
    return 'immediate';
  }
  
  // Planning
  if (questionType === 'will' || questionType === 'when' || questionType === 'what_if') {
    return 'planning';
  }
  
  if (keywords.includes('استثمار')) {
    return 'planning';
  }
  
  // Learning
  if (questionType === 'why' || questionType === 'explain' || questionType === 'what') {
    return 'learning';
  }
  
  return 'planning';
}

/**
 * Analyze conversation context
 */
function analyzeContext(
  question: string,
  conversationHistory?: Array<{ role: string; content: string }>
): DeepQuestion['context'] {
  const isFollowUp = conversationHistory && conversationHistory.length > 0;
  const previousTopic = isFollowUp 
    ? extractTopic(conversationHistory![conversationHistory!.length - 1].content)
    : undefined;
  
  // Detect language
  const language = /[a-zA-Z]/.test(question) && !/[\u0600-\u06FF]/.test(question) ? 'en' : 'ar';
  
  // Estimate user expertise (simple heuristic)
  const expertTerms = /مؤشر|تحليل فني|RSI|MACD|فيبوناتشي|هيدج|مشتقات/i;
  const userExpertise = expertTerms.test(question) ? 'expert' : 
                        /استثمار|محفظة|تنويع/i.test(question) ? 'intermediate' : 'beginner';
  
  return {
    isFollowUp: !!isFollowUp,
    previousTopic,
    userExpertise,
    language
  };
}

/**
 * Determine what data sources we need
 */
function determineRequiredSources(
  surface: DeepQuestion['surface'],
  deep: DeepQuestion['deep']
): SourceType[] {
  const sources: SourceType[] = ['emotion_indicators']; // Always need this
  
  const { topic, questionType } = surface;
  const { realIntent } = deep;
  
  // Economic topics need economic data
  const economicTopics = ['الذهب', 'الفضة', 'الدولار', 'النفط', 'الأسهم', 'العقارات', 'العملات الرقمية', 'اليورو', 'العملات'];
  if (economicTopics.some(t => topic.includes(t))) {
    sources.push('economic_data');
  }
  
  // Why questions need news
  if (questionType === 'why' || realIntent === 'understand_cause') {
    sources.push('news');
  }
  
  // Prediction questions need historical data
  if (questionType === 'will' || questionType === 'when' || realIntent === 'predict_future') {
    sources.push('historical');
  }
  
  // Comparison questions need comparison data
  if (questionType === 'compare' || realIntent === 'compare_options') {
    sources.push('comparison_data');
  }
  
  // What-if questions need scenario models
  if (questionType === 'what_if' || realIntent === 'explore_scenario') {
    sources.push('scenario_models');
  }
  
  // Complex questions need expert knowledge
  if (realIntent === 'make_decision' || realIntent === 'assess_risk') {
    sources.push('expert_knowledge');
  }
  
  return Array.from(new Set(sources)); // Remove duplicates
}

/**
 * Plan how to respond
 */
function planResponseStrategy(
  surface: DeepQuestion['surface'],
  deep: DeepQuestion['deep'],
  context: DeepQuestion['context']
): ResponseStrategy {
  const { questionType } = surface;
  const { realIntent, emotionalNeed, urgency } = deep;
  const { userExpertise } = context;
  
  // Determine style
  let style: ResponseStrategy['style'] = 'analytical';
  if (realIntent === 'make_decision') style = 'advisory';
  if (realIntent === 'learn_concept') style = 'educational';
  if (emotionalNeed === 'anxious') style = 'reassuring';
  if (realIntent === 'compare_options') style = 'comparative';
  
  // Determine depth
  let depth: ResponseStrategy['depth'] = 'detailed';
  if (urgency === 'immediate') depth = 'brief';
  if (realIntent === 'learn_concept' && userExpertise === 'beginner') depth = 'comprehensive';
  
  // Determine what to include
  const includeData = realIntent === 'make_decision' || realIntent === 'assess_risk';
  const includeRecommendation = realIntent === 'make_decision' || realIntent === 'assess_risk' || realIntent === 'find_opportunity';
  const includeScenarios = realIntent === 'explore_scenario' || realIntent === 'predict_future' || realIntent === 'assess_risk';
  
  // Determine tone
  let tone: ResponseStrategy['tone'] = 'conversational';
  if (urgency === 'immediate') tone = 'urgent';
  if (userExpertise === 'expert') tone = 'formal';
  
  return {
    style,
    depth,
    includeData,
    includeRecommendation,
    includeScenarios,
    tone
  };
}

// Export for testing
export {
  detectQuestionType,
  extractTopic,
  extractKeywords,
  determineRealIntent,
  detectEmotionalNeed
};
