/**
 * AmalSense Multi-Agent System (MAS)
 * 
 * This system coordinates multiple specialized AI agents that run autonomously.
 * - Observer Agent: Monitors topics continually.
 * - Analyst Agent: Uses Unified Engine to get vectors and analyzes meaning.
 * - Action Agent: Decides if actions are needed based on Analyst's findings.
 */

import { analyzeForWeather } from '../unifiedAnalysisEngine';
import { tool_sendEmergencyAlert, tool_generateDeepReport, tool_adjustMonitoringFrequency, tool_recordCaseStudy } from './agentTools';

// ============================================================
// 1. ACTION AGENT (The Decision Maker)
// ============================================================
class ActionAgent {
  async evaluateAndAct(topic: string, analysis: any): Promise<void> {
    const { cfi, gmi, dominantEmotion, trendingKeywords } = analysis;

    console.log(`[ActionAgent] Evaluating analysis for ${topic}... CFI: ${cfi}, Emotion: ${dominantEmotion}`);

    // Rule 1: High Fear/Conflict -> Emergency Alert
    if (cfi > 80 && ['fear', 'anger'].includes(dominantEmotion)) {
      await tool_sendEmergencyAlert({
        topic,
        severity: cfi > 90 ? 'critical' : 'high',
        reason: `مؤشر الخوف/الصراع (CFI) ارتفع بشكل خطير ليصل إلى ${cfi}. الكلمات الرائجة: ${trendingKeywords.slice(0,3).join('، ')}`,
        indices: { gmi, cfi, hri: analysis.hri }
      });
      // Increase monitoring frequency to every 5 minutes
      await tool_adjustMonitoringFrequency(topic, 5);
      return;
    }

    // Rule 2: Sudden drop in Global Mood
    if (gmi < -50) {
      console.log(`[ActionAgent] Global Mood is highly negative (${gmi}). Generating deep report.`);
      await tool_generateDeepReport(topic, analysis);
      
      // Auto-record as potential case study
      await tool_recordCaseStudy({
        title: `رصد انخفاض حاد في المزاج العالمي: ${topic}`,
        description: `الوكيل اكتشف انخفاضاً مفاجئاً في GMI إلى ${gmi} مع غلبة مشاعر ${dominantEmotion}.`,
        topic,
        snapshot: analysis
      });
      return;
    }

    console.log(`[ActionAgent] No critical action required for ${topic}. Situation normal.`);
  }
}

// ============================================================
// 2. ANALYST AGENT (The Brain)
// ============================================================
class AnalystAgent {
  private actionAgent = new ActionAgent();

  async analyzeTopic(topic: string, code: string): Promise<void> {
    try {
      console.log(`[AnalystAgent] Starting deep analysis for ${topic}...`);
      
      // Call the existing, unmodified Unified Engine!
      // We use analyzeForWeather because it returns the richest data format (emotions, categories, etc.)
      const analysisResult = await analyzeForWeather(code, topic);
      
      if (!analysisResult.isRealData) {
        console.log(`[AnalystAgent] No sufficient data found for ${topic}. Skipping.`);
        return;
      }

      // Pass the findings to the Action Agent to decide what to do
      await this.actionAgent.evaluateAndAct(topic, analysisResult);

    } catch (error) {
      console.error(`[AnalystAgent] Error analyzing topic ${topic}:`, error);
    }
  }
}

// ============================================================
// 3. OBSERVER AGENT (The Eyes and Ears)
// ============================================================
class ObserverAgent {
  private analystAgent = new AnalystAgent();
  private watchlist = [
    { name: 'الشرق الأوسط', code: 'ME' },
    { name: 'الاقتصاد العالمي', code: 'GLB' },
    { name: 'النفط', code: 'OIL' }
  ];

  /**
   * Called by a cron job periodically (e.g., every hour)
   */
  async runPeriodicObservation(): Promise<void> {
    console.log(`\n[ObserverAgent] 👀 Starting periodic observation cycle...`);
    console.log(`[ObserverAgent] Monitoring ${this.watchlist.length} key topics.`);

    for (const item of this.watchlist) {
      // Hands over to the Analyst Agent
      await this.analystAgent.analyzeTopic(item.name, item.code);
    }
    
    console.log(`[ObserverAgent] Cycle complete.\n`);
  }

  // Allow dynamic addition to watchlist
  addToWatchlist(name: string, code: string) {
    if (!this.watchlist.find(i => i.code === code)) {
      this.watchlist.push({ name, code });
      console.log(`[ObserverAgent] Added ${name} to active watchlist.`);
    }
  }
}

// Export a singleton instance of the Multi-Agent System orchestrator
export const multiAgentSystem = new ObserverAgent();
