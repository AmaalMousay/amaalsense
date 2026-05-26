/**
 * Context Classification Engine
 *
 * Classifies raw event text into a compact context used by the emotion engine,
 * EventVector layer, and risk/prediction branches. This is not a response
 * formatter and contains no fixed output templates.
 */

export type ContentDomain =
  | 'politics'
  | 'economy'
  | 'health'
  | 'war'
  | 'sports'
  | 'entertainment'
  | 'technology'
  | 'environment'
  | 'society'
  | 'education'
  | 'general';

export type EventType =
  | 'crisis'
  | 'death'
  | 'celebration'
  | 'conflict'
  | 'announcement'
  | 'discovery'
  | 'election'
  | 'disaster'
  | 'achievement'
  | 'controversy'
  | 'neutral';

export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ContextResult {
  domain: ContentDomain;
  eventType: EventType;
  region: string;
  sensitivity: SensitivityLevel;
  confidence: number;
  keywords: string[];
  language: 'ar' | 'en' | 'mixed';
}

const DOMAIN_KEYWORDS: Record<ContentDomain, string[]> = {
  politics: ['government', 'president', 'minister', 'parliament', 'election', 'vote', 'policy', 'law', 'democracy', 'party', 'opposition'],
  economy: ['market', 'stock', 'price', 'inflation', 'economy', 'trade', 'bank', 'currency', 'dollar', 'investment', 'gdp', 'recession', 'growth', 'oil', 'gold', 'bitcoin', 'crypto'],
  health: ['health', 'hospital', 'doctor', 'disease', 'virus', 'vaccine', 'medicine', 'patient', 'treatment', 'pandemic', 'outbreak', 'medical'],
  war: ['war', 'military', 'army', 'attack', 'bomb', 'missile', 'soldier', 'conflict', 'battle', 'invasion', 'defense', 'weapon', 'troops', 'casualties'],
  sports: ['football', 'soccer', 'match', 'game', 'team', 'player', 'championship', 'league', 'goal', 'score', 'tournament'],
  entertainment: ['movie', 'film', 'actor', 'singer', 'music', 'concert', 'celebrity', 'award', 'show', 'series'],
  technology: ['technology', 'ai', 'artificial intelligence', 'software', 'app', 'internet', 'computer', 'digital', 'startup', 'cyber'],
  environment: ['climate', 'environment', 'pollution', 'carbon', 'green', 'renewable', 'solar', 'earthquake', 'flood', 'hurricane', 'wildfire'],
  society: ['social', 'community', 'protest', 'rights', 'justice', 'equality', 'discrimination', 'immigration', 'refugee', 'poverty', 'culture'],
  education: ['school', 'university', 'student', 'teacher', 'education', 'exam', 'degree', 'scholarship'],
  general: [],
};

const EVENT_KEYWORDS: Record<EventType, string[]> = {
  crisis: ['crisis', 'emergency', 'collapse', 'shortage', 'panic', 'shock', 'breakdown'],
  death: ['death', 'died', 'killed', 'casualties', 'fatal', 'funeral', 'mourning'],
  celebration: ['celebration', 'festival', 'victory', 'win', 'award', 'ceremony'],
  conflict: ['conflict', 'clash', 'attack', 'war', 'violence', 'fight', 'strike'],
  announcement: ['announced', 'statement', 'declared', 'launch', 'plan', 'decision'],
  discovery: ['discovery', 'research', 'study', 'breakthrough', 'innovation', 'found'],
  election: ['election', 'vote', 'campaign', 'candidate', 'poll', 'ballot'],
  disaster: ['disaster', 'earthquake', 'flood', 'fire', 'storm', 'accident'],
  achievement: ['achievement', 'record', 'milestone', 'success', 'progress'],
  controversy: ['controversy', 'scandal', 'accusation', 'criticism', 'backlash'],
  neutral: [],
};

