/**
 * Layer 6: Knowledge Base (Long-term Memory)
 * 
 * In Human Brain: Stores accumulated knowledge, experiences, and patterns
 * In AmalSense: Contains causal relationships, historical patterns, expert rules
 * 
 * This is the "wisdom" of the system - what it knows about the world
 */

// ============================================
// CAUSAL RELATIONSHIPS
// ============================================

export interface CausalRelation {
  cause: string;
  effect: string;
  strength: number;        // 0-1: how strong is this relationship?
  direction: 'positive' | 'negative' | 'complex';
  timelag: 'immediate' | 'short' | 'medium' | 'long';
  confidence: number;      // 0-1: how confident are we?
  context?: string;        // When does this apply?
  source?: string;         // Where did we learn this?
}

// Core causal knowledge about economics and markets
export const ECONOMIC_CAUSAL_RELATIONS: CausalRelation[] = [
  // Interest Rates
  {
    cause: 'ارتفاع أسعار الفائدة',
    effect: 'انخفاض أسعار الذهب',
    strength: 0.8,
    direction: 'negative',
    timelag: 'short',
    confidence: 0.9,
    context: 'الفائدة المرتفعة تجعل السندات أكثر جاذبية من الذهب الذي لا يدر عائداً',
    source: 'economic_theory'
  },
  {
    cause: 'ارتفاع أسعار الفائدة',
    effect: 'قوة الدولار',
    strength: 0.85,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.9,
    context: 'الفائدة المرتفعة تجذب رؤوس الأموال الأجنبية للدولار',
    source: 'economic_theory'
  },
  {
    cause: 'ارتفاع أسعار الفائدة',
    effect: 'تباطؤ النمو الاقتصادي',
    strength: 0.7,
    direction: 'negative',
    timelag: 'medium',
    confidence: 0.85,
    context: 'تكلفة الاقتراض المرتفعة تقلل الاستثمار والإنفاق',
    source: 'economic_theory'
  },
  
  // Dollar Strength
  {
    cause: 'قوة الدولار',
    effect: 'انخفاض أسعار الذهب',
    strength: 0.85,
    direction: 'negative',
    timelag: 'immediate',
    confidence: 0.95,
    context: 'الذهب مسعّر بالدولار، فقوة الدولار تجعله أغلى للمشترين الأجانب',
    source: 'market_mechanics'
  },
  {
    cause: 'قوة الدولار',
    effect: 'ضغط على الأسواق الناشئة',
    strength: 0.75,
    direction: 'negative',
    timelag: 'short',
    confidence: 0.8,
    context: 'الدول المدينة بالدولار تعاني من ارتفاع تكلفة الديون',
    source: 'economic_theory'
  },
  {
    cause: 'قوة الدولار',
    effect: 'انخفاض أسعار النفط',
    strength: 0.7,
    direction: 'negative',
    timelag: 'immediate',
    confidence: 0.85,
    context: 'النفط مسعّر بالدولار، نفس منطق الذهب',
    source: 'market_mechanics'
  },
  
  // Inflation
  {
    cause: 'ارتفاع التضخم',
    effect: 'ارتفاع أسعار الذهب',
    strength: 0.8,
    direction: 'positive',
    timelag: 'short',
    confidence: 0.9,
    context: 'الذهب ملاذ آمن ضد تآكل القوة الشرائية',
    source: 'historical_pattern'
  },
  {
    cause: 'ارتفاع التضخم',
    effect: 'رفع أسعار الفائدة',
    strength: 0.85,
    direction: 'positive',
    timelag: 'short',
    confidence: 0.9,
    context: 'البنوك المركزية ترفع الفائدة لمكافحة التضخم',
    source: 'monetary_policy'
  },
  
  // Geopolitical
  {
    cause: 'توترات جيوسياسية',
    effect: 'ارتفاع أسعار الذهب',
    strength: 0.75,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.85,
    context: 'الذهب ملاذ آمن في أوقات عدم اليقين',
    source: 'historical_pattern'
  },
  {
    cause: 'توترات جيوسياسية',
    effect: 'ارتفاع أسعار النفط',
    strength: 0.8,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.9,
    context: 'مخاوف من انقطاع الإمدادات',
    source: 'historical_pattern'
  },
  
  // Media & Psychology
  {
    cause: 'تغطية إعلامية سلبية مكثفة',
    effect: 'ارتفاع مؤشر الخوف الجماعي',
    strength: 0.85,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.9,
    context: 'الإعلام يضخم المشاعر السلبية',
    source: 'psychological_research'
  },
  {
    cause: 'ارتفاع مؤشر الخوف',
    effect: 'بيع الأصول الخطرة',
    strength: 0.8,
    direction: 'positive',
    timelag: 'immediate',
    confidence: 0.85,
    context: 'الخوف يدفع للهروب إلى الأمان',
    source: 'behavioral_finance'
  },
  {
    cause: 'ارتفاع مؤشر الأمل',
    effect: 'شراء الأصول الخطرة',
    strength: 0.7,
    direction: 'positive',
    timelag: 'short',
    confidence: 0.8,
    context: 'التفاؤل يشجع على المخاطرة',
    source: 'behavioral_finance'
  }
];

