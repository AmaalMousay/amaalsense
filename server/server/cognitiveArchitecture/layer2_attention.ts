/**
 * Layer 2: Attention Filter
 *
 * Filters noisy signals and ranks the most relevant observations for the central
 * processing path. This layer does not fetch data and does not generate answers.
 */

export interface RawSignal {
  id: string;
  content: string;
  source?: string;
  timestamp?: Date | number | string;
  credibility?: number;
  reach?: number;
  engagement?: number;
  metadata?: Record<string, unknown>;
}

export interface AttentionSignal extends RawSignal {
  score: number;
  category: SignalCategory;
  reasons: string[];
}

export type SignalCategory = 'critical' | 'market' | 'political' | 'social' | 'knowledge' | 'noise';

function normalizeTime(value: RawSignal['timestamp']): number {
  if (!value) return Date.now();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? Date.now() : date.getTime();
}

function categorize(content: string): SignalCategory {
  const text = content.toLowerCase();
  if (/\b(crisis|attack|death|war|emergency|collapse)\b/.test(text)) return 'critical';
  if (/\b(gold|oil|market|inflation|currency|bitcoin|stock|rate)\b/.test(text)) return 'market';
  if (/\b(government|election|policy|minister|parliament|sanction)\b/.test(text)) return 'political';
  if (/\b(protest|public|community|services|society|migration)\b/.test(text)) return 'social';
  if (/\b(research|study|evidence|law|medicine|science|report)\b/.test(text)) return 'knowledge';
  return 'noise';
}

function scoreSignal(signal: RawSignal): { score: number; category: SignalCategory; reasons: string[] } {
  const category = categorize(signal.content);
  const reasons: string[] = [];
  let score = 0;
  const credibility = Math.max(0, Math.min(1, signal.credibility ?? 0.5));
  const ageHours = Math.max(0, (Date.now() - normalizeTime(signal.timestamp)) / (1000 * 60 * 60));
  const recency = Math.max(0, 1 - ageHours / 72);
  const reach = Math.min(1, Math.log10((signal.reach || 1) + 1) / 7);
  const engagement = Math.min(1, Math.log10((signal.engagement || 1) + 1) / 6);

  score += credibility * 35;
  score += recency * 25;
  score += reach * 15;
  score += engagement * 15;
  if (category === 'critical') score += 20;
  if (category === 'market' || category === 'political') score += 10;

  reasons.push(`category=${category}`, `credibility=${credibility.toFixed(2)}`, `recency=${recency.toFixed(2)}`);
  return { score: Math.round(Math.min(100, score)), category, reasons };
}

export function filterSignals(signals: RawSignal[], options: { minScore?: number; limit?: number } = {}): AttentionSignal[] {
  const minScore = options.minScore ?? 20;
  const limit = options.limit ?? 50;
  return signals
    .map(signal => ({ ...signal, ...scoreSignal(signal) }))
    .filter(signal => signal.score >= minScore && signal.category !== 'noise')
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getTopSignals(signals: AttentionSignal[], limit: number = 10): AttentionSignal[] {
  return [...signals].sort((a, b) => b.score - a.score).slice(0, limit);
}

export function getSignalsByCategory(signals: AttentionSignal[], category: SignalCategory): AttentionSignal[] {
  return signals.filter(signal => signal.category === category);
}

export function summarizeAttention(signals: AttentionSignal[]): { total: number; byCategory: Record<string, number>; averageScore: number; topReasons: string[] } {
  const byCategory: Record<string, number> = {};
  const reasons: Record<string, number> = {};
  for (const signal of signals) {
    byCategory[signal.category] = (byCategory[signal.category] || 0) + 1;
    for (const reason of signal.reasons) reasons[reason] = (reasons[reason] || 0) + 1;
  }
  return {
    total: signals.length,
    byCategory,
    averageScore: signals.length ? Math.round(signals.reduce((sum, signal) => sum + signal.score, 0) / signals.length) : 0,
    topReasons: Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([reason]) => reason),
  };
}
