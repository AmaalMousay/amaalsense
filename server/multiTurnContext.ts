/**
 * Multi-turn Context - تذكر المحادثات السابقة
 */

export type EntityType = 'topic' | 'asset' | 'currency' | 'country' | 'time_period' | 'indicator' | 'emotion' | 'action';

export interface Entity {
  type: EntityType;
  value: string;
  normalizedValue: string;
  confidence: number;
  mentionedAt: number;
  frequency: number;
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  entities: Entity[];
  intent?: string;
  topic?: string;
}

export interface ConversationContext {
  conversationId: string;
  startedAt: number;
  lastUpdatedAt: number;
  turns: ConversationTurn[];
  activeEntities: Map<string, Entity>;
  mainTopic: string | null;
  subTopics: string[];
  emotionalState: { gmi: number; cfi: number; hri: number } | null;
  userPreferences: { preferredLanguage: 'ar' | 'en'; detailLevel: 'brief' | 'detailed'; focusArea: 'decision' | 'analysis' | 'prediction'; };
}

const ENTITY_PATTERNS: Record<EntityType, RegExp[]> = {
  topic: [/(?:about|حول|عن|بخصوص)\s+(.+?)(?:\?|؟|$)/i],
  asset: [/\b(gold|silver|oil|bitcoin|btc|eth|ذهب|فضة|نفط|بيتكوين)\b/i],
  currency: [/\b(USD|EUR|GBP|دولار|يورو|جنيه)\b/i],
  country: [/\b(USA|UK|Libya|Egypt|أمريكا|ليبيا|مصر)\b/i],
  time_period: [/\b(today|tomorrow|yesterday|اليوم|غداً|أمس)\b/i],
  indicator: [/\b(GMI|CFI|HRI|مؤشر)\b/i],
  emotion: [/\b(fear|hope|خوف|أمل)\b/i],
  action: [/\b(buy|sell|شراء|بيع)\b/i]
};

class ConversationContextManager {
  private contexts: Map<string, ConversationContext> = new Map();
  private maxTurns = 20;
  private entityDecayTime = 30 * 60 * 1000;
  
  createContext(conversationId: string): ConversationContext {
    const context: ConversationContext = {
      conversationId, startedAt: Date.now(), lastUpdatedAt: Date.now(), turns: [],
      activeEntities: new Map(), mainTopic: null, subTopics: [], emotionalState: null,
      userPreferences: { preferredLanguage: 'ar', detailLevel: 'detailed', focusArea: 'analysis' }
    };
    this.contexts.set(conversationId, context);
    return context;
  }
  
  getOrCreateContext(conversationId: string): ConversationContext {
    return this.contexts.get(conversationId) || this.createContext(conversationId);
  }
  
  addTurn(conversationId: string, role: 'user' | 'assistant', content: string, intent?: string, topic?: string): ConversationTurn {
    const context = this.getOrCreateContext(conversationId);
    const entities = this.extractEntities(content);
    const turnId = 'turn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const turn: ConversationTurn = { id: turnId, role, content, timestamp: Date.now(), entities, intent, topic };
    context.turns.push(turn);
    for (const entity of entities) {
      const key = entity.type + ':' + entity.normalizedValue;
      const existing = context.activeEntities.get(key);
      if (existing) { existing.frequency++; existing.mentionedAt = Date.now(); }
      else context.activeEntities.set(key, entity);
    }
    if (topic && !context.mainTopic) context.mainTopic = topic;
    else if (topic && topic !== context.mainTopic && !context.subTopics.includes(topic)) context.subTopics.push(topic);
    if (context.turns.length > this.maxTurns) context.turns = context.turns.slice(-this.maxTurns);
    context.lastUpdatedAt = Date.now();
    return turn;
  }
  
  private extractEntities(text: string): Entity[] {
    const entities: Entity[] = [];
    const textLower = text.toLowerCase();
    for (const [type, patterns] of Object.entries(ENTITY_PATTERNS)) {
      for (const pattern of patterns) {
        const matches = textLower.match(pattern);
        if (matches) {
          const value = matches[1] || matches[0];
          entities.push({ type: type as EntityType, value: value.trim(), normalizedValue: value.trim().toLowerCase(), confidence: 0.8, mentionedAt: Date.now(), frequency: 1 });
        }
      }
    }
    return entities;
  }
  
