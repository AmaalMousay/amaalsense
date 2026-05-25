import { t } from "../_core/i18n";
/**
 * Causal Explainability Layer
 * 
 *       
 * 
 *  :
 * - : " " ( )
 * - : "  :    " ( )
 */

import { invokeLLMProvider, type LLMMessage } from '../_core/llm';

export interface NewsItem {
  title: string;
  source?: string;
  date?: string;
  sentiment?: number;
}

export interface CausalAnalysis {
  primaryCauses: string[];
  economicFactors: string[];
  mediaFactors: string[];
  politicalFactors: string[];
  socialFactors: string[];
  keywordsDetected: string[];
  confidenceLevel: number;
  rawEvidence: string[];
}

//       
const KEYWORD_CATEGORIES = {
  economic: {
    ar: [t('auto.utils_causalExplainability.137.23163ab2', 'ar'), t('auto.utils_causalExplainability.136.0d11b6f1', 'ar'), t('auto.utils_causalExplainability.135.68193c20', 'ar'), t('auto.utils_causalExplainability.134.a09cec5c', 'ar'), t('auto.utils_causalExplainability.133.d7e6a53a', 'ar'), t('auto.utils_causalExplainability.132.59bfd34b', 'ar'), t('auto.utils_causalExplainability.131.d0182a0e', 'ar'), t('auto.utils_causalExplainability.130.8b8e7c7f', 'ar'), t('auto.utils_causalExplainability.129.f879f70c', 'ar'), t('auto.utils_causalExplainability.128.efb0540f', 'ar'), 
         t('auto.utils_causalExplainability.127.6d38c2ea', 'ar'), t('auto.utils_causalExplainability.126.8cef45bf', 'ar'), t('auto.utils_causalExplainability.125.02782624', 'ar'), t('auto.utils_causalExplainability.124.1ffe089d', 'ar'), t('auto.utils_causalExplainability.123.fcf67c12', 'ar'), t('auto.utils_causalExplainability.122.18d89eed', 'ar'), t('auto.utils_causalExplainability.121.c49d925c', 'ar'), t('auto.utils_causalExplainability.120.c09eeb5c', 'ar'), t('auto.utils_causalExplainability.119.2efcd729', 'ar'),
         t('auto.utils_causalExplainability.118.30df0f23', 'ar'), t('auto.utils_causalExplainability.117.18005e23', 'ar'), t('auto.utils_causalExplainability.116.cb4d62bf', 'ar'), t('auto.utils_causalExplainability.115.5e029fef', 'ar'), t('auto.utils_causalExplainability.114.fc6ea67b', 'ar'), t('auto.utils_causalExplainability.113.ab830af7', 'ar'), t('auto.utils_causalExplainability.112.1486145d', 'ar')],
    en: ['dollar', 'price', 'inflation', 'economy', 'salary', 'bank', 'oil', 'budget', 
         'unemployment', 'trade', 'investment', 'debt', 'revenue']
  },
  media: {
    ar: [t('auto.utils_causalExplainability.111.71960207', 'ar'), t('auto.utils_causalExplainability.110.c1d6b74e', 'ar'), t('auto.utils_causalExplainability.109.c721facd', 'ar'), t('auto.utils_causalExplainability.108.47f3200d', 'ar'), t('auto.utils_causalExplainability.107.a497f1c0', 'ar'), t('auto.utils_causalExplainability.106.60384d7c', 'ar'), t('auto.utils_causalExplainability.105.74d6e2cc', 'ar'), t('auto.utils_causalExplainability.104.dea86bb7', 'ar'), 
         t('auto.utils_causalExplainability.103.b056e5a3', 'ar'), t('auto.utils_causalExplainability.102.552e365a', 'ar'), t('auto.utils_causalExplainability.101.897459c3', 'ar'), t('auto.utils_causalExplainability.100.bc55f74d', 'ar')],
    en: ['news', 'media', 'statement', 'report', 'press', 'leak', 'scandal']
  },
  political: {
    ar: [t('auto.utils_causalExplainability.99.26a57968', 'ar'), t('auto.utils_causalExplainability.98.52d79bae', 'ar'), t('auto.utils_causalExplainability.97.b80d3d91', 'ar'), t('auto.utils_causalExplainability.96.d9b242e6', 'ar'), t('auto.utils_causalExplainability.95.38a8a76e', 'ar'), t('auto.utils_causalExplainability.94.393955e1', 'ar'), t('auto.utils_causalExplainability.93.854382ce', 'ar'), t('auto.utils_causalExplainability.92.5ef70e19', 'ar'),
         t('auto.utils_causalExplainability.91.2c473ed6', 'ar'), t('auto.utils_causalExplainability.90.d1ec9be1', 'ar'), t('auto.utils_causalExplainability.89.d74c1db2', 'ar'), t('auto.utils_causalExplainability.88.afa253fd', 'ar'), t('auto.utils_causalExplainability.87.48d894f8', 'ar'), t('auto.utils_causalExplainability.86.f9f76e55', 'ar'), t('auto.utils_causalExplainability.85.36b8d36d', 'ar'), t('auto.utils_causalExplainability.84.e7000b25', 'ar'),
         t('auto.utils_causalExplainability.83.7d351a8a', 'ar'), t('auto.utils_causalExplainability.82.bd62f81c', 'ar'), t('auto.utils_causalExplainability.81.9257396c', 'ar'), t('auto.utils_causalExplainability.80.bc366881', 'ar')],
    en: ['politics', 'government', 'parliament', 'election', 'crisis', 'minister', 
         'president', 'law', 'agreement', 'negotiation']
  },
  social: {
    ar: [t('auto.utils_causalExplainability.79.e915fc2f', 'ar'), t('auto.utils_causalExplainability.78.471fab78', 'ar'), t('auto.utils_causalExplainability.77.f74d10e0', 'ar'), t('auto.utils_causalExplainability.76.8b6ae092', 'ar'), t('auto.utils_causalExplainability.75.8cd81497', 'ar'), t('auto.utils_causalExplainability.74.27dac0af', 'ar'), t('auto.utils_causalExplainability.73.165e4c10', 'ar'), t('auto.utils_causalExplainability.72.dc0448c7', 'ar'),
         t('auto.utils_causalExplainability.71.8f86e36a', 'ar'), t('auto.utils_causalExplainability.70.72c707a2', 'ar'), t('auto.utils_causalExplainability.69.a0eee03f', 'ar'), t('auto.utils_causalExplainability.68.b5ae7ef3', 'ar'), t('auto.utils_causalExplainability.67.9ea63237', 'ar'), t('auto.utils_causalExplainability.66.51673b06', 'ar'), t('auto.utils_causalExplainability.65.676d2f53', 'ar')],
    en: ['society', 'protest', 'strike', 'citizen', 'services', 'electricity', 
         'water', 'health', 'education', 'security', 'crime']
  },
  security: {
    ar: [t('auto.utils_causalExplainability.64.b5ae7ef3', 'ar'), t('auto.utils_causalExplainability.63.6f820943', 'ar'), t('auto.utils_causalExplainability.62.dfc15884', 'ar'), t('auto.utils_causalExplainability.61.3306d777', 'ar'), t('auto.utils_causalExplainability.60.dade933b', 'ar'), t('auto.utils_causalExplainability.59.ff0e47e8', 'ar'), t('auto.utils_causalExplainability.58.80f25957', 'ar'), t('auto.utils_causalExplainability.57.ec8f5965', 'ar'),
         t('auto.utils_causalExplainability.56.b0366353', 'ar'), t('auto.utils_causalExplainability.55.c2221c4e', 'ar'), t('auto.utils_causalExplainability.54.c8e9ec22', 'ar'), t('auto.utils_causalExplainability.53.7bb5e75a', 'ar'), t('auto.utils_causalExplainability.52.b2155e1c', 'ar')],
    en: ['security', 'military', 'army', 'militia', 'weapon', 'clash', 'terrorism',
         'bombing', 'war', 'casualties']
  }
};

