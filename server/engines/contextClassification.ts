import { t } from "../_core/i18n";

/**
 * Engine 1: Context Classification
 *     :
 * - domain:  (    ...)
 * - eventType:   (   ...)
 * - region:  
 * - sensitivity:  
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

// Domain keywords mapping
const DOMAIN_KEYWORDS: Record<ContentDomain, { en: string[], ar: string[] }> = {
  politics: {
    en: ['government', 'president', 'minister', 'parliament', 'election', 'vote', 'policy', 'law', 'congress', 'senate', 'democracy', 'political', 'party', 'opposition', 'coalition'],
    ar: [t('auto.engines_contextClassification.264.52d79bae', 'ar'), t('auto.engines_contextClassification.263.5ef70e19', 'ar'), t('auto.engines_contextClassification.262.854382ce', 'ar'), t('auto.engines_contextClassification.261.b80d3d91', 'ar'), t('auto.engines_contextClassification.260.d9b242e6', 'ar'), t('auto.engines_contextClassification.259.12a171f3', 'ar'), t('auto.engines_contextClassification.258.26a57968', 'ar'), t('auto.engines_contextClassification.257.d1ec9be1', 'ar'), t('auto.engines_contextClassification.256.b58da9ae', 'ar'), t('auto.engines_contextClassification.255.32dcd838', 'ar'), t('auto.engines_contextClassification.254.4d8b589c', 'ar'), t('auto.engines_contextClassification.253.49ac0af3', 'ar'), t('auto.engines_contextClassification.252.c4a9390b', 'ar'), t('auto.engines_contextClassification.251.2898b2d8', 'ar')]
  },
  economy: {
    en: ['market', 'stock', 'price', 'inflation', 'economy', 'trade', 'bank', 'currency', 'dollar', 'investment', 'gdp', 'recession', 'growth', 'oil', 'gold', 'bitcoin', 'crypto'],
    ar: [t('auto.engines_contextClassification.250.16c73be6', 'ar'), t('auto.engines_contextClassification.249.866ae2e3', 'ar'), t('auto.engines_contextClassification.248.0d11b6f1', 'ar'), t('auto.engines_contextClassification.247.8b8e7c7f', 'ar'), t('auto.engines_contextClassification.246.6d38c2ea', 'ar'), t('auto.engines_contextClassification.245.cb4d62bf', 'ar'), t('auto.engines_contextClassification.244.f879f70c', 'ar'), t('auto.engines_contextClassification.243.db2f097a', 'ar'), t('auto.engines_contextClassification.242.23163ab2', 'ar'), t('auto.engines_contextClassification.241.2efcd729', 'ar'), t('auto.engines_contextClassification.240.8009605b', 'ar'), t('auto.engines_contextClassification.239.25e94d3e', 'ar'), t('auto.engines_contextClassification.238.02782624', 'ar'), t('auto.engines_contextClassification.237.d76ed4f3', 'ar'), t('auto.engines_contextClassification.236.f39781a6', 'ar'), t('auto.engines_contextClassification.235.ff4f8e79', 'ar')]
  },
  health: {
    en: ['health', 'hospital', 'doctor', 'disease', 'virus', 'vaccine', 'medicine', 'patient', 'treatment', 'covid', 'pandemic', 'outbreak', 'medical', 'surgery', 'cancer'],
    ar: [t('auto.engines_contextClassification.234.72c707a2', 'ar'), t('auto.engines_contextClassification.233.dc7cff7f', 'ar'), t('auto.engines_contextClassification.232.471e98a3', 'ar'), t('auto.engines_contextClassification.231.51f4011d', 'ar'), t('auto.engines_contextClassification.230.615de097', 'ar'), t('auto.engines_contextClassification.229.8d48fc93', 'ar'), t('auto.engines_contextClassification.228.6b5d73fa', 'ar'), t('auto.engines_contextClassification.227.992759e3', 'ar'), t('auto.engines_contextClassification.226.ad5a18db', 'ar'), t('auto.engines_contextClassification.225.3113534f', 'ar'), t('auto.engines_contextClassification.224.aae445ae', 'ar'), t('auto.engines_contextClassification.223.98b7356c', 'ar'), t('auto.engines_contextClassification.222.eb9a5912', 'ar'), t('auto.engines_contextClassification.221.dd7010ed', 'ar')]
  },
  war: {
    en: ['war', 'military', 'army', 'attack', 'bomb', 'missile', 'soldier', 'conflict', 'battle', 'invasion', 'defense', 'weapon', 'troops', 'casualties', 'ceasefire'],
    ar: [t('auto.engines_contextClassification.220.b2155e1c', 'ar'), t('auto.engines_contextClassification.219.6f820943', 'ar'), t('auto.engines_contextClassification.218.dfc15884', 'ar'), t('auto.engines_contextClassification.217.56ea9530', 'ar'), t('auto.engines_contextClassification.216.2fbc78a2', 'ar'), t('auto.engines_contextClassification.215.6d8b38cb', 'ar'), t('auto.engines_contextClassification.214.73000c01', 'ar'), t('auto.engines_contextClassification.213.393955e1', 'ar'), t('auto.engines_contextClassification.212.baf1765f', 'ar'), t('auto.engines_contextClassification.211.1620d789', 'ar'), t('auto.engines_contextClassification.210.2339e93c', 'ar'), t('auto.engines_contextClassification.209.dade933b', 'ar'), t('auto.engines_contextClassification.208.4f9b6aaf', 'ar'), t('auto.engines_contextClassification.207.ec8f5965', 'ar'), t('auto.engines_contextClassification.206.6b04177e', 'ar')]
  },
  sports: {
    en: ['football', 'soccer', 'match', 'game', 'team', 'player', 'championship', 'league', 'goal', 'win', 'score', 'tournament', 'olympic', 'world cup', 'final'],
    ar: [t('auto.engines_contextClassification.205.ad851088', 'ar'), t('auto.engines_contextClassification.204.10fb9dc5', 'ar'), t('auto.engines_contextClassification.203.874011c4', 'ar'), t('auto.engines_contextClassification.202.a1873e2a', 'ar'), t('auto.engines_contextClassification.201.5c6d8448', 'ar'), t('auto.engines_contextClassification.200.9174c93e', 'ar'), t('auto.engines_contextClassification.199.4a3f173b', 'ar'), t('auto.engines_contextClassification.198.837787a2', 'ar'), t('auto.engines_contextClassification.197.830e0929', 'ar'), t('auto.engines_contextClassification.196.0bcec6a6', 'ar'), t('auto.engines_contextClassification.195.b9b8a697', 'ar'), t('auto.engines_contextClassification.194.5d4741e3', 'ar')]
  },
  entertainment: {
    en: ['movie', 'film', 'actor', 'singer', 'music', 'concert', 'celebrity', 'award', 'show', 'series', 'album', 'star', 'hollywood', 'netflix'],
    ar: [t('auto.engines_contextClassification.193.739d1685', 'ar'), t('auto.engines_contextClassification.192.5dd690b2', 'ar'), t('auto.engines_contextClassification.191.47753367', 'ar'), t('auto.engines_contextClassification.190.1e3ad84f', 'ar'), t('auto.engines_contextClassification.189.9257e18c', 'ar'), t('auto.engines_contextClassification.188.65937456', 'ar'), t('auto.engines_contextClassification.187.e3fc61bd', 'ar'), t('auto.engines_contextClassification.186.517f316e', 'ar'), t('auto.engines_contextClassification.185.7864fd8d', 'ar'), t('auto.engines_contextClassification.184.48c007c9', 'ar'), t('auto.engines_contextClassification.183.92ea1d93', 'ar')]
  },
  technology: {
    en: ['technology', 'ai', 'artificial intelligence', 'software', 'app', 'internet', 'computer', 'digital', 'innovation', 'startup', 'tech', 'robot', 'data', 'cyber'],
    ar: [t('auto.engines_contextClassification.182.e204e82f', 'ar'), t('auto.engines_contextClassification.181.ec6d9289', 'ar'), t('auto.engines_contextClassification.180.10d843e1', 'ar'), t('auto.engines_contextClassification.179.b177f0b3', 'ar'), t('auto.engines_contextClassification.178.0daf322c', 'ar'), t('auto.engines_contextClassification.177.3dc03187', 'ar'), t('auto.engines_contextClassification.176.56cc4abe', 'ar'), t('auto.engines_contextClassification.175.24748545', 'ar'), t('auto.engines_contextClassification.174.16cdd488', 'ar'), t('auto.engines_contextClassification.173.4ca8f62f', 'ar'), t('auto.engines_contextClassification.172.e0ac9792', 'ar'), t('auto.engines_contextClassification.171.b742fce2', 'ar')]
  },
  environment: {
    en: ['climate', 'environment', 'pollution', 'carbon', 'green', 'renewable', 'solar', 'earthquake', 'flood', 'hurricane', 'wildfire', 'drought', 'emission'],
    ar: [t('auto.engines_contextClassification.170.3aa1ddb3', 'ar'), t('auto.engines_contextClassification.169.6d54e22b', 'ar'), t('auto.engines_contextClassification.168.ac19a8d6', 'ar'), t('auto.engines_contextClassification.167.a8549b1f', 'ar'), t('auto.engines_contextClassification.166.a6b07639', 'ar'), t('auto.engines_contextClassification.165.57ad2b1d', 'ar'), t('auto.engines_contextClassification.164.090b9062', 'ar'), t('auto.engines_contextClassification.163.b8aa050e', 'ar'), t('auto.engines_contextClassification.162.3e566ab3', 'ar'), t('auto.engines_contextClassification.161.bcb0731f', 'ar'), t('auto.engines_contextClassification.160.01d6926f', 'ar'), t('auto.engines_contextClassification.159.d915a18f', 'ar'), t('auto.engines_contextClassification.158.3007cecc', 'ar')]
  },
  society: {
    en: ['social', 'community', 'protest', 'rights', 'justice', 'equality', 'discrimination', 'immigration', 'refugee', 'poverty', 'education', 'culture'],
    ar: [t('auto.engines_contextClassification.157.2d5572e2', 'ar'), t('auto.engines_contextClassification.156.e915fc2f', 'ar'), t('auto.engines_contextClassification.155.f74d10e0', 'ar'), t('auto.engines_contextClassification.154.0d683f05', 'ar'), t('auto.engines_contextClassification.153.499e0392', 'ar'), t('auto.engines_contextClassification.152.d2ec1b45', 'ar'), t('auto.engines_contextClassification.151.fdd11640', 'ar'), t('auto.engines_contextClassification.150.08ea38f8', 'ar'), t('auto.engines_contextClassification.149.e1776c4f', 'ar'), t('auto.engines_contextClassification.148.83b729ee', 'ar'), t('auto.engines_contextClassification.147.a0eee03f', 'ar'), t('auto.engines_contextClassification.146.febaa7ea', 'ar')]
  },
  education: {
    en: ['school', 'university', 'student', 'teacher', 'education', 'exam', 'degree', 'scholarship', 'research', 'academic', 'learning', 'curriculum'],
    ar: [t('auto.engines_contextClassification.145.44ee4b4e', 'ar'), t('auto.engines_contextClassification.144.7601e075', 'ar'), t('auto.engines_contextClassification.143.9ac0bbb8', 'ar'), t('auto.engines_contextClassification.142.9552dc58', 'ar'), t('auto.engines_contextClassification.141.a0eee03f', 'ar'), t('auto.engines_contextClassification.140.22a23f98', 'ar'), t('auto.engines_contextClassification.139.be0170fd', 'ar'), t('auto.engines_contextClassification.138.d65a2dea', 'ar'), t('auto.engines_contextClassification.137.ba3add14', 'ar'), t('auto.engines_contextClassification.136.f6ddff88', 'ar'), t('auto.engines_contextClassification.135.d6a80c51', 'ar'), t('auto.engines_contextClassification.134.501858f6', 'ar')]
  },
  general: {
    en: [],
    ar: []
  }
};

// Event type keywords
const EVENT_KEYWORDS: Record<EventType, { en: string[], ar: string[] }> = {
  crisis: {
    en: ['crisis', 'emergency', 'urgent', 'critical', 'collapse', 'crash', 'panic', 'chaos', 'disaster'],
    ar: [t('auto.engines_contextClassification.133.38a8a76e', 'ar'), t('auto.engines_contextClassification.132.c15645bd', 'ar'), t('auto.engines_contextClassification.131.0fac5b49', 'ar'), t('auto.engines_contextClassification.130.578fc664', 'ar'), t('auto.engines_contextClassification.129.417cc6aa', 'ar'), t('auto.engines_contextClassification.128.3115aac3', 'ar'), t('auto.engines_contextClassification.127.6e824b75', 'ar'), t('auto.engines_contextClassification.126.676d2f53', 'ar')]
  },
  death: {
    en: ['death', 'died', 'killed', 'murder', 'assassination', 'funeral', 'mourning', 'victim', 'casualty'],
    ar: [t('auto.engines_contextClassification.125.158c325c', 'ar'), t('auto.engines_contextClassification.124.52648b62', 'ar'), t('auto.engines_contextClassification.123.bd80ed20', 'ar'), t('auto.engines_contextClassification.122.c8e9ec22', 'ar'), t('auto.engines_contextClassification.121.73f6132e', 'ar'), t('auto.engines_contextClassification.120.66bf159c', 'ar'), t('auto.engines_contextClassification.119.bef98e5f', 'ar'), t('auto.engines_contextClassification.118.0e23728e', 'ar')]
  },
  celebration: {
    en: ['celebration', 'victory', 'win', 'success', 'achievement', 'congratulations', 'happy', 'joy', 'festival'],
    ar: [t('auto.engines_contextClassification.117.3460cbc6', 'ar'), t('auto.engines_contextClassification.116.c8ba5ec2', 'ar'), t('auto.engines_contextClassification.115.837787a2', 'ar'), t('auto.engines_contextClassification.114.2eb748dc', 'ar'), t('auto.engines_contextClassification.113.c24d8d6c', 'ar'), t('auto.engines_contextClassification.112.827021a8', 'ar'), t('auto.engines_contextClassification.111.e40769f9', 'ar'), t('auto.engines_contextClassification.110.15a6eacb', 'ar'), t('auto.engines_contextClassification.109.d6ad7d91', 'ar')]
  },
  conflict: {
    en: ['conflict', 'dispute', 'tension', 'clash', 'fight', 'battle', 'confrontation', 'opposition'],
    ar: [t('auto.engines_contextClassification.108.393955e1', 'ar'), t('auto.engines_contextClassification.107.02a3af52', 'ar'), t('auto.engines_contextClassification.106.c90d6e3b', 'ar'), t('auto.engines_contextClassification.105.ff0e47e8', 'ar'), t('auto.engines_contextClassification.104.80f25957', 'ar'), t('auto.engines_contextClassification.103.baf1765f', 'ar'), t('auto.engines_contextClassification.102.70e26589', 'ar'), t('auto.engines_contextClassification.101.4788abb3', 'ar')]
  },
  announcement: {
    en: ['announce', 'declare', 'reveal', 'launch', 'introduce', 'statement', 'decision', 'official'],
    ar: [t('auto.engines_contextClassification.100.81581363', 'ar'), t('auto.engines_contextClassification.99.c721facd', 'ar'), t('auto.engines_contextClassification.98.552e365a', 'ar'), t('auto.engines_contextClassification.97.16ae9f71', 'ar'), t('auto.engines_contextClassification.96.2c473ed6', 'ar'), t('auto.engines_contextClassification.95.eda117fc', 'ar'), t('auto.engines_contextClassification.94.47f3200d', 'ar')]
  },
  discovery: {
    en: ['discover', 'find', 'breakthrough', 'innovation', 'research', 'study', 'science', 'new'],
    ar: [t('auto.engines_contextClassification.93.7811e2fe', 'ar'), t('auto.engines_contextClassification.92.3f7ae8a1', 'ar'), t('auto.engines_contextClassification.91.24748545', 'ar'), t('auto.engines_contextClassification.90.ba3add14', 'ar'), t('auto.engines_contextClassification.89.996e5739', 'ar'), t('auto.engines_contextClassification.88.aa0db080', 'ar'), t('auto.engines_contextClassification.87.89465c43', 'ar')]
  },
  election: {
    en: ['election', 'vote', 'ballot', 'candidate', 'campaign', 'poll', 'referendum'],
    ar: [t('auto.engines_contextClassification.86.d9b242e6', 'ar'), t('auto.engines_contextClassification.85.12a171f3', 'ar'), t('auto.engines_contextClassification.84.7a2a8af1', 'ar'), t('auto.engines_contextClassification.83.2886ca94', 'ar'), t('auto.engines_contextClassification.82.d6d03947', 'ar'), t('auto.engines_contextClassification.81.3178ceda', 'ar')]
  },
  disaster: {
    en: ['disaster', 'earthquake', 'flood', 'hurricane', 'tsunami', 'explosion', 'accident', 'tragedy'],
    ar: [t('auto.engines_contextClassification.80.676d2f53', 'ar'), t('auto.engines_contextClassification.79.b8aa050e', 'ar'), t('auto.engines_contextClassification.78.3e566ab3', 'ar'), t('auto.engines_contextClassification.77.bcb0731f', 'ar'), t('auto.engines_contextClassification.76.c3d526f2', 'ar'), t('auto.engines_contextClassification.75.30d2b5de', 'ar'), t('auto.engines_contextClassification.74.51673b06', 'ar'), t('auto.engines_contextClassification.73.6201784d', 'ar')]
  },
  achievement: {
    en: ['achievement', 'record', 'milestone', 'breakthrough', 'first', 'historic', 'award', 'prize'],
    ar: [t('auto.engines_contextClassification.72.c24d8d6c', 'ar'), t('auto.engines_contextClassification.71.3e147708', 'ar'), t('auto.engines_contextClassification.70.46a54865', 'ar'), t('auto.engines_contextClassification.69.e3fc61bd', 'ar'), t('auto.engines_contextClassification.68.e55fe1f0', 'ar'), t('auto.engines_contextClassification.67.a636ca90', 'ar')]
  },
  controversy: {
    en: ['controversy', 'scandal', 'accusation', 'allegation', 'criticism', 'backlash', 'outrage'],
    ar: [t('auto.engines_contextClassification.66.ab2e01fd', 'ar'), t('auto.engines_contextClassification.65.897459c3', 'ar'), t('auto.engines_contextClassification.64.523e850f', 'ar'), t('auto.engines_contextClassification.63.8328b624', 'ar'), t('auto.engines_contextClassification.62.8e7bd750', 'ar'), t('auto.engines_contextClassification.61.287eb2c1', 'ar')]
  },
  neutral: {
    en: [],
    ar: []
  }
};

// Sensitivity mapping by domain and event
const SENSITIVITY_MATRIX: Record<ContentDomain, Record<EventType, SensitivityLevel>> = {
  politics: { crisis: 'critical', death: 'critical', celebration: 'medium', conflict: 'high', announcement: 'medium', discovery: 'low', election: 'high', disaster: 'critical', achievement: 'low', controversy: 'high', neutral: 'medium' },
  economy: { crisis: 'critical', death: 'high', celebration: 'low', conflict: 'high', announcement: 'medium', discovery: 'low', election: 'medium', disaster: 'critical', achievement: 'low', controversy: 'high', neutral: 'medium' },
  health: { crisis: 'critical', death: 'critical', celebration: 'medium', conflict: 'high', announcement: 'high', discovery: 'medium', election: 'low', disaster: 'critical', achievement: 'medium', controversy: 'high', neutral: 'medium' },
  war: { crisis: 'critical', death: 'critical', celebration: 'high', conflict: 'critical', announcement: 'high', discovery: 'medium', election: 'high', disaster: 'critical', achievement: 'medium', controversy: 'critical', neutral: 'high' },
  sports: { crisis: 'medium', death: 'high', celebration: 'low', conflict: 'medium', announcement: 'low', discovery: 'low', election: 'low', disaster: 'high', achievement: 'low', controversy: 'medium', neutral: 'low' },
  entertainment: { crisis: 'medium', death: 'high', celebration: 'low', conflict: 'medium', announcement: 'low', discovery: 'low', election: 'low', disaster: 'high', achievement: 'low', controversy: 'medium', neutral: 'low' },
  technology: { crisis: 'high', death: 'high', celebration: 'low', conflict: 'medium', announcement: 'low', discovery: 'low', election: 'low', disaster: 'high', achievement: 'low', controversy: 'medium', neutral: 'low' },
  environment: { crisis: 'critical', death: 'critical', celebration: 'low', conflict: 'high', announcement: 'medium', discovery: 'medium', election: 'low', disaster: 'critical', achievement: 'low', controversy: 'high', neutral: 'medium' },
  society: { crisis: 'high', death: 'critical', celebration: 'low', conflict: 'high', announcement: 'medium', discovery: 'low', election: 'medium', disaster: 'critical', achievement: 'low', controversy: 'high', neutral: 'medium' },
  education: { crisis: 'high', death: 'high', celebration: 'low', conflict: 'medium', announcement: 'low', discovery: 'low', election: 'low', disaster: 'high', achievement: 'low', controversy: 'medium', neutral: 'low' },
  general: { crisis: 'high', death: 'high', celebration: 'low', conflict: 'high', announcement: 'medium', discovery: 'low', election: 'medium', disaster: 'critical', achievement: 'low', controversy: 'medium', neutral: 'low' }
};

// Country/Region detection
const REGION_KEYWORDS: Record<string, { en: string[], ar: string[] }> = {
  'Libya': { en: ['libya', 'tripoli', 'benghazi', 'libyan'], ar: [t('auto.engines_contextClassification.60.251aff72', 'ar'), t('auto.engines_contextClassification.59.da7424b2', 'ar'), t('auto.engines_contextClassification.58.63a58999', 'ar'), t('auto.engines_contextClassification.57.99a23756', 'ar')] },
  'Egypt': { en: ['egypt', 'cairo', 'egyptian'], ar: [t('auto.engines_contextClassification.56.9f5f187b', 'ar'), t('auto.engines_contextClassification.55.93019aa0', 'ar'), t('auto.engines_contextClassification.54.d896f025', 'ar')] },
  'Saudi Arabia': { en: ['saudi', 'riyadh', 'jeddah'], ar: [t('auto.engines_contextClassification.53.cd8d189f', 'ar'), t('auto.engines_contextClassification.52.ec7f247f', 'ar'), t('auto.engines_contextClassification.51.de8dd0bd', 'ar'), t('auto.engines_contextClassification.50.1d66dcc6', 'ar')] },
  'UAE': { en: ['uae', 'dubai', 'abu dhabi', 'emirati'], ar: [t('auto.engines_contextClassification.49.9bc10b8c', 'ar'), t('auto.engines_contextClassification.48.4a07a7fb', 'ar'), t('auto.engines_contextClassification.47.cd666d65', 'ar'), t('auto.engines_contextClassification.46.9991469c', 'ar')] },
  'Kuwait': { en: ['kuwait', 'kuwaiti'], ar: [t('auto.engines_contextClassification.45.827e1566', 'ar'), t('auto.engines_contextClassification.44.20dc6fb8', 'ar')] },
  'Qatar': { en: ['qatar', 'doha', 'qatari'], ar: [t('auto.engines_contextClassification.43.76394460', 'ar'), t('auto.engines_contextClassification.42.2939f11f', 'ar'), t('auto.engines_contextClassification.41.73c0ea14', 'ar')] },
  'Iraq': { en: ['iraq', 'baghdad', 'iraqi'], ar: [t('auto.engines_contextClassification.40.4b74973d', 'ar'), t('auto.engines_contextClassification.39.ec508bed', 'ar'), t('auto.engines_contextClassification.38.5499a404', 'ar')] },
  'Syria': { en: ['syria', 'damascus', 'syrian'], ar: [t('auto.engines_contextClassification.37.1166d28b', 'ar'), t('auto.engines_contextClassification.36.f3cf6094', 'ar'), t('auto.engines_contextClassification.35.25f4624a', 'ar')] },
  'Palestine': { en: ['palestine', 'gaza', 'palestinian', 'west bank'], ar: [t('auto.engines_contextClassification.34.1b5fbac6', 'ar'), t('auto.engines_contextClassification.33.d89eea23', 'ar'), t('auto.engines_contextClassification.32.31488d11', 'ar'), t('auto.engines_contextClassification.31.8f5eabd1', 'ar')] },
  'Jordan': { en: ['jordan', 'amman', 'jordanian'], ar: [t('auto.engines_contextClassification.30.bdd0aaf6', 'ar'), t('auto.engines_contextClassification.29.b9493df4', 'ar'), t('auto.engines_contextClassification.28.8bb8d91d', 'ar')] },
  'Lebanon': { en: ['lebanon', 'beirut', 'lebanese'], ar: [t('auto.engines_contextClassification.27.aec612ef', 'ar'), t('auto.engines_contextClassification.26.e53b00b6', 'ar'), t('auto.engines_contextClassification.25.03ecada3', 'ar')] },
  'Morocco': { en: ['morocco', 'rabat', 'moroccan'], ar: [t('auto.engines_contextClassification.24.94b11d17', 'ar'), t('auto.engines_contextClassification.23.ae6723ec', 'ar'), t('auto.engines_contextClassification.22.f8a2a03c', 'ar')] },
  'Algeria': { en: ['algeria', 'algiers', 'algerian'], ar: [t('auto.engines_contextClassification.21.cd77976e', 'ar'), t('auto.engines_contextClassification.20.654f0737', 'ar')] },
  'Tunisia': { en: ['tunisia', 'tunis', 'tunisian'], ar: [t('auto.engines_contextClassification.19.ba84e974', 'ar'), t('auto.engines_contextClassification.18.89b9e70b', 'ar')] },
  'Sudan': { en: ['sudan', 'khartoum', 'sudanese'], ar: [t('auto.engines_contextClassification.17.5becaf4c', 'ar'), t('auto.engines_contextClassification.16.eecf965c', 'ar'), t('auto.engines_contextClassification.15.11d9a8e6', 'ar')] },
  'Yemen': { en: ['yemen', 'sanaa', 'yemeni'], ar: [t('auto.engines_contextClassification.14.0cdfe5e0', 'ar'), t('auto.engines_contextClassification.13.3685baf1', 'ar'), t('auto.engines_contextClassification.12.2692987b', 'ar')] },
  'USA': { en: ['usa', 'america', 'american', 'washington', 'new york'], ar: [t('auto.engines_contextClassification.11.d2dcf00d', 'ar'), t('auto.engines_contextClassification.10.69cb01b5', 'ar'), t('auto.engines_contextClassification.9.15a75967', 'ar'), t('auto.engines_contextClassification.8.b6c910f0', 'ar')] },
  'UK': { en: ['uk', 'britain', 'british', 'london', 'england'], ar: [t('auto.engines_contextClassification.7.39b1471a', 'ar'), t('auto.engines_contextClassification.6.f0c1d5bf', 'ar'), t('auto.engines_contextClassification.5.169923cb', 'ar'), t('auto.engines_contextClassification.4.65e806ff', 'ar')] },
  'Global': { en: ['world', 'global', 'international'], ar: [t('auto.engines_contextClassification.3.5201f91f', 'ar'), t('auto.engines_contextClassification.2.b7de7e68', 'ar'), t('auto.engines_contextClassification.1.b4d34f40', 'ar')] }
};

/**
 * Detect language of text
 */
