/**
 * Layer 5: Working Memory (Conversation State)
 * 
 * In Human Brain: Keeps current context in active awareness
 * In AmalSense: Tracks conversation history, current topic, user preferences
 * 
 * This enables follow-up questions and contextual understanding
 */

// Single conversation turn
export interface ConversationTurn {
  id: string;
  timestamp: Date;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  topic?: string;
  entities?: string[];
  sentiment?: string;
}

// Working memory state for a session
export interface WorkingMemoryState {
  sessionId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  
  // Conversation history (last N turns)
  history: ConversationTurn[];
  
  // Current context
  currentTopic: string | null;
  topicHistory: string[];
  
  // Tracked entities across conversation
  mentionedEntities: Map<string, EntityMention>;
  
  // User preferences detected in this session
  detectedPreferences: UserPreferences;
  
  // Conversation flow
  questionCount: number;
  followUpDepth: number;
  conversationMood: 'exploratory' | 'focused' | 'urgent' | 'casual';
}

export interface EntityMention {
  entity: string;
  type: string;
  firstMentioned: Date;
  lastMentioned: Date;
  mentionCount: number;
  context: string[];
}

export interface UserPreferences {
  preferredLanguage: 'ar' | 'en' | 'mixed';
  detailLevel: 'brief' | 'detailed' | 'comprehensive';
  focusAreas: string[];
  avoidTopics: string[];
}

// Memory configuration
const MAX_HISTORY_LENGTH = 20;
const MAX_TOPIC_HISTORY = 10;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// In-memory storage (would be Redis/DB in production)
const sessions = new Map<string, WorkingMemoryState>();

/**
 * Initialize or get working memory for a session
 */
export function getWorkingMemory(sessionId: string, userId?: string): WorkingMemoryState {
  let memory = sessions.get(sessionId);
  
  if (!memory || isSessionExpired(memory)) {
    memory = createNewMemory(sessionId, userId);
    sessions.set(sessionId, memory);
  }
  
  return memory;
}

/**
 * Create new working memory state
 */
function createNewMemory(sessionId: string, userId?: string): WorkingMemoryState {
  return {
    sessionId,
    userId,
    startTime: new Date(),
    lastActivity: new Date(),
    history: [],
    currentTopic: null,
    topicHistory: [],
    mentionedEntities: new Map(),
    detectedPreferences: {
      preferredLanguage: 'ar',
      detailLevel: 'detailed',
      focusAreas: [],
      avoidTopics: []
    },
    questionCount: 0,
    followUpDepth: 0,
    conversationMood: 'exploratory'
  };
}

/**
 * Check if session has expired
 */
function isSessionExpired(memory: WorkingMemoryState): boolean {
  const now = new Date();
  return (now.getTime() - memory.lastActivity.getTime()) > SESSION_TIMEOUT_MS;
}

/**
 * Add a turn to conversation history
 */
export function addTurn(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: {
    intent?: string;
    topic?: string;
    entities?: string[];
    sentiment?: string;
  }
): void {
  const memory = getWorkingMemory(sessionId);
  
  const turn: ConversationTurn = {
    id: `${sessionId}-${Date.now()}`,
    timestamp: new Date(),
    role,
    content,
    ...metadata
  };
  
  // Add to history
  memory.history.push(turn);
  
  // Trim if too long
  if (memory.history.length > MAX_HISTORY_LENGTH) {
    memory.history = memory.history.slice(-MAX_HISTORY_LENGTH);
  }
  
  // Update activity time
  memory.lastActivity = new Date();
  
  // Update topic if provided
  if (metadata?.topic && metadata.topic !== memory.currentTopic) {
    if (memory.currentTopic) {
      memory.topicHistory.push(memory.currentTopic);
      if (memory.topicHistory.length > MAX_TOPIC_HISTORY) {
        memory.topicHistory = memory.topicHistory.slice(-MAX_TOPIC_HISTORY);
      }
    }
    memory.currentTopic = metadata.topic;
  }
  
  // Track entities
  if (metadata?.entities) {
    for (const entity of metadata.entities) {
      trackEntity(memory, entity, content);
    }
  }
  
  // Update question count
  if (role === 'user') {
    memory.questionCount++;
    updateConversationMood(memory, content);
  }
}