//    
const CAUSE_TEMPLATES = {
  economic: {
    high_fear: [
      t('auto.utils_causalExplainability.51.5e398b69', 'ar'),
      t('auto.utils_causalExplainability.50.8a956603', 'ar'),
      t('auto.utils_causalExplainability.49.f842c1e8', 'ar'),
      t('auto.utils_causalExplainability.48.b304319f', 'ar'),
      t('auto.utils_causalExplainability.47.10c7f11a', 'ar'),
      t('auto.utils_causalExplainability.46.b95f264a', 'ar')
    ],
    moderate_fear: [
      t('auto.utils_causalExplainability.45.5802d2d1', 'ar'),
      t('auto.utils_causalExplainability.44.cd8e92fe', 'ar'),
      t('auto.utils_causalExplainability.43.672c3b7c', 'ar')
    ],
    positive: [
      t('auto.utils_causalExplainability.42.9e86a7d2', 'ar'),
      t('auto.utils_causalExplainability.41.438bf648', 'ar'),
      t('auto.utils_causalExplainability.40.1b0b1fea', 'ar')
    ]
  },
  media: {
    negative: [
      t('auto.utils_causalExplainability.39.d3f0df02', 'ar'),
      t('auto.utils_causalExplainability.38.22149ba8', 'ar'),
      t('auto.utils_causalExplainability.37.84a5cc43', 'ar'),
      t('auto.utils_causalExplainability.36.103ea653', 'ar'),
      t('auto.utils_causalExplainability.35.82b3252d', 'ar')
    ],
    neutral: [
      t('auto.utils_causalExplainability.34.be3322ef', 'ar'),
      t('auto.utils_causalExplainability.33.d00a63f2', 'ar')
    ],
    positive: [
      t('auto.utils_causalExplainability.32.c7178197', 'ar'),
      t('auto.utils_causalExplainability.31.349fdb6e', 'ar')
    ]
  },
  political: {
    negative: [
      t('auto.utils_causalExplainability.30.eb2b14ca', 'ar'),
      t('auto.utils_causalExplainability.29.fe18a2f9', 'ar'),
      t('auto.utils_causalExplainability.28.e220dfd8', 'ar'),
      t('auto.utils_causalExplainability.27.042f3de9', 'ar'),
      t('auto.utils_causalExplainability.26.028de040', 'ar'),
      t('auto.utils_causalExplainability.25.44a97324', 'ar')
    ],
    neutral: [
      t('auto.utils_causalExplainability.24.1e0aa746', 'ar'),
      t('auto.utils_causalExplainability.23.39c530ac', 'ar')
    ],
    positive: [
      t('auto.utils_causalExplainability.22.4eba74e6', 'ar'),
      t('auto.utils_causalExplainability.21.5ecc6294', 'ar'),
      t('auto.utils_causalExplainability.20.d1bd78e8', 'ar')
    ]
  },
  social: {
    negative: [
      t('auto.utils_causalExplainability.19.25e3d317', 'ar'),
      t('auto.utils_causalExplainability.18.672feaf9', 'ar'),
      t('auto.utils_causalExplainability.17.5bdf5fcb', 'ar'),
      t('auto.utils_causalExplainability.16.11d4534a', 'ar'),
      t('auto.utils_causalExplainability.15.4ca4a1d2', 'ar')
    ],
    neutral: [
      t('auto.utils_causalExplainability.14.3fe15995', 'ar')
    ],
    positive: [
      t('auto.utils_causalExplainability.13.74f2c9ad', 'ar'),
      t('auto.utils_causalExplainability.12.128a51ee', 'ar')
    ]
  }
};