function detectLanguage(text: string): 'ar' | 'en' | 'mixed' {
  const arabicPattern = /[\u0600-\u06FF]/;
  const englishPattern = /[a-zA-Z]/;
  
  const hasArabic = arabicPattern.test(text);
  const hasEnglish = englishPattern.test(text);
  
  if (hasArabic && hasEnglish) return 'mixed';
  if (hasArabic) return 'ar';
  return 'en';
}

/**
 * Count keyword matches in text
 */
function countKeywordMatches(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => lowerText.includes(keyword.toLowerCase())).length;
}

/**
 * Extract matched keywords from text
 */
function extractMatchedKeywords(text: string, keywords: string[]): string[] {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Classify content domain
 */
function classifyDomain(text: string, language: 'ar' | 'en' | 'mixed'): { domain: ContentDomain; confidence: number; keywords: string[] } {
  const scores: Record<ContentDomain, number> = {} as any;
  const matchedKeywords: string[] = [];
  
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    const langKey = language === 'ar' ? 'ar' : 'en';
    const allKeywords = [...keywords.en, ...keywords.ar];
    const matches = countKeywordMatches(text, allKeywords);
    scores[domain as ContentDomain] = matches;
    matchedKeywords.push(...extractMatchedKeywords(text, allKeywords));
  }
  
  const maxScore = Math.max(...Object.values(scores));
  const topDomain = (Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'general') as ContentDomain;
  
  // Calculate confidence (0-100)
  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalMatches > 0 ? Math.min(100, Math.round((maxScore / totalMatches) * 100 + maxScore * 10)) : 50;
  
  return {
    domain: maxScore > 0 ? topDomain : 'general',
    confidence,
    keywords: Array.from(new Set(matchedKeywords))
  };
}

