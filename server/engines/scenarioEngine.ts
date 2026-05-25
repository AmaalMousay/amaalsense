import { t } from "../_core/i18n";

/**
 * Scenario Engine -    
 * 
 *  AmalSense  "  "  "  "
 * 
 * :     +   =  
 */

export interface ScenarioInput {
  //  
  currentGMI: number;
  currentCFI: number;
  currentHRI: number;
  
  //  
  event: ScenarioEvent;
  
  //  
  timeframe: '24h' | '48h' | '1week' | '1month';
  
  //  ()
  topic?: string;
  country?: string;
}

export type ScenarioEvent = 
  | 'dollar_rise'          //  
  | 'dollar_fall'          //  
  | 'positive_news'        //  
  | 'negative_news'        //  
  | 'political_crisis'     //  
  | 'economic_improvement' //  
  | 'security_threat'      //  
  | 'peace_agreement'      //  
  | 'market_crash'         //  
  | 'market_rally'         //  
  | 'oil_price_up'         //  
  | 'oil_price_down'       //  
  | 'custom';              //  

export interface ScenarioOutput {
  // 
  predictedGMI: number;
  predictedCFI: number;
  predictedHRI: number;
  
  // 
  gmiChange: number;
  cfiChange: number;
  hriChange: number;
  
  // 
  trend: 'improving' | 'declining' | 'volatile' | 'stable';
  
  // 
  confidence: number;
  
  // 
  explanation: string;
  
  // 
  recommendation: string;
  
  // 
  risks: string[];
  
  // 
  opportunities: string[];
}

//     
const EVENT_IMPACTS: Record<ScenarioEvent, {
  gmiImpact: number;
  cfiImpact: number;
  hriImpact: number;
  volatility: number;
  description: string;
}> = {
  dollar_rise: {
    gmiImpact: -15,
    cfiImpact: +20,
    hriImpact: -10,
    volatility: 0.7,
    description: t('auto.engines_scenarioEngine.76.49e04133', 'ar')
  },
  dollar_fall: {
    gmiImpact: +10,
    cfiImpact: -15,
    hriImpact: +12,
    volatility: 0.5,
    description: t('auto.engines_scenarioEngine.75.127e2f4a', 'ar')
  },
  positive_news: {
    gmiImpact: +20,
    cfiImpact: -15,
    hriImpact: +18,
    volatility: 0.4,
    description: t('auto.engines_scenarioEngine.74.87bc042d', 'ar')
  },
  negative_news: {
    gmiImpact: -25,
    cfiImpact: +25,
    hriImpact: -15,
    volatility: 0.8,
    description: t('auto.engines_scenarioEngine.73.f0c02af4', 'ar')
  },
  political_crisis: {
    gmiImpact: -30,
    cfiImpact: +35,
    hriImpact: -20,
    volatility: 0.9,
    description: t('auto.engines_scenarioEngine.72.bf17bfb8', 'ar')
  },
  economic_improvement: {
    gmiImpact: +25,
    cfiImpact: -20,
    hriImpact: +22,
    volatility: 0.3,
    description: t('auto.engines_scenarioEngine.71.7de5bba3', 'ar')
  },
  security_threat: {
    gmiImpact: -35,
    cfiImpact: +40,
    hriImpact: -25,
    volatility: 0.95,
    description: t('auto.engines_scenarioEngine.70.97a27fae', 'ar')
  },
  peace_agreement: {
    gmiImpact: +40,
    cfiImpact: -30,
    hriImpact: +35,
    volatility: 0.2,
    description: t('auto.engines_scenarioEngine.69.588d7d12', 'ar')
  },
  market_crash: {
    gmiImpact: -40,
    cfiImpact: +45,
    hriImpact: -30,
    volatility: 0.95,
    description: t('auto.engines_scenarioEngine.68.c9c1ef34', 'ar')
  },
  market_rally: {
    gmiImpact: +30,
    cfiImpact: -25,
    hriImpact: +25,
    volatility: 0.4,
    description: t('auto.engines_scenarioEngine.67.1524392b', 'ar')
  },
  oil_price_up: {
    gmiImpact: -10,
    cfiImpact: +15,
    hriImpact: -8,
    volatility: 0.5,
    description: t('auto.engines_scenarioEngine.66.22d8e57d', 'ar')
  },
  oil_price_down: {
    gmiImpact: +8,
    cfiImpact: -10,
    hriImpact: +10,
    volatility: 0.4,
    description: t('auto.engines_scenarioEngine.65.7abc2f8b', 'ar')
  },
  custom: {
    gmiImpact: 0,
    cfiImpact: 0,
    hriImpact: 0,
    volatility: 0.5,
    description: t('auto.engines_scenarioEngine.64.b0eaf3c6', 'ar')
  }
};