/**
 * Track entity mentions
 */
function trackEntity(memory: WorkingMemoryState, entity: string, context: string): void {
  const existing = memory.mentionedEntities.get(entity);
  
  if (existing) {
    existing.lastMentioned = new Date();
    existing.mentionCount++;
    existing.context.push(context.slice(0, 100));
    if (existing.context.length > 5) {
      existing.context = existing.context.slice(-5);
    }
  } else {
    memory.mentionedEntities.set(entity, {
      entity,
      type: 'unknown',
      firstMentioned: new Date(),
      lastMentioned: new Date(),
      mentionCount: 1,
      context: [context.slice(0, 100)]
    });
  }
}

/**
 * Update conversation mood based on user input
 */
function updateConversationMood(memory: WorkingMemoryState, content: string): void {
  // Detect urgency
  if (/الآن|فوراً|عاجل|سريع/.test(content)) {
    memory.conversationMood = 'urgent';
    return;
  }
  
  // Detect focused questioning
  if (memory.questionCount > 3 && memory.currentTopic) {
    const topicMentions = memory.history.filter(t => 
      t.topic === memory.currentTopic
    ).length;
    if (topicMentions >= 3) {
      memory.conversationMood = 'focused';
      return;
    }
  }
  
  // Detect casual conversation
  if (/شكراً|مرحبا|كيف حالك/.test(content)) {
    memory.conversationMood = 'casual';
    return;
  }
  
  // Default to exploratory
  memory.conversationMood = 'exploratory';
}

/**
 * Get conversation context for AI processing
 */
export function getConversationContext(sessionId: string): {
  recentHistory: ConversationTurn[];
  currentTopic: string | null;
  previousTopics: string[];
  frequentEntities: string[];
  mood: string;
  isFollowUp: boolean;
  followUpContext: string | null;
} {
  const memory = getWorkingMemory(sessionId);
  
  // Get recent history (last 5 turns)
  const recentHistory = memory.history.slice(-5);
  
  // Get frequently mentioned entities
  const entityCounts = Array.from(memory.mentionedEntities.entries())
    .sort((a, b) => b[1].mentionCount - a[1].mentionCount)
    .slice(0, 5)
    .map(([entity]) => entity);
  
  // Detect if this is a follow-up question
  const lastUserTurn = memory.history.filter(t => t.role === 'user').slice(-2);
  const isFollowUp = lastUserTurn.length >= 2 && 
    isFollowUpQuestion(lastUserTurn[1]?.content || '', lastUserTurn[0]?.content || '');
  
  // Get follow-up context
  let followUpContext: string | null = null;
  if (isFollowUp && lastUserTurn.length >= 2) {
    followUpContext = lastUserTurn[0].content;
  }
  
  return {
    recentHistory,
    currentTopic: memory.currentTopic,
    previousTopics: memory.topicHistory,
    frequentEntities: entityCounts,
    mood: memory.conversationMood,
    isFollowUp,
    followUpContext
  };
}

/**
 * Detect if current question is a follow-up
 */
function isFollowUpQuestion(current: string, previous: string): boolean {
  // Short questions are often follow-ups
  if (current.length < 30) {
    // Check for follow-up markers
    if (/^(و|لكن|طيب|اوكي|حسناً|ماذا عن|وماذا|ولماذا|وكيف)/.test(current)) {
      return true;
    }
    
    // Check for pronouns referring to previous context
    if (/^(هو|هي|هذا|هذه|ذلك|تلك|نفس)/.test(current)) {
      return true;
    }
  }
  
  // Check for topic continuation
  const currentWords = new Set(current.split(/\s+/));
  const previousWords = previous.split(/\s+/);
  let sharedWords = 0;
  
  for (const word of previousWords) {
    if (currentWords.has(word) && word.length > 2) {
      sharedWords++;
    }
  }
  
  return sharedWords >= 2;
}

/**
 * Get last N user questions
 */
export function getLastQuestions(sessionId: string, n: number = 3): string[] {
  const memory = getWorkingMemory(sessionId);
  return memory.history
    .filter(t => t.role === 'user')
    .slice(-n)
    .map(t => t.content);
}

/**
 * Get conversation summary
 */
