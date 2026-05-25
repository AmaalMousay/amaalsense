import { t } from "../_core/i18n";

/**
 * Session Cognitive Context
 *       
 * 
 *   :
 * -       " "
 * -        !
 * 
 * :
 * -   (   )
 * -     
 */

export interface SessionContext {
  sessionId: string;
  
  //  
  country?: string;
  region?: string;
  
  //  
  domain?: string;  // politics, economy, health, etc.
  topic?: string;   //  
  subTopic?: string;
  
  //  
  cognitiveLens?: string;  //   
  analysisDepth?: 'shallow' | 'medium' | 'deep';
  
  //  
  userRole?: 'journalist' | 'researcher' | 'politician' | 'economist' | 'general';
  
  //    
  questionHistory: QuestionRecord[];
  
  //  
  mentionedEntities: string[];
  
  //  
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface QuestionRecord {
  question: string;
  intent: QuestionIntent;
  timestamp: Date;
  extractedContext: ExtractedContext;
}

export interface QuestionIntent {
  type: 'why' | 'what' | 'how' | 'risks' | 'recommendation' | 'whatif' | 'comparison' | 'followup' | 'clarification';
  isFollowUp: boolean;
  requiresContext: boolean;
}

export interface ExtractedContext {
  country?: string;
  domain?: string;
  topic?: string;
  entities?: string[];
  timeframe?: string;
}

//    
const sessionStore = new Map<string, SessionContext>();

/**
 *    
 */
export function getOrCreateSession(sessionId: string): SessionContext {
  if (sessionStore.has(sessionId)) {
    return sessionStore.get(sessionId)!;
  }
  
  const newSession: SessionContext = {
    sessionId,
    questionHistory: [],
    mentionedEntities: [],
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
  };
  
  sessionStore.set(sessionId, newSession);
  return newSession;
}

/**
 *       
 */
export function updateSessionContext(
  sessionId: string,
  question: string,
  extractedContext: ExtractedContext
): SessionContext {
  const session = getOrCreateSession(sessionId);
  
  //   
  const intent = classifyQuestionIntent(question, session);
  
  //       
  if (intent.isFollowUp && intent.requiresContext) {
    //         
    if (extractedContext.country) {
      session.country = extractedContext.country;
    }
    if (extractedContext.domain) {
      session.domain = extractedContext.domain;
    }
    if (extractedContext.topic) {
      session.topic = extractedContext.topic;
    }
  } else {
    //   -   
    if (extractedContext.country) session.country = extractedContext.country;
    if (extractedContext.domain) session.domain = extractedContext.domain;
    if (extractedContext.topic) session.topic = extractedContext.topic;
  }
  
  //   
  if (extractedContext.entities) {
    const uniqueEntities = new Set([...session.mentionedEntities, ...extractedContext.entities]);
    session.mentionedEntities = Array.from(uniqueEntities);
  }
  
  //    
  session.questionHistory.push({
    question,
    intent,
    timestamp: new Date(),
    extractedContext,
  });
  
  session.lastUpdatedAt = new Date();
  sessionStore.set(sessionId, session);
  
  return session;
}

/**
 *   
 */
export function classifyQuestionIntent(question: string, session: SessionContext): QuestionIntent {
  const q = question.toLowerCase();
  
  //   
  const followUpPatterns = [
    /^ (||)\??$/,
    /^(|||)\??$/,
    /^ (|)\??$/,
    /^\s/,
    /^ /,
    /^ /,
  ];
  
  const isFollowUp = session.questionHistory.length > 0 && (
    followUpPatterns.some(p => p.test(q)) ||
    question.length < 30
  );
  
  //   
  let type: QuestionIntent['type'] = 'what';
  
  if (/|| /.test(q)) {
    type = 'why';
  } else if (/|/.test(q)) {
    type = 'how';
  } else if (/||/.test(q)) {
    type = 'risks';
  } else if (/||| /.test(q)) {
    type = 'recommendation';
  } else if (/ | | /.test(q)) {
    type = 'whatif';
  } else if (/||vs|/.test(q)) {
    type = 'comparison';
  } else if (isFollowUp && /||/.test(q)) {
    type = 'clarification';
  } else if (isFollowUp) {
    type = 'followup';
  }
  
  return {
    type,
    isFollowUp,
    requiresContext: isFollowUp || /||| /.test(q),
  };
}

/**
 *    
 */
export function extractContextFromQuestion(question: string): ExtractedContext {
  const context: ExtractedContext = {};
  
  //  
  const countryPatterns: Record<string, string[]> = {
    'libya': [t('auto.cognitiveArchitecture_sessionContext.70.251aff72', 'ar'), t('auto.cognitiveArchitecture_sessionContext.69.5b6e38b4', 'ar'), t('auto.cognitiveArchitecture_sessionContext.68.d014afbb', 'ar'), t('auto.cognitiveArchitecture_sessionContext.67.da7424b2', 'ar'), t('auto.cognitiveArchitecture_sessionContext.66.63a58999', 'ar'), 'libya'],
    'egypt': [t('auto.cognitiveArchitecture_sessionContext.65.9f5f187b', 'ar'), t('auto.cognitiveArchitecture_sessionContext.64.4bfe15eb', 'ar'), t('auto.cognitiveArchitecture_sessionContext.63.b650f14e', 'ar'), t('auto.cognitiveArchitecture_sessionContext.62.93019aa0', 'ar'), 'egypt'],
    'saudi': [t('auto.cognitiveArchitecture_sessionContext.61.cd8d189f', 'ar'), t('auto.cognitiveArchitecture_sessionContext.60.b6e39817', 'ar'), t('auto.cognitiveArchitecture_sessionContext.59.ec7f247f', 'ar'), 'saudi'],
    'uae': [t('auto.cognitiveArchitecture_sessionContext.58.9bc10b8c', 'ar'), t('auto.cognitiveArchitecture_sessionContext.57.1c5d0e9e', 'ar'), t('auto.cognitiveArchitecture_sessionContext.56.4a07a7fb', 'ar'), t('auto.cognitiveArchitecture_sessionContext.55.cd666d65', 'ar'), 'uae'],
    'indonesia': [t('auto.cognitiveArchitecture_sessionContext.54.bc06cf13', 'ar'), t('auto.cognitiveArchitecture_sessionContext.53.99a92077', 'ar'), t('auto.cognitiveArchitecture_sessionContext.52.da2132a6', 'ar'), 'indonesia'],
    'usa': [t('auto.cognitiveArchitecture_sessionContext.51.d2dcf00d', 'ar'), t('auto.cognitiveArchitecture_sessionContext.50.50969bea', 'ar'), t('auto.cognitiveArchitecture_sessionContext.49.15a75967', 'ar'), 'usa', 'america'],
    'global': [t('auto.cognitiveArchitecture_sessionContext.48.b4d34f40', 'ar'), t('auto.cognitiveArchitecture_sessionContext.47.5201f91f', 'ar'), t('auto.cognitiveArchitecture_sessionContext.46.b7de7e68', 'ar'), 'global'],
  };
  
  for (const [country, patterns] of Object.entries(countryPatterns)) {
    if (patterns.some(p => question.toLowerCase().includes(p.toLowerCase()))) {
      context.country = country;
      break;
    }
  }
  
  //  
  const domainPatterns: Record<string, string[]> = {
    'politics': [t('auto.cognitiveArchitecture_sessionContext.45.26a57968', 'ar'), t('auto.cognitiveArchitecture_sessionContext.44.4d8b589c', 'ar'), t('auto.cognitiveArchitecture_sessionContext.43.d9b242e6', 'ar'), t('auto.cognitiveArchitecture_sessionContext.42.52d79bae', 'ar'), t('auto.cognitiveArchitecture_sessionContext.41.b80d3d91', 'ar'), t('auto.cognitiveArchitecture_sessionContext.40.5ef70e19', 'ar')],
    'economy': [t('auto.cognitiveArchitecture_sessionContext.39.6d38c2ea', 'ar'), t('auto.cognitiveArchitecture_sessionContext.38.b1941eb0', 'ar'), t('auto.cognitiveArchitecture_sessionContext.37.a09cec5c', 'ar'), t('auto.cognitiveArchitecture_sessionContext.36.8b8e7c7f', 'ar'), t('auto.cognitiveArchitecture_sessionContext.35.f879f70c', 'ar'), t('auto.cognitiveArchitecture_sessionContext.34.db2f097a', 'ar'), t('auto.cognitiveArchitecture_sessionContext.33.8c4bfb76', 'ar'), t('auto.cognitiveArchitecture_sessionContext.32.23163ab2', 'ar')],
    'health': [t('auto.cognitiveArchitecture_sessionContext.31.72c707a2', 'ar'), t('auto.cognitiveArchitecture_sessionContext.30.46191a15', 'ar'), t('auto.cognitiveArchitecture_sessionContext.29.51f4011d', 'ar'), t('auto.cognitiveArchitecture_sessionContext.28.aae445ae', 'ar'), t('auto.cognitiveArchitecture_sessionContext.27.dc7cff7f', 'ar'), t('auto.cognitiveArchitecture_sessionContext.26.98b7356c', 'ar')],
    'education': [t('auto.cognitiveArchitecture_sessionContext.25.a0eee03f', 'ar'), t('auto.cognitiveArchitecture_sessionContext.24.29fbcd7b', 'ar'), t('auto.cognitiveArchitecture_sessionContext.23.44ee4b4e', 'ar'), t('auto.cognitiveArchitecture_sessionContext.22.7601e075', 'ar'), t('auto.cognitiveArchitecture_sessionContext.21.9ac0bbb8', 'ar')],
    'security': [t('auto.cognitiveArchitecture_sessionContext.20.b5ae7ef3', 'ar'), t('auto.cognitiveArchitecture_sessionContext.19.4a79ffc6', 'ar'), t('auto.cognitiveArchitecture_sessionContext.18.6f820943', 'ar'), t('auto.cognitiveArchitecture_sessionContext.17.393955e1', 'ar'), t('auto.cognitiveArchitecture_sessionContext.16.b2155e1c', 'ar'), t('auto.cognitiveArchitecture_sessionContext.15.3306d777', 'ar')],
    'environment': [t('auto.cognitiveArchitecture_sessionContext.14.6d54e22b', 'ar'), t('auto.cognitiveArchitecture_sessionContext.13.3aa1ddb3', 'ar'), t('auto.cognitiveArchitecture_sessionContext.12.ac19a8d6', 'ar'), t('auto.cognitiveArchitecture_sessionContext.11.b659f350', 'ar')],
    'technology': [t('auto.cognitiveArchitecture_sessionContext.10.e204e82f', 'ar'), t('auto.cognitiveArchitecture_sessionContext.9.16cdd488', 'ar'), t('auto.cognitiveArchitecture_sessionContext.8.ec6d9289', 'ar'), t('auto.cognitiveArchitecture_sessionContext.7.0daf322c', 'ar')],
    'society': [t('auto.cognitiveArchitecture_sessionContext.6.e915fc2f', 'ar'), t('auto.cognitiveArchitecture_sessionContext.5.2d5572e2', 'ar'), t('auto.cognitiveArchitecture_sessionContext.4.08ea38f8', 'ar'), t('auto.cognitiveArchitecture_sessionContext.3.cfc84215', 'ar'), t('auto.cognitiveArchitecture_sessionContext.2.30df0f23', 'ar')],
  };
  
  for (const [domain, patterns] of Object.entries(domainPatterns)) {
    if (patterns.some(p => question.toLowerCase().includes(p.toLowerCase()))) {
      context.domain = domain;
      break;
    }
  }
  
  //   ( )
  //        
  const topicMatch = question
    .replace(/^(||||||||||)\s*/i, '')
    .replace(/\?|/g, '')
    .trim();
  
  if (topicMatch.length > 5) {
    context.topic = topicMatch.substring(0, 100);
  }
  
  return context;
}

/**
 *      
 *      
 */
export function getFullContext(sessionId: string, question: string): {
  session: SessionContext;
  currentContext: ExtractedContext;
  effectiveContext: {
    country: string;
    domain: string;
    topic: string;
    isFollowUp: boolean;
    questionNumber: number;
  };
} {
  const extractedContext = extractContextFromQuestion(question);
  const session = updateSessionContext(sessionId, question, extractedContext);
  
  //   =   +  
  const effectiveContext = {
    country: extractedContext.country || session.country || 'global',
    domain: extractedContext.domain || session.domain || 'general',
    topic: extractedContext.topic || session.topic || question,
    isFollowUp: session.questionHistory.length > 1,
    questionNumber: session.questionHistory.length,
  };
  
  return {
    session,
    currentContext: extractedContext,
    effectiveContext,
  };
}

/**
 *   
 */
export function resetSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

/**
 *    
 */
export function getSessionSummary(sessionId: string): string {
  const session = sessionStore.get(sessionId);
  if (!session) return t('auto.cognitiveArchitecture_sessionContext.1.88d3dafb', 'ar');
  
  const parts: string[] = [];
  
  if (session.country) parts.push(`: ${session.country}`);
  if (session.domain) parts.push(`: ${session.domain}`);
  if (session.topic) parts.push(`: ${session.topic}`);
  parts.push(` : ${session.questionHistory.length}`);
  
  return parts.join(' | ');
}

/**
 *  
 */
export const SessionContextManager = {
  getOrCreateSession,
  updateSessionContext,
  classifyQuestionIntent,
  extractContextFromQuestion,
  getFullContext,
  resetSession,
  getSessionSummary,
};
