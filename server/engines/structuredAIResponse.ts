/**
 * Structured AI Response Schema
 * Ensures AI provides detailed, specific, and actionable analysis
 * instead of generic, vague responses
 */

import { invokeLLMWithSanitization } from './llmPipelineWithSanitization';

import type { LLMCallResult } from './llmPipelineWithSanitization';

export interface AnalysisResponse {
  summary: string; // 1-2 sentences
  mood: string; // Specific mood (not "neutral")
  whyThisMood: {
    mainReasons: string[]; // Specific reasons with data
    emotionalFactors: string[]; // What emotions drive this
    dataPoints: string[]; // Specific data supporting this
  };
  societalImpact: {
    howPeopleThink: string; // Specific insights about thinking patterns
    behavioralChanges: string[]; // Expected behavior changes
    economicImpact: string; // Economic implications
    socialImpact: string; // Social implications
  };
  recommendations: {
    immediate: string[]; // What should happen now
    shortTerm: string[]; // 1-3 months
    longTerm: string[]; // 6-12 months
    stakeholders: string[]; // Who should act
  };
  predictions: {
    nextWeek: string; // What will likely happen in 1 week
    nextMonth: string; // What will likely happen in 1 month
    nextQuarter: string; // What will likely happen in 3 months
    confidence: number; // 0-1 confidence in predictions
  };
  risks: {
    immediate: string[]; // Immediate risks
    emerging: string[]; // Emerging risks
    longTerm: string[]; // Long-term risks
    mitigation: string[]; // How to mitigate
  };
  whatIf: {
    scenario1: {
      condition: string; // "If government announces new policy..."
      outcome: string; // "Then economic growth would..."
      probability: number; // 0-1
    };
    scenario2: {
      condition: string;
      outcome: string;
      probability: number;
    };
    scenario3: {
      condition: string;
      outcome: string;
      probability: number;
    };
  };
  historicalContext: {
    similarPastEvents: string[]; // "Similar to 2014 when..."
    outcomes: string[]; // "Which led to..."
    lessons: string[]; // "We learned that..."
  };
  confidence: number; // Overall confidence 0-1
  sources: string[]; // Data sources used
}

/**
 * Generate structured analysis response from AI
 */
export async function generateStructuredAnalysis(
  topic: string,
  country: string,
  emotionalData: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  },
  recentEvents: string[],
  historicalContext: string,
  newsHeadlines: string[]
): Promise<AnalysisResponse | null> {
  const prompt = `
You are an expert geopolitical and emotional intelligence analyst. Provide a detailed, specific analysis.

TOPIC: ${topic}
COUNTRY: ${country}

EMOTIONAL DATA:
- Joy: ${emotionalData.joy}/100
- Fear: ${emotionalData.fear}/100
- Anger: ${emotionalData.anger}/100
- Sadness: ${emotionalData.sadness}/100
- Hope: ${emotionalData.hope}/100
- Curiosity: ${emotionalData.curiosity}/100

RECENT EVENTS:
${recentEvents.map((e, i) => `${i + 1}. ${e}`).join('\n')}

HISTORICAL CONTEXT:
${historicalContext}

RECENT NEWS:
${newsHeadlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}

Provide analysis in this EXACT JSON format:
{
  "summary": "1-2 sentence summary",
  "mood": "Specific mood (e.g., 'Cautiously optimistic', 'Anxious and uncertain')",
  "whyThisMood": {
    "mainReasons": ["Reason 1 with specific data", "Reason 2 with specific data"],
    "emotionalFactors": ["Factor 1", "Factor 2"],
    "dataPoints": ["Data point 1", "Data point 2"]
  },
  "societalImpact": {
    "howPeopleThink": "Specific insights about thinking patterns",
    "behavioralChanges": ["Change 1", "Change 2"],
    "economicImpact": "Specific economic implications",
    "socialImpact": "Specific social implications"
  },
  "recommendations": {
    "immediate": ["Action 1", "Action 2"],
    "shortTerm": ["Action 1", "Action 2"],
    "longTerm": ["Action 1", "Action 2"],
    "stakeholders": ["Stakeholder 1", "Stakeholder 2"]
  },
  "predictions": {
    "nextWeek": "Specific prediction for next week",
    "nextMonth": "Specific prediction for next month",
    "nextQuarter": "Specific prediction for next quarter",
    "confidence": 0.75
  },
  "risks": {
    "immediate": ["Risk 1", "Risk 2"],
    "emerging": ["Risk 1", "Risk 2"],
    "longTerm": ["Risk 1", "Risk 2"],
    "mitigation": ["Mitigation 1", "Mitigation 2"]
  },
  "whatIf": {
    "scenario1": {
      "condition": "If X happens...",
      "outcome": "Then Y would happen...",
      "probability": 0.65
    },
    "scenario2": {
      "condition": "If A happens...",
      "outcome": "Then B would happen...",
      "probability": 0.45
    },
    "scenario3": {
      "condition": "If P happens...",
      "outcome": "Then Q would happen...",
      "probability": 0.55
    }
  },
  "historicalContext": {
    "similarPastEvents": ["Similar to 2014 when...", "Similar to 2017 when..."],
    "outcomes": ["Which led to...", "Which resulted in..."],
    "lessons": ["We learned that...", "Key insight..."]
  },
  "confidence": 0.82,
  "sources": ["News API", "Social Media Analysis", "Historical Data"]
}

IMPORTANT:
- Be SPECIFIC, not generic
- Use actual data and numbers
- Avoid vague phrases like "multiple complex factors"
- Provide actionable recommendations
- Include specific predictions with confidence levels
- Reference historical events when relevant
- Make what-if scenarios realistic and specific
`;

  const llmResult = await invokeLLMWithSanitization({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert geopolitical analyst. Provide detailed, specific, data-driven analysis in valid JSON format.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text from LLM result
  const responseText = llmResult.content || '';

  // Parse the response
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || '',
      mood: parsed.mood || 'Unknown',
      whyThisMood: parsed.whyThisMood || {
        mainReasons: [],
        emotionalFactors: [],
        dataPoints: [],
      },
      societalImpact: parsed.societalImpact || {
        howPeopleThink: '',
        behavioralChanges: [],
        economicImpact: '',
        socialImpact: '',
      },
      recommendations: parsed.recommendations || {
        immediate: [],
        shortTerm: [],
        longTerm: [],
        stakeholders: [],
      },
      predictions: parsed.predictions || {
        nextWeek: '',
        nextMonth: '',
        nextQuarter: '',
        confidence: 0,
      },
      risks: parsed.risks || {
        immediate: [],
        emerging: [],
        longTerm: [],
        mitigation: [],
      },
      whatIf: parsed.whatIf || {
        scenario1: { condition: '', outcome: '', probability: 0 },
        scenario2: { condition: '', outcome: '', probability: 0 },
        scenario3: { condition: '', outcome: '', probability: 0 },
      },
      historicalContext: parsed.historicalContext || {
        similarPastEvents: [],
        outcomes: [],
        lessons: [],
      },
      confidence: parsed.confidence || 0,
      sources: parsed.sources || [],
    };
  } catch (error) {
    console.error('Failed to parse structured analysis:', error);
    throw new Error('Failed to generate structured analysis');
  }
}