// ============================================
// EXPERT KNOWLEDGE RULES
// ============================================

export interface ExpertRule {
  id: string;
  name: string;
  condition: string;
  conclusion: string;
  confidence: number;
  category: 'trading' | 'psychology' | 'economics' | 'media' | 'general';
  actionable: boolean;
}

export const EXPERT_RULES: ExpertRule[] = [
  // Trading Rules
  {
    id: 'rule_fear_opportunity',
    name: 'قاعدة الخوف والفرصة',
    condition: 'CFI > 70% AND HRI > 60%',
    conclusion: 'قد تكون هناك فرصة شراء - الخوف المفرط مع وجود أمل يشير لقاع محتمل',
    confidence: 0.75,
    category: 'trading',
    actionable: true
  },
  {
    id: 'rule_greed_warning',
    name: 'قاعدة الطمع والتحذير',
    condition: 'HRI > 80% AND CFI < 30%',
    conclusion: 'تحذير من الإفراط في التفاؤل - قد تكون القمة قريبة',
    confidence: 0.7,
    category: 'trading',
    actionable: true
  },
  {
    id: 'rule_uncertainty',
    name: 'قاعدة عدم اليقين',
    condition: 'GMI between 40-60%',
    conclusion: 'السوق في حالة حيرة - تجنب القرارات الكبيرة',
    confidence: 0.8,
    category: 'trading',
    actionable: true
  },
  
  // Psychology Rules
  {
    id: 'rule_media_amplification',
    name: 'قاعدة التضخيم الإعلامي',
    condition: 'تغطية إعلامية مكثفة لموضوع واحد',
    conclusion: 'المشاعر الحقيقية قد تكون أقل حدة من الانطباع الإعلامي',
    confidence: 0.85,
    category: 'media',
    actionable: false
  },
  {
    id: 'rule_crowd_contrarian',
    name: 'قاعدة مخالفة القطيع',
    condition: 'إجماع شبه كامل في اتجاه واحد',
    conclusion: 'الإجماع الكامل غالباً يسبق انعكاس الاتجاه',
    confidence: 0.7,
    category: 'psychology',
    actionable: true
  },
  
  // Economic Rules
  {
    id: 'rule_fed_impact',
    name: 'قاعدة تأثير الفيدرالي',
    condition: 'قرار فائدة من الفيدرالي',
    conclusion: 'توقع تقلبات قوية في الدولار والذهب والأسهم',
    confidence: 0.9,
    category: 'economics',
    actionable: true
  },
  {
    id: 'rule_inflation_gold',
    name: 'قاعدة التضخم والذهب',
    condition: 'تضخم أعلى من المتوقع',
    conclusion: 'الذهب يميل للارتفاع كتحوط ضد التضخم',
    confidence: 0.85,
    category: 'economics',
    actionable: true
  }
];