/**
 *     
 */
export function extractKeywords(text: string): { category: string; keywords: string[] }[] {
  const results: { category: string; keywords: string[] }[] = [];
  const lowerText = text.toLowerCase();
  
  for (const [category, words] of Object.entries(KEYWORD_CATEGORIES)) {
    const found: string[] = [];
    
    //    
    for (const word of words.ar) {
      if (text.includes(word)) {
        found.push(word);
      }
    }
    
    //    
    for (const word of words.en) {
      if (lowerText.includes(word)) {
        found.push(word);
      }
    }
    
    if (found.length > 0) {
      results.push({ category, keywords: Array.from(new Set(found)) });
    }
  }
  
  return results;
}

/**
 *    
 */
export function analyzeNewsForCauses(
  news: NewsItem[],
  gmi: number,
  cfi: number,
  hri: number
): CausalAnalysis {
  const analysis: CausalAnalysis = {
    primaryCauses: [],
    economicFactors: [],
    mediaFactors: [],
    politicalFactors: [],
    socialFactors: [],
    keywordsDetected: [],
    confidenceLevel: 0,
    rawEvidence: []
  };
  
  //   
  const allText = news.map(n => n.title).join(' ');
  
  //   
  const keywordResults = extractKeywords(allText);
  
  for (const result of keywordResults) {
    result.keywords.forEach(k => {
      if (!analysis.keywordsDetected.includes(k)) {
        analysis.keywordsDetected.push(k);
      }
    });
  }
  
  //   
  const fearLevel = cfi > 60 ? 'high_fear' : cfi > 40 ? 'moderate_fear' : 'positive';
  const sentimentLevel = gmi < -20 ? 'negative' : gmi > 20 ? 'positive' : 'neutral';
  
  //   
  const economicKeywords = keywordResults.find(r => r.category === 'economic');
  if (economicKeywords && economicKeywords.keywords.length > 0) {
    const templates = CAUSE_TEMPLATES.economic[fearLevel] || CAUSE_TEMPLATES.economic.moderate_fear;
    analysis.economicFactors = templates.slice(0, Math.min(3, templates.length));
    
    //   
    news.forEach(n => {
      if (economicKeywords.keywords.some(k => n.title.includes(k))) {
        analysis.rawEvidence.push(n.title);
      }
    });
  }
  
  //   
  const mediaKeywords = keywordResults.find(r => r.category === 'media');
  if (mediaKeywords || news.length > 0) {
    const templates = CAUSE_TEMPLATES.media[sentimentLevel] || CAUSE_TEMPLATES.media.neutral;
    analysis.mediaFactors = templates.slice(0, 2);
  }
  
  //   
  const politicalKeywords = keywordResults.find(r => r.category === 'political');
  if (politicalKeywords && politicalKeywords.keywords.length > 0) {
    const templates = CAUSE_TEMPLATES.political[sentimentLevel] || CAUSE_TEMPLATES.political.neutral;
    analysis.politicalFactors = templates.slice(0, 2);
  }
  
  //   
  const socialKeywords = keywordResults.find(r => r.category === 'social');
  if (socialKeywords || cfi > 50) {
    const templates = CAUSE_TEMPLATES.social[sentimentLevel] || CAUSE_TEMPLATES.social.neutral;
    analysis.socialFactors = templates.slice(0, 2);
  }
  
  //   
  if (analysis.economicFactors.length > 0) {
    analysis.primaryCauses.push(...analysis.economicFactors.slice(0, 2));
  }
  if (analysis.politicalFactors.length > 0) {
    analysis.primaryCauses.push(analysis.politicalFactors[0]);
  }
  
  //   
  const totalFactors = analysis.economicFactors.length + analysis.mediaFactors.length +
                       analysis.politicalFactors.length + analysis.socialFactors.length;
  analysis.confidenceLevel = Math.min(90, 40 + (totalFactors * 10) + (analysis.rawEvidence.length * 5));
  
  return analysis;
}

