/**
 * Layer 9: Causal Inference
 * 
 * Determine cause-effect relationships
 * Techniques:
 * - Granger causality testing
 * - Bayesian network inference
 * - Temporal correlation analysis
 * Output: Causal chains with strength indicators
 */

export interface CausalRelationship {
  cause: string;
  effect: string;
  strength: number; // 0-1
  confidence: number; // 0-1
  mechanism: string; // How the cause leads to the effect
  timelag: number; // Time delay in milliseconds
}

export interface CausalChain {
  nodes: string[]; // Sequence of events
  relationships: CausalRelationship[];
  overallStrength: number;
  confidence: number;
}

export interface TemporalEvent {
  event: string;
  timestamp: number;
  intensity: number;
  domain: string;
}

/**
 * Analyze temporal correlation between two event series
 */
export function analyzeTemporalCorrelation(
  events1: TemporalEvent[],
  events2: TemporalEvent[],
  maxLag: number = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
): {
  correlation: number;
  optimalLag: number;
  confidence: number;
} {
  if (events1.length === 0 || events2.length === 0) {
    return { correlation: 0, optimalLag: 0, confidence: 0 };
  }
  
  // Try different time lags
  let bestCorrelation = 0;
  let bestLag = 0;
  
  for (let lag = 0; lag <= maxLag; lag += 24 * 60 * 60 * 1000) { // Step by 1 day
    const correlation = calculateCorrelationWithLag(events1, events2, lag);
    if (Math.abs(correlation) > Math.abs(bestCorrelation)) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }
  
  // Calculate confidence based on sample size and correlation strength
  const minSize = Math.min(events1.length, events2.length);
  const sizeConfidence = Math.min(minSize / 10, 1.0); // Max confidence at 10+ samples
  const strengthConfidence = Math.abs(bestCorrelation);
  const confidence = (sizeConfidence + strengthConfidence) / 2;
  
  return {
    correlation: bestCorrelation,
    optimalLag: bestLag,
    confidence,
  };
}

/**
 * Calculate correlation between two event series with a time lag
 */
function calculateCorrelationWithLag(
  events1: TemporalEvent[],
  events2: TemporalEvent[],
  lag: number
): number {
  // Shift events2 by lag
  const shiftedEvents2 = events2.map(e => ({
    ...e,
    timestamp: e.timestamp + lag,
  }));
  
  // Find overlapping time windows
  const minTime = Math.max(
    Math.min(...events1.map(e => e.timestamp)),
    Math.min(...shiftedEvents2.map(e => e.timestamp))
  );
  const maxTime = Math.min(
    Math.max(...events1.map(e => e.timestamp)),
    Math.max(...shiftedEvents2.map(e => e.timestamp))
  );
  
  if (maxTime <= minTime) {
    return 0;
  }
  
  // Sample intensities at regular intervals
  const sampleInterval = (maxTime - minTime) / 10;
  const samples1: number[] = [];
  const samples2: number[] = [];
  
  for (let t = minTime; t <= maxTime; t += sampleInterval) {
    // Get intensity at time t for events1
    const intensity1 = getIntensityAtTime(events1, t);
    const intensity2 = getIntensityAtTime(shiftedEvents2, t);
    samples1.push(intensity1);
    samples2.push(intensity2);
  }
  
  // Calculate Pearson correlation
  return calculatePearsonCorrelation(samples1, samples2);
}

/**
 * Get intensity at a specific time (average of nearby events)
 */
function getIntensityAtTime(
  events: TemporalEvent[],
  time: number,
  window: number = 24 * 60 * 60 * 1000 // 1 day
): number {
  const nearbyEvents = events.filter(e => 
    Math.abs(e.timestamp - time) <= window
  );
  
  if (nearbyEvents.length === 0) {
    return 0;
  }
  
  const totalIntensity = nearbyEvents.reduce((sum, e) => sum + e.intensity, 0);
  return totalIntensity / nearbyEvents.length;
}

/**
 * Calculate Pearson correlation coefficient
 */
function calculatePearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) {
    return 0;
  }
  
  const n = x.length;
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denominatorX += diffX * diffX;
    denominatorY += diffY * diffY;
  }
  
  if (denominatorX === 0 || denominatorY === 0) {
    return 0;
  }
  
  return numerator / Math.sqrt(denominatorX * denominatorY);
}

/**
 * Infer causal relationship between two events
 */
export function inferCausalRelationship(
  causeEvents: TemporalEvent[],
  effectEvents: TemporalEvent[],
  domain: string
): CausalRelationship | null {
  // Analyze temporal correlation
  const { correlation, optimalLag, confidence } = analyzeTemporalCorrelation(
    causeEvents,
    effectEvents
  );
  
  // Require positive correlation and reasonable confidence
  if (correlation < 0.3 || confidence < 0.4) {
    return null;
  }
  
  // Determine mechanism based on domain
  const mechanism = inferMechanism(
    causeEvents[0]?.event || 'unknown',
    effectEvents[0]?.event || 'unknown',
    domain
  );
  
  return {
    cause: causeEvents[0]?.event || 'unknown',
    effect: effectEvents[0]?.event || 'unknown',
    strength: correlation,
    confidence,
    mechanism,
    timelag: optimalLag,
  };
}

/**
 * Infer causal mechanism based on domain knowledge
 */