// ============================================
// HISTORICAL PATTERNS
// ============================================

export interface HistoricalPattern {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  typicalOutcome: string;
  duration: string;
  reliability: number;
  examples: string[];
}

export const HISTORICAL_PATTERNS: HistoricalPattern[] = [
  {
    id: 'pattern_crisis_gold',
    name: 'نمط الأزمات والذهب',
    description: 'في الأزمات الكبرى، الذهب يرتفع كملاذ آمن',
    triggers: ['أزمة مالية', 'حرب', 'وباء', 'انهيار بنك كبير'],
    typicalOutcome: 'ارتفاع الذهب 10-30% خلال أسابيع',
    duration: 'قصير إلى متوسط المدى',
    reliability: 0.85,
    examples: ['أزمة 2008: الذهب ارتفع 25%', 'كورونا 2020: الذهب وصل لأعلى مستوى تاريخي']
  },
  {
    id: 'pattern_rate_cycle',
    name: 'دورة أسعار الفائدة',
    description: 'رفع الفائدة يضغط على الذهب، خفضها يدعمه',
    triggers: ['قرارات الفيدرالي', 'تغير توقعات التضخم'],
    typicalOutcome: 'علاقة عكسية بين الفائدة والذهب',
    duration: 'متوسط إلى طويل المدى',
    reliability: 0.9,
    examples: ['2022-2023: رفع الفائدة ضغط على الذهب', '2020: خفض الفائدة دعم الذهب']
  },
  {
    id: 'pattern_fear_reversal',
    name: 'نمط انعكاس الخوف',
    description: 'الخوف الشديد غالباً يسبق ارتداد السوق',
    triggers: ['CFI > 80%', 'عناوين كارثية', 'بيع ذعر'],
    typicalOutcome: 'ارتداد خلال أيام إلى أسابيع',
    duration: 'قصير المدى',
    reliability: 0.75,
    examples: ['مارس 2020: ذروة الخوف سبقت أقوى ارتداد', 'أكتوبر 2022: قاع السوق']
  }
];

// ============================================
// ENTITY KNOWLEDGE
// ============================================

export interface EntityKnowledge {
  name: string;
  aliases: string[];
  type: 'commodity' | 'currency' | 'institution' | 'index' | 'concept';
  description: string;
  relatedEntities: string[];
  keyFacts: string[];
  tradingHours?: string;
  volatility?: 'low' | 'medium' | 'high';
}

