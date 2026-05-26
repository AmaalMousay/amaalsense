/**
 * Meta Decision Engine
 *
 * Produces a compact decision-state object from emotional indices. This is an
 * internal decision-support layer, not a user-facing trading recommendation.
 */

export interface MetaDecision {
  finalState: 'very_positive' | 'positive_cautious' | 'neutral' | 'negative_cautious' | 'very_negative';
  actionSignal: 'opportunity' | 'watch' | 'caution' | 'warning' | 'danger';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  summary: { en: string; ar: string };
  mainReasons: { en: string[]; ar: string[] };
  forecast48h: { en: string; ar: string };
  indicesExplanation: {
    gmi: { value: number; meaning: string; meaningAr: string };
    hri: { value: number; meaning: string; meaningAr: string };
    cfi: { value: number; meaning: string; meaningAr: string };
  };
}

interface AnalysisInput {
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  confidence?: number;
  dominantEmotionScore?: number;
  emotionType?: string;
  topic?: string;
  country?: string;
  domain?: string;
  sensitivity?: string;
  keywords?: string[];
  sourceCount?: number;
}

function determineFinalState(gmi: number, cfi: number, hri: number): MetaDecision['finalState'] {
  if (gmi > 45 && hri > 60 && cfi < 35) return 'very_positive';
  if (gmi > 15 && hri >= cfi) return 'positive_cautious';
  if (gmi < -45 || (cfi > 75 && hri < 35)) return 'very_negative';
  if (gmi < -15 || cfi > hri + 20) return 'negative_cautious';
  return 'neutral';
}

function determineActionSignal(gmi: number, cfi: number, hri: number): MetaDecision['actionSignal'] {
  if (cfi > 80) return 'danger';
  if (cfi > 65) return 'warning';
  if (cfi > 50 && hri < 45) return 'caution';
  if (gmi > 25 && hri > 55 && cfi < 45) return 'opportunity';
  return 'watch';
}

function determineRiskLevel(cfi: number, gmi: number): MetaDecision['riskLevel'] {
  if (cfi > 80 || gmi < -55) return 'critical';
  if (cfi > 65 || gmi < -35) return 'high';
  if (cfi > 45 || gmi < -15) return 'medium';
  return 'low';
}

function explainIndex(name: 'gmi' | 'hri' | 'cfi', value: number): string {
  if (name === 'gmi') {
    if (value > 35) return 'positive collective mood';
    if (value < -35) return 'negative collective mood';
    return 'mixed collective mood';
  }
  if (name === 'hri') {
    if (value > 65) return 'strong resilience';
    if (value < 35) return 'weak resilience';
    return 'moderate resilience';
  }
  if (value > 70) return 'high fear pressure';
  if (value > 45) return 'moderate fear pressure';
  return 'low fear pressure';
}

function generateReasons(input: AnalysisInput): string[] {
  const reasons: string[] = [];
  if (input.cfi > 60) reasons.push('collective fear pressure is elevated');
  if (input.hri > 60) reasons.push('resilience signals are present');
  if (input.gmi > 25) reasons.push('broad mood is positive');
  if (input.gmi < -25) reasons.push('broad mood is negative');
  if (input.sourceCount && input.sourceCount < 3) reasons.push('source count is limited');
  for (const keyword of input.keywords?.slice(0, 4) || []) reasons.push(`keyword signal: ${keyword}`);
  return reasons.length ? reasons : ['no dominant driver is clearly isolated'];
}

function generateForecast(signal: MetaDecision['actionSignal'], risk: MetaDecision['riskLevel']): string {
  if (risk === 'critical' || signal === 'danger') return 'Short-term conditions may remain unstable unless fear pressure falls.';
  if (signal === 'opportunity') return 'Short-term conditions may improve if resilience remains stronger than fear.';
  if (signal === 'warning' || signal === 'caution') return 'Short-term conditions require confirmation before strong conclusions.';
  return 'Short-term conditions are likely to remain mixed or range-bound.';
}

export function generateMetaDecision(input: AnalysisInput): MetaDecision {
  const finalState = determineFinalState(input.gmi, input.cfi, input.hri);
  const actionSignal = determineActionSignal(input.gmi, input.cfi, input.hri);
  const riskLevel = determineRiskLevel(input.cfi, input.gmi);
  const reasons = generateReasons(input);
  const forecast = generateForecast(actionSignal, riskLevel);
  return {
    finalState,
    actionSignal,
    riskLevel,
    confidence: input.confidence ?? 0.65,
    summary: { en: `State=${finalState}; signal=${actionSignal}; risk=${riskLevel}.`, ar: `State=${finalState}; signal=${actionSignal}; risk=${riskLevel}.` },
    mainReasons: { en: reasons, ar: reasons },
    forecast48h: { en: forecast, ar: forecast },
    indicesExplanation: {
      gmi: { value: input.gmi, meaning: explainIndex('gmi', input.gmi), meaningAr: explainIndex('gmi', input.gmi) },
      hri: { value: input.hri, meaning: explainIndex('hri', input.hri), meaningAr: explainIndex('hri', input.hri) },
      cfi: { value: input.cfi, meaning: explainIndex('cfi', input.cfi), meaningAr: explainIndex('cfi', input.cfi) },
    },
  };
}
