import { t } from "../_core/i18n";

/**
 * Context Classifier - Meta-Learning Layer for Global Context Understanding
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This module implements a meta-learning approach that:
 * 1. Classifies the context BEFORE emotional analysis
 * 2. Understands cultural and geographical nuances
 * 3. Adjusts emotional weights based on context
 * 
 * Architecture:
 * Text → Context Classification → Cultural Adjustment → Emotional Analysis
 */

/**
 * Event types that affect emotional interpretation
 */
export type EventType = 
  | 'death'           //  
  | 'disaster'        //  
  | 'celebration'     //  
  | 'political'       // 
  | 'economic'        // 
  | 'sports'          // 
  | 'entertainment'   // 
  | 'health'          // 
  | 'conflict'        //  
  | 'achievement'     // 
  | 'crime'           // 
  | 'social'          // 
  | 'religious'       // 
  | 'environmental'   // 
  | 'technology'      // 
  | 'neutral';        // 

/**
 * Cultural regions with distinct emotional expression patterns
 */
export type CulturalRegion = 
  | 'arab_gulf'       //  
  | 'arab_levant'     // 
  | 'arab_maghreb'    //   (   )
  | 'arab_egypt'      // 
  | 'western_europe'  //  
  | 'eastern_europe'  //  
  | 'north_america'   //  
  | 'latin_america'   //  
  | 'east_asia'       //  
  | 'south_asia'      //  
  | 'southeast_asia'  //   
  | 'africa'          // 
  | 'global';         // 

/**
 * Sensitivity levels for content
 */
export type SensitivityLevel = 'critical' | 'high' | 'medium' | 'low';

/**
 * Context classification result
 */
export interface ContextClassification {
  // Primary event type
  eventType: EventType;
  eventTypeConfidence: number;
  
  // Cultural context
  culturalRegion: CulturalRegion;
  detectedLanguage: string;
  dialect?: string;
  
  // Sensitivity assessment
  sensitivityLevel: SensitivityLevel;
  