export const ENTITY_KNOWLEDGE: Record<string, EntityKnowledge> = {
  'gold': {
    name: 'الذهب',
    aliases: ['ذهب', 'gold', 'XAU', 'المعدن الأصفر'],
    type: 'commodity',
    description: 'معدن ثمين يُستخدم كملاذ آمن وتحوط ضد التضخم',
    relatedEntities: ['الدولار', 'الفائدة', 'التضخم', 'الفضة'],
    keyFacts: [
      'يتحرك عكسياً مع الدولار في 80% من الحالات',
      'ملاذ آمن في أوقات الأزمات',
      'لا يدر عائداً (عكس السندات)',
      'الطلب الصيني والهندي يؤثر على الأسعار'
    ],
    volatility: 'medium'
  },
  'silver': {
    name: 'الفضة',
    aliases: ['فضة', 'silver', 'XAG'],
    type: 'commodity',
    description: 'معدن ثمين له استخدامات صناعية واستثمارية',
    relatedEntities: ['الذهب', 'الدولار', 'الصناعة'],
    keyFacts: [
      'أكثر تقلباً من الذهب',
      '50% من الطلب صناعي (إلكترونيات، طاقة شمسية)',
      'يتبع الذهب لكن بتحركات أكبر',
      'نسبة الذهب/الفضة مؤشر مهم'
    ],
    volatility: 'high'
  },
  'dollar': {
    name: 'الدولار الأمريكي',
    aliases: ['دولار', 'USD', '$', 'الدولار'],
    type: 'currency',
    description: 'العملة الاحتياطية العالمية',
    relatedEntities: ['الفيدرالي', 'الفائدة', 'الذهب', 'النفط'],
    keyFacts: [
      'عملة الاحتياط العالمية',
      'يتأثر بقرارات الفيدرالي',
      'علاقة عكسية مع الذهب والسلع',
      'مؤشر DXY يقيس قوته مقابل سلة عملات'
    ],
    volatility: 'medium'
  },
  'fed': {
    name: 'الفيدرالي الأمريكي',
    aliases: ['الفيدرالي', 'Fed', 'البنك المركزي الأمريكي', 'الاحتياطي الفيدرالي'],
    type: 'institution',
    description: 'البنك المركزي الأمريكي، يتحكم في السياسة النقدية',
    relatedEntities: ['الفائدة', 'الدولار', 'التضخم'],
    keyFacts: [
      'يجتمع 8 مرات سنوياً لتحديد الفائدة',
      'هدفه: استقرار الأسعار والتوظيف الكامل',
      'قراراته تؤثر على الأسواق العالمية',
      'تصريحات رئيسه تحرك الأسواق'
    ]
  },
  'oil': {
    name: 'النفط',
    aliases: ['نفط', 'oil', 'بترول', 'خام', 'برنت', 'WTI'],
    type: 'commodity',
    description: 'سلعة استراتيجية تؤثر على الاقتصاد العالمي',
    relatedEntities: ['أوبك', 'الدولار', 'التضخم'],
    keyFacts: [
      'مسعّر بالدولار عالمياً',
      'أوبك+ تتحكم في العرض',
      'يؤثر على التضخم مباشرة',
      'برنت للأسواق العالمية، WTI للأمريكية'
    ],
    volatility: 'high'
  }
};

// ============================================
// KNOWLEDGE QUERY FUNCTIONS
// ============================================

/**
 * Find causal relationships for a topic
 */
export function findCausalRelations(topic: string): CausalRelation[] {
  const normalizedTopic = topic.toLowerCase();
  
  return ECONOMIC_CAUSAL_RELATIONS.filter(rel => 
    rel.cause.toLowerCase().includes(normalizedTopic) ||
    rel.effect.toLowerCase().includes(normalizedTopic)
  );
}

/**
 * Find causes for an effect
 */
export function findCausesFor(effect: string): CausalRelation[] {
  const normalizedEffect = effect.toLowerCase();
  
  return ECONOMIC_CAUSAL_RELATIONS.filter(rel =>
    rel.effect.toLowerCase().includes(normalizedEffect)
  ).sort((a, b) => b.strength - a.strength);
}

/**
 * Find effects of a cause
 */
export function findEffectsOf(cause: string): CausalRelation[] {
  const normalizedCause = cause.toLowerCase();
  
  return ECONOMIC_CAUSAL_RELATIONS.filter(rel =>
    rel.cause.toLowerCase().includes(normalizedCause)
  ).sort((a, b) => b.strength - a.strength);
}

/**
 * Get applicable expert rules
 */
export function getApplicableRules(context: {
  cfi?: number;
  hri?: number;
  gmi?: number;
  topic?: string;
}): ExpertRule[] {
  const rules: ExpertRule[] = [];
  
  // Check numeric conditions
  if (context.cfi !== undefined && context.hri !== undefined) {
    if (context.cfi > 70 && context.hri > 60) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_fear_opportunity');
      if (rule) rules.push(rule);
    }
    if (context.hri > 80 && context.cfi < 30) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_greed_warning');
      if (rule) rules.push(rule);
    }
  }
  
  if (context.gmi !== undefined) {
    if (context.gmi >= 40 && context.gmi <= 60) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_uncertainty');
      if (rule) rules.push(rule);
    }
  }
  
  // Check topic-based rules
  if (context.topic) {
    const topic = context.topic.toLowerCase();
    if (topic.includes('إعلام') || topic.includes('أخبار')) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_media_amplification');
      if (rule) rules.push(rule);
    }
    if (topic.includes('فيدرالي') || topic.includes('فائدة')) {
      const rule = EXPERT_RULES.find(r => r.id === 'rule_fed_impact');
      if (rule) rules.push(rule);
    }
  }
  
  return rules;
}

