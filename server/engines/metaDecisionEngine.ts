import { t } from "../_core/i18n";

/**
 * Meta Decision Engine -   
 *        
 */

export interface MetaDecision {
  //  
  finalState: 'very_positive' | 'positive_cautious' | 'neutral' | 'negative_cautious' | 'very_negative';
  finalStateAr: string;
  finalStateEn: string;
  
  //  
  humanSummaryAr: string;
  humanSummaryEn: string;
  
  //  
  actionSignal: 'opportunity' | 'watch' | 'caution' | 'warning' | 'danger';
  actionSignalAr: string;
  actionSignalEn: string;
  
  //  
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskLevelAr: string;
  riskLevelEn: string;
  
  //  
  confidence: number;
  confidenceGrade: string;
  
  // 
  forecast48h: string;
  forecast48hAr: string;
  
  //  
  gmiExplanationAr: string;
  gmiExplanationEn: string;
  hriExplanationAr: string;
  hriExplanationEn: string;
  cfiExplanationAr: string;
  cfiExplanationEn: string;
  
  //   ()
  mainReasonsAr: string[];
  mainReasonsEn: string[];
}

interface AnalysisInput {
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  dominantEmotionScore: number;
  topic: string;
  country: string;
  domain?: string;
  sensitivity?: string;
  keywords?: string[];
}

/**
 *      
 */
function determineFinalState(gmi: number, cfi: number, hri: number): MetaDecision['finalState'] {
  // GMI   
  if (gmi >= 50) {
    return 'very_positive';
  } else if (gmi >= 20) {
    //     
    if (cfi > 60) {
      return 'positive_cautious';
    }
    return 'positive_cautious';
  } else if (gmi >= -20) {
    return 'neutral';
  } else if (gmi >= -50) {
    return 'negative_cautious';
  } else {
    return 'very_negative';
  }
}

/**
 *   
 */
function determineActionSignal(gmi: number, cfi: number, hri: number): MetaDecision['actionSignal'] {
  if (gmi >= 40 && cfi < 40 && hri > 60) {
    return 'opportunity';
  } else if (gmi >= 20 && cfi < 60) {
    return 'watch';
  } else if (gmi >= 0 || cfi < 70) {
    return 'caution';
  } else if (cfi >= 70 || gmi < -30) {
    return 'warning';
  } else {
    return 'danger';
  }
}

/**
 *   
 */