  resolveReferences(conversationId: string, question: string): { resolvedQuestion: string; referencedEntities: Entity[]; contextUsed: boolean; } {
    const context = this.contexts.get(conversationId);
    if (!context || context.turns.length === 0) return { resolvedQuestion: question, referencedEntities: [], contextUsed: false };
    let resolvedQuestion = question;
    const referencedEntities: Entity[] = [];
    let contextUsed = false;
    const pronouns = ['هو', 'هي', 'هذا', 'هذه', 'it', 'this', 'that'];
    for (const pronoun of pronouns) {
      if (question.toLowerCase().includes(pronoun)) {
        const relevantEntity = this.findMostRelevantEntity(context);
        if (relevantEntity) { resolvedQuestion = resolvedQuestion.replace(new RegExp(pronoun, 'gi'), relevantEntity.value); referencedEntities.push(relevantEntity); contextUsed = true; }
      }
    }
    if (!contextUsed && context.mainTopic && this.isAmbiguousQuestion(question)) { 
      resolvedQuestion = question + ' (بخصوص ' + context.mainTopic + ')'; 
      contextUsed = true; 
    }
    return { resolvedQuestion, referencedEntities, contextUsed };
  }
  
  private findMostRelevantEntity(context: ConversationContext): Entity | null {
    let bestEntity: Entity | null = null, bestScore = 0;
    context.activeEntities.forEach((entity) => {
      const recency = 1 - (Date.now() - entity.mentionedAt) / this.entityDecayTime;
      const score = (entity.frequency * 0.3) + (entity.confidence * 0.3) + (recency * 0.4);
      const typePriority = ['topic', 'asset', 'currency'].includes(entity.type) ? 1.5 : 1;
      const finalScore = score * typePriority;
      if (finalScore > bestScore) { bestScore = finalScore; bestEntity = entity; }
    });
    return bestEntity;
  }
  
  private isAmbiguousQuestion(question: string): boolean {
    return [/^(what|how|why|ما|كيف|لماذا)\s*\?$/i, /^(and|و)\s/i].some(pattern => pattern.test(question.trim()));
  }
  
  buildContextForLLM(conversationId: string, maxTurns: number = 5) {
    const context = this.contexts.get(conversationId);
    if (!context) return { conversationHistory: [], activeEntities: [], mainTopic: null, emotionalState: null, summary: '' };
    const recentTurns = context.turns.slice(-maxTurns);
    const conversationHistory = recentTurns.map(turn => ({ role: turn.role, content: turn.content }));
    const activeEntities = Array.from(context.activeEntities.values()).sort((a, b) => b.frequency - a.frequency).slice(0, 10);
    const parts: string[] = [];
    if (context.mainTopic) parts.push('الموضوع الرئيسي: ' + context.mainTopic);
    if (context.subTopics.length > 0) parts.push('مواضيع فرعية: ' + context.subTopics.join(', '));
    return { conversationHistory, activeEntities, mainTopic: context.mainTopic, emotionalState: context.emotionalState, summary: parts.join(' | ') };
  }
  
  updateEmotionalState(conversationId: string, gmi: number, cfi: number, hri: number) {
    const context = this.contexts.get(conversationId);
    if (context) { context.emotionalState = { gmi, cfi, hri }; context.lastUpdatedAt = Date.now(); }
  }
  
  updateUserPreferences(conversationId: string, preferences: Partial<ConversationContext['userPreferences']>) {
    const context = this.contexts.get(conversationId);
    if (context) { context.userPreferences = { ...context.userPreferences, ...preferences }; context.lastUpdatedAt = Date.now(); }
  }
  
  deleteContext(conversationId: string) { this.contexts.delete(conversationId); }
  
  getStats() {
    let totalTurns = 0, totalEntities = 0;
    this.contexts.forEach(context => { totalTurns += context.turns.length; totalEntities += context.activeEntities.size; });
    return { totalContexts: this.contexts.size, averageTurnsPerContext: this.contexts.size > 0 ? totalTurns / this.contexts.size : 0, totalEntities };
  }
}

const contextManager = new ConversationContextManager();

export const MultiTurnContext = {
  createContext: (conversationId: string) => contextManager.createContext(conversationId),
  getContext: (conversationId: string) => contextManager.getOrCreateContext(conversationId),
  addTurn: (conversationId: string, role: 'user' | 'assistant', content: string, intent?: string, topic?: string) => contextManager.addTurn(conversationId, role, content, intent, topic),
  resolveReferences: (conversationId: string, question: string) => contextManager.resolveReferences(conversationId, question),
  buildContextForLLM: (conversationId: string, maxTurns?: number) => contextManager.buildContextForLLM(conversationId, maxTurns),
  updateEmotionalState: (conversationId: string, gmi: number, cfi: number, hri: number) => contextManager.updateEmotionalState(conversationId, gmi, cfi, hri),
  updateUserPreferences: (conversationId: string, preferences: Partial<ConversationContext['userPreferences']>) => contextManager.updateUserPreferences(conversationId, preferences),
  deleteContext: (conversationId: string) => contextManager.deleteContext(conversationId),
  getStats: () => contextManager.getStats()
};

export default MultiTurnContext;