//   
const TIMEFRAME_MULTIPLIERS: Record<string, number> = {
  '24h': 0.5,   //      24 
  '48h': 0.75,  //    48 
  '1week': 1.0, //    
  '1month': 1.2 //     
};

/**
 *   
 */
export function simulateScenario(input: ScenarioInput): ScenarioOutput {
  const impact = EVENT_IMPACTS[input.event];
  const timeMultiplier = TIMEFRAME_MULTIPLIERS[input.timeframe] || 1.0;
  
  //      
  const gmiChange = Math.round(impact.gmiImpact * timeMultiplier);
  const cfiChange = Math.round(impact.cfiImpact * timeMultiplier);
  const hriChange = Math.round(impact.hriImpact * timeMultiplier);
  
  //     
  const predictedGMI = Math.max(-100, Math.min(100, input.currentGMI + gmiChange));
  const predictedCFI = Math.max(0, Math.min(100, input.currentCFI + cfiChange));
  const predictedHRI = Math.max(0, Math.min(100, input.currentHRI + hriChange));
  
  //  
  let trend: ScenarioOutput['trend'] = 'stable';
  if (gmiChange > 10 && hriChange > 10) trend = 'improving';
  else if (gmiChange < -10 || cfiChange > 20) trend = 'declining';
  else if (impact.volatility > 0.7) trend = 'volatile';
  
  //      
  const confidence = Math.round((1 - impact.volatility * 0.5) * 100);
  
  //  
  const explanation = generateExplanation(input, impact, {
    gmiChange, cfiChange, hriChange, predictedGMI, predictedCFI, predictedHRI
  });
  
  //  
  const recommendation = generateRecommendation(predictedGMI, predictedCFI, predictedHRI, trend);
  
  //   
  const { risks, opportunities } = identifyRisksAndOpportunities(
    predictedGMI, predictedCFI, predictedHRI, input.event
  );
  
  return {
    predictedGMI,
    predictedCFI,
    predictedHRI,
    gmiChange,
    cfiChange,
    hriChange,
    trend,
    confidence,
    explanation,
    recommendation,
    risks,
    opportunities
  };
}

/**
 *  
 */
function generateExplanation(
  input: ScenarioInput,
  impact: typeof EVENT_IMPACTS[ScenarioEvent],
  changes: { gmiChange: number; cfiChange: number; hriChange: number; predictedGMI: number; predictedCFI: number; predictedHRI: number }
): string {
  const timeframeText: Record<string, string> = {
    '24h': t('auto.engines_scenarioEngine.63.665001c0', 'ar'),
    '48h': t('auto.engines_scenarioEngine.62.bcd143a4', 'ar'),
    '1week': t('auto.engines_scenarioEngine.61.b9bfc056', 'ar'),
    '1month': t('auto.engines_scenarioEngine.60.bc2ac9d8', 'ar')
  };
  
  let explanation = `${impact.description}\n\n`;
  explanation += `**${timeframeText[input.timeframe]}:**\n`;
  
  // GMI
  if (changes.gmiChange !== 0) {
    const direction = changes.gmiChange > 0 ? t('auto.engines_scenarioEngine.59.cd1b8fb0', 'ar') : t('auto.engines_scenarioEngine.58.76038295', 'ar');
    explanation += `-   (GMI) ${direction}  ${input.currentGMI}  ${changes.predictedGMI} (${changes.gmiChange > 0 ? '+' : ''}${changes.gmiChange})\n`;
  }
  
  // CFI
  if (changes.cfiChange !== 0) {
    const direction = changes.cfiChange > 0 ? t('auto.engines_scenarioEngine.57.cd1b8fb0', 'ar') : t('auto.engines_scenarioEngine.56.76038295', 'ar');
    explanation += `-   (CFI) ${direction}  ${input.currentCFI}%  ${changes.predictedCFI}% (${changes.cfiChange > 0 ? '+' : ''}${changes.cfiChange}%)\n`;
  }
  
  // HRI
  if (changes.hriChange !== 0) {
    const direction = changes.hriChange > 0 ? t('auto.engines_scenarioEngine.55.cd1b8fb0', 'ar') : t('auto.engines_scenarioEngine.54.76038295', 'ar');
    explanation += `-   (HRI) ${direction}  ${input.currentHRI}%  ${changes.predictedHRI}% (${changes.hriChange > 0 ? '+' : ''}${changes.hriChange}%)\n`;
  }
  
  return explanation;
}

/**
 *  
 */
