/**
 * Agent Router
 * 
 * Exposes the Multi-Agent System to the frontend.
 */

import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { multiAgentSystem } from '../agents/multiAgentSystem';
import { triggerAutonomousResearch, researcherState, toggleContinuousReading } from '../knowledge/autonomousResearcher';
import { getStats } from '../knowledge/vectorStore';

// We store some in-memory logs for the dashboard since we just built the agents
const agentLogs: Array<{ id: string, timestamp: number, message: string, agent: string }> = [];

// Override console.log for the agents to capture logs
const originalLog = console.log;
console.log = function(...args) {
  const msg = args.join(' ');
  if (msg.includes('[ObserverAgent]') || msg.includes('[AnalystAgent]') || msg.includes('[ActionAgent]')) {
    const agent = msg.includes('[ObserverAgent]') ? 'Observer' : 
                  msg.includes('[AnalystAgent]') ? 'Analyst' : 'Action';
    
    agentLogs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message: msg,
      agent
    });
    // Keep only last 100 logs
    if (agentLogs.length > 100) agentLogs.length = 100;
  }
  originalLog.apply(console, args);
};

export const agentRouter = router({
  /**
   * Get overall agent system status
   */
  getStatus: publicProcedure.query(() => {
    // In a real scenario, this reads from multiAgentSystem instance
    // For now we use casting to access private fields for dashboard display
    const mas = multiAgentSystem as any;
    
    return {
      status: 'active',
      watchlist: mas.watchlist || [],
      lastRun: Date.now(),
      agentsActive: 3
    };
  }),

  /**
   * Add a topic to the observer's watchlist
   */
  addToWatchlist: publicProcedure
    .input(z.object({
      name: z.string(),
      code: z.string(),
      domain: z.string().default('general')
    }))
    .mutation(({ input }) => {
      multiAgentSystem.addToWatchlist(input.name, input.code, input.domain);
      return { success: true };
    }),

  /**
   * Get recent agent actions/logs
   */
  getLogs: publicProcedure.query(() => {
    return agentLogs;
  }),

  /**
   * Manually trigger an observation cycle
   */
  triggerObservation: publicProcedure.mutation(async () => {
    // Start in background
    multiAgentSystem.runPeriodicObservation().catch(console.error);
    return { success: true, message: 'Observation cycle started' };
  }),

  /**
   * Autonomous Knowledge Researcher
   */
  getResearchStatus: publicProcedure.query(() => {
    try {
      const stats = getStats();
      researcherState.articlesRead = stats.uniqueArticlesRead;
    } catch (e) {
      // ignore
    }
    return researcherState;
  }),

  triggerResearch: publicProcedure.mutation(async () => {
    // Run async in background so we don't block the request
    triggerAutonomousResearch().catch(console.error);
    return { success: true, message: 'Autonomous Researcher Awakened' };
  }),

  toggleContinuousResearch: publicProcedure
    .input(z.object({ enable: z.boolean() }))
    .mutation(({ input }) => {
      const isEnabled = toggleContinuousReading(input.enable);
      return { success: true, isEnabled };
    })
});