function determineRiskLevel(cfi: number, gmi: number): MetaDecision['riskLevel'] {
  if (cfi >= 80 || gmi <= -60) {
    return 'critical';
  } else if (cfi >= 60 || gmi <= -30) {
    return 'high';
  } else if (cfi >= 40 || gmi <= 0) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 *   
 */
function generateHumanSummary(
  finalState: MetaDecision['finalState'],
  gmi: number,
  cfi: number,
  hri: number,
  topic: string,
  dominantEmotion: string
): { ar: string; en: string } {
  const emotionMapAr: Record<string, string> = {
    joy: t('auto.engines_metaDecisionEngine.44.81fd7301', 'ar'),
    hope: t('auto.engines_metaDecisionEngine.43.05554470', 'ar'),
    fear: t('auto.engines_metaDecisionEngine.42.b4cbc50d', 'ar'),
    anger: t('auto.engines_metaDecisionEngine.41.0a67288b', 'ar'),
    sadness: t('auto.engines_metaDecisionEngine.40.2c024033', 'ar'),
    curiosity: t('auto.engines_metaDecisionEngine.39.f1f8172b', 'ar'),
    calm: t('auto.engines_metaDecisionEngine.38.c020b03b', 'ar'),
    surprise: t('auto.engines_metaDecisionEngine.37.7582f889', 'ar')
  };
  
  const emotionAr = emotionMapAr[dominantEmotion] || dominantEmotion;
  
  switch (finalState) {
    case 'very_positive':
      return {
        ar: `     "${topic}".       ${emotionAr} . :  .`,
        en: `The general mood is very positive towards "${topic}". People are clearly optimistic with high ${dominantEmotion}. Expectation: continued improvement.`
      };
    case 'positive_cautious':
      return {
        ar: `     "${topic}".       (${cfi.toFixed(0)}%). :     .`,
        en: `The general mood is cautiously positive towards "${topic}". People are optimistic but with moderate concern (${cfi.toFixed(0)}%). Expectation: gradual improvement, not a sharp jump.`
      };
    case 'neutral':
      return {
        ar: `    "${topic}".     . :    .`,
        en: `The general mood is neutral towards "${topic}". People are divided between optimism and concern. Expectation: stability with monitoring developments.`
      };
    case 'negative_cautious':
      return {
        ar: `     "${topic}".    (${cfi.toFixed(0)}%)    (${hri.toFixed(0)}%). :    .`,
        en: `The general mood is cautiously negative towards "${topic}". There is clear concern (${cfi.toFixed(0)}%) with some hope (${hri.toFixed(0)}%). Expectation: caution with possibility of improvement.`
      };
    case 'very_negative':
      return {
        ar: `     "${topic}".     (${cfi.toFixed(0)}%). :     .`,
        en: `The general mood is very negative towards "${topic}". There is high fear and concern (${cfi.toFixed(0)}%). Expectation: difficult situation requiring close monitoring.`
      };
  }
}

/**
 *   
 */
function generateIndexExplanations(gmi: number, cfi: number, hri: number, keywords: string[] = []): {
  gmiAr: string; gmiEn: string;
  hriAr: string; hriEn: string;
  cfiAr: string; cfiEn: string;
} {
  // GMI
  let gmiAr: string, gmiEn: string;
  if (gmi >= 30) {
    gmiAr = t('auto.engines_metaDecisionEngine.36.529d24de', 'ar');
    gmiEn = `Positive → Dominant words indicate optimism and opportunities`;
  } else if (gmi >= 0) {
    gmiAr = t('auto.engines_metaDecisionEngine.35.2232c80d', 'ar');
    gmiEn = `Neutral-positive → Mix of optimism and caution`;
  } else if (gmi >= -30) {
    gmiAr = t('auto.engines_metaDecisionEngine.34.30015f4d', 'ar');
    gmiEn = `Neutral-negative → More concern than optimism`;
  } else {
    gmiAr = t('auto.engines_metaDecisionEngine.33.5700fc8b', 'ar');
    gmiEn = `Negative → Dominant words indicate concern and fears`;
  }
  
  // HRI
  let hriAr: string, hriEn: string;
  if (hri >= 60) {
    hriAr = t('auto.engines_metaDecisionEngine.32.84052d6d', 'ar');
    hriEn = `High → People are optimistic about the future`;
  } else if (hri >= 40) {
    hriAr = t('auto.engines_metaDecisionEngine.31.aeba38f4', 'ar');
    hriEn = `Medium → Moderate hope with some reservation`;
  } else {
    hriAr = t('auto.engines_metaDecisionEngine.30.56aa94ff', 'ar');
    hriEn = `Low → Clear pessimism about the future`;
  }
  
  // CFI
  let cfiAr: string, cfiEn: string;
  if (cfi >= 70) {
    cfiAr = t('auto.engines_metaDecisionEngine.29.b4ce8b38', 'ar');
    cfiEn = `Very high → Severe fear and concern about the situation`;
  } else if (cfi >= 50) {
    cfiAr = t('auto.engines_metaDecisionEngine.28.9d129512', 'ar');
    cfiEn = `Medium → Concern exists but not overwhelming`;
  } else if (cfi >= 30) {
    cfiAr = t('auto.engines_metaDecisionEngine.27.66e96bb0', 'ar');
    cfiEn = `Low → Limited concern and high confidence`;
  } else {
    cfiAr = t('auto.engines_metaDecisionEngine.26.448943c6', 'ar');
    cfiEn = `Very low → High confidence and almost no concern`;
  }
  
  return { gmiAr, gmiEn, hriAr, hriEn, cfiAr, cfiEn };
}

/**
 *   
 */
function generateMainReasons(
  gmi: number,
  cfi: number,
  hri: number,
  dominantEmotion: string,
  keywords: string[] = []
): { ar: string[]; en: string[] } {
  const reasonsAr: string[] = [];
  const reasonsEn: string[] = [];
  
  //  GMI
  if (gmi >= 20) {
    reasonsAr.push(`   (GMI: ${gmi.toFixed(1)}+)     `);
    reasonsEn.push(`Overall mood is positive (GMI: ${gmi.toFixed(1)}+) indicating general optimism`);
  } else if (gmi <= -20) {
    reasonsAr.push(`   (GMI: ${gmi.toFixed(1)})     `);
    reasonsEn.push(`Overall mood is negative (GMI: ${gmi.toFixed(1)}) indicating general concern`);
  } else {
    reasonsAr.push(`   (GMI: ${gmi.toFixed(1)})    `);
    reasonsEn.push(`Overall mood is neutral (GMI: ${gmi.toFixed(1)}) with divided opinions`);
  }
  
  //  CFI
  if (cfi >= 60) {
    reasonsAr.push(`   (CFI: ${cfi.toFixed(1)}%)   `);
    reasonsEn.push(`Fear level is high (CFI: ${cfi.toFixed(1)}%) requiring caution`);
  } else if (cfi <= 40) {
    reasonsAr.push(`   (CFI: ${cfi.toFixed(1)}%)    `);
    reasonsEn.push(`Fear level is low (CFI: ${cfi.toFixed(1)}%) indicating confidence`);
  }
  
  //  HRI
  if (hri >= 60) {
    reasonsAr.push(`   (HRI: ${hri.toFixed(1)}%)   `);
    reasonsEn.push(`Hope index is high (HRI: ${hri.toFixed(1)}%) supporting optimism`);
  } else if (hri <= 40) {
    reasonsAr.push(`   (HRI: ${hri.toFixed(1)}%)    `);
    reasonsEn.push(`Hope index is low (HRI: ${hri.toFixed(1)}%) indicating pessimism`);
  }
  
  //  
  const emotionMapAr: Record<string, string> = {
    joy: t('auto.engines_metaDecisionEngine.25.81fd7301', 'ar'),
    hope: t('auto.engines_metaDecisionEngine.24.05554470', 'ar'),
    fear: t('auto.engines_metaDecisionEngine.23.b4cbc50d', 'ar'),
    anger: t('auto.engines_metaDecisionEngine.22.0a67288b', 'ar'),
    sadness: t('auto.engines_metaDecisionEngine.21.2c024033', 'ar'),
    curiosity: t('auto.engines_metaDecisionEngine.20.f1f8172b', 'ar'),
    calm: t('auto.engines_metaDecisionEngine.19.c020b03b', 'ar')
  };
  const emotionAr = emotionMapAr[dominantEmotion] || dominantEmotion;
  reasonsAr.push(`   ${emotionAr}    `);
  reasonsEn.push(`Dominant emotion is ${dominantEmotion} which affects decisions`);
  
  return { ar: reasonsAr, en: reasonsEn };
}

/**
 *   -     
 */
export function generateMetaDecision(input: AnalysisInput): MetaDecision {
  const { gmi, cfi, hri, dominantEmotion, dominantEmotionScore, topic, country, keywords = [] } = input;
  
  //   
  const finalState = determineFinalState(gmi, cfi, hri);
  
  //   
  const actionSignal = determineActionSignal(gmi, cfi, hri);
  
  //   
  const riskLevel = determineRiskLevel(cfi, gmi);
  
  //  
  const confidence = Math.min(95, Math.max(50, 70 + (100 - Math.abs(gmi - 50)) / 5));
  
  //   
  const humanSummary = generateHumanSummary(finalState, gmi, cfi, hri, topic, dominantEmotion);
  
  //   
  const explanations = generateIndexExplanations(gmi, cfi, hri, keywords);
  
  //  
  const reasons = generateMainReasons(gmi, cfi, hri, dominantEmotion, keywords);
  
  //  
  const finalStateLabels: Record<MetaDecision['finalState'], { ar: string; en: string }> = {
    very_positive: { ar: t('auto.engines_metaDecisionEngine.18.88e2c083', 'ar'), en: 'Very Positive' },
    positive_cautious: { ar: t('auto.engines_metaDecisionEngine.17.fc64bf70', 'ar'), en: 'Cautiously Positive' },
    neutral: { ar: t('auto.engines_metaDecisionEngine.16.7e22af2d', 'ar'), en: 'Neutral' },
    negative_cautious: { ar: t('auto.engines_metaDecisionEngine.15.389deea0', 'ar'), en: 'Cautiously Negative' },
    very_negative: { ar: t('auto.engines_metaDecisionEngine.14.553f17f0', 'ar'), en: 'Very Negative' }
  };
  
  const actionSignalLabels: Record<MetaDecision['actionSignal'], { ar: string; en: string }> = {
    opportunity: { ar: t('auto.engines_metaDecisionEngine.13.3f289306', 'ar'), en: 'Opportunity' },
    watch: { ar: t('auto.engines_metaDecisionEngine.12.5915c398', 'ar'), en: 'Watch' },
    caution: { ar: t('auto.engines_metaDecisionEngine.11.606ebcf6', 'ar'), en: 'Caution' },
    warning: { ar: t('auto.engines_metaDecisionEngine.10.8835d57f', 'ar'), en: 'Warning' },
    danger: { ar: t('auto.engines_metaDecisionEngine.9.5349080f', 'ar'), en: 'Danger' }
  };
  
  const riskLevelLabels: Record<MetaDecision['riskLevel'], { ar: string; en: string }> = {
    low: { ar: t('auto.engines_metaDecisionEngine.8.15b8dd47', 'ar'), en: 'Low' },
    medium: { ar: t('auto.engines_metaDecisionEngine.7.91fa23bd', 'ar'), en: 'Medium' },
    high: { ar: t('auto.engines_metaDecisionEngine.6.76d89630', 'ar'), en: 'High' },
    critical: { ar: t('auto.engines_metaDecisionEngine.5.578fc664', 'ar'), en: 'Critical' }
  };
  
  //  48 
  let forecast48hAr: string, forecast48hEn: string;
  if (gmi >= 30 && hri >= 50) {
    forecast48hAr = t('auto.engines_metaDecisionEngine.4.3706b742', 'ar');
    forecast48hEn = 'Continued improvement';
  } else if (gmi >= 0) {
    forecast48hAr = t('auto.engines_metaDecisionEngine.3.8f9938b7', 'ar');
    forecast48hEn = 'Gradual improvement';
  } else if (gmi >= -30) {
    forecast48hAr = t('auto.engines_metaDecisionEngine.2.8523fa9f', 'ar');
    forecast48hEn = 'Stability with monitoring';
  } else {
    forecast48hAr = t('auto.engines_metaDecisionEngine.1.a9c12cec', 'ar');
    forecast48hEn = 'Difficult situation needs follow-up';
  }
  
  //   
  let confidenceGrade: string;
  if (confidence >= 85) confidenceGrade = 'A';
  else if (confidence >= 75) confidenceGrade = 'B+';
  else if (confidence >= 65) confidenceGrade = 'B';
  else if (confidence >= 55) confidenceGrade = 'C';
  else confidenceGrade = 'D';
  
  return {
    finalState,
    finalStateAr: finalStateLabels[finalState].ar,
    finalStateEn: finalStateLabels[finalState].en,
    humanSummaryAr: humanSummary.ar,
    humanSummaryEn: humanSummary.en,
    actionSignal,
    actionSignalAr: actionSignalLabels[actionSignal].ar,
    actionSignalEn: actionSignalLabels[actionSignal].en,
    riskLevel,
    riskLevelAr: riskLevelLabels[riskLevel].ar,
    riskLevelEn: riskLevelLabels[riskLevel].en,
    confidence,
    confidenceGrade,
    forecast48h: forecast48hEn,
    forecast48hAr,
    gmiExplanationAr: explanations.gmiAr,
    gmiExplanationEn: explanations.gmiEn,
    hriExplanationAr: explanations.hriAr,
    hriExplanationEn: explanations.hriEn,
    cfiExplanationAr: explanations.cfiAr,
    cfiExplanationEn: explanations.cfiEn,
    mainReasonsAr: reasons.ar,
    mainReasonsEn: reasons.en
  };
}