function generateRecommendation(
  predictedGMI: number,
  predictedCFI: number,
  predictedHRI: number,
  trend: ScenarioOutput['trend']
): string {
  if (trend === 'improving' && predictedCFI < 50) {
    return t('auto.engines_scenarioEngine.53.a92b2334', 'ar');
  }
  
  if (trend === 'declining' && predictedCFI > 70) {
    return t('auto.engines_scenarioEngine.52.a9064508', 'ar');
  }
  
  if (trend === 'volatile') {
    return t('auto.engines_scenarioEngine.51.462be557', 'ar');
  }
  
  if (predictedGMI > 30 && predictedHRI > 50) {
    return t('auto.engines_scenarioEngine.50.90f32846', 'ar');
  }
  
  if (predictedGMI < -30) {
    return t('auto.engines_scenarioEngine.49.c23b80df', 'ar');
  }
  
  return t('auto.engines_scenarioEngine.48.39a8b42e', 'ar');
}

/**
 *   
 */
function identifyRisksAndOpportunities(
  predictedGMI: number,
  predictedCFI: number,
  predictedHRI: number,
  event: ScenarioEvent
): { risks: string[]; opportunities: string[] } {
  const risks: string[] = [];
  const opportunities: string[] = [];
  
  // 
  if (predictedCFI > 70) {
    risks.push(t('auto.engines_scenarioEngine.47.e9636c9c', 'ar'));
  }
  if (predictedGMI < -40) {
    risks.push(t('auto.engines_scenarioEngine.46.50f4ea81', 'ar'));
  }
  if (predictedHRI < 30) {
    risks.push(t('auto.engines_scenarioEngine.45.6c3982cd', 'ar'));
  }
  if (event === 'political_crisis' || event === 'security_threat') {
    risks.push(t('auto.engines_scenarioEngine.44.184ccf19', 'ar'));
  }
  
  // 
  if (predictedGMI > 30 && predictedCFI < 40) {
    opportunities.push(t('auto.engines_scenarioEngine.43.229111b3', 'ar'));
  }
  if (predictedHRI > 60) {
    opportunities.push(t('auto.engines_scenarioEngine.42.891ce73b', 'ar'));
  }
  if (event === 'economic_improvement' || event === 'peace_agreement') {
    opportunities.push(t('auto.engines_scenarioEngine.41.f123f597', 'ar'));
  }
  if (predictedCFI < 30) {
    opportunities.push(t('auto.engines_scenarioEngine.40.3269cd7e', 'ar'));
  }
  
  return { risks, opportunities };
}

/**
 *     
 */
export function detectEventFromText(text: string): ScenarioEvent {
  //   toLowerCase  
  const lowerText = text.toLowerCase();
  
  //  -     
  const hasDollar = text.includes(t('auto.engines_scenarioEngine.39.23163ab2', 'ar')) || lowerText.includes('dollar');
  const hasRise = text.includes(t('auto.engines_scenarioEngine.38.a6f465eb', 'ar')) || text.includes(t('auto.engines_scenarioEngine.37.cd1b8fb0', 'ar')) || text.includes(t('auto.engines_scenarioEngine.36.294c459c', 'ar')) || 
                  text.includes(t('auto.engines_scenarioEngine.35.6d30287b', 'ar')) || lowerText.includes('rise') || lowerText.includes('up');
  const hasFall = text.includes(t('auto.engines_scenarioEngine.34.e990bd85', 'ar')) || text.includes(t('auto.engines_scenarioEngine.33.76038295', 'ar')) || text.includes(t('auto.engines_scenarioEngine.32.9bfee223', 'ar')) || 
                  lowerText.includes('fall') || lowerText.includes('down');
  
  if (hasDollar && hasRise) {
    return 'dollar_rise';
  }
  if (hasDollar && hasFall) {
    return 'dollar_fall';
  }
  
  // 
  if (lowerText.includes(t('auto.engines_scenarioEngine.31.f9a20d52', 'ar')) || lowerText.includes('positive news') || lowerText.includes(t('auto.engines_scenarioEngine.30.ab4c7e3d', 'ar'))) {
    return 'positive_news';
  }
  if (lowerText.includes(t('auto.engines_scenarioEngine.29.3bbb4e94', 'ar')) || lowerText.includes('negative news') || lowerText.includes(t('auto.engines_scenarioEngine.28.b3af2cb5', 'ar'))) {
    return 'negative_news';
  }
  
  // 
  if (lowerText.includes(t('auto.engines_scenarioEngine.27.0813d5bb', 'ar')) || lowerText.includes('political crisis') || lowerText.includes(t('auto.engines_scenarioEngine.26.393955e1', 'ar'))) {
    return 'political_crisis';
  }
  if (lowerText.includes(t('auto.engines_scenarioEngine.25.fa65ac78', 'ar')) || lowerText.includes('peace') || lowerText.includes(t('auto.engines_scenarioEngine.24.48d894f8', 'ar'))) {
    return 'peace_agreement';
  }
  
  // 
  if (lowerText.includes(t('auto.engines_scenarioEngine.23.dcdf69b3', 'ar')) || lowerText.includes('threat') || lowerText.includes(t('auto.engines_scenarioEngine.22.2b1eabd6', 'ar'))) {
    return 'security_threat';
  }
  
  // 
  if (lowerText.includes(t('auto.engines_scenarioEngine.21.e5718b36', 'ar')) || lowerText.includes('economic improvement') || lowerText.includes(t('auto.engines_scenarioEngine.20.25e94d3e', 'ar'))) {
    return 'economic_improvement';
  }
  
  // 
  if (lowerText.includes(t('auto.engines_scenarioEngine.19.417cc6aa', 'ar')) || lowerText.includes('crash') || lowerText.includes(t('auto.engines_scenarioEngine.18.743100ad', 'ar'))) {
    return 'market_crash';
  }
  if (lowerText.includes(t('auto.engines_scenarioEngine.17.b82985c6', 'ar')) || lowerText.includes('rally') || lowerText.includes(t('auto.engines_scenarioEngine.16.bc62e7ae', 'ar'))) {
    return 'market_rally';
  }
  
  // 
  if ((lowerText.includes(t('auto.engines_scenarioEngine.15.02782624', 'ar')) || lowerText.includes('oil')) && 
      (lowerText.includes(t('auto.engines_scenarioEngine.14.a6f465eb', 'ar')) || lowerText.includes('up'))) {
    return 'oil_price_up';
  }
  if ((lowerText.includes(t('auto.engines_scenarioEngine.13.02782624', 'ar')) || lowerText.includes('oil')) && 
      (lowerText.includes(t('auto.engines_scenarioEngine.12.e990bd85', 'ar')) || lowerText.includes('down'))) {
    return 'oil_price_down';
  }
  
  return 'custom';
}

