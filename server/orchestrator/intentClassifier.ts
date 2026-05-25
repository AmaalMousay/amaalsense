/**
 * Intent Classifier
 * 
 * Classifies user questions into specific intents to determine
 * which engines and processing paths are needed.
 * 
 * This is the "brain" that decides WHAT to do before doing it.
 */

// Intent types that the system can handle
export type IntentType = 
  | 'analysis'        // User wants emotional analysis of a topic
  | 'interpretation'  // User wants explanation of indicators
  | 'prediction'      // User wants future forecasts
  | 'comparison'      // User wants to compare countries/topics
  | 'recommendation'  // User wants actionable advice
  | 'clarification'   // User wants to understand something better
  | 'greeting'        // Simple greeting/chitchat
  | 'unknown';        // Cannot determine intent

// Sub-intents for more granular control
export type SubIntent = 
  | 'risk_assessment'     // Is it dangerous?
  | 'opportunity_check'   // Is it a good time?
  | 'trend_analysis'      // How is it changing?
  | 'cause_explanation'   // Why is this happening?
  | 'action_guidance'     // What should I do?
  | 'indicator_meaning'   // What does GMI/CFI mean?
  | 'scenario_planning'   // What if X happens?
  | 'general';

// Classified intent result
export interface ClassifiedIntent {
  primary: IntentType;
  sub: SubIntent;
  confidence: number;
  requiredEngines: RequiredEngine[];
  needsLLM: boolean;
  needsRAG: boolean;
  context: {
    topic?: string;
    country?: string;
    timeframe?: string;
    entities: string[];
  };
}

// Engines that might be needed
export type RequiredEngine = 
  | 'emotion'       // Emotion analysis
  | 'dcft'          // DCFT calculations (GMI, CFI, HRI)
  | 'meta'          // Meta decision engine
  | 'forecast'      // Prediction engine
  | 'news'          // News fetching
  | 'social'        // Social media analysis
  | 'historical';   // Historical data lookup

// Intent patterns for classification
const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
  analysis: [
    /(?:|analyze||analysis|  |what is the situation|how is|)/i,
    /(?:mood||sentiment||emotion|)/i,
    /(?:collective||public|)/i,
  ],
  interpretation: [
    /(?: |what does .* mean|explain|||interpret)/i,
    /(?:GMI|CFI|HRI||indicator|index)/i,
    /(?:why is|||reason)/i,
  ],
  prediction: [
    /(?:|predict|forecast| |what will happen|future|)/i,
    /(?:next||tomorrow||week||month|)/i,
    /(?:expect||anticipate)/i,
  ],
  comparison: [
    /(?:|compare||versus|vs||between|difference|)/i,
    /(?:better||worse||more||less|)/i,
  ],
  recommendation: [
    /(?: |should I buy| |should I sell| |what should I do)/i,
    /(?:recommend||advice||suggest|)/i,
    /(?:safe||risky||dangerous|)/i,
  ],
  clarification: [
    /(?: |what is| |who is||where||when)/i,
    /(?:define||meaning|)/i,
  ],
  greeting: [
    /(?:^hi$|^hello$|^$|^ $|^$|^hey$)/i,
    /(?:how are you| ||thank)/i,
  ],
  unknown: [],
};

// Sub-intent patterns
const SUB_INTENT_PATTERNS: Record<SubIntent, RegExp[]> = {
  risk_assessment: [
    /(?:||risk|danger|safe||threat|)/i,
    /(?:worry||concern||afraid|)/i,
  ],
  opportunity_check: [
    /(?:|opportunity|chance|buy||invest|)/i,
    /(?:good time| |right moment)/i,
  ],
  trend_analysis: [
    /(?:trend||direction||change|rising||falling|)/i,
    /(?:over time| |history|)/i,
  ],
  cause_explanation: [
    /(?:why||because||reason||cause|)/i,
    /(?:explain||understand|)/i,
  ],
  action_guidance: [
    /(?:what should| |do||action||step|)/i,
    /(?:recommend||suggest|)/i,
  ],
  indicator_meaning: [
    /(?:GMI|CFI|HRI|index||indicator|mean|)/i,
    /(?:what is| |define|)/i,
  ],
  scenario_planning: [
    /(?:what if| |scenario||suppose|)/i,
    /(?:happen||case|)/i,
  ],
  general: [],
};

// Entity extraction patterns
const ENTITY_PATTERNS = {
  countries: /(?:libya||egypt||saudi||uae||usa||china||russia||germany||france||uk||japan||india||brazil||turkey||israel||palestine||iran||iraq||syria||lebanon||jordan||morocco||algeria||tunisia||sudan||yemen||oman||kuwait||qatar||bahrain|)/gi,
  timeframes: /(?:today||tomorrow||yesterday||this week| |next week| |this month| |next month| |24 hours|48 hours||||)/gi,
  topics: /(?:economy||politics||oil||gold||silver||crypto||bitcoin||stock||market||war||peace||election||covid||climate|)/gi,
};