  // Emotional adjustment weights
  emotionalAdjustments: {
    joy: number;      // Multiplier for joy (-1 to suppress, 0 neutral, +1 enhance)
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  
  // Keywords detected
  detectedKeywords: string[];
  
  // Metadata
  confidence: number;
  processingTimeMs: number;
}

/**
 * Cultural keyword databases for context detection
 */
const CULTURAL_KEYWORDS = {
  // Arabic death/mourning keywords
  death_arabic: [
    t('auto.utils_contextClassifier.249.ba42d7b3', 'ar'), t('auto.utils_contextClassifier.248.158c325c', 'ar'), t('auto.utils_contextClassifier.247.52648b62', 'ar'), t('auto.utils_contextClassifier.246.8406f86f', 'ar'), t('auto.utils_contextClassifier.245.9269ef95', 'ar'), t('auto.utils_contextClassifier.244.0ee0494f', 'ar'), t('auto.utils_contextClassifier.243.0b7baf6a', 'ar'), t('auto.utils_contextClassifier.242.0e23728e', 'ar'), t('auto.utils_contextClassifier.241.de7c116a', 'ar'),
    t('auto.utils_contextClassifier.240.55578aeb', 'ar'), t('auto.utils_contextClassifier.239.bd80ed20', 'ar'), t('auto.utils_contextClassifier.238.9d9565f8', 'ar'), t('auto.utils_contextClassifier.237.32fe0fa9', 'ar'), t('auto.utils_contextClassifier.236.bef98e5f', 'ar'), t('auto.utils_contextClassifier.235.ec8f5965', 'ar'), t('auto.utils_contextClassifier.234.73f6132e', 'ar'), t('auto.utils_contextClassifier.233.753afcfd', 'ar'), t('auto.utils_contextClassifier.232.c8e9ec22', 'ar'),
    t('auto.utils_contextClassifier.231.abe00237', 'ar'), t('auto.utils_contextClassifier.230.32731023', 'ar'), t('auto.utils_contextClassifier.229.4d1f5eea', 'ar'), t('auto.utils_contextClassifier.228.3cd8b7f1', 'ar'), t('auto.utils_contextClassifier.227.19aa57a4', 'ar'),
    t('auto.utils_contextClassifier.226.acd0e337', 'ar'), t('auto.utils_contextClassifier.225.429dcc55', 'ar'), t('auto.utils_contextClassifier.224.5c1be948', 'ar'), t('auto.utils_contextClassifier.223.66bf159c', 'ar'), t('auto.utils_contextClassifier.222.4dffd772', 'ar'), t('auto.utils_contextClassifier.221.0713ae0a', 'ar'), t('auto.utils_contextClassifier.220.e4d92c21', 'ar'), t('auto.utils_contextClassifier.219.12f2bffc', 'ar')
  ],
  
  // English death keywords
  death_english: [
    'death', 'died', 'dead', 'killed', 'murder', 'murdered', 'funeral', 'burial',
    'assassination', 'assassinated', 'martyred', 'martyr', 'passed away', 'deceased',
    'victim', 'victims', 'fatality', 'fatalities', 'mourning', 'condolences',
    'rest in peace', 'rip', 'tragic loss', 'untimely death'
  ],
  
  // Disaster keywords (Arabic)
  disaster_arabic: [
    t('auto.utils_contextClassifier.218.676d2f53', 'ar'), t('auto.utils_contextClassifier.217.b8aa050e', 'ar'), t('auto.utils_contextClassifier.216.3e566ab3', 'ar'), t('auto.utils_contextClassifier.215.bcb0731f', 'ar'), t('auto.utils_contextClassifier.214.01d6926f', 'ar'), t('auto.utils_contextClassifier.213.30d2b5de', 'ar'), t('auto.utils_contextClassifier.212.51673b06', 'ar'), t('auto.utils_contextClassifier.211.67a5c731', 'ar'),
    t('auto.utils_contextClassifier.210.fc8f425e', 'ar'), t('auto.utils_contextClassifier.209.417cc6aa', 'ar'), t('auto.utils_contextClassifier.208.c15645bd', 'ar'), t('auto.utils_contextClassifier.207.a9c70b31', 'ar'), t('auto.utils_contextClassifier.206.3e9508d3', 'ar'), t('auto.utils_contextClassifier.205.3d4b9354', 'ar'), t('auto.utils_contextClassifier.204.6201784d', 'ar'), t('auto.utils_contextClassifier.203.195a7f4e', 'ar')
  ],
  
  // Disaster keywords (English)
  disaster_english: [
    'disaster', 'earthquake', 'flood', 'hurricane', 'fire', 'explosion', 'crash',
    'collapse', 'emergency', 'evacuation', 'destruction', 'tragedy', 'catastrophe',
    'tsunami', 'tornado', 'wildfire', 'devastation'
  ],
  
  // Celebration keywords (Arabic)
  celebration_arabic: [
    t('auto.utils_contextClassifier.202.3460cbc6', 'ar'), t('auto.utils_contextClassifier.201.15a6eacb', 'ar'), t('auto.utils_contextClassifier.200.b8f14e50', 'ar'), t('auto.utils_contextClassifier.199.e9cf4cf2', 'ar'), t('auto.utils_contextClassifier.198.bc9bfe25', 'ar'), t('auto.utils_contextClassifier.197.837787a2', 'ar'), t('auto.utils_contextClassifier.196.2eb748dc', 'ar'), t('auto.utils_contextClassifier.195.4bb0cb4c', 'ar'), t('auto.utils_contextClassifier.194.c24d8d6c', 'ar'),
    t('auto.utils_contextClassifier.193.5c6d8448', 'ar'), t('auto.utils_contextClassifier.192.fc880081', 'ar'), t('auto.utils_contextClassifier.191.1eaa0cee', 'ar'), t('auto.utils_contextClassifier.190.827021a8', 'ar'), t('auto.utils_contextClassifier.189.e40769f9', 'ar'), t('auto.utils_contextClassifier.188.8713b878', 'ar'), t('auto.utils_contextClassifier.187.904ed40d', 'ar'), t('auto.utils_contextClassifier.186.c6ac4c4a', 'ar')
  ],
  
  // Celebration keywords (English)
  celebration_english: [
    'celebration', 'wedding', 'victory', 'success', 'graduation', 'achievement',
    'championship', 'congratulations', 'joy', 'happiness', 'festival', 'party',
    'triumph', 'milestone', 'breakthrough'
  ],
  
  // Conflict keywords (Arabic)
  conflict_arabic: [
    t('auto.utils_contextClassifier.185.b2155e1c', 'ar'), t('auto.utils_contextClassifier.184.393955e1', 'ar'), t('auto.utils_contextClassifier.183.80f25957', 'ar'), t('auto.utils_contextClassifier.182.56ea9530', 'ar'), t('auto.utils_contextClassifier.181.d0c8e500', 'ar'), t('auto.utils_contextClassifier.180.2fbc78a2', 'ar'), t('auto.utils_contextClassifier.179.ff0e47e8', 'ar'), t('auto.utils_contextClassifier.178.baf1765f', 'ar'),
    t('auto.utils_contextClassifier.177.4a0469fe', 'ar'), t('auto.utils_contextClassifier.176.4e67e1bd', 'ar'), t('auto.utils_contextClassifier.175.7affbd1f', 'ar'), t('auto.utils_contextClassifier.174.b0366353', 'ar'), t('auto.utils_contextClassifier.173.c2221c4e', 'ar'), t('auto.utils_contextClassifier.172.e5f07bb2', 'ar'), t('auto.utils_contextClassifier.171.447e5413', 'ar')
  ],
  
  // Conflict keywords (English)
  conflict_english: [
    'war', 'conflict', 'battle', 'attack', 'bombing', 'strike', 'clash',
    'invasion', 'occupation', 'terrorism', 'violence', 'assault', 'military'
  ],
  
  // Political keywords (Arabic)
  political_arabic: [
    t('auto.utils_contextClassifier.170.d9b242e6', 'ar'), t('auto.utils_contextClassifier.169.5ef70e19', 'ar'), t('auto.utils_contextClassifier.168.52d79bae', 'ar'), t('auto.utils_contextClassifier.167.b80d3d91', 'ar'), t('auto.utils_contextClassifier.166.854382ce', 'ar'), t('auto.utils_contextClassifier.165.26a57968', 'ar'), t('auto.utils_contextClassifier.164.49ac0af3', 'ar'),
    t('auto.utils_contextClassifier.163.12a171f3', 'ar'), t('auto.utils_contextClassifier.162.d1ec9be1', 'ar'), t('auto.utils_contextClassifier.161.69c349f5', 'ar'), t('auto.utils_contextClassifier.160.c4a9390b', 'ar'), t('auto.utils_contextClassifier.159.bc366881', 'ar'), t('auto.utils_contextClassifier.158.b3f9af40', 'ar'), t('auto.utils_contextClassifier.157.2c473ed6', 'ar')
  ],
  
  // Political keywords (English)
  political_english: [
    'election', 'president', 'government', 'parliament', 'minister', 'politics',
    'party', 'vote', 'law', 'constitution', 'opposition', 'policy', 'legislation'
  ],
  
  // Economic keywords (Arabic)
  economic_arabic: [
    t('auto.utils_contextClassifier.156.6d38c2ea', 'ar'), t('auto.utils_contextClassifier.155.16c73be6', 'ar'), t('auto.utils_contextClassifier.154.866ae2e3', 'ar'), t('auto.utils_contextClassifier.153.27d9d4af', 'ar'), t('auto.utils_contextClassifier.152.8b8e7c7f', 'ar'), t('auto.utils_contextClassifier.151.8009605b', 'ar'), t('auto.utils_contextClassifier.150.25e94d3e', 'ar'), t('auto.utils_contextClassifier.149.2efcd729', 'ar'),
    t('auto.utils_contextClassifier.148.f879f70c', 'ar'), t('auto.utils_contextClassifier.147.db2f097a', 'ar'), t('auto.utils_contextClassifier.146.23163ab2', 'ar'), t('auto.utils_contextClassifier.145.02782624', 'ar'), t('auto.utils_contextClassifier.144.a09cec5c', 'ar'), t('auto.utils_contextClassifier.143.cb4d62bf', 'ar'), t('auto.utils_contextClassifier.142.9c0c2ffc', 'ar'), t('auto.utils_contextClassifier.141.a5e5a53c', 'ar')
  ],
  
  // Economic keywords (English)
  economic_english: [
    'economy', 'market', 'stocks', 'inflation', 'recession', 'growth', 'investment',
    'bank', 'currency', 'dollar', 'oil', 'prices', 'trade', 'exports', 'imports'
  ],
  
  // Sports keywords (Arabic)
  sports_arabic: [
    t('auto.utils_contextClassifier.140.10fb9dc5', 'ar'), t('auto.utils_contextClassifier.139.874011c4', 'ar'), t('auto.utils_contextClassifier.138.a1873e2a', 'ar'), t('auto.utils_contextClassifier.137.4a3f173b', 'ar'), t('auto.utils_contextClassifier.136.5c6d8448', 'ar'), t('auto.utils_contextClassifier.135.e0cb3913', 'ar'), t('auto.utils_contextClassifier.134.9174c93e', 'ar'), t('auto.utils_contextClassifier.133.3b8c0b02', 'ar'),
    t('auto.utils_contextClassifier.132.837787a2', 'ar'), t('auto.utils_contextClassifier.131.b8885cb2', 'ar'), t('auto.utils_contextClassifier.130.08909f86', 'ar'), t('auto.utils_contextClassifier.129.2df8d65b', 'ar'), t('auto.utils_contextClassifier.128.2245a20e', 'ar'), t('auto.utils_contextClassifier.127.dd9e6500', 'ar'), t('auto.utils_contextClassifier.126.b9b8a697', 'ar')
  ],
  
  // Sports keywords (English)
  sports_english: [
    'match', 'team', 'player', 'goal', 'championship', 'cup', 'league',
    'win', 'loss', 'draw', 'stadium', 'coach', 'final', 'tournament'
  ],
  
  // Health keywords (Arabic)
  health_arabic: [
    t('auto.utils_contextClassifier.125.51f4011d', 'ar'), t('auto.utils_contextClassifier.124.aae445ae', 'ar'), t('auto.utils_contextClassifier.123.615de097', 'ar'), t('auto.utils_contextClassifier.122.ad5a18db', 'ar'), t('auto.utils_contextClassifier.121.dc7cff7f', 'ar'), t('auto.utils_contextClassifier.120.471e98a3', 'ar'), t('auto.utils_contextClassifier.119.6b5d73fa', 'ar'), t('auto.utils_contextClassifier.118.8d48fc93', 'ar'),
    t('auto.utils_contextClassifier.117.72c707a2', 'ar'), t('auto.utils_contextClassifier.116.302784e1', 'ar'), t('auto.utils_contextClassifier.115.46817187', 'ar'), t('auto.utils_contextClassifier.114.f4830727', 'ar'), t('auto.utils_contextClassifier.113.eb9a5912', 'ar'), t('auto.utils_contextClassifier.112.dd7010ed', 'ar'), t('auto.utils_contextClassifier.111.82f1b4b7', 'ar')
  ],
  
  // Health keywords (English)
  health_english: [
    'disease', 'pandemic', 'virus', 'treatment', 'hospital', 'doctor', 'medicine',
    'vaccine', 'health', 'infection', 'recovery', 'surgery', 'cancer', 'heart'
  ],
  
  // Achievement keywords (Arabic)
  achievement_arabic: [
    t('auto.utils_contextClassifier.110.c24d8d6c', 'ar'), t('auto.utils_contextClassifier.109.2eb748dc', 'ar'), t('auto.utils_contextClassifier.108.67876b7a', 'ar'), t('auto.utils_contextClassifier.107.7811e2fe', 'ar'), t('auto.utils_contextClassifier.106.3f7ae8a1', 'ar'), t('auto.utils_contextClassifier.105.e3fc61bd', 'ar'), t('auto.utils_contextClassifier.104.0ead97c8', 'ar'),
    t('auto.utils_contextClassifier.103.3e147708', 'ar'), t('auto.utils_contextClassifier.102.e55fe1f0', 'ar'), t('auto.utils_contextClassifier.101.46a54865', 'ar'), t('auto.utils_contextClassifier.100.529269c8', 'ar'), t('auto.utils_contextClassifier.99.24748545', 'ar'), t('auto.utils_contextClassifier.98.f4aaa22f', 'ar')
  ],
  
  // Achievement keywords (English)
  achievement_english: [
    'achievement', 'success', 'discovery', 'invention', 'award', 'prize',
    'record', 'first', 'historic', 'breakthrough', 'innovation', 'excellence'
  ],
  
  // Crime keywords (Arabic)
  crime_arabic: [
    t('auto.utils_contextClassifier.97.9ea63237', 'ar'), t('auto.utils_contextClassifier.96.d4a61f38', 'ar'), t('auto.utils_contextClassifier.95.cc6a80aa', 'ar'), t('auto.utils_contextClassifier.94.2b0f748a', 'ar'), t('auto.utils_contextClassifier.93.3b5b6839', 'ar'), t('auto.utils_contextClassifier.92.b42fa5f8', 'ar'), t('auto.utils_contextClassifier.91.2d49546a', 'ar'),
    t('auto.utils_contextClassifier.90.bf0e1c70', 'ar'), t('auto.utils_contextClassifier.89.23a08748', 'ar'), t('auto.utils_contextClassifier.88.80628bd7', 'ar'), t('auto.utils_contextClassifier.87.aa32cded', 'ar'), t('auto.utils_contextClassifier.86.7bb5e75a', 'ar'), t('auto.utils_contextClassifier.85.8b4cc724', 'ar')
  ],
  
  // Crime keywords (English)
  crime_english: [
    'crime', 'theft', 'arrest', 'trial', 'prison', 'execution', 'smuggling',
    'drugs', 'corruption', 'bribery', 'fraud', 'kidnapping', 'robbery'
  ],
  
  // Religious keywords (Arabic)
  religious_arabic: [
    t('auto.utils_contextClassifier.84.8b6c945c', 'ar'), t('auto.utils_contextClassifier.83.464425bc', 'ar'), t('auto.utils_contextClassifier.82.01a79a7e', 'ar'), t('auto.utils_contextClassifier.81.cb611ff0', 'ar'), t('auto.utils_contextClassifier.80.5b1c6e59', 'ar'), t('auto.utils_contextClassifier.79.ef369742', 'ar'), t('auto.utils_contextClassifier.78.4d327751', 'ar'),
    t('auto.utils_contextClassifier.77.bdba864a', 'ar'), t('auto.utils_contextClassifier.76.4f003252', 'ar'), t('auto.utils_contextClassifier.75.d95c093f', 'ar'), t('auto.utils_contextClassifier.74.ea1742d5', 'ar'), t('auto.utils_contextClassifier.73.b240ef17', 'ar'), t('auto.utils_contextClassifier.72.2ce4e022', 'ar'), t('auto.utils_contextClassifier.71.18d89eed', 'ar'), t('auto.utils_contextClassifier.70.19059984', 'ar'), t('auto.utils_contextClassifier.69.b72294aa', 'ar')
  ],
  
  // Religious keywords (English)
  religious_english: [
    'ramadan', 'eid', 'hajj', 'mosque', 'church', 'prayer', 'fasting',
    'religion', 'faith', 'christmas', 'easter', 'temple', 'synagogue'
  ]
};

/**
 * Language detection patterns
 */
const LANGUAGE_PATTERNS = {
  arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/,
  chinese: /[\u4E00-\u9FFF]/,
  japanese: /[\u3040-\u309F\u30A0-\u30FF]/,
  korean: /[\uAC00-\uD7AF]/,
  cyrillic: /[\u0400-\u04FF]/,
  hebrew: /[\u0590-\u05FF]/,
  thai: /[\u0E00-\u0E7F]/,
  hindi: /[\u0900-\u097F]/,
};

/**
 * Arabic dialect detection patterns
 */
const ARABIC_DIALECT_PATTERNS = {
  libyan: [t('auto.utils_contextClassifier.68.44de889d', 'ar'), t('auto.utils_contextClassifier.67.95c59296', 'ar'), t('auto.utils_contextClassifier.66.359a8a47', 'ar'), t('auto.utils_contextClassifier.65.9ee3c077', 'ar'), t('auto.utils_contextClassifier.64.b2b91a36', 'ar'), t('auto.utils_contextClassifier.63.afe1f64f', 'ar'), t('auto.utils_contextClassifier.62.0aaf4e1e', 'ar'), t('auto.utils_contextClassifier.61.7db87619', 'ar'), t('auto.utils_contextClassifier.60.e53f2790', 'ar')],
  egyptian: [t('auto.utils_contextClassifier.59.7bceb9af', 'ar'), t('auto.utils_contextClassifier.58.b94be009', 'ar'), t('auto.utils_contextClassifier.57.906a9cee', 'ar'), t('auto.utils_contextClassifier.56.de839bb1', 'ar'), t('auto.utils_contextClassifier.55.b54e24d3', 'ar'), t('auto.utils_contextClassifier.54.de1317f4', 'ar'), t('auto.utils_contextClassifier.53.bd7faf99', 'ar')],
  gulf: [t('auto.utils_contextClassifier.52.482c3036', 'ar'), t('auto.utils_contextClassifier.51.eee7a619', 'ar'), t('auto.utils_contextClassifier.50.c1235879', 'ar'), t('auto.utils_contextClassifier.49.7fb6a551', 'ar'), t('auto.utils_contextClassifier.48.aa2bddee', 'ar'), t('auto.utils_contextClassifier.47.5b56ac3d', 'ar'), t('auto.utils_contextClassifier.46.a584d0e2', 'ar')],
  levantine: [t('auto.utils_contextClassifier.45.1bf06360', 'ar'), t('auto.utils_contextClassifier.44.7f146a7e', 'ar'), t('auto.utils_contextClassifier.43.44de889d', 'ar'), t('auto.utils_contextClassifier.42.260319f5', 'ar'), t('auto.utils_contextClassifier.41.ac2127cc', 'ar'), t('auto.utils_contextClassifier.40.0135c297', 'ar'), t('auto.utils_contextClassifier.39.0aaf4e1e', 'ar')],
  maghrebi: [t('auto.utils_contextClassifier.38.0ee0e9ec', 'ar'), t('auto.utils_contextClassifier.37.afe1f64f', 'ar'), t('auto.utils_contextClassifier.36.05ab2d38', 'ar'), t('auto.utils_contextClassifier.35.55386e4f', 'ar'), t('auto.utils_contextClassifier.34.eea09733', 'ar'), t('auto.utils_contextClassifier.33.7b502806', 'ar')]
};

/**
 * Detect the primary language of the text
 */
function detectLanguage(text: string): string {
  // Check for Arabic first (most common for this platform)
  if (LANGUAGE_PATTERNS.arabic.test(text)) {
    return 'arabic';
  }
  
  // Check other languages
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(text)) {
      return lang;
    }
  }
  
  // Default to English
  return 'english';
}