/**
 *     
 */
export function detectTimeframeFromText(text: string): ScenarioInput['timeframe'] {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes(t('auto.engines_scenarioEngine.11.bef1af51', 'ar')) || lowerText.includes(t('auto.engines_scenarioEngine.10.d5da7943', 'ar')) || lowerText.includes('tomorrow') || lowerText.includes('24h')) {
    return '24h';
  }
  if (lowerText.includes(t('auto.engines_scenarioEngine.9.b91bbb18', 'ar')) || lowerText.includes(t('auto.engines_scenarioEngine.8.f0e89286', 'ar')) || lowerText.includes('48h')) {
    return '48h';
  }
  if (lowerText.includes(t('auto.engines_scenarioEngine.7.b9028253', 'ar')) || lowerText.includes('week') || lowerText.includes(t('auto.engines_scenarioEngine.6.8de32d1d', 'ar'))) {
    return '1week';
  }
  if (lowerText.includes(t('auto.engines_scenarioEngine.5.492a5598', 'ar')) || lowerText.includes('month')) {
    return '1month';
  }
  
  return '1week'; // 
}

/**
 *     AI
 */
export function generateScenarioResponse(
  question: string,
  currentIndicators: { gmi: number; cfi: number; hri: number },
  topic?: string
): string {
  const event = detectEventFromText(question);
  const timeframe = detectTimeframeFromText(question);
  
  const scenario = simulateScenario({
    currentGMI: currentIndicators.gmi,
    currentCFI: currentIndicators.cfi,
    currentHRI: currentIndicators.hri,
    event,
    timeframe,
    topic
  });
  
  //  
  let response = t('auto.engines_scenarioEngine.4.05f0cf4b', 'ar');
  response += scenario.explanation + '\n';
  
  response += `\n**:**\n${scenario.recommendation}\n`;
  
  if (scenario.risks.length > 0) {
    response += t('auto.engines_scenarioEngine.3.9509172a', 'ar');
    scenario.risks.forEach(risk => {
      response += `- ${risk}\n`;
    });
  }
  
  if (scenario.opportunities.length > 0) {
    response += t('auto.engines_scenarioEngine.2.2f70c2ba', 'ar');
    scenario.opportunities.forEach(opp => {
      response += `- ${opp}\n`;
    });
  }
  
  response += `\n**    :** ${scenario.confidence}%`;
  response += t('auto.engines_scenarioEngine.1.93d26351', 'ar');
  
  return response;
}

export default {
  simulateScenario,
  detectEventFromText,
  detectTimeframeFromText,
  generateScenarioResponse
};
