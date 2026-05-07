import { smartJsonChat } from '../smartLLM';

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
  | 'greeting'      // تحية - greetings/social talk
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
  | 'socialize'         // Greetings, small talk, pleasantries
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


/**
 * Understand a question deeply using AI
 */
export async function understandQuestion(
  question: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<DeepQuestion> {
  const systemPrompt = `You are the AmalSense Cognitive Analyzer. Your task is to analyze a user's question and extract its deep meaning, intent, and emotional context.
  Respond ONLY with a valid JSON object matching this structure:
  {
    "surface": {
      "text": "string",
      "topic": "string (the main subject, e.g., Gold, Dollar, Elections)",
      "questionType": "why | what | how | should | will | compare | what_if | when | who | explain | greeting | general",
      "keywords": ["string"]
    },
    "deep": {
      "realIntent": "make_decision | understand_cause | predict_future | assess_risk | find_opportunity | validate_belief | learn_concept | compare_options | get_reassurance | socialize | explore_scenario",
      "implicitQuestions": ["string (questions they didn't ask but are relevant)"],
      "emotionalNeed": "anxious | curious | urgent | skeptical | hopeful | confused | decisive | neutral",
      "urgency": "immediate | planning | learning"
    },
    "context": {
      "isFollowUp": boolean,
      "previousTopic": "string | null",
      "userExpertise": "beginner | intermediate | expert",
      "language": "ar | en"
    },
    "requiredSources": ["emotion_indicators", "economic_data", "news", "historical", "expert_knowledge", "comparison_data", "scenario_models"],
    "responseStrategy": {
      "style": "analytical | advisory | educational | reassuring | comparative",
      "depth": "brief | detailed | comprehensive",
      "includeData": boolean,
      "includeRecommendation": boolean,
      "includeScenarios": boolean,
      "tone": "formal | conversational | urgent"
    }
  }`;

  const userMessage = `Analyze this question: "${question}"
  ${conversationHistory ? `Conversation History Summary: ${conversationHistory.map(m => m.content).join(' | ')}` : ''}`;

  try {
    const analysis = await smartJsonChat(systemPrompt, userMessage, 'question_understanding');
    
    // Fallback/Validation
    return {
      surface: {
        text: question,
        topic: analysis.surface?.topic || 'General',
        questionType: analysis.surface?.questionType || 'general',
        keywords: analysis.surface?.keywords || []
      },
      deep: {
        realIntent: analysis.deep?.realIntent || 'learn_concept',
        implicitQuestions: analysis.deep?.implicitQuestions || [],
        emotionalNeed: analysis.deep?.emotionalNeed || 'neutral',
        urgency: analysis.deep?.urgency || 'learning'
      },
      context: {
        isFollowUp: conversationHistory ? conversationHistory.length > 0 : false,
        previousTopic: analysis.context?.previousTopic || null,
        userExpertise: analysis.context?.userExpertise || 'beginner',
        language: analysis.context?.language || (/[a-zA-Z]/.test(question) ? 'en' : 'ar')
      },
      requiredSources: analysis.requiredSources || ['emotion_indicators'],
      responseStrategy: analysis.responseStrategy || {
        style: 'analytical',
        depth: 'detailed',
        includeData: true,
        includeRecommendation: true,
        includeScenarios: false,
        tone: 'conversational'
      }
    };
  } catch (error) {
    console.error('LLM Question Understanding failed, falling back to basic analysis:', error);
    // Return a basic structure if AI fails
    return {
      surface: { text: question, topic: 'General', questionType: 'general', keywords: [] },
      deep: { realIntent: 'learn_concept', implicitQuestions: [], emotionalNeed: 'neutral', urgency: 'learning' },
      context: { isFollowUp: false, userExpertise: 'beginner', language: 'ar' },
      requiredSources: ['emotion_indicators'],
      responseStrategy: { style: 'analytical', depth: 'detailed', includeData: true, includeRecommendation: false, includeScenarios: false, tone: 'conversational' }
    };
  }
}

/**
 * استخراج الموضوع الأساسي من النص
 */
export function extractTopic(text: string): string {
  // منطق بسيط لاستخراج الموضوع الأساسي
  const topics = text.split(' ').filter(word => word.length > 4);
  return topics[0] || 'General';
}
