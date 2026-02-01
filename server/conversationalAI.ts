/**
 * AmalSense Conversational Intelligence Agent
 * 
 * Four Intelligence Layers:
 * 1. Analytical Intelligence - GMI/CFI/HRI calculation (existing)
 * 2. Emotional Reasoning AI - connects indicators, infers psychological states
 * 3. Conversational Intelligence - understands questions, responds in human language
 * 4. Meta-Decision AI - converts analysis to recommendations/warnings/scenarios
 */

import { invokeLLMProvider, getActiveProvider, getProviderInfo, type LLMMessage } from './llmProvider';

// Types for the conversational AI
export interface AnalysisContext {
  topic: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionVector: Record<string, number>;
  confidence: number;
  detectedCountry?: string;
  sources?: string[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AIResponse {
  message: string;
  detectedCountry?: string;
  recommendations?: string[];
  warnings?: string[];
  scenarios?: Array<{
    condition: string;
    prediction: string;
  }>;
}

// Country detection from topic context
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  'US': ['america', 'american', 'usa', 'united states', 'biden', 'trump', 'washington', 'congress', 'white house', 'federal reserve', 'wall street', 'silicon valley'],
  'LY': ['libya', 'libyan', 'tripoli', 'benghazi', 'ليبيا', 'طرابلس', 'بنغازي'],
  'EG': ['egypt', 'egyptian', 'cairo', 'مصر', 'القاهرة', 'السيسي'],
  'SA': ['saudi', 'arabia', 'riyadh', 'السعودية', 'الرياض', 'محمد بن سلمان'],
  'AE': ['uae', 'emirates', 'dubai', 'abu dhabi', 'الإمارات', 'دبي'],
  'GB': ['uk', 'britain', 'british', 'england', 'london', 'بريطانيا', 'لندن'],
  'DE': ['germany', 'german', 'berlin', 'ألمانيا', 'برلين'],
  'FR': ['france', 'french', 'paris', 'فرنسا', 'باريس'],
  'CN': ['china', 'chinese', 'beijing', 'الصين', 'بكين'],
  'JP': ['japan', 'japanese', 'tokyo', 'اليابان', 'طوكيو'],
  'RU': ['russia', 'russian', 'moscow', 'putin', 'روسيا', 'موسكو', 'بوتين'],
  'IN': ['india', 'indian', 'delhi', 'mumbai', 'الهند', 'دلهي'],
  'BR': ['brazil', 'brazilian', 'البرازيل'],
  'TR': ['turkey', 'turkish', 'ankara', 'istanbul', 'تركيا', 'أنقرة', 'إسطنبول'],
  'IL': ['israel', 'israeli', 'tel aviv', 'إسرائيل', 'تل أبيب'],
  'PS': ['palestine', 'palestinian', 'gaza', 'فلسطين', 'غزة'],
  'IR': ['iran', 'iranian', 'tehran', 'إيران', 'طهران'],
  'IQ': ['iraq', 'iraqi', 'baghdad', 'العراق', 'بغداد'],
  'SY': ['syria', 'syrian', 'damascus', 'سوريا', 'دمشق'],
};

/**
 * Detect country from topic text
 */
export function detectCountryFromTopic(topic: string): string | undefined {
  const lowerTopic = topic.toLowerCase();
  
  for (const [countryCode, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerTopic.includes(keyword.toLowerCase())) {
        return countryCode;
      }
    }
  }
  
  return undefined; // Global analysis if no country detected
}

/**
 * Layer 2: Emotional Reasoning AI
 * Connects indicators and infers collective psychological states
 */