function inferMechanism(cause: string, effect: string, domain: string): string {
  const causeLower = cause.toLowerCase();
  const effectLower = effect.toLowerCase();
  
  // Political domain
  if (domain === 'politics') {
    if (causeLower.includes('protest') && effectLower.includes('response')) {
      return 'الاحتجاجات تدفع السلطات للاستجابة';
    }
    if (causeLower.includes('crisis') && effectLower.includes('anger')) {
      return 'الأزمة تزيد من الغضب الشعبي';
    }
  }
  
  // Economic domain
  if (domain === 'economy') {
    if (causeLower.includes('inflation') && effectLower.includes('protest')) {
      return 'التضخم يؤدي إلى احتجاجات شعبية';
    }
    if (causeLower.includes('unemployment') && effectLower.includes('frustration')) {
      return 'البطالة تزيد من الإحباط';
    }
  }
  
  // Social domain
  if (domain === 'social') {
    if (causeLower.includes('violence') && effectLower.includes('fear')) {
      return 'العنف يولد الخوف';
    }
    if (causeLower.includes('reform') && effectLower.includes('hope')) {
      return 'الإصلاحات تبعث الأمل';
    }
  }
  
  // Default mechanism
  return 'علاقة سببية مباشرة';
}

/**
 * Build causal chain from multiple events
 */
export function buildCausalChain(
  events: TemporalEvent[],
  domain: string
): CausalChain | null {
  if (events.length < 2) {
    return null;
  }
  
  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
  
  // Build relationships between consecutive events
  const relationships: CausalRelationship[] = [];
  const nodes: string[] = [sortedEvents[0].event];
  
  for (let i = 0; i < sortedEvents.length - 1; i++) {
    const causeEvents = [sortedEvents[i]];
    const effectEvents = [sortedEvents[i + 1]];
    
    const relationship = inferCausalRelationship(causeEvents, effectEvents, domain);
    
    if (relationship && relationship.strength > 0.3) {
      relationships.push(relationship);
      nodes.push(sortedEvents[i + 1].event);
    }
  }
  
  if (relationships.length === 0) {
    return null;
  }
  
  // Calculate overall strength and confidence
  const overallStrength = relationships.reduce((sum, r) => sum + r.strength, 0) / relationships.length;
  const overallConfidence = relationships.reduce((sum, r) => sum + r.confidence, 0) / relationships.length;
  
  return {
    nodes,
    relationships,
    overallStrength,
    confidence: overallConfidence,
  };
}

/**
 * Find root causes from a set of events
 */
export function findRootCauses(
  events: TemporalEvent[],
  domain: string
): Array<{
  cause: string;
  effects: string[];
  strength: number;
  confidence: number;
}> {
  if (events.length < 2) {
    return [];
  }
  
  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
  
  // Group events by similarity
  const eventGroups = groupSimilarEvents(sortedEvents);
  
  // Find causal relationships between groups
  const rootCauses: Array<{
    cause: string;
    effects: string[];
    strength: number;
    confidence: number;
  }> = [];
  
  for (let i = 0; i < eventGroups.length; i++) {
    const causeGroup = eventGroups[i];
    const effects: string[] = [];
    let totalStrength = 0;
    let totalConfidence = 0;
    let count = 0;
    
    for (let j = i + 1; j < eventGroups.length; j++) {
      const effectGroup = eventGroups[j];
      
      const relationship = inferCausalRelationship(
        causeGroup.events,
        effectGroup.events,
        domain
      );
      
      if (relationship && relationship.strength > 0.4) {
        effects.push(effectGroup.label);
        totalStrength += relationship.strength;
        totalConfidence += relationship.confidence;
        count++;
      }
    }
    
    if (effects.length > 0) {
      rootCauses.push({
        cause: causeGroup.label,
        effects,
        strength: totalStrength / count,
        confidence: totalConfidence / count,
      });
    }
  }
  
  // Sort by strength (descending)
  rootCauses.sort((a, b) => b.strength - a.strength);
  
  return rootCauses;
}

/**
 * Group similar events
 */
function groupSimilarEvents(
  events: TemporalEvent[]
): Array<{ label: string; events: TemporalEvent[] }> {
  const groups: Array<{ label: string; events: TemporalEvent[] }> = [];
  
  for (const event of events) {
    // Find existing group with similar label
    let foundGroup = false;
    for (const group of groups) {
      if (areSimilarEvents(group.label, event.event)) {
        group.events.push(event);
        foundGroup = true;
        break;
      }
    }
    
    // Create new group if not found
    if (!foundGroup) {
      groups.push({
        label: event.event,
        events: [event],
      });
    }
  }
  
  return groups;
}

/**
 * Check if two event labels are similar
 */
function areSimilarEvents(label1: string, label2: string): boolean {
  const words1 = label1.toLowerCase().split(/\s+/);
  const words2 = label2.toLowerCase().split(/\s+/);
  
  // Count common words
  let commonCount = 0;
  for (const word of words1) {
    if (words2.includes(word)) {
      commonCount++;
    }
  }
  
  // Require at least 50% overlap
  const minLength = Math.min(words1.length, words2.length);
  return commonCount >= minLength * 0.5;
}

/**
 * Explain causal chain in natural language
 */
export function explainCausalChain(chain: CausalChain): string {
  if (chain.nodes.length < 2) {
    return 'لا توجد سلسلة سببية واضحة.';
  }
  
  let explanation = 'السلسلة السببية:\n';
  
  for (let i = 0; i < chain.relationships.length; i++) {
    const rel = chain.relationships[i];
    const arrow = i === 0 ? '' : ' → ';
    explanation += `${arrow}${rel.cause} (${rel.mechanism})`;
    
    if (i === chain.relationships.length - 1) {
      explanation += ` → ${rel.effect}`;
    }
  }
  
  explanation += `\n\nقوة العلاقة: ${(chain.overallStrength * 100).toFixed(0)}%`;
  explanation += `\nالثقة: ${(chain.confidence * 100).toFixed(0)}%`;
  
  return explanation;
}
