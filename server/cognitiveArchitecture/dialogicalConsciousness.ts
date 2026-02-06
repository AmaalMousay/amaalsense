/**
 * Dialogical Consciousness Layer
 * 
 * Purpose: Understands that we are in the same conversation
 * - Maintains awareness of conversation flow
 * - Links current question to previous responses
 * - Builds coherent multi-turn dialogue
 */

export interface DialogueState {
  sessionId: string;
  turnNumber: number;
  previousQuestions: string[];
  previousResponses: string[];
  conversationTheme: string;
  lastUpdated: Date;
}

export interface DialogueContext {
  isFollowUp: boolean;
  referencesToPrevious: string[];
  conversationPhase: 'opening' | 'exploration' | 'deepening' | 'closing';
  coherenceScore: number;
}

class DialogicalConsciousnessClass {
  private dialogues: Map<string, DialogueState> = new Map();

  /**
   * Initialize a new dialogue session
   */
  initializeDialogue(sessionId: string, initialQuestion: string): DialogueState {
    const state: DialogueState = {
      sessionId,
      turnNumber: 1,
      previousQuestions: [initialQuestion],
      previousResponses: [],
      conversationTheme: this.extractTheme(initialQuestion),
      lastUpdated: new Date(),
    };

    this.dialogues.set(sessionId, state);
    return state;
  }

  /**
   * Update dialogue state with new turn
   */
  updateDialogue(sessionId: string, question: string, response: string): DialogueState {
    let state = this.dialogues.get(sessionId);

    if (!state) {
      // Initialize if doesn't exist
      state = this.initializeDialogue(sessionId, question);
    } else {
      // Update existing dialogue
      state.turnNumber += 1;
      state.previousQuestions.push(question);
      state.previousResponses.push(response);
      state.lastUpdated = new Date();

      // Update theme if conversation shifts
      const newTheme = this.extractTheme(question);
      if (newTheme && newTheme !== state.conversationTheme) {
        state.conversationTheme = newTheme;
      }
    }

    this.dialogues.set(sessionId, state);
    return state;
  }

  /**
   * Analyze the current question in dialogue context
   */
  analyzeDialogueContext(sessionId: string, currentQuestion: string): DialogueContext {
    const state = this.dialogues.get(sessionId);

    if (!state || state.previousQuestions.length === 0) {
      // First turn - no dialogue context yet
      return {
        isFollowUp: false,
        referencesToPrevious: [],
        conversationPhase: 'opening',
        coherenceScore: 1.0,
      };
    }

    // Check if current question references previous turns
    const referencesToPrevious = this.detectReferences(currentQuestion, state);

    // Determine conversation phase
    const conversationPhase = this.determinePhase(state.turnNumber);

    // Calculate coherence score
    const coherenceScore = this.calculateCoherence(currentQuestion, state);

    return {
      isFollowUp: referencesToPrevious.length > 0 || state.turnNumber > 1,
      referencesToPrevious,
      conversationPhase,
      coherenceScore,
    };
  }

  /**
   * Get dialogue state
   */
  getDialogueState(sessionId: string): DialogueState | null {
    return this.dialogues.get(sessionId) || null;
  }

  /**
   * Clear dialogue (when user explicitly starts new conversation)
   */
  clearDialogue(sessionId: string): void {
    this.dialogues.delete(sessionId);
  }

  /**
   * Extract conversation theme from question
   */
  private extractTheme(question: string): string {
    // Simple theme extraction - can be enhanced with NLP
    const keywords = question
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 3);

    return keywords.join(' ');
  }

  /**
   * Detect references to previous turns
   */
  private detectReferences(currentQuestion: string, state: DialogueState): string[] {
    const references: string[] = [];
    const lowerQuestion = currentQuestion.toLowerCase();

    // Check for explicit reference words
    const referencePatterns = [
      { pattern: /^(ذلك|هذا|هذه|تلك)/i, ref: 'previous_topic' },
      { pattern: /(السابق|الماضي|قبل)/i, ref: 'previous_response' },
      { pattern: /^(و|أيضاً|كذلك|بالإضافة)/i, ref: 'continuation' },
      { pattern: /^(لكن|ولكن|مع ذلك)/i, ref: 'contrast' },
      { pattern: /^(إذاً|إذن|لذلك|بالتالي)/i, ref: 'conclusion' },
      { pattern: /^(كيف|لماذا|ماذا).*\?/i, ref: 'follow_up_question' },
    ];

    for (const { pattern, ref } of referencePatterns) {
      if (pattern.test(lowerQuestion)) {
        references.push(ref);
      }
    }

    // Check for keyword overlap with previous questions
    const currentKeywords = new Set(lowerQuestion.split(/\s+/));
    for (const prevQuestion of state.previousQuestions.slice(-3)) {
      const prevKeywords = prevQuestion.toLowerCase().split(/\s+/);
      const overlap = prevKeywords.filter(kw => currentKeywords.has(kw));
      
      if (overlap.length >= 2) {
        references.push('keyword_overlap');
        break;
      }
    }

    return references;
  }

  /**
   * Determine conversation phase based on turn number
   */
  private determinePhase(turnNumber: number): 'opening' | 'exploration' | 'deepening' | 'closing' {
    if (turnNumber === 1) return 'opening';
    if (turnNumber <= 3) return 'exploration';
    if (turnNumber <= 6) return 'deepening';
    return 'closing';
  }

  /**
   * Calculate coherence score (how well current question fits the dialogue)
   */
  private calculateCoherence(currentQuestion: string, state: DialogueState): number {
    if (state.previousQuestions.length === 0) return 1.0;

    // Simple coherence: keyword overlap with previous questions
    const currentKeywords = new Set(
      currentQuestion.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );

    let maxOverlap = 0;
    for (const prevQuestion of state.previousQuestions.slice(-3)) {
      const prevKeywords = prevQuestion.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const overlap = prevKeywords.filter(kw => currentKeywords.has(kw)).length;
      maxOverlap = Math.max(maxOverlap, overlap);
    }

    // Normalize to 0-1 range
    const coherenceScore = Math.min(1.0, maxOverlap / 3);
    return coherenceScore;
  }

  /**
   * Get conversation summary for context
   */
  getConversationSummary(sessionId: string): string {
    const state = this.dialogues.get(sessionId);
    if (!state || state.previousQuestions.length === 0) {
      return '';
    }

    const recentTurns = Math.min(3, state.previousQuestions.length);
    let summary = `المحادثة السابقة (${recentTurns} أسئلة):\n`;

    for (let i = state.previousQuestions.length - recentTurns; i < state.previousQuestions.length; i++) {
      summary += `\nسؤال ${i + 1}: ${state.previousQuestions[i]}`;
      if (state.previousResponses[i]) {
        summary += `\nالرد: ${state.previousResponses[i].substring(0, 200)}...`;
      }
    }

    return summary;
  }
}

export const DialogicalConsciousness = new DialogicalConsciousnessClass();