/**
 * Get relevant historical patterns
 */
export function getRelevantPatterns(context: {
  topic?: string;
  cfi?: number;
  keywords?: string[];
}): HistoricalPattern[] {
  const patterns: HistoricalPattern[] = [];
  
  // Check for crisis pattern
  if (context.cfi && context.cfi > 75) {
    const pattern = HISTORICAL_PATTERNS.find(p => p.id === 'pattern_fear_reversal');
    if (pattern) patterns.push(pattern);
  }
  
  // Check for topic-based patterns
  if (context.topic) {
    const topic = context.topic.toLowerCase();
    if (topic.includes('ذهب') || topic.includes('فضة')) {
      const crisisPattern = HISTORICAL_PATTERNS.find(p => p.id === 'pattern_crisis_gold');
      const ratePattern = HISTORICAL_PATTERNS.find(p => p.id === 'pattern_rate_cycle');
      if (crisisPattern) patterns.push(crisisPattern);
      if (ratePattern) patterns.push(ratePattern);
    }
  }
  
  return patterns;
}

/**
 * Get entity knowledge
 */
export function getEntityKnowledge(entity: string): EntityKnowledge | null {
  const normalizedEntity = entity.toLowerCase();
  
  // Direct match
  if (ENTITY_KNOWLEDGE[normalizedEntity]) {
    return ENTITY_KNOWLEDGE[normalizedEntity];
  }
  
  // Search by aliases
  for (const [key, knowledge] of Object.entries(ENTITY_KNOWLEDGE)) {
    if (knowledge.aliases.some(alias => 
      alias.toLowerCase() === normalizedEntity ||
      normalizedEntity.includes(alias.toLowerCase())
    )) {
      return knowledge;
    }
  }
  
  return null;
}

/**
 * Build explanation chain for a phenomenon
 */
export function buildExplanationChain(
  phenomenon: string,
  maxDepth: number = 3
): { chain: CausalRelation[]; explanation: string } {
  const chain: CausalRelation[] = [];
  const visited = new Set<string>();
  
  function findCauses(effect: string, depth: number): void {
    if (depth >= maxDepth || visited.has(effect)) return;
    visited.add(effect);
    
    const causes = findCausesFor(effect);
    for (const cause of causes.slice(0, 2)) { // Top 2 causes
      chain.push(cause);
      findCauses(cause.cause, depth + 1);
    }
  }
  
  findCauses(phenomenon, 0);
  
  // Build explanation text
  let explanation = '';
  if (chain.length > 0) {
    explanation = chain.map((rel, i) => {
      const prefix = i === 0 ? 'السبب الرئيسي: ' : 'وهذا بسبب: ';
      return `${prefix}${rel.cause} → ${rel.effect} (${rel.context || ''})`;
    }).join('\n');
  }
  
  return { chain, explanation };
}

/**
 * Get comprehensive knowledge for a topic
 */
export function getTopicKnowledge(topic: string): {
  entity: EntityKnowledge | null;
  causes: CausalRelation[];
  effects: CausalRelation[];
  rules: ExpertRule[];
  patterns: HistoricalPattern[];
} {
  return {
    entity: getEntityKnowledge(topic),
    causes: findCausesFor(topic),
    effects: findEffectsOf(topic),
    rules: getApplicableRules({ topic }),
    patterns: getRelevantPatterns({ topic })
  };
}