/**
 * Detect Arabic dialect if applicable
 */
function detectArabicDialect(text: string): string | undefined {
  const lowerText = text.toLowerCase();
  
  for (const [dialect, patterns] of Object.entries(ARABIC_DIALECT_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        return dialect;
      }
    }
  }
  
  return 'standard'; // 
}

/**
 * Detect cultural region based on text content and language
 */
function detectCulturalRegion(text: string, language: string): CulturalRegion {
  const lowerText = text.toLowerCase();
  
  // Arabic regions
  if (language === 'arabic') {
    const dialect = detectArabicDialect(text);
    
    // Check for specific country mentions
    if (lowerText.includes(t('auto.utils_contextClassifier.32.251aff72', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.31.da7424b2', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.30.63a58999', 'ar')) || dialect === 'libyan') {
      return 'arab_maghreb';
    }
    if (lowerText.includes(t('auto.utils_contextClassifier.29.9f5f187b', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.28.93019aa0', 'ar')) || dialect === 'egyptian') {
      return 'arab_egypt';
    }
    if (lowerText.includes(t('auto.utils_contextClassifier.27.cd8d189f', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.26.9bc10b8c', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.25.827e1566', 'ar')) || 
        lowerText.includes(t('auto.utils_contextClassifier.24.76394460', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.23.2a0041a3', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.22.b9493df4', 'ar')) || dialect === 'gulf') {
      return 'arab_gulf';
    }
    if (lowerText.includes(t('auto.utils_contextClassifier.21.1166d28b', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.20.aec612ef', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.19.bdd0aaf6', 'ar')) || 
        lowerText.includes(t('auto.utils_contextClassifier.18.1b5fbac6', 'ar')) || dialect === 'levantine') {
      return 'arab_levant';
    }
    if (lowerText.includes(t('auto.utils_contextClassifier.17.ba84e974', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.16.cd77976e', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.15.94b11d17', 'ar')) || dialect === 'maghrebi') {
      return 'arab_maghreb';
    }
    
    return 'arab_gulf'; // Default for Arabic
  }
  
  // Other regions based on keywords
  if (lowerText.includes('china') || lowerText.includes('japan') || lowerText.includes('korea') ||
      lowerText.includes(t('auto.utils_contextClassifier.14.b1664a7c', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.13.622a5ab0', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.12.becc8cf0', 'ar'))) {
    return 'east_asia';
  }
  
  if (lowerText.includes('india') || lowerText.includes('pakistan') || lowerText.includes('bangladesh') ||
      lowerText.includes(t('auto.utils_contextClassifier.11.1d85704e', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.10.8fc675b9', 'ar'))) {
    return 'south_asia';
  }
  
  if (lowerText.includes('usa') || lowerText.includes('america') || lowerText.includes('canada') ||
      lowerText.includes(t('auto.utils_contextClassifier.9.d2dcf00d', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.8.e5636dc6', 'ar'))) {
    return 'north_america';
  }
  
  if (lowerText.includes('brazil') || lowerText.includes('mexico') || lowerText.includes('argentina') ||
      lowerText.includes(t('auto.utils_contextClassifier.7.57bcc508', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.6.bc09b260', 'ar'))) {
    return 'latin_america';
  }
  
  if (lowerText.includes('uk') || lowerText.includes('britain') || lowerText.includes('france') || 
      lowerText.includes('germany') || lowerText.includes(t('auto.utils_contextClassifier.5.39b1471a', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.4.36a1dc72', 'ar')) || 
      lowerText.includes(t('auto.utils_contextClassifier.3.b47da9fb', 'ar'))) {
    return 'western_europe';
  }
  
  if (lowerText.includes('russia') || lowerText.includes('ukraine') || lowerText.includes('poland') ||
      lowerText.includes(t('auto.utils_contextClassifier.2.613c149d', 'ar')) || lowerText.includes(t('auto.utils_contextClassifier.1.e64e16fd', 'ar'))) {
    return 'eastern_europe';
  }
  
  return 'global';
}

/**
 * Classify the event type based on keywords
 */
function classifyEventType(text: string): { type: EventType; confidence: number; keywords: string[] } {
  const lowerText = text.toLowerCase();
  const detectedKeywords: string[] = [];
  
  // Check each category and count matches
  const scores: Record<EventType, number> = {
    death: 0,
    disaster: 0,
    celebration: 0,
    political: 0,
    economic: 0,
    sports: 0,
    entertainment: 0,
    health: 0,
    conflict: 0,
    achievement: 0,
    crime: 0,
    social: 0,
    religious: 0,
    environmental: 0,
    technology: 0,
    neutral: 0
  };
  
  // Death detection (highest priority for accuracy)
  for (const keyword of CULTURAL_KEYWORDS.death_arabic) {
    if (text.includes(keyword)) {
      scores.death += 3; // Higher weight for Arabic death keywords
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.death_english) {
    if (lowerText.includes(keyword)) {
      scores.death += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Disaster detection
  for (const keyword of CULTURAL_KEYWORDS.disaster_arabic) {
    if (text.includes(keyword)) {
      scores.disaster += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.disaster_english) {
    if (lowerText.includes(keyword)) {
      scores.disaster += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Conflict detection
  for (const keyword of CULTURAL_KEYWORDS.conflict_arabic) {
    if (text.includes(keyword)) {
      scores.conflict += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.conflict_english) {
    if (lowerText.includes(keyword)) {
      scores.conflict += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Crime detection
  for (const keyword of CULTURAL_KEYWORDS.crime_arabic) {
    if (text.includes(keyword)) {
      scores.crime += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.crime_english) {
    if (lowerText.includes(keyword)) {
      scores.crime += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Celebration detection
  for (const keyword of CULTURAL_KEYWORDS.celebration_arabic) {
    if (text.includes(keyword)) {
      scores.celebration += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.celebration_english) {
    if (lowerText.includes(keyword)) {
      scores.celebration += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Achievement detection
  for (const keyword of CULTURAL_KEYWORDS.achievement_arabic) {
    if (text.includes(keyword)) {
      scores.achievement += 2;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.achievement_english) {
    if (lowerText.includes(keyword)) {
      scores.achievement += 2;
      detectedKeywords.push(keyword);
    }
  }
  
  // Political detection
  for (const keyword of CULTURAL_KEYWORDS.political_arabic) {
    if (text.includes(keyword)) {
      scores.political += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.political_english) {
    if (lowerText.includes(keyword)) {
      scores.political += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Economic detection
  for (const keyword of CULTURAL_KEYWORDS.economic_arabic) {
    if (text.includes(keyword)) {
      scores.economic += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.economic_english) {
    if (lowerText.includes(keyword)) {
      scores.economic += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Sports detection
  for (const keyword of CULTURAL_KEYWORDS.sports_arabic) {
    if (text.includes(keyword)) {
      scores.sports += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.sports_english) {
    if (lowerText.includes(keyword)) {
      scores.sports += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Health detection
  for (const keyword of CULTURAL_KEYWORDS.health_arabic) {
    if (text.includes(keyword)) {
      scores.health += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.health_english) {
    if (lowerText.includes(keyword)) {
      scores.health += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Religious detection
  for (const keyword of CULTURAL_KEYWORDS.religious_arabic) {
    if (text.includes(keyword)) {
      scores.religious += 1;
      detectedKeywords.push(keyword);
    }
  }
  for (const keyword of CULTURAL_KEYWORDS.religious_english) {
    if (lowerText.includes(keyword)) {
      scores.religious += 1;
      detectedKeywords.push(keyword);
    }
  }
  
  // Find the highest scoring event type
  let maxScore = 0;
  let eventType: EventType = 'neutral';
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      eventType = type as EventType;
    }
  }
  
  // Calculate confidence based on score
  const totalKeywords = detectedKeywords.length;
  const confidence = totalKeywords > 0 ? Math.min(0.95, 0.5 + (maxScore * 0.1)) : 0.3;
  
  return {
    type: eventType,
    confidence,
    keywords: Array.from(new Set(detectedKeywords)) // Remove duplicates
  };
}

/**
 * Get emotional adjustments based on event type and cultural region
 */
function getEmotionalAdjustments(
  eventType: EventType, 
  culturalRegion: CulturalRegion
): ContextClassification['emotionalAdjustments'] {
  // Default neutral adjustments
  const adjustments = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0
  };
  
  // Event-based adjustments
  switch (eventType) {
    case 'death':
      adjustments.joy = -0.9;      // Strongly suppress joy
      adjustments.sadness = 0.8;   // Enhance sadness
      adjustments.hope = -0.5;     // Reduce hope
      adjustments.fear = 0.2;      // Slight fear increase
      break;
      
    case 'disaster':
      adjustments.joy = -0.8;
      adjustments.fear = 0.7;
      adjustments.sadness = 0.6;
      adjustments.hope = -0.3;
      adjustments.anger = 0.3;
      break;
      
    case 'conflict':
      adjustments.joy = -0.7;
      adjustments.fear = 0.6;
      adjustments.anger = 0.5;
      adjustments.sadness = 0.4;
      adjustments.hope = -0.4;
      break;
      
    case 'crime':
      adjustments.joy = -0.6;
      adjustments.fear = 0.5;
      adjustments.anger = 0.6;
      adjustments.sadness = 0.3;
      break;
      
    case 'celebration':
      adjustments.joy = 0.8;
      adjustments.hope = 0.6;
      adjustments.sadness = -0.5;
      adjustments.fear = -0.3;
      break;
      
    case 'achievement':
      adjustments.joy = 0.7;
      adjustments.hope = 0.7;
      adjustments.curiosity = 0.4;
      adjustments.sadness = -0.4;
      break;
      
    case 'sports':
      adjustments.curiosity = 0.5;
      // Sports can be positive or negative, keep neutral
      break;
      
    case 'political':
      adjustments.curiosity = 0.4;
      adjustments.fear = 0.2;
      adjustments.anger = 0.2;
      break;
      
    case 'economic':
      adjustments.curiosity = 0.3;
      adjustments.fear = 0.2;
      break;
      
    case 'health':
      adjustments.fear = 0.3;
      adjustments.hope = 0.2;
      adjustments.curiosity = 0.3;
      break;
      
    case 'religious':
      // Religious events vary greatly, keep mostly neutral
      adjustments.hope = 0.3;
      break;
  }
  
  // Cultural adjustments (subtle modifications based on region)
  // Arab cultures tend to express emotions more openly
  if (culturalRegion.startsWith('arab_')) {
    // Amplify emotional expression slightly
    Object.keys(adjustments).forEach(key => {
      const k = key as keyof typeof adjustments;
      adjustments[k] *= 1.1;
    });
  }
  
  // East Asian cultures may express emotions more subtly
  if (culturalRegion === 'east_asia') {
    Object.keys(adjustments).forEach(key => {
      const k = key as keyof typeof adjustments;
      adjustments[k] *= 0.9;
    });
  }
  
  // Clamp all values to -1 to 1 range
  Object.keys(adjustments).forEach(key => {
    const k = key as keyof typeof adjustments;
    adjustments[k] = Math.max(-1, Math.min(1, adjustments[k]));
  });
  
  return adjustments;
}

/**
 * Determine sensitivity level based on event type
 */
function determineSensitivity(eventType: EventType): SensitivityLevel {
  switch (eventType) {
    case 'death':
    case 'disaster':
    case 'conflict':
      return 'critical';
      
    case 'crime':
    case 'health':
    case 'political':
      return 'high';
      
    case 'economic':
    case 'social':
    case 'religious':
      return 'medium';
      
    default:
      return 'low';
  }
}

/**
 * Main context classification function
 * This is the Meta-Learning layer that understands context before emotional analysis
 */
export async function classifyContext(text: string): Promise<ContextClassification> {
  const startTime = Date.now();
  
  // Step 1: Detect language
  const detectedLanguage = detectLanguage(text);
  
  // Step 2: Detect dialect (for Arabic)
  const dialect = detectedLanguage === 'arabic' ? detectArabicDialect(text) : undefined;
  
  // Step 3: Detect cultural region
  const culturalRegion = detectCulturalRegion(text, detectedLanguage);
  
  // Step 4: Classify event type
  const { type: eventType, confidence: eventTypeConfidence, keywords } = classifyEventType(text);
  
  // Step 5: Get emotional adjustments
  const emotionalAdjustments = getEmotionalAdjustments(eventType, culturalRegion);
  
  // Step 6: Determine sensitivity
  const sensitivityLevel = determineSensitivity(eventType);
  
  const processingTimeMs = Date.now() - startTime;
  
  console.log(`[ContextClassifier] Classified: ${eventType} (${(eventTypeConfidence * 100).toFixed(1)}%) | Region: ${culturalRegion} | Language: ${detectedLanguage}${dialect ? ` (${dialect})` : ''}`);
  
  return {
    eventType,
    eventTypeConfidence,
    culturalRegion,
    detectedLanguage,
    dialect,
    sensitivityLevel,
    emotionalAdjustments,
    detectedKeywords: keywords,
    confidence: eventTypeConfidence,
    processingTimeMs
  };
}

/**
 * Apply context adjustments to emotion values
 * This modifies the raw emotions based on context understanding
 */
export function applyContextAdjustments(
  emotions: { joy: number; fear: number; anger: number; sadness: number; hope: number; curiosity: number },
  context: ContextClassification
): typeof emotions {
  const adjusted = { ...emotions };
  const adj = context.emotionalAdjustments;
  
  // Apply adjustments with a blend factor based on confidence
  const blendFactor = context.confidence;
  
  // For suppression (negative adjustment), we reduce the value
  // For enhancement (positive adjustment), we increase the value
  adjusted.joy = emotions.joy * (1 + adj.joy * blendFactor);
  adjusted.fear = emotions.fear * (1 + adj.fear * blendFactor);
  adjusted.anger = emotions.anger * (1 + adj.anger * blendFactor);
  adjusted.sadness = emotions.sadness * (1 + adj.sadness * blendFactor);
  adjusted.hope = emotions.hope * (1 + adj.hope * blendFactor);
  adjusted.curiosity = emotions.curiosity * (1 + adj.curiosity * blendFactor);
  
  // For critical events like death, apply hard limits
  if (context.eventType === 'death' && context.confidence > 0.6) {
    adjusted.joy = Math.min(adjusted.joy, 15);
    adjusted.hope = Math.min(adjusted.hope, 30);
    adjusted.sadness = Math.max(adjusted.sadness, 70);
  }
  
  if (context.eventType === 'disaster' && context.confidence > 0.6) {
    adjusted.joy = Math.min(adjusted.joy, 20);
    adjusted.fear = Math.max(adjusted.fear, 60);
    adjusted.sadness = Math.max(adjusted.sadness, 50);
  }
  
  if (context.eventType === 'celebration' && context.confidence > 0.6) {
    adjusted.joy = Math.max(adjusted.joy, 60);
    adjusted.hope = Math.max(adjusted.hope, 50);
    adjusted.sadness = Math.min(adjusted.sadness, 30);
  }
  
  // Clamp all values to 0-100 range
  Object.keys(adjusted).forEach(key => {
    const k = key as keyof typeof adjusted;
    adjusted[k] = Math.max(0, Math.min(100, adjusted[k]));
  });
  
  return adjusted;
}

export default {
  classifyContext,
  applyContextAdjustments,
  CULTURAL_KEYWORDS
};