/**
 * Classify event type
 */
function classifyEventType(text: string): { eventType: EventType; confidence: number } {
  const scores: Record<EventType, number> = {} as any;
  
  for (const [eventType, keywords] of Object.entries(EVENT_KEYWORDS)) {
    const allKeywords = [...keywords.en, ...keywords.ar];
    scores[eventType as EventType] = countKeywordMatches(text, allKeywords);
  }
  
  const maxScore = Math.max(...Object.values(scores));
  const topEvent = (Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'neutral') as EventType;
  
  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalMatches > 0 ? Math.min(100, Math.round((maxScore / totalMatches) * 100 + maxScore * 15)) : 50;
  
  return {
    eventType: maxScore > 0 ? topEvent : 'neutral',
    confidence
  };
}

/**
 * Detect region from text
 */
function detectRegion(text: string, selectedCountry?: string): string {
  // If country is explicitly selected, use it
  if (selectedCountry && selectedCountry !== 'ALL') {
    return selectedCountry;
  }
  
  const scores: Record<string, number> = {};
  
  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    const allKeywords = [...keywords.en, ...keywords.ar];
    scores[region] = countKeywordMatches(text, allKeywords);
  }
  
  const maxScore = Math.max(...Object.values(scores));
  const topRegion = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'Global';
  
  return maxScore > 0 ? topRegion : 'Global';
}

/**
 * Main Context Classification Function
 */
export function classifyContext(text: string, selectedCountry?: string): ContextResult {
  const language = detectLanguage(text);
  const { domain, confidence: domainConfidence, keywords } = classifyDomain(text, language);
  const { eventType, confidence: eventConfidence } = classifyEventType(text);
  const region = detectRegion(text, selectedCountry);
  const sensitivity = SENSITIVITY_MATRIX[domain][eventType];
  
  // Overall confidence is weighted average
  const confidence = Math.round((domainConfidence * 0.6) + (eventConfidence * 0.4));
  
  return {
    domain,
    eventType,
    region,
    sensitivity,
    confidence,
    keywords,
    language
  };
}

export default { classifyContext };