export function getConversationSummary(sessionId: string): {
  duration: number;
  turnCount: number;
  questionCount: number;
  topicsDiscussed: string[];
  mainEntities: string[];
  mood: string;
} {
  const memory = getWorkingMemory(sessionId);
  
  const duration = (new Date().getTime() - memory.startTime.getTime()) / 1000 / 60; // minutes
  
  const topicsDiscussed = memory.currentTopic 
    ? [...memory.topicHistory, memory.currentTopic]
    : memory.topicHistory;
  
  const mainEntities = Array.from(memory.mentionedEntities.entries())
    .sort((a, b) => b[1].mentionCount - a[1].mentionCount)
    .slice(0, 5)
    .map(([entity]) => entity);
  
  return {
    duration,
    turnCount: memory.history.length,
    questionCount: memory.questionCount,
    topicsDiscussed: Array.from(new Set(topicsDiscussed)),
    mainEntities,
    mood: memory.conversationMood
  };
}

/**
 * Clear session memory
 */
export function clearMemory(sessionId: string): void {
  sessions.delete(sessionId);
}

/**
 * Update user preferences based on conversation
 */
export function updatePreferences(
  sessionId: string,
  preferences: Partial<UserPreferences>
): void {
  const memory = getWorkingMemory(sessionId);
  memory.detectedPreferences = {
    ...memory.detectedPreferences,
    ...preferences
  };
}

/**
 * Get detected user preferences
 */
export function getPreferences(sessionId: string): UserPreferences {
  const memory = getWorkingMemory(sessionId);
  return memory.detectedPreferences;
}

/**
 * Check if topic was discussed before
 */
export function wasTopicDiscussed(sessionId: string, topic: string): boolean {
  const memory = getWorkingMemory(sessionId);
  const allTopics = memory.currentTopic 
    ? [...memory.topicHistory, memory.currentTopic]
    : memory.topicHistory;
  
  return allTopics.some(t => 
    t.toLowerCase().includes(topic.toLowerCase()) ||
    topic.toLowerCase().includes(t.toLowerCase())
  );
}

/**
 * Get related context from previous turns
 */
export function getRelatedContext(sessionId: string, topic: string): string[] {
  const memory = getWorkingMemory(sessionId);
  
  const relatedTurns = memory.history.filter(turn => {
    const content = turn.content.toLowerCase();
    return content.includes(topic.toLowerCase()) ||
           (turn.topic && turn.topic.toLowerCase().includes(topic.toLowerCase()));
  });
  
  return relatedTurns.map(t => t.content);
}


// =============================================================================
// DOMAIN WORKING MEMORY HELPERS (merged from workingMemory.ts)
// =============================================================================

/**
 * Layer 5: Working Memory
 * 
 * Short-term information storage with 24-hour retention
 * Capacity: Last 100 data points per domain
 * Structure: Temporal queue with priority indexing
 */

export interface DomainMemoryItem {
  id: string;
  domain: string;
  content: string;
  emotionalVector: {
    fear: number;
    hope: number;
    anger: number;
    mood: number;
  };
  timestamp: number;
  priority: number; // 0-100
  accessCount: number;
}

export interface DomainWorkingMemoryState {
  items: Map<string, DomainMemoryItem[]>; // domain -> items
  maxItemsPerDomain: number;
  retentionHours: number;
}

/**
 * Initialize working memory
 */
export function initDomainWorkingMemory(): DomainWorkingMemoryState {
  return {
    items: new Map(),
    maxItemsPerDomain: 100,
    retentionHours: 24,
  };
}

/**
 * Add item to working memory
 */