/**
 * Generate follow-up questions based on initial analysis
 */
export async function generateFollowUpQuestions(
  topic: string,
  country: string,
  initialAnalysis: AnalysisResponse
): Promise<{
  predictions: string[];
  recommendations: string[];
  whatIf: string[];
}> {
  const prompt = `
Based on this analysis of ${topic} in ${country}:
- Current mood: ${initialAnalysis.mood}
- Main risks: ${initialAnalysis.risks.immediate.join(', ')}
- Key predictions: ${initialAnalysis.predictions.nextMonth}

Generate 3 follow-up questions for each category:

1. PREDICTIONS (What will happen?)
- Ask about specific outcomes
- Ask about timing
- Ask about probabilities

2. RECOMMENDATIONS (What should be done?)
- Ask about specific actions
- Ask about who should act
- Ask about urgency

3. WHAT-IF SCENARIOS (What if X happens?)
- Ask about alternative scenarios
- Ask about cascading effects
- Ask about prevention strategies

Return as JSON:
{
  "predictions": ["Question 1", "Question 2", "Question 3"],
  "recommendations": ["Question 1", "Question 2", "Question 3"],
  "whatIf": ["Question 1", "Question 2", "Question 3"]
}
`;

  const llmResult = await invokeLLMWithSanitization({
    messages: [
      {
        role: 'system',
        content: 'Generate insightful follow-up questions in valid JSON format.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = llmResult.content || '';

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      predictions: parsed.predictions || [],
      recommendations: parsed.recommendations || [],
      whatIf: parsed.whatIf || [],
    };
  } catch (error) {
    console.error('Failed to generate follow-up questions:', error);
    return {
      predictions: [],
      recommendations: [],
      whatIf: [],
    };
  }
}

/**
 * Answer a specific follow-up question
 */
export async function answerFollowUpQuestion(
  question: string,
  topic: string,
  country: string,
  context: string
): Promise<string> {
  const prompt = `
QUESTION: ${question}
TOPIC: ${topic}
COUNTRY: ${country}

CONTEXT:
${context}

Provide a detailed, specific answer to this question. Be concrete, not vague.
Include:
- Specific data or examples
- Confidence level
- Key assumptions
- Alternative perspectives

Keep answer concise (2-3 paragraphs max).
`;

  const llmResult = await invokeLLMWithSanitization({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert analyst. Provide detailed, specific, data-driven answers.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return llmResult.content || '';
}