/**
 *    LLM ( )
 */
export async function extractCausesWithLLM(
  news: NewsItem[],
  topic: string,
  gmi: number,
  cfi: number
): Promise<string[]> {
  if (news.length === 0) {
    return [];
  }
  
  try {
    const newsText = news.slice(0, 10).map(n => `- ${n.title}`).join('\n');
    
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: t('auto.utils_causalExplainability.11.6aa2c212', 'ar')
      },
      {
        role: 'user',
        content: `: ${topic}
 : ${gmi > 0 ? t('auto.utils_causalExplainability.10.3c9380a2', 'ar') : gmi < 0 ? t('auto.utils_causalExplainability.9.a5ed0453', 'ar') : t('auto.utils_causalExplainability.8.7e22af2d', 'ar')}
 : ${cfi}%

:
${newsText}

  :`
      }
    ];
    
    const response = await invokeLLMProvider({
      messages,
      max_tokens: 300,
      temperature: 0.3
    });
    
    const causes = (response.content || '')
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.replace('•', '').trim())
      .filter(line => line.length > 0);
    
    return causes;
  } catch (error) {
    console.error('[CausalExplainability] LLM extraction failed:', error);
    return [];
  }
}

/**
 *   "" 
 */
export function buildWhySection(analysis: CausalAnalysis): string {
  let section = t('auto.utils_causalExplainability.7.2951f5ec', 'ar');
  section += t('auto.utils_causalExplainability.6.e3b5c8f4', 'ar');
  
  if (analysis.economicFactors.length > 0) {
    section += t('auto.utils_causalExplainability.5.ff998b25', 'ar');
    analysis.economicFactors.forEach(f => section += `• ${f}\n`);
    section += '\n';
  }
  
  if (analysis.mediaFactors.length > 0) {
    section += t('auto.utils_causalExplainability.4.6f468906', 'ar');
    analysis.mediaFactors.forEach(f => section += `• ${f}\n`);
    section += '\n';
  }
  
  if (analysis.politicalFactors.length > 0) {
    section += t('auto.utils_causalExplainability.3.473b2b68', 'ar');
    analysis.politicalFactors.forEach(f => section += `• ${f}\n`);
    section += '\n';
  }
  
  if (analysis.socialFactors.length > 0) {
    section += t('auto.utils_causalExplainability.2.f3b18135', 'ar');
    analysis.socialFactors.forEach(f => section += `• ${f}\n`);
    section += '\n';
  }
  
  //     
  if (analysis.rawEvidence.length > 0) {
    section += t('auto.utils_causalExplainability.1.71f47584', 'ar');
    analysis.rawEvidence.slice(0, 3).forEach(e => section += `> "${e}"\n`);
  }
  
  return section;
}

export default {
  extractKeywords,
  analyzeNewsForCauses,
  extractCausesWithLLM,
  buildWhySection
};