export function addToDomainWorkingMemory(
  state: DomainWorkingMemoryState,
  item: Omit<DomainMemoryItem, 'id' | 'accessCount'>
): DomainWorkingMemoryState {
  const domain = item.domain;
  const domainItems = state.items.get(domain) || [];
  
  // Create new item with ID
  const newItem: DomainMemoryItem = {
    ...item,
    id: `${domain}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    accessCount: 0,
  };
  
  // Add to domain items
  const updatedItems = [...domainItems, newItem];
  
  // Sort by priority (descending) and timestamp (descending)
  updatedItems.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.timestamp - a.timestamp;
  });
  
  // Keep only maxItemsPerDomain items
  const trimmedItems = updatedItems.slice(0, state.maxItemsPerDomain);
  
  // Update state
  const newItems = new Map(state.items);
  newItems.set(domain, trimmedItems);
  
  return {
    ...state,
    items: newItems,
  };
}

/**
 * Retrieve items from working memory
 */
export function retrieveFromDomainWorkingMemory(
  state: DomainWorkingMemoryState,
  domain: string,
  limit: number = 10
): DomainMemoryItem[] {
  const domainItems = state.items.get(domain) || [];
  
  // Filter out expired items (older than retentionHours)
  const now = Date.now();
  const retentionMs = state.retentionHours * 60 * 60 * 1000;
  
  const validItems = domainItems.filter(item => {
    return (now - item.timestamp) < retentionMs;
  });
  
  // Return top N items by priority
  return validItems.slice(0, limit);
}

/**
 * Search working memory by content similarity
 */
export function searchDomainWorkingMemory(
  state: DomainWorkingMemoryState,
  query: string,
  domain?: string,
  limit: number = 5
): DomainMemoryItem[] {
  const queryLower = query.toLowerCase();
  const results: Array<{ item: DomainMemoryItem; score: number }> = [];
  
  // Get domains to search
  const domainsToSearch = domain 
    ? [domain] 
    : Array.from(state.items.keys());
  
  // Search across domains
  for (const d of domainsToSearch) {
    const items = retrieveFromDomainWorkingMemory(state, d, 100);
    
    for (const item of items as DomainMemoryItem[]) {
      const contentLower = item.content.toLowerCase();
      
      // Simple keyword matching score
      const queryWords = queryLower.split(/\s+/);
      let matchCount = 0;
      
      for (const word of queryWords) {
        if (contentLower.includes(word)) {
          matchCount++;
        }
      }
      
      if (matchCount > 0) {
        const score = (matchCount / queryWords.length) * 100;
        results.push({ item, score });
      }
    }
  }
  
  // Sort by score (descending) and return top N
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map(r => r.item);
}

/**
 * Clean up expired items from working memory
 */
export function cleanupDomainWorkingMemory(
  state: DomainWorkingMemoryState
): DomainWorkingMemoryState {
  const now = Date.now();
  const retentionMs = state.retentionHours * 60 * 60 * 1000;
  
  const newItems = new Map<string, DomainMemoryItem[]>();
  
  for (const [domain, items] of Array.from(state.items.entries())) {
    const validItems = items.filter(item => {
      return (now - item.timestamp) < retentionMs;
    });
    
    if (validItems.length > 0) {
      newItems.set(domain, validItems);
    }
  }
  
  return {
    ...state,
    items: newItems,
  };
}

/**
 * Get memory statistics
 */
export function getDomainMemoryStats(state: DomainWorkingMemoryState): {
  totalItems: number;
  itemsByDomain: Record<string, number>;
  oldestItem: number | null;
  newestItem: number | null;
} {
  let totalItems = 0;
  const itemsByDomain: Record<string, number> = {};
  let oldestTimestamp: number | null = null;
  let newestTimestamp: number | null = null;
  
  for (const [domain, items] of Array.from(state.items.entries())) {
    totalItems += items.length;
    itemsByDomain[domain] = items.length;
    
    for (const item of items as DomainMemoryItem[]) {
      if (oldestTimestamp === null || item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
      }
      if (newestTimestamp === null || item.timestamp > newestTimestamp) {
        newestTimestamp = item.timestamp;
      }
    }
  }
  
  return {
    totalItems,
    itemsByDomain,
    oldestItem: oldestTimestamp,
    newestItem: newestTimestamp,
  };
}

/**
 * Increment access count for an item
 */
export function incrementAccessCount(
  state: DomainWorkingMemoryState,
  itemId: string
): DomainWorkingMemoryState {
  const newItems = new Map<string, DomainMemoryItem[]>();
  
  for (const [domain, items] of Array.from(state.items.entries())) {
    const updatedItems = items.map((item: DomainMemoryItem) => {
      if (item.id === itemId) {
        return {
          ...item,
          accessCount: item.accessCount + 1,
        };
      }
      return item;
    });
    newItems.set(domain, updatedItems);
  }
  
  return {
    ...state,
    items: newItems,
  };
}
