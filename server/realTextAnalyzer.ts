/**
 * Real Text Analysis Engine
 * Analyzes actual text content instead of returning random values
 */

export interface TextAnalysisResult {
  topics: string[];
  emotions: Record<string, number>;
  regions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  impactScore: number;
}

/**
 * Extract topics from text using keyword analysis
 */
export function analyzeTopics(text: string): string[] {
  const topics: string[] = [];
  
  // Bilingual topic keywords (Arabic + English)
  const topicPatterns: Record<string, string[]> = {
    'Economics': ['اقتصاد', 'اقتصادي', 'أسعار', 'تضخم', 'دعم', 'أجور', 'عملة', 'سعر الصرف', 'economy', 'economic', 'inflation', 'gdp', 'trade', 'market', 'finance', 'fiscal', 'monetary', 'budget'],
    'Politics': ['سياسة', 'حكومة', 'انتخابات', 'برلمان', 'وزير', 'رئيس', 'حزب', 'politics', 'political', 'government', 'election', 'parliament', 'minister', 'president', 'party', 'policy', 'vote', 'democracy'],
    'Security': ['أمن', 'أمني', 'عسكري', 'جيش', 'شرطة', 'جريمة', 'إرهاب', 'تفجير', 'security', 'military', 'army', 'police', 'crime', 'terrorism', 'war', 'conflict', 'defense'],
    'Health': ['صحة', 'طبي', 'مرض', 'وباء', 'لقاح', 'مستشفى', 'دواء', 'كورونا', 'health', 'medical', 'disease', 'pandemic', 'vaccine', 'hospital', 'medicine', 'covid', 'virus'],
    'Education': ['تعليم', 'تعليمي', 'مدرسة', 'جامعة', 'طالب', 'معلم', 'دراسة', 'education', 'school', 'university', 'student', 'teacher', 'learning', 'academic'],
    'Environment': ['بيئة', 'بيئي', 'تلوث', 'مناخ', 'طاقة', 'نفط', 'غاز', 'environment', 'climate', 'pollution', 'energy', 'oil', 'gas', 'renewable', 'carbon', 'green'],
    'Social': ['اجتماعي', 'مجتمع', 'عائلة', 'شباب', 'نساء', 'أطفال', 'حقوق', 'social', 'community', 'family', 'youth', 'women', 'children', 'rights', 'society'],
    'Technology': ['تكنولوجيا', 'رقمي', 'إنترنت', 'هاتف', 'ذكاء اصطناعي', 'برنامج', 'technology', 'digital', 'internet', 'phone', 'ai', 'artificial intelligence', 'software', 'tech'],
  };

  const lowerText = text.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(topicPatterns)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        topics.push(topic);
        break;
      }
    }
  }

  return topics.length > 0 ? topics : ['General'];
}

/**
 * Analyze emotions from text using sentiment keywords
 */
export function analyzeEmotions(text: string): Record<string, number> {
  const emotions: Record<string, number> = {
    fear: 0,
    anger: 0,
    hope: 0,
    sadness: 0,
    joy: 0,
    curiosity: 0,
  };

  const lowerText = text.toLowerCase();

  // Fear indicators
  const fearKeywords = ['خوف', 'قلق', 'مخاطر', 'تهديد', 'خطر', 'أزمة', 'كارثة', 'فشل', 'انهيار'];
  emotions.fear = calculateSentimentScore(lowerText, fearKeywords);

  // Anger indicators
  const angerKeywords = ['غضب', 'غاضب', 'غضبان', 'استياء', 'احتقار', 'سخط', 'ظلم', 'ظالم'];
  emotions.anger = calculateSentimentScore(lowerText, angerKeywords);

  // Hope indicators
  const hopeKeywords = ['أمل', 'متفائل', 'إيجابي', 'نجاح', 'تحسن', 'تطور', 'مستقبل', 'فرصة'];
  emotions.hope = calculateSentimentScore(lowerText, hopeKeywords);

  // Sadness indicators
  const sadnessKeywords = ['حزن', 'حزين', 'أسف', 'أسى', 'كآبة', 'كئيب', 'مأساة', 'فقدان'];
  emotions.sadness = calculateSentimentScore(lowerText, sadnessKeywords);

  // Joy indicators
  const joyKeywords = ['فرح', 'فرحان', 'سعادة', 'سعيد', 'بهجة', 'مرح', 'ضحك', 'انتصار'];
  emotions.joy = calculateSentimentScore(lowerText, joyKeywords);

  // Curiosity indicators
  const curiosityKeywords = ['سؤال', 'استفسار', 'فضول', 'اهتمام', 'ملاحظة', 'تساؤل', 'بحث'];
  emotions.curiosity = calculateSentimentScore(lowerText, curiosityKeywords);

  // Normalize emotions to 0-1 range
  const total = Object.values(emotions).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (const key in emotions) {
      emotions[key] = Math.min(emotions[key] / total, 1);
    }
  }

  return emotions;
}