export function analyzeEmotionalState(context: AnalysisContext): {
  state: string;
  description: string;
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
} {
  const { gmi, cfi, hri } = context;
  
  // Determine emotional state based on indicator combinations
  if (cfi > 70) {
    if (hri < 30) {
      return {
        state: 'panic',
        description: 'High fear combined with low hope indicates collective panic and despair',
        intensity: 'extreme'
      };
    } else if (hri > 50) {
      return {
        state: 'anxious_hope',
        description: 'High fear but maintained hope suggests cautious optimism despite challenges',
        intensity: 'high'
      };
    } else {
      return {
        state: 'tension',
        description: 'Elevated fear with moderate hope indicates collective tension',
        intensity: 'high'
      };
    }
  }
  
  if (gmi > 50 && hri > 60) {
    return {
      state: 'optimistic',
      description: 'Positive mood with strong hope indicates collective optimism',
      intensity: cfi < 30 ? 'high' : 'moderate'
    };
  }
  
  if (gmi > 20 && gmi <= 50) {
    if (cfi < 40) {
      return {
        state: 'cautious_positive',
        description: 'Moderately positive mood with controlled fear suggests cautious optimism',
        intensity: 'moderate'
      };
    } else {
      return {
        state: 'mixed',
        description: 'Positive mood tempered by notable fear creates mixed sentiment',
        intensity: 'moderate'
      };
    }
  }
  
  if (gmi >= -20 && gmi <= 20) {
    return {
      state: 'neutral',
      description: 'Balanced mood indicates collective uncertainty or wait-and-see attitude',
      intensity: 'low'
    };
  }
  
  if (gmi < -20 && gmi >= -50) {
    return {
      state: 'concerned',
      description: 'Negative mood indicates collective concern and worry',
      intensity: 'moderate'
    };
  }
  
  if (gmi < -50) {
    return {
      state: 'pessimistic',
      description: 'Strongly negative mood indicates collective pessimism',
      intensity: hri < 30 ? 'extreme' : 'high'
    };
  }
  
  return {
    state: 'uncertain',
    description: 'Complex emotional patterns require deeper analysis',
    intensity: 'moderate'
  };
}

/**
 * Layer 4: Meta-Decision AI
 * Generates recommendations based on emotional analysis
 */
export function generateRecommendations(context: AnalysisContext): {
  recommendations: string[];
  warnings: string[];
  scenarios: Array<{ condition: string; prediction: string }>;
} {
  const { gmi, cfi, hri, topic } = context;
  const recommendations: string[] = [];
  const warnings: string[] = [];
  const scenarios: Array<{ condition: string; prediction: string }> = [];
  
  // Generate recommendations based on indicators
  if (cfi > 60) {
    warnings.push('High collective fear detected - expect increased volatility');
    recommendations.push('Monitor situation closely for rapid sentiment shifts');
    scenarios.push({
      condition: 'If negative news emerges',
      prediction: 'CFI could spike above 80, triggering panic responses'
    });
  }
  
  if (hri > 70) {
    recommendations.push('Strong hope resilience suggests recovery potential');
    scenarios.push({
      condition: 'If positive developments occur',
      prediction: 'Sentiment could shift to strongly positive within 24-48 hours'
    });
  }
  
  if (gmi > 30 && cfi < 40) {
    recommendations.push('Favorable emotional conditions for positive action');
  }
  
  if (gmi < -30) {
    warnings.push('Negative sentiment dominates - caution advised');
    scenarios.push({
      condition: 'Without positive catalysts',
      prediction: 'Negative mood likely to persist for 3-7 days'
    });
  }
  
  // Add topic-specific scenarios
  if (topic.toLowerCase().includes('market') || topic.toLowerCase().includes('stock') || topic.toLowerCase().includes('price')) {
    if (cfi > 50) {
      recommendations.push('Consider defensive positioning given elevated fear');
    }
    if (gmi > 40 && hri > 50) {
      recommendations.push('Emotional conditions support gradual accumulation');
    }
  }
  
  return { recommendations, warnings, scenarios };
}

/**
 * Layer 3: Conversational Intelligence
 * Main function to generate AI response using LLM
 */