const REGION_KEYWORDS: Record<string, string[]> = {
  Libya: ['libya', 'tripoli', 'benghazi', 'libyan'],
  Egypt: ['egypt', 'cairo', 'egyptian'],
  'Saudi Arabia': ['saudi', 'riyadh', 'jeddah'],
  UAE: ['uae', 'dubai', 'abu dhabi', 'emirati'],
  Palestine: ['palestine', 'gaza', 'west bank', 'palestinian'],
  USA: ['usa', 'america', 'american', 'washington', 'new york'],
  UK: ['uk', 'britain', 'british', 'london', 'england'],
  Global: ['world', 'global', 'international'],
};

const SENSITIVITY_MATRIX: Record<ContentDomain, Partial<Record<EventType, SensitivityLevel>>> = {
  politics: { crisis: 'critical', conflict: 'high', election: 'high', controversy: 'high', death: 'critical' },
  economy: { crisis: 'critical', disaster: 'critical', controversy: 'high', conflict: 'high' },
  health: { crisis: 'critical', death: 'critical', announcement: 'high', disaster: 'critical' },
  war: { crisis: 'critical', death: 'critical', conflict: 'critical', announcement: 'high' },
  society: { death: 'critical', crisis: 'high', conflict: 'high', controversy: 'high' },
  environment: { disaster: 'critical', crisis: 'critical' },
  sports: { death: 'high', crisis: 'medium', controversy: 'medium' },
  entertainment: { death: 'high', controversy: 'medium', crisis: 'medium' },
  technology: { crisis: 'high', controversy: 'medium' },
  education: { crisis: 'high', death: 'high' },
  general: {},
};

function detectLanguage(text: string): 'ar' | 'en' | 'mixed' {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasArabic && hasEnglish) return 'mixed';
  return hasArabic ? 'ar' : 'en';
}

function scoreKeywords(text: string, keywords: string[]): { score: number; matches: string[] } {
  const lower = text.toLowerCase();
  const matches = keywords.filter(keyword => lower.includes(keyword.toLowerCase()));
  return { score: matches.length, matches };
}

function classifyDomain(text: string): { domain: ContentDomain; confidence: number; keywords: string[] } {
  let best: ContentDomain = 'general';
  let bestScore = 0;
  let bestMatches: string[] = [];
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS) as Array<[ContentDomain, string[]]>) {
    const { score, matches } = scoreKeywords(text, keywords);
    if (score > bestScore) {
      best = domain;
      bestScore = score;
      bestMatches = matches;
    }
  }
  return { domain: best, confidence: bestScore > 0 ? Math.min(95, 45 + bestScore * 12) : 35, keywords: bestMatches };
}

function classifyEventType(text: string): { eventType: EventType; confidence: number; keywords: string[] } {
  let best: EventType = 'neutral';
  let bestScore = 0;
  let bestMatches: string[] = [];
  for (const [eventType, keywords] of Object.entries(EVENT_KEYWORDS) as Array<[EventType, string[]]>) {
    const { score, matches } = scoreKeywords(text, keywords);
    if (score > bestScore) {
      best = eventType;
      bestScore = score;
      bestMatches = matches;
    }
  }
  return { eventType: best, confidence: bestScore > 0 ? Math.min(95, 45 + bestScore * 12) : 35, keywords: bestMatches };
}

function detectRegion(text: string, selectedCountry?: string): string {
  if (selectedCountry) return selectedCountry;
  const lower = text.toLowerCase();
  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some(keyword => lower.includes(keyword))) return region;
  }
  return 'Global';
}

function determineSensitivity(domain: ContentDomain, eventType: EventType): SensitivityLevel {
  return SENSITIVITY_MATRIX[domain]?.[eventType] || (eventType === 'neutral' ? 'low' : 'medium');
}

export function classifyContext(text: string, selectedCountry?: string): ContextResult {
  const language = detectLanguage(text);
  const domain = classifyDomain(text);
  const event = classifyEventType(text);
  const sensitivity = determineSensitivity(domain.domain, event.eventType);
  const confidence = Math.round((domain.confidence + event.confidence) / 2);
  return {
    domain: domain.domain,
    eventType: event.eventType,
    region: detectRegion(text, selectedCountry),
    sensitivity,
    confidence,
    keywords: Array.from(new Set([...domain.keywords, ...event.keywords])),
    language,
  };
}

export default { classifyContext };