/**
 * Extract regions from text
 */
export function analyzeRegions(text: string): string[] {
  const regions: string[] = [];
  
  const regionPatterns: Record<string, string[]> = {
    'Libya': ['ليبيا', 'طرابلس', 'بنغازي', 'سرت', 'الجفرة', 'ليبي', 'ليبيين', 'libya', 'tripoli', 'benghazi', 'libyan'],
    'Egypt': ['مصر', 'القاهرة', 'الإسكندرية', 'الجيزة', 'مصري', 'مصريين', 'egypt', 'cairo', 'egyptian'],
    'Saudi Arabia': ['السعودية', 'الرياض', 'جدة', 'الدمام', 'سعودي', 'سعوديين', 'saudi', 'saudi arabia', 'riyadh', 'jeddah'],
    'UAE': ['الإمارات', 'دبي', 'أبوظبي', 'الشارقة', 'إماراتي', 'إماراتيين', 'uae', 'dubai', 'abu dhabi', 'emirates', 'emirati'],
    'Morocco': ['المغرب', 'الرباط', 'الدار البيضاء', 'فاس', 'مغربي', 'مغاربة', 'morocco', 'moroccan', 'rabat', 'casablanca'],
    'Tunisia': ['تونس', 'تونسي', 'تونسيين', 'tunisia', 'tunisian', 'tunis'],
    'Algeria': ['الجزائر', 'جزائري', 'جزائريين', 'algeria', 'algerian', 'algiers'],
    'Middle East': ['الشرق الأوسط', 'منطقة', 'الخليج', 'عربي', 'عرب', 'middle east', 'gulf', 'arab', 'arabian'],
    'Global': ['عالمي', 'عالم', 'دولي', 'دول', 'عالميا', 'global', 'world', 'international'],
  };

  const lowerText = text.toLowerCase();
  
  for (const [region, keywords] of Object.entries(regionPatterns)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        regions.push(region);
        break;
      }
    }
  }

  return regions.length > 0 ? regions : ['Global'];
}

/**
 * Calculate severity based on keywords
 */
export function analyzeSeverity(text: string, emotions: Record<string, number>): 'low' | 'medium' | 'high' | 'critical' {
  const lowerText = text.toLowerCase();
  
  // Critical severity indicators
  const criticalKeywords = ['كارثة', 'فاجعة', 'حرب', 'إرهاب', 'انهيار', 'موت', 'قتل', 'مجزرة', 'catastrophe', 'disaster', 'war', 'terrorism', 'collapse', 'death', 'massacre', 'crisis'];
  if (criticalKeywords.some(kw => lowerText.includes(kw))) {
    return 'critical';
  }

  // High severity indicators
  const highKeywords = ['أزمة', 'مخاطر', 'خطر', 'تهديد', 'فشل', 'انقطاع', 'غلق', 'danger', 'threat', 'risk', 'failure', 'emergency', 'severe', 'critical'];
  if (highKeywords.some(kw => lowerText.includes(kw))) {
    return 'high';
  }

  // Check emotion-based severity
  const negativeEmotions = (emotions.fear || 0) + (emotions.anger || 0) + (emotions.sadness || 0);
  if (negativeEmotions > 0.6) {
    return 'high';
  }

  if (negativeEmotions > 0.3) {
    return 'medium';
  }

  return 'low';
}

/**
 * Calculate impact score based on text characteristics
 */
export function analyzeImpact(text: string, emotions: Record<string, number>): number {
  let impactScore = 0.5; // Base score

  // Length factor (longer text = more detailed = higher impact)
  const textLength = text.length;
  if (textLength > 500) impactScore += 0.2;
  else if (textLength > 200) impactScore += 0.1;

  // Emotion intensity factor
  const emotionIntensity = Math.max(...Object.values(emotions));
  impactScore += emotionIntensity * 0.3;

  // Urgency keywords
  const urgencyKeywords = ['فوري', 'عاجل', 'حالا', 'الآن', 'فورا', 'ضروري', 'حتمي', 'urgent', 'immediately', 'now', 'breaking', 'emergency', 'critical'];
  if (urgencyKeywords.some(kw => text.toLowerCase().includes(kw))) {
    impactScore += 0.2;
  }

  return Math.min(impactScore, 1);
}

/**
 * Calculate sentiment score for a set of keywords
 */
function calculateSentimentScore(text: string, keywords: string[]): number {
  let score = 0;
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    const matches = text.match(regex) || [];
    score += matches.length;
  }
  return Math.min(score / keywords.length, 1);
}

/**
 * Perform complete text analysis
 */
export function analyzeText(text: string): TextAnalysisResult {
  const topics = analyzeTopics(text);
  const emotions = analyzeEmotions(text);
  const regions = analyzeRegions(text);
  const severity = analyzeSeverity(text, emotions);
  const impactScore = analyzeImpact(text, emotions);

  return {
    topics,
    emotions,
    regions,
    severity,
    impactScore,
  };
}