export async function generateAIResponse(
  context: AnalysisContext,
  conversationHistory: ConversationMessage[],
  userQuestion?: string
): Promise<AIResponse> {
  const emotionalState = analyzeEmotionalState(context);
  const { recommendations, warnings, scenarios } = generateRecommendations(context);
  
  // Build system prompt with AmalSense context
  const systemPrompt = `You are AmalSense AI, a Collective Emotional Intelligence Agent that analyzes and explains collective emotions from digital sources.

Your knowledge includes:
- DCFT (Digital Collective Feeling Theory) methodology
- Three core indices: GMI (Global Mood Index: -100 to +100), CFI (Collective Fear Index: 0-100), HRI (Hope Resilience Index: 0-100)
- Emotional vector analysis (joy, fear, anger, sadness, hope, curiosity, surprise, disgust)

Current Analysis Context:
- Topic: ${context.topic}
- Detected Country: ${context.detectedCountry || 'Global'}
- GMI: ${context.gmi.toFixed(1)} (${context.gmi > 0 ? 'positive' : context.gmi < 0 ? 'negative' : 'neutral'})
- CFI: ${context.cfi.toFixed(1)}% (${context.cfi > 60 ? 'high fear' : context.cfi < 40 ? 'low fear' : 'moderate fear'})
- HRI: ${context.hri.toFixed(1)}% (${context.hri > 60 ? 'high hope' : context.hri < 40 ? 'low hope' : 'moderate hope'})
- Dominant Emotion: ${context.dominantEmotion}
- Confidence: ${context.confidence}%
- Emotional State: ${emotionalState.state} (${emotionalState.intensity} intensity)
- State Description: ${emotionalState.description}

Your role:
1. INTERPRETER: Explain what the current indicators mean in human terms
2. REASONER: Connect the indicators to explain WHY this emotional state exists
3. FORECASTER: Predict how emotions might change based on scenarios
4. ADVISOR: Provide actionable recommendations based on emotional analysis

Guidelines:
- Speak in clear, conversational language
- Be specific about numbers and their meaning
- Explain cause-and-effect relationships
- Provide practical insights, not just data
- If asked about investments/trading, focus on emotional readiness, not financial advice
- Always relate back to collective emotions and psychological states`;

  // Build conversation messages
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt }
  ];
  
  // Add conversation history
  for (const msg of conversationHistory.slice(-10)) { // Keep last 10 messages for context
    messages.push({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    });
  }
  
  // If this is the initial analysis (no user question), generate automatic explanation
  if (!userQuestion) {
    messages.push({
      role: 'user',
      content: `Please provide a comprehensive analysis of the collective emotions around "${context.topic}". Start with the overall emotional state, explain what the indicators mean, why this state exists, and what to expect next.`
    });
  } else {
    messages.push({
      role: 'user',
      content: userQuestion
    });
  }
  
  try {
    // Use the unified LLM provider (Groq/Qwen if configured, otherwise Manus)
    const activeProvider = getActiveProvider();
    const providerInfo = getProviderInfo(activeProvider);
    console.log(`[ConversationalAI] Using provider: ${providerInfo.name} (${providerInfo.model})`);
    
    const llmMessages: LLMMessage[] = messages.map(m => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    }));
    
    const response = await invokeLLMProvider({
      messages: llmMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    const aiMessage = response.content || 'Unable to generate analysis at this time.';
    
    return {
      message: aiMessage,
      detectedCountry: context.detectedCountry,
      recommendations,
      warnings,
      scenarios
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback to rule-based response
    const fallbackMessage = generateFallbackResponse(context, emotionalState, userQuestion);
    
    return {
      message: fallbackMessage,
      detectedCountry: context.detectedCountry,
      recommendations,
      warnings,
      scenarios
    };
  }
}

/**
 * Fallback response generator when LLM is unavailable
 */
function generateFallbackResponse(
  context: AnalysisContext,
  emotionalState: ReturnType<typeof analyzeEmotionalState>,
  userQuestion?: string
): string {
  const { topic, gmi, cfi, hri, dominantEmotion, confidence } = context;
  
  if (!userQuestion) {
    // Initial analysis
    let response = `**Analysis of "${topic}"**\n\n`;
    
    response += `**Overall Emotional State: ${emotionalState.state.toUpperCase()}**\n`;
    response += `${emotionalState.description}\n\n`;
    
    response += `**Key Indicators:**\n`;
    response += `- Global Mood Index (GMI): ${gmi > 0 ? '+' : ''}${gmi.toFixed(1)} - `;
    response += gmi > 30 ? 'Strongly positive sentiment' : gmi > 0 ? 'Moderately positive sentiment' : gmi > -30 ? 'Neutral to slightly negative' : 'Negative sentiment dominates';
    response += '\n';
    
    response += `- Collective Fear Index (CFI): ${cfi.toFixed(1)}% - `;
    response += cfi > 60 ? 'High anxiety levels detected' : cfi > 40 ? 'Moderate concern present' : 'Fear levels under control';
    response += '\n';
    
    response += `- Hope Resilience Index (HRI): ${hri.toFixed(1)}% - `;
    response += hri > 60 ? 'Strong collective hope and resilience' : hri > 40 ? 'Moderate hope maintained' : 'Hope levels are low';
    response += '\n\n';
    
    response += `**Dominant Emotion:** ${dominantEmotion}\n`;
    response += `**Analysis Confidence:** ${confidence}%\n\n`;
    
    response += `Feel free to ask me specific questions about this analysis.`;
    
    return response;
  }
  
  // Simple keyword-based responses for common questions
  const lowerQuestion = userQuestion.toLowerCase();
  
  if (lowerQuestion.includes('buy') || lowerQuestion.includes('invest') || lowerQuestion.includes('trade')) {
    if (cfi > 60) {
      return `Based on the current emotional analysis, collective fear is elevated at ${cfi.toFixed(1)}%. This typically indicates psychological hesitation in the market. The recommendation is to wait for fear levels to stabilize before making significant moves.`;
    } else if (gmi > 30 && hri > 50) {
      return `The emotional conditions appear favorable with GMI at ${gmi.toFixed(1)} and hope resilience at ${hri.toFixed(1)}%. There's psychological readiness for positive action, though I recommend gradual positioning rather than aggressive moves.`;
    } else {
      return `Current emotional indicators suggest a cautious approach. GMI is at ${gmi.toFixed(1)} and CFI at ${cfi.toFixed(1)}%. Consider monitoring the situation for clearer emotional signals.`;
    }
  }
  
  if (lowerQuestion.includes('why') || lowerQuestion.includes('reason') || lowerQuestion.includes('cause')) {
    return `The current emotional state of "${emotionalState.state}" is driven by the combination of:\n- Mood level (GMI: ${gmi.toFixed(1)})\n- Fear presence (CFI: ${cfi.toFixed(1)}%)\n- Hope resilience (HRI: ${hri.toFixed(1)}%)\n\nThe dominant emotion "${dominantEmotion}" suggests the primary psychological driver in collective responses to "${topic}".`;
  }
  
  if (lowerQuestion.includes('what if') || lowerQuestion.includes('scenario') || lowerQuestion.includes('predict')) {
    return `Based on current indicators:\n\n**If positive news emerges:**\n- GMI could rise to ${Math.min(100, gmi + 20).toFixed(0)}\n- CFI likely to drop to ${Math.max(0, cfi - 15).toFixed(0)}%\n\n**If negative news emerges:**\n- CFI could spike to ${Math.min(100, cfi + 25).toFixed(0)}%\n- GMI may fall to ${Math.max(-100, gmi - 25).toFixed(0)}\n\nThese are emotional projections based on typical collective response patterns.`;
  }
  
  return `Regarding your question about "${topic}": The current emotional state is ${emotionalState.state} with ${emotionalState.intensity} intensity. GMI stands at ${gmi.toFixed(1)}, CFI at ${cfi.toFixed(1)}%, and HRI at ${hri.toFixed(1)}%. Would you like me to elaborate on any specific aspect?`;
}

export default {
  detectCountryFromTopic,
  analyzeEmotionalState,
  generateRecommendations,
  generateAIResponse
};