/**
 * Classify user intent from their question
 */
export function classifyIntent(
  question: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): ClassifiedIntent {
  const normalizedQuestion = question.toLowerCase().trim();
  
  // Detect primary intent
  let primaryIntent: IntentType = 'unknown';
  let maxScore = 0;
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    const score = patterns.reduce((acc, pattern) => {
      return acc + (pattern.test(normalizedQuestion) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      primaryIntent = intent as IntentType;
    }
  }
  
  // If no clear intent, check conversation context
  if (primaryIntent === 'unknown' && conversationHistory.length > 0) {
    // Assume follow-up question relates to previous context
    primaryIntent = 'clarification';
  }
  
  // Detect sub-intent
  let subIntent: SubIntent = 'general';
  let subMaxScore = 0;
  
  for (const [sub, patterns] of Object.entries(SUB_INTENT_PATTERNS)) {
    const score = patterns.reduce((acc, pattern) => {
      return acc + (pattern.test(normalizedQuestion) ? 1 : 0);
    }, 0);
    
    if (score > subMaxScore) {
      subMaxScore = score;
      subIntent = sub as SubIntent;
    }
  }
  
  // Extract entities
  const countries = normalizedQuestion.match(ENTITY_PATTERNS.countries) || [];
  const timeframes = normalizedQuestion.match(ENTITY_PATTERNS.timeframes) || [];
  const topics = normalizedQuestion.match(ENTITY_PATTERNS.topics) || [];
  
  // Determine required engines based on intent
  const requiredEngines = determineRequiredEngines(primaryIntent, subIntent);
  
  // Determine if LLM and RAG are needed
  const needsLLM = primaryIntent !== 'greeting';
  const needsRAG = ['interpretation', 'comparison', 'clarification'].includes(primaryIntent);
  
  // Calculate confidence
  const confidence = calculateConfidence(maxScore, subMaxScore, countries.length, topics.length);
  
  return {
    primary: primaryIntent,
    sub: subIntent,
    confidence,
    requiredEngines,
    needsLLM,
    needsRAG,
    context: {
      topic: topics[0],
      country: countries[0],
      timeframe: timeframes[0],
      entities: Array.from(new Set([...countries, ...topics])),
    },
  };
}

/**
 * Determine which engines are needed based on intent
 */
function determineRequiredEngines(primary: IntentType, sub: SubIntent): RequiredEngine[] {
  const engines: RequiredEngine[] = [];
  
  // Primary intent determines main engines
  switch (primary) {
    case 'analysis':
      engines.push('emotion', 'dcft', 'news', 'social');
      break;
    case 'interpretation':
      engines.push('dcft', 'meta');
      break;
    case 'prediction':
      engines.push('dcft', 'forecast', 'historical');
      break;
    case 'comparison':
      engines.push('dcft', 'historical');
      break;
    case 'recommendation':
      engines.push('dcft', 'meta', 'forecast');
      break;
    case 'clarification':
      engines.push('meta');
      break;
    case 'greeting':
      // No engines needed
      break;
    default:
      engines.push('dcft', 'meta');
  }
  
  // Sub-intent may add more engines
  switch (sub) {
    case 'risk_assessment':
      if (!engines.includes('meta')) engines.push('meta');
      if (!engines.includes('forecast')) engines.push('forecast');
      break;
    case 'opportunity_check':
      if (!engines.includes('forecast')) engines.push('forecast');
      break;
    case 'trend_analysis':
      if (!engines.includes('historical')) engines.push('historical');
      break;
    case 'scenario_planning':
      if (!engines.includes('forecast')) engines.push('forecast');
      break;
  }
  
  return engines;
}

/**
 * Calculate confidence score
 */
function calculateConfidence(
  intentScore: number,
  subIntentScore: number,
  entityCount: number,
  topicCount: number
): number {
  // Base confidence from intent matching
  let confidence = Math.min(intentScore * 0.3, 0.6);
  
  // Add sub-intent confidence
  confidence += Math.min(subIntentScore * 0.15, 0.2);
  
  // Add entity/topic bonus
  confidence += Math.min((entityCount + topicCount) * 0.05, 0.2);
  
  // Ensure within bounds
  return Math.max(0.1, Math.min(confidence, 0.95));
}

/**
 * Get human-readable description of intent
 */
export function describeIntent(intent: ClassifiedIntent): string {
  const descriptions: Record<IntentType, string> = {
    analysis: 'Requesting emotional analysis',
    interpretation: 'Seeking explanation of indicators',
    prediction: 'Asking for future forecasts',
    comparison: 'Wanting to compare data',
    recommendation: 'Looking for actionable advice',
    clarification: 'Needing clarification',
    greeting: 'Simple greeting',
    unknown: 'Unclear intent',
  };
  
  return descriptions[intent.primary];
}
